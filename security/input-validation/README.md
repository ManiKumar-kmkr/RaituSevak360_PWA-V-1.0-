# Input Validation & Sanitization
- All incoming payloads must be strictly validated using Zod schemas before hitting business logic.
- Prevent NoSQL injection by ensuring query keys are explicit and not passed directly from raw request objects.
