// API client for connecting to your Node.js/Fastify backend
// Replace BASE_URL with your actual backend URL

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || '';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Knowledge Base
  getKnowledge: () => apiRequest<KnowledgeItem[]>('/admin/knowledge'),
  upsertKnowledge: (key: string, value: string) =>
    apiRequest('/admin/knowledge', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    }),

  // Clients
  getClients: () => apiRequest<Client[]>('/admin/clients'),

  // Conversations
  getConversations: () => apiRequest<Conversation[]>('/admin/conversations'),

  // Handoffs
  getHandoffs: () => apiRequest<Handoff[]>('/admin/handoffs'),
};

// Types matching your Prisma schema
export interface Client {
  id: string;
  nombre: string;
  telefono?: string;
  instagram_id?: string;
  whatsapp_id?: string;
  idioma: string;
  zona_horaria: string;
  preferencias?: Record<string, unknown>;
  consentimiento: boolean;
  consentimiento_at?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  channel: 'WHATSAPP' | 'INSTAGRAM';
  external_thread_id: string;
  state: string;
  last_intent?: string;
  last_seen_at: string;
  client_id: string;
  client?: Client;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  text: string;
  raw_payload_json?: Record<string, unknown>;
  created_at: string;
}

export interface KnowledgeItem {
  key: string;
  value: string;
  updated_at: string;
}

export interface Handoff {
  id: string;
  conversation_id: string;
  reason: string;
  status: 'OPEN' | 'CLOSED';
  conversation?: Conversation;
  created_at: string;
  updated_at: string;
}

export interface AppointmentLog {
  id: string;
  simplybook_booking_id: string;
  client_id: string;
  service_id: string;
  staff_id?: string;
  start_at: string;
  end_at: string;
  status: string;
  created_at: string;
}
