import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { paymentHistory } from '@/data/payments';
import { getRoute } from '@/data/routes';
import { RouteChip } from '@/components/transit/RouteChip';
import { formatFare, formatTime } from '@/lib/format';
import type { PaymentStatus } from '@/types/payments';

const statusConfig: Record<
  PaymentStatus,
  { icon: React.ComponentType<{ className?: string }>; label: string; classes: string }
> = {
  completed: { icon: CheckCircle2, label: 'Completado', classes: 'text-on-time' },
  failed: { icon: XCircle, label: 'Fallido', classes: 'text-disrupted' },
  pending: { icon: Clock, label: 'Pendiente', classes: 'text-delayed' },
};

export default function PaymentHistoryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight">Historial de pagos</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {paymentHistory.length} transacciones recientes
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {paymentHistory.map((record, idx) => {
          const route = getRoute(record.routeId);
          const { icon: Icon, label: statusLabel, classes } =
            statusConfig[record.status];

          return (
            <div key={record.id}>
              {idx > 0 && <div className="border-t" />}
              <div className="flex items-start gap-3 px-4 py-4">
                {route && <RouteChip route={route} size="sm" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{record.routeName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {record.fromStop} → {record.toStop}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {formatTime(record.paidAt)} · {record.transactionId}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-bold">
                    {formatFare(record.amount)}
                  </span>
                  <span className={`flex items-center gap-1 text-xs ${classes}`}>
                    <Icon className="h-3 w-3" />
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
