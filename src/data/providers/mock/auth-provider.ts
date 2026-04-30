import { ApiError } from '@/data/api/errors';
import type { AuthProvider } from '@/data/contracts/auth';
import { createMockUser, findSessionByEmail, setCurrentSession } from './auth-store';

const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

export const authProvider: AuthProvider = {
  async register(input) {
    if (findSessionByEmail(input.email)) {
      throw new ApiError({
        status: 409,
        code: 'conflict',
        message: 'Email already registered',
      });
    }
    return createMockUser(input.email, input.displayName, input.password);
  },

  async login(input) {
    const session = findSessionByEmail(input.email);
    if (!session) {
      throw new ApiError({
        status: 401,
        code: 'auth_required',
        message: 'Invalid credentials',
      });
    }
    setCurrentSession(session);
    return {
      accessToken: `mock-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString(),
    };
  },
};
