import { useMemo } from 'react';
import type { FC, HTMLAttributes } from 'react';

// ============================================================================
// External dependencies (assumed to exist in the original codebase).
// Declared here only so this file type-checks in isolation.
// ============================================================================

/** In the original code `BoxProps` comes from the UI library (e.g. MUI `Box`). */
type BoxProps = HTMLAttributes<HTMLDivElement>;

declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number | undefined>;
declare const classes: { row: string };
declare const WalletRow: FC<{
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}>;

// ============================================================================
// Types
// ============================================================================

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  // Was missing in the original interface although it is used everywhere.
  // Kept as `string` because the API may return chains we don't prioritize.
  blockchain: Blockchain | (string & {});
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

// No extra props -> a type alias instead of an empty interface.
type WalletPageProps = BoxProps;

// ============================================================================
// Pure helpers (module scope: created once, not on every render)
// ============================================================================

const BLOCKCHAIN_PRIORITY: Readonly<Record<Blockchain, number>> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const UNKNOWN_PRIORITY = -99;

const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain as Blockchain] ?? UNKNOWN_PRIORITY;

const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

// ============================================================================
// Component
// ============================================================================

export const WalletPage = ({ children, ...rest }: WalletPageProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Depends on `balances` only -> price ticks no longer trigger a re-sort.
  const sortedBalances = useMemo(
    () =>
      balances
        // Compute each priority once (O(n)) instead of twice per comparison (O(n log n)).
        .map((balance) => ({ balance, priority: getPriority(balance.blockchain) }))
        .filter(({ balance, priority }) => priority > UNKNOWN_PRIORITY && balance.amount > 0)
        // Always returns a number: priority desc, then amount desc as a deterministic tie-break.
        .sort((lhs, rhs) => rhs.priority - lhs.priority || rhs.balance.amount - lhs.balance.amount)
        .map(({ balance }) => balance),
    [balances],
  );

  // Cheap per-row derivation that depends on prices: formatting + USD value in one pass.
  const formattedBalances = useMemo<FormattedWalletBalance[]>(
    () =>
      sortedBalances.map((balance) => ({
        ...balance,
        formatted: amountFormatter.format(balance.amount),
        usdValue: (prices[balance.currency] ?? 0) * balance.amount,
      })),
    [sortedBalances, prices],
  );

  return (
    <div {...rest}>
      {formattedBalances.map((balance) => (
        <WalletRow
          // Stable identity instead of the array index.
          key={`${balance.blockchain}:${balance.currency}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
      {children}
    </div>
  );
};

export default WalletPage;
