import type { ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

interface DataErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Isolates data-fetching failures with a local "Try again" fallback.
 * Wrapped in QueryErrorResetBoundary so retrying also resets the failed queries.
 */
export const DataErrorBoundary = ({ children }: DataErrorBoundaryProps) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="swap-card error-fallback" role="alert">
            <div className="error-fallback__icon" aria-hidden="true">!</div>
            <h2>Couldn’t load prices</h2>
            <p>{error instanceof Error ? error.message : 'Something went wrong.'}</p>
            <button type="button" id="retry-button" className="primary-button" onClick={resetErrorBoundary}>
              Try again
            </button>
          </div>
        )}
      >
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
