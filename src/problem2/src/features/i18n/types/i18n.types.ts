export type Locale = 'en' | 'vi';

export interface TranslationDictionary {
  // App Header & Meta
  tagline: string;
  footer: string;
  mockWallet: string;

  // Swap Card Header
  swap: string;
  livePrices: string;
  pricesRefreshHint: string;
  switchTokens: string;

  // Amount Fields
  youPay: string;
  youReceive: string;
  selectToken: string;
  balance: string;
  quickAmount: string;
  max: string;

  // Details
  invertRate: string;
  maxSlippage: string;
  minimumReceived: string;
  networkFee: string;
  route: string;

  // Action & Validation
  confirmSwap: string;
  swapping: string;
  swapFailed: string;
  pleaseTryAgain: string;
  unknownError: string;
  validationSelectToken: string;
  validationEnterAmount: string;
  validationInsufficientBalance: (symbol: string) => string;
  validationAmountTooSmall: string;

  // Success Screen
  swapSuccessful: string;
  txHash: string;
  swapAgain: string;

  // Token Modal
  selectAToken: string;
  searchBySymbol: string;
  paired: string;
  noTokensMatch: (query: string) => string;
  onlyPricedTokens: string;
  close: string;

  // Error boundary
  couldNotLoadPrices: string;
  tryAgain: string;
  somethingWentWrong: string;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: TranslationDictionary;
}
