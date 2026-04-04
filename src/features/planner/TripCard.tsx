import Link from 'next/link';
import { ArrowRight, Clock, Repeat2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModePill } from '@/components/transit/ModePill';
import { OccupancyBadge } from '@/components/transit/OccupancyBadge';
import { formatDuration, formatFare, formatTime } from '@/lib/format';
import type { Trip } from '@/types/transit';

interface TripCardProps {
  trip: Trip;
  rank?: number;
}

const reliabilityConfig = {
  high: { label: 'Alta', classes: 'text-on-time' },
  medium: { label: 'Media', classes: 'text-delayed' },
  low: { label: 'Baja', classes: 'text-disrupted' },
};

export function TripCard({ trip, rank }: TripCardProps) {
  const { label: reliabilityLabel, classes: reliabilityClasses } =
    reliabilityConfig[trip.reliability];

  return (
    <Link href={`/plan/results/${trip.id}`}>
      <article
        className={cn(
          'rounded-xl border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer',
          rank === 0 && 'border-primary/40 ring-1 ring-primary/20',
        )}
      >
        {rank === 0 && (
          <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Opción más rápida
          </div>
        )}

        {/* Leg strip */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {trip.legs.map((leg, idx) => (
            <div key={leg.id} className="flex items-center gap-1.5">
              {idx > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              <ModePill
                mode={leg.mode}
                label={leg.route?.shortName ?? (leg.mode === 'walk' ? 'Caminar' : undefined)}
                size="sm"
              />
            </div>
          ))}
        </div>

        {/* Time range */}
        <div className="flex items-baseline gap-1 mb-3 text-sm text-muted-foreground">
          <span className="font-mono font-semibold text-foreground">
            {formatTime(trip.legs[0].departAt)}
          </span>
          <span>→</span>
          <span className="font-mono font-semibold text-foreground">
            {formatTime(trip.legs[trip.legs.length - 1].arriveAt)}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs flex-wrap">
          <span className="flex items-center gap-1 font-semibold text-sm">
            {formatFare(trip.totalFare)}
          </span>

          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(trip.totalDurationMinutes)}
          </span>

          {trip.transfers > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Repeat2 className="h-3 w-3" />
              {trip.transfers} {trip.transfers === 1 ? 'transbordo' : 'transbordos'}
            </span>
          )}

          <span className={cn('flex items-center gap-1', reliabilityClasses)}>
            <TrendingUp className="h-3 w-3" />
            Fiabilidad {reliabilityLabel}
          </span>

          <OccupancyBadge level={trip.worstOccupancy} showLabel={false} />
        </div>
      </article>
    </Link>
  );
}
