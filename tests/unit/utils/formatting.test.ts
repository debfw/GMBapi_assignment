import {
  formatDate,
  formatRelativeTime,
  formatRating,
  truncateText,
  formatReviewCount,
} from "@/utils/formatting";

describe("formatting utilities", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = "2024-01-15T10:30:00Z";
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    it("handles invalid date", () => {
      const invalidDate = "invalid-date";
      const formatted = formatDate(invalidDate);
      expect(formatted).toBe("Invalid date");
    });
  });

  describe("formatRelativeTime", () => {
    it("formats recent time correctly", () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const formatted = formatRelativeTime(oneHourAgo.toISOString());
      expect(formatted).toMatch(/hour ago/);
    });

    it("formats days ago correctly", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const formatted = formatRelativeTime(threeDaysAgo.toISOString());
      expect(formatted).toMatch(/days ago/);
    });

    it("handles invalid date", () => {
      const invalidDate = "invalid-date";
      const formatted = formatRelativeTime(invalidDate);
      expect(formatted).toBe("Invalid date");
    });
  });

  describe("formatRating", () => {
    it("formats rating with stars", () => {
      const rating = 4.5;
      const formatted = formatRating(rating);
      expect(formatted).toBe("4.5 stars");
    });

    it("formats whole number rating", () => {
      const rating = 5;
      const formatted = formatRating(rating);
      expect(formatted).toBe("5 stars");
    });

    it("handles zero rating", () => {
      const rating = 0;
      const formatted = formatRating(rating);
      expect(formatted).toBe("0 stars");
    });
  });

  describe("truncateText", () => {
    it("truncates long text", () => {
      const longText = "This is a very long text that should be truncated";
      const truncated = truncateText(longText, 20);
      expect(truncated).toBe("This is a very long ...");
    });

    it("does not truncate short text", () => {
      const shortText = "Short text";
      const truncated = truncateText(shortText, 20);
      expect(truncated).toBe("Short text");
    });

    it("handles empty text", () => {
      const emptyText = "";
      const truncated = truncateText(emptyText, 20);
      expect(truncated).toBe("");
    });

    it("handles text exactly at limit", () => {
      const text = "Exactly twenty chars";
      const truncated = truncateText(text, 20);
      expect(truncated).toBe("Exactly twenty chars");
    });
  });

  describe("formatReviewCount", () => {
    it("formats single review", () => {
      const count = 1;
      const formatted = formatReviewCount(count);
      expect(formatted).toBe("1 review");
    });

    it("formats multiple reviews", () => {
      const count = 5;
      const formatted = formatReviewCount(count);
      expect(formatted).toBe("5 reviews");
    });

    it("formats zero reviews", () => {
      const count = 0;
      const formatted = formatReviewCount(count);
      expect(formatted).toBe("No reviews");
    });

    it("formats large numbers", () => {
      const count = 1000;
      const formatted = formatReviewCount(count);
      expect(formatted).toBe("1000 reviews");
    });
  });
});
