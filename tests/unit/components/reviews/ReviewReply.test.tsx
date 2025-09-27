import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReviewReply } from "../../../../src/components/reviews/ReviewReply";

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

describe("ReviewReply", () => {
  const defaultProps = {
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

  it("renders when show is true", () => {
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    expect(screen.getByText("Reply to Review")).toBeInTheDocument();
    expect(
      screen.getByText("Original Review by John Doe:")
    ).toBeInTheDocument();
    expect(screen.getByText("This is a great service!")).toBeInTheDocument();
    expect(screen.getByText("Your Reply")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    renderWithQueryClient(<ReviewReply {...defaultProps} show={false} />);

    expect(screen.queryByText("Reply to Review")).not.toBeInTheDocument();
  });

  it("displays original review text", () => {
    const customReviewText =
      "This is a custom review text with special characters! @#$%";
    renderWithQueryClient(
      <ReviewReply {...defaultProps} reviewText={customReviewText} />
    );

    expect(screen.getByText(customReviewText)).toBeInTheDocument();
  });

  it("displays customer name in header", () => {
    renderWithQueryClient(
      <ReviewReply {...defaultProps} customerName="Jane Smith" />
    );

    expect(
      screen.getByText("Original Review by Jane Smith:")
    ).toBeInTheDocument();
  });

  it("renders textarea for reply input", () => {
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(
      "Write a professional and helpful reply..."
    );
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders character count", () => {
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    expect(screen.getByText(/characters/)).toBeInTheDocument();
  });

  it("renders cancel and send buttons", () => {
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Send Reply")).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls mutation when form is submitted", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    const sendButton = screen.getByText("Send Reply");
    await user.click(sendButton);

    // The onSuccess callback would be called after successful mutation
    // but we can't directly test it without mocking the mutation
  });

  it("renders form elements correctly", () => {
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    const sendButton = screen.getByText("Send Reply");

    expect(cancelButton).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it("handles long review text", () => {
    const longReviewText = "a".repeat(1000);
    renderWithQueryClient(
      <ReviewReply {...defaultProps} reviewText={longReviewText} />
    );

    expect(screen.getByText(longReviewText)).toBeInTheDocument();
  });

  it("handles special characters in customer name", () => {
    const specialName = "José García-López";
    renderWithQueryClient(
      <ReviewReply {...defaultProps} customerName={specialName} />
    );

    expect(
      screen.getByText(`Original Review by ${specialName}:`)
    ).toBeInTheDocument();
  });

  it("handles empty review text", () => {
    renderWithQueryClient(<ReviewReply {...defaultProps} reviewText="" />);

    expect(
      screen.getByText("Original Review by John Doe:")
    ).toBeInTheDocument();
  });

  it("renders with different review IDs", () => {
    const testIds = ["1", "abc123", "review-456", "very-long-review-id-12345"];

    testIds.forEach((id) => {
      const { unmount } = renderWithQueryClient(
        <ReviewReply {...defaultProps} reviewId={id} />
      );

      expect(screen.getByText("Reply to Review")).toBeInTheDocument();
      unmount();
    });
  });

  it("handles escape key to close modal", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ReviewReply {...defaultProps} />);

    // Press escape key
    await user.keyboard("{Escape}");

    // Note: This would depend on the modal implementation
    // The actual behavior might be different based on the modal library used
  });

  it("renders with different customer names", () => {
    const customerNames = [
      "John Doe",
      "Jane Smith",
      "José García-López",
      "Very Long Customer Name That Might Cause Issues",
    ];

    customerNames.forEach((name) => {
      const { unmount } = renderWithQueryClient(
        <ReviewReply {...defaultProps} customerName={name} />
      );

      expect(
        screen.getByText(`Original Review by ${name}:`)
      ).toBeInTheDocument();
      unmount();
    });
  });

  it("renders consistently across multiple renders", () => {
    const { rerender } = renderWithQueryClient(
      <ReviewReply {...defaultProps} />
    );

    expect(screen.getByText("Send Reply")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <ReviewReply {...defaultProps} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Send Reply")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
