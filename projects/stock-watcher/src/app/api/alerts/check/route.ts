import { NextRequest, NextResponse } from 'next/server'
import { fetchQuotes } from '@/lib/api'

// This endpoint is designed to be called by a cron job (e.g., Clawdbot)
// It checks watchlist prices and returns any that are in buy zones

interface WatchlistCheck {
  symbol: string
  targetPrice: number
  name?: string
}

interface AlertResult {
  symbol: string
  name: string
  currentPrice: number
  targetPrice: number
  percentBelow: number
  inBuyZone: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const watchlist: WatchlistCheck[] = body.watchlist || []
    
    if (watchlist.length === 0) {
      return NextResponse.json({ alerts: [], message: 'No watchlist items provided' })
    }
    
    // Fetch current prices
    const symbols = watchlist.map(w => w.symbol)
    const quotes = await fetchQuotes(symbols)
    
    if (!quotes || quotes.length === 0) {
      return NextResponse.json({ 
        alerts: [], 
        error: 'Unable to fetch current prices' 
      })
    }
    
    // Check each stock against target
    const alerts: AlertResult[] = []
    
    for (const item of watchlist) {
      const quote = quotes.find(q => q.symbol === item.symbol.toUpperCase())
      if (!quote) continue
      
      const percentBelow = ((item.targetPrice - quote.price) / item.targetPrice) * 100
      const inBuyZone = quote.price <= item.targetPrice
      
      alerts.push({
        symbol: quote.symbol,
        name: quote.name || item.name || quote.symbol,
        currentPrice: quote.price,
        targetPrice: item.targetPrice,
        percentBelow,
        inBuyZone,
      })
    }
    
    // Filter to only buy zone alerts
    const buyZoneAlerts = alerts.filter(a => a.inBuyZone)
    
    return NextResponse.json({
      alerts: buyZoneAlerts,
      allChecks: alerts,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error checking alerts:', error)
    return NextResponse.json(
      { error: 'Failed to check alerts' },
      { status: 500 }
    )
  }
}

// GET endpoint for simple price checks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbols = searchParams.get('symbols')?.split(',') || []
  const targets = searchParams.get('targets')?.split(',').map(Number) || []
  
  if (symbols.length === 0) {
    return NextResponse.json({ 
      error: 'Provide ?symbols=AAPL,MSFT&targets=180,400' 
    }, { status: 400 })
  }
  
  // Build watchlist from query params
  const watchlist = symbols.map((symbol, i) => ({
    symbol,
    targetPrice: targets[i] || 0,
  }))
  
  // Fetch and check
  const quotes = await fetchQuotes(symbols)
  
  const results = watchlist.map(item => {
    const quote = quotes.find(q => q.symbol === item.symbol.toUpperCase())
    if (!quote) return null
    
    const inBuyZone = item.targetPrice > 0 && quote.price <= item.targetPrice
    
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.changesPercentage,
      targetPrice: item.targetPrice || null,
      inBuyZone,
    }
  }).filter(Boolean)
  
  return NextResponse.json({ 
    stocks: results,
    checkedAt: new Date().toISOString(),
  })
}
