'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Alert } from '@/types/alerts';

interface AlertBannerProps {
  alert: Alert;
}

export function AlertBanner({ alert }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const isCritical = alert.severity === 'critical';

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 px-4 py-3 text-sm',
        isCritical
          ? 'bg-disrupted/10 border-b border-disrupted/20 text-disrupted'
          : 'bg-delayed/10 border-b border-delayed/20 text-delayed',
      )}
      role="alert"
    >
      {isCritical ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-snug">{alert.title}</p>
        <Link
          href={`/alerts/${alert.id}`}
          className="mt-0.5 inline-block text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
        >
          Ver detalles →
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="mt-0.5 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Cerrar alerta"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
