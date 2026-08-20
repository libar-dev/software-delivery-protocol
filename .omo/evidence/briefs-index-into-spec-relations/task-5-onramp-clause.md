# Task 5 evidence: on-ramp arc-scale handoff clause

## Scope

T2's GFP session-law rules cover graph-first re-measurement and thin-plan numbering/staleness. The existing on-ramp handoff rule did not name the arc's live register home. The conditional edit therefore applied:

- `specs/consumers/delivery-session-on-ramp.sdp.md`: one new behavior rule.
- `test/self-hosting-oracle/consumers.ts`: one matching string in the on-ramp oracle block only.

No other on-ramp rule, readiness, or relation changed.

## Baseline characterization and validation

Command:

```text
pnpm --silent sdp:q 'return g.specContext("spec:consumers.delivery-session-on-ramp")' --json
```

Exact output:

```json
{
  "id": "spec:consumers.delivery-session-on-ramp",
  "title": "Delivery sessions route work from current graph state",
  "specKind": "behavior",
  "kindDisplayLabel": "Use Case / Behavior",
  "altitude": "story",
  "statedReadiness": "ready",
  "derivedReadiness": "ready",
  "deliveryFacts": [
    "implemented",
    "has-verifier"
  ],
  "file": "specs/consumers/delivery-session-on-ramp.sdp.md",
  "packs": [
    "pack:self-hosting-v1"
  ],
  "sections": {
    "intent": {
      "outcome": "Let an agent enter capture, design, implementation, review, or close work from current graph evidence without inventing workflow state or gates."
    },
    "behavior": {
      "rules": [
        "Work shapes are advisory entries over the same current graph; they are neither phases nor a required sequence, and a session may enter or revisit any shape.",
        "Capture or refinement uses concept search, the lower ladder, and promotion preflight; design uses promotion preflight and readiness divergence.",
        "Implementation uses the build backlog and the target Spec context; review uses the Pack backbone and warn-level signals, or the target Spec context and warn-level signals when no Pack exists.",
        "Close uses the drift alarm and changed-file blast radius; optional slimming preserves durable law and one prose owner without claiming a universal distillation boundary.",
        "A handoff names targets, changed files, current readiness, findings or open questions, and commands or evidence locations to re-run; it never carries an inherited verification verdict.",
        "Every preflight informs human or agent judgment and never authorizes, blocks, scopes, or advances delivery work."
      ]
    }
  },
  "floorFailures": [],
  "relationsOut": [
    {
      "type": "refines",
      "claim": "declared",
      "otherId": "spec:consumers.authoring-on-ramp",
      "resolved": true,
      "otherNodeType": "Primitive",
      "otherTitle": "Authors move one Spec from intent to reviewed evidence"
    }
  ],
  "relationsIn": [
    {
      "type": "refines",
      "claim": "declared",
      "otherId": "spec:consumers.graph-first-planning",
      "resolved": true,
      "otherNodeType": "Primitive",
      "otherTitle": "Arc intent is planned from the graph, not a prose briefs index"
    }
  ],
  "implementations": [
    {
      "codeId": "impl:protocol.delivery-session-on-ramp",
      "claim": "anchored",
      "label": "asserts realization of the shipped advisory delivery-session skill document",
      "file": "test/skills.test.ts",
      "line": 33
    }
  ],
  "verifiers": [
    {
      "verifierId": "test:protocol.delivery-session-on-ramp",
      "via": "test-anchor",
      "claim": "anchored",
      "enabled": true,
      "label": "skill-asset checks verify advisory delivery-session routing",
      "file": "test/skills.test.ts",
      "line": 101
    }
  ],
  "findings": []
}
```

Command:

```text
pnpm --silent sdp:q 'const ids = ["spec:consumers.delivery-session-on-ramp", "spec:consumers.graph-first-planning"]; return ids.map((id) => { const c = g.specContext(id); return {id, statedReadiness: c?.statedReadiness ?? null, derivedReadiness: c?.derivedReadiness ?? null, behaviorRuleCount: c?.sections.behavior?.rules?.length ?? 0, behaviorRules: c?.sections.behavior?.rules ?? [], openQuestions: c?.sections.intent?.openQuestions ?? []}; });' --json
```

Baseline fields recorded from that output:

```json
[
  {
    "id": "spec:consumers.delivery-session-on-ramp",
    "statedReadiness": "ready",
    "derivedReadiness": "ready",
    "behaviorRuleCount": 6
  },
  {
    "id": "spec:consumers.graph-first-planning",
    "statedReadiness": "idea",
    "derivedReadiness": "scoped",
    "behaviorRuleCount": 11,
    "openQuestions": [
      {
        "question": "How does an arc boundary stay legible in the graph (a Pack, a relation cluster, a naming convention) without minting a workflow gate or an authored delivery fact? Evidence note: the briefs-index register's do-not-reopen rows land on existing decision-kind Specs and linked carriers, with a lawful non-decision staying in the plan record; that outcome is input to this question, not a ruling on it.",
        "blocking": true
      }
    ]
  }
]
```

Command:

```text
npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Exact baseline output:

```text
159 specs · 1 packs · 157 anchors → 317 nodes · 666 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

## Failing-first proof

Command:

```text
pnpm --silent sdp:q 'const c = g.specContext("spec:consumers.delivery-session-on-ramp"); const rules = c?.sections.behavior?.rules ?? []; const handoffRules = rules.filter((rule) => /handoff/i.test(rule)); const matching = handoffRules.filter((rule) => /arc/i.test(rule) && /live register home/i.test(rule)); return {desiredAssertion: "handoff names the arc-scale live register home", pass: matching.length > 0, handoffRules, matching};' --json
```

