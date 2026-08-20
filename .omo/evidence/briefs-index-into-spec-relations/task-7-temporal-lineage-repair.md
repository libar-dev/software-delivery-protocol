# Task 7: temporal lineage repair

## Scope

Changed exactly one context string in each of:

- `specs/decisions/shipped-projections-frozen.sdp.md`
- `test/self-hosting-oracle/decisions.ts`

Added this evidence file. No refusal, readiness, decision-section shape, relations, counts, T4 content, plans, AGENTS.md, tests, or check logic changed.

## Baseline / failing-first proof

Command:

```text
npm run check:self-hosting-gates
```

Exact findings:

```text
check-self-hosting-gates — disagreeing surfaces:

check-temporal.mjs — exit 1: a non-plan durable string carries a banned temporal token
check:temporal — banned temporal tokens found:

specs/decisions/shipped-projections-frozen.sdp.md:15:- context: The do-not-reopen register carried forward from plans/34 into plans/36 (the shipped-projections row) refused re-specifying the four shipped projections, but that refusal lived only as plan prose the graph could not check.
test/self-hosting-oracle/decisions.ts:918:          "The do-not-reopen register carried forward from plans/34 into plans/36 (the shipped-projections row) refused re-specifying the four shipped projections, but that refusal lived only as plan prose the graph could not check.",
```

## Repair

Both surfaces now say:

```text
The shipped-projections row in the 36 register has lineage to the 34 projection-settling record: it refused re-specifying the four shipped projections, but that refusal lived only as plan prose the graph could not check.
```

The banned temporal token and progression wording are gone while the lineage and refusal meaning remain.

## Checks

- `npm run check:self-hosting-gates` — PASS; temporal exit 0 and JSON gate surface emitted.
- `npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` — PASS; 0 errors, 5 pre-existing honesty warnings.
- `npx vitest run test/self-hosting-graph.test.ts` — PASS; 1 file, 26 tests.
- Exact carrier/oracle string comparison — PASS.
- Target temporal-token scan — PASS; no `plans/<number>` or old progression phrase in either target.

## Manual QA

Fresh extraction-backed `pnpm --silent sdp:q` for `spec:decisions.shipped-projections-frozen` returned:

```json
{
  "kind": "decision",
  "statedReadiness": "ready",
  "derivedReadiness": "ready",
  "relationCount": 5,
  "lineageMeaningPreserved": true
}
```

The complete decision section remained present, and the same five resolved relations remained:

```text
refines -> spec:consumers.projections-model
decidedBy -> spec:consumers.census-page
decidedBy -> spec:consumers.design-review
decidedBy -> spec:consumers.gherkin-view
decidedBy -> spec:consumers.mermaid-view
```

## Adversarial probes

- `stale_state=fresh`: live `sdp q` re-derived the graph from current carriers.
- `dirty_worktree`: this task's changes are the two exact carrier/oracle lines plus this evidence file; unrelated pre-existing workspace changes were preserved and not staged.
- `misleading_success_output`: inspected the failing-first gate findings, post-repair gate JSON, and manual QA JSON fields.
- `generated/cached`: extraction-backed graph test passed against the live corpus.

Not applicable: malformed input, injection, cancel/resume, timing/flakiness, and repeated interruption; this is a bounded prose/oracle synchronization with no new parser, input boundary, asynchronous behavior, or resumable operation.

## Cleanup and landing

Cleanup: none. No processes or resources remain running.

No staging or commit performed. `landing_pending: true`; repair is awaiting T7's authorized evidence commit after independent verification.
