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
// honesty gap on spec:model.spec-sections. The other gaps are this arc's ready designs, each
// stated before the build that binds its verifier; each leaves this list as its build lands. The list follows carrier-path order, as validation reports it.
export const expectedWarnings = [
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:carrier.step-keys",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.agent-surface.example-space-coverage",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.command-line",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.edit-model",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.intent-composition.proposal.memo",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.intent-composition",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.obsidian-vault.bases",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.obsidian-vault.iteration",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.obsidian-vault.notes",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.obsidian-vault",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.readiness-planner",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.components",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.data.inputs",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.data.recipe-answers",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.diagrams",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.diff-page",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.export",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.glossary-page",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.intent-panel",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.lenses.architecture",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.lenses.evidence",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.lenses.packs",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.lenses",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.lenses.tests",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.navigation",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.owner-queue",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.pack-page.maturity-map",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.publisher.watch",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.registers",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.responsive",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.runs-page",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.sharing",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.spec-page",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.spec-studio.verification-panels",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.upgrade-kit.capability-adoption",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.upgrade-kit.rule-key-proposal",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:consumers.upgrade-kit",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:extraction.entry-citations",
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
    subjectId: "spec:model.term-addresses",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:observation.run-evidence",
  },
  {
    validatorId: "honesty/gaps",
    family: "honesty",
    severity: "warning",
    subjectId: "spec:validation.external-registers",
  },
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
