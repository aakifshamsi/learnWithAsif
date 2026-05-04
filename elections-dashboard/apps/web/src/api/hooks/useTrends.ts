import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { TrendPoint } from '@elections/shared';

export function useTrends(constituencyId: string) {
  return useQuery<TrendPoint[]>({
    queryKey: ['trends', constituencyId],
    queryFn: () => api.get<TrendPoint[]>(`/api/trends/${constituencyId}`),
    refetchInterval: 30_000,
    staleTime: 20_000,
    enabled: !!constituencyId,
  });
}
