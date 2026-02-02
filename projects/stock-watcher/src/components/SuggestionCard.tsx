'use client'

import { Stock, StockScore, StockSignal } from '@/types/stock'
import { formatCurrency, formatPercent, getChangeColor, getScoreColor, getScoreBg } from '@/lib/utils'
import { TrendingUp, TrendingDown, Target, Sparkles, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react'

interface SuggestionCardProps {
  stock: Stock
  score: StockScore
  targetPrice: number
  fairValue: number
  reasoning: string
  onClick?: () => void
}

export function SuggestionCard({ 
  stock, 
  score, 
  targetPrice, 
  fairValue,
  reasoning,
  onClick 
}: SuggestionCardProps) {
  const changeColor = getChangeColor(stock.changePercent)
  const inBuyZone = stock.price <= targetPrice
  const discount = ((fairValue - stock.price) / fairValue) * 100
  
  const bullishSignals = score.signals.filter(s => s.type === 'bullish')
  const bearishSignals = score.signals.filter(s => s.type === 'bearish')
  
  return (
    <div 
      onClick={onClick}
      className={`
        bg-surface-secondary rounded-xl p-5 border 
        ${inBuyZone ? 'border-profit/50 ring-1 ring-profit/20' : 'border-white/5'}
        hover:border-accent/30 transition-all cursor-pointer
      `}
    >
      {/* Header with buy zone badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {stock.logo ? (
            <img 
              src={stock.logo} 
              alt={stock.name}
              className="w-12 h-12 rounded-xl bg-white/10"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold">
                {stock.symbol.slice(0, 2)}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
              {inBuyZone && (
                <span className="px-2 py-0.5 bg-profit/20 text-profit text-xs font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  BUY ZONE
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{stock.name}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1.5 rounded-lg ${getScoreBg(score.overall)}`}>
          <span className={`text-lg font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}
          </span>
          <span className="text-xs text-gray-400 ml-1">/100</span>
        </div>
      </div>
      
      {/* Price info */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-white/5">
        <div>
          <p className="text-xs text-gray-500 mb-1">Current</p>
          <p className="text-lg font-bold text-white">{formatCurrency(stock.price)}</p>
          <p className={`text-sm ${changeColor}`}>{formatPercent(stock.changePercent)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Target</p>
          <p className="text-lg font-bold text-gray-300">{formatCurrency(targetPrice)}</p>
          <p className="text-sm text-gray-400">Entry price</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fair Value</p>
          <p className="text-lg font-bold text-gray-300">{formatCurrency(fairValue)}</p>
          <p className={`text-sm ${discount > 0 ? 'text-profit' : 'text-loss'}`}>
            {discount > 0 ? `${discount.toFixed(0)}% discount` : `${Math.abs(discount).toFixed(0)}% premium`}
          </p>
        </div>
      </div>
      
      {/* AI Reasoning */}
      <div className="mb-4 pb-4 border-b border-white/5">
        <p className="text-sm text-gray-300">{reasoning}</p>
      </div>
      
      {/* Signals */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-profit" />
            Bullish signals
          </p>
          <ul className="space-y-1">
            {bullishSignals.slice(0, 3).map((signal, i) => (
              <li key={i} className="text-xs text-profit">• {signal.message}</li>
            ))}
            {bullishSignals.length === 0 && (
              <li className="text-xs text-gray-500">None</li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-loss" />
            Bearish signals
          </p>
          <ul className="space-y-1">
            {bearishSignals.slice(0, 3).map((signal, i) => (
              <li key={i} className="text-xs text-loss">• {signal.message}</li>
            ))}
            {bearishSignals.length === 0 && (
              <li className="text-xs text-gray-500">None</li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Score breakdown */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {[
            { label: 'G', value: score.growth, max: 25 },
            { label: 'R', value: score.quality, max: 25 },
            { label: 'O', value: score.valuation, max: 25 },
            { label: 'W', value: score.momentum, max: 25 },
          ].map(({ label, value, max }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-lg bg-surface-tertiary flex items-center justify-center mb-1">
                <span className="text-sm font-bold text-white">{value}</span>
              </div>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
        
        <button className="flex items-center gap-1 text-accent hover:text-accent-hover transition-colors">
          <span className="text-sm font-medium">View details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
