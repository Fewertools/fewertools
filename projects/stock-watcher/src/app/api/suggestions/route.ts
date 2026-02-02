import { NextRequest, NextResponse } from 'next/server'
import { fetchQuotes, fetchRatios, fetchKeyMetrics } from '@/lib/api'
import { scoreStock, GROW_CRITERIA, passesScreen } from '@/lib/screener'
import { StockFundamentals } from '@/types/stock'

// Top stocks to analyze for suggestions
const ANALYSIS_UNIVERSE = [
  // Tech Giants
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA',
  // AI & Cloud
  'CRM', 'SNOW', 'PLTR', 'AMD', 'AVGO', 'ORCL', 'IBM',
  // Financials
  'JPM', 'V', 'MA', 'BRK-B', 'GS', 'BAC',
  // Healthcare
  'UNH', 'JNJ', 'LLY', 'PFE', 'ABBV', 'MRK',
  // Consumer
  'WMT', 'COST', 'HD', 'NKE', 'SBUX', 'MCD',
  // Industrial
  'CAT', 'DE', 'HON', 'UNP', 'BA',
]

interface Suggestion {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  score: {
    overall: number
    growth: number
    quality: number
    valuation: number
    momentum: number
  }
  signals: { type: string; message: string }[]
  reasoning: string
  targetPrice: number
  fairValue: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get('limit') || '5')
  const category = searchParams.get('category') || 'grow' // grow, growth, value
  
  try {
    // Fetch quotes for all stocks
    const quotes = await fetchQuotes(ANALYSIS_UNIVERSE)
    
    if (!quotes || quotes.length === 0) {
      return NextResponse.json({ 
        suggestions: [],
        message: 'Unable to fetch stock data. Check your API key.'
      })
    }
    
    // Analyze each stock
    const suggestions: Suggestion[] = []
    
    for (const quote of quotes) {
      try {
        // Fetch fundamentals
        const [ratios, metrics] = await Promise.all([
          fetchRatios(quote.symbol),
          fetchKeyMetrics(quote.symbol),
        ])
        
        if (!ratios) continue
        
        // Build fundamentals object
        const fundamentals: StockFundamentals = {
          symbol: quote.symbol,
          pe: quote.pe || null,
          forwardPe: null,
          peg: ratios?.priceEarningsToGrowthRatio || null,
          priceToBook: ratios?.priceToBookRatio || null,
          priceToSales: ratios?.priceToSalesRatio || null,
          revenueGrowth: null,
          earningsGrowth: null,
          profitMargin: ratios?.netProfitMargin ? ratios.netProfitMargin * 100 : null,
          operatingMargin: ratios?.operatingProfitMargin ? ratios.operatingProfitMargin * 100 : null,
          returnOnEquity: ratios?.returnOnEquity ? ratios.returnOnEquity * 100 : null,
          debtToEquity: ratios?.debtEquityRatio ? ratios.debtEquityRatio * 100 : null,
          currentRatio: ratios?.currentRatio || null,
          freeCashFlow: metrics?.freeCashFlowPerShare || null,
          dividendYield: ratios?.dividendYield ? ratios.dividendYield * 100 : null,
        }
        
        // Check if passes screen
        const { passes } = passesScreen(fundamentals, GROW_CRITERIA)
        if (!passes && category === 'grow') continue
        
        // Calculate score
        const score = scoreStock(fundamentals)
        
        // Skip low scores
        if (score.overall < 50) continue
        
        // Calculate target price (10% below current for value entry)
        const targetPrice = quote.price * 0.9
        
        // Fair value estimate (simple DCF proxy using P/E and growth)
        const fairValue = quote.pe && quote.pe > 0 
          ? quote.price * (1 + (25 / quote.pe))
          : quote.price * 1.1
        
        // Generate reasoning
        const reasoning = generateReasoning(quote.symbol, quote.name, score, fundamentals)
        
        suggestions.push({
          symbol: quote.symbol,
          name: quote.name,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changesPercentage,
          marketCap: quote.marketCap,
          score: {
            overall: score.overall,
            growth: score.growth,
            quality: score.quality,
            valuation: score.valuation,
            momentum: score.momentum,
          },
          signals: score.signals.map(s => ({ type: s.type, message: s.message })),
          reasoning,
          targetPrice,
          fairValue,
        })
      } catch (err) {
        // Skip stocks that error
        console.error(`Error analyzing ${quote.symbol}:`, err)
        continue
      }
    }
    
    // Sort by score and return top N
    const topSuggestions = suggestions
      .sort((a, b) => b.score.overall - a.score.overall)
      .slice(0, limit)
    
    return NextResponse.json({
      suggestions: topSuggestions,
      analyzed: quotes.length,
      passed: suggestions.length,
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}

function generateReasoning(
  symbol: string, 
  name: string, 
  score: ReturnType<typeof scoreStock>,
  fundamentals: StockFundamentals
): string {
  const parts: string[] = []
  
  // Quality assessment
  if (score.quality >= 20) {
    parts.push(`${name} shows strong fundamentals with excellent quality metrics.`)
  } else if (score.quality >= 15) {
    parts.push(`${name} has solid fundamentals.`)
  }
  
  // Valuation
  if (score.valuation >= 18) {
    parts.push(`Currently trading at an attractive valuation.`)
  } else if (score.valuation >= 12) {
    parts.push(`Valuation is reasonable for the quality.`)
  } else {
    parts.push(`Premium valuation requires strong execution.`)
  }
  
  // Specific metrics
  if (fundamentals.profitMargin && fundamentals.profitMargin > 20) {
    parts.push(`High profit margins (${fundamentals.profitMargin.toFixed(1)}%) indicate pricing power.`)
  }
  
  if (fundamentals.returnOnEquity && fundamentals.returnOnEquity > 20) {
    parts.push(`Strong capital efficiency with ${fundamentals.returnOnEquity.toFixed(1)}% ROE.`)
  }
  
  if (fundamentals.debtToEquity && fundamentals.debtToEquity < 50) {
    parts.push(`Conservative balance sheet with low debt.`)
  }
  
  // Overall recommendation
  if (score.overall >= 75) {
    parts.push(`Consider building a position on pullbacks.`)
  } else if (score.overall >= 60) {
    parts.push(`Worth adding to watchlist for better entry.`)
  }
  
  return parts.join(' ')
}
