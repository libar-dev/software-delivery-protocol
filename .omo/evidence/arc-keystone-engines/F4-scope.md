# F4 scope fidelity — arc-keystone-engines

Auditor: omo senpi-task child st_01a00159
Date: 2026-08-14
Worktree (read-only): `/home/darkomijic/dev-libar/software-delivery-protocol-arc-keystone-engines`
HEAD: `269fe5162323699370456e7daf0fd1d70d8a4e0d`
Commit: `269fe51 merge: todo 9 gherkin carrier follow-through (verified)`
Branch: `arc/keystone-engines` (clean, ahead of origin/main by 8)
Merge-base vs `feature/universal-spec`: `4ccc2e9` (same as `main`)
Plan commits in range: 8 (`29b11c0` … `269fe51`)

Dist freshness (checked before `sdp:q`):
- `dist/cli/sdp.js` present, mtime 2026-08-14 19:31:37
- `src/cli/sdp.ts` mtime 2026-08-14 19:30:47 (dist newer)
- `git status` clean — no stale unbuilt CLI

`sdp:q` invocations below used `npm run --silent sdp:q -- '<body>'` from the worktree (script already excludes explorations / examples / import-parity fixtures).

================================================================================
VERDICT: APPROVE
Confidence: 0.94
================================================================================

The commissioned chunk of plan 29 (briefs A/B/C/D) is present and closed in the tree.
Brief E is absent from product code. The plans/31 status badge remains EXECUTING —
pending-close after user approval, not a defect.

## Per-brief matrix

| Brief | Outcome | Status |
| --- | --- | --- |
| A | Decision Spec + five answers + ADR three-part + follow-through (carrier amendments + Gherkin READ view) | PASS |
| B | Frozen `runnable-modules` interface + registrar codegen + valid-cart tracer + red/red/green mutation log + claim taxonomy unchanged | PASS |
| C | Census + Mermaid specs/projections + `--check-clean` + CLI posture on record | PASS |
| D | BR1: `component`/`uses` on `codeAnchor`; anchored `memberOf`/`uses`; schemaVersion 0.5.0; no delivery-fact / readiness-floor growth | PASS |
| E | Untouched in product code; `spec:consumers.impact-graph` still `idea` | PASS |
| Commissioning | Plan 30 EXECUTED; plan 29 names Plan 31; plans/31 exists EXECUTING + E re-entry trigger | PASS (pending-close) |
| Re-entry trigger | Census projection queryable; `memberOf`/`uses` in schema vocabulary and queryable as law | PASS |

Notes that do not fail the gate:
- Live self-hosting corpus authors zero `memberOf`/`uses` edges (honest empty). Vocabulary and fixture emission exist; F1 counted 3 edges on a fixture root.
- `generated/census/` and `generated/mermaid/` are not sitting in this worktree after `sdp view` (separate verbs). Queryability is via `sdp:q` + schema constants, which is the trigger the plan named.
- plans/31 flip to executed is deferred until user close approval.

--------------------------------------------------------------------------------
BRIEF A — carrier universality
--------------------------------------------------------------------------------

File: `specs/decisions/carrier-universality.sdp.md`
- exists; kind `decision`; stated readiness `ready`

Decision-kind floor (command from the F4 brief):

```
npm run --silent sdp:q -- 'return g.specs().filter(s=>s.id.includes("carrier-universality")).map(s=>[s.id,s.statedReadiness])'
```

Result: `[ [ 'spec:decisions.carrier-universality', 'ready' ] ]`

Floor content also cleared structurally:

```
npm run --silent sdp:q -- 'const c=g.specContext("spec:decisions.carrier-universality"); return {statedReadiness, derivedReadiness, decisionKeys, hasDecision}'
```

Result: `statedReadiness: ready`, `derivedReadiness: ready`, keys
`[context, decision, rationale, consequences, alternatives]`, `hasDecision: true`.

ADR three-part test is explicit in the rationale (hard to reverse · surprising
without context · real trade-off) at
`specs/decisions/carrier-universality.sdp.md` Decision.rationale.

Five ruling questions answered in `decision.decision`, in the required order:
1. Per-kind honesty: Gherkin canonical only for `behavior`/`example`; other six
   stay Markdown with per-kind lie-reasons.
2. Rich content: Feature/Scenario description prose only on existing MD-19
   owners; DocStrings/DataTables remain refused.
3. "Universal" = per-ID carriers + generated Gherkin-shaped READ projection;
   not one authored default; not a lossless codec.
4. Default does not flip; Markdown stays default; flip refused before honest
   round-trip.
