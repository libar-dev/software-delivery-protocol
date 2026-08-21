# Task 1: normal-branch direct mode

The user chose **normal-branch direct mode** (rejected worktree mode). Setup ran in the main checkout at `/home/darkomijic/dev-libar/software-delivery-protocol`. No product files were edited.

## Pre-write inventory

Commands:

```bash
git status --short --branch
git branch --show-current
git rev-parse HEAD
git worktree list --porcelain
git show-ref --verify --quiet refs/heads/feature/architectural-patterns-views
ls -la /home/darkomijic/dev-libar/software-delivery-protocol-architectural-patterns-views
```

Results:

- `git status --short --branch`:
  ```
  ## feature/architectural-patterns-views
   M .omo/boulder.json
   M .omo/start-work/ledger.jsonl
  ```
- `git branch --show-current`: `feature/architectural-patterns-views`
- `git rev-parse HEAD`: `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`
- `git worktree list --porcelain`:
  ```
  worktree /home/darkomijic/dev-libar/software-delivery-protocol
  HEAD bb97d829eea7b3689d5d8569d307e1bb5e77fd0d
  branch refs/heads/feature/architectural-patterns-views
  ```
- Branch `refs/heads/feature/architectural-patterns-views` exists.
- Extra path `/home/darkomijic/dev-libar/software-delivery-protocol-architectural-patterns-views`: **absent** (`worktree_path_absent`).
- Evidence dir `.omo/evidence/architectural-patterns-views/` was absent before this file was written.

Pre-existing dirty blob hashes (`git hash-object`):

- `.omo/boulder.json`: `3cbcbecf91f2752aae498b40189d216be7774e18`
- `.omo/start-work/ledger.jsonl`: `59fe013f4db705db0dd6baa130e7588f93b0d7f1`

`git diff --stat`:

```
 .omo/boulder.json            | 16 +++++++++++++++-
 .omo/start-work/ledger.jsonl |  1 +
 2 files changed, 16 insertions(+), 1 deletion(-)
```

## Cleanup receipt

**no partial worktree existed**

`git worktree remove` was not run. The cancelled-setup path was not present on disk and was not registered in `git worktree list`.

## Branch activation

```bash
git switch feature/architectural-patterns-views
```

Result: `Already on 'feature/architectural-patterns-views'` with working-tree still showing:

```
M	.omo/boulder.json
M	.omo/start-work/ledger.jsonl
```

No `reset`, `checkout` of paths, `clean`, `stash`, force, commit, or push was used.

## Automated verification

Commands:

```bash
git branch --show-current
git rev-parse HEAD
git worktree list --porcelain
git status --short --branch
git hash-object .omo/boulder.json .omo/start-work/ledger.jsonl
```

Results:

- current branch: `feature/architectural-patterns-views` (exact match)
- HEAD: `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d` (unchanged)
- worktree list: only the main checkout path; rejected extra worktree path absent
- dirty paths after switch: `.omo/boulder.json`, `.omo/start-work/ledger.jsonl` (same presence as pre-switch)
- hashes after switch: `3cbcbecf91f2752aae498b40189d216be7774e18`, `59fe013f4db705db0dd6baa130e7588f93b0d7f1` (byte-identical)

**PASS**: main checkout on exact feature branch, HEAD unchanged, extra worktree absent, pre-existing dirt preserved.

## Manual QA

Exact invocation in the main checkout:

```bash
git status --short --branch
```

Expected / observed (pre-existing unrelated dirt is preserved baseline, not a new task change):

```
## feature/architectural-patterns-views
 M .omo/boulder.json
 M .omo/start-work/ledger.jsonl
```

After this evidence file is written, `?? .omo/evidence/architectural-patterns-views/task-1-normal-branch.md` (and possibly the evidence directory) may also appear. That is task-owned evidence only.

## UltraQA

- **dirty_worktree**: pre/post dirty paths identical; `git hash-object` for both dirty files unchanged (`3cbcbecf91f2752aae498b40189d216be7774e18`, `59fe013f4db705db0dd6baa130e7588f93b0d7f1`).
- **stale_state / generated artifact**: extra worktree path not on disk; `git worktree list --porcelain` lists only `/home/darkomijic/dev-libar/software-delivery-protocol` at HEAD `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d` on `refs/heads/feature/architectural-patterns-views`.
- **misleading_success_output**: asserted contents, not exit codes — branch name `feature/architectural-patterns-views`, HEAD `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`, worktree list text, and status paths above.
- **wrong_location**: N/A — only the main checkout was used; extra worktree path never existed.
- **partial_commit / history rewrite**: N/A — no commit, rebase, reset, or push.
- **secret / product edit**: N/A — no product files edited; boulder/ledger left as pre-existing dirt.

## Product files

No product files were edited.