Exact output:

```json
{
  "desiredAssertion": "handoff names the arc-scale live register home",
  "pass": false,
  "handoffRules": [
    "A handoff names targets, changed files, current readiness, findings or open questions, and commands or evidence locations to re-run; it never carries an inherited verification verdict."
  ],
  "matching": []
}
```

The assertion failed before the edit because no handoff rule named the arc's live register home.

## Baseline affected oracle test

Command:

```text
npx vitest run test/self-hosting-consumers-oracle.test.ts
```

Exact output:

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  18:19:17
   Duration  1.18s (transform 529ms, setup 0ms, tests 5ms, environment 1.04s)
```

## Applied delta

Added exactly one behavior rule after the existing handoff rule:

```text
- rule: An arc-scale handoff names the arc's live register home so the next session can re-measure it rather than inherit register state from the handoff.
```

The same extracted string was added to the on-ramp block in `test/self-hosting-oracle/consumers.ts`. No other on-ramp carrier or oracle content changed.

## Post-edit validation

Command:

```text
npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Exact output:

```text
159 specs · 1 packs · 157 anchors → 317 nodes · 666 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — Spec "spec:carrier.markdown-authoring" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — Spec "spec:extraction.claim-taxonomy" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — Spec "spec:model.pack-aggregate" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/relations.sdp.md — [warning] honesty/gaps — Spec "spec:model.relations" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — Spec "spec:model.spec-sections" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

## Post-edit affected oracle test

Command:

```text
npx vitest run test/self-hosting-consumers-oracle.test.ts
```

Exact output:

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  18:19:57
   Duration  1.00s (transform 423ms, setup 0ms, tests 5ms, environment 847ms)
```

This oracle test compares the authored consumers carrier extraction with the live oracle block, so it proves the oracle equals the live carrier for the changed family.

## Manual QA

Command (fresh `sdp q` graph derivation):

```text
body=$(cat <<'EOF'
const c = g.specContext("spec:consumers.delivery-session-on-ramp");
const baseline = [
  "Work shapes are advisory entries over the same current graph; they are neither phases nor a required sequence, and a session may enter or revisit any shape.",
  "Capture or refinement uses concept search, the lower ladder, and promotion preflight; design uses promotion preflight and readiness divergence.",
  "Implementation uses the build backlog and the target Spec context; review uses the Pack backbone and warn-level signals, or the target Spec context and warn-level signals when no Pack exists.",
  "Close uses the drift alarm and changed-file blast radius; optional slimming preserves durable law and one prose owner without claiming a universal distillation boundary.",
  "A handoff names targets, changed files, current readiness, findings or open questions, and commands or evidence locations to re-run; it never carries an inherited verification verdict.",
  "Every preflight informs human or agent judgment and never authorizes, blocks, scopes, or advances delivery work.",
];
const added = "An arc-scale handoff names the arc's live register home so the next session can re-measure it rather than inherit register state from the handoff.";
const rules = c?.sections.behavior?.rules ?? [];
const withoutAdded = rules.filter((rule) => rule !== added);
const unchanged = baseline.every((rule, index) => withoutAdded[index] === rule) && withoutAdded.length === baseline.length;
const handoffHomeRules = rules.filter((rule) => /handoff/i.test(rule) && /arc's live register home/i.test(rule));
return {pass: c?.statedReadiness === "ready" && c?.derivedReadiness === "ready" && unchanged && handoffHomeRules.length === 1, statedReadiness: c?.statedReadiness ?? null, derivedReadiness: c?.derivedReadiness ?? null, ruleCount: rules.length, newRuleCount: handoffHomeRules.length, unchanged, handoffHomeRules};
EOF
)
pnpm --silent sdp:q "$body" --json
```

Exact output:

```json
{
  "pass": true,
  "statedReadiness": "ready",
  "derivedReadiness": "ready",
  "ruleCount": 7,
  "newRuleCount": 1,
  "unchanged": true,
  "handoffHomeRules": [
    "An arc-scale handoff names the arc's live register home so the next session can re-measure it rather than inherit register state from the handoff."
  ]
}
```

PASS: exactly one new handoff rule names the arc's live register home; readiness remains `ready`; all six prior rules remain unchanged.

## Adversarial probes

- `stale_state=fresh graph query`: every `sdp q` invocation derives the graph from the current carriers.
- `dirty_worktree=exclude/preserve AGENTS.md and plan/draft`: pre-existing `AGENTS.md`, `.omo/boulder.json`, `.omo/start-work/ledger.jsonl`, `.omo/drafts/`, `.omo/plans/`, and the concurrent `specs/decisions/shipped-projections-frozen.sdp.md` remain untouched and unstaged.
- `generated_or_cached_artifacts=oracle equals live carrier`: the affected consumers oracle test passed against freshly extracted carrier content; validate reported unchanged graph counts.
- `misleading_success_output=assert exact rule delta and readiness`: the manual QA query asserted `newRuleCount: 1`, `unchanged: true`, and both readiness values.

LSP diagnostics were attempted for both changed files but the local LSP daemon was unreachable. Scoped validation and the affected oracle test passed.

## Not applicable

- malformed input: no malformed-input behavior changed.
- injection: no injection surface is involved.
- cancel/resume: no resumable operation is involved.
- timing/flaky: no time or polling behavior is involved.
- repeated interruption: no interrupted operation is involved.

## Cleanup

None. No processes or resources were left running.
