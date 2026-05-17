import type { PlannerSearchInput } from '@/data/contracts/planner';

export const qk = {
  planner: {
    all: ['planner'] as const,
    search: (input: PlannerSearchInput) => ['planner', 'search', input] as const,
    trip: (tripId: string, departureAt?: string) => ['planner', 'trip', tripId, departureAt ?? null] as const,
    activeTrip: (tripId: string) => ['planner', 'activeTrip', tripId] as const,
  },
  stops: {
    all: ['stops'] as const,
    list: () => ['stops', 'list'] as const,
    byId: (stopId: string) => ['stops', stopId] as const,
  },
  alerts: {
    all: () => ['alerts'] as const,
    byRoutes: (routes: readonly string[]) => ['alerts', 'byRoutes', [...routes].sort()] as const,
  },
  arrivals: {
    home: () => ['arrivals', 'home'] as const,
    byStop: (stopId: string) => ['arrivals', 'stops', stopId] as const,
  },
  routes: {
    all: ['routes'] as const,
    list: () => ['routes', 'list'] as const,
    byId: (routeId: string) => ['routes', routeId] as const,
  },
  users: {
    me: () => ['users', 'me'] as const,
    stats: () => ['users', 'me', 'stats'] as const,
  },
} as const;
