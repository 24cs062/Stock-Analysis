import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuotes, subscribeToPrices } from '../services/api';
import '../ScreenerLight.css';

const UNIVERSE = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Technology' },
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Financial' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Defensive' },
  { ticker: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy' },
  { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Financial' },
  { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Financial' },
  { ticker: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Defensive' },
  { ticker: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
];

const sectors = ['All', ...new Set(UNIVERSE.map(s => s.sector))];

export default function ScreenerPage() {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [sortKey, setSortKey] = useState('ticker');
  const [sortDir, setSortDir] = useState('asc');
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tickers = UNIVERSE.map(s => s.ticker);
    getQuotes(tickers).then(q => {
      setQuotes(q);
      setLoading(false);
    });
    const interval = setInterval(() => {
      getQuotes(tickers).then(setQuotes);
    }, 60000); // Base REST refresh 1 min

    const unsubscribe = subscribeToPrices(tickers, (trades) => {
      const newPrices = {};
      trades.forEach(t => { newPrices[t.s] = t.p; });
      
      setQuotes(prev => {
        let changed = false;
        const next = { ...prev };
        for (const sym of tickers) {
          if (newPrices[sym] && next[sym] && next[sym].c !== newPrices[sym]) {
            const oldPrice = next[sym].c;
            const newPrice = newPrices[sym];
            next[sym] = { ...next[sym], c: newPrice, d: next[sym].d + (newPrice - oldPrice) };
            next[sym].dp = next[sym].pc ? (next[sym].d / next[sym].pc) * 100 : next[sym].dp;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const getSortIndicator = (key) => {
    if (sortKey !== key) return ' ⇅';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const enriched = useMemo(() => {
    return UNIVERSE.map(s => {
      const q = quotes[s.ticker];
      return { ...s, price: q?.c || 0, change: q?.d || 0, changePct: q?.dp || 0, high: q?.h || 0, low: q?.l || 0 };
    });
  }, [quotes]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  const filtered = useMemo(() => {
    return enriched
      .filter(s => {
        const matchSearch = s.ticker.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
        const matchSector = sector === 'All' || s.sector === sector;
        return matchSearch && matchSector;
      })
      .sort((a, b) => {
        const mul = sortDir === 'asc' ? 1 : -1;
        if (typeof a[sortKey] === 'string') return mul * a[sortKey].localeCompare(b[sortKey]);
        return mul * (a[sortKey] - b[sortKey]);
      });
  }, [enriched, search, sector, sortKey, sortDir]);

  // Reset to page 1 if filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sector, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedResults = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const startResult = filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endResult = Math.min(currentPage * itemsPerPage, filtered.length);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  return (
    <div className="screener-clone">
      <main className="main">
        <section className="content">
          <h1>Stock Screener</h1>
          <div className="meta">
            <span>{loading ? 'LOADING LIVE DATA...' : 'LIVE PRICES'}</span>
            <span>·</span>
            <span>{filtered.length} RESULTS</span>
            <span>·</span>
            <span>AUTO-REFRESH 30S</span>
          </div>

          <div className="filters">
            <div className="searchbox">
              <span style={{color: '#91a0b1', fontSize:'16px'}}>⌕</span>
              <input 
                type="text" 
                placeholder="Search ticker or name..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <div className="chips">
              {sectors.map(s => (
                <button 
                  key={s} 
                  className={`chip ${sector === s ? 'active' : ''}`}
                  onClick={() => setSector(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('ticker')}>SYMBOL<span className="sort">{getSortIndicator('ticker')}</span></th>
                  <th onClick={() => handleSort('name')}>COMPANY<span className="sort">{getSortIndicator('name')}</span></th>
                  <th onClick={() => handleSort('sector')}>SECTOR<span className="sort">{getSortIndicator('sector')}</span></th>
                  <th onClick={() => handleSort('price')} style={{textAlign: 'right'}}>PRICE<span className="sort">{getSortIndicator('price')}</span></th>
                  <th onClick={() => handleSort('change')} style={{textAlign: 'right'}}>CHG<span className="sort">{getSortIndicator('change')}</span></th>
                  <th onClick={() => handleSort('changePct')} style={{textAlign: 'right'}}>CHG%<span className="sort">{getSortIndicator('changePct')}</span></th>
                  <th onClick={() => handleSort('high')} style={{textAlign: 'right'}}>HIGH<span className="sort">{getSortIndicator('high')}</span></th>
                  <th onClick={() => handleSort('low')} style={{textAlign: 'right'}}>LOW<span className="sort">{getSortIndicator('low')}</span></th>
                </tr>
              </thead>
              <tbody id="rows">
                {loading && Object.keys(quotes).length === 0 ? (
                  <tr><td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#718198'}}>Fetching live quotes...</td></tr>
                ) : paginatedResults.length === 0 ? (
                  <tr><td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#718198'}}>No stocks match your filter.</td></tr>
                ) : paginatedResults.map(stock => (
                  <tr key={stock.ticker} onClick={() => navigate(`/stocks/${stock.ticker}`)}>
                    <td className="sym">{stock.ticker}</td>
                    <td className="company">{stock.name}</td>
                    <td className="sector">{stock.sector}</td>
                    <td className="price">{stock.price.toFixed(2)}</td>
                    <td className={stock.change >= 0 ? 'green' : 'red'}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                    </td>
                    <td className={stock.changePct >= 0 ? 'green' : 'red'}>
                      {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                    </td>
                    <td>{stock.high.toFixed(2)}</td>
                    <td>{stock.low.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="footer">
            <div>Showing {startResult}–{endResult} of {filtered.length} results</div>
            <div className="pages">
              <span onClick={handlePrev} style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}>Previous</span>
              <span onClick={handleNext} style={{ opacity: currentPage === totalPages || totalPages === 0 ? 0.3 : 1, cursor: currentPage === totalPages || totalPages === 0 ? 'default' : 'pointer' }}>Next</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
