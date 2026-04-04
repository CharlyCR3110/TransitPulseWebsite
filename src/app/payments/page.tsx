import Link from 'next/link';
import { History } from 'lucide-react';
import { PaymentFlow } from '@/features/payments/PaymentFlow';

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Pagar viaje</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pago digital seguro para tu viaje
          </p>
        </div>
        <Link
          href="/payments/history"
          className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-2"
        >
          <History className="h-3.5 w-3.5" />
          Historial
        </Link>
      </div>
      <PaymentFlow />
    </div>
  );
}
