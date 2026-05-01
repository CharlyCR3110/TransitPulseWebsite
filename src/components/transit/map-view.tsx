'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useMemo } from 'react';
import { Layer, Map, Marker, Source } from '@vis.gl/react-maplibre';

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  variant?: 'default' | 'highlight';
}

export interface MapViewProps {
  pins?: MapPin[];
  path?: { lat: number; lng: number }[];
  fallbackCenter?: { lat: number; lng: number };
}

const DEFAULT_CENTER = { lat: 9.9343, lng: -84.0508 };
const STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? 'https://tiles.openfreemap.org/styles/positron';

function bounds(points: { lat: number; lng: number }[]): { center: { lat: number; lng: number }; zoom: number } {
  if (points.length === 0) return { center: DEFAULT_CENTER, zoom: 12 };
  if (points.length === 1) return { center: points[0], zoom: 14 };
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const center = {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  };
  const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
  const zoom = span > 0.5 ? 9 : span > 0.1 ? 11 : span > 0.05 ? 12 : 13;
  return { center, zoom };
}

export function MapView({ pins = [], path, fallbackCenter }: MapViewProps) {
  const initial = useMemo(() => {
    const points: { lat: number; lng: number }[] = [...pins];
    if (path) points.push(...path);
    if (points.length === 0 && fallbackCenter) return { center: fallbackCenter, zoom: 13 };
    return bounds(points);
  }, [pins, path, fallbackCenter]);

  const lineGeoJson = useMemo(() => {
    if (!path || path.length < 2) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: path.map((p) => [p.lng, p.lat]),
      },
    };
  }, [path]);

  return (
    <Map
      initialViewState={{
        longitude: initial.center.lng,
        latitude: initial.center.lat,
        zoom: initial.zoom,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={STYLE_URL}
      attributionControl={false}
    >
      {pins.map((pin) => (
        <Marker key={pin.id} longitude={pin.lng} latitude={pin.lat}>
          <div
            style={{
              width: pin.variant === 'highlight' ? 16 : 12,
              height: pin.variant === 'highlight' ? 16 : 12,
              borderRadius: '50%',
              background: 'var(--primary)',
              border: '2px solid var(--bg-1)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
            }}
          />
        </Marker>
      ))}
      {lineGeoJson && (
        <Source id="trip-path" type="geojson" data={lineGeoJson}>
          <Layer
            id="trip-path-line"
            type="line"
            paint={{
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.85,
            }}
          />
        </Source>
      )}
    </Map>
  );
}

export default MapView;
