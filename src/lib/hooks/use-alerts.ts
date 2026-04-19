import { ALERTS } from '@/data/transit';
import type { Alert } from '@/types/transit';

export function useAlerts(): { alerts: Alert[]; alertsCount: number } {
  return {
    alerts: ALERTS,
    alertsCount: ALERTS.filter((a) => a.severity !== 'ok').length,
  };
}
