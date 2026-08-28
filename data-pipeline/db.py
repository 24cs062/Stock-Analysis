import os
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "equimind"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres")
    )

def upsert_stock(conn, stock_data):
    """
    Upsert stock metadata. Returns the stock_id.
    stock_data is a dict: { 'ticker': '...', 'company_name': '...', 'sector': '...', ... }
    """
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO stocks (ticker, company_name, sector, industry, market_cap, description, logo_url)
            VALUES (%(ticker)s, %(company_name)s, %(sector)s, %(industry)s, %(market_cap)s, %(description)s, %(logo_url)s)
            ON CONFLICT (ticker) 
            DO UPDATE SET 
                company_name = EXCLUDED.company_name,
                sector = EXCLUDED.sector,
                industry = EXCLUDED.industry,
                market_cap = EXCLUDED.market_cap,
                description = EXCLUDED.description,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id;
        """, stock_data)
        stock_id = cur.fetchone()[0]
        conn.commit()
        return stock_id

def upsert_daily_prices(conn, stock_id, prices_list):
    """
    Upsert daily prices.
    prices_list is a list of tuples: (stock_id, price_date, open, high, low, close, adj_close, volume)
    """
    if not prices_list:
        return
        
    query = """
        INSERT INTO daily_prices (stock_id, price_date, open_price, high_price, low_price, close_price, adj_close, volume)
        VALUES %s
        ON CONFLICT (stock_id, price_date) 
        DO UPDATE SET 
            open_price = EXCLUDED.open_price,
            high_price = EXCLUDED.high_price,
            low_price = EXCLUDED.low_price,
            close_price = EXCLUDED.close_price,
            adj_close = EXCLUDED.adj_close,
            volume = EXCLUDED.volume;
    """
    with conn.cursor() as cur:
        execute_values(cur, query, prices_list)
        conn.commit()

def upsert_fundamentals(conn, stock_id, fundamentals_data):
    """
    Upsert fundamentals.
    fundamentals_data is a dict matching columns.
    """
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO fundamentals (
                stock_id, period, period_date, revenue, net_income, eps, gross_margin, net_margin, roe, roa,
                pe_ratio, pb_ratio, ps_ratio, ev_to_ebitda, revenue_growth, earnings_growth,
                debt_to_equity, current_ratio, dividend_yield, data_source
            ) VALUES (
                %(stock_id)s, %(period)s, %(period_date)s, %(revenue)s, %(net_income)s, %(eps)s, 
                %(gross_margin)s, %(net_margin)s, %(roe)s, %(roa)s, %(pe_ratio)s, %(pb_ratio)s, 
                %(ps_ratio)s, %(ev_to_ebitda)s, %(revenue_growth)s, %(earnings_growth)s,
                %(debt_to_equity)s, %(current_ratio)s, %(dividend_yield)s, 'yahoo'
            )
            ON CONFLICT (stock_id, period, period_date)
            DO UPDATE SET
                revenue = EXCLUDED.revenue,
                net_income = EXCLUDED.net_income,
                eps = EXCLUDED.eps,
                pe_ratio = EXCLUDED.pe_ratio,
                fetched_at = CURRENT_TIMESTAMP;
        """, fundamentals_data)
        conn.commit()
