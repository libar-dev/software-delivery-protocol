import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const recognizedSpec = spec({
  id: specId("spec:orders.recognized"),
  title: "Recognized spec beside a stray statement",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Extract cleanly while the stray statement warns." },
});

// A statement outside the authored grammar: ignored, loudly (warning, never a hard error).
export function strayHelper(): string {
  return "outside the authored grammar";
}
