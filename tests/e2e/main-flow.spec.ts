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

    // Interact with star rating and reply status selects
    const combos = page.getByRole("combobox");
    const starSelect = combos.nth(0);
    const replyStatusSelect = combos.nth(1);

    await starSelect.selectOption("5");
    await replyStatusSelect.selectOption("replied");

    // Ensure selections have been applied in the DOM
    await expect(starSelect).toHaveValue("5");
    await expect(replyStatusSelect).toHaveValue("replied");
  });

  test("navigate to Locations from the sidebar and back to Reviews", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Locations" }).click();
    await expect(page.getByRole("heading", { level: 2, name: /Locations/ })).toBeVisible();

    await page.getByRole("link", { name: "Reviews" }).click();
    await expect(page.getByTestId("reviews-page")).toBeVisible();
  });

  test("locations page shows pagination or content scaffolding", async ({ page }) => {
    await page.goto("/locations");

    // Header is always present regardless of data
    await expect(page.getByRole("heading", { level: 2, name: /Locations/ })).toBeVisible();

    // Search box exists
    await expect(page.getByPlaceholder("Search locations...")).toBeVisible();
  });
});


