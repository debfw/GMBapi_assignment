import { test, expect } from '@playwright/test';

test.describe('Quick Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should apply "Last 7 days" quick filter', async ({ page }) => {
    const last7DaysButton = page.locator('button:has-text("Last 7 days"), button:has-text("7 days"), button:has-text("Past Week")').first();

    if (await last7DaysButton.isVisible()) {
      await last7DaysButton.click();
      await page.waitForTimeout(2000);

      const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const count = await reviews.count();

      if (count > 0) {
        const firstReview = reviews.first();
        const dateText = await firstReview.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/').first().textContent();

        if (dateText) {
          const reviewDate = new Date(dateText);
          const today = new Date();
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);

          if (!isNaN(reviewDate.getTime())) {
            expect(reviewDate.getTime()).toBeGreaterThanOrEqual(weekAgo.getTime());
          }
        }
      }
    }
  });

  test('should apply "Last 30 days" quick filter', async ({ page }) => {
    const last30DaysButton = page.locator('button:has-text("Last 30 days"), button:has-text("30 days"), button:has-text("Past Month")').first();

    if (await last30DaysButton.isVisible()) {
      await last30DaysButton.click();
      await page.waitForTimeout(2000);

      const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const count = await reviews.count();

      if (count > 0) {
        const firstReview = reviews.first();
        const dateText = await firstReview.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/').first().textContent();

        if (dateText) {
          const reviewDate = new Date(dateText);
          const today = new Date();
          const monthAgo = new Date(today);
          monthAgo.setDate(today.getDate() - 30);

          if (!isNaN(reviewDate.getTime())) {
            expect(reviewDate.getTime()).toBeGreaterThanOrEqual(monthAgo.getTime());
          }
        }
      }
    }
  });

  test('should apply "Last 3 months" quick filter', async ({ page }) => {
    const last3MonthsButton = page.locator('button:has-text("Last 3 months"), button:has-text("3 months"), button:has-text("Past Quarter")').first();

    if (await last3MonthsButton.isVisible()) {
      await last3MonthsButton.click();
      await page.waitForTimeout(2000);

      const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const count = await reviews.count();

      if (count > 0) {
        const firstReview = reviews.first();
        const dateText = await firstReview.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/').first().textContent();

        if (dateText) {
          const reviewDate = new Date(dateText);
          const today = new Date();
          const threeMonthsAgo = new Date(today);
          threeMonthsAgo.setMonth(today.getMonth() - 3);

          if (!isNaN(reviewDate.getTime())) {
            expect(reviewDate.getTime()).toBeGreaterThanOrEqual(threeMonthsAgo.getTime());
          }
        }
      }
    }
  });

  test('should switch between quick filters', async ({ page }) => {
    const last7DaysButton = page.locator('button:has-text("Last 7 days"), button:has-text("7 days")').first();
    const last30DaysButton = page.locator('button:has-text("Last 30 days"), button:has-text("30 days")').first();

    if (await last7DaysButton.isVisible()) {
      await last7DaysButton.click();
      await page.waitForTimeout(2000);

      const count7Days = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

      if (await last30DaysButton.isVisible()) {
        await last30DaysButton.click();
        await page.waitForTimeout(2000);

        const count30Days = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();
        expect(count30Days).toBeGreaterThanOrEqual(count7Days);
      }
    }
  });

  test('should combine quick filter with star rating', async ({ page }) => {
    const last30DaysButton = page.locator('button:has-text("Last 30 days"), button:has-text("30 days")').first();

    if (await last30DaysButton.isVisible()) {
      await last30DaysButton.click();
      await page.waitForTimeout(2000);

      const star5Button = page.locator('button:has-text("5 Stars")').first();
      if (await star5Button.isVisible()) {
        await star5Button.click();
        await page.waitForTimeout(2000);

        const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
        const count = await reviews.count();

        if (count > 0) {
          const firstReview = reviews.first();
          const stars = await firstReview.locator('[aria-label*="star"], svg[fill="currentColor"]').count();
          expect(stars).toBeGreaterThanOrEqual(5);

          const dateText = await firstReview.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/').first().textContent();
          if (dateText) {
            const reviewDate = new Date(dateText);
            const today = new Date();
            const monthAgo = new Date(today);
            monthAgo.setDate(today.getDate() - 30);

            if (!isNaN(reviewDate.getTime())) {
              expect(reviewDate.getTime()).toBeGreaterThanOrEqual(monthAgo.getTime());
            }
          }
        }
      }
    }
  });

  test('should clear quick filters', async ({ page }) => {
    const last7DaysButton = page.locator('button:has-text("Last 7 days"), button:has-text("7 days")').first();

    if (await last7DaysButton.isVisible()) {
      await last7DaysButton.click();
      await page.waitForTimeout(2000);

      const countFiltered = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

      const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset"), button:has-text("All")').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(2000);

        const countAfterClear = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();
        expect(countAfterClear).toBeGreaterThanOrEqual(countFiltered);
      }
    }
  });
});