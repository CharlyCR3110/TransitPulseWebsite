import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { reportsProvider } from './reports-provider';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api reportsProvider', () => {
  it('submit POSTs to /reports with auth: optional', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue({});
    await reportsProvider.submit({
      type: 'delay',
      stopId: 's1',
      description: 'bus 30 minutos tarde',
    });
    expect(spy).toHaveBeenCalledWith('POST', '/reports', {
      auth: 'optional',
      body: { type: 'delay', stopId: 's1', description: 'bus 30 minutos tarde' },
    });
  });

  it('submit passes routeId when provided', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue({});
    await reportsProvider.submit({
      type: 'overcrowded',
      routeId: '100',
      description: 'lleno',
    });
    expect(spy).toHaveBeenCalledWith('POST', '/reports', {
      auth: 'optional',
      body: { type: 'overcrowded', routeId: '100', description: 'lleno' },
    });
  });
});
