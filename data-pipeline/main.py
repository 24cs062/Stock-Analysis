import argparse
import logging
from fetcher import fetch_stock_info, fetch_daily_prices, fetch_fundamentals
from db import get_connection, upsert_stock, upsert_daily_prices, upsert_fundamentals

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

DEFAULT_TICKERS = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"]

def run_pipeline(tickers, limit):
    logging.info(f"Starting pipeline for {len(tickers)} tickers: {tickers}")
    
    conn = None
    try:
        conn = get_connection()
        for ticker in tickers:
            logging.info(f"Processing {ticker}...")
            
            try:
                # 1. Fetch & Store Meta
                info = fetch_stock_info(ticker)
                stock_id = upsert_stock(conn, info)
                
                # 2. Fetch & Store Prices
                prices = fetch_daily_prices(ticker, stock_id, period=f"{limit}d" if limit != "max" else "max")
                upsert_daily_prices(conn, stock_id, prices)
                
                # 3. Fetch & Store Fundamentals
                fundamentals = fetch_fundamentals(ticker, stock_id)
                upsert_fundamentals(conn, stock_id, fundamentals)
                
                logging.info(f"Successfully processed {ticker}!")
                
            except Exception as e:
                logging.error(f"Failed to process {ticker}: {e}")
                
    except Exception as e:
        logging.error(f"Database connection error: {e}")
    finally:
        if conn:
            conn.close()
            
    logging.info("Pipeline execution completed!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="EquiMind Data Pipeline")
    parser.add_argument("--tickers", type=str, help="Comma separated tickers (e.g. AAPL,MSFT)")
    parser.add_argument("--limit", type=str, default="30", help="Days of historical data to fetch (default: 30)")
    
    args = parser.parse_args()
    
    tickers_to_run = args.tickers.split(",") if args.tickers else DEFAULT_TICKERS
    run_pipeline(tickers_to_run, args.limit)
