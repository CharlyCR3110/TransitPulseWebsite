import { beforeEach, describe, expect, it } from 'vitest';
import { ApiError } from '@/data/api/errors';
import { authProvider } from './auth-provider';
import { usersProvider } from './users-provider';
import { reportsProvider, resetMockReports } from './reports-provider';
import { resetMockAuthStore } from './auth-store';

beforeEach(() => {
  resetMockAuthStore();
  resetMockReports();
});

describe('mock authProvider', () => {
  it('register creates a UserProfile', async () => {
    const user = await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    expect(user.email).toBe('a@b.c');
    expect(user.displayName).toBe('Ana');
    expect(user.id).toMatch(/mock-user-/);
    expect(user.reputationScore).toBe(0);
  });

  it('register throws conflict on duplicate email', async () => {
    await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    await expect(
      authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Other' }),
    ).rejects.toMatchObject({ status: 409, code: 'conflict' });
  });

  it('login returns token + expiresAt for known email', async () => {
    await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    const token = await authProvider.login({ email: 'a@b.c', password: 'anything' });
    expect(token.accessToken).toMatch(/^mock-token-/);
    expect(Date.parse(token.expiresAt)).toBeGreaterThan(Date.now());
  });

  it('login throws auth_required for unknown email', async () => {
    await expect(authProvider.login({ email: 'nope@x.y', password: 'pw' })).rejects.toBeInstanceOf(ApiError);
  });
});

describe('mock usersProvider', () => {
  it('me throws 401 with no current session', async () => {
    await expect(usersProvider.me()).rejects.toMatchObject({ status: 401, code: 'auth_required' });
  });

  it('me returns the current user after login', async () => {
    await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    await authProvider.login({ email: 'a@b.c', password: 'pw12345!' });
    const me = await usersProvider.me();
    expect(me.email).toBe('a@b.c');
  });

  it('stats throws 401 with no current session', async () => {
    await expect(usersProvider.stats()).rejects.toMatchObject({ status: 401, code: 'auth_required' });
  });

  it('stats returns 0 trips for new user', async () => {
    await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    await authProvider.login({ email: 'a@b.c', password: 'pw12345!' });
    await expect(usersProvider.stats()).resolves.toEqual({ trips: 0 });
  });

  it('stats counts reports submitted by current user', async () => {
    await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    await authProvider.login({ email: 'a@b.c', password: 'pw12345!' });
    await reportsProvider.submit({ type: 'delay', stopId: 's1', description: 'late' });
    await reportsProvider.submit({ type: 'overcrowded', routeId: '100', description: 'lleno' });
    await expect(usersProvider.stats()).resolves.toEqual({ trips: 2 });
  });
});

describe('mock reportsProvider', () => {
  it('submit echoes input as ReportCreatedDto with anonymous userId when not logged in', async () => {
    const result = await reportsProvider.submit({ type: 'delay', stopId: 's1', description: 'late' });
    expect(result.userId).toBeNull();
    expect(result.stopId).toBe('s1');
    expect(result.routeId).toBeNull();
    expect(result.type).toBe('delay');
    expect(result.status).toBe('pending');
    expect(typeof result.id).toBe('number');
  });

  it('submit attributes report to current user when logged in', async () => {
    await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    await authProvider.login({ email: 'a@b.c', password: 'pw12345!' });
    const result = await reportsProvider.submit({ type: 'overcrowded', routeId: '100', description: 'lleno' });
    expect(result.userId).toMatch(/^mock-user-/);
    expect(result.routeId).toBe('100');
    expect(result.stopId).toBeNull();
  });
});
