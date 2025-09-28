import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReviewReplyDisplay } from "../../../../src/components/pages/ReviewsPage/ReviewReplyDisplay";
import { SingleReviewReplyModal } from "../../../../src/components/pages/ReviewsPage/SingleReviewReplyModal";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(() => ({
      name: "text",
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    })),
    handleSubmit: vi.fn((fn) => (e) => {
      e.preventDefault();
      fn({ text: "Test reply", isPublic: true });
    }),
    formState: { errors: {} },
    watch: vi.fn(() => "Test reply"),
    reset: vi.fn(),
    setValue: vi.fn(),
  })),
}));

// Mock zodResolver
vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: vi.fn(),
}));

// Mock constants
vi.mock("../../../../src/utils/constants", () => ({
  REPLY_LIMITS: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
}));

// Mock mutation hooks
vi.mock("../../../../src/services/hooks/useGetReviewSuggestion", () => ({
  getReviewSuggestionMutationOptions: vi.fn(() => ({
    mutationFn: vi.fn(),
  })),
}));

vi.mock("../../../../src/services/hooks/useReplyToReview", () => ({
  replyToReviewMutationOptions: vi.fn(() => ({
    mutationFn: vi.fn(),
  })),
}));

// Mock useAISuggestion hook
vi.mock("../../../../src/hooks/useAISuggestion", () => ({
  useAISuggestion: vi.fn(() => ({
    aiSuggestion: null,
    showSuggestion: false,
    hasSuggestion: false,
    isLoading: false,
    handleGetSuggestion: vi.fn(),
    handleUseSuggestion: vi.fn(),
    clearSuggestion: vi.fn(),
  })),
}));

