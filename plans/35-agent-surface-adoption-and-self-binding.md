# Plan 35 — Agent-surface adoption and self-binding

> **Status:** 🚧 EXECUTING — the plan-34 arc under execution; briefs E–H in scope per plans/34; operational tracking in `.omo/plans/plan-35-agent-surface-arc.md`

This is the execution stamp for the plan-34 arc. The briefs index stays plan 34. Latest EXECUTED settled ground stays plan 33. Operational tracking lives in `.omo/plans/plan-35-agent-surface-arc.md`, same pointer shape as plan 31.

**In.** Briefs **E** through **H** from `plans/34-agent-surface-adoption-and-self-binding-briefs.md`:

- **E1** read recipes: the diff-to-at-risk bridge, then census/fan-in and projection-verb recipes once G has rows.
- **E2** write ergonomics: `sdp new spec` and `sdp validate --watch`, under the placement ruling below.
- **E3** the MCP amendment attempt against D6's concrete-caller bar. A recorded non-ruling is a complete outcome.
- **F** first-tranche registrar adoption under MD-31. Per-family refuse is a complete outcome.
- **G** Protocol-side structural bindings under the convention ruling. Sparse and true.
- **H** decide or defer the four leftover projection candidates. Defer-with-reason is lawful.

**Out.** The plan-34 do-not-reopen list, verbatim. No MCP server. No new projection. No reader-accessor freeze, no `sdp impact`/`sdp diff`, no new query verbs. No MD-30 amendment slipped in as convenience. No import-graph dump as `uses`. This stamp is not EXECUTED.

Re-measured at commission, never inherited: 156 Specs · 1 Pack · 146 anchors → 303 nodes · 571 edges, 0 errors, 0 warnings. Recipe 1 backlog empty. Recipe 2 names the same eight `defined` drift-alarm Specs. Recipe 8 reports 0 warnings.

E2 placement ruling. `sdp new spec` and `sdp validate --watch` are write-side authoring conveniences. The front door (MD-22, spec:decisions.agent-front-door) rules query vocabulary only — one evaluation sink, no new query verbs; it never addressed write-side verbs, and `sdp import` already sits lawfully beside `sdp q`. The write path remains carrier edit + git; a scaffolder makes that edit and a watcher re-runs the existing validation path. The ADR three-part test fails: not surprising once 'write path = carrier + git' is stated, no new trade-off, cheap to deprecate. No decision Spec is minted; this reasoning is the ruling of record, confirmed and recorded by the executing session.

## Execution record

Still commissioned and in progress. This record closes briefs E through H on the evidence below. It does not flip the stamp. Todo 18 owns `EXECUTED`.

### F first-tranche ledger (MD-31)

Five families, five recorded outcomes. Refusal would have been a complete close. None refused.

| Family | Outcome | One-line evidence |
| --- | --- | --- |
| `model.stable-ids` | **ADOPT** | Two examples (`namespaced-round-trip`, `malformed-refusal`) sit on five-adapter registrars; different-kind second Thens live in `assertions` (`.omo/evidence/task-4-plan-35-agent-surface-arc.md`). |
| `model.anchors` | **ADOPT** | Two examples (`physical-identity`, `lookalike-refusal`) adopted; temp-root materialization lives in `createWorld`; the silent-refusal second Then is assertion-owned (`.omo/evidence/task-8-plan-35-agent-surface-arc.md`). |
| `carrier.slot-notation` | **ADOPT** | Two examples (`typed-declaration`, `refused-guess`) adopted; `slotCount` stays comparator-owned, while form, name, and skeleton Thens are assertion literals (`.omo/evidence/task-9-plan-35-agent-surface-arc.md`). |
| `validation.duplicate-ids` | **ADOPT** | One dual-carrier example adopted; one `extract` call; finding-id rides the comparator; file list and missing-node Then live in `assertions` (`.omo/evidence/task-10-plan-35-agent-surface-arc.md`). |
| `validation.kind-evidence` | **ADOPT** | Three examples adopted with no second product call and no shared mutable world; clause-id, error-count, and subject/path joins moved to `assertions`. Pressure-family friction is on the record. The freeze is unchanged (`.omo/evidence/task-11-plan-35-agent-surface-arc.md`). |

