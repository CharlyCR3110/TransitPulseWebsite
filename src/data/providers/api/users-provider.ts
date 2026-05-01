import { apiClient } from '@/data/api/client';
import type { UserProfileDto, UserStatsDto, UsersProvider } from '@/data/contracts/users';

export const usersProvider: UsersProvider = {
  me: () => apiClient.request<UserProfileDto>('GET', '/users/me', { auth: 'required' }),
  stats: () => apiClient.request<UserStatsDto>('GET', '/users/me/stats', { auth: 'required' }),
};
