import type { Stop } from '@/types/transit';

export const stops: Stop[] = [
  {
    id: 'stop-sjc',
    name: 'San José Central',
    coords: { lat: 9.9281, lng: -84.0907 },
    routeIds: ['route-106', 'route-200', 'route-train-pa', 'route-train-ca'],
  },
  {
    id: 'stop-hatillo',
    name: 'Hatillo Centro',
    coords: { lat: 9.9062, lng: -84.1072 },
    routeIds: ['route-106', 'route-310'],
  },
  {
    id: 'stop-cartago',
    name: 'Cartago Terminal',
    coords: { lat: 9.8638, lng: -83.9197 },
    routeIds: ['route-train-ca', 'route-410'],
  },
  {
    id: 'stop-alajuela',
    name: 'Alajuela Central',
    coords: { lat: 10.0163, lng: -84.2152 },
    routeIds: ['route-train-pa', 'route-501'],
  },
  {
    id: 'stop-heredia',
    name: 'Heredia Terminal',
    coords: { lat: 9.9985, lng: -84.1168 },
    routeIds: ['route-200', 'route-train-pa'],
  },
  {
    id: 'stop-desamparados',
    name: 'Desamparados Parque',
    coords: { lat: 9.8979, lng: -84.0702 },
    routeIds: ['route-106', 'route-310'],
  },
  {
    id: 'stop-pavas',
    name: 'Pavas Mall',
    coords: { lat: 9.9344, lng: -84.1333 },
    routeIds: ['route-200', 'route-501'],
  },
  {
    id: 'stop-sabana',
    name: 'Sabana Norte',
    coords: { lat: 9.9375, lng: -84.1053 },
    routeIds: ['route-106', 'route-200', 'route-501'],
  },
  {
    id: 'stop-curridabat',
    name: 'Curridabat Centro',
    coords: { lat: 9.9194, lng: -84.0265 },
    routeIds: ['route-410', 'route-train-ca'],
  },
  {
    id: 'stop-tibas',
    name: 'Tibás Terminal',
    coords: { lat: 9.9667, lng: -84.0977 },
    routeIds: ['route-200', 'route-train-pa'],
  },
];

export function getStop(id: string): Stop | undefined {
  return stops.find((s) => s.id === id);
}
