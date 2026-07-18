import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const nonStaticSectionProbe = spec({
  id: specId("spec:parity.non-static-section"),
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: ["computed", "at runtime"].join(" ") },
});
