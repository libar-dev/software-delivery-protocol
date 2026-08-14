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

  it("rejects a missing component target and excludes the whole anchor", () => {
    const result = extract({
      root: fixtureRoot(oneAnchor('  component: componentAnchorId("component:fixture.missing"),')),
    });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.referentialIntegrity,
        severity: "error",
        subjectId: "impl:fixture.subject",
        relatedId: "component:fixture.missing",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
    expect(result.graph.edges.some((edge) => edge.from === "impl:fixture.subject")).toBe(false);
  });

  it.each([
    {
      name: "an invalid namespace",
      fields: '  uses: [codeAnchorId("test:fixture.not-code")],',
      validatorId: extractFindingIds.invalidId,
    },
    {
      name: "a missing CodeNode",
      fields: '  uses: [codeAnchorId("api:fixture.missing")],',
      validatorId: graphValidatorIds.referentialIntegrity,
    },
  ])("rejects $name uses endpoint and excludes the whole anchor", ({ fields, validatorId }) => {
    const result = extract({ root: fixtureRoot(oneAnchor(fields)) });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId,
        severity: "error",
        subjectId: "impl:fixture.subject",
      }),
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
    expect(result.graph.edges.some((edge) => edge.from === "impl:fixture.subject")).toBe(false);
  });

  it("rejects self-use and excludes the whole anchor", () => {
    const result = extract({
      root: fixtureRoot(oneAnchor('  uses: [codeAnchorId("impl:fixture.subject")],')),
    });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: graphValidatorIds.structuralAnchors,
        severity: "error",
        subjectId: "impl:fixture.subject",
      }),
    ]);
    expect(result.report.findings[0]?.message).toContain("self-reference");
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.subject")).toBe(false);
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
