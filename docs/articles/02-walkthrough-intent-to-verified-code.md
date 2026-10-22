# From Rough Idea to Verified Code: A Hands-On Tour of the Libar Software Delivery Protocol

*Part 2 in a series introducing the Libar Software Delivery Protocol. Links and measurements are pinned to one commit; see the footer.*

In Part 1 ([read it here](./01-the-spec-is-the-prompt-is-the-design.md), or [on GitHub](https://github.com/libar-dev/software-delivery-protocol/blob/58a82023ec9c66784f09ccbb5be941a0beda39a0/docs/articles/01-the-spec-is-the-prompt-is-the-design.md)), we introduced the core thesis of the **Libar Software Delivery Protocol**: model the delivery lifecycle as instances of one enrichable primitive (`Spec`), bind code and tests with source `anchor`s, derive **one regenerable graph**, and check **conformance and honesty** in CI.

That sounds clean in principle. What does it actually look like in a text editor and a terminal?

In this post, we will trace a single bounded context—**Order Management** ([`examples/checkout-v1`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1)), alongside real comment-form bindings from the Protocol's own engine—from an initial `.sdp.md` Spec all the way to generated TypeScript contracts, an expected-outcome oracle, and deterministic CI checks.

---

## 0. Setup

Every command in this tour runs from a checkout of the repository at the commit the outputs were measured at:

```sh
git clone https://github.com/libar-dev/software-delivery-protocol.git
cd software-delivery-protocol
git checkout 5a0b22c2d9ead98c900b60ed6209342fce2cbef6
npm ci   # the prepare script builds dist/
```

We run the CLI as `npm run --silent sdp -- <verb> …`, never as a bare `sdp`. Inside its own checkout the package is not linked into `node_modules/.bin`, so a bare `sdp` resolves to nothing, or, on macOS, to Apple's unrelated `/usr/bin/sdp`. (In an adopter repository that installs the package, `npx sdp` or `pnpm exec sdp` works.) `examples/checkout-v1` is its own extraction root, so the commands below pass it as the root and need none of the three fixture `--exclude` flags the repository root uses.

---

## 1. The Worked Example: 11 Specs, 1 Pack, 5 Anchors

The repository ships a complete, self-contained bounded context under [`examples/checkout-v1`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/README.md). It models Order Management (`pack:checkout-v1`) using all eight `Spec` kinds (`behavior`, `workflow`, `example`, `rule`, `constraint`, `model`, `decision`, `contract`) and all four readiness rungs (`idea`, `scoped`, `defined`, `ready`). Each carrier's `kind · altitude · stated readiness`:

```text
examples/checkout-v1/
  specs/
    checkout.pack.sdp.md                        # Pack manifest (pack:checkout-v1)
    orders/order-management.sdp.md              # behavior   · epic    · defined
    orders/order-placement-flow.sdp.md          # workflow   · feature · scoped
    orders/create-order.sdp.md                  # behavior   · feature · defined (owns the example space)
    orders/create-order-valid-cart.sdp.md       # example    · story   · ready   (enabled verifier)
    orders/create-order-invalid-cart.sdp.md     # example    · story   · defined (declared only)
    orders/create-order-api-contract.sdp.md     # contract   · story   · idea    (blocking question)
    orders/order-total-rule.sdp.md              # rule       · story   · defined
    orders/order-inventory-rule.sdp.md          # rule       · story   · defined
    orders/order-latency-constraint.sdp.md      # constraint · story   · defined
    orders/order-model.sdp.md                   # model      · story   · defined
    decisions/order-lifecycle.sdp.md            # decision   · feature · defined
  src/orders/
    create-order.use-case.ts                    # impl:orders.create-order-use-case + impl:orders.order-total
    create-order.route.ts                       # api:orders.post
  test/orders/
    create-order.valid-cart.test.ts             # test:orders.create-order.valid-cart
    create-order.oracle.ts                      # oracle:orders.create-order
    orders.create-order.valid-cart.test.generated.ts  # committed adopted registrar
```

Build the example's graph:

```sh
npm run --silent sdp -- build examples/checkout-v1
```

```text
11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
Wrote <repo>/examples/checkout-v1/generated/graph.json
Wrote <repo>/examples/checkout-v1/generated/contracts (3 modules)
```

### Your first graph question: the drift alarm

Before opening a single file, ask the graph which Specs have code ahead of their design. That is recipe 2, the drift alarm (`implemented ∧ ¬ready`):

```sh
npm run --silent sdp -- q "$(cat dist/recipes/02-the-drift-alarm.js)" --root examples/checkout-v1 --json
```

```json
{
  "total": 2,
  "alarms": [
    { "id": "spec:orders.create-order", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 2 },
    { "id": "spec:orders.order-total-rule", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 1 }
  ]
}
```

Both Specs carry `implemented`, because code anchors bind to them through `satisfies`, while their authors state only `defined`. Their structural floor already reaches `ready` (`firstUnmetClause: null`), so nothing structural stands in the way. Yet `npm run --silent sdp -- validate examples/checkout-v1` reports `0 errors · 0 warnings`.

That is the point. The drift alarm is a graph query, not a CI failure. The [worked dialogue in `CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md) already speaks this way: asked "Anything dishonest in the pack?", its agent reports a drift alarm on an order rule—"an anchor binds code to it, but the design isn't mature"—as a fact to act on, not a broken build. Reaching `ready` takes the floor cleared **plus a human's `declared` statement**. Here the floor is cleared, so each Spec waits only on a person who reads it in a Design Review and states `ready`. That a review happened is never recorded in the graph or checked; doing so would turn the Protocol into a workflow gate.

Now let's inspect the pieces that produce those 17 nodes and 32 edges.

---

## 2. Authoring Intent: The Parent Spec and Its Typed Example Space

Open [`examples/checkout-v1/specs/orders/create-order.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/specs/orders/create-order.sdp.md):

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

Notice three things about this carrier:

1. **The YAML frontmatter is the closed `envelope` ([`spec:carrier.envelope-contract`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/carrier/envelope-contract.sdp.md)).** It carries `id`, `kind`, `altitude`, `readiness`, and `relations`; the H1 supplies the title. Nothing else is permitted in frontmatter: a derived key such as `implemented` or `deliveryFacts` is refused at extraction (`extract/reserved-property`), and a derived edge such as `satisfies` under `relations` is refused as well (`extract/invalid-frontmatter`).
2. **Sections carry content; relations carry links ([content-only sections, MD-10](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/content-only-sections.sdp.md)).** `create-order` links to its parent (`refines: spec:orders.order-management`), its latency NFR (`constrainedBy: spec:orders.order-latency-constraint`), and the shaping decision record (`decidedBy: spec:decisions.order-lifecycle`) in `relations`, never buried inside bullet text.
3. **The `gwt-vocabulary` fence defines a typed `example space` ([`spec:carrier.slot-notation`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/carrier/slot-notation.sdp.md)).** Each `{slot:type}` placeholder—`{n:number}`, `{availability:"in stock"|"out of stock"}`, `{reason:"empty cart"|"out of stock"}`—declares the shared parameter vocabulary that child examples will bind.

### Binding a Point in the Space

Now look at the child example [`examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md). In an `example` Spec, one `gwt` fence closes the `## Intent` section and binds the point:

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
- value: The authored example demonstrates the happy path for create-order.

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
- The returned total matches the authored total — the spec's value, never the test's.
````

Under [the point-per-example law (MD-17)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/point-per-example.sdp.md), each `example` Spec binds one concrete point in its parent's example space (`n: 2, q: 1, price: 50, availability: "in stock" → total: 100`). Under the **concreteness law** ([`spec:validation.kind-evidence`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/kind-evidence.sdp.md)), if any slot used in a step is left unbound (for instance, `{n}` instead of `{n: 2}`), the example is capped below `defined` and `sdp build` withholds its step contract and its registrar.

> **Prefer Gherkin for behavior and example Specs?** Under [the Gherkin carrier option (MD-27)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/gherkin-carrier-option.sdp.md) and [the `.sdp.gherkin` extension (MD-28)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/sdp-gherkin-extension.sdp.md), any `behavior` or `example` Spec ID can instead use a graph-aware `.sdp.gherkin` file as its one canonical surface. A parity example proves that a Markdown twin and its Gherkin twin derive equal graphs and equal contracts ([`spec:carrier.gherkin-authoring.contract-parity`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/carrier/gherkin-authoring.contract-parity.sdp.md)). The Gherkin carrier has no form for open questions, their fields, or relation reasons, so a Spec that needs one stays in Markdown ([`spec:carrier.gherkin-authoring`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/carrier/gherkin-authoring.sdp.md)). The Protocol's own reader Spec, [`spec:consumers.reader`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/reader.sdp.gherkin), is authored this way.

---

## 3. Binding Source Code: Constant Form and Comment Form

How does source code connect to `spec:orders.create-order`? Through an in-code **anchor** ([`spec:model.anchors`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/anchors.sdp.md)).

An anchor is a human-authored binding assertion in a `.ts` or `.tsx` file. It never carries Spec prose, readiness, or status. It can be written in **two representations** that feed the exact same closed envelope.

Both rest on **Principle P6, identity is the universal join key** ([founding principles](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md)). Specs and code link by string IDs such as `"spec:orders.create-order"`, never by TypeScript imports between code and Specs. That is why a refactor that moves or renames files never breaks the trace, why the generated contracts never import product code, and why the comment form below needs no import at all.

### Representation A: The Constant Form
When your code may import `@libar-dev/software-delivery-protocol` (or its zero-dependency subpath `@libar-dev/software-delivery-protocol/anchors`, which loads no `node:*` module), you write a top-level constant, as in [`examples/checkout-v1/src/orders/create-order.use-case.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/src/orders/create-order.use-case.ts#L23-L35):

```ts
import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

// … (lines 3–21: the cart and order types) …

export const createOrderUseCaseAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
  label: "createOrderFromCart",
  satisfies: ref("spec:orders.create-order"),
});

// A second binding in the same file: anchors bind per spec, never per file (MD-8) — the total
// reduction below is where the order-total rule is implemented.
export const orderTotalRuleAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.order-total"),
  label: "cart-math order total",
  satisfies: ref("spec:orders.order-total-rule"),
});
```

### Representation B: The Comment Form (Zero Runtime Imports)
What if your runtime code cannot import the package? The first adopter's could not, so every one of its code anchors sat in a test or a harness, and asking the graph about a source file returned nothing. In [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29), that experience led to three rulings: [the comment form (MD-36)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-comment-form.sdp.md), [bindings are optional, plural, and may reference a design (MD-37)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-binding-grain.sdp.md), and [architectural significance is annotated where it is realized (MD-38)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/architectural-annotation.sdp.md).

You can write a top-level `/** … */` comment using reserved camelCase `@sdp*` tags with **zero imports**. Here is a real anchor from the Protocol's own census projection in [`src/projections/census.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/src/projections/census.ts#L21-L28):

