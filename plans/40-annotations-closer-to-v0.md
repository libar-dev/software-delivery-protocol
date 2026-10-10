# Plan 40. Annotations, closer to the original design

> **Status:** ✅ EXECUTED. All three rulings state `ready` since 2026-10-10: the owner stated
> `ready` on MD-36 and MD-38, then on MD-37 once the rulings of 2026-10-10 (the last section)
> closed the open questions the three decisions carried. The full gate passed at the wave 2
> close on both repositories and runs again on the change that lands those rulings; every count
> below is derived, re-run the recipes rather than quoting it. The owner's direction of
> 2026-10-09: move closer to the v0 design and bring back the value of annotating
> architecturally significant units and their relationships in code. This plan is the contract every session and agent on the arc reads. The engine,
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

Each is a decision Spec, and all three state `ready` (the owner, 2026-10-10). Names lead; numbers
follow in `docs/concept/DECISIONS.md`. The rulings of 2026-10-10 at the end of this plan are
numbered on their own.

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
  Attachment to a declaration is not recorded: the file is the binding grain of both forms, and
  no attachment kind or exported name (v0 03 §2.7) is kept (rulings of 2026-10-10, R4). A
  reserved tag in a nested position is a misplaced-tag error.
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
  says this code answers to that design without claiming to realize it; a design that builds on
  existing code states that by its own relation (rulings of 2026-10-10, R1). A target also named
  in `satisfies` is an error.
- An identity-only code anchor (no `satisfies`, no `references`) is lawful: it mints a CodeNode
  for structure and for `byFile`, and nothing else. `byFile` may return nodes with an empty Spec
  list; `blastRadius` reports changed CodeNodes with no Spec linkage as their own list, never
  dropped and never implying coverage.
- `references` may target any Spec, decisions included. `satisfies` to a decision stays the
  authoring prohibition of MD-26, not a new conferral filter. The drift alarm ignores
  `references` and still reports a separate `satisfies` target below `ready`; recipe 1's
  predicate is unchanged.
- Anchor targets name whole Specs; an entry-address target (`spec:x#design.key`, v0 03 §6.2) is
  refused (rulings of 2026-10-10, R2).

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
  role vocabulary checked by a validator is refused (rulings of 2026-10-10, R3).
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
referencing units, the realizing units, whether an enabled verifier exists, and the derived
"builds on" column of the rulings of 2026-10-10, R1; absence reads as
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

The engine's own reader and projections code carries comment-form anchors, and its units
reference the decisions they follow. The references that once pointed existing code at
`pack:spec-studio-v1` members whose design builds on it came out under the rulings of 2026-10-10
(R1): the Studio Specs already state that dependency through their own relations. Every engine
component declares `layer` and `context`; architecturally significant units carry a `role`.
Recipe 27 over the Studio Pack is the claim map as a projection of Spec relations and bindings,
with its "builds on" column. The self-hosting oracle's model changes with it: expected nodes
separate from expected edges, zero-to-many bindings per anchor, the owner-reviewed
significant-unit set preserved rather than generated, comment attachment asserted on its own;
the census counts units apart from edges. Pins are re-derived at close and labelled so.

## The adopter showcase (PR 12 branch)

Re-pin the package to this branch. Move the test-resident implementation anchors into `src/` as
comment-form anchors at their real sites: one identity per realizing unit, so an identity that
stood for several files becomes several identities, each choosing `satisfies` or `references`
honestly, and every source-file-to-Spec association the sidecar recorded stays discoverable
through `byFile` before the sidecar is deleted. Then delete `design/tools/anchor-sites.json`,
its test, and the Pack page's reading of it. Declare `component:` anchors with layer and
context from a reviewed mapping, and `uses` between them. Give significant units a role. Add `references` only where a
unit answers to a design it does not wholly realize; the rulings of 2026-10-10 (R1, R2, R10) set
the per-Spec pass. Let the Pack page and
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

## Review

An independent read of the branch after wave 2 (gpt-6-astra, read-only) raised seven findings.

1. Applied. A misspelled reserved tag (`@sdp-anchor`, `@sdpAnchor:`) read as prose and vanished
   without a finding. A line that opens with `@sdp` is now a reserved tag line, and a misspelling
   refuses the block.
2. Applied. The nested-tag scan missed blocks before a closing brace and inside a JSX expression,
   and refused nested `//` and `/*` comments the top level never reads. It now walks every comment
   in the file and judges a nested comment by the top-level grammar.
3. Deferred. The engine's Studio `references` point from existing code at Specs that rest on it,
   which the review reads as inverting "written against". The showcase clause and the lineage
   scout read `references` as design context, so the owner rules it: the open question
   `#referenceDirection` on `spec:decisions.anchor-binding-grain`. The edges stay as declared.
   Ruled on 2026-10-10 (R1 below): the Studio references come out.
4. Applied. Recipe 4 dropped `blastRadius().unlinked`. Both bodies return `unlinkedUnits`, and a
   test runs the recipe on a file that holds only an identity-only unit.
