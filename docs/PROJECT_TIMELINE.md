# Project Timeline

## Overview

**Project Duration**: 1 Semester (~16 weeks)
**Start Date**: August 2026
**End Date**: December 2026

---

## Phase Summary

| Phase | Duration | Weeks | Focus |
|---|---|---|---|
| **Phase 1** — Foundation | 3 weeks | Week 1–3 | Planning, environment setup, database design |
| **Phase 2** — Data Pipeline | 3 weeks | Week 4–6 | Batch ingestion, validation, storage |
| **Phase 3** — Backend API | 3 weeks | Week 7–9 | Spring Boot API, authentication, core endpoints |
| **Phase 4** — Frontend | 3 weeks | Week 10–12 | React UI, charting, pages |
| **Phase 5** — AI Integration | 2 weeks | Week 13–14 | LM Studio integration, structured summaries |
| **Phase 6** — Polish & Submission | 2 weeks | Week 15–16 | Testing, demo mode, documentation, deployment |

---

## Detailed Timeline

### Phase 1 — Foundation (Week 1–3)

> **Goal**: Project planning, environment setup, database schema design, and Docker configuration.

| Week | Task | Deliverable |
|---|---|---|
| **Week 1** | Project proposal, requirements gathering, literature survey | Problem Statement, Literature Survey documents |
| **Week 1** | Set up Git repository with `.gitignore`, README | Repository initialized |
| **Week 2** | Design PostgreSQL schema (stocks, prices, fundamentals, indicators, users) | `schema.sql` with all tables |
| **Week 2** | Set up Docker Compose for PostgreSQL + pgAdmin | Working database container |
| **Week 3** | Initialize Spring Boot project with dependencies | Backend skeleton with health endpoint |
| **Week 3** | Initialize React project with routing structure | Frontend skeleton with placeholder pages |

**Milestone**: ✅ All services start via `docker-compose up`, database schema deployed, skeleton apps running.

---

### Phase 2 — Data Pipeline (Week 4–6)

> **Goal**: Build the Python batch pipeline that fetches, validates, and stores market data.

| Week | Task | Deliverable |
|---|---|---|
| **Week 4** | Yahoo Finance data fetching module (yfinance) | Price + fundamental data for S&P 500 |
| **Week 4** | Data validation layer (completeness, range checks) | Validation reports with error counts |
| **Week 5** | Data normalization and PostgreSQL insertion | Clean data in database tables |
| **Week 5** | Technical indicator calculations (RSI, MACD, Bollinger, MAs) | Indicator values stored per stock |
| **Week 6** | Pipeline scheduling (cron / scheduled task) | Automated daily pipeline run |
| **Week 6** | Pipeline logging and status tracking | Pipeline log output, status metadata |

**Milestone**: ✅ Complete pipeline: `Yahoo Finance → Validate → Normalize → Compute → PostgreSQL`. Pipeline runs on schedule and logs results.

---

### Phase 3 — Backend API (Week 7–9)

> **Goal**: Build Spring Boot REST API with authentication, stock data, and analysis endpoints.

| Week | Task | Deliverable |
|---|---|---|
| **Week 7** | User authentication (JWT registration, login, token refresh) | `/api/auth/*` endpoints working |
| **Week 7** | Stock listing and search endpoints | `/api/stocks`, `/api/stocks/search` |
| **Week 8** | Stock detail endpoint (price history, fundamentals, indicators) | `/api/stocks/{ticker}` with full data |
| **Week 8** | EquiMind Score calculation service | Score computation with sub-score breakdown |
| **Week 9** | Screener endpoint with multi-criteria filtering | `/api/screener` with query parameters |
| **Week 9** | Watchlist and Portfolio CRUD endpoints | `/api/watchlist/*`, `/api/portfolio/*` |

**Milestone**: ✅ Full REST API with authentication. All endpoints tested via Postman/Swagger. EquiMind Score returns explainable breakdown.

---

### Phase 4 — Frontend (Week 10–12)

