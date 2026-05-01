import type { ReportCreatedDto, ReportsProvider } from '@/data/contracts/reports';
import { getCurrentUser } from './auth-store';

let nextId = 1;
const reportCountByUser = new Map<string, number>();

export function getReportCountForUser(userId: string): number {
  return reportCountByUser.get(userId) ?? 0;
}

export function resetMockReports(): void {
  nextId = 1;
  reportCountByUser.clear();
}

export const reportsProvider: ReportsProvider = {
  async submit(input): Promise<ReportCreatedDto> {
    const user = getCurrentUser();
    if (user) {
      reportCountByUser.set(user.id, (reportCountByUser.get(user.id) ?? 0) + 1);
    }
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
