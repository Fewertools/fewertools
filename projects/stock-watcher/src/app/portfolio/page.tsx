'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatPercent, getChangeColor } from '@/lib/utils'
import { 
  ArrowLeft, Plus, TrendingUp, TrendingDown, PieChart, 
  DollarSign, Percent, BarChart3, Edit2, Trash2
} from 'lucide-react'

interface Holding {
  id: string
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  category: 'core' | 'growth' | 'speculative' | 'dividend'
}

// Mock portfolio data
const mockHoldings: Holding[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 25,
    avgCost: 175.50,
    currentPrice: 192.25,
    category: 'core',
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 15,
    avgCost: 380.00,
    currentPrice: 415.50,
    category: 'core',
  },
  {
    id: '3',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 10,
    avgCost: 650.00,
    currentPrice: 875.50,
    category: 'growth',
  },
  {
    id: '4',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 20,
    avgCost: 155.00,
    currentPrice: 178.25,
    category: 'core',
  },
]

export default function PortfolioPage() {
  const router = useRouter()
  const [holdings, setHoldings] = useState(mockHoldings)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Calculate portfolio metrics
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgCost, 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = ((totalValue - totalCost) / totalCost) * 100
  
  // Holdings with calculated values
  const enrichedHoldings = holdings.map(h => {
    const value = h.shares * h.currentPrice
    const cost = h.shares * h.avgCost
    const gain = value - cost
    const gainPercent = ((value - cost) / cost) * 100
    const allocation = (value / totalValue) * 100
    
    return { ...h, value, cost, gain, gainPercent, allocation }
  }).sort((a, b) => b.value - a.value)
  
  // Category breakdown
  const categoryBreakdown = enrichedHoldings.reduce((acc, h) => {
    acc[h.category] = (acc[h.category] || 0) + h.value
    return acc
  }, {} as Record<string, number>)
  
  return (
    <div className="min-h-screen bg-surface pb-20 md:pb-0">
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
            
            <h1 className="text-xl font-bold text-white">Portfolio</h1>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg text-sm font-medium text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Holding
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Portfolio summary */}
        <div className="bg-surface-secondary rounded-xl p-6 border border-white/5 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Value
              </p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Total Cost
              </p>
              <p className="text-2xl font-bold text-gray-300">{formatCurrency(totalCost)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                {totalGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                Total Gain/Loss
              </p>
              <p className={`text-2xl font-bold ${getChangeColor(totalGain)}`}>
                {formatCurrency(totalGain)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Return
              </p>
              <p className={`text-2xl font-bold ${getChangeColor(totalGainPercent)}`}>
                {formatPercent(totalGainPercent)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Category breakdown */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {(['core', 'growth', 'speculative', 'dividend'] as const).map((category) => {
            const value = categoryBreakdown[category] || 0
            const percent = (value / totalValue) * 100
            
            const colors = {
              core: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              growth: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              speculative: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
              dividend: 'bg-green-500/20 text-green-400 border-green-500/30',
            }
            
            return (
              <div 
                key={category}
                className={`rounded-xl p-4 border ${colors[category]}`}
              >
                <p className="text-sm capitalize mb-1">{category}</p>
                <p className="text-xl font-bold">{formatCurrency(value)}</p>
                <p className="text-sm opacity-75">{percent.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>
        
        {/* Holdings table */}
        <div className="bg-surface-secondary rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold text-white">Holdings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium text-right">Shares</th>
                  <th className="px-4 py-3 font-medium text-right">Avg Cost</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Value</th>
                  <th className="px-4 py-3 font-medium text-right">Gain/Loss</th>
                  <th className="px-4 py-3 font-medium text-right">Allocation</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrichedHoldings.map((holding) => (
                  <tr 
                    key={holding.id}
                    className="border-b border-white/5 hover:bg-surface-tertiary transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <span className="text-accent font-bold text-sm">
                            {holding.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{holding.symbol}</p>
                          <p className="text-xs text-gray-400">{holding.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-white">
                      {holding.shares}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-300">
                      {formatCurrency(holding.avgCost)}
                    </td>
                    <td className="px-4 py-4 text-right text-white">
                      {formatCurrency(holding.currentPrice)}
                    </td>
                    <td className="px-4 py-4 text-right text-white font-medium">
                      {formatCurrency(holding.value)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className={getChangeColor(holding.gainPercent)}>
                        <p className="font-medium">{formatCurrency(holding.gain)}</p>
                        <p className="text-xs">{formatPercent(holding.gainPercent)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-300">
                      {holding.allocation.toFixed(1)}%
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-loss transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {holdings.length === 0 && (
            <div className="text-center py-12">
              <PieChart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No holdings yet</p>
              <p className="text-sm text-gray-500 mt-1">Add your first stock to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
