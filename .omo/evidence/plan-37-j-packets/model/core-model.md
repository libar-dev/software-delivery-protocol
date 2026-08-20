# Plan 37 Brief J evidence packet

## 1. Identity and carrier

- [x] **Spec id:** `spec:model.core-model`
- [x] **Carrier path:** `specs/model/core-model.sdp.md`
- [x] **Title:** The Protocol models delivery with one enrichable Spec
- [x] **Kind:** `model`
- [x] **Altitude:** `feature`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:** The required invocation (with the recipe-9 body from `docs/agent-surface/recipes.md`, §9, and this Spec id substituted) is:

```sh
pnpm --silent sdp:q 'const id = "spec:model.core-model"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const rungs = ["idea", "scoped", "defined", "ready"]; const reached = context.derivedReadiness ?? "none"; const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached); return { id, found: true, statedReadiness: context.statedReadiness, floorReached: reached, nextRung: rungs[reachedIndex + 1] ?? null, currentFloorFailures: context.floorFailures.map((failure) => ({ clauseId: failure.clauseId, description: failure.description })), firstUnmetClause: context.floorFailures[0]?.clauseId ?? null, promotionRequiresHumanStatement: true };' --json
```

- [x] **Recipe 9 raw output:**

```json
{
  "id": "spec:model.core-model",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

- [x] **Floor reached:** `ready` (derived structural floor only; this does not confer the authored rung).
- [x] **Next rung:** `null` (the derived floor is already `ready`; promotion still requires the human statement).
- [x] **Current floor failures:** `[]`.
- [x] **First unmet clause:** `null`.
- [x] **Human-statement marker:** `promotionRequiresHumanStatement: true`.

## 3. Section inventory and graph context

- [x] **Recipe 3 command/body:** The required invocation (recipe-3 body from `docs/agent-surface/recipes.md`, §3, and this Spec id substituted) is:

```sh
pnpm --silent sdp:q 'const id = "spec:model.core-model"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const relation = (end) => ({ type: end.type, other: end.otherId, claim: end.claim, resolved: end.resolved }); return { id: context.id, title: context.title, kind: context.specKind, altitude: context.altitude, statedReadiness: context.statedReadiness, floorReached: context.derivedReadiness ?? "none", unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId), sections: Object.keys(context.sections ?? {}), relationsOut: context.relationsOut.map(relation), relationsIn: context.relationsIn.map(relation), implementations: context.implementations.map((binding) => ({ codeId: binding.codeId, claim: binding.claim, file: binding.file ?? null, line: binding.line ?? null })), verifiers: context.verifiers.map((binding) => ({ verifierId: binding.verifierId, via: binding.via, claim: binding.claim, enabled: binding.enabled, file: binding.file ?? null })), verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail", findings: context.findings.map((finding) => ({ validatorId: finding.validatorId, severity: finding.severity, message: finding.message })) };' --json
```

- [x] **Recipe 3 raw output:**

```json
{
  "id": "spec:model.core-model",
  "title": "The Protocol models delivery with one enrichable Spec",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": ["intent", "model"],
  "relationsOut": [
    {"type": "decidedBy", "other": "spec:decisions.one-primitive", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:protocol.self-hosting", "claim": "declared", "resolved": true}
  ],
  "relationsIn": [
    {"type": "dependsOn", "other": "spec:observation.runtime-overlay", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:decisions.example-realization-posture", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:decisions.one-primitive", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.anchors", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.enrichment-lifecycle", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.pack-aggregate", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.relations", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.spec-sections", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.stable-ids", "claim": "declared", "resolved": true}
  ],
  "implementations": [
    {"codeId": "component:protocol.model", "claim": "anchored", "file": "src/model/anchors.ts", "line": 71},
    {"codeId": "impl:protocol.spec-descriptors", "claim": "anchored", "file": "src/model/descriptors.ts", "line": 38},
    {"codeId": "impl:protocol.spec-primitive", "claim": "anchored", "file": "src/model/spec.ts", "line": 20}
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
```

- [x] **Section inventory:** `["intent", "model"]`.
- [x] **Relations out:**
  - `{ type: "decidedBy", other: "spec:decisions.one-primitive", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:protocol.self-hosting", claim: "declared", resolved: true }`
- [x] **Relations in:**
  - `{ type: "dependsOn", other: "spec:observation.runtime-overlay", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.example-realization-posture", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.one-primitive", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.anchors", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.enrichment-lifecycle", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.pack-aggregate", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.relations", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.spec-sections", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.stable-ids", claim: "declared", resolved: true }`
- [x] **Implementations/bindings:**
  - `{ codeId: "component:protocol.model", claim: "anchored", file: "src/model/anchors.ts", line: 71 }`
  - `{ codeId: "impl:protocol.spec-descriptors", claim: "anchored", file: "src/model/descriptors.ts", line: 38 }`
  - `{ codeId: "impl:protocol.spec-primitive", claim: "anchored", file: "src/model/spec.ts", line: 20 }`
- [x] **Verifiers:** `[]`.
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail` (a resolving verifier exists; the graph does not record pass/fail).
- [x] **Findings:** `[]`.

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] The authored model gives a human a complete core vocabulary: one enrichable Spec, its envelope, kind, one-kind rule, altitude, readiness, delivery fact, and direct realization. The direct realization is backed by three anchored implementation bindings. The relevant sections are `intent` and `model`; the outgoing `decidedBy` and `refines` relations plus the inbound refining model/decision relations place it as the parent hub.
- [x] Relevant sections, relations, and bindings: `intent`, `model`; outgoing `decidedBy spec:decisions.one-primitive` and `refines spec:protocol.self-hosting`; inbound `refines` from the model children and decisions listed above; the three implementation bindings listed above.
- [x] **Carrier quotes:**
  - `specs/model/core-model.sdp.md:16` — `- **Spec** — The one authored truth-primitive, enriched in place without changing artifact type.`
  - `specs/model/core-model.sdp.md:17` — `- **envelope** — The stable outer shape of id, title, kind, altitude, readiness, and relations; sections carry extension detail.`
  - `specs/model/core-model.sdp.md:21-23` — `- **readiness** — The author-stated design-maturity position \`idea\`, \`scoped\`, \`defined\`, or \`ready\`, checked against a structural floor.` / `- **delivery fact** — A derived realization signal such as implemented or has-verifier; it is never authored readiness.` / `- **direct realization** — \`implemented\` follows a resolving implementation binding and never propagates through refinement; examples normally provide verification evidence rather than implementation work.`

### Settle-first evidence

- [x] The related enrichment lifecycle remains explicitly unresolved on the policy governing post-implementation detail. A human may therefore keep this parent model at `defined` until that sibling question is answered and the relationship is reviewed. This is the only explicit settle-first reason found for this model group; it is not inferred from `floorReached`.
- [x] **Exact carrier quote:** `specs/model/enrichment-lifecycle.sdp.md:14-15` — `### Open questions` / `- [blocking] After implementation, which design-time detail stays in the Spec and which detail may be removed while preserving one durable home for each explanation?`
- [x] Reopen promotion when the owner resolves that blocking question (or records why core-model can be ratified independently) and then makes the human readiness statement.

## 5. Prepared disposition (owner decides; leave alternatives visible)

- [ ] **Ready:** If the owner chooses ready, apply only this unapplied one-rung carrier diff:

```diff
--- a/specs/model/core-model.sdp.md
+++ b/specs/model/core-model.sdp.md
@@
-readiness: defined
+readiness: ready
```

  Matching unapplied oracle descriptor update:

```diff
--- a/test/self-hosting-oracle/model.ts
+++ b/test/self-hosting-oracle/model.ts
@@
     id: "spec:model.core-model",
@@
-    readiness: "defined",
+    readiness: "ready",
```

- [x] **Defined:** Proposed because the related carrier has the quoted blocking OQ above; keep `readiness: defined` unchanged. Reopen on resolution and owner ratification. This is a proposed disposition only, not a promotion or demotion.

- **Owner/rater:** Pending owner checkpoint.
- **Owner decision:** Pending; both Ready and Defined readings remain visible.
- **Decision date:** Pending owner checkpoint.
- **Ratification/evidence reference:** Pending; this packet is the evidence reference for the checkpoint.

## 6. Owner ratification

- **Selected disposition:** `DEFINED`
- **Owner decision:** `DEFINED`
- **Decision date:** 2026-08-20
- **Ratification reference:** `.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md`, owner statement `Ratify proposed set`.
- **Blocking reason:** Blocking enrichment-lifecycle question remains open.
