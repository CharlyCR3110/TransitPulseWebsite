'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/format';
import { RouteChip } from '@/components/transit/RouteChip';
import { routes } from '@/data/routes';
import type { Alert, AlertSeverity } from '@/types/alerts';

interface AlertsListProps {
  alerts: Alert[];
}

type SeverityFilter = AlertSeverity | 'all';

const severityConfig: Record<
  AlertSeverity,
  { icon: React.ComponentType<{ className?: string }>; label: string; borderClass: string; bgClass: string }
> = {
  critical: {
    icon: AlertCircle,
    label: 'Crítica',
    borderClass: 'border-l-disrupted',
    bgClass: 'hover:bg-disrupted/5',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Advertencia',
    borderClass: 'border-l-delayed',
    bgClass: 'hover:bg-delayed/5',
  },
  info: {
    icon: Info,
    label: 'Información',
    borderClass: 'border-l-sev-info',
    bgClass: 'hover:bg-sev-info/5',
  },
};

function AlertCard({ alert }: { alert: Alert }) {
  const { icon: Icon, borderClass, bgClass } = severityConfig[alert.severity];
  const affectedRoutes = routes.filter((r) => alert.affectedRouteIds.includes(r.id));

  return (
    <Link href={`/alerts/${alert.id}`}>
      <article
        className={cn(
          'flex gap-3 rounded-lg border border-l-4 bg-card p-4 transition-colors',
          borderClass,
          bgClass,
        )}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{alert.title}</p>

          {/* Affected routes */}
          {affectedRoutes.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {affectedRoutes.map((r) => (
                <RouteChip key={r.id} route={r} size="sm" />
              ))}
            </div>
          )}

          {/* Time range */}
          <p className="text-xs text-muted-foreground mt-2">
            Desde {formatTime(alert.startAt)}
            {alert.endAt ? ` hasta ${formatTime(alert.endAt)}` : ' · Sin hora de fin'}
          </p>
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      </article>
    </Link>
  );
}

export function AlertsList({ alerts }: AlertsListProps) {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');

  const active = alerts.filter((a) => a.isActive);
  const upcoming = alerts.filter((a) => !a.isActive);

  const filterBySeverity = (list: Alert[]) =>
    severityFilter === 'all' ? list : list.filter((a) => a.severity === severityFilter);

  const severityOptions: { key: SeverityFilter; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'critical', label: 'Crítica' },
    { key: 'warning', label: 'Advertencia' },
    { key: 'info', label: 'Info' },
  ];

  return (
    <div className="space-y-4">
      {/* Severity filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {severityOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSeverityFilter(key)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              severityFilter === key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Activas
            {active.length > 0 && (
              <span className="ml-1.5 rounded-full bg-disrupted/20 px-1.5 py-0.5 text-xs font-medium text-disrupted">
                {active.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1">
            Próximas
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            Todas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          {filterBySeverity(active).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay alertas activas.
            </p>
          ) : (
            filterBySeverity(active).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {filterBySeverity(upcoming).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay alertas programadas.
            </p>
          ) : (
            filterBySeverity(upcoming).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filterBySeverity(alerts).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
