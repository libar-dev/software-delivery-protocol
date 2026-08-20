# Brief J packet: `spec:consumers.projections-model`

> Evidence only. This packet does not state a readiness decision. Both readings remain owner-pending.

## 1. Identity and carrier

- [x] **Spec id:** `spec:consumers.projections-model`
- [x] **Carrier path:** `specs/consumers/projections-model.sdp.md`
- [x] **Title:** `Projections fan out from one graph without becoming truth stores`
- [x] **Kind:** `model`
- [x] **Altitude:** `feature`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:** The raw output below is **verbatim reuse from task 3** (`.omo/evidence/task-3-plan-37-settling-arc.md`), not a recipe-2 finder body. The catalog body is reproduced exactly from `docs/agent-surface/recipes.md` section 9 with only the id substituted:

  ```js
  const id = "spec:consumers.projections-model";
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

  Full recorded invocation (task-3 equivalent executable form; the body is the catalog body above):

  ```sh
  corepack pnpm --silent sdp:q 'const id = "spec:consumers.projections-model";
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
  };' --json
  ```

  Task 3 used `corepack pnpm` because the direct `pnpm` shim was unavailable; no fresh query is claimed here.

- [x] **Recipe 9 raw output:**

  ```json
  {
    "id": "spec:consumers.projections-model",
    "found": true,
    "statedReadiness": "defined",
    "floorReached": "ready",
    "nextRung": null,
    "currentFloorFailures": [],
    "firstUnmetClause": null,
    "promotionRequiresHumanStatement": true
  }
  ```

- [x] **Floor reached:** `ready` (derived floor only).
- [x] **Next rung:** `null` (the recipe's derived ladder has no rung above `ready`).
- [x] **Current floor failures:** `[]`.
- [x] **First unmet clause:** `null`.
- [x] **Human-statement marker:** `promotionRequiresHumanStatement: true`.

The floor result does not confer `ready`; the catalog itself says the floor is information and promotion remains a human statement.

## 3. Section inventory and graph context

- [x] **Recipe 3 command/body:** The raw output below is **verbatim reuse from task 3**. The catalog body is reproduced exactly from `docs/agent-surface/recipes.md` section 3 with only the id substituted:

  ```js
  const id = "spec:consumers.projections-model";
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

  Full recorded invocation (task-3 equivalent executable form; the body is the catalog body above):

  ```sh
  corepack pnpm --silent sdp:q 'const id = "spec:consumers.projections-model";
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
  };' --json
  ```

- [x] **Recipe 3 raw output:**

  ```json
  {
    "id": "spec:consumers.projections-model",
    "title": "Projections fan out from one graph without becoming truth stores",
    "kind": "model",
    "altitude": "feature",
    "statedReadiness": "defined",
    "floorReached": "ready",
    "unmetFloorClauses": [],
    "sections": [
      "intent",
      "model"
    ],
    "relationsOut": [
      {
        "type": "decidedBy",
        "other": "spec:decisions.mcp-deferred",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:protocol.self-hosting",
        "claim": "declared",
        "resolved": true
      }
    ],
    "relationsIn": [
      {
        "type": "refines",
        "other": "spec:consumers.agent-surface",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:consumers.census-page",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:consumers.design-review",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:consumers.edit-model",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:consumers.gherkin-view",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:consumers.impact-graph",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:consumers.mermaid-view",
        "claim": "declared",
        "resolved": true
      },
      {
        "type": "refines",
        "other": "spec:decisions.mcp-deferred",
        "claim": "declared",
        "resolved": true
      }
    ],
    "implementations": [
      {
        "codeId": "component:protocol.projections",
        "claim": "anchored",
        "file": "src/projections/design-review.ts",
        "line": 27
      },
      {
        "codeId": "impl:protocol.projections-model",
        "claim": "anchored",
        "file": "src/projections/design-review.ts",
        "line": 36
      }
    ],
    "verifiers": [],
    "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
    "findings": []
  }
  ```

- [x] **Section inventory:** `["intent", "model"]`.
- [x] **Relations out:**

  ```json
  [
    { "type": "decidedBy", "other": "spec:decisions.mcp-deferred", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:protocol.self-hosting", "claim": "declared", "resolved": true }
  ]
  ```

- [x] **Relations in:** seven consumer children plus the decision refiner:

  ```json
  [
    { "type": "refines", "other": "spec:consumers.agent-surface", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:consumers.census-page", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:consumers.design-review", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:consumers.edit-model", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:consumers.gherkin-view", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:consumers.impact-graph", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:consumers.mermaid-view", "claim": "declared", "resolved": true },
    { "type": "refines", "other": "spec:decisions.mcp-deferred", "claim": "declared", "resolved": true }
  ]
  ```

