import type { ReportCreatedDto, ReportsProvider } from '@/data/contracts/reports';
import { getCurrentUser } from './auth-store';

let nextId = 1;

export const reportsProvider: ReportsProvider = {
  async submit(input): Promise<ReportCreatedDto> {
    const user = getCurrentUser();
    return {
      id: nextId++,
      userId: user?.id ?? null,
      routeId: input.routeId ?? null,
      stopId: input.stopId ?? null,
      type: input.type,
      description: input.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },
};
