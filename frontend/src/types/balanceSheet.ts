export interface Cell {
  Value: string;
}

export interface Row {
  RowType: string;
  Title: string | null;
  Cells: Cell[] | null;
  Rows: Row[] | null;
}

export interface Report {
  ReportID: string;
  ReportName: string;
  ReportType: string;
  ReportTitles: string[];
  ReportDate: string;
  UpdatedDateUTC: string;
  Rows: Row[];
}

export interface BalanceSheetResponse {
  Reports: Report[];
  TotalRows: number;
  CurrentPage: number;
  PageSize: number;
  TotalPages: number;
}
