// The SAME contract after a spec author rewords one Given:
//   "Every cart item is in stock."  →  "Every cart item is available in stock."
// `sdp build --watch` regenerated this; drift-demo.test.ts shows what tsc says
// to the not-yet-updated test. (Separate file only so both states coexist in
// one scratch dir — in reality the regeneration overwrites in place.)

import type { ExampleContract } from "../protocol-runner";

export type Step =
  | "A customer has a cart with one or more line items."
  | "Every cart item is available in stock."
  | "Each line item has a positive quantity and a unit price."
  | "The customer submits the cart for order creation."
  | "An order is created."
  | "The order total equals the sum of quantity multiplied by unit price for each line item."
  | "The order contains the original cart lines.";

export const validCartContract: ExampleContract<Step> = {
  spec: "spec:orders.create-order.valid-cart",
  title: "Valid cart creates an order",
  steps: [
    { kind: "given", text: "A customer has a cart with one or more line items." },
    { kind: "given", text: "Every cart item is available in stock." },
    { kind: "given", text: "Each line item has a positive quantity and a unit price." },
    { kind: "when",  text: "The customer submits the cart for order creation." },
    { kind: "then",  text: "An order is created." },
    { kind: "then",  text: "The order total equals the sum of quantity multiplied by unit price for each line item." },
    { kind: "then",  text: "The order contains the original cart lines." },
  ],
};
