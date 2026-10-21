# From Rough Idea to Verified Code: A Hands-On Tour of the Libar Software Delivery Protocol

> *Series: Introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (Part 2 of 8) · All links and measurements pinned to commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) ([PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)).*

In [Part 1](./01-the-spec-is-the-prompt-is-the-design.md), we introduced the core thesis of the **Libar Software Delivery Protocol**: model the delivery lifecycle as instances of one enrichable primitive (`Spec`), bind code and tests with source `anchor`s, derive **one regenerable graph**, and check **conformance and honesty** in CI.

That sounds clean in principle. What does it actually look like in a text editor and a terminal?

In this post, we will trace a single bounded context—**Order Management** ([`examples/checkout-v1`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1)), alongside real comment-form bindings from the Protocol's own engine—from an initial `.sdp.md` Spec all the way to generated TypeScript contracts, an expected-outcome oracle, and deterministic CI checks.

---

## 1. The Worked Example: 11 Specs, 1 Pack, 5 Anchors

The repository ships a complete, self-contained bounded context under [`examples/checkout-v1`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/README.md). It models Order Management (`pack:checkout-v1`) using all eight `Spec` kinds (`behavior`, `workflow`, `example`, `rule`, `constraint`, `model`, `decision`, `contract`) and all four readiness rungs (`idea`, `scoped`, `defined`, `ready`):

```text
examples/checkout-v1/
  specs/
    checkout.pack.sdp.md                        # Pack manifest (pack:checkout-v1)
    orders/order-management.sdp.md              # behavior · epic · scoped
    orders/order-placement-flow.sdp.md          # workflow · feature · scoped
    orders/create-order.sdp.md                  # behavior · feature · defined (owns example space)
    orders/create-order-valid-cart.sdp.md       # example  · story   · ready   (enabled verifier)
    orders/create-order-invalid-cart.sdp.md     # example  · story   · defined (declared only)
    orders/create-order-api-contract.sdp.md     # contract · story   · idea    (blocking question)
    orders/order-total-rule.sdp.md              # rule     · story   · ready
    orders/order-inventory-rule.sdp.md          # rule     · story   · ready
    orders/order-latency-constraint.sdp.md      # constraint · feature · defined
    orders/order-model.sdp.md                   # model    · feature · defined
    decisions/order-lifecycle.sdp.md            # decision · feature · defined
  src/orders/
    create-order.use-case.ts                    # impl:orders.create-order-use-case + impl:orders.order-total
    create-order.route.ts                       # api:orders.post
  test/orders/
    create-order.valid-cart.test.ts             # test:orders.create-order.valid-cart
    create-order.oracle.ts                      # oracle:orders.create-order
    orders.create-order.valid-cart.test.generated.ts  # committed adopted registrar (MD-31)
```

When you run `sdp build examples/checkout-v1`, the extractor parses the `.sdp.md` carriers and the TypeScript anchors and prints:

```text
11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges (0 errors, 0 warnings)
```

Let's inspect the pieces that produce those 17 nodes and 32 edges.

---

## 2. Authoring Intent: The Parent Spec and Its Typed Example Space

Open [`examples/checkout-v1/specs/orders/create-order.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/specs/orders/create-order.sdp.md):

```markdown
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
```

Notice three things about this carrier:

1. **The YAML frontmatter is the closed `envelope` ([`spec:carrier.envelope-contract`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/carrier/envelope-contract.sdp.md)).** It carries `id`, `kind`, `altitude`, `readiness`, and `relations`. Nothing else is permitted in frontmatter—every derived property (`implemented`, `hasVerifier`, `claim`) is refused if authored by hand.
2. **Sections carry content; relations carry links ([content-only sections, MD-10](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/content-only-sections.sdp.md)).** `create-order` links to its parent (`refines: spec:orders.order-management`), its latency NFR (`constrainedBy: spec:orders.order-latency-constraint`), and the shaping ADR (`decidedBy: spec:decisions.order-lifecycle`) in `relations`, never buried inside bullet text.
3. **The `gwt-vocabulary` fence defines a typed `example space` ([`spec:carrier.slot-notation`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/carrier/slot-notation.sdp.md)).** Each `{slot:type}` placeholder—`{n:number}`, `{availability:"in stock"|"out of stock"}`, `{reason:"empty cart"|"out of stock"}`—declares the shared parameter vocabulary that child examples will bind.

### Binding a Point in the Space

Now look at the child example [`examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md):

