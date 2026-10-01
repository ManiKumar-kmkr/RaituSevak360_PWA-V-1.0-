# RaituSevak360 — Git & GitHub Development Workflow

**Document:** `GIT_GITHUB_WORKFLOW.md`  
**Project:** RaituSevak360 PWA  
**Repository:** Private GitHub repository  
**Protected branch:** `main`  
**Team:** Repository owner + 3–4 developers

## 1. Purpose of This Document

This document defines the standard Git and GitHub workflow that every RaituSevak360 developer must follow.

The objectives are:
- Prevent accidental changes to the production/main branch.
- Keep all developers working on the correct version of the project.
- Prevent one developer's work from overwriting another developer's work.
- Review changes before they enter `main`.
- Keep the project history understandable.
- Avoid merge conflicts, lost work, and unnecessary repository changes.
- Make collaboration consistent across all developers.

**Every developer must follow this workflow.**

## 2. Repository Ownership and Access

The repository is private and is owned by the repository owner.

The owner is responsible for:
- Managing repository access.
- Maintaining the branch ruleset.
- Reviewing important project changes.
- Approving changes according to the team policy.
- Performing the final merge into `main` under the current team workflow.
- Protecting the main branch and resolving repository-level issues.

Developers are collaborators and must work through feature branches and pull requests.

### Important access rules

1. Never share GitHub passwords, access tokens, or personal credentials.
2. Each developer must use their own GitHub account.
3. Never remove collaborators or change repository settings without authorization.
4. Never change branch protection rules without the owner's permission.
5. Never push directly to `main`.
6. Never use force push on `main`.
7. Never delete the `main` branch.
8. Never upload `.env` files, credentials, API keys, database passwords, or private configuration.

## 3. Branch Structure

The project uses `main` as the protected integration branch.

Recommended branch structure:

```text
main
 ├── feature/farmer-dashboard
 ├── feature/marketplace
 ├── feature/authentication
 ├── fix/login-validation
 ├── fix/api-error-handling
 └── docs/git-workflow
```

### Branch responsibilities

**`main`**
- Contains the approved project code.
- Is protected by the GitHub ruleset.
- Must not be used for direct development.
- Receives changes through approved pull requests.

**Feature branches**
- Used to develop new features.
- Each developer creates a separate branch for their assigned task.
- Changes are committed and pushed to the developer's branch.
- The branch is submitted to `main` through a pull request.

**Fix branches**
- Used to correct existing bugs.
- Must follow the same pull request and review process.

**Documentation branches**
- Used for documentation-only changes when appropriate.
- Must also follow the pull request process.

## 4. The Complete Development Workflow

Every developer must follow this sequence:

```text
Open the correct local project
          |
          v
Check Git status
          |
          v
Fetch the latest GitHub information
          |
          v
Update local main
          |
          v
Create a separate feature branch
          |
          v
Make the assigned changes
          |
          v
Test the changes
          |
          v
Review the changes locally
          |
          v
Commit the changes
          |
          v
Push the feature branch to GitHub
          |
          v
Create a pull request targeting main
          |
          v
Owner/reviewer reviews the changes
          |
          v
Address feedback and push corrections
          |
          v
Required approvals and checks are satisfied
          |
          v
Owner performs the final merge
          |
          v
Developers update their local main
```

Do not skip steps just to finish a task faster.

## 5. Step 1 — Open the Correct Project

Before running any Git command, open the correct RaituSevak360 folder in VS Code.

Open the integrated terminal:

**VS Code → Terminal → New Terminal**

Run:

```bash
git remote -v
git status
git branch --show-current
```

Verify:
- The remote URL points to the correct RaituSevak360 repository.
- The current branch is the expected branch.
- No unexpected local changes exist.

Do not run Git commands from the VILOOP folder or another project's directory.

If the folder is not a Git repository, stop and confirm the correct folder before proceeding.

## 6. Step 2 — Update Local Main

Before starting a new task, obtain the latest version of `main`.

```bash
git fetch origin
git switch main
git pull --ff-only origin main
```

Explanation:
- `git fetch origin` downloads the latest remote repository information.
- `git switch main` switches to the local main branch.
- `git pull --ff-only origin main` updates local main only when Git can advance it without creating a merge commit.

If Git refuses to switch branches because of local changes, do not delete or overwrite those changes. Inspect `git status` and preserve the work first.

If the pull fails or reports divergence, stop and resolve the issue before continuing.

## 7. Step 3 — Create a Feature Branch

