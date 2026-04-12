'use client';

import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function RoutesError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ErrorMessage
        title="No se pudieron cargar las rutas"
        message="Hubo un problema al obtener la lista de rutas. Intenta de nuevo."
        reset={reset}
      />
    </div>
  );
}
