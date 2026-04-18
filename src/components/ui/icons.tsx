interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
}

export function Icon({ name, size = 20, stroke = 1.75 }: IconProps) {
  const s = size;
  const common = {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'home': return <svg {...common}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>;
    case 'route': return <svg {...common}><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h7"/></svg>;
    case 'bell': return <svg {...common}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8Z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
    case 'user': return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
    case 'back': return <svg {...common}><path d="M15 18 9 12l6-6"/></svg>;
    case 'chevron': return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    case 'swap': return <svg {...common}><path d="M7 4v13"/><path d="m3 8 4-4 4 4"/><path d="M17 20V7"/><path d="m21 16-4 4-4-4"/></svg>;
    case 'pin': return <svg {...common}><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/></svg>;
    case 'walk': return <svg {...common}><circle cx="13" cy="4" r="2"/><path d="m9 20 2-6 3 2 1 4"/><path d="m6 14 3-4 3 1 2-3"/></svg>;
    case 'bus': return <svg {...common}><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>;
    case 'train': return <svg {...common}><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14"/><path d="m7 20 2-3"/><path d="m17 20-2-3"/><circle cx="9" cy="14.5" r=".5" fill="currentColor"/><circle cx="15" cy="14.5" r=".5" fill="currentColor"/></svg>;
    case 'alert': return <svg {...common}><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>;
    case 'info': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 8v.01"/><path d="M11 12h1v5h1"/></svg>;
    case 'check': return <svg {...common}><path d="m5 12 5 5 9-12"/></svg>;
    case 'close': return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case 'filter': return <svg {...common}><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></svg>;
    case 'map': return <svg {...common}><path d="m3 7 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 5v14"/><path d="M15 7v14"/></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'star': return <svg {...common}><path d="m12 3 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9l6.6-.9Z"/></svg>;
    case 'refresh': return <svg {...common}><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>;
    case 'settings': return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
}