Never develop a new feature directly on `main`.

After updating local main, create a new branch for the assigned task.

Example:

```bash
git switch -c feature/farmer-dashboard
```

Other examples:

```bash
git switch -c feature/marketplace
git switch -c feature/authentication
git switch -c fix/login-validation
git switch -c docs/git-workflow
```

### Branch naming rules

Use lowercase names and hyphens.

Recommended prefixes:
- `feature/` — new functionality
- `fix/` — bug fixes
- `docs/` — documentation
- `refactor/` — internal code restructuring
- `test/` — testing improvements
- `chore/` — maintenance and configuration

Every developer must use a unique, task-specific branch name.

Do not use vague names such as `new`, `changes`, `test123`, or `final`.

## 8. Step 4 — Work Only on Your Assigned Task

Before editing code, inspect the existing implementation.

Developers must:
1. Understand the existing architecture.
2. Identify the files relevant to the assigned task.
3. Avoid unnecessary modifications to unrelated modules.
4. Preserve existing working functionality.
5. Follow the existing project structure and technology stack.
6. Keep changes focused and reviewable.
7. Test the feature or fix before committing.

Do not rewrite entire modules when a smaller change is sufficient.

Do not modify another developer's work without coordination.

If a task requires changing shared files or another developer's module, communicate with the team before proceeding.

## 9. Step 5 — Check Your Changes

Before committing, run:

```bash
git status
git diff
git diff --check
```

Explanation:
- `git status` shows changed, staged, untracked, and other repository state information.
- `git diff` displays unstaged code changes.
- `git diff --check` checks for whitespace errors and certain patch formatting problems.

Review the output carefully.

Confirm that:
- Only the intended files are changed.
- No unrelated files are included.
- No temporary files are included.
- No `.env` files or credentials are included.
- No debugging code or accidental changes remain.

Run the appropriate project checks before pushing, such as the existing lint, type-check, build, unit tests, or backend tests. Use the actual scripts configured in the relevant project directory.

Do not claim that tests passed if they were not run.

## 10. Step 6 — Stage and Commit Changes

Stage only the files related to your task.

Example:

```bash
git add frontend/src/components/FarmerDashboard.tsx
```

For multiple specific files:

```bash
git add frontend/src/components/FarmerDashboard.tsx frontend/src/services/farmerService.ts
```

After reviewing the staged changes:

```bash
git diff --cached
git commit -m "feat: add farmer dashboard"
```

### Commit message format

Use a clear prefix and a short description.

Examples:

```text
feat: add farmer dashboard
feat: add marketplace filters
fix: correct login validation
fix: handle failed API requests
docs: update GitHub workflow
refactor: simplify authentication service
test: add marketplace validation tests
chore: update project configuration
```

A commit should represent a logical unit of work.

Avoid vague commit messages such as:

```text
changes
update
final
done
new code
```

Never commit files containing secrets or sensitive information.

## 11. Step 7 — Push Your Feature Branch

Push your branch to GitHub:

```bash
git push -u origin feature/farmer-dashboard
```

Replace `feature/farmer-dashboard` with your actual branch name.

The `-u` option sets the upstream branch, making future pushes easier.

For later commits on the same branch, use:

```bash
git push
```

**Important:** Push to your feature branch, not to `main`.

If GitHub rejects the push because of permissions, branch rules, or a remote update, read the error carefully. Do not attempt to bypass repository protections.

## 12. Step 8 — Create a Pull Request

After pushing your feature branch:

1. Open the RaituSevak360 repository on GitHub.
2. Open the **Pull requests** tab.
3. Select **New pull request**.
4. Set the base branch to `main`.
5. Set the compare branch to your feature branch.
6. Review the changed files and diff.
7. Create the pull request.

The target must be the protected `main` branch unless the owner explicitly directs otherwise.

### Pull request title examples

```text
feat: Add farmer dashboard
fix: Correct login validation
docs: Update GitHub development workflow
```

### Pull request description template

```markdown
## Summary
Describe what this PR changes.

## Reason
Explain why this change is needed.

## Changes
- List the main changes.
- Mention the affected modules.

## Testing
- [ ] Relevant tests completed
- [ ] Build or validation checks completed
- [ ] Existing functionality checked

## Risks or Notes
Mention dependencies, limitations, or migration requirements.

## Checklist
- [ ] Changes are limited to the assigned task
- [ ] No secrets or .env files included
- [ ] No unrelated files changed
- [ ] Documentation updated if needed
```

