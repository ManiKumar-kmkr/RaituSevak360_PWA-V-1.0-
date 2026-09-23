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


# RaituSevak360 — Git Commands & Team Workflow

## 1. Purpose

This document contains the Git and GitHub commands required for developing, contributing to, and maintaining the RaituSevak360 PWA project.

Every developer working on RaituSevak360 should understand these commands before contributing to the repository.

The basic workflow is:

```text
Create / Clone Repository
        ↓
Create Feature Branch
        ↓
Write Code
        ↓
Check Changes
        ↓
git add
        ↓
git commit
        ↓
git push
        ↓
Create Pull Request
        ↓
Code Review
        ↓
Merge into main
```

---

# 2. Git vs GitHub

## Git

Git is the version control system used on your computer to track project changes.

## GitHub

GitHub is the online platform where the RaituSevak360 Git repository is hosted.

```text
Developer Computer
       ↓
      Git
       ↓
    GitHub
       ↓
RaituSevak360 Repository
```

---

# 3. Install and Check Git

Check whether Git is installed:

```bash
git --version
```

Example:

```text
git version 2.x.x
```

If a version is displayed, Git is installed.

---

# 4. Configure Git

Each developer should configure their Git identity.

Set username:

```bash
git config --global user.name "Your Name"
```

Set email:

```bash
git config --global user.email "your-email@example.com"
```

Check configuration:

```bash
git config --global --list
```

These details are associated with your Git commits.

---

# 5. Clone the RaituSevak360 Repository

If the repository already exists on GitHub, new developers should clone it instead of creating a new repository.

```bash
git clone https://github.com/VINODMAMIDI-05/RaituSevak360_PWA-V-1.0-.git
```

Move into the project:

```bash
cd RaituSevak360_PWA-V-1.0-
```

Check the remote:

```bash
git remote -v
```

Expected result:

```text
origin  https://github.com/VINODMAMIDI-05/RaituSevak360_PWA-V-1.0-.git
```

---

# 6. Initialize Git for a New Local Project

Use this only when Git has not already been initialized.

```bash
git init
```

This creates the `.git` directory and turns the project folder into a Git repository.

Check status:

```bash
git status
```

---

# 7. Connect Local Project to GitHub

Add the GitHub repository as the remote:

```bash
git remote add origin https://github.com/VINODMAMIDI-05/RaituSevak360_PWA-V-1.0-.git
```

Check the remote:

```bash
git remote -v
```

---

# 8. Main Branch

The main production branch is:

```text
main
```

Check the current branch:

```bash
git branch
```

Rename the current branch to `main`:

```bash
git branch -M main
```

Push the main branch:

```bash
git push -u origin main
```

The `-u` option connects the local branch with the remote branch.

After this, you can normally use:

```bash
git push
```

---

# 9. First Commit

When creating the repository for the first time:

```bash
git init
```

Add all project files:

```bash
git add .
```

Create the first commit:

```bash
git commit -m "Initial commit: RaituSevak360 PWA repository structure"
```

Set the main branch:

```bash
git branch -M main
```

Connect GitHub:

```bash
git remote add origin https://github.com/VINODMAMIDI-05/RaituSevak360_PWA-V-1.0-.git
```

Push to GitHub:

```bash
git push -u origin main
```

---

# 10. Check Project Status

Use:

```bash
git status
```

This shows:

* Modified files
* New files
* Deleted files
* Staged files
* Current branch

Use this command frequently.

---

# 11. See Changed Files

To see which files have changed:

```bash
git status
```

To see the actual changes:

```bash
git diff
```

To see staged changes:

```bash
git diff --staged
```

---

# 12. Add Files to Git

Add one file:

```bash
git add filename
```

Example:

```bash
git add frontend/app/page.tsx
```

Add multiple files:

```bash
git add frontend/ backend/
```

Add all changed files:

```bash
git add .
```

