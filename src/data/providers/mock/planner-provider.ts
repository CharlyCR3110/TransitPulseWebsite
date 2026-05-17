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

  async getTripDetail(tripId: string, _departureAt?: string): Promise<TripDetailDto | null> {
    await delay(0);
    return TRIP_OPTIONS.find((t) => t.id === tripId) ?? null;
  },

  async startTrip(tripId: string): Promise<ActiveTripDto | null> {
    await delay(0);
    const trip = TRIP_OPTIONS.find((t) => t.id === tripId);
    if (!trip) return null;
    const activeTripId = makeActiveTripId();
    activeTrips.set(activeTripId, { tripId, started: Date.now() });
    return {
      tripId: trip.id,
      activeTripId,
      currentStepIndex: 0,
      steps: trip.steps,
      etaMinutes: trip.minutes,
      started: activeTrips.get(activeTripId)!.started,
    };
  },

  async advanceStep(tripId: string, activeTripId: string, currentIndex: number): Promise<ActiveTripDto | null> {
    await delay(0);
    const session = activeTrips.get(activeTripId);
    if (!session || session.tripId !== tripId) return null;
    const trip = TRIP_OPTIONS.find((t) => t.id === tripId);
    if (!trip) return null;
    const next = Math.min(currentIndex + 1, trip.steps.length - 1);
    const remaining = trip.steps.slice(next).reduce((acc, s) => acc + (s.minutes ?? 0), 0);
    return {
      tripId: trip.id,
      activeTripId,
      currentStepIndex: next,
      steps: trip.steps,
      etaMinutes: remaining,
      started: session.started,
    };
  },
};

const activeTrips = new Map<string, { tripId: string; started: number }>();

function makeActiveTripId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `mock-active-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
