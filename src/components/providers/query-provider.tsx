'use client';

import { useState } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { isApiError, isAuthRequired, isNotFound } from '@/data/api/errors';
import { captureException } from '@/lib/observability';

export const AUTH_EXPIRED_EVENT = 'auth:expired';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (typeof window === 'undefined') return;
        if (isAuthRequired(error)) {
          window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
          return;
        }
        if (isApiError(error) && error.status >= 500) {
          captureException(error, { queryKey: query.queryKey });
          return;
        }
        if (!isApiError(error)) {
          captureException(error, { queryKey: query.queryKey });
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) =>
          !isAuthRequired(error) && !isNotFound(error) && failureCount < 2,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => createQueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
