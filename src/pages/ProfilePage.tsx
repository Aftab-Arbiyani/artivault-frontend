import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Users, Plus } from 'lucide-react';
import { toast } from 'sonner';
import ArtworkCard from '@/components/ArtworkCard';
import GalleryFolderCard from '@/components/GalleryFolderCard';
import GalleryFolderModal from '@/components/GalleryFolderModal';
import PaidGalleryCard from '@/components/PaidGalleryCard';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { userService } from '@/services/userService';
import { artworkService } from '@/services/artworkService';
import { galleryService } from '@/services/galleryService';
import { collectionService } from '@/services/collectionService';
import { paidGalleryService } from '@/services/paidGalleryService';
import { queryKeys } from '@/services/queryKeys';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [following, setFollowing] = useState(false);
  const { ref, inView } = useInView();

  const [folderModal, setFolderModal] = useState<{ open: boolean; mode: 'create' | 'rename'; folderId?: string; name?: string }>({ open: false, mode: 'create' });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const isOwner = currentUser?.id === id;

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: queryKeys.user(id!),
    queryFn: () => userService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: artData,
    isLoading: artLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.userArtworks(id!),
    queryFn: ({ pageParam }) => artworkService.getByUser(id!, pageParam ?? undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!id,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const artworks = artData?.pages.flatMap(p => p.data) || [];

  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: queryKeys.galleryFolders(id!),
    queryFn: () => galleryService.getFolders(id!),
    enabled: !!id,
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: queryKeys.collections(),
    queryFn: () => collectionService.getAll(),
  });

  const { data: paidGalleries = [], isLoading: paidGalleriesLoading } = useQuery({
    queryKey: ['paid-galleries', id],
    queryFn: () => paidGalleryService.getByUser(id!),
    enabled: !!id,
  });

  const purchaseMutation = useMutation({
    mutationFn: (galleryId: string) => paidGalleryService.purchase(galleryId),
    onSuccess: (data) => {
      if (data.url && data.url !== '#') window.location.href = data.url;
      else toast.info('Payment flow will redirect when backend is connected.');
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (name: string) => galleryService.createFolder(name, id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryFolders(id!) });
      toast.success('Folder created!');
    },
  });

  const renameFolderMutation = useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) => galleryService.updateFolder(folderId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryFolders(id!) });
      toast.success('Folder renamed!');
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => galleryService.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.galleryFolders(id!) });
      toast.success('Folder deleted');
      setDeleteTarget(null);
    },
  });

  if (userLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-secondary" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-secondary rounded" />
              <div className="h-4 w-64 bg-secondary rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full border-2 border-primary/30" />
        <div className="text-center sm:text-left flex-1">
          <h1 className="font-display text-2xl font-bold text-foreground">{user.username}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{user.bio}</p>
          <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{user.followersCount.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">{user.followingCount.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">following</span>
            </div>
          </div>
        </div>
        {!isOwner && (
          <button
            onClick={() => setFollowing(!following)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              following ? 'bg-secondary text-foreground hover:bg-destructive/10 hover:text-destructive' : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <Tabs defaultValue="artworks" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="artworks">Artworks</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="paid-galleries">Paid Galleries</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>

        <TabsContent value="artworks">
          {artLoading ? <SkeletonGrid count={4} /> : (
            <>
              <div className="artwork-grid">
                {artworks.map(a => <ArtworkCard key={a.id} artwork={a} />)}
              </div>
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage && <SkeletonGrid count={4} />}
              </div>
            </>
          )}
          {!artLoading && artworks.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No artworks yet.</p>
          )}
        </TabsContent>

        <TabsContent value="gallery">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Gallery Folders</h2>
            {isOwner && (
              <Button size="sm" onClick={() => setFolderModal({ open: true, mode: 'create' })}>
                <Plus className="w-4 h-4 mr-1" /> New Folder
              </Button>
            )}
          </div>
          {foldersLoading ? <SkeletonGrid count={3} /> : folders.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No gallery folders yet.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {folders.map(f => (
                <GalleryFolderCard
                  key={f.id}
                  folder={f}
                  isOwner={isOwner}
                  onClick={() => navigate(`/gallery/${f.id}`)}
                  onRename={() => setFolderModal({ open: true, mode: 'rename', folderId: f.id, name: f.name })}
                  onDelete={() => setDeleteTarget(f.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paid-galleries">
          {paidGalleriesLoading ? <SkeletonGrid count={3} /> : paidGalleries.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No paid galleries yet.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {paidGalleries.map(g => (
                <PaidGalleryCard
                  key={g.id}
                  gallery={g}
                  onPurchase={(gid) => purchaseMutation.mutate(gid)}
                  isPurchasing={purchaseMutation.isPending}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections">
          {collectionsLoading ? <SkeletonGrid count={3} /> : collections.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No collections yet.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map(c => (
                <div key={c.id} className="rounded-xl overflow-hidden bg-card border border-border/50 p-4">
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.artworkCount} artworks</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <GalleryFolderModal
        open={folderModal.open}
        onClose={() => setFolderModal({ open: false, mode: 'create' })}
        mode={folderModal.mode}
        initialName={folderModal.name || ''}
        onSubmit={name => {
          if (folderModal.mode === 'create') createFolderMutation.mutate(name);
          else if (folderModal.folderId) renameFolderMutation.mutate({ folderId: folderModal.folderId, name });
        }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this folder. Artworks won't be affected.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteTarget && deleteFolderMutation.mutate(deleteTarget)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;
