import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockHandoffs } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, CheckCircle, MessageSquare, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Handoffs() {
  const openHandoffs = mockHandoffs.filter((h) => h.status === 'OPEN');
  const closedHandoffs = mockHandoffs.filter((h) => h.status === 'CLOSED');

  return (
    <DashboardLayout title="Handoffs" subtitle="Conversaciones que requieren atención humana">
      {openHandoffs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-[hsl(var(--success))]" />
          <h3 className="mt-4 text-lg font-semibold text-card-foreground">
            No hay handoffs pendientes
          </h3>
          <p className="mt-2 text-muted-foreground">
            Todas las conversaciones están siendo gestionadas por el agente.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Pendientes ({openHandoffs.length})
          </h2>
          <div className="grid gap-4 mb-8">
            {openHandoffs.map((handoff) => (
              <HandoffCard key={handoff.id} handoff={handoff} />
            ))}
          </div>
        </>
      )}

      {closedHandoffs.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Resueltos ({closedHandoffs.length})
          </h2>
          <div className="grid gap-4 opacity-60">
            {closedHandoffs.map((handoff) => (
              <HandoffCard key={handoff.id} handoff={handoff} />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function HandoffCard({ handoff }: { handoff: (typeof mockHandoffs)[0] }) {
  const conv = handoff.conversation;
  const isOpen = handoff.status === 'OPEN';

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-6 shadow-sm',
        isOpen ? 'border-destructive/30' : 'border-border'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              conv?.channel === 'WHATSAPP'
                ? 'bg-[hsl(var(--success))]/10'
                : 'bg-pink-500/10'
            )}
          >
            {conv?.channel === 'WHATSAPP' ? (
              <MessageSquare className="h-6 w-6 text-[hsl(var(--success))]" />
            ) : (
              <Instagram className="h-6 w-6 text-pink-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">
              {conv?.client?.nombre || 'Cliente desconocido'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{handoff.reason}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Creado{' '}
              {formatDistanceToNow(new Date(handoff.created_at), {
                addSuffix: true,
                locale: es,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={isOpen ? 'destructive' : 'secondary'}
            className={isOpen ? '' : 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]'}
          >
            {isOpen ? 'Abierto' : 'Cerrado'}
          </Badge>
          {isOpen && (
            <Button size="sm" variant="outline">
              Resolver
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