- [x] **Implementations/bindings:**

  ```json
  [
    { "codeId": "component:protocol.projections", "claim": "anchored", "file": "src/projections/design-review.ts", "line": 27 },
    { "codeId": "impl:protocol.projections-model", "claim": "anchored", "file": "src/projections/design-review.ts", "line": 36 }
  ]
  ```

- [x] **Verifiers:** `[]`.
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail` (retained verbatim from recipe 3; the empty list means this Spec has no verifier binding in this output).
- [x] **Findings:** `[]`.

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] **Evidence for a possible human `ready` statement:** The carrier has exactly two authored sections and an explicit eleven-term model glossary. The terms are: `baseline`, `curated graph`, `curation`, `diagnostic publication posture`, `discipline`, `measured curation`, `impact graph`, `phase / iteration / milestone`, `projection`, `reader`, and `release`. The current graph also has two anchored implementation bindings. These are evidence that the model is stated and connected to the projections seam; they are not a readiness decision.
- [x] **Relevant sections, relations, and bindings:** `intent` and `model`; outgoing `refines` and `decidedBy`; seven consumer-child incoming `refines` relations; `component:protocol.projections` and `impl:protocol.projections-model` bindings.
- [x] **Carrier quotes:**

  - `specs/consumers/projections-model.sdp.md:13`: `- outcome: Give agents and humans consumer-specific views while preserving the repository as the only canonical source.`
  - `specs/consumers/projections-model.sdp.md:16`: `- **projection** — A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.`
  - `specs/consumers/projections-model.sdp.md:17`: `- **diagnostic publication posture** — After extraction succeeds, a projection publishes its honestly labelled graph view even when validation reports errors, and returns the validation exit code so findings remain both visible and nonzero.`
  - `specs/consumers/projections-model.sdp.md:18`: `- **curated graph** — The authored architectural read model of declared intent and anchored bindings, valued for editorial sparsity.`
  - `specs/consumers/projections-model.sdp.md:20`: `- **reader** — The thin typed front door that decodes graph joins and taxonomy once, returns composable data, and persists nothing.`
  - `specs/consumers/projections-model.sdp.md:21`: `- **curation** — The deliberate difference between the sparse curated graph and the code-structure surface; it is not drift.`
  - `specs/consumers/projections-model.sdp.md:23`: `- **discipline** — A lens or projection that filters or groups Specs by kind or section; it is not a phase to pass through.`
  - `specs/consumers/projections-model.sdp.md:24`: `- **release** — A tagged set surfaced as a git-tag projection.`
  - `specs/consumers/projections-model.sdp.md:25`: `- **baseline** — A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.`
  - `specs/consumers/projections-model.sdp.md:26`: `- **phase / iteration / milestone** — Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.`

### Settle-first evidence

- [x] **Blocking evidence for remaining at `defined`:** The carrier contains roadmap/process vocabulary and measured/impact-graph claims, but the packet has no direct verifier and the current record does not show a landed projection for every named surface. The strongest concrete blocker is the unlanded impact-graph substrate and the measured-curation claim; the sole outgoing decision edge is explicitly the deferred MCP ruling. This is a reason to keep `defined` available for owner consideration, not a pre-decision.
- [x] **Carrier/history quotes:**

  - `specs/consumers/projections-model.sdp.md:19`: `- **impact graph** — A separately derived code-structure surface for exhaustive usage and blast-radius questions, valued for exhaustiveness and never promoted into architecture.`
  - `specs/consumers/projections-model.sdp.md:22`: `- **measured curation** — In a measured comparison, the curated graph selected from single-digit to about one quarter of the mechanical impact-graph surface.`
  - `specs/consumers/projections-model.sdp.md:26`: `- **phase / iteration / milestone** — Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.`
  - `specs/consumers/projections-model.sdp.md:8`: `  decidedBy: spec:decisions.mcp-deferred`
  - `specs/decisions/mcp-deferred.sdp.md:15-17`: `- context: The graph already supports typed agent and human projections without an MCP transport.` / `- decision: MCP integration is deferred until a concrete caller establishes its boundary and contract.` / `- rationale: Adding an MCP surface without a caller invents verbs and persistence choices outside the projection model.`
  - `.omo/evidence/task-14-plan-35-agent-surface-arc.md:9`: `This is an evidence-only disposition. No projection was implemented or matured. \`spec:consumers.projections-model\` was not edited. No decision Spec was minted. The shipped four roots were not re-specified.`
  - `.omo/evidence/task-14-plan-35-agent-surface-arc.md:107`: `Deviation from defer-all is therefore not justified. \`spec:consumers.projections-model\` stays at \`defined\` and untouched. This arc's own work did not make a maturity bump true.`
  - `plans/22-self-hosting-phase-5.md:764`: `The conclusion is unchanged for the reason that matters — \`has-verifier\` is direct and never transitive, so a child's point confers nothing upward.`
  - `plans/22-self-hosting-phase-5.md:764`: `Its own evidence posture was re-judged against the S4 worlds as the charter asked, and **did not change**: it is a \`model\` Spec whose ten terms are vocabulary, two of which cannot be verified even in principle at this corpus state — *impact graph* names a substrate that does not exist ... and *measured curation* is recorded evidence from a prior comparison, not runtime law.`

