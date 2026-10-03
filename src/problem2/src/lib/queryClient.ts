import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => console.error('[query]', query.queryKey, error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => console.error('[mutation]', error),
  }),
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      // Only escalate to the Error Boundary when there is no data to show yet;
      // background refetch failures keep the last good prices on screen.
      throwOnError: (_error, query) => query.state.data === undefined,
    },
    mutations: {
      // Mutation errors are shown inline in the form instead.
      throwOnError: false,
    },
  },
});
