import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadSwitch() {
  return await import('./index');
}

describe('provider switch', () => {
  it('exposes all seven providers', async () => {
    vi.stubEnv('NEXT_PUBLIC_USE_MOCKS', 'true');
    vi.resetModules();
    const mod = await loadSwitch();
    expect(mod.plannerProvider).toBeDefined();
    expect(mod.stopsProvider).toBeDefined();
    expect(mod.arrivalsProvider).toBeDefined();
    expect(mod.alertsProvider).toBeDefined();
    expect(mod.reportsProvider).toBeDefined();
    expect(mod.authProvider).toBeDefined();
    expect(mod.usersProvider).toBeDefined();
  });

  it('selects mocks when NEXT_PUBLIC_USE_MOCKS=true', async () => {
    vi.stubEnv('NEXT_PUBLIC_USE_MOCKS', 'true');
    vi.resetModules();
    const sw = await loadSwitch();
    const mock = await import('./mock');
    expect(sw.__usingMocks).toBe(true);
    expect(sw.plannerProvider).toBe(mock.plannerProvider);
    expect(sw.stopsProvider).toBe(mock.stopsProvider);
    expect(sw.alertsProvider).toBe(mock.alertsProvider);
    expect(sw.arrivalsProvider).toBe(mock.arrivalsProvider);
  });

  it('selects API providers when NEXT_PUBLIC_USE_MOCKS is unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_USE_MOCKS', '');
    vi.resetModules();
    const sw = await loadSwitch();
    const api = await import('./api');
    expect(sw.__usingMocks).toBe(false);
    expect(sw.plannerProvider).toBe(api.plannerProvider);
    expect(sw.stopsProvider).toBe(api.stopsProvider);
    expect(sw.alertsProvider).toBe(api.alertsProvider);
    expect(sw.arrivalsProvider).toBe(api.arrivalsProvider);
  });

  it('selects API providers when NEXT_PUBLIC_USE_MOCKS=false', async () => {
    vi.stubEnv('NEXT_PUBLIC_USE_MOCKS', 'false');
    vi.resetModules();
    const sw = await loadSwitch();
    const api = await import('./api');
    expect(sw.__usingMocks).toBe(false);
    expect(sw.plannerProvider).toBe(api.plannerProvider);
  });
});
