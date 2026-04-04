'use client';

import { useState } from 'react';
import { MapPin, Navigation, Clock, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TripResultsList } from './TripResultsList';

export function PlannerForm() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    setSearched(true);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="space-y-3">
        {/* Origin */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Origen"
            className="pl-9 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setOrigin('Mi ubicación')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Usar mi ubicación"
            title="Usar mi ubicación"
          >
            <LocateFixed className="h-4 w-4" />
          </button>
        </div>

        {/* Destination */}
        <div className="relative">
          <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destino"
            className="pl-9"
            required
          />
        </div>

        {/* Departure toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('now')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium transition-colors ${
              mode === 'now'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            <Navigation className="h-4 w-4" />
            Salir ahora
          </button>
          <button
            type="button"
            onClick={() => setMode('schedule')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium transition-colors ${
              mode === 'schedule'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            <Clock className="h-4 w-4" />
            Programar
          </button>
        </div>

        {mode === 'schedule' && (
          <input
            type="datetime-local"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}

        <Button type="submit" size="lg" className="w-full font-semibold">
          Buscar opciones
        </Button>
      </form>

      {searched && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">
            Opciones de viaje: <span className="font-medium text-foreground">{origin}</span> →{' '}
            <span className="font-medium text-foreground">{destination}</span>
          </p>
          <TripResultsList />
        </div>
      )}
    </div>
  );
}
