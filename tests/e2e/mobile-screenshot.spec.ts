import { test } from "@playwright/test";

test.describe("Mobile Screenshot - iPhone 14 Pro (390x844)", () => {
  test("capture mobile layout screenshots", async ({ page }) => {
    // Set iPhone 14 Pro viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Capture full page screenshot
    await page.screenshot({
      path: "tests/screenshots/mobile-current-full.png",
      fullPage: true
    });

    // Capture just the top section with header
    await page.screenshot({
      path: "tests/screenshots/mobile-current-header.png",
      clip: { x: 0, y: 0, width: 390, height: 400 }
    });

    // Capture filters section
    await page.screenshot({
      path: "tests/screenshots/mobile-current-filters.png",
      clip: { x: 0, y: 200, width: 390, height: 600 }
    });

    console.log("Screenshots saved to tests/screenshots/");
  });
});