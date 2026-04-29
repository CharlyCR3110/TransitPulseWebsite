import type { AuthProvider } from '@/data/contracts/auth';

const notImplemented = (method: string) => {
  throw new Error(`mock authProvider.${method} not implemented yet`);
};

export const authProvider: AuthProvider = {
  register: () => notImplemented('register'),
  login: () => notImplemented('login'),
};
