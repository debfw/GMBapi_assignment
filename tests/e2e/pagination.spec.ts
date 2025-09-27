import { test, expect } from '@playwright/test';

test.describe('Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should navigate to next page', async ({ page }) => {
    const firstPageReviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const firstPageCount = await firstPageReviews.count();

    if (firstPageCount > 0) {
      const firstReviewText = await firstPageReviews.first().textContent();

      const nextButton = page.locator('button:has-text("Next"), button[aria-label*="Next"], button:has-text("›"), button:has-text("→")').first();

      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(2000);

        const secondPageReviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
        const secondPageCount = await secondPageReviews.count();

        if (secondPageCount > 0) {
          const secondPageFirstReview = await secondPageReviews.first().textContent();
          expect(secondPageFirstReview).not.toBe(firstReviewText);
        }

        const pageIndicator = page.locator('text=/Page 2|2 of|2\\//', 'button[aria-current="page"]:has-text("2")').first();
        expect(await pageIndicator.isVisible()).toBeTruthy();
      }
    }
  });

  test('should navigate to previous page', async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next"), button[aria-label*="Next"], button:has-text("›"), button:has-text("→")').first();

    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(2000);

      const secondPageReviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const secondPageFirstReview = await secondPageReviews.first().textContent();

      const prevButton = page.locator('button:has-text("Previous"), button:has-text("Prev"), button[aria-label*="Previous"], button:has-text("‹"), button:has-text("←")').first();

      if (await prevButton.isVisible() && await prevButton.isEnabled()) {
        await prevButton.click();
        await page.waitForTimeout(2000);

        const firstPageReviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
        const firstPageFirstReview = await firstPageReviews.first().textContent();

        expect(firstPageFirstReview).not.toBe(secondPageFirstReview);

        const pageIndicator = page.locator('text=/Page 1|1 of|1\\//', 'button[aria-current="page"]:has-text("1")').first();
        expect(await pageIndicator.isVisible()).toBeTruthy();
      }
    }
  });

  test('should jump to specific page number', async ({ page }) => {
    const pageButtons = page.locator('button').filter({ hasText: /^[2-5]$/ });
    const pageButtonCount = await pageButtons.count();

    if (pageButtonCount > 0) {
      const page3Button = pageButtons.filter({ hasText: '3' }).first();

      if (await page3Button.isVisible()) {
        const firstPageReviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
        const firstPageText = await firstPageReviews.first().textContent();

        await page3Button.click();
        await page.waitForTimeout(2000);

        const page3Reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
        const page3Text = await page3Reviews.first().textContent();

        if (page3Text) {
          expect(page3Text).not.toBe(firstPageText);
        }

        const pageIndicator = page.locator('text=/Page 3|3 of|3\\//', 'button[aria-current="page"]:has-text("3")').first();
        expect(await pageIndicator.isVisible()).toBeTruthy();
      }
    }
  });

  test('should navigate to first and last page', async ({ page }) => {
    const lastButton = page.locator('button:has-text("Last"), button[aria-label*="Last"], button:has-text("»"), button:has-text("→→")').first();

    if (await lastButton.isVisible() && await lastButton.isEnabled()) {
      await lastButton.click();
      await page.waitForTimeout(2000);

      const lastPageReviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const lastPageText = await lastPageReviews.first().textContent();

      const firstButton = page.locator('button:has-text("First"), button[aria-label*="First"], button:has-text("«"), button:has-text("←←")').first();

      if (await firstButton.isVisible() && await firstButton.isEnabled()) {
        await firstButton.click();
        await page.waitForTimeout(2000);

        const firstPageReviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
        const firstPageText = await firstPageReviews.first().textContent();

        if (lastPageText && firstPageText) {
          expect(firstPageText).not.toBe(lastPageText);
        }

        const pageIndicator = page.locator('text=/Page 1|1 of|1\\//', 'button[aria-current="page"]:has-text("1")').first();
        expect(await pageIndicator.isVisible()).toBeTruthy();
      }
    }
  });

  test('should maintain filters when paginating', async ({ page }) => {
    const star5Button = page.locator('button:has-text("5 Stars")').first();
    if (await star5Button.isVisible()) {
      await star5Button.click();
      await page.waitForTimeout(2000);
    }

    const nextButton = page.locator('button:has-text("Next"), button[aria-label*="Next"], button:has-text("›"), button:has-text("→")').first();

    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(2000);

      const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
      const count = await reviews.count();

      if (count > 0) {
        const firstReview = reviews.first();
        const stars = await firstReview.locator('[aria-label*="star"], svg[fill="currentColor"]').count();
        expect(stars).toBeGreaterThanOrEqual(5);
      }

      const activeFilter = page.locator('button:has-text("5 Stars")[aria-pressed="true"], button:has-text("5 Stars").bg-primary');
      expect(await activeFilter.isVisible()).toBeTruthy();
    }
  });

  test('should show correct page numbers', async ({ page }) => {
    const pagination = page.locator('[role="navigation"], nav, [class*="pagination"]').first();

    if (await pagination.isVisible()) {
      const pageButtons = pagination.locator('button').filter({ hasText: /^\d+$/ });
      const count = await pageButtons.count();

      if (count > 0) {
        const firstPageButton = pageButtons.filter({ hasText: '1' }).first();
        expect(await firstPageButton.isVisible()).toBeTruthy();

        if (count >= 2) {
          const secondPageButton = pageButtons.filter({ hasText: '2' }).first();
          expect(await secondPageButton.isVisible()).toBeTruthy();
        }
      }
    }
  });

  test('should disable navigation buttons appropriately', async ({ page }) => {
    const prevButton = page.locator('button:has-text("Previous"), button:has-text("Prev"), button[aria-label*="Previous"], button:has-text("‹")').first();

    if (await prevButton.isVisible()) {
      const isDisabled = await prevButton.isDisabled();
      expect(isDisabled).toBeTruthy();
    }

    const lastButton = page.locator('button:has-text("Last"), button[aria-label*="Last"], button:has-text("»")').first();

    if (await lastButton.isVisible() && await lastButton.isEnabled()) {
      await lastButton.click();
      await page.waitForTimeout(2000);

      const nextButton = page.locator('button:has-text("Next"), button[aria-label*="Next"], button:has-text("›")').first();
      if (await nextButton.isVisible()) {
        const isDisabled = await nextButton.isDisabled();
        expect(isDisabled).toBeTruthy();
      }
    }
  });
});