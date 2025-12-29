# OmniBooking Agent - Self-Hosting Guide

Esta guía explica cómo desplegar OmniBooking Agent en tu propio servidor VPS.

## Requisitos

- **VPS** con mínimo 1GB RAM, 1 vCPU
- **Docker** y **Docker Compose** instalados
- **Dominio** (opcional pero recomendado)
- **Git** instalado

## Despliegue Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/omnibooking-agent.git
cd omnibooking-agent
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
nano .env  # Editar con tus valores
```

**Variables importantes:**
- `DB_PASSWORD`: Contraseña segura para PostgreSQL
- `JWT_SECRET`: Clave secreta de mínimo 32 caracteres
- `WEBHOOK_VERIFY_TOKEN`: Token para verificar webhooks de Meta

### 3. Iniciar los Servicios

```bash
docker-compose up -d
```

Esto levantará:
- **PostgreSQL** en puerto 5432
- **API Backend** en puerto 3000
- **Frontend** en puerto 80

### 4. Verificar que Todo Funciona

```bash
# Ver logs
docker-compose logs -f

# Verificar salud del API
curl http://localhost:3000/health

# Ver el frontend
# Abre http://tu-servidor en el navegador
```

## Configuración Avanzada

### SSL con Let's Encrypt (Producción)

Para HTTPS en producción, agrega Traefik o Caddy como reverse proxy:

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=tu@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - letsencrypt:/letsencrypt

  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`tudominio.com`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"

volumes:
  letsencrypt:
```

### Backups de Base de Datos

```bash
# Backup manual
docker exec omnibooking-db pg_dump -U omnibooking omnibooking > backup.sql

# Restaurar
cat backup.sql | docker exec -i omnibooking-db psql -U omnibooking omnibooking
```

### Script de Backup Automático

```bash
#!/bin/bash
# backup.sh - Agregar a crontab
DATE=$(date +%Y%m%d_%H%M%S)
docker exec omnibooking-db pg_dump -U omnibooking omnibooking | gzip > /backups/omnibooking_$DATE.sql.gz
# Mantener solo últimos 7 días
find /backups -name "omnibooking_*.sql.gz" -mtime +7 -delete
```

## Estructura del Proyecto

```
omnibooking-agent/
├── server-api/           # Backend Fastify/Node.js
│   ├── prisma/           # Schema y migraciones
│   ├── src/              # Código fuente
│   └── Dockerfile
├── src/                  # Frontend React
├── docker-compose.yml    # Orquestación
├── Dockerfile.frontend   # Build del frontend
├── nginx.conf            # Configuración Nginx
└── .env.example          # Variables de entorno
```

## Comandos Útiles

```bash
# Reiniciar servicios
docker-compose restart

# Ver logs de un servicio específico
docker-compose logs -f api

# Ejecutar migraciones manualmente
docker-compose exec api npx prisma migrate deploy

# Acceder a la base de datos
docker-compose exec db psql -U omnibooking omnibooking

# Reconstruir después de cambios
docker-compose up -d --build

# Parar todo
docker-compose down

# Parar y eliminar volúmenes (¡BORRA DATOS!)
docker-compose down -v
```

## Configurar Webhooks de Meta

1. En tu [Meta Developer Dashboard](https://developers.facebook.com/)
2. Configura el Webhook URL: `https://tudominio.com/webhooks/meta`
3. Usa el `WEBHOOK_VERIFY_TOKEN` de tu `.env`
4. Suscribe a los eventos: `messages`, `messaging_postbacks`

## Monitoreo

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs en Tiempo Real
```bash
docker-compose logs -f --tail=100
```

## Solución de Problemas

### El frontend no carga
```bash
docker-compose logs frontend
# Verificar que nginx esté sirviendo los archivos correctamente
```

### Error de conexión a la base de datos
```bash
docker-compose logs db
# Verificar que el servicio db esté healthy
docker-compose ps
```

### Las migraciones fallan
```bash
docker-compose exec api npx prisma migrate status
docker-compose exec api npx prisma migrate deploy
```

## Actualizaciones

```bash
git pull origin main
docker-compose up -d --build
```

## Soporte

- Abre un issue en GitHub
- Revisa los logs: `docker-compose logs -f`
