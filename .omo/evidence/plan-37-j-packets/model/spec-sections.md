# Plan 37 Brief J evidence packet

## 1. Identity and carrier

- [x] **Spec id:** `spec:model.spec-sections`
- [x] **Carrier path:** `specs/model/spec-sections.sdp.md`
- [x] **Title:** Spec sections carry typed detail and direct verifier semantics
- [x] **Kind:** `model`
- [x] **Altitude:** `feature`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:**

```sh
pnpm --silent sdp:q 'const id = "spec:model.spec-sections"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const rungs = ["idea", "scoped", "defined", "ready"]; const reached = context.derivedReadiness ?? "none"; const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached); return { id, found: true, statedReadiness: context.statedReadiness, floorReached: reached, nextRung: rungs[reachedIndex + 1] ?? null, currentFloorFailures: context.floorFailures.map((failure) => ({ clauseId: failure.clauseId, description: failure.description })), firstUnmetClause: context.floorFailures[0]?.clauseId ?? null, promotionRequiresHumanStatement: true };' --json
```

- [x] **Recipe 9 raw output:**

```json
{
  "id": "spec:model.spec-sections",
  "found": true,
  "statedReadiness": "defined",
  "floorReached": "ready",
  "nextRung": null,
  "currentFloorFailures": [],
  "firstUnmetClause": null,
  "promotionRequiresHumanStatement": true
}
```

- [x] **Floor reached:** `ready` (derived floor evidence only; it does not confer the authored rung).
- [x] **Next rung:** `null`.
- [x] **Current floor failures:** `[]`.
- [x] **First unmet clause:** `null`.
- [x] **Human-statement marker:** `promotionRequiresHumanStatement: true`.

## 3. Section inventory and graph context

- [x] **Recipe 3 command/body:**

```sh
pnpm --silent sdp:q 'const id = "spec:model.spec-sections"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const relation = (end) => ({ type: end.type, other: end.otherId, claim: end.claim, resolved: end.resolved }); return { id: context.id, title: context.title, kind: context.specKind, altitude: context.altitude, statedReadiness: context.statedReadiness, floorReached: context.derivedReadiness ?? "none", unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId), sections: Object.keys(context.sections ?? {}), relationsOut: context.relationsOut.map(relation), relationsIn: context.relationsIn.map(relation), implementations: context.implementations.map((binding) => ({ codeId: binding.codeId, claim: binding.claim, file: binding.file ?? null, line: binding.line ?? null })), verifiers: context.verifiers.map((binding) => ({ verifierId: binding.verifierId, via: binding.via, claim: binding.claim, enabled: binding.enabled, file: binding.file ?? null })), verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail", findings: context.findings.map((finding) => ({ validatorId: finding.validatorId, severity: finding.severity, message: finding.message })) };' --json
```

- [x] **Recipe 3 raw output:**

```json
{
  "id": "spec:model.spec-sections",
  "title": "Spec sections carry typed detail and direct verifier semantics",
  "kind": "model",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": ["intent", "model"],
  "relationsOut": [
    {"type": "decidedBy", "other": "spec:decisions.content-only-sections", "claim": "declared", "resolved": true},
    {"type": "decidedBy", "other": "spec:decisions.point-per-example", "claim": "declared", "resolved": true},
    {"type": "decidedBy", "other": "spec:decisions.typing-law", "claim": "declared", "resolved": true},
    {"type": "decidedBy", "other": "spec:decisions.verification-posture-not-realization", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:model.core-model", "claim": "declared", "resolved": true}
  ],
  "relationsIn": [
    {"type": "refines", "other": "spec:decisions.content-only-sections", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:decisions.point-per-example", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:decisions.typing-law", "claim": "declared", "resolved": true},
    {"type": "refines", "other": "spec:decisions.verification-posture-not-realization", "claim": "declared", "resolved": true}
  ],
  "implementations": [
    {"codeId": "impl:protocol.spec-sections", "claim": "anchored", "file": "src/model/sections.ts", "line": 126},
    {"codeId": "impl:protocol.verifier-semantics", "claim": "anchored", "file": "src/validate/readiness-floor.ts", "line": 519}
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
```

