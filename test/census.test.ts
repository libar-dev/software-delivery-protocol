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
