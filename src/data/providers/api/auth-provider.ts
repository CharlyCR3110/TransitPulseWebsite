import { apiClient } from '@/data/api/client';
import type { AuthProvider, AuthToken, LoginInput, RegisterInput } from '@/data/contracts/auth';
import type { UserProfileDto } from '@/data/contracts/users';

export const authProvider: AuthProvider = {
  register: (input) =>
    apiClient.request<UserProfileDto, RegisterInput>('POST', '/auth/register', {
      auth: 'none',
      body: input,
    }),
  login: (input) =>
    apiClient.request<AuthToken, LoginInput>('POST', '/auth/login', {
      auth: 'none',
      body: input,
    }),
};
