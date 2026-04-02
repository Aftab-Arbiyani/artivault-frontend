import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { settingsService } from '@/services/settingsService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPage = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['user-settings'],
    queryFn: () => settingsService.get(),
  });

  const updateMutation = useMutation({
    mutationFn: settingsService.update,
    onSuccess: (updated) => {
      queryClient.setQueryData(['user-settings'], updated);
      toast.success('Settings saved.');
    },
    onError: () => toast.error('Failed to update settings.'),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="h-8 w-40 bg-secondary rounded animate-pulse mb-8" />
        <div className="h-20 bg-secondary rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-6 h-6 text-muted-foreground" />
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Content Preferences</h2>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <Label htmlFor="mature-toggle" className="text-sm font-medium text-foreground">
                  Show Mature Content
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enable to see artworks marked as mature in feeds and search results.
                </p>
              </div>
            </div>
            <Switch
              id="mature-toggle"
              checked={settings?.showMatureContent ?? false}
              onCheckedChange={(checked) => updateMutation.mutate({ showMatureContent: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
