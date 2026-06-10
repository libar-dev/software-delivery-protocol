import { spec, specId } from "@libar-dev/software-delivery-protocol";

// Section-tier degradation: intent.value is computed, so that one property drops with a warning
// while the rest of the spec survives (graceful partial extraction, L3).
export const nonStaticSectionSpec = spec({
  id: specId("spec:orders.non-static-section"),
  title: "Spec with one non-static section property",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: {
    outcome: "Survive extraction with only the non-static property dropped.",
    value: ["Computed", "at runtime."].join(" "),
  },
});
