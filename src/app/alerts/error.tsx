'use client';

import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function AlertsError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ErrorMessage
        title="No se pudieron cargar las alertas"
        message="Hubo un problema al obtener las alertas de servicio. Intenta de nuevo."
        reset={reset}
      />
    </div>
  );
}