5. Packs out; MD-25 remains Pack law.

Follow-through landed:
- `specs/carrier/gherkin-authoring.sdp.md` amended (decidedBy includes
  `spec:decisions.carrier-universality`; per-kind refusals; MD-19 bound;
  default-flip refusal; packs-out; universality = READ projection).
- `specs/consumers/gherkin-view.sdp.md` + `src/projections/gherkin-view.ts` +
  `src/cli/gherkin-command.ts` (`sdp gherkin`, `--check-clean`).
- MD-18 / MD-27 consequence pointers updated (2-line amends each); MD-28
  untouched (`specs/decisions/sdp-gherkin-extension.sdp.md` has empty plan-range
  diff).

BRIEF A: PASS

--------------------------------------------------------------------------------
BRIEF B — derived runnable modules
--------------------------------------------------------------------------------

Frozen interface: `specs/extraction/runnable-modules.sdp.md`
- id `spec:extraction.runnable-modules`; kind `behavior`; stated `defined`;
  derived `ready`; floorFailures `[]`.
- Answers (a)–(g): registrar, skeleton-text identity, three-way / 6-step
  comparator, `Partial<Conditions>`, `renderContractStep`, exhaustive mapped
  type, Scenario Outlines refused.

Codegen: `src/codegen/contracts.ts`
- `renderRunnableRegistrar` (~L807) emits generated sibling registrars.
- `generateContracts` returns a `registrars` map; emission at ~L1112.

Valid-cart tracer migrated:
`examples/checkout-v1/test/orders/create-order.valid-cart.test.ts`
- one `specTest({...})` (L13)
- one `registerValidCart({ createWorld, invoke, observe, expected, assertions })` (L58)
- grep `"a customer has a cart with {n} line items"` in the authored file → 0 hits

Mutation log:
`/home/darkomijic/dev-libar/software-delivery-protocol/.omo/evidence/arc-keystone-engines/task-8-mutation.log`
- (a) Spec `{total: 100}` → `{total: 101}`: vitest exit 1,
  `Spec Then parameters do not match the oracle payload` / `$.total: expected 101, actual 100`
- (b) oracle `expected()` +1: vitest exit 1,
  `$.total: expected 100, actual 101`
- (c) restore both: vitest exit 0, 1 passed

Claim taxonomy law byte-identical in the plan range:
- `git log $(merge-base)..HEAD -- src/graph/delivery-facts.ts` → empty
- `git diff $(merge-base)..HEAD -- src/graph/delivery-facts.ts` → empty
- `git diff $(merge-base)..HEAD -- specs/extraction/claim-taxonomy.sdp.md` → empty
- `src/graph/delivery-facts.ts` still derives `has-verifier` only from resolving
  anchored `verifies` (test `specTest`) or enabled declared example verifies.
- runnable-modules Spec restates: "The anchor remains the sole `has-verifier`
  source; generated execution confers no delivery fact".

BRIEF B: PASS

--------------------------------------------------------------------------------
BRIEF C — census + Mermaid
--------------------------------------------------------------------------------

Specs:
- `specs/consumers/census-page.sdp.md` (behavior, refines projections-model)
- `specs/consumers/mermaid-view.sdp.md` (behavior, refines projections-model)

```
sdp:q → spec:consumers.census-page   stated=defined  derived=ready  deliveryFacts=[implemented]
sdp:q → spec:consumers.mermaid-view  stated=defined
```

Implementations:
- `src/projections/census.ts` (pure Reader → pages; taxonomy from
  `SPEC_KINDS` / `graphEdgeTypes` / etc.; structural-bindings section with
  explicit "No structural bindings exist." empty note)
