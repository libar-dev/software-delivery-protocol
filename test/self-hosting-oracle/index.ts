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

// No intended prose-mention pair is left without a declared relation. The owner retains the
// honesty gap on spec:model.spec-sections. The owner's ready statements on plan 47's
// roadmaps-and-slices Pack add one gap for each newly ready non-decision Spec that no verifier
// binds yet; decisions take no gap. The validator sorts findings by carrier path, so the rows
// follow the carriers' paths in code-unit order.
const gap = (subjectId: string) =>
  ({
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId,
  }) as const;

export const expectedWarnings = [
  gap("spec:consumers.spec-studio.diagram-kinds.dependency"),
  gap("spec:consumers.spec-studio.diagram-kinds.maturity-picture"),
  gap("spec:consumers.spec-studio.diagram-kinds.requirement-trace"),
  gap("spec:consumers.spec-studio.diagram-kinds.scoped-architecture"),
  gap("spec:consumers.spec-studio.diagram-kinds"),
  gap("spec:consumers.spec-studio.lenses.architecture.unit-register"),
  gap("spec:consumers.spec-studio.roadmap-page"),
  gap("spec:consumers.spec-studio.slice-page"),
  gap("spec:extraction.executable-examples"),
  gap("spec:model.spec-sections"),
  gap("spec:protocol.roadmap-replaces-plans"),
  gap("spec:protocol.role-vocabulary"),
] as const;

export type { ExpectedAnchor } from "./anchors.js";
export { expectedAnchors, expectedBindingEdges, expectedCommentAnchorIds } from "./anchors.js";
export { expectedDeclaredRelations } from "./declared-relations.js";
export {
  expectedAdopterSpeedPackMembers,
  expectedCorpusChecksPackMembers,
  expectedDesignIterationPackMembers,
  expectedObsidianVaultPackMembers,
  expectedDesignManagementPackMembers,
  expectedPackMembers,
  expectedRoadmapPackMembers,
  expectedRoadmapsAndSlicesPackMembers,
  expectedStudioPackMembers,
  expectedPacks,
} from "./pack-members.js";
export {
  acceptedArchitecturalUnits,
  coarseGrainCoverage,
  expectedComponentIds,
  expectedMemberOfEdges,
  expectedUsesEdges,
  structuralMembershipExceptions,
} from "./structural-edges.js";
