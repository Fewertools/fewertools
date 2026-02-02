import { NextRequest, NextResponse } from 'next/server'
import { fetchQuote, fetchProfile, fetchKeyMetrics, fetchRatios } from '@/lib/api'
import { scoreStock } from '@/lib/screener'
import { StockFundamentals } from '@/types/stock'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol: rawSymbol } = await params
  const symbol = rawSymbol.toUpperCase()
  
  try {
    // Fetch all data in parallel
    const [quote, profile, metrics, ratios] = await Promise.all([
      fetchQuote(symbol),
      fetchProfile(symbol),
      fetchKeyMetrics(symbol),
      fetchRatios(symbol),
    ])
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      )
    }
    
    // Build fundamentals object for scoring
    const fundamentals: StockFundamentals = {
      symbol,
      pe: quote.pe || null,
      forwardPe: null,
      peg: ratios?.priceEarningsToGrowthRatio || null,
      priceToBook: ratios?.priceToBookRatio || null,
      priceToSales: ratios?.priceToSalesRatio || null,
      revenueGrowth: null, // Would need income statement data
      earningsGrowth: null,
      profitMargin: ratios?.netProfitMargin ? ratios.netProfitMargin * 100 : null,
      operatingMargin: ratios?.operatingProfitMargin ? ratios.operatingProfitMargin * 100 : null,
      returnOnEquity: ratios?.returnOnEquity ? ratios.returnOnEquity * 100 : null,
      debtToEquity: ratios?.debtEquityRatio ? ratios.debtEquityRatio * 100 : null,
      currentRatio: ratios?.currentRatio || null,
      freeCashFlow: metrics?.freeCashFlowPerShare || null,
      dividendYield: ratios?.dividendYield ? ratios.dividendYield * 100 : null,
    }
    
    // Calculate score
    const score = scoreStock(fundamentals)
    
    return NextResponse.json({
      quote: {
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changesPercentage,
        volume: quote.volume,
        marketCap: quote.marketCap,
        dayHigh: quote.dayHigh,
        dayLow: quote.dayLow,
        yearHigh: quote.yearHigh,
        yearLow: quote.yearLow,
        pe: quote.pe,
        eps: quote.eps,
      },
      profile: profile ? {
        sector: profile.sector,
        industry: profile.industry,
        description: profile.description,
        ceo: profile.ceo,
        employees: profile.fullTimeEmployees,
        website: profile.website,
        logo: profile.image,
        dcf: profile.dcf, // Discounted cash flow fair value
      } : null,
      fundamentals,
      score,
    })
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}
