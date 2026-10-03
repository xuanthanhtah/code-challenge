import { useTranslation } from '../../i18n/hooks/useTranslation';
import type { Token } from '../types/swap.types';
import { formatTokenAmount, formatUsd } from '../utils/swap.utils';
import { TokenIcon } from './TokenIcon';

interface TokenAmountFieldProps {
  id: string;
  label: string;
  value: string;
  token?: Token;
  balance: number;
  usdValue: number;
  hasError?: boolean;
  disabled?: boolean;
  showQuickActions?: boolean;
  onChange: (value: string) => void;
  onTokenClick: () => void;
  onPercentage?: (ratio: number) => void;
}

type QuickRatio =
  | { label: string; value: number }
  | { labelKey: 'max'; value: number };

const QUICK_RATIOS: QuickRatio[] = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { labelKey: 'max', value: 1 },
];

export const TokenAmountField = ({
  id,
  label,
  value,
  token,
  balance,
  usdValue,
  hasError,
  disabled,
  showQuickActions,
  onChange,
  onTokenClick,
  onPercentage,
}: TokenAmountFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className={`amount-field ${hasError ? 'amount-field--error' : ''}`}>
      <div className="amount-field__header">
        <label htmlFor={id} className="amount-field__label">
          {label}
        </label>
        {showQuickActions && token && onPercentage && (
          <div className="amount-field__quick" role="group" aria-label={t.quickAmount}>
            {QUICK_RATIOS.map((r) => {
              const chipLabel = 'labelKey' in r ? t[r.labelKey] : r.label;
              return (
                <button
                  key={r.value}
                  type="button"
                  className="chip"
                  onClick={() => onPercentage(r.value)}
                  disabled={disabled || balance <= 0}
                >
                  {chipLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="amount-field__body">
        <input
          id={id}
          className="amount-field__input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="0"
          value={value}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          id={`${id}-token`}
          className={`token-button ${token ? '' : 'token-button--empty'}`}
          onClick={onTokenClick}
          disabled={disabled}
          aria-haspopup="dialog"
        >
          {token ? (
            <>
              <TokenIcon symbol={token.symbol} src={token.iconUrl} size={26} />
              <span className="token-button__symbol">{token.symbol}</span>
            </>
          ) : (
            <span className="token-button__symbol">{t.selectToken}</span>
          )}
          <svg className="token-button__chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="amount-field__footer">
        <span className="amount-field__usd">{formatUsd(usdValue)}</span>
        {token && (
          <span className="amount-field__balance">
            {t.balance}: <strong>{formatTokenAmount(balance)}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
