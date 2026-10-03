import { useQuery } from '@tanstack/react-query';
import { fetchTokenPrices } from '../api/swap.api';
import { normalizePrices } from '../utils/swap.utils';

export const tokenPricesQueryKey = ['swap', 'token-prices'] as const;

/** Fetches the price feed and maps it to a de-duplicated, sorted `Token[]`. */
export const useTokenPrices = () =>
  useQuery({
    queryKey: tokenPricesQueryKey,
    queryFn: fetchTokenPrices,
    select: normalizePrices,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
