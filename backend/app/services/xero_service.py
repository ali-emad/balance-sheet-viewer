import logging
from typing import Optional
import httpx
import os
import time
from ..models.balance_sheet import BalanceSheetResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class XeroService:
    _instance: Optional['XeroService'] = None
    _client: Optional[httpx.Client] = None
    MAX_RETRIES = 3
    RETRY_DELAY = 2  # seconds

    def __new__(cls, base_url: str = None):
        if cls._instance is None:
            cls._instance = super(XeroService, cls).__new__(cls)
            cls._instance.base_url = base_url or os.getenv("XERO_MOCK_URL", "http://xero-mock:3000")
            cls._instance._client = httpx.Client()
        return cls._instance

    def __del__(self):
        if self._client:
            self._client.close()

    async def get_balance_sheet(
        self, page: int = 1, page_size: int = 10
    ) -> BalanceSheetResponse:
        """
        Fetch balance sheet data from Xero API with pagination
        """
        retries = 0
        last_error = None

        while retries < self.MAX_RETRIES:
            try:
                logger.info(f"Fetching balance sheet data from {self.base_url} (attempt {retries + 1}/{self.MAX_RETRIES})")
                response = self._client.get(
                    f"{self.base_url}/api.xro/2.0/Reports/BalanceSheet",
                    params={"page": page, "pageSize": page_size},
                )
                response.raise_for_status()
                
                logger.info(f"Response status code: {response.status_code}")
                logger.info(f"Response headers: {response.headers}")
                logger.info(f"Response content: {response.text}")

                data = response.json()
                
                # Get all rows from the response
                all_rows = []
                for report in data["Reports"]:
                    # Keep header row
                    if report["Rows"]:
                        all_rows.append(report["Rows"][0])
                    
                    # Process section rows
                    for row in report["Rows"][1:]:
                        if row["RowType"] == "Section":
                            # Add section header
                            all_rows.append(row)
                            # Add section rows
                            if row.get("Rows"):
                                all_rows.extend(row["Rows"])
                        elif row["RowType"] == "SummaryRow":
                            # Add summary row
                            all_rows.append(row)

                # Calculate pagination
                total_rows = len(all_rows)
                total_pages = (total_rows + page_size - 1) // page_size
                start_idx = (page - 1) * page_size
                end_idx = min(start_idx + page_size, total_rows)
                
                # Get paginated rows
                paginated_rows = all_rows[start_idx:end_idx]

                # Update the response data with paginated rows
                data["Reports"][0]["Rows"] = paginated_rows
                data["TotalRows"] = total_rows
                data["CurrentPage"] = page
                data["PageSize"] = page_size
                data["TotalPages"] = total_pages

                try:
                    return BalanceSheetResponse(**data)
                except Exception as e:
                    logger.error(f"Failed to create BalanceSheetResponse: {str(e)}")
                    raise

            except httpx.HTTPError as e:
                last_error = e
                logger.error(f"HTTP error occurred: {str(e)}")
                retries += 1
                if retries < self.MAX_RETRIES:
                    logger.info(f"Retrying in {self.RETRY_DELAY} seconds...")
                    time.sleep(self.RETRY_DELAY)
                continue
            except Exception as e:
                last_error = e
                logger.error(f"An unexpected error occurred: {str(e)}")
                retries += 1
                if retries < self.MAX_RETRIES:
                    logger.info(f"Retrying in {self.RETRY_DELAY} seconds...")
                    time.sleep(self.RETRY_DELAY)
                continue

        # If we get here, all retries failed
        error_message = f"Failed to fetch balance sheet after {self.MAX_RETRIES} attempts"
        if last_error:
            error_message += f": {str(last_error)}"
        raise Exception(error_message) 