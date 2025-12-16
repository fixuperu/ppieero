import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/useSettings';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const { settings, loading, updateSettings } = useSettings();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Form states
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [adminApiKey, setAdminApiKey] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState('');
  const [whatsappBusinessAccountId, setWhatsappBusinessAccountId] = useState('');
  const [instagramPageAccessToken, setInstagramPageAccessToken] = useState('');
  const [instagramAppId, setInstagramAppId] = useState('');
  const [instagramAppSecret, setInstagramAppSecret] = useState('');
  const [simplybookCompany, setSimplybookCompany] = useState('');
  const [simplybookApiKey, setSimplybookApiKey] = useState('');
  const [simplybookSecretKey, setSimplybookSecretKey] = useState('');
  const [simplybookMockMode, setSimplybookMockMode] = useState(true);
  const [webhookVerifyToken, setWebhookVerifyToken] = useState('');

  useEffect(() => {
    if (settings) {
      setApiBaseUrl(settings.api_base_url || 'http://localhost:3000');
      setAdminApiKey(settings.admin_api_key || '');
      setWhatsappToken(settings.whatsapp_token || '');
      setWhatsappPhoneNumberId(settings.whatsapp_phone_number_id || '');
      setWhatsappBusinessAccountId(settings.whatsapp_business_account_id || '');
      setInstagramPageAccessToken(settings.instagram_page_access_token || '');
      setInstagramAppId(settings.instagram_app_id || '');
      setInstagramAppSecret(settings.instagram_app_secret || '');
      setSimplybookCompany(settings.simplybook_company || '');
      setSimplybookApiKey(settings.simplybook_api_key || '');
      setSimplybookSecretKey(settings.simplybook_secret_key || '');
      setSimplybookMockMode(settings.simplybook_mock_mode ?? true);
      setWebhookVerifyToken(settings.webhook_verify_token || '');
    }
  }, [settings]);

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SecretInput = ({ id, value, onChange, placeholder }: { id: string; value: string; onChange: (v: string) => void; placeholder: string }) => (
    <div className="relative">
      <Input
        id={id}
        type={showSecrets[id] ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => toggleSecret(id)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showSecrets[id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout title="Configuración" subtitle="Cargando...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Configuración" subtitle="Conexiones API y ajustes del sistema">
      <div className="grid gap-6 max-w-2xl">
        {/* Backend API */}
        <Card>
          <CardHeader>
            <CardTitle>Backend API</CardTitle>
            <CardDescription>Conecta con tu servidor Node.js/Fastify</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL del Backend</Label>
              <Input
                id="api-url"
                placeholder="http://localhost:3000"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-key">Admin API Key</Label>
              <SecretInput
                id="admin-key"
                value={adminApiKey}
                onChange={setAdminApiKey}
                placeholder="Tu ADMIN_API_KEY"
              />
            </div>
            <Button onClick={() => updateSettings({ api_base_url: apiBaseUrl, admin_api_key: adminApiKey })}>
              Guardar conexión
            </Button>
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Cloud API</CardTitle>
            <CardDescription>Configuración de Meta WhatsApp Business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wa-token">Access Token</Label>
              <SecretInput
                id="wa-token"
                value={whatsappToken}
                onChange={setWhatsappToken}
                placeholder="EAAxxxxxx..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-phone-id">Phone Number ID</Label>
              <Input
                id="wa-phone-id"
                placeholder="1234567890"
                value={whatsappPhoneNumberId}
                onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wa-business-id">Business Account ID</Label>
              <Input
                id="wa-business-id"
                placeholder="9876543210"
                value={whatsappBusinessAccountId}
                onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
              />
            </div>
            <Button onClick={() => updateSettings({
              whatsapp_token: whatsappToken,
              whatsapp_phone_number_id: whatsappPhoneNumberId,
              whatsapp_business_account_id: whatsappBusinessAccountId
            })}>
              Guardar WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* Instagram */}
        <Card>
          <CardHeader>
            <CardTitle>Instagram Messaging API</CardTitle>
            <CardDescription>Configuración de Instagram DM vía Meta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ig-token">Page Access Token</Label>
              <SecretInput
                id="ig-token"
                value={instagramPageAccessToken}
                onChange={setInstagramPageAccessToken}
                placeholder="EAAxxxxxx..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig-app-id">App ID</Label>
              <Input
                id="ig-app-id"
                placeholder="123456789"
                value={instagramAppId}
                onChange={(e) => setInstagramAppId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig-app-secret">App Secret</Label>
              <SecretInput
                id="ig-app-secret"
                value={instagramAppSecret}
                onChange={setInstagramAppSecret}
                placeholder="abc123..."
              />
            </div>
            <Button onClick={() => updateSettings({
              instagram_page_access_token: instagramPageAccessToken,
              instagram_app_id: instagramAppId,
              instagram_app_secret: instagramAppSecret
            })}>
              Guardar Instagram
            </Button>
          </CardContent>
        </Card>

        {/* SimplyBook */}
        <Card>
          <CardHeader>
            <CardTitle>SimplyBook</CardTitle>
            <CardDescription>Sistema de reservas y disponibilidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">Modo Mock</p>
                <p className="text-sm text-muted-foreground">Usar datos simulados en lugar de la API real</p>
              </div>
              <Switch
                checked={simplybookMockMode}
                onCheckedChange={(checked) => {
                  setSimplybookMockMode(checked);
                  updateSettings({ simplybook_mock_mode: checked });
                }}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="sb-company">Company Login</Label>
              <Input
                id="sb-company"
                placeholder="tu-empresa"
                value={simplybookCompany}
                onChange={(e) => setSimplybookCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sb-api-key">API Key</Label>
              <SecretInput
                id="sb-api-key"
                value={simplybookApiKey}
                onChange={setSimplybookApiKey}
                placeholder="Tu API Key de SimplyBook"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sb-secret">Secret Key</Label>
              <SecretInput
                id="sb-secret"
                value={simplybookSecretKey}
                onChange={setSimplybookSecretKey}
                placeholder="Tu Secret Key de SimplyBook"
              />
            </div>
            <Button onClick={() => updateSettings({
              simplybook_company: simplybookCompany,
              simplybook_api_key: simplybookApiKey,
              simplybook_secret_key: simplybookSecretKey
            })}>
              Guardar SimplyBook
            </Button>
          </CardContent>
        </Card>

        {/* Meta Webhooks */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Webhooks</CardTitle>
            <CardDescription>Información para configurar WhatsApp e Instagram</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL del Webhook</Label>
              <code className="block rounded bg-muted p-3 text-sm font-mono">
                {apiBaseUrl}/webhooks/meta
              </code>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-token">Verify Token</Label>
              <Input
                id="webhook-token"
                placeholder="Tu token de verificación"
                value={webhookVerifyToken}
                onChange={(e) => setWebhookVerifyToken(e.target.value)}
              />
            </div>
            <Button onClick={() => updateSettings({ webhook_verify_token: webhookVerifyToken })}>
              Guardar Token
            </Button>
            <p className="text-sm text-muted-foreground">
              Configura esta URL y token en el panel de desarrolladores de Meta para WhatsApp Cloud API e Instagram Messaging API.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
