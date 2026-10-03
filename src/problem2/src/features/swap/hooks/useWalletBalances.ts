import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWalletBalances } from '../api/swap.api';
import type { Token } from '../types/swap.types';

export const walletBalancesQueryKey = ['swap', 'wallet-balances'] as const;

/** Mocked wallet balances; only fetched once token prices are known. */
export const useWalletBalances = (tokens: Token[] | undefined) => {
  const priceMap = useMemo(
    () => Object.fromEntries((tokens ?? []).map((t) => [t.symbol, t.price])),
    [tokens],
  );

  return useQuery({
    queryKey: walletBalancesQueryKey,
    queryFn: () => fetchWalletBalances(priceMap),
    enabled: !!tokens?.length,
    staleTime: Infinity,
  });
};
