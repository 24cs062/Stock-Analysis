# Literature Survey

## 1. Introduction

This literature survey examines existing research, platforms, tools, and technologies relevant to the EquiMind project. The review covers five key domains: equity analysis platforms, fundamental analysis methods, technical analysis indicators, AI/NLP in finance, and data pipeline architectures.

---

## 2. Existing Equity Analysis Platforms

### 2.1 Commercial Platforms

| Platform | Strengths | Limitations | Relevance to EquiMind |
|---|---|---|---|
| **Bloomberg Terminal** | Comprehensive data, advanced analytics, real-time feeds | $20,000+/year, steep learning curve | Gold standard for analysis quality; EquiMind aims for a subset of its analytical depth |
| **Refinitiv Eikon** | Institutional-grade data, Excel integration | $22,000+/year, enterprise-focused | Validates the market need for integrated fundamental + technical analysis |
| **Morningstar** | Strong fundamental analysis, star ratings | Subscription-based, limited technical analysis | Inspiration for EquiMind's scoring methodology |
| **TradingView** | Excellent charting, community features | Limited fundamental data, freemium model | Reference for technical indicator visualization |

### 2.2 Retail / Consumer Platforms

| Platform | Strengths | Limitations | Relevance to EquiMind |
|---|---|---|---|
| **Yahoo Finance** | Free, comprehensive data, API availability | No composite scoring, basic analysis tools | Primary data source for EquiMind |
| **Robinhood** | Clean UI, gamified experience | Oversimplified analysis, no fundamental scoring | Anti-pattern: EquiMind prioritizes depth over simplicity |
| **Groww** | Indian market focus, beginner-friendly | Limited analytical features | Demonstrates demand for accessible analysis |
| **Finviz** | Powerful screener, heatmaps | Limited AI integration, no portfolio tracking | Inspiration for EquiMind's screener feature |

### 2.3 Gap Analysis

Existing platforms either provide raw data without synthesis (Yahoo Finance), oversimplified metrics without explanation (Robinhood), or comprehensive analysis at prohibitive cost (Bloomberg). EquiMind addresses the gap by combining **explainable scoring**, **technical analysis**, and **AI-generated insights** in a free, self-hosted platform.

---

## 3. Fundamental Analysis

### 3.1 Classical Valuation Methods

**Graham & Dodd (1934)** established the foundation of security analysis through intrinsic value computation. Their work on margin of safety remains the basis of modern fundamental analysis. EquiMind's scoring system draws from this tradition by evaluating stocks against quantifiable financial metrics.

**Discounted Cash Flow (DCF)** models, formalized by Williams (1938) and popularized by Damodaran (2012), estimate intrinsic value by discounting projected future cash flows. While EquiMind does not implement full DCF due to the complexity of cash flow projection, the principle of value-based scoring informs the valuation sub-score.

### 3.2 Financial Ratio Analysis

| Ratio Category | Key Metrics | Academic Basis |
|---|---|---|
| **Profitability** | ROE, ROA, Net Margin, Gross Margin | DuPont Analysis (1920s) |
| **Growth** | Revenue Growth, EPS Growth, Earnings Growth | Sustainable Growth Rate (Higgins, 1977) |
| **Valuation** | P/E, P/B, P/S, EV/EBITDA | Relative Valuation (Damodaran, 2006) |
| **Liquidity** | Current Ratio, Quick Ratio | Working Capital Analysis |
| **Leverage** | Debt-to-Equity, Interest Coverage | Modigliani-Miller Theorem (1958) |

**Piotroski F-Score (2000)** provides a 9-point scoring system based on profitability, leverage, and operating efficiency signals. This directly inspires EquiMind's composite scoring approach, though EquiMind uses a continuous 0–100 scale for finer granularity.

### 3.3 Composite Scoring Systems

| System | Scale | Components | Reference |
|---|---|---|---|
| **Piotroski F-Score** | 0–9 | 9 binary signals (profitability, leverage, efficiency) | Piotroski (2000) |
| **Altman Z-Score** | Continuous | 5 financial ratios (bankruptcy prediction) | Altman (1968) |
| **Morningstar Quantitative Rating** | 1–5 stars | Fair value estimate, uncertainty, economic moat | Morningstar (2019) |
| **EquiMind Score** | 0–100 | Profitability, Growth, Valuation (weighted sub-scores) | This project |

---

## 4. Technical Analysis

### 4.1 Technical Indicators

**Relative Strength Index (RSI)** — Wilder (1978) introduced RSI as a momentum oscillator measuring the speed and magnitude of price changes on a 0–100 scale. Values above 70 indicate overbought conditions; below 30 indicate oversold. EquiMind implements the standard 14-period RSI.

