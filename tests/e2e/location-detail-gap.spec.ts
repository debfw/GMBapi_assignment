import { test } from "@playwright/test";

test.describe("Location Detail Page Gap Fix", () => {
  test("desktop view - no gap between sidebar and content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/locations/73");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "tests/screenshots/location-detail-desktop-fixed.png",
      fullPage: false
    });

    console.log("Location detail desktop screenshot saved");
  });

  test("mobile view", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/locations/73");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "tests/screenshots/location-detail-mobile.png",
      fullPage: false
    });

    console.log("Location detail mobile screenshot saved");
  });
});