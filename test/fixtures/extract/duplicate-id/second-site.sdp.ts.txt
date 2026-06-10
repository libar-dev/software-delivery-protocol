import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const duplicateSecondSite = spec({
  id: specId("spec:orders.duplicate"),
  title: "Second site of a duplicated id",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Collide with the sibling file's id." },
});
