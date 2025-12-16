# OmniBooking Agent - Backend API

Node.js/Fastify backend for the OmniBooking Agent system.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Logging**: Pino

## Setup

1. **Install dependencies**:
   ```bash
   cd server-api
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Setup database**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Webhooks
- `GET /webhooks/meta` - Meta webhook verification
- `POST /webhooks/meta` - Receive WhatsApp/Instagram messages

### Admin API (requires `x-admin-key` header)
- `GET /admin/clients` - List all clients
- `GET /admin/conversations` - List all conversations
- `GET /admin/conversations/:id/messages` - Get conversation messages
- `GET /admin/knowledge` - List knowledge base
- `POST /admin/knowledge` - Upsert knowledge item
- `DELETE /admin/knowledge/:key` - Delete knowledge item
- `GET /admin/handoffs` - List handoffs
- `PATCH /admin/handoffs/:id` - Update handoff status
- `GET /admin/appointments` - List appointment logs

### Health
- `GET /health` - Health check

## Architecture

```
src/
├── config/          # Configuration
├── lib/             # Shared utilities (logger, prisma)
├── modules/
│   ├── channels/    # Message handling
│   ├── conversationEngine/  # FSM & intent detection
│   └── integrations/        # WhatsApp, Instagram, SimplyBook
└── routes/          # API routes
```

## Deployment

Build and run:
```bash
npm run build
npm start
```

Recommended platforms: Railway, Render, Fly.io, or your own server.
