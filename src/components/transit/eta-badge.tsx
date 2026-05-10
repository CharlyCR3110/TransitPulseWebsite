import type { ArrivalPrediction, ArrivalStatus, PredictionConfidence } from '@/types/transit';
import type { I18nKey } from '@/data/transit';

interface EtaBadgeProps {
  etaSec: number;
  prediction?: ArrivalPrediction | null;
  status?: ArrivalStatus;
  t: (key: I18nKey) => string;
  lang: 'es' | 'en';
}

const CONFIDENCE_KEY: Record<PredictionConfidence, I18nKey> = {
  high: 'confidence_high',
  medium: 'confidence_medium',
  low: 'confidence_low',
};

const CONFIDENCE_DOT_COLOR: Record<PredictionConfidence, string> = {
  high: 'var(--ok)',
  medium: 'var(--warn)',
  low: 'var(--bad)',
};

function formatEta(sec: number, t: (key: I18nKey) => string) {
  if (sec <= 45) return { num: t('now'), unit: '' };
  return { num: String(Math.round(sec / 60)), unit: t('min') };
}

function formatLocalHHMM(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return iso;
  }
}

function bandMinutes(prediction: ArrivalPrediction): number {
  const low = new Date(prediction.windowLow).getTime();
  const high = new Date(prediction.windowHigh).getTime();
  return Math.max(1, Math.round((high - low) / 2 / 60_000));
}

export function EtaBadge({ etaSec, prediction, status, t, lang }: EtaBadgeProps) {
  const { num, unit } = formatEta(etaSec, t);
  const statusCls = status === 'bad' ? 'arrival-eta--bad' : status === 'warn' ? 'arrival-eta--warn' : '';

  if (!prediction) {
    return (
      <div className={`arrival-eta ${statusCls}`}>
        <div className="arrival-eta-num">{num}</div>
        {unit && <div className="arrival-eta-unit">{unit}</div>}
        <div className="eta-confidence eta-confidence--schedule">{t('schedule_only')}</div>
      </div>
    );
  }

  const confLabel = t(CONFIDENCE_KEY[prediction.confidence]);
  const dotColor = CONFIDENCE_DOT_COLOR[prediction.confidence];
  const sched = formatLocalHHMM(prediction.scheduledDeparture);
  const pred = formatLocalHHMM(prediction.predictedDeparture);
  const band = bandMinutes(prediction);
  const tooltip = lang === 'es'
    ? `${t('scheduled_eta')} ${sched} → ${t('predicted_eta')} ${pred} (±${band} min)`
    : `${t('scheduled_eta')} ${sched} → ${t('predicted_eta')} ${pred} (±${band} min)`;

  return (
    <div className={`arrival-eta ${statusCls}`} title={tooltip}>
      <div className="arrival-eta-num">{num}</div>
      {unit && <div className="arrival-eta-unit">{unit}</div>}
      <div className="eta-confidence">
        <span className="eta-confidence-dot" style={{ background: dotColor }} aria-hidden />
        <span className="eta-confidence-label">{confLabel}</span>
      </div>
    </div>
  );
}
