import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const recognizedProbe = spec({
  id: specId("spec:parity.unrecognized-statement"),
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
});

export function foreignStatement(): string {
  return "outside the authored grammar";
}