```ts
/**
 * @sdpAnchor impl:protocol.census-page
 * @sdpLabel renders the derived census and runtime taxonomy projection
 * @sdpSatisfies spec:consumers.census-page
 * @sdpComponent component:protocol.projections
 * @sdpReferences spec:decisions.architectural-annotation
 * @sdpRole projection
 */
```

Look closely at the distinction between `@sdpSatisfies` and `@sdpReferences` (the ruling that [bindings are optional, plural, and may reference a design, MD-37](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-binding-grain.sdp.md)):

- **`@sdpSatisfies` (`satisfies`):** This unit **realizes** the Spec's promises together with every other unit that satisfies the same Spec; here a second unit, the `sdp census` command in [`src/cli/census-command.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/src/cli/census-command.ts#L64-L70), completes the set. The set confers the `implemented` delivery fact on `spec:consumers.census-page`.
- **`@sdpReferences` (`references`):** This unit **answers to** a design or decision (`spec:decisions.architectural-annotation`) without claiming to realize it—or realizes only part of a Spec whose remaining promises are not yet built. It puts a `references` edge in the graph so `blastRadius` and impact queries traverse it, **without conferring `implemented` and without tripping the drift alarm**.

If you write a stub or follow a decision record, you use `references`; code never satisfies a decision Spec, because a ruling is not something code realizes. You never have to lie with `satisfies` just to get traceability.

