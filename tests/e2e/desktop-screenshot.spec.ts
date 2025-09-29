import { test } from "@playwright/test";

test.describe("Desktop Screenshot", () => {
  test("capture desktop layout screenshots", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/reviews");
    await page.waitForLoadState("networkidle");

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Capture full page screenshot
    await page.screenshot({
      path: "tests/screenshots/desktop-current-full.png",
      fullPage: false
    });

    // Capture just the header section
    await page.screenshot({
      path: "tests/screenshots/desktop-current-header.png",
      clip: { x: 280, y: 0, width: 1160, height: 300 }
    });

    console.log("Desktop screenshots saved to tests/screenshots/");
  });
});