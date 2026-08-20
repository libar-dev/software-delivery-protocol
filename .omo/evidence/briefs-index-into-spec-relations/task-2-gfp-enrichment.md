# Task 2 evidence: answer graph-first-planning's briefs-index placement question

Scope: `specs/consumers/graph-first-planning.sdp.md` and its GFP oracle block in
`test/self-hosting-oracle/consumers.ts`. Nothing else touched.

## Baseline (passing, before edits)

Recipe 9 (promotion preflight) on `spec:consumers.graph-first-planning`:

```json
{
  "id": "spec:consumers.graph-first-planning",
  "found": true,
  "statedReadiness": "idea",
  "floorReached": "scoped",
  "nextRung": "defined",
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

Open questions from the live graph node:

```json
{
  "statedReadiness": "idea",
  "openQuestionCount": 2,
  "questions": [
    { "head": "Which truths a prose briefs index carries today — dependency", "blocking": true },
    { "head": "How does an arc boundary stay legible in the graph (a Pack, ", "blocking": true }
  ]
}
```

Q1 present and blocking, Q2 present and blocking, readiness `idea`. This is the passing baseline.

## Failing-first proof (before edits)

Assertion "Q1 absent while Q2 remains blocking" against the same live query:

```json
{
  "desiredAssertion": "Q1 absent while Q2 remains blocking",
  "pass": false,
  "q1Present": true,
  "q2Present": true,
  "q2Blocking": true
}
```

The desired assertion fails before edits because Q1 is still present.

## Edits

Carrier: Q1 removed; its answer recorded as nine new behavior rules carrying the ruled
placement map (one rule per truth type, each naming its guardrail), including the two
session-law rules (re-measure-first / never inherit; thin plan file carries numbering and
staleness) and the E2 lawful non-decision classification. Q2 kept blocking, extended with one
evidence note line that records where the register landed without ruling Q2. The two
ownership-split rules are preserved verbatim. Readiness stays `idea`; relations stay the
single existing `refines`. Oracle GFP block synced to the extracted strings exactly.

## Validation after edits

`pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`

```
159 specs · 1 packs · 157 anchors → 317 nodes · 666 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
validate exit: 0
```

The 5 warnings are the pre-existing intentional honesty/gaps warnings on
spec:carrier.markdown-authoring, spec:extraction.claim-taxonomy, spec:model.pack-aggregate,
spec:model.relations, spec:model.spec-sections. None are on the edited carrier.

Recipe 9 after edits (unchanged posture):

```json
{
  "id": "spec:consumers.graph-first-planning",
  "found": true,
  "statedReadiness": "idea",
  "floorReached": "scoped",
  "nextRung": "defined",
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

## Manual QA channel (recipe 9 / live-query fields, not exit codes)

Post-edit assertion against the live graph:

```json
{
  "desiredAssertion": "Q1 absent while Q2 remains blocking",
  "pass": true,
  "q1Present": false,
  "q2Present": true,
  "q2Blocking": true,
  "readiness": "idea"
}
```

PASS: readiness `idea`, Q1 absent, Q2 present and blocking.

## Oracle pin

`npx vitest run test/self-hosting-consumers-oracle.test.ts`: 1 test file passed, 1 test
passed. The GFP block matches the carrier text byte-for-byte as extracted.

## Adversarial probes

- stale_state: all post-edit queries re-derive the graph per invocation; the assertion above
  ran after the edits against live extraction.
- dirty_worktree: the unrelated AGENTS.md unslop hunk and untracked `.omo/` draft/plan are
  left unstaged; commit staged only the two product files (verified with
  `git diff --cached --name-only` and an empty `git diff --cached -- AGENTS.md`).
- misleading_success_output: PASS was decided from asserted JSON fields (`pass`, `q1Present`,
  `q2Blocking`, `readiness`), not from exit codes.
- generated_or_cached_artifacts: the oracle pin was edited to match the extracted carrier
  strings (compared against the extractor's own output), and validate derived the live corpus
  (159 specs, 0 errors).

Not applicable: malformed input, prompt injection, cancel/resume, flaky timing, repeated
interruption. Validate is bounded and local.

## Cleanup

No processes or resources left running. None recorded.
