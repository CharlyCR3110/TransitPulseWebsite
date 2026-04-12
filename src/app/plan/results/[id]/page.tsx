import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Info,
  Map,
  ShieldCheck,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ModePill } from '@/components/transit/ModePill';
import { OccupancyBadge } from '@/components/transit/OccupancyBadge';
import { StaleBanner } from '@/components/transit/StaleBanner';
import { getTrip } from '@/services/trips';
import { getAlertsByRoute } from '@/services/alerts';
import { formatDuration, formatFare, formatTime, formatRelative } from '@/lib/format';

interface Props {
  params: Promise<{ id: string }>;
}

const reliabilityConfig = {
  high: { label: 'Alta confianza', icon: ShieldCheck, classes: 'text-on-time' },
  medium: { label: 'Confianza media', icon: Info, classes: 'text-delayed' },
  low: { label: 'Baja confianza', icon: Info, classes: 'text-disrupted' },
};

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params;
  const trip = getTrip(id);
  if (!trip) notFound();
  const now = new Date();

  // Collect alerts affecting any leg's route
  const routeIds = trip.legs
    .map((l) => l.route?.id)
    .filter((rid): rid is string => Boolean(rid));
  const allAlerts = routeIds.flatMap((rid) => getAlertsByRoute(rid));
  const uniqueAlerts = allAlerts.filter(
    (a, i, arr) => arr.findIndex((b) => b.id === a.id) === i,
  );
  const activeAlerts = uniqueAlerts.filter((a) => a.isActive);

  const { label: reliabilityLabel, icon: ReliabilityIcon, classes: reliabilityClasses } =
    reliabilityConfig[trip.reliability];

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">
      <StaleBanner updatedAt={trip.updatedAt} initialNow={now} className="mb-1" />

      {/* Map placeholder */}
      <div className="rounded-xl overflow-hidden border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 h-44 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <Map className="h-8 w-8 opacity-40" />
        <p className="text-sm opacity-60">Vista de mapa — próximamente</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground mb-0.5">Tarifa</p>
          <p className="text-lg font-bold">{formatFare(trip.totalFare)}</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground mb-0.5">Duración</p>
          <p className="text-lg font-bold">{formatDuration(trip.totalDurationMinutes)}</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground mb-0.5">Transbordos</p>
          <p className="text-lg font-bold">{trip.transfers}</p>
        </div>
      </div>

      {/* Confidence + freshness */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <div className={`flex items-center gap-2 text-sm ${reliabilityClasses}`}>
          <ReliabilityIcon className="h-4 w-4" />
          <span>{reliabilityLabel}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatRelative(trip.updatedAt)}
        </span>
      </div>

      {/* Occupancy */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">Ocupación estimada</p>
        <OccupancyBadge level={trip.worstOccupancy} showLabel />
      </div>

      {/* Leg-by-leg itinerary */}
      <section>
        <h3 className="font-semibold text-base mb-3">Itinerario</h3>
        <div className="rounded-xl border bg-card overflow-hidden">
          {trip.legs.map((leg, idx) => (
            <div key={leg.id}>
              {idx > 0 && <Separator />}
              <div className="px-4 py-4">
                {/* Mode + route */}
                <div className="flex items-center gap-2 mb-2">
                  <ModePill
                    mode={leg.mode}
                    label={
                      leg.route?.shortName ??
                      (leg.mode === 'walk'
                        ? `Caminar ${leg.walkMinutes ?? '5'} min`
                        : undefined)
                    }
                    size="sm"
                  />
                  {leg.route && (
                    <span className="text-xs text-muted-foreground truncate">
                      {leg.route.longName}
                    </span>
                  )}
                </div>

                {/* From → To */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{leg.from.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {formatTime(leg.departAt)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-medium truncate">{leg.to.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {formatTime(leg.arriveAt)}
                    </p>
                  </div>
                </div>

                {/* Intermediate stops count */}
                {leg.stops.length > 2 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {leg.stops.length - 2} paradas intermedias
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active alerts */}
      {activeAlerts.length > 0 && (
        <section>
          <h3 className="font-semibold text-base mb-3">
            Alertas activas{' '}
            <span className="ml-1 rounded-full bg-disrupted/15 px-2 py-0.5 text-xs font-medium text-disrupted">
              {activeAlerts.length}
            </span>
          </h3>
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <Link key={alert.id} href={`/alerts/${alert.id}`}>
                <div className="flex items-start gap-3 rounded-lg border border-disrupted/20 bg-disrupted/5 px-4 py-3 hover:bg-disrupted/10 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {alert.affectedRouteIds.map((rid) =>
                        routeIds.includes(rid) ? (
                          <span
                            key={rid}
                            className="inline-block rounded bg-muted px-1.5 py-0.5 text-xs"
                          >
                            {rid.replace('route-', '')}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Fare info — read only */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 pb-4">
        <p className="text-sm font-medium">Tarifa estimada</p>
        <div className="text-right">
          <p className="text-lg font-bold">{formatFare(trip.totalFare)}</p>
          <p className="text-xs text-muted-foreground">Los precios son referenciales</p>
        </div>
      </div>
    </div>
  );
}
