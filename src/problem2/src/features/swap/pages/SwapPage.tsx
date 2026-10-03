import { DataErrorBoundary } from '../../../components/DataErrorBoundary';
import { SwapWidget } from '../components/SwapWidget';

export const SwapPage = () => (
  <div className="page">
    <div className="aurora" aria-hidden="true">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
    </div>

    <header className="topbar">
      <a className="brand" href="/" aria-label="Fancy Swap home">
        <span className="brand__logo" aria-hidden="true" />
        <span className="brand__name">fancy<span>swap</span></span>
      </a>
      <span className="wallet-pill" title="Mock wallet">
        <span className="wallet-pill__avatar" aria-hidden="true" />
        0x7a3f…c91e
      </span>
    </header>

    <main className="page__main">
      <p className="page__tagline">Trade tokens instantly at the best rate.</p>
      <DataErrorBoundary>
        <SwapWidget />
      </DataErrorBoundary>
    </main>

    <footer className="page__footer">
      Prices from Switcheo · Swaps are simulated for demo purposes
    </footer>
  </div>
);
