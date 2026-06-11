# checkout-v1 — the worked example

The MVP bounded context: **Order Management**, modeled as `pack:checkout-v1` — nine `Spec`s, one
`Pack`, three anchors. It exists to prove the loop end-to-end on one small, honest slice: author
delivery intent as typed code, bind the implementing code and tests with anchors, derive **the one
graph**, run the conformance + honesty checks, and read the generated Design Review. It is also
the tracer bullet: if this example stops typechecking or extracting, the DSL or the extractor is
wrong — not the example.

This walkthrough shows what is here and how to watch the trust model react. The concepts live in
[`docs/concept/`](../../docs/concept/README.md); the vocabulary in the
[ubiquitous language](../../docs/concept/ubiquitous-language.md). Nothing here is restated — only
pointed at.

## The layout

- **`specs/`** — the **authored model**: one `Spec` per `*.sdp.ts` file, plus the pack manifest
  (`checkout.pack.sdp.ts`). The familiar delivery nouns appear as **named coordinates on the one
  primitive**, never separate types: a `behavior` epic (`order-management`), a `behavior` feature
  (`create-order`), two `example` stories (`valid-cart`, `invalid-cart`), two `rule`s, one
  `constraint` (the latency NFR), one `model` (the domain vocabulary), and one `decision` record.
  Every spec states its own `readiness`; the checks only verify the stated rung is structurally
  earned.
- **`src/`** — the implementation, carrying two **anchors**: `impl:orders.create-order-use-case`
  on the use-case and `api:orders.post` on the route. An anchor is a binding only — "this code
  location is the implementation binding for this Spec ID" — never intent; each yields a
  `satisfies` edge with `claim: "anchored"`.
- **`test/`** — the runner test plus the **test anchor** (`specTest`) that binds it to
  `spec:orders.create-order.valid-cart`. That binding is what makes the valid-cart example an
  **enabled verifier**, which in turn confers the derived `has-verifier` delivery fact on its
  target.

## The walk

Build the CLI once from the repo root, then run the pipeline (each command subsumes the previous
stage):

```sh
npm run build
node ./dist/cli/sdp.js build    examples/checkout-v1   # extract → generated/graph.json
node ./dist/cli/sdp.js validate examples/checkout-v1   # build + conformance & honesty checks
node ./dist/cli/sdp.js view     examples/checkout-v1   # validate + the Design Review
```

`build` prints the extraction summary and writes the one graph — flat nodes and edges, every one
carrying its `claim` (`declared` / `anchored` / `inferred`, never collapsed):

```
9 specs · 1 packs · 3 anchors → 13 nodes · 25 edges (0 errors, 0 warnings)
```

`validate` runs the checks over that graph — one validation path — and reports **0 errors and
exactly 1 warning**:

```
specs/orders/create-order-invalid-cart.sdp.ts — [warning] conformance/verifies-linkage —
Example "spec:orders.create-order.invalid-cart" declares verifies → "spec:orders.create-order"
but is not an enabled verifier — no test anchor binds it …
```

The warning is **deliberately kept**. `invalid-cart` declares that it verifies its parent, but no
test anchor binds it yet — the spec↔test trace is incomplete, and the graph says so instead of
pretending. This is the honesty posture in one line: a surfaced absence is informative, never a
gate (the exit code stays 0).

`view` regenerates `generated/design-review/` wholesale — an index plus one page per spec and
pack, all pure projections of the graph. Open
`generated/design-review/spec/orders.create-order.md` and look for:

- **binding language, never liveness** — "Implementation binding: present · Verifier binding:
  present · Runtime observation: not tracked";
- **`claim` cues** — the example's own `verifies` is `[declared]`; the test anchor's is
  `[anchored]`; the enabled verifier (`valid-cart`) is distinguished from the unenabled one
  (`invalid-cart`);
- **stated vs derived readiness** — every spec here states `defined` while structurally clearing
  `ready`; the honest direction renders as plain header information, no banner;
- **Relations & impact (one hop)** — the relation list read as the blast radius of changing this
  spec.

Determinism is checkable, not promised: `--check-clean` on any command runs the pipeline twice
independently and fails on a single divergent byte — `npm run check:example` gates CI on exactly
this over this example. Deleting `generated/` and rerunning reproduces the same bytes, and so
does the pipeline run from a copy at a different absolute path — both pinned in the test suite,
which CI also gates.

## Break it on purpose

The fastest way to understand the checks is to trip them. Each experiment is one edit; revert
with `git checkout -- examples/checkout-v1` afterwards.

- **Dangle a reference.** In `specs/orders/create-order.sdp.ts`, misspell the `refines` target
  (e.g. `spec:orders.order-managment`). `validate` exits 1 with
  `conformance/referential-integrity` — and suggests the id you meant.
- **State readiness you haven't earned.** Add a blocking open question to `create-order`'s
  intent — `openQuestions: [{ question: "Do guest carts create orders?", blocking: true }]` —
  while it states `defined`. `validate` exits 1 with `honesty/readiness-floor`, naming the
  failing clause (`no-blocking-open-questions`): readiness is stated by the author, checked
  against the floor.
- **Unbind the test.** Delete the `specTest` anchor from
  `test/orders/create-order.valid-cart.test.ts`. The valid-cart example stops being an enabled
  verifier, the parent loses its verifier binding, and a second `conformance/verifies-linkage`
  warning appears — still exit 0, because a missing verifier is a surfaced gap, never a gate.
- **Hand-author a delivery fact.** Add `"has-verifier": true` inside any section of a spec. The
  closed section types reject it (`npm run typecheck:examples` fails), and even smuggled past the
  types it fails `validate` with `honesty/authoring-shape` — delivery facts are derived, never
  authored.

## Where the concepts live

| Concept                                                | Read                                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| the vocabulary (every term used above)                 | [ubiquitous language](../../docs/concept/ubiquitous-language.md)                   |
| the `Spec` primitive, descriptors, sections, relations | [`02` core model](../../docs/concept/02-core-model.md)                             |
| the one graph, determinism, the `claim` taxonomy       | [`03` the one graph](../../docs/concept/03-the-one-graph.md)                       |
| the DSL and anchors (authoring & binding)              | [`04` authoring & binding](../../docs/concept/04-authoring-and-binding.md)         |
| the checks and the readiness floor                     | [`05` validation & honesty](../../docs/concept/05-validation-and-honesty.md)       |
| the reader, the Design Review, the agent surface       | [`06` consumers & projections](../../docs/concept/06-consumers-and-projections.md) |