The `.` means the current directory and its contents.

---

# 13. Commit Changes

After adding files:

```bash
git commit -m "Add farmer registration page"
```

A commit is a saved version of your changes.

Good commit messages should explain what was changed.

Examples:

```bash
git commit -m "Add farmer registration module"
```

```bash
git commit -m "Add crop advisory API"
```

```bash
git commit -m "Update farmer dashboard UI"
```

```bash
git commit -m "Fix authentication validation"
```

```bash
git commit -m "Add weather intelligence service"
```

---

# 14. Push Changes to GitHub

After committing:

```bash
git push
```

If the branch has not been connected to the remote:

```bash
git push -u origin branch-name
```

Example:

```bash
git push -u origin feature/farmer-registration
```

---

# 15. Pull Latest Changes

Before starting new work, update your local repository.

```bash
git pull
```

For the main branch:

```bash
git checkout main
git pull origin main
```

This downloads the latest changes and updates your local branch.

---

# 16. Fetch Changes Without Merging

Use:

```bash
git fetch
```

This downloads information about changes from GitHub without immediately changing your working files.

Check remote branches:

```bash
git branch -r
```

---

# 17. Branches

Do not directly develop features on `main`.

Create a separate branch for your work.

Check branches:

```bash
git branch
```

Create a branch:

```bash
git branch feature/farmer-registration
```

Create and switch to the branch:

```bash
git checkout -b feature/farmer-registration
```

Or:

```bash
git switch -c feature/farmer-registration
```

Recommended naming:

```text
feature/
fix/
docs/
refactor/
security/
```

Examples:

```text
feature/farmer-registration
feature/crop-advisory
feature/weather-dashboard
feature/marketplace
fix/login-validation
fix/api-error
docs/update-readme
security/authentication-update
```

---

# 18. Switch Between Branches

Switch to main:

```bash
git switch main
```

Switch to another branch:

```bash
git switch feature/farmer-registration
```

Older Git syntax:

```bash
git checkout main
```

---

# 19. Push a New Feature Branch

After creating a feature branch:

```bash
git push -u origin feature/farmer-registration
```

After the first push, simply:

```bash
git push
```

---

# 20. View All Branches

Local branches:

```bash
git branch
```

Remote branches:

```bash
git branch -r
```

All branches:

```bash
git branch -a
```

---

# 21. Update Your Feature Branch

Before continuing development:

```bash
git switch main
git pull origin main
git switch feature/farmer-registration
```

This makes sure your local main branch has the latest changes.

---

# 22. Pull Request Workflow

Developers should not normally push feature work directly into `main`.

The recommended workflow is:

```text
main
 ↓
Create feature branch
 ↓
Develop
 ↓
git add
 ↓
git commit
 ↓
git push
 ↓
GitHub Pull Request
 ↓
Code Review
 ↓
Approved
 ↓
Merge into main
```

Example:

```bash
git switch main
git pull origin main

git switch -c feature/crop-advisory
```

Develop your feature.

Then:

```bash
git add .
git commit -m "Add crop advisory module"
git push -u origin feature/crop-advisory
```

Then create a Pull Request on GitHub.

---

# 23. Pull Request Rules

Before creating a Pull Request:

```bash
git status
```

Check your changes:

```bash
git diff
```

Make sure your code is committed:

```bash
git log --oneline -5
```

Push your branch:

```bash
git push
```

Then create the Pull Request.

The Pull Request should contain:

* What was changed
* Why it was changed
* Related feature or issue
* Testing performed
* Any known limitations

---

# 24. View Commit History

View commits:

```bash
git log
```

Short version:

```bash
git log --oneline
```

Show recent commits:

```bash
git log --oneline -10
```

This shows the last 10 commits.

---

# 25. View a Specific Commit

Use:

```bash
git show COMMIT_ID
```

Example:

```bash
git show a1b2c3d
```

---

# 26. Rename a Branch

