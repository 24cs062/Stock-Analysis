const FINNHUB_KEY = 'da2sil1r01qupvfalvc0da2sil1r01qupvfalvcg';
const FINNHUB_BASE = 'https://finnhub.io/api/v1';

const ALPACA_KEY = 'PKYFCBFDJ7SG63WNOPN6VT6XFI';
const ALPACA_SECRET = 'Qkx7twFuomMNSG9cGydhFHeZgyYAmXt2UNT2kZ1PfHn';
const ALPACA_BASE = 'https://data.alpaca.markets/v2';

const alpacaHeaders = {
  'APCA-API-KEY-ID': ALPACA_KEY,
  'APCA-API-SECRET-KEY': ALPACA_SECRET
};

// Simple in-memory cache to avoid hammering the APIs
const cache = new Map();
const CACHE_TTL = 15000; // 15 seconds

async function fetchWithCache(url, headers = {}, ttl = CACHE_TTL) {
  const now = Date.now();
  if (cache.has(url)) {
    const { data, ts } = cache.get(url);
    if (now - ts < ttl) return data;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status} on ${url}`);
  const data = await res.json();
  cache.set(url, { data, ts: now });
  return data;
}

// Convert Alpaca Snapshot to Finnhub quote format
function formatAlpacaQuote(snapshot) {
  if (!snapshot) return null;
  const current = snapshot.latestTrade?.p || snapshot.dailyBar?.c || snapshot.prevDailyBar?.c;
  const prevClose = snapshot.prevDailyBar?.c || current;
  const d = current - prevClose;
  const dp = prevClose > 0 ? (d / prevClose) * 100 : 0;
  
  return {
    c: current,
    d: d,
    dp: dp,
    h: snapshot.dailyBar?.h || current,
    l: snapshot.dailyBar?.l || current,
    o: snapshot.dailyBar?.o || current,
    pc: prevClose,
    t: Math.floor(new Date(snapshot.latestTrade?.t || Date.now()).getTime() / 1000)
  };
}

// Real-time quote for a single symbol
export async function getQuote(symbol) {
  const data = await fetchWithCache(`${ALPACA_BASE}/stocks/snapshots?symbols=${symbol}&feed=iex`, alpacaHeaders);
  return formatAlpacaQuote(data[symbol]);
}

// Batch quotes for multiple symbols
export async function getQuotes(symbols) {
  if (!symbols || symbols.length === 0) return {};
  const data = await fetchWithCache(`${ALPACA_BASE}/stocks/snapshots?symbols=${symbols.join(',')}&feed=iex`, alpacaHeaders);
  const results = {};
  for (const sym of symbols) {
    if (data[sym]) {
      results[sym] = formatAlpacaQuote(data[sym]);
    } else {
      results[sym] = null;
    }
  }
  return results;
}

// Company profile (Finnhub)
export async function getCompanyProfile(symbol) {
  return fetchWithCache(`${FINNHUB_BASE}/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`, {}, 300000);
}

// Company news (Alpaca) with High-Precision Filtering
export async function getCompanyNews(symbol) {
  // We use Alpaca for news now to fetch up to 50 articles, giving our strict filter a larger pool
  const data = await fetchWithCache(`https://data.alpaca.markets/v1beta1/news?symbols=${symbol}&limit=50`, alpacaHeaders, 60000);
  
  if (!data || !Array.isArray(data.news)) return [];

  // Fetch company profile to get the real name for accurate filtering (e.g. AAPL -> Apple)
  let companyName = symbol;
  let strictFilter = false;
  try {
    const profile = await getCompanyProfile(symbol);
    if (profile && profile.name) {
      // Extract the first major word of the company name to catch mentions (e.g., "Apple Inc." -> "Apple")
      companyName = profile.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
      strictFilter = true;
    }
  } catch(e) {
    // silently fallback to just using ticker
  }

  const regexTicker = new RegExp(`\\b${symbol}\\b`, 'i');
  const regexName = new RegExp(`\\b${companyName}\\b`, 'i');

  // Filter out generic market spam, ONLY if we successfully got the company name.
  // Otherwise, fallback to the raw Alpaca data so we don't accidentally return 0 results.
  let filteredAlpacaNews = data.news;
  if (strictFilter) {
    filteredAlpacaNews = data.news.filter(article => {
      const text = (article.headline + ' ' + (article.summary || '')).toLowerCase();
      return regexTicker.test(text) || (companyName.length > 2 && regexName.test(text));
    });
  }

  // Map Alpaca's schema to our expected Finnhub-style schema so the UI doesn't break
  return filteredAlpacaNews.map(article => ({
    headline: article.headline,
    summary: article.summary,
    source: article.source,
    url: article.url,
    image: article.images && article.images.length > 0 ? article.images[0].url : '',
    datetime: Math.floor(new Date(article.created_at).getTime() / 1000)
  }));
}

// General market news (Finnhub)
export async function getMarketNews(category = 'general') {
  return fetchWithCache(`${FINNHUB_BASE}/news?category=${category}&token=${FINNHUB_KEY}`, {}, 60000);
}

