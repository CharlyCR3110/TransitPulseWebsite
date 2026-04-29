import type { ArrivalsProvider } from '@/data/contracts/arrivals';

const notImplemented = (method: string) => {
  throw new Error(`api arrivalsProvider.${method} not implemented yet`);
};

export const arrivalsProvider: ArrivalsProvider = {
  getHomeArrivals: () => notImplemented('getHomeArrivals'),
  getArrivalsForStop: () => notImplemented('getArrivalsForStop'),
};
