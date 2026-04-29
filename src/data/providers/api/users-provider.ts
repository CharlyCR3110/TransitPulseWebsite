import type { UsersProvider } from '@/data/contracts/users';

const notImplemented = (method: string) => {
  throw new Error(`api usersProvider.${method} not implemented yet`);
};

export const usersProvider: UsersProvider = {
  me: () => notImplemented('me'),
};
