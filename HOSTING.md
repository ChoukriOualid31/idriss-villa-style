# Hosting Guide - Idriss Villa Style
## Backend (Render) + Frontend (Vercel) + PostgreSQL (Supabase)

Stack:
- Backend: Node.js + Express + Prisma
- Frontend: Next.js
- Database: PostgreSQL (local test first, then Supabase)

---

## 1. Architecture

- Vercel serves Next.js frontend
- Render runs Node/Express API
- Supabase provides managed PostgreSQL
- Prisma handles migrations and client generation

Flow:
1. User opens frontend on Vercel
2. Frontend calls Render API
3. Render API queries Supabase PostgreSQL through Prisma

---

## 2. Prerequisites

- GitHub repository ready
- Render account connected to GitHub
- Vercel account connected to GitHub
- Supabase project created
- Node.js 18+
- npm 9+

Check:
```bash
node -v
npm -v
git --version
```

---

## 3. Environment Variables

### 3.1 Backend local (`backend/.env`)

Use this for local PostgreSQL test:

```env
DATABASE_URL="postgresql://postgres:LOCAL_PASSWORD@localhost:5432/idrissvilla_db?schema=public"
DIRECT_URL="postgresql://postgres:LOCAL_PASSWORD@localhost:5432/idrissvilla_db?schema=public"

JWT_SECRET="replace-with-strong-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
ADMIN_EMAIL="admin@idrissvilla.com"
ADMIN_PASSWORD="admin123"
```

### 3.2 Backend production (Render)

Use Supabase URLs:

```env
DATABASE_URL="postgresql://postgres:PASSWORD@PROJECT_REF.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?schema=public"

JWT_SECRET="replace-with-strong-secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT=10000
FRONTEND_URL="https://your-frontend.vercel.app"
ADMIN_EMAIL="admin@idrissvilla.com"
ADMIN_PASSWORD="change-me"
```

### 3.3 Frontend production (Vercel)

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_APP_NAME=Idriss Villa Style
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

---

## 4. Step A - Validate Local PostgreSQL First

From `backend/`:

```bash
npx prisma validate
npx prisma migrate dev --name init_postgres
npx prisma generate
npm run prisma:seed
```

Expected:
- Prisma schema valid
- Migration created/applied
- Admin inserted in `users`
- Sample properties inserted in `properties`

Quick checks:
```bash
npx prisma studio
curl http://localhost:5000/health
```

---

## 5. Step B - Deploy Backend on Render

Create Render Web Service:
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

`npm run build` already runs:
- `npx prisma generate`
- `npx prisma migrate deploy`

Add environment variables from section 3.2.

After deploy:
```bash
curl https://your-backend.onrender.com/health
```

---

## 6. Step C - Deploy Frontend on Vercel

Create Vercel Project:
- Root Directory: `frontend`
- Framework: Next.js

Add variables from section 3.3, then deploy.

After deploy:
- Update `FRONTEND_URL` in Render to exact Vercel domain
- Redeploy backend if needed

---

## 7. Seed and Admin Account

Seed command:
```bash
cd backend
npm run prisma:seed
```

Behavior:
- Creates admin user from `ADMIN_EMAIL` + `ADMIN_PASSWORD`
- If admin already exists, updates password/role
- Upserts sample properties

---

## 8. Migration Commands (Production Safe)

Local development:
```bash
cd backend
npx prisma migrate dev --name your_change_name
```

CI/CD or production:
```bash
cd backend
npx prisma migrate deploy
```

Status:
```bash
npx prisma migrate status
```

---

## 9. Troubleshooting

`Environment variable not found: DIRECT_URL`
- Add `DIRECT_URL` in `backend/.env` and Render env vars.

`P1001 Can't reach database server`
- Verify Supabase host, password, port (6543 pooler / 5432 direct).

CORS blocked
- `FRONTEND_URL` must exactly match deployed frontend URL (no trailing slash mismatch).

Admin not inserted
- Run `npm run prisma:seed`
- Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in backend env.

---

## 10. Production Best Practices

- Never commit real credentials in repository.
- Use strong `JWT_SECRET` (64+ random chars).
- Use `DATABASE_URL` (pooler) for runtime and `DIRECT_URL` for migrations.
- Run migrations before application rollout.
- Backup Supabase before major schema changes.
- Rotate admin password after first seed.
- Monitor Render logs and Supabase query performance.

---

## 11. Go-Live Checklist

- Backend health endpoint returns 200
- Frontend loads without CORS errors
- Admin login works
- Properties API returns data
- Prisma migrations are up to date
- Secrets are stored only in platform env vars