Rename the current branch:

```bash
git branch -m new-branch-name
```

Example:

```bash
git branch -m feature/farmer-dashboard
```

---

# 27. Delete a Local Branch

After a feature has been merged:

```bash
git branch -d feature/farmer-registration
```

Force delete:

```bash
git branch -D feature/farmer-registration
```

Use `-D` carefully because it can delete a branch containing unmerged work.

---

# 28. Delete a Remote Branch

```bash
git push origin --delete feature/farmer-registration
```

Only do this when the remote branch is no longer required.

---

# 29. Git Stash

Sometimes you have unfinished work but need to switch branches.

Save your current changes:

```bash
git stash
```

Switch branches:

```bash
git switch main
```

Return to your feature branch:

```bash
git switch feature/farmer-registration
```

Restore the saved changes:

```bash
git stash pop
```

View stashed changes:

```bash
git stash list
```

---

# 30. Undo Unstaged Changes

To discard changes in a specific file:

```bash
git restore filename
```

Example:

```bash
git restore frontend/app/page.tsx
```

To discard all unstaged changes:

```bash
git restore .
```

Use this carefully because discarded changes may be difficult to recover.

---

# 31. Unstage a File

If you accidentally used:

```bash
git add .
```

and want to remove a file from staging:

```bash
git restore --staged filename
```

Example:

```bash
git restore --staged frontend/app/page.tsx
```

Your actual file will not be deleted. It is simply removed from the staging area.

---

# 32. Change the Last Commit Message

If you have not pushed the commit yet:

```bash
git commit --amend -m "Correct commit message"
```

Avoid changing already-pushed commit history unless you understand the consequences.

---

# 33. Merge a Branch

To merge a feature branch into main locally:

```bash
git switch main
git pull origin main
git merge feature/farmer-registration
```

Then:

```bash
git push origin main
```

For the RaituSevak360 team, normal feature development should preferably use the GitHub Pull Request process instead of directly merging feature branches into `main`.

---

# 34. Merge Conflict

A conflict can happen when two developers modify the same part of a file.

Git may show:

```text
CONFLICT
```

First check:

```bash
git status
```

Open the conflicting file.

You may see:

```text
<<<<<<< HEAD
Your changes
=======
Other developer changes
>>>>>>> branch-name
```

Manually decide which code should remain.

Then:

```bash
git add .
```

Complete the merge:

```bash
git commit
```

Then:

```bash
git push
```

Always communicate with the other developer if the conflict involves shared functionality.

---

# 35. Remote Commands

Check remote:

```bash
git remote -v
```

Add remote:

```bash
git remote add origin REPOSITORY_URL
```

Change remote URL:

```bash
git remote set-url origin REPOSITORY_URL
```

Remove remote:

```bash
git remote remove origin
```

---

# 36. Git Tags

Tags can be used to identify project versions.

Create a version tag:

```bash
git tag v1.0.0
```

Push tag:

```bash
git push origin v1.0.0
```

Push all tags:

```bash
git push --tags
```

View tags:

```bash
git tag
```

Example RaituSevak360 versions:

```text
v0.1.0
v0.5.0
v1.0.0
v1.1.0
```

---

# 37. Check Current Branch

```bash
git branch --show-current
```

Example output:

```text
feature/crop-advisory
```

---

# 38. Check Remote Repository

```bash
git remote -v
```

Expected:

```text
origin  https://github.com/VINODMAMIDI-05/RaituSevak360_PWA-V-1.0-.git
```

---

# 39. Compare Branches

Compare current changes:

```bash
git diff
```

Compare two branches:

```bash
git diff main..feature/crop-advisory
```

This helps developers understand what their feature branch changed compared with `main`.

---

# 40. Find Previous Work

Search commit messages:

```bash
git log --oneline --all --grep="authentication"
```

Example:

```bash
git log --oneline --all --grep="crop"
```

---

