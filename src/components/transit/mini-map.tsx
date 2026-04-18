import { Icon } from '@/components/ui/icons';
import type { I18nKey } from '@/data/transit';

export function MiniMap({ t, variant = 'home' }: { t: (key: I18nKey) => string; variant?: 'home' | 'trip' }) {
  return (
    <div className="minimap">
      <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="140" fill="url(#grid)" color="currentColor" />
        <path d="M0 90 L400 90" stroke="currentColor" strokeOpacity="0.12" strokeWidth="18" strokeLinecap="round" />
        <path d="M140 0 L140 140" stroke="currentColor" strokeOpacity="0.1" strokeWidth="14" strokeLinecap="round" />
        <path d="M260 0 L260 140" stroke="currentColor" strokeOpacity="0.08" strokeWidth="12" strokeLinecap="round" />
        <path d="M0 40 Q100 30 200 55 T400 40" stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" fill="none" strokeLinecap="round" />
        {variant === 'trip' ? (
          <>
            <path d="M50 110 L140 110 L140 55 L260 55 L260 30 L360 30" stroke="var(--primary)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="110" r="6" fill="var(--primary)" />
            <circle cx="50" cy="110" r="11" fill="none" stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="2" />
            <rect x="354" y="24" width="12" height="12" rx="2" fill="var(--bad)" />
          </>
        ) : (
          <>
            <circle cx="140" cy="90" r="7" fill="var(--primary)" />
            <circle cx="140" cy="90" r="12" fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="2">
              <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="260" cy="40" r="4" fill="var(--text-2)" opacity="0.6" />
            <circle cx="80" cy="40" r="4" fill="var(--text-2)" opacity="0.6" />
            <circle cx="340" cy="100" r="4" fill="var(--text-2)" opacity="0.6" />
          </>
        )}
      </svg>
      <div className="minimap-badge">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="pin" size={12} /> {t('map_label')}
        </span>
      </div>
    </div>
  );
}
