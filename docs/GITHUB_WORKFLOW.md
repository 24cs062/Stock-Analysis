# EquiMind — Phased Development & GitHub Workflow

## Ground Rule

> **We do NOT build everything at once.**
> Each phase is a self-contained milestone with its own branch, issues, commits, and deliverables.
> Nothing from Phase N+1 starts until Phase N is merged and closed.

---

## Phase Overview

| Phase | Weeks | Milestone Name | Branch | Focus |
|---|---|---|---|---|
| **Phase 1** | 1–3 | `v0.1 — Foundation` | `phase-1/foundation` | Docs, DB schema, project skeleton |
| **Phase 2** | 4–6 | `v0.2 — Data Pipeline` | `phase-2/data-pipeline` | Python pipeline, ingestion, validation |
| **Phase 3** | 7–9 | `v0.3 — Backend API` | `phase-3/backend-api` | Spring Boot API, auth, endpoints |
| **Phase 4** | 10–12 | `v0.4 — Frontend` | `phase-4/frontend` | React UI, charts, pages |
| **Phase 5** | 13–14 | `v0.5 — AI Integration` | `phase-5/ai-integration` | LM Studio, structured summaries |
| **Phase 6** | 15–16 | `v1.0 — Release` | `phase-6/polish` | Demo mode, tests, final docs |

---

## GitHub Milestones to Create

Create these 6 milestones in GitHub (Settings → Milestones):

| Milestone | Due Date | Description |
|---|---|---|
| `v0.1 — Foundation` | End of Week 3 | Project setup, documentation, database schema, skeleton apps |
| `v0.2 — Data Pipeline` | End of Week 6 | Batch data pipeline fetching, validating, and storing S&P 500 data |
| `v0.3 — Backend API` | End of Week 9 | REST API with auth, stock data, scoring, and portfolio endpoints |
| `v0.4 — Frontend` | End of Week 12 | React UI with dashboard, stock detail, screener, watchlist, portfolio |
| `v0.5 — AI Integration` | End of Week 14 | LM Studio integration with structured AI summaries |
| `v1.0 — Release` | End of Week 16 | Demo mode, testing, final documentation, deployment |

---

## GitHub Issues Per Phase

### Phase 1 — Foundation (Week 1–3)

Create these issues and assign them to milestone `v0.1 — Foundation`:

| # | Issue Title | Labels | Description |
|---|---|---|---|
| 1 | Write project documentation (README, Problem Statement, Literature Survey, Timeline, Requirements) | `documentation` | Create all project docs in `docs/` folder |
| 2 | Set up `.gitignore` and repository structure | `setup` | Ignore Java, Python, Node, Docker, env files |
| 3 | Design PostgreSQL database schema | `database`, `design` | Create `sql/schema.sql` with tables: users, stocks, prices, fundamentals, indicators, watchlist, portfolio, ai_summaries, pipeline_status |
| 4 | Set up Docker Compose for PostgreSQL | `infrastructure` | PostgreSQL 16 container with volume persistence |
| 5 | Initialize Spring Boot backend project | `backend`, `setup` | Spring Boot 3.x with dependencies: Web, JPA, Security, PostgreSQL driver |
| 6 | Initialize React frontend project | `frontend`, `setup` | React 18 with routing, folder structure, placeholder pages |
| 7 | Configure Docker Compose for all services | `infrastructure` | Add backend, frontend, and database to `docker-compose.yml` |

**Commit message examples for Phase 1:**
```
docs: add project README with architecture overview
docs: add problem statement document
docs: add literature survey with 20 references
docs: add project timeline with 16-week plan
docs: add functional and non-functional requirements
chore: set up .gitignore for Java, Python, React, Docker
db: design initial PostgreSQL schema for stocks and users
infra: add Docker Compose with PostgreSQL service
backend: initialize Spring Boot project with core dependencies
frontend: initialize React project with routing structure
infra: add all services to Docker Compose
```

---

### Phase 2 — Data Pipeline (Week 4–6)

Create these issues and assign them to milestone `v0.2 — Data Pipeline`:

