import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Sparkles, RefreshCw, Users, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtworkCard from '@/components/ArtworkCard';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { useFeed } from '@/hooks/useFeed';
import { useAuth } from '@/hooks/useAuth';

const TAGS = ['All', 'Digital', 'Fantasy', 'Sci-Fi', 'Abstract', 'Nature', 'Pixel', 'Photography'];

const HomePage = () => {
  const [activeTag, setActiveTag] = useState('All');
  const [feedType, setFeedType] = useState<'explore' | 'following'>('explore');
  const { isAuthenticated } = useAuth();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } = useFeed(feedType, activeTag === 'All' ? undefined : activeTag);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allArtworks = data?.pages.flatMap(p => p.data) || [];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Discover Amazing Art
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Where Creativity <span className="text-gradient">Comes Alive</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore, share, and celebrate art from creators worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setFeedType('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                feedType === 'explore' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Compass className="w-4 h-4" /> Explore
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setFeedType('following')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  feedType === 'following' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users className="w-4 h-4" /> Following
              </button>
            )}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTag === tag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : allArtworks.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {feedType === 'following' ? 'Your feed is empty' : 'No artworks found'}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {feedType === 'following' ? 'Follow artists to see their latest work here.' : 'Try a different category or check back later.'}
            </p>
            {feedType === 'following' && (
              <button onClick={() => setFeedType('explore')} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Explore artworks
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={`${feedType}-${activeTag}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="artwork-grid">
                {allArtworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage && <SkeletonGrid count={4} />}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HomePage;
