# Plan 37 Brief J evidence packet: `spec:carrier.markdown-authoring`

## 1. Identity and carrier

- [x] **Spec id:** `spec:carrier.markdown-authoring`
- [x] **Carrier path:** `specs/carrier/markdown-authoring.sdp.md`
- [x] **Title:** Markdown authoring enters the one graph
- [x] **Kind:** `behavior`
- [x] **Altitude:** `feature`

## 2. Stated readiness and floor evidence

- [x] **Stated readiness:** `defined`
- [x] **Recipe 9 command/body:** The body below is the exact §9 catalog body from `docs/agent-surface/recipes.md`, with only the `id` value substituted. The JSON is explicitly reused from the successful task-3 run (`.omo/evidence/task-3-plan-37-settling-arc.md`); task 3 executed the equivalent command through `corepack pnpm` because the direct `pnpm` shim was unavailable.

```sh
corepack pnpm --silent sdp:q 'const id = "spec:carrier.markdown-authoring"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const rungs = ["idea", "scoped", "defined", "ready"]; const reached = context.derivedReadiness ?? "none"; const reachedIndex = reached === "none" ? -1 : rungs.indexOf(reached); return { id, found: true, statedReadiness: context.statedReadiness, floorReached: reached, nextRung: rungs[reachedIndex + 1] ?? null, currentFloorFailures: context.floorFailures.map((failure) => ({ clauseId: failure.clauseId, description: failure.description })), firstUnmetClause: context.floorFailures[0]?.clauseId ?? null, promotionRequiresHumanStatement: true };' --json
```

The catalog body, with its source formatting retained:

```js
const id = "spec:carrier.markdown-authoring";
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

- [x] **Recipe 9 raw output (task-3 reuse; produced by the body above):**

```json
{
  "id": "spec:carrier.markdown-authoring",
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

- [x] **Recipe 3 command/body:** The body below is the exact §3 catalog body from `docs/agent-surface/recipes.md`, with only the `id` value substituted. The JSON is explicitly reused from the successful task-3 run; it is the output of this body, not a summary or a different query.

```sh
corepack pnpm --silent sdp:q 'const id = "spec:carrier.markdown-authoring"; const context = g.specContext(id); if (context === undefined) { return { id, found: false }; } const relation = (end) => ({ type: end.type, other: end.otherId, claim: end.claim, resolved: end.resolved }); return { id: context.id, title: context.title, kind: context.specKind, altitude: context.altitude, statedReadiness: context.statedReadiness, floorReached: context.derivedReadiness ?? "none", unmetFloorClauses: context.floorFailures.map((failure) => failure.clauseId), sections: Object.keys(context.sections ?? {}), relationsOut: context.relationsOut.map(relation), relationsIn: context.relationsIn.map(relation), implementations: context.implementations.map((binding) => ({ codeId: binding.codeId, claim: binding.claim, file: binding.file ?? null, line: binding.line ?? null })), verifiers: context.verifiers.map((binding) => ({ verifierId: binding.verifierId, via: binding.via, claim: binding.claim, enabled: binding.enabled, file: binding.file ?? null })), verifierBindingMeans: "a resolving verifier exists; the graph never records pass or fail", findings: context.findings.map((finding) => ({ validatorId: finding.validatorId, severity: finding.severity, message: finding.message })) };' --json
```

The catalog body, with its source formatting retained:

```js
const id = "spec:carrier.markdown-authoring";
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

- [x] **Recipe 3 raw output (task-3 reuse; produced by the body above):**

```json
{
  "id": "spec:carrier.markdown-authoring",
  "title": "Markdown authoring enters the one graph",
  "kind": "behavior",
  "altitude": "feature",
  "statedReadiness": "defined",
  "floorReached": "ready",
  "unmetFloorClauses": [],
  "sections": [
    "intent",
    "behavior"
  ],
  "relationsOut": [
    {
      "type": "decidedBy",
      "other": "spec:decisions.carrier-ruling",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "decidedBy",
      "other": "spec:decisions.sdp-ts-extension",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "dependsOn",
      "other": "spec:carrier.markdown-parser",
      "claim": "declared",
      "resolved": true
    }
  ],
  "relationsIn": [
    {
      "type": "dependsOn",
      "other": "spec:protocol.self-hosting",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.envelope-contract",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.gherkin-authoring",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.markdown-parser",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.prose-ownership-rule",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.sdp-import",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:carrier.slot-notation",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.carrier-ruling",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:decisions.sdp-ts-extension",
      "claim": "declared",
      "resolved": true
    }
  ],
  "implementations": [
    {
      "codeId": "impl:protocol.markdown-authoring",
      "claim": "anchored",
      "file": "src/extract/markdown.ts",
      "line": 50
    }
  ],
  "verifiers": [],
  "verifierBindingMeans": "a resolving verifier exists; the graph never records pass or fail",
  "findings": []
}
```

- [x] **Section inventory:** `["intent", "behavior"]`.
- [x] **Relations out:**
  - `{ type: "decidedBy", other: "spec:decisions.carrier-ruling", claim: "declared", resolved: true }`
  - `{ type: "decidedBy", other: "spec:decisions.sdp-ts-extension", claim: "declared", resolved: true }`
  - `{ type: "dependsOn", other: "spec:carrier.markdown-parser", claim: "declared", resolved: true }`
- [x] **Relations in:**
  - `{ type: "dependsOn", other: "spec:protocol.self-hosting", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:carrier.envelope-contract", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:carrier.gherkin-authoring", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:carrier.markdown-parser", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:carrier.prose-ownership-rule", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:carrier.sdp-import", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:carrier.slot-notation", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.carrier-ruling", claim: "declared", resolved: true }`
  - `{ type: "refines", other: "spec:decisions.sdp-ts-extension", claim: "declared", resolved: true }`
- [x] **Implementations/bindings:** `{ codeId: "impl:protocol.markdown-authoring", claim: "anchored", file: "src/extract/markdown.ts", line: 50 }`.
- [x] **Verifiers:** `[]`.
- [x] **Verifier semantics:** `a resolving verifier exists; the graph never records pass or fail` (the graph does not record pass/fail).
- [x] **Findings:** `[]`.

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [x] **Law-lives-in-the-tree reading:** The parent states one complete invariant: Markdown and TypeScript use the same reification and graph-derivation path. That single behavior rule is the whole claim at this altitude; the broad carrier surface is carried by refining children. The exact parent quotes are `specs/carrier/markdown-authoring.sdp.md:15` — `- outcome: Author new Protocol Specs in Markdown without creating a second truth path.` — and `specs/carrier/markdown-authoring.sdp.md:18` — `- rule: Markdown and TypeScript carriers feed the same reification and graph-derivation path.` The anchored implementation is `impl:protocol.markdown-authoring` at `src/extract/markdown.ts:50`.
- [x] **Stub-parent reading:** The parent could instead be read as too thin to establish the practical Markdown authoring contract when compared with its refining Gherkin child. The child has many behavior rules; its exact line at `specs/carrier/gherkin-authoring.sdp.md:19` is:

```text
- rule: One `.sdp.gherkin` file carries exactly one behavior Spec as its Feature and zero or more example Specs as ordinary Scenarios, with one canonical carrier surface per Spec ID.
```

Its kind and refusal boundaries are stated at line 21, and its carrier/default boundary at line 30. The child also carries an example-space vocabulary at `specs/carrier/gherkin-authoring.sdp.md:34-51`, including the exact lines `Given the Gherkin fixture corpus {probe:string}`, `When the fixture corpus is extracted and validated`, `Then the graph contains exactly {specCount:number} Specs`, `Then the graph for {parityLeft:string} equals the graph for {parityRight:string}`, and `Then the contracts for {parityLeft:string} equal the contracts for {parityRight:string}`. On this reading, the parent has one invariant but does not enumerate Markdown syntax, examples, or parity cases.
- [x] **Bindings and decisions relevant to either reading:** Recipe 3 resolves the two outbound `decidedBy` links to `spec:decisions.carrier-ruling` and `spec:decisions.sdp-ts-extension`, the `dependsOn` link to `spec:carrier.markdown-parser`, and the implementation binding. The decision carrier quote is `specs/decisions/carrier-ruling.sdp.md:12`: `- outcome: Give every Spec kind one readable canonical authoring surface without losing a lawful escape hatch.`; its decision quote is `specs/decisions/carrier-ruling.sdp.md:15`: `- context: The carrier must express all Spec kinds without creating an unbounded tooling obligation or a dual-source truth path.` The TS-extension decision's context is `specs/decisions/sdp-ts-extension.sdp.md:15`: `- context: A carrier filename must distinguish authored Specs from test files and remain useful when files are colocated.`

### Settle-first evidence

- [x] **None found:** Neither the Markdown carrier nor the cited plan-37 evidence names an unresolved question, missing worked example, or requested review for this Spec. The stub-parent reading is a legitimate owner judgment aid, not an invented blocking fact. The child tree and the two decision bindings remain visible for the checkpoint rather than being padded into a verdict.
- [x] No settle-first carrier/plan quote is supplied because no explicit blocking line exists. Reopen a Defined reading only if the owner records a quote-backed missing Markdown contract/example or an unresolved carrier decision; this packet does not manufacture one from the rule count.

## 5. Prepared disposition (owner decides; leave alternatives visible)

- [x] **Ready candidate:** Proposed one-rung carrier diff, prepared but unapplied:

```diff
--- a/specs/carrier/markdown-authoring.sdp.md
+++ b/specs/carrier/markdown-authoring.sdp.md
@@
-readiness: defined
+readiness: ready
```

  Matching prepared but unapplied oracle descriptor update:

```diff
--- a/test/self-hosting-oracle/carrier.ts
+++ b/test/self-hosting-oracle/carrier.ts
@@
-    readiness: "defined",
+    readiness: "ready",
```

  The target is the real `spec:carrier.markdown-authoring` row at `test/self-hosting-oracle/carrier.ts:7-12`; no line was changed.

- [ ] **Defined alternative:** Owner may retain `defined` only if the checkpoint records explicit blocking evidence; none is present in this packet.

- **Owner/rater:** Pending owner checkpoint.
- **Owner decision:** Pending; the proposed Ready reading is not a human promotion.
- **Decision date:** Pending owner checkpoint.
- **Ratification/evidence reference:** Pending; this packet is the evidence reference for the checkpoint.

## Adversarial and scope notes

- **Raw-output honesty:** PASS — both complete JSON outputs are retained and explicitly labeled task-3 reuse; each is tied to the exact substituted catalog body above.
- **Both-ways audit:** PASS — stub-parent and law-lives-in-the-tree readings are both stated with carrier quotes and neither is selected as the owner decision.
- **Scope:** PASS — this packet is evidence only. No carrier, oracle, source, test, generated, recipe, plan, or helper file was edited; the prepared diffs are text blocks only.
- **Nondeterminism/tests:** N/A — no test code or asynchronous behavior was edited or exercised.