| # | Issue Title | Labels | Description |
|---|---|---|---|
| 8 | Set up Python pipeline project structure | `pipeline`, `setup` | Create `data-pipeline/` with modules: ingestion, validation, indicators, ai |
| 9 | Implement Yahoo Finance data fetching | `pipeline`, `feature` | Fetch daily prices and fundamentals for S&P 500 via yfinance |
| 10 | Implement data validation layer | `pipeline`, `feature` | Completeness checks, range validation, type checking |
| 11 | Implement data normalization and DB insertion | `pipeline`, `feature` | Clean data → PostgreSQL with proper types and timestamps |
| 12 | Calculate technical indicators (RSI, MACD, Bollinger, MAs) | `pipeline`, `feature` | Compute and store indicator values per stock |
| 13 | Add pipeline scheduling and logging | `pipeline`, `feature` | Cron scheduling, structured log output, status tracking |
| 14 | Add pipeline requirements.txt and Dockerfile | `pipeline`, `infrastructure` | Pin dependencies, containerize pipeline |

---

### Phase 3 — Backend API (Week 7–9)

Create these issues and assign them to milestone `v0.3 — Backend API`:

| # | Issue Title | Labels | Description |
|---|---|---|---|
| 15 | Implement JWT authentication (register, login, refresh) | `backend`, `auth` | `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh` |
| 16 | Implement stock listing and search endpoints | `backend`, `feature` | `/api/stocks`, `/api/stocks/search?q=` with pagination |
| 17 | Implement stock detail endpoint | `backend`, `feature` | `/api/stocks/{ticker}` returning price history, fundamentals, indicators |
| 18 | Implement EquiMind Score calculation service | `backend`, `feature` | Composite score with sub-score breakdown (profitability, growth, valuation) |
| 19 | Implement screener endpoint with filtering | `backend`, `feature` | `/api/screener` with sector, score, P/E, market cap, RSI filters |
| 20 | Implement watchlist CRUD endpoints | `backend`, `feature` | `/api/watchlist` — add, remove, list |
| 21 | Implement portfolio CRUD endpoints | `backend`, `feature` | `/api/portfolio` — add holding, edit, remove, get summary |
| 22 | Add Swagger/OpenAPI documentation | `backend`, `documentation` | Auto-generated API docs at `/swagger-ui` |

---

### Phase 4 — Frontend (Week 10–12)

Create these issues and assign them to milestone `v0.4 — Frontend`:

| # | Issue Title | Labels | Description |
|---|---|---|---|
| 23 | Build authentication pages (login, register) | `frontend`, `feature` | Login and register forms with JWT storage |
| 24 | Build dashboard page | `frontend`, `feature` | Market overview, portfolio summary, data freshness indicator |
| 25 | Build stock detail page with price chart | `frontend`, `feature` | Chart.js interactive price chart with time range selector |
| 26 | Build EquiMind Score display component | `frontend`, `feature` | Score card with sub-score breakdown and explanation |
| 27 | Build technical analysis charts | `frontend`, `feature` | RSI, MACD, Bollinger Bands as overlay charts |
| 28 | Build screener page | `frontend`, `feature` | Filter controls + sortable results table |
| 29 | Build watchlist page | `frontend`, `feature` | Watchlist table with add/remove functionality |
| 30 | Build portfolio management page | `frontend`, `feature` | Holdings table, add/edit/remove, total value and returns |

---

### Phase 5 — AI Integration (Week 13–14)

Create these issues and assign them to milestone `v0.5 — AI Integration`:

| # | Issue Title | Labels | Description |
|---|---|---|---|
| 31 | Set up LM Studio integration in Python pipeline | `pipeline`, `ai` | Connect to LM Studio API, send structured prompts |
| 32 | Implement structured AI output format | `pipeline`, `ai` | JSON output: summary, bull_case, risk_factors, sentiment |
| 33 | Build AI summary section on stock detail page | `frontend`, `ai` | Display AI analysis with source attribution and disclaimer |
| 34 | Add news sentiment integration | `pipeline`, `ai` | Fetch news, generate sentiment labels |

---

### Phase 6 — Polish & Release (Week 15–16)

Create these issues and assign them to milestone `v1.0 — Release`:

