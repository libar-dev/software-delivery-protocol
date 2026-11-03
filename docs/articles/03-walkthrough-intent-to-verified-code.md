# From rough idea to verified code: a hands-on tour of the Protocol

*Part 3 in a series introducing the Libar Software Delivery Protocol. Links and measurements are pinned to one commit; see the footer.*

[Part 1](./01-the-spec-is-the-prompt-is-the-design.md) introduced one enrichable `Spec`, source anchors and the derived graph. [Part 2](./02-one-graph-many-views.md) showed how people read that graph through regenerable projections.

This article follows the engineering loop in a text editor and a terminal. We will use Order Management in [`examples/checkout-v1`](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753/examples/checkout-v1), then inspect a comment-form binding in the Protocol's own engine.

## Setup

Every command runs from a checkout at the pinned commit. Use Node `^20.19.0 || ^22.12.0 || >=24.0.0`, where the ranges declared by the installed test toolchain (Vitest, Vite and Rolldown) overlap:

```sh
git clone https://github.com/libar-dev/software-delivery-protocol.git
cd software-delivery-protocol
git checkout b5e0a8bea1e3bedd48c616f96c9928e955792753
npm ci
```

Inside the Protocol's own checkout, run the CLI as `npm run --silent sdp -- <verb>`. Do not invoke a bare `sdp`, which can select macOS's unrelated binary. An adopter that installed the package uses `npx sdp` or `pnpm exec sdp` instead.

`examples/checkout-v1` is its own extraction root, so these commands need none of the exclusions used for the Protocol's self-hosting corpus.

## The worked example

The example models Order Management with all eight Spec kinds and all four readiness rungs. The generated build output below carries its counts at the pin; the files are arranged as follows:

```text
examples/checkout-v1/
  specs/
    checkout.pack.sdp.md                        # pack:checkout-v1
    roadmap.pack.sdp.md                         # pack:checkout-roadmap
    orders/order-management.sdp.md              # behavior   · epic    · defined
    orders/order-placement-flow.sdp.md          # workflow   · feature · scoped
    orders/create-order.sdp.md                  # behavior   · feature · defined
    orders/create-order-valid-cart.sdp.md       # example    · story   · ready
    orders/create-order-invalid-cart.sdp.md     # example    · story   · defined
    orders/create-order-api-contract.sdp.md     # contract   · story   · idea
    orders/order-total-rule.sdp.md              # rule       · story   · defined
    orders/order-inventory-rule.sdp.md          # rule       · story   · defined
    orders/order-latency-constraint.sdp.md      # constraint · story   · defined
    orders/order-model.sdp.md                   # model      · story   · defined
    decisions/order-lifecycle.sdp.md            # decision   · feature · defined
  src/orders/
    create-order.use-case.ts                    # two implementation anchors
    create-order.route.ts                       # one API anchor
  test/orders/
    create-order.valid-cart.test.ts             # one test anchor
    create-order.oracle.ts                      # one oracle anchor
    orders.create-order.valid-cart.test.generated.ts
```

Build its graph:

```sh
npm run --silent sdp -- build examples/checkout-v1
```

<!-- evidence:example-build -->
```text
11 specs · 2 packs · 5 anchors → 18 nodes · 34 edges (0 errors, 0 warnings)
Wrote <repo>/examples/checkout-v1/generated/graph.json
Wrote <repo>/examples/checkout-v1/generated/contracts (3 modules)
```
<!-- /evidence:example-build -->

Before opening a file, ask which Specs have code ahead of their stated design maturity. Recipe 2 answers the drift alarm, `implemented ∧ ¬ready`:

```sh
npm run --silent sdp -- q "$(cat dist/recipes/02-the-drift-alarm.js)" \
  --root examples/checkout-v1 --json
```

<!-- evidence:example-drift -->
```json
{
  "total": 2,
  "alarms": [
    {
      "id": "spec:orders.create-order",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "implementationBindings": 2
    },
    {
      "id": "spec:orders.order-total-rule",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "implementationBindings": 1
    }
  ]
}
```
<!-- /evidence:example-drift -->

