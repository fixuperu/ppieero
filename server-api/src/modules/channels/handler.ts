import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';
import { processMessage } from '../conversationEngine/index.js';
import { sendWhatsAppMessage } from '../integrations/whatsapp.js';
import { sendInstagramMessage } from '../integrations/instagram.js';

export interface IncomingMessage {
  channel: 'WHATSAPP' | 'INSTAGRAM';
  senderId: string;
  threadId: string;
  text: string;
  timestamp: Date;
  rawPayload: any;
}

export async function handleIncomingMessage(message: IncomingMessage) {
  logger.info({ channel: message.channel, senderId: message.senderId }, 'Processing incoming message');

  try {
    // Find or create client
    let client = await findOrCreateClient(message);

    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        channel_external_thread_id: {
          channel: message.channel,
          external_thread_id: message.threadId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          channel: message.channel,
          external_thread_id: message.threadId,
          client_id: client.id,
          state: 'NEW',
        },
      });
    }

    // Update last seen
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { last_seen_at: new Date() },
    });

    // Save inbound message
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        direction: 'INBOUND',
        text: message.text,
        raw_payload_json: message.rawPayload,
      },
    });

    // Process message through conversation engine
    const response = await processMessage(conversation.id, message.text);

    // Save outbound message
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        direction: 'OUTBOUND',
        text: response,
      },
    });

    // Send response via appropriate channel
    if (message.channel === 'WHATSAPP') {
      await sendWhatsAppMessage(message.senderId, response);
    } else {
      await sendInstagramMessage(message.senderId, response);
    }

    logger.info({ conversationId: conversation.id }, 'Message processed successfully');
  } catch (error) {
    logger.error(error, 'Error handling incoming message');
    throw error;
  }
}

async function findOrCreateClient(message: IncomingMessage) {
  const idField = message.channel === 'WHATSAPP' ? 'whatsapp_id' : 'instagram_id';
  
  let client = await prisma.client.findFirst({
    where: { [idField]: message.senderId },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        nombre: 'Nuevo Cliente',
        [idField]: message.senderId,
        idioma: 'es',
        zona_horaria: 'America/Mexico_City',
      },
    });
    logger.info({ clientId: client.id }, 'Created new client');
  }

  return client;
}
