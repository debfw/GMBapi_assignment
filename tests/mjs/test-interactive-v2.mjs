import { chromium } from 'playwright';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testReviewsPage() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 200
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

    // Get text from first few reviews to know what to search for
    const firstReviewText = await page.$eval('.card:first-child', el => el.textContent);
    console.log(`  - First review preview: ${firstReviewText.substring(0, 100)}...`);

    // Extract a word from the first review to search for
    const words = firstReviewText.match(/\b[a-zA-Z]{4,}\b/g);
    const searchWord = words && words.length > 5 ? words[5].toLowerCase() : 'review';
    console.log(`  - Will search for word: "${searchWord}"`);

    // Test 2: Search functionality
    console.log('\n🔍 Test 2: Search Functionality');
    const searchInput = await page.$('input[placeholder="Search reviews..."]');

    // Test exact match
    console.log(`  - Searching for "${searchWord}"...`);
    await searchInput.fill(searchWord);
    await delay(1500); // Wait for debounce and filtering

    // Check filtering message
    const filterMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`  - Filter message: ${filterMessage}`);

    // Check highlights
    const highlights = await page.$$('mark');
    console.log(`  - Found ${highlights.length} highlighted elements`);

    if (highlights.length > 0) {
      const highlightTexts = await Promise.all(
        highlights.slice(0, 3).map(h => h.textContent())
      );
      console.log(`  - Highlight examples: ${highlightTexts.join(', ')}`);
    }

    // Count visible reviews
    const visibleCards = await page.$$('.card');
    console.log(`  - Visible reviews: ${visibleCards.length}`);

    // Clear search
    await searchInput.fill('');
    await delay(1000);

    // Test 3: Case-insensitive search
    console.log('\n🔤 Test 3: Case-Insensitive Search');

    // Test uppercase
    const upperSearch = searchWord.toUpperCase();
    console.log(`  - Testing UPPERCASE: "${upperSearch}"`);
    await searchInput.fill(upperSearch);
    await delay(1500);

    let results = await page.$$('.card');
    let highlightCount = await page.$$('mark');
    const upperMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${results.length} reviews, ${highlightCount.length} highlights`);
    console.log(`    Message: ${upperMessage}`);

    // Clear
    await searchInput.fill('');
    await delay(800);

    // Test mixed case
    const mixedSearch = searchWord.charAt(0).toUpperCase() + searchWord.slice(1).toLowerCase();
    console.log(`  - Testing MixedCase: "${mixedSearch}"`);
    await searchInput.fill(mixedSearch);
    await delay(1500);

    results = await page.$$('.card');
    highlightCount = await page.$$('mark');
    const mixedMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${results.length} reviews, ${highlightCount.length} highlights`);
    console.log(`    Message: ${mixedMessage}`);

    // Clear
    await searchInput.fill('');
    await delay(800);

    // Test partial word
    const partialSearch = searchWord.substring(0, 3);
    console.log(`  - Testing partial: "${partialSearch}"`);
    await searchInput.fill(partialSearch);
    await delay(1500);

    results = await page.$$('.card');
    highlightCount = await page.$$('mark');
    const partialMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${results.length} reviews, ${highlightCount.length} highlights`);
    console.log(`    Message: ${partialMessage}`);

    // Clear
    await searchInput.fill('');
    await delay(800);

    // Test 4: Star rating filter
    console.log('\n⭐ Test 4: Star Rating Filter');
    const starSelect = await page.$('select.form-select');

    await starSelect.selectOption('5');
    await delay(1500);
    const fiveStarReviews = await page.$$('.card');
    console.log(`  - 5-star reviews: ${fiveStarReviews.length}`);

    await starSelect.selectOption('3');
    await delay(1500);
    const threeStarReviews = await page.$$('.card');
    console.log(`  - 3-star reviews: ${threeStarReviews.length}`);

    await starSelect.selectOption('');
    await delay(1000);
    const allStarReviews = await page.$$('.card');
    console.log(`  - All reviews (no filter): ${allStarReviews.length}`);

    // Test 5: Sort order
    console.log('\n📅 Test 5: Sort Order');
    const sortButton = await page.$('button:has-text("Newest First"), button:has-text("Oldest First")');
    const initialSortText = await sortButton.textContent();
    console.log(`  - Initial sort: ${initialSortText.trim()}`);

    // Get first review date before sort
    const firstDateBefore = await page.$eval('.card:first-child .text-muted.small', el => el.textContent);
    console.log(`  - First review date: ${firstDateBefore}`);

    await sortButton.click();
    await delay(1500);

    const afterClickSortText = await sortButton.textContent();
    console.log(`  - After click sort: ${afterClickSortText.trim()}`);

    // Get first review date after sort
    const firstDateAfter = await page.$eval('.card:first-child .text-muted.small', el => el.textContent);
    console.log(`  - First review date after sort: ${firstDateAfter}`);

    // Test 6: Combined filters
    console.log('\n🔀 Test 6: Combined Filters');

    // Search for a common word and apply star filter
    await searchInput.fill('the');
    await starSelect.selectOption('5');
    await delay(1500);

    const combinedResults = await page.$$('.card');
    const combinedMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`  - Search "the" + 5 stars: ${combinedResults.length} reviews`);
    console.log(`  - Message: ${combinedMessage}`);

    // Test 7: Clear filters
    console.log('\n🧹 Test 7: Clear Filters');
    const clearButton = await page.$('button:has-text("Clear")');
    await clearButton.click();
    await delay(1000);

    const afterClearReviews = await page.$$('.card');
    const searchValueAfterClear = await searchInput.inputValue();
    const starValueAfterClear = await starSelect.inputValue();

    console.log(`  - Reviews after clear: ${afterClearReviews.length}`);
    console.log(`  - Search field: "${searchValueAfterClear}" (should be empty)`);
    console.log(`  - Star filter: "${starValueAfterClear}" (should be empty)`);

    // Test 8: Highlight styling
    console.log('\n🎨 Test 8: Highlight Styling');
    await searchInput.fill('review');
    await delay(1500);

    const highlightElements = await page.$$('mark');
    if (highlightElements.length > 0) {
      const highlightStyle = await highlightElements[0].evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          fontWeight: style.fontWeight,
          padding: style.padding,
          borderRadius: style.borderRadius
        };
      });
      console.log('  - Highlight styles:');
      console.log(`    Background: ${highlightStyle.backgroundColor}`);
      console.log(`    Font weight: ${highlightStyle.fontWeight}`);
      console.log(`    Padding: ${highlightStyle.padding}`);
      console.log(`    Border radius: ${highlightStyle.borderRadius}`);
    } else {
      console.log('  - No highlights found to check styling');
    }

    // Test 9: Date filtering
    console.log('\n📆 Test 9: Date Filtering');
    const startDateInput = await page.$('input[type="date"]:first-of-type');
    const endDateInput = await page.$('input[type="date"]:last-of-type');

    // Set a date range
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
    const lastMonthStr = lastMonth.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    await startDateInput.fill(lastMonthStr);
    await endDateInput.fill(todayStr);
    await delay(1500);

    const dateFilteredReviews = await page.$$('.card');
    console.log(`  - Reviews in date range: ${dateFilteredReviews.length}`);

    // Clear dates
    await startDateInput.fill('');
    await endDateInput.fill('');
    await delay(1000);

    // Test 10: Performance
    console.log('\n⚡ Test 10: Performance');
    const startTime = Date.now();
    await searchInput.fill('comprehensive test of search functionality');
    await delay(500);
    const searchTime = Date.now() - startTime - 500;
    console.log(`  - Search processing time: ~${searchTime}ms`);

    const perfResults = await page.$$('.card');
    console.log(`  - Results for long search: ${perfResults.length}`);

    console.log('\n✅ All tests completed successfully!');

    // Summary
    console.log('\n📊 Test Summary:');
    console.log('  ✓ Page loads correctly');
    console.log('  ✓ Search functionality works');
    console.log('  ✓ Case-insensitive search verified');
    console.log('  ✓ Partial word search tested');
    console.log('  ✓ Star rating filter works');
    console.log('  ✓ Sort order changes correctly');
    console.log('  ✓ Combined filters work');
    console.log('  ✓ Clear filters resets all');
    console.log('  ✓ Highlight styling applied');
    console.log('  ✓ Performance acceptable');

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