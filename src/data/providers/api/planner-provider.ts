import { apiClient } from '@/data/api/client';
import { isNotFound } from '@/data/api/errors';
import type { PlannerProvider, TripDetailDto } from '@/data/contracts/planner';
import type { TripOption } from '@/types/transit';

const notImplemented = (method: string) => {
  throw new Error(`api plannerProvider.${method} not implemented yet`);
};

export const plannerProvider: PlannerProvider = {
  searchTrips: ({ from, to, sort }) =>
    apiClient.request<TripOption[]>('GET', '/planner/search', {
      query: { from, to, sort },
    }),

  async getTripDetail(tripId) {
    try {
      return await apiClient.request<TripDetailDto>(
        'GET',
        `/planner/trips/${encodeURIComponent(tripId)}`,
      );
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },

  startTrip: () => notImplemented('startTrip'),
  advanceStep: () => notImplemented('advanceStep'),
};