| # | Issue Title | Labels | Description |
|---|---|---|---|
| 35 | Implement demo mode (DATA_MODE=DEMO) | `feature`, `infrastructure` | Static dataset, no external API calls needed |
| 36 | Build admin data pipeline status page | `frontend`, `feature` | Pipeline health, processing stats, error rates |
| 37 | Write automated tests for financial calculations | `testing` | Validate scores and indicators for test universe |
| 38 | Final Docker Compose configuration | `infrastructure` | Single-command deployment for all services |
| 39 | Prepare project presentation and demo video | `documentation` | Slides, demo script, screen recording |
| 40 | Final documentation and README update | `documentation` | Complete all docs, verify links, add screenshots |

---

## Branch Strategy

```
main                          ← production-ready code only
│
├── phase-1/foundation        ← all Phase 1 work
│   ├── feature/db-schema     ← individual feature branches (optional)
│   └── feature/docker-setup
│
├── phase-2/data-pipeline     ← all Phase 2 work
│   ├── feature/yahoo-fetch
│   └── feature/validation
│
├── phase-3/backend-api       ← all Phase 3 work
├── phase-4/frontend          ← all Phase 4 work
├── phase-5/ai-integration    ← all Phase 5 work
└── phase-6/polish            ← all Phase 6 work
```

### Workflow per phase:

```bash
# 1. Start a new phase
git checkout main
git pull origin main
git checkout -b phase-1/foundation

# 2. Work on features (optionally use sub-branches)
git checkout -b feature/db-schema
# ... do work ...
git add .
git commit -m "db: design initial PostgreSQL schema"
git push origin feature/db-schema

# 3. Merge feature into phase branch (via PR or locally)
git checkout phase-1/foundation
git merge feature/db-schema

# 4. When phase is complete, merge into main via Pull Request
# Create PR: phase-1/foundation → main
# Title: "Phase 1 — Foundation complete"
# Link all Phase 1 issues in the PR description
# Merge and close milestone
```

---

## Labels to Create

Create these labels in GitHub (Issues → Labels):

| Label | Color | Description |
|---|---|---|
| `documentation` | `#0075ca` | Documentation tasks |
| `setup` | `#e4e669` | Project setup and initialization |
| `database` | `#7057ff` | Database schema and migrations |
| `infrastructure` | `#d876e3` | Docker, deployment, CI/CD |
| `backend` | `#0e8a16` | Spring Boot backend |
| `frontend` | `#1d76db` | React frontend |
| `pipeline` | `#f9d0c4` | Python data pipeline |
| `feature` | `#a2eeef` | New feature |
| `ai` | `#ff7b72` | AI/LLM integration |
| `auth` | `#fbca04` | Authentication & authorization |
| `testing` | `#c5def5` | Tests and validation |
| `bug` | `#d73a4a` | Bug fix |
| `design` | `#bfdadc` | Design and architecture |

---

## Commit Message Convention

Use this format:

```
<type>: <short description>

Types:
  feat     → new feature
  fix      → bug fix
  docs     → documentation only
  db       → database schema changes
  infra    → Docker, deployment, config
  backend  → Spring Boot backend changes
  frontend → React frontend changes
  pipeline → Python pipeline changes
  ai       → AI/LLM related changes
  test     → adding or updating tests
  chore    → maintenance, cleanup, dependencies
  style    → formatting, no logic change
  refactor → code restructuring, no behavior change
```

**Examples:**
```
docs: add literature survey with 20 academic references
db: add stocks and prices tables to schema
infra: configure Docker Compose for PostgreSQL
backend: implement JWT authentication endpoints
frontend: build interactive price chart component
pipeline: add Yahoo Finance data fetching module
ai: integrate LM Studio for structured summaries
test: validate EquiMind Score calculation accuracy
fix: handle missing P/E ratio in score computation
```

---

## Weekly Checklist (Week 3 onwards)

Every week, ensure:

- [ ] At least 3–5 meaningful commits pushed
- [ ] Relevant GitHub Issues created or updated
- [ ] Completed issues are closed with a comment
- [ ] Milestone progress bar is updated
- [ ] Branch is up to date with `main`
- [ ] Code compiles / runs without errors
- [ ] README or docs updated if scope changed
