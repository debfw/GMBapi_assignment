import { test, expect } from "@playwright/test";

test.describe("Locations Page", () => {
  test("pagination beside filters - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/locations");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "tests/screenshots/locations-pagination-desktop.png",
      fullPage: false
    });

    console.log("Locations desktop pagination screenshot saved");
  });

  test("pagination beside filters - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/locations");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "tests/screenshots/locations-pagination-mobile.png",
      fullPage: true
    });

    console.log("Locations mobile pagination screenshot saved");
  });
});