/**
 * API Status Alert Component
 * Shows API rate limiting and error status
 */

import React from "react";

interface ApiStatusAlertProps {
  isApiDisabled: boolean;
}

export const ApiStatusAlert: React.FC<ApiStatusAlertProps> = React.memo(({
  isApiDisabled,
}) => {
  if (!isApiDisabled) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#fef3cd",
        border: "1px solid #fecaca",
        borderRadius: "8px",
        padding: "12px",
        margin: "16px 0",
        color: "#92400e",
      }}
    >
      🚨 API calls temporarily disabled due to quota limits. Please wait 30
      seconds or use the refresh button to try again.
    </div>
  );
});
