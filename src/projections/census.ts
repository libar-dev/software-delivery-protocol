import { deliveryFactNames, graphClaims, graphEdgeTypes, graphNodeTypes } from "../graph/schema.js";
import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import {
  SPEC_ALTITUDES,
  SPEC_KIND_DISPLAY_LABELS,
  SPEC_KINDS,
  SPEC_READINESS,
} from "../model/descriptors.js";
import type { Reader, SpecSummary } from "../reader/reader.js";
import type { Finding } from "../validate/contracts.js";
import { escapeRenderedField } from "./owned-prose.js";

export interface CensusPage {
  /** POSIX path under the projection root (`generated/census/`). */
  readonly path: string;
  readonly content: string;
}

const censusAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.census-page"),
  label: "renders the derived census and runtime taxonomy projection",
  satisfies: ref("spec:consumers.census-page"),
});
void censusAnchor;

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function count(values: readonly string[]): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function taxonomyRows(
  runtimeValues: readonly string[],
  observedValues: readonly string[],
  labelOf?: (value: string) => string | undefined,
): readonly string[] {
  const counts = count(observedValues);
  const runtimeSet = new Set<string>(runtimeValues);
  const known = runtimeValues.map((value) => {
    const label = labelOf?.(value);
    return label === undefined
      ? `| \`${escapeRenderedField(value)}\` | ${String(counts.get(value) ?? 0)} |`
      : `| \`${escapeRenderedField(value)}\` | ${escapeRenderedField(label)} | ${String(counts.get(value) ?? 0)} |`;
  });
  const foreign = [...counts.keys()]
    .filter((value) => !runtimeSet.has(value))
    .sort(compareCodeUnits)
    .map((value) => {
      const label = `unrecognized: \`${escapeRenderedField(value)}\``;
      return labelOf === undefined
        ? `| ${label} | ${String(counts.get(value) ?? 0)} |`
        : `| ${label} | unrecognized | ${String(counts.get(value) ?? 0)} |`;
    });

  return [...known, ...foreign];
}

function renderTaxonomy(
  heading: string,
  runtimeValues: readonly string[],
  observedValues: readonly string[],
  labelOf?: (value: string) => string | undefined,
): readonly string[] {
  return [
    `## ${heading}`,
    "",
    labelOf === undefined ? "| Value | Count |" : "| Value | Display label | Count |",
    labelOf === undefined ? "| --- | ---: |" : "| --- | --- | ---: |",
    ...taxonomyRows(runtimeValues, observedValues, labelOf),
    "",
  ];
}

function renderDerivedReadiness(specs: readonly SpecSummary[]): readonly string[] {
  const observed = specs.flatMap((spec) =>
    spec.derivedReadiness === undefined ? [] : [spec.derivedReadiness],
  );

  return [
    "## Derived readiness",
    "",
    "| Value | Count |",
    "| --- | ---: |",
    ...taxonomyRows(SPEC_READINESS, observed),
    `| not structurally reached | ${String(specs.filter((spec) => spec.derivedReadiness === undefined).length)} |`,
    "",
  ];
}

function findingKey(finding: Finding): string {
  return [
    finding.validatorId,
    finding.severity,
    finding.subjectId ?? "",
    finding.relatedId ?? "",
    finding.file ?? "",
    String(finding.line ?? 0),
    finding.path ?? "",
    finding.message,
  ].join("\0");
}

function renderFindings(findings: readonly Finding[]): readonly string[] {
  const sorted = [...findings].sort((left, right) =>
    compareCodeUnits(findingKey(left), findingKey(right)),
  );

  if (sorted.length === 0) {
    return ["## Findings", "", "No findings.", ""];
  }

  return [
    "## Findings",
    "",
    "| Severity | Validator | Subject | Message |",
    "| --- | --- | --- | --- |",
    ...sorted.map(
      (finding) =>
        `| ${finding.severity} | \`${escapeRenderedField(finding.validatorId)}\` | ${escapeRenderedField(finding.subjectId ?? finding.relatedId ?? "—")} | ${escapeRenderedField(finding.message)} |`,
    ),
    "",
  ];
}

function namespaceOf(id: string): string {
  const separator = id.indexOf(":");
  return separator <= 0 ? "unrecognized: no namespace" : id.slice(0, separator);
}

