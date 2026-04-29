import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { arrivalsProvider } from './arrivals-provider';
import type { Arrival } from '@/types/transit';

afterEach(() => {
  vi.restoreAllMocks();
});

const sample: Arrival[] = [
  { id: 'arr1', route: '100', kind: 'bus', destEs: 'A', destEn: 'A', etaSec: 120, status: 'on-time', occupancy: 1 },
];

describe('api arrivalsProvider', () => {
  it('getHomeArrivals calls GET /arrivals/home', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(sample);
    const result = await arrivalsProvider.getHomeArrivals();
    expect(spy).toHaveBeenCalledWith('GET', '/arrivals/home');
    expect(result).toBe(sample);
  });

  it('getArrivalsForStop URL-encodes the id', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(sample);
    await arrivalsProvider.getArrivalsForStop('s 1');
    expect(spy).toHaveBeenCalledWith('GET', '/arrivals/stops/s%201');
  });
});
