// Domain-specific types that extend the generated API types

// Domain-specific review types
export interface ReviewDomain {
  id: string;
  customerName: string;
  customerPhoto?: string;
  comment: string;
  rating: number;
  date: string;
  status: ReviewStatus;
  locationName?: string;
  helpfulVotes?: number;
  businessReply?: BusinessReply;
}

export interface BusinessReply {
  text: string;
  date: string;
  isPublic: boolean;
}

export type ReviewStatus = "new" | "replied" | "hidden" | "flagged";

// Domain-specific filter types
export interface ReviewFiltersDomain {
  page: number;
  per_page: number;
  star_rating?: number;
  has_reply?: boolean;
  is_deleted?: boolean;
}

// Domain-specific reply types
export interface ReviewReplyDomain {
  reviewId: string;
  text: string;
  isPublic: boolean;
}

// Domain-specific suggestion types
export interface ReviewSuggestionDomain {
  reviewComment: string;
}

export interface ReviewSuggestionResponseDomain {
  suggestion: string;
}

// Domain-specific pagination types
export interface PaginationDomain {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Domain-specific response types
export interface ReviewListResponseDomain {
  reviews: ReviewDomain[];
  pagination: PaginationDomain;
  summary?: ReviewSummaryDomain;
}

export interface ReviewSummaryDomain {
  total: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Service result types
export type ServiceResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ApiError;
    };

// Bulk operation types
export interface BulkReplyRequest {
  reviewIds: string[];
  text: string;
  isPublic: boolean;
}

export interface BulkReplyProgress {
  completed: number;
  total: number;
  currentReview: string | null;
}

// Filter state types
export interface FilterState {
  searchTerm: string;
  selectedStarRating: number | "";
  replyStatus: string;
}

// Component prop types
export interface ReviewCardProps {
  review: ReviewDomain;
  onReply: (reviewId: string) => void;
  className?: string;
}

export interface BulkReplyModalProps {
  show: boolean;
  reviews: ReviewDomain[];
  onClose: () => void;
  onSuccess?: () => void;
}

export interface ReviewReplyModalProps {
  show: boolean;
  reviewId: string;
  reviewText: string;
  customerName: string;
  onClose: () => void;
  onSuccess?: () => void;
}
