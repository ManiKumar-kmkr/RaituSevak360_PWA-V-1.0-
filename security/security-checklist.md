# Pre-Deployment Security Checklist

- [ ] All `.env` variables populated from secure secret manager; no credentials hardcoded.
- [ ] Helmet security headers active on Express backend.
- [ ] Rate limiting enabled on `/api/auth` and `/api/ai`.
- [ ] CORS policies restrict origins to verified domain list.
- [ ] MongoDB indexes optimized and injection-prevented via Mongoose schema definitions.
- [ ] Dependency vulnerabilities audited (`npm audit` & `bandit` scan).
- [ ] PWA service worker served strictly over HTTPS.
