import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import {
  extract,
  extractFindingIds,
  graphValidatorIds,
  schemaVersion,
  validateGraph,
} from "../src/index.js";
import type { GraphEdge, GraphNode, GraphSchema } from "../src/index.js";

const temporaryRoots: string[] = [];

function fixtureRoot(anchorSource: string): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-structural-anchors-"));
  temporaryRoots.push(root);
  mkdirSync(join(root, "specs"));
  writeFileSync(
    join(root, "specs", "target.sdp.md"),
    `---
id: spec:fixture.structural-target
kind: behavior
altitude: feature
readiness: idea
relations: {}
---
# Structural target

## Intent
- outcome: Exercise structural code bindings.
`,
    "utf8",
  );
  writeFileSync(join(root, "anchors.ts"), anchorSource, "utf8");
  return root;
}

function oneAnchor(fields: string): string {
  return `import { codeAnchor, codeAnchorId, componentAnchorId, ref } from "@libar-dev/software-delivery-protocol";

export const subject = codeAnchor({
  id: codeAnchorId("impl:fixture.subject"),
  satisfies: ref("spec:fixture.structural-target"),
${fields}
});
`;
}

function codeNode(id: string): GraphNode {
  return {
    id,
    nodeType: "CodeNode",
    claim: "anchored",
    file: "src/structural.ts",
    line: 1,
  };
}

function syntheticGraph(nodes: readonly GraphNode[], edges: readonly GraphEdge[]): GraphSchema {
  return { schemaVersion, nodes, edges };
}

