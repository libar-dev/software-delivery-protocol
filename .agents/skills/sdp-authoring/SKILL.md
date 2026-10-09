---
name: sdp-authoring
description: Author and mature Protocol Specs through the graph-first workflow. Use when creating or editing `.sdp.md` or lawful `.sdp.gherkin` carriers, deciding the honest readiness rung, promoting inline content, generating executable contracts, binding examples or implementation anchors, mutation-probing evidence, or preparing a Spec for human review and a `ready` statement.
---

# Author Specs through the graph

Treat the canonical carrier as the write surface and the derived graph as the read model. Start every
session with the build-backlog and drift-alarm recipes, recipe 1 and recipe 2, run verbatim from the
catalog. In the Protocol repository the catalog is `docs/agent-surface/recipes.md`; in an adopter,
read the same shipped catalog at
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md`. The catalog is the
sole owner of the bodies; copy from it, never from session notes or earlier prompts.

Every `spec:` id this skill cites is a Protocol Spec. In an adopter it is not in your graph. Read it
with `sdp q 'return g.specContext("<id>")' --root node_modules/@libar-dev/software-delivery-protocol/specs`,
or open its carrier under that directory.

At this repository root, the `sdp:q` wrapper supplies the exact self-hosting exclusions. Paste each
recipe body between the quotes:

```sh
pnpm --silent sdp:q '<body>'
```

For an adopter, select its root and exclusions explicitly:

```sh
pnpm exec sdp q '<body>' --root PATH
pnpm exec sdp q '<body>' --root PATH --exclude PATH --exclude PATH
```

The Protocol wrapper supplies the root's three exclusions; run `npm run build` first if `dist/` is
absent. Do not use `pnpm exec` in this source checkout: `exec` resolves dependency binaries, while
the package does not link itself into its own `node_modules/.bin`; an unresolved `sdp` can select
macOS's unrelated binary. Never rely on a global `sdp`. Adopters should use their chosen package
runner.

## Create and enrich

1. Read the Protocol glossary. In the Protocol repository it is `CONTEXT.md` at the root. In an
   adopter it is `node_modules/@libar-dev/software-delivery-protocol/CONTEXT.md`, separate from
   any glossary your project keeps. Then query nearby Specs with recipe 3 or 6, or with entry
   search (recipe 23) when you hold a key or a term. Do not parse the corpus by hand.
2. Create the Markdown carrier with `sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME`
   for every ratified Spec kind. That verb writes an idea-rung `.sdp.md` stub — envelope, Intent
   outcome, and the kind's empty typed heading — and refuses overwrite and invented content.
   `constraint` is the settled no-twin exception: envelope, title, and Intent only, because a bare
   `## Constraints` heading is not lawful. There is no dry-run flag;
   probe in a scratch directory if you need to inspect bytes first. PATH is cwd-relative and
   must not contain `..`. Hand-author the same shape when the scaffolder cannot express it. For a
   behavior parent with example children, a `.sdp.gherkin` carrier is a lawful per-ID alternative;
   follow `spec:carrier.gherkin-authoring`. The carrier law is `spec:decisions.carrier-ruling`; the
   envelope and section law is `spec:model.spec-sections`.
   A Spec carries one kind. If a fact straddles kinds, split it into two Specs and join them with
   the relation that preserves their distinct intents, following `spec:model.core-model`.
   After the carrier exists, `sdp validate --watch [root]` is the authoring loop: it installs the
   watcher first, then re-runs the same `validate` path from scratch on carrier create, change,
   delete, or rename. Findings print and the process stays alive; operator stop (SIGINT) exits 0.
   `--watch` is validate-only and cannot combine with `--check-clean`. The watcher ignores
   `generated`, `dist`, `node_modules`, `coverage`, dot-directories, configured `--exclude` prefixes,
   and non-carrier paths. Events during a run coalesce to one pending rerun. In this source
   checkout, invoke it through the repository `sdp` script with the three fixture exclusions; do
   not invent extra watch flags.
3. State only the rung the structure clears. Use recipe 9 for the current floor, recipe 11 for the
   lower ladder, and read `spec:validation.readiness-floor` plus
   `spec:validation.kind-evidence` for the clauses.
4. Keep local detail inline. Promote it only when it needs shared identity, binding, or independent
   review; follow `spec:decisions.content-only-sections`.
5. Give each unsettled truth its graph home, listed under "Place what is not settled" below.

### Capture a cheap idea

