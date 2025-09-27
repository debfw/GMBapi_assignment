import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Invalid date";
  }
};

export const formatRating = (rating: number): string => {
  return `${rating} star${rating !== 1 ? "s" : ""}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const formatReviewCount = (count: number): string => {
  if (count === 0) return "No reviews";
  if (count === 1) return "1 review";
  return `${count} reviews`;
};
