import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const unrecognizedPropertyProbe = spec({
  id: specId("spec:parity.unrecognized-property"),
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  behaviour: { rules: ["This typoed section is dropped loudly."] },
});
