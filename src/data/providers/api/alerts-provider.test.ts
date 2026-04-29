import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { alertsProvider } from './alerts-provider';
import type { Alert } from '@/types/transit';

afterEach(() => {
  vi.restoreAllMocks();
});

const sample: Alert[] = [
  { id: 'a1', severity: 'bad', titleKey: 't', bodyKey: 'b', emittedAt: '2026-04-28T12:00:00Z', routes: ['100'] },
];

describe('api alertsProvider', () => {
  it('getAlerts hits GET /alerts with no query', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(sample);
    const result = await alertsProvider.getAlerts();
    expect(spy).toHaveBeenCalledWith('GET', '/alerts');
    expect(result).toBe(sample);
  });

  it('getAlertsForRoutes joins routeIds with comma', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(sample);
    await alertsProvider.getAlertsForRoutes(['100', 'T1', '302']);
    expect(spy).toHaveBeenCalledWith('GET', '/alerts', {
      query: { routeIds: '100,T1,302' },
    });
  });

  it('getAlertsForRoutes with empty array sends empty string', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue([]);
    await alertsProvider.getAlertsForRoutes([]);
    expect(spy).toHaveBeenCalledWith('GET', '/alerts', {
      query: { routeIds: '' },
    });
  });
});
