export interface ReportPayload {
  type: string;
  routeId?: string;
  stopId?: string;
  description?: string;
}

export async function submitReport(data: ReportPayload): Promise<void> {
  // Future: await fetch('/api/reports', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  void data;
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
}
