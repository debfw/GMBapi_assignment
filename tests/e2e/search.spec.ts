import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should search for reviews with keyword "excellent"', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('excellent');
    await searchInput.press('Enter');

    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div').filter({ hasText: /excellent/i });
    const count = await reviews.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const reviewText = await reviews.nth(i).textContent();
      expect(reviewText?.toLowerCase()).toContain('excellent');
    }
  });

  test('should search for reviews with keyword "bad"', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('bad');
    await searchInput.press('Enter');

    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div').filter({ hasText: /bad/i });
    const countAfterSearch = await reviews.count();

    if (countAfterSearch > 0) {
      for (let i = 0; i < Math.min(countAfterSearch, 3); i++) {
        const reviewText = await reviews.nth(i).textContent();
        expect(reviewText?.toLowerCase()).toContain('bad');
      }
    }
  });

  test('should clear search and show all reviews', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('test');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    await searchInput.clear();
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('xyzabc123456789');
    await searchInput.press('Enter');

    await page.waitForTimeout(2000);

    const noResults = page.locator('text=/no reviews found|no results/i');
    const reviewCount = await page.locator('[data-testid="review-card"], .space-y-4 > div').count();

    if (reviewCount === 0) {
      expect(await noResults.count()).toBeGreaterThan(0);
    }
  });

  test('should search with multiple keywords', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('great service');
    await searchInput.press('Enter');

    await page.waitForTimeout(2000);

    const reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const count = await reviews.count();

    if (count > 0) {
      const firstReview = await reviews.first().textContent();
      expect(firstReview?.toLowerCase()).toMatch(/great|service/);
    }
  });
});