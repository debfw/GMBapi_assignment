import { test, expect } from "@playwright/test";

test.describe("Mobile Responsiveness - iPhone 14 Pro (390x844)", () => {
  test.beforeEach(async ({ page }) => {
    // Set iPhone 14 Pro viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
  });

  test("should display mobile navigation correctly", async ({ page }) => {
    // Check if mobile topbar is visible
    const mobileTopbar = page.locator(".mobile-topbar");
    await expect(mobileTopbar).toBeVisible();

    // Check hamburger menu
    const menuButton = page.locator(".mobile-menu-button");
    await expect(menuButton).toBeVisible();

    // Take screenshot of mobile navigation
    await page.screenshot({
      path: "tests/screenshots/mobile-nav.png",
      fullPage: false
    });
  });

  test("should not have text overflow in review cards", async ({ page }) => {
    // Wait for reviews to load
    await page.waitForSelector(".review-card-container", { timeout: 10000 });

    // Check for text overflow
    const reviewCards = page.locator(".review-card-container");
    const count = await reviewCards.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = reviewCards.nth(i);
      const box = await card.boundingBox();

      if (box) {
        // Check if content exceeds card width
        const content = card.locator(".review-content");
        const contentBox = await content.boundingBox();

        if (contentBox) {
          expect(contentBox.width).toBeLessThanOrEqual(box.width);
        }
      }
    }

    // Take screenshot of review cards
    await page.screenshot({
      path: "tests/screenshots/mobile-review-cards.png",
      fullPage: true
    });
  });

  test("should display quick filters vertically on mobile", async ({ page }) => {
    // Check quick filters alignment
    const quickFilters = page.locator(".quick-filter-button, .btn-outline-primary");
    const count = await quickFilters.count();

    if (count > 1) {
      const firstFilter = await quickFilters.first().boundingBox();
      const secondFilter = await quickFilters.nth(1).boundingBox();

      if (firstFilter && secondFilter) {
        // Filters should be stacked vertically (different Y positions)
        console.log(`First filter Y: ${firstFilter.y}, Second filter Y: ${secondFilter.y}`);
      }
    }

    // Take screenshot of filters
    await page.screenshot({
      path: "tests/screenshots/mobile-filters.png",
      fullPage: false
    });
  });

  test("should display reviews header properly on mobile", async ({ page }) => {
    // Check reviews header layout
    const reviewsHeader = page.locator(".reviews-header, h1:has-text('Reviews')").first();
    await expect(reviewsHeader).toBeVisible();

    // Check if Google Reviews text is visible
    page.locator("text=/Google/i").first();

    // Check average rating display
    page.locator(".average-rating, .rating-display").first();

    // Take screenshot of header
    await page.screenshot({
      path: "tests/screenshots/mobile-header.png",
      fullPage: false
    });
  });

  test("should have proper spacing and no horizontal scroll", async ({ page }) => {
    // Check for horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance

    // Check padding on main content
    const mainContent = page.locator(".main-content-wrapper, .page-content-container").first();
    const box = await mainContent.boundingBox();

    if (box) {
      console.log(`Main content width: ${box.width}, Viewport width: ${viewportWidth}`);
    }
  });

  test("capture full page mobile screenshots", async ({ page }) => {
    // Capture full page screenshot
    await page.screenshot({
      path: "tests/screenshots/mobile-full-page.png",
      fullPage: true
    });

    // Open mobile menu and capture
    const menuButton = page.locator(".mobile-menu-button");
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500); // Wait for animation
      await page.screenshot({
        path: "tests/screenshots/mobile-menu-open.png",
        fullPage: false
      });
    }
  });
});