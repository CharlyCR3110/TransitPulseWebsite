import Link from 'next/link';
import { ChevronRight, MapPin, Navigation } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AlertBanner } from '@/components/transit/AlertBanner';
import { StatusBadge } from '@/components/transit/StatusBadge';
import { OccupancyBadge } from '@/components/transit/OccupancyBadge';
import { RouteChip } from '@/components/transit/RouteChip';
import { stops } from '@/data/stops';
import { routes, getRoute } from '@/data/routes';
import { getArrivalsByStop } from '@/data/arrivals';
import { getActiveAlerts } from '@/data/alerts';
import { formatETA, formatTime, formatRelative } from '@/lib/format';

export default function HomePage() {
  const activeAlerts = getActiveAlerts();
  const topAlert = activeAlerts.find(
    (a) => a.severity === 'critical' || a.severity === 'warning',
  );

  // Default "favorite" stop
  const favoriteStop = stops.find((s) => s.id === 'stop-sjc')!;
  const favoriteArrivals = getArrivalsByStop(favoriteStop.id).slice(0, 5);

  // Saved routes (mocked)
  const savedRoutes = routes.filter((r) =>
    ['route-106', 'route-train-ca', 'route-train-pa', 'route-200'].includes(r.id),
  );

  // Nearby stops with their next 2 arrivals
  const nearbyStops = stops
    .filter((s) =>
      ['stop-sjc', 'stop-hatillo', 'stop-sabana', 'stop-heredia', 'stop-tibas'].includes(
        s.id,
      ),
    )
    .map((stop) => ({
      stop,
      arrivals: getArrivalsByStop(stop.id).slice(0, 2),
    }));

  return (
    <>
      {topAlert && <AlertBanner alert={topAlert} />}

      <div className="mx-auto max-w-2xl px-4 py-5 space-y-7">
        {/* Greeting header */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
            <MapPin className="h-3 w-3" />
            <span>GAM, Costa Rica</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            ¿Cuál es tu próximo viaje?
          </h2>
        </div>

        {/* Plan trip CTA */}
        <Link
          href="/plan"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 h-9"
        >
          <Navigation className="h-5 w-5" />
          Planificar viaje
        </Link>

        {/* Nearby stops carousel */}
        <section aria-labelledby="nearby-heading">
          <div className="flex items-center justify-between mb-3">
            <h3
              id="nearby-heading"
              className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Paradas cercanas
            </h3>
          </div>

          <div
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
          >
            {nearbyStops.map(({ stop, arrivals: stopArrivals }) => (
              <Link
                key={stop.id}
                href={`/stops/${stop.id}`}
                className="snap-start shrink-0 w-52 rounded-xl border bg-card p-3.5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                role="listitem"
              >
                <p className="font-semibold text-sm mb-2.5 truncate">{stop.name}</p>
                {stopArrivals.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sin datos disponibles</p>
                ) : (
                  <div className="space-y-2">
                    {stopArrivals.map((arr) => {
                      const route = getRoute(arr.routeId);
                      if (!route) return null;
                      return (
                        <div key={arr.id} className="flex items-center gap-2">
                          <RouteChip route={route} size="sm" />
                          <span className="flex-1 min-w-0 text-xs text-muted-foreground truncate">
                            {arr.destination}
                          </span>
                          <span
                            className={`shrink-0 text-xs font-mono font-bold ${
                              arr.status === 'on-time'
                                ? 'text-on-time'
                                : arr.status === 'delayed'
                                  ? 'text-delayed'
                                  : 'text-disrupted'
                            }`}
                          >
                            {formatETA(arr.predictedAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Favorite stop next arrivals */}
        <section aria-labelledby="arrivals-heading">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 id="arrivals-heading" className="font-semibold text-base">
                {favoriteStop.name}
              </h3>
              <p className="text-xs text-muted-foreground">Parada favorita</p>
            </div>
            <button className="text-xs text-primary hover:underline underline-offset-2">
              Cambiar
            </button>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b bg-muted/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-time opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-on-time" />
              </span>
              <span className="text-xs text-muted-foreground">Datos en tiempo real</span>
            </div>

            {favoriteArrivals.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                No hay llegadas próximas disponibles.
              </p>
            ) : (
              <ul>
                {favoriteArrivals.map((arr, idx) => {
                  const route = getRoute(arr.routeId);
                  if (!route) return null;
                  return (
                    <li key={arr.id}>
                      {idx > 0 && <Separator />}
                      <div className="flex items-start gap-3 px-4 py-3.5">
                        <RouteChip route={route} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {arr.destination}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <StatusBadge status={arr.status} />
                            <span className="text-xs text-muted-foreground">
                              {formatRelative(arr.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={`text-sm font-mono font-bold ${
                              arr.status === 'on-time'
                                ? 'text-on-time'
                                : arr.status === 'delayed'
                                  ? 'text-delayed'
                                  : 'text-disrupted'
                            }`}
                          >
                            {formatETA(arr.predictedAt)}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {formatTime(arr.predictedAt)}
                          </span>
                          <OccupancyBadge level={arr.occupancy} showLabel={false} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="border-t">
              <Link
                href={`/stops/${favoriteStop.id}`}
                className="flex items-center justify-center gap-1 px-4 py-3 text-xs text-primary hover:bg-primary/5 transition-colors"
              >
                Ver todas las llegadas
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Saved routes */}
        <section aria-labelledby="saved-heading">
          <h3
            id="saved-heading"
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
          >
            Rutas guardadas
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedRoutes.map((route) => (
              <RouteChip key={route.id} route={route} asLink size="md" />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
