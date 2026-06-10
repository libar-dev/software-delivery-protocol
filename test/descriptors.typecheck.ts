import type { SpecAltitude, SpecKind, SpecReadiness } from "../src/model/descriptors.js";
import type { SpecSections } from "../src/model/sections.js";

interface MinimalIdeaSpecFixture {
  readonly id: string;
  readonly title: string;
  readonly kind: SpecKind;
  readonly altitude: SpecAltitude;
  readonly readiness: SpecReadiness;
  readonly sections?: SpecSections;
}

const minimalIdeaSpec = {
  id: "spec:orders.create-order",
  title: "Create order",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
} satisfies MinimalIdeaSpecFixture;

void minimalIdeaSpec;
