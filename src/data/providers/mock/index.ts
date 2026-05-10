// Backwards-compatible named exports (deprecated; prefer importing from `@/data/providers`).
export { mockPlannerProvider } from './planner-provider';
export { mockStopsProvider } from './stops-provider';
export { mockAlertsProvider } from './alerts-provider';
export { mockArrivalsProvider } from './arrivals-provider';
export { mockRoutesProvider } from './routes-provider';

// Canonical names matching the API provider barrel — used by `@/data/providers/index.ts`.
export { mockPlannerProvider as plannerProvider } from './planner-provider';
export { mockStopsProvider as stopsProvider } from './stops-provider';
export { mockAlertsProvider as alertsProvider } from './alerts-provider';
export { mockArrivalsProvider as arrivalsProvider } from './arrivals-provider';
export { mockRoutesProvider as routesProvider } from './routes-provider';
export { reportsProvider } from './reports-provider';
export { authProvider } from './auth-provider';
export { usersProvider } from './users-provider';
