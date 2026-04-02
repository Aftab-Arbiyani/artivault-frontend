import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Folder, X } from 'lucide-react';
import { toast } from 'sonner';
import ArtworkCard from '@/components/ArtworkCard';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { galleryService } from '@/services/galleryService';
import { queryKeys } from '@/services/queryKeys';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const FolderDetailPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: folder, isLoading } = useQuery({
    queryKey: queryKeys.galleryFolder(folderId!),
    queryFn: () => galleryService.getFolderById(folderId!),
    enabled: !!folderId,
  });

  const removeMutation = useMutation({
    mutationFn: (artworkId: string) => galleryService.removeArtwork(folderId!, artworkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryFolder(folderId!) });
      queryClient.invalidateQueries({ queryKey: ['galleryFolders'] });
      toast.success('Artwork removed from folder');
    },
  });

  const isOwner = user?.id === folder?.userId;

  if (isLoading || !folder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-32 bg-secondary rounded animate-pulse mb-6" />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/profile/${folder.userId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to profile
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Folder className="w-6 h-6 text-primary" />
        <h1 className="font-display text-2xl font-bold text-foreground">{folder.name}</h1>
        <span className="text-sm text-muted-foreground">({folder.artworkCount} artworks)</span>
      </div>

      {folder.artworks.length === 0 ? (
        <div className="text-center py-20">
          <Folder className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">This folder is empty.</p>
        </div>
      ) : (
        <div className="artwork-grid">
          {folder.artworks.map(a => (
            <div key={a.id} className="relative group/remove">
              <ArtworkCard artwork={a} />
              {isOwner && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover/remove:opacity-100 transition-opacity z-10"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); removeMutation.mutate(a.id); }}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderDetailPage;
