import React from "react";

interface ApiStatusAlertProps {
  isApiDisabled: boolean;
}

export const ApiStatusAlert: React.FC<ApiStatusAlertProps> = React.memo(
  ({ isApiDisabled }) => {
    if (!isApiDisabled) {
      return null;
    }

    return (
      <div className="alert alert-warning my-3" role="alert">
        🚨 API calls temporarily disabled due to quota limits. Please wait 30
        seconds or use the refresh button to try again.
      </div>
    );
  }
);
