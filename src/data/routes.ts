import type { Route } from '@/types/transit';

export const routes: Route[] = [
  {
    id: 'route-106',
    shortName: '106',
    longName: 'San José - Hatillo - Desamparados',
    mode: 'bus',
    color: '#3b82f6',
    fareMin: 490,
    fareMax: 490,
  },
  {
    id: 'route-200',
    shortName: '200',
    longName: 'San José - Heredia - Pavas',
    mode: 'bus',
    color: '#3b82f6',
    fareMin: 490,
    fareMax: 610,
  },
  {
    id: 'route-310',
    shortName: '310',
    longName: 'Hatillo - Desamparados - Aserrí',
    mode: 'bus',
    color: '#3b82f6',
    fareMin: 490,
    fareMax: 735,
  },
  {
    id: 'route-410',
    shortName: '410',
    longName: 'San José - Curridabat - Tres Ríos',
    mode: 'bus',
    color: '#3b82f6',
    fareMin: 490,
    fareMax: 620,
  },
  {
    id: 'route-501',
    shortName: '501',
    longName: 'Sabana Norte - Pavas - Rohrmoser',
    mode: 'bus',
    color: '#3b82f6',
    fareMin: 490,
    fareMax: 490,
  },
  {
    id: 'route-602',
    shortName: '602',
    longName: 'San José - Tibás - Moravia',
    mode: 'bus',
    color: '#3b82f6',
    fareMin: 490,
    fareMax: 555,
  },
  {
    id: 'route-train-pa',
    shortName: 'INCOFER PA',
    longName: 'INCOFER — San José - Pavas - Alajuela',
    mode: 'train',
    color: '#7c3aed',
    fareMin: 700,
    fareMax: 1050,
  },
  {
    id: 'route-train-ca',
    shortName: 'INCOFER CA',
    longName: 'INCOFER — San José - Curridabat - Cartago',
    mode: 'train',
    color: '#7c3aed',
    fareMin: 700,
    fareMax: 1260,
  },
];

export function getRoute(id: string): Route | undefined {
  return routes.find((r) => r.id === id);
}
