import yfinance as yf
import pandas as pd
from datetime import datetime

def fetch_stock_info(ticker):
    """
    Fetches meta information about a ticker using yfinance.
    Returns a dict formatted for db.upsert_stock.
    """
    stock = yf.Ticker(ticker)
    info = stock.info
    
    return {
        "ticker": ticker,
        "company_name": info.get("shortName", info.get("longName", ticker)),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "market_cap": info.get("marketCap"),
        "description": info.get("longBusinessSummary"),
        "logo_url": info.get("logo_url", "")
    }

def fetch_daily_prices(ticker, stock_id, period="1mo"):
    """
    Fetches historical OHLCV data.
    Returns a list of tuples for db.upsert_daily_prices.
    """
    stock = yf.Ticker(ticker)
    hist = stock.history(period=period)
    
    if hist.empty:
        return []
        
    prices = []
    for date, row in hist.iterrows():
        # yfinance returns Date as index
        price_date = date.strftime('%Y-%m-%d')
        open_price = row.get("Open")
        high_price = row.get("High")
        low_price = row.get("Low")
        close_price = row.get("Close")
        adj_close = row.get("Adj Close", close_price)
        volume = row.get("Volume")
        
        prices.append((stock_id, price_date, open_price, high_price, low_price, close_price, adj_close, volume))
        
    return prices

def fetch_fundamentals(ticker, stock_id):
    """
    Fetches basic fundamentals (ttm).
    Returns a dict for db.upsert_fundamentals.
    """
    stock = yf.Ticker(ticker)
    info = stock.info
    
    return {
        "stock_id": stock_id,
        "period": "ttm",
        "period_date": datetime.now().strftime('%Y-%m-%d'),
        "revenue": info.get("totalRevenue"),
        "net_income": info.get("netIncomeToCommon"),
        "eps": info.get("trailingEps"),
        "gross_margin": info.get("grossMargins"),
        "net_margin": info.get("profitMargins"),
        "roe": info.get("returnOnEquity"),
        "roa": info.get("returnOnAssets"),
        "pe_ratio": info.get("trailingPE"),
        "pb_ratio": info.get("priceToBook"),
        "ps_ratio": info.get("priceToSalesTrailing12Months"),
        "ev_to_ebitda": info.get("enterpriseToEbitda"),
        "revenue_growth": info.get("revenueGrowth"),
        "earnings_growth": info.get("earningsGrowth"),
        "debt_to_equity": info.get("debtToEquity"),
        "current_ratio": info.get("currentRatio"),
        "dividend_yield": info.get("dividendYield")
    }
