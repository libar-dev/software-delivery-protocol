# checkout-v1 — the worked example

The MVP bounded context: **Order Management**, modeled as `pack:checkout-v1` — eleven `Spec`s, one
`Pack`, five anchors. It exists to prove the loop end-to-end on one small, honest slice: author
delivery intent as typed code, bind the implementing code, the test, and the oracle with anchors,
derive **the one graph**, generate the step and space contracts off it, run the conformance +
honesty checks, execute the bound example, and read the generated Design Review. It is also the
tracer bullet: if this example stops typechecking or extracting, the DSL or the extractor is
wrong — not the example.

This walkthrough shows what is here and how to watch the trust model react. The concepts live in
[`docs/concept/`](../../docs/concept/README.md); the vocabulary in the
[ubiquitous language](../../CONTEXT.md). Nothing here is restated — only
pointed at.

## The layout

- **`specs/`** — the **authored model**: one `Spec` per `*.sdp.ts` file, plus the pack manifest
  (`checkout.pack.sdp.ts`). The familiar delivery nouns appear as **named coordinates on the one
  primitive**, never separate types — all eight `kind`s are on disk: a `behavior` epic
  (`order-management`), a `workflow` feature (`order-placement-flow`), a `behavior` feature
  (`create-order`), two `example` stories (`valid-cart`, `invalid-cart`), a `contract` story
  (`api-contract`), two `rule`s, one `constraint` (the latency NFR), one `model` (the domain
  vocabulary), and one `decision` record. The `create-order` parent owns the **example space** —
  the typed step vocabulary its steps declare (`{n:number}` ·
  `{availability:"in stock"|"out of stock"}`) — and its two `example` children each bind a
  **bound point** in that space: `valid-cart` binds every slot it uses (`{n: 2}` … `{total: 100}`),
  `invalid-cart` binds the partial point `{n: 0}` — partial is honest, because an unused step
  binds nothing and fails nothing. Every spec states its own `readiness`, and the stated rungs
  span the ladder (`idea` · `scoped` · `defined` · `ready`); the checks only verify the stated
  rung is structurally earned.
- **`src/`** — the implementation, carrying three **anchors**: `impl:orders.create-order-use-case`
  and `impl:orders.order-total` on the use-case file (anchors bind per spec, never per file) and
  `api:orders.post` on the route. An anchor is a binding only — "this code location is the
  implementation binding for this Spec ID" — never intent; each yields a `satisfies` edge with
  `claim: "anchored"`.
- **`test/`** — the executable half, on three files. The bound test
  (`create-order.valid-cart.test.ts`) carries the **test anchor** (`specTest`) that binds it to
  `spec:orders.create-order.valid-cart` — the binding that makes the valid-cart example an
  **enabled verifier** and confers the derived `has-verifier` delivery fact — and binds the
  _generated_ **step contract** with `bindExample` (the `/vitest` adapter): handlers keyed by the
  literal step text, parameter values flowing from the spec. The oracle
  (`create-order.oracle.ts`) is the authored `expected()` semantics over the parent's example
  space, typed against the generated **space contract** on both sides — Conditions in, the
  Outcome union out, `unspecified` a first-class answer — with a **`specOracle` anchor**
  (`oracle:orders.create-order`) recording only that the oracle _exists_ (a `models` edge,
  `claim: "anchored"`); what it _says_ is implementation-side authored code, never extracted.
  `drift-pins.ts` pins eight drift cases as `@ts-expect-error` tripwires — compile-time
  regression tests for the drift alarm.
- **`generated/`** — the derived artifacts (untracked; the walk below produces them): the one
  graph (`graph.json`), the contracts (a step contract per `example` spec + the per-parent space
  contract), and the Design Review — all regenerable, never edited.

## The walk

Build the CLI once from the repo root, then run the pipeline (each command subsumes the previous
stage):

```sh
npm run build
node ./dist/cli/sdp.js build    examples/checkout-v1   # extract → generated/graph.json + contracts
node ./dist/cli/sdp.js validate examples/checkout-v1   # build + conformance & honesty checks
node ./dist/cli/sdp.js view     examples/checkout-v1   # validate + the Design Review
```

`build` prints the extraction summary and writes the one graph — flat nodes and edges, every one
carrying its `claim` (`declared` / `anchored` / `inferred`, never collapsed):

```
11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
```

Beside the graph it writes `generated/contracts/` (3 modules): a **step contract** per `example`
spec — the union of that example's literal step strings and their typed parameters — and the
per-parent **space contract** — the typed dimensions of the example space, every child's bound
point, and the Outcome union derived from the parent's Then vocabulary. All three are derived
from the graph, keyed by spec ID, importable _because_ they are projections — never the authored
spec module.

The executable half runs off those contracts:

```sh
npx vitest --run examples/checkout-v1/test   # the bound example passes
npm run typecheck:examples                   # the drift pins hold
```

Because the test binds the _generated_ valid-cart contract, the spec drives the assertion:
`expect(world.order?.total).toBe(params.total)` asserts the spec's authored `100` — never a value
the test states. Editing the spec's value reddens the test with zero test edits, and a spec-side
step rename is a `tsc` error naming the stale handler key (both tripped below). The oracle
compiles against the space on both sides: reading a slot the space no longer declares, or
claiming an outcome the specs never stated, is a `tsc` error — while outcome _faithfulness_ stays
human-reviewed, by law.

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
pack (13 pages), all pure projections of the graph. Open
`generated/design-review/spec/orders.create-order.md` and look for:

