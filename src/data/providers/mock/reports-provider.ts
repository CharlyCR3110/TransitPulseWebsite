import type { ReportsProvider } from '@/data/contracts/reports';

const notImplemented = (method: string) => {
  throw new Error(`mock reportsProvider.${method} not implemented yet`);
};

export const reportsProvider: ReportsProvider = {
  submit: () => notImplemented('submit'),
};