// Stock candles (price history) via Alpaca
export async function getCandles(symbol, resolution = '1Day', from, to) {
  const start = new Date((from || Math.floor((Date.now() - 365 * 86400000) / 1000)) * 1000).toISOString();
  const end = new Date((to || Math.floor(Date.now() / 1000)) * 1000).toISOString();
  
  // Convert resolution from Finnhub style to Alpaca style
  let timef = '1Day';
  if (resolution === '1' || resolution === '5' || resolution === '15' || resolution === '30') timef = `${resolution}Min`;
  else if (resolution === 'W') timef = '1Week';
  else if (resolution === 'M') timef = '1Month';
  
  const data = await fetchWithCache(`${ALPACA_BASE}/stocks/bars?symbols=${symbol}&timeframe=${timef}&start=${start}&end=${end}&feed=iex`, alpacaHeaders, 30000);
  
  const bars = data.bars?.[symbol] || [];
  if (bars.length === 0) return { s: 'no_data' };
  
  return {
    s: 'ok',
    c: bars.map(b => b.c),
    h: bars.map(b => b.h),
    l: bars.map(b => b.l),
    o: bars.map(b => b.o),
    t: bars.map(b => Math.floor(new Date(b.t).getTime() / 1000)),
    v: bars.map(b => b.v)
  };
}

// Basic financials (Finnhub)
export async function getBasicFinancials(symbol) {
  return fetchWithCache(`${FINNHUB_BASE}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`, {}, 300000);
}

// Recommendation trends (Finnhub)
export async function getRecommendations(symbol) {
  return fetchWithCache(`${FINNHUB_BASE}/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`, {}, 300000);
}

// Peers (Finnhub)
export async function getPeers(symbol) {
  return fetchWithCache(`${FINNHUB_BASE}/stock/peers?symbol=${symbol}&token=${FINNHUB_KEY}`, {}, 300000);
}

// Utility: compute a simple EquiMind score from financials
export function computeEquiMindScore(metrics) {
  if (!metrics || !metrics.metric) return { total: 0, profitability: 0, growth: 0, valuation: 0, momentum: 0 };
  const m = metrics.metric;

  const roe = Math.min(Math.max((m['roeTTM'] || 0) / 0.5 * 100, 0), 100);
  const margin = Math.min(Math.max((m['netProfitMarginTTM'] || 0) / 30 * 100, 0), 100);
  const profitability = Math.round((roe + margin) / 2);

  const revGrowth = Math.min(Math.max(((m['revenueGrowthQuarterlyYoy'] || 0) + 20) / 40 * 100, 0), 100);
  const epsGrowth = Math.min(Math.max(((m['epsGrowthQuarterlyYoy'] || 0) + 20) / 40 * 100, 0), 100);
  const growth = Math.round((revGrowth + epsGrowth) / 2);

  const pe = m['peTTM'] || 50;
  const valuation = Math.round(Math.min(Math.max((1 - (pe - 5) / 80) * 100, 0), 100));

  const high52 = m['52WeekHigh'] || 1;
  const low52 = m['52WeekLow'] || 0;
  const price = m['52WeekHighDate'] ? high52 * 0.9 : (high52 + low52) / 2;
  const range = high52 - low52;
  const momentum = range > 0 ? Math.round(((price - low52) / range) * 100) : 50;

  const total = Math.round((profitability * 0.3 + growth * 0.25 + valuation * 0.25 + momentum * 0.2));

  return { total, profitability, growth, valuation, momentum };
}

// Utility: Analyze News Sentiment with High Precision Weighted Dictionary
export function analyzeNewsSentiment(newsArray) {
  if (!newsArray || newsArray.length === 0) return { score: 50, topHeadline: 'No recent news available.' };

  // Weighted financial sentiment dictionary
  const sentimentDict = {
    // Strong Bullish (+40)
    'soars': 40, 'surges': 40, 'record profit': 40, 'blowout': 40, 'fda approval': 40, 'breakthrough': 40, 'skyrockets': 40,
    'massive growth': 40, 'doubles': 40, 'triples': 40, 'unprecedented': 40, 'cleared': 40,
    
    // Bullish (+20)
    'beat': 20, 'raises': 20, 'upgrades': 20, 'jumps': 20, 'growth': 20, 'profit': 20, 'higher': 20, 
    'record': 20, 'dividend': 20, 'buyback': 20, 'strong': 20, 'positive': 20, 'outperforms': 20, 
    'wins': 20, 'launches': 20, 'acquires': 20, 'approved': 20, 'soaring': 20, 'gains': 20, 'bullish': 20,
    'expansion': 20, 'partnership': 20, 'exceeds': 20, 'accelerates': 20,
    
    // Bearish (-20)
    'miss': -20, 'cuts': -20, 'downgrades': -20, 'falls': -20, 'loss': -20, 'drops': -20, 'lower': -20, 
    'weak': -20, 'negative': -20, 'underperforms': -20, 'loses': -20, 'delays': -20, 'halts': -20, 
    'declines': -20, 'bearish': -20, 'shrinks': -20, 'misses': -20, 'slows': -20, 'slips': -20,
    
    // Strong Bearish (-40)
    'plunges': -40, 'probe': -40, 'lawsuit': -40, 'sec': -40, 'investigates': -40, 'bankruptcy': -40, 
    'fraud': -40, 'subpoena': -40, 'delisted': -40, 'crashes': -40, 'collapses': -40, 'scandal': -40,
    'breach': -40, 'recall': -40, 'fires': -40, 'resigns': -40, 'tanked': -40, 'plummet': -40
  };

  let totalScore = 0;
  let maxImpact = 0;
  let topHeadline = newsArray[0]?.headline || 'Routine market activity.';
  let articlesScored = 0;

  newsArray.forEach(article => {
    const text = (article.headline + ' ' + (article.summary || '')).toLowerCase();
    let score = 0;
    
    for (const [kw, weight] of Object.entries(sentimentDict)) {
      // Use regex to match whole words to prevent partial matching hallucinations (e.g., 'sec' in 'second')
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      if (regex.test(text)) {
        score += weight;
      }
    }
    
    if (score !== 0) {
      articlesScored++;
      if (Math.abs(score) > maxImpact) {
        maxImpact = Math.abs(score);
        topHeadline = article.headline;
      }
      totalScore += score;
    }
  });

  // If no keywords were found, return exactly 50 (neutral) with a safe fallback
  if (articlesScored === 0) {
    return { score: 50, topHeadline: newsArray[0]?.headline || 'No significant sentiment detected.' };
  }

  // Normalize to 0-100 (50 is neutral). We divide by articlesScored to prevent extreme summation.
  let normalizedScore = 50 + (totalScore / articlesScored);
  normalizedScore = Math.min(Math.max(Math.round(normalizedScore), 0), 100);

  return { score: normalizedScore, topHeadline };
}

