import { Check, Lock, Sparkles } from 'lucide-react';

const freeTierFeatures = [
  'Búsqueda de rutas en tiempo real',
  'Llegadas próximas con predicción',
  'Centro de alertas de servicio',
  'Reportes anónimos de incidentes',
  'Vista de paradas y rutas',
];

const premiumFeatures = [
  'Alertas personalizadas por ruta',
  'Historial detallado de viajes',
  'Predicciones con mayor precisión',
  'Experiencia sin publicidad',
  'Soporte prioritario',
];

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Membresía TransitPulse</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Elige el plan que mejor se adapte a tus viajes
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Free plan */}
        <div className="rounded-xl border bg-card p-5 flex flex-col">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Gratuito
            </p>
            <p className="text-3xl font-bold">₡0</p>
            <p className="text-xs text-muted-foreground mt-0.5">Para siempre</p>
          </div>

          <ul className="space-y-2.5 flex-1">
            {freeTierFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-on-time" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-lg border bg-muted/40 px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
            Tu plan actual
          </div>
        </div>

        {/* Premium plan */}
        <div className="rounded-xl border-2 border-primary/30 bg-card p-5 flex flex-col relative overflow-hidden">
          {/* Glow accent */}
          <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-primary/5" />

          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Premium
              </p>
            </div>
            <p className="text-3xl font-bold">—</p>
            <p className="text-xs text-muted-foreground mt-0.5">Precio por confirmar</p>
          </div>

          <ul className="space-y-2.5 flex-1">
            {premiumFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/50" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            disabled
            className="mt-5 w-full rounded-lg bg-primary/20 px-4 py-2.5 text-sm font-semibold text-primary/60 cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>

      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        Las funciones y precios del plan Premium están sujetos a cambio antes del lanzamiento.
      </p>
    </div>
  );
}
