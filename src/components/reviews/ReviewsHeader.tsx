import React from "react";
import { Star, MessageSquare, Clock, ThumbsUp } from "lucide-react";
import { MetricCard } from "@/components/ui";
import { COLORS } from "@/styles/design-system";
import { useAccountKPIs } from "@/hooks/useAccountKPIs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ReviewsHeaderProps {
  className?: string;
}

export const ReviewsHeader: React.FC<ReviewsHeaderProps> = ({
  className = "",
}) => {
  const { data: kpiData, isLoading, error } = useAccountKPIs();

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

  return (
    <div className={className}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h2 mb-0 fw-700 reviews-header-title">
            Reviews Google
          </h1>
        </div>
        <div className="d-flex align-items-center gap-3">
          {/* KPI Cards */}
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
