import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitSwap } from '../api/swap.api';
import type { Balances, SwapRequest } from '../types/swap.types';
import { walletBalancesQueryKey } from './useWalletBalances';

/** Submits a (mocked) swap and optimistically settles the wallet balances on success. */
export const useSwapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SwapRequest) => submitSwap(request),
    onSuccess: (result) => {
      queryClient.setQueryData<Balances>(walletBalancesQueryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [result.fromSymbol]: Math.max(0, (prev[result.fromSymbol] ?? 0) - result.fromAmount),
          [result.toSymbol]: (prev[result.toSymbol] ?? 0) + result.toAmount,
        };
      });
    },
  });
};