Run concept search (recipe 6) first and place the carrier beside the family it finds. In the
Protocol repository that normally means `specs/<family>/`; an adopter follows its own canonical
carrier root rather than inventing a second one. Prefer `sdp new spec` for every ratified kind; it
emits this exact cheap-capture shape and never invents typed content. `constraint` stops after
Intent and does not add a twin heading:

```md
---
id: spec:<family>.<name>
kind: <kind>
altitude: <altitude>
readiness: idea
relations: {}
---

# <Human-readable title>

## Intent

- outcome: <One durable intended outcome>
```

The `idea` floor is the whole shape: stable envelope coordinates plus either an outcome or a
`refines` parent. The template states the outcome explicitly so the capture remains intelligible
without its parent. Before every later human readiness edit, run promotion preflight (recipe 9);
the reported floor never makes the edit on the author's behalf.

### Write the Markdown body

The body is the H1 title, optional narrative paragraphs, and then `##` sections from the closed
set below. Every entry is one physical line that starts with `- `, however long; a wrapped or
indented continuation is refused. A section may open with paragraphs, except Constraints, which
takes its entries only. Prose after a section's first entry, fence, or H3 is refused.

| Heading                    | Entries                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `## Intent`                | `actor:`, `problem:`, `outcome:`, `value:` at most once each; `risk:` and `assumption:` any number of times        |
| `## Behavior`              | `rule:` and `flow:` entries                                                                                        |
| `## Rule`                  | plain entries, one rule each                                                                                       |
| `## Workflow`              | plain entries, one flow each, plus `rule:` entries                                                                 |
| `## Contract`              | plain entries, one rule each                                                                                       |
| `## Example space`         | one `gwt-vocabulary` fence and no entries                                                                          |
| `## Constraints`           | one constraint: `statement:` (required), `flavor:`, `target:`, `measurableBy:`, once each                          |
| `## Model`                 | `**term** — definition`, with the em dash; terms are unique                                                        |
| `## Design`                | `lowerCamelKey: one-line value`; keys are unique                                                                   |
| `## Decision`              | `context:` and `decision:` once each; `rationale:`, `alternative:`, `consequence:` repeated                        |
| `## UI`                    | the Design form                                                                                                    |
| `## Verification — <mode>` | plain entries, one criterion each; the mode is `manual`, `reviewed`, `contract`, or `executable`, after an em dash |

Intent may end with an optional `### Open questions`, the only H3 the body accepts. Each of its
entries opens with `[blocking]` or `[non-blocking]`. To cite a question from prose, give it a
lower-camel key, unique in the Spec, after `#` inside the marker: `[blocking #aggregateReach]` is
addressed as `spec:<id>#question.aggregateReach`. On an example, one `gwt` fence closes Intent.

A Spec carries at most one of Behavior, Rule, Workflow, and Contract. Leading prose may stand under
that owner or under Example space, not both. In Rule, Contract, Workflow, and Verification, open
each plain entry with more than one word before any colon. The parser reads `- Note: x` as a key
and refuses it. In Design and UI, whose keys are otherwise open, delivery-fact, edge, and
graph-field names (`implemented`, `hasVerifier`, `satisfies`, `verifies`, and the rest the grammar
lists) are refused as keys. A relation lives in the frontmatter; `dependsOn` as a Design key is
plain text and creates no edge.

The full grammar, with every refusal, is `spec:carrier.markdown-body-grammar`; each of its example
children executes one refusal. Read it when `sdp validate` refuses a carrier.

### Place what is not settled

State each of these in its graph home. The readiness floor and the catalog recipes read it there,
so it needs no extra tag, status key, or side table.

- An open question goes under Intent's `### Open questions`. A `[blocking]` entry holds the Spec
  below `defined`, the floor clause in `spec:validation.readiness-floor`.
- A deferral is a `[blocking]` open question that names its re-entry trigger, plus `dependsOn`
  when another Spec must hold first; `spec:decisions.planning-truths-placement` rules this home.
  The `defined` floor does not read the parent's readiness, so the deferred Spec's example children
  can still state `defined` once their bound points are complete and match the parent's example
  vocabulary, when it has one. The `ready` floor does read the parent's readiness, so their `ready`
  waits until the parent states `defined`.
- An unsettled fact that bounds other Specs is a `constraint` Spec whose `[blocking]` open
  question names the check that would settle it. Each Spec it bounds declares `constrainedBy`. A
  bounded Spec can still state `defined`; the floor refuses its `ready` until the constraint states
  `defined`, under `spec:validation.typed-dependency-floor`.
