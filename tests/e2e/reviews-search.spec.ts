import { test } from "@playwright/test";

test.describe("Reviews Page Search Functionality", () => {
  test("search functionality - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: "tests/screenshots/reviews-search-mobile-initial.png",
      fullPage: false
    });

    // Type in search box
    await page.fill('input[placeholder="Search reviews..."]', "Pet Store");
    await page.waitForTimeout(1000);

    // Take screenshot after search
    await page.screenshot({
      path: "tests/screenshots/reviews-search-mobile-results.png",
      fullPage: true
    });

    console.log("Reviews mobile search screenshots saved");
  });

  test("search functionality - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: "tests/screenshots/reviews-search-desktop-initial.png",
      fullPage: false
    });

    // Type in search box
    await page.fill('input[placeholder="Search reviews..."]', "terrible");
    await page.waitForTimeout(1000);

    // Take screenshot after search
    await page.screenshot({
      path: "tests/screenshots/reviews-search-desktop-results.png",
      fullPage: false
    });

    console.log("Reviews desktop search screenshots saved");
  });
});