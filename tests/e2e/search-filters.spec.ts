import { test, expect } from "@playwright/test";

test.describe("Reviews Page Search and Filters", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the reviews page
    await page.goto("/reviews");

    // Wait for the page to load
    await page.waitForSelector('[data-testid="reviews-page"]', {
      timeout: 10000,
    });
  });

  test("should display all search and filter controls", async ({ page }) => {
    // Check that all filter controls are visible
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();
    await expect(page.locator("select").first()).toBeVisible();
    await expect(page.locator("select").nth(1)).toBeVisible();
    await expect(page.getByPlaceholder("Start Date - End Date")).toBeVisible();

    // Check action buttons
    await expect(
      page.getByRole("button", { name: "Bulk Reply" })
    ).toBeVisible();
    await expect(page.getByTitle("Clear Filters")).toBeVisible();
    await expect(page.getByTitle("Export Reviews")).toBeVisible();
    await expect(page.getByTitle("Refresh")).toBeVisible();
  });

  test("should update search input when typing", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search reviews...");

    await searchInput.fill("great service");
    await expect(searchInput).toHaveValue("great service");

    await searchInput.fill("excellent");
    await expect(searchInput).toHaveValue("excellent");
  });

  test("should update label filter dropdown", async ({ page }) => {
    const labelSelect = page.locator("select").first();

    // Test Positive selection
    await labelSelect.selectOption("Positive");
    await expect(labelSelect).toHaveValue("Positive");

    // Test Negative selection
    await labelSelect.selectOption("Negative");
    await expect(labelSelect).toHaveValue("Negative");

    // Test Neutral selection
    await labelSelect.selectOption("Neutral");
    await expect(labelSelect).toHaveValue("Neutral");

    // Test reset to default
    await labelSelect.selectOption("");
    await expect(labelSelect).toHaveValue("");
  });

  test("should update filters dropdown", async ({ page }) => {
    const filterSelect = page.locator("select").nth(1);

    // Test Star Rating selection
    await filterSelect.selectOption("Star Rating");
    await expect(filterSelect).toHaveValue("Star Rating");

    // Test Date Range selection
    await filterSelect.selectOption("Date Range");
    await expect(filterSelect).toHaveValue("Date Range");

    // Test Location selection
    await filterSelect.selectOption("Location");
    await expect(filterSelect).toHaveValue("Location");

    // Test reset to default
    await filterSelect.selectOption("");
    await expect(filterSelect).toHaveValue("");
  });

  test("should update date range input", async ({ page }) => {
    const dateInput = page.getByPlaceholder("Start Date - End Date");

    await dateInput.fill("2024-01-01 - 2024-01-31");
    await expect(dateInput).toHaveValue("2024-01-01 - 2024-01-31");

    await dateInput.fill("2024-02-01 - 2024-02-28");
    await expect(dateInput).toHaveValue("2024-02-01 - 2024-02-28");
  });

  test("should clear all filters when clear button is clicked", async ({
    page,
  }) => {
    // Set some values first
    const searchInput = page.getByPlaceholder("Search reviews...");
    const labelSelect = page.locator("select").first();
    const filterSelect = page.locator("select").nth(1);
    const dateInput = page.getByPlaceholder("Start Date - End Date");

    await searchInput.fill("test search");
    await labelSelect.selectOption("Positive");
    await filterSelect.selectOption("Star Rating");
    await dateInput.fill("2024-01-01 - 2024-01-31");

    // Verify values are set
    await expect(searchInput).toHaveValue("test search");
    await expect(labelSelect).toHaveValue("Positive");
    await expect(filterSelect).toHaveValue("Star Rating");
    await expect(dateInput).toHaveValue("2024-01-01 - 2024-01-31");

    // Click clear button
    await page.getByTitle("Clear Filters").click();

    // Verify all values are cleared
    await expect(searchInput).toHaveValue("");
    await expect(labelSelect).toHaveValue("");
    await expect(filterSelect).toHaveValue("");
    await expect(dateInput).toHaveValue("");
  });

  test("should handle bulk reply button click", async ({ page }) => {
    // Mock console.log to capture the click event
    await page.addInitScript(() => {
      window.console.log = (message) => {
        (window as any).lastConsoleMessage = message;
      };
    });

    await page.getByRole("button", { name: "Bulk Reply" }).click();

    // Check that the console message was logged
    const consoleMessage = await page.evaluate(
      () => (window as any).lastConsoleMessage
    );
    expect(consoleMessage).toBe("Bulk reply clicked");
  });

  test("should handle export button click", async ({ page }) => {
    // Mock console.log to capture the click event
    await page.addInitScript(() => {
      window.console.log = (message) => {
        (window as any).lastConsoleMessage = message;
      };
    });

    await page.getByTitle("Export Reviews").click();

    // Check that the console message was logged
    const consoleMessage = await page.evaluate(
      () => (window as any).lastConsoleMessage
    );
    expect(consoleMessage).toBe("Export clicked");
  });

  test("should handle refresh button click", async ({ page }) => {
    // The refresh button should be clickable
    await expect(page.getByTitle("Refresh")).toBeEnabled();
    await page.getByTitle("Refresh").click();

    // The page should still be functional after refresh
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();
  });

  test("should display KPI metrics", async ({ page }) => {
    // Check that KPI metrics are displayed
    await expect(page.getByText("Average rating")).toBeVisible();
    await expect(page.getByText("No. Of Reviews")).toBeVisible();
    await expect(page.getByText("Response time")).toBeVisible();
    await expect(page.getByText("Reply rate")).toBeVisible();
  });

  test("should display reviews list", async ({ page }) => {
    // Check that the reviews section is visible
    await expect(page.getByText("Customer Reviews")).toBeVisible();

    // The reviews list should be present (even if empty)
    await expect(page.locator('[data-testid="reviews-list"]')).toBeVisible();
  });

  test("should maintain filter state during page interactions", async ({
    page,
  }) => {
    // Set some filters
    const searchInput = page.getByPlaceholder("Search reviews...");
    const labelSelect = page.locator("select").first();

    await searchInput.fill("test");
    await labelSelect.selectOption("Positive");

    // Interact with other elements (like clicking refresh)
    await page.getByTitle("Refresh").click();

    // Verify filters are still maintained
    await expect(searchInput).toHaveValue("test");
    await expect(labelSelect).toHaveValue("Positive");
  });

  test("should handle multiple filter combinations", async ({ page }) => {
    // Test combining multiple filters
    const searchInput = page.getByPlaceholder("Search reviews...");
    const labelSelect = page.locator("select").first();
    const filterSelect = page.locator("select").nth(1);
    const dateInput = page.getByPlaceholder("Start Date - End Date");

    // Set multiple filters
    await searchInput.fill("excellent");
    await labelSelect.selectOption("Positive");
    await filterSelect.selectOption("Star Rating");
    await dateInput.fill("2024-01-01 - 2024-12-31");

    // Verify all filters are set
    await expect(searchInput).toHaveValue("excellent");
    await expect(labelSelect).toHaveValue("Positive");
    await expect(filterSelect).toHaveValue("Star Rating");
    await expect(dateInput).toHaveValue("2024-01-01 - 2024-12-31");

    // Clear and verify
    await page.getByTitle("Clear Filters").click();
    await expect(searchInput).toHaveValue("");
    await expect(labelSelect).toHaveValue("");
    await expect(filterSelect).toHaveValue("");
    await expect(dateInput).toHaveValue("");
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // All controls should still be visible and functional
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();
    await expect(page.locator("select").first()).toBeVisible();
    await expect(page.locator("select").nth(1)).toBeVisible();

    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();

    // Test on desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();
  });
});