- A ruling that awaits its owner is a `decision` Spec below `ready`, with `decidedBy` from each
  Spec it shapes. The owner's ratification is the edit that states `ready`, under
  `spec:decisions.decision-readiness-posture`.
- A statement a test checks lives in the Spec that states it, plus an `example` Spec that
  `verifies` it. Bind the example with a `specTest` anchor, as "Make an example executable" below
  shows. The graph then derives `has-verifier` on the Spec, under
  `spec:extraction.delivery-facts`. `has-verifier` says a bound verifier exists, not that it
  passed; pass and fail stay in CI. Author no checked or verified status.
- Derive a count, a register, or a review scope each time you need it: census counts from
  `sdp census`, open questions from recipe 20, one Spec's dependencies from recipe 21, prose
  mentions from recipe 22, and a change's review scope from changed-file blast radius (recipe 4).
  In prose, name the recipe and leave the number out.

`sdp validate` checks these homes and nothing your project adds. Keep a project policy, such as a
required Design key or a naming rule, as a script in your own repository.

### Author behavior and examples in Gherkin

Use one `.sdp.gherkin` file only when every carried Spec is `behavior` or `example`. That suffix is
the only canonical Gherkin carrier. Bare `.feature` is import-source / foreign-corpus territory and
is never discovered. Renaming a carrier to `.feature` takes it out of the graph; rename it back to
`.sdp.gherkin` to restore discovery. `.sdp.gherkin` is not a Cucumber execution suffix.

Each ID still has one canonical carrier surface. Query
`spec:carrier.gherkin-authoring` for the closed grammar before authoring or
changing this syntax.

## Author a Pack

Use a Markdown `*.pack.sdp.md` manifest with frontmatter closed to `id`, `specs`, and optional
`modelRefs`. The H1 is the Pack title; the remaining body prose is its framing. Preserve authored
membership order and point to `spec:carrier.markdown-pack-authoring` for the complete carrier law.

## Bind code, tests, and oracles

Anchors are the only write path from code into the graph, and the ways to get them wrong are
silent: nothing fails, the binding just never exists. An anchor carries identity, an optional
label, its targets, and optional structure. It never carries behavior, rationale, readiness,
status, acceptance criteria, or delivery facts, and a field beyond that contract is an extraction
error. The law is `spec:model.anchors` and `spec:decisions.binding-not-liveness`. The id's
namespace selects one of three flavors:

- A code anchor (`impl:`, `api:`, `component:`) binds implementation code. Its `satisfies` is
  optional and plural; each resolving target derives a `satisfies` edge and confers `implemented`
  on that Spec. Its `references` names the Specs the code is written against and confers nothing.
- A test anchor (`test:`) binds a test through a non-empty, plural `verifies`. A resolving test
  anchor is the sole `has-verifier` source, conferring the fact directly on each Spec it verifies
  or, through an enabled example, on the Spec that example verifies.
- An oracle anchor (`oracle:`) binds an oracle through one `models` target. It records that
  expected-outcome semantics exist and confers no delivery fact.

Each anchor takes one of two forms, and both feed one closed envelope. Pick the form by what the
file may import.

### The constant form

Code that may import the package writes a top-level `const` initialized with a builder call:

```ts
import {
  codeAnchor,
  codeAnchorId,
  componentAnchorId,
  ref,
} from "@libar-dev/software-delivery-protocol";

const createOrderAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.create-order"),
  label: "realizes order creation",
  satisfies: [ref("spec:orders.create-order"), ref("spec:orders.order-numbering")],
  references: [ref("spec:orders.checkout-flow")],
  component: componentAnchorId("component:orders.api"),
  uses: [codeAnchorId("impl:orders.repository")],
  role: "service",
});
void createOrderAnchor;
```

`specTest` takes `id: testAnchorId("test:…")` and `verifies`; `specOracle` takes
`id: oracleAnchorId("oracle:…")` and `models`. `satisfies` and `verifies` take one `ref(…)` or a
fresh array literal of them; `references` and `uses` take a fresh array literal. The `void`
reference keeps the unused constant past lint without exporting it.

A runtime that may import but must not load `node:*` modules or ts-morph, such as a browser bundle
or a sandboxed function runtime, imports the same builders from the zero-dependency subpath
`@libar-dev/software-delivery-protocol/anchors`. It exports the id builders and the three anchor
builders and nothing else.

