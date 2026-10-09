# Plan 40. Annotations, closer to the original design

> **Status:** 🔨 EXECUTING. The owner's direction of 2026-10-09: move closer to the v0 design and
> bring back the value of annotating architecturally significant units and their relationships
> in code. This plan is the contract every session and agent on the arc reads. The engine,
> corpus, and skills change together on `feature/annotations-v0`, stacked on
> `feature/adopter-round-2` (PR 28). The first adopter showcases the result on its PR 12 branch.
> Readiness and backlog are read from the graph; this file is the brief, not the law. Revised
> once after an independent design review (gpt-6-astra, read-only) before wave 2.

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
representation of the anchor: a `/** … */` comment carrying reserved camelCase `@sdp*` tags (TSDoc-compatible), read from every top-level `/** */` block
of a `.ts`/`.tsx` file. It feeds the same
closed anchor envelope as the constant form. Prose in the comment still authors nothing; only
the reserved lines are read. The same id in two forms is a duplicate id. One grammar, by example:

```ts
/**
 * The online rebuild path. Explanation stays local commentary and confers nothing.
 *
 * @sdpAnchor impl:platform.read-model.rebuild
 * @sdpLabel the online rebuild path
 * @sdpSatisfies spec:application.rebuild
 * @sdpReferences spec:application.history-rebuild
 * @sdpComponent component:platform.read-model
 * @sdpUses impl:platform.gate, impl:platform.context.adapter
 * @sdpRole service
 */
export async function rebuild(...) {}
```

- `@sdpAnchor <id>` opens the anchor; the id's namespace selects the flavor exactly as the
  constant builders do: `impl:` `api:` `component:` are code anchors, `test:` is a test anchor,
  `oracle:` is an oracle anchor.
- Target lines by flavor: `@sdpSatisfies` (code), `@sdpVerifies` (test), `@sdpModels`
  (oracle). Lists are comma-separated.
- Structural lines, code anchors only: `@sdpComponent`, `@sdpUses`, `@sdpReferences`,
  `@sdpRole`; component anchors additionally `@sdpLayer`, `@sdpContext`.
- `@sdpLabel` on any flavor.
- Any other `@sdp*` tag is an envelope error (closed envelope, as the constant form).
  A block with reserved tags and no `@sdpAnchor`, or with two, is an envelope error. The block's
  first line is the binding's `file`/`line`.
- Attachment: every top-level `/** */` block containing a reserved tag is one anchor, whether it
  leads an import, a declaration, trails the last statement, or is the only content of the file.
  Attachment to a declaration is not recorded (open question: attachment kind and exported
  name, as v0 03 §2.7). A reserved tag in a nested position is a misplaced-tag error.
- Cardinality: each tag at most once per block; `@sdpModels` one target; the list tags take
  comma lists with no empty or repeated item; a non-empty line after the first reserved tag
  that does not start with `@` is a refused continuation, so a wrapped target never becomes
  ignored prose; prose precedes the tags.
- `@sdpRole` and `@sdpContext` values are one lowercase kebab token (`^[a-z][a-z0-9-]*$`), never
  normalized; `@sdpLayer` is the closed five-value set.
- Parsing reads the raw comment text with a line grammar; it does not depend on the TypeScript
  JSDoc tag parser. A comment that does not open with `/**` is never read.
- No import is required. Trust is by reserved grammar, not by builder import: a file is read
  for the comment form when it contains the `@sdp` prefix. The constant form keeps the
  import-based prefilter and the "untrusted builder mints nothing" rule; the two routes are
  separate. Neither is a security boundary against someone who can edit source; the
  extraction root and exclusions bound the scan, as they do today.

Also under R1: the package ships a zero-dependency subpath `@libar-dev/software-delivery-protocol/anchors`
exporting the id builders and the three anchor builders and nothing else, for runtimes that may
import but must not load `node:*` or ts-morph (v0 02 §3 verbatim). ESM with declarations, built
from the leaf modules; a test asserts the built file's import closure. The extractor trusts that
specifier exactly, and the source barrel as a relative trusted module.

### R2. Binding grain (`spec:decisions.anchor-binding-grain`, MD-37)

Refines `spec:model.anchors`.

- `satisfies` is optional and plural on a code anchor; `verifies` is plural on a test anchor
  (non-empty). The constant form accepts one `ref(…)` or a fresh array literal of them. Each
  resolving target confers its fact as today; `implemented` stays whole-Spec.
- A new anchored edge `references`: CodeNode → Spec, from `references?: readonly SpecId[]` on a
  code anchor. It confers no delivery fact, moves no floor, and the drift alarm ignores it. It
  says this code is written against that design. A target also named in `satisfies` is an error.
- An identity-only code anchor (no `satisfies`, no `references`) is lawful: it mints a CodeNode
  for structure and for `byFile`, and nothing else. `byFile` may return nodes with an empty Spec
  list; `blastRadius` reports changed CodeNodes with no Spec linkage as their own list, never
  dropped and never implying coverage.
