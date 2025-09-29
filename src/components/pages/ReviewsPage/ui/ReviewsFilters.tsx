import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Search } from "lucide-react";
import type { FilterState } from "@/components/pages/ReviewsPage/hooks/useReviewsFilters";

interface ReviewsFiltersProps {
  filterState: FilterState;
  onStarRatingChange: (value: string) => void;
  onClearFilters: () => void;
  onReplyStatusChange: (value: string) => void;
  onBulkReply: () => void;
  onRefreshReviews: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
}

export const ReviewsFilters: React.FC<ReviewsFiltersProps> = ({
  filterState,
  onStarRatingChange,
  onClearFilters,
  onReplyStatusChange,
  onBulkReply,
  onRefreshReviews,
  searchTerm = "",
  onSearchChange,
  className = "",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1610);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile Layout
  if (isMobile) {
    return (
      <div
        className={`rounded-3 shadow-sm border-0 reviews-filters-container ${className}`}
      >
        <div className="mobile-filters-layout">
          {/* Search bar row */}
          <div className="position-relative mb-3">
            <Search
              size={16}
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>

          {/* Row 1: Quick filters label as collapsible header */}
          <button
            type="button"
            className="w-100 d-flex align-items-center justify-content-between btn btn-link text-decoration-none p-0 mb-2"
            onClick={() => setCollapsed((p) => !p)}
            aria-expanded={!collapsed}
            aria-controls="mobile-quick-filters"
          >
            <span className="text-muted small">Quick filters:</span>
            <span className={`ms-2 ${collapsed ? "rotate-0" : "rotate-180"}`}>
              ▾
            </span>
          </button>

          {!collapsed && (
            <div id="mobile-quick-filters">
              {/* Row 2: Stars, Reviews, Bulk Reply */}
              <div className="mobile-filter-row-2">
                <select
                  className="form-select filters-control"
                  value={filterState.selectedStarRating}
                  onChange={(e) => onStarRatingChange(e.target.value)}
                >
                  <option value="">Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <select
                  className="form-select filters-control"
                  value={filterState.replyStatus}
                  onChange={(e) => onReplyStatusChange(e.target.value)}
                >
                  <option value="">Reviews</option>
                  <option value="replied">Replied</option>
                  <option value="unreplied">Unreplied</option>
                </select>

                <Button
                  onClick={onBulkReply}
                  variant="primary"
                  size="sm"
                  className="d-flex align-items-center justify-content-center filters-btn"
                  style={{ backgroundColor: "#ff6b35", borderColor: "#ff6b35" }}
                >
                  Bulk Reply
                </Button>
              </div>

              {/* Row 3: Clear All and Refresh */}
              <div className="mobile-filter-row-3">
                <Button
                  onClick={onClearFilters}
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center justify-content-center filters-btn"
                >
                  Clear All
                </Button>

                <Button
                  onClick={onRefreshReviews}
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center justify-content-center filters-btn"
                >
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div
      className={`rounded-3 shadow-sm border-0 p-3 reviews-filters-container ${className}`}
    >
      {/* Search bar for desktop */}
      <div className="d-flex gap-3 mb-3">
        <div
          className="position-relative flex-grow-1"
          style={{ maxWidth: "400px" }}
        >
          <Search
            size={16}
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
          />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>

      <div className="filters-grid-desktop">
        <span className="text-muted small reviews-filters-quick-label">
          Quick filters:
        </span>

        <select
          className="form-select reviews-filters-star-select-field filters-control"
          value={filterState.selectedStarRating}
          onChange={(e) => onStarRatingChange(e.target.value)}
        >
          <option value="">Stars</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select
          className="form-select reviews-filters-star-select-field filters-control"
          value={filterState.replyStatus}
          onChange={(e) => onReplyStatusChange(e.target.value)}
        >
          <option value="">Reviews</option>
          <option value="replied">Replied</option>
          <option value="unreplied">Unreplied</option>
        </select>

        <div className="filters-actions">
          <Button
            onClick={onBulkReply}
            variant="primary"
            size="sm"
            className="filters-btn"
            style={{ backgroundColor: "#ff6b35", borderColor: "#ff6b35" }}
          >
            Bulk Reply
          </Button>
          <Button
            onClick={onRefreshReviews}
            variant="outline"
            size="sm"
            className="filters-btn"
          >
            Refresh
          </Button>
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="filters-btn"
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};
