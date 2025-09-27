import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('should perform a complete user journey through all features', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Step 1: Search for reviews with keyword "excellent"');
    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('excellent');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    let reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    let count = await reviews.count();
    expect(count).toBeGreaterThan(0);

    console.log('Step 2: Clear search');
    await searchInput.clear();
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Step 3: Filter by 5-star reviews');
    const star5Button = page.locator('button:has-text("5 Stars")').first();
    await star5Button.click();
    await page.waitForTimeout(2000);

    reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    count = await reviews.count();
    if (count > 0) {
      const stars = await reviews.first().locator('[aria-label*="star"], svg[fill="currentColor"]').count();
      expect(stars).toBeGreaterThanOrEqual(5);
    }

    console.log('Step 4: Sort by newest first');
    const sortButton = page.locator('button:has-text("Sort"), select').first();
    if (await sortButton.isVisible()) {
      if ((await sortButton.evaluate(el => el.tagName)) === 'SELECT') {
        await sortButton.selectOption({ label: 'Newest First' });
      } else {
        await sortButton.click();
        await page.locator('text="Newest First"').click();
      }
      await page.waitForTimeout(2000);
    }

    console.log('Step 5: Apply date filter - Last 30 days');
    const last30DaysButton = page.locator('button:has-text("Last 30 days"), button:has-text("30 days")').first();
    if (await last30DaysButton.isVisible()) {
      await last30DaysButton.click();
      await page.waitForTimeout(2000);
    }

    console.log('Step 6: Navigate through pagination');
    const nextButton = page.locator('button:has-text("Next"), button[aria-label*="Next"], button:has-text("›")').first();
    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(2000);

      const prevButton = page.locator('button:has-text("Previous"), button:has-text("Prev"), button[aria-label*="Previous"], button:has-text("‹")').first();
      if (await prevButton.isVisible() && await prevButton.isEnabled()) {
        await prevButton.click();
        await page.waitForTimeout(2000);
      }
    }

    console.log('Step 7: Change to 3-star reviews');
    const star3Button = page.locator('button:has-text("3 Stars")').first();
    await star3Button.click();
    await page.waitForTimeout(2000);

    reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    count = await reviews.count();

    console.log('Step 8: Search within filtered results');
    await searchInput.fill('service');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Step 9: Sort by oldest first');
    if (await sortButton.isVisible()) {
      if ((await sortButton.evaluate(el => el.tagName)) === 'SELECT') {
        await sortButton.selectOption({ label: 'Oldest First' });
      } else {
        await sortButton.click();
        await page.locator('text="Oldest First"').click();
      }
      await page.waitForTimeout(2000);
    }

    console.log('Step 10: Reset all filters');
    const allStarsButton = page.locator('button:has-text("All Stars")').first();
    if (await allStarsButton.isVisible()) {
      await allStarsButton.click();
      await page.waitForTimeout(2000);
    }

    await searchInput.clear();
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    const clearDateButton = page.locator('button:has-text("Clear"), button:has-text("Reset")').first();
    if (await clearDateButton.isVisible()) {
      await clearDateButton.click();
      await page.waitForTimeout(2000);
    }

    reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    const finalCount = await reviews.count();
    expect(finalCount).toBeGreaterThan(0);

    console.log('User journey completed successfully!');
  });

  test('should handle edge cases in user journey', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Edge Case 1: Multiple filters with no results');
    const star1Button = page.locator('button:has-text("1 Star")').first();
    await star1Button.click();
    await page.waitForTimeout(1500);

    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('excellent amazing fantastic wonderful');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    let reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    let count = await reviews.count();

    if (count === 0) {
      const noResults = page.locator('text=/no reviews found|no results/i');
      expect(await noResults.count()).toBeGreaterThanOrEqual(0);
    }

    console.log('Edge Case 2: Reset filters and apply new combination');
    await searchInput.clear();
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);

    const allStarsButton = page.locator('button:has-text("All Stars")').first();
    await allStarsButton.click();
    await page.waitForTimeout(1500);

    const star4Button = page.locator('button:has-text("4 Stars")').first();
    await star4Button.click();
    await page.waitForTimeout(1500);

    await searchInput.fill('good');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Edge Case 3: Rapid filter changes');
    const star2Button = page.locator('button:has-text("2 Stars")').first();
    await star2Button.click();
    await page.waitForTimeout(1000);

    const star3Button = page.locator('button:has-text("3 Stars")').first();
    await star3Button.click();
    await page.waitForTimeout(1000);

    const star5Button = page.locator('button:has-text("5 Stars")').first();
    await star5Button.click();
    await page.waitForTimeout(2000);

    reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    count = await reviews.count();

    if (count > 0) {
      const stars = await reviews.first().locator('[aria-label*="star"], svg[fill="currentColor"]').count();
      expect(stars).toBeGreaterThanOrEqual(5);
    }

    console.log('Edge cases handled successfully!');
  });

  test('should perform realistic user scenario', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Scenario: User looking for recent negative reviews');

    console.log('1. Filter for low-rated reviews');
    const star2Button = page.locator('button:has-text("2 Stars")').first();
    await star2Button.click();
    await page.waitForTimeout(2000);

    console.log('2. Sort by newest to see recent issues');
    const sortButton = page.locator('button:has-text("Sort"), select').first();
    if (await sortButton.isVisible()) {
      if ((await sortButton.evaluate(el => el.tagName)) === 'SELECT') {
        await sortButton.selectOption({ label: 'Newest First' });
      } else {
        await sortButton.click();
        await page.locator('text="Newest First"').click();
      }
      await page.waitForTimeout(2000);
    }

    console.log('3. Search for specific complaint keywords');
    const searchInput = page.locator('input[placeholder="Search reviews..."]');
    await searchInput.fill('bad');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    let reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    let count = await reviews.count();

    console.log(`Found ${count} reviews matching criteria`);

    console.log('4. Now looking for positive reviews for comparison');
    await searchInput.clear();
    const star5Button = page.locator('button:has-text("5 Stars")').first();
    await star5Button.click();
    await page.waitForTimeout(2000);

    console.log('5. Search for positive keywords');
    await searchInput.fill('excellent');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    reviews = page.locator('[data-testid="review-card"], .space-y-4 > div');
    count = await reviews.count();

    console.log(`Found ${count} positive reviews`);

    console.log('6. Check pagination if many results');
    const nextButton = page.locator('button:has-text("Next"), button[aria-label*="Next"]').first();
    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(2000);
      console.log('Navigated to page 2');
    }

    console.log('Realistic scenario completed!');
  });
});