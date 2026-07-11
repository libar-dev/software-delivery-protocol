// GENERATED (mock) — the space contract AFTER a spec-side vocabulary edit:
// the parent renamed the slot {q} to {qty} ("every line item has quantity
// {qty} …"). `sdp build` regenerates; the oracle still reads `c.q` —
// oracle-drift-demo.ts captures the resulting tsc error. The oracle cannot
// silently diverge from the spec's dimensions.

export interface CreateOrderConditions {
  n: number;
  qty: number; // was: q
  price: number;
  availability: "in stock" | "out of stock";
}
