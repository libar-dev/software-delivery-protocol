import { computeDeliveryFacts } from "../graph/delivery-facts.js";
import { deliveryFactNames, graphClaims, graphEdgeTypes, graphNodeTypes } from "../graph/schema.js";
import type {
  DeliveryFactName,
  GraphClaim,
  GraphEdge,
  GraphNode,
  GraphNodeType,
  GraphSchema,
  PackNode,
  PrimitiveNode,
} from "../graph/schema.js";
import { SPEC_ALTITUDES, SPEC_KINDS, SPEC_READINESS } from "../model/descriptors.js";
import { SPEC_SECTION_NAMES } from "../model/sections.js";
import { buildGraphIndex } from "./graph-index.js";
import type { GraphIndex } from "./graph-index.js";
import type { Finding, Severity, ValidationReport, ValidatorFamily } from "./contracts.js";
import { evaluateReadinessFloor } from "./readiness-floor.js";

/**
 * The MVP graph validators (`05` §2), keyed to the one graph — the sole public validation seam
 * (one validation path, MD-14): source → extract → graph → checks. Errors fail the build; a
 * `gap` or `orphan` informs as a warning, never a gate. Ids are referenced typo-safely, mirroring
 * `extractFindingIds`.
 */
export const graphValidatorIds = {
  referentialIntegrity: "conformance/referential-integrity",
  duplicateIds: "conformance/duplicate-ids",
  claimSeparation: "conformance/claim-separation",
  verifiesLinkage: "conformance/verifies-linkage",
  packCoherence: "conformance/pack-coherence",
  orphans: "conformance/orphans",
  authoringShape: "honesty/authoring-shape",
  deliveryFacts: "honesty/delivery-facts",
  readinessFloor: "honesty/readiness-floor",
  gaps: "honesty/gaps",
} as const;

/** The aggregate report id; it spans both check families, so it carries no single family. */
export const graphReportId = "graph";

interface FindingSeed {
  readonly validatorId: string;
  readonly family: ValidatorFamily;
  readonly severity: Severity;
  readonly message: string;
  readonly subjectId?: string;
  readonly relatedId?: string;
  readonly path?: string;
  readonly file?: string;
}

function createFinding(seed: FindingSeed): Finding {
  return seed;
}

function fileOf(index: GraphIndex, id: string): string | undefined {
  return index.nodesById.get(id)?.file;
}

/* ----- did-you-mean (referential integrity's suggestion) ----- */

function boundedEditDistance(left: string, right: string, max: number): number | undefined {
  if (Math.abs(left.length - right.length) > max) {
    return undefined;
  }

  let previous = Array.from({ length: right.length + 1 }, (_, column) => column);

  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    let rowMinimum = row;

    for (let column = 1; column <= right.length; column += 1) {
      const deletion = (previous[column] ?? 0) + 1;
      const insertion = (current[column - 1] ?? 0) + 1;
      const substitution =
        (previous[column - 1] ?? 0) + (left[row - 1] === right[column - 1] ? 0 : 1);
      const cost = Math.min(deletion, insertion, substitution);
      current.push(cost);
      rowMinimum = Math.min(rowMinimum, cost);
    }

    if (rowMinimum > max) {
      return undefined;
    }

    previous = current;
  }

  const distance = previous[right.length] ?? 0;

  return distance <= max ? distance : undefined;
}

/**
 * The "did you mean …?" candidate for a dangling reference: the unique nearest node id within
 * edit distance 2. A tie yields no suggestion — picking a winner would be the silent
 * auto-resolution L2 forbids.
 */
function suggestNearestId(missingId: string, index: GraphIndex): string | undefined {
  let best: string | undefined;
  let bestDistance = 3;
  let tied = false;

  for (const candidate of index.nodesById.keys()) {
    const distance = boundedEditDistance(missingId, candidate, 2);

    if (distance === undefined) {
      continue;
    }

    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
      tied = false;
    } else if (distance === bestDistance) {
      tied = true;
    }
  }

  return tied ? undefined : best;
}

function describeMissingTarget(missingId: string, index: GraphIndex): string {
  const suggestion = suggestNearestId(missingId, index);

  return suggestion === undefined ? "" : ` Did you mean "${suggestion}"?`;
}