> **Goal**: Build React frontend with dashboard, stock detail, screener, and portfolio pages.

| Week | Task | Deliverable |
|---|---|---|
| **Week 10** | Authentication pages (login, register) | Working login/register flow |
| **Week 10** | Dashboard page (market overview, portfolio summary) | Dashboard with data freshness indicator |
| **Week 11** | Stock detail page (price chart, fundamentals table, EquiMind Score) | Interactive stock detail with Chart.js |
| **Week 11** | Technical analysis charts (RSI, MACD, Bollinger Bands) | Overlay charts with indicator visualization |
| **Week 12** | Screener page with filter controls | Working stock screener with results table |
| **Week 12** | Watchlist and Portfolio management pages | Add/remove stocks, track holdings |

**Milestone**: ✅ Fully functional web UI. Users can register, browse stocks, view analysis, screen stocks, and manage portfolios.

---

### Phase 5 — AI Integration (Week 13–14)

> **Goal**: Integrate LM Studio for structured AI stock summaries and news sentiment.

| Week | Task | Deliverable |
|---|---|---|
| **Week 13** | LM Studio setup and API integration in Python pipeline | LM Studio responding to structured prompts |
| **Week 13** | Structured AI output (JSON: summary, bull_case, risk_factors, sentiment) | AI summaries stored in PostgreSQL |
| **Week 14** | AI summary display on stock detail page | AI Summary section with source attribution |
| **Week 14** | News sentiment analysis integration | Sentiment labels on recent news |
| **Week 14** | AI confidence/status indicators | "AI-generated" labels with data date |

**Milestone**: ✅ Each stock has a structured AI summary. Frontend displays AI analysis with transparency labels and data sources.

---

### Phase 6 — Polish & Submission (Week 15–16)

> **Goal**: Testing, demo mode, documentation, final deployment, and project submission.

| Week | Task | Deliverable |
|---|---|---|
| **Week 15** | Demo mode implementation (static dataset) | `DATA_MODE=DEMO` working independently |
| **Week 15** | Admin data pipeline status page | `/admin/data-status` showing pipeline health |
| **Week 15** | Automated tests for financial calculations | Test suite validating scores and indicators |
| **Week 16** | Final Docker Compose configuration | Single-command deployment |
| **Week 16** | Project documentation, presentation slides | Final report, demo video, slides |
| **Week 16** | Bug fixes and UI polish | Production-ready application |

**Milestone**: ✅ Project submitted. Demo-ready application with documentation, tests, and reproducible deployment.

---

## Gantt Chart

```
Week:    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16
         ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
Phase 1  ████████████████
Phase 2                   ████████████████
Phase 3                                    ████████████████
Phase 4                                                     ████████████████
Phase 5                                                                      ████████████
Phase 6                                                                                ████████████
         ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
Reviews       R1              R2              R3              R4                    FINAL
```

---

## Review Schedule

| Review | Week | Date (Approx.) | Deliverables |
|---|---|---|---|
| **Review 1** | Week 3 | September 2026 | Problem statement, literature survey, database schema, project setup |
| **Review 2** | Week 6 | September 2026 | Working data pipeline, populated database |
| **Review 3** | Week 9 | October 2026 | Complete backend API with authentication and scoring |
| **Review 4** | Week 12 | November 2026 | Full frontend with all pages functional |
| **Final Submission** | Week 16 | December 2026 | Complete application, documentation, demo, presentation |

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Yahoo Finance API changes/blocks | Medium | High | Demo mode with static dataset; rate limiting in pipeline |
| LM Studio model quality issues | Medium | Medium | Test multiple GGUF models early; fallback to template-based summaries |
| Scope creep | High | High | Strictly adhere to defined scope; defer "nice-to-have" features |
| Time overruns in backend | Medium | Medium | Use Spring Boot starters and generators to accelerate development |
| Database performance | Low | Medium | Index key columns; limit universe to S&P 500 |
| Docker environment issues | Low | Low | Test Docker Compose on multiple machines early |
