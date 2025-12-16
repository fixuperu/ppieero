import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import { prisma } from '../lib/prisma.js';

// Verify Supabase JWT token middleware
async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  
  try {
    // Create Supabase client and verify the token
    const supabase = createClient(config.supabase.url, config.supabase.jwtSecret, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }

    // Attach user to request for downstream use
    (request as any).user = user;
  } catch (error) {
    return reply.status(401).send({ error: 'Token verification failed' });
  }
}

export async function adminRoutes(fastify: FastifyInstance) {
  // Apply JWT verification to all routes
  fastify.addHook('preHandler', verifyJWT);

  // GET /admin/clients - List all clients
  fastify.get('/clients', async (request, reply) => {
    const clients = await prisma.client.findMany({
      orderBy: { created_at: 'desc' },
    });
    return clients;
  });

  // GET /admin/conversations - List all conversations
  fastify.get('/conversations', async (request, reply) => {
    const conversations = await prisma.conversation.findMany({
      include: { client: true },
      orderBy: { updated_at: 'desc' },
    });
    return conversations;
  });

  // GET /admin/conversations/:id/messages - Get messages for a conversation
  fastify.get('/conversations/:id/messages', async (request, reply) => {
    const { id } = request.params as { id: string };
    const messages = await prisma.message.findMany({
      where: { conversation_id: id },
      orderBy: { created_at: 'asc' },
    });
    return messages;
  });

  // GET /admin/knowledge - List knowledge base
  fastify.get('/knowledge', async (request, reply) => {
    const knowledge = await prisma.knowledgeBase.findMany({
      orderBy: { key: 'asc' },
    });
    return knowledge;
  });

  // POST /admin/knowledge - Upsert knowledge item
  fastify.post('/knowledge', async (request, reply) => {
    const { key, value } = request.body as { key: string; value: string };
    
    const item = await prisma.knowledgeBase.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return item;
  });

  // DELETE /admin/knowledge/:key - Delete knowledge item
  fastify.delete('/knowledge/:key', async (request, reply) => {
    const { key } = request.params as { key: string };
    await prisma.knowledgeBase.delete({ where: { key } });
    return { success: true };
  });

  // GET /admin/handoffs - List all handoffs
  fastify.get('/handoffs', async (request, reply) => {
    const handoffs = await prisma.handoff.findMany({
      include: { conversation: { include: { client: true } } },
      orderBy: { created_at: 'desc' },
    });
    return handoffs;
  });

  // PATCH /admin/handoffs/:id - Update handoff status
  fastify.patch('/handoffs/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: 'OPEN' | 'CLOSED' };
    
    const handoff = await prisma.handoff.update({
      where: { id },
      data: { status },
    });
    return handoff;
  });

  // GET /admin/appointments - List appointment logs
  fastify.get('/appointments', async (request, reply) => {
    const appointments = await prisma.appointmentLog.findMany({
      include: { client: true },
      orderBy: { start_at: 'desc' },
    });
    return appointments;
  });
}