/* ----- conformance/referential-integrity (`05` §2 check 1) ----- */

function checkReferentialIntegrity(graph: GraphSchema, index: GraphIndex): readonly Finding[] {
  const findings: Finding[] = [];

  for (const edge of graph.edges) {
    if (!index.nodesById.has(edge.from)) {
      findings.push(
        createFinding({
          validatorId: graphValidatorIds.referentialIntegrity,
          family: "conformance",
          severity: "error",
          message: `Edge "${edge.from}" → (${edge.type}) → "${edge.to}" originates from a node absent from the graph.${describeMissingTarget(edge.from, index)}`,
          subjectId: edge.from,
          relatedId: edge.to,
        }),
      );
    }

    if (!index.nodesById.has(edge.to)) {
      findings.push(
        createFinding({
          validatorId: graphValidatorIds.referentialIntegrity,
          family: "conformance",
          severity: "error",
          message: `Reference from "${edge.from}" via "${edge.type}" points to missing target "${edge.to}".${describeMissingTarget(edge.to, index)}`,
          subjectId: edge.from,
          relatedId: edge.to,
          file: fileOf(index, edge.from),
        }),
      );
    }
  }

  for (const node of graph.nodes) {
    if (node.nodeType !== "Pack") {
      continue;
    }

    for (const [position, target] of (node.modelRefs ?? []).entries()) {
      if (index.nodesById.has(target)) {
        continue;
      }

      findings.push(
        createFinding({
          validatorId: graphValidatorIds.referentialIntegrity,
          family: "conformance",
          severity: "error",
          message: `Pack "${node.id}" modelRefs[${String(position)}] points to missing target "${target}".${describeMissingTarget(target, index)}`,
          subjectId: node.id,
          relatedId: target,
          path: `modelRefs[${String(position)}]`,
          file: node.file,
        }),
      );
    }
  }

  return findings;
}

/* ----- conformance/duplicate-ids (`05` §2 check 2) ----- */

/**
 * The graph backstop for L2: the extractor reports duplicate authored ids per site
 * (`extract/duplicate-id`) and excludes the carriers before derivation, so over extractor output
 * this never fires — it has teeth for any other graph producer.
 */
function checkDuplicateIds(graph: GraphSchema): readonly Finding[] {
  const carriers = new Map<string, number>();

  for (const node of graph.nodes) {
    carriers.set(node.id, (carriers.get(node.id) ?? 0) + 1);
  }

  const findings: Finding[] = [];

  for (const node of graph.nodes) {
    const count = carriers.get(node.id) ?? 0;

    if (count < 2) {
      continue;
    }

    findings.push(
      createFinding({
        validatorId: graphValidatorIds.duplicateIds,
        family: "conformance",
        severity: "error",
        message: `Id "${node.id}" is carried by ${String(count)} nodes (ambiguity is loud, L2) — the graph cannot be keyed on it.`,
        subjectId: node.id,
        file: node.file,
      }),
    );
  }

  return findings;
}

/* ----- conformance/claim-separation (`05` §2 check 3; the `03` §1 edge contract) ----- */

const nodeTypeSet: ReadonlySet<string> = new Set(graphNodeTypes);
const claimSet: ReadonlySet<string> = new Set(graphClaims);
const edgeTypeSet: ReadonlySet<string> = new Set(graphEdgeTypes);
const specKindSet: ReadonlySet<string> = new Set(SPEC_KINDS);
const altitudeSet: ReadonlySet<string> = new Set(SPEC_ALTITUDES);
const readinessSet: ReadonlySet<string> = new Set(SPEC_READINESS);

const nodeClaimByType: Readonly<Record<GraphNodeType, GraphClaim>> = {
  Primitive: "declared",
  Pack: "declared",
  Anchor: "anchored",
  CodeNode: "anchored",
};

function claimSeparationFinding(message: string, subjectId: string, file?: string): Finding {
  return createFinding({
    validatorId: graphValidatorIds.claimSeparation,
    family: "conformance",
    severity: "error",
    message,
    subjectId,
    file,
  });
}

