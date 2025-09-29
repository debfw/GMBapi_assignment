import { test } from "@playwright/test";

test.describe("Location Detail Page - Port 3002", () => {
  test("desktop view - verify no gap", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3002/locations/73");

    // Wait for page load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: "tests/screenshots/location-detail-desktop-port3002.png",
      fullPage: false
    });

    console.log("Location detail desktop screenshot (port 3002) saved");
  });
});