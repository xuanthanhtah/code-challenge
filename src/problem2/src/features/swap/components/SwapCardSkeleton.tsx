/** Loading placeholder that mirrors the swap card layout to avoid layout shift. */
export const SwapCardSkeleton = () => (
  <div className="swap-card" aria-busy="true" aria-label="Loading prices">
    <div className="swap-card__header">
      <div className="skeleton" style={{ width: 90, height: 26 }} />
      <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 999 }} />
    </div>
    <div className="skeleton" style={{ height: 124, borderRadius: 20 }} />
    <div className="skeleton" style={{ height: 124, borderRadius: 20, marginTop: 6 }} />
    <div className="skeleton" style={{ height: 22, marginTop: 16, width: '70%' }} />
    <div className="skeleton" style={{ height: 58, marginTop: 16, borderRadius: 18 }} />
  </div>
);
