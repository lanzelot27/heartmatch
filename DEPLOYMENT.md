# HeartMatch Deployment Guide

## Architecture Overview

This application consists of three main components:
1. **Frontend**: Next.js 16 application
2. **Backend**: NestJS API with Socket.IO WebSockets
3. **Database**: PostgreSQL with Prisma ORM

## Recommended Deployment Strategy

### Option 1: Recommended (Best Balance of Cost & Features)
- **Frontend**: Vercel (Free tier available, excellent Next.js support)
- **Backend**: Railway or Render (WebSocket support, reasonable pricing)
- **Database**: Supabase or Neon (Free tier PostgreSQL)

### Option 2: All-in-One Platform
- **Everything**: Railway (Frontend, Backend, Database) - Simplest setup
- **Everything**: Render (Frontend, Backend, Database) - Good free tier

### Option 3: Enterprise Scale
- **Frontend**: Vercel
- **Backend**: AWS ECS/Fargate or Google Cloud Run
- **Database**: AWS RDS or Google Cloud SQL

---

## Prerequisites

Before deploying, ensure you have:

1. **Git Repository**: Your code pushed to GitHub/GitLab/Bitbucket
2. **Accounts**:
   - Vercel account (for frontend) - [vercel.com](https://vercel.com)
   - Railway account (for backend) - [railway.app](https://railway.app) OR
   - Render account (for backend) - [render.com](https://render.com)
   - Supabase account (for database) - [supabase.com](https://supabase.com) OR
   - Neon account (for database) - [neon.tech](https://neon.tech)
3. **Node.js**: Version 18+ (for local testing)
4. **PostgreSQL Client**: pgAdmin or DBeaver (optional, for database management)

---

## Step-by-Step Deployment

### Phase 1: Database Setup

#### Option A: Supabase (Recommended for Free Tier)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up/login
   - Click "New Project"
   - Choose a name and database password (save this!)
   - Select a region close to your users
   - Wait for project to be created (~2 minutes)

2. **Get Database Connection String**:
   - Go to Project Settings → Database
   - Copy the "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Run Migrations**:
   ```bash
   cd heartmatch-api
   # Set DATABASE_URL temporarily
   export DATABASE_URL="your-supabase-connection-string"
   # Or create .env file with DATABASE_URL
   npx prisma migrate deploy
   npx prisma generate
   ```

#### Option B: Neon (Alternative Free PostgreSQL)

1. **Create Neon Project**:
   - Go to [neon.tech](https://neon.tech)
   - Sign up/login
   - Click "Create Project"
   - Choose a name and region
   - Copy the connection string

2. **Run Migrations** (same as Supabase)

---

### Phase 2: Backend Deployment

#### Option A: Railway (Recommended)

1. **Connect Repository**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your HeartMatch repository
   - Choose the `heartmatch-api` directory as the root

2. **Configure Service**:
   - Railway will auto-detect NestJS
   - Set Root Directory to: `heartmatch-api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

3. **Add Environment Variables**:
   - In Railway dashboard, go to Variables tab
   - Add:
     ```
     DATABASE_URL=your-database-connection-string
     PORT=3001
     NODE_ENV=production
     ```
   - Railway will auto-generate a public URL (e.g., `https://your-app.up.railway.app`)

4. **Deploy**:
   - Railway will automatically deploy on every push to main branch
   - Check logs to ensure deployment succeeded

#### Option B: Render

1. **Create Web Service**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `heartmatch-api`
     - Root Directory: `heartmatch-api`
     - Environment: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run start:prod`

2. **Add Environment Variables**:
   - Go to Environment section
   - Add:
     ```
     DATABASE_URL=your-database-connection-string
     PORT=3001
     NODE_ENV=production
     ```

3. **Enable WebSockets**:
   - Render supports WebSockets by default
   - Your Socket.IO setup will work automatically

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy automatically

---

### Phase 3: Frontend Deployment (Vercel)

1. **Import Project**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Root Directory: `.` (root of repo)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables**:
   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.com
     ```
   - Replace with your actual backend URL from Railway/Render

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - You'll get a URL like: `https://heartmatch.vercel.app`

---

### Phase 4: Update Backend CORS

After deploying frontend, update backend CORS to allow your Vercel domain:

1. **Railway/Render Environment Variables**:
   Add:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

2. **Rebuild backend** (should happen automatically if CORS is configured via env vars)

---

## Environment Variables Reference

### Frontend (.env.local or Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Railway/Render)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Backend API responds at `/profiles` endpoint
- [ ] Frontend loads and displays correctly
- [ ] WebSocket connection works (test chat functionality)
- [ ] CORS allows frontend domain
- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled (should be automatic)
- [ ] Test user registration/login
- [ ] Test matching functionality
- [ ] Test real-time chat

---

## Troubleshooting

### Backend Issues

**Problem**: CORS errors
- **Solution**: Ensure `FRONTEND_URL` is set correctly in backend env vars

**Problem**: Database connection errors
- **Solution**: Verify `DATABASE_URL` is correct and database is accessible

**Problem**: WebSocket not connecting
- **Solution**: Ensure backend platform supports WebSockets (Railway/Render do)

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel

**Problem**: Build errors
- **Solution**: Check Vercel build logs for specific errors

### Database Issues

**Problem**: Migrations failing
- **Solution**: Run `npx prisma migrate deploy` locally with production DATABASE_URL first

---

## Cost Estimates (Monthly)

### Free Tier Option:
- Vercel: Free (Hobby plan)
- Railway: $5/month (after free trial) OR Render: Free (with limitations)
- Supabase: Free (up to 500MB database)
- **Total**: ~$5/month

### Paid Option (Better Performance):
- Vercel: Free (Hobby plan)
- Railway: $20/month (Pro plan)
- Supabase: $25/month (Pro plan)
- **Total**: ~$45/month

---

## Alternative: Docker Deployment

If you prefer Docker, see `Dockerfile` in `heartmatch-api/` directory. You can deploy Docker containers to:
- Railway (supports Docker)
- Render (supports Docker)
- AWS ECS/Fargate
- Google Cloud Run
- DigitalOcean App Platform

---

## Security Considerations

1. **Never commit `.env` files** - Use platform environment variables
2. **Use HTTPS** - All platforms provide this automatically
3. **Database credentials** - Keep secure, rotate regularly
4. **CORS** - Only allow your frontend domain
5. **Rate limiting** - Consider adding rate limiting to backend (future enhancement)

---

## Next Steps

After successful deployment:
1. Set up custom domains (optional)
2. Configure analytics (Vercel Analytics is built-in)
3. Set up monitoring (consider Sentry for error tracking)
4. Configure CI/CD (already done if using GitHub)
5. Set up database backups (Supabase/Neon handle this automatically)

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

