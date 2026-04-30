'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';
import type { ReportSubmitInput } from '@/data/contracts/reports';

export function useSubmitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReportSubmitInput) => reportsProvider.submit(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.alerts.all() });
    },
  });
}
