# ⚽ Betting Analyzer — Value Bet Finder

*Your C.A.S.H. system, automated. Find mispriced bets before the market corrects.*

---

## What This Is

A Python tool that:
1. **Fetches** upcoming football fixtures and live odds from 15+ bookmakers
2. **Models** true probabilities using Poisson goal distribution
3. **Compares** your model's prices to the market
4. **Identifies** value bets where the edge is 5%+
5. **Calculates** optimal stake sizes using Quarter Kelly
6. **Tracks** your results and builds your edge over time

Not a prediction system. A **value identification** system. Big difference.

---

## Quick Start (10 minutes)

### Step 1: Get Your API Keys (free)
1. **The Odds API** (bookmaker odds): https://the-odds-api.com/ → Free tier = 500 requests/month
2. **Football-Data.org** (team stats): https://www.football-data.org/ → Free tier = 10 calls/min

### Step 2: Install Dependencies
```bash
cd ~/clawd/drafts/betting-analyzer
pip install -r requirements.txt
```

### Step 3: Configure
```bash
cp config.example.json config.json
# Edit config.json with your API keys
```

### Step 4: Run
```bash
# Find today's value bets
python analyzer.py scan

# Analyze a specific match
python analyzer.py match "Arsenal" "Chelsea"

# View your betting history
python analyzer.py history

# Update team stats cache
python analyzer.py update-stats
```

### Step 5: Open Dashboard
```bash
open dashboard/index.html
```

---

## Files

| File | Purpose |
|------|---------|
| `analyzer.py` | Main CLI — scan, analyze, track |
| `models/poisson.py` | Poisson goal probability model |
| `models/value_finder.py` | Value bet identification + Kelly staking |
| `data/team_stats.json` | Cached team statistics (auto-updated) |
| `data/bet_history.json` | Your bet tracking log |
| `dashboard/index.html` | Visual dashboard for analysis |
| `config.json` | Your API keys and preferences |
| `METHODOLOGY.md` | How the math works (worth reading) |

---

## Leagues Covered

### The Odds API (odds from 15+ bookmakers)
- 🏴 Premier League
- 🇪🇸 La Liga
- 🇮🇹 Serie A
- 🇩🇪 Bundesliga
- 🇫🇷 Ligue 1
- 🏆 Champions League
- 🏆 Europa League

### Football-Data.org (team statistics)
- Same leagues + Championship, Eredivisie, Primeira Liga

---

## How It Works

1. **Fetch fixtures** for the next 7 days
2. **Pull odds** from William Hill, Bet365, Betfair, Pinnacle, etc.
3. **Calculate true probabilities** using Poisson goal model with:
   - Home/away attack & defense strength
   - League average goals
   - Form adjustment (last 5 matches)
4. **Compare model price vs market price** for each outcome
5. **Flag value bets** where edge > 5%
6. **Calculate Kelly stake** (Quarter Kelly for safety)
7. **Output** clean analysis with confidence levels

See `METHODOLOGY.md` for the full mathematical breakdown.

---

## Example Output

```
╔══════════════════════════════════════════════════════════╗
║  ⚽ VALUE BET FOUND                                     ║
╠══════════════════════════════════════════════════════════╣
║  Arsenal vs Chelsea — Premier League                    ║
║  Sat 8 Feb, 15:00 GMT                                  ║
║                                                         ║
║  Market: Draw @ 3.60 (implied: 27.8%)                  ║
║  Model:  Draw = 34.2%                                  ║
║  Edge:   +6.4%  ✅                                      ║
║                                                         ║
║  Stake:  2.1 units (Quarter Kelly)                      ║
║  Confidence: MEDIUM                                     ║
║                                                         ║
║  Bookmaker: Pinnacle (best odds)                        ║
╚══════════════════════════════════════════════════════════╝
```

---

## What This Doesn't Do

- ❌ Predict winners (nobody can consistently)
- ❌ Guarantee profits (variance is real)
- ❌ Replace your judgment (it augments it)
- ❌ Work as a "system" without discipline

## What This Does Do

- ✅ Remove emotion from bet selection
- ✅ Identify mathematically mispriced odds
- ✅ Size your bets optimally
- ✅ Track everything automatically
- ✅ Give you an edge over casual bettors

---

## Cron Integration (Optional)

Ask Rihanna to set up a daily cron job that:
- Scans tomorrow's fixtures at 8 PM
- Sends value bets to Telegram
- Auto-tracks results

This turns it into a passive system.

---

*Built for your C.A.S.H. method. Designed to find edge, not confirm bias.*
