import { useParams, Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Hash, ArrowLeft } from 'lucide-react';
import ArtworkCard from '@/components/ArtworkCard';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { artworkService } from '@/services/artworkService';
import { queryKeys } from '@/services/queryKeys';

const TagPage = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const { ref, inView } = useInView();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKeys.artworksByTag(tagName!),
    queryFn: ({ pageParam }) => artworkService.getByTag(tagName!, pageParam ?? undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!tagName,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const artworks = data?.pages.flatMap(p => p.data) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Hash className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{tagName}</h1>
          <p className="text-sm text-muted-foreground">{artworks.length} artworks</p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : artworks.length > 0 ? (
        <>
          <div className="artwork-grid">
            {artworks.map(a => <ArtworkCard key={a.id} artwork={a} />)}
          </div>
          <div ref={ref} className="flex justify-center py-8">
            {isFetchingNextPage && <SkeletonGrid count={4} />}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Hash className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No artworks with this tag yet.</p>
        </div>
      )}
    </div>
  );
};

export default TagPage;