/**
 * The descriptor half of "node typing valid" (`05` §2 check 3): the graph is the public seam, and
 * a foreign producer can carry any string in a descriptor slot the types promise is an enum. The
 * floor dereferences `specKind` and `readiness`, so an unratified value fails closed here as a
 * conformance error — and `evaluateReadinessFloor` evaluates no clauses over it (the same
 * boundary, guarded at both ends).
 */
function checkPrimitiveDescriptors(node: PrimitiveNode, findings: Finding[]): void {
  const descriptors = [
    ["specKind", node.specKind, specKindSet],
    ["altitude", node.altitude, altitudeSet],
    ["readiness", node.readiness, readinessSet],
  ] as const;

  for (const [descriptor, value, ratified] of descriptors) {
    if (ratified.has(value)) {
      continue;
    }

    findings.push(
      createFinding({
        validatorId: graphValidatorIds.claimSeparation,
        family: "conformance",
        severity: "error",
        message: `Spec "${node.id}" carries unknown ${descriptor} "${value}" — outside the ratified descriptor values (${[...ratified].join(" · ")}).`,
        subjectId: node.id,
        path: descriptor,
        file: node.file,
      }),
    );
  }
}

/**
 * Endpoint rows evaluate only where the endpoint resolves — a dangling endpoint is referential
 * integrity's finding, never a second one here.
 */
function checkEdgeContractRow(edge: GraphEdge, index: GraphIndex, findings: Finding[]): void {
  const describeEdge = `Edge "${edge.from}" → (${edge.type}) → "${edge.to}"`;
  const fromNode = index.nodesById.get(edge.from);
  const toNode = index.nodesById.get(edge.to);

  const requireClaim = (claim: GraphClaim): boolean => {
    if (edge.claim === claim) {
      return true;
    }

    findings.push(
      claimSeparationFinding(
        `${describeEdge} carries claim "${edge.claim}" — a ${edge.type} edge carries "${claim}", and the claim taxonomy is never collapsed.`,
        edge.from,
        fromNode?.file,
      ),
    );
    return false;
  };

  const requireEndpoints = (fromTypes: readonly GraphNodeType[], toType: GraphNodeType): void => {
    if (fromNode !== undefined && !fromTypes.includes(fromNode.nodeType)) {
      findings.push(
        claimSeparationFinding(
          `${describeEdge} originates from a ${fromNode.nodeType} node — the edge contract allows ${fromTypes.join(" or ")}.`,
          edge.from,
          fromNode.file,
        ),
      );
    }

    if (toNode !== undefined && toNode.nodeType !== toType) {
      findings.push(
        claimSeparationFinding(
          `${describeEdge} targets a ${toNode.nodeType} node — the edge contract requires ${toType}.`,
          edge.from,
          fromNode?.file,
        ),
      );
    }
  };

  // The kind-typed endpoint rows (`03` §1): evaluated only where the endpoint resolves to a
  // Primitive carrying a ratified kind — a non-Primitive endpoint is the endpoint row's finding,
  // and an unratified kind is the descriptor check's, never a second one here.
  const requireSpecKind = (
    endpoint: GraphNode | undefined,
    role: "targets" | "originates from",
    kinds: readonly string[],
    meaning: string,
  ): void => {
    if (endpoint?.nodeType !== "Primitive" || !specKindSet.has(endpoint.specKind)) {
      return;
    }

    if (kinds.includes(endpoint.specKind)) {
      return;
    }

    findings.push(
      claimSeparationFinding(
        `${describeEdge} ${role} a ${endpoint.specKind}-kind spec — ${meaning}.`,
        edge.from,
        fromNode?.file,
      ),
    );
  };

  switch (edge.type) {
    case "satisfies":
      requireClaim("anchored");
      requireEndpoints(["CodeNode"], "Primitive");
      return;
    case "belongsTo":
      requireClaim("declared");
      requireEndpoints(["Primitive"], "Pack");
      return;
    case "verifies":
      if (edge.claim === "declared") {
        requireEndpoints(["Primitive"], "Primitive");
        return;
      }

      if (edge.claim === "anchored") {
        requireEndpoints(["Anchor"], "Primitive");
        return;
      }

      findings.push(
        claimSeparationFinding(
          `${describeEdge} carries claim "${edge.claim}" — a verifies edge is declared (from an example) or anchored (from a test anchor), and the claim taxonomy is never collapsed.`,
          edge.from,
          fromNode?.file,
        ),
      );
      return;
    case "constrainedBy":
      requireClaim("declared");
      requireEndpoints(["Primitive"], "Primitive");
      requireSpecKind(
        toNode,
        "targets",
        ["rule", "constraint"],
        "constrainedBy bounds a spec by a rule- or constraint-kind spec (a typed dependency, `02` §6)",
      );
      return;
    case "decidedBy":
      requireClaim("declared");
      requireEndpoints(["Primitive"], "Primitive");
      requireSpecKind(
        toNode,
        "targets",
        ["decision"],
        "decidedBy points at a decision-kind spec (a Decision Record)",
      );
      return;
    case "supersedes":
      requireClaim("declared");
      requireEndpoints(["Primitive"], "Primitive");
      requireSpecKind(
        fromNode,
        "originates from",
        ["decision"],
        "supersedes is permitted only on decision specs (`02` §6)",
      );
      requireSpecKind(
        toNode,
        "targets",
        ["decision"],
        "supersedes is a current forward-pointer between two decision-kind specs (Decision Records)",
      );
      return;
    default:
      // The remaining authored relation types: refines · dependsOn — declared,
      // Primitive → Primitive, any kind (the contract types no endpoint kind for them).
      requireClaim("declared");
      requireEndpoints(["Primitive"], "Primitive");
  }
}

