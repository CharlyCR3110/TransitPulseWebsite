import { ApiError } from '@/data/api/errors';
import type { UsersProvider } from '@/data/contracts/users';
import { getCurrentUser } from './auth-store';

export const usersProvider: UsersProvider = {
  async me() {
    const user = getCurrentUser();
    if (!user) {
      throw new ApiError({
        status: 401,
        code: 'auth_required',
        message: 'Authentication required',
      });
    }
    return user;
  },
};
