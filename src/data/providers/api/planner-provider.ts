import type { PlannerProvider } from '@/data/contracts/planner';

const notImplemented = (method: string) => {
  throw new Error(`api plannerProvider.${method} not implemented yet`);
};

export const plannerProvider: PlannerProvider = {
  searchTrips: () => notImplemented('searchTrips'),
  getTripDetail: () => notImplemented('getTripDetail'),
  startTrip: () => notImplemented('startTrip'),
  advanceStep: () => notImplemented('advanceStep'),
};
