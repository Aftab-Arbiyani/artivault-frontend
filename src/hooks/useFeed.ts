import { useInfiniteQuery } from '@tanstack/react-query';
import { artworkService } from '@/services/artworkService';
import { queryKeys } from '@/services/queryKeys';

export function useFeed(type: 'explore' | 'following', tag?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.feed(type, tag),
    queryFn: ({ pageParam }) => artworkService.getFeed(type, pageParam ?? undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 2 * 60 * 1000,
  });
}
