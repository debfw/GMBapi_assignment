import React from "react";
import { Button } from "react-bootstrap";
import {
  Users,
  List,
  Cloud,
  RotateCcw,
  RotateCcw as ClearIcon,
} from "lucide-react";
import type { FilterState } from "@/hooks/useReviewsFilters";

interface ReviewsFiltersProps {
  filterState: FilterState;
  onStarRatingChange: (value: string) => void;
  onClearFilters: () => void;
  onReplyStatusChange: (value: string) => void;
  onBulkReply: () => void;
  onExportReviews: () => void;
  onImportReviews: () => void;
  onRefreshReviews: () => void;
  className?: string;
}

export const ReviewsFilters: React.FC<ReviewsFiltersProps> = ({
  filterState,
  onStarRatingChange,
  onClearFilters,
  onReplyStatusChange,
  onBulkReply,
  onExportReviews,
  onImportReviews,
  onRefreshReviews,
  className = "",
}) => {
  return (
    <div
      className={`rounded-3 shadow-sm border-0 p-3 reviews-filters-container ${className}`}
    >
      {/* Single Row with Quick Filters and Action Buttons */}
      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
        {/* Left Side - Quick Filters */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <span className="text-muted small reviews-filters-quick-label">
            Quick filters:
          </span>

          {/* Star Rating Filter */}
          <div className="reviews-filters-star-select">
            <select
              className="form-select reviews-filters-star-select-field"
              value={filterState.selectedStarRating}
              onChange={(e) => onStarRatingChange(e.target.value)}
            >
              <option value="">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {/* Reply Status Dropdown */}
          <div className="reviews-filters-star-select">
            <select
              className="form-select reviews-filters-star-select-field"
              value={filterState.replyStatus}
              onChange={(e) => onReplyStatusChange(e.target.value)}
            >
              <option value="">All Reviews</option>
              <option value="replied">Replied</option>
              <option value="unreplied">Unreplied</option>
            </select>
          </div>

          {/* Clear All Filters Button */}
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="d-flex align-items-center"
          >
            <ClearIcon size={16} className="me-2" />
            Clear All
          </Button>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {/* Bulk Reply Button */}
          <Button
            onClick={onBulkReply}
            variant="primary"
            size="sm"
            className="d-flex align-items-center"
            style={{ backgroundColor: "#ff6b35", borderColor: "#ff6b35" }}
          >
            <Users size={16} className="me-2" />
            Bulk Reply
          </Button>

          {/* Additional Action Buttons */}
          <Button
            onClick={onExportReviews}
            variant="outline"
            size="sm"
            className="d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            title="Export Reviews"
          >
            <List size={16} />
          </Button>
          <Button
            onClick={onImportReviews}
            variant="outline"
            size="sm"
            className="d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            title="Import Reviews"
          >
            <Cloud size={16} />
          </Button>
          <Button
            onClick={onRefreshReviews}
            variant="outline"
            size="sm"
            className="d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            title="Refresh Reviews"
          >
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
