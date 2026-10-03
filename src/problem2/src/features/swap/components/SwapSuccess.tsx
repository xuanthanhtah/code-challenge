import { useTranslation } from '../../i18n/hooks/useTranslation';
import type { SwapResponse, Token } from '../types/swap.types';
import { formatTokenAmount, shortenHash } from '../utils/swap.utils';
import { TokenIcon } from './TokenIcon';

interface SwapSuccessProps {
  result: SwapResponse;
  fromToken?: Token;
  toToken?: Token;
  onDone: () => void;
}

export const SwapSuccess = ({ result, fromToken, toToken, onDone }: SwapSuccessProps) => {
  const { t } = useTranslation();

  return (
    <div className="success" role="status" aria-live="polite">
      <div className="success__badge" aria-hidden="true">
        <svg viewBox="0 0 52 52">
          <circle className="success__circle" cx="26" cy="26" r="24" fill="none" />
          <path className="success__check" fill="none" d="M15 27l7 7 15-15" />
        </svg>
      </div>
      <h2 className="success__title">{t.swapSuccessful}</h2>

      <div className="success__pair">
        <div className="success__token">
          {fromToken && <TokenIcon symbol={fromToken.symbol} src={fromToken.iconUrl} size={32} />}
          <span>
            {formatTokenAmount(result.fromAmount)} <small>{result.fromSymbol}</small>
          </span>
        </div>
        <span className="success__arrow">→</span>
        <div className="success__token">
          {toToken && <TokenIcon symbol={toToken.symbol} src={toToken.iconUrl} size={32} />}
          <span>
            {formatTokenAmount(result.toAmount)} <small>{result.toSymbol}</small>
          </span>
        </div>
      </div>

      <p className="success__hash">
        {t.txHash} <code title={result.txHash}>{shortenHash(result.txHash, 8)}</code>
      </p>

      <button type="button" id="swap-again-button" className="primary-button" onClick={onDone} autoFocus>
        {t.swapAgain}
      </button>
    </div>
  );
};