Tracked siblings that close the adopt path: `test/model.stable-ids.{namespaced-round-trip,malformed-refusal}.test.generated.ts`, `test/model.anchors.{physical-identity,lookalike-refusal}.test.generated.ts`, `test/carrier.slot-notation.{typed-declaration,refused-guess}.test.generated.ts`, `test/validation.duplicate-ids.dual-carrier.test.generated.ts`, `test/validation.kind-evidence.{constraints-alone,empty-promoted-child,untargeted-constraint}.test.generated.ts`.

### G convention and binding table

Ruling session: Todo 2 (`.omo/evidence/task-2-plan-35-agent-surface-arc.md`). The convention is now carrier text on `spec:model.anchors` (`specs/model/anchors.sdp.md`).

A `component:` anchor satisfies its seam's most-specific design Spec. The `satisfies` edge is the component's own realization claim. Structural edges confer nothing, so MD-30 (`spec:decisions.structural-anchor-semantics`) stays unchanged.

| Component anchor | Satisfies target |
| --- | --- |
| `component:protocol.model` | `spec:model.core-model` |
| `component:protocol.extract` | `spec:extraction.derive-graph` |
| `component:protocol.graph` | `spec:extraction.claim-taxonomy` |
| `component:protocol.validate` | `spec:validation.two-check-families` |
| `component:protocol.reader` | `spec:consumers.reader` |
| `component:protocol.projections` | `spec:consumers.projections-model` |
| `component:protocol.cli` | `spec:extraction.build-pipeline` |
| `component:protocol.runner` | `spec:extraction.example-runner` |
| `component:protocol.codegen` | `spec:extraction.runnable-modules` |
| `component:protocol.notation` | `spec:carrier.slot-notation` |
| `component:protocol.adapters` | `spec:extraction.example-runner` |

Dispositions recorded with the table: `src/ids.ts` joins `component:protocol.model`. There is no `component:protocol.import` (`impl:protocol.sdp-import` stays on `spec:carrier.sdp-import`). There is no `component:protocol.testing` (no honest carrying Spec). The adapters row keeps the same target as runner on purpose: each seam realizes a different part of `spec:extraction.example-runner`. The committed oracle for the accepted set and authored structural edges is `test/self-hosting-oracle/structural-edges.ts`.

### E2 placement ruling

Unchanged from the commission stamp above. `sdp new spec` (`src/cli/new-spec-command.ts`) and `sdp validate --watch` (`src/cli/validate-watch.ts`) remain write-side conveniences under that ruling. No decision Spec was minted.

### E3 MCP amendment

**Non-ruling.** No candidate is both a concrete caller and the owner of a distinct MCP verb boundary and contract. D6 (`spec:decisions.mcp-deferred`) is unchanged. The Spec itself was not edited.

Exact bar, restated from `specs/decisions/mcp-deferred.sdp.md`:

> deferred until a concrete caller establishes its boundary and contract

Candidate classes that failed that bar: repository agent skills, OmO harness sessions, CLI projection publishers, repository tests, and Studio-class / prospective app sinks. Skills and harness sessions already call the existing `sdp q` sink. Projections and tests construct `createReader` in process. Studio-class sinks remain a category, not a named live caller. Evidence: `.omo/evidence/task-13-plan-35-agent-surface-arc.md`.

### H leftover projections

**Defer all four.** No candidate names an in-arc reader the four shipped roots (Design Review, census, Mermaid, Gherkin) fail to serve. `spec:consumers.projections-model` stays `defined` and unedited. Evidence: `.omo/evidence/task-14-plan-35-agent-surface-arc.md`.

