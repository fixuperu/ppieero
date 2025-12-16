import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { config } from '../config/index.js';
import { handleIncomingMessage } from '../modules/channels/handler.js';

export async function webhookRoutes(fastify: FastifyInstance) {
  // GET - Webhook verification for Meta
  fastify.get('/meta', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      'hub.mode'?: string;
      'hub.verify_token'?: string;
      'hub.challenge'?: string;
    };

    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === config.webhookVerifyToken) {
      fastify.log.info('Webhook verified successfully');
      return reply.send(challenge);
    }

    fastify.log.warn('Webhook verification failed');
    return reply.status(403).send('Forbidden');
  });

  // POST - Receive messages from Meta (WhatsApp & Instagram)
  fastify.post('/meta', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;

    try {
      // Process webhook payload
      if (body.object === 'whatsapp_business_account') {
        // WhatsApp message
        for (const entry of body.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              const value = change.value;
              for (const message of value.messages || []) {
                await handleIncomingMessage({
                  channel: 'WHATSAPP',
                  senderId: message.from,
                  threadId: message.from,
                  text: message.text?.body || '',
                  timestamp: new Date(parseInt(message.timestamp) * 1000),
                  rawPayload: message,
                });
              }
            }
          }
        }
      } else if (body.object === 'instagram') {
        // Instagram message
        for (const entry of body.entry || []) {
          for (const messaging of entry.messaging || []) {
            if (messaging.message) {
              await handleIncomingMessage({
                channel: 'INSTAGRAM',
                senderId: messaging.sender.id,
                threadId: messaging.sender.id,
                text: messaging.message.text || '',
                timestamp: new Date(messaging.timestamp),
                rawPayload: messaging,
              });
            }
          }
        }
      }

      return reply.send({ status: 'ok' });
    } catch (error) {
      fastify.log.error(error, 'Error processing webhook');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
