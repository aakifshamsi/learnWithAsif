import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { CitizenReport } from '@elections/shared';

export function useReports(state?: string) {
  return useQuery<CitizenReport[]>({
    queryKey: ['reports', state],
    queryFn: () => api.get<CitizenReport[]>(`/api/reports${state ? `?state=${encodeURIComponent(state)}` : ''}`),
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}
