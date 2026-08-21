# F2 corpus-language remediation

Task `st_01a022ab` on `feature/architectural-patterns-views` at `aa54e86`.
Both confirmed corpus fixes applied as one lockstep unit. No engine behavior change.
Readiness and relations unchanged.

## Fixes

A. MD-34 grain-limit consequence no longer promises a deferred `architecture-enforcement validator family`.
The surrounding grain-limit ruling remains; the second limit now reads
`negative constraints remain declared intent, not machine-enforced graph findings`.
Canonical Spec, exact decision oracle, and supplied plan copy stay byte-aligned.

B. Stable id `spec:model.structural-patterns` and filename preserved.
`model.terms.pattern` removed. Positive architecture-layer `pattern` vocabulary rewritten to
`architectural significance`, `Specs carrying architectural significance`,
`relationships among those Specs`, and the already-defined `architecturally significant unit`.
`pattern` remains only as refused-term / `pattern:` namespace use-mention, ordinary English,
or the stable Spec id. CONTEXT.md rejected ledger now scopes that refusal (not a blanket English ban).

## Before / after occurrence audit (owned paths)

Classification: **positive** = architecture-layer term used as a referent;
**refused/namespace** = explicit use-mention of the refused term or `pattern:` ids;
**stable-id** = `spec:model.structural-patterns` / filename;
**ordinary** = unrelated English or work-plan/branch names.

### `specs/model/structural-patterns.sdp.md`

| | Before | After |
|---|---|---|
| title | positive: "Architecturally significant patterns dissolve…" | "Architectural significance dissolves into existing primitives" |
| outcome | positive: "Patterns and their relationships…" | "Specs carrying architectural significance, and relationships among those Specs…" |
| `model.terms.pattern` | positive (defined while calling itself unratified) | **absent** |
| id / filename | stable-id | stable-id only remaining hit |

### `specs/decisions/architectural-significance-rides-primitives.sdp.md`

| | Before | After |
|---|---|---|
| outcome | positive: "architecturally significant patterns and their relationships" | "Specs carrying architectural significance, and relationships among those Specs" |
| context | refused `"pattern"` + stable-id | unchanged (refused/namespace + stable-id) |
| decision First/Second | positive: "a pattern is…" / "relationships between patterns" | "Specs carrying architectural significance are…" / "relationships among those Specs" ; refused `"pattern"` kept |
| rationale | mixed: concept `"pattern"` (refused) + "CodeNode-grain pattern roles" (positive) | concept `"pattern"` kept; "CodeNode-grain roles for Specs carrying architectural significance" |
| grain-limit consequence | positive "pattern membership" + invented third family | "membership of Specs carrying architectural significance is Spec-grain…, and negative constraints remain declared intent, not machine-enforced graph findings" |
| alternative | refused "pattern layer" + `pattern:` ids | unchanged (refused/namespace) |

### `docs/concept/DECISIONS.md`

| | Before | After |
|---|---|---|
| MD-34 gloss | positive "Patterns are decision/model-kind Specs…" + refused "no pattern vocabulary is admitted" | "Specs carrying architectural significance are linked…" + refused "no pattern vocabulary is admitted" |

### `CONTEXT.md`

| | Before | After |
|---|---|---|
| step-contract row | ordinary "generated-union pattern" | unchanged |
| rejected ledger | no `pattern` row | scoped: `pattern` (as an architectural primitive, kind, or `pattern:` namespace — ordinary English remains; MD-34) |

### Exact oracles

`test/self-hosting-oracle/model.ts` and `test/self-hosting-oracle/decisions.ts` transcribed in lockstep.
Unrelated ordinary English in other decision rows (`applying the same pattern to Gherkin`,
`test-pattern identities`) left untouched.

### `.omo/plans/architectural-patterns-views.md`

Supplied Spec copy, MD-34 row, and todo-3 title/outcome/`model.terms` targets aligned with the new corpus.
Work-plan/branch names, historical completed-todo paths, and ordinary English
("frozen-reopen pattern", "mirroring 12-16 pattern") left in place.

Graph-wide `architecture-enforcement` / `validator family` / `architecture-enforcement validator family`:
before 1 / 1 / present on MD-34; after **0 / 0 / 0**.

## Graph results (re-queried after edit)

