import { apiClient } from '@/data/api/client';
import { isNotFound } from '@/data/api/errors';
import type { StopsProvider, StopDetailDto } from '@/data/contracts/stops';
import type { Stop } from '@/types/transit';

export const stopsProvider: StopsProvider = {
  getAllStops: () => apiClient.request<Stop[]>('GET', '/stops'),
  async getStop(stopId) {
    try {
      return await apiClient.request<StopDetailDto>('GET', `/stops/${encodeURIComponent(stopId)}`);
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },
};
