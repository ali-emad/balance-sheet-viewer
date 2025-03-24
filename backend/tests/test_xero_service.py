import pytest
import httpx
from unittest.mock import patch, AsyncMock, Mock
from app.services.xero_service import XeroService
from app.models.balance_sheet import BalanceSheetResponse, BalanceSheetReport, BalanceSheetRow, Cell

@pytest.fixture
def xero_service():
    return XeroService()

@pytest.fixture
def mock_balance_sheet_response():
    return {
        "Reports": [
            {
                "ReportID": "BalanceSheet",
                "ReportName": "Balance Sheet",
                "ReportTitles": ["Balance Sheet"],
                "ReportDate": "2024-03-24",
                "UpdatedDateUTC": "2024-03-24T00:00:00",
                "Rows": [
                    {
                        "RowType": "Header",
                        "Title": None,
                        "Cells": [
                            {"Value": "Account"},
                            {"Value": "Current"},
                            {"Value": "Previous"},
                            {"Value": "Change"}
                        ],
                        "Rows": None
                    },
                    {
                        "RowType": "Section",
                        "Title": "Assets",
                        "Cells": [
                            {"Value": "Assets"},
                            {"Value": "$100,000"},
                            {"Value": "$90,000"},
                            {"Value": "$10,000"}
                        ],
                        "Rows": [
                            {
                                "RowType": "Row",
                                "Title": None,
                                "Cells": [
                                    {"Value": "Cash"},
                                    {"Value": "$50,000"},
                                    {"Value": "$40,000"},
                                    {"Value": "$10,000"}
                                ],
                                "Rows": None
                            }
                        ]
                    }
                ]
            }
        ]
    }

def test_singleton_pattern(xero_service):
    instance1 = XeroService()
    instance2 = XeroService()
    assert instance1 is instance2

@pytest.mark.asyncio
async def test_get_balance_sheet_success(xero_service, mock_balance_sheet_response):
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = AsyncMock()
        mock_response.json.return_value = mock_balance_sheet_response
        mock_response.raise_for_status.return_value = None
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response

        result = await xero_service.get_balance_sheet()
        assert isinstance(result, BalanceSheetResponse)
        assert result.Reports[0].ReportID == "BalanceSheet"
        assert result.Reports[0].ReportName == "Balance Sheet"
        assert len(result.Reports[0].Rows) == 2

@pytest.mark.asyncio
async def test_get_balance_sheet_http_error(xero_service):
    with patch('httpx.AsyncClient') as mock_client:
        mock_response = AsyncMock()
        mock_response.raise_for_status.side_effect = httpx.HTTPError("API Error")
        mock_client.return_value.__aenter__.return_value.get.return_value = mock_response

        with pytest.raises(Exception) as exc_info:
            await xero_service.get_balance_sheet()
        assert "Failed to fetch balance sheet" in str(exc_info.value)

@pytest.mark.asyncio
async def test_get_balance_sheet_unexpected_error(xero_service):
    with patch('httpx.AsyncClient') as mock_client:
        mock_client.return_value.__aenter__.return_value.get.side_effect = Exception("Unexpected error")

        with pytest.raises(Exception) as exc_info:
            await xero_service.get_balance_sheet()
        assert "An unexpected error occurred" in str(exc_info.value)

def test_get_balance_sheet_with_pagination(xero_service, mock_balance_sheet_response):
    with patch('httpx.get') as mock_get:
        mock_get.return_value = Mock(
            status_code=200,
            json=lambda: mock_balance_sheet_response
        )
        
        response = xero_service.get_balance_sheet(page=1, page_size=5)
        
        assert isinstance(response, BalanceSheetResponse)
        assert len(response.Reports) == 1
        assert response.Reports[0].TotalRows == 2
        assert response.Reports[0].CurrentPage == 1
        assert response.Reports[0].PageSize == 5
        assert response.Reports[0].TotalPages == 1

def test_get_balance_sheet_api_error(xero_service):
    with patch('httpx.get') as mock_get:
        mock_get.return_value = Mock(
            status_code=500,
            json=lambda: {"error": "Internal Server Error"}
        )
        
        with pytest.raises(Exception) as exc_info:
            xero_service.get_balance_sheet()
        
        assert "Failed to fetch balance sheet" in str(exc_info.value)

def test_get_balance_sheet_invalid_response(xero_service):
    with patch('httpx.get') as mock_get:
        mock_get.return_value = Mock(
            status_code=200,
            json=lambda: {"invalid": "response"}
        )
        
        with pytest.raises(Exception) as exc_info:
            xero_service.get_balance_sheet()
        
        assert "Invalid response format" in str(exc_info.value)

def test_get_balance_sheet_connection_error(xero_service):
    with patch('httpx.get') as mock_get:
        mock_get.side_effect = Exception("Connection error")
        
        with pytest.raises(Exception) as exc_info:
            xero_service.get_balance_sheet()
        
        assert "Connection error" in str(exc_info.value)

def test_parse_balance_sheet_response(xero_service, mock_balance_sheet_response):
    response = xero_service._parse_balance_sheet_response(mock_balance_sheet_response)
    
    assert isinstance(response, BalanceSheetResponse)
    assert len(response.Reports) == 1
    report = response.Reports[0]
    
    # Test header row
    assert report.Rows[0].RowType == "Header"
    assert report.Rows[0].Title is None
    assert len(report.Rows[0].Cells) == 4
    
    # Test section row
    assert report.Rows[1].RowType == "Section"
    assert report.Rows[1].Title == "Assets"
    assert len(report.Rows[1].Cells) == 4
    assert len(report.Rows[1].Rows) == 1
    
    # Test nested row
    assert report.Rows[1].Rows[0].RowType == "Row"
    assert report.Rows[1].Rows[0].Title is None
    assert len(report.Rows[1].Rows[0].Cells) == 4 