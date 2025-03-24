import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  LinearProgress,
} from "@mui/material";
import { BalanceSheetResponse, Row, Cell } from "../types/balanceSheet";
import { getBalanceSheet, PaginationParams } from "../services/api";

export const BalanceSheet: React.FC = () => {
  const [data, setData] = useState<BalanceSheetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        const response = await getBalanceSheet(pagination);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchData();
  }, [pagination]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagination((prev: PaginationParams) => ({ ...prev, page: value }));
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPagination({
      page: 1,
      pageSize: Number(event.target.value),
    });
  };

  const isNumeric = (value: string): boolean => {
    return !isNaN(Number(value.replace(/[,$]/g, "")));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (
    !data ||
    !data.Reports[0] ||
    !data.Reports[0].Rows ||
    data.Reports[0].Rows.length === 0
  ) {
    return (
      <Box m={2}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  const report = data.Reports[0];
  const headerRow = report.Rows[0];
  const rows = report.Rows.slice(1);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
        {report.ReportTitles[0]}
      </Typography>
      {report.ReportTitles.slice(1).map((title, index) => (
        <Typography
          key={index}
          variant="subtitle1"
          gutterBottom
          color="text.secondary"
        >
          {title}
        </Typography>
      ))}

      <TableContainer
        component={Paper}
        sx={{
          mb: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative",
          minHeight: "400px",
          "& .MuiTableCell-root": {
            padding: "16px",
          },
        }}
      >
        {pageLoading && (
          <Box sx={{ width: "100%", position: "absolute", top: 0, zIndex: 1 }}>
            <LinearProgress />
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow>
              {headerRow?.Cells?.map((cell: Cell, index: number) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#1976d2",
                    color: "white",
                    borderBottom: "none",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                    textAlign: index === 0 ? "left" : "right",
                    padding: "16px",
                  }}
                >
                  {cell.Value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: Row, rowIndex: number) => (
              <React.Fragment key={rowIndex}>
                {row.RowType === "Section" ? (
                  <React.Fragment>
                    {row.Title && (
                      <TableRow>
                        <TableCell
                          colSpan={headerRow?.Cells?.length || 1}
                          sx={{
                            backgroundColor: "#f8f9fa",
                            fontWeight: 600,
                            fontSize: "1rem",
                            color: "#1976d2",
                            borderBottom: "2px solid #e0e0e0",
                            padding: "20px 16px",
                          }}
                        >
                          {row.Title}
                        </TableCell>
                      </TableRow>
                    )}
                    {!row.Title && !row.Cells && headerRow?.Cells && (
                      <TableRow>
                        <TableCell
                          colSpan={headerRow.Cells.length}
                          sx={{
                            backgroundColor: "#f8f9fa",
                            fontWeight: 600,
                            fontSize: "1rem",
                            color: "#1976d2",
                            borderBottom: "2px solid #e0e0e0",
                            padding: "20px 16px",
                          }}
                        >
                          {""}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.Rows?.map((subRow: Row, subRowIndex: number) => (
                      <TableRow
                        key={`${rowIndex}-${subRowIndex}`}
                        sx={{
                          backgroundColor:
                            subRow.RowType === "SummaryRow"
                              ? "#f5f5f5"
                              : "#ffffff",
                          "&:hover": {
                            backgroundColor:
                              subRow.RowType === "SummaryRow"
                                ? "#f5f5f5"
                                : "#fafafa",
                          },
                        }}
                      >
                        {subRow.Cells?.map((cell: Cell, cellIndex: number) => (
                          <TableCell
                            key={cellIndex}
                            sx={{
                              textAlign: cellIndex === 0 ? "left" : "right",
                              fontWeight:
                                subRow.RowType === "SummaryRow" ? 600 : 400,
                              color:
                                subRow.RowType === "SummaryRow"
                                  ? "#1976d2"
                                  : "inherit",
                              borderBottom:
                                subRow.RowType === "SummaryRow"
                                  ? "2px solid #1976d2"
                                  : "1px solid #e0e0e0",
                              fontSize:
                                subRow.RowType === "SummaryRow"
                                  ? "0.95rem"
                                  : "0.875rem",
                              paddingRight: cellIndex === 0 ? "16px" : "32px",
                              backgroundColor:
                                subRow.RowType === "SummaryRow"
                                  ? "#f8f9fa"
                                  : "inherit",
                              paddingLeft: cellIndex === 0 ? "32px" : "16px",
                            }}
                          >
                            {isNumeric(cell.Value || "")
                              ? new Intl.NumberFormat("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(Number(cell.Value))
                              : cell.Value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ) : (
                  <TableRow
                    sx={{
                      backgroundColor:
                        row.RowType === "SummaryRow" ? "#f5f5f5" : "#ffffff",
                      "&:hover": {
                        backgroundColor:
                          row.RowType === "SummaryRow" ? "#f5f5f5" : "#fafafa",
                      },
                    }}
                  >
                    {row.Cells?.map((cell: Cell, cellIndex: number) => (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          textAlign: cellIndex === 0 ? "left" : "right",
                          fontWeight: row.RowType === "SummaryRow" ? 600 : 400,
                          color:
                            row.RowType === "SummaryRow"
                              ? "#1976d2"
                              : "inherit",
                          borderBottom:
                            row.RowType === "SummaryRow"
                              ? "2px solid #1976d2"
                              : "1px solid #e0e0e0",
                          fontSize:
                            row.RowType === "SummaryRow"
                              ? "0.95rem"
                              : "0.875rem",
                          paddingRight: cellIndex === 0 ? "16px" : "32px",
                          backgroundColor:
                            row.RowType === "SummaryRow"
                              ? "#f8f9fa"
                              : "inherit",
                        }}
                      >
                        {isNumeric(cell.Value || "")
                          ? new Intl.NumberFormat("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(Number(cell.Value))
                          : cell.Value}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
                <TableRow>
                  <TableCell
                    colSpan={headerRow?.Cells?.length || 1}
                    sx={{
                      height: "8px",
                      border: "none",
                      backgroundColor: "#ffffff",
                      padding: 0,
                    }}
                  />
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "#f8f9fa",
          padding: "16px 24px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={pagination.pageSize}
            label="Rows per page"
            onChange={handlePageSizeChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, data.TotalRows)} of{" "}
            {data.TotalRows} entries
          </Typography>
          <Pagination
            count={data.TotalPages}
            page={data.CurrentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};
