import { describe, expect, it } from 'vitest';
import { formatEmittedAt } from './format-emitted-at';

const NOW = new Date('2026-04-28T12:00:00Z');

describe('formatEmittedAt', () => {
  it('renders minutes when under an hour', () => {
    const iso = new Date(NOW.getTime() - 12 * 60_000).toISOString();
    expect(formatEmittedAt(iso, 'es', NOW)).toBe('12 min');
  });

  it('renders hours when between 1h and 48h', () => {
    const iso = new Date(NOW.getTime() - 5 * 60 * 60_000).toISOString();
    expect(formatEmittedAt(iso, 'en', NOW)).toBe('5 h');
  });

  it('renders days for ≥ 48h', () => {
    const iso = new Date(NOW.getTime() - 50 * 60 * 60_000).toISOString();
    expect(formatEmittedAt(iso, 'es', NOW)).toBe('2 d');
  });

  it('clamps negative diffs to 0 minutes (clock skew)', () => {
    const iso = new Date(NOW.getTime() + 60_000).toISOString();
    expect(formatEmittedAt(iso, 'en', NOW)).toBe('0 min');
  });

  it('returns input unchanged for unparseable strings', () => {
    expect(formatEmittedAt('not-a-date', 'es', NOW)).toBe('not-a-date');
  });
});
