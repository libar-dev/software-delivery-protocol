import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

// A dangling target is emitted, not dropped: the unresolved id itself is the sentinel in the
// graph, and the pre-graph validator flags it until the Slice-3 referential-integrity gate.
export const danglingRelationSpec = spec({
  id: specId("spec:orders.dangling-relation"),
  title: "Spec whose relation target is missing",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Emit the dangling edge and let the model validator flag it." },
  relations: [refines(specId("spec:orders.missing-target"))],
});
