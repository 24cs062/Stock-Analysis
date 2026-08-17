<div align="center">

<!-- Animated Logo / Hero -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/equimind-ai/equimind/main/docs/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/equimind-ai/equimind/main/docs/assets/logo-light.svg">
  <img alt="EquiMind AI" src="https://raw.githubusercontent.com/equimind-ai/equimind/main/docs/assets/logo-light.svg" width="180">
</picture>

<h1>EquiMind</h1>

<p align="center">
  <strong>AI-Enhanced Equity Research Platform</strong><br>
  Cached · Explainable · Locally-Hosted · S&amp;P 500 Universe
</p>

<p align="center">
  <a href="https://github.com/equimind-ai/equimind/actions"><img src="https://img.shields.io/github/actions/workflow/status/equimind-ai/equimind/ci.yml?branch=main&style=flat-square&logo=github-actions&logoColor=white&label=CI" alt="CI"></a>
  <a href="https://github.com/equimind-ai/equimind/releases"><img src="https://img.shields.io/github/v/release/equimind-ai/equimind?style=flat-square&logo=github&logoColor=white&label=Release" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License"></a>
  <br>
  <a href="https://www.java.com"><img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21"></a>
  <a href="https://spring.io"><img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=spring-boot&logoColor=white" alt="Spring Boot"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"></a>
  <a href="https://www.python.org"><img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://www.docker.com"><img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"></a>
</p>

<p align="center">
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#documentation"><strong>Docs</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="https://equimind.dev"><strong>Website</strong></a>
</p>

<img src="https://raw.githubusercontent.com/equimind-ai/equimind/main/docs/assets/screenshot-dashboard.png" alt="EquiMind Dashboard" width="100%">

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

## Quick Start

The fastest way to run EquiMind is with Docker Compose. This spins up the full stack — React frontend, Spring Boot API, PostgreSQL, and the Python data pipeline — in under 2 minutes.

```bash
# 1. Clone the repository
git clone https://github.com/equimind-ai/equimind.git
cd equimind

# 2. Start the entire stack
docker-compose up -d

# 3. Seed the database with S&P 500 demo data
docker-compose exec data-pipeline python main.py --mode demo

# 4. Open the app
open http://localhost:3000
```

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application |
| API | http://localhost:8080 | Spring Boot REST API |
| Database | postgresql://localhost:5432/equimind | PostgreSQL 16 |
| LM Studio | http://localhost:1234 | Local LLM inference (optional) |

### Demo Mode (No External APIs)

```bash
DATA_MODE=demo docker-compose up -d
```

Runs entirely on pre-seeded data. No Yahoo Finance. No API keys. Perfect for presentations and offline development.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         React 18 SPA                                     ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ ││
│  │  │  Dashboard  │ │   Stocks    │ │  Screener   │ │    Portfolio      │ ││
│  │  │   (Recharts)│ │  (Detail)   │ │  (Filters)  │ │   (P&amp;L Calc)     │ ││
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └─────────┬─────────┘ ││
│  │         └─────────────────┴─────────────────┴──────────────────┘          ││
│  └────────────────────────────────────────┬──────────────────────────────────┘│
└───────────────────────────────────────────┼──────────────────────────────────┘
                                            │ REST / JSON
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      Spring Boot 3.x (Java 21)                         ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ││
│  │  │   Auth   │ │  Market  │ │  Stocks  │ │    AI    │ │   Pipeline   │ ││
│  │  │  (JWT)   │ │  (REST)  │ │  (REST)  │ │  (REST)  │ │   (Admin)    │ ││
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘ ││
│  │       └─────────────┴─────────────┴─────────────┴────────────────┘      ││
│  │                              Spring Data JPA                             ││
│  └────────────────────────────────────────┬──────────────────────────────────┘│
└───────────────────────────────────────────┼──────────────────────────────────┘
                                            │ JDBC
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        PostgreSQL 16                                     ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ ││
│  │  │  User   │ │  Stock  │ │  Historical │ │  Technical  │ │   News    │ ││
│  │  │  Data   │ │  Data   │ │   Prices    │ │ Indicators  │ │  Articles │ ││
│  │  └─────────┘ └─────────┘ └─────────────┘ └─────────────┘ └───────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
       ▲                                                              ▲
       │                                                              │
       │ Batch Ingestion                                              │ LLM Inference
       │                                                              │
