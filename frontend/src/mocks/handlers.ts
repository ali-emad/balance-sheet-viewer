import { http, HttpResponse } from "msw";
import { BalanceSheetResponse } from "../types/balanceSheet";

const mockBalanceSheet: BalanceSheetResponse = {
  Reports: [
    {
      ReportID: "BalanceSheet",
      ReportName: "Balance Sheet",
      ReportType: "BalanceSheet",
      ReportTitles: ["Balance Sheet"],
      ReportDate: "2024-03-20",
      UpdatedDateUTC: "2024-03-20T00:00:00",
      Rows: [
        {
          RowType: "Header",
          Title: "Header",
          Cells: [
            { Value: "Balance Sheet" },
            { Value: "As at 20 March 2024" },
            { Value: "As at 20 March 2023" },
            { Value: "Change" },
            { Value: "%" },
          ],
          Rows: null,
        },
        {
          RowType: "Section",
          Title: "Assets",
          Cells: [
            { Value: "Assets" },
            { Value: "100000" },
            { Value: "90000" },
            { Value: "10000" },
            { Value: "11.11" },
          ],
          Rows: [
            {
              RowType: "Row",
              Title: "Current Assets",
              Cells: [
                { Value: "Current Assets" },
                { Value: "60000" },
                { Value: "55000" },
                { Value: "5000" },
                { Value: "9.09" },
              ],
              Rows: null,
            },
            {
              RowType: "Row",
              Title: "Fixed Assets",
              Cells: [
                { Value: "Fixed Assets" },
                { Value: "40000" },
                { Value: "35000" },
                { Value: "5000" },
                { Value: "14.29" },
              ],
              Rows: null,
            },
          ],
        },
        {
          RowType: "Section",
          Title: "Liabilities",
          Cells: [
            { Value: "Liabilities" },
            { Value: "80000" },
            { Value: "75000" },
            { Value: "5000" },
            { Value: "6.67" },
          ],
          Rows: [
            {
              RowType: "Row",
              Title: "Current Liabilities",
              Cells: [
                { Value: "Current Liabilities" },
                { Value: "50000" },
                { Value: "48000" },
                { Value: "2000" },
                { Value: "4.17" },
              ],
              Rows: null,
            },
            {
              RowType: "Row",
              Title: "Long-term Liabilities",
              Cells: [
                { Value: "Long-term Liabilities" },
                { Value: "30000" },
                { Value: "27000" },
                { Value: "3000" },
                { Value: "11.11" },
              ],
              Rows: null,
            },
          ],
        },
        {
          RowType: "SummaryRow",
          Title: "Net Assets",
          Cells: [
            { Value: "Net Assets" },
            { Value: "20000" },
            { Value: "15000" },
            { Value: "5000" },
            { Value: "33.33" },
          ],
          Rows: null,
        },
      ],
    },
  ],
  TotalRows: 1,
  CurrentPage: 1,
  PageSize: 10,
  TotalPages: 1,
};

export const handlers = [
  http.get("/api/v1/balance-sheet", () => {
    return HttpResponse.json(mockBalanceSheet);
  }),
];
