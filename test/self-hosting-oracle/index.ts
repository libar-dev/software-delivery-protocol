// The self-hosting corpus oracle: the authored expectation the derived graph is measured against.
// Every value under this directory is human transcription of intended truth. The oracle is never
// computed from the graph it judges — an oracle derived from its subject can only ever agree with
// it — so a disagreement between a value here and the derived graph is drift to resolve on one
// side or the other, never a licence to promote graph output into the oracle.

import { carrierSpecs } from "./carrier.js";
import { consumersSpecs } from "./consumers.js";
import { decisionsSpecs } from "./decisions.js";
import { extractionSpecs } from "./extraction.js";
import { modelSpecs } from "./model.js";
import { observationSpecs } from "./observation.js";
import { protocolSpecs } from "./protocol.js";
import { validationSpecs } from "./validation.js";

export interface ExpectedSpec {
  readonly id: string;
  readonly specKind: string;
  readonly altitude: string;
  readonly readiness: string;
  readonly title: string;
  readonly narrative: string | null;
  readonly sections: unknown;
  readonly deliveryFacts: readonly string[];
  readonly file: string;
}

export interface SpecFamily {
  readonly name: string;
  readonly prefix: string;
  readonly specs: readonly ExpectedSpec[];
}

// One family per Spec namespace, so a conversion wave touches one authored module rather than the
// whole corpus. The suite asserts the union of these slices is the entire primitive node set: a
// Spec can never escape between two families.
export const specFamilies: readonly SpecFamily[] = [
  { name: "carrier", prefix: "spec:carrier.", specs: carrierSpecs },
  { name: "protocol", prefix: "spec:protocol.", specs: protocolSpecs },
  { name: "extraction", prefix: "spec:extraction.", specs: extractionSpecs },
  { name: "validation", prefix: "spec:validation.", specs: validationSpecs },
  { name: "model", prefix: "spec:model.", specs: modelSpecs },
  { name: "observation", prefix: "spec:observation.", specs: observationSpecs },
  { name: "consumers", prefix: "spec:consumers.", specs: consumersSpecs },
  { name: "decisions", prefix: "spec:decisions.", specs: decisionsSpecs },
];

export const expectedSpecs: readonly ExpectedSpec[] = specFamilies.flatMap(
  (family) => family.specs,
);

// The corpus states nothing the honesty and conformance checks can object to: no orphan, no
// unearned fact, no readiness above its floor. An empty expectation is the strongest one available
// here — every finding, at any severity, is a failure.
export const expectedWarnings = [] as const;

export { expectedAnchors } from "./anchors.js";
export { expectedDeclaredRelations } from "./declared-relations.js";
export { expectedPackMembers } from "./pack-members.js";
