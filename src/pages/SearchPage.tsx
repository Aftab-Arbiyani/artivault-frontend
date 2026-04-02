import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import ArtworkCard from '@/components/ArtworkCard';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { useSearchArtworks, useSearchUsers } from '@/hooks/useSearch';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);
  const [tab, setTab] = useState<'artworks' | 'users'>('artworks');
  const { ref, inView } = useInView();

  const {
    data: artData,
    isLoading: artLoading,
    fetchNextPage: fetchNextArt,
    hasNextPage: hasMoreArt,
    isFetchingNextPage: fetchingMoreArt,
  } = useSearchArtworks(query);

  const {
    data: userData,
    isLoading: usersLoading,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasMoreUsers,
    isFetchingNextPage: fetchingMoreUsers,
  } = useSearchUsers(query);

  useEffect(() => {
    if (inView) {
      if (tab === 'artworks' && hasMoreArt && !fetchingMoreArt) fetchNextArt();
      if (tab === 'users' && hasMoreUsers && !fetchingMoreUsers) fetchNextUsers();
    }
  }, [inView, tab, hasMoreArt, hasMoreUsers, fetchingMoreArt, fetchingMoreUsers, fetchNextArt, fetchNextUsers]);

  const artworks = artData?.pages.flatMap(p => p.data) || [];
  const users = userData?.pages.flatMap(p => p.data) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setSearchParams({ q: input.trim() });
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim() && input.trim() !== query) {
        setSearchParams({ q: input.trim() });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search artworks, artists, tags..."
            autoFocus
            className="w-full pl-12 pr-4 py-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
          />
        </div>
      </form>

      {query && (
        <>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 w-fit mb-8">
            <button
              onClick={() => setTab('artworks')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === 'artworks' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Artworks {artworks.length > 0 ? `(${artworks.length})` : ''}
            </button>
            <button
              onClick={() => setTab('users')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === 'users' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Users {users.length > 0 ? `(${users.length})` : ''}
            </button>
          </div>

          {tab === 'artworks' && (
            artLoading ? <SkeletonGrid count={6} /> : artworks.length > 0 ? (
              <>
                <div className="artwork-grid">
                  {artworks.map(a => <ArtworkCard key={a.id} artwork={a} />)}
                </div>
                <div ref={ref} className="flex justify-center py-8">
                  {fetchingMoreArt && <SkeletonGrid count={4} />}
                </div>
              </>
            ) : (
              <EmptyState message="No artworks found for this search." />
            )
          )}

          {tab === 'users' && (
            usersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />)}
              </div>
            ) : users.length > 0 ? (
              <>
                <div className="grid gap-3 max-w-2xl">
                  {users.map(u => (
                    <Link
                      key={u.id}
                      to={`/profile/${u.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
                    >
                      <img src={u.avatar} alt={u.username} className="w-12 h-12 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{u.username}</h3>
                        <p className="text-sm text-muted-foreground truncate">{u.bio}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{u.followersCount.toLocaleString()} followers</span>
                    </Link>
                  ))}
                </div>
                <div ref={ref} className="flex justify-center py-8">
                  {fetchingMoreUsers && (
                    <div className="space-y-3 w-full max-w-2xl">
                      {[1, 2].map(i => <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />)}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <EmptyState message="No users found for this search." />
            )
          )}
        </>
      )}

      {!query && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">Search Artivault</h3>
          <p className="text-muted-foreground">Find artworks, artists, and tags.</p>
        </motion.div>
      )}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-16">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default SearchPage;
