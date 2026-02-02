'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface PricePoint {
  date: string
  price: number
}

interface PriceChartProps {
  data: PricePoint[]
  targetPrice?: number
  height?: number
  showAxis?: boolean
}

export function PriceChart({ data, targetPrice, height = 200, showAxis = true }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      ...point,
      // Format date for display
      label: new Date(point.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
    }))
  }, [data])
  
  // Determine line color based on trend
  const isPositive = data.length >= 2 && data[data.length - 1].price >= data[0].price
  const lineColor = isPositive ? '#22c55e' : '#ef4444'
  
  // Calculate min/max for Y axis with padding
  const prices = data.map(d => d.price)
  const minPrice = Math.min(...prices, targetPrice || Infinity) * 0.98
  const maxPrice = Math.max(...prices, targetPrice || 0) * 1.02
  
  if (data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-surface-tertiary rounded-lg"
        style={{ height }}
      >
        <p className="text-sm text-gray-500">No price data available</p>
      </div>
    )
  }
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        {showAxis && (
          <>
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={50}
            />
          </>
        )}
        
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f1f1f',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#9ca3af' }}
          formatter={(value: number) => [formatCurrency(value), 'Price']}
        />
        
        {targetPrice && (
          <ReferenceLine 
            y={targetPrice} 
            stroke="#3b82f6" 
            strokeDasharray="5 5"
            label={{ 
              value: `Target: ${formatCurrency(targetPrice)}`, 
              fill: '#3b82f6',
              fontSize: 10,
              position: 'right'
            }}
          />
        )}
        
        <Line
          type="monotone"
          dataKey="price"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Mini sparkline chart for tables
export function SparklineChart({ data, height = 40 }: { data: number[]; height?: number }) {
  const chartData = data.map((price, i) => ({ index: i, price }))
  const isPositive = data.length >= 2 && data[data.length - 1] >= data[0]
  const lineColor = isPositive ? '#22c55e' : '#ef4444'
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={lineColor}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
