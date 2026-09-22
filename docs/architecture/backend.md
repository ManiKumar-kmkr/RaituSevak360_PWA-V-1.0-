# Backend Architecture (Node.js + Express.js + TypeScript)

The backend layer enforces a clean 4-tier design pattern:

```text
HTTP Request
     ↓
Route (e.g., crop.routes.ts) - Path routing and auth middleware
     ↓
Controller (e.g., crop.controller.ts) - HTTP payload parsing & status formatting
     ↓
Service (e.g., crop.service.ts) - Business logic & external microservice orchestration
     ↓
Model (e.g., Crop.ts via Mongoose) - MongoDB operations
     ↓
Database (MongoDB)
```
