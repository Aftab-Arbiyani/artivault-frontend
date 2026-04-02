import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, ArrowLeft, FolderPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useArtwork, useArtworkComments, useLikeMutation } from '@/hooks/useArtwork';
import { commentService } from '@/services/commentService';
import { useAuth } from '@/hooks/useAuth';
import CommentSection from '@/components/CommentSection';
import AddToGalleryModal from '@/components/AddToGalleryModal';
import type { Comment } from '@/types';

const ArtworkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  const { data: artwork, isLoading } = useArtwork(id);
  const { data: commentsData } = useArtworkComments(id);
  const likeMutation = useLikeMutation(id || '');

  const comments = commentsData?.pages.flatMap(p => p.data) || [];

  const handleAddComment = async (text: string) => {
    await commentService.create(id!, text);
  };

  if (isLoading || !artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-secondary rounded" />
          <div className="aspect-video bg-secondary rounded-xl" />
          <div className="h-6 w-64 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden bg-card border border-border">
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full object-contain max-h-[70vh]" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{artwork.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDistanceToNow(new Date(artwork.createdAt), { addSuffix: true })}
            </div>
          </div>

          <Link to={`/profile/${artwork.artist.id}`} className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
            <img src={artwork.artist.avatar} alt={artwork.artist.username} className="w-10 h-10 rounded-full" />
            <div>
              <div className="text-sm font-medium text-foreground">{artwork.artist.username}</div>
              <div className="text-xs text-muted-foreground">{artwork.artist.followersCount.toLocaleString()} followers</div>
            </div>
          </Link>

          <p className="text-sm text-secondary-foreground leading-relaxed">{artwork.description}</p>

          <div className="flex gap-2 flex-wrap">
            {artwork.tags.map(tag => (
              <Link key={tag} to={`/tag/${tag}`} className="px-3 py-1 bg-secondary text-muted-foreground text-xs rounded-full hover:text-primary hover:bg-primary/10 transition-colors">
                #{tag}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => likeMutation.mutate()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                artwork.isLiked ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}>
              <Heart className={`w-4 h-4 ${artwork.isLiked ? 'fill-primary' : ''}`} />
              {artwork.likesCount}
            </button>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg text-sm text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              {comments.length}
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setGalleryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                Add to Gallery
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
        <CommentSection comments={comments} onAddComment={handleAddComment} />
      </div>

      {isAuthenticated && user && (
        <AddToGalleryModal
          open={galleryModalOpen}
          onClose={() => setGalleryModalOpen(false)}
          artworkId={id!}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default ArtworkDetailPage;
