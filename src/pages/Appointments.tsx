import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockAppointments, mockClients } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Appointments() {
  return (
    <DashboardLayout title="Citas" subtitle="Log de citas (auditoría - fuente de verdad: SimplyBook)">
      <div className="mb-4 rounded-lg border border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5 p-4">
        <p className="text-sm text-[hsl(var(--warning))]">
          <strong>Nota:</strong> Esta tabla es solo para auditoría. La disponibilidad y estado real
          de las citas se consulta siempre en SimplyBook por API.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Fecha/Hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>SimplyBook ID</TableHead>
              <TableHead>Registrado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAppointments.map((apt) => {
              const client = mockClients.find((c) => c.id === apt.client_id);
              return (
                <TableRow key={apt.id}>
                  <TableCell>
                    <p className="font-medium text-card-foreground">
                      {client?.nombre || 'Desconocido'}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{apt.service_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(apt.start_at), "dd MMM yyyy 'a las' HH:mm", {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        apt.status === 'confirmed'
                          ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]'
                          : apt.status === 'cancelled'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary">
                      {apt.simplybook_booking_id}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(apt.created_at), 'dd/MM/yy HH:mm')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
