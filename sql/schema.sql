-- ============================================
-- EquiMind Database Schema
-- PostgreSQL 18
-- ============================================

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. STOCKS (S&P 500 master data)
-- ============================================
CREATE TABLE IF NOT EXISTS stocks (
    id              SERIAL PRIMARY KEY,
    ticker          VARCHAR(10) NOT NULL UNIQUE,
    company_name    VARCHAR(255) NOT NULL,
    sector          VARCHAR(100),
    industry        VARCHAR(200),
    market_cap      BIGINT,
    description     TEXT,
    logo_url        VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stocks_ticker ON stocks(ticker);
CREATE INDEX idx_stocks_sector ON stocks(sector);

-- ============================================
-- 3. DAILY PRICES (Historical OHLCV)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_prices (
    id              SERIAL PRIMARY KEY,
    stock_id        INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    price_date      DATE NOT NULL,
    open_price      DECIMAL(12, 4),
    high_price      DECIMAL(12, 4),
    low_price       DECIMAL(12, 4),
    close_price     DECIMAL(12, 4),
    adj_close       DECIMAL(12, 4),
    volume          BIGINT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(stock_id, price_date)
);

CREATE INDEX idx_daily_prices_stock_date ON daily_prices(stock_id, price_date DESC);

-- ============================================
-- 4. FUNDAMENTALS (Financial ratios & metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS fundamentals (
    id              SERIAL PRIMARY KEY,
    stock_id        INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    period          VARCHAR(20) NOT NULL,           -- 'annual', 'quarterly', 'ttm'
    period_date     DATE,

    -- Profitability
    revenue         BIGINT,
    net_income      BIGINT,
    eps             DECIMAL(10, 4),
    gross_margin    DECIMAL(8, 4),
    net_margin      DECIMAL(8, 4),
    roe             DECIMAL(8, 4),                  -- Return on Equity
    roa             DECIMAL(8, 4),                  -- Return on Assets

    -- Valuation
    pe_ratio        DECIMAL(10, 4),                 -- Price-to-Earnings
    pb_ratio        DECIMAL(10, 4),                 -- Price-to-Book
    ps_ratio        DECIMAL(10, 4),                 -- Price-to-Sales
    ev_to_ebitda    DECIMAL(10, 4),

    -- Growth
    revenue_growth  DECIMAL(8, 4),                  -- YoY revenue growth
    earnings_growth DECIMAL(8, 4),                  -- YoY earnings growth

    -- Leverage
    debt_to_equity  DECIMAL(8, 4),
    current_ratio   DECIMAL(8, 4),

    -- Dividends
    dividend_yield  DECIMAL(8, 4),

    data_source     VARCHAR(50) DEFAULT 'yahoo',
    fetched_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(stock_id, period, period_date)
);

CREATE INDEX idx_fundamentals_stock ON fundamentals(stock_id);

-- ============================================
-- 5. TECHNICAL INDICATORS
-- ============================================
CREATE TABLE IF NOT EXISTS technical_indicators (
    id              SERIAL PRIMARY KEY,
    stock_id        INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    indicator_date  DATE NOT NULL,

    -- RSI (14-period)
    rsi_14          DECIMAL(8, 4),

    -- MACD (12, 26, 9)
    macd_line       DECIMAL(12, 6),
    macd_signal     DECIMAL(12, 6),
    macd_histogram  DECIMAL(12, 6),

    -- Bollinger Bands (20-period, ±2 std dev)
    bb_upper        DECIMAL(12, 4),
    bb_middle       DECIMAL(12, 4),
    bb_lower        DECIMAL(12, 4),

    -- Moving Averages
    sma_20          DECIMAL(12, 4),
    sma_50          DECIMAL(12, 4),
    sma_200         DECIMAL(12, 4),
    ema_12          DECIMAL(12, 4),
    ema_26          DECIMAL(12, 4),

    computed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(stock_id, indicator_date)
);

CREATE INDEX idx_indicators_stock_date ON technical_indicators(stock_id, indicator_date DESC);

-- ============================================
-- 6. EQUIMIND SCORES
-- ============================================
CREATE TABLE IF NOT EXISTS equimind_scores (
    id                  SERIAL PRIMARY KEY,
    stock_id            INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    score_date          DATE NOT NULL,

    total_score         DECIMAL(5, 2),              -- 0.00 to 100.00
    profitability_score DECIMAL(5, 2),
    growth_score        DECIMAL(5, 2),
    valuation_score     DECIMAL(5, 2),

    metrics_used        INTEGER,                    -- e.g. "8 of 9"
    metrics_total       INTEGER,
    explanation         TEXT,                        -- "Strong profitability, demanding valuation"

    computed_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(stock_id, score_date)
);

CREATE INDEX idx_scores_stock ON equimind_scores(stock_id);

-- ============================================
-- 7. AI SUMMARIES
-- ============================================
CREATE TABLE IF NOT EXISTS ai_summaries (
    id              SERIAL PRIMARY KEY,
    stock_id        INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,

    summary         TEXT,
    bull_case       TEXT,
    risk_factors    TEXT,
    sentiment       VARCHAR(20),                    -- 'BULLISH', 'BEARISH', 'NEUTRAL'
    sentiment_reason TEXT,

    model_name      VARCHAR(100),                   -- e.g. 'mistral-7b-instruct'
    data_sources    TEXT,                            -- JSON array: ["financials","technicals","news"]
    generated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(stock_id)
);

CREATE INDEX idx_ai_summaries_stock ON ai_summaries(stock_id);

-- ============================================
-- 8. WATCHLIST
-- ============================================
CREATE TABLE IF NOT EXISTS watchlist (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id        INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    added_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, stock_id)
);

CREATE INDEX idx_watchlist_user ON watchlist(user_id);

-- ============================================
-- 9. PORTFOLIO HOLDINGS
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id        INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    quantity        DECIMAL(12, 4) NOT NULL,
    avg_buy_price   DECIMAL(12, 4) NOT NULL,
    added_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, stock_id)
);

CREATE INDEX idx_portfolio_user ON portfolio_holdings(user_id);

-- ============================================
-- 10. PIPELINE STATUS
-- ============================================
CREATE TABLE IF NOT EXISTS pipeline_status (
    id                  SERIAL PRIMARY KEY,
    run_id              UUID DEFAULT gen_random_uuid(),
    started_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at        TIMESTAMP,
    status              VARCHAR(20) DEFAULT 'RUNNING',  -- 'RUNNING', 'SUCCESS', 'FAILED'
    stocks_processed    INTEGER DEFAULT 0,
    stocks_total        INTEGER DEFAULT 0,
    prices_fetched      INTEGER DEFAULT 0,
    fundamentals_fetched INTEGER DEFAULT 0,
    indicators_computed INTEGER DEFAULT 0,
    ai_summaries_generated INTEGER DEFAULT 0,
    errors              INTEGER DEFAULT 0,
    error_details       TEXT,
    duration_seconds    INTEGER
);

-- ============================================
-- 11. NEWS
-- ============================================
CREATE TABLE IF NOT EXISTS news (
    id              SERIAL PRIMARY KEY,
    stock_id        INTEGER NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    url             VARCHAR(1000),
    source_name     VARCHAR(100),
    published_at    TIMESTAMP,
    sentiment_label VARCHAR(20),                    -- 'POSITIVE', 'NEGATIVE', 'NEUTRAL'
    sentiment_score DECIMAL(5, 4),
    fetched_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_stock ON news(stock_id);
CREATE INDEX idx_news_published ON news(published_at DESC);

-- ============================================
-- DONE
-- ============================================
