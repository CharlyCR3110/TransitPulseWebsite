import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useStopDetail } from './use-stop-detail';
import type { StopDetailDto } from '@/data/contracts/stops';

vi.mock('@/data/providers', () => ({
  stopsProvider: { getStop: vi.fn() },
}));

import { stopsProvider } from '@/data/providers';

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

const detail: StopDetailDto = {
  stop: { id: 's1', nameKey: 'stop_1', addrKey: 'a', dist: 0, live: true, routes: [], lat: 9.9343, lng: -84.0508 },
  arrivals: [],
  updatedAt: 1,
};

describe('useStopDetail', () => {
  it('starts loading then exposes detail', async () => {
    vi.mocked(stopsProvider.getStop).mockResolvedValue(detail);
    const { result } = renderHook(() => useStopDetail('s1'), { wrapper: makeWrapper() });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.detail).toBe(detail);
    expect(result.current.error).toBeNull();
  });

  it('returns detail=null when provider resolves null (404 case)', async () => {
    vi.mocked(stopsProvider.getStop).mockResolvedValue(null);
    const { result } = renderHook(() => useStopDetail('nope'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.detail).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('exposes error when provider rejects', async () => {
    vi.mocked(stopsProvider.getStop).mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useStopDetail('x'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.detail).toBeNull();
    expect(result.current.error).toBe('Failed to load stop');
  });
});
