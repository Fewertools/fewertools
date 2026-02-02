'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStockSearch } from '@/hooks/useStocks'
import { Search, X, TrendingUp } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { results, loading } = useStockSearch(query)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  const handleSelect = (symbol: string) => {
    router.push(`/stock/${symbol}`)
    setQuery('')
    setIsOpen(false)
  }
  
  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search stocks... (⌘K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-64 bg-surface-tertiary border border-white/5 rounded-lg pl-10 pr-8 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-secondary border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {results.map((result) => (
                <li key={result.symbol}>
                  <button
                    onClick={() => handleSelect(result.symbol)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white">{result.symbol}</p>
                      <p className="text-sm text-gray-400 truncate">{result.name}</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">{result.exchange}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}
