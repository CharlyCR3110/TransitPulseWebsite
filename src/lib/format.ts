/**
 * Format a future or past date as "in X min" / "X min ago" / "arriving"
 */
export function formatETA(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60_000);

  if (diffMin <= 0 && diffMin > -2) return 'Llegando';
  if (diffMin < 0) return `hace ${Math.abs(diffMin)} min`;
  if (diffMin === 0) return 'Ahora';
  if (diffMin < 60) return `en ${diffMin} min`;

  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  return mins > 0 ? `en ${hours}h ${mins}m` : `en ${hours}h`;
}

/**
 * Format a date as "HH:MM" (24-hour)
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format duration in minutes as "1h 20m" or "45 min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format colones amount as "₡850" or "₡1,260"
 */
export function formatFare(colones: number): string {
  return `₡${colones.toLocaleString('es-CR')}`;
}

/**
 * Format a past date as "updated X sec ago" / "updated X min ago"
 */
export function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1_000);

  if (diffSec < 60) return `actualizado hace ${diffSec}s`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `actualizado hace ${diffMin} min`;
  return 'datos posiblemente desactualizados';
}

/**
 * Format delay in minutes as "+5 min" etc.
 */
export function formatDelay(scheduledAt: Date, predictedAt: Date): string {
  const delayMin = Math.round(
    (predictedAt.getTime() - scheduledAt.getTime()) / 60_000,
  );
  if (delayMin <= 0) return 'A tiempo';
  return `+${delayMin} min`;
}
