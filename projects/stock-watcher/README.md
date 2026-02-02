# Stock Watcher 📈

AI-powered stock monitoring and investment suggestions based on the G.R.O.W. framework.

## Features

- **Smart Suggestions**: AI-analyzed stock picks with buy zone alerts
- **Watchlist**: Track your target stocks with custom price alerts
- **G.R.O.W. Scoring**: Growth, Revenue quality, Owner-operator, Valuation Wisdom
- **Market Overview**: Real-time indices and Fear & Greed sentiment
- **Telegram Alerts**: Get notified when stocks hit your target prices

## G.R.O.W. Framework

| Letter | Meaning | What We Look For |
|--------|---------|------------------|
| **G** | Growth | Revenue growth 15%+, expanding market |
| **R** | Revenue Quality | High margins, recurring revenue, ROE 15%+ |
| **O** | Owner-operator | Insider ownership, aligned incentives |
| **W** | Valuation Wisdom | PEG ≤ 1.5, reasonable P/E vs growth |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Get a free API key from [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs/) and add it to `.env.local`.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Data**: Financial Modeling Prep API
- **Database**: Supabase (optional, for persistence)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── StockCard.tsx      # Stock display card
│   ├── SuggestionCard.tsx # AI suggestion card
│   ├── WatchlistTable.tsx # Watchlist table
│   └── MarketOverview.tsx # Market indices
├── lib/
│   ├── api.ts             # Stock data API
│   ├── screener.ts        # G.R.O.W. scoring logic
│   └── utils.ts           # Utility functions
└── types/
    └── stock.ts           # TypeScript types
```

## Roadmap

- [x] Basic dashboard UI
- [x] G.R.O.W. scoring system
- [x] Stock cards & watchlist
- [ ] Real-time price updates
- [ ] Supabase integration
- [ ] Telegram bot alerts
- [ ] Portfolio tracking
- [ ] News sentiment analysis
- [ ] Earnings calendar
- [ ] Historical performance charts

## License

MIT
