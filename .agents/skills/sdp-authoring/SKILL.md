---
name: sdp-authoring
description: Author and mature Protocol Specs through the graph-first workflow. Use when creating or editing `.sdp.md` or lawful `.sdp.gherkin` carriers, deciding the honest readiness rung, promoting inline content, generating executable contracts, binding examples or implementation anchors, mutation-probing evidence, or preparing a Spec for human review and a `ready` statement.
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

The Protocol wrapper supplies the root's three exclusions. Run `npm run build` first if `dist/` is
absent. Do not use `pnpm exec` in this source checkout: the package does not link itself into its own
`node_modules/.bin`, so resolution can select an unrelated binary. Never rely on a global `sdp`;
adopters use their chosen package runner.

## Create and enrich

1. Read `CONTEXT.md`, then query nearby Specs with recipe 3 or 6. Do not parse the corpus by hand.
2. Create the Markdown carrier with `sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME`
   for every ratified Spec kind. It writes an idea-rung `.sdp.md` stub with an envelope, Intent
   outcome, and empty typed heading, and it refuses overwrites and invented content. `constraint`
   is the no-twin exception: it gets only the envelope, title, and Intent because a bare
   `## Constraints` heading is unlawful. There is no dry-run flag; inspect bytes in a scratch
   directory. PATH is cwd-relative and must not contain `..`. Hand-author the same shape when the
   scaffolder cannot express it.
   Follow `spec:decisions.carrier-ruling`, `spec:model.spec-sections`, and
   `spec:carrier.gherkin-authoring` for carrier, section, and Gherkin law. A Spec carries one kind.
   If a fact straddles kinds, split it into two Specs and relate their distinct intents as described
   by `spec:model.core-model`.
   After creating the carrier, run `sdp validate --watch [root]`. It installs the watcher before
   validation and reruns validation on carrier creation, change, deletion, or rename. Findings do
   not stop the watcher; SIGINT exits 0. `--watch` is validate-only and cannot combine with
   `--check-clean`. It ignores `generated`, `dist`, `node_modules`, `coverage`, dot-directories,
   configured `--exclude` prefixes, and non-carrier paths, and coalesces events during a run. In
   this checkout, use the repository `sdp` script with its three fixture exclusions; do not invent
   watch flags.
3. State only the rung the structure clears. Use recipe 9 for the current floor, recipe 11 for the
   lower ladder, and read `spec:validation.readiness-floor` plus
   `spec:validation.kind-evidence` for the clauses.
4. Keep local detail inline. Promote it only when it needs shared identity, binding, or independent
   review; follow `spec:decisions.content-only-sections`.
5. Put unresolved durable questions under Intent. A blocking question honestly keeps the Spec
   below `defined`.

### Capture a cheap idea

Run concept search (recipe 6), then place the carrier beside the family it finds. In the Protocol
repository that normally means `specs/<family>/`; an adopter uses its canonical carrier root.
`sdp new spec` emits this cheap-capture shape without inventing typed content. For `constraint`, it
stops after Intent and adds no twin heading:

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

Use one `.sdp.gherkin` file only when every carried Spec is `behavior` or `example`. It is the only
canonical Gherkin suffix; bare `.feature` is foreign import source and is not discovered. Renaming a
carrier to `.feature` removes it from the graph; renaming it back restores discovery.
`.sdp.gherkin` is not a Cucumber execution suffix.

Each ID has one canonical carrier surface. Query `spec:carrier.gherkin-authoring` for the closed
grammar before changing this syntax.

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

   Repository generation also publishes the Design Review, census, Mermaid, and Gherkin-shaped
   read roots. Use the repository generate/check scripts to certify the projection suite; the
   Gherkin read root is not an authored carrier.

4. In the verifier suite, colocate `bindExample(generatedContract, world, bindings)` with a
   `specTest` anchor targeting that example. In this repository, registering every suite that
   imports a generated contract in `contract-dependent-suites.mjs` is part of binding.
5. Mutate one expected result and prove the new point goes red, then restore it. Keep runner
   execution and pass state outside the graph.

The graph can report a resolving `specTest` binding. It cannot detect a generated contract that no
suite binds because `bindExample` call sites are not extracted graph data.

Ready examples carry verification evidence, not build-backlog work. The canonical backlog excludes
them, reports missing verifier bindings, and does not infer `implemented` through their parent.

## Bind implementation and review

Add an identity-only `codeAnchor` beside the code that realizes the Spec, following
`spec:decisions.binding-not-liveness` and `spec:model.anchors`. It names one target and never carries
intent, readiness, or runtime truth.

Regenerate the Design Review, inspect the Spec in context, and run recipes 7–11. Design Review
provides context without becoming a gate. Tooling never confers `ready`; after the floor clears and
the evidence is reviewed, a human may state it in the canonical carrier.

The graph outranks this skill. If a recipe or instruction disagrees with current graph data or a
carrying Spec, report the skill as drift and follow the graph and Spec.
