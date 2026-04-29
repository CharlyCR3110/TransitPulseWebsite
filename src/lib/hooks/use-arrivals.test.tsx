import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useArrivals } from './use-arrivals';
import type { Arrival } from '@/types/transit';

vi.mock('@/data/providers', () => ({
  arrivalsProvider: { getHomeArrivals: vi.fn() },
}));

import { arrivalsProvider } from '@/data/providers';

afterEach(() => {
  vi.restoreAllMocks();
});

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const sample: Arrival[] = [
  { id: 'a1', route: '100', kind: 'bus', destEs: 'A', destEn: 'A', etaSec: 120, status: 'on-time', occupancy: 1 },
];

describe('useArrivals', () => {
  it('starts loading then exposes arrivals from getHomeArrivals', async () => {
    vi.mocked(arrivalsProvider.getHomeArrivals).mockResolvedValue(sample);
    const { result } = renderHook(() => useArrivals(), { wrapper: makeWrapper() });
    expect(result.current.loading).toBe(true);
    expect(result.current.arrivals).toEqual([]);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.arrivals).toBe(sample);
  });
});
