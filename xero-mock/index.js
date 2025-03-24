const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generate test rows
const generateTestRows = (count) => {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      RowType: "Row",
      Title: `Test Account ${i + 1}`,
      Cells: [
        { Value: `Test Account ${i + 1}` },
        { Value: `$${(10000 + i * 1000).toLocaleString()}` },
        { Value: `$${(9000 + i * 1000).toLocaleString()}` },
        { Value: `$${(1000 + i * 100).toLocaleString()}` },
      ],
      Rows: null,
    });
  }
  return rows;
};

// Mock balance sheet data
const mockBalanceSheet = {
  Reports: [
    {
      ReportID: "BalanceSheet",
      ReportName: "Balance Sheet",
      ReportType: "BalanceSheet",
      ReportTitles: ["Balance Sheet"],
      ReportDate: "2024-03-24",
      UpdatedDateUTC: "2024-03-24T00:00:00",
      Rows: [
        {
          RowType: "Header",
          Title: "Header",
          Cells: [
            { Value: "Account" },
            { Value: "Current" },
            { Value: "Previous" },
            { Value: "Change" },
          ],
          Rows: null,
        },
        {
          RowType: "Section",
          Title: "Assets",
          Cells: [
            { Value: "Assets" },
            { Value: "$1,000,000" },
            { Value: "$900,000" },
            { Value: "$100,000" },
          ],
          Rows: generateTestRows(20),
        },
        {
          RowType: "Section",
          Title: "Liabilities",
          Cells: [
            { Value: "Liabilities" },
            { Value: "$800,000" },
            { Value: "$750,000" },
            { Value: "$50,000" },
          ],
          Rows: generateTestRows(20),
        },
        {
          RowType: "SummaryRow",
          Title: "Net Assets",
          Cells: [
            { Value: "Net Assets" },
            { Value: "$200,000" },
            { Value: "$150,000" },
            { Value: "$50,000" },
          ],
          Rows: null,
        },
      ],
    },
  ],
};

// Routes
app.get("/api.xro/2.0/Reports/BalanceSheet", (req, res) => {
  res.json(mockBalanceSheet);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Start server
app.listen(port, () => {
  console.log(`Xero Mock API running on port ${port}`);
});
