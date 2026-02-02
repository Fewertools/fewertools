'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  TrendingUp, Sparkles, Eye, Search, Filter, 
  Settings, Bell, PieChart, BarChart3
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: <TrendingUp className="w-5 h-5" /> },
  { href: '/screener', label: 'Screener', icon: <Filter className="w-5 h-5" /> },
  { href: '/portfolio', label: 'Portfolio', icon: <PieChart className="w-5 h-5" /> },
  { href: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
]

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-secondary/80 backdrop-blur-xl border-t border-white/5 md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                ${isActive 
                  ? 'text-accent' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function DesktopNav() {
  const pathname = usePathname()
  
  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-accent/20 text-accent' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
