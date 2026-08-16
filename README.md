# EquiMind

> A cached, explainable equity research platform for a fixed US-stock universe, with classical financial analysis and a locally hosted AI explanation layer.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Java](https://img.shields.io/badge/Java-21-orange.svg)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)]()
[![React](https://img.shields.io/badge/React-18-blue.svg)]()
[![Python](https://img.shields.io/badge/Python-3.11+-yellow.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)]()
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)

---

## Overview

**EquiMind** is an AI-enhanced equity research platform designed for the S&P 500 universe. It combines classical financial analysis (fundamental scoring, technical indicators) with locally hosted AI-generated summaries to provide explainable, transparent stock insights — all without relying on cloud-based AI APIs.

Unlike real-time trading platforms, EquiMind uses a **batch data pipeline** architecture that fetches, validates, and caches market data on a scheduled basis. This provides reliability, reproducibility, and independence from live API availability during demonstrations.

---

## Key Features

| Feature | Description |
|---|---|
| **Dashboard** | Market overview with portfolio summary and data freshness indicators |
| **Stock Search & Detail** | Search any S&P 500 stock, view price history, fundamentals, and AI summaries |
| **EquiMind Score** | Explainable 0–100 composite score based on profitability, growth, and valuation |
| **Technical Analysis** | RSI, MACD, Bollinger Bands, and Moving Averages with interactive charts |
| **AI Summaries** | Structured, locally generated stock analysis via LM Studio (bull case, risks, sentiment) |
| **Screener** | Filter stocks by fundamental and technical criteria |
| **Watchlist & Portfolio** | Track and manage personal stock selections |
| **Data Pipeline** | Automated batch ingestion with validation, normalization, and freshness tracking |
| **Demo Mode** | Reproducible demo dataset for reliable presentations |

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   React UI  │────▶│  Spring Boot API │────▶│  PostgreSQL  │
│  (Frontend) │◀────│   (Backend)      │◀────│  (Database)  │
└─────────────┘     └──────────────────┘     └──────┬───────┘
                            │                       ▲
                            │                       │
                            ▼                       │
                    ┌──────────────┐     ┌──────────┴───────┐
                    │  LM Studio   │     │  Python Pipeline  │
                    │  (Local LLM) │     │  (Batch Ingestion)│
                    └──────────────┘     └──────────────────┘
                                                 │
                                                 ▼
                                         ┌──────────────┐
                                         │ Yahoo Finance │
                                         │   (Source)    │
                                         └──────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Chart.js / Recharts |
| **Backend API** | Java 21, Spring Boot 3.x, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 16 |
| **Data Pipeline** | Python 3.11+, pandas, yfinance, TA-Lib |
| **AI Engine** | LM Studio (local LLM inference) |
| **Containerization** | Docker, Docker Compose |
| **Authentication** | JWT-based authentication |

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- Python 3.11+
- PostgreSQL 16+
- Docker & Docker Compose
- LM Studio (with a GGUF model loaded)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/yourusername/equimind.git
cd equimind

# Start all services
docker-compose up -d

# Access the application
# Frontend:  http://localhost:3000
# API:       http://localhost:8080
# LM Studio: http://localhost:1234
```

### Manual Setup

```bash
# 1. Database
createdb equimind
psql equimind < sql/schema.sql

# 2. Backend
cd backend
./mvnw spring-boot:run

# 3. Data Pipeline
cd data-pipeline
pip install -r requirements.txt
python main.py

# 4. Frontend
cd frontend
npm install
npm run dev
```

### Demo Mode

```bash
# Run with pre-loaded demo data (no external API needed)
DATA_MODE=DEMO docker-compose up -d
```

---

## Project Structure

```
equimind/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API client services
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── backend/                # Spring Boot backend API
│   └── src/main/java/
│       └── com/equimind/
│           ├── controller/ # REST controllers
│           ├── service/    # Business logic
│           ├── repository/ # Data access layer
│           ├── model/      # Entity classes
│           └── config/     # Configuration
│
├── data-pipeline/          # Python batch data pipeline
│   ├── ingestion/          # Data fetching modules
│   ├── validation/         # Data quality checks
│   ├── indicators/         # Technical indicator calculations
│   ├── ai/                 # LM Studio integration
│   └── main.py             # Pipeline entry point
│
├── sql/                    # Database schemas and migrations
├── docker-compose.yml      # Container orchestration
├── docs/                   # Project documentation
│   ├── PROBLEM_STATEMENT.md
│   ├── LITERATURE_SURVEY.md
│   ├── PROJECT_TIMELINE.md
│   └── REQUIREMENTS.md
└── README.md
```

---

## Documentation

| Document | Description |
|---|---|
| [Problem Statement](docs/PROBLEM_STATEMENT.md) | Project motivation, objectives, and scope |
| [Literature Survey](docs/LITERATURE_SURVEY.md) | Review of related work, tools, and research |
| [Project Timeline](docs/PROJECT_TIMELINE.md) | Semester-wise development schedule |
| [Requirements](docs/REQUIREMENTS.md) | Functional and non-functional requirements |

---

## License

This project is developed as part of an academic semester project.

---

## Acknowledgements

- [Yahoo Finance](https://finance.yahoo.com/) — Market data source
- [LM Studio](https://lmstudio.ai/) — Local LLM inference
- [Spring Boot](https://spring.io/projects/spring-boot) — Backend framework
- [React](https://react.dev/) — Frontend library
