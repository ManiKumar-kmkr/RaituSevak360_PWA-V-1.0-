# RaituSevak360 🌾🤖

> **AI-Powered Smart Agriculture Ecosystem & Progressive Web App (PWA)**

RaituSevak360 is a comprehensive, AI-driven agriculture platform designed to empower farmers with real-time crop advisories, soil intelligence, weather insights, labour and machinery hiring, marketplace access, and direct advisory channels.

---

## 🏛️ System Architecture

```text
                         RaituSevak360
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
           Frontend         Backend         Admin
       (Next.js PWA)    (Express + TS)  (Next.js Admin)
               │               │               │
               └───────────────┼───────────────┘
                               │
                               ▼
                            MongoDB
                               │
                               ▼
                             AI/ML
                        (FastAPI Engine)
```

---

## 🧰 Approved Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend (PWA)** | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod, Service Worker |
| **Backend** | Node.js, Express.js, TypeScript, REST APIs, JWT, Mongoose |
| **Database** | MongoDB + Mongoose |
| **AI / ML Engine** | Python, FastAPI, Scikit-learn, PyTorch, Hugging Face, LLMs, RAG, Vector Database |
| **Admin Dashboard** | Next.js, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| **External Services** | Firebase / FCM, Google Maps API, Cloud Storage, Payment Gateway |
| **DevOps & CI/CD** | GitHub Actions, Docker, Structured Security Pipelines |

---

## 📁 Repository Structure

```text
RaituSevak360/
├── frontend/         # Next.js Progressive Web App (Farmer-facing)
├── backend/          # Node.js + Express + TypeScript REST API Server
├── database/         # MongoDB Schemas, Models, and Seed Data
├── ai-ml/            # Python + FastAPI AI/ML microservices (RAG, Advisories)
├── services/         # Third-party integrations (Firebase, Maps, Storage, Payment)
├── admin/            # Next.js Admin Management Portal & Analytics
├── ui-ux/            # Design system, wireframes, prototypes, user flows
├── testing/          # Frontend, Backend, AI, Database, and Integration tests
├── security/         # Security policies, headers, rate-limiting & threat models
├── public/           # PWA manifests, icons, and static assets
├── docs/             # Technical architecture, API reference, schemas & guides
├── .github/          # GitHub Actions workflows & issue templates
├── .env.example      # Global environment configuration template
├── CONTRIBUTING.md   # Guidelines for team collaboration
├── CHANGELOG.md      # Project versioning and history
├── LICENSE           # Project license (MIT)
└── SECURITY.md       # Vulnerability disclosure and security policy
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- Python 3.10+
- MongoDB instance (local or Atlas)
- Git

### 1. Clone & Configure
```bash
git clone https://github.com/your-username/RaituSevak360.git
cd RaituSevak360
cp .env.example .env
```

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Run AI/ML Service
```bash
cd ai-ml
python -m venv .venv
source .venv/bin/activate  # Or `.venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Run Frontend (PWA)
```bash
cd frontend
npm install
npm run dev
```

### 5. Run Admin Dashboard
```bash
cd admin
npm install
npm run dev
```

---

## 🛡️ Security & Compliance
See [SECURITY.md](SECURITY.md) and the [`security/`](security/) directory for authentication protocols, threat models, and vulnerability reporting.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
