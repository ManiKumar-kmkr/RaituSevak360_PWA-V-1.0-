# RaituSevak360

## GitHub Repository Structure Requirements for Antigravity

**Project:** RaituSevak360
**Project Type:** AI-Powered Smart Agriculture Ecosystem
**Application Type:** Progressive Web App (PWA)
**Repository Type:** Single GitHub Repository / Monorepo
**Development Approach:** Team-based modular development

---

# 1. Purpose of This Document

This document is the **source of truth for generating the initial RaituSevak360 GitHub repository structure**.

Antigravity must use this document to create the complete repository structure for the project.

The repository must support development by multiple team members working on:

* PWA Frontend
* Backend
* Database
* AI/ML
* External Services
* Admin Dashboard
* UI/UX
* Testing
* Security
* Documentation
* DevOps

The repository must be structured so that every developer can work on their assigned area without creating unnecessary coupling or mixing unrelated code.

---

# 2. Critical Instructions

Antigravity MUST follow these rules.

## 2.1 Single Repository

Create only one repository:

```text
RaituSevak360
```

Do NOT create separate repositories for:

* Frontend
* Backend
* Database
* AI
* Testing
* Security
* Admin

Everything must exist inside the same repository.

---

# 3. Application Scope

RaituSevak360 is an AI-powered agriculture ecosystem for farmers.

The PWA will provide functionality related to:

* Farmer accounts
* Farmer profiles
* Farm management
* Crop management
* Weather information
* Soil intelligence
* AI crop advisory
* AI recommendations
* Labour services
* Machinery services
* Booking services
* Agricultural marketplace
* Notifications
* Location-based services
* Payments
* Admin management
* Analytics

The repository must be designed so these modules can be implemented incrementally.

Do not generate fake completed features.

Create the architecture and foundations first.

---

# 4. Approved Technology Stack

The technology stack is FIXED.

Antigravity must NOT introduce technologies outside this approved stack unless explicitly requested later.

---

## 4.1 Frontend

Use:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
TanStack Query
Zustand
React Hook Form
Zod
PWA
Service Worker
Web App Manifest
```

---

## 4.2 Backend

Use:

```text
Node.js
Express.js
TypeScript
REST APIs
JWT
Mongoose
```

Backend must be a separate logical application inside the same repository.

---

## 4.3 Database

Use:

```text
MongoDB
```

Database interaction must use:

```text
Mongoose
```

---

## 4.4 AI / ML

Use:

```text
Python
FastAPI
Scikit-learn
PyTorch
Hugging Face
LLMs
RAG
Vector Database
```

AI/ML must remain logically separated from the Node.js backend.

---

## 4.5 External Services

Use only:

```text
Firebase / FCM
Google Maps API
Cloud Storage
Payment Gateway
Location Services
```

---

## 4.6 Admin Dashboard

Use:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Recharts
```

---

## 4.7 Development Tools

Use:

```text
VS Code / Cursor
Git
GitHub
Postman
MongoDB Compass
```

---

## 4.8 DevOps

Use:

```text
GitHub Actions
Docker
Cloud Deployment
Monitoring
Logging
```

---

# 5. Technologies NOT To Add

Do NOT add unrelated frameworks or technologies.

Do NOT introduce:

```text
React Native
Flutter
Kotlin
Android Studio
iOS
Django
Django REST Framework
Spring Boot
Laravel
Firebase Database
Supabase
PostgreSQL
MySQL
Prisma
GraphQL
Next.js as backend replacement
```

The backend MUST remain:

```text
Node.js + Express.js + TypeScript + REST APIs + JWT + Mongoose
```

The database MUST remain:

```text
MongoDB
```

The frontend MUST remain:

```text
Next.js + React + TypeScript
```

---

# 6. Required Root Repository Structure

Antigravity must create:

```text
RaituSevak360/
│
├── frontend/
├── backend/
├── database/
├── ai-ml/
├── services/
├── admin/
├── ui-ux/
├── testing/
├── security/
├── public/
├── docs/
│
├── .github/
│
├── .env.example
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
└── SECURITY.md
```

---

# 7. Frontend Structure

The `frontend/` directory contains the farmer-facing PWA.

Required structure:

```text
frontend/
│
├── app/
│   │
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   └── layout.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-otp/
│   │   └── forgot-password/
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── profile/
│   │   ├── farm/
│   │   ├── crops/
│   │   ├── weather/
│   │   ├── soil/
│   │   ├── ai-advisor/
│   │   ├── labour/
│   │   ├── machinery/
│   │   ├── marketplace/
│   │   ├── notifications/
│   │   └── settings/
│   │
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── navbar/
│   ├── sidebar/
│   ├── dashboard/
│   ├── farmer/
│   ├── crops/
│   ├── weather/
│   ├── soil/
│   ├── ai/
│   ├── labour/
│   ├── machinery/
│   ├── marketplace/
│   └── notifications/
│
├── hooks/
│
├── store/
│
├── services/
│
├── validations/
│
├── types/
│
└── styles/
    └── globals.css
```

