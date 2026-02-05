# Full Mode — Production Launch in 30 Minutes 🏗️

Database, auth, user accounts, persistent watchlists. The real deal.

---

## Prerequisites

You need:
- [ ] FMP API key (Step 1)
- [ ] Supabase account (free)
- [ ] Vercel account (free)

---

## Step 1: Get Your FMP API Key (2 minutes)

1. Go to: https://financialmodelingprep.com/developer/docs/
2. Click **"Get your Free API Key"**
3. Sign up with email
4. Copy your API key

**Keep this open — you'll paste it later.**

---

## Step 2: Create Supabase Project (5 minutes)

### 2a. Create Project

1. Go to: https://supabase.com/dashboard
2. Sign up / Log in
3. Click **New Project**
4. Settings:
   - Organization: Create or select one
   - Project name: `stock-watcher`
   - Database Password: **Generate a strong one and SAVE IT**
   - Region: Choose closest to your users (London for UK)
5. Click **Create new project**

Wait ~2 minutes for setup.

### 2b. Get Your Keys

1. In your project, go to **Settings → API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGci...
service_role key: eyJhbGci... (keep secret!)
```

**Save all three somewhere safe.**

---

## Step 3: Set Up Database Schema (3 minutes)

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the ENTIRE contents of this file:

```bash
cat ~/clawd/projects/stock-watcher/supabase/schema.sql
```

4. Paste into Supabase SQL Editor
5. Click **Run** (or Cmd+Enter)

**Expected:** Success message, no errors.

This creates all tables: profiles, watchlist, alerts, portfolio, etc.

---

## Step 4: Configure Auth (2 minutes)

1. In Supabase, go to **Authentication → Providers**
2. Email is enabled by default (good)
3. Optional: Enable Google/GitHub OAuth:
   - Click provider → Enable → Add credentials

For now, Email is fine. Users can sign up with email/password.

---

## Step 5: Create Environment File (2 minutes)

```bash
cd ~/clawd/projects/stock-watcher
cat > .env.local << 'EOF'
# Financial Modeling Prep
FMP_API_KEY=YOUR_FMP_KEY

# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY

# Admin
ADMIN_API_KEY=stockwatcher-admin-2026
EOF
```

**Now fill in your values:**

```bash
nano .env.local
```

Replace each `YOUR_*` placeholder with actual values from Steps 1-2.

Save: `Ctrl+X` → `Y` → `Enter`

---

## Step 6: Test Locally (3 minutes)

```bash
cd ~/clawd/projects/stock-watcher
npm run dev
```

Open http://localhost:3000

**Test checklist:**
- [ ] Dashboard loads with market data
- [ ] Search works (try "NVDA")
- [ ] Stock detail page shows G.R.O.W. score
- [ ] Can click "Add to Watchlist"
- [ ] Newsletter signup form accepts email

Stop server: `Ctrl+C`

---

## Step 7: Deploy to Vercel (5 minutes)

### 7a. Install Vercel CLI (if needed)

```bash
npm i -g vercel
```

### 7b. Deploy

```bash
cd ~/clawd/projects/stock-watcher
vercel
```

Follow prompts:
- Set up and deploy? `Y`
- Which scope? Select your account
- Link to existing project? `N`
- Project name? `stock-watcher`
- Directory? `./`
- Override settings? `N`

### 7c. Add Environment Variables

```bash
# Add each variable
vercel env add FMP_API_KEY production
# Paste your key when prompted

vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add ADMIN_API_KEY production
```

### 7d. Deploy Production

```bash
vercel --prod
```

---

## Step 8: Verify Production (3 minutes)

Open your Vercel URL (e.g., `stock-watcher-xxx.vercel.app`)

**Full test:**
- [ ] Dashboard shows live market data
- [ ] Search returns real stocks
- [ ] G.R.O.W. scores calculate correctly
- [ ] Newsletter signup works

If anything fails, check Vercel logs:

```bash
vercel logs
```

---

## Step 9: Set Up Custom Domain (Optional, 3 minutes)

### If you own stockwatcher.app or similar:

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Add DNS records:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`
4. Wait for verification (usually <5 minutes)

### Or just use .vercel.app for now

The free domain works fine. Custom domain can come later.

---

## ✅ You're Live!

Full production deployment complete.

**What works:**
- ✅ Full dashboard with live data
- ✅ G.R.O.W. scoring algorithm
- ✅ Stock search and detail pages
- ✅ User signup/login (email)
- ✅ Persistent watchlists
- ✅ Newsletter collection
- ✅ Price alerts (when triggered)

---

## Optional: Set Up Alerts Cron Job

To check price alerts automatically:

1. Vercel Dashboard → Project → Settings → Cron Jobs
2. Add new cron:
   - Path: `/api/alerts/check`
   - Schedule: `0 */4 * * *` (every 4 hours)

Or use Clawdbot's cron to call the endpoint and notify via Telegram.

---

## Next Steps

1. **Read `POST-LAUNCH.md`** — Marketing, content, growth
2. **Set up Twitter** — Use the content engine in `/drafts/stock-watcher-content-engine/`
3. **Monitor Supabase** — Check newsletter signups in the dashboard

---

## Quick Reference

```bash
# Local development
cd ~/clawd/projects/stock-watcher && npm run dev

# Deploy update
vercel --prod

# View production logs
vercel logs --follow

# Check newsletter signups
curl -H "Authorization: Bearer stockwatcher-admin-2026" \
  https://your-app.vercel.app/api/newsletter

# Supabase dashboard
open https://supabase.com/dashboard
```

---

*30 minutes. Full product. Real users. Let's go.* 🎯
