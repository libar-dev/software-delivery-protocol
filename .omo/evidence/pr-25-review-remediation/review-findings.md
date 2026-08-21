# PR #25 failed review findings

Durable record of the failed merge review for PR #25 at the exact reviewed SHAs. Source of truth for remediation mapping is this file plus `.omo/drafts/pr-25-review-remediation.md`. Re-derive every command and count named below; don't treat this prose as a carried "verified" verdict.

## Reviewed identities

| Field | Value |
| --- | --- |
| PR | https://github.com/libar-dev/software-delivery-protocol/pull/25 |
| Base (`origin/main`) | `bb97d829eea7b3689d5d8569d307e1bb5e77fd0d` |
| Reviewed head (`feature/architectural-patterns-views`) | `5584ed91cf2c3efbf31ad83c28054febd0ec62b7` |
| Review worktree used during the review | `/tmp/sdp-review-architectural-patterns-views` (read-only) |
| Prior close receipt (historical, unchanged) | `.omo/evidence/final-verification-design-law-transfer.md` |
| Prior prepared PR body (historical, not the live publication base) | `.omo/evidence/pr-25-design-law-transfer-body.md` |
| Approved remediation draft | `.omo/drafts/pr-25-review-remediation.md` |

Confirm live identity with:

```sh
gh pr view 25 --json url,state,headRefOid,baseRefOid,headRefName,baseRefName
git rev-parse origin/main origin/feature/architectural-patterns-views
```

## Six evidence-backed review lanes

Overall merge verdict at the reviewed head: **FAILED**.

| # | Review area | Verdict | Confidence |
| --- | --- | --- | --- |
| 1 | Goal & constraints | FAIL | HIGH |
| 2 | Hands-on QA | FAIL | HIGH |
| 3 | Code quality | FAIL | HIGH |
| 4 | Security | PASS | none found |
| 5 | Context / OmO history | FAIL | HIGH |
| 6 | Software design | FAIL | HIGH |

Role names and verdicts above are the supported review vocabulary for this docket. This file does not claim unavailable session transcripts or named model-specific review history.

## Blocking issues

1. **CRITICAL: Recipe family maps crash on lawful Spec IDs.**
   `docs/agent-surface/recipes.md` recipes 1, 11, and 18 accumulate into prototype-bearing `{}` maps. A lawful family such as `constructor` makes `.push` throw (`decidedSubjectsByFamily[family].push is not a function` on recipe 18). Public ID grammar accepts that family; the catalog must not reject it to dodge JavaScript inheritance.

2. **HIGH: Durable OmO ledger history was overwritten, then deleted.**
   Commit `726eb9d` replaced a 135-event `.omo/start-work/ledger.jsonl` with four events. Commit `315a0d8` deleted the remaining tracked ledger. That violates recoverable OmO state under `AGENTS.md`. Runtime ledger remains ignored today; recovery belongs under durable `.omo/evidence/`.

3. **HIGH: Live PR body understates `src/` scope.**
   Against `main`, the PR changes many `src/` files. The "only `src/` change" sentence is true for Wave 2 after `ed77ee7`, not for the whole branch. Publication must restate the Wave-2 boundary.

4. **MAJOR: Coarse-grain coverage doesn't prove the claimed helper relationship.**
   `test/self-hosting-graph.test.ts` checks covering-anchor component membership for `coarseGrainCoverage` rows. It doesn't prove the rostered `path#symbol` exists as a runtime export or is value-consumed by the covering source. A stale line pointer already exists in `test/self-hosting-oracle/structural-edges.ts` (`emit-markdown.ts:197-205` vs live call at `src/import/emit-markdown.ts:277`).

## Other findings (still in remediation scope)

- `git diff --check origin/main...5584ed91cf2c3efbf31ad83c28054febd0ec62b7` exits 2 with exactly 13 trailing-whitespace findings in:
  - `.omo/evidence/architectural-patterns-views/task-3-implementation.md`
  - `.omo/evidence/architectural-patterns-views/task-8-baseline.md`
  - `.omo/evidence/architectural-patterns-views/task-9-implementation.md`
