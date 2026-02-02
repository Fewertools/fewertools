'use client'

import { useState, useEffect } from 'react'
import { X, Bell, TrendingDown, ExternalLink } from 'lucide-react'
import { WatchlistItem } from '@/types/stock'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface AlertBannerProps {
  buyZoneStocks: (WatchlistItem & { currentPrice: number })[]
  onDismiss?: (symbol: string) => void
}

export function AlertBanner({ buyZoneStocks, onDismiss }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(true)
  
  const visibleAlerts = buyZoneStocks.filter(stock => !dismissed.has(stock.symbol))
  
  if (!isVisible || visibleAlerts.length === 0) return null
  
  const handleDismiss = (symbol: string) => {
    setDismissed(prev => new Set([...prev, symbol]))
    onDismiss?.(symbol)
  }
  
  const handleDismissAll = () => {
    setIsVisible(false)
  }
  
  return (
    <div className="bg-profit/10 border border-profit/30 rounded-xl p-4 mb-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-profit/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-profit" />
          </div>
          <div>
            <h3 className="font-semibold text-profit">
              {visibleAlerts.length} Stock{visibleAlerts.length > 1 ? 's' : ''} in Buy Zone!
            </h3>
            <p className="text-sm text-gray-400">These stocks have hit your target prices</p>
          </div>
        </div>
        <button
          onClick={handleDismissAll}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-2">
        {visibleAlerts.map((stock) => {
          const discount = ((stock.targetPrice - stock.currentPrice) / stock.targetPrice) * 100
          
          return (
            <div
              key={stock.symbol}
              className="flex items-center justify-between bg-surface-tertiary rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{stock.symbol}</span>
                    <span className="text-xs text-profit px-1.5 py-0.5 bg-profit/20 rounded">
                      {discount.toFixed(1)}% below target
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatCurrency(stock.currentPrice)} / Target: {formatCurrency(stock.targetPrice)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  href={`/stock/${stock.symbol}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-accent hover:bg-accent-hover rounded-lg text-sm font-medium text-white transition-colors"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => handleDismiss(stock.symbol)}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
