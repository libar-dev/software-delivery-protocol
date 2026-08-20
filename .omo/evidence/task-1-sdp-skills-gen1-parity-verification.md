# Task 1 verification: sdp-skills-gen1-parity

Independent AdversarialVerify of the executor BLOCKED claim in `.omo/evidence/task-1-sdp-skills-gen1-parity.md`. No product, guidance, plan-37, test, runtime, spec, package, or requested-plan file was edited.

## Todo 1 acceptance (from the requested plan, not the executor)

Todo 1 remains unchecked: `- [ ] 1. Wait for plan 37 to close cleanly`.

Required for release of Wave 1:

- `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` and the current-plan entry in `AGENTS.md` both say `EXECUTED`
- `node check-self-hosting-gates.mjs .` exits 0 with empty stderr
- `git status --short` shows no live plan-37 edit overlapping `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-authoring/SKILL.md`, or `README.md`

Failure path: if either status source still says `EXECUTING`, any plan-37 todo or final verifier is open, or the gate exits non-zero, this todo stays pending and no writer starts.

## Fresh status headers

Exact lines:

```text
AGENTS.md:19:> **plan 37 is EXECUTING** — the plan-36 arc is executing; briefs I–K are delivered per
AGENTS.md:20:> plan 36, with operational tracking in `.omo/plans/plan-37-settling-arc.md`.
plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md:3:> **Status:** 🔄 EXECUTING — the plan-36 arc is executing; briefs I–K delivered per plans/36; operational tracking in `.omo/plans/plan-37-settling-arc.md`
```

Neither required source contains `EXECUTED` for plan 37. `plan 37 is EXECUTED` is absent from the AGENTS current-plan block. Plan 37 line 3 contains `EXECUTING`, not `EXECUTED`.

Source mtimes on this tree: `AGENTS.md`, `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md`, and `.omo/plans/plan-37-settling-arc.md` are all `2026-08-19 23:17:08 +0200`. Last commit touching those paths: `0f91ebf11448cbc6d75c4153eea9ebf5cece886f` (`2026-08-19 21:19:28 +0200`, `chore(plans): sync confirmed plan-37 Wave 1 checkpoints`). They did not change after the executor artifact (`2026-08-20 08:02:57 +0200`).

## Plan-37 checkbox census

Scan: column-zero top-level markdown checkboxes only (`^ - [x] ` / `^ - [ ] `) in `.omo/plans/plan-37-settling-arc.md`. Zero indented/non-column-zero checkbox lines exist in that file.

- total 27
- closed 17
- open 10

Closed titles:

```text
1. Commission plan 37 across the four repo surfaces
2. I-0 tracer: adopt `carrier.markdown-parser` bounded-parity beside existing registrars
3. J preflight: recipe 9 ×8 and the evidence-packet template
4. K measurement definition (frozen) + read-only census scripts
5. I-1 validators: adopt the remaining 16 sites across 9 validation families
6. I-2 Gherkin: the shape-stressing tranche, alone
7. I-5a tail: pack-markdown (2 sites)
8. I-5b tail: consumers (5 sites)
9. I-5c tail: sdp-import (1 site)
10. J-model: evidence packets + prepared diffs for the four model Specs
11. J-extraction: evidence packets + prepared diffs for the two extraction Specs
W1-B. Apply all Wave 1 anchor-site pin flips
12. I-3 projections: adopt-or-refuse 11 sites across 5 families
13. I-4 extraction: adopt-or-refuse 9 sites across 5 families
14. J-consumers: evidence packet + prepared diff for projections-model
15. J-carrier: evidence packet + prepared diff for markdown-authoring
W2-B. Apply all Wave 2 anchor-site pin flips
```

Exact open titles (with line numbers):

```text
215:- [ ] 16. Apply ratified readiness statements (post-checkpoint)
223:- [ ] 17. K gather + verdict: run the frozen measurement over this arc's sessions
231:- [ ] 18. Close record: I ledger + J table + K verdict + re-derived measurements
239:- [ ] 19. Independent review in the plan-32 mold + closures
247:- [ ] 20. Final gate: check ×2, statuses, AGENTS
258:- [ ] F1. Plan compliance audit
259:- [ ] F2. Code quality review
260:- [ ] F3. Real manual QA
261:- [ ] F4. Scope fidelity
262:- [ ] F5. Open reviewer-ready pull request for plan 37
```

Closure todos 16-20 and final-verification F1-F5 are open. Todo 1 of the requested plan therefore cannot be checked, and Wave 1 writers must not start.

