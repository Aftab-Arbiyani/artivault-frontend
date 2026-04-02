import { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import type { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const [showReplies, setShowReplies] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
      <div className="flex gap-3 py-3">
        <img src={comment.author.avatar} alt={comment.author.username} className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{comment.author.username}</span>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="text-sm text-secondary-foreground mt-1">{comment.text}</p>
          {hasReplies && (
            <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
              {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      </div>
      {hasReplies && showReplies && comment.replies!.map(r => (
        <CommentItem key={r.id} comment={r} depth={depth + 1} />
      ))}
    </div>
  );
};

const CommentSection = ({ comments, onAddComment }: CommentSectionProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text);
    setText('');
  };

  return (
    <div>
      <h3 className="font-display font-semibold text-foreground text-lg mb-4">Comments ({comments.length})</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button type="submit" disabled={!text.trim()} className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity">
          <Send className="w-4 h-4" />
        </button>
      </form>
      <div className="space-y-1 divide-y divide-border/50">
        {comments.map(c => <CommentItem key={c.id} comment={c} />)}
      </div>
    </div>
  );
};

export default CommentSection;
