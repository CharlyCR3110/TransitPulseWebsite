'use client';

import { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitReport } from '@/services/reports';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const categories = [
  { id: 'delay', label: 'Demora en el servicio' },
  { id: 'breakdown', label: 'Avería del vehículo' },
  { id: 'overcrowding', label: 'Sobrecupo / abarrotado' },
  { id: 'safety', label: 'Incidente de seguridad' },
  { id: 'route', label: 'Desvío no anunciado' },
  { id: 'other', label: 'Otro' },
];

export function ReportForm() {
  const [selected, setSelected] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    await submitReport({ type: selected, description: note || undefined, stopId: context || undefined });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <CheckCircle2 className="h-14 w-14 text-on-time" />
        <div>
          <h3 className="text-lg font-bold">Reporte enviado</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Gracias por contribuir. Tu reporte fue enviado de forma anónima y ayudará
            a mejorar la información para otros usuarios.
          </p>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setSelected(null);
            setContext('');
            setNote('');
          }}
          className="text-sm text-primary hover:underline underline-offset-2 mt-2"
        >
          Enviar otro reporte
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Category */}
      <div>
        <p className="text-sm font-medium mb-3">¿Qué tipo de incidente reportas?</p>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelected(cat.id)}
              className={`rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors ${
                selected === cat.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional context */}
      <div>
        <label className="text-sm font-medium block mb-2" htmlFor="context">
          Ruta o parada (opcional)
        </label>
        <input
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Ej: Ruta 106, Parada Hatillo"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Optional note */}
      <div>
        <label className="text-sm font-medium block mb-2" htmlFor="note">
          Comentario adicional (opcional)
        </label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe brevemente lo que observaste..."
          maxLength={200}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {note.length}/200
        </p>
      </div>

      {/* Anonymous notice */}
      <div className="flex items-start gap-2 rounded-lg border bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Tu reporte es completamente anónimo. No se almacena información personal
          ni datos de identificación.
        </span>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full font-semibold"
        disabled={!selected || submitting}
      >
        {submitting ? 'Enviando...' : 'Enviar reporte'}
      </Button>
    </form>
  );
}
