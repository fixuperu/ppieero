import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <DashboardLayout title="Configuración" subtitle="Conexiones API y ajustes del sistema">
      <div className="grid gap-6 max-w-2xl">
        {/* API Backend */}
        <Card>
          <CardHeader>
            <CardTitle>Backend API</CardTitle>
            <CardDescription>
              Conecta con tu servidor Node.js/Fastify
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL del Backend</Label>
              <Input
                id="api-url"
                placeholder="http://localhost:3000"
                defaultValue="http://localhost:3000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-key">Admin API Key</Label>
              <Input id="admin-key" type="password" placeholder="Tu ADMIN_API_KEY" />
            </div>
            <Button>Guardar conexión</Button>
          </CardContent>
        </Card>

        {/* SimplyBook */}
        <Card>
          <CardHeader>
            <CardTitle>SimplyBook</CardTitle>
            <CardDescription>
              Configuración de integración con SimplyBook (gestionada en el backend)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Modo Mock</p>
                <p className="text-sm text-muted-foreground">
                  Usar datos simulados en lugar de la API real
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              Las credenciales de SimplyBook se configuran en el backend mediante variables de
              entorno (SIMPLYBOOK_*).
            </p>
          </CardContent>
        </Card>

        {/* Meta Webhooks */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Webhooks</CardTitle>
            <CardDescription>
              Información para configurar WhatsApp e Instagram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL del Webhook</Label>
              <code className="block rounded bg-muted p-3 text-sm font-mono">
                https://tu-servidor.com/webhooks/meta
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              Configura esta URL en el panel de desarrolladores de Meta para WhatsApp Cloud API e
              Instagram Messaging API.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
