import { Link } from 'react-router-dom';
import { Heart, Sparkles, ShieldAlert, CalendarClock } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import type { Artwork } from '@/types';
import { settingsService } from '@/services/settingsService';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const [liked, setLiked] = useState(artwork.isLiked);
  const [likeCount, setLikeCount] = useState(artwork.likesCount);

  const { data: settings } = useQuery({
    queryKey: ['user-settings'],
    queryFn: () => settingsService.get(),
    staleTime: 5 * 60 * 1000,
  });

  const isMatureHidden = artwork.isMature && !settings?.showMatureContent;
  const isScheduled = artwork.publishAt && new Date(artwork.publishAt) > new Date();

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-lg overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
    >
      <Link to={`/artwork/${artwork.id}`}>
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isMatureHidden ? 'blur-xl' : ''}`}
          />
          {isMatureHidden && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm">
              <ShieldAlert className="w-8 h-8 text-warning mb-2" />
              <p className="text-xs text-muted-foreground font-medium">Mature Content</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-display font-semibold text-foreground text-lg truncate">{artwork.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <img src={artwork.artist.avatar} alt={artwork.artist.username} className="w-5 h-5 rounded-full" />
              <span className="text-sm text-muted-foreground">{artwork.artist.username}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {artwork.isAiGenerated && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/80 text-accent-foreground text-[10px] font-medium backdrop-blur-sm">
                <Sparkles className="w-3 h-3" /> AI
              </span>
            )}
            {isScheduled && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground text-[10px] font-medium backdrop-blur-sm">
                <CalendarClock className="w-3 h-3" /> Scheduled
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-3">
        {artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {artwork.tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                onClick={e => e.stopPropagation()}
                className="px-2 py-0.5 rounded-full bg-secondary text-[11px] text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Link to={`/profile/${artwork.artist.id}`} className="flex items-center gap-2 min-w-0">
              <img src={artwork.artist.avatar} alt={artwork.artist.username} className="w-6 h-6 rounded-full flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">{artwork.artist.username}</span>
            </Link>
          </div>
          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-primary text-primary scale-110' : ''}`} />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
