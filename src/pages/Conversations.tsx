import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockConversations } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Instagram } from 'lucide-react';

const stateColors: Record<string, string> = {
  NEW: 'bg-[hsl(var(--info))]/10 text-[hsl(var(--info))] border-[hsl(var(--info))]/20',
  NEED_INTENT: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20',
  NEED_SERVICE: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20',
  NEED_DATE_PREF: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20',
  FETCHING_AVAILABILITY: 'bg-primary/10 text-primary border-primary/20',
  PROPOSE_SLOTS: 'bg-primary/10 text-primary border-primary/20',
  NEED_CONFIRM_SLOT: 'bg-primary/10 text-primary border-primary/20',
  BOOKING: 'bg-primary/10 text-primary border-primary/20',
  BOOKED: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20',
  HANDOFF: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Conversations() {
  return (
    <DashboardLayout title="Conversaciones" subtitle="Historial de interacciones con clientes">
      <div className="grid gap-4">
        {mockConversations.map((conv) => (
          <div
            key={conv.id}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    conv.channel === 'WHATSAPP'
                      ? 'bg-[hsl(var(--success))]/10'
                      : 'bg-pink-500/10'
                  )}
                >
                  {conv.channel === 'WHATSAPP' ? (
                    <MessageSquare className="h-6 w-6 text-[hsl(var(--success))]" />
                  ) : (
                    <Instagram className="h-6 w-6 text-pink-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {conv.client?.nombre || 'Cliente desconocido'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Canal: {conv.channel} • Thread: {conv.external_thread_id}
                  </p>
                  {conv.last_intent && (
                    <p className="text-sm text-muted-foreground">
                      Última intención: <span className="font-medium">{conv.last_intent}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={cn('border', stateColors[conv.state] || 'bg-muted')}>
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
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
