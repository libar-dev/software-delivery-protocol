# Plan 40. Annotations, closer to the original design

> **Status:** 🔨 EXECUTING. The owner's direction of 2026-10-09: move closer to the v0 design and
> bring back the value of annotating architecturally significant units and their relationships
> in code. This plan is the contract every session and agent on the arc reads. The engine,
> corpus, and skills change together on `feature/annotations-v0`, stacked on
> `feature/adopter-round-2` (PR 28). The first adopter showcases the result on its PR 12 branch.
> Readiness and backlog are read from the graph; this file is the brief, not the law.

## Why this arc

Three inputs, read on 2026-10-09:

- `docs/lineage/annotation-scout-2026-10-04.md`: gen 1's annotation model, what actually drifted
  there (duplicate identities, scan scope, syntax; not an open vocabulary and not dual
  extraction), and the v0 mapping. It corrects the context lines of MD-30, MD-34 and MD-35.
- `docs/lineage/v0-design/` chapters 01 to 04 and 06: a zero-dependency marker package (02 §3),
  three marker forms feeding one normalized envelope (04 §2, 06 §3), optional plural `satisfies`
  (04 §2.4), a `#` sub-segment in the id grammar (03 §6.2), a declared Component with `layer`
  and `bounded_context` (03 §2.5), three edge provenances (03 §4), and the line v0 drew: markers
  carry identity and structure, never readiness, intent, behavior or verification.
- The first adopter's PR 12 (`libar-dev/libar-platform`): every one of its 40 code anchors sits
  in a test or the harness because its runtime code cannot import this package; `byFile` on a
  source file returns nothing; `design/tools/anchor-sites.json` is a hand-kept join; Specs were
  split so an anchor could claim only what the code does; a stub reads as `implemented`; a
  relationship the design states in prose cannot reach a page.

## The rulings this arc makes

Each is a decision Spec at `defined`, held for the owner's `ready`. Names lead; numbers follow in
`docs/concept/DECISIONS.md`.

### R1. The comment form (`spec:decisions.anchor-comment-form`, MD-36)

Supersedes `spec:decisions.jsdoc-graph-extraction-refused` (MD-35). A second extracted
representation of the anchor: a `/** … */` comment carrying reserved `@sdp-*` lines, attached as
the leading doc comment of any top-level statement of a `.ts`/`.tsx` file. It feeds the same
closed anchor envelope as the constant form. Prose in the comment still authors nothing; only
the reserved lines are read. The same id in two forms is a duplicate id. One grammar, by example:

```ts
/**
 * The online rebuild path. Explanation stays local commentary and confers nothing.
 *
 * @sdp-anchor impl:platform.read-model.rebuild
 * @sdp-label the online rebuild path
 * @sdp-satisfies spec:application.rebuild
 * @sdp-references spec:application.history-rebuild
 * @sdp-component component:platform.read-model
 * @sdp-uses impl:platform.gate, impl:platform.context.adapter
 * @sdp-role service
 */
export async function rebuild(...) {}
```

- `@sdp-anchor <id>` opens the anchor; the id's namespace selects the flavor exactly as the
  constant builders do: `impl:` `api:` `component:` are code anchors, `test:` is a test anchor,
  `oracle:` is an oracle anchor.
- Target lines by flavor: `@sdp-satisfies` (code), `@sdp-verifies` (test), `@sdp-models`
  (oracle). Lists are comma-separated.
- Structural lines, code anchors only: `@sdp-component`, `@sdp-uses`, `@sdp-references`,
  `@sdp-role`; component anchors additionally `@sdp-layer`, `@sdp-context`.
- `@sdp-label` on any flavor.
- Any other `@sdp-*` line is an envelope error (closed envelope, as the constant form).
  A block with `@sdp-*` lines and no `@sdp-anchor` is an envelope error. The block's first
  line is the binding's `file`/`line`.
- Parsing reads the raw comment text with a line grammar; it does not depend on the TypeScript
  JSDoc tag parser. A comment that does not open with `/**` is never read.
- No import is required. Trust is by reserved grammar, not by builder import. The
  `hasProtocolBuilderImport` prefilter must admit a file containing `@sdp-anchor`.

Also under R1: the package ships a zero-dependency subpath `@libar-dev/software-delivery-protocol/anchors`
exporting the id builders and the three anchor builders and nothing else, for runtimes that may
import but must not load `node:*` or ts-morph (v0 02 §3 verbatim). The extractor trusts that
specifier as a Protocol builder module.

### R2. Binding grain (`spec:decisions.anchor-binding-grain`, MD-37)

Refines `spec:model.anchors`.

- `satisfies` is optional and plural on a code anchor; `verifies` is plural on a test anchor
  (non-empty). The constant form accepts one `ref(…)` or a fresh array literal of them. Each
  resolving target confers its fact as today; `implemented` stays whole-Spec.
- A new anchored edge `references`: CodeNode → Spec, from `references?: readonly SpecId[]` on a
  code anchor. It confers no delivery fact, moves no floor, and the drift alarm ignores it. It
  says this code is written against that design. A target also named in `satisfies` is an error.
- An identity-only code anchor (no `satisfies`, no `references`) is lawful: it mints a CodeNode
  for structure and for `byFile`, and nothing else.
- Entry-address targets (`spec:x#design.key`) stay an open question on the decision, with
  v0 03 §6.2 as the lineage.

### R3. Architectural annotation (`spec:decisions.architectural-annotation`, MD-38)

