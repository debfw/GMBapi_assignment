/**
 * Progress Indicator Component for Bulk Reply Modal
 * Shows the progress of bulk reply operations
 */

import React from "react";
import { Alert } from "react-bootstrap";
import type { BulkReplyProgress } from "@/services/domain/types";

interface ProgressIndicatorProps {
  progress: BulkReplyProgress;
  showApiWarning: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = React.memo(({
  progress,
  showApiWarning,
}) => {
  if (!progress.total && !showApiWarning) {
    return null;
  }

  return (
    <>
      {showApiWarning && (
        <Alert variant="warning" className="mb-4">
          <strong>API Under Development:</strong> The reply functionality is
          currently under development and not yet available. Please check back
          later.
        </Alert>
      )}

      {progress.total > 0 && (
        <Alert variant="info" className="mb-4">
          <strong>Processing Replies:</strong> {progress.completed} of{" "}
          {progress.total} completed
          {progress.currentReview && (
            <div className="mt-1 small">
              Currently replying to: {progress.currentReview}
            </div>
          )}
        </Alert>
      )}
    </>
  );
});
