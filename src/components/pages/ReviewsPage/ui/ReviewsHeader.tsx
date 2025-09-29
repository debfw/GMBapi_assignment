import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Clock, ThumbsUp } from "lucide-react";
import { COLORS } from "@/styles/design-system";
import { useAccountKPIs } from "@/hooks/useAccountKPIs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { MetricCard } from "@/components/common/MetricCard";

interface ReviewsHeaderProps {
  className?: string;
}

export const ReviewsHeader: React.FC<ReviewsHeaderProps> = ({
  className = "",
}) => {
  const { data: kpiData, isLoading, error } = useAccountKPIs();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Keep header in mobile mode below 1610px to match overall layout
      setIsMobile(window.innerWidth < 1610);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="h2 mb-0 fw-700 reviews-header-title">
              Reviews Google
            </h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="h2 mb-0 fw-700 reviews-header-title">
              Reviews Google
            </h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-muted">Unable to load KPIs</div>
          </div>
        </div>
      </div>
    );
  }

  const kpis = kpiData?.payload;

  // Mobile Layout
  if (isMobile) {
    return (
      <div className={`reviews-header-mobile ${className}`}>
        {/* Row 1: Reviews Google */}
        <div className="mobile-header-row-1">
          <h1 className="h4 mb-0 fw-700 d-flex align-items-center gap-2">
            Reviews
            <span className="badge bg-primary">Google</span>
          </h1>
        </div>

        {/* Row 2: Rating and review count */}
        <div className="mobile-header-row-2">
          <div className="average-rating-group">
            <span className="rating-number">
              {kpis?.average_rating?.toFixed(1) || "0.0"}
            </span>
            <div className="star-icons">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(kpis?.average_rating || 0)
                      ? "text-warning"
                      : "text-muted"
                  }
                  fill={
                    i < Math.round(kpis?.average_rating || 0)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>
            <span className="review-count">
              ({kpis?.number_of_comments?.toLocaleString() || "0"} reviews)
            </span>
          </div>
        </div>

        {/* Row 3: Metrics */}
        <div className="mobile-header-row-3">
          <MetricCard
            icon={Star}
            label="Average rating"
            value={
              kpis?.average_rating
                ? `${kpis.average_rating.toFixed(2)}/5`
                : "N/A"
            }
            iconColor={COLORS.warning}
          />
          <MetricCard
            icon={MessageSquare}
            label="No. Of Reviews"
            value={kpis?.number_of_comments?.toLocaleString() || "0"}
            iconColor={COLORS.primary}
          />
          <MetricCard
            icon={Clock}
            label="Response time"
            value={`${kpis?.response_time || 0} hrs`}
            iconColor={COLORS.info}
          />
          <MetricCard
            icon={ThumbsUp}
            label="Reply rate"
            value={
              kpis?.reply_percentage
                ? `${kpis.reply_percentage.toFixed(0)}%`
                : "0%"
            }
            iconColor={COLORS.success}
          />
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className={className}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h2 mb-0 fw-700 reviews-header-title">
            Reviews Google
          </h1>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-5">
            <MetricCard
              icon={Star}
              label="Average rating"
              value={
                kpis?.average_rating
                  ? `${kpis.average_rating.toFixed(2)}/5`
                  : "N/A"
              }
              iconColor={COLORS.warning}
            />
            <MetricCard
              icon={MessageSquare}
              label="No. Of Reviews"
              value={kpis?.number_of_comments?.toLocaleString() || "0"}
              iconColor={COLORS.primary}
            />
            <MetricCard
              icon={Clock}
              label="Response time"
              value={`${kpis?.response_time || 0} hrs`}
              iconColor={COLORS.info}
            />
            <MetricCard
              icon={ThumbsUp}
              label="Reply rate"
              value={
                kpis?.reply_percentage
                  ? `${kpis.reply_percentage.toFixed(0)}%`
                  : "0%"
              }
              iconColor={COLORS.success}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
