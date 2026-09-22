# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## 🔒 Reporting a Vulnerability

We take the security of **RaituSevak360** seriously. If you discover a security vulnerability, please report it responsibly by following these steps:

1. **Do NOT open a public GitHub issue.**
2. Send an email to `security@raitusevak360.internal` (or submit via the GitHub Private Vulnerability Reporting tab) detailing:
   - Nature of the vulnerability (e.g., authentication bypass, injection, IDOR).
   - Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
   - Affected components (`frontend`, `backend`, `ai-ml`, `database`, `services`).
   - Potential impact on farmer data, financials, or system integrity.

### Our Commitment
- We will acknowledge receipt of your report within **48 hours**.
- We will keep you updated on triage, patching, and disclosure timeline.
- Valid security disclosures will be credited in our release notes.

---

## 🛡️ Core Security Principles
- **Authentication**: JWT with strict algorithm verification and expiration.
- **Secrets Management**: Never commit credentials, tokens, or private keys to the repository.
- **Role-Based Access Control (RBAC)**: Strict separation of Farmer, Service Provider, and Admin permissions.
- **Input Validation**: All incoming requests validated via Zod/Joi before service processing.
- **Rate Limiting**: Protect against DoS and brute force attacks on authentication and AI endpoints.