- The live PR body names hostile-review history that is not preserved as committed or GitHub review artifacts. Soften or drop unsupported named-history claims; keep independently supportable security conclusions.
- Recipe 19 dependency arrays are only exercised as empty sets in `test/recipes.test.ts`.
- `.omo/boulder.json` still pointed completed design-law work at `315a0d8`, behind reviewed head `5584ed9`. New remediation work must own the advancing pointer without rewriting completed history.

## Verified strengths at the reviewed head

Independently remeasurable at `5584ed91cf2c3efbf31ad83c28054febd0ec62b7`:

- Graph totals: 164 Specs, 1 Pack, 177 anchors, 342 nodes, 760 edges
- Structure: 13 components, 76 `memberOf`, 35 `uses`
- Decisions: 35 decisions, 14 inter-decision `dependsOn`, 0 `supersedes`, 46 `decidedBy`
- Readiness: 148 ready / 11 defined / 4 idea / 1 scoped
- Delivery-facts tracer stands `ready` with `implemented` + `has-verifier`, one implementation, one verifier
- Recipe 1 operational backlog empty
- Recipes 17-19 happy paths work; recipe 19 unknown ID returns `{ found: false }`
- Declared `uses` edges match the 35 real cross-component imports under the already-reviewed audit method
- Main/stale-checkout diagnostics match the PR try-it expectations
- Both completed plans have every top-level checkbox closed

## Isolated gate result

A contention-free isolated gate at the reviewed head passed:

- `npm run check` exit 0
- Tests: 847 passed, 1 skipped
- CLI suite: 80 passed
- Typecheck, build, projections, self-hosting gates, and preflight passed
- Required GitHub `check` jobs were green at that head

Markdown/TypeScript LSP diagnostics were unavailable when requested (LSP daemon ownership/startup race). The repository typecheck and full gate remain authoritative. Review made no product edits and preserved the pre-existing untracked `.omo/drafts/design-law-transfer.md`.

## Remediation mapping to Todos 2-8

| Failed-review item | Owning todo | Planned repair |
| --- | --- | --- |
| Recipe 1/11/18 prototype-map crash on lawful families | Todo 2 | `Object.create(null)` in the three recipe accumulators; lawful-family regressions through `runSdpCli` |
| Recipe 19 dependency fields only empty in tests | Todo 3 | Characterization test on `spec:decisions.structural-anchor-semantics` with non-empty `dependsOn` and `dependedOnBy` |
| Coarse-grain rows lack export/consumption teeth; stale line pointer | Todo 4 | Test-only TypeScript helper audits runtime export + value consumption; stable file/symbol rationales |
| Ledger overwrite/delete; recoverable OmO history gap | Todo 5 | Archive 135 + 20 + 12 JSONL segments under `.omo/evidence/pr-25-review-remediation/ledger/` with hashes; clarify runtime-vs-durable rule; leave ignored runtime ledger untouched |
| 13 trailing-whitespace findings; missing durable review record | Todo 6 | This file; remove only the 13 proven trailing-space occurrences; evidence in `task-6-review-evidence.md` |
| False whole-branch `src/` claim; unsupported named-review claim; Boulder pointer; integrated gate/remeasurement | Todo 7 | Cherry-pick verified lanes; one contention-free `npm run check`; rewrite publication body under remediation evidence; advance only the new Boulder work |
| Publish corrected body and fast-forward existing PR branch | Todo 8 | Non-forced push to `origin/feature/architectural-patterns-views`; `gh pr edit` with the remeasured body; clean task-owned worktrees |

No finding above is left unmapped. Security lane PASS needs no product change. Strengths listed under Verified strengths are invariants to re-measure at the integrated head, not automatic merge permission.
