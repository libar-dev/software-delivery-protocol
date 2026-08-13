---
name: sdp-authoring
description: Author and mature Protocol Specs through the graph-first workflow. Use when creating or editing `.sdp.md` or lawful `.feature` carriers, deciding the honest readiness rung, promoting inline content, generating executable contracts, binding examples or implementation anchors, mutation-probing evidence, or preparing a Spec for human review and a `ready` statement.
---

# Author Specs through the graph

Treat the canonical carrier as the write surface and the derived graph as the read model. Start every
session with the build-backlog and drift-alarm recipes. In the Protocol repository the catalog is
`docs/agent-surface/recipes.md`; in an adopter, read the same shipped catalog at
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md`.

At this repository root, use the exact self-hosting exclusions:

```sh
pnpm --silent sdp:q 'const ready = g.specs().filter((spec) => spec.statedReadiness === "ready"); const backlog = ready.filter((spec) => spec.specKind !== "example" && spec.specKind !== "decision" && !spec.deliveryFacts.includes("implemented")); const excludedExamples = ready.filter((spec) => spec.specKind === "example" && !spec.deliveryFacts.includes("implemented")); const excludedDecisions = ready.filter((spec) => spec.specKind === "decision" && !spec.deliveryFacts.includes("implemented")); return {backlog: backlog.map((spec) => spec.id), excludedReadyExamples: excludedExamples.length, excludedWithoutVerifier: excludedExamples.filter((spec) => !spec.deliveryFacts.includes("has-verifier")).map((spec) => spec.id), excludedReadyDecisions: excludedDecisions.length}'
pnpm --silent sdp:q 'return g.specs().filter((spec) => spec.deliveryFacts.includes("implemented") && spec.statedReadiness !== "ready").map((spec) => spec.id)'
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
2. Create the Markdown carrier with one stable `spec:` id, title, kind, altitude, readiness, and
   relations. For a behavior parent with example children, a `.feature` carrier is a lawful per-ID
   alternative; follow `spec:carrier.gherkin-authoring`. The carrier law is
   `spec:decisions.carrier-ruling`; the envelope and section law is `spec:model.spec-sections`.
   A Spec carries one kind. If a fact straddles kinds, split it into two Specs and join them with
   the relation that preserves their distinct intents, following `spec:model.core-model`.
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
carrier root rather than inventing a second one. This is the complete cheap-capture shape:

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

Use one `.feature` file only when every carried Spec is `behavior` or `example`. The closed
carrier grammar is:

1. One Feature is the behavior Spec; ordinary Scenarios are example Specs.
2. Feature and Scenario tags carry exactly one `@spec.<id>`, `@altitude.<value>`, and
   `@readiness.<value>`; kind is structural and Pack membership stays manifest-owned.
3. Relation tags are only `@refines.`, `@depends-on.`, `@constrained-by.`, `@decided-by.`, and
   `@verifies.`; Scenario nesting supplies missing `refines` and `verifies` relations.
4. Keyed description lines populate existing intent and verification fields; remaining prose is
   narrative. Unknown keys, heading-shaped lines, and open-question syntax are refused.
5. Trailing title-only Rule blocks populate behavior rules; tagged, described, or nested Rules are
   refused.
6. At most one `@example-space` Scenario supplies parent vocabulary without creating a node.
7. Steps use Protocol slot notation and inherited And/But phases; outlines, backgrounds, star
   steps, doc strings, data tables, and leading conjunctions are refused.
8. Delivery-fact, claim, lifecycle, and workflow tags are refused. `.feature` is not a Cucumber
   execution path; generated contracts and resolving code-side anchors remain the boundary.

Each ID still has one canonical carrier surface. Query
`spec:carrier.gherkin-authoring` before authoring or changing this syntax.

## Author a Pack

Use a Markdown `*.pack.sdp.md` manifest with frontmatter closed to `id`, `specs`, and optional
`modelRefs`. The H1 is the Pack title; the remaining body prose is its framing. Preserve authored
membership order and point to `spec:carrier.markdown-pack-authoring` for the complete carrier law.

## Make an example executable

1. Put the typed `gwt-vocabulary` example space on the parent.
2. Put one concrete `gwt` bound point on each example child, following
   `spec:decisions.point-per-example`.
3. Generate contracts from the extraction root. In this source checkout use the repository
   scripts, which supply the three fixture exclusions:

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

4. In the verifier suite, colocate `bindExample(generatedContract, world, bindings)` with a
   `specTest` anchor targeting that example. In this repository, registering every suite that
   imports a generated contract in `contract-dependent-suites.mjs` is part of binding.
5. Mutate one expected result and prove the new point goes red, then restore it. Keep runner
   execution and pass state outside the graph.

The graph can report a resolving `specTest` binding. It cannot detect a generated contract that no
suite binds because `bindExample` call sites are not extracted graph data.

Ready examples normally carry verification evidence rather than build-backlog work. The canonical
backlog recipe excludes them while reporting their count and any missing verifier binding; it does
not infer `implemented` through their parent.

## Bind implementation and review

Add a `codeAnchor` beside the code that realizes the Spec, following
`spec:decisions.binding-not-liveness` and `spec:model.anchors`. An anchor states identity and one
target only; it never carries intent, readiness, or runtime truth.

Regenerate the Design Review, inspect the Spec in context, and run recipes 7–11. Tooling never
confers `ready`: after the floor clears and the evidence is reviewed, a human may state it by
editing the canonical carrier.

The graph outranks this skill. If a recipe or instruction disagrees with current graph data or a
carrying Spec, report the skill as drift and follow the graph and Spec.
