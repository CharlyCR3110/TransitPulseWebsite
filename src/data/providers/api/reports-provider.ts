import type { ReportsProvider } from '@/data/contracts/reports';

const notImplemented = (method: string) => {
  throw new Error(`api reportsProvider.${method} not implemented yet`);
};

export const reportsProvider: ReportsProvider = {
  submit: () => notImplemented('submit'),
};
