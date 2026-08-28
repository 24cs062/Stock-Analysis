import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getQuotes, getCompanyProfile, getCandles } from '../services/api';
import '../PortfolioLight.css';

const initialHoldings = [
  { ticker: 'AAPL', shares: 50, avgCost: 150.00 },
  { ticker: 'MSFT', shares: 20, avgCost: 280.00 },
  { ticker: 'NVDA', shares: 10, avgCost: 300.00 },
  { ticker: 'JPM', shares: 30, avgCost: 140.00 },
  { ticker: 'JNJ', shares: 25, avgCost: 165.00 },
  { ticker: 'XOM', shares: 40, avgCost: 95.00 },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realPerfData, setRealPerfData] = useState([]);
  
  // Interactive States
  const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });
  const [activeSector, setActiveSector] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const tickers = initialHoldings.map(h => h.ticker);
        const q = await getQuotes(tickers);
        
        const enriched = await Promise.all(initialHoldings.map(async (h) => {
          let name = h.ticker, sector = 'Other';
          try {
            const profile = await getCompanyProfile(h.ticker);
            if (profile) {
              name = profile.name || name;
              sector = profile.finnhubIndustry || sector;
            }
          } catch(e) {}
          
          const current = q[h.ticker]?.c || h.avgCost;
          const value = h.shares * current;
          const cost = h.shares * h.avgCost;
          const pl = value - cost;
          const plPct = (pl / cost) * 100;
          
          return { ...h, name, sector, current, value, cost, pl, plPct };
        }));
        
        // Fetch accurate historical data for the last 6 months
        const to = Math.floor(Date.now() / 1000);
        const from = Math.floor((Date.now() - 180 * 86400000) / 1000);
        const monthlyData = {};
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        
        await Promise.all(initialHoldings.map(async (h) => {
           try {
             const candles = await getCandles(h.ticker, 'M', from, to);
             if (candles && candles.s === 'ok') {
               for (let i = 0; i < candles.t.length; i++) {
                  const date = new Date(candles.t[i] * 1000);
                  const monthStr = monthNames[date.getMonth()];
                  const val = candles.c[i] * h.shares;
                  monthlyData[monthStr] = (monthlyData[monthStr] || 0) + val;
               }
             }
           } catch(e) {}
        }));

        const histChart = [];
        for (let i = 5; i >= 0; i--) {
           const d = new Date();
           d.setMonth(d.getMonth() - i);
           const mStr = monthNames[d.getMonth()];
           if (monthlyData[mStr]) {
              histChart.push({ m: mStr, val: monthlyData[mStr] });
           }
        }
        
        if (histChart.length > 0) {
           setRealPerfData(histChart);
        }

        setHoldings(enriched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute Metrics globally (ignoring filter so top boxes always show total portfolio)
  const totalValue = holdings.reduce((a, h) => a + h.value, 0);
  const totalCost = holdings.reduce((a, h) => a + h.cost, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  // Sector allocation (Top 5)
  const sectorMap = {};
  holdings.forEach(h => { sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.value; });
  let sectorData = Object.entries(sectorMap).map(([name, value]) => ({ name, value }));
  sectorData.sort((a, b) => b.value - a.value); // Sort descending
  
  if (sectorData.length > 5) {
    const top4 = sectorData.slice(0, 4);
    const restValue = sectorData.slice(4).reduce((sum, s) => sum + s.value, 0);
    top4.push({ name: 'Other', value: restValue });
    sectorData = top4;
  }
  sectorData = sectorData.map((s, i) => ({ ...s, pct: totalValue > 0 ? (s.value / totalValue * 100).toFixed(1) : 0, idx: i + 1 }));

  // Filter and Sort Holdings
  const processedHoldings = useMemo(() => {
    let filtered = holdings;
    if (activeSector) {
      if (activeSector === 'Other') {
        const top4Names = sectorData.slice(0,4).map(s => s.name);
        filtered = holdings.filter(h => !top4Names.includes(h.sector));
      } else {
        filtered = holdings.filter(h => h.sector === activeSector);
      }
    }

    filtered.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [holdings, activeSector, sortConfig, sectorData]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #e2e8ef', padding: '8px', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: 0, fontSize: '10px', color: '#718097', fontWeight: 600 }}>{payload[0].payload.m}</p>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#162b47', fontWeight: 700 }}>${payload[0].value.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="portfolio-clone">
      <main className="main">
        <div className="content">
          <div className="page-head">
            <div>
              <div className="page-title">Portfolio</div>
              <div className="subtitle">{holdings.length} POSITIONS &nbsp;&nbsp;·&nbsp;&nbsp; {loading ? 'FETCHING...' : 'LIVE DATA'}</div>
            </div>
          </div>

          <section className="metrics">
            <div className="metric">
              <div className="metric-label">TOTAL VALUE</div>
              <div className="metric-value">{loading ? '--' : `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</div>
            </div>
            <div className="metric">
              <div className="metric-label">COST BASIS</div>
              <div className="metric-value">{loading ? '--' : `$${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</div>
            </div>
            <div className="metric">
              <div className="metric-label">TOTAL P&amp;L</div>
              <div className={`metric-value ${totalPL >= 0 ? 'metric-green' : 'metric-red'}`}>
                {!loading && (totalPL >= 0 ? '+' : '')}{loading ? '--' : `$${totalPL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">RETURN</div>
              <div className={`metric-value ${totalPLPct >= 0 ? 'metric-green' : 'metric-red'}`}>
                {!loading && (totalPLPct >= 0 ? '+' : '')}{loading ? '--' : `${totalPLPct.toFixed(2)}%`}
              </div>
            </div>
          </section>

          <div className="mid">
            <section className="card chart-card">
              <div className="card-title">PORTFOLIO VALUE <span className="trend">TRUE 6 MONTH TREND</span></div>
              <div className="chart">
                {loading || realPerfData.length === 0 ? (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#91a0b4', fontSize: '13px', fontFamily: 'monospace' }}>
                    Loading Chart...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realPerfData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fillGrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#d8d6ff" stopOpacity={0.95}/>
                          <stop offset="100%" stopColor="#e8e7ff" stopOpacity={0.18}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill: '#9aa5b4', fontSize: 11}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9aa5b4', fontSize: 11}} orientation="right" tickFormatter={v => `$${(v/1000).toFixed(1)}k`} domain={['dataMin - 2000', 'dataMax + 2000']} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9aa5b4', strokeWidth: 1, strokeDasharray: "3 3" }} />
                      <Area type="monotone" dataKey="val" stroke="#5147ea" strokeWidth={2.5} fill="url(#fillGrad)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="card alloc">
              <div className="card-title">ALLOCATION {activeSector && <span style={{float:'right', color:'#f34e65', cursor:'pointer', fontSize:'10px'}} onClick={()=>setActiveSector(null)}>✕ Clear Filter</span>}</div>
              <div className="alloc-bar">
                {sectorData.map(s => (
                  <div key={s.name} className={`seg${s.idx}`} style={{ width: `${s.pct}%`, opacity: activeSector && activeSector !== s.name ? 0.3 : 1, transition: 'opacity 0.2s' }}></div>
                ))}
              </div>
              <div className="alloc-list">
                {sectorData.map(s => (
                  <div 
                    className="alloc-row" 
                    key={s.name} 
                    onClick={() => setActiveSector(s.name === activeSector ? null : s.name)}
                    style={{ cursor: 'pointer', background: activeSector === s.name ? '#f8fafc' : 'transparent', opacity: activeSector && activeSector !== s.name ? 0.5 : 1, transition: 'all 0.2s' }}
                  >
                    <span className={`swatch sw${s.idx}`}></span>
                    <span className="alloc-name">{s.name}</span>
                    <span className="alloc-pct">{s.pct}%</span>
                    <span className="alloc-val">${s.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="card holdings">
            <div className="hold-title">{activeSector ? `${activeSector.toUpperCase()} HOLDINGS` : 'LIVE HOLDINGS'}</div>
            <table className="hold-table">
              <colgroup>
                <col style={{width: '10%'}} />
                <col style={{width: '24%'}} />
                <col style={{width: '8%'}} />
                <col style={{width: '12%'}} />
                <col style={{width: '11%'}} />
                <col style={{width: '14%'}} />
                <col style={{width: '11%'}} />
                <col style={{width: '10%'}} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{cursor:'pointer'}} onClick={() => handleSort('ticker')}>SYMBOL{getSortIndicator('ticker')}</th>
                  <th style={{cursor:'pointer'}} onClick={() => handleSort('name')}>COMPANY{getSortIndicator('name')}</th>
                  <th className="r" style={{cursor:'pointer'}} onClick={() => handleSort('shares')}>QTY{getSortIndicator('shares')}</th>
                  <th className="r" style={{cursor:'pointer'}} onClick={() => handleSort('avgCost')}>AVG COST{getSortIndicator('avgCost')}</th>
                  <th className="r" style={{cursor:'pointer'}} onClick={() => handleSort('current')}>LAST{getSortIndicator('current')}</th>
                  <th className="r" style={{cursor:'pointer'}} onClick={() => handleSort('value')}>MKT VALUE{getSortIndicator('value')}</th>
                  <th className="r" style={{cursor:'pointer'}} onClick={() => handleSort('pl')}>P&amp;L{getSortIndicator('pl')}</th>
                  <th className="r" style={{cursor:'pointer'}} onClick={() => handleSort('plPct')}>RETURN{getSortIndicator('plPct')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#718198'}}>Loading live holdings...</td></tr>
                ) : processedHoldings.length === 0 ? (
                  <tr><td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#718198'}}>No holdings match this sector.</td></tr>
                ) : processedHoldings.map(h => (
                  <tr key={h.ticker}>
                    <td><Link to={`/stocks/${h.ticker}`} className="sym" style={{textDecoration:'none'}}>{h.ticker}</Link></td>
                    <td className="company">{h.name}</td>
                    <td className="r">{h.shares}</td>
                    <td className="r">{h.avgCost.toFixed(2)}</td>
                    <td className="r">{h.current.toFixed(2)}</td>
                    <td className="r">${h.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className={`r ${h.pl >= 0 ? 'green' : 'red'}`}>
                      {h.pl >= 0 ? '+' : ''}${h.pl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className={`r ${h.plPct >= 0 ? 'green' : 'red'}`}>
                      {h.plPct >= 0 ? '+' : ''}{h.plPct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}
