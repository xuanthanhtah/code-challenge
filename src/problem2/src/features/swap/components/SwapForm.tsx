import { useState } from 'react';
import { useTranslation } from '../../i18n/hooks/useTranslation';
import { useSwapForm } from '../hooks/useSwapForm';
import { useSwapMutation } from '../hooks/useSwapMutation';
import type { Balances, SwapField, Token } from '../types/swap.types';
import { SwapDetails } from './SwapDetails';
import { SwapSuccess } from './SwapSuccess';
import { TokenAmountField } from './TokenAmountField';
import { TokenSelectModal } from './TokenSelectModal';

interface SwapFormProps {
  tokens: Token[];
  balances: Balances;
}

const estimateNetworkFeeUsd = (usd: number) => 0.12 + usd * 0.0003;

export const SwapForm = ({ tokens, balances }: SwapFormProps) => {
  const { t } = useTranslation();
  const form = useSwapForm({ tokens, balances });
  const swap = useSwapMutation();
  const [pickerField, setPickerField] = useState<SwapField | null>(null);
  const [flipTurns, setFlipTurns] = useState(0);

  const isSubmitting = swap.isPending;
  const { validation } = form;
  const showFieldError = validation.code === 'INSUFFICIENT_BALANCE' || validation.code === 'AMOUNT_TOO_SMALL';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request = form.buildRequest();
    if (!request || isSubmitting) return;
    swap.mutate(request);
  };

  const handleFlip = () => {
    setFlipTurns((n) => n + 1);
    form.flip();
  };

  const handleDone = () => {
    swap.reset();
    form.reset();
  };

  if (swap.isSuccess && swap.data) {
    return (
      <div className="swap-card">
        <SwapSuccess
          result={swap.data}
          fromToken={tokens.find((tok) => tok.symbol === swap.data?.fromSymbol)}
          toToken={tokens.find((tok) => tok.symbol === swap.data?.toSymbol)}
          onDone={handleDone}
        />
      </div>
    );
  }

  const getValidationLabel = () => {
    switch (validation.code) {
      case 'SELECT_TOKEN':
        return t.validationSelectToken;
      case 'ENTER_AMOUNT':
        return t.validationEnterAmount;
      case 'INSUFFICIENT_BALANCE':
        return t.validationInsufficientBalance(validation.params?.symbol ?? form.fromToken?.symbol ?? '');
      case 'AMOUNT_TOO_SMALL':
        return t.validationAmountTooSmall;
      default:
        return validation.message ?? '';
    }
  };

  const buttonLabel = isSubmitting
    ? t.swapping
    : validation.isValid
    ? t.confirmSwap
    : getValidationLabel();

  return (
    <form className="swap-card" onSubmit={handleSubmit} noValidate aria-describedby="swap-status">
      <div className="swap-card__header">
        <h1 className="swap-card__title">{t.swap}</h1>
        <span className="live-pill" title={t.pricesRefreshHint}>
          <span className="live-pill__dot" /> {t.livePrices}
        </span>
      </div>

      <div className="swap-card__fields">
        <TokenAmountField
          id="input-amount"
          label={t.youPay}
          value={form.fromAmount}
          token={form.fromToken}
          balance={form.fromBalance}
          usdValue={form.fromUsd}
          hasError={showFieldError}
          disabled={isSubmitting}
          showQuickActions
          onChange={(v) => form.changeAmount('from', v)}
          onTokenClick={() => setPickerField('from')}
          onPercentage={form.setFromPercentage}
        />

        <button
          type="button"
          id="flip-button"
          className="flip-button"
          onClick={handleFlip}
          disabled={isSubmitting}
          aria-label={t.switchTokens}
          style={{ transform: `translate(-50%, -50%) rotate(${flipTurns * 180}deg)` }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M10 3v14M10 17l-5-5M10 17l5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <TokenAmountField
          id="output-amount"
          label={t.youReceive}
          value={form.toAmount}
          token={form.toToken}
          balance={form.toBalance}
          usdValue={form.toUsd}
          disabled={isSubmitting}
          onChange={(v) => form.changeAmount('to', v)}
          onTokenClick={() => setPickerField('to')}
        />
      </div>

      {form.fromToken && form.toToken && (
        <SwapDetails
          fromToken={form.fromToken}
          toToken={form.toToken}
          minimumReceived={form.minimumReceived}
          slippage={form.slippage}
          networkFeeUsd={estimateNetworkFeeUsd(form.fromUsd)}
          onSlippageChange={form.setSlippage}
        />
      )}

      {swap.isError && (
        <div className="alert" role="alert">
          {t.swapFailed}: {swap.error instanceof Error ? swap.error.message : t.unknownError}. {t.pleaseTryAgain}
        </div>
      )}

      <button
        type="submit"
        id="confirm-swap-button"
        className={`primary-button ${isSubmitting ? 'is-loading' : ''} ${
          showFieldError ? 'primary-button--danger' : ''
        }`}
        disabled={!validation.isValid || isSubmitting}
      >
        {isSubmitting && <span className="spinner" aria-hidden="true" />}
        <span id="swap-status" aria-live="polite">
          {buttonLabel}
        </span>
      </button>

      <TokenSelectModal
        open={pickerField !== null}
        tokens={tokens}
        balances={balances}
        selectedSymbol={pickerField === 'from' ? form.fromToken?.symbol : form.toToken?.symbol}
        pairedSymbol={pickerField === 'from' ? form.toToken?.symbol : form.fromToken?.symbol}
        onClose={() => setPickerField(null)}
        onSelect={(symbol) => {
          if (pickerField) form.selectToken(pickerField, symbol);
          setPickerField(null);
        }}
      />
    </form>
  );
};
