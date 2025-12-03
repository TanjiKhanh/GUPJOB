# GupJob - Local Development Guide

## Prerequisites

Before you start, ensure you have the following installed:
- **Node.js** (v18+)
- **npm** or **pnpm**
- **Docker** and **Docker Compose**
- **Git**

## Quick Start

### Option 1: Automated Setup (Windows)
```bash
cd scripts
.\setup-local.bat
```

### Option 2: Automated Setup (macOS/Linux)
```bash
cd scripts
chmod +x setup-local.sh
./setup-local.sh
```

### Option 3: Manual Setup

#### Step 1: Start Docker Containers
```bash
cd infra
docker-compose up -d
```

This will start:
- PostgreSQL (localhost:5432)
- Redis (localhost:6379)

#### Step 2: Verify Database Connection
```bash
# Check if PostgreSQL is running
docker ps

# You should see gupjob_postgres and gupjob_redis containers
```

#### Step 3: Setup Auth Service
```bash
cd services/auth

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push the database schema
npm run prisma:dbpush

# Start the development server
npm run start:dev
```

The auth service will be running at: `http://localhost:3000`

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Auth Service | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

## Troubleshooting

### Issue: "Cannot connect to PostgreSQL"
**Solution:**
```bash
# Check if Docker is running
docker ps

# Check PostgreSQL logs
docker logs gupjob_postgres

# Verify .env DATABASE_URL matches docker-compose.yml:
# Should be: postgresql://gupjob:gupjob_pass@localhost:5432/gupjob_dev?schema=public
```

### Issue: "ts-node-dev: command not found"
**Solution:**
```bash
# Reinstall dependencies
npm install

# Or use npm directly
npx ts-node-dev --respawn --transpile-only main.ts
```

### Issue: "Prisma client not generated"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Port 3000 already in use"
**Solution:**
Update the `PORT` variable in `.env`:
```
PORT=3001
```

## Database

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Username**: gupjob
- **Password**: gupjob_pass
- **Database**: gupjob_dev

### Run Migrations
```bash
npm run prisma:migrate
```

### View Database
```bash
# Using psql (if installed)
psql -U gupjob -h localhost -d gupjob_dev

# Or use PgAdmin, DBeaver, or other SQL client
```

## Health Check

To verify the service is running:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "auth",
  "timestamp": "2025-12-03T10:30:00.000Z"
}
```

## Available Scripts

### Auth Service
```bash
npm run start:dev      # Start development server with hot reload
npm run build          # Compile TypeScript to JavaScript
npm run start          # Run compiled JavaScript
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations interactively
npm run prisma:dbpush   # Push schema to database
```

## Project Structure

```
services/
├── auth/               # NestJS Authentication Service
│   ├── src/
│   │   ├── main.ts    # Entry point
│   │   ├── app.module.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── prisma/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   └── package.json
├── api-gateway/       # API Gateway (WIP)
├── user-service/      # User Service (WIP)
├── mentor-service/    # Mentor Service (WIP)
├── mentorship-service/# Mentorship Service (WIP)
├── notification-service/ # Notification Service (WIP)
└── verification-service/ # Verification Service (WIP)
```

## Environment Variables

### Auth Service (.env)
```env
DATABASE_URL="postgresql://gupjob:gupjob_pass@localhost:5432/gupjob_dev?schema=public"
JWT_SECRET=supersecret_dev_key
JWT_EXPIRATION=3600s
PORT=3000
NODE_ENV=development
```

## Next Steps

After setup:
1. Verify health endpoint: `http://localhost:3000/health`
2. Check database schema is created
3. Implement remaining services
4. Set up API Gateway

## Common Commands

```bash
# Start everything
cd services/auth && npm run start:dev

# View logs
docker logs gupjob_postgres

# Stop containers
docker-compose down

# Clean up (remove volumes)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

## Useful Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/docs/)

---

**Last Updated**: December 3, 2025
