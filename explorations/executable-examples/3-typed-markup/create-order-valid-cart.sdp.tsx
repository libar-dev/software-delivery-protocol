// F1 — the spec as a typed-markup document (.sdp.tsx). Components are the
// envelope + sections; tsc checks props NATIVELY (kind/altitude/readiness are
// closed unions, ids are branded template-literal types) — no typing-law gap.
// The extractor reads this statically (ts-morph speaks TSX); it never renders.
// Rendering is a projection — see render/valid-cart-review.html for what the
// Design Review built from this document looks like, derived data injected.
//
// Components mocked from a hypothetical "@libar-dev/software-delivery-protocol/markup".

import { Spec, Intent, Example, Given, When, Then, And, Verification } from "@libar-dev/software-delivery-protocol/markup";

export default (
  <Spec
    id="spec:orders.create-order.valid-cart"
    kind="example"
    altitude="story"
    readiness="ready"
    refines="spec:orders.create-order"
    verifies="spec:orders.create-order"
    title="Valid cart creates an order"
  >
    <Intent
      outcome="Show that a valid cart can become an order."
      value="The authored example demonstrates the happy path for create-order."
    />

    {/* Prose lives as JSX text. Honest note: braces must be escaped, whitespace
        collapses, emphasis/links need components — markdown this is not. */}
    The happy path of create-order: a fully stocked cart becomes an order and
    the order math holds.

    <Example>
      <Given>a customer has a cart with one or more line items</Given>
      <And>every cart item is in stock</And>
      <And>each line item has a positive quantity and a unit price</And>
      <When>the customer submits the cart for order creation</When>
      <Then>an order is created</Then>
      <And>the order total equals the sum of quantity times unit price per line</And>
      <And>the order contains the original cart lines</And>
    </Example>

    <Verification mode="executable">
      <li>The order result contains a stable id.</li>
      <li>The returned total matches the cart math.</li>
    </Verification>
  </Spec>
);

// What tsc catches here that the text surfaces leave to the extractor:
//   kind="examle"            → not assignable to SpecKind        (as you type)
//   readiness="candidate"    → not assignable to SpecReadiness   (as you type)
//   refines="orders.create"  → branded SpecId mismatch via template-literal type
// What tsc does NOT catch even here: step TEXT is still a string; <Then> outside
// <Example> is only weakly enforceable (TSX children typing is shallow). The
// binding seam stays the contract's job under every surface (4-seam/).
