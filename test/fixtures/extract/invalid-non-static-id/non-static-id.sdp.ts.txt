import { spec, specId } from "@libar-dev/software-delivery-protocol";

// Envelope hard error: the id is assembled through a substitution template, so it is non-static.
export const nonStaticIdSpec = spec({
  id: specId(`spec:orders.${"non-static"}`),
  title: "Spec whose id is assembled at runtime",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Pin the non-static envelope hard error." },
});
