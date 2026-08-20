# Plan 37 Brief J evidence packet: `spec:extraction.claim-taxonomy`

## 1. Identity and carrier

- [x] **Spec id:** `spec:extraction.claim-taxonomy`
- [x] **Carrier path:** `specs/extraction/claim-taxonomy.sdp.md`
- [x] **Title:** Graph claims retain their epistemic source
- [x] **Kind:** `model`
- [x] **Altitude:** `feature`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:** The exact catalog body from `docs/agent-surface/recipes.md` §9, with its parameter substituted, was `corepack pnpm --silent sdp:q '<body>' --json` (canonical form: `pnpm --silent sdp:q '<body>' --json`). The direct `pnpm` shim was unavailable; the already-verified task-3 Recipe 9 output is explicitly reused below.

```js
const id = "spec:extraction.claim-taxonomy";
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
  "id": "spec:extraction.claim-taxonomy",
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
const id = "spec:extraction.claim-taxonomy";
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
  "id": "spec:extraction.claim-taxonomy",
  "title": "Graph claims retain their epistemic source",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": ["intent", "model"],
  "relationsOut": [{"type": "refines", "other": "spec:extraction.derive-graph", "claim": "declared", "resolved": true}],
  "relationsIn": [],
  "implementations": [
    {"codeId": "component:protocol.graph", "claim": "anchored", "file": "src/graph/schema.ts", "line": 22},
    {"codeId": "impl:protocol.graph-claims", "claim": "anchored", "file": "src/graph/schema.ts", "line": 28}
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
```

- [x] **Section inventory:** `["intent", "model"]`
- [x] **Relations out:** `{ type: "refines", other: "spec:extraction.derive-graph", claim: "declared", resolved: true }`
- [x] **Relations in:** `[]`
- [x] **Implementations/bindings:**
  - `{ codeId: "component:protocol.graph", claim: "anchored", file: "src/graph/schema.ts", line: 22 }`
  - `{ codeId: "impl:protocol.graph-claims", claim: "anchored", file: "src/graph/schema.ts", line: 28 }`
- [x] **Verifiers:** `[]`
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail`
- [x] **Findings:** `[]`

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] The authored model is complete enough for a human `ready` statement: it defines the five-term claims glossary, including the authoritative distinctions between authored claims, bindings, inferred structure, inherited claims, and delivery facts. Its `relationsIn: []` leaf status supports a bounded foundational glossary reading: no inbound Spec claims to reconcile or child refinement is shown. The relevant section is `model`; the outbound `refines` relation resolves to `spec:extraction.derive-graph`; the graph and graph-claims implementation bindings are present.
- [x] Carrier quotes:
  - `specs/extraction/claim-taxonomy.sdp.md:15`: `- **declared** — Human intent explicitly authored in a Spec or Pack; it is authoritative intent.`
  - `specs/extraction/claim-taxonomy.sdp.md:16`: `- **anchored** — A human binding from a code, test, or oracle location to one Spec ID; it is authoritative binding and carries no intent.`
  - `specs/extraction/claim-taxonomy.sdp.md:17`: `- **inferred** — Machine-derived structural information; it is advisory and never authoritative.`
  - `specs/extraction/claim-taxonomy.sdp.md:18`: `- **claim inheritance** — An edge computed from an authored source retains that source's declared claim; derivation is a mechanism, not a fourth claim.`
  - `specs/extraction/claim-taxonomy.sdp.md:19`: `- **delivery fact** — A realization signal computed from resolving edges, never an authored claim or edge.`

### Settle-first evidence

- [x] `none found` in this carrier and the supplied plan findings. This packet does not invent a blocking question; disposition remains for owner review.
- [x] The same leaf fact is weaker as settle-first evidence: `relationsIn: []` supplies no inbound refiner or downstream worked-example/consumer obligation in the graph, so it does not independently demonstrate usage breadth. That is a limitation to keep visible for owner review, not a carrier-stated blocking question; no settle-first carrier or plan line is quoted because none was found.

## 5. Prepared disposition (owner decides; leave alternatives visible)

- [x] **Ready candidate:** proposed one-rung carrier diff from `readiness: defined` to `readiness: ready`; do not apply.

```diff
--- a/specs/extraction/claim-taxonomy.sdp.md
+++ b/specs/extraction/claim-taxonomy.sdp.md
@@
-readiness: defined
+readiness: ready
```

Matching oracle descriptor row patch, also unapplied:

```diff
--- a/test/self-hosting-oracle/extraction.ts
+++ b/test/self-hosting-oracle/extraction.ts
@@
   {
     id: "spec:extraction.claim-taxonomy",
     specKind: "model",
     altitude: "feature",
-    readiness: "defined",
+    readiness: "ready",
     file: "specs/extraction/claim-taxonomy.sdp.md",
```

- [ ] **Defined:** no blocking reason found for this candidate; owner may instead retain `defined` deliberately.
- **Owner/rater:** pending human owner/rater
- **Owner decision:** pending; this is a prepared candidate, not a ratification
- **Decision date:** pending
- **Ratification/evidence reference:** pending owner ratification; this packet is the evidence reference

## 6. Owner ratification

- **Selected disposition:** `READY`
- **Owner decision:** `READY`
- **Decision date:** 2026-08-20
- **Ratification reference:** `.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md`, owner statement `Ratify proposed set`.
- **Reason:** Complete bounded claims glossary; no blocker found.

## Adversarial QA

- **misleading_success_output:** complete raw Recipe 9 and Recipe 3 JSON is retained above; summary fields were not used alone.
- **stale_state:** Recipe 2 membership and per-Spec contexts were freshly derived in the referenced task-3 run.
- Other classes: N/A for this read; no input parsing, prompt execution, cancellation, or timing behavior was exercised.
