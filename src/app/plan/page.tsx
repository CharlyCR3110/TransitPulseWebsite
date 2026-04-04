import { PlannerForm } from '@/features/planner/PlannerForm';

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight">Planificar viaje</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ingresa origen y destino para ver opciones multimodales
        </p>
      </div>
      <PlannerForm />
    </div>
  );
}
