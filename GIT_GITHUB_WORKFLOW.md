# RaituSevak360 — Simple Git & GitHub Workflow

**Project:** RaituSevak360 PWA  
**Repository:** Private GitHub repository  
**Main branch:** `main`  
**Team:** Repository owner + 3–4 developers

## 1. Purpose

This document explains how developers should work together using Git and GitHub.

Follow this process to:
- Keep `main` safe.
- Avoid overwriting another developer's work.
- Review code before adding it to the project.
- Keep project changes organized.

## 2. Team Responsibilities

### Repository owner
The owner is responsible for:
- Managing repository access and settings.
- Reviewing important changes.
- Approving changes according to the team policy.
- Merging approved Pull Requests into `main`.

### Developers
Developers must:
- Work on their own branches.
- Make changes only for their assigned tasks.
- Test and review their changes.
- Push their branch and create a Pull Request.
- Fix issues raised during review.

**Team rule:** Developers create Pull Requests. Vinod reviews and merges approved changes into `main`.

**Important:** If GitHub does not enforce the repository ruleset for this private repository, owner-only merging is a team rule rather than a technical restriction. Do not assume GitHub will block every unauthorized merge.

## 3. Simple Git Terms

- **Repository:** The project stored on GitHub.
- **Branch:** A separate workspace for a task.
- **Commit:** A saved checkpoint of your changes.
- **Push:** Upload your branch to GitHub.
- **Pull Request (PR):** A request to add your changes to `main`.
- **Merge:** Add approved changes into `main`.

## 4. Branch Rules

Use `main` only for approved code. Do not develop directly on it.

Create a separate branch for each task. Use lowercase names and hyphens.

Examples:
- `feature/farmer-dashboard`
- `feature/marketplace`
- `feature/authentication`
- `fix/login-validation`
- `docs/git-workflow`

## 5. First-Time Setup

If the project is not on your computer, copy the repository URL from GitHub and run:

```bash
git clone YOUR-REPOSITORY-URL
cd YOUR-PROJECT-FOLDER
code .
```

Replace the example values with the actual repository URL and folder name.

If the project is already on your computer, open the correct RaituSevak360 folder in VS Code.

Before running Git commands, check that you are in the correct project:

```bash
git remote -v
git status
git branch --show-current
```

Do not run commands from the VILOOP folder or another project.

## 6. Before Starting a New Task

Check your current work, then update `main`:

```bash
git status
git fetch origin
git switch main
git pull --ff-only origin main
```

If Git reports local changes, an error, or a conflict, stop and resolve it safely. Do not delete work just to continue.

## 7. Create Your Task Branch

After updating `main`, create a new branch for your task:

```bash
git switch -c feature/your-task-name
```

Example:

```bash
git switch -c feature/farmer-dashboard
```

Use a new branch for each new task.

## 8. Write and Test Your Code

- Understand the existing code before changing it.
- Change only the files needed for your task.
- Avoid changing another developer's work without discussing it first.
- Follow the project's existing folder structure and technology stack.
- Test your changes before submitting them.

Check your changes:

```bash
git status
git diff
git diff --check
```

Run the relevant tests, lint, type-check, or build commands that are configured in the project. Do not say tests passed if you did not run them.

## 9. Save Your Changes With a Commit

Stage only the files you changed:

```bash
git add path/to/changed-file
```

Review what is staged:

```bash
git diff --cached
```

Commit the changes with a clear message:

```bash
git commit -m "feat: add farmer dashboard"
```

Examples of commit messages:

```text
feat: add marketplace filters
fix: correct login validation
docs: update GitHub workflow
test: add dashboard tests
refactor: simplify authentication service
```

Avoid unclear messages such as `changes`, `update`, or `done`.

## 10. Push Your Branch to GitHub

For the first push of your branch:

```bash
git push -u origin feature/your-task-name
```

For later updates to the same branch:

```bash
git push
```

Replace the example branch name with your actual branch name.

**Never push your normal development work directly to `main`.**

## 11. Create a Pull Request

After pushing your branch:

1. Open the RaituSevak360 repository on GitHub.
2. Open **Pull requests**.
3. Click **New pull request**.
4. Set **base** to `main`.
5. Set **compare** to your task branch.
6. Review the changed files.
7. Add a clear title and description.
8. Create the PR and inform Vinod.

Example title:

`feat: Add farmer dashboard`

Use this simple description:

```markdown
## Summary
What did you change?

## Testing
What did you test?

## Notes
Are there any issues or things the reviewer should know?
```