---

# 8. Frontend Folder Responsibilities

## `frontend/app/`

Contains Next.js application routes and pages.

Examples:

```text
login
register
dashboard
profile
farm
crops
weather
soil
ai-advisor
labour
machinery
marketplace
notifications
settings
```

---

## `frontend/components/`

Contains reusable React components.

Examples:

```text
Button
Input
Card
Modal
Navbar
Sidebar
CropCard
WeatherCard
ProductCard
BookingCard
AdvisoryCard
```

Components must be reusable.

Avoid putting business logic directly inside generic UI components.

---

## `frontend/hooks/`

Contains reusable React hooks.

Examples:

```text
useAuth
useLocation
useFarmer
useDebounce
```

---

## `frontend/store/`

Contains Zustand stores.

Examples:

```text
auth-store.ts
farmer-store.ts
cart-store.ts
ui-store.ts
```

Only client-side state that actually needs global management should be stored here.

---

## `frontend/services/`

Contains frontend API communication.

Examples:

```text
api.ts
auth.ts
farmer.ts
crops.ts
weather.ts
soil.ts
ai.ts
labour.ts
machinery.ts
marketplace.ts
```

Frontend must communicate with the backend through REST APIs.

Frontend must NOT directly access MongoDB.

---

## `frontend/validations/`

Contains Zod schemas for frontend form validation.

Examples:

```text
auth.ts
farmer.ts
crop.ts
booking.ts
marketplace.ts
```

---

## `frontend/types/`

Contains TypeScript types used by the frontend.

---

# 9. Backend Structure

Required structure:

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── environment.ts
│   │   └── services.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── farmer.controller.ts
│   │   ├── crop.controller.ts
│   │   ├── weather.controller.ts
│   │   ├── soil.controller.ts
│   │   ├── labour.controller.ts
│   │   ├── machinery.controller.ts
│   │   └── marketplace.controller.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── farmer.routes.ts
│   │   ├── crop.routes.ts
│   │   ├── weather.routes.ts
│   │   ├── soil.routes.ts
│   │   ├── labour.routes.ts
│   │   ├── machinery.routes.ts
│   │   └── marketplace.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── farmer.service.ts
│   │   ├── crop.service.ts
│   │   ├── weather.service.ts
│   │   ├── labour.service.ts
│   │   ├── machinery.service.ts
│   │   └── marketplace.service.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rate-limit.middleware.ts
│   │
│   ├── models/
│   ├── validators/
│   ├── utils/
│   │
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

---

# 10. Backend Architecture

The backend must follow:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

Example:

```text
POST /api/crops
       ↓
crop.routes.ts
       ↓
crop.controller.ts
       ↓
crop.service.ts
       ↓
Crop Model
       ↓
MongoDB
```

Controllers should handle HTTP-level concerns.

Services should contain business logic.

Models should represent database structures.

---

# 11. Required API Modules

Create the architecture for these REST API modules:

```text
/auth
/farmers
/farms
/crops
/weather
/soil
/ai
/labour
/machinery
/bookings
/marketplace
/orders
/notifications
```

Do not create fake API functionality.

Create the appropriate structure and placeholder implementation where the feature has not yet been developed.

---

# 12. Database Structure

Required:

```text
database/
│
├── models/
│   ├── User.ts
│   ├── Farmer.ts
│   ├── Farm.ts
│   ├── Crop.ts
│   ├── Soil.ts
│   ├── Weather.ts
│   ├── Labour.ts
│   ├── Machinery.ts
│   ├── Booking.ts
│   ├── Product.ts
│   ├── Order.ts
│   └── Notification.ts
│
├── schemas/
├── seeds/
└── database.ts
```

Database models must use Mongoose.

MongoDB is the only database required.

---

# 13. AI/ML Structure

Required:

```text
ai-ml/
│
├── app/
│   ├── main.py
│   ├── crop-advisor/
│   ├── disease-detection/
│   ├── soil-intelligence/
│   ├── weather-intelligence/
│   ├── recommendations/
│   ├── chatbot/
│   └── rag/
│
├── models/
├── datasets/
├── embeddings/
├── vector-database/
├── requirements.txt
└── README.md
```

AI/ML must use:

```text
Python
FastAPI
Scikit-learn
PyTorch
Hugging Face
LLMs
RAG
Vector Database
```

AI services must expose APIs that can be consumed by the Node.js backend.

---

# 14. AI Communication Architecture

Required architecture:

```text
Frontend
    ↓
Node.js + Express.js
    ↓
AI API
    ↓
Python + FastAPI
    ↓
AI / ML
    ↓
Result
    ↓
Node.js Backend
    ↓
Frontend
```