function checkClaimSeparation(graph: GraphSchema, index: GraphIndex): readonly Finding[] {
  const findings: Finding[] = [];

  for (const node of graph.nodes) {
    if (!nodeTypeSet.has(node.nodeType) || !claimSet.has(node.claim)) {
      findings.push(
        claimSeparationFinding(
          `Node "${node.id}" carries unknown typing (nodeType "${node.nodeType}", claim "${node.claim}").`,
          node.id,
          node.file,
        ),
      );
      continue;
    }

    const expectedClaim = nodeClaimByType[node.nodeType];

    if (node.claim !== expectedClaim) {
      findings.push(
        claimSeparationFinding(
          `Node "${node.id}" (${node.nodeType}) carries claim "${node.claim}" — ${node.nodeType} nodes carry "${expectedClaim}", and the claim taxonomy is never collapsed.`,
          node.id,
          node.file,
        ),
      );
    }

    if (node.nodeType === "Primitive") {
      checkPrimitiveDescriptors(node, findings);
    }
  }

  for (const edge of graph.edges) {
    if (!edgeTypeSet.has(edge.type) || !claimSet.has(edge.claim)) {
      findings.push(
        claimSeparationFinding(
          `Edge "${edge.from}" → (${edge.type}) → "${edge.to}" carries unknown typing (type "${edge.type}", claim "${edge.claim}").`,
          edge.from,
          fileOf(index, edge.from),
        ),
      );
      continue;
    }

    checkEdgeContractRow(edge, index, findings);
  }

  return findings;
}

/* ----- conformance/verifies-linkage (`05` §2 check 4 — the surfaced half) ----- */

/**
 * The missing-target half of the check is referential integrity's (it is reference resolution).
 * What is surfaced here is the incomplete bidirectional trace — informative, never a gate:
 * a declared `verifies` confers `has-verifier` only from an *enabled* example (an example-kind
 * spec a resolving test anchor binds), so an unenabled or wrong-kind verifier is named loudly
 * instead of silently conferring nothing.
 */
