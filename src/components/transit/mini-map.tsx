'use client';

import dynamic from 'next/dynamic';
import { Icon } from '@/components/ui/icons';
import type { I18nKey } from '@/data/transit';
import type { MapPin, MapViewProps } from './map-view';

const MapView = dynamic<MapViewProps>(() => import('./map-view').then((m) => m.MapView), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'var(--bg-2)' }} />,
});

interface MiniMapProps {
  t: (key: I18nKey) => string;
  variant?: 'home' | 'trip';
  pins?: MapPin[];
  path?: { lat: number; lng: number }[];
  fallbackCenter?: { lat: number; lng: number };
}

export function MiniMap({ t, pins, path, fallbackCenter }: MiniMapProps) {
  return (
    <div className="minimap" style={{ position: 'relative' }}>
      <MapView pins={pins} path={path} fallbackCenter={fallbackCenter} />
      <div className="minimap-badge">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="pin" size={12} /> {t('map_label')}
        </span>
      </div>
    </div>
  );
}
