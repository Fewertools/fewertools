# Sprint Mode — Ship in 15 Minutes ⚡

No database. No auth. Just a working product live on the internet.

---

## Step 1: Get Your FMP API Key (2 minutes)

1. Go to: https://financialmodelingprep.com/developer/docs/
2. Click **"Get your Free API Key"**
3. Sign up (email + password)
4. Copy your API key from the dashboard

**Save it somewhere — you'll need it in Step 3.**

Free tier: 250 requests/day. Enough to launch and validate.

---

## Step 2: Verify the Project (1 minute)

Open Terminal and run:

```bash
cd ~/clawd/projects/stock-watcher
npm run build
```

**Expected:** Build completes with no errors.

If errors, run `npm install` first, then try again.

---

## Step 3: Create Your Environment File (1 minute)

```bash
cd ~/clawd/projects/stock-watcher
cat > .env.local << 'EOF'
# Financial Modeling Prep API Key
FMP_API_KEY=YOUR_KEY_HERE

# Admin key for viewing newsletter signups
ADMIN_API_KEY=stockwatcher-admin-2026

# Supabase (leave empty for Sprint Mode)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
EOF
```

**Now edit it:**

```bash
nano .env.local
```

Replace `YOUR_KEY_HERE` with your actual FMP API key.

Save: `Ctrl+X`, then `Y`, then `Enter`

---

## Step 4: Test Locally (2 minutes)

```bash
npm run dev
```

Open http://localhost:3000

**Check:**
- [ ] Dashboard loads
- [ ] Market indices show data
- [ ] Search works (try "AAPL")
- [ ] Stock detail page loads

If all good, stop the server: `Ctrl+C`

---

## Step 5: Deploy to Vercel (5 minutes)

### Option A: If you have Vercel CLI

```bash
# Install if needed
npm i -g vercel

# Deploy
cd ~/clawd/projects/stock-watcher
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: stock-watcher
# - Directory: ./
# - Override settings? No
```

After deploy, Vercel will give you a URL like `stock-watcher-xxx.vercel.app`

### Option B: Through Vercel Dashboard

1. Go to https://vercel.com/new
2. Import Git Repository → Choose your repo
3. Or: **Upload** → drag the `stock-watcher` folder
4. Environment Variables → Add these:
   - `FMP_API_KEY` = your key
   - `ADMIN_API_KEY` = `stockwatcher-admin-2026`
5. Click Deploy

---

## Step 6: Set Environment Variables in Vercel (2 minutes)

If you deployed via CLI, add env vars:

1. Go to https://vercel.com/dashboard
2. Click your project → Settings → Environment Variables
3. Add:
   - `FMP_API_KEY` = your actual key
   - `ADMIN_API_KEY` = `stockwatcher-admin-2026`
4. Click **Redeploy** (Deployments → ... → Redeploy)

---

## Step 7: Set Up Custom Domain (Optional, 2 minutes)

1. Vercel Dashboard → Your project → Settings → Domains
2. Add `stockwatcher.app` or your domain
3. Follow DNS instructions

Or just use the free `.vercel.app` domain for now.

---

## ✅ You're Live!

Your app is now accessible at your Vercel URL.

**What works in Sprint Mode:**
- ✅ Full dashboard
- ✅ Stock search and detail pages
- ✅ G.R.O.W. scoring
- ✅ Market overview
- ✅ Newsletter signup (stores in Supabase when added)

**What doesn't work yet:**
- ❌ User accounts / login
- ❌ Saved watchlists
- ❌ Portfolio tracking

These need Supabase. See `FULL-MODE.md` when ready.

---

## What's Next?

1. **Share the link** — Get it in front of people
2. **Collect feedback** — What's missing? What's confusing?
3. **Read `POST-LAUNCH.md`** — Marketing, monitoring, iteration

---

## Quick Commands Reference

```bash
# Local dev
cd ~/clawd/projects/stock-watcher && npm run dev

# Build check
npm run build

# Deploy to Vercel
vercel --prod

# View logs
vercel logs
```

---

*Shipped in 15 minutes. Not perfect, but live.* 🎯
