import type { TranslationDictionary } from '../types/i18n.types';

export const en: TranslationDictionary = {
  tagline: 'Trade tokens instantly at the best rate.',
  footer: 'Prices from Switcheo · Swaps are simulated for demo purposes',
  mockWallet: 'Mock wallet',

  swap: 'Swap',
  livePrices: 'Live prices',
  pricesRefreshHint: 'Prices refresh every 60s',
  switchTokens: 'Switch tokens',

  youPay: 'You pay',
  youReceive: 'You receive',
  selectToken: 'Select token',
  balance: 'Balance',
  quickAmount: 'Quick amount',
  max: 'MAX',

  invertRate: 'Invert rate',
  maxSlippage: 'Max slippage',
  minimumReceived: 'Minimum received',
  networkFee: 'Network fee',
  route: 'Route',

  confirmSwap: 'Confirm swap',
  swapping: 'Swapping…',
  swapFailed: 'Swap failed',
  pleaseTryAgain: 'Please try again.',
  unknownError: 'Unknown error',
  validationSelectToken: 'Select a token',
  validationEnterAmount: 'Enter an amount',
  validationInsufficientBalance: (symbol: string) => `Insufficient ${symbol} balance`,
  validationAmountTooSmall: 'Amount too small',

  swapSuccessful: 'Swap successful',
  txHash: 'Tx hash',
  swapAgain: 'Swap again',

  selectAToken: 'Select a token',
  searchBySymbol: 'Search by symbol',
  paired: 'paired',
  noTokensMatch: (query: string) => `No tokens match “${query}”`,
  onlyPricedTokens: 'Only tokens with a known price can be swapped.',
  close: 'Close',

  couldNotLoadPrices: 'Couldn’t load prices',
  tryAgain: 'Try again',
  somethingWentWrong: 'Something went wrong.',
};