function checkVerifiesLinkage(graph: GraphSchema, index: GraphIndex): readonly Finding[] {
  const anchorVerified = new Set<string>();

  for (const edge of graph.edges) {
    if (edge.type === "verifies" && edge.claim === "anchored" && index.nodesById.has(edge.to)) {
      anchorVerified.add(edge.to);
    }
  }

  const findings: Finding[] = [];

  for (const edge of graph.edges) {
    if (edge.type !== "verifies" || edge.claim !== "declared") {
      continue;
    }

    const verifier = index.primitivesById.get(edge.from);

    if (verifier === undefined) {
      continue;
    }

    if (verifier.specKind !== "example") {
      findings.push(
        createFinding({
          validatorId: graphValidatorIds.verifiesLinkage,
          family: "conformance",
          severity: "warning",
          message: `Spec "${verifier.id}" (kind "${verifier.specKind}") declares verifies → "${edge.to}", but only an example/scenario can be an enabled verifier — the relation confers no has-verifier.`,
          subjectId: verifier.id,
          relatedId: edge.to,
          file: verifier.file,
        }),
      );
      continue;
    }

    if (!anchorVerified.has(verifier.id)) {
      findings.push(
        createFinding({
          validatorId: graphValidatorIds.verifiesLinkage,
          family: "conformance",
          severity: "warning",
          message: `Example "${verifier.id}" declares verifies → "${edge.to}" but is not an enabled verifier — no test anchor binds it, so the spec↔test trace is incomplete and it confers no has-verifier.`,
          subjectId: verifier.id,
          relatedId: edge.to,
          file: verifier.file,
        }),
      );
    }
  }

  return findings;
}

/* ----- conformance/pack-coherence (`05` §4; F4) ----- */

function checkPackMembers(pack: PackNode, index: GraphIndex, findings: Finding[]): void {
  const memberCounts = new Map<string, number>();

  for (const edge of index.edgesByTo.get(pack.id) ?? []) {
    if (edge.type === "belongsTo") {
      memberCounts.set(edge.from, (memberCounts.get(edge.from) ?? 0) + 1);
    }
  }

  for (const [memberId, count] of memberCounts) {
    if (count < 2) {
      continue;
    }

    findings.push(
      createFinding({
        validatorId: graphValidatorIds.packCoherence,
        family: "conformance",
        severity: "error",
        message: `Pack "${pack.id}" lists member "${memberId}" ${String(count)} times — membership is single-sourced on the manifest and duplicates are ambiguous (L2).`,
        subjectId: pack.id,
        relatedId: memberId,
        file: pack.file,
      }),
    );
  }
}

function checkPackModelRefs(pack: PackNode, index: GraphIndex, findings: Finding[]): void {
  for (const [position, target] of (pack.modelRefs ?? []).entries()) {
    const targetNode = index.nodesById.get(target);

    // An unresolved target is referential integrity's finding.
    if (targetNode === undefined) {
      continue;
    }

    if (targetNode.nodeType === "Primitive" && targetNode.specKind === "model") {
      continue;
    }

    const targetShape =
      targetNode.nodeType === "Primitive"
        ? `a ${targetNode.specKind}-kind spec`
        : `a ${targetNode.nodeType} node`;

    findings.push(
      createFinding({
        validatorId: graphValidatorIds.packCoherence,
        family: "conformance",
        severity: "error",
        message: `Pack "${pack.id}" modelRefs[${String(position)}] targets "${target}", which is ${targetShape} — modelRefs name the pack's model-kind vocabulary specs.`,
        subjectId: pack.id,
        relatedId: target,
        path: `modelRefs[${String(position)}]`,
        file: pack.file,
      }),
    );
  }
}

function checkPackCoherence(graph: GraphSchema, index: GraphIndex): readonly Finding[] {
  const findings: Finding[] = [];

  for (const node of graph.nodes) {
    if (node.nodeType !== "Pack") {
      continue;
    }

    checkPackMembers(node, index, findings);
    checkPackModelRefs(node, index, findings);
  }

  return findings;
}

/* ----- conformance/orphans (`05` §2 check 8 — informative) ----- */

function checkOrphans(graph: GraphSchema, index: GraphIndex): readonly Finding[] {
  const findings: Finding[] = [];

  for (const node of graph.nodes) {
    if (node.nodeType !== "Primitive") {
      continue;
    }

    const incidentEdges =
      (index.edgesByFrom.get(node.id)?.length ?? 0) + (index.edgesByTo.get(node.id)?.length ?? 0);

    if (incidentEdges > 0) {
      continue;
    }

    findings.push(
      createFinding({
        validatorId: graphValidatorIds.orphans,
        family: "conformance",
        severity: "warning",
        message: `Spec "${node.id}" is an orphan — no relations and nothing pointing at it; it has fallen out of the graph's connective tissue (informative, never a gate).`,
        subjectId: node.id,
        file: node.file,
      }),
    );
  }

  return findings;
}