The Specs listed by the generated drift answer have implementation bindings and state only `defined`. Their structural floors reach `ready`, so they wait only for an author's readiness statement. The generated build output above carries the validation totals. The drift alarm is a query, not a workflow gate.

## Author the parent and its example space

Open [`create-order.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/examples/checkout-v1/specs/orders/create-order.sdp.md):

````markdown
---
id: spec:orders.create-order
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:orders.order-management
  constrainedBy: spec:orders.order-latency-constraint
  decidedBy: spec:decisions.order-lifecycle
---
# Customer creates an order

## Intent

- actor: customer
- outcome: Turn a valid cart into an order.
- value: Customers can complete purchases without the example modeling the rest of checkout.

## Example space

```gwt-vocabulary
Given a customer has a cart with {n:number} line items
And every line item has quantity {q:number} and unit price {price:number}
And every cart item is {availability:"in stock"|"out of stock"}
When the customer submits the cart for order creation
Then an order is created with total {total:number}
And the order contains the original cart lines
And order creation is rejected because {reason:"empty cart"|"out of stock"}
```
````

The YAML frontmatter is the closed envelope. It carries identity, the three descriptors and relations. A hand-authored `implemented` property or a derived `satisfies` relation is refused.

Sections carry content and relations carry linkage. The parent names its own refinement, constraint and shaping decision in the envelope rather than hiding those relations in prose.

The `gwt-vocabulary` fence declares the typed example space its child examples share. Each `{slot:type}` placeholder becomes part of the generated contract.

### Bind one point

The child example [`create-order-valid-cart.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md) refines and verifies its parent:

````markdown
---
id: spec:orders.create-order.valid-cart
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:orders.create-order
  verifies: spec:orders.create-order
---
# Valid cart creates an order

## Intent

- outcome: Show that a valid cart can become an order.

```gwt
Given a customer has a cart with {n: 2} line items
And every line item has quantity {q: 1} and unit price {price: 50}
And every cart item is {availability: "in stock"}
When the customer submits the cart for order creation
Then an order is created with total {total: 100}
And the order contains the original cart lines
```

## Verification — executable

- The order result contains a stable id.
- The returned total matches the authored total.
````

Under the point-per-example law, one example binds one concrete point. Under the concreteness law, leaving a used slot unbound, such as `{n}` instead of `{n: 2}`, caps the example below `defined` and withholds its step contract and registrar.

