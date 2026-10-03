import { useCallback, useMemo, useState } from 'react';
import type { Balances, SwapField, SwapRequest, SwapValidation, Token } from '../types/swap.types';
import {
  convertAmount,
  formatTokenAmount,
  parseAmount,
  sanitizeAmountInput,
  toComputedInputString,
  toInputString,
} from '../utils/swap.utils';

const DEFAULT_FROM = 'ETH';
const DEFAULT_TO = 'USDC';
const MIN_USD_VALUE = 0.01;

interface UseSwapFormOptions {
  tokens: Token[];
  balances: Balances;
}

/**
 * All swap form state & derived values.
 * The user can type into either field: the last edited field is the "source of truth"
 * and the other side is computed from the exchange rate.
 */
export const useSwapForm = ({ tokens, balances }: UseSwapFormOptions) => {
  const tokenMap = useMemo(() => new Map(tokens.map((t) => [t.symbol, t])), [tokens]);

  const [fromSymbol, setFromSymbol] = useState<string | null>(() =>
    tokens.some((t) => t.symbol === DEFAULT_FROM) ? DEFAULT_FROM : (tokens[0]?.symbol ?? null),
  );
  const [toSymbol, setToSymbol] = useState<string | null>(() =>
    tokens.some((t) => t.symbol === DEFAULT_TO) ? DEFAULT_TO : null,
  );
  const [activeField, setActiveField] = useState<SwapField>('from');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const fromToken = fromSymbol ? tokenMap.get(fromSymbol) : undefined;
  const toToken = toSymbol ? tokenMap.get(toSymbol) : undefined;

  const { fromAmount, toAmount } = useMemo(() => {
    if (!fromToken || !toToken) {
      return activeField === 'from'
        ? { fromAmount: amount, toAmount: '' }
        : { fromAmount: '', toAmount: amount };
    }
    const value = parseAmount(amount);
    return activeField === 'from'
      ? { fromAmount: amount, toAmount: toComputedInputString(convertAmount(value, fromToken.price, toToken.price)) }
      : { fromAmount: toComputedInputString(convertAmount(value, toToken.price, fromToken.price)), toAmount: amount };
  }, [activeField, amount, fromToken, toToken]);

  const fromValue = parseAmount(fromAmount);
  const toValue = parseAmount(toAmount);
  const fromBalance = fromSymbol ? (balances[fromSymbol] ?? 0) : 0;
  const toBalance = toSymbol ? (balances[toSymbol] ?? 0) : 0;
  const fromUsd = fromToken ? fromValue * fromToken.price : 0;
  const toUsd = toToken ? toValue * toToken.price : 0;
  const rate = fromToken && toToken ? fromToken.price / toToken.price : 0;
  const minimumReceived = toValue * (1 - slippage / 100);

  const validation = useMemo<SwapValidation>(() => {
    if (!fromToken || !toToken) return { isValid: false, code: 'SELECT_TOKEN', message: 'Select a token' };
    if (!amount || parseAmount(amount) <= 0) return { isValid: false, code: 'ENTER_AMOUNT', message: 'Enter an amount' };
    if (fromValue > fromBalance) {
      return {
        isValid: false,
        code: 'INSUFFICIENT_BALANCE',
        params: { symbol: fromToken.symbol },
        message: `Insufficient ${fromToken.symbol} balance`,
      };
    }
    if (fromUsd < MIN_USD_VALUE || toValue <= 0) {
      return { isValid: false, code: 'AMOUNT_TOO_SMALL', message: 'Amount too small' };
    }
    return { isValid: true };
  }, [amount, fromBalance, fromToken, fromUsd, fromValue, toToken, toValue]);

  // ---- Handlers -----------------------------------------------------------

  const changeAmount = useCallback((field: SwapField, raw: string) => {
    const sanitized = sanitizeAmountInput(raw);
    if (sanitized === null) return;
    setActiveField(field);
    setAmount(sanitized);
  }, []);

  /** Choosing the token that is already on the other side flips the pair. */
  const selectToken = useCallback(
    (field: SwapField, symbol: string) => {
      if (field === 'from') {
        if (symbol === toSymbol) setToSymbol(fromSymbol);
        setFromSymbol(symbol);
      } else {
        if (symbol === fromSymbol) setFromSymbol(toSymbol);
        setToSymbol(symbol);
      }
    },
    [fromSymbol, toSymbol],
  );

  /** Flip tokens while keeping the amounts the user sees. */
  const flip = useCallback(() => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setActiveField((f) => (f === 'from' ? 'to' : 'from'));
  }, [fromSymbol, toSymbol]);

  const setFromPercentage = useCallback(
    (ratio: number) => {
      setActiveField('from');
      setAmount(toInputString(fromBalance * ratio));
    },
    [fromBalance],
  );

  const reset = useCallback(() => {
    setAmount('');
    setActiveField('from');
  }, []);

  const buildRequest = useCallback((): SwapRequest | null => {
    if (!validation.isValid || !fromSymbol || !toSymbol) return null;
    return { fromSymbol, toSymbol, fromAmount: fromValue, toAmount: toValue };
  }, [fromSymbol, fromValue, toSymbol, toValue, validation.isValid]);

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    fromBalance,
    toBalance,
    fromUsd,
    toUsd,
    rate,
    rateLabel: fromToken && toToken ? `1 ${fromToken.symbol} = ${formatTokenAmount(rate)} ${toToken.symbol}` : '',
    slippage,
    minimumReceived,
    validation,
    changeAmount,
    selectToken,
    flip,
    setFromPercentage,
    setSlippage,
    reset,
    buildRequest,
  };
};

export type SwapFormState = ReturnType<typeof useSwapForm>;