function renderAnchorFlavors(reader: Reader): readonly string[] {
  const bindingNodes = reader.graph.nodes.filter(
    (node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode",
  );
  const rows = new Map<
    string,
    { nodeType: string; namespace: string; edgeType: string; count: number }
  >();

  for (const node of bindingNodes) {
    const outgoing = reader.graph.edges.filter((edge) => edge.from === node.id);
    const edgeTypes =
      outgoing.length === 0 ? ["no binding edge"] : outgoing.map((edge) => edge.type);

    for (const edgeType of edgeTypes) {
      const namespace = namespaceOf(node.id);
      const key = [node.nodeType, namespace, edgeType].join("\0");
      const current = rows.get(key);
      rows.set(key, {
        nodeType: node.nodeType,
        namespace,
        edgeType,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  const runtimeEdgeSet = new Set<string>(graphEdgeTypes);
  const rendered = [...rows.values()]
    .sort(
      (left, right) =>
        compareCodeUnits(left.nodeType, right.nodeType) ||
        compareCodeUnits(left.namespace, right.namespace) ||
        compareCodeUnits(left.edgeType, right.edgeType),
    )
    .map((row) => {
      const edge =
        row.edgeType === "no binding edge"
          ? row.edgeType
          : runtimeEdgeSet.has(row.edgeType)
            ? `\`${escapeRenderedField(row.edgeType)}\``
            : `unrecognized: \`${escapeRenderedField(row.edgeType)}\``;
      return `| ${escapeRenderedField(row.nodeType)} | \`${escapeRenderedField(row.namespace)}\` | ${edge} | ${String(row.count)} |`;
    });

  return [
    "## Anchor flavor",
    "",
    "Anchor flavor is the binding node type plus its ID namespace plus each outgoing binding edge.",
    "",
    "| Node type | Namespace | Binding edge | Count |",
    "| --- | --- | --- | ---: |",
    ...(rendered.length === 0 ? ["| — | — | no structural bindings exist | 0 |"] : rendered),
    "",
  ];
}

/**
 * Pure census projection. It reads only the Reader and exported runtime taxonomies; it performs no
 * filesystem access and carries no clock or run identity.
 */
export function renderCensus(reader: Reader): readonly CensusPage[] {
  const specs = reader.specs();
  const graph = reader.graph;
  const lines = [
    "# Census",
    "",
    `A disposable projection of the one graph (schema \`${escapeRenderedField(graph.schemaVersion)}\`): ${String(graph.nodes.length)} nodes · ${String(graph.edges.length)} edges · ${String(specs.length)} Specs.`,
    "",
    ...renderTaxonomy(
      "Spec kinds",
      SPEC_KINDS,
      specs.map((spec) => spec.specKind),
      (kind) => (SPEC_KIND_DISPLAY_LABELS as Readonly<Record<string, string>>)[kind],
    ),
    ...renderTaxonomy(
      "Spec altitudes",
      SPEC_ALTITUDES,
      specs.map((spec) => spec.altitude),
    ),
    ...renderTaxonomy(
      "Stated readiness",
      SPEC_READINESS,
      specs.map((spec) => spec.statedReadiness),
    ),
    ...renderDerivedReadiness(specs),
    ...renderTaxonomy(
      "Graph node types",
      graphNodeTypes,
      graph.nodes.map((node) => node.nodeType),
    ),
    ...renderTaxonomy(
      "Graph node claims",
      graphClaims,
      graph.nodes.map((node) => node.claim),
    ),
    ...renderTaxonomy(
      "Delivery facts",
      deliveryFactNames,
      specs.flatMap((spec) => spec.deliveryFacts),
    ),
    ...renderTaxonomy(
      "Graph edge types",
      graphEdgeTypes,
      graph.edges.map((edge) => edge.type),
    ),
    ...renderTaxonomy(
      "Graph edge claims",
      graphClaims,
      graph.edges.map((edge) => edge.claim),
    ),
    ...renderAnchorFlavors(reader),
    ...renderFindings(reader.findings()),
    "*Generated from the one graph by `sdp census` — read-only; regenerate to update.*",
    "",
  ];

  return [{ path: "index.md", content: lines.join("\n") }];
}
