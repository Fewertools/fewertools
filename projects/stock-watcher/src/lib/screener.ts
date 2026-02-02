// G.R.O.W. Stock Screener
// Growth moat, Revenue quality, Owner-operator, Valuation Wisdom

import { StockFundamentals, StockScore, StockSignal, StockScreenerCriteria } from '@/types/stock'

// Default quality criteria based on the G.R.O.W. framework
export const GROW_CRITERIA: StockScreenerCriteria = {
  minMarketCap: 10_000_000_000, // $10B minimum (large cap)
  maxPe: 40,
  minRevenueGrowth: 10, // 10%+
  minProfitMargin: 15, // 15%+
  maxDebtToEquity: 100, // Less than 1:1
}

export const GROWTH_CRITERIA: StockScreenerCriteria = {
  minMarketCap: 1_000_000_000, // $1B minimum
  maxPe: 80,
  minRevenueGrowth: 25, // 25%+
  minProfitMargin: 0, // Can be unprofitable
}

export const VALUE_CRITERIA: StockScreenerCriteria = {
  minMarketCap: 5_000_000_000,
  maxPe: 15,
  minProfitMargin: 10,
  maxDebtToEquity: 75,
}

export const DIVIDEND_CRITERIA: StockScreenerCriteria = {
  minMarketCap: 10_000_000_000,
  minDividendYield: 2.5,
  minProfitMargin: 15,
  maxDebtToEquity: 100,
}

/**
 * Score a stock based on the G.R.O.W. framework
 * Returns a score from 0-100
 */
export function scoreStock(fundamentals: StockFundamentals): StockScore {
  const signals: StockSignal[] = []
  
  // Growth score (0-25)
  let growth = 0
  if (fundamentals.revenueGrowth !== null) {
    if (fundamentals.revenueGrowth >= 25) {
      growth = 25
      signals.push({ type: 'bullish', category: 'fundamental', message: 'Strong revenue growth (25%+)', weight: 2 })
    } else if (fundamentals.revenueGrowth >= 15) {
      growth = 20
      signals.push({ type: 'bullish', category: 'fundamental', message: 'Good revenue growth (15%+)', weight: 1 })
    } else if (fundamentals.revenueGrowth >= 10) {
      growth = 15
    } else if (fundamentals.revenueGrowth >= 5) {
      growth = 10
    } else if (fundamentals.revenueGrowth >= 0) {
      growth = 5
    } else {
      signals.push({ type: 'bearish', category: 'fundamental', message: 'Revenue declining', weight: 2 })
    }
  }
  
  // Quality score (0-25)
  let quality = 0
  
  // Profit margin
  if (fundamentals.profitMargin !== null) {
    if (fundamentals.profitMargin >= 25) {
      quality += 10
      signals.push({ type: 'bullish', category: 'fundamental', message: 'Excellent profit margins (25%+)', weight: 2 })
    } else if (fundamentals.profitMargin >= 15) {
      quality += 7
    } else if (fundamentals.profitMargin >= 10) {
      quality += 4
    } else if (fundamentals.profitMargin < 0) {
      signals.push({ type: 'bearish', category: 'fundamental', message: 'Unprofitable', weight: 2 })
    }
  }
  
  // ROE
  if (fundamentals.returnOnEquity !== null) {
    if (fundamentals.returnOnEquity >= 20) {
      quality += 8
      signals.push({ type: 'bullish', category: 'fundamental', message: 'High return on equity (20%+)', weight: 1 })
    } else if (fundamentals.returnOnEquity >= 15) {
      quality += 5
    } else if (fundamentals.returnOnEquity >= 10) {
      quality += 3
    }
  }
  
  // Debt
  if (fundamentals.debtToEquity !== null) {
    if (fundamentals.debtToEquity <= 30) {
      quality += 7
      signals.push({ type: 'bullish', category: 'fundamental', message: 'Low debt (D/E < 0.3)', weight: 1 })
    } else if (fundamentals.debtToEquity <= 50) {
      quality += 5
    } else if (fundamentals.debtToEquity <= 100) {
      quality += 3
    } else if (fundamentals.debtToEquity > 150) {
      signals.push({ type: 'bearish', category: 'fundamental', message: 'High debt load', weight: 2 })
    }
  }
  
  // Valuation score (0-25)
  let valuation = 0
  
  if (fundamentals.pe !== null && fundamentals.pe > 0) {
    if (fundamentals.pe <= 15) {
      valuation += 12
      signals.push({ type: 'bullish', category: 'fundamental', message: 'Value P/E ratio (<15)', weight: 1 })
    } else if (fundamentals.pe <= 25) {
      valuation += 8
    } else if (fundamentals.pe <= 35) {
      valuation += 4
    } else if (fundamentals.pe > 50) {
      signals.push({ type: 'bearish', category: 'fundamental', message: 'Expensive P/E (>50)', weight: 1 })
    }
  }
  
  if (fundamentals.peg !== null && fundamentals.peg > 0) {
    if (fundamentals.peg <= 1) {
      valuation += 8
      signals.push({ type: 'bullish', category: 'fundamental', message: 'Attractive PEG ratio (≤1)', weight: 2 })
    } else if (fundamentals.peg <= 1.5) {
      valuation += 5
    } else if (fundamentals.peg <= 2) {
      valuation += 2
    }
  }
  
  if (fundamentals.priceToSales !== null) {
    if (fundamentals.priceToSales <= 3) {
      valuation += 5
    } else if (fundamentals.priceToSales <= 6) {
      valuation += 3
    } else if (fundamentals.priceToSales > 15) {
      signals.push({ type: 'bearish', category: 'fundamental', message: 'High price-to-sales (>15x)', weight: 1 })
    }
  }
  
  // Momentum score (0-25) - placeholder, will be based on price action
  let momentum = 12 // Default neutral
  
  const overall = growth + quality + valuation + momentum
  
  return {
    symbol: fundamentals.symbol,
    overall,
    growth,
    quality,
    valuation,
    momentum,
    signals
  }
}

