<div align="center">

<h1>⚡ EquiMind</h1>

<p align="center">
  <strong>AI-Enhanced Equity Research Platform</strong><br>
  Cached · Explainable · Locally-Hosted · S&amp;P 500 Universe
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License"></a>
  <br>
  <a href="https://www.java.com"><img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21"></a>
  <a href="https://spring.io"><img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=spring-boot&logoColor=white" alt="Spring Boot"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"></a>
  <a href="https://www.python.org"><img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
</p>

</div>

---

## What is EquiMind?

**EquiMind** is a batch-driven equity research platform for the S&amp;P 500 universe. It fuses classical financial analysis — fundamental scoring, technical indicators, and market data — with locally-hosted AI summaries via LM Studio. No cloud AI APIs. No real-time trading infrastructure. Just explainable, reproducible, cached insights.

> **Design Philosophy:** *Data density over decoration. Every pixel earns its place. No dark patterns. No engagement hacking.*

### Why Batch-Driven?

Unlike real-time trading platforms, EquiMind uses a **scheduled data pipeline** that ingests, validates, normalizes, and caches market data. This gives you:

- **Reliability** — Your demo works even if Yahoo Finance is down.
- **Reproducibility** — Same inputs, same outputs, every time.
- **Zero API Costs** — No paid market data or AI API keys required.
- **Explainability** — Every metric carries a source and a timestamp.

---

## Features

<table>
<tr>
<td width="50%">

### Market Intelligence
- **Market Dashboard** — S&amp;P 500, NASDAQ, DOW indices with interactive area charts
- **Sector Heatmap** — 11 GICS sectors colored by daily performance
- **Top Movers** — Gainers, losers, and most active with sparklines
- **News &amp; Sentiment** — Financial headlines with Bullish / Neutral / Bearish tags

</td>
<td width="50%">

### Stock Analysis
- **Stock Search** — Autocomplete across 500+ S&amp;P 500 tickers
- **Fundamental Score** — Transparent 4-pillar scoring (Profitability · Growth · Financial Health · Valuation)
- **Technical Indicators** — RSI, MACD, Bollinger Bands, 20/50-day Moving Averages
- **AI Smart Summary** — Structured LLM output (bull case, risks, sentiment) from local LM Studio

</td>
</tr>
<tr>
<td width="50%">

### Portfolio &amp; Tracking
- **Watchlist** — Track stocks with real-time price updates (from cache)
- **Portfolio Tracker** — Manual holdings entry with P&amp;L and return calculations
- **Stock Comparison** — Side-by-side comparison of 2–4 tickers
- **Stock Screener** — Multi-criteria filter with sortable results

</td>
<td width="50%">

### Data Infrastructure
- **Batch Pipeline** — Python ingestion with validation, normalization, and freshness tracking
- **Data Quality Layer** — Source attribution and last-updated timestamps on every metric
- **Demo Mode** — Fully functional with seeded data; zero external API keys needed
- **Pipeline Status** — Internal admin view for ingestion health and coverage

</td>
</tr>
</table>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         React 19 SPA                                  │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ REST / JSON
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      Spring Boot 4 (Java 21)                          │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ JDBC
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        PostgreSQL 18                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
       ▲                                                              ▲
       │ Batch Ingestion                                              │ Inference
┌──────┴──────────────────────────┐                    ┌──────────────┴──────────┐
│      PYTHON PIPELINE            │                    │      LM STUDIO          │
│  (yfinance, TA-Lib, pandas)     │                    │  (Local Llama 3)        │
└─────────────────────────────────┘                    └─────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Chart.js, React Router |
| **Backend API** | Java 21, Spring Boot 4.x, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 18 |
| **Data Pipeline** | Python 3.12+, pandas, yfinance, TA-Lib |
| **AI Engine** | LM Studio (Local LLM Inference) |

---

## Local Setup (Offline Mode)

### Prerequisites

- Java 21+ ([Adoptium Temurin](https://adoptium.net/))
- Node.js 20+ ([nodejs.org](https://nodejs.org/))
- Python 3.12+ ([python.org](https://www.python.org/))
- PostgreSQL 18+ ([postgresql.org](https://www.postgresql.org/))
- LM Studio ([lmstudio.ai](https://lmstudio.ai/)) — needed in Phase 5

> **Note**: This project runs entirely offline on your local machine. No cloud deployment, no Docker required.

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/24cs062/Stock-Analysis.git
cd Stock-Analysis

# Copy environment config
cp .env.example .env

# 1. Create database & load schema
createdb equimind -U postgres
psql -d equimind -U postgres -f sql/schema.sql

# 2. Start Backend (Terminal 1)
cd backend
mvnw spring-boot:run
# → http://localhost:8080/api/health

# 3. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Demo Mode

Set `DATA_MODE=DEMO` in your `.env` file to use pre-loaded data without external API calls.

---

## Contributing

We welcome contributions — bug fixes, documentation improvements, and feature suggestions.

1. **Fork** the repository
2. **Branch** from `main`: `git checkout -b feature/your-feature`
3. **Commit** with clear messages: `git commit -m "feat: add sector heatmap to dashboard"`
4. **Push** and open a **Pull Request**

### Commit Convention

| Prefix | Purpose |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

---

## License

EquiMind is released under the **MIT License**. See [LICENSE](LICENSE) for details.
