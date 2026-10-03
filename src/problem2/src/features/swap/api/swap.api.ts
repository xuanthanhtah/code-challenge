import axios from 'axios';
import type { Balances, SwapRequest, SwapResponse, TokenPriceDto } from '../types/swap.types';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Real network call to the price feed. */
export const fetchTokenPrices = async (): Promise<TokenPriceDto[]> => {
  const { data } = await axios.get<TokenPriceDto[]>(PRICES_URL, { timeout: 10_000 });
  return data;
};

/** Deterministic pseudo-random number in [0, 1) derived from a string. */
const seededRandom = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10_000) / 10_000;
};

/**
 * MOCK: wallet balances. Each token gets a deterministic balance worth $800 – $8,000
 * so the "insufficient balance" validation can be exercised.
 */
export const fetchWalletBalances = async (prices: Record<string, number>): Promise<Balances> => {
  await sleep(400);
  return Object.fromEntries(
    Object.entries(prices).map(([symbol, price]) => {
      const usdValue = 800 + seededRandom(symbol) * 7_200;
      return [symbol, Number((usdValue / price).toFixed(6))];
    }),
  );
};

/** MOCK: submit a swap to a backend. Takes ~2s and returns a fake tx hash. */
export const submitSwap = async (request: SwapRequest): Promise<SwapResponse> => {
  await sleep(1_800 + Math.random() * 700);

  const txHash =
    '0x' +
    Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');

  return { ...request, txHash, completedAt: new Date().toISOString() };
};
