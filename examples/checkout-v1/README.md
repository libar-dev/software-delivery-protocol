# checkout-v1 — the worked example

The MVP bounded context: **Order Management**, modeled as `pack:checkout-v1` — eleven `Spec`s, one
`Pack`, five anchors. It exists to prove the loop end-to-end on one small, honest slice: author
delivery intent in its canonical carrier, bind the implementing code, the test, and the oracle with anchors,
derive **the one graph**, generate the step and space contracts off it, run the conformance +
honesty checks, execute the bound example, and read the generated Design Review. It is also the
tracer bullet: if this example stops extracting or validating, the carrier or the extractor is
wrong — not the example.

This walkthrough shows what is here and how to watch the trust model react. The concepts live in
[`docs/concept/`](../../docs/concept/README.md); the vocabulary in the
[ubiquitous language](../../CONTEXT.md). Nothing here is restated — only
pointed at.

## The layout

- **`specs/`** contains the **authored model**. Each `Spec` is now one `*.sdp.md` file. The Pack
  manifest remains `checkout.pack.sdp.ts`: Packs remain TS until a Pack syntax ruling.

  All eight `kind`s appear here as named coordinates on one primitive. The `create-order` parent
  owns the example space, and its child examples bind full or partial points in that space.

  Every Spec states its `readiness`, from `idea` through `ready`. Checks verify that the stated
  rung is structurally earned.

- **`src/`** holds three implementation anchors. Anchors bind a code location to a Spec ID, never
  intent, so their `satisfies` edges carry `claim: "anchored"`.

- **`test/`** holds the executable half. The valid-cart test anchor makes that example an enabled
  verifier, while generated step and space contracts keep the test and oracle aligned with the
  authored example space.

- **`generated/`** is untracked output from the walk: `graph.json`, contracts, and the Design
  Review. It is regenerable and never edited by hand.

## The walk

The checkout Markdown surface was produced by `sdp import` during the migration.

`sdp import` remains the verb for any future per-ID TypeScript-to-Markdown move. Specs default to
Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a
lawful per-ID option.

Build the CLI once from the repo root, then run the pipeline. Each command includes the stage
before it:

```sh
npm run build
node ./dist/cli/sdp.js build    examples/checkout-v1   # extract, graph, and contracts
node ./dist/cli/sdp.js validate examples/checkout-v1   # build, conformance, and honesty checks
node ./dist/cli/sdp.js view     examples/checkout-v1   # validate and the Design Review
```

`build` prints an extraction summary and writes the one graph. Its flat nodes and edges retain
their `claim`, `declared`, `anchored`, or `inferred`, without collapsing them:

```
11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
```

Beside the graph it writes three modules in `generated/contracts/`: a step contract for each
`example` Spec and one parent space contract. They are graph projections, keyed by Spec ID, never
authored modules.

The executable half runs off those contracts:

```sh
npx vitest --run examples/checkout-v1/test   # the bound example passes
npm run typecheck:examples                   # the drift pins hold
```

The generated valid-cart contract drives the assertion. Changing a Markdown value or step can fail
the test or reject a stale handler key without changing the test.

The oracle is typed against the same space, while outcome faithfulness stays human-reviewed.

`validate` runs one validation path over the graph. It reports **0 errors and exactly 1 warning**:

```
specs/orders/create-order-invalid-cart.sdp.md — [warning] conformance/verifies-linkage —
Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order"
but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete
and it confers no has-verifier.
validate: 0 errors · 1 warnings (conformance + honesty over the one graph)
```

The warning is deliberate. `invalid-cart` declares that it verifies its parent, but no test anchor
binds it. The graph reports the incomplete trace, and the exit code stays 0 because this absence is
informative rather than a gate.

`view` regenerates `generated/design-review/`: an index and one page per Spec and Pack. Open
`generated/design-review/spec/orders.create-order.md` and look for:

- **binding, never liveness**: implementation and verifier bindings are present, while runtime
  observation is not tracked.

- **the rendered example space**: each child page shows its full or partial bound point.

- **`claim` cues**: implementation bindings are `[anchored]`; declared example verification stays
  `[declared]`; valid-cart is enabled and invalid-cart is not.

- **stated and derived readiness**: the rungs remain honest, including valid-cart at `ready` and
  the API contract at `idea` with its blocking open question.

- **relations and one-hop impact**: the relation list is the blast radius of changing this Spec.

`--check-clean` runs the pipeline twice and rejects any divergent byte across the graph, contracts,
and review. `npm run check:example` gates that determinism. Delete `generated/` and rerun to
reproduce the same bytes.

## Break it on purpose

The fastest way to understand the checks is to trip them. Each experiment edits a `.sdp.md` Spec.
Revert the edit afterwards. The next `build` regenerates `generated/`.

- **Use an unknown heading.** In `specs/orders/order-total-rule.sdp.md`, change `## Rule` to
  `## Rul`. `validate` exits 1 with `extract/unrecognized-heading` and suggests `Rule`.

- **Dangle a reference.** In `specs/orders/create-order.sdp.md`, misspell the frontmatter
  `refines` target, such as `spec:orders.order-managment`. `validate` exits 1 with
  `conformance/referential-integrity` and suggests the intended ID.

- **State readiness you have not earned.** In `specs/orders/create-order.sdp.md`, add a blocking
  open question under `## Intent` while the Spec states `defined`.

  `validate` exits 1 with `honesty/readiness-floor` and the `no-blocking-open-questions` clause.

- **Drift an authored value.** In `specs/orders/create-order-valid-cart.sdp.md`, change
  `{total: 100}` to `{total: 120}`, run `build`, then run the bound test.

  It fails without a test edit because the generated contract supplies `params.total`.

- **Unbind a slot.** In the same Markdown Spec, change `{n: 2}` to `{n}`. `validate` exits 1 with
  `honesty/readiness-floor`, citing `kind-evidence-complete`, and contract generation withholds
  that example's step contract.

## Where the concepts live

| Concept                                                  | Read                                                                               |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| the vocabulary (every term used above)                   | [ubiquitous language](../../CONTEXT.md)                                            |
| the executable half (contracts · example space · oracle) | [ubiquitous language — "The executable half"](../../CONTEXT.md)                    |
| the DSL and anchors (authoring & binding)                | [`04` authoring & binding](../../docs/concept/04-authoring-and-binding.md)         |
| the checks and the readiness floor                       | [`05` validation & honesty](../../docs/concept/05-validation-and-honesty.md)       |
| the reader, the Design Review, the agent surface         | [`06` consumers & projections](../../docs/concept/06-consumers-and-projections.md) |
