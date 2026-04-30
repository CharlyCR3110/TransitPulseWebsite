'use client';
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/icons';
import { useLang } from '@/components/providers/lang-provider';
import { useSubmitReport } from '@/features/reports/use-submit-report';
import { getErrorMessage } from '@/data/api/errors';
import type { ReportType } from '@/data/contracts/reports';

interface ReportSheetProps {
  open: boolean;
  onClose(): void;
  routeId?: string;
  stopId?: string;
}

const TYPES: { id: ReportType; labelEs: string; labelEn: string }[] = [
  { id: 'delay', labelEs: 'Demora', labelEn: 'Delay' },
  { id: 'no-show', labelEs: 'No pasó', labelEn: 'No-show' },
  { id: 'overcrowded', labelEs: 'Lleno', labelEn: 'Overcrowded' },
  { id: 'other', labelEs: 'Otro', labelEn: 'Other' },
];

export function ReportSheet(props: ReportSheetProps) {
  if (!props.open) return null;
  return <ReportSheetBody {...props} />;
}

function ReportSheetBody({ onClose, routeId, stopId }: ReportSheetProps) {
  const { lang } = useLang();
  const submit = useSubmitReport();

  const [type, setType] = useState<ReportType>('delay');
  const [description, setDescription] = useState('');

  const t = (es: string, en: string) => (lang === 'es' ? es : en);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submit.isPending) return;
    try {
      await submit.mutateAsync({
        type,
        routeId,
        stopId,
        description: description.trim(),
      });
      onClose();
    } catch {
      // error rendered inline below from submit.error
    }
  }

  const errorMessage = submit.error ? getErrorMessage(submit.error, lang) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-sheet-title"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'flex-end', zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%', background: 'var(--bg-1)', borderTopLeftRadius: 'var(--r-lg)',
          borderTopRightRadius: 'var(--r-lg)', padding: 20, maxHeight: '85vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 id="report-sheet-title" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            {t('Reportar un problema', 'Report an issue')}
          </h2>
          <button
            type="button"
            aria-label={t('Cerrar', 'Close')}
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-2)', padding: 4 }}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{t('Tipo', 'Type')}</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ReportType)}
              style={{ padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg-2)', color: 'var(--text-1)' }}
            >
              {TYPES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {lang === 'es' ? opt.labelEs : opt.labelEn}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{t('Descripción', 'Description')}</span>
            <textarea
              required
              minLength={1}
              maxLength={2000}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('Cuéntanos qué pasó…', 'Tell us what happened…')}
              style={{ padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg-2)', color: 'var(--text-1)', resize: 'vertical' }}
            />
          </label>

          {errorMessage && (
            <div role="alert" style={{ color: 'var(--bad)', fontSize: 13 }}>{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={submit.isPending || description.trim().length === 0}
            className="btn--primary"
            style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)' }}
          >
            {submit.isPending ? t('Enviando…', 'Submitting…') : t('Enviar', 'Submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
