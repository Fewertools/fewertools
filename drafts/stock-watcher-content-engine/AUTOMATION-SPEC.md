# Automation Spec — Stock Watcher Content Engine

*How to make content creation run on autopilot.*

---

## Overview

The content engine can be fully automated using:
1. **FMP API** — Real stock data and financials
2. **Clawdbot/Claude** — Content generation
3. **bird CLI** — Twitter posting
4. **Cron jobs** — Scheduled execution

After setup, you'll get daily content without lifting a finger.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Daily Content Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  6:00 AM    ┌─────────────┐    Fetch fresh data from FMP    │
│             │  Data Pull  │                                  │
│             └──────┬──────┘                                  │
│                    │                                         │
│  6:30 AM    ┌──────▼──────┐    Generate G.R.O.W. scores     │
│             │   Scoring   │    for watchlist stocks          │
│             └──────┬──────┘                                  │
│                    │                                         │
│  7:00 AM    ┌──────▼──────┐    AI generates today's tweets   │
│             │  Generate   │    based on score changes        │
│             └──────┬──────┘                                  │
│                    │                                         │
│  9:00 AM    ┌──────▼──────┐    Post first tweet             │
│             │    Post     │                                  │
│             └─────────────┘                                  │
│                                                              │
│  12:00 PM   Post thread (if scheduled)                       │
│                                                              │
│  11:00 PM   Log performance, adjust strategy                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

1. **FMP API Key** — https://financialmodelingprep.com/developer/docs/
   - Free tier: 250 requests/day (enough for this)
   - Paid tier: More requests, real-time data

2. **Twitter Account** — @StockWatcherApp or @GROWscore
   - bird CLI configured with credentials
   - See TOOLS.md for auth setup

