# Testing Strategy & QA Architecture

- **Unit Testing**: Jest for frontend components, backend controllers, and services. Pytest for AI endpoints.
- **Integration Testing**: End-to-end API tests validating Express request handling, database writes, and JWT verification.
- **Automated CI**: GitHub Actions workflows validate builds and run test suites on every pull request to `main` and `develop`.
