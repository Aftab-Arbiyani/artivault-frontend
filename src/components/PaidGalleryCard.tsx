import { Lock, Unlock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaidGallery } from '@/types';

interface PaidGalleryCardProps {
  gallery: PaidGallery;
  onPurchase?: (id: string) => void;
  isPurchasing?: boolean;
}

const PaidGalleryCard = ({ gallery, onPurchase, isPurchasing }: PaidGalleryCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden group">
      <div className="relative aspect-video overflow-hidden">
        <div className="grid grid-cols-3 h-full">
          {gallery.previewImages.slice(0, 3).map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={`w-full h-full object-cover ${!gallery.isPurchased ? 'blur-sm' : ''} transition-all`}
            />
          ))}
        </div>
        {!gallery.isPurchased && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="p-3 rounded-full bg-secondary/80">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        )}
        {gallery.isPurchased && (
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-primary/90">
            <Unlock className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground truncate">{gallery.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{gallery.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{gallery.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">{gallery.currency}</span>
          </div>
          <span className="text-xs text-muted-foreground">{gallery.artworkCount} artworks</span>
        </div>

        {!gallery.isPurchased && onPurchase && (
          <Button
            size="sm"
            className="w-full mt-3 gap-1.5"
            onClick={() => onPurchase(gallery.id)}
            disabled={isPurchasing}
          >
            <Lock className="w-3.5 h-3.5" />
            {isPurchasing ? 'Processing...' : `Purchase $${gallery.price.toFixed(2)}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaidGalleryCard;
