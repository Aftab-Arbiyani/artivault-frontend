import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artworkService } from '@/services/artworkService';
import { commentService } from '@/services/commentService';
import { likeService } from '@/services/artworkService';
import { queryKeys } from '@/services/queryKeys';
import type { Artwork } from '@/types';

export function useArtwork(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.artwork(id!),
    queryFn: () => artworkService.getById(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

export function useArtworkComments(artworkId: string | undefined) {
  return useInfiniteQuery({
    queryKey: queryKeys.comments(artworkId!),
    queryFn: ({ pageParam }) => commentService.getByArtwork(artworkId!, pageParam ?? undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!artworkId,
    staleTime: 60 * 1000,
  });
}

export function useLikeMutation(artworkId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likeService.toggle(artworkId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.artwork(artworkId) });
      const previous = queryClient.getQueryData<Artwork>(queryKeys.artwork(artworkId));
      if (previous) {
        queryClient.setQueryData(queryKeys.artwork(artworkId), {
          ...previous,
          isLiked: !previous.isLiked,
          likesCount: previous.isLiked ? previous.likesCount - 1 : previous.likesCount + 1,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.artwork(artworkId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artwork(artworkId) });
    },
  });
}

export function useAddComment(artworkId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => commentService.create(artworkId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(artworkId) });
    },
  });
}
