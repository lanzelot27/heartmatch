# Quick Deployment Checklist

## 🚀 Fast Track Deployment (Recommended Stack)

### 1. Database (5 minutes)
- [ ] Sign up at [Supabase](https://supabase.com) (free tier)
- [ ] Create new project
- [ ] Copy connection string from Settings → Database
- [ ] Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

### 2. Backend (10 minutes)
- [ ] Sign up at [Railway](https://railway.app) (free trial)
- [ ] Click "New Project" → "Deploy from GitHub"
- [ ] Select repo → Set root directory to `heartmatch-api`
- [ ] Add environment variables:
  ```
  DATABASE_URL=<your-supabase-connection-string>
  PORT=3001
  NODE_ENV=production
  FRONTEND_URL=https://your-app.vercel.app (add after frontend deploy)
  ```
- [ ] Deploy and copy the Railway URL

### 3. Frontend (5 minutes)
- [ ] Sign up at [Vercel](https://vercel.com) (free tier)
- [ ] Click "Add New Project" → Import GitHub repo
- [ ] Add environment variable:
  ```
  NEXT_PUBLIC_API_URL=<your-railway-backend-url>
  ```
- [ ] Deploy

### 4. Connect Everything (2 minutes)
- [ ] Update backend `FRONTEND_URL` with your Vercel URL
- [ ] Test the app!

---

## 📋 Environment Variables Cheat Sheet

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend (Railway/Render)
```env
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

---

## ✅ Post-Deployment Test

1. Visit your Vercel URL
2. Try registering a new user
3. Try logging in
4. Browse profiles (discovery page)
5. Like a profile
6. Check matches
7. Send a message in chat (tests WebSocket)

---

## 🆘 Common Issues

**CORS Error?**
→ Add your Vercel URL to backend `FRONTEND_URL` env var

**Database Error?**
→ Check `DATABASE_URL` is correct and database is accessible

**WebSocket Not Working?**
→ Railway/Render support WebSockets automatically, check backend logs

**Build Failing?**
→ Check platform logs for specific error messages

---

## 💰 Cost Breakdown

- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month (after free trial)
- **Supabase**: Free (up to 500MB)
- **Total**: ~$5/month

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

