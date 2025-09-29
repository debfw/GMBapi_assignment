import React from "react";
import { CheckCircle, Circle, XCircle } from "lucide-react";
import { getHealthColor } from "@/utils/health";

interface Props {
  health: number;
  showIcon?: boolean;
  className?: string;
}

export const HealthBadge: React.FC<Props> = ({
  health,
  showIcon = true,
  className,
}) => {
  const color = getHealthColor(health);
  const icon =
    color === "success" ? (
      <CheckCircle size={16} className="text-success" />
    ) : color === "warning" ? (
      <Circle size={16} className="text-warning" />
    ) : (
      <XCircle size={16} className="text-danger" />
    );

  return (
    <span
      className={`d-inline-flex align-items-center gap-2 ${className ?? ""}`}
    >
      {showIcon && icon}
      <span className={`fw-semibold small text-${color}`}>
        {Math.round(health)}%
      </span>
    </span>
  );
};
