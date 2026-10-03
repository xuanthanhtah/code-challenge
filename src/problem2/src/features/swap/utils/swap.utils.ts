import type { Token, TokenPriceDto } from '../types/swap.types';

export const MAX_DECIMALS = 8;

const TOKEN_ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const getTokenIconUrl = (symbol: string): string => `${TOKEN_ICON_BASE_URL}/${symbol}.svg`;

/**
 * The price feed contains duplicates (e.g. BUSD twice) and may contain invalid prices.
 * Keep the most recent valid price per currency and sort alphabetically.
 */
export const normalizePrices = (dtos: TokenPriceDto[]): Token[] => {
  const latest = new Map<string, TokenPriceDto>();

  for (const dto of dtos) {
    if (!dto?.currency || !Number.isFinite(dto.price) || dto.price <= 0) continue;
    const current = latest.get(dto.currency);
    if (!current || new Date(dto.date).getTime() >= new Date(current.date).getTime()) {
      latest.set(dto.currency, dto);
    }
  }

  return [...latest.values()]
    .map((dto) => ({
      symbol: dto.currency,
      price: dto.price,
      updatedAt: dto.date,
      iconUrl: getTokenIconUrl(dto.currency),
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol, 'en', { sensitivity: 'base' }));
};

/** Convert an amount of one token into another using their USD prices. */
export const convertAmount = (amount: number, fromPrice: number, toPrice: number): number => {
  if (!Number.isFinite(amount) || fromPrice <= 0 || toPrice <= 0) return 0;
  return (amount * fromPrice) / toPrice;
};

/**
 * Sanitize raw keyboard input for a decimal amount field.
 * Returns `null` when the input should be rejected (keeps the previous value).
 */
export const sanitizeAmountInput = (raw: string, maxDecimals = MAX_DECIMALS): string | null => {
  const value = raw.replace(/,/g, '.').replace(/\s/g, '');
  if (value === '') return '';
  if (!/^\d*\.?\d*$/.test(value)) return null;

  const [intPart, decPart] = value.split('.');
  if (decPart !== undefined && decPart.length > maxDecimals) return null;

  // Strip redundant leading zeros: "0005" -> "5", but keep "0.5"
  const normalizedInt = intPart.replace(/^0+(?=\d)/, '');
  const withLeadingZero = normalizedInt === '' && decPart !== undefined ? '0' : normalizedInt;
  return decPart !== undefined ? `${withLeadingZero}.${decPart}` : withLeadingZero;
};

export const parseAmount = (value: string): number => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

/** Number -> plain input string (no exponent), truncated to `maxDecimals`. */
export const toInputString = (n: number, maxDecimals = MAX_DECIMALS): string => {
  if (!Number.isFinite(n) || n <= 0) return '';
  const factor = 10 ** maxDecimals;
  const truncated = Math.floor(n * factor) / factor;
  return truncated.toFixed(maxDecimals).replace(/\.?0+$/, '');
};

/** Decimal precision for computed (non-typed) amounts: fewer decimals for larger values. */
export const precisionFor = (n: number): number => {
  const abs = Math.abs(n);
  if (abs >= 1000) return 2;
  if (abs >= 1) return 4;
  if (abs >= 0.01) return 6;
  return MAX_DECIMALS;
};

/** Number -> input string with magnitude-aware precision. */
export const toComputedInputString = (n: number): string => toInputString(n, precisionFor(n));

/** Human friendly token amount: more decimals for small numbers. */
export const formatTokenAmount = (n: number): string => {
  if (!Number.isFinite(n) || n === 0) return '0';
  const abs = Math.abs(n);
  const maximumFractionDigits = abs >= 1000 ? 2 : abs >= 1 ? 4 : abs >= 0.0001 ? 6 : 8;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(n);
};

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export const formatUsd = (n: number): string => {
  if (!Number.isFinite(n) || n === 0) return '$0.00';
  if (n > 0 && n < 0.01) return '< $0.01';
  return usdFormatter.format(n);
};

export const shortenHash = (hash: string, size = 6): string =>
  hash.length <= size * 2 ? hash : `${hash.slice(0, size)}…${hash.slice(-size + 2)}`;