Write a meaningful description. Reviewers should understand the change without having to guess its purpose.

## 13. Step 9 — Owner Review and Approval

The intended RaituSevak360 team policy is:

**Developers submit PRs → the owner reviews and approves → the owner performs the final merge.**

The owner may review the following:
- Correctness of the implementation.
- Security and access-control implications.
- Compatibility with existing features.
- Project architecture and coding conventions.
- Test coverage and build results.
- Whether the PR contains unrelated or unnecessary changes.

Developers must not treat an approval from another developer as a replacement for the owner's review under this team policy.

### Important distinction: GitHub enforcement versus team policy

The current ruleset requires one approval, dismisses stale approvals, requires approval of the latest reviewable push, and requires conversation resolution.

However, if the ruleset does not explicitly require code-owner review, GitHub may accept another eligible reviewer's approval. The `.github/CODEOWNERS` file identifies the owner of covered files, but the file alone does not make the owner's approval mandatory.

Therefore:
- Team members must follow the owner-approval policy.
- The owner should perform the final merge.
- Do not assume the current ruleset technically enforces owner-only approval or owner-only merging.
- Test a sample PR to confirm the actual behavior of the repository settings.

If an owner-specific review requirement is not enforced by the available settings, repository administrators must not describe it as technically enforced.

## 14. Step 10 — Review Feedback and New Commits

If the owner or reviewer requests changes:

1. Read every review comment.
2. Ask for clarification if the requested change is unclear.
3. Make the corrections on the same feature branch.
4. Review the changes again.
5. Run the appropriate tests.
6. Commit the corrections.
7. Push the branch.
8. Reply to the review comments and resolve conversations when the issue is addressed.

Example:

```bash
git status
git add frontend/src/components/FarmerDashboard.tsx
git commit -m "fix: address farmer dashboard review"
git push
```

When new reviewable commits are pushed, the stale-approval rule dismisses earlier approvals as configured. The updated code must be reviewed again when required.

Do not try to preserve an old approval by hiding or bypassing new changes.

## 15. Step 11 — Merge the Pull Request

Under the current team workflow, the owner performs the final merge after reviewing the changes.

Before merging, verify:
- The target branch is `main`.
- The required approval count is satisfied.
- The latest reviewable push has the required approval.
- All review conversations are resolved.
- Required status checks pass, if configured.
- No unresolved merge conflicts remain.
- The PR contains only the intended changes.

Use one of the merge methods permitted by the ruleset.

After the merge succeeds, GitHub integrates the approved changes into `main`.

Do not delete a branch while it contains unmerged work. Once the PR is merged, its feature branch can normally be deleted if it is no longer needed.

## 16. Step 12 — Update Local Main After Merging

After the PR is merged, developers should return to local main and update their copy.

First, finish or preserve any remaining local work on the feature branch.

Then:

```bash
git switch main
git fetch origin
git pull --ff-only origin main
git status
```

Verify that the local branch is up to date with `origin/main`.

Before starting another task, create a new feature branch from the updated `main`.

## 17. Handling Multiple Developers

Several developers may work simultaneously on different modules.

Example:

```text
Developer 1 → feature/farmer-dashboard
Developer 2 → feature/marketplace
Developer 3 → feature/authentication
Developer 4 → fix/api-validation
```

Each developer must:
- Work on their own branch.
- Avoid pushing another developer's unfinished changes.
- Avoid committing unrelated changes.
- Communicate before modifying shared files.
- Open a PR with a clear description.
- Respond to review feedback promptly.

### When developers modify the same file

1. Inform the other developer.
2. Coordinate which changes should be retained.
3. Avoid editing or force-pushing over each other's work.
4. Resolve conflicts carefully.
5. Run tests after resolving conflicts.
6. Request a new review if the conflict resolution materially changes the code.

Do not blindly accept all incoming or current changes during a conflict. Understand the difference before choosing.

## 18. Merge Conflict Procedure

If Git reports a merge conflict while updating a feature branch:

1. Stop and read the conflict message.
2. Run `git status`.
3. Identify each conflicted file.
4. Open the files in VS Code.
5. Review the conflicting sections.
6. Coordinate with the author of the other change if necessary.
7. Resolve the conflicts without removing valid functionality.
8. Run tests.
9. Stage the resolved files.
10. Complete the operation that Git reported as incomplete.

For a merge-based conflict resolution:

```bash
git status
git diff
git add path/to/resolved-file
git diff --cached
git commit -m "fix: resolve merge conflicts"
```

