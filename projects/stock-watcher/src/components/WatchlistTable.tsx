'use client'

import { Stock, WatchlistItem } from '@/types/stock'
import { formatCurrency, formatPercent, getChangeColor } from '@/lib/utils'
import { TrendingUp, TrendingDown, Bell, BellOff, Trash2, Target } from 'lucide-react'

interface WatchlistTableProps {
  items: (WatchlistItem & { currentPrice?: number; change?: number })[]
  onToggleAlert?: (id: string) => void
  onRemove?: (id: string) => void
  onClick?: (symbol: string) => void
}

export function WatchlistTable({ items, onToggleAlert, onRemove, onClick }: WatchlistTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-white/5">
            <th className="pb-3 font-medium">Symbol</th>
            <th className="pb-3 font-medium">Price</th>
            <th className="pb-3 font-medium">Change</th>
            <th className="pb-3 font-medium">Target</th>
            <th className="pb-3 font-medium">Distance</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const currentPrice = item.currentPrice || 0
            const change = item.change || 0
            const changeColor = getChangeColor(change)
            const distance = ((currentPrice - item.targetPrice) / item.targetPrice) * 100
            const inBuyZone = currentPrice <= item.targetPrice
            
            return (
              <tr 
                key={item.id}
                onClick={() => onClick?.(item.symbol)}
                className="border-b border-white/5 hover:bg-surface-tertiary cursor-pointer transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-bold text-xs">
                        {item.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.symbol}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[100px]">{item.name}</p>
                    </div>
                  </div>
                </td>
                
                <td className="py-4">
                  <span className="font-medium text-white">
                    {formatCurrency(currentPrice)}
                  </span>
                </td>
                
                <td className="py-4">
                  <div className={`flex items-center gap-1 ${changeColor}`}>
                    {change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : change < 0 ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : null}
                    <span className="font-medium">{formatPercent(change)}</span>
                  </div>
                </td>
                
                <td className="py-4">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{formatCurrency(item.targetPrice)}</span>
                  </div>
                </td>
                
                <td className="py-4">
                  <span className={`font-medium ${inBuyZone ? 'text-profit' : distance < 10 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {inBuyZone ? 'BUY ZONE' : `${distance.toFixed(1)}% away`}
                  </span>
                </td>
                
                <td className="py-4">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${item.category === 'core' ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${item.category === 'growth' ? 'bg-purple-500/20 text-purple-400' : ''}
                    ${item.category === 'speculative' ? 'bg-orange-500/20 text-orange-400' : ''}
                    ${item.category === 'dividend' ? 'bg-green-500/20 text-green-400' : ''}
                  `}>
                    {item.category}
                  </span>
                </td>
                
                <td className="py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleAlert?.(item.id)
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        item.alertEnabled 
                          ? 'bg-accent/20 text-accent hover:bg-accent/30' 
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {item.alertEnabled ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove?.(item.id)
                      }}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-loss/20 hover:text-loss transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
      {items.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No stocks in your watchlist</p>
          <p className="text-sm mt-1">Add some stocks to get started</p>
        </div>
      )}
    </div>
  )
}