3. **Clawdbot** — Already running (you're here!)

---

## Cron Jobs to Create

### 1. Daily Content Generation (6:30 AM)

```
Job ID: stock-content-generate
Schedule: 0 6 30 * * *
Text: |
  Generate today's Stock Watcher Twitter content.
  
  1. Check /Users/clinton/clawd/drafts/stock-watcher-content-engine/content-queue.json
  2. Fetch current prices/data for top watchlist stocks using FMP API
  3. Calculate any G.R.O.W. score changes from yesterday
  4. Generate 1 quick take tweet using the templates in TWITTER-PLAYBOOK.md
  5. If it's Tuesday or Friday, draft a thread
  6. Save to /Users/clinton/clawd/drafts/stock-watcher-content-engine/daily-content/YYYY-MM-DD.md
  7. Flag for review or auto-post based on settings
```

### 2. Morning Tweet Post (9:00 AM)

```
Job ID: stock-content-post-am
Schedule: 0 9 0 * * 1-5
Text: |
  Post today's Stock Watcher morning tweet.
  
  1. Read /Users/clinton/clawd/drafts/stock-watcher-content-engine/daily-content/YYYY-MM-DD.md
  2. Post the quick take tweet via bird CLI to @StockWatcherApp
  3. Log the tweet ID to content-log.json
```

### 3. Thread Post (12:00 PM, Tue/Fri only)

```
Job ID: stock-content-post-thread
Schedule: 0 12 0 * * 2,5
Text: |
  Post today's Stock Watcher thread.
  
  1. Check if a thread is scheduled in today's content file
  2. Post as thread via bird CLI
  3. Log to content-log.json
```

### 4. Weekly Roundup (Monday 9:00 AM)

```
Job ID: stock-content-weekly
Schedule: 0 9 0 * * 1
Text: |
  Generate and post the weekly G.R.O.W. roundup.
  
  1. Review content-log.json for last week's scores
  2. Compile score changes, biggest movers
  3. Generate weekly roundup tweet
  4. Post via bird CLI
```

### 5. Performance Analysis (Sunday 10:00 PM)

```
Job ID: stock-content-analyze
Schedule: 0 22 0 * * 0
Text: |
  Analyze Stock Watcher content performance.
  
  1. Fetch engagement data via bird CLI for logged tweets
  2. Identify top performing content types
  3. Update content-insights.json with learnings
  4. Suggest adjustments for next week
```

---

## File Structure

```
/drafts/stock-watcher-content-engine/
├── README.md
├── CONTENT-STRATEGY.md
├── TWITTER-PLAYBOOK.md
├── AUTOMATION-SPEC.md
├── analysis-prompts.md
├── first-2-weeks-content.md
│
├── config/
│   ├── watchlist.json         # Stocks to track
│   ├── scores-cache.json      # Latest G.R.O.W. scores
│   └── settings.json          # Auto-post on/off, account config
│
├── daily-content/
│   ├── 2026-02-03.md         # Each day's generated content
│   ├── 2026-02-04.md
│   └── ...
│
└── logs/
    ├── content-log.json       # Posted tweets + IDs
    ├── content-insights.json  # Performance learnings
    └── errors.log             # Any failures
```

---

## Config Files

### watchlist.json
```json
{
  "stocks": [
    "NVDA", "MSFT", "AAPL", "GOOG", "AMZN",
    "META", "NFLX", "TSLA", "COST", "CRM"
  ],
  "rotationSchedule": {
    "monday": ["NVDA", "MSFT"],
    "tuesday": "thread",
    "wednesday": ["GOOG", "AMZN"],
    "thursday": "educational",
    "friday": "thread"
  }
}
```

### settings.json
```json
{
  "twitterAccount": "@StockWatcherApp",
  "autoPost": false,
  "requireReview": true,
  "notifyOnGenerate": true,
  "fmpApiKey": "${FMP_API_KEY}"
}
```

---

## Implementation Steps

### Phase 1: Manual with AI Assist (Week 1-2)
1. Create config files
2. Set up cron job for content generation only
3. Review generated content each morning
4. Post manually via bird CLI
5. Track what works

### Phase 2: Semi-Automated (Week 3-4)
1. Enable auto-post for quick takes
2. Keep threads as review-required
3. Monitor engagement
4. Refine prompts based on performance

### Phase 3: Full Automation (Week 5+)
1. Enable auto-post for all content types
2. Set up performance analysis cron
3. Let system learn and adapt
4. Check in weekly, not daily

---

## Safety Rails

### Content Review
- All content saved to file before posting
- `requireReview: true` holds for manual approval
- Never auto-post predictions or buy recommendations

### Rate Limiting
- Max 3 tweets per day automated
- No posting between 11 PM - 7 AM
- Cooldown after errors

### Error Handling
- Failed FMP requests → use cached data
- Failed posts → save to retry queue
- Log all errors for review

### Kill Switch
- Setting `autoPost: false` stops all automated posting
- Manual intervention always available

---

## bird CLI Commands Reference

### Post a tweet
```bash
source ~/.config/bird/stockwatcher.env
bird tweet "Your tweet text here"
```

### Post a thread
```bash
bird thread "Tweet 1

---

Tweet 2

---

Tweet 3"
```

### Check engagement
```bash
bird analytics --last 7d
```

---

## Data Sources

### FMP API Endpoints Used

```
# Company profile
GET /api/v3/profile/{symbol}

# Key metrics
GET /api/v3/key-metrics/{symbol}

# Financial ratios
GET /api/v3/ratios/{symbol}

# Quote (current price)
GET /api/v3/quote/{symbol}

# Historical price
GET /api/v3/historical-price-full/{symbol}
```

### G.R.O.W. Score Calculation

The Stock Watcher app already has this in `src/lib/screener.ts`. 

For the content engine, we can:
1. Call the Stock Watcher API (if deployed)
2. Or replicate the scoring logic in the generation prompt

---

## Example Generated Content

### Input (from FMP + scores cache):
```json
{
  "symbol": "NVDA",
  "price": 875.50,
  "priceChange": -2.3,
  "growScore": 87,
  "previousScore": 87,
  "components": {
    "growthMoat": 95,
    "revenueQuality": 88,
    "ownerOperator": 85,
    "valuationWisdom": 78
  }
}
```

### Output (generated tweet):
```
NVDA G.R.O.W. score: 87/100 (unchanged)

🏰 Growth Moat: 95 (CUDA moat intact)
📈 Revenue Quality: 88 (data center strong)
🤝 Owner-Operator: 85 (Jensen aligned)
💰 Valuation: 78 (full price, not crazy)

Down 2.3% today. Score unchanged. Noise vs signal.
```

---

## Monitoring

### Daily Check (automated)
- Content generated successfully?
- Content posted successfully?
- Any errors logged?

### Weekly Review (manual, 15 min)
- Which tweets performed best?
- Any negative feedback?
- Score accuracy check
- Prompt refinements needed?

### Monthly Review (manual, 30 min)
- Follower growth trend
- Traffic to Stock Watcher
- Conversion rate
- Strategy adjustments

---

*Start manual. Automate gradually. The system should earn your trust before running unsupervised.*
