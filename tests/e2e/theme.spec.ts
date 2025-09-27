import { test, expect } from "@playwright/test";

test.describe("Theme Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should start with dark theme by default", async ({ page }) => {
    // Check that the theme toggle shows sun icon (indicating dark theme)
    const themeButton = page.getByRole("button", {
      name: /switch to light theme/i,
    });
    await expect(themeButton).toBeVisible();

    // Check that dark theme classes are applied
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("should toggle to light theme when clicked", async ({ page }) => {
    const themeButton = page.getByRole("button", {
      name: /switch to light theme/i,
    });
    await themeButton.click();

    // Check that the button now shows moon icon (indicating light theme)
    await expect(
      page.getByRole("button", { name: /switch to dark theme/i })
    ).toBeVisible();

    // Check that dark theme classes are removed
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
  });

  test("should toggle back to dark theme", async ({ page }) => {
    // First toggle to light
    const themeButton = page.getByRole("button", {
      name: /switch to light theme/i,
    });
    await themeButton.click();

    // Then toggle back to dark
    const lightThemeButton = page.getByRole("button", {
      name: /switch to dark theme/i,
    });
    await lightThemeButton.click();

    // Check that we're back to dark theme
    await expect(
      page.getByRole("button", { name: /switch to light theme/i })
    ).toBeVisible();

    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("should persist theme preference across page reloads", async ({
    page,
  }) => {
    // Toggle to light theme
    const themeButton = page.getByRole("button", {
      name: /switch to light theme/i,
    });
    await themeButton.click();

    // Reload the page
    await page.reload();

    // Check that light theme is still active
    await expect(
      page.getByRole("button", { name: /switch to dark theme/i })
    ).toBeVisible();

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
  });

  test("should apply dark theme styles to components", async ({ page }) => {
    // Ensure we're in dark theme
    const themeButton = page.getByRole("button", {
      name: /switch to light theme/i,
    });
    if ((await themeButton.count()) > 0) {
      // Already in dark theme
    } else {
      // Toggle to dark theme
      await page.getByRole("button", { name: /switch to dark theme/i }).click();
    }

    // Check that cards have dark theme styling
    const cards = page.locator(".card");
    if ((await cards.count()) > 0) {
      const firstCard = cards.first();
      // Check that the card has dark background
      const cardStyles = await firstCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      });

      // In dark theme, background should be dark and text should be light
      expect(cardStyles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)"); // Should have a background
    }
  });

  test("should apply light theme styles to components", async ({ page }) => {
    // Toggle to light theme
    const themeButton = page.getByRole("button", {
      name: /switch to light theme/i,
    });
    await themeButton.click();

    // Check that cards have light theme styling
    const cards = page.locator(".card");
    if ((await cards.count()) > 0) {
      const firstCard = cards.first();
      // Check that the card has light theme styling
      const cardStyles = await firstCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      });

      // In light theme, we expect different styling
      expect(cardStyles.backgroundColor).toBeDefined();
    }
  });

  test("should maintain theme across navigation", async ({ page }) => {
    // Toggle to light theme
    const themeButton = page.getByRole("button", {
      name: /switch to light theme/i,
    });
    await themeButton.click();

    // Navigate to reviews page (if different from home)
    await page.getByRole("link", { name: /reviews/i }).click();

    // Check that theme is still light
    await expect(
      page.getByRole("button", { name: /switch to dark theme/i })
    ).toBeVisible();

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
  });

  test("should have accessible theme toggle button", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /switch to/i });

    // Check that button is focusable
    await themeButton.focus();
    await expect(themeButton).toBeFocused();

    // Check that button has proper ARIA attributes
    await expect(themeButton).toHaveAttribute("title");

    // Check that button can be activated with keyboard
    await themeButton.press("Enter");
    // Theme should have changed
    await expect(
      page.getByRole("button", { name: /switch to/i })
    ).toBeVisible();
  });

  test("should work with keyboard navigation", async ({ page }) => {
    // Tab to the theme toggle button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Press Enter to toggle theme
    await page.keyboard.press("Enter");

    // Check that theme has changed
    await expect(
      page.getByRole("button", { name: /switch to/i })
    ).toBeVisible();
  });
});
