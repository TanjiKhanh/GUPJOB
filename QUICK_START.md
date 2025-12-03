# GupJob Quick Reference

## 🚀 Start Development (Choose One)

### Windows - Automated
```powershell
cd scripts
.\setup-local.bat
```

### macOS/Linux - Automated
```bash
cd scripts && chmod +x setup-local.sh && ./setup-local.sh
```

### Manual (All Platforms)
```bash
# Terminal 1: Start containers
cd infra && docker-compose up -d

# Terminal 2: Setup and run service
cd services/auth
npm install && npm run prisma:generate && npm run prisma:dbpush
npm run start:dev
```

---

## 📍 Access Points

| Service | URL |
|---------|-----|
| **Health Check** | http://localhost:3000/health |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |

---

## 🛠️ Common Commands

```bash
# From services/auth directory

npm run start:dev        # Dev server (hot reload)
npm run build            # Compile TypeScript
npm run start            # Run compiled app
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Create migrations
npm run prisma:dbpush    # Push schema to DB
```

---

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker logs gupjob_postgres

# Remove volumes (wipe database)
docker-compose down -v
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Change `PORT=3001` in `.env` |
| DB connection fails | Check Docker: `docker ps` |
| Prisma missing | Run `npm run prisma:generate` |
| Dependencies not installed | Run `npm install` |

---

## 📁 Key Files

```
.env                    # Environment variables
tsconfig.json          # TypeScript config
package.json           # Dependencies and scripts
src/
├── main.ts           # Entry point
├── app.module.ts     # NestJS module
└── controllers/      # API endpoints
```

---

## 📚 Full Documentation

See `LOCAL_DEV_SETUP.md` for detailed setup instructions and troubleshooting.

---

**Status**: ✅ Ready to run on localhost
