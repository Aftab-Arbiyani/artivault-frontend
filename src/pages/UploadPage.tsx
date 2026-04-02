import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, ShieldAlert, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { artworkService } from '@/services/artworkService';
import { subscriptionService } from '@/services/subscriptionService';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [isMature, setIsMature] = useState(false);
  const [publishAt, setPublishAt] = useState<Date | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionService.getMySubscription(),
  });

  const isSubscribed = subscription?.status === 'active' && subscription.plan !== 'free';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 10) {
      e.preventDefault();
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return;
    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));
      formData.append('isAiGenerated', String(isAiGenerated));
      formData.append('isMature', String(isMature));
      if (publishAt) formData.append('publishAt', publishAt.toISOString());

      await artworkService.upload(formData, (progress) => {
        setUploadProgress(progress);
      });

      toast.success(publishAt ? 'Artwork scheduled!' : 'Artwork published!');
      navigate('/');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Upload Artwork</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            preview ? 'border-primary/50' : 'border-border hover:border-primary/30'
          } overflow-hidden`}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full max-h-96 object-contain bg-secondary" />
              <button type="button" onClick={e => { e.stopPropagation(); setPreview(null); setFile(null); }}
                className="absolute top-3 right-3 p-1.5 bg-background/80 rounded-full hover:bg-background transition-colors">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium">Click to upload your artwork</p>
              <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {loading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="text-foreground font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="Give your artwork a name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            className="w-full px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            placeholder="Tell the story behind your piece..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Tags</label>
          <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
            className="w-full px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="Press Enter to add tags" />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content flags */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Content Details</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <Label htmlFor="ai-toggle" className="text-sm text-foreground">AI Generated</Label>
            </div>
            <Switch id="ai-toggle" checked={isAiGenerated} onCheckedChange={setIsAiGenerated} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-warning" />
              <Label htmlFor="mature-toggle" className="text-sm text-foreground">Mature Content</Label>
            </div>
            <Switch id="mature-toggle" checked={isMature} onCheckedChange={setIsMature} />
          </div>
        </div>

        {/* Scheduled publishing */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Schedule Publishing</h3>
            {!isSubscribed && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Pro</span>
            )}
          </div>

          {isSubscribed ? (
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn('gap-2', !publishAt && 'text-muted-foreground')}>
                    <CalendarClock className="w-3.5 h-3.5" />
                    {publishAt ? format(publishAt, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={publishAt}
                    onSelect={setPublishAt}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {publishAt && (
                <button type="button" onClick={() => setPublishAt(undefined)} className="text-xs text-muted-foreground hover:text-destructive">
                  Clear
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Upgrade to Pro to schedule artworks for future publishing.{' '}
              <a href="/subscription" className="text-primary hover:underline">Upgrade →</a>
            </p>
          )}
        </div>

        <button type="submit" disabled={loading || !title || !file}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-40 transition-opacity">
          <Upload className="w-4 h-4" />
          {loading ? 'Publishing...' : publishAt ? 'Schedule Artwork' : 'Publish Artwork'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