A behavior or example Spec may use `.sdp.gherkin` instead of Markdown as its one canonical carrier. Markdown remains the default and supports authoring features the Gherkin carrier does not, including open questions and relation reasons. [Part 8's outline](./README.md#article-08-executable-specifications-without-cucumber-glue) takes the carrier and executable-contract design further.

## Bind source code

An anchor is a human-authored binding in a `.ts` or `.tsx` file. It carries no Spec prose, readiness or delivery status. Two representations feed the same closed envelope.

The constant form works when source may import the package or its zero-dependency `/anchors` subpath:

<!-- evidence:constant-anchor -->
```ts
import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

// …

export const createOrderUseCaseAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
  label: "createOrderFromCart",
  satisfies: ref("spec:orders.create-order"),
});
```
<!-- /evidence:constant-anchor -->

The comment form needs no runtime import. This anchor comes from the Protocol's own [`src/projections/census.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/src/projections/census.ts):

<!-- evidence:comment-anchor -->
```ts
/**
 * @sdpAnchor impl:protocol.census-page
 * @sdpLabel renders the derived census and runtime taxonomy projection
 * @sdpSatisfies spec:consumers.census-page, spec:model.structural-patterns
 * @sdpComponent component:protocol.projections
 * @sdpReferences spec:decisions.architectural-annotation
 * @sdpRole projection
 */
```
<!-- /evidence:comment-anchor -->

`satisfies` and `references` have different meanings:

- `satisfies` says this unit realizes the Spec's promises together with any other satisfying units. A resolving edge confers `implemented`.
- `references` says this unit answers to a design without claiming to realize it. It supports traceability and impact queries, confers no delivery fact and does not trip the drift alarm.

A stub or a unit following a decision can therefore name that design without pretending to implement it.

## Generate the executable half

`sdp build` emits a step contract for each example and a space contract for the parent. It also emits a registrar beside the test. The authored test imports and activates that registrar, so the adopted registrar is committed and byte-checked. Generated code never imports authored semantics.

Three pieces meet at test time.

**The space contract** types the example space. For create-order it includes `{ n: number; q: number; price: number; availability: "in stock" | "out of stock" }`, every child's bound point and the outcome union derived from the parent's Then vocabulary.

**The expected-outcome oracle** is authored beside the tests and bound with `specOracle`. It returns `unspecified` where the Spec states no outcome:

<!-- evidence:oracle -->
```ts
export function expected(conditions: Partial<CreateOrderConditions>): CreateOrderOutcome {
  if (
    conditions.n === undefined ||
    conditions.q === undefined ||
    conditions.price === undefined ||
    conditions.availability === undefined
  ) {
    return unspecified;
  }

  if (conditions.n === 0) {
    return { kind: "order creation is rejected because {reason}", reason: "empty cart" };
  }

  if (conditions.availability === "out of stock") {
    return { kind: "order creation is rejected because {reason}", reason: "out of stock" };
  }

  if (conditions.q <= 0 || conditions.price <= 0) {
    return unspecified;
  }

  return {
    kind: "an order is created with total {total}",
    total: conditions.n * conditions.q * conditions.price,
  };
}
```
<!-- /evidence:oracle -->

**The bound test** anchors `test:orders.create-order.valid-cart` and activates the registrar with `createWorld`, `invoke`, `observe`, `expected` and optional `assertions` adapters.

At the matching Then step, the registrar checks both the Spec's authored values and the observed outcome against the oracle. If the Markdown changes `{total: 100}` to `{total: 120}` while the oracle and code still say 100, the test fails on the changed Spec value. Agreement between code and oracle alone is not enough.

The second example, `invalid-cart`, declares `verifies` but has no test anchor. Recipe 10 shows it as declared but not enabled. Its `defined` rung makes that an honest incomplete trace, not a warning. An unbound example stating `ready` would draw a verifies-linkage warning.

## Break it on purpose

Run each experiment in a disposable worktree. If an experiment file already has local changes, do not edit it in your checkout. Otherwise, restore only the files changed by that experiment and rerun `npm run generate:example`.

| Experiment | Edit | Run | Expected result |
|---|---|---|---|
| Misspell a section heading | Change `## Rule` to `## Rul` in `order-total-rule.sdp.md` | `npm run --silent sdp -- validate examples/checkout-v1` | Exits 1 with `extract/unrecognized-heading` and follow-on structure errors. The Spec drops out of the graph and `graph.json` is not written. |
| Dangle a relation | Misspell `spec:orders.order-management` in `create-order.sdp.md` | The same validate command | Exits 1 with `conformance/referential-integrity` and a nearest-ID suggestion. |
| Keep an unearned rung | Add a blocking open question to the stated-`defined` create-order Spec | The same validate command | Exits 1 with `honesty/readiness-floor`, naming `no-blocking-open-questions`. |
| Leave a slot unbound | Change `{n: 2}` to `{n}` in the valid-cart example | The same validate command | Exits 1 with `honesty/readiness-floor`; the example's contract and registrar are withheld. |
| Drift a Spec value | Change `{total: 100}` to `{total: 120}` | `npm run generate:example && npx vitest --run examples/checkout-v1/test` | The bound test fails because the Spec's value no longer matches the oracle. |

These experiments show the boundary between extraction, conformance, honesty and executable checks. They also show why none of them needs to judge sprint state or design taste.

## Up next

[Part 4: Stop building 30-verb CLI walls for coding agents](./04-stop-building-verb-walls-for-coding-agents.md) follows the graph downstream: the demand map, `sdp q`, recipes and the evidence from agents using that surface.

---

*About this article: Part 3 in a series introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753). Repository links and command outputs are pinned to commit `b5e0a8be`; re-run the commands rather than quoting the outputs at a later commit.*
