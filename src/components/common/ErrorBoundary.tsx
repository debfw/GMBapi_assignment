import type { ReactNode } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  disableRetry?: boolean;
  retryDisabledMessage?: string;
  resetKeys?: unknown[];
}

function DefaultFallback({
  error,
  resetErrorBoundary,
  disableRetry,
  retryDisabledMessage,
}: FallbackProps & {
  disableRetry?: boolean;
  retryDisabledMessage?: string;
}) {
  return (
    <Container className="py-5">
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Something went wrong</Alert.Heading>
        <p>
          We encountered an unexpected error. Please try refreshing the page or
          contact support if the problem persists.
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
            onClick={resetErrorBoundary}
            className="mt-3"
          >
            Try Again
          </Button>
        )}
      </Alert>
    </Container>
  );
}

export function ErrorBoundary({
  children,
  fallback,
  disableRetry,
  retryDisabledMessage,
  resetKeys = [],
}: Props) {
  return (
    <ReactErrorBoundary
      onReset={() => {}}
      resetKeys={resetKeys}
      fallbackRender={(props) =>
        fallback || (
          <DefaultFallback
            {...props}
            disableRetry={disableRetry}
            retryDisabledMessage={retryDisabledMessage}
          />
        )
      }
    >
      {children}
    </ReactErrorBoundary>
  );
}
