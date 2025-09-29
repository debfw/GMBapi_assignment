import { test, expect } from "@playwright/test";

test.describe("Layout Inspection", () => {
  test("inspect mobile layout structure", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Inspect header structure
    const header = await page.locator('.reviews-header-mobile, .reviews-header').first().boundingBox();
    console.log("Header dimensions:", header);

    // Check metrics position
    const metrics = await page.locator('.mobile-header-row-3, .review-metrics-section').first().boundingBox();
    console.log("Metrics position:", metrics);

    // Check filters position
    const filters = await page.locator('.reviews-filters-container').boundingBox();
    console.log("Filters position:", filters);

    // Take screenshot with annotations
    await page.screenshot({
      path: "tests/screenshots/mobile-layout-annotated.png",
      fullPage: false,
      clip: { x: 0, y: 0, width: 390, height: 600 }
    });
  });

  test("inspect desktop sidebar gap", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Measure sidebar width
    const sidebar = await page.locator('.sidebar-container').boundingBox();
    console.log("Sidebar dimensions:", sidebar);

    // Measure main content position
    const mainContent = await page.locator('.page-content-container').boundingBox();
    console.log("Main content position:", mainContent);

    // Calculate gap
    if (sidebar && mainContent) {
      const gap = mainContent.x - (sidebar.x + sidebar.width);
      console.log("Gap between sidebar and content:", gap, "px");
    }

    // Take screenshot
    await page.screenshot({
      path: "tests/screenshots/desktop-gap-issue.png",
      fullPage: false
    });
  });
});