┌──────┴──────────────────────────┐                    ┌──────────────┴──────────┐
│      PYTHON PIPELINE            │                    │      LM STUDIO          │
│  ┌─────────┐  ┌─────────┐      │                    │  ┌───────────────────┐  │
│  │  Fetch  │  │ Validate│      │                    │  │  Llama 3.1 8B     │  │
│  │(yfinance│  │  Layer  │      │                    │  │  Mistral 7B       │  │
│  │  news)  │  │         │      │                    │  │  (GGUF)           │  │
│  └────┬────┘  └────┬────┘      │                    │  └───────────────────┘  │
│       └─────────────┘           │                    │                         │
│  ┌─────────┐  ┌─────────┐      │                    │  Structured prompting   │
│  │Normalize│  │Calculate│      │                    │  Fallback to cached     │
│  │         │  │   TA    │      │                    │                         │
│  └────┬────┘  └────┬────┘      │                    └─────────────────────────┘
│       └─────────────┘           │
│  ┌───────────────────────────┐  │
│  │     PostgreSQL Upsert     │  │
│  │   (with data_status)      │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Data Flow

1. **Ingestion** — Python fetches market data from Yahoo Finance via `yfinance` and news from free sources.
2. **Validation** — Schema checks, range validation, and anomaly detection.
3. **Normalization** — Unit standardization, currency normalization, missing data handling.
4. **Technical Calculation** — RSI, MACD, Bollinger, MA computed via `TA-Lib` / `pandas-ta`.
5. **AI Summaries** — Structured prompts sent to LM Studio; JSON responses stored.
6. **Persistence** — All data upserted to PostgreSQL with `last_updated` and `data_status` fields.
7. **Serving** — Spring Boot API serves cached data to the React frontend.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts | SPA with interactive charts |
| **Backend API** | Java 21, Spring Boot 3.x, Spring Security, Spring Data JPA | RESTful API, JWT auth, business logic |
| **Database** | PostgreSQL 16 | Relational store for stocks, prices, users, news |
| **Data Pipeline** | Python 3.11+, pandas, yfinance, TA-Lib, requests | Batch ingestion, validation, TA calculation |
| **AI Engine** | LM Studio (OpenAI-compatible local API) | Structured stock summaries without cloud APIs |
| **Containerization** | Docker, Docker Compose | Full-stack local deployment |
| **Authentication** | Spring Security + JWT (httpOnly cookies) | Stateless session management |

---

## Project Structure