/* ----- honesty/authoring-shape (`05` §2 check 5) ----- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * The layer split: extraction hard-errors on derived graph vocabulary at the *top level* of a
 * spec/pack call (`extract/reserved-property`) before derivation; this check owns *section
 * interiors* — the path `tsc` never closes (a non-fresh literal, a defused corpus, a foreign
 * graph producer). The scan covers carrier-level keys only (the section record and its array
 * entries): nested content stays content — a vocabulary may legitimately name a term
 * "implemented".
 */
function checkAuthoringShape(node: PrimitiveNode, findings: Finding[]): void {
  const appendSmuggledFact = (factName: string, path: string): void => {
    findings.push(
      createFinding({
        validatorId: graphValidatorIds.authoringShape,
        family: "honesty",
        severity: "error",
        message: `"${node.id}" hand-authors the derived delivery fact "${factName}" at "${path}" — delivery facts are derived, never authored.`,
        subjectId: node.id,
        relatedId: factName,
        path,
        file: node.file,
      }),
    );
  };

  const scanCarrier = (carrier: unknown, basePath: string): void => {
    if (!isRecord(carrier)) {
      return;
    }

    for (const factName of deliveryFactNames) {
      if (factName in carrier) {
        appendSmuggledFact(factName, `${basePath}.${factName}`);
      }
    }
  };

  const sections = node.sections as Record<string, unknown> | undefined;

  if (sections === undefined) {
    return;
  }

  for (const sectionName of SPEC_SECTION_NAMES) {
    const section = sections[sectionName];

    if (Array.isArray(section)) {
      for (const [position, entry] of section.entries()) {
        scanCarrier(entry, `${sectionName}[${String(position)}]`);
      }
      continue;
    }

    scanCarrier(section, sectionName);
  }
}

/* ----- honesty/delivery-facts (`05` §2 check 6) ----- */

/**
 * Delivery facts are derived, never authored (`02` §2) — and on the public graph seam a
 * `Primitive` node's stated `deliveryFacts` must equal what the one derivation rule recomputes
 * from the graph's resolving binding edges (`computeDeliveryFacts`, shared with the extractor —
 * one derivation path, never two). Extractor output holds by construction; the check has teeth
 * for any other graph producer: a stated fact no binding earns is authored derived truth, an
 * omitted fact corrupts the backlog/drift queries, and `observed` has no producer yet
 * (aspirational, the liveness rung).
 */
function checkDeliveryFacts(
  graph: GraphSchema,
  derivedFacts: ReadonlyMap<string, readonly DeliveryFactName[]>,
): readonly Finding[] {
  const findings: Finding[] = [];
  const factNameSet: ReadonlySet<string> = new Set(deliveryFactNames);

  for (const node of graph.nodes) {
    if (node.nodeType !== "Primitive") {
      continue;
    }

    const stated = node.deliveryFacts ?? [];
    const statedSet: ReadonlySet<string> = new Set(stated);
    const derivedSet: ReadonlySet<string> = new Set(derivedFacts.get(node.id) ?? []);

    const appendFinding = (factName: string, message: string): void => {
      findings.push(
        createFinding({
          validatorId: graphValidatorIds.deliveryFacts,
          family: "honesty",
          severity: "error",
          message,
          subjectId: node.id,
          relatedId: factName,
          path: "deliveryFacts",
          file: node.file,
        }),
      );
    };

    for (const factName of stated) {
      if (!factNameSet.has(factName)) {
        appendFinding(
          factName,
          `Spec "${node.id}" states unknown delivery fact "${factName}" — the delivery facts are ${deliveryFactNames.join(" · ")}.`,
        );
      }
    }

    for (const factName of deliveryFactNames) {
      if (statedSet.has(factName) && !derivedSet.has(factName)) {
        const why =
          factName === "observed"
            ? "nothing derives it yet (aspirational, the liveness rung)"
            : "no resolving binding edge derives it";
        appendFinding(
          factName,
          `Spec "${node.id}" states the delivery fact "${factName}" the graph does not earn — ${why}; delivery facts are derived, never authored.`,
        );
      }

      if (!statedSet.has(factName) && derivedSet.has(factName)) {
        appendFinding(
          factName,
          `Spec "${node.id}" omits the delivery fact "${factName}" its resolving bindings derive — stated facts must equal the one derivation rule's output.`,
        );
      }
    }
  }

  return findings;
}

