// Illustrative evidence only: the markup export does not exist. The faithful port below
// is kept separate from the synthetic syntax stress samples that follow it.

import { Context, Decision, Spec } from "@libar-dev/software-delivery-protocol/markup";

export default (
  <Spec
    id="spec:decisions.order-lifecycle"
    kind="decision"
    altitude="feature"
    readiness="defined"
    refines="spec:orders.create-order"
    title="Order lifecycle keeps validation before creation"
  >
    {/* Faithful prose port: these sentences already exist in the carrier record. */}
    <Context>
      <p>
        The valid-cart and invalid-cart paths need one stable lifecycle choice. Persistence before
        validation would allow partial orders and enlarge the tracer bullet.
      </p>
    </Context>

    <Decision>
      <p>
        Create orders only after cart validation confirms non-empty input and sufficient inventory.
      </p>
      <p>The valid-cart and invalid-cart examples need one consistent gate.</p>
      <p>Rejecting before persistence keeps the tracer bullet small and internally consistent.</p>
      <p>Rejected carts never create partial orders.</p>
    </Decision>

    {/* Synthetic syntax stress samples: they are not attributed to the decision record. */}
    <section aria-label="JSX prose syntax stress samples">
      <div data-probe="braces">
        A prose shape such as {"{ id, lines, total }"} needs a JSX expression to preserve its
        braces.
      </div>

      {/* Prettier would join these lines too, so the probe preserves the authored source shape. */}
      {/* prettier-ignore */}
      <div data-probe="whitespace">
        This source line looks like one paragraph.

        This visually separated source line is still part of the same JSX text child.
      </div>

      <div data-probe="markdown-literals">
        **Validation before creation** and [the parent behavior](spec:orders.create-order) remain
        literal Markdown spelling in JSX text.
      </div>

      <div data-probe="markup-equivalents">
        <strong>Validation before creation</strong> and{" "}
        <a href="spec:orders.create-order">the parent behavior</a> require markup elements instead.
      </div>
    </section>
  </Spec>
);
