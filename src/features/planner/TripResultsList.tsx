'use client';

import { useState } from 'react';
import { TripCard } from './TripCard';
import type { Trip } from '@/types/transit';

type SortKey = 'fastest' | 'cheapest' | 'fewest-transfers';

const sortConfig: { key: SortKey; label: string }[] = [
  { key: 'fastest', label: 'Más rápido' },
  { key: 'cheapest', label: 'Más barato' },
  { key: 'fewest-transfers', label: 'Menos transbordos' },
];

function sortTrips(list: Trip[], key: SortKey): Trip[] {
  const copy = [...list];
  if (key === 'fastest') return copy.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
  if (key === 'cheapest') return copy.sort((a, b) => a.totalFare - b.totalFare);
  return copy.sort((a, b) => a.transfers - b.transfers);
}

interface TripResultsListProps {
  trips: Trip[];
}

export function TripResultsList({ trips }: TripResultsListProps) {
  const [sort, setSort] = useState<SortKey>('fastest');
  const sorted = sortTrips(trips, sort);

  return (
    <div className="space-y-4">
      {/* Sort chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sortConfig.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              sort === key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Trip cards */}
      {sorted.length === 0 ? (
        <div className="rounded-xl border bg-card px-4 py-10 text-center">
          <p className="text-sm font-medium mb-1">Sin opciones disponibles</p>
          <p className="text-xs text-muted-foreground">
            No encontramos opciones para ese viaje. Intenta con otro origen o destino.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((trip, idx) => (
            <TripCard key={trip.id} trip={trip} rank={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
