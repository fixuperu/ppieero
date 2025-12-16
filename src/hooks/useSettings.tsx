import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Settings {
  id: string;
  user_id: string;
  api_base_url: string | null;
  admin_api_key: string | null;
  whatsapp_token: string | null;
  whatsapp_phone_number_id: string | null;
  whatsapp_business_account_id: string | null;
  instagram_page_access_token: string | null;
  instagram_app_id: string | null;
  instagram_app_secret: string | null;
  simplybook_company: string | null;
  simplybook_api_key: string | null;
  simplybook_secret_key: string | null;
  simplybook_mock_mode: boolean | null;
  webhook_verify_token: string | null;
}

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching settings:', error);
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    if (!user || !settings) return;

    const { error } = await supabase
      .from('settings')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Error al guardar configuración');
      console.error('Error updating settings:', error);
    } else {
      setSettings({ ...settings, ...updates });
      toast.success('Configuración guardada');
    }
  };

  return { settings, loading, updateSettings, refetch: fetchSettings };
}
