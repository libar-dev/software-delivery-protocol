# Task 1 evidence

## Diff

```diff
@@ -17,7 +17,7 @@ current realization. A disagreement is **drift to resolve**, never permission to
 code behavior into intent.
 
 > **plan 37 is EXECUTING** — the plan-36 arc is executing; briefs I–K are delivered per
-> plans/36, with operational tracking in `.omo/plans/plan-37-settling-arc.md`.
+> plan 36, with operational tracking in `.omo/plans/plan-37-settling-arc.md`.
```

## Verification

### `node check-temporal.mjs`

```text
(no output)
exit 0
```

### `npx vitest run test/check-self-hosting-gates.test.ts`

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  18:39:02
   Duration  433ms (transform 27ms, setup 0ms, import 40ms, tests 262ms, environment 0ms)
```

### `node check-self-hosting-gates.mjs .`

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
      "sha": "1687889c56e154ce2dbe4fa3c6c6c425",
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
