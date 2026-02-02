#!/usr/bin/env npx tsx

/**
 * Check Alerts Script
 * 
 * This script checks your watchlist against current prices and 
 * reports any stocks that are in their buy zones.
 * 
 * Usage:
 *   npx tsx scripts/check-alerts.ts
 * 
 * Can be called by Clawdbot cron to send Telegram alerts.
 */

import * as fs from 'fs'
import * as path from 'path'

interface WatchlistItem {
  symbol: string
  name: string
  targetPrice: number
  alertEnabled: boolean
}

interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changesPercentage: number
}

const FMP_API_KEY = process.env.FMP_API_KEY || ''
const WATCHLIST_FILE = path.join(process.cwd(), 'data', 'watchlist.json')

async function fetchQuotes(symbols: string[]): Promise<StockQuote[]> {
  if (!FMP_API_KEY) {
    console.error('FMP_API_KEY not set')
    return []
  }
  
  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${FMP_API_KEY}`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return []
  }
}

function loadWatchlist(): WatchlistItem[] {
  try {
    if (fs.existsSync(WATCHLIST_FILE)) {
      const data = fs.readFileSync(WATCHLIST_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading watchlist:', error)
  }
  return []
}

async function main() {
  console.log('🔍 Checking stock alerts...\n')
  
  const watchlist = loadWatchlist()
  
  if (watchlist.length === 0) {
    console.log('No stocks in watchlist.')
    console.log('Add stocks to data/watchlist.json')
    return
  }
  
  // Filter to enabled alerts
  const enabledItems = watchlist.filter(item => item.alertEnabled)
  console.log(`Checking ${enabledItems.length} stocks...\n`)
  
  // Fetch current prices
  const symbols = enabledItems.map(item => item.symbol)
  const quotes = await fetchQuotes(symbols)
  
  if (quotes.length === 0) {
    console.log('Unable to fetch prices. Check your API key.')
    return
  }
  
  // Check each stock
  const buyZoneAlerts: string[] = []
  
  for (const item of enabledItems) {
    const quote = quotes.find(q => q.symbol === item.symbol.toUpperCase())
    if (!quote) continue
    
    const inBuyZone = quote.price <= item.targetPrice
    const percentFromTarget = ((quote.price - item.targetPrice) / item.targetPrice) * 100
    
    const status = inBuyZone ? '🟢 BUY ZONE' : '⚪'
    const arrow = quote.changesPercentage >= 0 ? '↑' : '↓'
    
    console.log(
      `${status} ${item.symbol}: $${quote.price.toFixed(2)} ` +
      `(${arrow}${Math.abs(quote.changesPercentage).toFixed(2)}%) ` +
      `| Target: $${item.targetPrice.toFixed(2)} ` +
      `(${percentFromTarget >= 0 ? '+' : ''}${percentFromTarget.toFixed(1)}%)`
    )
    
    if (inBuyZone) {
      buyZoneAlerts.push(
        `🎯 **${item.symbol}** is in buy zone!\n` +
        `   Price: $${quote.price.toFixed(2)} | Target: $${item.targetPrice.toFixed(2)}\n` +
        `   ${Math.abs(percentFromTarget).toFixed(1)}% below target`
      )
    }
  }
  
  console.log('')
  
  if (buyZoneAlerts.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📢 ALERTS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    buyZoneAlerts.forEach(alert => console.log(alert))
    
    // Output for Clawdbot to parse
    console.log('\n---ALERTS_JSON---')
    console.log(JSON.stringify({
      count: buyZoneAlerts.length,
      alerts: enabledItems
        .filter(item => {
          const quote = quotes.find(q => q.symbol === item.symbol.toUpperCase())
          return quote && quote.price <= item.targetPrice
        })
        .map(item => {
          const quote = quotes.find(q => q.symbol === item.symbol.toUpperCase())!
          return {
            symbol: item.symbol,
            name: item.name,
            currentPrice: quote.price,
            targetPrice: item.targetPrice,
            percentBelow: ((item.targetPrice - quote.price) / item.targetPrice) * 100,
          }
        })
    }))
  } else {
    console.log('✅ No stocks in buy zone right now.')
  }
}

main().catch(console.error)
