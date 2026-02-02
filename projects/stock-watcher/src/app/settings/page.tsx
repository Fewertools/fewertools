'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Bell, Moon, Sun, Palette, Database, 
  Key, MessageCircle, Save, CheckCircle
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    alertsEnabled: true,
    emailAlerts: false,
    telegramAlerts: true,
    telegramChatId: '',
    
    // Appearance
    theme: 'dark' as 'dark' | 'light' | 'system',
    compactView: false,
    
    // API Keys
    fmpApiKey: '',
    
    // Preferences
    defaultCurrency: 'USD',
    defaultMarket: 'US',
  })
  
  const handleSave = () => {
    // TODO: Save to localStorage/Supabase
    localStorage.setItem('stock-watcher-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <h1 className="text-xl font-bold text-white">Settings</h1>
            
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg text-sm font-medium text-white transition-colors"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Notifications */}
        <section className="bg-surface-secondary rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Notifications</h2>
              <p className="text-sm text-gray-400">Configure how you receive alerts</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <ToggleSetting
              label="Enable Price Alerts"
              description="Get notified when stocks hit your target prices"
              checked={settings.alertsEnabled}
              onChange={(v) => setSettings({ ...settings, alertsEnabled: v })}
            />
            
            <ToggleSetting
              label="Telegram Alerts"
              description="Receive alerts via Telegram bot"
              checked={settings.telegramAlerts}
              onChange={(v) => setSettings({ ...settings, telegramAlerts: v })}
            />
            
            {settings.telegramAlerts && (
              <div>
                <label className="text-sm text-gray-400 block mb-2">Telegram Chat ID</label>
                <input
                  type="text"
                  value={settings.telegramChatId}
                  onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                  placeholder="Your Telegram chat ID"
                  className="w-full bg-surface-tertiary border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your chat ID by messaging @userinfobot on Telegram
                </p>
              </div>
            )}
            
            <ToggleSetting
              label="Email Alerts"
              description="Receive daily digest via email"
              checked={settings.emailAlerts}
              onChange={(v) => setSettings({ ...settings, emailAlerts: v })}
            />
          </div>
        </section>
        
        {/* Appearance */}
        <section className="bg-surface-secondary rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Appearance</h2>
              <p className="text-sm text-gray-400">Customize the look and feel</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Theme</label>
              <div className="flex gap-2">
                {(['dark', 'light', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings({ ...settings, theme })}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${settings.theme === theme 
                        ? 'bg-accent text-white' 
                        : 'bg-surface-tertiary text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {theme === 'dark' && <Moon className="w-4 h-4" />}
                    {theme === 'light' && <Sun className="w-4 h-4" />}
                    {theme === 'system' && <Palette className="w-4 h-4" />}
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <ToggleSetting
              label="Compact View"
              description="Show more stocks with smaller cards"
              checked={settings.compactView}
              onChange={(v) => setSettings({ ...settings, compactView: v })}
            />
          </div>
        </section>
        
        {/* API Keys */}
        <section className="bg-surface-secondary rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">API Keys</h2>
              <p className="text-sm text-gray-400">Connect to data providers</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Financial Modeling Prep API Key</label>
              <input
                type="password"
                value={settings.fmpApiKey}
                onChange={(e) => setSettings({ ...settings, fmpApiKey: e.target.value })}
                placeholder="Enter your API key"
                className="w-full bg-surface-tertiary border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent/50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get a free key at{' '}
                <a 
                  href="https://financialmodelingprep.com/developer/docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  financialmodelingprep.com
                </a>
              </p>
            </div>
          </div>
        </section>
        
        {/* Data */}
        <section className="bg-surface-secondary rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Data & Storage</h2>
              <p className="text-sm text-gray-400">Manage your data</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-surface-tertiary rounded-lg hover:bg-white/5 transition-colors">
              <p className="font-medium text-white">Export Watchlist</p>
              <p className="text-sm text-gray-400">Download your watchlist as CSV</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-surface-tertiary rounded-lg hover:bg-white/5 transition-colors">
              <p className="font-medium text-white">Import Watchlist</p>
              <p className="text-sm text-gray-400">Import from CSV or other platforms</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-loss/10 rounded-lg hover:bg-loss/20 transition-colors">
              <p className="font-medium text-loss">Clear All Data</p>
              <p className="text-sm text-gray-400">Delete all local data and settings</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

function ToggleSetting({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-6 rounded-full transition-colors
          ${checked ? 'bg-accent' : 'bg-gray-600'}
        `}
      >
        <span 
          className={`
            absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  )
}
