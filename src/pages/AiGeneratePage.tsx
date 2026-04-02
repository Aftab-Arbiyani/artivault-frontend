import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Sparkles, Send, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { aiService, type AiGenerationResult } from '@/services/aiService';
import { artworkService } from '@/services/artworkService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const AiGeneratePage = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AiGenerationResult | null>(null);
  const navigate = useNavigate();

  const generateMutation = useMutation({
    mutationFn: (p: string) => aiService.generate(p),
    onSuccess: (data) => setResult(data),
    onError: () => toast.error('Generation failed. Please try again.'),
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!result) throw new Error('No image');
      const formData = new FormData();
      // In real implementation, the generated image would be a blob/file
      formData.append('title', `AI: ${prompt.slice(0, 50)}`);
      formData.append('description', `Generated with AI. Prompt: ${prompt}`);
      formData.append('tags', JSON.stringify(['ai-generated']));
      formData.append('isAiGenerated', 'true');
      formData.append('imageUrl', result.imageUrl);
      return artworkService.upload(formData);
    },
    onSuccess: () => {
      toast.success('AI artwork published!');
      navigate('/');
    },
    onError: () => toast.error('Failed to publish.'),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-accent/10">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">AI Image Generator</h1>
          <p className="text-sm text-muted-foreground">Describe your vision and let AI create it</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Prompt</label>
          <Textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="A mystical forest with bioluminescent trees under a starry sky..."
            rows={4}
            className="resize-none"
          />
        </div>

        <Button
          onClick={() => generateMutation.mutate(prompt)}
          disabled={!prompt.trim() || generateMutation.isPending}
          className="w-full gap-2"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Generate Image
            </>
          )}
        </Button>

        {generateMutation.isPending && (
          <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Creating your masterpiece...</p>
            <div className="w-full max-w-xs h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {result && !generateMutation.isPending && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <img src={result.imageUrl} alt="AI Generated" className="w-full max-h-[500px] object-contain bg-secondary" />
            <div className="p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground truncate flex-1 mr-4">Prompt: {result.prompt}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => generateMutation.mutate(prompt)}>
                  Regenerate
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending}>
                  <Upload className="w-3.5 h-3.5" />
                  {publishMutation.isPending ? 'Publishing...' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiGeneratePage;
