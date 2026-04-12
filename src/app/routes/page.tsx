import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ModePill } from '@/components/transit/ModePill';
import { RouteChip } from '@/components/transit/RouteChip';
import { getRoutes } from '@/services/routes';
import { formatFare } from '@/lib/format';

export default async function RoutesPage() {
  const routes = await getRoutes();
  const buses = routes.filter((r) => r.mode === 'bus');
  const trains = routes.filter((r) => r.mode === 'train');

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Rutas</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Todas las rutas disponibles en el GAM
        </p>
      </div>

      {routes.length === 0 && (
        <div className="rounded-xl border bg-card px-4 py-10 text-center">
          <p className="text-sm font-medium mb-1">Sin rutas disponibles</p>
          <p className="text-xs text-muted-foreground">No hay rutas cargadas en este momento.</p>
        </div>
      )}

      {/* Train routes */}
      {trains.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ModePill mode="train" size="sm" />
            <h3 className="font-semibold">Tren INCOFER</h3>
          </div>
          <div className="rounded-xl border bg-card overflow-hidden">
            {trains.map((route, idx) => (
              <div key={route.id}>
                {idx > 0 && <div className="border-t" />}
                <Link
                  href={`/routes/${route.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors"
                >
                  <RouteChip route={route} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{route.longName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFare(route.fareMin)}
                      {route.fareMax !== route.fareMin && ` - ${formatFare(route.fareMax)}`}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bus routes */}
      {buses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ModePill mode="bus" size="sm" />
            <h3 className="font-semibold">Autobús</h3>
          </div>
          <div className="rounded-xl border bg-card overflow-hidden">
            {buses.map((route, idx) => (
              <div key={route.id}>
                {idx > 0 && <div className="border-t" />}
                <Link
                  href={`/routes/${route.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors"
                >
                  <RouteChip route={route} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{route.longName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFare(route.fareMin)}
                      {route.fareMax !== route.fareMin && ` - ${formatFare(route.fareMax)}`}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
