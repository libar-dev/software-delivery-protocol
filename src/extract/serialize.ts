import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { GraphEdge, GraphNode, GraphSchema } from "../graph/schema.js";
import type {
  ConstraintSection,
  DecisionSection,
  ExampleSpaceVocabulary,
  GivenWhenThen,
  IntentOpenQuestion,
  IntentSection,
  SpecSections,
  VerificationSection,
} from "../model/sections.js";
import { setOwn } from "./set-own.js";

/**
 * Every output byte is owned here, so no `ts-morph` upgrade can change them silently: nodes sorted
 * by `id`, edges by `(from, type, to)` (P3), one canonical key order per node/edge shape, 2-space
 * indent, LF, final newline, UTF-8 without BOM, no wall-clock timestamps, no run hashes, no
 * absolute paths (JS-C3). Typed section fields have a canonical order. Open-section entries and
 * model terms keep the order `deriveGraph` establishes, so serialization sorts none of them.
 *
 * Sorting is code-unit string comparison, never `localeCompare`: locale-aware collation is
 * environment-dependent and would break determinism.
 */
function compareCodeUnits(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  return left > right ? 1 : 0;
}

function canonicalIntent(section: IntentSection): Record<string, unknown> {
  return {
    ...(section.description === undefined ? {} : { description: section.description }),
    ...(section.actor === undefined ? {} : { actor: section.actor }),
    ...(section.problem === undefined ? {} : { problem: section.problem }),
    ...(section.outcome === undefined ? {} : { outcome: section.outcome }),
    ...(section.value === undefined ? {} : { value: section.value }),
    ...(section.risks === undefined ? {} : { risks: section.risks }),
    ...(section.assumptions === undefined ? {} : { assumptions: section.assumptions }),
    ...(section.openQuestions === undefined
      ? {}
      : { openQuestions: section.openQuestions.map(canonicalOpenQuestion) }),
  };
}

function canonicalOpenQuestion(question: IntentOpenQuestion): Record<string, unknown> | string {
  return typeof question === "string"
    ? question
    : {
        question: question.question,
        ...(question.blocking === undefined ? {} : { blocking: question.blocking }),
      };
}

function canonicalGwt(gwt: GivenWhenThen | ExampleSpaceVocabulary): Record<string, unknown> {
  const entries = [
    ["given", gwt.given],
    ["when", gwt.when],
    ["then", gwt.then],
  ] satisfies readonly (readonly [string, readonly string[] | undefined])[];

  return Object.fromEntries<unknown>(entries.filter((entry) => entry[1] !== undefined));
}

function canonicalBehavior(
  section: NonNullable<SpecSections["behavior"]>,
): Record<string, unknown> {
  return {
    ...(section.description === undefined ? {} : { description: section.description }),
    ...(section.rules === undefined ? {} : { rules: section.rules }),
    ...(section.examples === undefined
      ? {}
      : {
          examples: section.examples.map((example) =>
            typeof example === "string" ? example : canonicalGwt(example),
          ),
        }),
    ...(section.flows === undefined ? {} : { flows: section.flows }),
    ...(section.exampleSpace === undefined
      ? {}
      : { exampleSpace: canonicalGwt(section.exampleSpace) }),
  };
}

function canonicalConstraint(constraint: ConstraintSection): Record<string, unknown> {
  return {
    ...(constraint.flavor === undefined ? {} : { flavor: constraint.flavor }),
    statement: constraint.statement,
    ...(constraint.target === undefined ? {} : { target: constraint.target }),
    ...(constraint.measurableBy === undefined ? {} : { measurableBy: constraint.measurableBy }),
  };
}

const openSectionOrderAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.open-section-order"),
  label: "preserves authored open-section and model-term order",
  satisfies: ref("spec:extraction.open-section-order"),
  component: componentAnchorId("component:protocol.extract"),
});
void openSectionOrderAnchor;

function canonicalDynamicSection(
  section: Readonly<Record<string, unknown>>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(section)) {
    setOwn(result, key, section[key]);
  }

  return result;
}

