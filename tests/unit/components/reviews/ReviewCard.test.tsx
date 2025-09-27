import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ReviewCard } from "../../../../src/components/reviews/ReviewCard";
import type { Review } from "../../../../src/services/types";

// Mock the utility functions
vi.mock("../../../../src/utils/formatting", () => ({
  formatDate: vi.fn((date) => `Formatted: ${date}`),
  formatRelativeTime: vi.fn((date) => `Relative: ${date}`),
  truncateText: vi.fn((text, maxLength) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  ),
}));

vi.mock("../../../../src/utils/highlightText", () => ({
  highlightText: vi.fn((text, searchTerm) =>
    searchTerm ? <span>{text}</span> : text
  ),
}));

describe("ReviewCard", () => {
  const mockReview: Review = {
    id: "1",
    locationId: "1",
    comment: "This is a great service! I highly recommend it to everyone.",
    customerName: "John Doe",
    rating: 5,
    date: "2024-01-15T00:00:00Z",
    status: "new",
    businessReply: undefined,
    customerPhoto: undefined,
    locationName: "Main Street Location",
    helpfulVotes: 3,
  };

  const defaultProps = {
    review: mockReview,
    onReply: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with required props", () => {
    render(<ReviewCard {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is a great service! I highly recommend it to everyone."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Relative: 2024-01-15T00:00:00Z")).toBeInTheDocument();
  });

  it("renders star rating correctly", () => {
    render(<ReviewCard {...defaultProps} />);

    // Should render 5 stars
    const stars = screen.getAllByTestId(/star-/);
    expect(stars).toHaveLength(5);

    // First 5 stars should be filled (rating is 5)
    stars.forEach((star, index) => {
      if (index < 5) {
        expect(star).toHaveClass("text-warning", "fill-current");
      } else {
        expect(star).toHaveClass("text-muted");
      }
    });
  });

  it("renders different star ratings", () => {
    const { rerender } = render(
      <ReviewCard {...defaultProps} review={{ ...mockReview, rating: 3 }} />
    );

    const stars = screen.getAllByTestId(/star-/);
    expect(stars).toHaveLength(5);

    // First 3 stars should be filled
    stars.forEach((star, index) => {
      if (index < 3) {
        expect(star).toHaveClass("text-warning", "fill-current");
      } else {
        expect(star).toHaveClass("text-muted");
      }
    });

    // Test 1 star rating
    rerender(
      <ReviewCard {...defaultProps} review={{ ...mockReview, rating: 1 }} />
    );

    const newStars = screen.getAllByTestId(/star-/);
    newStars.forEach((star, index) => {
      if (index < 1) {
        expect(star).toHaveClass("text-warning", "fill-current");
      } else {
        expect(star).toHaveClass("text-muted");
      }
    });
  });

  it("renders status badge correctly", () => {
    const { rerender } = render(<ReviewCard {...defaultProps} />);

    expect(screen.getByText("New")).toBeInTheDocument();

    // Test different statuses
    rerender(
      <ReviewCard
        {...defaultProps}
        review={{ ...mockReview, status: "replied" }}
      />
    );
    expect(screen.getByText("Replied")).toBeInTheDocument();

    rerender(
      <ReviewCard
        {...defaultProps}
        review={{ ...mockReview, status: "hidden" }}
      />
    );
    expect(screen.getByText("Hidden")).toBeInTheDocument();

    rerender(
      <ReviewCard
        {...defaultProps}
        review={{ ...mockReview, status: "flagged" }}
      />
    );
    expect(screen.getByText("Flagged")).toBeInTheDocument();
  });

  it("renders customer photo when provided", () => {
    const reviewWithPhoto = {
      ...mockReview,
      customerPhoto: "https://example.com/photo.jpg",
    };

    render(<ReviewCard {...defaultProps} review={reviewWithPhoto} />);

    const image = screen.getByAltText("John Doe");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("renders user icon when no photo provided", () => {
    render(<ReviewCard {...defaultProps} />);

    const userIcon = screen.getByTestId("user-icon");
    expect(userIcon).toBeInTheDocument();
  });

  it("renders business reply when provided", () => {
    const reviewWithReply = {
      ...mockReview,
      businessReply: {
        id: "reply-1",
        text: "Thank you for your feedback!",
        date: "2024-01-16T00:00:00Z",
        isPublic: true,
      },
    };

    render(<ReviewCard {...defaultProps} review={reviewWithReply} />);

    expect(screen.getByText("Reply")).toBeInTheDocument();
    expect(
      screen.getByText("Thank you for your feedback!")
    ).toBeInTheDocument();
    expect(screen.getByText("(Relative: 2024-01-16T00:00:00Z)")).toBeInTheDocument();
  });

  it("renders location name when provided", () => {
    render(<ReviewCard {...defaultProps} />);

    expect(screen.getByText("📍 Main Street Location")).toBeInTheDocument();
  });

  it("renders helpful votes when provided", () => {
    render(<ReviewCard {...defaultProps} />);

    expect(screen.getByText("👍 3 helpful")).toBeInTheDocument();
  });

  it("does not render helpful votes when zero or undefined", () => {
    const { rerender } = render(
      <ReviewCard
        {...defaultProps}
        review={{ ...mockReview, helpfulVotes: 0 }}
      />
    );

    expect(screen.queryByText(/helpful/)).not.toBeInTheDocument();

    rerender(
      <ReviewCard
        {...defaultProps}
        review={{ ...mockReview, helpfulVotes: undefined }}
      />
    );

    expect(screen.queryByText(/helpful/)).not.toBeInTheDocument();
  });

  it("renders reply button for new reviews", () => {
    render(<ReviewCard {...defaultProps} />);

    const replyButton = screen.getByRole("button", { name: /Reply/i });
    expect(replyButton).toBeInTheDocument();
    expect(replyButton).toHaveClass(
      "btn",
      "btn-outline-primary"
    );
  });

  it("does not render reply button for non-new reviews", () => {
    const { rerender } = render(
      <ReviewCard
        {...defaultProps}
        review={{ ...mockReview, status: "replied" }}
      />
    );

    expect(screen.queryByRole("button", { name: /Reply/i })).not.toBeInTheDocument();

    rerender(
      <ReviewCard
        {...defaultProps}
        review={{ ...mockReview, status: "hidden" }}
      />
    );

    expect(screen.queryByRole("button", { name: /Reply/i })).not.toBeInTheDocument();
  });

  it("calls onReply when reply button is clicked", () => {
    const mockOnReply = vi.fn();
    render(<ReviewCard {...defaultProps} onReply={mockOnReply} />);

    const replyButton = screen.getByRole("button", { name: /Reply/i });
    fireEvent.click(replyButton);

    expect(mockOnReply).toHaveBeenCalledWith("1");
  });

  it("handles text truncation for long comments", () => {
    const longComment = "a".repeat(300);
    const reviewWithLongComment = {
      ...mockReview,
      comment: longComment,
    };

    render(<ReviewCard {...defaultProps} review={reviewWithLongComment} />);

    // Should show truncated text with "Show more" button
    expect(screen.getByText("Show more")).toBeInTheDocument();
  });

  it("expands and collapses long text", () => {
    const longComment = "a".repeat(300);
    const reviewWithLongComment = {
      ...mockReview,
      comment: longComment,
    };

    render(<ReviewCard {...defaultProps} review={reviewWithLongComment} />);

    const showMoreButton = screen.getByText("Show more");
    fireEvent.click(showMoreButton);

    expect(screen.getByText("Show less")).toBeInTheDocument();

    const showLessButton = screen.getByText("Show less");
    fireEvent.click(showLessButton);

    expect(screen.getByText("Show more")).toBeInTheDocument();
  });

  it("renders with proper accessibility attributes", () => {
    render(<ReviewCard {...defaultProps} />);

    // Check that stars have proper test IDs for accessibility
    const stars = screen.getAllByTestId(/star-/);
    expect(stars).toHaveLength(5);

    // Check that user icon has proper test ID
    const userIcon = screen.getByTestId("user-icon");
    expect(userIcon).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ReviewCard {...defaultProps} className="custom-class" />
    );

    const card = container.querySelector(".card");
    expect(card).toHaveClass("custom-class");
  });

  it("handles missing optional fields gracefully", () => {
    const minimalReview = {
      id: "1",
      locationId: "1",
      comment: "Test comment",
      customerName: "Test User",
      rating: 3,
      date: "2024-01-15T00:00:00Z",
      status: "new",
    } as Review;

    render(<ReviewCard {...defaultProps} review={minimalReview} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Test comment")).toBeInTheDocument();
    expect(screen.queryByText(/📍/)).not.toBeInTheDocument();
    expect(screen.queryByText(/👍/)).not.toBeInTheDocument();
  });

  it("renders with different customer names", () => {
    const testNames = [
      "John Doe",
      "Jane Smith",
      "José García",
      "李小明",
      "User with very long name that might wrap",
    ];

    testNames.forEach((name) => {
      const { unmount } = render(
        <ReviewCard
          {...defaultProps}
          review={{ ...mockReview, customerName: name }}
        />
      );

      expect(screen.getByText(name)).toBeInTheDocument();
      unmount();
    });
  });

  it("handles special characters in comment", () => {
    const specialComment = "Great service! 👍😊 #awesome @mention $100";
    const reviewWithSpecialChars = {
      ...mockReview,
      comment: specialComment,
    };

    render(<ReviewCard {...defaultProps} review={reviewWithSpecialChars} />);

    expect(screen.getByText(specialComment)).toBeInTheDocument();
  });

  it("renders with different date formats", () => {
    const testDates = [
      "2024-01-15",
      "2023-12-31",
      "2024-02-29", // Leap year
      "2024-01-01T00:00:00Z",
    ];

    testDates.forEach((date) => {
      const { unmount } = render(
        <ReviewCard {...defaultProps} review={{ ...mockReview, date }} />
      );

      expect(screen.getByText(`Relative: ${date}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("maintains proper card structure", () => {
    const { container } = render(<ReviewCard {...defaultProps} />);

    const card = container.querySelector(".card");
    expect(card).toBeInTheDocument();

    const cardBody = container.querySelector(".card-body");
    expect(cardBody).toBeInTheDocument();

    const row = container.querySelector(".row");
    expect(row).toBeInTheDocument();
  });

  it("handles edge case with empty comment", () => {
    const reviewWithEmptyComment = {
      ...mockReview,
      comment: "",
    };

    render(<ReviewCard {...defaultProps} review={reviewWithEmptyComment} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    // Empty comment should not cause issues
  });

  it("handles edge case with very short comment", () => {
    const reviewWithShortComment = {
      ...mockReview,
      comment: "OK",
    };

    render(<ReviewCard {...defaultProps} review={reviewWithShortComment} />);

    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
  });
});
