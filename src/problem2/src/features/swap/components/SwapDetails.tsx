import { useState } from 'react';
import type { Token } from '../types/swap.types';
import { formatTokenAmount, formatUsd } from '../utils/swap.utils';

interface SwapDetailsProps {
  fromToken: Token;
  toToken: Token;
  minimumReceived: number;
  slippage: number;
  networkFeeUsd: number;
  onSlippageChange: (value: number) => void;
}

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1];

export const SwapDetails = ({
  fromToken,
  toToken,
  minimumReceived,
  slippage,
  networkFeeUsd,
  onSlippageChange,
}: SwapDetailsProps) => {
  const [inverted, setInverted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [base, quote] = inverted ? [toToken, fromToken] : [fromToken, toToken];
  const rate = base.price / quote.price;

  return (
    <div className={`details ${expanded ? 'is-expanded' : ''}`}>
      <div className="details__summary">
        <button
          type="button"
          className="details__rate"
          onClick={() => setInverted((v) => !v)}
          title="Invert rate"
        >
          <span>
            1 {base.symbol} = {formatTokenAmount(rate)} {quote.symbol}
          </span>
          <span className="details__rate-usd">({formatUsd(base.price)})</span>
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 5h9l-2.5-2.5M13 11H4l2.5 2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="details__toggle"
          aria-expanded={expanded}
          aria-controls="swap-details-body"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="details__fee">⛽ {formatUsd(networkFeeUsd)}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div id="swap-details-body" className="details__body" hidden={!expanded}>
        <div className="details__row">
          <span>Max slippage</span>
          <div className="segmented" role="radiogroup" aria-label="Max slippage">
            {SLIPPAGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={slippage === opt}
                className={slippage === opt ? 'is-active' : ''}
                onClick={() => onSlippageChange(opt)}
              >
                {opt}%
              </button>
            ))}
          </div>
        </div>
        <div className="details__row">
          <span>Minimum received</span>
          <strong>
            {formatTokenAmount(minimumReceived)} {toToken.symbol}
          </strong>
        </div>
        <div className="details__row">
          <span>Network fee</span>
          <strong>{formatUsd(networkFeeUsd)}</strong>
        </div>
        <div className="details__row">
          <span>Route</span>
          <strong>
            {fromToken.symbol} → {toToken.symbol}
          </strong>
        </div>
      </div>
    </div>
  );
};
