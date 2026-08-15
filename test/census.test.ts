import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import {
  createReader,
  extract,
  deliveryFactNames,
  graphClaims,
  graphEdgeTypes,
  graphNodeTypes,
  renderCensus,
  schemaVersion,
  SPEC_ALTITUDES,
  SPEC_KINDS,
  SPEC_READINESS,
  validateGraph,
} from "../src/index.js";
import { runSdpCli } from "../src/cli/sdp.js";
import type { CensusPage, Finding, GraphSchema, Reader, SpecSummary } from "../src/index.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const exampleRoot = join(repoRoot, "examples", "checkout-v1");
const goldenRoot = fileURLToPath(
  new URL("./fixtures/checkout-v1/expected-census", import.meta.url),
);

function materializeExampleCopy(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-census-example-"));

  for (const surface of ["specs", "src", "test"]) {
    cpSync(join(exampleRoot, surface), join(root, surface), { recursive: true });
  }

  return root;
}

function emptyGraph(): GraphSchema {
  return { schemaVersion, nodes: [], edges: [] };
}

function readerStub(options: {
  readonly graph?: GraphSchema;
  readonly specs?: readonly SpecSummary[];
  readonly findings?: readonly Finding[];
}): Reader {
  const unavailable = (): never => {
    throw new Error("census used a Reader accessor outside graph/specs/findings");
  };

  return {
    graph: options.graph ?? emptyGraph(),
    specs: () => options.specs ?? [],
    findings: () => options.findings ?? [],
    packs: unavailable,
    findByConcept: unavailable,
    byFile: unavailable,
    blastRadius: unavailable,
    specContext: unavailable,
    packContext: unavailable,
  };
}

function pageByPath(pages: readonly CensusPage[], path: string): string {
  const page = pages.find((entry) => entry.path === path);

  if (page === undefined) {
    throw new Error(`The rendered census is missing page "${path}".`);
  }

  return page.content;
}

function specSummary(overrides: Partial<SpecSummary> = {}): SpecSummary {
  return {
    id: "spec:probe.behavior",
    specKind: "behavior",
    kindDisplayLabel: "Use Case / Behavior",
    altitude: "feature",
    statedReadiness: "ready",
    derivedReadiness: "scoped",
    deliveryFacts: [],
    file: "specs/probe.sdp.md",
    packs: [],
    ...overrides,
  };
}

function foreignGraph(): GraphSchema {
  return {
    schemaVersion,
    nodes: [
      {
        id: "widget:probe.foreign",
        nodeType: "ForeignNode",
        claim: "borrowed",
        file: "src/foreign.ts",
      },
      {
        id: "impl:probe.binding",
        nodeType: "CodeNode",
        claim: "anchored",
        file: "src/probe.ts",
      },
      {
        id: "spec:probe.foreign",
        nodeType: "Primitive",
        claim: "declared",
        specKind: "memo",
        altitude: "orbit",
        readiness: "draft",
        file: "specs/foreign.sdp.md",
      },
    ],
    edges: [
      {
        from: "impl:probe.binding",
        type: "connects",
        to: "spec:probe.foreign",
        claim: "borrowed",
      },
      {
        from: "impl:probe.binding",
        type: "satisfies",
        to: "spec:probe.foreign",
        claim: "anchored",
      },
    ],
  } as unknown as GraphSchema;
}

const censusTestAnchor = specTest({
  id: testAnchorId("test:protocol.census-page"),
  label: "verifies census taxonomy, findings, and structural-binding projection",
  verifies: ref("spec:consumers.census-page"),
});
void censusTestAnchor;