# 41. Git Ignore

The project must have a `.gitignore` file.

Do not commit:

```text
node_modules/
.env
.env.local
.next/
dist/
build/
__pycache__/
*.log
```

Never commit:

```text
API keys
Passwords
JWT secrets
Database credentials
Payment credentials
Firebase private credentials
Other sensitive secrets
```

Use `.env.example` to document required environment variables without exposing actual values.

---

# 42. Check What Git Is Tracking

```bash
git ls-files
```

This displays files currently tracked by Git.

---

# 43. Remove a File from Git Tracking

If a file was accidentally added to Git but should not be tracked:

```bash
git rm --cached filename
```

Example:

```bash
git rm --cached .env
```

Then add the file to `.gitignore`.

After that:

```bash
git add .gitignore
git commit -m "Update gitignore"
git push
```

Important: If a secret was already pushed to GitHub, simply removing the file is not enough. The exposed credential should be revoked or rotated.

---

# 44. Recommended Daily Workflow

Every developer should follow this workflow.

## Step 1 — Update main

```bash
git switch main
git pull origin main
```

## Step 2 — Create your feature branch

```bash
git switch -c feature/your-feature-name
```

Example:

```bash
git switch -c feature/farmer-registration
```

## Step 3 — Develop

Write and test your code.

## Step 4 — Check changes

```bash
git status
```

```bash
git diff
```

## Step 5 — Stage changes

```bash
git add .
```

## Step 6 — Commit

```bash
git commit -m "Add farmer registration module"
```

## Step 7 — Push

```bash
git push -u origin feature/farmer-registration
```

## Step 8 — Create Pull Request

Create a Pull Request on GitHub.

## Step 9 — Code Review

Team members review the changes.

## Step 10 — Merge

After approval and required checks, merge the Pull Request into `main`.

---

# 45. Recommended Commit Format

Use:

```text
<type>: <short description>
```

Recommended types:

```text
feat:
fix:
docs:
refactor:
security:
test:
style:
chore:
```

Examples:

```bash
git commit -m "feat: add farmer registration"
```

```bash
git commit -m "fix: resolve login validation error"
```

```bash
git commit -m "docs: update API documentation"
```

```bash
git commit -m "security: improve authentication validation"
```

```bash
git commit -m "test: add crop advisory API tests"
```

---

# 46. RaituSevak360 Branch Naming

Use clear branch names.

### Features

```text
feature/farmer-registration
feature/farmer-dashboard
feature/crop-advisory
feature/weather-intelligence
feature/marketplace
feature/labour-booking
feature/machinery-booking
```

### Bug Fixes

```text
fix/login-error
fix/api-validation
fix/dashboard-loading
```

### Documentation

```text
docs/api-documentation
docs/project-structure
docs/contribution-guide
```

### Security

```text
security/authentication
security/api-validation
```

---

# 47. Important Team Rule

Do not work directly on `main` for normal feature development.

Avoid:

```text
main
 ↓
Developer writes feature
 ↓
git add .
 ↓
git commit
 ↓
git push
```

Prefer:

```text
main
 ↓
feature branch
 ↓
development
 ↓
commit
 ↓
push
 ↓
Pull Request
 ↓
review
 ↓
merge
 ↓
main
```

---

# 48. Before Every Push

Run:

```bash
git status
```

Check:

```bash
git diff
```

Make sure no sensitive files are included.

Then:

```bash
git add .
git commit -m "type: description"
git push
```

---

# 49. Before Starting New Work

Always synchronize with the latest `main`:

```bash
git switch main
git pull origin main
```

Then create a new branch:

```bash
git switch -c feature/new-feature
```

---

# 50. Quick Command Reference

