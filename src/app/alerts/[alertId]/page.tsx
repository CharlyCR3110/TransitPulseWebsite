import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, Calendar, Info, Navigation } from 'lucide-react';
import { RouteChip } from '@/components/transit/RouteChip';
import { cn } from '@/lib/utils';
import { getAlert } from '@/data/alerts';
import { routes } from '@/data/routes';
import { stops } from '@/data/stops';
import { formatTime } from '@/lib/format';
import type { AlertSeverity } from '@/types/alerts';

interface Props {
  params: Promise<{ alertId: string }>;
}

const severityConfig: Record<
  AlertSeverity,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    classes: string;
    bannerClass: string;
  }
> = {
  critical: {
    icon: AlertCircle,
    label: 'Alerta crítica',
    classes: 'text-disrupted',
    bannerClass: 'bg-disrupted/10 border-disrupted/20',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Advertencia',
    classes: 'text-delayed',
    bannerClass: 'bg-delayed/10 border-delayed/20',
  },
  info: {
    icon: Info,
    label: 'Información',
    classes: 'text-sev-info',
    bannerClass: 'bg-sev-info/10 border-sev-info/20',
  },
};

export default async function AlertDetailPage({ params }: Props) {
  const { alertId } = await params;
  const alert = getAlert(alertId);
  if (!alert) notFound();

  const { icon: Icon, label: severityLabel, classes, bannerClass } =
    severityConfig[alert.severity];

  const affectedRoutes = routes.filter((r) => alert.affectedRouteIds.includes(r.id));
  const affectedStops = stops.filter((s) => alert.affectedStopIds.includes(s.id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">
      {/* Header banner */}
      <div className={cn('rounded-xl border p-4', bannerClass)}>
        <div className={cn('flex items-center gap-2 mb-2', classes)}>
          <Icon className="h-5 w-5" />
          <span className="text-sm font-semibold">{severityLabel}</span>
          {alert.isActive && (
            <span className="ml-auto rounded-full bg-disrupted/20 px-2 py-0.5 text-xs font-medium text-disrupted">
              Activa ahora
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold leading-snug">{alert.title}</h2>
      </div>

      {/* Body */}
      <div className="rounded-xl border bg-card p-4">
        <p className="text-sm leading-relaxed">{alert.body}</p>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border bg-card p-4 space-y-2">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Vigencia
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Inicio</p>
            <p className="font-medium font-mono">{formatTime(alert.startAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Fin estimado</p>
            <p className="font-medium font-mono">
              {alert.endAt ? formatTime(alert.endAt) : 'Sin confirmar'}
            </p>
          </div>
        </div>
      </div>

      {/* Affected routes */}
      {affectedRoutes.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3">Rutas afectadas</h3>
          <div className="flex gap-2 flex-wrap">
            {affectedRoutes.map((route) => (
              <RouteChip key={route.id} route={route} asLink size="md" />
            ))}
          </div>
        </section>
      )}

      {/* Affected stops */}
      {affectedStops.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3">Paradas afectadas</h3>
          <div className="rounded-xl border bg-card overflow-hidden">
            {affectedStops.map((stop, idx) => (
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

      {/* Replan CTA */}
      <div className="pt-2 pb-4">
        <Link
          href="/plan"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/80 h-9 text-sm"
        >
          <Navigation className="h-5 w-5" />
          Buscar ruta alternativa
        </Link>
      </div>
    </div>
  );
}