5. Applied. The comment-form decision now says what the contract and the parser do: two openers
   are an envelope error, and an ordinary TSDoc tag after the reserved tags stays lawful and
   unread. The oracle declares the amended text.
6. Applied. `CONTEXT.md` and `sdp-authoring` now teach unattached top-level blocks, one-token role
   and context values, identity-only anchors under `anchored`, direct test-to-Spec
   `has-verifier`, which mistakes are loud and which silent, that a block binds by file and line
   so a stale one still binds, and that `validate --watch` ignores source edits.
7. Applied. `check-prose-schema.mjs` failed on the concept document's schema sentence, which now
   names `0.8.0` as current and states what `0.8.0` adds.

## Rulings of 2026-10-10

The owner's guidance: prefer clean solutions, and never let the amount of work decide. The
platform is the key context; orders-inventory is a supporting context and a development tool, and
nothing in the platform's core carries its specifics. Once this lands, the two branches are the
showcase for the decisions that design the rest of the platform and settle the Protocol's final
shape. Three independent advisors (gpt-6-astra, an Opus agent, a Fable agent) answered ten
questions. Each ruling notes the panel where the record names it. These rulings are numbered on
their own, apart from R1 to R3 above.

- **R1. `references` runs one way: the code answers to the design.** A reference says the unit
  follows a design or realizes part of it, so a change to the design asks the code to follow. A
  design that builds on existing code states that on its own side, by `dependsOn` or `refines` to
  the Spec the code satisfies, never by a reference from the code. The engine's fourteen Studio
  references and the adopter's reverse references come out; units reference the decisions and
  designs they follow. Recipe 27 gains a derived "builds on" column: for each member, the Specs it
  `dependsOn` or `refines` that carry `implemented`, with their implementing units. It confers
  nothing and forms no ladder, and the Studio claim map becomes a projection of Spec relations and
  bindings. `#referenceDirection` closes. Astra and Fable preferred a direction-neutral edge; the
  Opus reading carried because every relationship then has one home.
- **R2. Anchor targets name whole Specs.** `#entryAddressTargets` closes with an entry-address
  target refused: a per-entry `implemented` is the partial-realization fact under another name,
  and a design key is renamed freely. The adopter runs a per-Spec pass over its twelve Specs with
  designed-but-unbuilt parts, and over each component with its members. With no unrealized Design
  entry, `satisfies` stays. A coherent part with its own trigger or step splits into a child Spec
  that refines the parent, and the parent keeps `satisfies`. Anything else becomes `references`
  until the code realizes what the Spec promises. Unanimous.
- **R3. Roles stay a free, corpus-owned vocabulary.** `#roleVocabulary` closes as a refused
  alternative: a corpus-declared vocabulary checked by a validator is an authored registry and a
  content-quality check. Two spellings of one role are reconciled by editing the anchors.
  Unanimous on no validator.
- **R4. The file is the binding grain of both forms.** `#attachmentIdentity` closes: a block's
  line locates the anchor and names no declaration, and no attachment kind or symbol name is
  recorded. Symbol-level reach, if it arrives, is derived under the inferred claim. The authoring
  skill advises keeping a file's blocks together, one identity per realizing site.
- **R5. The adopter's layer mapping stays.** The context library and the two context components
  stay `adapter` and the gate stays `infrastructure`; the adopter's PLAN records a one-line rule
  for each layer beside the mapping.
- **R6. The adopter's contexts stay, and the isolation is checked.** `platform` stays on the seven
  platform components. `orders` and `inventory` stay on the example's domain and context
  components, `orders-inventory` on the parent composition. The adopter's
  `design/tools/check.py` fails when a `platform` component `uses` a component in another
  context. Two advisors would have dropped `platform` under the adopter's narrower glossary; the
  owner's statement that the platform is the key context settles it.
- **R7. `example/` is architecture.** Its five components stay; `fixture/` stays without
  components. Unanimous.
- **R8. The Protocol keeps `layer`.** It is the architecture term, the v0 field name, and the
  schema `0.8.0` field. `CONTEXT.md`'s three loose uses become "level". The adopter adds an
  "architectural layer" glossary row, and renaming its numbered capability layers (candidate
  "stage") is queued as an owner item, because the adopter owns its language.
- **R9. MD-37 states `ready`** on the change that lands R1, R2, and R10.
- **R10. Two merge rules.** A `references` edge is authored for the design relationship it names;
  an edge whose reason is a test, a count, or a `byFile` answer is removed, and the adopter's
  `byFile` coverage test pins pairs derived from the anchors as they now stand. A component either
  satisfies its seam's design Spec or binds no Spec its members satisfy, and never references one;
  this is guidance in `sdp-authoring` and the component realization convention, checked by no
  validator.

Sequence: the Protocol side (R1 to R4, R8, R9, R10) lands as one change on
`feature/annotations-v0`, with the self-binding, recipes, oracle, and goldens, and passes the full
gate. The adopter then re-pins and applies R1, R2, R5 to R8, and R10 on its branch. After PR 29
merges, the adopter re-pins to the merge commit.
