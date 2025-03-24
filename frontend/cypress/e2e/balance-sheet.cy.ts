describe("Balance Sheet Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays loading state initially", () => {
    cy.get('[role="progressbar"]').should("be.visible");
  });

  it("displays balance sheet data after loading", () => {
    // Wait for loading to complete
    cy.get('[role="progressbar"]').should("not.exist");

    // Check title
    cy.contains("h4", "Balance Sheet").should("be.visible");

    // Check table headers
    cy.contains("th", "Account").should("be.visible");
    cy.contains("th", "Current").should("be.visible");
    cy.contains("th", "Previous").should("be.visible");
    cy.contains("th", "Change").should("be.visible");

    // Check data
    cy.contains("td", "Assets").should("be.visible");
    cy.contains("td", "Cash").should("be.visible");
    cy.contains("td", "Total Assets").should("be.visible");
  });

  it("handles pagination correctly", () => {
    // Wait for loading to complete
    cy.get('[role="progressbar"]').should("not.exist");

    // Check pagination controls
    cy.contains("Rows per page").should("be.visible");
    cy.contains("Showing 1 to 1 of 1 entries").should("be.visible");

    // Change page size
    cy.get("select").select("25");
    cy.contains("Showing 1 to 1 of 1 entries").should("be.visible");
  });

  it("displays correct styling for different row types", () => {
    // Wait for loading to complete
    cy.get('[role="progressbar"]').should("not.exist");

    // Check section row styling
    cy.contains("td", "Assets")
      .parent("tr")
      .should("have.css", "background-color", "rgb(245, 245, 245)");

    // Check summary row styling
    cy.contains("td", "Total Assets")
      .parent("tr")
      .should("have.css", "font-weight", "600");
  });
});
