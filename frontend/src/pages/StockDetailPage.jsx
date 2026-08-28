import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Activity, ArrowLeft, TrendingUp, TrendingDown, BookOpen, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { 
  getQuote, getCompanyProfile, getBasicFinancials, getCandles, getCompanyNews, 
  computeEquiMindScore, generateRecommendation 
} from '../services/api';

export default function StockDetailPage() {
  const { ticker } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1Y');

  useEffect(() => {
    async function fetchData() {
      if (!ticker) return;
      setLoading(true);
      try {
        const [q, p, f, n] = await Promise.all([
          getQuote(ticker),
          getCompanyProfile(ticker),
          getBasicFinancials(ticker),
          getCompanyNews(ticker)
        ]);
        
        const scoreData = computeEquiMindScore(f);
        const newsArray = Array.isArray(n) ? n.slice(0, 5) : [];
        const aiRec = generateRecommendation(scoreData.total, newsArray);

        setData({ quote: q, profile: p, financials: f, news: newsArray, score: scoreData, ai: aiRec });
        await fetchChartData('1Y');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [ticker]);

  const fetchChartData = async (tf) => {
    setTimeframe(tf);
    try {
      let from, res = 'D';
      const now = Math.floor(Date.now() / 1000);
      if (tf === '1M') { from = now - 30 * 864000; res = 'D'; }
      else if (tf === '3M') { from = now - 90 * 864000; res = 'D'; }
      else if (tf === '1Y') { from = now - 365 * 864000; res = 'W'; }
      else if (tf === '5Y') { from = now - 5 * 365 * 864000; res = 'M'; }
      
      const candles = await getCandles(ticker, res, from, now);
      if (candles && candles.s === 'ok') {
        const cData = candles.t.map((ts, i) => {
          const d = new Date(ts * 1000);
          return {
            date: res === 'W' || res === 'M' ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}` : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: candles.c[i],
            volume: candles.v[i]
          };
        });
        setChartData(cData);
      } else {
        setChartData([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#52525b] font-mono">LOADING LIVE TERMINAL DATA FOR {ticker}...</div>;
  }

  if (!data || !data.quote || !data.quote.c) {
    return (
      <div className="p-8">
        <Link to="/screener" className="text-[#3b82f6] text-xs flex items-center mb-4"><ArrowLeft className="w-3 h-3 mr-1"/> Back</Link>
        <div className="text-[#ef4444] font-mono">ERROR: UNABLE TO FETCH DATA FOR {ticker}. MAY BE DELISTED OR INVALID.</div>
      </div>
    );
  }

  const { quote, profile, financials, news, score, ai } = data;
  const isPos = quote.d >= 0;
  const m = financials.metric || {};

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#27272a] pb-4">
        <div>
          <Link to="/screener" className="text-[#a1a1aa] hover:text-white transition-colors text-xs flex items-center mb-2 font-mono uppercase tracking-wider">
            <ArrowLeft className="w-3 h-3 mr-1"/> Screen
          </Link>
          <div className="flex items-center gap-3">
            {profile?.logo && <img src={profile.logo} alt="" className="w-8 h-8 rounded bg-white p-1" onError={(e) => e.target.style.display='none'} />}
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{ticker}</h1>
              <p className="text-xs text-[#a1a1aa]">{profile?.name || ticker} · {profile?.exchange || 'US EQUITY'} · {profile?.finnhubIndustry || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-white flex items-center justify-end gap-2">
            ${quote.c?.toFixed(2)}
          </div>
          <div className={`text-sm font-mono font-bold flex items-center justify-end ${isPos ? 'text-pos' : 'text-neg'}`}>
            {isPos ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
            {isPos ? '+' : ''}{quote.d?.toFixed(2)} ({isPos ? '+' : ''}{quote.dp?.toFixed(2)}%)
          </div>
          <div className="text-[10px] text-[#52525b] font-mono mt-1">VOL: {quote.v ? quote.v.toLocaleString() : '--'} · MKT CAP: ${(profile?.marketCapitalization || 0).toLocaleString()}M</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column - Chart & AI */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* Main Chart */}
          <div className="term-panel">
            <div className="term-panel-header flex justify-between items-center">
              <span className="term-panel-title">Price Action</span>
              <div className="flex gap-1">
                {['1M', '3M', '1Y', '5Y'].map(t => (
                  <button 
                    key={t}
                    onClick={() => fetchChartData(t)}
                    className={`px-2 py-0.5 text-[10px] font-mono transition-colors ${timeframe === t ? 'bg-[#3f3f46] text-white' : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-2 h-[350px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mainChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} minTickGap={30} />
                    <YAxis domain={['dataMin', 'dataMax']} stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} orientation="right" tickFormatter={v => `$${v.toFixed(0)}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '4px' }}
                      itemStyle={{ color: '#white', fontFamily: 'monospace', fontWeight: 'bold' }}
                      labelStyle={{ color: '#a1a1aa', fontSize: '10px', fontFamily: 'monospace', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={1.5} fill="url(#mainChartGrad)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#52525b] font-mono text-sm">Loading Chart Data...</div>
              )}
            </div>
          </div>

          {/* AI Analysis Box */}
          <div className="term-panel">
            <div className="term-panel-header">
              <span className="term-panel-title flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-[#3b82f6]" /> AI Analysis</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#a1a1aa] text-xs font-mono">RECOMMENDATION</span>
                  <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded ${ai.signal.includes('BUY') ? 'bg-[#22c55e]/10 text-pos' : ai.signal.includes('SELL') ? 'bg-[#ef4444]/10 text-neg' : 'bg-[#eab308]/10 text-[#eab308]'}`}>
                    {ai.signal}
                  </span>
                </div>
                <p className="text-sm text-[#e4e4e7] leading-relaxed border-l-2 border-[#3b82f6] pl-3 py-1">
                  {ai.reason}
                </p>
                <div className="mt-4 text-xs font-mono text-[#52525b]">CONFIDENCE: <span className="text-white">{ai.confidence.toUpperCase()}</span></div>
              </div>
              <div className="space-y-3">
                {[
                  { l: 'News Sentiment', v: ai.sentiment || 50 },
                  { l: 'Profitability', v: score.profitability },
                  { l: 'Growth', v: score.growth },
                  { l: 'Valuation', v: score.valuation },
                  { l: 'Momentum', v: score.momentum }
                ].map(s => (
                  <div key={s.l}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className={`uppercase tracking-wider ${s.l === 'News Sentiment' ? 'text-[#3b82f6] font-bold' : 'text-[#a1a1aa]'}`}>{s.l}</span>
                      <span className="font-mono text-white">{s.v}/100</span>
                    </div>
                    <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.v}%`, backgroundColor: s.v > 70 ? '#22c55e' : s.v > 40 ? '#eab308' : '#ef4444' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* News Snippets */}
          <div className="term-panel">
            <div className="term-panel-header">
              <span className="term-panel-title">Latest Headlines</span>
            </div>
            <div className="divide-y divide-[#27272a]">
              {news.length > 0 ? news.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-3 hover:bg-[#27272a]/30 transition-colors group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#e4e4e7] group-hover:text-white mb-1 line-clamp-1">{item.headline}</h4>
                      <p className="text-[10px] text-[#a1a1aa] font-mono flex items-center gap-2">
                        <span>{item.source}</span>
                        <span>·</span>
                        <span>{new Date(item.datetime * 1000).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                </a>
              )) : (
                <div className="p-4 text-center text-[#52525b] text-sm font-mono">No recent news available.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Stats & Fundamentals */}
        <div className="space-y-4">
          
          <div className="term-panel text-center py-6 border-[#3b82f6]/30">
            <div className="text-[10px] text-[#a1a1aa] uppercase tracking-wider mb-2 font-mono">EquiMind Score</div>
            <div className="text-5xl font-mono font-black text-white relative inline-block">
              {score.total}
              <span className="text-lg text-[#52525b] absolute top-1 -right-8">/100</span>
            </div>
          </div>

          <div className="term-panel">
            <div className="term-panel-header">
              <span className="term-panel-title">Key Statistics</span>
            </div>
            <table className="w-full text-xs font-mono">
              <tbody>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">Open</td><td className="py-2 px-3 text-right text-white">{quote.o?.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">High</td><td className="py-2 px-3 text-right text-white">{quote.h?.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">Low</td><td className="py-2 px-3 text-right text-white">{quote.l?.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">Prev Close</td><td className="py-2 px-3 text-right text-white">{quote.pc?.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">52W High</td><td className="py-2 px-3 text-right text-white">{(m['52WeekHigh'] || 0).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">52W Low</td><td className="py-2 px-3 text-right text-white">{(m['52WeekLow'] || 0).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">Market Cap</td><td className="py-2 px-3 text-right text-white">${(profile?.marketCapitalization / 1000)?.toFixed(2)}B</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">Beta</td><td className="py-2 px-3 text-right text-white">{(m.beta || '--').toString()}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">P/E (TTM)</td><td className="py-2 px-3 text-right text-white">{(m.peTTM || '--').toString()}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">EPS (TTM)</td><td className="py-2 px-3 text-right text-white">${(m.epsTTM || 0).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-[#27272a]/50">
                  <td className="py-2 px-3 text-[#a1a1aa]">Div Yield</td><td className="py-2 px-3 text-right text-white">{(m.dividendYieldIndicatedAnnual || 0).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#a1a1aa]">ROE (TTM)</td><td className="py-2 px-3 text-right text-white">{(m.roeTTM || 0).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
