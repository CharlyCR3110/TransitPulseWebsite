import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useAlerts } from './use-alerts';
import type { Alert } from '@/types/transit';

vi.mock('@/data/providers', () => ({
  alertsProvider: { getAlerts: vi.fn() },
}));

import { alertsProvider } from '@/data/providers';

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

const sample: Alert[] = [
  { id: 'a1', severity: 'bad', titleKey: 't', bodyKey: 'b', emittedAt: '2026-04-28T12:00:00Z', routes: ['100'] },
  { id: 'a2', severity: 'warn', titleKey: 't', bodyKey: 'b', emittedAt: '2026-04-28T11:00:00Z', routes: ['T1'] },
  { id: 'a3', severity: 'ok', titleKey: 't', bodyKey: 'b', emittedAt: '2026-04-28T10:00:00Z', routes: ['T2'] },
];

describe('useAlerts', () => {
  it('starts in loading then exposes alerts and alertsCount (excludes severity=ok)', async () => {
    vi.mocked(alertsProvider.getAlerts).mockResolvedValue(sample);
    const { result } = renderHook(() => useAlerts(), { wrapper: makeWrapper() });

    expect(result.current.loading).toBe(true);
    expect(result.current.alerts).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.alerts).toEqual(sample);
    expect(result.current.alertsCount).toBe(2);
  });

  it('falls back to empty array on error and exposes the error object', async () => {
    const err = new Error('boom');
    vi.mocked(alertsProvider.getAlerts).mockRejectedValue(err);
    const { result } = renderHook(() => useAlerts(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.alerts).toEqual([]);
    expect(result.current.error).toBe(err);
    expect(result.current.alertsCount).toBe(0);
  });
});
