import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './features/theme/contexts/ThemeProvider';
import { I18nProvider } from './features/i18n/contexts/I18nProvider';
import { SwapPage } from './features/swap/pages/SwapPage';
import './index.css';
import './features/swap/components/swap.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <SwapPage />
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
