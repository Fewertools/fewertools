'use client'

import { useState, useEffect, useCallback } from 'react'
import { WatchlistItem } from '@/types/stock'

// Local storage key
const WATCHLIST_KEY = 'stock-watcher-watchlist'

// Get initial watchlist from localStorage
function getInitialWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    console.error('Failed to load watchlist from localStorage')
  }
  
  return []
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Load from localStorage on mount
  useEffect(() => {
    setItems(getInitialWatchlist())
    setLoading(false)
  }, [])
  
  // Save to localStorage whenever items change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items))
    }
  }, [items, loading])
  
  const addItem = useCallback((item: Omit<WatchlistItem, 'id' | 'addedAt'>) => {
    const newItem: WatchlistItem = {
      ...item,
      id: crypto.randomUUID(),
      addedAt: new Date(),
    }
    setItems(prev => [newItem, ...prev])
    return newItem
  }, [])
  
  const updateItem = useCallback((id: string, updates: Partial<WatchlistItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])
  
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])
  
  const toggleAlert = useCallback((id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, alertEnabled: !item.alertEnabled } : item
    ))
  }, [])
  
  const getItem = useCallback((symbol: string) => {
    return items.find(item => item.symbol.toUpperCase() === symbol.toUpperCase())
  }, [items])
  
  const isInWatchlist = useCallback((symbol: string) => {
    return items.some(item => item.symbol.toUpperCase() === symbol.toUpperCase())
  }, [items])
  
  return {
    items,
    loading,
    addItem,
    updateItem,
    removeItem,
    toggleAlert,
    getItem,
    isInWatchlist,
  }
}

// Hook for checking which stocks are in buy zone
export function useBuyZoneStocks(watchlist: WatchlistItem[], prices: Record<string, number>) {
  return watchlist.filter(item => {
    const currentPrice = prices[item.symbol]
    return currentPrice && currentPrice <= item.targetPrice
  })
}
