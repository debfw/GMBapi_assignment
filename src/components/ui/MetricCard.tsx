import React from "react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null | undefined;
  iconColor?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor,
  className = "",
}) => {
  return (
    <div className={`d-flex align-items-center gap-3 ${className}`}>
      <Icon
        size={20}
        className="metric-card-icon"
        style={
          iconColor
            ? ({ "--metric-card-icon-color": iconColor } as React.CSSProperties)
            : undefined
        }
      />
      <div>
        <div className="small text-muted metric-card-label">{label}</div>
        <div className="fw-bold metric-card-value">{value ?? ""}</div>
      </div>
    </div>
  );
};
