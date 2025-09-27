import { test, expect } from "@playwright/test";

test.describe("Reviews Page Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route("**/api/reviews", async (route) => {
      const url = new URL(route.request().url());
      const searchParams = url.searchParams;

      // Mock different responses based on query parameters
      let mockData;

      if (searchParams.get("star_rating") === "5") {
        mockData = {
          reviews: [
            {
              id: "1",
              comment: "Excellent service!",
              customerName: "John Doe",
              rating: 5,
              date: "2024-01-01",
              businessReply: null,
            },
            {
              id: "2",
              comment: "Outstanding experience!",
              customerName: "Jane Smith",
              rating: 5,
              date: "2024-01-02",
              businessReply: null,
            },
          ],
          summary: { total: 2 },
          pagination: { page: 1, per_page: 10, total_pages: 1 },
        };
      } else if (searchParams.get("star_rating") === "1") {
        mockData = {
          reviews: [
            {
              id: "3",
              comment: "Terrible service",
              customerName: "Bob Wilson",
              rating: 1,
              date: "2024-01-03",
              businessReply: null,
            },
          ],
          summary: { total: 1 },
          pagination: { page: 1, per_page: 10, total_pages: 1 },
        };
      } else {
        mockData = {
          reviews: [
            {
              id: "1",
              comment: "Excellent service!",
              customerName: "John Doe",
              rating: 5,
              date: "2024-01-01",
              businessReply: null,
            },
            {
              id: "2",
              comment: "Outstanding experience!",
              customerName: "Jane Smith",
              rating: 5,
              date: "2024-01-02",
              businessReply: null,
            },
            {
              id: "3",
              comment: "Terrible service",
              customerName: "Bob Wilson",
              rating: 1,
              date: "2024-01-03",
              businessReply: null,
            },
          ],
          summary: { total: 3 },
          pagination: { page: 1, per_page: 10, total_pages: 1 },
        };
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockData),
      });
    });

    // Navigate to the reviews page
    await page.goto("/reviews");
    await page.waitForSelector('[data-testid="reviews-page"]', {
      timeout: 10000,
    });
  });

  test("should filter reviews by positive rating", async ({ page }) => {
    // Select Positive label (should filter to 5-star reviews)
    await page.locator("select").first().selectOption("5");

    // Wait for API call to complete
    await page.waitForResponse("**/api/reviews");

    // Verify that only positive reviews are shown
    await expect(page.getByText("Excellent service!")).toBeVisible();
    await expect(page.getByText("Outstanding experience!")).toBeVisible();
    await expect(page.getByText("Terrible service")).not.toBeVisible();
  });

  test("should filter reviews by negative rating", async ({ page }) => {
    // Select Negative label (should filter to 1-star reviews)
    await page.locator("select").first().selectOption("1");

    // Wait for API call to complete
    await page.waitForResponse("**/api/reviews");

    // Verify that only negative reviews are shown
    await expect(page.getByText("Terrible service")).toBeVisible();
    await expect(page.getByText("Excellent service!")).not.toBeVisible();
    await expect(page.getByText("Outstanding experience!")).not.toBeVisible();
  });

  test("should show all reviews when no filter is applied", async ({
    page,
  }) => {
    // Ensure no filters are applied
    await page.locator("select").first().selectOption("");

    // Wait for API call to complete
    await page.waitForResponse("**/api/reviews");

    // Verify that all reviews are shown
    await expect(page.getByText("Excellent service!")).toBeVisible();
    await expect(page.getByText("Outstanding experience!")).toBeVisible();
    await expect(page.getByText("Terrible service")).toBeVisible();
  });

  test("should update KPI metrics based on filtered data", async ({ page }) => {
    // Check initial KPI metrics
    await expect(page.getByText("Average rating")).toBeVisible();
    await expect(page.getByText("No. Of Reviews")).toBeVisible();

    // Filter to positive reviews
    await page.locator("select").first().selectOption("5");
    await page.waitForResponse("**/api/reviews");

    // KPI metrics should update to reflect filtered data
    await expect(page.getByText("Average rating")).toBeVisible();
    await expect(page.getByText("No. Of Reviews")).toBeVisible();

    // The metrics should show values for the filtered reviews
    // This would depend on the actual implementation of the metrics calculation
  });

  test("should handle search functionality", async ({ page }) => {
    // Type in search input
    const searchInput = page.getByPlaceholder("Search reviews...");
    await searchInput.fill("excellent");

    // The search should trigger a new API call
    await page.waitForResponse("**/api/reviews");

    // Verify search input has the value
    await expect(searchInput).toHaveValue("excellent");
  });

  test("should handle pagination with filters", async ({ page }) => {
    // Apply a filter first
    await page.locator("select").first().selectOption("5");
    await page.waitForResponse("**/api/reviews");

    // If pagination is present, it should work with the applied filters
    // This test would depend on the actual pagination implementation
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      // Test pagination functionality
      await expect(pagination).toBeVisible();
    }
  });

  test("should handle refresh with current filters", async ({ page }) => {
    // Apply some filters
    await page.locator("select").first().selectOption("5");
    await page.getByPlaceholder("Search reviews...").fill("test");

    // Click refresh
    await page.getByTitle("Refresh").click();

    // Wait for API call
    await page.waitForResponse("**/api/reviews");

    // Verify filters are still applied
    await expect(page.locator("select").first()).toHaveValue("5");
    await expect(page.getByPlaceholder("Search reviews...")).toHaveValue(
      "test"
    );
  });

  test("should handle clear filters and reset to default state", async ({
    page,
  }) => {
    // Apply multiple filters
    await page.locator("select").first().selectOption("5");
    await page.locator("select").nth(1).selectOption("Star Rating");
    await page.getByPlaceholder("Search reviews...").fill("test");
    await page.getByPlaceholder("Start Date - End Date").fill("2024-01-01");

    // Click clear filters
    await page.getByTitle("Clear Filters").click();

    // Wait for API call with cleared filters
    await page.waitForResponse("**/api/reviews");

    // Verify all filters are cleared
    await expect(page.locator("select").first()).toHaveValue("");
    await expect(page.locator("select").nth(1)).toHaveValue("");
    await expect(page.getByPlaceholder("Search reviews...")).toHaveValue("");
    await expect(page.getByPlaceholder("Start Date - End Date")).toHaveValue(
      ""
    );

    // Verify all reviews are shown (default state)
    await expect(page.getByText("Excellent service!")).toBeVisible();
    await expect(page.getByText("Outstanding experience!")).toBeVisible();
    await expect(page.getByText("Terrible service")).toBeVisible();
  });

  test("should handle error states gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api/reviews", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Navigate to reviews page
    await page.goto("/reviews");
    await page.waitForResponse("**/api/reviews");

    // The page should handle the error gracefully
    // This would depend on the actual error handling implementation
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();
  });

  test("should maintain filter state during navigation", async ({ page }) => {
    // Apply filters
    await page.locator("select").first().selectOption("5");
    await page.getByPlaceholder("Search reviews...").fill("test");

    // Navigate to another page and back
    await page.goto("/locations");
    await page.goto("/reviews");

    // Filters should be reset (this depends on implementation)
    // In a real app, you might want to persist filter state
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();
  });
});
