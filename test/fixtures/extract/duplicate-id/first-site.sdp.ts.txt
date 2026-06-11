import { spec, specId } from "@libar-dev/software-delivery-protocol";

// One of two files reifying the same id — ambiguity is loud (L2), and both sites are reported.
export const duplicateFirstSite = spec({
  id: specId("spec:orders.duplicate"),
  title: "First site of a duplicated id",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Collide with the sibling file's id." },
});
