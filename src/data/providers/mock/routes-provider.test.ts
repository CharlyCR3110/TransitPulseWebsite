import { describe, expect, it } from 'vitest';
import { mockRoutesProvider } from './routes-provider';

describe('mock routesProvider', () => {
  it('listRoutes returns 400p and 400sd', async () => {
    const routes = await mockRoutesProvider.listRoutes();
    const ids = routes.map((r) => r.id);
    expect(ids).toContain('400p');
    expect(ids).toContain('400sd');
  });

  it('getRoute returns detail with stops + shape for 400p', async () => {
    const detail = await mockRoutesProvider.getRoute('400p');
    expect(detail).not.toBeNull();
    expect(detail?.directions.outbound.stops.length).toBeGreaterThan(0);
    expect(detail?.directions.outbound.shape?.type).toBe('LineString');
  });

  it('getRoute returns null for unknown id', async () => {
    const detail = await mockRoutesProvider.getRoute('does-not-exist');
    expect(detail).toBeNull();
  });
});
