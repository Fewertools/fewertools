import { NextRequest, NextResponse } from 'next/server'
import { fetchQuotes, searchStocks } from '@/lib/api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbols = searchParams.get('symbols')
  const query = searchParams.get('q')
  
  try {
    // Search mode
    if (query) {
      const results = await searchStocks(query)
      return NextResponse.json({ results })
    }
    
    // Batch quote mode
    if (symbols) {
      const symbolList = symbols.split(',').map(s => s.trim().toUpperCase())
      const quotes = await fetchQuotes(symbolList)
      
      return NextResponse.json({
        quotes: quotes.map(q => ({
          symbol: q.symbol,
          name: q.name,
          price: q.price,
          change: q.change,
          changePercent: q.changesPercentage,
          volume: q.volume,
          marketCap: q.marketCap,
        }))
      })
    }
    
    return NextResponse.json(
      { error: 'Provide either ?symbols=AAPL,MSFT or ?q=search' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in stocks API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}
