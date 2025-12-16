// Mock data for development - remove when connecting to real backend
import type { Client, Conversation, KnowledgeItem, Handoff, AppointmentLog } from './api';

export const mockClients: Client[] = [
  {
    id: '1',
    nombre: 'María García',
    telefono: '+34612345678',
    whatsapp_id: 'wa_123456',
    idioma: 'es',
    zona_horaria: 'Europe/Madrid',
    preferencias: { servicio_favorito: 'Corte de pelo', horarios_preferidos: 'mañana' },
    consentimiento: true,
    consentimiento_at: '2024-01-15T10:00:00Z',
    tags: ['VIP', 'frequent'],
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-03-01T14:30:00Z',
  },
  {
    id: '2',
    nombre: 'Carlos López',
    instagram_id: 'ig_789012',
    idioma: 'es',
    zona_horaria: 'Europe/Lisbon',
    preferencias: { servicio_favorito: 'Masaje' },
    consentimiento: true,
    tags: ['new'],
    created_at: '2024-02-20T12:00:00Z',
    updated_at: '2024-02-20T12:00:00Z',
  },
  {
    id: '3',
    nombre: 'Ana Martínez',
    telefono: '+351912345678',
    whatsapp_id: 'wa_345678',
    instagram_id: 'ig_345678',
    idioma: 'pt',
    zona_horaria: 'Europe/Lisbon',
    preferencias: {},
    consentimiento: false,
    tags: [],
    created_at: '2024-03-05T09:00:00Z',
    updated_at: '2024-03-05T09:00:00Z',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    channel: 'WHATSAPP',
    external_thread_id: 'thread_wa_001',
    state: 'BOOKED',
    last_intent: 'book',
    last_seen_at: '2024-03-10T15:30:00Z',
    client_id: '1',
    client: mockClients[0],
    created_at: '2024-03-10T14:00:00Z',
    updated_at: '2024-03-10T15:30:00Z',
  },
  {
    id: 'conv_2',
    channel: 'INSTAGRAM',
    external_thread_id: 'thread_ig_002',
    state: 'NEED_SERVICE',
    last_intent: 'book',
    last_seen_at: '2024-03-11T10:15:00Z',
    client_id: '2',
    client: mockClients[1],
    created_at: '2024-03-11T10:00:00Z',
    updated_at: '2024-03-11T10:15:00Z',
  },
  {
    id: 'conv_3',
    channel: 'WHATSAPP',
    external_thread_id: 'thread_wa_003',
    state: 'HANDOFF',
    last_intent: 'human',
    last_seen_at: '2024-03-11T11:00:00Z',
    client_id: '3',
    client: mockClients[2],
    created_at: '2024-03-11T10:45:00Z',
    updated_at: '2024-03-11T11:00:00Z',
  },
];

export const mockKnowledge: KnowledgeItem[] = [
  { key: 'direccion', value: 'Calle Mayor 123, Madrid', updated_at: '2024-01-01T00:00:00Z' },
  { key: 'horario', value: 'Lunes a Viernes: 9:00-20:00, Sábados: 10:00-14:00', updated_at: '2024-01-01T00:00:00Z' },
  { key: 'politica_cancelacion', value: 'Cancelaciones gratuitas hasta 24h antes de la cita', updated_at: '2024-02-15T00:00:00Z' },
  { key: 'servicios', value: 'Corte de pelo, Tinte, Peinado, Masaje, Manicura, Pedicura', updated_at: '2024-01-01T00:00:00Z' },
  { key: 'precios_corte', value: 'Corte hombre: 15€, Corte mujer: 25€, Corte niño: 10€', updated_at: '2024-03-01T00:00:00Z' },
];

export const mockHandoffs: Handoff[] = [
  {
    id: 'handoff_1',
    conversation_id: 'conv_3',
    reason: 'Cliente solicita hablar con un humano',
    status: 'OPEN',
    conversation: mockConversations[2],
    created_at: '2024-03-11T11:00:00Z',
    updated_at: '2024-03-11T11:00:00Z',
  },
];

export const mockAppointments: AppointmentLog[] = [
  {
    id: 'apt_1',
    simplybook_booking_id: 'sb_12345',
    client_id: '1',
    service_id: 'corte_pelo',
    start_at: '2024-03-15T10:00:00Z',
    end_at: '2024-03-15T10:30:00Z',
    status: 'confirmed',
    created_at: '2024-03-10T15:30:00Z',
  },
];
