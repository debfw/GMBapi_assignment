import { test, expect } from "@playwright/test";

test.describe("Sorting Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  });

  test("should sort reviews from newest to oldest", async ({ page }) => {
    const sortButton = page.locator('button:has-text("Sort"), select').first();

    if (await sortButton.isVisible()) {
      if ((await sortButton.evaluate((el) => el.tagName)) === "SELECT") {
        await sortButton.selectOption({ label: "Newest First" });
      } else {
        await sortButton.click();
        await page.locator('text="Newest First"').click();
      }
    }

    await page.waitForTimeout(2000);

    const reviews = page.locator(
      '[data-testid="review-card"], .space-y-4 > div'
    );
    const count = await reviews.count();

    if (count >= 2) {
      const dates: string[] = [];
      for (let i = 0; i < Math.min(count, 3); i++) {
        const dateText = await reviews
          .nth(i)
          .locator(
            "text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/"
          )
          .first()
          .textContent();
        if (dateText) {
          dates.push(dateText);
        }
      }

      for (let i = 0; i < dates.length - 1; i++) {
        const date1 = new Date(dates[i]);
        const date2 = new Date(dates[i + 1]);
        if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
          expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
        }
      }
    }
  });

  test("should sort reviews from oldest to newest", async ({ page }) => {
    const sortButton = page.locator('button:has-text("Sort"), select').first();

    if (await sortButton.isVisible()) {
      if ((await sortButton.evaluate((el) => el.tagName)) === "SELECT") {
        await sortButton.selectOption({ label: "Oldest First" });
      } else {
        await sortButton.click();
        await page.locator('text="Oldest First"').click();
      }
    }

    await page.waitForTimeout(2000);

    const reviews = page.locator(
      '[data-testid="review-card"], .space-y-4 > div'
    );
    const count = await reviews.count();

    if (count >= 2) {
      const dates: string[] = [];
      for (let i = 0; i < Math.min(count, 3); i++) {
        const dateText = await reviews
          .nth(i)
          .locator(
            "text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/"
          )
          .first()
          .textContent();
        if (dateText) {
          dates.push(dateText);
        }
      }

      for (let i = 0; i < dates.length - 1; i++) {
        const date1 = new Date(dates[i]);
        const date2 = new Date(dates[i + 1]);
        if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
          expect(date1.getTime()).toBeLessThanOrEqual(date2.getTime());
        }
      }
    }
  });

  test("should maintain sorting when applying filters", async ({ page }) => {
    const sortButton = page.locator('button:has-text("Sort"), select').first();

    if (await sortButton.isVisible()) {
      if ((await sortButton.evaluate((el) => el.tagName)) === "SELECT") {
        await sortButton.selectOption({ label: "Newest First" });
      } else {
        await sortButton.click();
        await page.locator('text="Newest First"').click();
      }
    }

    await page.waitForTimeout(2000);

    const star5Button = page.locator('button:has-text("5 Stars")').first();
    await star5Button.click();
    await page.waitForTimeout(2000);

    const reviews = page.locator(
      '[data-testid="review-card"], .space-y-4 > div'
    );
    const count = await reviews.count();

    if (count >= 2) {
      const dates: string[] = [];
      for (let i = 0; i < Math.min(count, 2); i++) {
        const dateText = await reviews
          .nth(i)
          .locator(
            "text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/"
          )
          .first()
          .textContent();
        if (dateText) {
          dates.push(dateText);
        }
      }

      if (dates.length >= 2) {
        const date1 = new Date(dates[0]);
        const date2 = new Date(dates[1]);
        if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
          expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
        }
      }
    }
  });

  test("should toggle between sorting options", async ({ page }) => {
    const sortButton = page.locator('button:has-text("Sort"), select').first();

    if (await sortButton.isVisible()) {
      if ((await sortButton.evaluate((el) => el.tagName)) === "SELECT") {
        await sortButton.selectOption({ label: "Oldest First" });
      } else {
        await sortButton.click();
        await page.locator('text="Oldest First"').click();
      }
    }

    await page.waitForTimeout(2000);

    const reviews = page.locator(
      '[data-testid="review-card"], .space-y-4 > div'
    );
    const firstReviewOld = await reviews.first().textContent();

    if ((await sortButton.evaluate((el) => el.tagName)) === "SELECT") {
      await sortButton.selectOption({ label: "Newest First" });
    } else {
      await sortButton.click();
      await page.locator('text="Newest First"').click();
    }

    await page.waitForTimeout(2000);

    const firstReviewNew = await reviews.first().textContent();
    expect(firstReviewOld).not.toBe(firstReviewNew);
  });
});
