import { useInfiniteQuery } from '@tanstack/react-query';
import { searchService } from '@/services/searchService';
import { queryKeys } from '@/services/queryKeys';

export function useSearchArtworks(query: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.searchArtworks(query),
    queryFn: ({ pageParam }) => searchService.searchArtworks(query, pageParam ?? undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!query,
    staleTime: 60 * 1000,
  });
}

export function useSearchUsers(query: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.searchUsers(query),
    queryFn: ({ pageParam }) => searchService.searchUsers(query, pageParam ?? undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!query,
    staleTime: 60 * 1000,
  });
}
