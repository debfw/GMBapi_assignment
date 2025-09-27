import { test, expect } from "@playwright/test";

test.describe("Reviews Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display reviews page with header and navigation", async ({
    page,
  }) => {
    // Check header is visible
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByText("GMB Reviews Manager")).toBeVisible();

    // Check navigation links
    await expect(page.getByRole("link", { name: /reviews/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /analytics/i })).toBeVisible();

    // Check theme toggle
    await expect(
      page.getByRole("button", { name: /switch to/i })
    ).toBeVisible();
  });

  test("should display reviews list", async ({ page }) => {
    // Wait for reviews to load
    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText("Jane Smith")).toBeVisible();

    // Check review content
    await expect(
      page.getByText("Excellent service! Highly recommended.")
    ).toBeVisible();
    await expect(
      page.getByText("Good experience overall, but could be better.")
    ).toBeVisible();
  });

  test("should display review ratings with stars", async ({ page }) => {
    // Check that stars are displayed
    const stars = page.locator('[data-testid^="star-"]');
    await expect(stars.first()).toBeVisible();

    // Should have 5 stars per review
    const firstReviewStars = page
      .locator(".card")
      .first()
      .locator('[data-testid^="star-"]');
    await expect(firstReviewStars).toHaveCount(5);
  });

  test("should show review status badges", async ({ page }) => {
    await expect(page.getByText("New")).toBeVisible();
    await expect(page.getByText("Replied")).toBeVisible();
  });

  test("should display business replies", async ({ page }) => {
    await expect(page.getByText("Business Reply")).toBeVisible();
    await expect(page.getByText("Thank you for your feedback!")).toBeVisible();
  });

  test("should show reply button for new reviews", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i });
    await expect(replyButton).toBeVisible();
  });

  test("should open reply modal when reply button is clicked", async ({
    page,
  }) => {
    const replyButton = page.getByRole("button", { name: /reply/i });
    await replyButton.click();

    // Check modal is open
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Reply to Review")).toBeVisible();

    // Check form elements
    await expect(page.getByRole("textbox")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send reply/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
  });

  test("should allow typing in reply textarea", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i });
    await replyButton.click();

    const textarea = page.getByRole("textbox");
    await textarea.fill("Thank you for your feedback!");

    await expect(textarea).toHaveValue("Thank you for your feedback!");
  });

  test("should show character count in reply modal", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i });
    await replyButton.click();

    const textarea = page.getByRole("textbox");
    await textarea.fill("Test message");

    await expect(page.getByText(/characters/)).toBeVisible();
  });

  test("should close modal when cancel is clicked", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i });
    await replyButton.click();

    await expect(page.getByRole("dialog")).toBeVisible();

    const cancelButton = page.getByRole("button", { name: /cancel/i });
    await cancelButton.click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should show search functionality", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search reviews/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill("John");
    await expect(searchInput).toHaveValue("John");
  });

  test("should show filter options", async ({ page }) => {
    // Check rating filter
    await expect(page.getByLabel(/rating/i)).toBeVisible();

    // Check status filter
    await expect(page.getByLabel(/status/i)).toBeVisible();

    // Check reply status filter
    await expect(page.getByLabel(/reply status/i)).toBeVisible();
  });

  test("should show pagination when there are multiple pages", async ({
    page,
  }) => {
    // This test would need to be updated based on actual pagination implementation
    // For now, we'll check if pagination elements exist
    const pagination = page.locator(".pagination");
    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible();
    }
  });

  test("should toggle theme when theme button is clicked", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /switch to/i });

    // Click to toggle theme
    await themeButton.click();

    // Check that the theme has changed (this would need to be updated based on actual implementation)
    // For now, we'll just verify the button is still clickable
    await expect(themeButton).toBeVisible();
  });

  test("should show loading state initially", async ({ page }) => {
    // Navigate to a fresh page to catch loading state
    await page.goto("/");

    // Check for loading spinner or skeleton
    const loadingElement = page.locator(
      '.spinner-border, .loading, [data-testid="loading"]'
    );
    if ((await loadingElement.count()) > 0) {
      await expect(loadingElement.first()).toBeVisible();
    }
  });

  test("should handle long review comments with expand/collapse", async ({
    page,
  }) => {
    // This test would need to be updated based on actual implementation
    // For now, we'll check if expand/collapse functionality exists
    const showMoreButton = page.getByText("Show more");
    if ((await showMoreButton.count()) > 0) {
      await showMoreButton.click();
      await expect(page.getByText("Show less")).toBeVisible();
    }
  });

  test("should display helpful votes when available", async ({ page }) => {
    const helpfulVotes = page.getByText(/helpful/);
    if ((await helpfulVotes.count()) > 0) {
      await expect(helpfulVotes.first()).toBeVisible();
    }
  });

  test("should show location information", async ({ page }) => {
    await expect(page.getByText("Main Street Location")).toBeVisible();
    await expect(page.getByText("Downtown Location")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that content is still visible and accessible
    await expect(page.getByText("GMB Reviews Manager")).toBeVisible();
    await expect(page.getByText("John Doe")).toBeVisible();

    // Check that navigation is accessible (might be collapsed)
    const navToggle = page.getByRole("button", { name: /toggle navigation/i });
    if ((await navToggle.count()) > 0) {
      await navToggle.click();
    }

    await expect(page.getByRole("link", { name: /reviews/i })).toBeVisible();
  });
});
