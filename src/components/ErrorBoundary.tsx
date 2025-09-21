import { Component, type ErrorInfo, type ReactNode } from 'react';
import { getErrorMessage } from '../utils/error';

// Data structures for error boundary state
interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
  readonly errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ((error: Error, errorInfo: ErrorInfo | null) => ReactNode) | undefined;
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

// Pure function for creating initial state
const createInitialState = (): ErrorBoundaryState => ({
  hasError: false,
  error: null,
  errorInfo: null,
});

// Pure function for creating error state
const createErrorState = (error: Error, errorInfo: ErrorInfo | null): ErrorBoundaryState => ({
  hasError: true,
  error,
  errorInfo,
});

// Pure function for default error UI
const defaultErrorFallback = (error: Error, errorInfo: ErrorInfo | null): ReactNode => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          We apologize for the inconvenience. Please try refreshing the page.
        </p>
      </div>

      {process.env['NODE_ENV'] === 'development' && (
        <details className="mb-4">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer">
            Error Details (Development Only)
          </summary>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto">
            <div className="mb-2">
              <strong>Error:</strong> {getErrorMessage(error)}
            </div>
            {errorInfo && (
              <div>
                <strong>Component Stack:</strong>
                <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
              </div>
            )}
          </div>
        </details>
      )}

      <button
        onClick={() => window.location.reload()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

/**
 * Error Boundary component that catches JavaScript errors in component tree
 * Following functional principles where possible while maintaining React class component requirement
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = createInitialState();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to show error UI on next render
    return createErrorState(error, null);
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info and call optional error handler
    this.setState((prevState) => ({
      ...prevState,
      errorInfo,
    }));

    // Call optional error reporting callback
    this.props.onError?.(error, errorInfo);

    // Log error in development
    if (process.env['NODE_ENV'] === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  override render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback = defaultErrorFallback } = this.props;

    if (hasError && error) {
      return fallback(error, errorInfo);
    }

    return children;
  }
}

/**
 * Higher-order component that wraps any component with error boundary
 * @param Component - Component to wrap
 * @param errorFallback - Optional custom error UI
 * @returns Wrapped component with error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: (error: Error, errorInfo: ErrorInfo | null) => ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...(errorFallback ? { fallback: errorFallback } : {})}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;
