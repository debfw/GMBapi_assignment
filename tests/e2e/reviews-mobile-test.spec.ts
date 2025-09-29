import { test } from "@playwright/test";

test.describe("Reviews Page Mobile Responsiveness", () => {
  test("mobile layout - iPhone 14 Pro", async ({ page }) => {
    // Set mobile viewport (iPhone 14 Pro)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Take full page screenshot
    await page.screenshot({
      path: "tests/screenshots/reviews-mobile-current.png",
      fullPage: true
    });

    // Take screenshot of review cards area
    await page.screenshot({
      path: "tests/screenshots/reviews-mobile-cards.png",
      clip: { x: 0, y: 400, width: 390, height: 600 }
    });

    console.log("Reviews mobile screenshots saved");
  });

  test("desktop layout", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: "tests/screenshots/reviews-desktop-current.png",
      fullPage: false
    });

    console.log("Reviews desktop screenshot saved");
  });
});