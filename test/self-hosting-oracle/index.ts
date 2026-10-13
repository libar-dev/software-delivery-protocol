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

// Five intended prose-mention pairs have no declared relation either way. The owner retains
// the honesty gap on spec:model.spec-sections; the ready corpus-check and Studio designs await
// their verifier bindings. These warnings remain informative while their builds are pending.
export const expectedWarnings = [
  {
    validatorId: "conformance/prose-mentions",
    family: "conformance",
    severity: "warning",
    subjectId: "spec:consumers.obsidian-vault.iteration",
    relatedId: "spec:consumers.validate-watch",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.data",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.index-page",
  },
  {
    validatorId: "conformance/prose-mentions",
    family: "conformance",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.lenses",
    relatedId: "spec:consumers.structural-mermaid",
  },
  {
    validatorId: "conformance/prose-mentions",
    family: "conformance",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.lenses",
    relatedId: "spec:observation.run-evidence",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.pack-page",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.page-elements",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.publisher",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.search",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.shell",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.spec-page.core",
  },
  {
    validatorId: "conformance/prose-mentions",
    family: "conformance",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.verification-panels",
    relatedId: "spec:observation.run-evidence",
  },
  {
    validatorId: "conformance/prose-mentions",
    family: "conformance",
    severity: "warning",
    subjectId: "spec:consumers.structural-mermaid",
    relatedId: "spec:consumers.spec-studio.lenses",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:model.planned-architecture",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:model.spec-sections",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:validation.architecture-constraints",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:validation.corpus-rules",
  },
] as const;

export type { ExpectedAnchor } from "./anchors.js";
export { expectedAnchors, expectedBindingEdges, expectedCommentAnchorIds } from "./anchors.js";
export { expectedDeclaredRelations } from "./declared-relations.js";
export {
  expectedCorpusChecksPackMembers,
  expectedDesignIterationPackMembers,
  expectedObsidianVaultPackMembers,
  expectedDesignManagementPackMembers,
  expectedPackMembers,
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
