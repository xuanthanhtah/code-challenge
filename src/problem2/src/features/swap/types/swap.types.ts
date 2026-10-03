/** Raw price entry returned by https://interview.switcheo.com/prices.json */
export interface TokenPriceDto {
  currency: string;
  date: string;
  price: number;
}

/** Normalized token used across the UI. */
export interface Token {
  symbol: string;
  /** Price in USD. */
  price: number;
  updatedAt: string;
  iconUrl: string;
}

/** Mocked wallet balances keyed by token symbol. */
export type Balances = Record<string, number>;

/** Which side of the form the user last typed into. */
export type SwapField = 'from' | 'to';

export interface SwapRequest {
  fromSymbol: string;
  toSymbol: string;
  fromAmount: number;
  toAmount: number;
}

export interface SwapResponse extends SwapRequest {
  txHash: string;
  completedAt: string;
}

export type SwapValidationCode =
  | 'SELECT_TOKEN'
  | 'ENTER_AMOUNT'
  | 'INSUFFICIENT_BALANCE'
  | 'AMOUNT_TOO_SMALL'
  | 'NO_ROUTE';

export interface SwapValidation {
  isValid: boolean;
  code?: SwapValidationCode;
  message?: string;
  params?: Record<string, string>;
}
