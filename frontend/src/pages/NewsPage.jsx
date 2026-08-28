import React, { useState, useEffect } from 'react';
import { getMarketNews, getCompanyNews, analyzeNewsSentiment } from '../services/api';
import { ExternalLink, Clock, Newspaper, Activity } from 'lucide-react';
import '../NewsLight.css';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [searchTicker, setSearchTicker] = useState('');

  const [sentiment, setSentiment] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce the search input so we don't spam the API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTicker), 500);
    return () => clearTimeout(handler);
  }, [searchTicker]);

  useEffect(() => {
    setLoading(true);
    setSentiment(null);
    if (debouncedSearch.trim()) {
      getCompanyNews(debouncedSearch.trim().toUpperCase())
        .then(data => {
          const newsArr = Array.isArray(data) ? data.slice(0, 30) : [];
          setNews(newsArr);
          setSentiment(analyzeNewsSentiment(newsArr));
        })
        .catch(() => setNews([]))
        .finally(() => setLoading(false));
    } else if (!searchTicker.trim()) {
      getMarketNews(category)
        .then(data => setNews(Array.isArray(data) ? data.slice(0, 30) : []))
        .catch(() => setNews([]))
        .finally(() => setLoading(false));
    }
  }, [category, debouncedSearch]);

  const formatTime = (ts) => {
    const d = new Date(ts * 1000);
    const now = new Date();
    const diffH = Math.floor((now - d) / 3600000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="news-clone">
      <div className="content">
        <div className="title">News Feed</div>
        <div className="subtitle">LIVE MARKET NEWS · FINNHUB</div>

        <div className="controls">
          <input
            type="text"
            placeholder="Filter by ticker (e.g. AAPL)"
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value)}
            className="search-input"
          />
          {!searchTicker && (
            <React.Fragment>
              {['general', 'forex', 'crypto', 'merger'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`category-btn ${category === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </React.Fragment>
          )}
        </div>

        {searchTicker && sentiment && news.length > 0 && !loading && (
          <div className="sentiment-banner">
            <div className="sentiment-head">
              <span className="sentiment-title">
                <Activity className="w-4 h-4" /> AI NEWS SENTIMENT: {searchTicker.toUpperCase()}
              </span>
              <span className={`sentiment-score ${sentiment.score >= 60 ? 'score-pos' : sentiment.score <= 40 ? 'score-neg' : 'score-neu'}`}>
                SCORE: {sentiment.score}/100
              </span>
            </div>
            <p className="sentiment-text">
              {sentiment.score >= 60 ? 'Bullish sentiment driven by: ' : sentiment.score <= 40 ? 'Bearish sentiment driven by: ' : 'Mixed sentiment. Key driver: '}
              <b>"{sentiment.topHeadline}"</b>
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading-state">LOADING NEWS...</div>
        ) : news.length === 0 ? (
          <div className="empty-state">No news found.</div>
        ) : (
          <div className="grid">
            {news.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
              >
                {article.image && (
                  <div className="card-img">
                    <img src={article.image} alt="" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
                <div className="card-content">
                  <h3 className="card-title">
                    {article.headline}
                  </h3>
                  <p className="card-summary">
                    {article.summary}
                  </p>
                  <div className="card-meta">
                    <span className="meta-item">
                      <Newspaper className="w-3 h-3" /> {article.source}
                    </span>
                    <span className="meta-item">
                      <Clock className="w-3 h-3" /> {formatTime(article.datetime)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
