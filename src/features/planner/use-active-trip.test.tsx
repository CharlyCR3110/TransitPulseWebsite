import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useActiveTrip } from './use-active-trip';
import type { ActiveTripDto } from '@/data/contracts/planner';

vi.mock('@/data/providers', () => ({
  plannerProvider: {
    startTrip: vi.fn(),
    advanceStep: vi.fn(),
  },
}));

import { plannerProvider } from '@/data/providers';

afterEach(() => {
  vi.clearAllMocks();
});

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const initial: ActiveTripDto = {
  tripId: 't1',
  activeTripId: 'a-uuid-1',
  currentStepIndex: 0,
  steps: [
    { kind: 'walk', minutes: 3, toEs: 'A', toEn: 'A', time: '08:42' },
    { kind: 'bus', route: '100', minutes: 14, fromEs: 'A', fromEn: 'A', toEs: 'B', toEn: 'B', time: '08:45', occ: 2, stops: 6 },
  ],
  etaMinutes: 17,
  started: 1714300000000,
};

describe('useActiveTrip', () => {
  it('starts a trip on mount and exposes activeTrip', async () => {
    vi.mocked(plannerProvider.startTrip).mockResolvedValue(initial);
    const { result } = renderHook(() => useActiveTrip('t1'), { wrapper: makeWrapper() });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.activeTrip).toEqual(initial));
    expect(result.current.error).toBeNull();
    expect(plannerProvider.startTrip).toHaveBeenCalledWith('t1');
  });

  it('sets error="not-found" when startTrip resolves null', async () => {
    vi.mocked(plannerProvider.startTrip).mockResolvedValue(null);
    const { result } = renderHook(() => useActiveTrip('nope'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.error).toBe('not-found'));
    expect(result.current.activeTrip).toBeNull();
  });

  it('sets error="load-failed" when startTrip rejects', async () => {
    vi.mocked(plannerProvider.startTrip).mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useActiveTrip('t1'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.error).toBe('load-failed'));
  });

  it('advance() calls advanceStep with activeTripId and updates state', async () => {
    vi.mocked(plannerProvider.startTrip).mockResolvedValue(initial);
    vi.mocked(plannerProvider.advanceStep).mockResolvedValue({ ...initial, currentStepIndex: 1, etaMinutes: 14 });

    const { result } = renderHook(() => useActiveTrip('t1'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.activeTrip).not.toBeNull());

    await act(async () => {
      await result.current.advance();
    });

    expect(plannerProvider.advanceStep).toHaveBeenCalledWith('t1', 'a-uuid-1', 0);
    expect(result.current.activeTrip?.currentStepIndex).toBe(1);
  });

  it('advance() with no activeTrip is a no-op', async () => {
    vi.mocked(plannerProvider.startTrip).mockResolvedValue(null);
    const { result } = renderHook(() => useActiveTrip('nope'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.error).toBe('not-found'));
    await act(async () => {
      await result.current.advance();
    });
    expect(plannerProvider.advanceStep).not.toHaveBeenCalled();
  });
});
