'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/auth-provider';
import { usersProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';

export function useUserStats() {
  const { status } = useAuth();
  const query = useQuery({
    queryKey: qk.users.stats(),
    queryFn: () => usersProvider.stats(),
    enabled: status === 'authenticated',
  });
  return {
    stats: query.data,
    loading: query.isLoading,
    error: query.error,
  };
}
