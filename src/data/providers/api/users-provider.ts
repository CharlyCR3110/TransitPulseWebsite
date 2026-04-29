import { apiClient } from '@/data/api/client';
import type { UsersProvider } from '@/data/contracts/users';
import type { UserProfileDto } from '@/data/contracts/users';

export const usersProvider: UsersProvider = {
  me: () => apiClient.request<UserProfileDto>('GET', '/users/me', { auth: 'required' }),
};
