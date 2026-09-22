# Contributing to RaituSevak360

Thank you for your interest in contributing to **RaituSevak360**! We welcome modular, team-based contributions across all aspects of the ecosystem (Frontend, Backend, AI/ML, UI/UX, Testing, Security, and DevOps).

---

## 🏗️ Architecture Principles

1. **Monorepo Integrity**: All modules live within this single repository. Do not create external micro-repos.
2. **Layer Separation**:
   - **Frontend**: Communicates strictly via REST APIs to Backend. Never directly connects to MongoDB or AI models.
   - **Backend**: Express + TypeScript handles business logic and acts as the orchestrator to MongoDB and the Python AI/ML microservice.
   - **AI/ML**: Python FastAPI microservice that provides endpoints consumed by the Backend.
3. **Approved Stack**: Strictly adhere to the approved technology stack outlined in `README.md` and `REPOSTRUCTURE.MD`.

---

## 🌿 Branching Strategy & Workflow

We follow a feature-branch workflow:

- `main`: Stable, production-ready release branch.
- `develop`: Integration branch for tested features.
- `feature/<module>-<description>`: E.g., `feature/frontend-crop-card`, `feature/backend-weather-api`.
- `bugfix/<issue-id>-<description>`: E.g., `bugfix/auth-token-expiry`.

### Step-by-Step Contribution Process

1. **Create an Issue**: Open or assign yourself to an issue before starting work.
2. **Branch from `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. **Commit Messages**: Use standard conventional commits:
   - `feat(frontend): add responsive crop advisory card`
   - `fix(backend): correct jwt token expiration check`
   - `docs(api): update swagger/api specs for /crops endpoint`
4. **Run Tests & Linters**: Ensure all layer-specific tests and lint checks pass before pushing.
5. **Open a Pull Request**: Submit your PR targeting `develop` using the provided PR template.

---

## 🧪 Testing Requirements

- **Frontend**: Write unit and integration tests using React Testing Library.
- **Backend**: Provide unit tests for controllers/services and integration tests for API routes.
- **AI/ML**: Write pytest test suites covering FastAPI endpoints and inference functions.

---

## 🛡️ Code of Conduct

Please maintain a professional, inclusive, and collaborative environment. Be respectful and supportive of all team members and contributors.
