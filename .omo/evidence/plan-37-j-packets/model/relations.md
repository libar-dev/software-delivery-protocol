# Plan 37 Brief J evidence packet

## 1. Identity and carrier

- [x] **Spec id:** `spec:model.relations`
- [x] **Carrier path:** `specs/model/relations.sdp.md`
- [x] **Title:** Specs declare typed directed relations
- [x] **Kind:** `model`
- [x] **Altitude:** `feature`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:**

```sh
pnpm --silent sdp:q 'const id = "spec:model.relations"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const rungs = ["idea", "scoped", "defined", "ready"]; const reached = context.derivedReadiness ?? "none"; const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached); return { id, found: true, statedReadiness: context.statedReadiness, floorReached: reached, nextRung: rungs[reachedIndex + 1] ?? null, currentFloorFailures: context.floorFailures.map((failure) => ({ clauseId: failure.clauseId, description: failure.description })), firstUnmetClause: context.floorFailures[0]?.clauseId ?? null, promotionRequiresHumanStatement: true };' --json
```

- [x] **Recipe 9 raw output:**

```json
{
  "id": "spec:model.relations",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

- [x] **Floor reached:** `ready` (derived structural floor only; it does not confer the rung).
- [x] **Next rung:** `null`.
- [x] **Current floor failures:** `[]`.
- [x] **First unmet clause:** `null`.
- [x] **Human-statement marker:** `promotionRequiresHumanStatement: true`.

## 3. Section inventory and graph context

- [x] **Recipe 3 command/body:**

```sh
pnpm --silent sdp:q 'const id = "spec:model.relations"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const relation = (end) => ({ type: end.type, other: end.otherId, claim: end.claim, resolved: end.resolved }); return { id: context.id, title: context.title, kind: context.specKind, altitude: context.altitude, statedReadiness: context.statedReadiness, floorReached: context.derivedReadiness ?? "none", unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId), sections: Object.keys(context.sections ?? {}), relationsOut: context.relationsOut.map(relation), relationsIn: context.relationsIn.map(relation), implementations: context.implementations.map((binding) => ({ codeId: binding.codeId, claim: binding.claim, file: binding.file ?? null, line: binding.line ?? null })), verifiers: context.verifiers.map((binding) => ({ verifierId: binding.verifierId, via: binding.via, claim: binding.claim, enabled: binding.enabled, file: binding.file ?? null })), verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail", findings: context.findings.map((finding) => ({ validatorId: finding.validatorId, severity: finding.severity, message: finding.message })) };' --json
```

- [x] **Recipe 3 raw output:**

```json
{
  "id": "spec:model.relations",
  "title": "Specs declare typed directed relations",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": ["intent", "model"],
  "relationsOut": [
    {"type": "refines", "other": "spec:model.core-model", "claim": "declared", "resolved": true}
  ],
  "relationsIn": [],
  "implementations": [
    {"codeId": "impl:protocol.spec-relations", "claim": "anchored", "file": "src/model/relations.ts", "line": 63}
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
```

- [x] **Section inventory:** `["intent", "model"]`.
- [x] **Relations out:** `{ type: "refines", other: "spec:model.core-model", claim: "declared", resolved: true }`.
- [x] **Relations in:** `[]`.
- [x] **Implementations/bindings:** `{ codeId: "impl:protocol.spec-relations", claim: "anchored", file: "src/model/relations.ts", line: 63 }`.
- [x] **Verifiers:** `[]`.
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail` (the graph does not record pass/fail).
- [x] **Findings:** `[]`.

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] The authored model defines the typed directed relation vocabulary: authored relation, refinement, dependency, constraint, decision, typed-dependency distinction, verification, and supersession. It supplies the relation semantics needed to keep intent links explicit and queryable, and it is anchored by the relation implementation.
- [x] Relevant sections, relations, and binding: `intent` and `model`; outbound `refines` to `spec:model.core-model`; no inbound graph rows; `impl:protocol.spec-relations` at `src/model/relations.ts:63`.
- [x] **Carrier quotes:**
  - `specs/model/relations.sdp.md:15-19` — `- **authored relation** — A declared, directed Spec-to-Spec edge that records human intent.` / `- **refines** — A child points to its more precise parent.` / `- **dependsOn** — A dependent Spec points to the Spec it needs.` / `- **constrainedBy** — A bounded Spec points to its rule, constraint, or policy Spec.` / `- **decidedBy** — A shaped Spec points to its Decision Record.`
  - `specs/model/relations.sdp.md:20-22` — `- **typed dependency distinction** — \`constrainedBy\` and \`decidedBy\` preserve separately queryable intents that a generic \`dependsOn\` edge would flatten.` / `- **verifies** — A verifier points to the Spec it verifies.` / `- **supersedes** — A current Decision Record points forward to the decision it replaces.`

### Settle-first evidence

- [x] `none found` in the current carrier or cited plan evidence. The recipe-3 absence of inbound rows and the fact that this carrier has no `decidedBy` relation are graph context, not an explicit unresolved question, and are not promoted into a blocking claim.
- [x] No settle-first carrier/plan quote is supplied because no explicit blocking line exists. The owner may still request review at the checkpoint.
- [x] Reopen a Defined reading only with a newly recorded, quote-backed design question, missing worked example, or requested review.

## 5. Prepared disposition (owner decides; leave alternatives visible)

- [x] **Ready:** Proposed one-rung carrier diff, unapplied:

```diff
--- a/specs/model/relations.sdp.md
+++ b/specs/model/relations.sdp.md
@@
-readiness: defined
+readiness: ready
```

  Matching unapplied oracle descriptor update:

```diff
--- a/test/self-hosting-oracle/model.ts
+++ b/test/self-hosting-oracle/model.ts
@@
     id: "spec:model.relations",
@@
-    readiness: "defined",
+    readiness: "ready",
```

- [ ] **Defined:** Alternative remains available if the owner identifies explicit blocking evidence at the checkpoint; none is present in this packet now.

- **Owner/rater:** Pending owner checkpoint.
- **Owner decision:** Pending; the proposed Ready reading is not a human promotion.
- **Decision date:** Pending owner checkpoint.
- **Ratification/evidence reference:** Pending; this packet is the evidence reference for the checkpoint.