Only create the commit if Git indicates a merge commit is required. If the conflict occurred during a rebase, continue the rebase with the appropriate command instead.

If the conflict is unclear, stop and ask for help rather than using destructive commands.

## 19. Local Changes and Stashing

Before switching branches, pulling changes, or performing other Git operations, check:

```bash
git status
```

If unfinished work must be temporarily set aside:

```bash
git stash push -m "WIP: farmer dashboard"
```

To view saved stashes:

```bash
git stash list
```

To restore the latest stash while keeping it available:

```bash
git stash apply
```

To restore and remove the latest stash after successful application:

```bash
git stash pop
```

Stashing is temporary storage, not a replacement for regular commits or backups. Check the resulting changes before continuing.

## 20. Private Repository and Security Rules

The repository is private, so each collaborator must authenticate with an account that has repository access.

Mandatory security rules:
- Never share passwords or personal access tokens.
- Never commit `.env`, private keys, database credentials, or API secrets.
- Use `.env.example` for documenting variable names without real secret values.
- Do not include real user data in test fixtures or screenshots.
- Do not remove or weaken security controls without owner approval.
- Report accidentally committed secrets immediately.
- If a secret is exposed, revoke or rotate it; deleting the file in a later commit is not sufficient.

Before pushing, check:

```bash
git status
git diff
```

Review every staged file before committing.

## 21. Ruleset and Main Branch Protection

The current intended `main` protection configuration is:

| Setting | Intended configuration |
|---|---|
| Ruleset enforcement | Active |
| Target branch | `main` |
| Require a pull request before merging | Enabled |
| Required approvals | 1 |
| Dismiss stale approvals | Enabled |
| Require approval of the most recent reviewable push | Enabled |
| Require conversation resolution | Enabled |
| Restrict deletions | Enabled |
| Block force pushes | Enabled |
| Status checks | Enable when configured |
| Signed commits | Not required currently |
| Required deployments | Not required currently |

The team must not change these settings without the owner's authorization.

### Do not bypass the rules

Never attempt to bypass protections by:
- Force-pushing to `main`.
- Pushing directly to the protected branch.
- Disabling the ruleset to merge unfinished work.
- Asking another collaborator to bypass required reviews.
- Deleting or recreating a protected branch to avoid the rules.

The setting **Do not allow bypassing the above settings** should be enabled if the owner wants the rules to apply to administrators and users with bypass permissions as well.

## 22. CODEOWNERS File

The repository contains:

```text
.github/CODEOWNERS
```

Expected content:

```text
* @VINODMAMIDI-05
```

This identifies the owner as the code owner for all files covered by the pattern, assuming that GitHub username is correct.

The file can help route review requests, but it does not independently enforce mandatory owner approval. A supported required-code-owner-review rule must also be active for GitHub to block merging without the code-owner approval.

Do not edit the CODEOWNERS file without coordinating with the repository owner.

## 23. Pull Request Checklist

Before submitting a PR, the developer must confirm:

- [ ] I am working on the correct repository.
- [ ] I updated my local `main` before creating the feature branch.
- [ ] I am not working directly on `main`.
- [ ] My branch name describes the task.
- [ ] My changes are related to the assigned task.
- [ ] I reviewed the diff.
- [ ] I ran the appropriate tests.
- [ ] I did not commit secrets or `.env` files.
- [ ] My commit messages are meaningful.
- [ ] The PR targets `main`.
- [ ] The PR description explains the change.
- [ ] I am ready to address review feedback.

## 24. Rules for Safe Development

Every developer must remember:

1. Always check `git status` before important Git operations.
2. Fetch and update `main` before starting new work.
3. Create a separate feature branch for every task.
4. Commit small, logical changes.
5. Review staged files before committing.
6. Push only to the developer's feature branch.
7. Submit a pull request instead of directly changing `main`.
8. Follow the owner-approval policy.
9. Never force-push to `main`.
10. Never use destructive commands without understanding their effects.
11. Resolve review comments and conflicts carefully.
12. Update local `main` after approved changes are merged.

If a command fails or produces unexpected results, stop and inspect the error before trying another command.

---

# 25. Complete Git Command Reference With Explanations

The following commands are grouped by purpose. Developers should use the commands relevant to their current task rather than running every command blindly.

## A. Check Git Configuration and Repository

### 1. Check the Git version

```bash
git --version
```

Displays the installed Git version.

### 2. Check the connected GitHub repository

```bash
git remote -v
```

Displays the remote repository URLs for fetching and pushing.

