# Pre-Deploy Checklist ✅

Run through this before deploying. 5 minutes max.

---

## Code Check

```bash
cd ~/clawd/projects/stock-watcher

# Clean install
rm -rf node_modules .next
npm install

# Build test
npm run build
```

**Expected:** Build completes with no errors.

---

## Environment Variables

Check `.env.local` has all required values:

```bash
cat .env.local | grep -E "^[A-Z]"
```

**Required for Sprint Mode:**
- [ ] `FMP_API_KEY` — Not empty, not "YOUR_KEY_HERE"

**Required for Full Mode:**
- [ ] `FMP_API_KEY` — Your Financial Modeling Prep key
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Starts with `https://`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Starts with `eyJ`
- [ ] `SUPABASE_SERVICE_KEY` — Starts with `eyJ`
- [ ] `ADMIN_API_KEY` — Any secure string

---

## API Test

### Test FMP Key

```bash
# Replace YOUR_KEY with your actual FMP API key
curl "https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=YOUR_KEY"
```

**Expected:** JSON with Apple stock data, not an error message.

### Test Supabase Connection (Full Mode)

```bash
# Start the app
npm run dev

# In browser, open DevTools Console
# Check for Supabase connection errors
```

---

## Local Test

```bash
npm run dev
```

Open http://localhost:3000

**Quick checks:**
- [ ] Page loads without blank screen
- [ ] No console errors (DevTools → Console)
- [ ] Search returns results for "AAPL"
- [ ] Stock detail page shows data
- [ ] Newsletter form appears on homepage

---

## Files Present

```bash
# Check key files exist
ls -la ~/clawd/projects/stock-watcher/.env.local
ls -la ~/clawd/projects/stock-watcher/package.json
ls -la ~/clawd/projects/stock-watcher/supabase/schema.sql
```

---

## Git Status (Optional)

If deploying from Git:

```bash
cd ~/clawd/projects/stock-watcher
git status

# Commit any changes
git add .
git commit -m "Pre-deploy prep"
```

---

## Ready to Deploy?

All checks passed? You're good.

- **Sprint Mode** → `SPRINT-MODE.md` Step 5
- **Full Mode** → `FULL-MODE.md` Step 7

---

## Common Issues

### "Build failed"
```bash
rm -rf node_modules .next
npm install
npm run build
```

### "API key invalid"
- Check for trailing spaces in `.env.local`
- Regenerate key at FMP dashboard

### "Supabase connection failed"
- Verify URL doesn't have trailing slash
- Check anon key is the PUBLIC one (not service role)

### "Page shows no data"
- Check browser console for errors
- Verify FMP API has remaining requests (250/day free)

---

*5 minutes. No surprises. Ship with confidence.* ✅
