import { apiClient } from '@/data/api/client';
import { isNotFound } from '@/data/api/errors';
import type { ActiveTripDto, PlannerProvider, TripDetailDto } from '@/data/contracts/planner';
import type { TripOption } from '@/types/transit';

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

  async startTrip(tripId) {
    try {
      return await apiClient.request<ActiveTripDto>(
        'POST',
        `/planner/trips/${encodeURIComponent(tripId)}/start`,
        { auth: 'optional' },
      );
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },

  async advanceStep(activeTripId, currentIndex) {
    try {
      return await apiClient.request<ActiveTripDto, { currentStepIndex: number; activeTripId: string }>(
        'POST',
        `/planner/trips/${encodeURIComponent(activeTripId)}/advance`,
        {
          auth: 'optional',
          body: { currentStepIndex: currentIndex, activeTripId },
        },
      );
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },
};