- `src/projections/mermaid.ts` (bounded one-hop + pack; dedicated
  `escapeMermaidLabel`; refuse-don't-truncate)

Deterministic `--check-clean` wired on both commands:
- `src/cli/census-command.ts` twin-render + byte compare
- `src/cli/mermaid-command.ts` twin-render + byte compare
- CLI help in `src/cli/sdp.ts` records `sdp census` / `sdp mermaid` /
  `--check-clean` as separate wholesale tmp→rename projections, not bolted onto
  Design Review.

CLI / publication posture is on record inside both Specs (`sdp census` owns
`generated/census/`; `sdp mermaid` owns `generated/mermaid/`; failed build
invalidates both live and tmp roots).

Design Review Spec / page anatomies were not re-specified (empty plan-range
diff on `specs/consumers/design-review.sdp.md`).

BRIEF C: PASS

--------------------------------------------------------------------------------
BRIEF D — structural anchors (BR1)
--------------------------------------------------------------------------------

Decision: `specs/decisions/structural-anchor-semantics.sdp.md`
- stated `ready`, derived `ready`, `decision.decision` written
- satisfies-vs-implements ruled first (no `implements` slot)
- `component` + `uses` admitted as closed graph-ID refs
- refusal list in the Spec body (no sibling builders; anchored not inferred;
  no delivery fact / readiness; no free-form tags; foreign fields stay errors;
  lint stays warn)

Implementation matches BR1:
- `src/model/anchors.ts` `CodeAnchor.component?: ComponentAnchorId`,
  `uses?: readonly CodeAnchorId[]`
- `src/graph/schema.ts`:
  - `schemaVersion = "0.5.0"`
  - `derivedEdgeTypes = ["belongsTo", "satisfies", "models", "memberOf", "uses"]`
  - commentary: structural edges stay out of delivery facts and Reader
    binding traversal
- `src/extract/derive.ts` emits anchored `memberOf` / `uses` from code anchors
- `src/reader/reader.ts` +2-line comment documenting the
  `isTraversableBinding` exclusion (CodeNode→CodeNode, no Spec linkage)

No new delivery facts:
- `git log $(merge-base)..HEAD -- src/graph/delivery-facts.ts` empty
- `deliveryFactNames` still `["implemented", "has-verifier", "observed"]`

No readiness-floor changes:
- `git diff $(merge-base)..HEAD -- src/validate/readiness-floor.ts` empty

Live corpus structural-edge count is 0 (no authored `component`/`uses` in
self-hosting). Schema vocabulary and decision/model law are queryable (below).
F1 already proved a fixture root emits 3 anchored edges.

BRIEF D: PASS (BR1)

--------------------------------------------------------------------------------
BRIEF E — untouched
--------------------------------------------------------------------------------

Product-code grep over the plan diff (`src/`):

```
git diff $(merge-base HEAD feature/universal-spec)..HEAD -- src/
  | rg -i -- 'sdp new|--watch|bySymbol|bymbol|mcp'
```

Result: **no hits**.

Full-diff refined patterns:
- `sdp new`, `--watch`, `bySymbol`, `bymbol`: **no hits**
- `mcp`: one adjacent-context hit only, an *unchanged* self-hosting-oracle
  row `["spec:consumers.projections-model", "decidedBy", "spec:decisions.mcp-deferred"]`
  next to newly inserted mermaid/census `refines` rows. Not an MCP server
  surface.

Current product tree:
- `src/cli/sdp.ts` verbs: build, validate, view, census, mermaid, gherkin,
  import, q. No `new`, no `--watch`.
- `rg mcp src/` → no hits
- `bySymbol` remains the pre-existing "deliberately absent" comment in
  `src/reader/reader.ts` (reader.ts plan-range diff is the two-line
  structural-edge exclusion comment only)
- `spec:consumers.impact-graph` still `statedReadiness: idea`

```
sdp:q → [ { id: 'spec:consumers.impact-graph', statedReadiness: 'idea', derivedReadiness: 'scoped' } ]
```

plans/29 still *describes* brief E (it is the arc index). That is not product
implementation. AGENTS.md status header names the E re-entry trigger; that is
commissioning hygiene, not an agent-surface feature.

BRIEF E: PASS (untouched)

--------------------------------------------------------------------------------
COMMISSIONING
--------------------------------------------------------------------------------

Plan 30 header EXECUTED:

```
plans/30-gherkin-carrier-hardening.md:3
> **Status:** ✅ EXECUTED — settle the canonical Gherkin suffix as `.sdp.gherkin` …
```

Plan 29 commissioned-plans line names Plan 31:

```
plans/29-universal-carrier-annotations-and-agent-surface-briefs.md:18-21
**Plan 31** (`carrier-universality-runnable-modules-projections-structural-anchors`, executing)
commissions briefs A/B/C/D while deferring brief E.
```

plans/31 record exists with EXECUTING + E re-entry trigger:

```
plans/31-carrier-universality-runnable-modules-projections-structural-anchors.md
> **Status:** 🔄 EXECUTING.
… brief **E** (agent command surface) is out and re-enters when **census +
structural edges queryable**.
```

Pending-close (not a defect): F4 close notes say the plans/31 flip to executed
happens after user approval. Status is still EXECUTING, as required at this gate.

AGENTS.md status banner was updated in lockstep (plan 31 EXECUTING; plan 30
EXECUTED; E re-enters when census + structural edges are queryable).

COMMISSIONING: PASS (pending-close)

--------------------------------------------------------------------------------
RE-ENTRY TRIGGER — census + structural edges queryable
--------------------------------------------------------------------------------

Demonstrated live via `sdp:q` (dist fresh; derive-in-process):

```
return {
  schemaVersion: graph.schemaVersion,
  census: g.specs().filter(s => s.id === "spec:consumers.census-page")
           .map(s => ({id, statedReadiness, derivedReadiness, file, deliveryFacts})),
  mermaid: g.specs().filter(s => s.id === "spec:consumers.mermaid-view").map(s => s.id),
  memberOfConcept: g.findByConcept("memberOf")
                    .filter(n => n.id.includes("anchor") || n.id.includes("structural"))
                    .map(n => n.id),
  liveStructural: graph.edges.filter(e => e.type === "memberOf" || e.type === "uses").length,
}
```

Result:
- `schemaVersion: '0.5.0'`
- census: `{ id: 'spec:consumers.census-page', statedReadiness: 'defined',
  derivedReadiness: 'ready', file: 'specs/consumers/census-page.sdp.md',
  deliveryFacts: [ 'implemented' ] }`
- mermaid: `spec:consumers.mermaid-view`
- `memberOf` concept hits: `spec:decisions.structural-anchor-semantics`,
  `spec:model.anchors` (model terms name both `memberOf` and `uses` edges)
- live structural edges in the self-hosting corpus: `0`

Schema vocabulary (read from `src/graph/schema.ts`, carried on every payload):

```
export const derivedEdgeTypes = ["belongsTo", "satisfies", "models", "memberOf", "uses"]
export const graphEdgeTypes = [...authoredEdgeTypes, ...derivedEdgeTypes]
export const schemaVersion = "0.5.0"
```

`spec:extraction.schema-versioning.declared-version` example space freezes
`{schemaVersion: "0.5.0"}`.

Census implementation already consumes those types
(`src/projections/census.ts` filters `edge.type === "memberOf" || "uses"` and
renders the empty-section honesty note). The trigger condition — census
projection exists and `memberOf`/`uses` are in the schema vocabulary and
queryable — is met. Brief E may re-enter after close.

RE-ENTRY TRIGGER: SATISFIED

--------------------------------------------------------------------------------
Scope-creep scan (commissioned vs landed)
--------------------------------------------------------------------------------

In-scope additions (named by the plan):
- two decision Specs; gherkin-authoring + gherkin-view follow-through
- runnable-modules Spec + registrar codegen + `./testing` export
- census + mermaid projections and CLI verbs
- structural fields/edges/validators + schema 0.5.0
- commissioning records (plans/29, /30, /31) + AGENTS.md status banner
- docs/concept/06 schema version cite 0.4.0 → 0.5.0 (companion to the bump)

Must-NOT list held:
- no `sdp new`, no `--watch`, no MCP server, no `bySymbol`
- MD-28 / suffix / dual-recognition / bare `.feature` not reopened
- no self-executing prose; `has-verifier` still specTest-only
- no O5; no Scenario Outlines
- `spec:consumers.impact-graph` stays `idea`
- no delivery-fact ladder growth; no readiness-floor edits
- Design Review Spec not re-specified
- no default-carrier flip

Nothing extra of product-scope weight is in the plan diff.

--------------------------------------------------------------------------------
Verification performed this audit
--------------------------------------------------------------------------------

Read-only. No edits, no staging, no commits in the worktree.

Commands actually run:
- `git status`, `git log`, `git merge-base`, `git diff` / `--stat` / `--name-only`
  over the plan range
- `ls` / `stat` on `dist/cli/sdp.js` and generated/
- multiple `npm run --silent sdp:q -- '…'` queries (carrier-universality,
  structural-anchor, runnable-modules, census/mermaid/gherkin-view,
  impact-graph, schemaVersion, live memberOf/uses counts, specContext
  decision fields, findByConcept("memberOf"))
- `rg` over specs, src, CLI, mutation log, plans
- reads of both decision Specs, runnable-modules, census/mermaid/gherkin-view,
  gherkin-authoring, claim-taxonomy, delivery-facts, schema, anchors, plans
  29/30/31, valid-cart tracer, mutation log, F1/F3 evidence

Not re-run here (already green on this HEAD per F1; F4 is scope, not the
green-gate): `npm run check`. Mutation was not re-executed live (would mutate
the read-only tree); the committed log is red/red/green and the tree is the
restored green state.

================================================================================
END