```markdown
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
```

Under [the point-per-example law (MD-17)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/point-per-example.sdp.md), each `example` Spec binds one concrete point in its parent's example space (`n: 2, q: 1, price: 50, availability: "in stock" → total: 100`). Under the **concreteness law** ([`spec:validation.kind-evidence`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/kind-evidence.sdp.md)), if any slot used in a step is left unbound (for instance, `{n}` instead of `{n: 2}`), the example is capped below `defined` and `sdp build` withholds its step contract.

> **Prefer Gherkin for behavior and example Specs?** Under [the Gherkin carrier option (MD-27)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/gherkin-carrier-option.sdp.md) and [the `.sdp.gherkin` extension law (MD-28)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/sdp-gherkin-extension.sdp.md), any `behavior` or `example` Spec ID can instead use a graph-aware `.sdp.gherkin` file as its one canonical surface, producing the exact same graph nodes and generated contracts.

---

## 3. Binding Source Code: Constant Form and Comment Form

How does source code connect to `spec:orders.create-order`? Through an in-code **anchor** ([`spec:model.anchors`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/anchors.sdp.md)).

An anchor is a human-authored binding assertion in a `.ts` or `.tsx` file. It never carries Spec prose, readiness, or status. It can be written in **two representations** that feed the exact same closed envelope:

### Representation A: The Constant Form
When your code may import `@libar-dev/software-delivery-protocol` (or its zero-dependency subpath `@libar-dev/software-delivery-protocol/anchors` for browser and edge runtimes), you write a top-level constant, as in [`examples/checkout-v1/src/orders/create-order.use-case.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/src/orders/create-order.use-case.ts):

```ts
import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

export const createOrderUseCaseAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.create-order-use-case"),
  label: "createOrderFromCart",
  satisfies: ref("spec:orders.create-order"),
});

export const orderTotalRuleAnchor = codeAnchor({
  id: codeAnchorId("impl:orders.order-total"),
  label: "cart-math order total",
  satisfies: ref("spec:orders.order-total-rule"),
});
```

### Representation B: The Comment Form (Zero Runtime Imports)
What if your production runtime is strict about zero external imports? In [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29), the first adopter's experience led to [the comment-form ruling (MD-36)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-comment-form.sdp.md), [the binding-grain ruling (MD-37)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-binding-grain.sdp.md), and [the architectural-annotation ruling (MD-38)](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/architectural-annotation.sdp.md).

You can write a top-level `/** … */` comment using reserved camelCase `@sdp*` tags with **zero imports**. Here is a real anchor from the Protocol's own census projection in [`src/projections/census.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/src/projections/census.ts):

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

Look closely at the distinction between `@sdpSatisfies` and `@sdpReferences` ([MD-37](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-binding-grain.sdp.md)):

- **`@sdpSatisfies` (`satisfies`):** This unit (together with any sibling units satisfying the same Spec) **realizes** the Spec's promises. It confers the `implemented` delivery fact on `spec:consumers.census-page`.
- **`@sdpReferences` (`references`):** This unit **answers to** a design or decision (`spec:decisions.architectural-annotation`) without claiming to realize it—or realizes only part of a Spec whose remaining promises are not yet built. It puts a `references` edge in the graph so `blastRadius` and impact queries traverse it, **without conferring `implemented` and without tripping the drift alarm**.

If you write a stub or follow an ADR, you use `references`. You never have to lie with `satisfies` just to get traceability.

---

## 4. The Executable Half: Generated Contracts, Registrars, and Oracles

How do we verify `spec:orders.create-order.valid-cart` so that if someone changes `{total: 100}` to `{total: 120}` in the Markdown Spec, the test suite fails immediately—without brittle Cucumber regexes?

When `sdp build examples/checkout-v1` runs, it emits **derived TypeScript contracts** under `generated/contracts/` and a **registrar** beside the test ([`spec:extraction.executable-contracts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/executable-contracts.sdp.md), [`spec:extraction.runnable-modules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/runnable-modules.sdp.md)):

