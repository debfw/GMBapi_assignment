import { chromium } from 'playwright';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testDatePicker() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('🚀 Testing Date Picker Functionality...\n');

  try {
    // Navigate to reviews page
    console.log('📍 Navigating to reviews page...');
    await page.goto('http://localhost:3000/reviews', { waitUntil: 'networkidle' });
    await delay(2000);

    // Get initial reviews
    console.log('\n📊 Initial State:');
    const initialReviews = await page.$$('.card');
    console.log(`  Total reviews: ${initialReviews.length}`);

    // Get some review dates to understand the data
    console.log('\n📅 Sample Review Dates:');
    for (let i = 0; i < Math.min(5, initialReviews.length); i++) {
      const dateText = await page.$eval(
        `.card:nth-child(${i + 1}) .text-muted.small`,
        el => el.textContent
      );
      console.log(`  Review ${i + 1}: ${dateText}`);
    }

    // Test date filtering
    console.log('\n🔍 Testing Date Filtering:');
    const startDateInput = await page.$('input[type="date"]:first-of-type');
    const endDateInput = await page.$('input[type="date"]:last-of-type');

    // Test 1: Last 7 days
    console.log('\n1️⃣ Test: Last 7 days');
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    console.log(`  Setting range: ${weekAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`);

    await startDateInput.fill(weekAgo.toISOString().split('T')[0]);
    await endDateInput.fill(today.toISOString().split('T')[0]);
    await delay(2000);

    let filteredReviews = await page.$$('.card');
    let filterStatus = await page.textContent('[data-testid="filter-status"]');
    console.log(`  Results: ${filteredReviews.length} reviews`);
    console.log(`  Status: ${filterStatus}`);

    // Check if reviews are actually within date range
    if (filteredReviews.length > 0) {
      console.log('  Checking first review date:');
      const firstReviewDate = await page.$eval('.card:first-child .text-muted.small', el => el.textContent);
      console.log(`    ${firstReviewDate}`);
    }

    // Clear dates
    await startDateInput.fill('');
    await endDateInput.fill('');
    await delay(1500);

    // Test 2: Last 30 days
    console.log('\n2️⃣ Test: Last 30 days');
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    console.log(`  Setting range: ${monthAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`);

    await startDateInput.fill(monthAgo.toISOString().split('T')[0]);
    await endDateInput.fill(today.toISOString().split('T')[0]);
    await delay(2000);

    filteredReviews = await page.$$('.card');
    filterStatus = await page.textContent('[data-testid="filter-status"]');
    console.log(`  Results: ${filteredReviews.length} reviews`);
    console.log(`  Status: ${filterStatus}`);

    // Clear dates
    await startDateInput.fill('');
    await endDateInput.fill('');
    await delay(1500);

    // Test 3: Specific date range in the past
    console.log('\n3️⃣ Test: Specific past date range');
    const startDate = new Date('2024-09-01');
    const endDate = new Date('2024-09-30');

    console.log(`  Setting range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

    await startDateInput.fill(startDate.toISOString().split('T')[0]);
    await endDateInput.fill(endDate.toISOString().split('T')[0]);
    await delay(2000);

    filteredReviews = await page.$$('.card');
    filterStatus = await page.textContent('[data-testid="filter-status"]');
    console.log(`  Results: ${filteredReviews.length} reviews`);
    console.log(`  Status: ${filterStatus}`);

    // Check actual dates of filtered reviews
    if (filteredReviews.length > 0) {
      console.log('  Verifying filtered dates:');
      for (let i = 0; i < Math.min(3, filteredReviews.length); i++) {
        const dateText = await page.$eval(
          `.card:nth-child(${i + 1}) .text-muted.small`,
          el => el.textContent
        );
        console.log(`    Review ${i + 1}: ${dateText}`);
      }
    }

    // Clear dates
    await startDateInput.fill('');
    await endDateInput.fill('');
    await delay(1500);

    // Test 4: Only start date
    console.log('\n4️⃣ Test: Only start date (from 2024-08-01)');
    await startDateInput.fill('2024-08-01');
    await delay(2000);

    filteredReviews = await page.$$('.card');
    filterStatus = await page.textContent('[data-testid="filter-status"]');
    console.log(`  Results: ${filteredReviews.length} reviews`);
    console.log(`  Status: ${filterStatus}`);

    // Clear
    await startDateInput.fill('');
    await delay(1500);

    // Test 5: Only end date
    console.log('\n5️⃣ Test: Only end date (until 2024-09-30)');
    await endDateInput.fill('2024-09-30');
    await delay(2000);

    filteredReviews = await page.$$('.card');
    filterStatus = await page.textContent('[data-testid="filter-status"]');
    console.log(`  Results: ${filteredReviews.length} reviews`);
    console.log(`  Status: ${filterStatus}`);

    // Clear
    await endDateInput.fill('');
    await delay(1500);

    // Test 6: Future dates (should return no results)
    console.log('\n6️⃣ Test: Future dates (should be 0 results)');
    const futureStart = new Date();
    futureStart.setMonth(today.getMonth() + 1);
    const futureEnd = new Date();
    futureEnd.setMonth(today.getMonth() + 2);

    console.log(`  Setting range: ${futureStart.toISOString().split('T')[0]} to ${futureEnd.toISOString().split('T')[0]}`);

    await startDateInput.fill(futureStart.toISOString().split('T')[0]);
    await endDateInput.fill(futureEnd.toISOString().split('T')[0]);
    await delay(2000);

    filteredReviews = await page.$$('.card');
    filterStatus = await page.textContent('[data-testid="filter-status"]');
    console.log(`  Results: ${filteredReviews.length} reviews (expected: 0)`);
    console.log(`  Status: ${filterStatus}`);

    // Check console logs
    console.log('\n🔍 Checking browser console for API calls...');
    page.on('console', msg => {
      if (msg.text().includes('API Call') || msg.text().includes('Reviews from API')) {
        console.log(`  Console: ${msg.text()}`);
      }
    });

    // Test with combined filters
    console.log('\n7️⃣ Test: Date + Star Rating');
    await startDateInput.fill('');
    await endDateInput.fill('');
    await delay(1000);

    const starSelect = await page.$('select.form-select');
    await starSelect.selectOption('5');
    await startDateInput.fill(monthAgo.toISOString().split('T')[0]);
    await endDateInput.fill(today.toISOString().split('T')[0]);
    await delay(2000);

    filteredReviews = await page.$$('.card');
    filterStatus = await page.textContent('[data-testid="filter-status"]');
    console.log(`  5-star reviews in last 30 days: ${filteredReviews.length}`);
    console.log(`  Status: ${filterStatus}`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 ANALYSIS SUMMARY');
    console.log('='.repeat(50));
    console.log('\nKey Findings:');
    console.log('  - Date filtering appears to be working at API level');
    console.log('  - Need to verify if dates are being sent correctly to API');
    console.log('  - Check if API is returning filtered results properly');
    console.log('  - May need client-side date filtering as fallback');

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    console.error(error.stack);
  }

  console.log('\n👀 Browser remains open for inspection...');
  console.log('Press Ctrl+C to exit.');
}

testDatePicker().catch(console.error);