### 3. Check the current branch

```bash
git branch --show-current
```

Displays the branch currently checked out.

### 4. View all local branches

```bash
git branch
```

Lists branches stored in the local repository.

### 5. View local and remote branches

```bash
git branch -a
```

Displays local branches and remote-tracking branches.

### 6. Check repository status

```bash
git status
```

Shows the current branch, modified files, staged changes, untracked files, and available status information.

### 7. View recent commits

```bash
git log --oneline -10
```

Displays the ten most recent commits in a compact format.

### 8. View commit details

```bash
git show
```

Shows the latest commit and its changes.

## B. Download and Update Repository Information

### 9. Fetch updates from GitHub

```bash
git fetch origin
```

Downloads remote commits and branch information without merging changes into the current working branch.

### 10. Switch to main

```bash
git switch main
```

Switches to the local `main` branch.

### 11. Update main safely

```bash
git pull --ff-only origin main
```

Downloads and integrates the remote main branch only when a fast-forward update is possible.

### 12. Compare local main with GitHub main

```bash
git fetch origin
git status -sb
git log --oneline main..origin/main
```

Shows commits present on remote main but not on local main, after fetching.

### 13. Clone the repository for the first time

```bash
git clone YOUR-REPOSITORY-URL
```

Creates a local copy of the repository. Replace the placeholder with the private repository's actual URL.

### 14. Enter the project folder

```bash
cd YOUR-PROJECT-FOLDER
```

Changes the terminal's current directory to the project folder.

### 15. Open the current folder in VS Code

```bash
code .
```

Opens the current directory in VS Code, if the `code` command is available.

## C. Create and Manage Branches

### 16. Create a new feature branch and switch to it

```bash
git switch -c feature/your-task-name
```

Creates a branch from the current commit and switches to it. Run this from the updated `main` branch.

### 17. Switch to an existing branch

```bash
git switch feature/your-task-name
```

Changes to an existing local branch.

### 18. List branches

```bash
git branch
```

Displays local branches and marks the current branch.

### 19. Rename the current branch

```bash
git branch -m feature/new-task-name
```

Renames the current branch. If the old branch has already been pushed, the remote branch must be handled separately.

### 20. Delete a local branch

```bash
git branch -d feature/your-task-name
```

Deletes a local branch when Git considers it safely merged.

Do not delete a branch containing unfinished work.

### 21. Delete a remote feature branch

```bash
git push origin --delete feature/your-task-name
```

Deletes a remote branch. Only do this after its work is merged and the branch is no longer needed.

Never use this command for `main`.

## D. Review Changes

### 22. View unstaged changes

```bash
git diff
```

Displays changes in tracked files that have not been staged.

### 23. View staged changes

```bash
git diff --cached
```

Displays changes that are staged and will be included in the next commit.

### 24. Check whitespace errors

```bash
git diff --check
```

Checks for whitespace problems in the current diff.

### 25. View differences between two branches

```bash
git diff main...feature/your-task-name
```

Displays changes introduced by the feature branch relative to its merge base with `main`.

## E. Stage and Commit Changes

### 26. Stage one file

```bash
git add path/to/file
```

Stages a specific file for the next commit.

### 27. Stage several specific files

```bash
git add path/to/file1 path/to/file2
```

Stages the listed files.

### 28. Stage all changes

```bash
git add .
```

Stages new and modified files under the current directory, subject to Git's ignore rules.

Use this only after checking the repository status and reviewing which files should be included.

### 29. Commit staged changes

```bash
git commit -m "feat: describe your change"
```

Creates a commit from staged changes.

### 30. Update the last commit message

```bash
git commit --amend -m "corrected commit message"
```

Replaces the most recent commit with an amended version. Avoid amending commits already shared with others unless coordinated, because the commit ID changes.

### 31. Unstage a file without deleting its changes

```bash
git restore --staged path/to/file
```

Removes the file from the staging area while keeping its working-tree modifications.

### 32. Discard unstaged changes to a file

```bash
git restore path/to/file
```

Restores the file to its last committed state and discards its unstaged modifications.

**Warning:** This can permanently remove local work. Do not run it unless you intentionally want to discard those changes.

## F. Push Changes to GitHub

### 33. Push a feature branch for the first time

```bash
git push -u origin feature/your-task-name
```

Uploads the branch to GitHub and sets the upstream tracking branch.

### 34. Push later commits

```bash
git push
```

Uploads new commits to the configured upstream branch.

