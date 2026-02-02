'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StockCard } from '@/components/StockCard'
import { Stock, StockScreenerCriteria, StockScore } from '@/types/stock'
import { GROW_CRITERIA, GROWTH_CRITERIA, VALUE_CRITERIA, DIVIDEND_CRITERIA } from '@/lib/screener'
import { 
  ArrowLeft, Search, Filter, SlidersHorizontal, 
  TrendingUp, Gem, Percent, Building2, RefreshCw
} from 'lucide-react'

type PresetName = 'grow' | 'growth' | 'value' | 'dividend' | 'custom'

const PRESETS: Record<PresetName, { name: string; description: string; criteria: StockScreenerCriteria; icon: React.ReactNode }> = {
  grow: {
    name: 'G.R.O.W. Quality',
    description: 'Large cap quality stocks with strong fundamentals',
    criteria: GROW_CRITERIA,
    icon: <Gem className="w-5 h-5" />,
  },
  growth: {
    name: 'High Growth',
    description: 'Fast-growing companies with 25%+ revenue growth',
    criteria: GROWTH_CRITERIA,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  value: {
    name: 'Deep Value',
    description: 'Undervalued stocks with low P/E ratios',
    criteria: VALUE_CRITERIA,
    icon: <Percent className="w-5 h-5" />,
  },
  dividend: {
    name: 'Dividend',
    description: 'Income stocks with 2.5%+ dividend yield',
    criteria: DIVIDEND_CRITERIA,
    icon: <Building2 className="w-5 h-5" />,
  },
  custom: {
    name: 'Custom',
    description: 'Build your own screening criteria',
    criteria: {},
    icon: <SlidersHorizontal className="w-5 h-5" />,
  },
}

// Mock results - will be replaced with API call
const mockResults: { stock: Stock; score: StockScore }[] = [
  {
    stock: {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      price: 192.25,
      change: -0.82,
      changePercent: -0.42,
      volume: 52000000,
      marketCap: 3000000000000,
      logo: 'https://logo.clearbit.com/apple.com',
    },
    score: {
      symbol: 'AAPL',
      overall: 76,
      growth: 18,
      quality: 24,
      valuation: 18,
      momentum: 16,
      signals: [],
    },
  },
  {
    stock: {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      price: 415.50,
      change: 3.52,
      changePercent: 0.85,
      volume: 22000000,
      marketCap: 3100000000000,
      logo: 'https://logo.clearbit.com/microsoft.com',
    },
    score: {
      symbol: 'MSFT',
      overall: 81,
      growth: 20,
      quality: 23,
      valuation: 19,
      momentum: 19,
      signals: [],
    },
  },
  {
    stock: {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      price: 178.25,
      change: 2.15,
      changePercent: 1.22,
      volume: 28000000,
      marketCap: 2200000000000,
      logo: 'https://logo.clearbit.com/google.com',
    },
    score: {
      symbol: 'GOOGL',
      overall: 78,
      growth: 18,
      quality: 24,
      valuation: 20,
      momentum: 16,
      signals: [],
    },
  },
  {
    stock: {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      sector: 'Technology',
      price: 582.30,
      change: 8.45,
      changePercent: 1.47,
      volume: 15000000,
      marketCap: 1500000000000,
      logo: 'https://logo.clearbit.com/meta.com',
    },
    score: {
      symbol: 'META',
      overall: 74,
      growth: 19,
      quality: 21,
      valuation: 17,
      momentum: 17,
      signals: [],
    },
  },
]

export default function ScreenerPage() {
  const router = useRouter()
  const [activePreset, setActivePreset] = useState<PresetName>('grow')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(mockResults)
  
  // Custom criteria state
  const [customCriteria, setCustomCriteria] = useState<StockScreenerCriteria>({
    minMarketCap: 10000000000,
    maxPe: 40,
    minRevenueGrowth: 10,
    minProfitMargin: 15,
  })
  
  const handleRunScreen = async () => {
    setLoading(true)
    // TODO: Call API with criteria
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }
  
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
            
            <h1 className="text-xl font-bold text-white">Stock Screener</h1>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters ? 'bg-accent text-white' : 'bg-surface-tertiary text-gray-300 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Preset buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {(Object.keys(PRESETS) as PresetName[]).map((key) => {
            const preset = PRESETS[key]
            const isActive = activePreset === key
            
            return (
              <button
                key={key}
                onClick={() => setActivePreset(key)}
                className={`
                  p-4 rounded-xl border text-left transition-all
                  ${isActive 
                    ? 'bg-accent/20 border-accent/50 ring-1 ring-accent/30' 
                    : 'bg-surface-secondary border-white/5 hover:border-white/10'
                  }
                `}
              >
                <div className={`mb-2 ${isActive ? 'text-accent' : 'text-gray-400'}`}>
                  {preset.icon}
                </div>
                <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {preset.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            )
          })}
        </div>
        
        {/* Custom filters panel */}
        {(showFilters || activePreset === 'custom') && (
          <div className="bg-surface-secondary rounded-xl p-5 border border-white/5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Filter Criteria</h2>
              <button
                onClick={handleRunScreen}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Run Screen
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FilterInput
                label="Min Market Cap"
                value={customCriteria.minMarketCap || ''}
                onChange={(v) => setCustomCriteria({ ...customCriteria, minMarketCap: v ? Number(v) : undefined })}
                suffix="$B"
                placeholder="10"
              />
              <FilterInput
                label="Max P/E Ratio"
                value={customCriteria.maxPe || ''}
                onChange={(v) => setCustomCriteria({ ...customCriteria, maxPe: v ? Number(v) : undefined })}
                placeholder="40"
              />
              <FilterInput
                label="Min Revenue Growth"
                value={customCriteria.minRevenueGrowth || ''}
                onChange={(v) => setCustomCriteria({ ...customCriteria, minRevenueGrowth: v ? Number(v) : undefined })}
                suffix="%"
                placeholder="10"
              />
              <FilterInput
                label="Min Profit Margin"
                value={customCriteria.minProfitMargin || ''}
                onChange={(v) => setCustomCriteria({ ...customCriteria, minProfitMargin: v ? Number(v) : undefined })}
                suffix="%"
                placeholder="15"
              />
              <FilterInput
                label="Max Debt/Equity"
                value={customCriteria.maxDebtToEquity || ''}
                onChange={(v) => setCustomCriteria({ ...customCriteria, maxDebtToEquity: v ? Number(v) : undefined })}
                placeholder="100"
              />
              <FilterInput
                label="Min Dividend Yield"
                value={customCriteria.minDividendYield || ''}
                onChange={(v) => setCustomCriteria({ ...customCriteria, minDividendYield: v ? Number(v) : undefined })}
                suffix="%"
                placeholder="2.5"
              />
            </div>
          </div>
        )}
        
        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">
            {results.length} stocks found
          </h2>
          <p className="text-sm text-gray-400">
            Sorted by G.R.O.W. score
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results
            .sort((a, b) => b.score.overall - a.score.overall)
            .map(({ stock, score }) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                score={score}
                onClick={() => router.push(`/stock/${stock.symbol}`)}
              />
            ))}
        </div>
        
        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No stocks match your criteria</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </main>
    </div>
  )
}

function FilterInput({ 
  label, 
  value, 
  onChange, 
  suffix, 
  placeholder 
}: { 
  label: string
  value: string | number
  onChange: (value: string) => void
  suffix?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-sm text-gray-400 block mb-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface-tertiary border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
