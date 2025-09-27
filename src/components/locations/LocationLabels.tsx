import React from "react";
import { useLocationLabels } from "@/hooks";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Tag, Plus } from "lucide-react";

interface LocationLabelsProps {
  selectedLabelId?: string;
  onLabelSelect?: (labelId: string) => void;
  showAddButton?: boolean;
  onAddLabel?: () => void;
}

export const LocationLabels: React.FC<LocationLabelsProps> = ({
  selectedLabelId,
  onLabelSelect,
  showAddButton = false,
  onAddLabel,
}) => {
  const { labels, isLoading, error, refetch } = useLocationLabels();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-muted small">
        <div className="d-flex align-items-center">
          <span className="me-2">No labels available</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap gap-2 align-items-center">
      {labels.map((label) => (
        <button
          key={label.id}
          className={`btn btn-sm d-flex align-items-center ${
            selectedLabelId === label.id
              ? "btn-primary"
              : "btn-outline-secondary"
          }`}
          onClick={() => onLabelSelect?.(label.id)}
          style={{
            backgroundColor:
              selectedLabelId === label.id ? label.color : undefined,
            borderColor: label.color,
            color: selectedLabelId === label.id ? "white" : label.color,
          }}
        >
          <Tag size={14} className="me-1" />
          {label.name}
        </button>
      ))}

      {showAddButton && (
        <button
          className="btn btn-sm btn-outline-primary d-flex align-items-center"
          onClick={onAddLabel}
        >
          <Plus size={14} className="me-1" />
          Add Label
        </button>
      )}
    </div>
  );
};
