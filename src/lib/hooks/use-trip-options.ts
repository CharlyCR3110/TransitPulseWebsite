import { TRIP_OPTIONS } from '@/data/transit';
import type { TripOption } from '@/types/transit';

export function useTripOptions(): TripOption[] {
  return TRIP_OPTIONS;
}
