# Stock Watcher - Quick Setup

## 1. Get Your API Key (2 min)

Go to [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs/) and sign up for a free account. Copy your API key.

## 2. Configure Environment

```bash
cd ~/clawd/projects/stock-watcher
cp .env.example .env.local
```

Edit `.env.local` and add your key:
```
FMP_API_KEY=your_api_key_here
```

## 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. (Optional) Set Up Supabase

For persistent watchlist and alerts:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/schema.sql`
3. Copy your project URL and anon key to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 5. (Optional) Set Up Telegram Alerts

I can check your watchlist periodically and message you when stocks hit targets. Just let me know and I'll set up a cron job.

---

## What's Built

| Page | Description |
|------|-------------|
| `/` | Dashboard with market overview & suggestions |
| `/stock/NVDA` | Stock detail with G.R.O.W. score |
| `/screener` | Find stocks with preset filters |
| `/portfolio` | Track your holdings & P&L |
| `/settings` | Configure API keys & notifications |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stocks/AAPL` | Full stock data with score |
| `GET /api/suggestions` | Top AI-recommended picks |
| `POST /api/alerts/check` | Check watchlist for buy zones |

## Pre-Loaded Watchlist

Check `data/watchlist.json` - already has:
- NVDA (target: $825)
- MSFT (target: $400)
- GOOGL (target: $165)
- AAPL (target: $180)
- AMZN (target: $185)
- META (target: $550)
- AMD (target: $150)
- PLTR (target: $22)

Edit targets as needed!
