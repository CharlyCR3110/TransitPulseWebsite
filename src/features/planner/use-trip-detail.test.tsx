import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTripDetail } from './use-trip-detail';
import type { TripDetailDto } from '@/data/contracts/planner';
import type { Alert } from '@/types/transit';

vi.mock('@/data/providers', () => ({
  plannerProvider: { getTripDetail: vi.fn() },
  alertsProvider: { getAlertsForRoutes: vi.fn() },
}));

import { plannerProvider, alertsProvider } from '@/data/providers';

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

const detail: TripDetailDto = {
  id: 't1',
  minutes: 38,
  price: 920,
  transfers: 1,
  walkMin: 6,
  leaveIn: 4,
  confidence: 0.9,
  occupancy: 2,
  steps: [
    { kind: 'walk', minutes: 3, toEs: 'A', toEn: 'A', time: '08:42' },
    { kind: 'bus', route: '100', minutes: 14, fromEs: 'A', fromEn: 'A', toEs: 'B', toEn: 'B', time: '08:45', occ: 2, stops: 6 },
    { kind: 'bus', route: '201', minutes: 16, fromEs: 'B', fromEn: 'B', toEs: 'C', toEn: 'C', time: '09:03', occ: 3, stops: 9 },
  ],
};

const alerts: Alert[] = Array.from({ length: 5 }, (_, i) => ({
  id: `al${i}`, severity: 'warn', titleKey: 't', bodyKey: 'b', emittedAt: '2026-04-28T12:00:00Z', routes: ['100'],
}));

describe('useTripDetail', () => {
  it('loads trip then chains alerts query for bus routes (limited to 2)', async () => {
    vi.mocked(plannerProvider.getTripDetail).mockResolvedValue(detail);
    vi.mocked(alertsProvider.getAlertsForRoutes).mockResolvedValue(alerts);

    const { result } = renderHook(() => useTripDetail('t1'), { wrapper: makeWrapper() });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.trip).toBe(detail));
    await waitFor(() => expect(result.current.relatedAlerts).toHaveLength(2));

    expect(alertsProvider.getAlertsForRoutes).toHaveBeenCalledWith(['100', '201']);
    expect(result.current.error).toBeNull();
  });

  it('returns error="not-found" when provider resolves null', async () => {
    vi.mocked(plannerProvider.getTripDetail).mockResolvedValue(null);
    const { result } = renderHook(() => useTripDetail('nope'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trip).toBeNull();
    expect(result.current.error).toBe('not-found');
    expect(alertsProvider.getAlertsForRoutes).not.toHaveBeenCalled();
  });

  it('returns error="load-failed" when provider rejects', async () => {
    vi.mocked(plannerProvider.getTripDetail).mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useTripDetail('t1'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('load-failed');
  });

  it('skips alerts query when trip has no bus steps', async () => {
    vi.mocked(plannerProvider.getTripDetail).mockResolvedValue({
      ...detail,
      steps: [{ kind: 'walk', minutes: 3, toEs: 'A', toEn: 'A', time: '08:42' }],
    });
    const { result } = renderHook(() => useTripDetail('t1'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.trip).not.toBeNull());
    expect(alertsProvider.getAlertsForRoutes).not.toHaveBeenCalled();
    expect(result.current.relatedAlerts).toEqual([]);
  });
});
