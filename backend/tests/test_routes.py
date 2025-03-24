import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
from app.main import app
from app.models.balance_sheet import BalanceSheetResponse

client = TestClient(app)

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
                    }
                ]
            }
        ]
    }

def test_get_balance_sheet_success(mock_balance_sheet_response):
    with patch('app.routes.balance_sheet.xero_service.get_balance_sheet') as mock_get:
        mock_get.return_value = BalanceSheetResponse(**mock_balance_sheet_response)
        
        response = client.get("/api/balance-sheet")
        
        assert response.status_code == 200
        data = response.json()
        assert data["Reports"][0]["ReportID"] == "BalanceSheet"
        assert data["Reports"][0]["ReportName"] == "Balance Sheet"

def test_get_balance_sheet_with_pagination(mock_balance_sheet_response):
    with patch('app.routes.balance_sheet.xero_service.get_balance_sheet') as mock_get:
        mock_get.return_value = BalanceSheetResponse(**mock_balance_sheet_response)
        
        response = client.get("/api/balance-sheet?page=1&page_size=10")
        
        assert response.status_code == 200
        data = response.json()
        assert data["Reports"][0]["ReportID"] == "BalanceSheet"

def test_get_balance_sheet_invalid_page():
    response = client.get("/api/balance-sheet?page=0")
    
    assert response.status_code == 422
    assert "page must be greater than or equal to 1" in response.text

def test_get_balance_sheet_invalid_page_size():
    response = client.get("/api/balance-sheet?page_size=101")
    
    assert response.status_code == 422
    assert "page_size must be less than or equal to 100" in response.text

def test_get_balance_sheet_service_error(mock_balance_sheet_response):
    with patch('app.routes.balance_sheet.xero_service.get_balance_sheet') as mock_get:
        mock_get.side_effect = Exception("Service error")
        
        response = client.get("/api/balance-sheet")
        
        assert response.status_code == 500
        data = response.json()
        assert "detail" in data
        assert "message" in data["detail"]
        assert "type" in data["detail"]

def test_get_balance_sheet_validation_error():
    with patch('app.routes.balance_sheet.xero_service.get_balance_sheet') as mock_get:
        mock_get.return_value = {"invalid": "response"}
        
        response = client.get("/api/balance-sheet")
        
        assert response.status_code == 500
        data = response.json()
        assert "detail" in data
        assert "message" in data["detail"]
        assert "type" in data["detail"]

def test_health_check():
    response = client.get("/health")
    
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"} 