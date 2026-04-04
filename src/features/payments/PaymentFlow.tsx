'use client';

import { useState } from 'react';
import { CheckCircle2, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatFare, formatTime } from '@/lib/format';
import { paymentMethods } from '@/data/payments';
import type { PaymentMethod } from '@/types/payments';

const methodIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  visa: CreditCard,
  mastercard: CreditCard,
  sinpe: Smartphone,
};

export function PaymentFlow() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [confirmed, setConfirmed] = useState(false);

  // Mock trip context
  const mockFare = 1260;
  const mockRoute = 'INCOFER — San José → Cartago';
  const mockTxnId = `TXN-${Date.now().toString().slice(-8)}`;

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-on-time/15">
            <CheckCircle2 className="h-10 w-10 text-on-time" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold">Pago exitoso</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tu pago fue procesado correctamente.
          </p>
        </div>

        {/* Receipt */}
        <div className="w-full rounded-xl border bg-card p-4 text-left space-y-3 mt-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Recibo digital
          </h4>
          <Separator />
          <div className="space-y-2">
            {[
              { label: 'Ruta', value: mockRoute },
              { label: 'Monto', value: formatFare(mockFare) },
              { label: 'Método', value: `${selectedMethod.label} ····${selectedMethod.last4}` },
              { label: 'Fecha / hora', value: formatTime(new Date()) },
              { label: 'ID transacción', value: mockTxnId },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-right max-w-[55%] truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => setConfirmed(false)}
        >
          Hacer otro pago
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Fare summary */}
      <div className="rounded-xl border bg-card p-4 space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Resumen de tarifa
        </h3>
        <Separator />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{mockRoute}</p>
            <p className="text-xs text-muted-foreground">Viaje sencillo</p>
          </div>
          <p className="text-xl font-bold">{formatFare(mockFare)}</p>
        </div>
      </div>

      {/* Payment method */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Método de pago</h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const Icon = methodIcons[method.type] ?? CreditCard;
            const isSelected = selectedMethod.id === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method)}
                className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:bg-accent'
                }`}
              >
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{method.label}</p>
                  <p className="text-xs text-muted-foreground">····{method.last4}</p>
                </div>
                <div
                  className={`h-4 w-4 rounded-full border-2 transition-colors ${
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Confirm button */}
      <Button
        size="lg"
        className="w-full gap-2 font-semibold"
        onClick={() => setConfirmed(true)}
      >
        <CreditCard className="h-5 w-5" />
        Confirmar pago de {formatFare(mockFare)}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Transacción segura · Encriptada end-to-end
      </p>
    </div>
  );
}
