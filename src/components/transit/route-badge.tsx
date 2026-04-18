export function RouteBadge({ route, kind = 'bus' }: { route: string; kind?: 'bus' | 'train' }) {
  return <span className={`route-badge route-badge--${kind}`}>{route}</span>;
}