### 35. Check the upstream branch

```bash
git branch -vv
```

Displays local branches and their upstream tracking branches.

### 36. Change a remote URL

```bash
git remote set-url origin YOUR-REPOSITORY-URL
```

Updates the URL associated with `origin`. Use only when the current URL is incorrect.

### 37. Add a remote if one does not exist

```bash
git remote add origin YOUR-REPOSITORY-URL
```

Adds a remote named `origin`. Do not run this if `origin` already exists.

## G. Handle Local Work and Conflicts

### 38. Temporarily stash tracked changes

```bash
git stash push -m "WIP: description"
```

Temporarily stores tracked working-tree and staged changes in a stash.

### 39. View stashes

```bash
git stash list
```

Lists saved stashes.

### 40. Apply the latest stash without removing it

```bash
git stash apply
```

Restores the latest stash while retaining it in the stash list.

### 41. Apply and remove the latest stash

```bash
git stash pop
```

Applies the latest stash and normally removes it from the stash list if successful.

### 42. Inspect conflicts and repository state

```bash
git status
git diff
```

Identifies conflicted files and helps inspect unresolved changes.

### 43. Mark a conflict-resolved file as resolved

```bash
git add path/to/resolved-file
```

Stages the resolved file. Continue or complete the merge/rebase operation according to the message Git displays.

### 44. Continue a rebase

```bash
git rebase --continue
```

Continues a rebase after conflicts have been resolved and staged.

Use only when Git reports that a rebase is in progress.

### 45. Abort a rebase

```bash
git rebase --abort
```

Cancels an in-progress rebase and restores the pre-rebase state where possible.

### 46. Abort a merge

```bash
git merge --abort
```

Attempts to cancel an in-progress merge and restore the pre-merge state.

Do not run merge or rebase recovery commands unless that operation is actually in progress.

## H. Compare, Inspect, and Find History

### 47. View commits on a branch

```bash
git log --oneline --decorate
```

Shows commit history with branch and tag information.

### 48. View commits in a graph

```bash
git log --oneline --graph --decorate --all
```

Displays a compact graph of local and remote-tracking branch history.

### 49. Find which files changed in a commit

```bash
git show --stat COMMIT-ID
```

Shows the files changed and a summary of the selected commit.

### 50. Compare two commits

```bash
git diff COMMIT-ID-1 COMMIT-ID-2
```

Shows differences between two commits.

Replace the placeholders with actual commit IDs.

## I. Tags and Releases

### 51. List tags

```bash
git tag
```

Lists tags available in the local repository.

### 52. Create a release tag

```bash
git tag -a v1.0.0 -m "RaituSevak360 release 1.0.0"
```

Creates an annotated tag for a release. Use the project's actual release version and follow the owner's release process.

### 53. Push a tag

```bash
git push origin v1.0.0
```

Uploads the specified tag to GitHub.

## J. Initialize and Configure Git (Only When Needed)

### 54. Initialize a new Git repository

```bash
git init
```

Initializes Git tracking in a directory. Do not run this in the existing RaituSevak360 repository unless the owner specifically instructs you to do so.

### 55. Configure your commit name

```bash
git config --global user.name "Your Name"
```

Sets the name recorded in your Git commits.

### 56. Configure your commit email

```bash
git config --global user.email "your-email@example.com"
```

Sets the email recorded in your Git commits. Use the email you want associated with your GitHub commits.

### 57. View Git configuration

```bash
git config --list
```

Displays Git configuration values.

## K. Final Daily Workflow — Copy and Use

For a new task:

```bash
git status
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/your-task-name
```

After completing the task:

```bash
git status
git diff
git diff --check
git add path/to/changed-file
git diff --cached
git commit -m "feat: describe your change"
git push -u origin feature/your-task-name
```

Then create a pull request on GitHub with:
- Base: `main`
- Compare: your feature branch
- A clear title and description
- Testing details
- Relevant review requests

After the owner reviews and merges the PR:

```bash
git switch main
git fetch origin
git pull --ff-only origin main
git status
```

Before starting another task, create a new feature branch from the updated `main`.

---

# 26. Final Team Rule

**No developer should directly modify or push changes to `main` as part of normal development.**

All changes must be developed in separate branches, committed with meaningful messages, pushed to GitHub, reviewed through pull requests, and merged only after the required reviews and checks are satisfied.

The owner is responsible for the final review and merge under the current team policy.

When in doubt, stop and ask the repository owner rather than using commands that could overwrite, delete, or bypass existing work.