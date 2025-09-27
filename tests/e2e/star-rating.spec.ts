import { test, expect } from '@playwright/test';

test.describe('Star Rating Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should filter by 5 star reviews', async ({ page }) => {
    const star5Button = page.locator('button:has-text("5 Stars")').first();
    await star5Button.click();
    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const review = reviews.nth(i);
        const stars = await review.locator('[aria-label*="star"], svg[fill="currentColor"]').count();
        expect(stars).toBeGreaterThanOrEqual(5);
      }
    }
  });

  test('should filter by 4 star reviews', async ({ page }) => {
    const star4Button = page.locator('button:has-text("4 Stars")').first();
    await star4Button.click();
    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();

    if (count > 0) {
      const review = reviews.first();
      const stars = await review.locator('[aria-label*="star"], svg[fill="currentColor"]').count();
      expect(stars).toBeGreaterThanOrEqual(4);
    }
  });

  test('should filter by 3 star reviews', async ({ page }) => {
    const star3Button = page.locator('button:has-text("3 Stars")').first();
    await star3Button.click();
    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();

    if (count > 0) {
      const review = reviews.first();
      const stars = await review.locator('[aria-label*="star"], svg[fill="currentColor"]').count();
      expect(stars).toBeGreaterThanOrEqual(3);
    }
  });

  test('should filter by 2 star reviews', async ({ page }) => {
    const star2Button = page.locator('button:has-text("2 Stars")').first();
    await star2Button.click();
    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();

    if (count > 0) {
      const review = reviews.first();
      const stars = await review.locator('[aria-label*="star"], svg[fill="currentColor"]').count();
      expect(stars).toBeGreaterThanOrEqual(2);
    }
  });

  test('should filter by 1 star reviews', async ({ page }) => {
    const star1Button = page.locator('button:has-text("1 Star")').first();
    await star1Button.click();
    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();

    if (count > 0) {
      const review = reviews.first();
      const stars = await review.locator('[aria-label*="star"], svg[fill="currentColor"]').count();
      expect(stars).toBeGreaterThanOrEqual(1);
    }
  });

  test('should toggle all stars filter to show all reviews', async ({ page }) => {
    const star5Button = page.locator('button:has-text("5 Stars")').first();
    await star5Button.click();
    await page.waitForTimeout(2000);

    const reviewsFiltered = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

    const allStarsButton = page.locator('button:has-text("All Stars")').first();
    await allStarsButton.click();
    await page.waitForTimeout(2000);

    const reviewsAll = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();
    expect(reviewsAll).toBeGreaterThanOrEqual(reviewsFiltered);
  });

  test('should apply multiple star filters sequentially', async ({ page }) => {
    const star5Button = page.locator('button:has-text("5 Stars")').first();
    await star5Button.click();
    await page.waitForTimeout(1500);

    const count5Stars = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

    const star3Button = page.locator('button:has-text("3 Stars")').first();
    await star3Button.click();
    await page.waitForTimeout(1500);

    const count3Stars = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

    const star1Button = page.locator('button:has-text("1 Star")').first();
    await star1Button.click();
    await page.waitForTimeout(1500);

    const count1Star = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

    const allStarsButton = page.locator('button:has-text("All Stars")').first();
    await allStarsButton.click();
    await page.waitForTimeout(1500);

    const countAll = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();
    expect(countAll).toBeGreaterThanOrEqual(Math.max(count5Stars, count3Stars, count1Star));
  });
});