afterAll(() => {
  for (const root of temporaryRoots) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("structural code anchors", () => {
  it("derives anchored memberOf and uses edges while accepting a multi-node uses cycle", () => {
    const result = extract({
      root: fixtureRoot(`import { codeAnchor, codeAnchorId, componentAnchorId, ref } from "@libar-dev/software-delivery-protocol";

export const component = codeAnchor({
  id: codeAnchorId("component:fixture.core"),
  satisfies: ref("spec:fixture.structural-target"),
});

export const implementation = codeAnchor({
  id: codeAnchorId("impl:fixture.subject"),
  satisfies: ref("spec:fixture.structural-target"),
  component: componentAnchorId("component:fixture.core"),
  uses: [codeAnchorId("api:fixture.gateway")],
});

export const gateway = codeAnchor({
  id: codeAnchorId("api:fixture.gateway"),
  satisfies: ref("spec:fixture.structural-target"),
  uses: [codeAnchorId("impl:fixture.subject")],
});
`),
    });

    expect(result.report.findings).toEqual([]);
    expect(result.graph.edges).toEqual(
      expect.arrayContaining([
        {
          from: "impl:fixture.subject",
          type: "memberOf",
          to: "component:fixture.core",
          claim: "anchored",
        },
        {
          from: "impl:fixture.subject",
          type: "uses",
          to: "api:fixture.gateway",
          claim: "anchored",
        },
        {
          from: "api:fixture.gateway",
          type: "uses",
          to: "impl:fixture.subject",
          claim: "anchored",
        },
      ]),
    );
    expect(validateGraph(result.graph).findings).toEqual([]);
  });

  it("rejects duplicate structural ownership", () => {
    const source = codeNode("impl:fixture.subject");
    const first = codeNode("component:fixture.first");
    const second = codeNode("component:fixture.second");
    const graph = syntheticGraph(
      [source, first, second],
      [
        { from: source.id, type: "memberOf", to: first.id, claim: "anchored" },
        { from: source.id, type: "memberOf", to: second.id, claim: "anchored" },
      ],
    );

    const findings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.structuralAnchors,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("at most one component");
  });

  it("enforces one-level membership namespaces", () => {
    const source = codeNode("component:fixture.child");
    const target = codeNode("component:fixture.parent");
    const graph = syntheticGraph(
      [source, target],
      [{ from: source.id, type: "memberOf", to: target.id, claim: "anchored" }],
    );

    const findings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.structuralAnchors,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("impl: or api:");
  });

  it("requires structural edges to resolve between CodeNode endpoints", () => {
    const source = codeNode("impl:fixture.subject");
    const target: GraphNode = {
      id: "api:fixture.not-code",
      nodeType: "Anchor",
      claim: "anchored",
      file: "src/structural.ts",
      line: 2,
    };
    const graph = syntheticGraph(
      [source, target],
      [{ from: source.id, type: "uses", to: target.id, claim: "anchored" }],
    );

    const findings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.claimSeparation,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("requires CodeNode");
  });

  it("reports a missing component target without stripping the anchor or its delivery fact", () => {
    const result = extract({
      root: fixtureRoot(oneAnchor('  component: componentAnchorId("component:fixture.missing"),')),
    });

    expect(result.report.findings).toEqual([]);
    expect(validateGraph(result.graph).findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.referentialIntegrity,
        severity: "error",
        subjectId: "impl:fixture.subject",
        relatedId: "component:fixture.missing",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(true);
    expect(result.graph.edges).toEqual(
      expect.arrayContaining([
        {
          from: "impl:fixture.subject",
          type: "satisfies",
          to: "spec:fixture.structural-target",
          claim: "anchored",
        },
        {
          from: "impl:fixture.subject",
          type: "memberOf",
          to: "component:fixture.missing",
          claim: "anchored",
        },
      ]),
    );
    expect(
      result.graph.nodes.find(
        (node) => node.nodeType === "Primitive" && node.id === "spec:fixture.structural-target",
      ),
    ).toEqual(expect.objectContaining({ deliveryFacts: ["implemented"] }));
  });

  it("rejects an invalid uses namespace as a malformed anchor field", () => {
    const result = extract({
      root: fixtureRoot(oneAnchor('  uses: [codeAnchorId("test:fixture.not-code")],')),
    });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: extractFindingIds.invalidId,
        severity: "error",
        subjectId: "impl:fixture.subject",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
    expect(result.graph.edges.some((edge) => edge.from === "impl:fixture.subject")).toBe(false);
  });

  it("reports a missing uses target while retaining the graph-validly reified anchor", () => {
    const result = extract({
      root: fixtureRoot(oneAnchor('  uses: [codeAnchorId("api:fixture.missing")],')),
    });

    expect(result.report.findings).toEqual([]);
    expect(validateGraph(result.graph).findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.referentialIntegrity,
        severity: "error",
        subjectId: "impl:fixture.subject",
        relatedId: "api:fixture.missing",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(true);
    expect(result.graph.edges).toContainEqual({
      from: "impl:fixture.subject",
      type: "uses",
      to: "api:fixture.missing",
      claim: "anchored",
    });
  });

  it("reports self-use at graph validation without excluding the anchor", () => {
    const result = extract({
      root: fixtureRoot(oneAnchor('  uses: [codeAnchorId("impl:fixture.subject")],')),
    });

    expect(result.report.findings).toEqual([]);
    const findings = validateGraph(result.graph).findings;
    expect(findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.structuralAnchors,
        severity: "error",
        subjectId: "impl:fixture.subject",
      }),
    ]);
    expect(findings[0]?.message).toContain("self-reference");
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(true);
  });

  it("rejects an empty uses array and excludes the whole anchor", () => {
    const result = extract({ root: fixtureRoot(oneAnchor("  uses: [],")) });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.structuralAnchors,
        severity: "error",
        subjectId: "impl:fixture.subject",
        path: "uses",
      }),
    ]);
    expect(result.report.findings[0]?.message).toContain("non-empty");
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
  });

  it("rejects duplicate uses targets and excludes the whole anchor", () => {
    const result = extract({
      root: fixtureRoot(
        oneAnchor(`  uses: [
    codeAnchorId("api:fixture.gateway"),
    codeAnchorId("api:fixture.gateway"),
  ],`),
      ),
    });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.structuralAnchors,
        severity: "error",
        subjectId: "impl:fixture.subject",
        relatedId: "api:fixture.gateway",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
  });

  it("treats a non-static uses field as a whole-anchor envelope failure", () => {
    const result = extract({
      root: fixtureRoot(`import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

const dependencies = [codeAnchorId("api:fixture.gateway")];
export const subject = codeAnchor({
  id: codeAnchorId("impl:fixture.subject"),
  satisfies: ref("spec:fixture.structural-target"),
  uses: dependencies,
});
`),
    });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: extractFindingIds.nonStaticEnvelope,
        severity: "error",
        subjectId: "impl:fixture.subject",
        path: "uses",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
    expect(result.graph.edges.some((edge) => edge.from === "impl:fixture.subject")).toBe(false);
  });
});

