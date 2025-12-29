import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { register, login, verifyJWT } from '../modules/auth';
import { prisma } from '../lib/prisma';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/auth/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);
      const result = await register(body.email, body.password, body.fullName);
      return reply.status(201).send(result);
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return reply.status(409).send({ error: 'User already exists' });
      }
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Login
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      const result = await login(body.email, body.password);
      return reply.send(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Get current user (protected)
  fastify.get('/auth/me', { preHandler: verifyJWT }, async (request, reply) => {
    const user = (request as any).user;
    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
      settings: user.settings
    };
  });

  // Update settings (protected)
  fastify.patch('/auth/settings', { preHandler: verifyJWT }, async (request, reply) => {
    const user = (request as any).user;
    const updates = request.body as any;

    const settings = await prisma.settings.update({
      where: { user_id: user.id },
      data: updates
    });

    return settings;
  });
}
