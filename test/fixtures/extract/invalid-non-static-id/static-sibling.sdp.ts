import { spec, specId } from "@libar-dev/software-delivery-protocol";

// The valid sibling: one bad spec never poisons the rest of the corpus (L3).
export const staticSiblingSpec = spec({
  id: specId("spec:orders.static-sibling"),
  title: "Static sibling in the same corpus",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Survive extraction beside a hard-error sibling." },
});
