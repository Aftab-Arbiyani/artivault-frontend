import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, UserPlus, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { notificationService } from '@/services/notificationService';
import { queryKeys } from '@/services/queryKeys';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/types';

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
};

const colorMap = {
  like: 'text-primary',
  comment: 'text-accent',
  follow: 'text-yellow-500',
};

interface GroupedNotification {
  key: string;
  type: Notification['type'];
  notifications: Notification[];
  message: string;
  isRead: boolean;
  createdAt: string;
}

function groupNotifications(notifications: Notification[]): GroupedNotification[] {
  const groups: Record<string, Notification[]> = {};

  for (const n of notifications) {
    const key = `${n.type}-${n.artwork?.id || 'general'}-${n.message.replace(n.fromUser.username, '')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  }

  return Object.entries(groups).map(([key, items]) => {
    const first = items[0];
    return {
      key,
      type: first.type,
      notifications: items,
      message: first.message,
      isRead: items.every(n => n.isRead),
      createdAt: items[0].createdAt,
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: notificationService.getAll,
  });

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      toast.success('All notifications marked as read');
    },
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  const grouped = notifications ? groupNotifications(notifications) : [];

  const handleClick = (group: GroupedNotification) => {
    const first = group.notifications[0];
    if (group.type === 'follow') {
      navigate(`/profile/${first.fromUser.id}`);
    } else if (first.artwork) {
      navigate(`/artwork/${first.artwork.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
          >
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications yet.</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {grouped.map((group) => {
            const Icon = iconMap[group.type];
            const first = group.notifications[0];
            const extraCount = group.notifications.length - 1;

            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => handleClick(group)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:bg-secondary/80 ${
                  group.isRead ? 'bg-card' : 'bg-card border border-primary/20'
                }`}
              >
                <div className={`p-2 rounded-full bg-secondary ${colorMap[group.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <img src={first.fromUser.avatar} alt="" className="w-8 h-8 rounded-full" />
                  {extraCount > 0 && (
                    <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                      +{extraCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{first.fromUser.username}</span>
                    {extraCount > 0 && (
                      <span className="text-muted-foreground"> and {extraCount} other{extraCount > 1 ? 's' : ''}</span>
                    )}{' '}
                    <span className="text-muted-foreground">{first.message}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!group.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