- [x] **Section inventory:** `["intent", "model"]`.
- [x] **Relations out:**
  - `{ type: "decidedBy", other: "spec:decisions.content-only-sections", claim: "declared", resolved: true }`
  - `{ type: "decidedBy", other: "spec:decisions.point-per-example", claim: "declared", resolved: true }`
  - `{ type: "decidedBy", other: "spec:decisions.typing-law", claim: "declared", resolved: true }`
  - `{ type: "decidedBy", other: "spec:decisions.verification-posture-not-realization", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:model.core-model", claim: "declared", resolved: true }`
- [x] **Relations in:**
  - `{ type: "refines", other: "spec:decisions.content-only-sections", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.point-per-example", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.typing-law", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.verification-posture-not-realization", claim: "declared", resolved: true }`
- [x] **Implementations/bindings:**
  - `{ codeId: "impl:protocol.spec-sections", claim: "anchored", file: "src/model/sections.ts", line: 126 }`
  - `{ codeId: "impl:protocol.verifier-semantics", claim: "anchored", file: "src/validate/readiness-floor.ts", line: 519 }`
- [x] **Verifiers:** `[]`.
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail` (the graph does not record pass/fail).
- [x] **Findings:** `[]`.

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] This is the strongest of the four model packets: the carrier defines seven terms covering sections, typing, content-only promotion, verification target semantics, enabled verifier, and verification mode; four explicit decision relations record the governing choices. Two implementation bindings anchor both section handling and verifier semantics.
- [x] Relevant sections, relations, and bindings: `intent` and `model`; four outbound `decidedBy` relations plus `refines spec:model.core-model`; four inbound decision refinements; `impl:protocol.spec-sections` at `src/model/sections.ts:126` and `impl:protocol.verifier-semantics` at `src/validate/readiness-floor.ts:519`.
- [x] **Carrier quotes:**
  - `specs/model/spec-sections.sdp.md:20-23` — `- **section** — An optional detail slice of a Spec: intent, behavior, constraints, model, design, decision, verification, or ui.` / `- **typing law** — Every section read by a readiness-floor clause has a closed typed shape; unsettled design and ui surfaces remain open bags.` / `- **content-only section** — A section carries local content, while relations carry links to promoted standalone Specs.` / `- **promotion** — Moving shared or independently reviewed content into a standalone Spec of the matching kind, exclusively rather than alongside inline content.`
  - `specs/model/spec-sections.sdp.md:24-26` — `- **verifies** — A direct verifier-to-target relation whose enabled test binding can derive has-verifier only for that stated target.` / `- **enabled verifier** — An example or direct test with a linked, resolvable test anchor; runner execution and pass state remain outside the graph.` / `- **verification mode** — Authored intended posture such as executable; it never stands in for the derived enabled-verifier realization.`

### Settle-first evidence

- [x] `none found` in the current carrier or cited plan evidence. The phrase `unsettled design and ui surfaces remain open bags` describes an intentional typing law, not an unresolved question about this Spec. No missing worked example or requested review is explicitly carried, so no blocking reason is invented.
- [x] No settle-first carrier/plan quote is supplied because none exists; the owner may still choose Defined at the checkpoint with a newly recorded reason.
- [x] Reopen a Defined reading only with explicit, quote-backed blocking evidence from the owner or the carrier/plan record.

## 5. Prepared disposition (owner decides; leave alternatives visible)

- [x] **Ready:** Proposed one-rung carrier diff, unapplied:

```diff
--- a/specs/model/spec-sections.sdp.md
+++ b/specs/model/spec-sections.sdp.md
@@
-readiness: defined
+readiness: ready
```

  Matching unapplied oracle descriptor update:

```diff
--- a/test/self-hosting-oracle/model.ts
+++ b/test/self-hosting-oracle/model.ts
@@
     id: "spec:model.spec-sections",
@@
-    readiness: "defined",
+    readiness: "ready",
```

- [ ] **Defined:** Alternative remains available if the owner identifies explicit blocking evidence at the checkpoint; none is present in this packet now.

- **Owner/rater:** Pending owner checkpoint.
- **Owner decision:** Pending; the proposed Ready reading is not a human promotion.
- **Decision date:** Pending owner checkpoint.
- **Ratification/evidence reference:** Pending; this packet is the evidence reference for the checkpoint.
