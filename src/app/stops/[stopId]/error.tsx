'use client';

import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function StopDetailError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ErrorMessage
        title="No se pudo cargar la parada"
        message="Hubo un problema al obtener los datos de esta parada. Intenta de nuevo."
        reset={reset}
      />
    </div>
  );
}
