// Core stock data types

export interface Stock {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  logo?: string
}

export interface StockQuote extends Stock {
  open: number
  high: number
  low: number
  previousClose: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
}

export interface StockFundamentals {
  symbol: string
  pe: number | null
  forwardPe: number | null
  peg: number | null
  priceToBook: number | null
  priceToSales: number | null
  revenueGrowth: number | null
  earningsGrowth: number | null
  profitMargin: number | null
  operatingMargin: number | null
  returnOnEquity: number | null
  debtToEquity: number | null
  currentRatio: number | null
  freeCashFlow: number | null
  dividendYield: number | null
}

export interface WatchlistItem {
  id: string
  symbol: string
  name: string
  targetPrice: number
  fairValue: number | null
  notes: string
  alertEnabled: boolean
  addedAt: Date
  category: 'core' | 'growth' | 'speculative' | 'dividend'
}

export interface StockScreenerCriteria {
  minMarketCap?: number
  maxPe?: number
  minRevenueGrowth?: number
  minProfitMargin?: number
  maxDebtToEquity?: number
  minDividendYield?: number
  sectors?: string[]
}

export interface StockScore {
  symbol: string
  overall: number // 0-100
  growth: number
  quality: number
  valuation: number
  momentum: number
  signals: StockSignal[]
}

export interface StockSignal {
  type: 'bullish' | 'bearish' | 'neutral'
  category: 'price' | 'fundamental' | 'technical' | 'sentiment'
  message: string
  weight: number
}

export interface PortfolioHolding {
  symbol: string
  shares: number
  avgCost: number
  currentPrice: number
  value: number
  gain: number
  gainPercent: number
  allocation: number
}

export interface MarketOverview {
  sp500: { value: number; change: number }
  nasdaq: { value: number; change: number }
  dow: { value: number; change: number }
  vix: { value: number; change: number }
  fearGreedIndex: number // 0-100
}
