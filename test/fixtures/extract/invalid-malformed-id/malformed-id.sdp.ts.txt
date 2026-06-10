import { spec, specId } from "@libar-dev/software-delivery-protocol";

// Static but malformed: the id reifies fine and then fails the parseId grammar (missing path) —
// the graph is never keyed on a malformed id.
export const malformedIdSpec = spec({
  id: specId("spec:"),
  title: "Spec whose static id fails the id grammar",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Pin the invalid-id hard error." },
});
