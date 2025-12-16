import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/lib/api';

interface RecentConversationsProps {
  conversations: Conversation[];
}

const stateColors: Record<string, string> = {
  NEW: 'bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]',
  NEED_INTENT: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]',
  NEED_SERVICE: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]',
  BOOKED: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]',
  HANDOFF: 'bg-destructive/10 text-destructive',
};

const channelIcons: Record<string, string> = {
  WHATSAPP: '💬',
  INSTAGRAM: '📸',
};

export function RecentConversations({ conversations }: RecentConversationsProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="font-semibold text-card-foreground">Conversaciones Recientes</h3>
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="divide-y divide-border">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{channelIcons[conv.channel]}</span>
              <div>
                <p className="font-medium text-card-foreground">
                  {conv.client?.nombre || 'Cliente desconocido'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {conv.last_intent || 'Sin intención detectada'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn('font-medium', stateColors[conv.state] || 'bg-muted text-muted-foreground')}>
                {conv.state}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(conv.last_seen_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