Supersedes `spec:decisions.structural-anchor-semantics` (MD-30) and
`spec:decisions.architectural-significance-rides-primitives` (MD-34). What survives from both is
restated inside: `component` and `uses` semantics, structural non-conferral, no inference from
imports, no status or readiness on code, significance never selects a Spec kind, no `pattern:`
namespace. What changes:

- `role?: string` on any code anchor: the architectural pattern the unit plays (gen 1's role;
  `service`, `decider`, `projection`, `read-model`, `codec`, `contract`, `barrel`, `utility` are
  the lineage set, not a closed list). A free, corpus-owned vocabulary; the census renders its
  taxonomy with counts from the graph; no validator checks it against a list. A corpus-declared
  role vocabulary is the decision's open question.
- `layer?: "edge" | "application" | "domain" | "adapter" | "infrastructure"` and
  `context?: string` (bounded context) on `component:` anchors only (v0 03 §2.5). `layer` is a
  closed set; a value outside it is an envelope error.
- The declared component is the `component:` anchor. No separate architecture file; the anchor
  is where the component is realized.
- The census and the Design Review render the new structure under their existing contracts
  (MD-30 already gave the census that duty); Mermaid and Gherkin are untouched, which keeps
  MD-32 as it stands. The decision names this.
- Guidance from gen 1's ownership doc, restated in `sdp-authoring`: annotations are curated,
  never a coverage quota; an identity has one owner; a realizing unit documents its local how,
  never a paraphrase of the Spec's what or why.

### What stays refused

`status`, readiness, intent, behavior or verification on code (v0 04 §2.4). Inference from
imports as anchored or declared structure. A Spec-side list of its own code bindings. A second
graph. Promotion of anything inferred without a human edit.

## The engine contract

Schema `0.8.0`. The closed edge list becomes twelve: the eleven of today plus `references`
(derived, anchored). `CodeNode` gains optional `role`, `layer`, `context`. `satisfies` and
`verifies` edges are one per target. Delivery facts and readiness floors are unchanged.

Validators: `references` and plural `satisfies` targets resolve through the existing referential
check; non-resolving targets confer nothing and report as today. The structural validator adds:
`references` non-empty and unique when present; a target in both `satisfies` and `references`
is an error; `layer` outside the closed set is an envelope error; `layer`/`context` on a non-
component anchor is an envelope error. Duplicate ids across forms report through the existing
duplicate-id validator.

Reader: `SpecContext` gains `references` (the CodeNodes that reference the Spec, with file and
line). `byFile` returns the comment-form anchors at their site. `blastRadius` traverses
`references` as a binding, naming the edge type in the reason. The frozen entry adapters stay
three.

Projections: the census structural section renders role, layer, context and `references`; the
Design Review Spec page lists "Referenced by" and the component rows show layer and context.
Mermaid and Gherkin untouched.

Recipes: 27 "References into a design" (per Spec: unbound, referenced, realized, verified, with
the referencing and realizing units; the claim-map projection), 28 "Roles and layers" (the
taxonomy from the graph). Both executed by `test/recipes.test.ts`.

Skills and docs: `sdp-agent-surface` (twelve edges, the new node fields, recipes 27 and 28),
`sdp-authoring` (both forms written out, the subpath import, plural targets, `references`, role,
layer, context, the curation guidance), `docs/agent-surface/recipes.md`, `CONTEXT.md` (terms
below), `docs/concept/DECISIONS.md` (MD-36 to MD-38; MD-30, MD-34, MD-35 marked superseded),
`AGENTS.md` one line on the comment form.

Vocabulary for `CONTEXT.md`: **constant form** and **comment form** as the two representations
of an anchor; **references** as the non-conferring edge; **role**, **layer**, **context** as
the structural attributes. `annotation` and `marker` stay rejected synonyms of `anchor`; the
verb "annotate" in prose means "write an anchor".

## Self-binding showcase in this repository

The engine's own reader and projections code carries comment-form anchors with `references` into
`pack:spec-studio-v1` members where the code is the design context a Studio Spec rests on; every
engine component declares `layer` and `context`; architecturally significant units carry a
`role`. Recipe 27 over the Studio Pack is the claim map as a projection. The self-hosting oracle
re-derives its pins at close.

## The adopter showcase (PR 12 branch)

Re-pin the package to this branch. Move the test-resident implementation anchors into `src/` as
comment-form anchors at their real sites and delete `design/tools/anchor-sites.json`, its test,
and the Pack page's reading of it. Declare one `component:` anchor per package with layer and
context and `uses` between packages. Give significant units a role. Add `references` from the
read-model code to the history-view Specs it is written against. Let the Pack page and
`check.py` read the new structure. Record what changed in `docs/feedback/sdp-feedback-01.md`
and in the PR description.

## Order and commits

1. Corpus (decisions, model Specs, vocabulary, registry) and engine core (grammar, builders,
   extractor, schema, validators, subpath) run in parallel on disjoint files.
2. Reader and projections; the engine's self-binding; then recipes, skills and docs.
3. `npm run check` green; oracle pins re-derived and labelled as re-measured.
4. The adopter showcase against a tarball packed from this branch.

Commit per coherent unit on this branch after its focused tests pass; the full gate before the
close commit. Never push without the owner's word.

## Acceptance, re-measured at close

- An adopter source file with no Protocol import binds through the comment form and
  `byFile` names its Spec.
- A `references` edge reaches a Spec page and recipe 27 without conferring `implemented`.
- Recipe 27 over `pack:spec-studio-v1` prints one row per member with its state.
- The census prints the role, layer and context taxonomy from the graph alone.
- `npm run check` passes; the adopter's `python3 design/tools/check.py` prints OK.
