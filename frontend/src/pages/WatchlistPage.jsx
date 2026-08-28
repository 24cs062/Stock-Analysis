import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getQuotes, getCompanyProfile } from '../services/api';
import '../WatchlistLight.css';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(['AAPL', 'NVDA', 'TSLA', 'JPM', 'NFLX', 'MSFT', 'META', 'GOOGL']);
  const [newTicker, setNewTicker] = useState('');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('default'); // 'default', 'sym_asc', 'sym_desc', 'chg_desc', 'chg_asc'
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'gainers', 'losers'

  const fetchData = async () => {
    if (watchlist.length === 0) {
      setLoading(false);
      return;
    }
    try {
      const q = await getQuotes(watchlist);
      
      const enriched = {};
      await Promise.all(watchlist.map(async (sym) => {
        let name = sym;
        try {
          const profile = await getCompanyProfile(sym);
          if (profile && profile.name) name = profile.name;
        } catch(e) {}
        enriched[sym] = { name, quote: q[sym] };
      }));
      setData(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const removeTicker = (ticker) => {
    setWatchlist(prev => prev.filter(s => s !== ticker));
  };

  const addTicker = () => {
    const t = newTicker.trim().toUpperCase();
    if (!t || watchlist.includes(t)) { setNewTicker(''); return; }
    setWatchlist(prev => [...prev, t]);
    setNewTicker('');
  };

  const handleSortClick = () => {
    const modes = ['default', 'sym_asc', 'sym_desc', 'chg_desc', 'chg_asc'];
    const nextIdx = (modes.indexOf(sortMode) + 1) % modes.length;
    setSortMode(modes[nextIdx]);
  };

  const handleFilterClick = () => {
    const modes = ['all', 'gainers', 'losers'];
    const nextIdx = (modes.indexOf(filterMode) + 1) % modes.length;
    setFilterMode(modes[nextIdx]);
  };

  // Compute the final derived list of rows based on Search, Filter, and Sort
  const processedRows = useMemo(() => {
    // 1. Map to raw row objects
    let rows = watchlist.map(sym => {
      const item = data[sym] || { name: 'Loading...', quote: null };
      return {
        sym,
        name: item.name,
        c: item.quote?.c || 0,
        d: item.quote?.d || 0,
        dp: item.quote?.dp || 0,
        isPos: (item.quote?.dp || 0) >= 0,
        hasData: !!item.quote
      };
    });

    // 2. Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r => r.sym.toLowerCase().includes(q) || r.name.toLowerCase().includes(q));
    }

    // 3. Filter by Gainers/Losers
    if (filterMode === 'gainers') {
      rows = rows.filter(r => r.isPos);
    } else if (filterMode === 'losers') {
      rows = rows.filter(r => !r.isPos);
    }

    // 4. Sort
    if (sortMode === 'sym_asc') rows.sort((a, b) => a.sym.localeCompare(b.sym));
    else if (sortMode === 'sym_desc') rows.sort((a, b) => b.sym.localeCompare(a.sym));
    else if (sortMode === 'chg_desc') rows.sort((a, b) => b.dp - a.dp);
    else if (sortMode === 'chg_asc') rows.sort((a, b) => a.dp - b.dp);

    return rows;
  }, [watchlist, data, searchQuery, sortMode, filterMode]);

  return (
    <div className="watchlist-clone">
      <main className="main">
        <header className="header">
          <div className="title">Watchlist</div>
          <div className="search">
            <span style={{color:'#96a1b0', marginRight:'8px'}}>⌕</span>
            <input 
              type="text" 
              placeholder="Search eg: AAPL, Microsoft..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{flex:1, background:'transparent', border:'none', outline:'none', fontSize:'14px', color:'#17314f'}}
            />
            <div className="search-keys"><span className="key">⌘</span><span className="key">k</span></div>
          </div>
          <div className="head-actions">
            <span style={{cursor:'pointer'}} title="Alerts">♧</span>
            <span style={{cursor:'pointer'}} title="Settings">⚙</span>
            <span className="avatar" style={{cursor:'pointer'}}>EQ</span>
          </div>
        </header>

        <div className="toolbar">
          <div className="add-box">
            <input 
              type="text" 
              placeholder="Add instrument..." 
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTicker()}
            />
            <span className="plus" onClick={addTicker}>+</span>
          </div>
          <div className="counter">{watchlist.length} / 50 symbols</div>
          <div className="toolbar-actions">
            <button className="action-btn" onClick={handleSortClick} title="Cycle sorting modes">
              ⇅&nbsp; Sort: {sortMode === 'default' ? 'Custom' : sortMode.replace('_', ' ').toUpperCase()}
            </button>
            <button className="action-btn" onClick={handleFilterClick} title="Cycle filter modes">
              ⇄&nbsp; Filter: {filterMode.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <colgroup>
              <col style={{width: '16%'}} />
              <col style={{width: '28%'}} />
              <col style={{width: '11%'}} />
              <col style={{width: '12%'}} />
              <col style={{width: '12%'}} />
              <col style={{width: '13%'}} />
              <col style={{width: '8%'}} />
            </colgroup>
            <thead>
              <tr>
                <th>INSTRUMENT</th>
                <th>COMPANY</th>
                <th className="right">LTP</th>
                <th className="right">CHG</th>
                <th className="right">CHG%</th>
                <th className="right">VOLUME</th>
                <th className="right"></th>
              </tr>
            </thead>
            <tbody id="rows">
              {loading && Object.keys(data).length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px', color: '#718198'}}>Loading...</td></tr>
              ) : processedRows.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px', color: '#718198'}}>No symbols match your filters.</td></tr>
              ) : processedRows.map(row => {
                if (!row.hasData) return (
                  <tr key={row.sym}>
                    <td><Link to={`/stocks/${row.sym}`} className="symbol">{row.sym}</Link></td>
                    <td colSpan="5" className="company" style={{marginTop: '22px'}}>Data unavailable</td>
                    <td className="right"><span className="delete-btn" onClick={() => removeTicker(row.sym)}>✕</span></td>
                  </tr>
                );
                
                // Mock volume since we don't have it easily from quote
                const volMock = (Math.random() * 50 + 5).toFixed(1) + 'M';
                
                return (
                  <tr key={row.sym}>
                    <td><Link to={`/stocks/${row.sym}`} className="symbol">{row.sym}</Link></td>
                    <td><span className="company">{row.name}</span></td>
                    <td className="right">{row.c.toFixed(2)}</td>
                    <td className={`right ${row.isPos ? 'green' : 'red'}`}>
                      {row.isPos ? '+' : ''}{row.d.toFixed(2)}
                    </td>
                    <td className={`right ${row.isPos ? 'green' : 'red'}`}>
                      {row.isPos ? '+' : ''}{row.dp.toFixed(2)}%
                    </td>
                    <td className="right company">{volMock}</td>
                    <td className="right"><span className="delete-btn" title="Remove" onClick={() => removeTicker(row.sym)}>✕</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