**Moving Average Convergence Divergence (MACD)** — Appel (1979) developed MACD as a trend-following momentum indicator using the difference between 26-period and 12-period exponential moving averages. The 9-period signal line generates buy/sell crossover signals.

**Bollinger Bands** — Bollinger (1983, formalized 2001) uses a 20-period moving average with bands at ±2 standard deviations to identify volatility and potential price reversals. Prices touching the upper band may indicate overbought conditions, while touching the lower band may indicate oversold.

**Moving Averages** — Simple Moving Averages (SMA) and Exponential Moving Averages (EMA) are among the oldest technical tools. The 50-day and 200-day crossovers ("Golden Cross" and "Death Cross") remain widely used trend signals. Murphy (1999) provides comprehensive coverage.

### 4.2 Efficacy of Technical Analysis

The academic debate on technical analysis efficacy is extensive:

- **Efficient Market Hypothesis (EMH)** — Fama (1970) argues that prices reflect all available information, implying technical analysis cannot consistently generate excess returns.
- **Behavioral Finance** — Shiller (2000) and Kahneman (2011) demonstrate that markets exhibit predictable behavioral patterns that technical indicators can capture.
- **Empirical Evidence** — Lo, Mamaysky & Wang (2000) found that certain technical patterns have predictive power, particularly in short-term horizons.

**EquiMind's position**: Technical indicators are presented as **informational tools**, not predictive signals. The platform explicitly avoids making buy/sell recommendations.

---

## 5. AI and NLP in Finance

### 5.1 Sentiment Analysis in Finance

| Study | Approach | Key Finding |
|---|---|---|
| Bollen et al. (2011) | Twitter mood analysis → DJIA prediction | Certain mood dimensions (calm) predicted market movements with 87.6% accuracy |
| Loughran & McDonald (2011) | Domain-specific financial sentiment lexicon | General-purpose sentiment tools misclassify financial text; domain-specific dictionaries are essential |
| Araci (2019) | FinBERT: pre-trained NLP for financial text | BERT fine-tuned on financial communication outperforms general models on financial sentiment |

### 5.2 Large Language Models in Financial Analysis

| Model/Approach | Application | Relevance |
|---|---|---|
| **GPT-4 / Claude** (2023–2024) | General-purpose financial Q&A, summarization | Demonstrates capability but raises cloud dependency and cost concerns |
| **FinGPT** (Yang et al., 2023) | Open-source financial LLM | Validates the feasibility of domain-specific LLMs for financial analysis |
| **BloombergGPT** (Wu et al., 2023) | 50B parameter model trained on financial data | Shows significant improvement on financial NLP tasks with domain-specific training |
| **Local LLMs** (LM Studio, Ollama) | Self-hosted inference | Enables privacy-preserving, cost-free AI analysis — core to EquiMind's approach |

### 5.3 Structured AI Output

Recent work on structured generation (Guidance, LMQL, JSON-mode LLMs) enables reliable extraction of formatted data from LLMs. EquiMind leverages this by requesting JSON-structured responses from LM Studio, ensuring consistent output for frontend rendering.

---

## 6. Data Pipeline Architectures

### 6.1 Batch vs. Stream Processing

| Approach | Examples | Pros | Cons |
|---|---|---|---|
| **Batch Processing** | Apache Spark, cron + Python | Simple, reliable, cost-effective | Latency (data is not real-time) |
| **Stream Processing** | Apache Kafka, Flink | Low latency, real-time updates | Complex infrastructure, costly |
| **Lambda Architecture** | Batch + Stream hybrid | Best of both worlds | Operational complexity |

**EquiMind uses batch processing** — a deliberate architectural decision. For a platform analyzing daily-frequency financial data (not high-frequency trading), batch processing provides reliability and simplicity without meaningful latency trade-offs.

### 6.2 Data Quality Frameworks

| Framework | Approach | Relevance |
|---|---|---|
| **Great Expectations** | Python-based data validation | Inspiration for EquiMind's validation layer |
| **dbt** | SQL-based data transformation | Model for declarative data pipelines |
| **Apache Airflow** | Workflow orchestration | Reference for pipeline scheduling (EquiMind uses simpler cron-based scheduling) |

### 6.3 EquiMind's Pipeline Design

EquiMind's data pipeline follows a simplified ELT (Extract, Load, Transform) pattern:

