import React, { useState, useEffect } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getQuotes, getCandles, subscribeToPrices } from '../services/api';
import '../DashboardLight.css';

const INDICES = ['SPY', 'QQQ', 'DIA', 'IWM'];

const QuoteCard = ({ title, ticker, data, loading, active, onClick }) => {
  const [flash, setFlash] = useState('');
  useEffect(() => {
    if (data && data.c) {
      setFlash('bg-[#eef4ff]');
      const timer = setTimeout(() => setFlash(''), 300);
      return () => clearTimeout(timer);
    }
  }, [data?.c]);

  if (loading || !data) {
    return (
      <div className="card quote animate-pulse" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="label">{title} ({ticker})</div>
        <div className="value text-[#91a0b4]">--</div>
      </div>
    );
  }
  const isPos = data.d >= 0;
  return (
    <div className={`card quote transition-colors duration-300 ${flash}`} onClick={onClick} style={{ cursor: 'pointer', outline: active ? '2px solid #2563eb' : 'none' }}>
      <div className="label">{title} ({ticker})</div>
      <div className="value">{data.c?.toFixed(2)}</div>
      <div className={`chg ${isPos ? 'green' : 'red'}`}>
        {isPos ? '↗ +' : '↘ '}{data.d?.toFixed(2)} ({isPos ? '+' : ''}{data.dp?.toFixed(2)}%)
      </div>
    </div>
  );
};

