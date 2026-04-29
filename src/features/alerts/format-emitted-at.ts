import type { Lang } from '@/types/transit';

const TABLE: Record<Lang, { min: string; h: string; d: string }> = {
  es: { min: 'min', h: 'h', d: 'd' },
  en: { min: 'min', h: 'h', d: 'd' },
};

export function formatEmittedAt(iso: string, lang: Lang, now: Date = new Date()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  const diffMs = Math.max(0, now.getTime() - t);
  const min = Math.floor(diffMs / 60_000);
  const labels = TABLE[lang];
  if (min < 60) return `${min} ${labels.min}`;
  const h = Math.floor(min / 60);
  if (h < 48) return `${h} ${labels.h}`;
  return `${Math.floor(h / 24)} ${labels.d}`;
}
