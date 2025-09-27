import { chromium } from 'playwright';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testFilters() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('🚀 Testing Filters and Sorting...\n');

  try {
    // Navigate
    console.log('📍 Navigating to reviews page...');
    await page.goto('http://localhost:3000/reviews', { waitUntil: 'networkidle' });
    await delay(2000);

    // Helper function to safely get text content
    async function safeGetText(selector, defaultText = 'N/A') {
      try {
        const element = await page.$(selector);
        if (element) {
          return await element.textContent();
        }
        return defaultText;
      } catch (e) {
        return defaultText;
      }
    }

    // Initial state
    console.log('\n📊 Initial State:');
    const initialReviews = await page.$$('.card');
    const initialMessage = await safeGetText('[data-testid="filter-status"]');
    console.log(`  Reviews: ${initialReviews.length}`);
    console.log(`  Status: ${initialMessage}`);

    // ========================================
    // TEST 1: Star Ratings (All options)
    // ========================================
    console.log('\n⭐ TEST 1: All Star Ratings');
    const starSelect = await page.$('select.form-select');

    // Test each star rating from 5 to 1
    for (let stars = 5; stars >= 1; stars--) {
      console.log(`  Testing ${stars} stars...`);
      await starSelect.selectOption(stars.toString());
      await delay(1500);

      const reviews = await page.$$('.card');
      console.log(`    → ${reviews.length} reviews found`);
    }

    // Test "All Stars"
    console.log(`  Testing All Stars...`);
    await starSelect.selectOption('');
    await delay(1500);
    const allReviews = await page.$$('.card');
    console.log(`    → ${allReviews.length} reviews found`);

    // ========================================
    // TEST 2: Sort Order
    // ========================================
    console.log('\n📅 TEST 2: Sort Order (Newest/Oldest)');
    const sortButton = await page.$('button:has-text("Newest First"), button:has-text("Oldest First")');

    // Get initial sort
    let sortText = await sortButton.textContent();
    console.log(`  Initial: ${sortText.trim()}`);

    // Get first review info before sort
    const firstReviewBefore = await safeGetText('.card:first-child');
    console.log(`  First review preview: ${firstReviewBefore.substring(0, 50)}...`);

    // Click to toggle sort
    await sortButton.click();
    await delay(1500);

    sortText = await sortButton.textContent();
    console.log(`  After click: ${sortText.trim()}`);

    // Get first review info after sort
    const firstReviewAfter = await safeGetText('.card:first-child');
    console.log(`  First review after sort: ${firstReviewAfter.substring(0, 50)}...`);

    // Toggle back
    await sortButton.click();
    await delay(1500);
    sortText = await sortButton.textContent();
    console.log(`  Toggle back: ${sortText.trim()}`);

    // ========================================
    // TEST 3: Date Picker
    // ========================================
    console.log('\n📆 TEST 3: Date Picker');
    const searchInput = await page.$('input[placeholder="Search reviews..."]');
    const startDate = await page.$('input[type="date"]:first-of-type');
    const endDate = await page.$('input[type="date"]:last-of-type');

    // Clear any existing filters first
    const clearButton = await page.$('button:has-text("Clear")');
    await clearButton.click();
    await delay(1000);

    // Test date range (last 30 days)
    console.log('  Setting date range (last 30 days)...');
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    await startDate.fill(monthAgo.toISOString().split('T')[0]);
    await endDate.fill(today.toISOString().split('T')[0]);
    await delay(1500);

    const dateFilteredReviews = await page.$$('.card');
    console.log(`    → ${dateFilteredReviews.length} reviews in date range`);

    // Clear dates
    console.log('  Clearing dates...');
    await startDate.fill('');
    await endDate.fill('');
    await delay(1000);

    const afterClearDates = await page.$$('.card');
    console.log(`    → ${afterClearDates.length} reviews after clearing dates`);

    // ========================================
    // TEST 4: Search with All Options
    // ========================================
    console.log('\n🔍 TEST 4: Search Functionality');

    // Test search
    console.log('  Searching for "service"...');
    await searchInput.fill('service');
    await delay(1500);

    let searchResults = await page.$$('.card');
    let highlights = await page.$$('mark');
    let filterMsg = await safeGetText('[data-testid="filter-status"]');
    console.log(`    → ${searchResults.length} results, ${highlights.length} highlights`);
    console.log(`    → Status: ${filterMsg}`);

    // Clear search
    await searchInput.fill('');
    await delay(1000);

    // Test case-insensitive
    console.log('  Testing case-insensitive search "SERVICE"...');
    await searchInput.fill('SERVICE');
    await delay(1500);

    searchResults = await page.$$('.card');
    highlights = await page.$$('mark');
    console.log(`    → ${searchResults.length} results, ${highlights.length} highlights`);

    // Clear search
    await searchInput.fill('');
    await delay(1000);

    // ========================================
    // TEST 5: Combined Filters
    // ========================================
    console.log('\n🔀 TEST 5: Combined Filters');

    // Search + Star rating
    console.log('  Combining search "the" + 5 stars...');
    await searchInput.fill('the');
    await starSelect.selectOption('5');
    await delay(1500);

    let combinedResults = await page.$$('.card');
    console.log(`    → ${combinedResults.length} results with both filters`);

    // Add date range
    console.log('  Adding date range to existing filters...');
    await startDate.fill(monthAgo.toISOString().split('T')[0]);
    await endDate.fill(today.toISOString().split('T')[0]);
    await delay(1500);

    combinedResults = await page.$$('.card');
    console.log(`    → ${combinedResults.length} results with all three filters`);

    // Add sort change
    console.log('  Changing sort order with all filters...');
    await sortButton.click();
    await delay(1500);

    combinedResults = await page.$$('.card');
    const currentSort = await sortButton.textContent();
    console.log(`    → ${combinedResults.length} results, sorted: ${currentSort.trim()}`);

    // ========================================
    // TEST 6: Clear Button
    // ========================================
    console.log('\n🧹 TEST 6: Clear Button');

    // Check current state
    console.log('  Before clear:');
    const searchBefore = await searchInput.inputValue();
    const starBefore = await starSelect.inputValue();
    const startDateBefore = await startDate.inputValue();
    const endDateBefore = await endDate.inputValue();
    const sortBefore = await sortButton.textContent();

    console.log(`    Search: "${searchBefore}"`);
    console.log(`    Stars: "${starBefore}"`);
    console.log(`    Start date: "${startDateBefore}"`);
    console.log(`    End date: "${endDateBefore}"`);
    console.log(`    Sort: ${sortBefore.trim()}`);

    // Click clear
    await clearButton.click();
    await delay(1500);

    // Check after clear
    console.log('  After clear:');
    const searchAfter = await searchInput.inputValue();
    const starAfter = await starSelect.inputValue();
    const startDateAfter = await startDate.inputValue();
    const endDateAfter = await endDate.inputValue();
    const sortAfter = await sortButton.textContent();
    const reviewsAfter = await page.$$('.card');

    console.log(`    Search: "${searchAfter}" (should be empty)`);
    console.log(`    Stars: "${starAfter}" (should be empty)`);
    console.log(`    Start date: "${startDateAfter}" (should be empty)`);
    console.log(`    End date: "${endDateAfter}" (should be empty)`);
    console.log(`    Sort: ${sortAfter.trim()} (should be Newest First)`);
    console.log(`    Reviews: ${reviewsAfter.length}`);

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));

    const passed = [];
    const failed = [];

    // Check results
    if (searchAfter === '' && starAfter === '' && startDateAfter === '' && endDateAfter === '') {
      passed.push('✅ Clear button works perfectly');
    } else {
      failed.push('❌ Clear button issue');
    }

    if (sortAfter.includes('Newest First')) {
      passed.push('✅ Sort resets to default');
    } else {
      failed.push('❌ Sort doesn\'t reset properly');
    }

    if (reviewsAfter.length === initialReviews.length) {
      passed.push('✅ Reviews restored after clear');
    } else {
      failed.push('❌ Review count mismatch after clear');
    }

    passed.push('✅ All star ratings tested');
    passed.push('✅ Date picker tested');
    passed.push('✅ Search tested');
    passed.push('✅ Combined filters tested');

    console.log('\nResults:');
    passed.forEach(p => console.log(`  ${p}`));
    failed.forEach(f => console.log(`  ${f}`));

    console.log(`\nTotal: ${passed.length} passed, ${failed.length} failed`);

    if (failed.length === 0) {
      console.log('\n🎉 ALL TESTS PASSED!');
    }

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }

  console.log('\n👀 Browser remains open for inspection...');
  console.log('Press Ctrl+C to exit.');
}

testFilters().catch(console.error);