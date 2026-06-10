import { spec, specId } from "@libar-dev/software-delivery-protocol";

// The extraction-layer twin of authoring-shape honesty: a raw relations[] entry smuggling a
// derived satisfies edge (and a foreign claim) is rejected at the envelope tier. This file is
// deliberately not type-correct — the corpus is excluded from the typecheck tsconfigs because it
// exercises the extractor, not tsc.
export const handAuthoredSatisfiesEdgeSpec = spec({
  id: specId("spec:orders.hand-authored-satisfies-edge"),
  title: "Spec smuggling a raw satisfies edge",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Pin the raw relations-entry envelope error." },
  relations: [
    { type: "satisfies", target: specId("spec:orders.static-sibling"), claim: "anchored" },
  ],
});
