import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string | null
  telegram_chat_id: string | null
  created_at: string
  updated_at: string
}

export interface WatchlistItem {
  id: string
  user_id: string
  symbol: string
  name: string
  target_price: number
  fair_value: number | null
  notes: string | null
  category: 'core' | 'growth' | 'speculative' | 'dividend'
  alert_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  watchlist_id: string
  symbol: string
  target_price: number
  triggered_price: number | null
  alert_type: 'price_below' | 'price_above' | 'percent_change'
  status: 'pending' | 'triggered' | 'dismissed'
  triggered_at: string | null
  created_at: string
}

export interface PortfolioHolding {
  id: string
  user_id: string
  symbol: string
  name: string
  shares: number
  avg_cost: number
  category: 'core' | 'growth' | 'speculative' | 'dividend'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  portfolio_id: string | null
  symbol: string
  type: 'buy' | 'sell' | 'dividend'
  shares: number
  price: number
  total: number
  fees: number
  notes: string | null
  transaction_date: string
  created_at: string
}

export interface StockCache {
  symbol: string
  name: string | null
  sector: string | null
  price: number | null
  change: number | null
  change_percent: number | null
  market_cap: number | null
  pe: number | null
  volume: number | null
  fundamentals: Record<string, unknown> | null
  score: Record<string, unknown> | null
  updated_at: string
}

// Watchlist operations
export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function addToWatchlist(item: Omit<WatchlistItem, 'id' | 'created_at' | 'updated_at'>): Promise<WatchlistItem> {
  const { data, error } = await supabase
    .from('watchlist')
    .insert(item)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateWatchlistItem(id: string, updates: Partial<WatchlistItem>): Promise<WatchlistItem> {
  const { data, error } = await supabase
    .from('watchlist')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function removeFromWatchlist(id: string): Promise<void> {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Alerts operations
export async function getAlerts(userId: string, status?: string): Promise<Alert[]> {
  let query = supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function dismissAlert(id: string): Promise<void> {
  const { error } = await supabase
    .from('alerts')
    .update({ status: 'dismissed' })
    .eq('id', id)
  
  if (error) throw error
}

// Portfolio operations
export async function getPortfolio(userId: string): Promise<PortfolioHolding[]> {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('user_id', userId)
    .order('symbol', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function addHolding(holding: Omit<PortfolioHolding, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioHolding> {
  const { data, error } = await supabase
    .from('portfolio')
    .insert(holding)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateHolding(id: string, updates: Partial<PortfolioHolding>): Promise<PortfolioHolding> {
  const { data, error } = await supabase
    .from('portfolio')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Stock cache operations
export async function getCachedStock(symbol: string): Promise<StockCache | null> {
  const { data, error } = await supabase
    .from('stock_cache')
    .select('*')
    .eq('symbol', symbol.toUpperCase())
    .single()
  
  if (error) return null
  return data
}

export async function getCachedStocks(symbols: string[]): Promise<StockCache[]> {
  const { data, error } = await supabase
    .from('stock_cache')
    .select('*')
    .in('symbol', symbols.map(s => s.toUpperCase()))
  
  if (error) throw error
  return data || []
}

export async function updateStockCache(stock: Omit<StockCache, 'updated_at'>): Promise<void> {
  const { error } = await supabase
    .from('stock_cache')
    .upsert({ ...stock, updated_at: new Date().toISOString() })
  
  if (error) throw error
}
