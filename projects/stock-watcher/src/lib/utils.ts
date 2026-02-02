import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
  }
  return new Intl.NumberFormat('en-US').format(value)
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-profit'
  if (change < 0) return 'text-loss'
  return 'text-neutral'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-profit'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-loss'
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-profit/20'
  if (score >= 60) return 'bg-yellow-400/20'
  if (score >= 40) return 'bg-orange-400/20'
  return 'bg-loss/20'
}
