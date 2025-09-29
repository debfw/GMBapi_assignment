import { render, screen } from "@testing-library/react";
import { Star, Heart, MessageCircle } from "lucide-react";
import { describe, it, expect } from "vitest";
import { MetricCard } from "@/components/common/MetricCard";

describe("MetricCard", () => {
  const defaultProps = {
    icon: Star,
    label: "Average Rating",
    value: "4.5",
  };

  it("renders with required props", () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText("Average Rating")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("renders with number value", () => {
    render(<MetricCard {...defaultProps} value={42} />);

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders with string value", () => {
    render(<MetricCard {...defaultProps} value="High" />);

    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("applies custom icon color", () => {
    const { container } = render(
      <MetricCard {...defaultProps} iconColor="#ff0000" />
    );

    const icon = container.querySelector("svg");
    expect(icon).toHaveStyle("--metric-card-icon-color: #ff0000");
  });

  it("renders without custom icon color when not provided", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    const icon = container.querySelector("svg");
    expect(icon).not.toHaveStyle("--metric-card-icon-color: #ff0000");
  });

  it("applies custom className", () => {
    const { container } = render(
      <MetricCard {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with different icons", () => {
    const { rerender } = render(<MetricCard {...defaultProps} icon={Heart} />);
    expect(screen.getByText("Average Rating")).toBeInTheDocument();

    rerender(<MetricCard {...defaultProps} icon={MessageCircle} />);
    expect(screen.getByText("Average Rating")).toBeInTheDocument();
  });

  it("has correct icon size", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    const icon = container.querySelector("svg");
    expect(icon).toHaveAttribute("width", "20");
    expect(icon).toHaveAttribute("height", "20");
  });

  it("applies correct styling to value", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    const value = container.querySelector(".fw-bold");
    expect(value).toBeInTheDocument();
    expect(value).toHaveClass("fw-bold", "metric-card-value");
  });

  it("renders with long label text", () => {
    const longLabel = "This is a very long label that should wrap properly";
    render(<MetricCard {...defaultProps} label={longLabel} />);

    expect(screen.getByText(longLabel)).toBeInTheDocument();
  });

  it("renders with long value text", () => {
    const longValue = "This is a very long value that should display correctly";
    render(<MetricCard {...defaultProps} value={longValue} />);

    expect(screen.getByText(longValue)).toBeInTheDocument();
  });

  it("renders with zero value", () => {
    render(<MetricCard {...defaultProps} value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders with empty string value", () => {
    const { container } = render(<MetricCard {...defaultProps} value="" />);

    const valueElement = container.querySelector(".fw-bold");
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveTextContent("");
  });

  it("maintains proper flex layout", () => {
    const { container } = render(<MetricCard {...defaultProps} />);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("d-flex", "align-items-center", "gap-3");
  });

  it("handles special characters in label and value", () => {
    render(
      <MetricCard {...defaultProps} label="Rating & Reviews" value="4.5 ⭐" />
    );

    expect(screen.getByText("Rating & Reviews")).toBeInTheDocument();
    expect(screen.getByText("4.5 ⭐")).toBeInTheDocument();
  });

  it("renders with different numeric values", () => {
    const testValues = [0, 1, 42, 100, 1000, 4.5, 3.14, -5];

    testValues.forEach((value) => {
      const { unmount } = render(
        <MetricCard {...defaultProps} value={value} />
      );
      expect(screen.getByText(value.toString())).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with boolean-like values", () => {
    render(<MetricCard {...defaultProps} value="true" />);
    expect(screen.getByText("true")).toBeInTheDocument();

    render(<MetricCard {...defaultProps} value="false" />);
    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("handles undefined and null values gracefully", () => {
    const { container: container1 } = render(
      <MetricCard {...defaultProps} value={undefined} />
    );
    const valueElement1 = container1.querySelector(".fw-bold");
    expect(valueElement1).toHaveTextContent("");

    const { container: container2 } = render(
      <MetricCard {...defaultProps} value={null} />
    );
    const valueElement2 = container2.querySelector(".fw-bold");
    expect(valueElement2).toHaveTextContent("");
  });
});
