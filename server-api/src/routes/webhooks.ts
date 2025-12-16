import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { config } from '../config/index.js';
import { handleIncomingMessage } from '../modules/channels/handler.js';

// Verify Meta webhook signature using HMAC-SHA256
function verifyMetaSignature(payload: string, signature: string | undefined, appSecret: string): boolean {
  if (!signature || !appSecret) {
    return false;
  }

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

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
  // Includes signature verification to prevent spoofed requests
  fastify.post('/meta', {
    config: {
      rawBody: true // Required for signature verification
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const signature = request.headers['x-hub-signature-256'] as string | undefined;
    const rawBody = (request as any).rawBody || JSON.stringify(request.body);
    
    // Verify signature with app secret (use Instagram app secret as it's shared for Meta webhooks)
    const appSecret = config.instagram.appSecret;
    
    if (!verifyMetaSignature(rawBody, signature, appSecret)) {
      fastify.log.warn('Invalid webhook signature - request rejected');
      return reply.status(403).send({ error: 'Invalid signature' });
    }

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
