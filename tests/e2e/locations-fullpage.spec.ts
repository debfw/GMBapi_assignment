import { test, expect } from "@playwright/test";

test.describe("Locations Page Full View", () => {
  test("full page with bottom pagination - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/locations");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({
      path: "tests/screenshots/locations-fullpage-desktop.png",
      fullPage: true
    });

    console.log("Locations full page desktop screenshot saved");
  });

  test("full page with bottom pagination - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/locations");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({
      path: "tests/screenshots/locations-fullpage-mobile.png",
      fullPage: true
    });

    console.log("Locations full page mobile screenshot saved");
  });
});