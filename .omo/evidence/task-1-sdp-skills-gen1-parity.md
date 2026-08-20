# Task 1 evidence: sdp-skills-gen1-parity

## Baseline

Fresh reads and the gate command characterize the unchanged dependency state before any Wave 1 edit. The required plan-37 status sources both report `EXECUTING`, not `EXECUTED`. The plan-37 execution and final-verification checkboxes are not all closed.

## Required status sources

Exact required status-line read:

```text
AGENTS.md:19:> **plan 37 is EXECUTING** — the plan-36 arc is executing; briefs I–K are delivered per
AGENTS.md:20:> plan 36, with operational tracking in `.omo/plans/plan-37-settling-arc.md`.
plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md:3:> **Status:** 🔄 EXECUTING — the plan-36 arc is executing; briefs I–K delivered per plans/36; operational tracking in `.omo/plans/plan-37-settling-arc.md`
```

The plan-37 primary record and the `AGENTS.md` current-plan block therefore fail the required `EXECUTED` status condition.

## Open-checkbox evidence

The checkbox scan found 27 plan-37 checkbox lines: 17 closed and 10 open. The 10 open lines are:

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

Execution todos 16-20 and final verification F1-F5 remain open.

## Self-hosting gate

Command:

```text
node check-self-hosting-gates.mjs .
```

Exit code: `0`.

Exact stdout (`4695` bytes):

```json
{
  "surfaces": {
    "plan": "plans/17-self-hosting-v1.md",
    "plan16": "plans/16-carrier-ruling.md",
    "agents": "AGENTS.md",
    "decisions": "docs/concept/DECISIONS.md",
    "glossary": "CONTEXT.md",
    "phase2Plan": "plans/18-self-hosting-phase-2.md",
    "currentPlan": "plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md",
    "package": "package.json"
  },
  "currentRecord": {
    "status": "EXECUTING",
    "gateLegs": [
      "check:temporal",
      "lint",
      "format:check",
      "build",
      "generate:self-hosting",
      "generate:example",
      "typecheck",
      "typecheck:examples",
      "test",
      "check:self-hosting-gates",
      "check:self-hosting",
      "check:example",
      "preflight"
    ]
  },
  "temporal": {
    "ran": false,
    "reason": "non-default rootDir"
  },
  "docket": {
    "total": 25,
    "nonPending": 25,
    "dispositions": [
      {
        "item": "Frontmatter envelope schema (17)",
        "state": "done"
      },
      {
        "item": "Editor-association gap (17)",
        "state": "deferred"
      },
      {
        "item": "Fence names (17)",
        "state": "done"
      },
      {
        "item": "Slot sigils (17)",
        "state": "done"
      },
      {
        "item": "Single-literal vocabulary form (17)",
        "state": "dropped"
      },
      {
        "item": "Table-sugar syntax (17)",
        "state": "dropped"
      },
      {
        "item": "Prose edge-text ownership rule (17)",
        "state": "done"
      },
      {
        "item": "Diagnostics register (17)",
        "state": "done"
      },
      {
        "item": "Carrier seam public API (18)",
        "state": "done"
      },
      {
        "item": "Product parser (18)",
        "state": "done"
      },
      {
        "item": "`sdp import` emitter (18)",
        "state": "deferred"
      },
      {
        "item": "checkout-v1 migration + canonical flip (18)",
        "state": "deferred"
      },
      {
        "item": "Self-hosting pack (19)",
        "state": "done"
      },
      {
        "item": "Decision-spec fold (19)",
        "state": "done"
      },
      {
        "item": "Doc-repair bill (19)",
        "state": "done"
      },
      {
        "item": "Extraction-root & exclusion policy (new — forced by self-hosting)",
        "state": "done"
      },
      {
        "item": "Graph schema-version policy for prose fields (new)",
        "state": "done"
      },
      {
        "item": "Carrier-ruling transition-clause amendment (new — forced by the interim story)",
        "state": "done"
      },
      {
        "item": "Public/package API proof (new — forced by grounded review)",
        "state": "done"
      },
      {
        "item": "Temporal-scan coverage (new — forced by grounded review)",
        "state": "done"
      },
      {
        "item": "Root generated-state isolation (new — forced by grounded review)",
        "state": "done"
      },
      {
        "item": "Clean-clone proof (new — forced by grounded review)",
        "state": "done"
      },
      {
        "item": "JTBD carrier repair (new — drift found by grounded review)",
        "state": "done"
      },
      {
        "item": "MD-15 wording repair (new — forced by the carrier ruling)",
        "state": "done"
      },
      {
        "item": "Four-gate review ledger (new — forced by the owner-gate design)",
        "state": "done"
      }
    ],
    "pending": []
  },
  "adrDispositions": {
    "the strict consumer-exclusion contract (MD-20)": "diary entry entered — three-part test passes",
    "the envelope-grammar ownership posture (MD-21)": "diary entry entered — three-part test passes"
  },
  "ledger": {
    "gate1": {
      "meaning": "schema freeze",
      "disposition": "accepted",
      "date": "2026-07-18",
      "sha": "aca79090529c2f6625ceafc78f33e16da81bfcb1",
      "corrections": "none"
    },
    "gate2": {
      "meaning": "corpus/readiness",
      "disposition": "accepted",
      "date": "2026-07-18",
      "sha": "cdb68fc1564c9167ebc0372ba8f8599a97df4393",
      "corrections": "none"
    },
    "gate3": {
      "meaning": "executable loop",
      "disposition": "accepted",
      "date": "2026-07-18",
      "sha": "1687885df7b1898c56e154ce2dbe4fa3c6c6c425",
      "corrections": "none"
    },
    "gate4": {
      "meaning": "whole-phase review and the phase-2 disposition",
      "disposition": "accepted",
      "date": "2026-07-18",
      "sha": "1d9f38c7a993f9cdc27cc4e178e211e33286758b",
      "corrections": "24f9978: docs(concept): record the landed prose projection in 06"
    }
  },
  "phase2Ledger": "G1-G8 scaffold checked"
}
```

