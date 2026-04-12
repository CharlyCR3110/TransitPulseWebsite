import {
  alerts as _alerts,
  getAlert as _getAlert,
  getActiveAlerts as _getActiveAlerts,
  getAlertsByRoute as _getAlertsByRoute,
} from '@/data/alerts';
import type { Alert } from '@/types/alerts';

export async function getAlerts(): Promise<Alert[]> {
  // Future: const res = await fetch('/api/alerts'); return res.json();
  return _alerts;
}

export async function getActiveAlerts(): Promise<Alert[]> {
  // Future: const res = await fetch('/api/alerts?active=true'); return res.json();
  return _getActiveAlerts();
}

export async function getAlert(id: string): Promise<Alert | null> {
  // Future: const res = await fetch(`/api/alerts/${id}`); return res.ok ? res.json() : null;
  return _getAlert(id) ?? null;
}

export async function getAlertsByRoute(routeId: string): Promise<Alert[]> {
  // Future: const res = await fetch(`/api/alerts?routeId=${routeId}`); return res.json();
  return _getAlertsByRoute(routeId);
}