## Self-hosting gate (fresh)

Command: `node check-self-hosting-gates.mjs .`

- exit code: `0`
- stderr: empty (`0` bytes)
- stdout: `4695` bytes of JSON
- `surfaces.currentPlan`: `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md`
- `currentRecord.status`: `EXECUTING`

The gate reads live files (`readFileSync` on the highest primary-numbered `plans/*.md` status header and `AGENTS.md`). It accepts `DRAFTED|EXECUTING|RUN|EXECUTED` as a readable current-record state and only fails when those surfaces disagree. Exit 0 therefore means the two status sources agree on `EXECUTING`, not that plan 37 is closed.

Fresh stdout JSON is byte-for-byte equal to the JSON block quoted by the executor.

## Worktree overlap (fresh)

Scoped:

```text
git status --short --untracked-files=all -- .agents/skills/sdp-agent-surface/SKILL.md .agents/skills/sdp-authoring/SKILL.md README.md
```

Output: empty. `git diff` and `git diff --cached` for those three paths are also empty.

Full short status:

```text
 M .omo/boulder.json
?? .omo/drafts/sdp-skills-gen1-parity.md
?? .omo/evidence/task-1-sdp-skills-gen1-parity.md
?? .omo/plans/sdp-skills-gen1-parity.md
```

No live plan-37 edit overlaps the three files this plan will change. The overlap leg of Todo 1 passes and does not release the conjunctive gate.

## Adversarial classes

- `stale_state`: probed. Fresh reads of both status headers, a fresh column-zero checkbox scan, and two fresh gate invocations still show `EXECUTING` with 10 open plan-37 boxes. Status-source mtimes predate the executor artifact; they were not rewritten underneath it.
- `dirty_worktree`: probed. Scoped porcelain for the three future edit files is empty. Unrelated dirty paths (`.omo/boulder.json`, requested-plan drafts, executor evidence) do not overlap those files. `.omo/boulder.json` still lists `plan-37-settling-arc` as `active`, which corroborates non-closure and is not an overlap hit.
- `misleading_success_output`: probed. Exit 0 and empty stderr coexist with `currentRecord.status: "EXECUTING"` and 10 open checkboxes. Exit 0 is not closure evidence and must not release Todo 1.
- `malformed_input`: not applicable; this audit has no user payload to parse.
- `prompt_injection`: not applicable; only repository records and the named Node command were used.
- `cancel_resume`: not applicable; the audit did not pause, cancel, or resume.
- `hung_or_long_commands`: not applicable; both gate runs completed with exit 0.
- `flaky_tests`: not applicable; Todo 1 is a read-only status gate and runs no tests.
- `repeated_interruptions`: not applicable; no command was interrupted or retried.
- Generated/cached artifacts: not applicable to the closure decision. `generated/` holds `graph.json`, `registrars.json`, and `contracts/` with no plan-37 status text. The gate does not read those files for `currentRecord.status`. `dist/` is unrelated. No generated artifact was treated as a status source.

## Comparison to executor artifact

Agreement (material):

- both required sources say `EXECUTING`, not `EXECUTED`
- checkbox census 27/17/10 with the same 10 open titles
- gate exit 0, empty stderr, 4695-byte stdout, `currentRecord.status` `EXECUTING`
- scoped overlap on the three future edit files is empty
- BLOCKED, with writers forbidden until closure

Discrepancy (immaterial): the executor's full `git status --short` snapshot listed three paths and omitted `?? .omo/evidence/task-1-sdp-skills-gen1-parity.md`, which is the executor artifact itself and appears in the later verifier snapshot. That does not change overlap or closure.

No discrepancy falsifies BLOCKED.

## Verdict

`confirmed`

The BLOCKED claim is correct. Plan 37 is `EXECUTING` in both required sources. Execution todos 16-20 and final verifiers F1-F5 are open. Todo 1 of `sdp-skills-gen1-parity` must remain unchecked. No writer may start.

## Cleanup receipt

- Created: `.omo/evidence/task-1-sdp-skills-gen1-parity-verification.md` only.
- Transient `/tmp/task1-verify-gate-stdout.json` and `/tmp/task1-verify-gate-stderr.txt` were written during capture and deleted before this file was finished.
- No product, guidance, plan-37, `AGENTS.md`, test, runtime, spec, package, or requested-plan file was edited.
- No staging, commit, push, or destructive Git command was performed.
- No check-self-hosting-gates process remains. No other leftover process or resource remains.
