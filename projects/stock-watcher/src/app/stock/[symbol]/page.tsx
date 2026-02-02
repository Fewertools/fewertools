'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatCurrency, formatPercent, formatNumber, getChangeColor, getScoreColor, getScoreBg } from '@/lib/utils'
import { Stock, StockScore, StockFundamentals } from '@/types/stock'
import { 
  ArrowLeft, TrendingUp, TrendingDown, Target, Plus, Bell, 
  Building2, Users, Globe, DollarSign, BarChart3, PieChart,
  AlertTriangle, CheckCircle, ExternalLink
} from 'lucide-react'

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

export default function StockDetailPage() {
  const params = useParams()
  const router = useRouter()
  const symbol = (params.symbol as string)?.toUpperCase()
  
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [targetPrice, setTargetPrice] = useState('')
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false)
  
  useEffect(() => {
    async function fetchStock() {
      try {
        setLoading(true)
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
    
    if (symbol) fetchStock()
  }, [symbol])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading {symbol}...</div>
      </div>
    )
  }
  
  if (error || !data) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Stock not found'}</p>
          <button 
            onClick={() => router.push('/')}
            className="text-accent hover:underline"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    )
  }
  
  const { quote, profile, fundamentals, score } = data
  const changeColor = getChangeColor(quote.changePercent)
  const isUp = quote.changePercent > 0
  
  const bullishSignals = score.signals.filter(s => s.type === 'bullish')
  const bearishSignals = score.signals.filter(s => s.type === 'bearish')
  
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddToWatchlist(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg text-sm font-medium text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add to Watchlist
              </button>
              <button className="p-2 rounded-lg bg-surface-tertiary border border-white/5 hover:border-accent/30 transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stock header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            {profile?.logo ? (
              <img 
                src={profile.logo} 
                alt={quote.name}
                className="w-16 h-16 rounded-2xl bg-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-bold text-xl">
                  {symbol.slice(0, 2)}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{symbol}</h1>
                <div className={`px-3 py-1 rounded-lg ${getScoreBg(score.overall)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(score.overall)}`}>
                    {score.overall}
                  </span>
                  <span className="text-xs text-gray-400">/100</span>
                </div>
              </div>
              <p className="text-gray-400">{quote.name}</p>
              {profile && (
                <p className="text-sm text-gray-500">{profile.sector} • {profile.industry}</p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{formatCurrency(quote.price)}</p>
            <div className={`flex items-center justify-end gap-2 ${changeColor}`}>
              {isUp ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="text-lg font-medium">
                {formatCurrency(quote.change)} ({formatPercent(quote.changePercent)})
              </span>
            </div>
          </div>
        </div>
        
        {/* Key stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Market Cap" value={formatCurrency(quote.marketCap, true)} icon={<DollarSign />} />
          <StatCard label="P/E Ratio" value={quote.pe?.toFixed(2) || 'N/A'} icon={<BarChart3 />} />
          <StatCard label="EPS" value={formatCurrency(quote.eps)} icon={<PieChart />} />
          <StatCard label="Volume" value={formatNumber(quote.volume, true)} icon={<BarChart3 />} />
        </div>
        
        {/* Price range */}
        <div className="bg-surface-secondary rounded-xl p-5 border border-white/5 mb-8">
          <h2 className="font-semibold text-white mb-4">Price Range</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-400 mb-2">Today&apos;s Range</p>
              <div className="relative h-2 bg-gray-700 rounded-full">
                <div 
                  className="absolute h-2 bg-accent rounded-full"
                  style={{
                    left: `${((quote.dayLow - quote.dayLow) / (quote.dayHigh - quote.dayLow)) * 100}%`,
                    right: `${100 - ((quote.price - quote.dayLow) / (quote.dayHigh - quote.dayLow)) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{formatCurrency(quote.dayLow)}</span>
                <span className="text-xs text-white font-medium">{formatCurrency(quote.price)}</span>
                <span className="text-xs text-gray-500">{formatCurrency(quote.dayHigh)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">52-Week Range</p>
              <div className="relative h-2 bg-gray-700 rounded-full">
                <div 
                  className="absolute h-2 bg-purple-500 rounded-full"
                  style={{
                    left: '0%',
                    right: `${100 - ((quote.price - quote.yearLow) / (quote.yearHigh - quote.yearLow)) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{formatCurrency(quote.yearLow)}</span>
                <span className="text-xs text-white font-medium">{formatCurrency(quote.price)}</span>
                <span className="text-xs text-gray-500">{formatCurrency(quote.yearHigh)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* G.R.O.W. Score Breakdown */}
        <div className="bg-surface-secondary rounded-xl p-5 border border-white/5 mb-8">
          <h2 className="font-semibold text-white mb-4">G.R.O.W. Score Breakdown</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <ScoreBar label="Growth" letter="G" value={score.growth} max={25} />
            <ScoreBar label="Revenue Quality" letter="R" value={score.quality} max={25} />
            <ScoreBar label="Owner-Operator" letter="O" value={score.valuation} max={25} />
            <ScoreBar label="Valuation Wisdom" letter="W" value={score.momentum} max={25} />
          </div>
          
          {/* Signals */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-profit" />
                Bullish Signals
              </h3>
              {bullishSignals.length > 0 ? (
                <ul className="space-y-2">
                  {bullishSignals.map((signal, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-profit">
                      <span className="mt-1">•</span>
                      <span>{signal.message}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No bullish signals detected</p>
              )}
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-loss" />
                Bearish Signals
              </h3>
              {bearishSignals.length > 0 ? (
                <ul className="space-y-2">
                  {bearishSignals.map((signal, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-loss">
                      <span className="mt-1">•</span>
                      <span>{signal.message}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No bearish signals detected</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Fundamentals */}
        <div className="bg-surface-secondary rounded-xl p-5 border border-white/5 mb-8">
          <h2 className="font-semibold text-white mb-4">Key Fundamentals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FundamentalItem label="P/E Ratio" value={fundamentals.pe} format="number" />
            <FundamentalItem label="PEG Ratio" value={fundamentals.peg} format="number" />
            <FundamentalItem label="Price/Book" value={fundamentals.priceToBook} format="number" />
            <FundamentalItem label="Price/Sales" value={fundamentals.priceToSales} format="number" />
            <FundamentalItem label="Profit Margin" value={fundamentals.profitMargin} format="percent" />
            <FundamentalItem label="Operating Margin" value={fundamentals.operatingMargin} format="percent" />
            <FundamentalItem label="ROE" value={fundamentals.returnOnEquity} format="percent" />
            <FundamentalItem label="Debt/Equity" value={fundamentals.debtToEquity} format="number" />
            <FundamentalItem label="Current Ratio" value={fundamentals.currentRatio} format="number" />
            <FundamentalItem label="Dividend Yield" value={fundamentals.dividendYield} format="percent" />
          </div>
        </div>
        
        {/* Company Profile */}
        {profile && (
          <div className="bg-surface-secondary rounded-xl p-5 border border-white/5 mb-8">
            <h2 className="font-semibold text-white mb-4">About {quote.name}</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {profile.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employees</p>
                  <p className="text-sm text-white">{parseInt(profile.employees).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">CEO</p>
                  <p className="text-sm text-white">{profile.ceo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">DCF Fair Value</p>
                  <p className="text-sm text-white">{formatCurrency(profile.dcf)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Website</p>
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline flex items-center gap-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Add to Watchlist Modal */}
      {showAddToWatchlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-secondary rounded-xl p-6 w-full max-w-md border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Add {symbol} to Watchlist</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Target Price</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder={`Current: ${formatCurrency(quote.price)}`}
                  className="w-full bg-surface-tertiary border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddToWatchlist(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Add to watchlist via API
                    alert(`Added ${symbol} with target ${targetPrice}`)
                    setShowAddToWatchlist(false)
                  }}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg text-white font-medium transition-colors"
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-surface-secondary rounded-xl p-4 border border-white/5">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        <span className="w-4 h-4">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  )
}

function ScoreBar({ label, letter, value, max }: { label: string; letter: string; value: number; max: number }) {
  const percent = (value / max) * 100
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-bold text-white">{value}/{max}</span>
      </div>
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function FundamentalItem({ 
  label, 
  value, 
  format 
}: { 
  label: string; 
  value: number | null; 
  format: 'number' | 'percent' | 'currency' 
}) {
  let displayValue = 'N/A'
  
  if (value !== null) {
    if (format === 'percent') {
      displayValue = `${value.toFixed(2)}%`
    } else if (format === 'currency') {
      displayValue = formatCurrency(value)
    } else {
      displayValue = value.toFixed(2)
    }
  }
  
  return (
    <div className="bg-surface-tertiary rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-white">{displayValue}</p>
    </div>
  )
}
