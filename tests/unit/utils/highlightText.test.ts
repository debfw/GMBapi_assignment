import { highlightText } from "@/utils/highlightText";
import type { ReactElement } from "react";

describe("highlightText", () => {
  it("returns original text when no search term", () => {
    const text = "This is a test review";
    const result = highlightText(text, "");

    expect((result as any).props.children as string).toBe(text);
  });

  it("highlights search term in text", () => {
    const text = "This is a great service recently";
    const searchTerm = "recently";
    const result = highlightText(text, searchTerm);

    // The result should be a JSX element with highlighted text
    expect((result as ReactElement).type).toBe("span");
    // Check that the children array contains the highlighted text
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);
    // Check that there's a mark element with the highlighted text
    expect(
      children.some(
        (child: any) =>
          child &&
          typeof child === "object" &&
          child.type === "mark" &&
          child.props.children === "recently"
      )
    ).toBe(true);
  });

  it("handles case insensitive search", () => {
    const text = "This is a GREAT service";
    const searchTerm = "great";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
  });

  it("escapes special regex characters", () => {
    const text = "This is a test with [special] characters";
    const searchTerm = "[special]";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
  });

  it("handles multiple occurrences", () => {
    const text = "recently I had a great experience recently";
    const searchTerm = "recently";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should have multiple mark elements
    const markElements = children.filter(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );
    expect(markElements).toHaveLength(2);

    // Both mark elements should contain "recently"
    markElements.forEach((mark: any) => {
      expect(mark.props.children).toBe("recently");
    });
  });

  it("handles empty search term", () => {
    const text = "This is a test review";
    const searchTerm = "";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    expect((result as any).props.children).toBe(text);
  });

  it("handles whitespace-only search term", () => {
    const text = "This is a test review";
    const searchTerm = "   ";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    expect((result as any).props.children).toBe(text);
  });

  it("handles search term not found in text", () => {
    const text = "This is a test review";
    const searchTerm = "nonexistent";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should not have any mark elements
    const markElements = children.filter(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );
    expect(markElements).toHaveLength(0);

    // Should have only span elements with the original text
    expect(children).toHaveLength(1);
    expect(children[0].type).toBe("span");
    expect(children[0].props.children).toBe(text);
  });

  it("handles search term at the beginning of text", () => {
    const text = "recently I had a great experience";
    const searchTerm = "recently";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should have a mark element with "recently"
    const markElement = children.find(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );
    expect(markElement).toBeDefined();
    expect(markElement.props.children).toBe("recently");

    // Should have a span element with the rest of the text
    const spanElement = children.find(
      (child: any) =>
        child &&
        typeof child === "object" &&
        child.type === "span" &&
        child.props.children === " I had a great experience"
    );
    expect(spanElement).toBeDefined();
  });

  it("handles search term at the end of text", () => {
    const text = "I had a great experience recently";
    const searchTerm = "recently";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // First element should be a span with the beginning text
    expect(children[0].type).toBe("span");
    expect(children[0].props.children).toBe("I had a great experience ");

    // Second element should be a mark with "recently"
    expect(children[1].type).toBe("mark");
    expect(children[1].props.children).toBe("recently");
  });

  it("handles search term in the middle of text", () => {
    const text = "I recently had a great experience";
    const searchTerm = "recently";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should have 3 elements: span, mark, span
    expect(children).toHaveLength(3);
    expect(children[0].type).toBe("span");
    expect(children[0].props.children).toBe("I ");
    expect(children[1].type).toBe("mark");
    expect(children[1].props.children).toBe("recently");
    expect(children[2].type).toBe("span");
    expect(children[2].props.children).toBe(" had a great experience");
  });

  it("handles overlapping search terms", () => {
    const text = "recentlyrecently";
    const searchTerm = "recently";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should have 2 mark elements
    const markElements = children.filter(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );
    expect(markElements).toHaveLength(2);
  });

  it("handles search term with different cases", () => {
    const text = "This is a GREAT service";
    const searchTerm = "great";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should find and highlight "GREAT" even though case is different
    const markElements = children.filter(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );
    expect(markElements).toHaveLength(1);
    expect(markElements[0].props.children).toBe("GREAT");
  });

  it("handles mark element styling", () => {
    const text = "This is a great service";
    const searchTerm = "great";
    const result = highlightText(text, searchTerm);

    const children = (result as any).props.children;
    const markElement = children.find(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );

    expect(markElement).toBeDefined();
    expect(markElement.props.style).toEqual({
      backgroundColor: "#ffeb3b",
      padding: "0 2px",
      fontWeight: "600",
      borderRadius: "2px",
    });
  });

  it("handles text with only the search term", () => {
    const text = "recently";
    const searchTerm = "recently";
    const result = highlightText(text, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should have a mark element with "recently"
    const markElement = children.find(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );
    expect(markElement).toBeDefined();
    expect(markElement.props.children).toBe("recently");
  });

  it("handles very long text with search term", () => {
    const longText =
      "This is a very long text that contains the word recently multiple times and should be handled properly by the highlight function. The function should work correctly even with very long text content that spans multiple lines and contains various punctuation marks and special characters.";
    const searchTerm = "recently";
    const result = highlightText(longText, searchTerm);

    expect(result.type).toBe("span");
    const children = (result as any).props.children;
    expect(Array.isArray(children)).toBe(true);

    // Should find and highlight "recently"
    const markElements = children.filter(
      (child: any) =>
        child && typeof child === "object" && child.type === "mark"
    );
    expect(markElements.length).toBeGreaterThan(0);
  });
});
