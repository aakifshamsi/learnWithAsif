import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import type { NationalPrediction, MonteCarloPrediction } from '@elections/shared';

export function useNationalPrediction() {
  return useQuery<NationalPrediction>({
    queryKey: ['predictions', 'national'],
    queryFn: () => api.get<NationalPrediction>('/api/predictions'),
    refetchInterval: 60_000,
    staleTime: 50_000,
  });
}

export function useConstituencyPrediction(constituencyId: string) {
  return useQuery<MonteCarloPrediction>({
    queryKey: ['predictions', constituencyId],
    queryFn: () => api.get<MonteCarloPrediction>(`/api/predictions/${constituencyId}`),
    refetchInterval: 30_000,
    staleTime: 20_000,
    enabled: !!constituencyId,
  });
}
