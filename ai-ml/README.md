# RaituSevak360 AI / ML Engine 🧠🌱

FastAPI microservice providing AI intelligence, crop advisories, vision-based plant disease diagnosis, soil nutrient analysis, and regional LLM RAG pipelines.

---

## 🏛️ Architecture

```text
Frontend (PWA)
    ↓
Node.js + Express Backend
    ↓
Python + FastAPI AI Engine (Port 8000)
    ├── Crop Advisor
    ├── Disease Detection (PyTorch / Vision)
    ├── Soil Intelligence (Scikit-Learn)
    ├── Weather Intelligence
    ├── Recommendation Engine
    ├── Agri Assistant Chatbot
    └── RAG Pipeline & Vector Database
```

---

## 🚀 Running Locally

```bash
# 1. Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Or `.venv\Scripts\activate` on Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start development server
uvicorn app.main:app --reload --port 8000
```

Interactive API documentation available at `http://localhost:8000/docs`.