const WatchRow = ({ sym, name, data, active, onClick }) => {
  const [flash, setFlash] = useState('');
  useEffect(() => {
    if (data && data.c) {
      setFlash('bg-[#eef4ff]');
      const timer = setTimeout(() => setFlash(''), 300);
      return () => clearTimeout(timer);
    }
  }, [data?.c]);

  if (!data) return (
    <div className="watch-row" onClick={onClick} style={{ cursor: 'pointer', background: active ? '#f0f5ff' : '' }}>
      <div className="inst">{sym} <div className="company">{name}</div></div>
      <div className="last text-[#91a0b4]">--</div>
      <div className="chg text-[#91a0b4]">--</div>
    </div>
  );
  
  const isPos = data.dp >= 0;
  return (
    <div className={`watch-row transition-colors duration-300 ${flash}`} onClick={onClick} style={{ cursor: 'pointer', background: active ? '#f0f5ff' : '' }}>
      <div className="inst">{sym} <div className="company">{name}</div></div>
      <div className="last">{data.c?.toFixed(2)}</div>
      <div className={`chg ${isPos ? 'green' : 'red'}`}>{isPos ? '+' : ''}{data.dp?.toFixed(2)}%</div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e5eaf1] p-2 rounded shadow-md z-50 relative">
        <p className="text-[#718198] text-[9px] font-mono mb-1">{label}</p>
        <p className="text-[11px] font-bold text-[#071933]">
          Price: ${payload[0].value?.toFixed(2)}
        </p>
        {payload[1] && (
          <p className="text-[11px] font-bold text-[#f59e0b]">
            SMA: ${payload[1].value?.toFixed(2)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [watchlists, setWatchlists] = useState({
    'Watchlist 1': [
      { sym: 'AAPL', name: 'Apple Inc.' },
      { sym: 'NVDA', name: 'NVIDIA Corp' },
      { sym: 'MSFT', name: 'Microsoft' },
      { sym: 'TSLA', name: 'Tesla Inc' },
      { sym: 'AMZN', name: 'Amazon.com' },
      { sym: 'GOOGL', name: 'Alphabet Inc' },
      { sym: 'META', name: 'Meta Platforms' }
    ],
    'Tech': [
      { sym: 'PLTR', name: 'Palantir' },
      { sym: 'AMD', name: 'Advanced Micro Devices' },
      { sym: 'INTC', name: 'Intel Corp' },
      { sym: 'SMCI', name: 'Super Micro' }
    ]
  });

  const [margin, setMargin] = useState(42584.50);
  const [showSMA, setShowSMA] = useState(false);

  const [indexQuotes, setIndexQuotes] = useState({});
  const [positions, setPositions] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  
  const [activeSymbol, setActiveSymbol] = useState('SPY');
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const [activeWatchlist, setActiveWatchlist] = useState('Watchlist 1');
  const [activePosTab, setActivePosTab] = useState('Positions');

  const tfMap = {
    '1D': { res: '5Min', days: 1 },
    '5D': { res: '15Min', days: 5 },
    '1M': { res: '1Day', days: 30 },
    '6M': { res: '1Day', days: 180 },
    'YTD': { res: '1Day', days: 365 }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const allSymbols = [...new Set(Object.values(watchlists).flat().map(w => w.sym))];
        const [idxQ, posQ] = await Promise.all([
          getQuotes(INDICES),
          getQuotes(allSymbols),
        ]);
        setIndexQuotes(idxQ);
        setPositions(posQ);
      } catch (e) {
        console.error('Initial fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();

    // Re-subscribe if watchlists change (simplified to just a 1-minute poller for dynamically added symbols for safety)
    const interval = setInterval(fetchInitial, 60000);

    const allSymbols = [...new Set(Object.values(watchlists).flat().map(w => w.sym))];
    const unsubscribe = subscribeToPrices([...INDICES, ...allSymbols], (trades) => {
      const newPrices = {};
      trades.forEach(t => { newPrices[t.s] = t.p; });
      
      setIndexQuotes(prev => {
        let changed = false;
        const next = { ...prev };
        for (const sym of INDICES) {
          if (newPrices[sym] && next[sym] && next[sym].c !== newPrices[sym]) {
            const oldPrice = next[sym].c;
            const newPrice = newPrices[sym];
            next[sym] = { ...next[sym], c: newPrice, d: next[sym].d + (newPrice - oldPrice) };
            next[sym].dp = (next[sym].d / next[sym].pc) * 100;
            changed = true;
          }
        }
        return changed ? next : prev;
      });

      setPositions(prev => {
        let changed = false;
        const next = { ...prev };
        for (const sym of allSymbols) {
          if (newPrices[sym] && next[sym] && next[sym].c !== newPrices[sym]) {
            const oldPrice = next[sym].c;
            const newPrice = newPrices[sym];
            next[sym] = { ...next[sym], c: newPrice, d: next[sym].d + (newPrice - oldPrice) };
            next[sym].dp = (next[sym].d / next[sym].pc) * 100;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    });

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [watchlists]);

  useEffect(() => {
    const fetchChart = async () => {
      setChartLoading(true);
      try {
        const config = tfMap[activeTimeframe];
        const from = Math.floor((Date.now() - config.days * 86400000) / 1000);
        const to = Math.floor(Date.now() / 1000);
        
        let resString = '1Day';
        if (config.res === '5Min') resString = '5';
        if (config.res === '15Min') resString = '15';

        const candles = await getCandles(activeSymbol, resString, from, to);
        if (candles && candles.s === 'ok') {
          const cd = candles.t.map((ts, i) => {
            const dateObj = new Date(ts * 1000);
            const formatStr = (activeTimeframe === '1D' || activeTimeframe === '5D') 
              ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Calculate 5-period SMA
            let sma = null;
            if (i >= 4) {
               sma = candles.c.slice(i-4, i+1).reduce((a,b)=>a+b, 0) / 5;
            }

            return {
              date: formatStr,
              price: candles.c[i],
              sma: sma
            };
          });
          setChartData(cd);
        } else {
          setChartData([]);
        }
      } catch (e) {
        console.error('Chart fetch error:', e);
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, [activeSymbol, activeTimeframe]);

  const handleAddSymbol = () => {
    const sym = window.prompt(`Enter a ticker symbol to add to ${activeWatchlist}:`);
    if (sym && sym.trim()) {
      const cleanSym = sym.trim().toUpperCase();
      setWatchlists(prev => {
        if (prev[activeWatchlist].find(w => w.sym === cleanSym)) return prev; // Avoid duplicates
        return {
          ...prev,
          [activeWatchlist]: [...prev[activeWatchlist], { sym: cleanSym, name: cleanSym }]
        };
      });
      // Trigger an immediate quote fetch for the new symbol
      getQuotes([cleanSym]).then(q => setPositions(p => ({...p, ...q})));
    }
  };

  const handleAddFunds = () => {
    const amtStr = window.prompt('Enter deposit amount:', '1000');
    const amt = parseFloat(amtStr);
    if (!isNaN(amt) && amt > 0) {
      setMargin(m => m + amt);
    }
  };

  const activeData = indexQuotes[activeSymbol] || positions[activeSymbol];
  const isPos = activeData?.d >= 0;
  const activeName = watchlists['Watchlist 1']?.find(w => w.sym === activeSymbol)?.name 
    || watchlists['Tech']?.find(w => w.sym === activeSymbol)?.name 
    || activeSymbol;

  return (
    <div className="equimind-clone">
      <div className="main">
        <section className="content">
          <div className="market-row">
            <QuoteCard title="S&P 500" ticker="SPY" data={indexQuotes['SPY']} loading={loading} active={activeSymbol==='SPY'} onClick={() => setActiveSymbol('SPY')} />
            <QuoteCard title="NASDAQ" ticker="QQQ" data={indexQuotes['QQQ']} loading={loading} active={activeSymbol==='QQQ'} onClick={() => setActiveSymbol('QQQ')} />
            <QuoteCard title="DOW JONES" ticker="DIA" data={indexQuotes['DIA']} loading={loading} active={activeSymbol==='DIA'} onClick={() => setActiveSymbol('DIA')} />
            <QuoteCard title="RUSSELL 2K" ticker="IWM" data={indexQuotes['IWM']} loading={loading} active={activeSymbol==='IWM'} onClick={() => setActiveSymbol('IWM')} />
            <div className="card margin">
              <div className="label">Available Margin <span style={{float:'right', color:'#8b97a8', cursor:'help'}} title="Margin details">ⓘ</span></div>
              <div className="value">${margin.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              <div className="used">Used: $1,242.00</div>
              <div className="add" style={{cursor:'pointer'}} onClick={handleAddFunds}>Add funds</div>
            </div>
          </div>

          <div className="workspace">
            <div className="leftcol">
              <div className="card chart-card">
                <div className="chart-head">
                  <span className="symbol">{activeSymbol}</span>
                  <span className="sub">{activeName}</span>
                  {activeData && (
                    <span className="pill" style={{ color: isPos ? '#0aa878' : '#f24467', background: isPos ? '#e7fbf4' : '#fee3ea', transition: 'all 0.3s' }}>
                      {activeData.c?.toFixed(2)} {isPos ? '+' : ''}{activeData.dp?.toFixed(2)}%
                    </span>
                  )}
                  <div className="periods">
                    {['1D', '5D', '1M', '6M', 'YTD'].map(tf => (
                       <span key={tf} className={activeTimeframe === tf ? 'sel' : ''} onClick={() => setActiveTimeframe(tf)}>{tf}</span>
                    ))}
                    <span 
                      style={{ marginLeft: '10px', cursor:'pointer', color: showSMA ? '#f59e0b' : 'inherit' }} 
                      onClick={() => setShowSMA(!showSMA)}
                    >
                      ⌁ SMA
                    </span>
                  </div>
                </div>
                <div className="chart">
                  {chartLoading ? (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#91a0b4', fontSize: '13px', fontFamily: 'monospace' }}>
                      Loading Chart...
                    </div>
                  ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#dce8ff" stopOpacity={0.85}/>
                            <stop offset="100%" stopColor="#eef4ff" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide={true} />
                        <YAxis yAxisId="left" domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']} hide={true} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9bbdff', strokeWidth: 1, strokeDasharray: "3 3" }} />
                        <Area yAxisId="left" type="monotone" dataKey="price" stroke="#2b68f2" strokeWidth={1.6} fill="url(#areaGrad)" isAnimationActive={false} />
                        {showSMA && <Line yAxisId="left" type="monotone" dataKey="sma" stroke="#f59e0b" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#91a0b4', fontSize: '13px', fontFamily: 'monospace' }}>
                      No data available for {activeTimeframe}.
                    </div>
                  )}
                </div>
              </div>

              <div className="bottom-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="card depth">
                  <div className="card-title">Market Depth <span style={{float:'right', color:'#7e8c9f'}}>L2</span></div>
                  <div className="depth-head"><span>BID</span><span>QTY</span><span>ASK</span><span>QTY</span></div>
                  {[
                    { bOffset: 0.02, bQty: '1,200', aOffset: 0.05, aQty: '900' },
                    { bOffset: 0.04, bQty: '850', aOffset: 0.08, aQty: '4,500' },
                    { bOffset: 0.07, bQty: '3,400', aOffset: 0.10, aQty: '550' },
                    { bOffset: 0.12, bQty: '400', aOffset: 0.15, aQty: '2,100' }
                  ].map((row, i) => {
                    const base = activeData?.c || 100.00;
                    return (
                      <div className="depth-row" key={i}>
                        <span className="bid">{(base - row.bOffset).toFixed(2)}</span>
                        <span style={{textAlign:'right'}}>{row.bQty}</span>
                        <span className="ask" style={{paddingLeft:'7px'}}>{(base + row.aOffset).toFixed(2)}</span>
                        <span style={{textAlign:'right'}}>{row.aQty}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="card watch">
              <div className="tabs">
                {Object.keys(watchlists).map(tab => (
                  <div key={tab} className={`tab ${activeWatchlist === tab ? 'active' : ''}`} onClick={() => setActiveWatchlist(tab)} style={{cursor: 'pointer'}}>
                    {tab}
                  </div>
                ))}
                <div className="watch-actions" style={{cursor:'pointer'}} onClick={handleAddSymbol}>＋ ⋮</div>
              </div>
              <div className="watch-head">
                <div>Instrument</div>
                <div style={{textAlign:'right'}}>Last</div>
                <div style={{textAlign:'right'}}>Chg%</div>
              </div>
              <div id="watchRows">
                {watchlists[activeWatchlist].map(({sym, name}) => (
                  <WatchRow key={sym} sym={sym} name={name} data={positions[sym]} active={activeSymbol === sym} onClick={() => setActiveSymbol(sym)} />
                ))}
              </div>
            </aside>
          </div>

          <div className="card positions">
            <div className="pos-head">
              {['Positions', 'Open Orders', 'Executed'].map((tab, idx) => (
                 <div key={tab} className={`pos-tab ${activePosTab === tab ? 'active' : ''}`} onClick={() => setActivePosTab(tab)} style={{cursor:'pointer'}}>
                   {tab} {idx === 0 ? '(2)' : idx === 2 ? '(14)' : '(0)'}
                 </div>
              ))}
              <div className="total">Total P&amp;L: <b>+$1,245.00</b></div>
            </div>
            
            {activePosTab === 'Positions' && (
              <table>
                <thead>
                  <tr>
                    <th style={{width:'30px'}}>□</th>
                    <th>Instrument</th>
                    <th>Product</th>
                    <th className="num">Qty</th>
                    <th className="num">Avg. Price</th>
                    <th className="num">LTP</th>
                    <th className="num">Current Value</th>
                    <th className="num">P&amp;L</th>
                    <th className="num">Chg%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{cursor:'pointer', background: activeSymbol === 'AAPL' ? '#f0f5ff' : ''}} onClick={() => setActiveSymbol('AAPL')}>
                    <td>□</td>
                    <td><span className="badge">CNC</span>AAPL</td>
                    <td>EQ</td>
                    <td className="num">50</td>
                    <td className="num">210.00</td>
                    <td className="num">{positions['AAPL']?.c?.toFixed(2) || '220.50'}</td>
                    <td className="num">${((positions['AAPL']?.c || 220.50) * 50).toLocaleString()}</td>
                    <td className="num money">+$525.00</td>
                    <td className="num change">+5.00%</td>
                  </tr>
                  <tr style={{cursor:'pointer', background: activeSymbol === 'NVDA' ? '#f0f5ff' : ''}} onClick={() => setActiveSymbol('NVDA')}>
                    <td>□</td>
                    <td><span className="badge">MIS</span><span className="blue">NVDA24AUG120CE</span></td>
                    <td>OPTIDX</td>
                    <td className="num blue">100</td>
                    <td className="num">5.20</td>
                    <td className="num">{positions['NVDA']?.c?.toFixed(2) || '9.45'}</td>
                    <td className="num">${((positions['NVDA']?.c || 9.45) * 100).toLocaleString()}</td>
                    <td className="num money">+$425.00</td>
                    <td className="num change">+81.7%</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {activePosTab !== 'Positions' && (
              <div style={{ padding: '30px', textAlign: 'center', color: '#91a0b4', fontSize: '13px' }}>
                No {activePosTab.toLowerCase()} found.
              </div>
            )}
            
          </div>
        </section>
      </div>
    </div>
  );
}