- [x] **Plan-14 and plan-35 history audit:** `plans/14-carrier-competition.md` was inspected for the exact id `spec:consumers.projections-model`; it does **not** mention that Spec. Plan 14 therefore supplies no Spec-specific deferral quote and is not treated as one. The actual Spec-specific history is plan 35: its task-14 evidence records the model as staying `defined` and untouched, quoted above. Plan-14's absence is distinct from plan-35's real deferral evidence.
- [x] **What changed since the deferrals:** The current graph records seven consumer-child refiners and two anchored projection-model bindings, and the repository has the four shipped roots recorded in the prior evidence. Those are real changes from the early roadmap, but they do not change the direct-verifier fact: recipe 3 still returns `verifiers: []`. Since the plan-35 deferral, this evidence-only lane made no product mutation, and no new MCP ruling or new projection family is claimed. Past deferral is therefore evidence to weigh, not a verdict.
- [x] **Reopen evidence:** A human `ready` statement supported by owner review of the complete eleven-term model, including a direct verifier or an explicit accepted rationale for model-level vocabulary; or, for the settle-first reading, a concrete caller/ruling for MCP, a landed impact-graph/measurement artifact, or a named projection surface that turns the roadmap terms into current law.

## 5. Prepared disposition (owner decides; leave alternatives visible)

No disposition is selected here. The owner/rater must choose after reviewing both readings.

### Prepared `ready` alternative (UNAPPLIED)

- Target: `specs/consumers/projections-model.sdp.md:5`
- Old line: `readiness: defined`
- New line: `readiness: ready`

```diff
diff --git a/specs/consumers/projections-model.sdp.md b/specs/consumers/projections-model.sdp.md
--- a/specs/consumers/projections-model.sdp.md
+++ b/specs/consumers/projections-model.sdp.md
@@ -2,5 +2,5 @@
 id: spec:consumers.projections-model
 kind: model
 altitude: feature
-readiness: defined
+readiness: ready
 relations:
```

Matching oracle descriptor update, also **UNAPPLIED**:

```diff
diff --git a/test/self-hosting-oracle/consumers.ts b/test/self-hosting-oracle/consumers.ts
--- a/test/self-hosting-oracle/consumers.ts
+++ b/test/self-hosting-oracle/consumers.ts
@@ -109,6 +109,6 @@
   {
     id: "spec:consumers.projections-model",
     specKind: "model",
     altitude: "feature",
-    readiness: "defined",
+    readiness: "ready",
     file: "specs/consumers/projections-model.sdp.md",
```

### Prepared `defined` alternative (UNAPPLIED)

- Keep both current lines unchanged: carrier `readiness: defined`; oracle `readiness: "defined"`.
- Recorded reason: roadmap/process and measured vocabulary remains only partially evidenced; the impact graph is not landed, measured curation is prior comparison evidence rather than runtime law, no direct verifier is present, and the only decision edge names MCP integration that remains deferred until a concrete caller establishes its boundary and contract.
- Reopen on the evidence listed in §4: direct verification/owner acceptance of the model, or a concrete caller/ruling and landed artifacts that make the currently deferred terms current law.

- **Owner/rater:** pending
- **Owner decision:** pending; both `ready` and `defined` remain live readings
- **Decision date:** pending
- **Ratification/evidence reference:** pending owner checkpoint

## 6. Owner ratification

- **Selected disposition:** `DEFINED`
- **Owner decision:** `DEFINED`
- **Decision date:** 2026-08-20
- **Ratification reference:** `.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md`, owner statement `Ratify proposed set`.
- **Blocking reason:** Impact-graph and measurement work remain unlanded; plan 35 explicitly retained `defined`.

## Template field audit

| TEMPLATE.md field | Packet location | Status |
| --- | --- | --- |
| id, carrier path, title, kind, altitude | §1 | complete |
| stated readiness | §2 | complete |
| recipe 9 command/body and raw output | §2 | complete; task-3 reuse labeled |
| floor reached, next rung, floor failures, first unmet, human marker | §2 | complete |
| recipe 3 command/body and raw output | §3 | complete; task-3 reuse labeled |
| sections, relations in/out | §3 | complete |
| implementation bindings, verifiers, semantics, findings | §3 | complete |
| finished-design evidence with quoted carrier lines | §4 | complete |
| settle-first evidence with quoted carrier/history lines and reopen condition | §4 | complete |
| prepared disposition, owner/rater, decision/date/reference | §5 | complete; owner-pending, no pre-decision |
