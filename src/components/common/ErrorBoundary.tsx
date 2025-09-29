import React from "react";
import type { ReactNode } from "react";
import { Alert, Button, Container } from "react-bootstrap";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  disableRetry?: boolean;
  retryDisabledMessage?: string;
  resetKeys?: unknown[];
}

export function ErrorBoundary({
  children,
  fallback,
  disableRetry,
  retryDisabledMessage,
  resetKeys = [],
}: Props) {
  const [error, setError] = React.useState<Error | null>(null);
  const lastResetRef = React.useRef<string>("");

  React.useEffect(() => {
    const key = JSON.stringify(resetKeys);
    if (key !== lastResetRef.current) {
      lastResetRef.current = key;
      setError(null);
    }
  }, [resetKeys]);

  const handleRetry = () => setError(null);

  if (error) {
    if (fallback) return fallback;
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p>
            We encountered an unexpected error. Please try refreshing the page
            or contact support if the problem persists.
          </p>
          {import.meta.env.DEV && (
            <details className="mt-3">
              <summary>Error details</summary>
              <pre className="mt-2 text-start">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          {disableRetry ? (
            <Alert variant="warning" className="mt-3">
              <Alert.Heading>Retry Disabled</Alert.Heading>
              <p className="mb-0">
                {retryDisabledMessage ||
                  "Retry functionality has been disabled. Please contact support for assistance."}
              </p>
            </Alert>
          ) : (
            <Button
              variant="outline-danger"
              onClick={handleRetry}
              className="mt-3"
            >
              Try Again
            </Button>
          )}
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
