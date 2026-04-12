import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { ModePill } from '@/components/transit/ModePill';
import { StatusBadge } from '@/components/transit/StatusBadge';
import { RouteChip } from '@/components/transit/RouteChip';
import { getRoute } from '@/services/routes';
import { getPredictions } from '@/services/predictions';
import { getAlertsByRoute } from '@/services/alerts';
import { getStopsByIds } from '@/services/stops';
import { formatFare, formatTime } from '@/lib/format';

interface Props {
  params: Promise<{ routeId: string }>;
}

export default async function RouteDetailPage({ params }: Props) {
  const { routeId } = await params;
  const [route, arrivals, alerts] = await Promise.all([
    getRoute(routeId),
    getPredictions({ routeId }),
    getAlertsByRoute(routeId),
  ]);
  if (!route) notFound();

  const routeArrivals = arrivals.slice(0, 6);
  const routeAlerts = alerts.filter((a) => a.isActive);

  // Stops served by this route — derive from arrivals stop IDs
  const stopIds = [...new Set(arrivals.map((a) => a.stopId))];
  const servedStops = await getStopsByIds(stopIds);

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">
      {/* Route header */}
      <div className="flex items-start gap-4">
        <RouteChip route={route} size="md" />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold leading-snug">{route.longName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <ModePill mode={route.mode} size="sm" />
            <span className="text-sm text-muted-foreground">
              {formatFare(route.fareMin)}
              {route.fareMax !== route.fareMin && ` - ${formatFare(route.fareMax)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Service status */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">Estado del servicio</p>
        {routeAlerts.length > 0 ? (
          <StatusBadge status="disrupted" />
        ) : (
          <StatusBadge status="on-time" />
        )}
      </div>

      {/* Active alerts */}
      {routeAlerts.length > 0 && (
        <div className="space-y-2">
          {routeAlerts.map((alert) => (
            <Link key={alert.id} href={`/alerts/${alert.id}`}>
              <div className="flex items-start gap-3 rounded-lg border border-disrupted/20 bg-disrupted/5 px-4 py-3 hover:bg-disrupted/10 transition-colors">
                <p className="flex-1 text-sm font-medium">{alert.title}</p>
                <span className="text-xs text-primary shrink-0">Ver →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Upcoming arrivals */}
      {routeArrivals.length > 0 && (
        <section>
          <h3 className="font-semibold text-base mb-3">Próximas salidas</h3>
          <div className="rounded-xl border bg-card overflow-hidden">
            {routeArrivals.map((arr, idx) => {
              const stop = servedStops.find((s) => s.id === arr.stopId);
              return (
                <div key={arr.id}>
                  {idx > 0 && <div className="border-t" />}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{arr.destination}</p>
                      <p className="text-xs text-muted-foreground">{stop?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono font-bold">
                        {formatTime(arr.predictedAt)}
                      </p>
                      <StatusBadge status={arr.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Stops served */}
      {servedStops.length > 0 && (
        <section>
          <h3 className="font-semibold text-base mb-3">Paradas en esta ruta</h3>
          <div className="rounded-xl border bg-card overflow-hidden">
            {servedStops.map((stop, idx) => (
              <div key={stop.id}>
                {idx > 0 && <div className="border-t" />}
                <Link
                  href={`/stops/${stop.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors"
                >
                  <span className="text-sm">{stop.name}</span>
                  <span className="text-xs text-primary">Ver parada →</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
