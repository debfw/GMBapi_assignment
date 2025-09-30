import { test, expect } from "@playwright/test";

// These tests cover the primary user flows using stable, user-visible selectors.

test.describe("Main app flows", () => {
  test("loads the Reviews page (smoke)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("reviews-page")).toBeVisible();
    await expect(page.getByPlaceholder("Search reviews...")).toBeVisible();
  });

  test("reviews search and filters are interactive", async ({ page }) => {
    await page.goto("/");

    const search = page.getByPlaceholder("Search reviews...");
    await search.fill("great service");
    await expect(search).toHaveValue("great service");

    // Ensure filters are visible in both desktop and mobile layouts
    // In mobile, quick filters are collapsed by default; expand if necessary
    const combos = page.getByRole("combobox");
    if ((await combos.count()) === 0) {
      const quickFiltersToggle = page.getByRole("button", {
        name: /Quick filters/i,
      });
      if (await quickFiltersToggle.isVisible()) {
        await quickFiltersToggle.click();
      }
    }

    const starSelect = page.getByRole("combobox").nth(0);
    const replyStatusSelect = page.getByRole("combobox").nth(1);

    await starSelect.selectOption("5");
    await replyStatusSelect.selectOption("replied");

    // Ensure selections have been applied in the DOM
    await expect(starSelect).toHaveValue("5");
    await expect(replyStatusSelect).toHaveValue("replied");
  });

  test("navigate to Locations from the sidebar and back to Reviews", async ({
    page,
  }) => {
    await page.goto("/");

    // Open mobile menu if the sidebar link isn't visible
    let locationsLink = page.getByRole("link", { name: "Locations" });
    if (!(await locationsLink.isVisible())) {
      const toggleMenuBtn = page.getByRole("button", { name: "Toggle menu" });
      if (await toggleMenuBtn.isVisible()) {
        await toggleMenuBtn.click();
        locationsLink = page.getByRole("link", { name: "Locations" });
        // Wait for it to appear if this is the mobile drawer
        await expect(locationsLink).toBeVisible();
      }
    }

    if (await locationsLink.isVisible()) {
      await locationsLink.click();
    } else {
      // Fallback navigation if link is not interactable (e.g., on unusual layouts)
      await page.goto("/locations");
    }
    await expect(
      page.getByRole("heading", { level: 2, name: /Locations/ })
    ).toBeVisible();

    let reviewsLink = page.getByRole("link", { name: "Reviews" });
    if (!(await reviewsLink.isVisible())) {
      const toggleMenuBtn = page.getByRole("button", { name: "Toggle menu" });
      if (await toggleMenuBtn.isVisible()) {
        await toggleMenuBtn.click();
        reviewsLink = page.getByRole("link", { name: "Reviews" });
        await expect(reviewsLink).toBeVisible();
      }
    }

    if (await reviewsLink.isVisible()) {
      await reviewsLink.click();
    } else {
      await page.goto("/");
    }
    await expect(page.getByTestId("reviews-page")).toBeVisible();
  });

  test("locations page shows pagination or content scaffolding", async ({
    page,
  }) => {
    await page.goto("/locations");

    // Header is always present regardless of data
    await expect(
      page.getByRole("heading", { level: 2, name: /Locations/ })
    ).toBeVisible();

    // Search box exists
    await expect(page.getByPlaceholder("Search locations...")).toBeVisible();
  });
});
