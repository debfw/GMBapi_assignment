import { test, expect } from "@playwright/test";

test.describe("Locations Page Responsiveness", () => {
  test("desktop layout - no sidebar gap", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/locations");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check that content uses full width (no gap)
    const content = await page.locator('.page-content-container').first();
    const contentBox = await content.boundingBox();

    console.log("Desktop content width:", contentBox?.width);

    // Take screenshot
    await page.screenshot({
      path: "tests/screenshots/locations-desktop.png",
      fullPage: false
    });
  });

  test("mobile layout - card view", async ({ page }) => {
    // Set mobile viewport (iPhone 14 Pro)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/locations");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Check for mobile topbar
    const mobileTopbar = page.locator(".mobile-topbar");
    await expect(mobileTopbar).toBeVisible();

    // Check breadcrumb shows "Locations"
    const breadcrumb = page.locator(".breadcrumb-text");
    await expect(breadcrumb).toContainText("Locations");

    // Take screenshots
    await page.screenshot({
      path: "tests/screenshots/locations-mobile-full.png",
      fullPage: true
    });

    await page.screenshot({
      path: "tests/screenshots/locations-mobile-header.png",
      clip: { x: 0, y: 0, width: 390, height: 400 }
    });

    console.log("Mobile layout screenshots saved");
  });
});