| Command                   | Purpose                               |
| ------------------------- | ------------------------------------- |
| `git init`                | Initialize Git                        |
| `git clone URL`           | Download repository                   |
| `git status`              | Check current changes                 |
| `git add .`               | Stage all changes                     |
| `git add file`            | Stage specific file                   |
| `git commit -m "message"` | Save changes                          |
| `git push`                | Upload changes                        |
| `git pull`                | Download and integrate latest changes |
| `git fetch`               | Download remote information           |
| `git branch`              | View branches                         |
| `git switch branch`       | Switch branch                         |
| `git switch -c branch`    | Create and switch branch              |
| `git merge branch`        | Merge branch                          |
| `git log --oneline`       | View commit history                   |
| `git diff`                | View changes                          |
| `git stash`               | Temporarily save changes              |
| `git stash pop`           | Restore stashed changes               |
| `git restore file`        | Discard unstaged changes              |
| `git remote -v`           | View GitHub remote                    |
| `git tag`                 | View versions                         |
| `git tag v1.0.0`          | Create version tag                    |

---

# 51. RaituSevak360 Standard Workflow

The standard team workflow is:

```text
                    GitHub
                       |
                    main
                       |
             +---------+---------+
             |         |         |
             ↓         ↓         ↓
          Developer Developer Developer
             |         |         |
             ↓         ↓         ↓
         feature/*  feature/*  feature/*
             |         |         |
             +---------+---------+
                       |
                       ↓
                 Pull Request
                       |
                       ↓
                  Code Review
                       |
                       ↓
                    Testing
                       |
                       ↓
                     Merge
                       |
                       ↓
                     main
```

---

# 52. Most Important Commands for Developers

If you remember only the essential commands, remember these:

### Start work

```bash
git switch main
git pull origin main
git switch -c feature/your-feature
```

### During development

```bash
git status
git diff
```

### Save your work

```bash
git add .
git commit -m "feat: describe your change"
```

### Upload your branch

```bash
git push -u origin feature/your-feature
```

### After that

Create a Pull Request on GitHub.

---

# 53. Golden Rules

1. Do not directly develop features on `main`.
2. Always create a feature branch.
3. Pull the latest `main` before starting new work.
4. Keep commits small and meaningful.
5. Write clear commit messages.
6. Never commit `.env` files or secrets.
7. Never commit `node_modules`.
8. Check `git status` before committing.
9. Review your changes before pushing.
10. Create a Pull Request for feature work.
11. Resolve conflicts carefully.
12. Do not force-push shared branches.
13. Keep documentation updated when project structure changes.
14. Do not commit unfinished or broken code to `main`.
15. Coordinate with other developers when modifying shared modules.

---

# 54. Emergency: Something Went Wrong

If you are unsure about a Git command, do not randomly execute destructive commands.

First run:

```bash
git status
```

Then:

```bash
git log --oneline -10
```

And check:

```bash
git branch
```

If the problem involves lost changes, merge conflicts, accidental commits, or accidental deletion, contact the project lead before using commands such as:

```bash
git reset --hard
git push --force
git branch -D
```

These commands can permanently remove work or affect other developers.

---

# 55. Final Developer Checklist

Before creating a Pull Request:

```text
[ ] I am working on the correct feature branch
[ ] I pulled the latest main branch
[ ] My code follows the project structure
[ ] I tested my changes
[ ] I checked git status
[ ] I checked git diff
[ ] No .env or secrets are included
[ ] No node_modules are included
[ ] Commit message is clear
[ ] Changes are pushed to GitHub
[ ] Pull Request description is complete
```

---

# 56. Final Git Workflow

```text
Clone Repository
       ↓
git switch main
       ↓
git pull origin main
       ↓
Create Feature Branch
       ↓
Develop
       ↓
Test
       ↓
git status
       ↓
git diff
       ↓
git add .
       ↓
git commit
       ↓
git push
       ↓
Pull Request
       ↓
Code Review
       ↓
Testing / Checks
       ↓
Merge
       ↓
main
```

This is the standard Git and GitHub workflow for the RaituSevak360 PWA development team.
