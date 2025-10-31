# Supabase Connection Troubleshooting

## Error: Can't reach database server

This error typically occurs when:
1. Your IP address isn't whitelisted in Supabase
2. You're using the wrong connection string format
3. Connection pooling isn't configured correctly

---

## Solution 1: Whitelist Your IP Address (Recommended)

### Steps:

1. **Go to Supabase Dashboard**:
   - Visit [supabase.com](https://supabase.com)
   - Open your project

2. **Enable IP Allowlist**:
   - Go to **Settings** → **Database**
   - Scroll to **Connection Pooling** section
   - Find **Connection string** or **Database Settings**

3. **Add Your IP**:
   - Go to **Settings** → **Database** → **Connection Pooling**
   - Look for **IP Allowlist** or **Network Restrictions**
   - Click **Add IP** or **Allow all IPs** (for development only!)
   - For production, add specific IPs only

4. **For Development**: Enable "Allow all IPs" temporarily
   - ⚠️ **Warning**: Only do this for development/testing
   - For production, use specific IP allowlisting

---

## Solution 2: Use Connection Pooling URL

Supabase provides two types of connection strings:

### Direct Connection (Port 5432)
```
postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```
- **Issue**: Requires IP whitelisting
- **Use**: For migrations and direct connections

### Connection Pooling (Port 6543)
```
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
- **Better**: Works without IP whitelisting
- **Use**: For application connections (NestJS)

### Session Mode (Recommended for Prisma)
```
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```
- **Best**: Uses Supabase's connection pooler
- **Add**: `?pgbouncer=true` parameter

---

## Solution 3: Get Correct Connection String

### From Supabase Dashboard:

1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. You'll see multiple options:

   **URI Format** (recommended):
   ```
   postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

   **Connection Pooling - Session mode**:
   ```
   postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

4. **Copy the Session Mode connection string**
5. Add `?pgbouncer=true` if not already present

---

## Solution 4: Update Your .env File

Create or update `heartmatch-api/.env`:

```env
# Use Connection Pooling URL (Session Mode)
DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important**: Replace:
- `[PROJECT]` with your project reference
- `[PASSWORD]` with your database password
- `[REGION]` with your region (e.g., `us-east-1`)

---

## Solution 5: Test Connection Locally

### Test with psql (if installed):
```bash
psql "postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Test with Prisma:
```bash
cd heartmatch-api
npx prisma db pull
```

If this works, migrations should work too.

---

## Quick Fix Checklist

- [ ] Added your IP to Supabase allowlist (Settings → Database)
- [ ] Using Connection Pooling URL (port 6543, not 5432)
- [ ] Added `?pgbouncer=true` parameter
- [ ] Verified `.env` file exists in `heartmatch-api/` directory
- [ ] DATABASE_URL is correct format
- [ ] Database password is correct (no special characters issues)

---

## Common Issues

### Issue: "Connection refused"
**Fix**: Use port 6543 (pooler) instead of 5432 (direct)

### Issue: "Authentication failed"
**Fix**: Check password - Supabase passwords can have special characters that need URL encoding

### Issue: "Timeout"
**Fix**: 
- Check your internet connection
- Verify Supabase project is active
- Try using Connection Pooling URL

### Issue: Password has special characters
**Fix**: URL encode special characters in password:
- `@` becomes `%40`
- `#` becomes `%23`
- `&` becomes `%26`
- etc.

Or regenerate password in Supabase to use simpler characters.

---

## For Production Deployment

When deploying to Railway/Render:

1. **Use Direct Connection** (port 5432) for migrations:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

2. **Or use Connection Pooling** (port 6543) for application:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

3. **Whitelist Platform IPs**:
   - Railway: Check Railway docs for IP ranges
   - Render: Check Render docs for IP ranges
   - Or use "Allow all IPs" (less secure but easier)

---

## Still Having Issues?

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Verify Project**: Make sure project is active and not paused
3. **Check Logs**: Supabase dashboard → Logs → Database
4. **Try Different Connection**: Use the direct connection temporarily to test

---

## Example .env File

```env
# Supabase Connection Pooling (Session Mode) - Recommended
DATABASE_URL=postgresql://postgres.oczpeuzcilkfmatomfda:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# For migrations, you might need direct connection:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.oczpeuzcilkfmatomfda.supabase.co:5432/postgres
```

**Note**: Replace `YOUR_PASSWORD` with your actual database password.

