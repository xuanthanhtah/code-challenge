import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Balances, Token } from '../types/swap.types';
import { formatTokenAmount, formatUsd } from '../utils/swap.utils';
import { TokenIcon } from './TokenIcon';

interface TokenSelectModalProps {
  open: boolean;
  tokens: Token[];
  balances: Balances;
  selectedSymbol?: string;
  /** Token on the opposite side – shown with a hint since picking it flips the pair. */
  pairedSymbol?: string;
  onSelect: (symbol: string) => void;
  onClose: () => void;
}

const POPULAR = ['ETH', 'USDC', 'WBTC', 'ATOM', 'SWTH', 'OSMO'];

export const TokenSelectModal = (props: TokenSelectModalProps) => {
  if (!props.open) return null;
  return createPortal(<TokenSelectDialog {...props} />, document.body);
};

/** Mounted only while open, so search/highlight state resets naturally each time. */
const TokenSelectDialog = ({
  tokens,
  balances,
  selectedSymbol,
  pairedSymbol,
  onSelect,
  onClose,
}: TokenSelectModalProps) => {
  const titleId = useId();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tokens
      .filter((t) => !q || t.symbol.toLowerCase().includes(q))
      .sort((a, b) => {
        // Exact match first, then by wallet value
        if (q) {
          const ae = a.symbol.toLowerCase() === q ? 1 : 0;
          const be = b.symbol.toLowerCase() === q ? 1 : 0;
          if (ae !== be) return be - ae;
        }
        return (balances[b.symbol] ?? 0) * b.price - (balances[a.symbol] ?? 0) * a.price;
      });
  }, [balances, query, tokens]);

  const popular = useMemo(() => tokens.filter((t) => POPULAR.includes(t.symbol)), [tokens]);

  // Lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keep the highlighted row visible
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault();
      onSelect(filtered[activeIndex].symbol);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose} onKeyDown={handleKeyDown}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            Select a token
          </h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="search">
          <svg className="search__icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id="token-search"
            className="search__input"
            placeholder="Search by symbol"
            value={query}
            autoFocus
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            aria-controls="token-list"
            aria-activedescendant={filtered[activeIndex] ? `token-option-${filtered[activeIndex].symbol}` : undefined}
          />
        </div>

        {!query && popular.length > 0 && (
          <div className="popular">
            {popular.map((t) => (
              <button
                key={t.symbol}
                type="button"
                className={`popular__item ${t.symbol === selectedSymbol ? 'is-selected' : ''}`}
                onClick={() => onSelect(t.symbol)}
              >
                <TokenIcon symbol={t.symbol} src={t.iconUrl} size={20} />
                {t.symbol}
              </button>
            ))}
          </div>
        )}

        <div className="modal__divider" />

        {filtered.length === 0 ? (
          <div className="token-list__empty">
            <p>No tokens match “{query}”</p>
            <span>Only tokens with a known price can be swapped.</span>
          </div>
        ) : (
          <ul id="token-list" ref={listRef} className="token-list" role="listbox" aria-labelledby={titleId}>
            {filtered.map((t, index) => {
              const balance = balances[t.symbol] ?? 0;
              const isSelected = t.symbol === selectedSymbol;
              return (
                <li
                  key={t.symbol}
                  id={`token-option-${t.symbol}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  className={`token-row ${index === activeIndex ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => onSelect(t.symbol)}
                >
                  <TokenIcon symbol={t.symbol} src={t.iconUrl} size={36} />
                  <div className="token-row__info">
                    <span className="token-row__symbol">
                      {t.symbol}
                      {t.symbol === pairedSymbol && <span className="tag">paired</span>}
                    </span>
                    <span className="token-row__price">{formatUsd(t.price)}</span>
                  </div>
                  <div className="token-row__balance">
                    <span>{formatTokenAmount(balance)}</span>
                    <span className="token-row__usd">{formatUsd(balance * t.price)}</span>
                  </div>
                  {isSelected && (
                    <svg className="token-row__check" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                      <path d="M4 9.5l3.2 3L14 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
