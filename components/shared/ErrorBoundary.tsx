"use client";

import { Component, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="bg-error/5 border-error/20">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mb-4"
            >
              <AlertCircle className="h-7 w-7 text-error" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              This section encountered an error. Try refreshing or contact support if the problem persists.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <p className="mt-4 text-xs font-mono text-error/80 max-w-full overflow-auto">
                {this.state.error.message}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper with retry mechanism
interface RetryableProps {
  children: ReactNode;
  maxRetries?: number;
  onMaxRetriesReached?: () => void;
}

export function RetryableSection({
  children,
  maxRetries = 3,
  onMaxRetriesReached,
}: RetryableProps) {
  return (
    <ErrorBoundaryWithRetry maxRetries={maxRetries} onMaxRetriesReached={onMaxRetriesReached}>
      {children}
    </ErrorBoundaryWithRetry>
  );
}

class ErrorBoundaryWithRetry extends Component<
  RetryableProps & { children: ReactNode },
  State & { retryCount: number }
> {
  constructor(props: RetryableProps & { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundaryWithRetry caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    const { maxRetries = 3, onMaxRetriesReached } = this.props;
    const newRetryCount = this.state.retryCount + 1;

    if (newRetryCount >= maxRetries) {
      onMaxRetriesReached?.();
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      retryCount: newRetryCount,
    });
  };

  render() {
    const { maxRetries = 3 } = this.props;

    if (this.state.hasError) {
      const retriesLeft = maxRetries - this.state.retryCount - 1;
      const canRetry = retriesLeft > 0;

      return (
        <Card className="bg-error/5 border-error/20">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mb-4"
            >
              <AlertCircle className="h-7 w-7 text-error" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {canRetry
                ? `This section encountered an error. ${retriesLeft} ${retriesLeft === 1 ? "retry" : "retries"} left.`
                : "Maximum retries reached. Please refresh the page or contact support."}
            </p>
            {canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleRetry}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again ({retriesLeft} left)
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
