-- Stock Watcher Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    telegram_chat_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlist items
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    target_price DECIMAL(12, 2) NOT NULL,
    fair_value DECIMAL(12, 2),
    notes TEXT,
    category TEXT DEFAULT 'core' CHECK (category IN ('core', 'growth', 'speculative', 'dividend')),
    alert_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

-- Price alerts
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    watchlist_id UUID REFERENCES public.watchlist(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    target_price DECIMAL(12, 2) NOT NULL,
    triggered_price DECIMAL(12, 2),
    alert_type TEXT DEFAULT 'price_below' CHECK (alert_type IN ('price_below', 'price_above', 'percent_change')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'triggered', 'dismissed')),
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio holdings
CREATE TABLE IF NOT EXISTS public.portfolio (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    shares DECIMAL(12, 4) NOT NULL,
    avg_cost DECIMAL(12, 2) NOT NULL,
    category TEXT DEFAULT 'core' CHECK (category IN ('core', 'growth', 'speculative', 'dividend')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES public.portfolio(id) ON DELETE SET NULL,
    symbol TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'dividend')),
    shares DECIMAL(12, 4) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    total DECIMAL(14, 2) NOT NULL,
    fees DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock cache (to reduce API calls)
CREATE TABLE IF NOT EXISTS public.stock_cache (
    symbol TEXT PRIMARY KEY,
    name TEXT,
    sector TEXT,
    price DECIMAL(12, 2),
    change DECIMAL(12, 2),
    change_percent DECIMAL(8, 4),
    market_cap BIGINT,
    pe DECIMAL(10, 2),
    volume BIGINT,
    fundamentals JSONB,
    score JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    alerts_enabled BOOLEAN DEFAULT true,
    telegram_alerts BOOLEAN DEFAULT true,
    email_alerts BOOLEAN DEFAULT false,
    theme TEXT DEFAULT 'dark',
    compact_view BOOLEAN DEFAULT false,
    default_currency TEXT DEFAULT 'USD',
    fmp_api_key TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_symbol ON public.watchlist(symbol);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_user ON public.portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_cache_updated ON public.stock_cache(updated_at);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own watchlist" ON public.watchlist
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts" ON public.alerts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own portfolio" ON public.portfolio
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Stock cache is public read
CREATE POLICY "Stock cache is readable by all" ON public.stock_cache
    FOR SELECT TO authenticated USING (true);

-- Functions

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlist_updated_at
    BEFORE UPDATE ON public.watchlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at
    BEFORE UPDATE ON public.portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check and create alerts for price targets
CREATE OR REPLACE FUNCTION check_price_alerts()
RETURNS void AS $$
DECLARE
    w RECORD;
    current_price DECIMAL(12, 2);
BEGIN
    FOR w IN 
        SELECT wl.*, sc.price as current_price
        FROM public.watchlist wl
        JOIN public.stock_cache sc ON wl.symbol = sc.symbol
        WHERE wl.alert_enabled = true
        AND sc.price <= wl.target_price
        AND NOT EXISTS (
            SELECT 1 FROM public.alerts a 
            WHERE a.watchlist_id = wl.id 
            AND a.status = 'pending'
        )
    LOOP
        INSERT INTO public.alerts (user_id, watchlist_id, symbol, target_price, triggered_price, status, triggered_at)
        VALUES (w.user_id, w.id, w.symbol, w.target_price, w.current_price, 'triggered', NOW());
    END LOOP;
END;
$$ LANGUAGE plpgsql;
