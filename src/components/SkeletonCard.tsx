const SkeletonCard = () => (
  <div className="rounded-lg overflow-hidden bg-card border border-border/50 animate-pulse">
    <div className="aspect-[3/4] bg-secondary" />
    <div className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-secondary" />
        <div className="w-20 h-3 bg-secondary rounded" />
      </div>
      <div className="w-12 h-3 bg-secondary rounded" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="artwork-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
