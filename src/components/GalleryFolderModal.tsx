import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GalleryFolderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  mode: 'create' | 'rename';
}

const GalleryFolderModal = ({ open, onClose, onSubmit, initialName = '', mode }: GalleryFolderModalProps) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Folder' : 'Rename Folder'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Give your gallery folder a name.' : 'Enter a new name for this folder.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Folder name..."
            autoFocus
            className="mb-4"
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!name.trim()}>
              {mode === 'create' ? 'Create' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryFolderModal;
