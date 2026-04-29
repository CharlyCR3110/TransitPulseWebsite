export type ReportType = 'delay' | 'no-show' | 'overcrowded' | 'other' | (string & {});

export interface ReportSubmitInput {
  type: ReportType;
  routeId?: string;
  stopId?: string;
  description: string;
}

export interface ReportCreatedDto {
  id: number;
  userId: string | null;
  routeId: string | null;
  stopId: string | null;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface ReportsProvider {
  submit(input: ReportSubmitInput): Promise<ReportCreatedDto>;
}
