import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { getQuotes, getCandles } from '../services/api';
import '../MarketLight.css';

const INDICES = [
  { name: 'S&P 500', ticker: 'SPY' },
  { name: 'NASDAQ 100', ticker: 'QQQ' },
  { name: 'DOW JONES', ticker: 'DIA' },
  { name: 'RUSSELL 2000', ticker: 'IWM' },
];

const UNIVERSE = [
  'AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'JPM', 'V', 'JNJ',
  'UNH', 'PG', 'XOM', 'HD', 'MA', 'PFE', 'BAC', 'KO', 'DIS', 'NFLX',
  'WMT', 'CVX', 'PEP', 'ABBV', 'MRK', 'COST', 'AVGO', 'MCD', 'CSCO', 'CRM'
];

const MiniChart = ({ data, isPositive }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <Line type="monotone" dataKey="p" stroke={isPositive ? '#12a874' : '#ff4a56'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default function MarketPage() {
  const [indexData, setIndexData] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [idxQ, uniQ] = await Promise.all([
          getQuotes(INDICES.map(i => i.ticker)),
          getQuotes(UNIVERSE)
        ]);

        const from = Math.floor((Date.now() - 7 * 86400000) / 1000);
        const to = Math.floor(Date.now() / 1000);

        const indicesWithCharts = await Promise.all(INDICES.map(async (idx) => {
          const q = idxQ[idx.ticker];
          let cData = [];
          try {
            const candles = await getCandles(idx.ticker, 'D', from, to);
            if (candles?.s === 'ok') cData = candles.c.map(p => ({ p }));
          } catch(e) {}
          return { ...idx, price: q?.c || 0, change: q?.d || 0, changePct: q?.dp || 0, data: cData };
        }));
        setIndexData(indicesWithCharts);

        const uniArray = Object.entries(uniQ).map(([ticker, q]) => ({ ticker, price: q?.c || 0, changePct: q?.dp || 0 }));
        uniArray.sort((a, b) => b.changePct - a.changePct);
        setGainers(uniArray.slice(0, 5));
        setLosers(uniArray.slice().reverse().slice(0, 5));

      } catch (e) {
        console.error('Market fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-clone">
      <div className="content">
        <div className="title">Market overview</div>
        <div className="subtitle">{loading ? 'CONNECTING TO FINNHUB...' : 'Live major indices & market movers'}</div>

        <section className="index-cards">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="index"><div style={{color: '#909aaa', fontSize:'11px', marginTop:'20px'}}>Loading...</div></div>)
          ) : indexData.map(idx => {
            const isPos = idx.changePct >= 0;
            return (
              <div key={idx.ticker} className="index">
                <div className="index-name">{idx.name}</div>
                <div className="index-ticker">{idx.ticker}</div>
                <div className="index-value">{idx.price.toFixed(2)}</div>
                <div className={`index-change ${isPos ? 'up' : 'down'}`}>
                  {isPos ? '⌃' : '⌄'} {isPos ? '+' : ''}{idx.change.toFixed(2)} ({isPos ? '+' : ''}{idx.changePct.toFixed(2)}%)
                </div>
                <div className="spark">
                  <MiniChart data={idx.data} isPositive={isPos} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="lower">
          <div className="panel">
            <div className="panel-head"><span className="arr green-a">↗</span><span>TOP GAINERS</span></div>
            <table>
              <thead>
                <tr>
                  <th>SYMBOL</th>
                  <th className="r">PRICE</th>
                  <th className="r">CHG%</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{textAlign:'center', color:'#718096'}}>Loading...</td></tr>
                ) : gainers.map(s => (
                  <tr key={s.ticker}>
                    <td className="sym" onClick={() => navigate(`/stocks/${s.ticker}`)}>{s.ticker}</td>
                    <td className="r">{s.price.toFixed(2)}</td>
                    <td className="r up">+{s.changePct.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="panel-foot" onClick={() => navigate('/screener')}>View all gainers →</div>
          </div>

          <div className="panel">
            <div className="panel-head"><span className="arr red-a">↘</span><span>TOP LOSERS</span></div>
            <table>
              <thead>
                <tr>
                  <th>SYMBOL</th>
                  <th className="r">PRICE</th>
                  <th className="r">CHG%</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{textAlign:'center', color:'#718096'}}>Loading...</td></tr>
                ) : losers.map(s => (
                  <tr key={s.ticker}>
                    <td className="sym" onClick={() => navigate(`/stocks/${s.ticker}`)}>{s.ticker}</td>
                    <td className="r">{s.price.toFixed(2)}</td>
                    <td className="r down">{s.changePct.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="panel-foot" onClick={() => navigate('/screener')}>View all losers →</div>
          </div>
        </section>

        <footer className="footer">
          <span>Equimind Pro Terminal v2.4.1</span>
          <span className="footer-right">
            <span>Support</span>
            <span>Documentation</span>
            <span>System Status: <b className="ok">All systems operational</b></span>
          </span>
        </footer>
      </div>
    </div>
  );
}