- `references` may target any Spec, decisions included. `satisfies` to a decision stays the
  authoring prohibition of MD-26, not a new conferral filter. The drift alarm ignores
  `references` and still reports a separate `satisfies` target below `ready`; recipe 1's
  predicate is unchanged.
- Entry-address targets (`spec:x#design.key`) stay an open question on the decision, with
  v0 03 §6.2 as the lineage.

### R3. Architectural annotation (`spec:decisions.architectural-annotation`, MD-38)

Supersedes `spec:decisions.structural-anchor-semantics` (MD-30) and
`spec:decisions.architectural-significance-rides-primitives` (MD-34). Every operational rule of
both that still holds is restated inside: `component` and `uses` semantics (one-level
membership, unique non-empty targets, self-reference refused, cycles as data, whole-envelope
refusal, warn-level optional anchor lint), structural non-conferral, no inference from imports,
no status or readiness on code, significance never selects a Spec kind, no `pattern:` namespace,
`dependsOn` for genuine need only and scheduling edges refused, negative constraints as declared
intent, no anchor pointed at an unfinished Spec to manufacture coverage. What changes:

- `role?: string` on any code anchor: the architectural pattern the unit plays (gen 1's role;
  `service`, `decider`, `projection`, `read-model`, `codec`, `contract`, `barrel`, `utility` are
  the lineage set, not a closed list). A free, corpus-owned vocabulary; the census renders its
  taxonomy with counts from the graph; no validator checks it against a list. A corpus-declared
  role vocabulary is the decision's open question.
- `layer?: "edge" | "application" | "domain" | "adapter" | "infrastructure"` and
  `context?: string` (bounded context) on `component:` anchors only (v0 03 §2.5). `layer` is a
  closed set; a value outside it is an envelope error.
- The `component:` anchor is anchored architecture, not v0's declared Component that could exist
  before code. An unrealized component lives in Specs, never as an invented CodeNode. "No
  independently declared Component" is a retained limitation, named in the decision. A package
  may hold several layers or contexts; the mapping is reviewed, never one component per package.
- The five layers, one line each, live in the decision; omission is lawful and nothing forces a
  label to populate the census. The census links each role, layer and context value to its
  units so an owner can reconcile synonyms.
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
line). `byFile` returns the comment-form anchors at their site and may return nodes with no Spec.
`blastRadius` traverses `references` as a binding, naming the edge type and claim in the reason,
and lists changed unlinked CodeNodes separately. The frozen entry adapters stay
three.

Projections: the census structural section renders role, layer, context and `references`; the
Design Review Spec page lists "Referenced by" and the component rows show layer and context.
Mermaid and Gherkin untouched.

Recipes: 27 "References into a design" (per Spec, independent facts side by side: the
referencing units, the realizing units, whether an enabled verifier exists; absence reads as
unbound, never as "not built"; the claim-map projection, without a ladder), 28 "Roles and layers" (the
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
`role`. Recipe 27 over the Studio Pack is the claim map as a projection. The self-hosting oracle's
model changes with it: expected nodes separate from expected edges, zero-to-many bindings per
anchor, the owner-reviewed significant-unit set preserved rather than generated, comment
attachment asserted on its own; the census counts units apart from edges. Pins are re-derived
at close and labelled so.

## The adopter showcase (PR 12 branch)

Re-pin the package to this branch. Move the test-resident implementation anchors into `src/` as
comment-form anchors at their real sites: one identity per realizing unit, so an identity that
stood for several files becomes several identities, each choosing `satisfies` or `references`
honestly, and every source-file-to-Spec association the sidecar recorded stays discoverable
through `byFile` before the sidecar is deleted. Then delete `design/tools/anchor-sites.json`,
its test, and the Pack page's reading of it. Declare `component:` anchors with layer and
context from a reviewed mapping, and `uses` between them. Give significant units a role. Add `references` from the
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
- Every file-to-Spec pair the adopter's sidecar listed is returned by `byFile` after the sidecar
  is gone.
- `npm run check` passes; the adopter's lint, typecheck, tests and `python3 design/tools/check.py`
  pass, so the comment form costs its runtime nothing.

## Wave 2 gate close

Pins are re-measured under plan 40. The self-binding lane's independent node and binding-edge
rosters retain the reviewed significant-unit set. The graph yields five `honesty/gaps` and nine
`conformance/prose-mentions` warnings, including the superseded architectural-significance
decision's mention of structural patterns. The oracle pins both lists.

The close repairs the current-plan handbook and test pin, the manifest-order example's schema
version, and the README recipe count. The annotation-form graph golden is regenerated through
`projection-suite.mjs` from its materialized corpus and excluded from Prettier, because the
serializer owns its bytes. Repository projections and contracts use the generation scripts.

The full gate runs with `npm_config_cache=/private/tmp/plan40-npm-cache`, a writable cache for
the package smoke test. Acceptance probes run after the gate to avoid concurrent writes to its
generated roots. Wave 2 closes here; the adopter work above remains in this executing arc.