The frontend must not directly communicate with internal AI models unless explicitly designed later.

---

# 15. Services Structure

Required:

```text
services/
│
├── firebase/
│   ├── notifications.ts
│   └── fcm.ts
│
├── maps/
│   └── google-maps.ts
│
├── location/
│   └── location.ts
│
├── storage/
│   └── cloud-storage.ts
│
└── payment/
    └── payment-gateway.ts
```

These files should initially contain clean integration structures/placeholders rather than fake credentials or fake production implementations.

---

# 16. Admin Dashboard

Required:

```text
admin/
│
├── app/
├── components/
├── charts/
├── services/
└── types/
```

Technology:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Recharts
```

Admin functionality will include:

```text
User Management
Farmer Management
Crop Management
Labour Management
Machinery Management
Booking Management
Marketplace Management
Order Management
Analytics
Notifications
```

---

# 17. UI/UX Structure

Required:

```text
ui-ux/
│
├── wireframes/
├── user-flows/
├── prototypes/
├── screens/
│   ├── authentication/
│   ├── farmer-dashboard/
│   ├── crop-management/
│   ├── ai-advisor/
│   ├── marketplace/
│   ├── labour/
│   ├── machinery/
│   └── admin/
│
├── design-system/
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   └── components.md
│
└── README.md
```

UI/UX work must be reflected in the frontend using:

```text
Tailwind CSS
shadcn/ui
React
Next.js
```

---

# 18. Testing Structure

Required:

```text
testing/
│
├── frontend/
├── backend/
├── database/
├── ai/
├── integration/
├── api/
└── manual/
```

Testing must cover the project layers.

Do not introduce an unapproved testing framework during repository generation.

The testing directory is initially a structured location for test implementation and test documentation.

---

# 19. Security Structure

Required:

```text
security/
│
├── authentication/
├── authorization/
├── jwt/
├── input-validation/
├── rate-limiting/
├── security-headers/
├── api-security/
├── database-security/
├── threat-model/
├── security-checklist.md
└── SECURITY.md
```

Security requirements include:

```text
JWT authentication
Role-based authorization
Input validation
Rate limiting
Secure API handling
Security headers
Database security
Secret management
Audit/logging considerations
Threat modeling
```

Never place secrets in the repository.

---

# 20. PWA Structure

Required:

```text
public/
│
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── maskable-icon.png
│
├── images/
│   ├── logo/
│   ├── crops/
│   ├── agriculture/
│   └── farmers/
│
├── manifest.json
└── sw.js
```

The PWA must support:

```text
Installability
Responsive UI
Service Worker
Web App Manifest
Mobile-friendly experience
Offline-capable behaviour where applicable
```

---

# 21. Documentation Structure

Required:

```text
docs/
│
├── architecture/
│   ├── system-architecture.md
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   └── ai-architecture.md
│
├── api/
│   └── api-documentation.md
│
├── database/
│   └── database-schema.md
│
├── ui-ux/
│   └── design-guidelines.md
│
├── testing/
│   └── testing-strategy.md
│
└── deployment/
    └── deployment-guide.md
```

---

# 22. GitHub Structure

Required:

```text
.github/
│
├── workflows/
│   ├── ci.yml
│   ├── test.yml
│   ├── security.yml
│   └── deploy.yml
│
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── security_report.md
│
└── pull_request_template.md
```

GitHub Actions should be structured for:

```text
Code validation
Testing
Security checks
Deployment
```

Do not create fake deployment credentials.

---

# 23. Root Configuration Files

Required:

```text
.env.example
.gitignore
README.md
CONTRIBUTING.md
CHANGELOG.md
LICENSE
SECURITY.md
```

Configuration files must be created according to the actual applications inside the repository.

Do not create meaningless configuration files.

---

# 24. Environment Configuration

Create:

```text
.env.example
```

Include placeholders for required configuration such as:

```env
MONGODB_URI=

JWT_SECRET=

FRONTEND_API_URL=
BACKEND_API_URL=

FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=

GOOGLE_MAPS_API_KEY=

CLOUD_STORAGE_KEY=

PAYMENT_GATEWAY_KEY=

AI_API_URL=

VECTOR_DATABASE_URL=
```

Never add actual credentials.

---

# 25. Repository Communication

The architecture must follow:

```text
                         RaituSevak360
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
          Frontend         Backend         Admin
          Next.js          Express         Next.js
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
                           MongoDB
                              │
                              ▼
                            AI/ML
                              │
                        Python/FastAPI
                              │
                              ▼
                           Services
```

---

# 26. Team Contribution Architecture

The repository must support the following ownership model:

```text
Team Lead
    │
    ├── Frontend
    ├── Backend
    ├── Database + AI/ML
    ├── UI/UX + Frontend
    └── Testing + Security