| Candidate | Disposition | Re-entry trigger |
| --- | --- | --- |
| Spec Studio | **DEFER** | A recorded ruling that names Studio's package home (`@libar-dev/` or `@libar-ai/`) and the reader Markdown Design Review does not serve. |
| Reference projection | **DEFER** | A named human-outside-repo consumer that the four shipped roots do not serve, with an in-arc way to measure that demand. The taxonomy row is not that consumer. |
| Context bundle | **DEFER** (this record does not commission a later plan) | Later evidence that agent sessions still hand-assemble the same token-budgeted slice after the E1 recipes, so scripting one body at a time is no longer the honest description. Then commission a later plan. Do not build the bundle inside plan 35. |
| Structural-edge Mermaid | **DEFER** | A named reader that needs CodeNode-rooted diagrams, that census tables and Spec-rooted one-hop Mermaid do not serve, plus a recorded decision to extend or abandon the one-generated-view posture. |

## Close record — 2026-08-16

Commissioned, not executed. Numbers below were measured in this close task against the live tree. They were not copied from the commission stamp, from plan 33, or from any prior evidence file.

## re-derived at close (re-run the recipes rather than inheriting these)

Canonical validate, this close task, exit 0:

`npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`

`156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges (0 errors, 0 warnings)`

Recipe bodies 1, 2, and 8 were lifted from the live `docs/agent-surface/recipes.md` fences and run through `npm run --silent sdp:q -- "<body>" --json`.

- Recipe 1 (build backlog): `total: 0`, `byFamily: {}`, `excludedReadyExamples: 66`, `excludedReadyDecisions: 31`, `excludedWithoutVerifier: []`.
- Recipe 2 (drift alarm): `total: 8`. The eight Specs, all stated `defined`, with `floorReached: ready` and `firstUnmetClause: null`: `spec:carrier.markdown-authoring`, `spec:consumers.projections-model`, `spec:extraction.claim-taxonomy`, `spec:extraction.regenerability`, `spec:model.core-model`, `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`.
- Recipe 8 (orphans and gaps): `errors: 0`, `warnings: 0`, `byValidator: {}`, `signals: []`.

A second local comparison, without rerunning the validate command, read `generated/graph.json` and an independent `sdp:q` count query. Both reproduced `156 / 1 / 157 → 314 / 660`, recipe-1 `total: 0`, recipe-2 `total: 8` with the same eight ids, and recipe-8 `0 / 0`. Raw command tails and the comparison script live in `.omo/evidence/task-16-plan-35-agent-surface-arc.md`.

### Drift-alarm and graph delta versus the independently sourced commission baseline

Commission (Todo 1 live run, recorded on this stamp and in `.omo/evidence/task-1-plan-35-agent-surface-arc.md`) and this close task were sourced separately. Comparison happens only after both exist.

| Measurement | Commission | This close | Delta |
| --- | --- | --- | --- |
| Specs / Packs | 156 / 1 | 156 / 1 | none |
| Anchors → nodes · edges | 146 → 303 · 571 | 157 → 314 · 660 | +11 anchors, +11 nodes, +89 edges |
| Validate findings | 0 errors, 0 warnings | 0 errors, 0 warnings | none |
| Recipe 1 backlog | empty (`total: 0`) | empty (`total: 0`) | none |
| Recipe 2 drift-alarm set | 8 Specs, all `defined` | 8 Specs, same eight ids, all `defined` | none on membership |
| Recipe 8 warnings | 0 | 0 | none |

Cause of the graph delta, grounded in this arc's landed changes: Todo 5 authored the eleven `component:protocol.*` anchors from the G table. Each component adds one CodeNode and one `satisfies` edge. The same authoring added 59 `memberOf` edges and 19 `uses` edges (`11 + 59 + 19 = 89`). Nodes follow the identity `156 Specs + 1 Pack + 157 anchors = 314`.

Recipe 2 membership did not move. Three of those eight Specs gained one extra implementation binding because a component now satisfies them (`spec:model.core-model` 2→3, `spec:extraction.claim-taxonomy` 1→2, `spec:consumers.projections-model` 1→2). Stated readiness stayed `defined`. The arc did not claim those family-parent Specs were newly `ready`. Recipe 8 stayed at zero because the structural authoring validated clean and registrar adoption is test-side, not a new warn-level corpus gap.
