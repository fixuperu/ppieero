import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockClients } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Instagram, MoreHorizontal } from 'lucide-react';

export default function Clients() {
  return (
    <DashboardLayout title="Clientes" subtitle="Gestión de clientes del sistema">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Canales</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Zona Horaria</TableHead>
              <TableHead>Consentimiento</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium text-card-foreground">{client.nombre}</p>
                    {client.telefono && (
                      <p className="text-sm text-muted-foreground">{client.telefono}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {client.whatsapp_id && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--success))]/10">
                        <MessageSquare className="h-4 w-4 text-[hsl(var(--success))]" />
                      </div>
                    )}
                    {client.instagram_id && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10">
                        <Instagram className="h-4 w-4 text-pink-500" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {client.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.zona_horaria}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={client.consentimiento ? 'default' : 'outline'}
                    className={
                      client.consentimiento
                        ? 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]'
                        : ''
                    }
                  >
                    {client.consentimiento ? 'Sí' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(client.created_at), 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