// Utility: generate AI recommendation from score + news sentiment
export function generateRecommendation(fundamentalScore, newsArray) {
  const newsSentiment = analyzeNewsSentiment(newsArray);
  const blendedScore = (fundamentalScore * 0.4) + (newsSentiment.score * 0.6); // Weight news heavily for immediate signals

  const baseReason = newsSentiment.topHeadline ? `Driven by: '${newsSentiment.topHeadline}'. ` : '';

  if (blendedScore >= 75) {
    return { signal: 'STRONG BUY', confidence: 'High', reason: baseReason + `Highly positive sentiment (Score: ${newsSentiment.score}/100) aligned with strong fundamentals.`, sentiment: newsSentiment.score };
  } else if (blendedScore >= 60) {
    return { signal: 'BUY', confidence: 'Medium', reason: baseReason + `Positive news flow (Score: ${newsSentiment.score}/100) supports upward momentum.`, sentiment: newsSentiment.score };
  } else if (blendedScore <= 40) {
    return { signal: 'SELL', confidence: 'High', reason: baseReason + `Negative news sentiment (Score: ${newsSentiment.score}/100) indicates risk. Consider reducing exposure.`, sentiment: newsSentiment.score };
  } else {
    return { signal: 'HOLD', confidence: 'Medium', reason: baseReason + `Mixed or neutral sentiment (Score: ${newsSentiment.score}/100). Await clearer signals.`, sentiment: newsSentiment.score };
  }
}

// WebSocket for real-time price ticks via Alpaca
let ws = null;
let wsAuthenticated = false;
const wsListeners = new Set();
const subscribedSymbols = new Set();

export function connectWebSocket() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
  
  ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');
  
  ws.onopen = () => {
    // Alpaca requires authentication first
    ws.send(JSON.stringify({
      action: 'auth',
      key: ALPACA_KEY,
      secret: ALPACA_SECRET
    }));
  };
  
  ws.onmessage = (event) => {
    const dataList = JSON.parse(event.data);
    
    dataList.forEach(data => {
      if (data.T === 'success' && data.msg === 'authenticated') {
        wsAuthenticated = true;
        // Now subscribe to everything we have queued up
        if (subscribedSymbols.size > 0) {
          ws.send(JSON.stringify({
            action: 'subscribe',
            trades: Array.from(subscribedSymbols)
          }));
        }
      } else if (data.T === 't') {
        // Broadcast latest trades mapping Alpaca schema to our expected schema
        const tradeData = [{ s: data.S, p: data.p }];
        wsListeners.forEach(listener => listener(tradeData));
      } else if (data.T === 'subscription') {
        console.log('Subscribed to Alpaca:', data.trades);
      }
    });
  };

  ws.onclose = () => {
    wsAuthenticated = false;
    setTimeout(connectWebSocket, 5000); // Reconnect after 5s
  };
}

export function subscribeToPrices(symbols, callback) {
  if (!ws) connectWebSocket();
  
  let newSubs = [];
  symbols.forEach(sym => {
    if (!subscribedSymbols.has(sym)) {
      subscribedSymbols.add(sym);
      newSubs.push(sym);
    }
  });
  
  if (newSubs.length > 0 && ws && ws.readyState === WebSocket.OPEN && wsAuthenticated) {
    ws.send(JSON.stringify({
      action: 'subscribe',
      trades: newSubs
    }));
  }
  
  wsListeners.add(callback);
  return () => wsListeners.delete(callback);
}
