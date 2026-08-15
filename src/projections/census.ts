import { deliveryFactNames, graphClaims, graphEdgeTypes, graphNodeTypes } from "../graph/schema.js";
import type { GraphEdge, GraphSchema } from "../graph/schema.js";
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

function structuralEdges(graph: GraphSchema): readonly GraphEdge[] {
  return graph.edges.filter((edge) => edge.type === "memberOf" || edge.type === "uses");
}

function renderStructuralBindings(reader: Reader): readonly string[] {
  const edges = structuralEdges(reader.graph);
  const lines = [
    "## Structural bindings",
    "",
    "Authored `memberOf` and `uses` CodeNode edges are rendered as structure; they confer no delivery fact or readiness.",
    "",
  ];

  if (edges.length === 0) {
    return [...lines, "No structural bindings exist.", ""];
  }

  const membershipEdges = edges.filter((edge) => edge.type === "memberOf");
  const usesEdges = edges.filter((edge) => edge.type === "uses");
  const membersByComponent = new Map<string, string[]>();

  for (const edge of membershipEdges) {
    const members = membersByComponent.get(edge.to) ?? [];
    members.push(edge.from);
    membersByComponent.set(edge.to, members);
  }

  const components = new Set<string>(
    reader.graph.nodes
      .filter((node) => node.nodeType === "CodeNode" && namespaceOf(node.id) === "component")
      .map((node) => node.id),
  );
  for (const component of membersByComponent.keys()) components.add(component);

  const componentScopes = new Map<string, string[]>();
  for (const component of components) {
    componentScopes.set(component, [component]);
  }
  for (const [component, members] of membersByComponent) {
    for (const member of members) {
      const scopes = componentScopes.get(member) ?? [];
      scopes.push(component);
      componentScopes.set(member, scopes);
    }
  }

  const fanIn = new Map<string, number>();
  const fanOut = new Map<string, number>();
  for (const edge of usesEdges) {
    for (const component of componentScopes.get(edge.from) ?? []) {
      fanOut.set(component, (fanOut.get(component) ?? 0) + 1);
    }
    for (const component of componentScopes.get(edge.to) ?? []) {
      fanIn.set(component, (fanIn.get(component) ?? 0) + 1);
    }
  }

  lines.push(
    "### Component membership",
    "",
    "| Component | Members | Member count |",
    "| --- | --- | ---: |",
  );
  for (const component of [...components].sort(compareCodeUnits)) {
    const members = [...new Set(membersByComponent.get(component) ?? [])].sort(compareCodeUnits);
    lines.push(
      `| \`${escapeRenderedField(component)}\` | ${members.length === 0 ? "—" : members.map((member) => `\`${escapeRenderedField(member)}\``).join(", ")} | ${String(members.length)} |`,
    );
  }
  lines.push(
    "",
    "### Uses fan-in / fan-out per component",
    "",
    "Counts include uses authored by or targeting a component's members.",
    "",
    "| Component | Fan-in | Fan-out |",
    "| --- | ---: | ---: |",
  );
  for (const component of [...components].sort(compareCodeUnits)) {
    lines.push(
      `| \`${escapeRenderedField(component)}\` | ${String(fanIn.get(component) ?? 0)} | ${String(fanOut.get(component) ?? 0)} |`,
    );
  }
  lines.push("", ...renderUsesCycles(usesEdges));

  const structuralIds = new Set(edges.flatMap((edge) => [edge.from, edge.to]));
  const dangling = reader
    .findings()
    .filter(
      (finding) =>
        finding.validatorId === "conformance/referential-integrity" &&
        [finding.subjectId, finding.relatedId].some(
          (id) => id !== undefined && structuralIds.has(id),
        ),
    )
    .sort((left, right) => compareCodeUnits(findingKey(left), findingKey(right)));
  lines.push(
    "### Dangling structural references",
    "",
    dangling.length === 0
      ? "No dangling structural references reported by the validator."
      : "| Severity | Subject | Target | Message |",
  );
  if (dangling.length > 0) {
    lines.push(
      "| --- | --- | --- | --- |",
      ...dangling.map(
        (finding) =>
          `| ${finding.severity} | ${escapeRenderedField(finding.subjectId ?? "—")} | ${escapeRenderedField(finding.relatedId ?? "—")} | ${escapeRenderedField(finding.message)} |`,
      ),
    );
  }
  lines.push("");
  return lines;
}

function renderUsesCycles(usesEdges: readonly GraphEdge[]): readonly string[] {
  const adjacency = new Map<string, Set<string>>();
  const nodeIds = new Set<string>();
  for (const edge of usesEdges) {
    nodeIds.add(edge.from);
    nodeIds.add(edge.to);
    const targets = adjacency.get(edge.from) ?? new Set<string>();
    targets.add(edge.to);
    adjacency.set(edge.from, targets);
  }

  let nextIndex = 0;
  const indices = new Map<string, number>();
  const lowLinks = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const groups: string[][] = [];
  const visit = (node: string): void => {
    indices.set(node, nextIndex);
    lowLinks.set(node, nextIndex);
    nextIndex += 1;
    stack.push(node);
    onStack.add(node);
    for (const target of [...(adjacency.get(node) ?? [])].sort(compareCodeUnits)) {
      if (!indices.has(target)) {
        visit(target);
        lowLinks.set(node, Math.min(lowLinks.get(node) ?? 0, lowLinks.get(target) ?? 0));
      } else if (onStack.has(target)) {
        lowLinks.set(node, Math.min(lowLinks.get(node) ?? 0, indices.get(target) ?? 0));
      }
    }
    if (lowLinks.get(node) !== indices.get(node)) return;
    const group: string[] = [];
    let member: string | undefined;
    do {
      member = stack.pop();
      if (member !== undefined) {
        onStack.delete(member);
        group.push(member);
      }
    } while (member !== node);
    if (group.length > 1 || usesEdges.some((edge) => edge.from === node && edge.to === node)) {
      groups.push(group.sort(compareCodeUnits));
    }
  };
  for (const node of [...nodeIds].sort(compareCodeUnits)) {
    if (!indices.has(node)) {
      visit(node);
    }
  }

  const rendered = groups
    .sort((left, right) => compareCodeUnits(left.join("\0"), right.join("\0")))
    .map((group, position) => {
      const groupSet = new Set(group);
      const internalEdges = usesEdges
        .filter((edge) => groupSet.has(edge.from) && groupSet.has(edge.to))
        .map((edge) => `${edge.from} -> ${edge.to}`)
        .sort(compareCodeUnits);
      return `| SCC ${String(position + 1)} | ${group.map((id) => `\`${escapeRenderedField(id)}\``).join(", ")} | ${internalEdges.map(escapeRenderedField).join("; ")} |`;
    });
  return [
    "### Uses cycles (strongly connected components)",
    "",
    "Uses cycles are authored structure, not validator findings.",
    "",
    "| SCC group | Nodes | Uses edges |",
    "| --- | --- | --- |",
    ...(rendered.length === 0 ? ["| — | None | — |"] : rendered),
    "",
  ];
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
    ...renderStructuralBindings(reader),
    ...renderFindings(reader.findings()),
    "*Generated from the one graph by `sdp census` — read-only; regenerate to update.*",
    "",
  ];

  return [{ path: "index.md", content: lines.join("\n") }];
}