/**
 * Check if a stock passes the screening criteria
 */
export function passesScreen(
  fundamentals: StockFundamentals,
  criteria: StockScreenerCriteria
): { passes: boolean; reasons: string[] } {
  const reasons: string[] = []
  let passes = true
  
  if (criteria.maxPe && fundamentals.pe !== null) {
    if (fundamentals.pe > criteria.maxPe) {
      passes = false
      reasons.push(`P/E ${fundamentals.pe.toFixed(1)} exceeds max ${criteria.maxPe}`)
    }
  }
  
  if (criteria.minRevenueGrowth && fundamentals.revenueGrowth !== null) {
    if (fundamentals.revenueGrowth < criteria.minRevenueGrowth) {
      passes = false
      reasons.push(`Revenue growth ${fundamentals.revenueGrowth.toFixed(1)}% below min ${criteria.minRevenueGrowth}%`)
    }
  }
  
  if (criteria.minProfitMargin && fundamentals.profitMargin !== null) {
    if (fundamentals.profitMargin < criteria.minProfitMargin) {
      passes = false
      reasons.push(`Profit margin ${fundamentals.profitMargin.toFixed(1)}% below min ${criteria.minProfitMargin}%`)
    }
  }
  
  if (criteria.maxDebtToEquity && fundamentals.debtToEquity !== null) {
    if (fundamentals.debtToEquity > criteria.maxDebtToEquity) {
      passes = false
      reasons.push(`Debt/Equity ${fundamentals.debtToEquity.toFixed(1)} exceeds max ${criteria.maxDebtToEquity}`)
    }
  }
  
  if (criteria.minDividendYield && fundamentals.dividendYield !== null) {
    if (fundamentals.dividendYield < criteria.minDividendYield) {
      passes = false
      reasons.push(`Dividend yield ${fundamentals.dividendYield.toFixed(2)}% below min ${criteria.minDividendYield}%`)
    }
  }
  
  return { passes, reasons }
}

/**
 * Get buy zone status
 */
export function getBuyZoneStatus(
  currentPrice: number,
  targetPrice: number,
  fairValue: number | null
): { status: 'buy' | 'hold' | 'overvalued'; percentFromTarget: number } {
  const percentFromTarget = ((currentPrice - targetPrice) / targetPrice) * 100
  
  if (currentPrice <= targetPrice) {
    return { status: 'buy', percentFromTarget }
  } else if (fairValue && currentPrice <= fairValue * 1.1) {
    return { status: 'hold', percentFromTarget }
  } else {
    return { status: 'overvalued', percentFromTarget }
  }
}
