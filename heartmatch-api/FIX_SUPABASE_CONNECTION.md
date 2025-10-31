# Quick Fix for Supabase Connection Error

## The Problem
You're getting: `Can't reach database server at db.oczpeuzcilkfmatomfda.supabase.co:5432`

This happens because:
- Port 5432 requires IP whitelisting
- You need to use Connection Pooling instead

---

## Quick Solution (2 minutes)

### Step 1: Get Connection Pooling URL from Supabase

1. Go to [supabase.com](https://supabase.com) → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection string** section
4. Find **Connection Pooling** tab
5. Select **Session mode**
6. Copy the **URI** format (it should have port **6543**, not 5432)

It should look like:
```
postgresql://postgres.oczpeuzcilkfmatomfda:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 2: Update Your .env File

Open `heartmatch-api/.env` and update `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres.oczpeuzcilkfmatomfda:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Replace**:
- `[YOUR_PASSWORD]` with your actual database password
- `[REGION]` with your region (e.g., `us-east-1`, `eu-west-1`, etc.)

### Step 3: Test Connection

```bash
cd heartmatch-api
npx prisma db pull
```

If this works, migrations will work too!

---

## Alternative: Whitelist Your IP (If you prefer direct connection)

If you want to keep using port 5432:

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Find **Connection Pooling** → **IP Allowlist**
3. Click **Add IP** or enable **"Allow all IPs"** (development only!)
4. Try migration again

**Note**: Connection Pooling (port 6543) is recommended - it's faster and doesn't require IP whitelisting.

---

## Still Not Working?

1. **Check password**: Make sure password in connection string matches Supabase
2. **URL encode special characters**: If password has `@`, `#`, `&`, etc., encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `&` → `%26`
3. **Verify project is active**: Check Supabase dashboard that project isn't paused
4. **Try regenerating password**: Supabase Dashboard → Settings → Database → Reset database password

---

## Need Help?

Check `SUPABASE_CONNECTION_TROUBLESHOOTING.md` for detailed troubleshooting.

