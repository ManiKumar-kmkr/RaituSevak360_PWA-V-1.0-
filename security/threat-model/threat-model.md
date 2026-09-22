# Threat Model (STRIDE Framework)

| Category | Threat Scenario | Mitigation Strategy |
|---|---|---|
| **Spoofing** | Attacker impersonating another farmer's account | OTP verification over cellular SMS + JWT token signature check |
| **Tampering** | Modifying crop advisory recommendations in transit | TLS 1.3 encryption on all REST API and AI endpoints |
| **Repudiation** | Denying booking creation or payment | Audit logging of all booking status transitions and financial receipts |
| **Information Disclosure** | Leakage of farmer personal phone numbers or land records | Restricted API responses; masking sensitive fields in listings |
| **Denial of Service** | Flooding AI diagnostic endpoints with heavy image loads | Rate limiting per user + file dimension and payload caps |
| **Elevation of Privilege** | Farmer attempting to access Admin analytics | Role middleware validating `admin` claims on admin routes |
