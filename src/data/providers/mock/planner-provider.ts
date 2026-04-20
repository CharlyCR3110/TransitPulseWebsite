import { TRIP_OPTIONS } from '@/data/transit';
import type { PlannerProvider, PlannerSearchInput, TripDetailDto, ActiveTripDto, SortMode } from '@/data/contracts/planner';
import type { TripOption } from '@/types/transit';

function sortOptions(options: TripOption[], sort: SortMode): TripOption[] {
  const arr = [...options];
  if (sort === 'fastest') arr.sort((a, b) => a.minutes - b.minutes);
  if (sort === 'cheapest') arr.sort((a, b) => a.price - b.price);
  if (sort === 'fewest') arr.sort((a, b) => a.transfers - b.transfers || a.minutes - b.minutes);
  return arr;
}

export const mockPlannerProvider: PlannerProvider = {
  async searchTrips({ sort }: PlannerSearchInput): Promise<TripOption[]> {
    await delay(600);
    return sortOptions(TRIP_OPTIONS, sort);
  },

  async getTripDetail(tripId: string): Promise<TripDetailDto | null> {
    await delay(0);
    const trip = TRIP_OPTIONS.find((t) => t.id === tripId) ?? TRIP_OPTIONS[0];
    return trip;
  },

  async startTrip(tripId: string): Promise<ActiveTripDto> {
    await delay(0);
    const trip = TRIP_OPTIONS.find((t) => t.id === tripId) ?? TRIP_OPTIONS[0];
    return {
      tripId: trip.id,
      currentStepIndex: 0,
      steps: trip.steps,
      etaMinutes: trip.minutes,
      started: Date.now(),
    };
  },

  async advanceStep(tripId: string, currentIndex: number): Promise<ActiveTripDto> {
    await delay(0);
    const trip = TRIP_OPTIONS.find((t) => t.id === tripId) ?? TRIP_OPTIONS[0];
    const next = Math.min(currentIndex + 1, trip.steps.length - 1);
    const remaining = trip.steps.slice(next).reduce((acc, s) => acc + (s.minutes ?? 0), 0);
    return {
      tripId: trip.id,
      currentStepIndex: next,
      steps: trip.steps,
      etaMinutes: remaining,
      started: Date.now(),
    };
  },
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
