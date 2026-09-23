# Branching Policy for RaituSevak360 PWA

## Purpose

This document defines the Git branching strategy for the RaituSevak360 project. The goal is to keep development organized, predictable, and easy to review while supporting collaboration across multiple contributors and features.

This repository is a multi-feature agricultural platform, so the team should use a structured workflow based on issues, feature branches, pull requests, and protected main branches.

## Core Principles

- Every change must be made on its own branch.
- No direct commits to `main` or `develop`.
- Every branch should be tied to a specific task, issue, or bug.
- Pull requests must be reviewed before merging.
- Small, focused changes are preferred over large, monolithic changes.
- Branch names must be descriptive and consistent.

## Branch Structure

Use the following structure:

```text
main
└── develop
    ├── feature/issue-###-short-description
    ├── fix/issue-###-short-description
    ├── docs/short-description
    ├── chore/short-description
    └── hotfix/short-description
```

### `main`

`main` represents production-ready code.

Rules:
- Protected branch
- No direct pushes
- Requires pull request approval
- Requires passing status checks
- Only release-ready code may be merged here

### `develop`

`develop` is the integration branch for active development.

Rules:
- Protected branch
- Used for merging feature and fix branches during development
- Can be used for QA and staging validation before release
- Feature branches are merged into `develop`, not directly to `main`

### `feature/*`

Use for new features or enhancements.

Example names:

```text
feature/issue-12-crop-advisory
feature/issue-15-weather-dashboard
feature/issue-25-marketplace-listing
```

### `fix/*`

Use for bug fixes.

Example names:

```text
fix/issue-27-booking-validation
fix/issue-33-login-error
```

### `docs/*`

Use for documentation-only changes.

Example names:

```text
docs/update-installation-guide
docs/add-branching-policy
```

### `chore/*`

Use for maintenance work such as dependency updates, tooling, build config, or non-feature cleanup.

Example names:

```text
chore/update-eslint-config
chore/upgrade-dependencies
```

### `hotfix/*`

Use for urgent production fixes that must be deployed quickly.

Example names:

```text
hotfix/issue-89-critical-auth-fix
hotfix/fix-production-payment-error
```

## Naming Convention

Branch names should follow this pattern:

```text
<type>/issue-<number>-<short-description>
```

Examples:

```text
feature/issue-12-crop-advisory
fix/issue-27-booking-validation
docs/add-branching-policy
chore/update-dependencies
hotfix/issue-89-critical-auth-fix
```

### Rules

- Use lowercase only
- Use hyphens to separate words
- Keep the description short and clear
- Include the issue number when applicable
- Avoid vague names like `dev`, `misc`, `testing`, `new-branch`, or `john-work`

## Workflow

### 1. Create or identify the task

Every branch should correspond to a GitHub issue, task, or clearly defined improvement.

Examples:
- Add crop advisory form
- Fix booking validation bug
- Improve weather widget layout
- Update README setup instructions

### 2. Start from the correct base branch

Developers should create new branches from the latest `develop` branch unless the work is a hotfix or release-specific task.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/issue-12-crop-advisory
```

For a hotfix:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/issue-89-critical-auth-fix
```

### 3. Keep the work focused

Each feature branch should focus on one issue or task. Avoid mixing unrelated changes in the same branch.

### 4. Commit regularly with clear messages

Use meaningful commit messages.

Recommended prefixes:

```text
feat: new feature
fix: bug fix
refactor: code cleanup or restructuring
test: tests added or updated
docs: documentation changes
chore: maintenance or tooling updates
```

Examples:

```bash
git commit -m "feat: add crop advisory dashboard"
git commit -m "fix: validate booking date before submission"
git commit -m "docs: add branching policy document"
```

### 5. Push the branch

```bash
git push -u origin feature/issue-12-crop-advisory
```

### 6. Open a pull request

Open a pull request from the feature branch to `develop`.

PR title should be clear and specific.

Examples:

```text
feat: add crop advisory dashboard
fix: validate booking date before submission
docs: add branching policy document
```

### 7. Review and approve

A pull request should be reviewed by at least one other team member before merge.

Reviewers should check:
- correctness of the implementation
- code quality and readability
- test coverage
- UI/UX consistency
- security and data protection concerns
- whether the change matches the issue requirements

### 8. Merge to the correct branch

- Feature branches merge into `develop`
- Fix branches merge into `develop`
- Release-ready work merges from `develop` into `main`
- Urgent production fixes merge from `hotfix/*` directly into `main` and then back into `develop`

### 9. Delete merged branches

After the branch is merged, delete it to keep the repository clean.

## Release Workflow

For regular production releases:

```text
develop -> main
```

This ensures that `main` only contains validated, tested, and approved code.

For urgent hotfixes:

```text
hotfix/* -> main
hotfix/* -> develop
```

## Branch Protection Recommendations

GitHub repository settings should protect these branches:

- `main`
- `develop`

Recommended protections:

- Require pull request before merging
- Require at least one approval
- Require status checks to pass
- Prevent force pushes
- Prevent direct pushes
- Disallow branch deletion
- Require branches to be up to date before merge

## Developer Responsibilities

Each contributor is responsible for:

- creating branches from the correct base branch
- naming branches consistently
- keeping changes small and focused
- updating documentation when required
- running validation checks before pushing
- opening pull requests for review
- not merging their own code without review when the team policy requires approval

## Team Lead Responsibilities

The team lead is responsible for:

- assigning tasks to team members
- reviewing pull requests
- ensuring issue-to-branch alignment
- approving releases from `develop` to `main`
- maintaining branch protection rules
- resolving merge conflicts when necessary

## Example Team Flow

```text
Issue: #12 - Crop advisory dashboard
Developer creates: feature/issue-12-crop-advisory
Developer works on the branch
Developer pushes and opens PR
Reviewer checks code and approves
PR merged into develop
QA validates in develop
Release branch or merge to main
```

## Summary

The recommended policy for this repo is:

- `main` = production
- `develop` = active integration
- `feature/*` = new features
- `fix/*` = bug fixes
- `docs/*` = docs updates
- `chore/*` = maintenance
- `hotfix/*` = urgent production fixes

This workflow supports team collaboration, reduces merge conflicts, keeps code review organized, and makes project releases predictable.

## Related Documents

- `CONTRIBUTING.md`
- `PR_TEMPLATE.md`
- issue tracking and task definitions

## Approval

This policy should be agreed upon by the project team and enforced by the repository maintainer and team lead.
