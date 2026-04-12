import { notFound } from 'next/navigation';
import { getStop } from '@/data/stops';
import { getRoute } from '@/data/routes';
import { getArrivalsByStop } from '@/data/arrivals';
import { RouteChip } from '@/components/transit/RouteChip';
import { StatusBadge } from '@/components/transit/StatusBadge';
import { OccupancyBadge } from '@/components/transit/OccupancyBadge';
import { StaleBanner } from '@/components/transit/StaleBanner';
import { formatETA, formatTime, formatRelative } from '@/lib/format';

interface Props {
  params: Promise<{ stopId: string }>;
}

export default async function StopDetailPage({ params }: Props) {
  const { stopId } = await params;
  const stop = getStop(stopId);
  if (!stop) notFound();
  const now = new Date();

  const arrivals = getArrivalsByStop(stopId);
  const servedRoutes = stop.routeIds
    .map((rid) => getRoute(rid))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  // Freshness: use the oldest update among displayed arrivals
  const oldestUpdate =
    arrivals.length > 0
      ? arrivals.reduce((oldest, a) =>
          a.updatedAt.getTime() < oldest.updatedAt.getTime() ? a : oldest,
        ).updatedAt
      : new Date();

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">{stop.name}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Parada de tránsito</p>
      </div>

      <StaleBanner updatedAt={oldestUpdate} initialNow={now} />

      {/* Served routes */}
      {servedRoutes.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Rutas en esta parada
          </h3>
          <div className="flex gap-2 flex-wrap">
            {servedRoutes.map((route) => (
              <RouteChip key={route.id} route={route} asLink size="md" />
            ))}
          </div>
        </section>
      )}

      {/* Next arrivals */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base">Próximas llegadas</h3>
          <span className="text-xs text-muted-foreground">
            {formatRelative(oldestUpdate)}
          </span>
        </div>

        {arrivals.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No hay llegadas próximas disponibles.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            {arrivals.map((arr, idx) => {
              const route = getRoute(arr.routeId);
              if (!route) return null;
              return (
                <div key={arr.id}>
                  {idx > 0 && <div className="border-t" />}
                  <div className="flex items-start gap-3 px-4 py-3.5">
                    <RouteChip route={route} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{arr.destination}</p>
                      <StatusBadge status={arr.status} className="mt-1" />
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
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