/* ----- honesty/readiness-floor (`05` §2 check 7, §3) ----- */

function checkReadinessFloors(graph: GraphSchema, index: GraphIndex): readonly Finding[] {
  const findings: Finding[] = [];

  for (const node of graph.nodes) {
    if (node.nodeType !== "Primitive") {
      continue;
    }

    for (const failure of evaluateReadinessFloor(node, index)) {
      findings.push(
        createFinding({
          validatorId: graphValidatorIds.readinessFloor,
          family: "honesty",
          severity: "error",
          message: `Spec "${node.id}" states readiness "${node.readiness}" but does not satisfy floor clause "${failure.clauseId}": ${failure.description}`,
          subjectId: node.id,
          relatedId: failure.clauseId,
          path: "readiness",
          file: node.file,
        }),
      );
    }
  }

  return findings;
}

/* ----- honesty/gaps (`05` §2 check 9 — informative) ----- */

/**
 * Reads the *recomputed* facts, never the node's stated array — a stated `has-verifier` no
 * binding earns must not silence the gap (that disagreement is the delivery-facts check's error;
 * this check stays truthful either way).
 */
function checkGaps(
  graph: GraphSchema,
  derivedFacts: ReadonlyMap<string, readonly DeliveryFactName[]>,
): readonly Finding[] {
  const findings: Finding[] = [];

  for (const node of graph.nodes) {
    if (node.nodeType !== "Primitive" || node.readiness !== "ready") {
      continue;
    }

    if ((derivedFacts.get(node.id) ?? []).includes("has-verifier")) {
      continue;
    }

    findings.push(
      createFinding({
        validatorId: graphValidatorIds.gaps,
        family: "honesty",
        severity: "warning",
        message: `Spec "${node.id}" states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).`,
        subjectId: node.id,
        file: node.file,
      }),
    );
  }

  return findings;
}

/* ----- the aggregate ----- */

function compareCodeUnits(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  return left > right ? 1 : 0;
}

function sortFindings(findings: readonly Finding[]): readonly Finding[] {
  return [...findings].sort(
    (left, right) =>
      compareCodeUnits(left.file ?? "", right.file ?? "") ||
      (left.line ?? 0) - (right.line ?? 0) ||
      compareCodeUnits(left.validatorId, right.validatorId) ||
      compareCodeUnits(left.subjectId ?? "", right.subjectId ?? "") ||
      compareCodeUnits(left.relatedId ?? "", right.relatedId ?? ""),
  );
}

/**
 * The conformance + honesty checks over the one graph — the sole validation entry point
 * (one validation path, MD-14): `sdp validate` is `sdp build` + this. The aggregate spans both
 * check families, so it carries no single `family` of its own — each finding states its family.
 */
export function validateGraph(graph: GraphSchema): ValidationReport {
  const index = buildGraphIndex(graph);
  const derivedFacts = computeDeliveryFacts(graph.nodes, graph.edges);
  const authoringShapeFindings: Finding[] = [];

  for (const node of graph.nodes) {
    if (node.nodeType === "Primitive") {
      checkAuthoringShape(node, authoringShapeFindings);
    }
  }

  const findings = [
    ...checkReferentialIntegrity(graph, index),
    ...checkDuplicateIds(graph),
    ...checkClaimSeparation(graph, index),
    ...checkVerifiesLinkage(graph, index),
    ...checkPackCoherence(graph, index),
    ...checkOrphans(graph, index),
    ...authoringShapeFindings,
    ...checkDeliveryFacts(graph, derivedFacts),
    ...checkReadinessFloors(graph, index),
    ...checkGaps(graph, derivedFacts),
  ];

  return { validatorId: graphReportId, findings: sortFindings(findings) };
}
