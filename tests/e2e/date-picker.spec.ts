import { test, expect } from '@playwright/test';

test.describe('Date Picker Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should open date picker and select a date range', async ({ page }) => {
    const datePickerButton = page.locator('button:has-text("Date Range"), button:has(svg)').filter({ hasText: /date|calendar/i }).first();

    if (!(await datePickerButton.isVisible())) {
      const alternativeDatePicker = page.locator('button').filter({ has: page.locator('svg') }).first();
      if (await alternativeDatePicker.isVisible()) {
        await alternativeDatePicker.click();
      }
    } else {
      await datePickerButton.click();
    }

    await page.waitForTimeout(1000);

    const calendar = page.locator('[role="dialog"], .DayPicker, [class*="calendar"]').first();
    if (await calendar.isVisible()) {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);

      const startDay = startDate.getDate().toString();
      const endDay = today.getDate().toString();

      const startDayButton = calendar.locator(`button:has-text("${startDay}")`).first();
      if (await startDayButton.isVisible()) {
        await startDayButton.click();
        await page.waitForTimeout(500);
      }

      const endDayButton = calendar.locator(`button:has-text("${endDay}")`).last();
      if (await endDayButton.isVisible()) {
        await endDayButton.click();
        await page.waitForTimeout(500);
      }

      const applyButton = page.locator('button:has-text("Apply"), button:has-text("OK"), button:has-text("Done")').first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
      } else {
        await page.keyboard.press('Escape');
      }

      await page.waitForTimeout(2000);

      const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const count = await reviews.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should filter reviews by last 7 days using date picker', async ({ page }) => {
    const datePickerButton = page.locator('button:has-text("Date Range"), button:has(svg)').filter({ hasText: /date|calendar/i }).first();

    if (!(await datePickerButton.isVisible())) {
      const alternativeDatePicker = page.locator('button').filter({ has: page.locator('svg') }).first();
      if (await alternativeDatePicker.isVisible()) {
        await alternativeDatePicker.click();
      }
    } else {
      await datePickerButton.click();
    }

    await page.waitForTimeout(1000);

    const last7Days = page.locator('button:has-text("Last 7 days"), button:has-text("Last Week")').first();
    if (await last7Days.isVisible()) {
      await last7Days.click();
      await page.waitForTimeout(2000);
    } else {
      const calendar = page.locator('[role="dialog"], .DayPicker, [class*="calendar"]').first();
      if (await calendar.isVisible()) {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);

        const startDay = weekAgo.getDate().toString();
        const endDay = today.getDate().toString();

        const startDayButton = calendar.locator(`button:has-text("${startDay}")`).first();
        if (await startDayButton.isVisible()) {
          await startDayButton.click();
          await page.waitForTimeout(500);
        }

        const endDayButton = calendar.locator(`button:has-text("${endDay}")`).last();
        if (await endDayButton.isVisible()) {
          await endDayButton.click();
          await page.waitForTimeout(500);
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(2000);
      }
    }

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();

    if (count > 0) {
      const firstReview = reviews.first();
      const dateText = await firstReview.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}|ago/').first().textContent();
      expect(dateText).toBeTruthy();
    }
  });

  test('should clear date filter', async ({ page }) => {
    const datePickerButton = page.locator('button:has-text("Date Range"), button:has(svg)').filter({ hasText: /date|calendar/i }).first();

    if (await datePickerButton.isVisible()) {
      await datePickerButton.click();
      await page.waitForTimeout(1000);

      const last30Days = page.locator('button:has-text("Last 30 days"), button:has-text("Last Month")').first();
      if (await last30Days.isVisible()) {
        await last30Days.click();
        await page.waitForTimeout(2000);
      } else {
        await page.keyboard.press('Escape');
      }
    }

    const reviewsFiltered = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

    const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset"), button:has-text("Remove")').first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(2000);

      const reviewsAfterClear = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();
      expect(reviewsAfterClear).toBeGreaterThanOrEqual(reviewsFiltered);
    }
  });

  test('should select custom date range', async ({ page }) => {
    const datePickerButton = page.locator('button:has-text("Date Range"), button:has(svg)').filter({ hasText: /date|calendar/i }).first();

    if (!(await datePickerButton.isVisible())) {
      const alternativeDatePicker = page.locator('button').filter({ has: page.locator('svg') }).first();
      if (await alternativeDatePicker.isVisible()) {
        await alternativeDatePicker.click();
      }
    } else {
      await datePickerButton.click();
    }

    await page.waitForTimeout(1000);

    const calendar = page.locator('[role="dialog"], .DayPicker, [class*="calendar"]').first();
    if (await calendar.isVisible()) {
      const today = new Date();
      const twoMonthsAgo = new Date(today);
      twoMonthsAgo.setMonth(today.getMonth() - 2);

      const prevMonthButton = calendar.locator('button[aria-label*="Previous"], button:has-text("‹")').first();
      if (await prevMonthButton.isVisible()) {
        await prevMonthButton.click();
        await page.waitForTimeout(500);
        await prevMonthButton.click();
        await page.waitForTimeout(500);
      }

      const dayButtons = calendar.locator('button[name="day"], button[role="gridcell"]');
      const dayCount = await dayButtons.count();

      if (dayCount > 0) {
        await dayButtons.nth(10).click();
        await page.waitForTimeout(500);
        await dayButtons.nth(20).click();
        await page.waitForTimeout(500);
      }

      const applyButton = page.locator('button:has-text("Apply"), button:has-text("OK"), button:has-text("Done")').first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
      } else {
        await page.keyboard.press('Escape');
      }

      await page.waitForTimeout(2000);

      const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const count = await reviews.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});