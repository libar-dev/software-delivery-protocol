import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const unownedProseProbe = spec({
  id: specId("spec:parity.unowned-prose"),
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  description: "This prose has no owning section.",
});
