import { apiClient } from '@/data/api/client';
import type { ArrivalsProvider } from '@/data/contracts/arrivals';
import type { Arrival } from '@/types/transit';

export const arrivalsProvider: ArrivalsProvider = {
  getHomeArrivals: () => apiClient.request<Arrival[]>('GET', '/arrivals/home'),
  getArrivalsForStop: (stopId) =>
    apiClient.request<Arrival[]>('GET', `/arrivals/stops/${encodeURIComponent(stopId)}`),
};
