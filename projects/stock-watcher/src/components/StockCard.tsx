'use client'

import { Stock, StockScore } from '@/types/stock'
import { formatCurrency, formatPercent, getChangeColor, getScoreColor, getScoreBg } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Target, AlertCircle } from 'lucide-react'

interface StockCardProps {
  stock: Stock
  score?: StockScore
  targetPrice?: number
  onClick?: () => void
}

export function StockCard({ stock, score, targetPrice, onClick }: StockCardProps) {
  const changeColor = getChangeColor(stock.changePercent)
  const isUp = stock.changePercent > 0
  const isDown = stock.changePercent < 0
  
  const inBuyZone = targetPrice && stock.price <= targetPrice
  
  return (
    <div 
      onClick={onClick}
      className={`
        bg-surface-secondary rounded-xl p-4 border border-white/5 
        hover:border-accent/30 transition-all cursor-pointer card-glow
        ${inBuyZone ? 'ring-2 ring-profit/50' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {stock.logo ? (
            <img 
              src={stock.logo} 
              alt={stock.name}
              className="w-10 h-10 rounded-lg bg-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">
                {stock.symbol.slice(0, 2)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-white">{stock.symbol}</h3>
            <p className="text-sm text-gray-400 truncate max-w-[120px]">{stock.name}</p>
          </div>
        </div>
        
        {score && (
          <div className={`px-2 py-1 rounded-lg ${getScoreBg(score.overall)}`}>
            <span className={`text-sm font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
            </span>
          </div>
        )}
      </div>
      
      {/* Price */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(stock.price)}
          </p>
          <div className={`flex items-center gap-1 ${changeColor}`}>
            {isUp && <TrendingUp className="w-4 h-4" />}
            {isDown && <TrendingDown className="w-4 h-4" />}
            {!isUp && !isDown && <Minus className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {formatPercent(stock.changePercent)}
            </span>
          </div>
        </div>
        
        {targetPrice && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-gray-400">
              <Target className="w-4 h-4" />
              <span className="text-sm">Target</span>
            </div>
            <p className={`font-medium ${inBuyZone ? 'text-profit' : 'text-gray-300'}`}>
              {formatCurrency(targetPrice)}
            </p>
          </div>
        )}
      </div>
      
      {/* Buy Zone Alert */}
      {inBuyZone && (
        <div className="flex items-center gap-2 px-3 py-2 bg-profit/10 rounded-lg border border-profit/30">
          <AlertCircle className="w-4 h-4 text-profit" />
          <span className="text-sm text-profit font-medium">In buy zone!</span>
        </div>
      )}
      
      {/* Score breakdown */}
      {score && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">Growth</p>
              <p className="text-sm font-medium text-white">{score.growth}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Quality</p>
              <p className="text-sm font-medium text-white">{score.quality}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Value</p>
              <p className="text-sm font-medium text-white">{score.valuation}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Momentum</p>
              <p className="text-sm font-medium text-white">{score.momentum}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
