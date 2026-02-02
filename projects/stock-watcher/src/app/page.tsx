'use client'

import { useState } from 'react'
import { MarketOverview } from '@/components/MarketOverview'
import { SuggestionCard } from '@/components/SuggestionCard'
import { WatchlistTable } from '@/components/WatchlistTable'
import { StockCard } from '@/components/StockCard'
import { Stock, StockScore, WatchlistItem } from '@/types/stock'
import { Search, Plus, Bell, Settings, TrendingUp, Eye, Sparkles, LayoutGrid, List } from 'lucide-react'

// Mock data - will be replaced with real API calls
const mockSuggestions: { stock: Stock; score: StockScore; targetPrice: number; fairValue: number; reasoning: string }[] = [
  {
    stock: {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      sector: 'Technology',
      price: 875.50,
      change: 12.30,
      changePercent: 1.42,
      volume: 45000000,
      marketCap: 2150000000000,
      logo: 'https://logo.clearbit.com/nvidia.com',
    },
    score: {
      symbol: 'NVDA',
      overall: 82,
      growth: 23,
      quality: 22,
      valuation: 15,
      momentum: 22,
      signals: [
        { type: 'bullish', category: 'fundamental', message: 'Strong revenue growth (25%+)', weight: 2 },
        { type: 'bullish', category: 'fundamental', message: 'Excellent profit margins (25%+)', weight: 2 },
        { type: 'bullish', category: 'fundamental', message: 'Low debt (D/E < 0.3)', weight: 1 },
        { type: 'bearish', category: 'fundamental', message: 'Expensive P/E (>50)', weight: 1 },
      ],
    },
    targetPrice: 825,
    fairValue: 950,
    reasoning: 'NVIDIA remains the dominant AI infrastructure play. Data center revenue continues to accelerate. Current pullback from highs offers better entry point. Watch for China export restrictions as key risk.',
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
      signals: [
        { type: 'bullish', category: 'fundamental', message: 'Excellent profit margins (25%+)', weight: 2 },
        { type: 'bullish', category: 'fundamental', message: 'High return on equity (20%+)', weight: 1 },
        { type: 'bullish', category: 'fundamental', message: 'Attractive PEG ratio (≤1)', weight: 2 },
      ],
    },
    targetPrice: 165,
    fairValue: 195,
    reasoning: 'Google Cloud growth accelerating, AI integration across products showing results. YouTube and Search remain cash cows. Trading at reasonable valuation vs big tech peers.',
  },
]

const mockWatchlist: (WatchlistItem & { currentPrice: number; change: number })[] = [
  {
    id: '1',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    targetPrice: 400,
    fairValue: 450,
    notes: 'Azure growth, Copilot monetization',
    alertEnabled: true,
    addedAt: new Date(),
    category: 'core',
    currentPrice: 415.50,
    change: 0.85,
  },
  {
    id: '2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    targetPrice: 180,
    fairValue: 200,
    notes: 'Services growth, Vision Pro catalyst',
    alertEnabled: true,
    addedAt: new Date(),
    category: 'core',
    currentPrice: 192.25,
    change: -0.42,
  },
  {
    id: '3',
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    targetPrice: 22,
    fairValue: 28,
    notes: 'AIP platform momentum',
    alertEnabled: false,
    addedAt: new Date(),
    category: 'growth',
    currentPrice: 24.80,
    change: 3.15,
  },
]

export default function Dashboard() {
  const [view, setView] = useState<'suggestions' | 'watchlist'>('suggestions')
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Stock Watcher</h1>
                <p className="text-xs text-gray-400">AI-powered investment suggestions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-surface-tertiary border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50"
                />
              </div>
              
              <button className="p-2 rounded-lg bg-surface-tertiary border border-white/5 hover:border-accent/30 transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              
              <button className="p-2 rounded-lg bg-surface-tertiary border border-white/5 hover:border-accent/30 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Market Overview */}
        <div className="mb-6">
          <MarketOverview />
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setView('suggestions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'suggestions' 
                  ? 'bg-accent text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Suggestions
            </button>
            <button
              onClick={() => setView('watchlist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'watchlist' 
                  ? 'bg-accent text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              Watchlist
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg text-sm font-medium text-white transition-colors">
            <Plus className="w-4 h-4" />
            Add Stock
          </button>
        </div>
        
        {/* Content */}
        {view === 'suggestions' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Today&apos;s Top Picks</h2>
              <p className="text-sm text-gray-400">Based on G.R.O.W. analysis</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {mockSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.stock.symbol}
                  stock={suggestion.stock}
                  score={suggestion.score}
                  targetPrice={suggestion.targetPrice}
                  fairValue={suggestion.fairValue}
                  reasoning={suggestion.reasoning}
                />
              ))}
            </div>
            
            {/* Quick picks grid */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4">More Opportunities</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockWatchlist.slice(0, 3).map((item) => (
                  <StockCard
                    key={item.id}
                    stock={{
                      symbol: item.symbol,
                      name: item.name,
                      sector: '',
                      price: item.currentPrice,
                      change: item.change * item.currentPrice / 100,
                      changePercent: item.change,
                      volume: 0,
                      marketCap: 0,
                    }}
                    targetPrice={item.targetPrice}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-secondary rounded-xl p-4 border border-white/5">
            <WatchlistTable
              items={mockWatchlist}
              onToggleAlert={(id) => console.log('Toggle alert:', id)}
              onRemove={(id) => console.log('Remove:', id)}
              onClick={(symbol) => console.log('Click:', symbol)}
            />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            Stock Watcher v0.1.0 • Data provided for informational purposes only • Not financial advice
          </p>
        </div>
      </footer>
    </div>
  )
}