Both Specs, recipe-3 shape:

- `spec:model.structural-patterns`: title "Architectural significance dissolves into existing primitives";
  kind `model`; altitude `feature`; statedReadiness `defined`; floorReached `ready`;
  unmetFloorClauses `[]`; sections `intent`, `model`;
  termKeys `["architecturally significant unit"]`; **hasPatternTerm `false`**;
  relationsOut `decidedBy → spec:decisions.architectural-significance-rides-primitives` (declared, resolved)
  and `refines → spec:model.anchors` (declared, resolved); relationsIn `[]`; deliveryFacts `[]`; findings `[]`.
- `spec:decisions.architectural-significance-rides-primitives`: title unchanged;
  kind `decision`; altitude `feature`; statedReadiness `ready`; floorReached `ready`;
  unmetFloorClauses `[]`; sections `intent`, `decision`;
  relationsOut `dependsOn → binding-not-liveness`, `dependsOn → structural-anchor-semantics`,
  `refines → spec:model.anchors` (all declared, resolved);
  relationsIn `decidedBy` from `spec:model.structural-patterns` and `spec:protocol.structural-self-binding`;
  deliveryFacts `[]`; findings `[]`.

Readiness and relations match the pre-edit query.

`findByConcept("pattern")` remaining corpus hits:

- `spec:model.structural-patterns` matchedIn `["id"]` only (stable id)
- `spec:decisions.architectural-significance-rides-primitives` matchedIn `["sections.decision"]` (refused-term / namespace use-mention)
- `spec:decisions.sdp-gherkin-extension` and `spec:decisions.structural-anchor-semantics` (ordinary English, out of scope)

## Commands (each once)

1. `npx vitest run test/self-hosting-graph.test.ts test/self-hosting-model.test.ts test/readiness.test.ts`
   — 3 files, 49 passed.
2. `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
   — exit 0; 162 specs · 172 anchors · 335 nodes · 731 edges; 0 errors.
3. `npm run typecheck` — exit 0.
4. `npx prettier --check` on the seven owned corpus files — All matched files use Prettier code style.
5. `npm run lint` (`eslint .`) — exit 0.

Expected warnings (classified, not failures): five `honesty/gaps` warnings on ready Specs with no resolving verifier
(`spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`,
`spec:model.relations`, `spec:model.spec-sections`). Informative only. No `verifies-linkage` warning on this run.
Validate refreshed ignored `generated/` output; no tracked generated file was edited.

`git diff --stat` under `src/` is empty.

## Cleanup

- Wrote only this evidence file under `.omo/evidence/architectural-patterns-views/final-verification/`.
- Did not stage, commit, push, or stash.
- Left pre-existing dirty `.omo/boulder.json`, `.omo/start-work/ledger.jsonl`, and `test/recipes.test.ts` untouched.
- Did not edit recipe/test implementation files.

## DoneClaim

```json
{
  "task": "st_01a022ab",
  "plan": "architectural-patterns-views",
  "status": "DONE",
  "verdict": "APPROVE",
  "changed_files": [
    "CONTEXT.md",
    "specs/model/structural-patterns.sdp.md",
    "specs/decisions/architectural-significance-rides-primitives.sdp.md",
    "docs/concept/DECISIONS.md",
    "test/self-hosting-oracle/model.ts",
    "test/self-hosting-oracle/decisions.ts",
    ".omo/plans/architectural-patterns-views.md",
    ".omo/evidence/architectural-patterns-views/final-verification/f2-corpus-terms.md"
  ],
  "graph": {
    "model.terms.pattern": "absent",
    "statedReadiness": {
      "spec:model.structural-patterns": "defined",
      "spec:decisions.architectural-significance-rides-primitives": "ready"
    },
    "relations": "unchanged",
    "architecture-enforcement validator family": "absent"
  },
  "tests": "vitest self-hosting-graph + self-hosting-model + readiness 3 files 49 passed; sdp validate 0 errors 5 honesty/gaps warnings; typecheck exit 0; prettier --check owned files exit 0; eslint . exit 0",
  "cleanup": "evidence file only; no stage/commit/push/stash; boulder/ledger/recipes.test.ts left untouched",
  "risks": "none for this corpus-language unit"
}
```
