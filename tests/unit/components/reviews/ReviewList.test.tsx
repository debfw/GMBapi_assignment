import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ReviewList } from "../../../../src/components/common";
import type {
  Review,
  Pagination as PaginationType,
} from "../../../../src/services/types";

// Mock the child components
vi.mock("../../../../src/components/pages/ReviewsPage/ReviewCard", () => ({
  ReviewCard: ({ review, onReply }: any) => (
    <div data-testid={`review-card-${review.id}`}>
      <div>{review.customerName}</div>
      <div>{review.comment}</div>
      <button onClick={() => onReply(review.id)}>Reply</button>
    </div>
  ),
}));

vi.mock("../../../../src/components/common/ReviewPagination", () => ({
  ReviewPagination: ({ pagination, onPageChange }: any) => (
    <div data-testid="pagination">
      <div>
        Page {pagination.page} of {pagination.totalPages}
      </div>
      <button onClick={() => onPageChange(2)}>Next Page</button>
    </div>
  ),
}));

vi.mock("../../../../src/components/common/LoadingSpinner", () => ({
  LoadingSpinner: ({ size, text }: any) => (
    <div data-testid="loading-spinner" data-size={size}>
      {text}
    </div>
  ),
}));

describe("ReviewList", () => {
  const mockReviews: Review[] = [
    {
      id: "1",
      locationId: "1",
      comment: "Great service!",
      customerName: "John Doe",
      rating: 5,
      date: "2024-01-15T00:00:00Z",
      status: "new",
      helpfulVotes: 3,
      businessReply: undefined,
    },
    {
      id: "2",
      locationId: "2",
      comment: "Could be better",
      customerName: "Jane Smith",
      rating: 3,
      date: "2024-01-14T00:00:00Z",
      status: "replied",
      helpfulVotes: 1,
      businessReply: {
        id: "reply-1",
        text: "Thank you for your feedback!",
        date: "2024-01-16T00:00:00Z",
        isPublic: true,
      },
    },
  ];

  const mockPagination: PaginationType = {
    page: 1,
    limit: 10,
    total: 20,
    totalPages: 2,
    hasNext: true,
    hasPrev: false,
  };

  const defaultProps = {
    reviews: mockReviews,
    onReply: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders reviews when provided", () => {
    render(<ReviewList {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Great service!")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Could be better")).toBeInTheDocument();
  });

  it("renders loading spinner when loading is true", () => {
    render(<ReviewList {...defaultProps} loading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toHaveAttribute(
      "data-size",
      "lg"
    );
    expect(screen.getByText("Loading reviews...")).toBeInTheDocument();
  });

  it("renders no reviews message when reviews array is empty", () => {
    render(<ReviewList {...defaultProps} reviews={[]} />);

    expect(screen.getByText("No reviews found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Try adjusting your filters or check back later for new reviews."
      )
    ).toBeInTheDocument();
  });

  it("renders pagination when provided", () => {
    render(
      <ReviewList
        {...defaultProps}
        pagination={mockPagination}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("does not render pagination when onPageChange is not provided", () => {
    render(<ReviewList {...defaultProps} pagination={mockPagination} />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("does not render pagination when pagination is not provided", () => {
    render(<ReviewList {...defaultProps} />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ReviewList {...defaultProps} className="custom-class" />
    );

    const containerElement = container.querySelector(".container");
    expect(containerElement).toHaveClass("custom-class");
  });

  it("handles error with existing reviews (shows reviews)", () => {
    render(<ReviewList {...defaultProps} error="Some error occurred" />);

    // Should still show reviews when there are reviews present
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders with different review counts", () => {
    const singleReview = [mockReviews[0]];
    const { rerender } = render(
      <ReviewList {...defaultProps} reviews={singleReview} />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();

    const manyReviews = Array.from({ length: 10 }, (_, i) => ({
      ...mockReviews[0],
      id: `${i + 1}`,
      customerName: `User ${i + 1}`,
    }));

    rerender(<ReviewList {...defaultProps} reviews={manyReviews} />);

    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 10")).toBeInTheDocument();
  });

  it("maintains proper container structure", () => {
    const { container } = render(<ReviewList {...defaultProps} />);

    const containerElement = container.querySelector(".container");
    expect(containerElement).toBeInTheDocument();

    const row = container.querySelector(".row");
    expect(row).toBeInTheDocument();

    const col = container.querySelector(".col");
    expect(col).toBeInTheDocument();

    const reviewsList = screen.getByTestId("reviews-list");
    expect(reviewsList).toBeInTheDocument();
  });

  it("handles edge case with undefined reviews", () => {
    render(<ReviewList {...defaultProps} reviews={undefined as any} />);

    // Should not crash and should show no reviews message
    expect(screen.getByText("No reviews found")).toBeInTheDocument();
  });

  it("handles edge case with null reviews", () => {
    render(<ReviewList {...defaultProps} reviews={null as any} />);

    // Should not crash and should show no reviews message
    expect(screen.getByText("No reviews found")).toBeInTheDocument();
  });

  it("renders with different loading states", () => {
    const { rerender } = render(
      <ReviewList {...defaultProps} loading={false} />
    );

    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();

    rerender(<ReviewList {...defaultProps} loading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
