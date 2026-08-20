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

At this repository root, the wrapper supplies the exact self-hosting exclusions:

```sh
pnpm --silent sdp:q 'return g.specs().length'
```

For an adopter, select its root and exclusions explicitly:

```sh
pnpm exec sdp q 'return g.specs().map((spec) => spec.id)' --root PATH
pnpm exec sdp q 'return g.specs().map((spec) => spec.id)' --root PATH --exclude PATH --exclude PATH
```

The Protocol wrapper supplies the root's three exclusions; run `npm run build` first if `dist/` is
absent. Do not use `pnpm exec` in this source checkout: `exec` resolves dependency binaries, while
the package does not link itself into its own `node_modules/.bin`; an unresolved `sdp` can select
macOS's unrelated binary. Never rely on a global `sdp`. Adopters should use their chosen package
runner.

## Create and enrich

1. Read `CONTEXT.md`, then query nearby Specs with recipe 3 or 6. Do not parse the corpus by hand.
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
5. Put unresolved durable questions under Intent. A blocking question honestly keeps the Spec
   below `defined`.

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

Anchors are the only write path from code into the graph, and the two ways to get them wrong are
both silent. Learn the hazards before the builders.

Three builders exist, each carrying identity, an optional label, and one realization target:

- `codeAnchor` binds implementation code through `satisfies`, with IDs in the `impl:`, `api:`, or
  `component:` namespaces.
- `specTest` binds a test through a non-empty `verifies`, in the `test:` namespace. A resolving
  `specTest` anchor is the sole `has-verifier` source.
- `specOracle` binds an oracle through `models`, in the `oracle:` namespace. It records that
  expected-outcome semantics exist and confers no delivery fact.

The first hazard is form. The extractor reifies only the anchor-constant form: a top-level `const`
initialized with the builder call. The decorator and JSDoc forms remain unextracted representations
and mint nothing.

The second hazard is trust. The builder import must be a Protocol builder binding: from the public
package, or from a relative import that resolves to the package's `ids` or `model/code-anchor`
module. A consumer-local lookalike mints nothing and reports nothing, because a source file that
never bound to the Protocol is not authoring drift to report. On the CommonJS package surface the
trusted relative-module set is empty, so relative bindings mint no anchors there while package
imports stay trusted. When an authored anchor fails to appear in the graph, suspect the import
before the syntax.

An anchor never carries behavior, rationale, readiness, acceptance criteria, or delivery facts; a
field beyond that contract is an extraction error. The law is `spec:model.anchors` and
`spec:decisions.binding-not-liveness`.

A `codeAnchor` may also declare structure through two fields: one `component?: ComponentAnchorId`
and a non-empty, unique `uses?: readonly CodeAnchorId[]`. Both are closed graph-ID references that
must resolve to an existing `CodeNode`, and they derive only anchored `memberOf` and `uses` edges.
`memberOf` runs from an `impl:` or `api:` node to a `component:` node with at most one component
per source, structural self-reference is refused, and a malformed structural field refuses the whole
anchor. There is no `implements` field; contract realization stays `satisfies`. Multi-node `uses`
cycles remain data, never findings, and structural edges confer no intent, delivery fact, or
readiness effect. The law is `spec:decisions.structural-anchor-semantics`.

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

   The build emits one `*.generated.ts` registrar sibling per bindable example, keyed by Spec ID.
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
