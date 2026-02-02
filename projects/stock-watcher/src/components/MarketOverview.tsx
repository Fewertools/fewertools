'use client'

import { formatPercent, getChangeColor } from '@/lib/utils'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface MarketIndex {
  name: string
  value: number
  change: number
}

interface MarketOverviewProps {
  indices?: MarketIndex[]
  fearGreedIndex?: number
}

const defaultIndices: MarketIndex[] = [
  { name: 'S&P 500', value: 6025.12, change: 0.42 },
  { name: 'NASDAQ', value: 19432.56, change: 0.78 },
  { name: 'DOW', value: 44215.89, change: 0.15 },
  { name: 'VIX', value: 14.32, change: -2.15 },
]

export function MarketOverview({ indices = defaultIndices, fearGreedIndex = 65 }: MarketOverviewProps) {
  const getFearGreedLabel = (value: number) => {
    if (value <= 25) return 'Extreme Fear'
    if (value <= 45) return 'Fear'
    if (value <= 55) return 'Neutral'
    if (value <= 75) return 'Greed'
    return 'Extreme Greed'
  }
  
  const getFearGreedColor = (value: number) => {
    if (value <= 25) return 'text-red-500'
    if (value <= 45) return 'text-orange-400'
    if (value <= 55) return 'text-yellow-400'
    if (value <= 75) return 'text-green-400'
    return 'text-green-500'
  }
  
  return (
    <div className="bg-surface-secondary rounded-xl p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-accent" />
        <h2 className="font-semibold text-white">Market Overview</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {indices.map((index) => {
          const changeColor = getChangeColor(index.change)
          const isUp = index.change > 0
          
          return (
            <div key={index.name} className="bg-surface-tertiary rounded-lg p-3">
              <p className="text-sm text-gray-400 mb-1">{index.name}</p>
              <p className="text-lg font-bold text-white">
                {index.value.toLocaleString()}
              </p>
              <div className={`flex items-center gap-1 ${changeColor}`}>
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-sm font-medium">
                  {formatPercent(index.change)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Fear & Greed Index */}
      <div className="bg-surface-tertiary rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Fear & Greed Index</span>
          <span className={`text-sm font-medium ${getFearGreedColor(fearGreedIndex)}`}>
            {getFearGreedLabel(fearGreedIndex)}
          </span>
        </div>
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${fearGreedIndex}%`,
              background: `linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-white font-medium">{fearGreedIndex}</span>
          <span className="text-xs text-gray-500">100</span>
        </div>
      </div>
    </div>
  )
}
