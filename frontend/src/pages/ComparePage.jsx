import React, { useState, useEffect } from 'react';
import { getQuote, getCompanyProfile, getBasicFinancials, getCandles } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeftRight } from 'lucide-react';
import '../CompareLight.css';

const POPULAR = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM', 'V', 'JNJ'];

function MetricRow({ label, valA, valB, higherIsBetter = true }) {
  const a = parseFloat(valA.replace(/[^\d.-]/g, '')) || 0;
  const b = parseFloat(valB.replace(/[^\d.-]/g, '')) || 0;
  const aWins = higherIsBetter ? a > b : a < b;
  const bWins = higherIsBetter ? b > a : b < a;
  return (
    <tr>
      <td className={`val-a ${aWins ? 'winner' : ''}`}>{valA}</td>
      <td className="metric">{label}</td>
      <td className={`val-b ${bWins ? 'winner' : ''}`}>{valB}</td>
    </tr>
  );
}

export default function ComparePage() {
  const [symA, setSymA] = useState('AAPL');
  const [symB, setSymB] = useState('MSFT');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [chartA, setChartA] = useState([]);
  const [chartB, setChartB] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCompare = async () => {
    if (!symA || !symB) return;
    setLoading(true);
    try {
      const from = Math.floor((Date.now() - 180 * 86400000) / 1000);
      const to = Math.floor(Date.now() / 1000);
      const [qA, qB, pA, pB, fA, fB, cA, cB] = await Promise.all([
        getQuote(symA), getQuote(symB),
        getCompanyProfile(symA), getCompanyProfile(symB),
        getBasicFinancials(symA), getBasicFinancials(symB),
        getCandles(symA, 'D', from, to), getCandles(symB, 'D', from, to),
      ]);
      setDataA({ quote: qA, profile: pA, financials: fA });
      setDataB({ quote: qB, profile: pB, financials: fB });
      if (cA?.s === 'ok') setChartA(cA.t.map((ts, i) => ({ date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: cA.c[i] })));
      if (cB?.s === 'ok') setChartB(cB.t.map((ts, i) => ({ date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: cB.c[i] })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompare(); }, []);

  const mA = dataA?.financials?.metric || {};
  const mB = dataB?.financials?.metric || {};

  const CompTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
      <div className="tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-val">${payload[0].value?.toFixed(2)}</p>
      </div>
    );
    return null;
  };

  return (
    <div className="compare-clone">
      <div className="content">
        <div className="title">Compare Stocks</div>
        <div className="subtitle">SIDE-BY-SIDE FUNDAMENTAL & PRICE COMPARISON</div>

        {/* Selectors */}
        <div className="controls">
          <select value={symA} onChange={(e) => setSymA(e.target.value)} className="select-input">
            {POPULAR.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ArrowLeftRight className="w-5 h-5 text-[#8995a6]" />
          <select value={symB} onChange={(e) => setSymB(e.target.value)} className="select-input">
            {POPULAR.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={fetchCompare} className="compare-btn">Compare</button>
        </div>

        {loading ? (
          <div className="loading-state">LOADING COMPARISON...</div>
        ) : dataA && dataB ? (
          <>
            {/* Price Charts Side by Side */}
            <div className="grid">
              {[{ sym: symA, data: chartA, quote: dataA.quote, color: '#2b6ce8' }, { sym: symB, data: chartB, quote: dataB.quote, color: '#f5a623' }].map(({ sym, data, quote, color }) => (
                <div key={sym} className="panel">
                  <div className="panel-head">
                    <span className="panel-title">{sym}</span>
                    {quote && <span className={`panel-price ${quote.dp >= 0 ? 'pos' : 'neg'}`}>${quote.c?.toFixed(2)} ({quote.dp >= 0 ? '+' : ''}{quote.dp?.toFixed(2)}%)</span>}
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id={`cg-${sym}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.15}/><stop offset="100%" stopColor={color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#edf0f4" vertical={false} />
                        <XAxis dataKey="date" stroke="#8995a6" tick={{fill: '#8995a6', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} minTickGap={40} />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#8995a6" tick={{fill: '#8995a6', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} orientation="right" />
                        <Tooltip content={<CompTooltip />} />
                        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill={`url(#cg-${sym})`} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Fundamentals Table */}
            <div className="table-panel">
              <div className="table-head">
                <span className="table-title side">{symA}</span>
                <span className="table-title center">METRIC</span>
                <span className="table-title side right">{symB}</span>
              </div>
              <table>
                <tbody>
                  <MetricRow label="Price" valA={`$${dataA.quote?.c?.toFixed(2)}`} valB={`$${dataB.quote?.c?.toFixed(2)}`} higherIsBetter={false} />
                  <MetricRow label="Day Chg%" valA={`${dataA.quote?.dp?.toFixed(2)}%`} valB={`${dataB.quote?.dp?.toFixed(2)}%`} />
                  <MetricRow label="Mkt Cap" valA={`$${(dataA.profile?.marketCapitalization / 1000)?.toFixed(1)}B`} valB={`$${(dataB.profile?.marketCapitalization / 1000)?.toFixed(1)}B`} />
                  <MetricRow label="P/E (TTM)" valA={(mA.peTTM || '--').toString()} valB={(mB.peTTM || '--').toString()} higherIsBetter={false} />
                  <MetricRow label="EPS (TTM)" valA={`$${(mA.epsTTM || 0).toFixed(2)}`} valB={`$${(mB.epsTTM || 0).toFixed(2)}`} />
                  <MetricRow label="Rev Growth" valA={`${(mA.revenueGrowthQuarterlyYoy || 0).toFixed(1)}%`} valB={`${(mB.revenueGrowthQuarterlyYoy || 0).toFixed(1)}%`} />
                  <MetricRow label="Net Margin" valA={`${(mA.netProfitMarginTTM || 0).toFixed(1)}%`} valB={`${(mB.netProfitMarginTTM || 0).toFixed(1)}%`} />
                  <MetricRow label="ROE" valA={`${(mA.roeTTM || 0).toFixed(1)}%`} valB={`${(mB.roeTTM || 0).toFixed(1)}%`} />
                  <MetricRow label="Div Yield" valA={`${(mA.dividendYieldIndicatedAnnual || 0).toFixed(2)}%`} valB={`${(mB.dividendYieldIndicatedAnnual || 0).toFixed(2)}%`} />
                  <MetricRow label="Beta" valA={(mA.beta || '--').toString()} valB={(mB.beta || '--').toString()} higherIsBetter={false} />
                  <MetricRow label="52W High" valA={`$${(mA['52WeekHigh'] || 0).toFixed(2)}`} valB={`$${(mB['52WeekHigh'] || 0).toFixed(2)}`} />
                  <MetricRow label="52W Low" valA={`$${(mA['52WeekLow'] || 0).toFixed(2)}`} valB={`$${(mB['52WeekLow'] || 0).toFixed(2)}`} higherIsBetter={false} />
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
