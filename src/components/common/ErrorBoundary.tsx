import { Component } from "react";
import type { ReactNode } from "react";
import { Alert, Button, Container } from "react-bootstrap";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  disableRetry?: boolean;
  retryDisabledMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-3">
                <summary>Error details</summary>
                <pre className="mt-2 text-start">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            {this.props.disableRetry ? (
              <Alert variant="warning" className="mt-3">
                <Alert.Heading>Retry Disabled</Alert.Heading>
                <p className="mb-0">
                  {this.props.retryDisabledMessage ||
                    "Retry functionality has been disabled. Please contact support for assistance."}
                </p>
              </Alert>
            ) : (
              <Button
                variant="outline-danger"
                onClick={this.handleRetry}
                className="mt-3"
              >
                Try Again
              </Button>
            )}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
