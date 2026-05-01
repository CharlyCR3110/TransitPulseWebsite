import { ApiError } from '@/data/api/errors';
import type { UsersProvider } from '@/data/contracts/users';
import { getCurrentUser } from './auth-store';
import { getReportCountForUser } from './reports-provider';

function requireUser() {
  const user = getCurrentUser();
  if (!user) {
    throw new ApiError({
      status: 401,
      code: 'auth_required',
      message: 'Authentication required',
    });
  }
  return user;
}

export const usersProvider: UsersProvider = {
  async me() {
    return requireUser();
  },
  async stats() {
    const user = requireUser();
    return { trips: getReportCountForUser(user.id) };
  },
};