```
equimind/
├── 📁 frontend/                    # React 18 SPA
│   ├── src/
│   │   ├── components/             # Reusable UI (shadcn/ui style)
│   │   ├── pages/                  # Route-level pages
│   │   ├── hooks/                  # Custom React hooks (useAuth, useStockData)
│   │   ├── services/               # API client (axios/fetch wrapper)
│   │   ├── types/                  # TypeScript interfaces
│   │   └── utils/                  # Formatters, constants
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── 📁 backend/                     # Spring Boot 3.x API
│   └── src/main/java/com/equimind/
│       ├── controller/             # REST controllers (Auth, Market, Stocks, AI)
│       ├── service/                # Business logic & orchestration
│       ├── repository/             # Spring Data JPA repositories
│       ├── model/                  # JPA entities
│       ├── dto/                    # Request/response DTOs
│       ├── config/                 # Security, CORS, WebClient config
│       ├── pipeline/               # Pipeline trigger & status endpoints
│       └── exception/              # Global exception handling
│   └── src/main/resources/
│       ├── application.yml         # Profiles: dev / prod / demo
│       └── db/migration/           # Flyway migrations
│
├── 📁 data-pipeline/               # Python batch ingestion
│   ├── ingestion/
│   │   ├── yahoo_fetcher.py        # Price & fundamental data
│   │   └── news_fetcher.py         # Financial news headlines
│   ├── validation/
│   │   ├── schema_validator.py     # Type & range checks
│   │   └── anomaly_detector.py     # Outlier flagging
│   ├── normalization/
│   │   └── unit_normalizer.py      # Currency, scale standardization
│   ├── indicators/
│   │   ├── moving_averages.py      # SMA, EMA
│   │   ├── rsi.py                  # Relative Strength Index
│   │   ├── macd.py                 # MACD line, signal, histogram
│   │   └── bollinger.py            # Upper/middle/lower bands
│   ├── ai/
│   │   ├── prompt_builder.py       # Structured prompt templates
│   │   └── lmstudio_client.py      # OpenAI-compatible API client
│   ├── storage/
│   │   └── postgres_upsert.py      # Batch upsert with conflict handling
│   ├── config/
│   │   └── pipeline.yaml           # Tickers, schedule, thresholds
│   ├── main.py                     # Entry point: fetch → validate → store
│   └── requirements.txt
│
├── 📁 sql/                         # Database schemas
│   ├── schema.sql                  # Base schema (PostgreSQL)
│   └── seed/                       # Demo dataset for presentations
│
├── 📁 docs/                        # Project documentation
│   ├── PROBLEM_STATEMENT.md
│   ├── LITERATURE_SURVEY.md
│   ├── PROJECT_TIMELINE.md
│   ├── REQUIREMENTS.md
│   └── assets/                     # Screenshots, diagrams, logos
│
├── docker-compose.yml              # Full stack orchestration
├── docker-compose.demo.yml         # Demo mode (no external APIs)
├── Makefile                        # Common dev commands
├── LICENSE                         # MIT
└── README.md                       # You are here
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/PROBLEM_STATEMENT.md](docs/PROBLEM_STATEMENT.md) | Motivation, objectives, and project scope |
| [docs/LITERATURE_SURVEY.md](docs/LITERATURE_SURVEY.md) | Review of related platforms, tools, and research |
| [docs/PROJECT_TIMELINE.md](docs/PROJECT_TIMELINE.md) | Semester-wise development schedule and milestones |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Functional & non-functional requirements, use cases |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | Endpoint documentation, auth flow, error codes |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker, manual setup, environment configuration |

---

## Development

### Prerequisites

- **Java 21+** (OpenJDK or Temurin)
- **Node.js 18+** and **npm 9+**
- **Python 3.11+** with `pip`
- **PostgreSQL 16+**
- **Docker & Docker Compose** (optional but recommended)
- **LM Studio** with a loaded GGUF model (optional for AI features)

### Local Setup (Without Docker)

```bash
# 1. Database
createdb equimind
psql equimind < sql/schema.sql

# 2. Backend
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# 3. Data Pipeline (one-time seed + periodic runs)
cd data-pipeline
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py --mode demo          # Seed with S&P 500 demo data

# 4. Frontend
cd frontend
npm install
npm run dev
```

### Makefile Commands

```bash
make build          # Build all services
make up             # docker-compose up -d
make down           # docker-compose down
make seed           # Run demo seed
make test           # Run backend + frontend tests
make lint           # Run ESLint + Spotless
```

---

## Contributing

We welcome contributions — bug fixes, documentation improvements, and feature suggestions.

1. **Fork** the repository
2. **Branch** from `main`: `git checkout -b feature/your-feature`
3. **Commit** with clear messages: `git commit -m "feat: add sector heatmap to dashboard"`
4. **Push** and open a **Pull Request**

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for coding standards, commit conventions, and review process.

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

---

## Acknowledgements

- **[Zerodha Kite](https://kite.zerodha.com/)** — Design inspiration for data density and information architecture
- **[yfinance](https://github.com/ranaroussi/yfinance)** — Reliable market data fetching
- **[LM Studio](https://lmstudio.ai/)** — Local LLM inference without API costs
- **[Spring Boot](https://spring.io/projects/spring-boot)** — Opinionated backend framework
- **[React](https://react.dev/)** — Declarative UI library
- **[Recharts](https://recharts.org/)** — Composable React charts
- **[shadcn/ui](https://ui.shadcn.com/)** — Accessible component primitives

---

<div align="center">

**Built for academic demonstration · Not financial advice**

[Website](https://equimind.dev) · [Documentation](https://docs.equimind.dev) · [Discussions](https://github.com/equimind-ai/equimind/discussions)

</div>
