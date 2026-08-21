# Task 1 baseline — PR 25 review remediation checkpoint

Plan: `.omo/plans/pr-25-review-remediation.md` · Todo 1
Integration branch: `work/pr-25-review-remediation`
Task-owned worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-pr-25-review-remediation`
Task id: `st_01a02486`
Parent/root session: `01a02484-8a26-71b5-be12-039515d854cc`
Executor category: `quick` (native `git` category unavailable in this harness)

No production behavior changes. Test-first does not apply. Manual QA is the repository-state surface.

## Recorded identities

| Field | Value |
| --- | --- |
| `origin/main` base | `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d` |
| Reviewed / live PR head / remote `origin/feature/architectural-patterns-views` | `5584ed91cf2c3efbf31ad83c28054febd0ec62b7` |
| Integration HEAD before checkpoint commit | `5584ed91cf2c3efbf31ad83c28054febd0ec62b7` |
| PR URL | `https://github.com/libar-dev/software-delivery-protocol/pull/25` |
| Target branch | `feature/architectural-patterns-views` |
| Current integration branch | `work/pr-25-review-remediation` |
| Task-owned worktree | `/home/darkomijic/dev-libar/software-delivery-protocol-pr-25-review-remediation` |
| SSH remote `origin` | `git@github.com:libar-dev/software-delivery-protocol.git` |

## Source checksums (authoritative main-checkout → worktree copies)

`cmp` exit 0 for each pair. SHA-256:

- `.omo/drafts/design-law-transfer.md` `e35e92656ac54b7ddd2ea0f02f9e2a730a8cdfbbdb966845485ad94344a0f26f`
- `.omo/drafts/pr-25-review-remediation.md` `6d96b8f5fe4f2036ad6d438d94dd59e82ffb05f9a756c08a486cf29af438b66b`
- `.omo/plans/pr-25-review-remediation.md` `21998130f2539d49cd4f316e2537c67416338040626351fa68174189aa15f0c8`

`design-law-transfer.md` is preserved byte-for-byte. Main checkout remains untracked for these three sources and received no additional write beyond the already-present untracked files.

## Dirty-state inventory

### Main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` (`feature/architectural-patterns-views`)

Only the three named untracked sources. No other untracked or modified files were absorbed.

```
?? .omo/drafts/design-law-transfer.md
?? .omo/drafts/pr-25-review-remediation.md
?? .omo/plans/pr-25-review-remediation.md
```

### Integration worktree before staging this checkpoint

```
 M .omo/boulder.json
?? .omo/drafts/design-law-transfer.md
?? .omo/drafts/pr-25-review-remediation.md
?? .omo/plans/pr-25-review-remediation.md
```

Ignored runtime path created in the integration worktree only (not staged):

- `.omo/start-work/ledger.jsonl` — ignored by `.gitignore:25` (`git check-ignore -v` → `.gitignore:25:.omo/*	.omo/start-work/ledger.jsonl`)

### Intended staged set (allowlist)

- `.omo/boulder.json`
- `.omo/drafts/design-law-transfer.md`
- `.omo/drafts/pr-25-review-remediation.md`
- `.omo/plans/pr-25-review-remediation.md`
- `.omo/evidence/pr-25-review-remediation/task-1-baseline.md`

## Transport proof

`git remote get-url origin`:

```
git@github.com:libar-dev/software-delivery-protocol.git
```

`gh auth status`:

```
github.com
  ✓ Logged in to github.com account darko-mijic (keyring)
  - Active account: true
  - Git operations protocol: ssh
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo'
```

Git operations protocol is **ssh**.

## Live PR / remote equality (`stale_state`)

```
gh pr view 25 --json url,state,headRefOid,baseRefOid,headRefName,baseRefName
{"baseRefName":"main","baseRefOid":"bb97d829eea7b3689d5d8569d307e1bb5e77fd0d","headRefName":"feature/architectural-patterns-views","headRefOid":"5584ed91cf2c3efbf31ad83c28054febd0ec62b7","state":"OPEN","url":"https://github.com/libar-dev/software-delivery-protocol/pull/25"}
```

```
git rev-parse HEAD origin/feature/architectural-patterns-views origin/main
5584ed91cf2c3efbf31ad83c28054febd0ec62b7
5584ed91cf2c3efbf31ad83c28054febd0ec62b7
bb97d829eea7b3689d5d8569d307e1bb5e77fd0d
```

Live PR head, remote feature head, and integration HEAD equal the recorded reviewed SHA. Live PR base equals recorded `origin/main`.

## Failure QA (read-only, no mutation)

Guard: refuse the checkpoint if live PR head differs from `5584ed91cf2c3efbf31ad83c28054febd0ec62b7`, or if any path outside the allowlist is staged.

### Live head equals recorded (would refuse on mismatch)

