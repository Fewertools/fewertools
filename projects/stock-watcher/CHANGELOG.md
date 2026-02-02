# Changelog

## v0.2.0 - Feature Complete (2026-02-01)

### Added

**Pages**
- Stock detail page (`/stock/[symbol]`) with full analysis
- Stock screener (`/screener`) with 5 preset filters
- Portfolio tracker (`/portfolio`) with P&L
- Settings page (`/settings`) for API keys and preferences

**Components**
- Mobile navigation (bottom bar)
- Desktop navigation (header links)
- Search bar with ⌘K shortcut
- Alert banner for buy zone notifications
- Price chart with target lines
- Sparkline charts for tables

**API Endpoints**
- `GET /api/suggestions` - AI-powered stock picks
- `POST /api/alerts/check` - Check watchlist prices
- Stock search endpoint

**Core Features**
- G.R.O.W. scoring system (0-100)
- Preset screener criteria
- Buy zone detection
- Portfolio allocation tracking

**Infrastructure**
- Supabase schema with RLS
- Custom hooks for state
- Alert checking script
- Pre-populated watchlist

### Technical

- Build passes with all routes
- TypeScript strict mode
- Next.js 16 compatibility

---

## v0.1.0 - Initial Skeleton (2026-02-01)

### Added
- Basic dashboard UI
- Stock card components
- Financial Modeling Prep API integration
- G.R.O.W. scoring logic
- Watchlist table
- Market overview widget