---

## 4. The Executable Half: Generated Contracts, Registrars, and Oracles

How do we verify `spec:orders.create-order.valid-cart` so that if someone changes `{total: 100}` to `{total: 120}` in the Markdown Spec, the test suite fails immediately—without brittle Cucumber regexes?

When `npm run --silent sdp -- build examples/checkout-v1` runs, it emits **derived TypeScript contracts** under `generated/contracts/` (one step contract per example and one space contract for the parent) and a **registrar** beside the test ([`spec:extraction.executable-contracts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/executable-contracts.sdp.md), [`spec:extraction.runnable-modules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/runnable-modules.sdp.md)). Because the authored test imports that registrar, it is committed and byte-checked rather than ignored (the ruling that [adopted registrars are committed, MD-31](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/adopted-registrars-committed.sdp.md)).

Three files meet at test time. Only the first is generated; the oracle and the test are written by hand:

1. **The Space Contract (`orders.create-order.space.ts`):** Exports `CreateOrderConditions` (`{ n: number; q: number; price: number; availability: "in stock" | "out of stock" }`), every child's bound point, and the `CreateOrderOutcome` discriminated union derived from the parent's `Then` steps.
2. **The Expected-Outcome Oracle ([`test/orders/create-order.oracle.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/test/orders/create-order.oracle.ts#L12-L48)):** Models the expected outcome across the entire example space, bound by `specOracle`. Where the Spec states no outcome, it returns `unspecified` rather than guessing:

```ts
export const createOrderOracle = specOracle({
  id: oracleAnchorId("oracle:orders.create-order"),
  label: "expected create-order outcome over the example space",
  models: ref("spec:orders.create-order"),
});

// … (lines 18–21: a comment on the generated input and return types) …
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

3. **The Bound Test ([`test/orders/create-order.valid-cart.test.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/test/orders/create-order.valid-cart.test.ts#L13-L58)):** Anchors `test:orders.create-order.valid-cart` and activates the generated registrar:

```ts
export const createOrderValidCartTest = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart verifies the create-order happy path",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

// … (lines 19–56: the World type and the four adapters listed below) …

registerValidCart({ createWorld, invoke, observe, expected, assertions });
```

The registrar takes five adapter functions, all defined in that test file except `expected`:

- `createWorld(point)` builds a fresh world from the generated point, the Spec's own bound values.
- `invoke(world)` runs the system under test, here `createOrderFromCart`.
- `observe(world)` reads what the system did, typed as a `CreateOrderOutcome`.
- `expected(point)` is the oracle above.
- `assertions(world)` adds checks the outcome union does not carry, such as the stable order id.

At the matching `Then` step, the generated registrar makes two checks, both against the oracle ([`spec:extraction.runnable-modules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/runnable-modules.sdp.md)):

1. **The Spec's authored values against the oracle:** `{ total: 100 }` from the `.sdp.md` file against `2 * 1 * 50 = 100` from `expected(point)`.
2. **The observed outcome against the oracle:** `world.order.total` from `createOrderFromCart`, read through `observe(world)`, against the same oracle outcome.

If the Markdown Spec, the oracle, or the implementation drifts, one of the two checks fails and names the step that diverged. Passing the second check alone is not enough: a changed Spec value must fail the test even when the code and the oracle still agree.

Meanwhile, `spec:orders.create-order.invalid-cart` is authored at `defined` and declares `verifies: spec:orders.create-order`, but has no `specTest` anchor yet. Run recipe 10 (declared versus enabled verifiers) against the example:

```sh
npm run --silent sdp -- q "$(cat dist/recipes/10-declared-versus-enabled-verifiers.js)" --root examples/checkout-v1 --json
```

```json
{
  "total": 2,
  "withDeclaredOnly": 1,
  "rows": [
    {
      "id": "spec:orders.create-order",
      "declared": ["spec:orders.create-order.invalid-cart", "spec:orders.create-order.valid-cart"],
      "enabled": ["spec:orders.create-order.valid-cart"]
    },
    {
      "id": "spec:orders.create-order.valid-cart",
      "declared": [],
      "enabled": ["test:orders.create-order.valid-cart"]
    }
  ]
}
```

The `spec:orders.create-order` row lists both examples under `declared` and only `valid-cart` under `enabled`, and the top-level `withDeclaredOnly: 1` counts the one Spec with a declared verifier that is not enabled. Because `invalid-cart` states `defined` (not `ready`), it sits quietly as honest incomplete trace data without a false warning ([the unbound-example posture, `spec:validation.unbound-example-posture`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/unbound-example-posture.sdp.md)). An unbound example that states `ready` would draw a `conformance/verifies-linkage` warning.

---

## 5. Break It on Purpose: Watching the Checks Fire

The fastest way to appreciate the checks is to trip them in `examples/checkout-v1`. Run each experiment from the repository root, then revert the edit (`git checkout -- examples/checkout-v1`) and rerun `npm run generate:example` to restore the generated files. All paths below are under `examples/checkout-v1/specs/orders/`.

| Experiment | What you edit | Run | What happens |
|---|---|---|---|
| **1. Misspell a section heading** (extraction) | In `order-total-rule.sdp.md`, change `## Rule` to `## Rul` | `npm run --silent sdp -- validate examples/checkout-v1` | Exits `1` with `extract/unrecognized-heading` (`heading "Rul" is not recognized; did you mean "Rule"?`), plus two `extract/invalid-markdown-structure` errors (`Intent entries require a field name`), because the rule bullets beneath the unrecognized heading now fall under `## Intent`. The Spec drops out of the graph (10 specs) and `graph.json` is not written |
| **2. Dangle a relation target** (conformance) | In `create-order.sdp.md`, change `refines: spec:orders.order-management` to `refines: spec:orders.order-managment` | `npm run --silent sdp -- validate examples/checkout-v1` | Exits `1` with `conformance/referential-integrity` (`points to missing target "spec:orders.order-managment". Did you mean "spec:orders.order-management"?`); the suggestion is the unique nearest ID within edit distance ≤ 2 |
| **3. Keep a rung the Spec no longer earns** (honesty) | In `create-order.sdp.md` (stated `defined`), add `### Open questions` with `- [blocking] Wait?` at the end of `## Intent`, before `## Example space` | `npm run --silent sdp -- validate examples/checkout-v1` | Exits `1` with `honesty/readiness-floor`, naming the unmet clause `no-blocking-open-questions` |
| **4. Leave a parameter slot unbound** (honesty) | In `create-order-valid-cart.sdp.md`, change `{n: 2}` to `{n}` | `npm run --silent sdp -- validate examples/checkout-v1` | Exits `1` with `honesty/readiness-floor`, naming the unmet clause `kind-evidence-complete`, and writes two contract modules instead of three: the example's step contract and its registrar are withheld. `sdp build` alone exits `0` with the same two modules, because `sdp build` fails only on extraction errors and the readiness floor is an `sdp validate` check |
| **5. Drift a Spec value from code** (contract) | In `create-order-valid-cart.sdp.md`, change `{total: 100}` to `{total: 120}` | `npm run generate:example && npx vitest --run examples/checkout-v1/test` | The bound test fails at `Then an order is created with total 120` with `Spec Then parameters do not match the oracle payload` and `$.total: expected 120, actual 100`: the regenerated contract supplies the Spec's value, and the oracle and implementation still say `100` |

---

## Up Next in the Series

We have seen how Specs and anchors enter the repo and how the extractor and validators keep them honest. In **Part 3: Stop Building 30-Verb CLI Walls for Coding Agents** ([read it here](./03-stop-building-verb-walls-for-coding-agents.md), or [on GitHub](https://github.com/libar-dev/software-delivery-protocol/blob/58a82023ec9c66784f09ccbb5be941a0beda39a0/docs/articles/03-stop-building-verb-walls-for-coding-agents.md)), we look at what happens *downstream* of the graph: how AI coding agents script `sdp q` across 43 runnable recipes, how a design pass fits one capability Pack of the first adopter's 243-Spec corpus into a context bundle, and how humans review the same graph in the static HTML **Spec Studio**.

---

*About this article: Part 2 in a series introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6). Repository links and every command output are pinned to commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6), the merge of [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33); re-run the commands rather than quoting the outputs at a later commit.*
