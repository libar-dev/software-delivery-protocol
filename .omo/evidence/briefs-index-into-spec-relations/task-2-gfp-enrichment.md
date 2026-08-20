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

## F2 correction pass (2026-08-20, task st_01a02058)

Scope: `specs/consumers/graph-first-planning.sdp.md`,
`specs/consumers/delivery-session-on-ramp.sdp.md`, and their exact descriptor
blocks in `test/self-hosting-oracle/consumers.ts`. Nothing staged or committed.

### Failing-first proof

The F2 review findings themselves are the failing-first record: each finding
quotes the defective prose as authored before this pass (GFP's universal
decision-kind/`supersedes` do-not-reopen claim, the stale Q2 evidence note,
"decision gate", "cross-brief", bare "E2", the unnamed H triggers, and the
on-ramp's undefined "live register home"). Every quoted string was present in
the carriers at the start of this pass, confirmed by the pre-edit text in the
git diff.

### Corrections

1. Do-not-reopen rule now states the lawful four-way split: tradeoff refusals
   on `decision`-kind Specs reopen through a later `supersedes` decision that
   passes the ADR three-part test; existing behavior guarantees stay on their
   carrying Specs and reopen by revising that Spec; holds stay blocking open
   questions; lawful non-decisions stay in the plan record and mint no Spec.
2. Q2's evidence note now records that observed four-home split and explicitly
   disclaims ruling arc-boundary representation. Q2 remains the sole blocking
   question (Q1 still absent); readiness stays `idea`.
3. "decision gate" replaced with "decision record" in both senses.
4. "cross-brief" replaced with plain exclusive ownership across consumers.
5. E2 spelled out as `sdp new spec` and `sdp validate --watch`.
6. The three named plan 35 H re-entry triggers (Spec Studio, the reference
   projection, the structural-edge Mermaid) joined the existing re-entry rule;
   no new rule was added (GFP rule count stays 11).
7. The on-ramp's arc-scale handoff rule now names concrete identifiers:
   `spec:consumers.graph-first-planning` for placement law and the Spec ids
   carrying its register rows, including `spec:decisions.planning-truths-placement`
   and `spec:decisions.shipped-projections-frozen`.

Preserved: the ownership-split rule, all relations, both readiness values,
every unrelated rule, and the no-authorization wording. No workflow or
sequencing authority was added.

### Validation after corrections

`pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`

```
161 specs · 1 packs · 157 anchors → 319 nodes · 675 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

The 5 warnings are the same pre-existing intentional honesty/gaps warnings
recorded above; none are on the edited carriers.

Consumers oracle pin: `npx vitest run test/self-hosting-consumers-oracle.test.ts`
passed (1 file, 1 test). The descriptor literals match the carriers byte-for-byte.

Live graph assertions (fresh derivation, post-edit):

```json
{
  "graphFirstPlanning": {
    "openQuestionCount": 1,
    "q1Present": false,
    "q2Blocking": true,
    "ruleCount": 11,
    "readiness": "idea"
  },
  "deliverySessionOnRamp": {
    "ruleCount": 7,
    "readiness": "ready",
    "arcRuleNamesConcreteIds": true
  }
}
```

Rule counts unchanged on both Specs (11 and 7), confirming no rule was added
or dropped, only revised. Diff inspection confirmed the edits are confined to
the three product files; other dirty files in the worktree (AGENTS.md,
plans/38, the two decision Specs, decisions.ts, task-6 evidence) belong to
sibling tasks and were not touched by this pass.

### Manual QA (outsider read)

Final prose read as an outsider: the do-not-reopen rule unambiguously
distinguishes all four refusal-home cases (tradeoff refusal, existing
guarantee, hold, lawful non-decision), and the re-entry rule names Spec
Studio, the reference projection, and the structural-edge Mermaid verbatim.
Q2's note reads as input, not a ruling. No em dashes or AI-tell phrasing were
introduced.

### Adversarial probes

- stale_state: all post-edit assertions re-derived the graph per invocation;
  counts (161 specs) and question text came from live extraction.
- dirty_worktree: sibling-task edits in the same worktree were left untouched
  and unstaged; this pass staged nothing (verified with `git status --porcelain`
  and scoped `git diff`).
- generated_or_cached_artifacts: the oracle literals were synced against the
  extractor's own output and proven by the oracle test, not by a cached copy.
- misleading_success_output: PASS was decided from asserted JSON fields and
  the diff, never from exit codes alone.

Not applicable: malformed input, prompt injection, cancel/resume, flaky
timing, repeated interruption. All commands are bounded and local.

### Cleanup

No processes or resources left running. None recorded.
