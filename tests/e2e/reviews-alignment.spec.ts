import { test } from "@playwright/test";

test.describe("Reviews Page Alignment", () => {
  test("check showing text alignment - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "tests/screenshots/reviews-alignment-mobile.png",
      fullPage: true
    });

    console.log("Reviews mobile alignment screenshot saved");
  });

  test("check showing text alignment - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "tests/screenshots/reviews-alignment-desktop.png",
      fullPage: false
    });

    console.log("Reviews desktop alignment screenshot saved");
  });
});