function canonicalDecision(section: DecisionSection): Record<string, unknown> {
  return {
    ...(section.description === undefined ? {} : { description: section.description }),
    ...(section.context === undefined ? {} : { context: section.context }),
    ...(section.decision === undefined ? {} : { decision: section.decision }),
    ...(section.rationale === undefined ? {} : { rationale: section.rationale }),
    ...(section.alternatives === undefined ? {} : { alternatives: section.alternatives }),
    ...(section.consequences === undefined ? {} : { consequences: section.consequences }),
  };
}

function canonicalVerification(section: VerificationSection): Record<string, unknown> {
  return {
    ...(section.description === undefined ? {} : { description: section.description }),
    ...(section.mode === undefined ? {} : { mode: section.mode }),
    ...(section.criteria === undefined ? {} : { criteria: section.criteria }),
  };
}

function canonicalSections(sections: SpecSections): Record<string, unknown> {
  const canonical: Record<string, unknown> = {};

  if (sections.intent !== undefined) {
    canonical.intent = canonicalIntent(sections.intent);
  }

  if (sections.behavior !== undefined) {
    canonical.behavior = canonicalBehavior(sections.behavior);
  }

  if (sections.constraints !== undefined) {
    canonical.constraints = sections.constraints.map(canonicalConstraint);
  }

  if (sections.model !== undefined) {
    canonical.model = {
      ...(sections.model.description === undefined
        ? {}
        : { description: sections.model.description }),
      ...(sections.model.terms === undefined
        ? {}
        : { terms: canonicalDynamicSection(sections.model.terms) }),
    };
  }

  if (sections.design !== undefined) {
    canonical.design = canonicalDynamicSection(sections.design);
  }

  if (sections.decision !== undefined) {
    canonical.decision = canonicalDecision(sections.decision);
  }

  if (sections.verification !== undefined) {
    canonical.verification = canonicalVerification(sections.verification);
  }

  if (sections.ui !== undefined) {
    canonical.ui = canonicalDynamicSection(sections.ui);
  }

  return canonical;
}

function canonicalNode(node: GraphNode): Record<string, unknown> {
  switch (node.nodeType) {
    case "Primitive":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
        specKind: node.specKind,
        altitude: node.altitude,
        readiness: node.readiness,
        ...(node.title === undefined ? {} : { title: node.title }),
        ...(node.narrative === undefined ? {} : { narrative: node.narrative }),
        file: node.file,
        ...(node.sections === undefined ? {} : { sections: canonicalSections(node.sections) }),
        ...(node.deliveryFacts === undefined || node.deliveryFacts.length === 0
          ? {}
          : { deliveryFacts: node.deliveryFacts }),
      };
    case "Pack":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
        ...(node.title === undefined ? {} : { title: node.title }),
        ...(node.framing === undefined ? {} : { framing: node.framing }),
        file: node.file,
        ...(node.modelRefs === undefined ? {} : { modelRefs: node.modelRefs }),
      };
    case "Anchor":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
        ...(node.label === undefined ? {} : { label: node.label }),
        file: node.file,
        line: node.line,
      };
    case "CodeNode":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
        ...(node.label === undefined ? {} : { label: node.label }),
        file: node.file,
        ...(node.line === undefined ? {} : { line: node.line }),
      };
  }
}

function canonicalEdge(edge: GraphEdge): Record<string, unknown> {
  return {
    from: edge.from,
    type: edge.type,
    to: edge.to,
    claim: edge.claim,
  };
}

function compareNodes(left: GraphNode, right: GraphNode): number {
  return compareCodeUnits(left.id, right.id);
}

function compareEdges(left: GraphEdge, right: GraphEdge): number {
  return (
    compareCodeUnits(left.from, right.from) ||
    compareCodeUnits(left.type, right.type) ||
    compareCodeUnits(left.to, right.to)
  );
}

export function serializeGraph(graph: GraphSchema): string {
  const canonical = {
    schemaVersion: graph.schemaVersion,
    nodes: [...graph.nodes].sort(compareNodes).map(canonicalNode),
    edges: [...graph.edges].sort(compareEdges).map(canonicalEdge),
  };

  return `${JSON.stringify(canonical, null, 2)}\n`;
}
