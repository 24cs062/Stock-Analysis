# Problem Statement

## 1. Introduction

The modern retail investor faces a significant challenge: **information overload without actionable insight**. While financial data is abundantly available through platforms like Yahoo Finance, Google Finance, and Bloomberg Terminal, the ability to synthesize this data into coherent, explainable investment analysis remains largely inaccessible to non-professional investors.

Existing platforms fall into two extremes:
- **Oversimplified apps** (e.g., Robinhood, Groww) that provide prices and basic charts but lack analytical depth.
- **Professional terminals** (e.g., Bloomberg, Refinitiv) that offer comprehensive analysis but cost $20,000+/year and require domain expertise to interpret.

There is a clear gap for an **intermediate-tier, explainable equity research platform** that combines quantitative financial analysis with AI-generated natural language insights — accessible, transparent, and free from cloud AI dependency.

---

## 2. Problem Definition

> **How can we build an explainable, AI-enhanced equity research platform that provides retail investors with institutional-grade stock analysis using classical financial metrics, technical indicators, and locally hosted AI — while maintaining data transparency, reproducibility, and independence from cloud services?**

### Sub-Problems

1. **Data Acquisition & Quality**: How to reliably fetch, validate, and normalize market data from free sources (Yahoo Finance) for a fixed universe of S&P 500 stocks, handling missing data, API rate limits, and staleness gracefully.

2. **Fundamental Analysis**: How to compute a meaningful, explainable composite score (EquiMind Score) from profitability, growth, and valuation metrics — with clear attribution of each sub-score.

3. **Technical Analysis**: How to calculate and visualize standard technical indicators (RSI, MACD, Bollinger Bands, Moving Averages) accurately, with proper handling of edge cases and insufficient data.

4. **AI-Powered Summarization**: How to generate structured, transparent AI analysis using a locally hosted LLM (via LM Studio) that produces consistent, defensible outputs — not black-box predictions.

5. **Data Freshness & Transparency**: How to clearly communicate data age and source to users, avoiding the false impression of real-time data when the system uses a batch pipeline.

6. **Reliability**: How to ensure the system works during live demonstrations via a reproducible demo dataset, even when external APIs are unavailable.

---

## 3. Objectives

### Primary Objectives

| # | Objective | Measurable Outcome |
|---|---|---|
| O1 | Build a full-stack equity research platform | Working application with authentication, dashboard, stock detail, screener, watchlist, and portfolio |
| O2 | Implement explainable fundamental scoring | EquiMind Score (0–100) with sub-score breakdown visible to users |
| O3 | Integrate technical analysis indicators | RSI, MACD, Bollinger Bands, and Moving Averages with interactive charts |
| O4 | Develop AI-powered stock summaries | Structured JSON output from LM Studio with bull case, risk factors, and sentiment |
| O5 | Build an automated data pipeline | Batch pipeline with ingestion → validation → normalization → storage |
| O6 | Ensure data transparency | Data freshness timestamps and source attribution on every data point |

### Secondary Objectives

| # | Objective | Measurable Outcome |
|---|---|---|
| S1 | Implement demo mode | Application runs fully on a static dataset without external API calls |
| S2 | Create a data pipeline status page | Admin page showing pipeline health, processing stats, and error rates |
| S3 | Dockerize the entire system | Single `docker-compose up` command launches all services |
| S4 | Validate financial calculations | Automated test suite verifying known values for a test universe |

---

## 4. Scope

### In Scope

- **Stock Universe**: S&P 500 constituents (~503 stocks)
- **Data Sources**: Yahoo Finance (prices, fundamentals, news)
- **Analysis Types**: Fundamental scoring, technical indicators, AI summaries
- **User Features**: Authentication, dashboard, search, stock detail, screener, watchlist, portfolio
- **AI**: Locally hosted LLM via LM Studio (no cloud API dependency)
- **Deployment**: Docker Compose for local/demo deployment

### Out of Scope

| Feature | Reason |
|---|---|
| Real-time streaming prices | Requires WebSocket infrastructure and paid data feeds |
| Trade execution | Regulatory complexity, liability, and broker API costs |
| Options / derivatives analytics | Significantly increases mathematical and data complexity |
| Cryptocurrency | Different market structure, data sources, and trading hours |
| Mobile application | Time constraints; responsive web UI serves as alternative |
| Multi-user social features | Community features add scope without advancing core analysis |
| SEC filings / earnings transcripts | NLP pipeline complexity exceeds semester timeline |
| Portfolio optimization (VaR, Sharpe) | Requires advanced quantitative finance implementation |

---

## 5. Expected Outcomes

1. A **working, deployable** equity research platform accessible via web browser.
2. An **explainable scoring system** that demystifies stock analysis for retail investors.
3. A **local AI integration** demonstrating practical LLM usage without cloud dependency.
4. A **reliable data pipeline** with quality controls, freshness tracking, and graceful error handling.
5. A **reproducible demo** that functions independently of external API availability.
6. Comprehensive **documentation** suitable for academic evaluation and future development.

---

## 6. Significance

This project addresses several gaps in the current landscape:

- **Educational Value**: Makes institutional-grade analysis accessible and understandable.
- **Privacy**: All AI processing happens locally — no user data leaves the machine.
- **Transparency**: Every score, indicator, and AI summary includes its data source and generation date.
- **Reproducibility**: Demo mode enables consistent demonstrations regardless of external service availability.
- **Practical LLM Application**: Demonstrates a real-world, engineered AI integration beyond simple chatbot interfaces.
