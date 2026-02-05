# Troubleshooting Guide 🔧

Quick fixes for common issues.

---

## Build Errors

### "Module not found"
```bash
cd ~/clawd/projects/stock-watcher
rm -rf node_modules .next
npm install
npm run build
```

### "TypeScript errors"
```bash
# Check which files have errors
npm run build 2>&1 | head -50
```

Usually a missing import or type issue. The error message tells you which file.

---

## API Issues

### "FMP API returns error"

**Check your key:**
```bash
curl "https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=YOUR_KEY"
```

Should return JSON with stock data. If it says "Invalid API KEY", you need to:
1. Log into FMP dashboard
2. Copy the key again
3. Check for trailing spaces

**Check rate limits:**
Free tier: 250 requests/day. If exceeded, wait until midnight UTC.

### "Stocks show no data"

1. Check browser DevTools → Network tab
2. Look for failed API requests
3. Usually means API key issue or rate limit

---

## Supabase Issues

### "Connection refused"

Check your URL format:
```
CORRECT: https://abcdefgh.supabase.co
WRONG:   https://abcdefgh.supabase.co/  (no trailing slash)
WRONG:   abcdefgh.supabase.co  (needs https://)
```

### "Permission denied" / "RLS error"

Row Level Security is blocking access. Make sure you ran the full schema:

1. Supabase → SQL Editor
2. Paste contents of `supabase/schema.sql`
3. Run

### "Table doesn't exist"

Schema wasn't applied. Go to SQL Editor and run the schema again.

---

## Vercel Issues

### "Environment variable not found"

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Check each variable exists
3. After adding/changing: **Redeploy** (Deployments → ... → Redeploy)

Variables only take effect after redeploy.

### "Build failed on Vercel"

```bash
# Check build logs
vercel logs

# Or in dashboard: Deployments → Failed deployment → View logs
```

Common causes:
- Missing env variable
- Different Node version (check `package.json` for engines)

### "500 Error in production"

```bash
# View runtime logs
vercel logs --follow
```

Usually API key issue or Supabase connection problem.

---

## Local Development Issues

### "Port 3000 in use"

```bash
# Kill whatever's using it
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### "Changes not showing"

```bash
# Hard refresh in browser
Cmd+Shift+R

# Or restart dev server
Ctrl+C
npm run dev
```

---

## Data Issues

### "Stock search returns nothing"

FMP search API has quirks. Try:
- Full company name: "Apple" not "AAPL"
- Wait a second between searches
- Check you haven't hit rate limit

### "G.R.O.W. score shows wrong"

The score algorithm is in `src/lib/screener.ts`. Check:
- API returning all required fields
- Company has enough data (some small caps lack fundamentals)

---

## Quick Health Check

Run all of these to verify everything works:

```bash
# 1. Code builds
cd ~/clawd/projects/stock-watcher
npm run build

# 2. FMP API works
curl "https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=YOUR_KEY"

# 3. Local server starts
npm run dev
# Then visit http://localhost:3000

# 4. Vercel deployment is current
vercel ls
```

---

## Still Stuck?

1. Check Vercel logs: `vercel logs`
2. Check browser console: DevTools → Console
3. Check network requests: DevTools → Network
4. Search the error message

Most issues are:
- Missing or wrong env variables
- API key problems
- Rate limits

---

*Fix fast, ship faster.* 🔧
