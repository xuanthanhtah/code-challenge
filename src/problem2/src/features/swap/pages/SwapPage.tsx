import { DataErrorBoundary } from '../../../components/DataErrorBoundary';
import { LanguageToggle } from '../../i18n/components/LanguageToggle';
import { useTranslation } from '../../i18n/hooks/useTranslation';
import { ThemeToggle } from '../../theme/components/ThemeToggle';
import { SwapWidget } from '../components/SwapWidget';

export const SwapPage = () => {
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="aurora" aria-hidden="true">
        <span className="aurora__blob aurora__blob--1" />
        <span className="aurora__blob aurora__blob--2" />
        <span className="aurora__blob aurora__blob--3" />
      </div>

      <header className="topbar">
        <a className="brand" href="/" aria-label="Fancy Swap home">
          <span className="brand__logo" aria-hidden="true" />
          <span className="brand__name">
            fancy<span>swap</span>
          </span>
        </a>

        <div className="topbar__actions">
          <LanguageToggle />
          <ThemeToggle />
          <span className="wallet-pill" title={t.mockWallet}>
            <span className="wallet-pill__avatar" aria-hidden="true" />
            0x7a3f…c91e
          </span>
        </div>
      </header>

      <main className="page__main">
        <p className="page__tagline">{t.tagline}</p>
        <DataErrorBoundary>
          <SwapWidget />
        </DataErrorBoundary>
      </main>

      <footer className="page__footer">{t.footer}</footer>
    </div>
  );
};
