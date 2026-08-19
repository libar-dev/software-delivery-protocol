# Plan 37 Brief J evidence packet

## 1. Identity and carrier

- [x] **Spec id:** `spec:model.pack-aggregate`
- [x] **Carrier path:** `specs/model/pack-aggregate.sdp.md`
- [x] **Title:** A Pack is a truth-free review aggregate
- [x] **Kind:** `model`
- [x] **Altitude:** `story`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:**

```sh
pnpm --silent sdp:q 'const id = "spec:model.pack-aggregate"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const rungs = ["idea", "scoped", "defined", "ready"]; const reached = context.derivedReadiness ?? "none"; const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached); return { id, found: true, statedReadiness: context.statedReadiness, floorReached: reached, nextRung: rungs[reachedIndex + 1] ?? null, currentFloorFailures: context.floorFailures.map((failure) => ({ clauseId: failure.clauseId, description: failure.description })), firstUnmetClause: context.floorFailures[0]?.clauseId ?? null, promotionRequiresHumanStatement: true };' --json
```

- [x] **Recipe 9 raw output:**

```json
{
  "id": "spec:model.pack-aggregate",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

- [x] **Floor reached:** `ready` (derived floor evidence only; not an authored readiness statement).
- [x] **Next rung:** `null`.
- [x] **Current floor failures:** `[]`.
- [x] **First unmet clause:** `null`.
- [x] **Human-statement marker:** `promotionRequiresHumanStatement: true`.

## 3. Section inventory and graph context

- [x] **Recipe 3 command/body:**

```sh
pnpm --silent sdp:q 'const id = "spec:model.pack-aggregate"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const relation = (end) => ({ type: end.type, other: end.otherId, claim: end.claim, resolved: end.resolved }); return { id: context.id, title: context.title, kind: context.specKind, altitude: context.altitude, statedReadiness: context.statedReadiness, floorReached: context.derivedReadiness ?? "none", unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId), sections: Object.keys(context.sections ?? {}), relationsOut: context.relationsOut.map(relation), relationsIn: context.relationsIn.map(relation), implementations: context.implementations.map((binding) => ({ codeId: binding.codeId, claim: binding.claim, file: binding.file ?? null, line: binding.line ?? null })), verifiers: context.verifiers.map((binding) => ({ verifierId: binding.verifierId, via: binding.via, claim: binding.claim, enabled: binding.enabled, file: binding.file ?? null })), verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail", findings: context.findings.map((finding) => ({ validatorId: finding.validatorId, severity: finding.severity, message: finding.message })) };' --json
```

- [x] **Recipe 3 raw output:**

```json
{
  "id": "spec:model.pack-aggregate",
  "title": "A Pack is a truth-free review aggregate",
  "kind": "model",
  "altitude": "story",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": ["intent", "model"],
  "relationsOut": [
    {"type": "decidedBy", "other": "spec:decisions.pack-reified", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.core-model", "claim": "declared", "resolved": true}
  ],
  "relationsIn": [
    {"type": "refines", "other": "spec:carrier.markdown-pack-authoring", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:decisions.pack-reified", "claim": "declared", "resolved": true}
  ],
  "implementations": [
    {"codeId": "impl:protocol.pack-aggregate", "claim": "anchored", "file": "src/model/pack.ts", "line": 22}
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
```

- [x] **Section inventory:** `["intent", "model"]`.
- [x] **Relations out:**
  - `{ type: "decidedBy", other: "spec:decisions.pack-reified", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.core-model", claim: "declared", resolved: true }`
- [x] **Relations in:**
  - `{ type: "refines", other: "spec:carrier.markdown-pack-authoring", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.pack-reified", claim: "declared", resolved: true }`
- [x] **Implementations/bindings:** `{ codeId: "impl:protocol.pack-aggregate", claim: "anchored", file: "src/model/pack.ts", line: 22 }`.
- [x] **Verifiers:** `[]`.
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail` (the graph does not record pass/fail).
- [x] **Findings:** `[]`.

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] The Pack model states one coherent, bounded purpose: grouping Specs for review without becoming a second truth-bearing artifact. Its five-term glossary covers the aggregate, framing, membership, model references, and the distinct refinement relation. The `intent` and `model` sections, the `decidedBy` relation, the refinement relation to core-model, and the anchored Pack implementation provide a complete design surface for owner review.
- [x] Relevant sections, relations, and binding: sections `intent` and `model`; `decidedBy spec:decisions.pack-reified`; `refines spec:model.core-model`; inbound refinements from the Markdown pack authoring carrier and the Pack decision; `impl:protocol.pack-aggregate` at `src/model/pack.ts:22`.
- [x] **Carrier quotes:**
  - `specs/model/pack-aggregate.sdp.md:16` — `- **Pack** — An authored aggregate that groups related Specs for ideation and review while stating no system truth of its own.`
  - `specs/model/pack-aggregate.sdp.md:18-20` — `- **membership** — A declared manifest reference that derives a belongsTo edge; a Spec may belong to many Packs.` / `- **modelRefs** — References from a Pack to standalone model Specs that carry shared vocabulary.` / `- **refinement** — A truth-bearing parent-child relation, distinct from the cross-cutting Pack aggregate.`

### Settle-first evidence

- [x] `none found` in the current Pack carrier or the cited plan evidence. No unresolved design question, missing worked example, or requested review is explicitly carried for this Spec. The story altitude and absence of verifier bindings are context, not blocking reasons, and are not being converted into one.
- [x] No settle-first carrier/plan quote is supplied because none exists; owner review remains open rather than being pre-decided.
- [x] Reopen either reading at the checkpoint if the owner identifies a specific missing Pack contract and records its carrier or plan evidence.

## 5. Prepared disposition (owner decides; leave alternatives visible)

- [x] **Ready:** Proposed one-rung carrier diff, unapplied:

```diff
--- a/specs/model/pack-aggregate.sdp.md
+++ b/specs/model/pack-aggregate.sdp.md
@@
-readiness: defined
+readiness: ready
```

  Matching unapplied oracle descriptor update:

```diff
--- a/test/self-hosting-oracle/model.ts
+++ b/test/self-hosting-oracle/model.ts
@@
     id: "spec:model.pack-aggregate",
@@
-    readiness: "defined",
+    readiness: "ready",
```

- [ ] **Defined:** Alternative remains available if the owner identifies a concrete missing contract at the checkpoint; no such reason is present in this packet's current evidence.

- **Owner/rater:** Pending owner checkpoint.
- **Owner decision:** Pending; the proposed Ready reading is not a human promotion.
- **Decision date:** Pending owner checkpoint.
- **Ratification/evidence reference:** Pending; this packet is the evidence reference for the checkpoint.