Creating a PR does not mean your code has been merged.

## 12. Review Feedback

If Vinod asks for changes:

1. Read the comments.
2. Make corrections on the same branch.
3. Test the changes again.
4. Commit and push the corrections.

Example:

```bash
git add path/to/changed-file
git commit -m "fix: address review feedback"
git push
```

Your existing PR will update automatically. Do not create a second PR for the same task.

## 13. Owner Review and Merge

Before merging, the owner should check:
- The PR targets `main`.
- The code changes match the task.
- The relevant tests or build checks pass.
- Required approvals are present.
- Review conversations are resolved.
- There are no unresolved conflicts.
- No secrets or unrelated files are included.

Under the team policy, Vinod performs the final merge into `main`.

### GitHub settings note

A `CODEOWNERS` file can identify Vinod as the code owner, but the file alone does not force GitHub to require his approval. The appropriate GitHub rule must also be supported and enabled. Test the repository settings instead of assuming owner-only approval or merging is technically enforced.

## 14. After the PR Is Merged

Once the PR is merged, update your local `main`:

```bash
git switch main
git fetch origin
git pull --ff-only origin main
git status
```

Start your next task from the updated `main` by creating a new branch.

## 15. Working With Other Developers

Developers may work on different branches at the same time.

Example:

```text
Developer 1 → feature/farmer-dashboard
Developer 2 → feature/marketplace
Developer 3 → feature/authentication
Developer 4 → fix/api-validation
```

Remember:
- Do not push another developer's unfinished work.
- Tell the team before changing shared files.
- Do not overwrite another developer's changes.
- If two developers change the same file, coordinate before resolving conflicts.

## 16. If a Merge Conflict Happens

If Git reports a conflict:

1. Stop and read the message.
2. Run `git status`.
3. Open the conflicted files in VS Code.
4. Compare both versions and decide what should remain.
5. Ask the other developer for help if needed.
6. Test the result.
7. Stage the resolved files and complete the operation Git reports.

```bash
git status
git diff
git add path/to/resolved-file
```

Git may require you to finish a merge or continue a rebase. Follow the message Git displays. If you are unsure, stop and ask Vinod. Do not use destructive commands to guess your way through a conflict.

## 17. Temporary Local Changes

If you need to temporarily set aside tracked changes:

```bash
git stash push -m "WIP: describe your task"
```

View saved stashes:

```bash
git stash list
```

Restore the latest stash and keep it saved:

```bash
git stash apply
```

Stashing is temporary storage, not a backup. Check your files after restoring them.

## 18. Security Rules

- Never share GitHub passwords or access tokens.
- Never upload `.env` files, API keys, database passwords, or private keys.
- Use `.env.example` to show variable names without real secret values.
- Do not change repository settings without the owner's permission.
- Never force-push to `main`.
- Never delete the `main` branch.
- Never disable repository rules to merge unfinished code.
- If a secret is exposed, tell Vinod immediately and revoke or rotate the secret.

## 19. Useful Commands

| Purpose | Command |
|---|---|
| Check current status | `git status` |
| Check current branch | `git branch --show-current` |
| Check repository URL | `git remote -v` |
| Download remote information | `git fetch origin` |
| Switch to main | `git switch main` |
| Update main | `git pull --ff-only origin main` |
| Create a branch | `git switch -c feature/your-task-name` |
| View code changes | `git diff` |
| Stage a file | `git add path/to/file` |
| Review staged changes | `git diff --cached` |
| Commit changes | `git commit -m "feat: describe your change"` |
| First push of a branch | `git push -u origin feature/your-task-name` |
| Push later changes | `git push` |
| View recent commits | `git log --oneline -10` |

Do not run every command blindly. Use the command that matches your current task.

## 20. Daily Workflow — Quick Reference

### Start a new task

```bash
git status
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/your-task-name
```

### After writing and testing your code

```bash
git status
git diff
git diff --check
git add path/to/changed-file
git diff --cached
git commit -m "feat: describe your change"
git push -u origin feature/your-task-name
```

Then create a PR on GitHub with:
- **Base:** `main`
- **Compare:** your task branch
- A clear title and description
- Testing details

### After Vinod merges the PR

```bash
git switch main
git fetch origin
git pull --ff-only origin main
git status
```

## Final Team Rule

**Developers work on their own branches, test their changes, push them to GitHub, and create Pull Requests. Vinod reviews and merges approved changes into `main`.**

If a command fails or you are unsure what to do, stop and ask Vinod before trying commands that could overwrite or delete work.