describe("the derived census/taxonomy projection", () => {
  it("renders the checkout fixture as the reviewed golden page", () => {
    const pages = renderCensus(createReader(extract({ root: exampleRoot }).graph));

    expect(pages.map((page) => page.path)).toEqual(["index.md"]);
    expect(pageByPath(pages, "index.md")).toBe(readFileSync(join(goldenRoot, "index.md"), "utf8"));
  });

  it("is byte-identical under reordered graph input", () => {
    const graph = foreignGraph();
    const permuted = {
      ...graph,
      nodes: [...graph.nodes].reverse(),
      edges: [...graph.edges].reverse(),
    };
    const specs = [
      specSummary({ id: "spec:probe.z" }),
      specSummary({
        id: "spec:probe.a",
        statedReadiness: "idea",
        derivedReadiness: undefined,
      }),
    ];

    const first = renderCensus(readerStub({ graph, specs }));
    const second = renderCensus(readerStub({ graph: permuted, specs: [...specs].reverse() }));

    expect(second).toEqual(first);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });

  it("keeps every exported runtime taxonomy category visible at zero", () => {
    const page = pageByPath(renderCensus(readerStub({})), "index.md");

    for (const value of [
      ...SPEC_KINDS,
      ...SPEC_ALTITUDES,
      ...SPEC_READINESS,
      ...graphNodeTypes,
      ...graphClaims,
      ...deliveryFactNames,
      ...graphEdgeTypes,
    ]) {
      expect(page).toContain(`| \`${value}\` |`);
    }

    expect(page).toContain("| `workflow` | Workflow | 0 |");
    expect(page).toContain("## Structural bindings");
    expect(page).toContain("No structural bindings exist.");
  });

  it("renders component rollups and uses cycles deterministically", () => {
    const graph: GraphSchema = {
      schemaVersion,
      nodes: [
        {
          id: "component:checkout",
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/checkout.ts",
        },
        {
          id: "component:payments",
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/payments.ts",
        },
        {
          id: "impl:checkout.orders",
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/orders.ts",
        },
        {
          id: "api:payments.gateway",
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/gateway.ts",
        },
      ],
      edges: [
        {
          from: "impl:checkout.orders",
          type: "memberOf",
          to: "component:checkout",
          claim: "anchored",
        },
        {
          from: "api:payments.gateway",
          type: "memberOf",
          to: "component:payments",
          claim: "anchored",
        },
        {
          from: "impl:checkout.orders",
          type: "uses",
          to: "api:payments.gateway",
          claim: "anchored",
        },
        {
          from: "api:payments.gateway",
          type: "uses",
          to: "impl:checkout.orders",
          claim: "anchored",
        },
      ],
    };
    const first = pageByPath(
      renderCensus(readerStub({ graph, findings: validateGraph(graph).findings })),
      "index.md",
    );
    const second = pageByPath(
      renderCensus(
        readerStub({
          graph: { ...graph, nodes: [...graph.nodes].reverse(), edges: [...graph.edges].reverse() },
          findings: validateGraph(graph).findings,
        }),
      ),
      "index.md",
    );

    expect(second).toBe(first);
    expect(first).toContain("## Structural bindings");
    expect(first).toContain("| `component:checkout` | `impl:checkout.orders` | 1 |");
    expect(first).toContain("| `component:checkout` | 1 | 1 |");
    expect(first).toContain("### Uses cycles (strongly connected components)");
    expect(first).toContain("SCC 1");
    expect(first).toContain("Uses cycles are authored structure, not validator findings.");
    expect(first).not.toContain("conformance/structural-anchors");
  });

  it("renders dangling structural references from reader findings without re-deriving them", () => {
    const graph: GraphSchema = {
      schemaVersion,
      nodes: [
        {
          id: "impl:checkout.orders",
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/orders.ts",
        },
      ],
      edges: [
        { from: "impl:checkout.orders", type: "uses", to: "component:missing", claim: "anchored" },
      ],
    };
    const page = pageByPath(
      renderCensus(
        readerStub({
          graph,
          findings: [
            {
              validatorId: "conformance/referential-integrity",
              family: "conformance",
              severity: "error",
              subjectId: "impl:checkout.orders",
              relatedId: "component:missing",
              message: "Reference points to missing structural target.",
            },
          ],
        }),
      ),
      "index.md",
    );

    expect(page).toContain("### Dangling structural references");
    expect(page).toContain("Reference points to missing structural target.");
    expect(page).not.toContain("SCC 1");
  });

  it("renders a dangling structural reference produced by the real extraction pipeline", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-census-dangling-"));

    try {
      mkdirSync(join(root, "specs"));
      writeFileSync(
        join(root, "specs", "target.sdp.md"),
        `---
id: spec:fixture.census-target
kind: behavior
altitude: feature
readiness: idea
relations: {}
---
# Census target

## Intent
- outcome: Keep dangling structure visible for diagnosis.
`,
        "utf8",
      );
      writeFileSync(
        join(root, "anchor.ts"),
        `import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";
export const anchor = codeAnchor({
  id: codeAnchorId("impl:fixture.census-target"),
  satisfies: ref("spec:fixture.census-target"),
  uses: [codeAnchorId("api:fixture.missing")],
});
`,
        "utf8",
      );

      const result = extract({ root });
      const page = pageByPath(renderCensus(createReader(result.graph)), "index.md");

      expect(result.report.findings).toEqual([]);
      expect(page).toContain("### Dangling structural references");
      expect(page).toContain("api:fixture.missing");
      expect(page).toContain('via "uses" points to missing target "api:fixture.missing"');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("renders foreign taxonomy values as deterministic unrecognized rows", () => {
    const page = pageByPath(
      renderCensus(
        readerStub({
          graph: foreignGraph(),
          specs: [
            specSummary({
              specKind: "memo",
              altitude: "orbit",
              statedReadiness: "draft",
            } as unknown as Partial<SpecSummary>),
          ],
        }),
      ),
      "index.md",
    );

    for (const value of ["memo", "orbit", "draft", "ForeignNode", "borrowed", "connects"]) {
      expect(page).toContain(`unrecognized: \`${value}\``);
    }
    expect(page.indexOf("unrecognized: `borrowed`")).toBeLessThan(
      page.indexOf("unrecognized: `connects`"),
    );
  });

  it("counts stated and derived readiness in separate dimensions", () => {
    const page = pageByPath(
      renderCensus(
        readerStub({
          specs: [
            specSummary({ statedReadiness: "ready", derivedReadiness: "scoped" }),
            specSummary({
              id: "spec:probe.unreached",
              statedReadiness: "defined",
              derivedReadiness: undefined,
            }),
          ],
        }),
      ),
      "index.md",
    );

    expect(page).toContain("## Stated readiness");
    expect(page).toContain("| `ready` | 1 |");
    expect(page).toContain("## Derived readiness");
    expect(page).toContain("| `scoped` | 1 |");
    expect(page).toContain("| not structurally reached | 1 |");
  });

  it("sources its findings only from reader.findings()", () => {
    const sentinel: Finding = {
      validatorId: "honesty/sentinel",
      family: "honesty",
      severity: "warning",
      message: "Reader-owned sentinel",
      subjectId: "spec:probe.sentinel",
    };
    const invalidGraph = {
      schemaVersion,
      nodes: [],
      edges: [{ from: "missing:a", type: "refines", to: "missing:b", claim: "declared" }],
    } as GraphSchema;
    const page = pageByPath(
      renderCensus(readerStub({ graph: invalidGraph, findings: [sentinel] })),
      "index.md",
    );

    expect(page).toContain("honesty/sentinel");
    expect(page).toContain("Reader-owned sentinel");
    expect(page).not.toContain("conformance/referential-integrity");
  });

  it("renders anchor flavor from node type, namespace, and binding edge", () => {
    const page = pageByPath(renderCensus(readerStub({ graph: foreignGraph() })), "index.md");

    expect(page).toContain("| CodeNode | `impl` | `satisfies` | 1 |");
    expect(page).toContain("| CodeNode | `impl` | unrecognized: `connects` | 1 |");
  });
});

describe("sdp census publication", () => {
  it("publishes diagnostic output for validation errors and returns nonzero", () => {
    const root = materializeExampleCopy();

    try {
      const capture = createCaptureOutput();
      const diagnosticPages = [{ path: "index.md", content: "# Diagnostic census\n" }];

      expect(
        runSdpCli(["census", root], capture.output, {
          validateGraph: () => ({
            validatorId: "graph/report",
            findings: [
              {
                validatorId: "conformance/referential-integrity",
                family: "conformance",
                severity: "error",
                message: "retained-graph validation failure",
              },
            ],
          }),
          renderCensus: () => diagnosticPages,
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain("retained-graph validation failure");
      expect(readFileSync(join(root, "generated", "census", "index.md"), "utf8")).toBe(
        "# Diagnostic census\n",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("creates the explicit generated/census surface by wholesale temporary-directory replacement", () => {
    const root = materializeExampleCopy();

    try {
      const stale = join(root, "generated", "census", "departed.md");
      mkdirSync(join(root, "generated", "census"), { recursive: true });
      writeFileSync(stale, "stale\n", "utf8");
      const capture = createCaptureOutput();

      expect(runSdpCli(["census", root], capture.output)).toBe(0);
      expect(readdirSync(join(root, "generated", "census"))).toEqual(["index.md"]);
      expect(existsSync(stale)).toBe(false);
      expect(existsSync(join(root, "generated", "census.tmp"))).toBe(false);
      expect(capture.readStdout()).toContain("generated/census (1 pages)");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses drift under --check-clean and removes output that cannot read as current", () => {
    const root = materializeExampleCopy();

    try {
      expect(runSdpCli(["census", root], createCaptureOutput().output)).toBe(0);
      const page = join(root, "generated", "census", "index.md");
      writeFileSync(page, `${readFileSync(page, "utf8")}\nperturbed\n`, "utf8");
      const capture = createCaptureOutput();

      expect(runSdpCli(["census", root, "--check-clean"], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain(
        "generated census differs from the current projection",
      );
      expect(existsSync(join(root, "generated", "census"))).toBe(false);
      expect(existsSync(join(root, "generated", "census.tmp"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses a diverging --check-clean twin without publishing stale or partial output", () => {
    const root = materializeExampleCopy();

    try {
      expect(runSdpCli(["census", root], createCaptureOutput().output)).toBe(0);
      let renders = 0;
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["census", root, "--check-clean"], capture.output, {
          renderCensus: (reader) => {
            renders += 1;
            const pages = renderCensus(reader);
            return renders === 1 ? pages : [];
          },
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain("two independent renders diverged");
      expect(existsSync(join(root, "generated", "census"))).toBe(false);
      expect(existsSync(join(root, "generated", "census.tmp"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("invalidates stale census output before a controlled failed build", () => {
    const root = materializeExtractCorpus("invalid-non-static-id");

    try {
      const stale = join(root, "generated", "census", "index.md");
      mkdirSync(join(root, "generated", "census"), { recursive: true });
      writeFileSync(stale, "# stale census\n", "utf8");
      const capture = createCaptureOutput();

      expect(runSdpCli(["census", root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(existsSync(join(root, "generated", "census"))).toBe(false);
      expect(existsSync(join(root, "generated", "census.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });
});