Trust comes from the import. The builder import must be a Protocol builder binding: the public
package, its `/anchors` subpath, or a relative import that resolves to the package's `ids` or
`model/code-anchor` module. A consumer-local lookalike mints nothing and reports nothing, because
a source file that never bound to the Protocol is not authoring drift to report. On the CommonJS
package surface the trusted relative-module set is empty, so relative bindings mint no anchors
there while package imports stay trusted. When a constant-form anchor fails to appear in the
graph, suspect the import before the syntax.

### The comment form

Code that may import nothing from the Protocol writes a top-level `/** … */` block in a `.ts` or
`.tsx` file, carrying reserved `@sdp` tags. No import is required:

```ts
/**
 * Rebuilds the read model from the event history, one stream at a time.
 *
 * @sdpAnchor impl:orders.read-model-rebuild
 * @sdpLabel the online rebuild path
 * @sdpSatisfies spec:orders.rebuild
 * @sdpReferences spec:orders.history-view, spec:orders.read-model
 * @sdpComponent component:orders.read-model
 * @sdpUses impl:orders.event-store, impl:orders.projection-gate
 * @sdpRole service
 */
export async function rebuild(stream: string): Promise<void> {
  await replay(stream);
}
```

- `@sdpAnchor <id>` opens the anchor, once per block, and its namespace selects the flavor.
- Target tags by flavor: `@sdpSatisfies` and `@sdpReferences` on a code anchor, `@sdpVerifies` on
  a test anchor, `@sdpModels` with one target on an oracle anchor. A list is comma-separated,
  non-empty, and repeats no target.
- Structure tags, code anchors only: `@sdpComponent`, `@sdpUses`, `@sdpRole`; a `component:`
  anchor also takes `@sdpLayer` and `@sdpContext`. `@sdpLabel` fits any flavor.
- Prose comes first and authors nothing. After the first tag every non-empty line is a tag, so a
  target wrapped onto a second line is refused rather than read as prose. Each tag appears at most
  once.
- Any other `@sdp` tag, a block with tags and no `@sdpAnchor`, and a tag inside a function body, a
  class member, or an object literal are errors. A comment that opens with `/*` alone is never
  read.
- The block's first line is the binding's file and line, so `byFile` on the source file names the
  anchor. The same id written in both forms is a duplicate id.

The law is `spec:decisions.anchor-comment-form`. The decorator form stays an unextracted
representation and mints nothing.

### Choose targets honestly

`satisfies` claims the code realizes the Spec and confers `implemented`. `references` says the
code is written against the design and confers nothing: no delivery fact, no readiness floor, no
drift alarm. A target named in both is an error. A code anchor with neither is identity-only and
lawful; it mints a code unit for structure and for `byFile`, and confers nothing. Never point
`satisfies` at an unfinished Spec to manufacture coverage: a unit written against such a Spec, a
stub included, references it. Code never satisfies a decision Spec directly, and it may reference
one. The law is `spec:decisions.anchor-binding-grain`.

### Declare architecture where it is realized

- `component` names the one `component:` anchor a unit belongs to, and `uses` lists the units or
  components it depends on. Both are closed graph-ID references that must resolve to an existing
  code unit, and they derive only anchored `memberOf` and `uses` edges. `memberOf` runs from an
  `impl:` or `api:` unit to a `component:` unit, at most one per source. A present `uses` is
  non-empty and unique, and structural self-reference is refused. Multi-node `uses` cycles remain
  data, never findings. There is no `implements` field; contract realization stays `satisfies`.
- `role` names the architectural pattern the unit plays, on any code anchor. The corpus owns the
  vocabulary: `service`, `decider`, `projection`, `read-model`, `codec`, `contract`, `barrel`, and
  `utility` are the lineage set, not a closed list. A value is one lowercase kebab token matching
  `^[a-z][a-z0-9-]*$` and is never normalized, so `readModel` is refused rather than folded into
  `read-model`.
- `layer` goes on a `component:` anchor only and takes one of five values:
  - `edge`: the transport and presentation boundary.
  - `application`: use cases and orchestration.
  - `domain`: the model and its rules.
  - `adapter`: the implementations of ports toward external systems.
  - `infrastructure`: runtime, persistence, and platform plumbing.
- `context` goes on a `component:` anchor only and names its bounded context, in the token grammar
  a role uses.

A malformed or non-static structural field, an unknown `layer`, or `layer` or `context` on a
non-component anchor refuses the whole anchor. Every structural field is optional, and none
confers intent, a delivery fact, or a readiness effect. A component that no code realizes yet is a
Spec, never an invented anchor. A package may hold several layers or contexts, so map packages to
components by review rather than one component per package. Run roles, layers and contexts
(recipe 28) to see the values in use before you add one. The law is
`spec:decisions.architectural-annotation`.

