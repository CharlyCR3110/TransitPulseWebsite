import type { StopsProvider } from '@/data/contracts/stops';

const notImplemented = (method: string) => {
  throw new Error(`api stopsProvider.${method} not implemented yet`);
};

export const stopsProvider: StopsProvider = {
  getStop: () => notImplemented('getStop'),
  getAllStops: () => notImplemented('getAllStops'),
};
