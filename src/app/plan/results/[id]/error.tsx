'use client';

import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function TripDetailError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ErrorMessage
        title="No se pudo cargar el itinerario"
        message="Hubo un problema al obtener los detalles de este viaje. Intenta de nuevo."
        reset={reset}
      />
    </div>
  );
}
