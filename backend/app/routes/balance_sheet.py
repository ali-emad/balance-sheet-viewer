from fastapi import APIRouter, HTTPException, Query
from ..services.xero_service import XeroService
from ..models.balance_sheet import BalanceSheetResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
xero_service = XeroService()

@router.get("/", response_model=BalanceSheetResponse)
async def get_balance_sheet(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of rows per page")
):
    try:
        logger.info(f"Received request for balance sheet - Page: {page}, Page Size: {page_size}")
        result = await xero_service.get_balance_sheet(page, page_size)
        logger.info("Successfully retrieved balance sheet")
        return result
    except Exception as e:
        logger.error(f"Error in balance sheet route: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": str(e),
                "type": type(e).__name__
            }
        ) 