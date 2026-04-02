import { motion } from 'framer-motion';
import { Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { GalleryFolder } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GalleryFolderCardProps {
  folder: GalleryFolder;
  isOwner?: boolean;
  onClick: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

const GalleryFolderCard = ({ folder, isOwner, onClick, onRename, onDelete }: GalleryFolderCardProps) => {
  const previews = folder.artworks.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/40 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Preview thumbnails grid */}
      <div className="aspect-[4/3] relative bg-secondary overflow-hidden">
        {previews.length > 0 ? (
          <div className="grid grid-cols-3 h-full gap-0.5">
            {previews.length >= 1 && (
              <div className={previews.length === 1 ? 'col-span-3' : previews.length === 2 ? 'col-span-2' : 'col-span-2 row-span-1'}>
                <img src={previews[0].imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            {previews.length >= 2 && (
              <div className={previews.length === 2 ? 'col-span-1' : 'col-span-1'}>
                <img src={previews[1].imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            {previews.length >= 3 && (
              <div className="col-span-1">
                <img src={previews[2].imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Folder className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Folder info */}
      <div className="p-3 flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{folder.name}</h3>
          <p className="text-xs text-muted-foreground">{folder.artworkCount} artwork{folder.artworkCount !== 1 ? 's' : ''}</p>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <button className="p-1 rounded hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
              <DropdownMenuItem onClick={onRename}>
                <Pencil className="w-3.5 h-3.5 mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
};

export default GalleryFolderCard;