Exact stderr (`0` bytes): empty

The process exit and empty stderr satisfy the command leg, but stdout identifies the current record as `EXECUTING`; it does not establish plan-37 closure.

## Worktree overlap

Exact baseline `git status --short --untracked-files=all`:

```text
 M .omo/boulder.json
?? .omo/drafts/sdp-skills-gen1-parity.md
?? .omo/plans/sdp-skills-gen1-parity.md
```

Exact status scoped to the three future edit files:

```text
```

Overlap verdict: PASS. No live plan-37 edit overlaps `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-authoring/SKILL.md`, or `README.md`.

## Adversarial classes

- `stale_state`: probed with fresh reads of both status sources, a fresh checkbox scan, and a fresh gate invocation; the result remains `EXECUTING` with open closure work.
- `dirty_worktree`: probed by exact scoped status; no overlap with the three future edit files.
- `misleading_success_output`: probed by comparing status words, checkbox counts, exit code, stdout, and stderr; exit 0 and empty stderr coexist with `EXECUTING` and 10 open checkboxes, so exit 0 alone is not closure evidence.
- `malformed_input`: not applicable; this is a fixed-tree status audit with no user payload to parse.
- `prompt_injection`: not applicable; only repository records and the named command were used as evidence.
- `cancel_resume`: not applicable; the audit did not pause, cancel, or resume work.
- `hung_or_long_commands`: not applicable; the single Node gate completed with exit 0.
- `flaky_tests`: not applicable; no tests are part of this read-only dependency gate.
- `repeated_interruptions`: not applicable; no command was interrupted or retried.
- Generated/cached artifacts: not applicable; the gate output revealed no generated or cached artifact dependency.

## Verdict

`BLOCKED`

Current blocker: plan 37 is still `EXECUTING` in both required status sources, with execution todos 16-20 and final-verification F1-F5 open. The self-hosting command and overlap leg pass, but the conjunctive closure gate does not.

## Cleanup receipt

- Changed by this task: `.omo/evidence/task-1-sdp-skills-gen1-parity.md` only.
- No product, guidance, plan-37, `AGENTS.md`, test, runtime, spec, or package file was edited.
- No staging, commit, push, or destructive Git command was performed.
- No in-repository temporary artifact was created.
