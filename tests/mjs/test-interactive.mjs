import { chromium } from 'playwright';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testReviewsPage() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('🚀 Starting comprehensive review page tests...\n');

  try {
    // Navigate to the reviews page
    console.log('📍 Navigating to reviews page...');
    await page.goto('http://localhost:3001/reviews', { waitUntil: 'networkidle' });
    await delay(2000);

    // Test 1: Check if page loads correctly
    console.log('\n✅ Test 1: Page Load');
    const title = await page.textContent('h1');
    console.log(`  - Page title: ${title}`);

    // Wait for reviews to load
    await page.waitForSelector('[data-testid="reviews-list"]', { timeout: 10000 });
    const reviewCards = await page.$$('.card');
    console.log(`  - Found ${reviewCards.length} review cards`);

    // Test 2: Search functionality
    console.log('\n🔍 Test 2: Search Functionality');
    const searchInput = await page.$('input[placeholder="Search reviews..."]');

    // Test search with "recently"
    console.log('  - Searching for "recently"...');
    await searchInput.fill('recently');
    await delay(1000); // Wait for debounce

    // Check if filtering message appears
    const filterMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`  - Filter message: ${filterMessage}`);

    // Check if highlights are working
    const highlights = await page.$$('mark');
    console.log(`  - Found ${highlights.length} highlighted elements`);

    if (highlights.length > 0) {
      const firstHighlight = await highlights[0].textContent();
      console.log(`  - First highlight text: "${firstHighlight}"`);
    } else {
      console.log('  ⚠️ WARNING: No highlights found!');
    }

    // Count visible reviews after search
    const visibleReviewsAfterSearch = await page.$$('.card:visible');
    console.log(`  - Visible reviews after search: ${visibleReviewsAfterSearch.length}`);

    // Clear search
    await searchInput.fill('');
    await delay(500);

    // Test 3: Star rating filter
    console.log('\n⭐ Test 3: Star Rating Filter');
    const starSelect = await page.$('select.form-select');

    await starSelect.selectOption('5');
    await delay(1000);
    const fiveStarReviews = await page.$$('.card');
    console.log(`  - 5-star reviews: ${fiveStarReviews.length}`);

    await starSelect.selectOption('1');
    await delay(1000);
    const oneStarReviews = await page.$$('.card');
    console.log(`  - 1-star reviews: ${oneStarReviews.length}`);

    await starSelect.selectOption('');
    await delay(1000);

    // Test 4: Sort order
    console.log('\n📅 Test 4: Sort Order');
    const sortButton = await page.$('button:has-text("Newest First"), button:has-text("Oldest First")');
    const initialSortText = await sortButton.textContent();
    console.log(`  - Initial sort: ${initialSortText}`);

    await sortButton.click();
    await delay(1000);
    const afterClickSortText = await sortButton.textContent();
    console.log(`  - After click: ${afterClickSortText}`);

    // Test 5: Combined filters
    console.log('\n🔀 Test 5: Combined Filters');

    // Apply multiple filters
    await searchInput.fill('good');
    await starSelect.selectOption('5');
    await delay(1000);

    const combinedFilterReviews = await page.$$('.card');
    const combinedFilterMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`  - Combined filter results: ${combinedFilterReviews.length} reviews`);
    console.log(`  - Message: ${combinedFilterMessage}`);

    // Test 6: Clear filters
    console.log('\n🧹 Test 6: Clear Filters');
    const clearButton = await page.$('button:has-text("Clear")');
    await clearButton.click();
    await delay(1000);

    const afterClearReviews = await page.$$('.card');
    const searchValueAfterClear = await searchInput.inputValue();
    const starValueAfterClear = await starSelect.inputValue();

    console.log(`  - Reviews after clear: ${afterClearReviews.length}`);
    console.log(`  - Search field: "${searchValueAfterClear}" (should be empty)`);
    console.log(`  - Star filter: "${starValueAfterClear}" (should be empty)`);

    // Test 7: Reply button
    console.log('\n💬 Test 7: Reply Functionality');
    const firstNewReview = await page.$('.card:has([data-testid="reviews-list"]) button:has-text("Reply")').catch(() => null);

    if (firstNewReview) {
      await firstNewReview.click();
      await delay(500);

      const modalVisible = await page.$('.modal.show');
      console.log(`  - Reply modal visible: ${modalVisible !== null}`);

      if (modalVisible) {
        const closeButton = await page.$('.modal .btn-close, .modal button:has-text("Cancel")');
        if (closeButton) {
          await closeButton.click();
          await delay(500);
        }
      }
    } else {
      console.log('  - No reviews with Reply button found');
    }

    // Test 8: Search with special characters
    console.log('\n🔤 Test 8: Search Edge Cases');

    const testSearches = [
      { term: 'RECENTLY', description: 'uppercase search' },
      { term: 'Recent', description: 'mixed case search' },
      { term: 'rec', description: 'partial word search' },
      { term: '!@#$', description: 'special characters' },
      { term: '   spaces   ', description: 'search with spaces' }
    ];

    for (const test of testSearches) {
      await searchInput.fill(test.term);
      await delay(500);

      const results = await page.$$('.card');
      const highlights = await page.$$('mark');
      console.log(`  - ${test.description} ("${test.term}"): ${results.length} results, ${highlights.length} highlights`);

      await searchInput.fill('');
      await delay(300);
    }

    // Test 9: Check highlight implementation
    console.log('\n🎨 Test 9: Highlight Implementation Check');
    await searchInput.fill('review');
    await delay(1000);

    // Check if highlights have correct styling
    const highlightElements = await page.$$('mark');
    if (highlightElements.length > 0) {
      const firstHighlightStyle = await highlightElements[0].evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          fontWeight: style.fontWeight,
          padding: style.padding
        };
      });
      console.log('  - Highlight styles:', JSON.stringify(firstHighlightStyle, null, 2));
    }

    // Test 10: Performance check
    console.log('\n⚡ Test 10: Performance');
    const startTime = Date.now();
    await searchInput.fill('comprehensive test search query');
    await delay(500);
    const searchTime = Date.now() - startTime;
    console.log(`  - Search response time: ${searchTime}ms`);

    console.log('\n✅ All tests completed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  }

  // Keep browser open for manual inspection
  console.log('\n👀 Browser will remain open for manual inspection...');
  console.log('Press Ctrl+C to exit when done.');
}

// Run the tests
testReviewsPage().catch(console.error);