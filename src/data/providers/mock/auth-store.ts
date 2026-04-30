import type { UserProfileDto } from '@/data/contracts/users';

interface MockSession {
  user: UserProfileDto;
  passwordHash: string;
}

const sessions = new Map<string, MockSession>();
let currentSession: MockSession | null = null;

export function createMockUser(email: string, displayName: string, password: string): UserProfileDto {
  const id = `mock-user-${sessions.size + 1}`;
  const user: UserProfileDto = {
    id,
    email,
    displayName,
    reputationScore: 0,
    createdAt: new Date().toISOString(),
  };
  sessions.set(email, { user, passwordHash: password });
  return user;
}

export function findSessionByEmail(email: string): MockSession | undefined {
  return sessions.get(email);
}

export function setCurrentSession(session: MockSession | null): void {
  currentSession = session;
}

export function getCurrentUser(): UserProfileDto | null {
  return currentSession?.user ?? null;
}

export function resetMockAuthStore(): void {
  sessions.clear();
  currentSession = null;
}
