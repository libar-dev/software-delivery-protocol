import { spec } from "@libar-dev/software-delivery-protocol";

export const invalidIdProbe = spec({
  id: "not-a-protocol-id",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
});
