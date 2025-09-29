import { test } from "@playwright/test";

test.describe("Location Detail Page Final Check", () => {
  test("desktop view - gap fixed", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/locations/73");

    // Wait for content to load
    await page.waitForSelector('h2', { timeout: 10000 });
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: "tests/screenshots/location-detail-desktop-final.png",
      fullPage: false
    });

    console.log("Location detail desktop final screenshot saved");
  });
});