# API Security Best Practices
- Strict CORS origins allowlist.
- JWT verification on all protected endpoints.
- Request payload size limits (10MB max for image uploads, 100kb for JSON).
- Standardized error handlers omitting raw stack traces in production.
