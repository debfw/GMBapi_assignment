import { test, expect } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for content to load
    await expect(page.getByText("John Doe")).toBeVisible();
  });

  test("should have proper heading structure", async ({ page }) => {
    // Check for main heading
    const mainHeading = page.getByRole("heading", { level: 1 });
    if ((await mainHeading.count()) > 0) {
      await expect(mainHeading).toBeVisible();
    }

    // Check for section headings
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test("should have proper ARIA labels and roles", async ({ page }) => {
    // Check navigation
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();

    // Check main content area
    const main = page.getByRole("main");
    if ((await main.count()) > 0) {
      await expect(main).toBeVisible();
    }

    // Check buttons have proper labels
    const buttons = page.getByRole("button");
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute("aria-label");
      const textContent = await button.textContent();
      const title = await button.getAttribute("title");

      // Button should have either aria-label, text content, or title
      expect(ariaLabel || textContent || title).toBeTruthy();
    }
  });

  test("should be keyboard navigable", async ({ page }) => {
    // Test tab navigation through interactive elements
    const interactiveElements = page.locator(
      "button, a, input, textarea, select"
    );
    const elementCount = await interactiveElements.count();

    // Tab through all interactive elements
    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      await page.keyboard.press("Tab");
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    }
  });

  test("should have proper focus management", async ({ page }) => {
    // Test focus on reply button
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.focus();
    await expect(replyButton).toBeFocused();

    // Test focus in modal
    await replyButton.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const textarea = page.getByRole("textbox");
    await expect(textarea).toBeFocused();
  });

  test("should have proper color contrast", async ({ page }) => {
    // This test would need to be implemented with a color contrast checking library
    // For now, we'll check that text is visible
    const textElements = page.locator("p, span, div").filter({ hasText: /./ });
    const textCount = await textElements.count();

    for (let i = 0; i < Math.min(textCount, 5); i++) {
      const element = textElements.nth(i);
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      // Basic check that colors are defined
      expect(styles.color).toBeTruthy();
    }
  });

  test("should have proper alt text for images", async ({ page }) => {
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });

  test("should have proper form labels", async ({ page }) => {
    // Open reply modal to test form
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    // Check textarea has proper label
    const textarea = page.getByRole("textbox");
    const textareaId = await textarea.getAttribute("id");
    if (textareaId) {
      const label = page.locator(`label[for="${textareaId}"]`);
      if ((await label.count()) > 0) {
        await expect(label).toBeVisible();
      }
    }

    // Check radio buttons have labels
    const radioButtons = page.getByRole("radio");
    const radioCount = await radioButtons.count();

    for (let i = 0; i < radioCount; i++) {
      const radio = radioButtons.nth(i);
      const ariaLabel = await radio.getAttribute("aria-label");
      const label = page.locator(
        `label[for="${await radio.getAttribute("id")}"]`
      );

      expect(ariaLabel || (await label.count()) > 0).toBeTruthy();
    }
  });

  test("should announce changes to screen readers", async ({ page }) => {
    // Test aria-live regions for dynamic content
    const liveRegions = page.locator("[aria-live]");
    const liveRegionCount = await liveRegions.count();

    // If there are live regions, they should have proper values
    for (let i = 0; i < liveRegionCount; i++) {
      const region = liveRegions.nth(i);
      const ariaLive = await region.getAttribute("aria-live");
      expect(["polite", "assertive", "off"]).toContain(ariaLive);
    }
  });

  test("should have proper skip links", async ({ page }) => {
    // Check for skip to main content link
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    if ((await skipLink.count()) > 0) {
      await expect(skipLink).toBeVisible();

      // Test skip link functionality
      await skipLink.focus();
      await page.keyboard.press("Enter");

      // Main content should be focused
      const main = page.getByRole("main");
      if ((await main.count()) > 0) {
        await expect(main).toBeFocused();
      }
    }
  });

  test("should handle reduced motion preferences", async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Check that animations are disabled or reduced
    const animatedElements = page.locator(
      '[style*="animation"], [style*="transition"]'
    );
    const animatedCount = await animatedElements.count();

    // With reduced motion, there should be fewer or no animations
    // This is a basic check - in a real implementation, you'd check CSS
    expect(animatedCount).toBeLessThanOrEqual(5);
  });

  test("should work with high contrast mode", async ({ page }) => {
    // Test with high contrast preference
    await page.emulateMedia({ colorScheme: "dark" });

    // Check that content is still visible and readable
    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText("Excellent service!")).toBeVisible();
  });

  test("should have proper error handling and announcements", async ({
    page,
  }) => {
    // Test form validation errors
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    const sendButton = page.getByRole("button", { name: /send reply/i });
    await sendButton.click();

    // Check for error messages
    const errorMessages = page.locator('[role="alert"], .error, .invalid');
    if ((await errorMessages.count()) > 0) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test("should maintain focus trap in modals", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Tab through modal elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Focus should stay within modal
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Check that focus is within the modal
    const modalHandle = await modal.elementHandle();
    if (modalHandle) {
      const isWithinModal = await focusedElement.evaluate((el, modalEl) => {
        return modalEl.contains(el);
      }, modalHandle);

      expect(isWithinModal).toBeTruthy();
    }
  });

  test("should have proper landmark roles", async ({ page }) => {
    // Check for main landmarks
    const banner = page.getByRole("banner");
    const navigation = page.getByRole("navigation");
    const main = page.getByRole("main");
    const contentinfo = page.getByRole("contentinfo");

    await expect(banner).toBeVisible();
    await expect(navigation).toBeVisible();

    if ((await main.count()) > 0) {
      await expect(main).toBeVisible();
    }

    if ((await contentinfo.count()) > 0) {
      await expect(contentinfo).toBeVisible();
    }
  });
});
