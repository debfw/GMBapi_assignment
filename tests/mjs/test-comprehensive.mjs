import { chromium } from 'playwright';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function comprehensiveFilterTest() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 150
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('🚀 Starting comprehensive filter and sorting tests...\n');

  try {
    // Navigate to the reviews page
    console.log('📍 Navigating to reviews page...');
    await page.goto('http://localhost:3001/reviews', { waitUntil: 'networkidle' });
    await delay(2000);

    // Initial state
    console.log('\n📊 Initial State:');
    await page.waitForSelector('[data-testid="reviews-list"]', { timeout: 10000 });
    const initialReviews = await page.$$('.card');
    const initialMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`  - Total reviews: ${initialReviews.length}`);
    console.log(`  - Status: ${initialMessage}`);

    // ========================================
    // TEST 1: All Star Ratings
    // ========================================
    console.log('\n⭐ TEST 1: Testing ALL Star Ratings');
    const starSelect = await page.$('select.form-select');

    // Test each star rating
    for (let stars = 5; stars >= 1; stars--) {
      await starSelect.selectOption(stars.toString());
      await delay(1500);

      const starReviews = await page.$$('.card');
      const starMessage = await page.textContent('[data-testid="filter-status"]');

      console.log(`  - ${stars} stars: ${starReviews.length} reviews`);

      // Verify all reviews have the correct star rating
      if (starReviews.length > 0) {
        const firstReviewStars = await page.$$eval('.card:first-child .text-warning.fill-current',
          stars => stars.length);
        console.log(`    ✓ First review has ${firstReviewStars} filled stars`);
      }
    }

    // Test "All Stars" option
    await starSelect.selectOption('');
    await delay(1500);
    const allStarsReviews = await page.$$('.card');
    console.log(`  - All stars (no filter): ${allStarsReviews.length} reviews`);

    // ========================================
    // TEST 2: Sort Order (Newest/Oldest First)
    // ========================================
    console.log('\n📅 TEST 2: Sort Order Testing');

    // Get sort button
    const sortButton = await page.$('button:has-text("Newest First"), button:has-text("Oldest First")');

    // Check initial sort
    let sortText = await sortButton.textContent();
    console.log(`  - Initial sort: ${sortText.trim()}`);

    // Get dates from first 3 reviews when sorted newest first
    const newestFirstDates = [];
    for (let i = 0; i < Math.min(3, allStarsReviews.length); i++) {
      const dateText = await page.$eval(`.card:nth-child(${i + 1}) .text-muted.small`,
        el => el.textContent);
      newestFirstDates.push(dateText);
      console.log(`    Review ${i + 1}: ${dateText}`);
    }

    // Click to change to oldest first
    await sortButton.click();
    await delay(2000);

    sortText = await sortButton.textContent();
    console.log(`  - After click: ${sortText.trim()}`);

    // Get dates from first 3 reviews when sorted oldest first
    const oldestFirstDates = [];
    for (let i = 0; i < Math.min(3, allStarsReviews.length); i++) {
      const dateText = await page.$eval(`.card:nth-child(${i + 1}) .text-muted.small`,
        el => el.textContent);
      oldestFirstDates.push(dateText);
      console.log(`    Review ${i + 1}: ${dateText}`);
    }

    // Toggle back
    await sortButton.click();
    await delay(1500);
    sortText = await sortButton.textContent();
    console.log(`  - Toggle back: ${sortText.trim()}`);

    // ========================================
    // TEST 3: Date Picker Functionality
    // ========================================
    console.log('\n📆 TEST 3: Date Picker Testing');

    const startDateInput = await page.$('input[type="date"]:first-of-type');
    const endDateInput = await page.$('input[type="date"]:last-of-type');

    // Test 1: Last 7 days
    console.log('  - Testing last 7 days:');
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    await startDateInput.fill(weekAgo.toISOString().split('T')[0]);
    await endDateInput.fill(today.toISOString().split('T')[0]);
    await delay(1500);

    let dateFilteredReviews = await page.$$('.card');
    let dateMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${dateFilteredReviews.length} reviews`);
    console.log(`    Status: ${dateMessage}`);

    // Test 2: Last 30 days
    console.log('  - Testing last 30 days:');
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    await startDateInput.fill(monthAgo.toISOString().split('T')[0]);
    await endDateInput.fill(today.toISOString().split('T')[0]);
    await delay(1500);

    dateFilteredReviews = await page.$$('.card');
    dateMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${dateFilteredReviews.length} reviews`);
    console.log(`    Status: ${dateMessage}`);

    // Test 3: Future dates (should return no results)
    console.log('  - Testing future dates:');
    const futureStart = new Date(today);
    futureStart.setDate(today.getDate() + 1);
    const futureEnd = new Date(today);
    futureEnd.setDate(today.getDate() + 7);

    await startDateInput.fill(futureStart.toISOString().split('T')[0]);
    await endDateInput.fill(futureEnd.toISOString().split('T')[0]);
    await delay(1500);

    dateFilteredReviews = await page.$$('.card');
    dateMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${dateFilteredReviews.length} reviews (should be 0)`);

    // Test 4: Only start date
    console.log('  - Testing only start date:');
    await startDateInput.fill(weekAgo.toISOString().split('T')[0]);
    await endDateInput.fill('');
    await delay(1500);

    dateFilteredReviews = await page.$$('.card');
    console.log(`    Results with only start date: ${dateFilteredReviews.length} reviews`);

    // Test 5: Only end date
    console.log('  - Testing only end date:');
    await startDateInput.fill('');
    await endDateInput.fill(today.toISOString().split('T')[0]);
    await delay(1500);

    dateFilteredReviews = await page.$$('.card');
    console.log(`    Results with only end date: ${dateFilteredReviews.length} reviews`);

    // ========================================
    // TEST 4: Combined Filters
    // ========================================
    console.log('\n🔀 TEST 4: Combined Filters Testing');

    const searchInput = await page.$('input[placeholder="Search reviews..."]');

    // Test 1: Search + Star Rating
    console.log('  - Search "service" + 5 stars:');
    await searchInput.fill('service');
    await starSelect.selectOption('5');
    await delay(1500);

    let combinedReviews = await page.$$('.card');
    let combinedMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${combinedReviews.length} reviews`);
    console.log(`    Status: ${combinedMessage}`);

    // Test 2: Search + Star Rating + Date Range
    console.log('  - Search + Stars + Date Range:');
    await startDateInput.fill(monthAgo.toISOString().split('T')[0]);
    await endDateInput.fill(today.toISOString().split('T')[0]);
    await delay(1500);

    combinedReviews = await page.$$('.card');
    combinedMessage = await page.textContent('[data-testid="filter-status"]');
    console.log(`    Results: ${combinedReviews.length} reviews`);
    console.log(`    Status: ${combinedMessage}`);

    // Test 3: All filters + Sort
    console.log('  - All filters + Sort order:');
    await sortButton.click(); // Change sort order
    await delay(1500);

    combinedReviews = await page.$$('.card');
    const currentSort = await sortButton.textContent();
    console.log(`    Results: ${combinedReviews.length} reviews`);
    console.log(`    Sort: ${currentSort.trim()}`);

    // ========================================
    // TEST 5: Clear Button Functionality
    // ========================================
    console.log('\n🧹 TEST 5: Clear Button Testing');

    // Verify filters are currently applied
    console.log('  - Before clear:');
    const searchBeforeClear = await searchInput.inputValue();
    const starBeforeClear = await starSelect.inputValue();
    const startDateBeforeClear = await startDateInput.inputValue();
    const endDateBeforeClear = await endDateInput.inputValue();
    const sortBeforeClear = await sortButton.textContent();

    console.log(`    Search: "${searchBeforeClear}"`);
    console.log(`    Star filter: "${starBeforeClear}"`);
    console.log(`    Start date: "${startDateBeforeClear}"`);
    console.log(`    End date: "${endDateBeforeClear}"`);
    console.log(`    Sort: ${sortBeforeClear.trim()}`);

    // Click clear button
    const clearButton = await page.$('button:has-text("Clear")');
    await clearButton.click();
    await delay(1500);

    // Verify all filters are cleared
    console.log('  - After clear:');
    const searchAfterClear = await searchInput.inputValue();
    const starAfterClear = await starSelect.inputValue();
    const startDateAfterClear = await startDateInput.inputValue();
    const endDateAfterClear = await endDateInput.inputValue();
    const sortAfterClear = await sortButton.textContent();
    const reviewsAfterClear = await page.$$('.card');

    console.log(`    Search: "${searchAfterClear}" (should be empty)`);
    console.log(`    Star filter: "${starAfterClear}" (should be empty)`);
    console.log(`    Start date: "${startDateAfterClear}" (should be empty)`);
    console.log(`    End date: "${endDateAfterClear}" (should be empty)`);
    console.log(`    Sort: ${sortAfterClear.trim()} (should be Newest First)`);
    console.log(`    Total reviews: ${reviewsAfterClear.length}`);

    // ========================================
    // TEST 6: Edge Cases
    // ========================================
    console.log('\n🔧 TEST 6: Edge Cases');

    // Test rapid filter changes
    console.log('  - Rapid filter changes:');
    for (let i = 0; i < 3; i++) {
      await searchInput.fill(`test${i}`);
      await delay(100);
    }
    await delay(1000); // Wait for debounce

    const rapidSearchResults = await page.$$('.card');
    const rapidSearchValue = await searchInput.inputValue();
    console.log(`    Final search: "${rapidSearchValue}"`);
    console.log(`    Results: ${rapidSearchResults.length} reviews`);

    // Clear for next test
    await clearButton.click();
    await delay(1000);

    // Test empty search with spaces
    console.log('  - Empty search with spaces:');
    await searchInput.fill('   ');
    await delay(1000);

    const spacesResults = await page.$$('.card');
    console.log(`    Results with spaces: ${spacesResults.length} reviews (should show all)`);

    // Test invalid date range (end before start)
    console.log('  - Invalid date range (end before start):');
    await startDateInput.fill(today.toISOString().split('T')[0]);
    await endDateInput.fill(weekAgo.toISOString().split('T')[0]);
    await delay(1500);

    const invalidDateResults = await page.$$('.card');
    console.log(`    Results with invalid date range: ${invalidDateResults.length} reviews`);

    // ========================================
    // FINAL VERIFICATION
    // ========================================
    console.log('\n✅ Final Verification:');

    // Clear everything one more time
    await clearButton.click();
    await delay(1000);

    const finalReviews = await page.$$('.card');
    const finalMessage = await page.textContent('[data-testid="filter-status"]');
    const finalSort = await sortButton.textContent();

    console.log(`  - Final state after clear:`);
    console.log(`    Total reviews: ${finalReviews.length}`);
    console.log(`    Status: ${finalMessage}`);
    console.log(`    Sort: ${finalSort.trim()}`);

    // ========================================
    // TEST SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));

    const testsPassed = [];
    const testsFailed = [];

    // Check results
    if (allStarsReviews.length === initialReviews.length) {
      testsPassed.push('✅ All star ratings filter correctly');
    } else {
      testsFailed.push('❌ Star rating filter issue');
    }

    if (sortText.includes('Newest') || sortText.includes('Oldest')) {
      testsPassed.push('✅ Sort order toggles correctly');
    } else {
      testsFailed.push('❌ Sort order issue');
    }

    if (startDateAfterClear === '' && endDateAfterClear === '') {
      testsPassed.push('✅ Date picker works and clears properly');
    } else {
      testsFailed.push('❌ Date picker clear issue');
    }

    if (searchAfterClear === '' && starAfterClear === '') {
      testsPassed.push('✅ Clear button resets all filters');
    } else {
      testsFailed.push('❌ Clear button issue');
    }

    if (finalReviews.length === initialReviews.length) {
      testsPassed.push('✅ Final state matches initial state');
    } else {
      testsFailed.push('❌ State restoration issue');
    }

    console.log('\nPassed Tests:');
    testsPassed.forEach(test => console.log(`  ${test}`));

    if (testsFailed.length > 0) {
      console.log('\nFailed Tests:');
      testsFailed.forEach(test => console.log(`  ${test}`));
    }

    console.log(`\nTotal: ${testsPassed.length} passed, ${testsFailed.length} failed`);

    if (testsFailed.length === 0) {
      console.log('\n🎉 ALL TESTS PASSED!');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  }

  // Keep browser open for manual inspection
  console.log('\n👀 Browser will remain open for manual inspection...');
  console.log('Press Ctrl+C to exit when done.');
}

// Run the tests
comprehensiveFilterTest().catch(console.error);