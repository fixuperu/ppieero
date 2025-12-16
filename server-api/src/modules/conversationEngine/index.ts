import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';
import { detectIntent } from './intentDetection.js';
import { ConversationState } from '@prisma/client';
import { getAvailability, createBooking } from '../integrations/simplybook.js';

type Intent = 'book' | 'reschedule' | 'cancel' | 'info' | 'human' | 'unknown';

export async function processMessage(conversationId: string, text: string): Promise<string> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { client: true },
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const intent = await detectIntent(text, conversation.state);
  logger.info({ conversationId, intent, currentState: conversation.state }, 'Intent detected');

  // Update last intent
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { last_intent: intent },
  });

  // FSM state machine
  return await handleState(conversation, intent, text);
}

async function handleState(
  conversation: any,
  intent: Intent,
  text: string
): Promise<string> {
  const { state, id: conversationId } = conversation;

  // Handle human escalation at any point
  if (intent === 'human') {
    await transitionTo(conversationId, 'HANDOFF');
    await prisma.handoff.create({
      data: {
        conversation_id: conversationId,
        reason: 'Cliente solicitó hablar con un humano',
        status: 'OPEN',
      },
    });
    return 'Entendido, te comunicaré con un agente humano. Por favor espera un momento.';
  }

  switch (state) {
    case 'NEW':
    case 'NEED_INTENT':
      return await handleNeedIntent(conversationId, intent, text);

    case 'NEED_SERVICE':
      return await handleNeedService(conversationId, text);

    case 'NEED_DATE_PREF':
      return await handleNeedDatePref(conversationId, text);

    case 'PROPOSE_SLOTS':
    case 'NEED_CONFIRM_SLOT':
      return await handleSlotConfirmation(conversationId, text);

    case 'HANDOFF':
      return 'Un agente humano te atenderá pronto. Gracias por tu paciencia.';

    case 'BOOKED':
      await transitionTo(conversationId, 'NEED_INTENT');
      return '¡Tu cita está confirmada! ¿Hay algo más en lo que pueda ayudarte?';

    default:
      return 'Disculpa, no entendí tu mensaje. ¿En qué puedo ayudarte? Puedo ayudarte a agendar, reagendar o cancelar una cita.';
  }
}

async function handleNeedIntent(conversationId: string, intent: Intent, text: string): Promise<string> {
  switch (intent) {
    case 'book':
      await transitionTo(conversationId, 'NEED_SERVICE');
      return '¡Perfecto! ¿Qué servicio te gustaría agendar?';

    case 'reschedule':
      await transitionTo(conversationId, 'NEED_SERVICE');
      return 'Entendido, vamos a reagendar tu cita. ¿Cuál es el servicio de tu cita actual?';

    case 'cancel':
      await transitionTo(conversationId, 'NEED_SERVICE');
      return 'Entendido. ¿Podrías indicarme qué servicio tenías agendado?';

    case 'info':
      const answer = await lookupKnowledge(text);
      return answer || 'No encontré información sobre eso. ¿Puedo ayudarte con una cita?';

    default:
      return 'Hola, soy tu asistente de citas. ¿Te gustaría agendar una cita, reagendar o cancelar?';
  }
}

async function handleNeedService(conversationId: string, text: string): Promise<string> {
  // In a real implementation, match text to SimplyBook services
  await transitionTo(conversationId, 'NEED_DATE_PREF');
  return '¿Qué día y hora te funcionaría mejor para tu cita?';
}

async function handleNeedDatePref(conversationId: string, text: string): Promise<string> {
  await transitionTo(conversationId, 'FETCHING_AVAILABILITY');
  
  // Query SimplyBook for availability
  const slots = await getAvailability('default-service', new Date());
  
  if (slots.length === 0) {
    await transitionTo(conversationId, 'NEED_DATE_PREF');
    return 'Lo siento, no hay disponibilidad para esa fecha. ¿Podrías probar con otra fecha?';
  }

  await transitionTo(conversationId, 'PROPOSE_SLOTS');
  
  const slotsText = slots.slice(0, 3).map((s, i) => `${i + 1}. ${s}`).join('\n');
  return `Estos son los horarios disponibles:\n${slotsText}\n\n¿Cuál prefieres? Responde con el número.`;
}

async function handleSlotConfirmation(conversationId: string, text: string): Promise<string> {
  // Parse selection and book
  await transitionTo(conversationId, 'BOOKING');
  
  const booking = await createBooking({
    serviceId: 'default-service',
    startDateTime: new Date(),
    clientData: {},
  });

  await transitionTo(conversationId, 'BOOKED');
  return `¡Listo! Tu cita ha sido confirmada. Te esperamos el ${booking.date}. ¿Necesitas algo más?`;
}

async function transitionTo(conversationId: string, newState: ConversationState) {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { state: newState },
  });
  logger.info({ conversationId, newState }, 'State transition');
}

async function lookupKnowledge(query: string): Promise<string | null> {
  // Simple keyword matching - could be enhanced with embeddings
  const items = await prisma.knowledgeBase.findMany();
  
  for (const item of items) {
    if (query.toLowerCase().includes(item.key.toLowerCase())) {
      return item.value;
    }
  }
  
  return null;
}
