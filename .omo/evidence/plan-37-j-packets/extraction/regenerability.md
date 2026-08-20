# Plan 37 Brief J evidence packet: `spec:extraction.regenerability`

## 1. Identity and carrier

- [x] **Spec id:** `spec:extraction.regenerability`
- [x] **Carrier path:** `specs/extraction/regenerability.sdp.md`
- [x] **Title:** Generated artifacts are disposable projections
- [x] **Kind:** `rule`
- [x] **Altitude:** `feature`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:** The exact catalog body from `docs/agent-surface/recipes.md` §9, with its parameter substituted, was `corepack pnpm --silent sdp:q '<body>' --json` (canonical form: `pnpm --silent sdp:q '<body>' --json`). The direct `pnpm` shim was unavailable; the already-verified task-3 Recipe 9 output is explicitly reused below.

```js
const id = "spec:extraction.regenerability";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const rungs = ["idea", "scoped", "defined", "ready"];
const reached = context.derivedReadiness ?? "none";
const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached);

return {
  id,
  found: true,
  statedReadiness: context.statedReadiness,
  floorReached: reached,
  nextRung: rungs[reachedIndex + 1] ?? null,
  currentFloorFailures: context.floorFailures.map((failure) => ({
    clauseId: failure.clauseId,
    description: failure.description,
  })),
  firstUnmetClause: context.floorFailures[0]?.clauseId ?? null,
  promotionRequiresHumanStatement: true,
};
```

- [x] **Recipe 9 raw output:**

```json
{
  "id": "spec:extraction.regenerability",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

- [x] **Floor reached:** `ready`
- [x] **Next rung:** `null`
- [x] **Current floor failures:** `[]`
- [x] **First unmet clause:** `null`
- [x] **Human-statement marker:** `promotionRequiresHumanStatement: true`

## 3. Section inventory and graph context

- [x] **Recipe 3 command/body:** The canonical invocation is `pnpm --silent sdp:q '<body>' --json`; the exact executed equivalent was `corepack pnpm --silent sdp:q '<recipe 3 body with id substituted>' --json`.

```js
const id = "spec:extraction.regenerability";
const context = g.specContext(id);

if (context === undefined) {
  return { id, found: false };
}

const relation = (end) => ({
  type: end.type,
  other: end.otherId,
  claim: end.claim,
  resolved: end.resolved,
});

return {
  id: context.id,
  title: context.title,
  kind: context.specKind,
  altitude: context.altitude,
  statedReadiness: context.statedReadiness,
  floorReached: context.derivedReadiness ?? "none",
  unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId),
  sections: Object.keys(context.sections ?? {}),
  relationsOut: context.relationsOut.map(relation),
  relationsIn: context.relationsIn.map(relation),
  implementations: context.implementations.map((binding) => ({
    codeId: binding.codeId,
    claim: binding.claim,
    file: binding.file ?? null,
    line: binding.line ?? null,
  })),
  verifiers: context.verifiers.map((binding) => ({
    verifierId: binding.verifierId,
    via: binding.via,
    claim: binding.claim,
    enabled: binding.enabled,
    file: binding.file ?? null,
  })),
  verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail",
  findings: context.findings.map((finding) => ({
    validatorId: finding.validatorId,
    severity: finding.severity,
    message: finding.message,
  })),
};
```

- [x] **Recipe 3 raw output:**

```json
{
  "id": "spec:extraction.regenerability",
  "title": "Generated artifacts are disposable projections",
  "kind": "rule",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": ["intent", "behavior"],
  "relationsOut": [{"type": "refines", "other": "spec:extraction.determinism", "claim": "declared", "resolved": true}],
  "relationsIn": [],
  "implementations": [
    {"codeId": "impl:protocol.regenerability", "claim": "anchored", "file": "src/cli/build-command.ts", "line": 220}
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
```

- [x] **Section inventory:** `["intent", "behavior"]`
- [x] **Relations out:** `{ type: "refines", other: "spec:extraction.determinism", claim: "declared", resolved: true }`
- [x] **Relations in:** `[]` (leaf for inbound relations)
- [x] **Implementations/bindings:** `{ codeId: "impl:protocol.regenerability", claim: "anchored", file: "src/cli/build-command.ts", line: 220 }`
- [x] **Verifiers:** `[]`
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail`
- [x] **Findings:** `[]`

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] The authored rule set establishes the disposable-rebuild invariant and the consumer boundary: generated bytes are reproducible from committed source, and consumers use the graph/source links rather than re-parsing or maintaining a parallel model. The `behavior` section, resolved `refines` relation to `spec:extraction.determinism`, and `impl:protocol.regenerability` binding support a finished-design reading for those rules.
- [x] Carrier quotes:
  - `specs/extraction/regenerability.sdp.md:15`: `- Generated artifacts are disposable: deleting them and rebuilding from the same committed repository produces the same bytes.`
  - `specs/extraction/regenerability.sdp.md:16`: `- Consumers read the graph or link to source locations recorded in it; they never re-parse source or keep a parallel model.`
  - `specs/extraction/regenerability.sdp.md:17`: `- The graph is a single JSON projection with in-memory query support; a graph database remains deferred until measured traversal pain establishes a real need.`

### Settle-first evidence

- [x] The approximate thresholds are explicitly conditional on measured evidence, but no measurement artifact for that evidence is present in the supplied task-3 outputs or referenced corpus. Therefore the honest settle-first candidate is the unresolved measurement basis, not a fabricated value. The blocking reason is recorded rather than filled with an invented artifact.
- [x] Carrier quotes:
  - `specs/extraction/regenerability.sdp.md:18`: `- Measured evidence from the self-hosting corpus keeps full rebuilds comfortable below roughly 50 Specs.`
  - `specs/extraction/regenerability.sdp.md:19`: `- Measured evidence defers a graph database until the graph reaches roughly 10k+ nodes or traversal pain establishes a real need.`
- [x] Reopen promotion when a reproducible self-hosting measurement artifact records the full-rebuild result below roughly 50 Specs and the graph-database deferral basis at roughly 10k+ nodes or measured traversal pain; this packet must not invent that artifact.

## 5. Prepared disposition (owner decides; leave alternatives visible)

- [ ] **Ready:** no carrier/oracle patch is proposed as the primary candidate because the threshold evidence is not measured in the available artifact set.
- [x] **Defined candidate:** recorded blocking reason: the two approximate threshold rules require measured self-hosting evidence, and that measurement artifact is absent. The disposable-rebuild and consumer-boundary rules remain finished-design evidence; this blocking reason applies specifically to the approximate thresholds. Promotion reopens on the measurement artifact quoted above.
- **Owner/rater:** pending human owner/rater
- **Owner decision:** pending; this is a blocking-reason candidate, not a ratification
- **Decision date:** pending
- **Ratification/evidence reference:** pending owner ratification; this packet is the evidence reference

## 6. Owner ratification

- **Selected disposition:** `DEFINED`
- **Owner decision:** `DEFINED`
- **Decision date:** 2026-08-20
- **Ratification reference:** `.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md`, owner statement `Ratify proposed set`.
- **Blocking reason:** Quoted thresholds lack their measurement artifact.

## Adversarial QA

- **misleading_success_output:** complete raw Recipe 9 and Recipe 3 JSON is retained above; summary fields were not used alone.
- **stale_state:** Recipe 2 membership and per-Spec contexts were freshly derived in the referenced task-3 run.
- Other classes: N/A for this read; no input parsing, prompt execution, cancellation, or timing behavior was exercised.