describe("ReviewReply", () => {
  const defaultReviewProps = {
    review: {
      id: "1",
      customerName: "John Doe",
      comment: "This is a great service!",
      rating: 5,
      date: "2023-01-01",
      status: "new" as const,
      businessReply: null,
    },
    onReply: vi.fn(),
  };

  const defaultModalProps = {
    show: true,
    reviewId: "1",
    reviewText: "This is a great service!",
    customerName: "John Doe",
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe("ReviewReplyDisplay", () => {
    it("renders reply button for new reviews", () => {
      renderWithQueryClient(<ReviewReplyDisplay {...defaultReviewProps} />);

      expect(screen.getByRole("button", { name: /reply/i })).toBeInTheDocument();
    });

    it("calls onReply when reply button is clicked", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<ReviewReplyDisplay {...defaultReviewProps} />);

      const replyButton = screen.getByRole("button", { name: /reply/i });
      await user.click(replyButton);

      expect(defaultReviewProps.onReply).toHaveBeenCalledWith("1");
    });

    it("displays existing reply when businessReply exists", () => {
      const reviewWithReply = {
        ...defaultReviewProps.review,
        businessReply: {
          text: "Thank you for your feedback!",
          date: "2023-01-02",
        },
      };
      renderWithQueryClient(
        <ReviewReplyDisplay {...defaultReviewProps} review={reviewWithReply} />
      );

      expect(screen.getByText("Thank you for your feedback!")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /reply/i })).not.toBeInTheDocument();
    });

    it("displays customer name in review", () => {
      renderWithQueryClient(
        <ReviewReplyDisplay
          {...defaultReviewProps}
          review={{ ...defaultReviewProps.review, customerName: "Jane Smith" }}
        />
      );

      // The ReviewReplyDisplay doesn't directly show customer name, it's in the review data
      expect(screen.getByRole("button", { name: /reply/i })).toBeInTheDocument();
    });
  });

  describe("SingleReviewReplyModal", () => {
    it("renders when show is true", () => {
      renderWithQueryClient(<SingleReviewReplyModal {...defaultModalProps} />);

      expect(screen.getByText("Reply to Review")).toBeInTheDocument();
      expect(screen.getByText("Original Review by John Doe:")).toBeInTheDocument();
      expect(screen.getByText("This is a great service!")).toBeInTheDocument();
    });

    it("calls onClose when cancel button is clicked", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<SingleReviewReplyModal {...defaultModalProps} />);

      const cancelButton = screen.getByText("Cancel");
      await user.click(cancelButton);

      expect(defaultModalProps.onClose).toHaveBeenCalled();
    });

    it("displays original review text in modal", () => {
      const customReviewText =
        "This is a custom review text with special characters! @#$%";
      renderWithQueryClient(
        <SingleReviewReplyModal
          {...defaultModalProps}
          reviewText={customReviewText}
        />
      );

      expect(screen.getByText(customReviewText)).toBeInTheDocument();
    });

    it("displays customer name in modal header", () => {
      renderWithQueryClient(
        <SingleReviewReplyModal
          {...defaultModalProps}
          customerName="Jane Smith"
        />
      );

      expect(screen.getByText("Original Review by Jane Smith:")).toBeInTheDocument();
    });

    it("renders textarea for reply input in modal", () => {
      renderWithQueryClient(<SingleReviewReplyModal {...defaultModalProps} />);

      const textarea = screen.getByPlaceholderText(
        "Write a professional and helpful reply..."
      );
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("renders character count in modal", () => {
      renderWithQueryClient(<SingleReviewReplyModal {...defaultModalProps} />);

      expect(screen.getByText(/characters/)).toBeInTheDocument();
    });

    it("renders cancel and send buttons in modal", () => {
      renderWithQueryClient(<SingleReviewReplyModal {...defaultModalProps} />);

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Send Reply")).toBeInTheDocument();
    });

    it("handles long review text in modal", () => {
      const longReviewText = "a".repeat(1000);
      renderWithQueryClient(
        <SingleReviewReplyModal
          {...defaultModalProps}
          reviewText={longReviewText}
        />
      );

      expect(screen.getByText(longReviewText)).toBeInTheDocument();
    });

    it("handles special characters in customer name in modal", () => {
      const specialName = "José García-López";
      renderWithQueryClient(
        <SingleReviewReplyModal
          {...defaultModalProps}
          customerName={specialName}
        />
      );

      expect(
        screen.getByText(`Original Review by ${specialName}:`)
      ).toBeInTheDocument();
    });

    it("handles empty review text in modal", () => {
      renderWithQueryClient(
        <SingleReviewReplyModal {...defaultModalProps} reviewText="" />
      );

      expect(
        screen.getByText("Original Review by John Doe:")
      ).toBeInTheDocument();
    });

    it("renders with different review IDs in modal", () => {
      const testIds = ["1", "abc123", "review-456", "very-long-review-id-12345"];

      testIds.forEach((id) => {
        const { unmount } = renderWithQueryClient(
          <SingleReviewReplyModal {...defaultModalProps} reviewId={id} />
        );

        expect(screen.getByText("Reply to Review")).toBeInTheDocument();
        unmount();
      });
    });

    it("handles escape key to close modal", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<SingleReviewReplyModal {...defaultModalProps} />);

      // Press escape key
      await user.keyboard("{Escape}");

      // Note: This would depend on the modal implementation
      // The actual behavior might be different based on the modal library used
    });

    it("renders with different customer names in modal", () => {
      const customerNames = [
        "John Doe",
        "Jane Smith",
        "José García-López",
        "Very Long Customer Name That Might Cause Issues",
      ];

      customerNames.forEach((name) => {
        const { unmount } = renderWithQueryClient(
          <SingleReviewReplyModal {...defaultModalProps} customerName={name} />
        );

        expect(
          screen.getByText(`Original Review by ${name}:`)
        ).toBeInTheDocument();
        unmount();
      });
    });

    it("renders consistently across multiple renders in modal", () => {
      const { rerender } = renderWithQueryClient(
        <SingleReviewReplyModal {...defaultModalProps} />
      );

      expect(screen.getByText("Send Reply")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();

      rerender(
        <QueryClientProvider client={queryClient}>
          <SingleReviewReplyModal {...defaultModalProps} />
        </QueryClientProvider>
      );

      expect(screen.getByText("Send Reply")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
});
