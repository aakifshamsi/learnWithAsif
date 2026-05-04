import { useQuery } from '@tanstack/react-query';
import { api } from '../client';

export function useFeed(state?: string) {
  return useQuery({
    queryKey: ['feed', state],
    queryFn: () => api.get<unknown[]>(`/api/feed${state ? `?state=${encodeURIComponent(state)}` : ''}`),
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

export function useFeedStates() {
  return useQuery({
    queryKey: ['feed', 'states'],
    queryFn: () => api.get<unknown[]>('/api/feed/states'),
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}
