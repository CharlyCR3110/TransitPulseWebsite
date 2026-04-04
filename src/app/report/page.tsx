import { ReportForm } from '@/features/reports/ReportForm';

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight">Reportar incidente</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ayuda a mejorar el servicio para todos los usuarios
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
