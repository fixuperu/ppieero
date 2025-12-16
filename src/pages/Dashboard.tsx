import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentConversations } from '@/components/dashboard/RecentConversations';
import { Users, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { mockClients, mockConversations, mockHandoffs, mockAppointments } from '@/lib/mockData';

export default function Dashboard() {
  const openHandoffs = mockHandoffs.filter((h) => h.status === 'OPEN').length;
  const activeConversations = mockConversations.filter(
    (c) => !['BOOKED', 'HANDOFF'].includes(c.state)
  ).length;

  return (
    <DashboardLayout title="Dashboard" subtitle="Vista general del agente">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Clientes"
          value={mockClients.length}
          change="+12% este mes"
          changeType="positive"
          icon={Users}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Conversaciones Activas"
          value={activeConversations}
          icon={MessageSquare}
          iconColor="bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]"
        />
        <StatsCard
          title="Citas Hoy"
          value={mockAppointments.length}
          change="2 pendientes"
          changeType="neutral"
          icon={Calendar}
          iconColor="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
        />
        <StatsCard
          title="Handoffs Abiertos"
          value={openHandoffs}
          change={openHandoffs > 0 ? 'Requiere atención' : 'Todo resuelto'}
          changeType={openHandoffs > 0 ? 'negative' : 'positive'}
          icon={AlertCircle}
          iconColor="bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
        />
      </div>

      {/* Recent Conversations */}
      <RecentConversations conversations={mockConversations} />
    </DashboardLayout>
  );
}
