import type { ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from '../features/i18n/hooks/useTranslation';

interface DataErrorBoundaryProps {
  children: ReactNode;
}

export const DataErrorBoundary = ({ children }: DataErrorBoundaryProps) => {
  const { t } = useTranslation();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="swap-card error-fallback" role="alert">
              <div className="error-fallback__icon" aria-hidden="true">!</div>
              <h2>{t.couldNotLoadPrices}</h2>
              <p>{error instanceof Error ? error.message : t.somethingWentWrong}</p>
              <button type="button" id="retry-button" className="primary-button" onClick={resetErrorBoundary}>
                {t.tryAgain}
              </button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
