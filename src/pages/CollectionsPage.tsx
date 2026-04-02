import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, FolderOpen, X } from 'lucide-react';
import { toast } from 'sonner';
import { collectionService } from '@/services/collectionService';
import { queryKeys } from '@/services/queryKeys';

const CollectionsPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const { data: collections, isLoading } = useQuery({
    queryKey: queryKeys.collections(),
    queryFn: () => collectionService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: () => collectionService.create(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections() });
      toast.success('Collection created!');
      setShowCreate(false);
      setName('');
      setDescription('');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Collections</h1>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Collection
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">New Collection</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Collection name"
                className="w-full px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" rows={3}
                className="w-full px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
              <button type="submit" disabled={createMutation.isPending}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {createMutation.isPending ? 'Creating...' : 'Create Collection'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-card rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections?.map(c => (
            <div key={c.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer">
              <div className="aspect-video relative overflow-hidden bg-secondary">
                {c.coverImage ? (
                  <img src={c.coverImage} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderOpen className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground">{c.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{c.artworkCount} artworks</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
