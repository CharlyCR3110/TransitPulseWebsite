'use client';
import { useState } from 'react';
import { Icon } from '@/components/ui/icons';
import { useLang } from '@/components/providers/lang-provider';
import { ReportSheet } from './report-sheet';

interface ReportButtonProps {
  routeId?: string;
  stopId?: string;
  className?: string;
}

export function ReportButton({ routeId, stopId, className }: ReportButtonProps) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 'var(--r-sm)',
          border: '1px solid var(--line)', background: 'transparent',
          color: 'var(--text-1)', fontSize: 13, fontWeight: 500,
        }}
      >
        <Icon name="alert" size={16} />
        {lang === 'es' ? 'Reportar' : 'Report'}
      </button>
      <ReportSheet open={open} onClose={() => setOpen(false)} routeId={routeId} stopId={stopId} />
    </>
  );
}