- **binding language, never liveness** — "Implementation binding: present · Verifier binding:
  present · Runtime observation: not tracked";
- **the example space, rendered** — the parent's Behavior section lists the typed step vocabulary
  its children bind points in; each child page renders its bound point (`{n: 2}` …
  `{total: 100}`; `{n: 0}` on the partial one);
- **`claim` cues** — the implementation anchors' `satisfies` lines are `[anchored]` while every
  example's own `verifies` is `[declared]`; the enabled verifier (`valid-cart`) is distinguished
  from the unenabled one (`invalid-cart`); the test anchor's `[anchored]` verifier line renders
  on the valid-cart page;
- **stated vs derived readiness** — the rungs vary honestly: most specs state `defined` while
  structurally clearing `ready` (stating less than you clear is the honest direction — plain
  header information, no banner); `valid-cart` states `ready` and earns it through its test
  binding; the placement flow states `scoped` because flows are scoped-rung evidence only; the
  API contract is parked at `idea` with its blocking open question recorded in the spec;
- **Relations & impact (one hop)** — the relation list read as the blast radius of changing this
  spec.

Determinism is checkable, not promised: `--check-clean` on any command runs the pipeline twice
independently and fails on a single divergent byte — across the graph, every contract module, and
the review — and `npm run check:example` gates CI on exactly this over this example. Deleting
`generated/` and rerunning reproduces the same bytes, and so does the pipeline run from a copy at
a different absolute path — both pinned in the test suite, which CI also gates.

## Break it on purpose

The fastest way to understand the checks is to trip them. Each experiment is one edit; revert
with `git checkout -- examples/checkout-v1` afterwards (the next `build` regenerates
`generated/`).

- **Dangle a reference.** In `specs/orders/create-order.sdp.ts`, misspell the `refines` target
  (e.g. `spec:orders.order-managment`). `validate` exits 1 with
  `conformance/referential-integrity` — and suggests the id you meant.
- **State readiness you haven't earned.** Add a blocking open question to `create-order`'s
  intent — `openQuestions: [{ question: "Do guest carts create orders?", blocking: true }]` —
  while it states `defined`. `validate` exits 1 with `honesty/readiness-floor`, naming the
  failing clause (`no-blocking-open-questions`): readiness is stated by the author, checked
  against the floor.
- **Unbind the test.** Delete the `specTest` anchor from
  `test/orders/create-order.valid-cart.test.ts`. The summary line drops to
  `4 anchors → 16 nodes · 31 edges`, the valid-cart example stops being an enabled verifier, the
  parent loses its verifier binding, and two more warnings appear: a second
  `conformance/verifies-linkage` (valid-cart's own declared `verifies` no longer confers
  anything) and `honesty/gaps` (valid-cart states `ready` with no resolving verifier) — still
  exit 0, because a missing verifier is a surfaced gap, never a gate.
- **Hand-author a delivery fact.** Add `"has-verifier": true` inside any section of a spec. The
  closed section types reject it (`npm run typecheck:examples` fails), and even smuggled past the
  types it fails `validate` with `honesty/authoring-shape` — delivery facts are derived, never
  authored.
- **Drift the authored value.** In `specs/orders/create-order-valid-cart.sdp.ts`, change
  `{total: 100}` to `{total: 120}` and rerun `build`. The bound test fails with zero test edits —
  `at step: Then an order is created with total 120` · `expected 100 to be 120` — because the
  assertion reads `params.total` from the regenerated contract: the spec's value is the truth the
  test enforces, and the failure speaks spec language. (Rename the step instead — in the parent's
  vocabulary and the child's use — and `tsc` rejects the test's stale handler key by name.)
- **Unbind a slot.** In the same spec, change `{n: 2}` to `{n}`. The **concreteness law** fires:
  an unbound slot in a _used_ step caps the example below `defined`, and valid-cart states
  `ready` — so `validate` exits 1 with `honesty/readiness-floor` (failing clause
  `kind-evidence-complete`), and the contracts stage withholds the non-concrete example's step
  contract (2 modules, not 3).

## Where the concepts live

| Concept                                                  | Read                                                                               |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| the vocabulary (every term used above)                   | [ubiquitous language](../../CONTEXT.md)                                            |
| the executable half (contracts · example space · oracle) | [ubiquitous language — "The executable half"](../../CONTEXT.md)                    |
| the `Spec` primitive, descriptors, sections, relations   | [`02` core model](../../docs/concept/02-core-model.md)                             |
| the one graph, determinism, the `claim` taxonomy         | [`03` the one graph](../../docs/concept/03-the-one-graph.md)                       |
| the DSL and anchors (authoring & binding)                | [`04` authoring & binding](../../docs/concept/04-authoring-and-binding.md)         |
| the checks and the readiness floor                       | [`05` validation & honesty](../../docs/concept/05-validation-and-honesty.md)       |
| the reader, the Design Review, the agent surface         | [`06` consumers & projections](../../docs/concept/06-consumers-and-projections.md) |
