import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BalanceSheet } from "../BalanceSheet";

describe("BalanceSheet Component", () => {
  it("renders loading state initially", () => {
    render(<BalanceSheet />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders balance sheet data after loading", async () => {
    render(<BalanceSheet />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if the title is rendered
    expect(screen.getByText("Balance Sheet")).toBeInTheDocument();

    // Check if the table headers are rendered
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Change")).toBeInTheDocument();

    // Check if the data is rendered
    expect(screen.getByText("Assets")).toBeInTheDocument();
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("Total Assets")).toBeInTheDocument();
  });

  it("handles pagination correctly", async () => {
    render(<BalanceSheet />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Check if pagination controls are rendered
    expect(screen.getByText("Rows per page")).toBeInTheDocument();
    expect(screen.getByText("Showing 1 to 1 of 1 entries")).toBeInTheDocument();
  });

  it("changes page size correctly", async () => {
    render(<BalanceSheet />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Open the rows per page dropdown
    const rowsPerPageSelect = screen.getByLabelText("Rows per page");
    await userEvent.click(rowsPerPageSelect);

    // Select a different page size
    const option = screen.getByText("25");
    await userEvent.click(option);

    // Check if the page size was updated
    expect(screen.getByText("Showing 1 to 1 of 1 entries")).toBeInTheDocument();
  });
});
