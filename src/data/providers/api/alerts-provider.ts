import type { AlertsProvider } from '@/data/contracts/alerts';

const notImplemented = (method: string) => {
  throw new Error(`api alertsProvider.${method} not implemented yet`);
};

export const alertsProvider: AlertsProvider = {
  getAlerts: () => notImplemented('getAlerts'),
  getAlertsForRoutes: () => notImplemented('getAlertsForRoutes'),
};
