'use client'

import { useState, useEffect, useCallback } from 'react'
import { Stock, StockScore, StockFundamentals } from '@/types/stock'

interface StockData {
  quote: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap: number
    dayHigh: number
    dayLow: number
    yearHigh: number
    yearLow: number
    pe: number
    eps: number
  }
  profile: {
    sector: string
    industry: string
    description: string
    ceo: string
    employees: string
    website: string
    logo: string
    dcf: number
  } | null
  fundamentals: StockFundamentals
  score: StockScore
}

export function useStock(symbol: string | null) {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!symbol) return
    
    async function fetchStock() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/stocks/${symbol}`)
        if (!res.ok) throw new Error('Stock not found')
        const stockData = await res.json()
        setData(stockData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stock')
      } finally {
        setLoading(false)
      }
    }
    
    fetchStock()
  }, [symbol])
  
  return { data, loading, error }
}

export function useStocks(symbols: string[]) {
  const [stocks, setStocks] = useState<Record<string, Stock>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchStocks = useCallback(async () => {
    if (symbols.length === 0) return
    
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/stocks?symbols=${symbols.join(',')}`)
      if (!res.ok) throw new Error('Failed to fetch stocks')
      const data = await res.json()
      
      const stockMap: Record<string, Stock> = {}
      data.quotes.forEach((quote: Stock) => {
        stockMap[quote.symbol] = quote
      })
      setStocks(stockMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stocks')
    } finally {
      setLoading(false)
    }
  }, [symbols])
  
  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])
  
  return { stocks, loading, error, refetch: fetchStocks }
}

export function useStockSearch(query: string) {
  const [results, setResults] = useState<{ symbol: string; name: string; exchange: string }[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }
    
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/stocks?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error('Search failed')
        const data = await res.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300) // Debounce
    
    return () => clearTimeout(timer)
  }, [query])
  
  return { results, loading }
}