describe("the references edge (the binding grain)", () => {
  function primitive(id: string): GraphNode {
    return {
      id,
      nodeType: "Primitive",
      claim: "declared",
      specKind: "behavior",
      altitude: "feature",
      readiness: "idea",
      file: "specs/target.sdp.md",
    };
  }

  function structural(graph: GraphSchema) {
    return validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.structuralAnchors,
    );
  }

  it("rejects a Spec named in both satisfies and references of one anchor", () => {
    const source = codeNode("impl:fixture.subject");
    const target = primitive("spec:fixture.structural-target");
    const findings = structural(
      syntheticGraph(
        [source, target],
        [
          { from: source.id, type: "satisfies", to: target.id, claim: "anchored" },
          { from: source.id, type: "references", to: target.id, claim: "anchored" },
        ],
      ),
    );

    expect(findings).toEqual([
      expect.objectContaining({
        subjectId: "impl:fixture.subject",
        relatedId: "spec:fixture.structural-target",
        path: "references",
      }),
    ]);
    expect(findings[0]?.message).toContain('both "satisfies" and "references"');
  });

  it("requires a CodeNode source and a Spec target", () => {
    const source: GraphNode = {
      id: "test:fixture.verifier",
      nodeType: "Anchor",
      claim: "anchored",
      file: "test/structural.test.ts",
      line: 1,
    };
    const component = codeNode("component:fixture.core");
    const graph = syntheticGraph(
      [source, component],
      [{ from: source.id, type: "references", to: component.id, claim: "anchored" }],
    );

    expect(structural(graph).map((finding) => finding.message)).toEqual([
      expect.stringContaining("references edge source must use an impl:, api:, or component:"),
      expect.stringContaining("references edge must target a Spec id"),
    ]);
    expect(
      validateGraph(graph).findings.filter(
        (finding) => finding.validatorId === graphValidatorIds.claimSeparation,
      ),
    ).toHaveLength(2);
  });

  it("rejects the same references edge authored twice", () => {
    const source = codeNode("impl:fixture.subject");
    const target = primitive("spec:fixture.structural-target");
    const findings = structural(
      syntheticGraph(
        [source, target],
        [
          { from: source.id, type: "references", to: target.id, claim: "anchored" },
          { from: source.id, type: "references", to: target.id, claim: "anchored" },
        ],
      ),
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("structural edges must be unique");
  });

  it("reports a dangling references target through referential integrity and confers nothing", () => {
    const result = extract({
      root: fixtureRoot(oneAnchor('  references: [ref("spec:fixture.missing")],')),
    });

    expect(result.report.findings).toEqual([]);
    expect(validateGraph(result.graph).findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.referentialIntegrity,
        severity: "error",
        subjectId: "impl:fixture.subject",
        relatedId: "spec:fixture.missing",
      }),
    ]);
    expect(result.graph.edges).toContainEqual({
      from: "impl:fixture.subject",
      type: "references",
      to: "spec:fixture.missing",
      claim: "anchored",
    });
    expect(result.graph.nodes.find((node) => node.id === "spec:fixture.structural-target")).toEqual(
      expect.objectContaining({ deliveryFacts: ["implemented"] }),
    );
  });

  it("refuses an empty references array at reification", () => {
    const result = extract({ root: fixtureRoot(oneAnchor("  references: [],")) });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.structuralAnchors,
        severity: "error",
        subjectId: "impl:fixture.subject",
        path: "references",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
  });

  it("refuses a repeated references target and the satisfies overlap at reification", () => {
    const repeated = extract({
      root: fixtureRoot(
        oneAnchor('  references: [ref("spec:fixture.other"), ref("spec:fixture.other")],'),
      ),
    });
    const overlap = extract({
      root: fixtureRoot(oneAnchor('  references: [ref("spec:fixture.structural-target")],')),
    });

    expect(repeated.report.findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.structuralAnchors,
        subjectId: "impl:fixture.subject",
        relatedId: "spec:fixture.other",
        path: "references",
      }),
    ]);
    expect(overlap.report.findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.structuralAnchors,
        subjectId: "impl:fixture.subject",
        relatedId: "spec:fixture.structural-target",
        path: "references",
      }),
    ]);
    expect(overlap.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
  });
});
