# Task 1 parity gate evidence

Date: 2026-08-20
Task: `sdp-skills-gen1-parity Todo 1`
Phase: Wave 0 read-only close gate

## Plan and status checks

Exact status line in `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md`:

```text
> **Status:** ✅ EXECUTED — the plan-36 arc is closed; briefs I–K delivered per plans/36; operational tracking in `.omo/plans/plan-37-settling-arc.md`
```

The operational plan `.omo/plans/plan-37-settling-arc.md` has these exact checked entries:

```text
- [x] 1. Commission plan 37 across the four repo surfaces
- [x] 2. I-0 tracer: adopt `carrier.markdown-parser` bounded-parity beside existing registrars
- [x] 3. J preflight: recipe 9 ×8 and the evidence-packet template
- [x] 4. K measurement definition (frozen) + read-only census scripts
- [x] 5. I-1 validators: adopt the remaining 16 sites across 9 validation families
- [x] 6. I-2 Gherkin: the shape-stressing tranche, alone
- [x] 7. I-5a tail: pack-markdown (2 sites)
- [x] 8. I-5b tail: consumers (5 sites)
- [x] 9. I-5c tail: sdp-import (1 site)
- [x] 10. J-model: evidence packets + prepared diffs for the four model Specs
- [x] 11. J-extraction: evidence packets + prepared diffs for the two extraction Specs
- [x] 12. I-3 projections: adopt-or-refuse 11 sites across 5 families
- [x] 13. I-4 extraction: adopt-or-refuse 9 sites across 5 families
- [x] 14. J-consumers: evidence packet + prepared diff for projections-model
- [x] 15. J-carrier: evidence packet + prepared diff for markdown-authoring
- [x] 16. Apply ratified readiness statements (post-checkpoint)
- [x] 17. K gather + verdict: run the frozen measurement over this arc's sessions
- [x] 18. Close record: I ledger + J table + K verdict + re-derived measurements
- [x] 19. Independent review in the plan-32 mold + closures
- [x] 20. Final gate: check ×2, statuses, AGENTS
- [x] F1. Plan compliance audit
- [x] F2. Code quality review
- [x] F3. Real manual QA
- [x] F4. Scope fidelity
- [x] F5. Open reviewer-ready pull request for plan 37
```

Exact `AGENTS.md` status line:

```text
> **plan 37 is EXECUTED** — the plan-36 arc is closed; briefs I–K are delivered per
```

## Self-hosting gate

Command:

```text
node check-self-hosting-gates.mjs .
```

Result: exit `0`; stderr was empty (`0` bytes).

Exact stdout:

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
    "status": "EXECUTED",
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
      "sha": "1d9f38c7a993f9cdc27cc4e178e211e33286758",
      "corrections": "24f9978: docs(concept): record the landed prose projection in 06"
    }
  },
  "phase2Ledger": "G1-G8 scaffold checked"
}
```

## Working-tree and overlap check

Exact status before this evidence file was written:

```text
 M .omo/boulder.json
 M .omo/evidence/ulw-20260820-081346.05dmOx.md
```

Exact full diff summary at verification time:

```text
 .omo/boulder.json                           |  7 +++----
 .omo/evidence/ulw-20260820-081346.05dmOx.md | 10 ++++++++++
 2 files changed, 13 insertions(+), 4 deletions(-)
```

Exact targeted diff summary for the three files this plan will change:

```text
--- target diff --name-status ---

--- target diff --stat ---
```

Conclusion: no live plan-37 edit overlaps `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-authoring/SKILL.md`, or `README.md`. Wave 1 was not started, and no plan-37 file was advanced by this task.
