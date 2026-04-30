import { apiClient } from '@/data/api/client';
import type { ReportCreatedDto, ReportSubmitInput, ReportsProvider } from '@/data/contracts/reports';

export const reportsProvider: ReportsProvider = {
  submit: (input) =>
    apiClient.request<ReportCreatedDto, ReportSubmitInput>('POST', '/reports', {
      auth: 'optional',
      body: input,
    }),
};
