# System Architecture Overview

RaituSevak360 operates as an integrated monorepo ecosystem with clear boundaries between the presentation, orchestration, data, and machine intelligence tiers.

```text
                                  RaituSevak360
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
             Frontend (PWA)       Backend (REST API)     Admin Dashboard
             (Next.js 14+)          (Express + TS)        (Next.js 14+)
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                                        ▼
                                     MongoDB
                                        │
                                        ▼
                                  AI/ML Engine
                                (FastAPI Python)
```

## Core Tenets
1. **Unidirectional AI Communication**: The frontend never directly talks to AI models. All requests pass through Node.js/Express for auth verification and rate limiting.
2. **Direct Schema Isolation**: Mongoose models are isolated in the `database/` module and consumed by the backend.
3. **PWA-First Approach**: Farmers have reliable access to cached agronomy guides and offline emergency contacts.
