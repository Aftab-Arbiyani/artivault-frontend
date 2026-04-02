import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Folder, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { galleryService } from '@/services/galleryService';
import { queryKeys } from '@/services/queryKeys';
import GalleryFolderModal from './GalleryFolderModal';

interface AddToGalleryModalProps {
  open: boolean;
  onClose: () => void;
  artworkId: string;
  userId: string;
}

const AddToGalleryModal = ({ open, onClose, artworkId, userId }: AddToGalleryModalProps) => {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);

  const { data: folders = [], isLoading } = useQuery({
    queryKey: queryKeys.galleryFolders(userId),
    queryFn: () => galleryService.getFolders(userId),
    enabled: open,
  });

  const addMutation = useMutation({
    mutationFn: (folderId: string) => galleryService.addArtwork(folderId, artworkId),
    onSuccess: (_, folderId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryFolders(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryFolder(folderId) });
      toast.success('Artwork added to folder!');
      onClose();
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => galleryService.createFolder(name, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryFolders(userId) });
      setShowCreate(false);
      toast.success('Folder created!');
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={v => !v && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Gallery</DialogTitle>
            <DialogDescription>Choose a folder for this artwork.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-secondary rounded-lg animate-pulse" />)}
              </div>
            ) : folders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No folders yet. Create one!</p>
            ) : (
              folders.map(folder => {
                const alreadyAdded = folder.artworks.some(a => a.id === artworkId);
                return (
                  <button
                    key={folder.id}
                    onClick={() => !alreadyAdded && addMutation.mutate(folder.id)}
                    disabled={alreadyAdded || addMutation.isPending}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-surface-hover transition-colors disabled:opacity-60 text-left"
                  >
                    <Folder className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">{folder.artworkCount} artworks</p>
                    </div>
                    {alreadyAdded && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
          <Button variant="outline" className="w-full mt-2" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Folder
          </Button>
        </DialogContent>
      </Dialog>
      <GalleryFolderModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={name => createMutation.mutate(name)}
        mode="create"
      />
    </>
  );
};

export default AddToGalleryModal;
