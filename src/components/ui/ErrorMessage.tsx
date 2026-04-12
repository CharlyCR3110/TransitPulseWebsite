'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  reset?: () => void;
}

export function ErrorMessage({
  title = 'Algo salió mal',
  message = 'No pudimos cargar esta sección. Intenta de nuevo.',
  reset,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card px-6 py-12 text-center">
      <AlertCircle className="h-8 w-8 text-muted-foreground opacity-50" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{message}</p>
      </div>
      {reset && (
        <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Reintentar
        </Button>
      )}
    </div>
  );
}