```
Extract (Yahoo Finance)
    → Validate (completeness, range checks, type validation)
    → Normalize (standard formats, timezone handling)
    → Compute (technical indicators, fundamental scores)
    → Generate (AI summaries via LM Studio)
    → Load (PostgreSQL with freshness metadata)
```

---

## 7. Related Open-Source Projects

| Project | Description | Differentiator from EquiMind |
|---|---|---|
| **OpenBB Terminal** | Open-source investment research platform | CLI-based, no web UI, no AI summaries |
| **Stocksera** | Stock analysis with alternative data | Focused on social sentiment, no fundamental scoring |
| **FinanceToolkit** | Python toolkit for financial analysis | Library, not a platform; no UI or AI integration |
| **Quant-UX** | Quantitative analysis tools | Research-focused, no retail investor UX |

---

## 8. Technology Stack Justification

| Technology | Alternatives Considered | Reason for Selection |
|---|---|---|
| **Spring Boot** | Django, Express.js, FastAPI | Enterprise-grade, strong JPA/Security ecosystem, academic relevance |
| **React** | Vue.js, Angular, Svelte | Largest ecosystem, component reusability, charting library support |
| **PostgreSQL** | MySQL, MongoDB, SQLite | ACID compliance, JSON support, advanced query capabilities |
| **Python (Pipeline)** | Java, Node.js | pandas/yfinance ecosystem, rapid prototyping for data tasks |
| **LM Studio** | Ollama, vLLM, cloud APIs | GUI for model management, OpenAI-compatible API, zero cloud cost |
| **Docker Compose** | Kubernetes, manual deployment | Appropriate complexity for single-machine deployment |

---

## 9. Summary

This literature survey establishes that:

1. **A gap exists** between oversimplified retail platforms and expensive professional terminals.
2. **Composite scoring systems** (Piotroski, Altman) provide proven frameworks for quantifying stock quality.
3. **Technical indicators** (RSI, MACD, Bollinger Bands) are well-established tools with both academic support and criticism.
4. **Local LLMs** are now capable enough for structured financial summarization without cloud dependency.
5. **Batch data pipelines** are the appropriate architecture for daily-frequency financial data.

EquiMind synthesizes these findings into a unified, explainable, self-hosted equity research platform.

---

## References

1. Altman, E. I. (1968). Financial ratios, discriminant analysis and the prediction of corporate bankruptcy. *The Journal of Finance*, 23(4), 589–609.
2. Appel, G. (1979). *The Moving Average Convergence-Divergence Trading Method*. Signalert.
3. Araci, D. (2019). FinBERT: Financial Sentiment Analysis with Pre-Trained Language Models. *arXiv preprint arXiv:1908.10063*.
4. Bollinger, J. (2001). *Bollinger on Bollinger Bands*. McGraw-Hill.
5. Bollen, J., Mao, H., & Zeng, X. (2011). Twitter mood predicts the stock market. *Journal of Computational Science*, 2(1), 1–8.
6. Damodaran, A. (2006). *Damodaran on Valuation: Security Analysis for Investment and Corporate Finance*. Wiley.
7. Damodaran, A. (2012). *Investment Valuation: Tools and Techniques for Determining the Value of Any Asset*. Wiley.
8. Fama, E. F. (1970). Efficient capital markets: A review of theory and empirical work. *The Journal of Finance*, 25(2), 383–417.
9. Graham, B., & Dodd, D. (1934). *Security Analysis*. McGraw-Hill.
10. Higgins, R. C. (1977). How much growth can a firm afford? *Financial Management*, 6(3), 7–16.
11. Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
12. Lo, A. W., Mamaysky, H., & Wang, J. (2000). Foundations of technical analysis. *The Journal of Finance*, 55(4), 1705–1765.
13. Loughran, T., & McDonald, B. (2011). When is a liability not a liability? *The Journal of Finance*, 66(1), 35–65.
14. Murphy, J. J. (1999). *Technical Analysis of the Financial Markets*. New York Institute of Finance.
15. Piotroski, J. D. (2000). Value investing: The use of historical financial statement information to separate winners from losers. *Journal of Accounting Research*, 38, 1–41.
16. Shiller, R. J. (2000). *Irrational Exuberance*. Princeton University Press.
17. Wilder, J. W. (1978). *New Concepts in Technical Trading Systems*. Trend Research.
18. Williams, J. B. (1938). *The Theory of Investment Value*. Harvard University Press.
19. Wu, S., et al. (2023). BloombergGPT: A Large Language Model for Finance. *arXiv preprint arXiv:2303.17564*.
20. Yang, H., et al. (2023). FinGPT: Open-Source Financial Large Language Models. *arXiv preprint arXiv:2306.06031*.
