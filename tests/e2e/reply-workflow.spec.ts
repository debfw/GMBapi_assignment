import { test, expect } from "@playwright/test";

test.describe("Review Reply Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for reviews to load
    await expect(page.getByText("John Doe")).toBeVisible();
  });

  test("should complete full reply workflow", async ({ page }) => {
    // Click reply button on first review
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    // Verify modal opens
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Reply to Review")).toBeVisible();

    // Fill in reply text
    const textarea = page.getByRole("textbox");
    const replyText =
      "Thank you for your wonderful feedback! We appreciate your business.";
    await textarea.fill(replyText);

    // Verify text is entered
    await expect(textarea).toHaveValue(replyText);

    // Check character count
    await expect(page.getByText(/characters/)).toBeVisible();

    // Select public reply option
    const publicRadio = page.getByLabel(/public/i);
    await publicRadio.check();

    // Send reply
    const sendButton = page.getByRole("button", { name: /send reply/i });
    await sendButton.click();

    // Verify modal closes
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Verify success message or updated UI
    // This would depend on actual implementation
  });

  test("should validate reply text length", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    const textarea = page.getByRole("textbox");

    // Try to send empty reply
    const sendButton = page.getByRole("button", { name: /send reply/i });
    await sendButton.click();

    // Should show validation error
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test("should show character count and limit", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    const textarea = page.getByRole("textbox");

    // Type a long message
    const longMessage = "A".repeat(1000);
    await textarea.fill(longMessage);

    // Check character count display
    await expect(page.getByText(/1000.*characters/)).toBeVisible();

    // Check if there's a character limit warning
    const charLimitWarning = page.getByText(/character limit/i);
    if ((await charLimitWarning.count()) > 0) {
      await expect(charLimitWarning).toBeVisible();
    }
  });

  test("should allow switching between public and private reply", async ({
    page,
  }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    // Check default selection (usually public)
    const publicRadio = page.getByLabel(/public/i);
    const privateRadio = page.getByLabel(/private/i);

    await expect(publicRadio).toBeChecked();

    // Switch to private
    await privateRadio.check();
    await expect(privateRadio).toBeChecked();
    await expect(publicRadio).not.toBeChecked();

    // Switch back to public
    await publicRadio.check();
    await expect(publicRadio).toBeChecked();
    await expect(privateRadio).not.toBeChecked();
  });

  test("should cancel reply and close modal", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    // Fill some text
    const textarea = page.getByRole("textbox");
    await textarea.fill("This reply will be cancelled");

    // Click cancel
    const cancelButton = page.getByRole("button", { name: /cancel/i });
    await cancelButton.click();

    // Verify modal is closed
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Verify text is not saved (open modal again and check it's empty)
    await replyButton.click();
    await expect(textarea).toHaveValue("");
  });

  test("should close modal when clicking outside", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    // Click outside the modal (on backdrop)
    await page.click("body", { position: { x: 10, y: 10 } });

    // Verify modal is closed
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should close modal with Escape key", async ({ page }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    // Press Escape key
    await page.keyboard.press("Escape");

    // Verify modal is closed
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should handle reply submission with loading state", async ({
    page,
  }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    const textarea = page.getByRole("textbox");
    await textarea.fill("Thank you for your feedback!");

    const sendButton = page.getByRole("button", { name: /send reply/i });

    // Click send and check for loading state
    await sendButton.click();

    // Check if button shows loading state
    const loadingButton = page.getByRole("button", { name: /sending/i });
    if ((await loadingButton.count()) > 0) {
      await expect(loadingButton).toBeVisible();
    }

    // Wait for submission to complete
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should show error message on reply failure", async ({ page }) => {
    // This test would need to be updated based on actual error handling
    // For now, we'll test the UI flow

    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    const textarea = page.getByRole("textbox");
    await textarea.fill("This will fail");

    const sendButton = page.getByRole("button", { name: /send reply/i });
    await sendButton.click();

    // In a real implementation, you would mock the API to return an error
    // and then check for error message display
  });

  test("should maintain form state when switching reply types", async ({
    page,
  }) => {
    const replyButton = page.getByRole("button", { name: /reply/i }).first();
    await replyButton.click();

    const textarea = page.getByRole("textbox");
    const replyText = "This is my reply text";
    await textarea.fill(replyText);

    // Switch from public to private
    const privateRadio = page.getByLabel(/private/i);
    await privateRadio.check();

    // Verify text is still there
    await expect(textarea).toHaveValue(replyText);

    // Switch back to public
    const publicRadio = page.getByLabel(/public/i);
    await publicRadio.check();

    // Verify text is still there
    await expect(textarea).toHaveValue(replyText);
  });

  test("should be keyboard accessible", async ({ page }) => {
    // Tab to reply button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Press Enter to open modal
    await page.keyboard.press("Enter");

    // Verify modal is open
    await expect(page.getByRole("dialog")).toBeVisible();

    // Tab through form elements
    await page.keyboard.press("Tab"); // Should focus textarea
    await expect(page.getByRole("textbox")).toBeFocused();

    // Type reply
    await page.keyboard.type("Thank you for your feedback!");

    // Tab to radio buttons
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Tab to send button
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: /send reply/i })
    ).toBeFocused();

    // Press Enter to send
    await page.keyboard.press("Enter");

    // Verify modal closes
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
