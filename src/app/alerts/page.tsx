import { alerts } from '@/data/alerts';
import { AlertsList } from '@/features/alerts/AlertsList';

export default function AlertsPage() {
  const activeCount = alerts.filter((a) => a.isActive).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight">Centro de alertas</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {activeCount > 0
            ? `${activeCount} alerta${activeCount > 1 ? 's' : ''} activa${activeCount > 1 ? 's' : ''} en este momento`
            : 'No hay alertas activas en este momento'}
        </p>
      </div>
      <AlertsList alerts={alerts} />
    </div>
  );
}