1. **The Space Contract (`orders.create-order.space.ts`):** Exports `CreateOrderConditions` (`{ n: number; q: number; price: number; availability: "in stock" | "out of stock" }`), every child's bound point, and the `CreateOrderOutcome` discriminated union derived from the parent's `Then` steps.
2. **The Expected-Outcome Oracle ([`test/orders/create-order.oracle.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/test/orders/create-order.oracle.ts)):** Models the expected outcome across the entire example space, bound by `specOracle`:

```ts
export const createOrderOracle = specOracle({
  id: oracleAnchorId("oracle:orders.create-order"),
  label: "expected create-order outcome over the example space",
  models: ref("spec:orders.create-order"),
});

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

3. **The Bound Test ([`test/orders/create-order.valid-cart.test.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/test/orders/create-order.valid-cart.test.ts)):** Anchors `test:orders.create-order.valid-cart` and activates the generated registrar with `createWorld`, `invoke`, `observe`, `expected`, and `assertions`:

```ts
export const createOrderValidCartTest = specTest({
  id: testAnchorId("test:orders.create-order.valid-cart"),
  label: "valid cart verifies the create-order happy path",
  verifies: ref("spec:orders.create-order.valid-cart"),
});

registerValidCart({ createWorld, invoke, observe, expected, assertions });
```

The generated registrar compares three things at runtime:
- **The Spec's authored outcome** (`{ total: 100 }` from the `.sdp.md` file),
- **The Oracle's expected outcome** (`2 * 1 * 50 = 100` from `expected(point)`), and
- **The System Under Test's observed outcome** (`world.order.total` from `createOrderFromCart`).

If the Markdown Spec, the oracle, or the implementation drifts from either of the other two, the test fails and names the exact step that diverged.

Meanwhile, `spec:orders.create-order.invalid-cart` is authored at `defined` and declares `verifies: spec:orders.create-order`, but has no `specTest` anchor yet. When you run Recipe 10 (declared versus enabled verifiers) against `examples/checkout-v1`:

```sh
node dist/cli/sdp.js q "$(cat dist/recipes/10-declared-versus-enabled-verifiers.js)" --root examples/checkout-v1 --json
```

The graph reports both `valid-cart` and `invalid-cart` under `declaredExampleVerifiers`, but only `valid-cart` as `enabled: true`. Because `invalid-cart` states `defined` (not `ready`), it sits quietly as honest incomplete trace data without a false warning ([the unbound-example posture, `spec:validation.unbound-example-posture`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/unbound-example-posture.sdp.md)).

---

## 5. Break It on Purpose: Watching the Honesty Checks Fire

The fastest way to appreciate the validators is to trip them in `examples/checkout-v1` (revert each edit when done):

| Experiment | What you edit | What happens when you run `sdp validate` or `vitest` |
|---|---|---|
| **1. Misspell a section heading** | In `order-total-rule.sdp.md`, change `## Rule` to `## Rul` | Exits `1` with `extract/unrecognized-heading` and suggests `Did you mean "## Rule"?` |
| **2. Dangle a relation target** | In `create-order.sdp.md`, change `refines: spec:orders.order-management` to `spec:orders.order-managment` | Exits `1` with `conformance/referential-integrity` and suggests `spec:orders.order-management` (edit distance $\le 2$) |
| **3. State readiness you haven't earned** | In `create-order.sdp.md` (stated `defined`), add `### Open questions` with `- [blocking] Wait?` | Exits `1` with `honesty/readiness-floor`, naming unmet clause `no-blocking-open-questions` |
| **4. Leave a parameter slot unbound** | In `create-order-valid-cart.sdp.md`, change `{n: 2}` to `{n}` | Exits `1` with `honesty/readiness-floor` (`kind-evidence-complete`) and withholds the step contract |
| **5. Drift a Spec value from code** | In `create-order-valid-cart.sdp.md`, change `{total: 100}` to `{total: 120}`, rebuild, and run `npx vitest --run examples/checkout-v1/test` | The bound test fails immediately because the generated contract supplies the Spec's `{total: 120}` against the oracle and implementation's `100` |

---

## Up Next in the Series

We have seen how Specs and anchors enter the repo and how the extractor and validators keep them honest. In **[Part 3: Stop Building 30-Verb CLI Walls for Coding Agents](./03-stop-building-verb-walls-for-coding-agents.md)**, we look at what happens *downstream* of the graph: how AI coding agents script `sdp q` across 43 runnable recipes, how design passes fit 240-Spec corpora into context bundles, and how humans review the same graph in the static HTML **Spec Studio**.
