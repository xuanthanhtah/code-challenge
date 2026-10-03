import { useTokenPrices } from '../hooks/useTokenPrices';
import { useWalletBalances } from '../hooks/useWalletBalances';
import { SwapCardSkeleton } from './SwapCardSkeleton';
import { SwapForm } from './SwapForm';

/**
 * Data container: waits for prices + balances, then renders the form.
 * Query errors are thrown to the nearest DataErrorBoundary (throwOnError in queryClient).
 */
export const SwapWidget = () => {
  const prices = useTokenPrices();
  const balances = useWalletBalances(prices.data);

  if (!prices.data || !balances.data) return <SwapCardSkeleton />;

  return <SwapForm tokens={prices.data} balances={balances.data} />;
};
