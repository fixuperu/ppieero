import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';
import { webhookRoutes } from './routes/webhooks.js';
import { adminRoutes } from './routes/admin.js';
import { authRoutes } from './routes/auth.js';

const fastify = Fastify({
  logger: logger,
});

async function start() {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    });

    // Register routes
    await fastify.register(authRoutes);
    await fastify.register(webhookRoutes, { prefix: '/webhooks' });
    await fastify.register(adminRoutes, { prefix: '/admin' });

    // Health check
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Start server
    await fastify.listen({ port: config.port, host: config.host });
    console.log(`🚀 Server running at http://${config.host}:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
