from typing import List, Optional
from pydantic import BaseModel, field_validator
from datetime import datetime
import re

class Cell(BaseModel):
    Value: str

class Row(BaseModel):
    RowType: str
    Title: Optional[str] = None
    Cells: Optional[List[Cell]] = None
    Rows: Optional[List["Row"]] = None

class Report(BaseModel):
    ReportID: str
    ReportName: str
    ReportType: str
    ReportTitles: List[str]
    ReportDate: str
    UpdatedDateUTC: str
    Rows: List[Row]

    @field_validator("ReportDate")
    def parse_report_date(cls, v):
        try:
            return datetime.strptime(v, "%d %B %Y").isoformat()
        except ValueError:
            return v

    @field_validator("UpdatedDateUTC")
    def parse_updated_date(cls, v):
        try:
            match = re.search(r"/Date\((\d+)\)/", v)
            if match:
                timestamp = int(match.group(1)) / 1000
                return datetime.fromtimestamp(timestamp).isoformat()
            return v
        except (ValueError, TypeError):
            return v

class BalanceSheetResponse(BaseModel):
    Reports: List[Report]
    TotalRows: int = 0
    CurrentPage: int = 1
    PageSize: int = 10
    TotalPages: int = 1 