```
expected=5584ed91cf2c3efbf31ad83c28054febd0ec62b7
live=$(gh pr view 25 --json headRefOid --jq .headRefOid)
echo "LIVE=$live EXPECTED=$expected"
if [ "$live" != "$expected" ]; then echo "REFUSE: live PR head $live differs from recorded $expected"; else echo "ACCEPT: live PR head equals recorded $expected"; fi
```

```
LIVE=5584ed91cf2c3efbf31ad83c28054febd0ec62b7
EXPECTED=5584ed91cf2c3efbf31ad83c28054febd0ec62b7
ACCEPT: live PR head equals recorded 5584ed91cf2c3efbf31ad83c28054febd0ec62b7
```

### Counterfactual stale head (no git/PR mutation)

```
expected=5584ed91cf2c3efbf31ad83c28054febd0ec62b7
counterfactual=0000000000000000000000000000000000000000
if [ "$counterfactual" != "$expected" ]; then echo "REFUSE: live PR head $counterfactual differs from recorded $expected"; fi
```

```
REFUSE: live PR head 0000000000000000000000000000000000000000 differs from recorded 5584ed91cf2c3efbf31ad83c28054febd0ec62b7
```

### Counterfactual unrelated staged path (no index mutation)

```
allow='.omo/boulder.json
.omo/drafts/design-law-transfer.md
.omo/drafts/pr-25-review-remediation.md
.omo/plans/pr-25-review-remediation.md
.omo/evidence/pr-25-review-remediation/task-1-baseline.md'
hypothetical='README.md'
if ! printf '%s\n' "$allow" | grep -Fxq "$hypothetical"; then echo "REFUSE: unrelated staged path $hypothetical"; fi
```

```
REFUSE: unrelated staged path README.md
```

The same allowlist is applied to the real index after staging. An unrelated staged path would abort before `git commit`.

## Happy QA

### Pre-commit (staged allowlist only)

```
git diff --cached --check && node check-temporal.mjs
DIFF_CHECK_EXIT=0
TEMPORAL_EXIT=0
```

```
git diff --cached --name-only
.omo/boulder.json
.omo/drafts/design-law-transfer.md
.omo/drafts/pr-25-review-remediation.md
.omo/evidence/pr-25-review-remediation/task-1-baseline.md
.omo/plans/pr-25-review-remediation.md
```

```
git status --short --untracked-files=all
M  .omo/boulder.json
A  .omo/drafts/design-law-transfer.md
A  .omo/drafts/pr-25-review-remediation.md
A  .omo/evidence/pr-25-review-remediation/task-1-baseline.md
A  .omo/plans/pr-25-review-remediation.md
```

Ignored unstaged runtime ledger is present and not listed by `--short` because it is ignored. `git check-ignore -v .omo/start-work/ledger.jsonl` still points at `.gitignore:25`. `git ls-files --stage .omo/start-work/ledger.jsonl` is empty.

Real-index allowlist guard after staging:

```
ACCEPT: staged set equals allowlist
```

```
git diff --cached --stat
 .omo/boulder.json                                  |  14 +-
 .omo/drafts/design-law-transfer.md                 | 106 ++++++
 .omo/drafts/pr-25-review-remediation.md            | 125 +++++++
 .../pr-25-review-remediation/task-1-baseline.md    | 194 +++++++++++
 .omo/plans/pr-25-review-remediation.md             | 361 +++++++++++++++++++++
 5 files changed, 799 insertions(+), 1 deletion(-)
```

The evidence-file line count above is the staged blob before this Happy QA fill. After restaging this file, `git show --stat --oneline HEAD` is the authoritative tree/stat (same five paths; evidence insertion count may increase). Subject must be `chore(omo): checkpoint PR 25 remediation plan`.

### Post-commit inspection contract

`git show --stat --oneline HEAD` must list exactly those five paths, exit 0, and no product path. Recorded after commit in the executor DoneClaim; the cached name-only set is the commit tree.

## UltraQA classes

### Applicable

- `dirty_worktree`: only the five allowlisted `.omo` paths are staged; ignored runtime ledger remains unstaged; main-checkout extra files were not absorbed.
- `stale_state`: live PR head/base and `origin` feature/main SHAs equal the recorded values.
- `misleading_success_output`: inspect exact cached name-only/stat, command exits, and `git show --stat --oneline HEAD` rather than relying on a bare commit success line.

### Not applicable

- `malformed input`: no new parser or user-input surface.
- `prompt injection`: no untrusted external text is executed as instructions.
- `cancel/resume`: checkpoint is a single finite git commit, not a resumable long-running flow.
- `hung or long commands`: only short read-only git/gh/node commands; no polling or waits.
- `flaky tests`: no new or timing-sensitive automated tests.
- `repeated interruptions`: no mid-operation interrupt or continuation protocol.

## Cleanup receipts

- No timers, services, temp directories, background processes, or extra worktrees created for QA.
- Runtime ledger created only in the integration worktree and left ignored/unstaged.
- Main checkout dirty set unchanged: the three named untracked sources only.
- No push, no `gh pr edit`, no merge, no product-file edit.