```

Developers work using feature branches.

Example:

```text
develop
   │
   ├── feature/authentication
   ├── feature/crop-management
   ├── feature/ai-advisor
   ├── feature/weather
   ├── feature/labour
   ├── feature/machinery
   └── feature/marketplace
```

---

# 27. Git Workflow

The repository must use:

```text
main
develop
feature branches
```

Workflow:

```text
develop
   ↓
feature branch
   ↓
Development
   ↓
Testing
   ↓
Pull Request
   ↓
Code Review
   ↓
CI Checks
   ↓
develop
   ↓
Production Release
   ↓
main
```

Developers must not directly push feature work to `main`.

---

# 28. Feature Ownership

Each feature should be implemented across the required layers.

Example:

## Crop Management

```text
ui-ux/
    ↓
frontend/
    ↓
backend/
    ↓
database/
    ↓
testing/
    ↓
security/
```

AI feature:

```text
frontend/
    ↓
backend/
    ↓
ai-ml/
    ↓
database/
    ↓
testing/
    ↓
security/
```

Therefore, a feature is not considered complete just because the frontend page exists.

---

# 29. Code Organization Rules

Follow these rules:

### Frontend

UI components must remain reusable.

### Backend

Business logic belongs in services.

### Database

Database models belong in the database layer.

### AI

AI logic belongs in `ai-ml/`.

### Services

External service integrations belong in `services/`.

### Security

Security-related documentation and implementation support belong in `security/`.

### Testing

Testing artifacts belong in `testing/`.

### Documentation

Architecture and technical documentation belong in `docs/`.

---

# 30. No Duplicate Logic

Avoid duplicating:

* API logic
* Database logic
* Validation logic
* Authentication logic
* UI components
* Constants
* Types

Create reusable modules where appropriate.

---

# 31. No Fake Implementations

Antigravity must NOT generate fake production functionality simply to make the repository look complete.

For example, do not create:

```text
Fake AI prediction
Fake payment success
Fake weather response
Fake MongoDB records
Fake Firebase notifications
Fake marketplace transactions
```

If functionality is not implemented yet:

```text
Create the correct folder
Create the correct interface
Create a clear TODO
Document what remains
```

---

# 32. No Secrets

Never generate:

```text
API keys
Passwords
Database credentials
JWT secrets
Payment credentials
Firebase private credentials
Cloud credentials
```

Use environment variables.

---

# 33. Code Quality Requirements

Code must be:

* Modular
* Readable
* Maintainable
* Reusable
* Typed with TypeScript where applicable
* Properly structured
* Documented where necessary
* Consistent across the repository

Avoid unnecessary complexity.

---

# 34. Initial Repository Generation

During the first generation, Antigravity must prioritize:

```text
1. Repository structure
2. Frontend foundation
3. Backend foundation
4. Database foundation
5. AI/ML foundation
6. Service integration structure
7. Admin foundation
8. UI/UX structure
9. Testing structure
10. Security structure
11. Documentation
12. GitHub workflows
13. Environment configuration
```

Do not attempt to implement every project feature in the first generation.

---

# 35. Initial Setup Goal

After repository generation, the project should provide a clean foundation where the team can immediately begin feature development.

The repository should be understandable as:

```text
RaituSevak360/
│
├── frontend       → Farmer-facing PWA
├── backend        → Node.js + Express REST API
├── database       → MongoDB + Mongoose
├── ai-ml          → Python + FastAPI AI system
├── services       → External service integrations
├── admin          → Admin dashboard
├── ui-ux          → Design and UX
├── testing        → Quality assurance
├── security       → Security architecture
├── public         → PWA assets
├── docs           → Technical documentation
└── .github        → GitHub automation
```

---

# 36. Final Antigravity Instruction

**Generate the RaituSevak360 repository according to this document exactly.**

The repository must:

* Use the approved technology stack only.
* Use a single GitHub repository.
* Maintain clear separation between frontend, backend, database, AI/ML, services, admin, UI/UX, testing, security, documentation, and DevOps.
* Be structured for multiple developers.
* Be scalable for future feature development.
* Be PWA-first.
* Keep Node.js + Express.js as the backend.
* Keep MongoDB as the database.
* Keep Python + FastAPI as the AI/ML service layer.
* Keep Next.js + React + TypeScript as the PWA frontend.
* Include proper GitHub contribution infrastructure.
* Include security and testing from the beginning.
* Never expose secrets.
* Never invent unsupported technologies.
* Never create Android/Kotlin/React Native/Flutter code.
* Never create separate repositories.
* Never generate fake production functionality.
* Never replace the approved architecture without explicit project-lead approval.

The generated repository is the **foundation for the complete RaituSevak360 product**.

# RaituSevak360

**Empowering Farmers. Transforming Agriculture.**