### Curate the anchors

Annotations are curated, never a coverage quota. Anchor the units that carry the architecture, its
exported public surface and its cross-component reach, and leave the rest bare. An identity has
one owner: one anchor per realizing unit, so an identity that would stand for several files
becomes several identities, each choosing `satisfies` or `references` for what its own code does.
A realizing unit's comment documents its local how, never a paraphrase of the Spec's what or why;
the Spec already owns those, and a restatement in code is a second owner that drifts.

A Markdown deliverable cannot carry an in-code anchor. Bind it through the document-realization
convention: the test suite that asserts the shipped document carries the code anchor, its label
names the document realization rather than the test body, and file-level blast radius stays
coverage-unknown for the Markdown file. This repository binds its own skills exactly this way in
`test/skills.test.ts`.

## Make an example executable

1. Put the typed `gwt-vocabulary` example space on the parent.
2. Put one concrete `gwt` bound point on each example child, following
   `spec:decisions.point-per-example`.
3. Generate contracts and registrars from the extraction root. In this source checkout use the
   repository scripts, which supply the three fixture exclusions:

   ```sh
   npm run generate:self-hosting
   npm run generate:example
   pnpm --silent sdp build . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
   ```

   The `sdp` script is the same verb with the exclusions written out. In an adopter, select that
   repository's root and exclusions:

   ```sh
   pnpm exec sdp build .
   ```

   Diagnose contract refusals from `sdp build`; `sdp q` receives graph-validation findings, not
   codegen findings.

   The build emits one registrar per bindable example, named `<spec-id-path>.test.generated.ts`
   and placed beside the authored suite whose `specTest` anchor verifies that example; the Spec ID
   owns the filename, so one consolidated suite can bind many examples without collisions.
   Repository generation also publishes the independent Design Review, census, Mermaid, and
   Gherkin-shaped read roots. Use the repository generate/check scripts to certify the complete
   projection suite; do not treat the Gherkin read root as an authored carrier.

4. Author the oracle for the space and bind it with a top-level `specOracle` anchor whose `models`
   names the parent. Eligibility follows example-space ownership, not kind: a missing target, a
   wrong namespace, an absent space, or a competing oracle is a conformance error, and consumers
   fail closed. Type the oracle against the generated space contract and treat `unspecified` as a
   first-class answer. Follow `spec:validation.oracle-target-eligibility`.
5. Activate the registrar from the authored suite. Keep one top-level `specTest` anchor with a
   non-empty `verifies` naming the example. Import the generated registrar sibling and make one
   activation call passing the five adapters: `createWorld`, `invoke`, `observe`, `expected`, and
   optional `assertions`. Import direction is authored to generated only; the generated module never
   imports authored code. The registrar owns runner registration, step dispatch, the three-way
   comparator, and failure rendering. The law is `spec:extraction.runnable-modules`.
6. Commit an adopted registrar. A registrar becomes adopted the moment tracked authored code
   imports it, and adopted registrars are committed and byte-checked against fresh generation;
   unadopted siblings stay ignored, regenerable output. The law is
   `spec:decisions.adopted-registrars-committed`. In this repository, listing every suite that
   imports a generated contract, adopted registrar siblings included, in
   `contract-dependent-suites.mjs` is part of binding.
7. Mutate one expected result and prove the new point goes red, then restore it. A Spec mutation
   must redden through the comparator, never through actual-equals-oracle alone. Keep runner
   execution and pass state outside the graph.

`bindExample(generatedContract, world, bindings)` from the `./vitest` subpath is the low-level
adapter beneath the registrar. Reach for it only when the registrar cannot serve.

The graph can report a resolving `specTest` binding. It cannot detect a generated contract or
registrar that no authored suite activates, because activation call sites are not extracted graph
data.

Ready examples normally carry verification evidence rather than build-backlog work. The canonical
backlog recipe excludes them while reporting their count and any missing verifier binding; it does
not infer `implemented` through their parent.

## Review and state ready

Regenerate the Design Review, inspect the Spec in context, and run recipes 7–11. Tooling never
confers `ready`: after the floor clears and the evidence is reviewed, a human may state it by
editing the canonical carrier.

The graph outranks this skill. If a recipe or instruction disagrees with current graph data or a
carrying Spec, report the skill as drift and follow the graph and Spec.
