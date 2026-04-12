import { routes as _routes, getRoute as _getRoute } from '@/data/routes';
import type { Route } from '@/types/transit';

export async function getRoutes(): Promise<Route[]> {
  // Future: const res = await fetch('/api/routes'); return res.json();
  return _routes;
}

export async function getRoute(id: string): Promise<Route | null> {
  // Future: const res = await fetch(`/api/routes/${id}`); return res.ok ? res.json() : null;
  return _getRoute(id) ?? null;
}
