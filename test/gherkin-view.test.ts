import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import { extract } from "../src/extract/index.js";
import { GHERKIN_KIND_LIE_REASONS } from "../src/extract/gherkin-kind-honesty.js";
import type { GraphSchema } from "../src/graph/schema.js";
import { schemaVersion } from "../src/graph/schema.js";
import { escapeGherkinViewText, renderGherkinView } from "../src/projections/gherkin-view.js";
import { createReader } from "../src/reader/reader.js";
import type { Reader, SpecContext, SpecSummary } from "../src/reader/reader.js";
import type { Finding } from "../src/validate/contracts.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const gherkinViewTestAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-view"),
  label: "verifies the generated Gherkin-shaped READ projection",
  verifies: ref("spec:consumers.gherkin-view"),
});
void gherkinViewTestAnchor;

const checkoutRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));

const pages = [
  { path: "index.md", content: "# Generated Gherkin\n" },
  { path: "spec/probe.feature.md", content: "Feature: Probe\n" },
] as const;

function emptyGraph(): GraphSchema {
  return { schemaVersion, nodes: [], edges: [] };
}

function specSummary(overrides: Partial<SpecSummary> = {}): SpecSummary {
  return {
    id: "spec:probe.behavior",
    title: "Probe behavior",
    specKind: "behavior",
    kindDisplayLabel: "Use Case / Behavior",
    altitude: "feature",
    statedReadiness: "defined",
    deliveryFacts: [],
    file: "specs/probe.sdp.md",
    packs: [],
    ...overrides,
  };
}

function specContext(overrides: Partial<SpecContext> = {}): SpecContext {
  const summary = specSummary(overrides);
  return {
    ...summary,
    floorFailures: [],
    relationsOut: [],
    relationsIn: [],
    implementations: [],
    verifiers: [],
    findings: [],
    ...overrides,
  };
}

function readerStub(contexts: readonly SpecContext[], findings: readonly Finding[] = []): Reader {
  const unavailable = (): never => {
    throw new Error("gherkin view used a Reader accessor outside specs/specContext/findings");
  };

  return {
    graph: emptyGraph(),
    specs: () => contexts,
    specContext: (id) => contexts.find((context) => context.id === id),
    findings: () => findings,
    packs: unavailable,
    findByConcept: unavailable,
    byFile: unavailable,
    blastRadius: unavailable,
    packContext: unavailable,
  };
}

function pageByPath(
  rendered: readonly { readonly path: string; readonly content: string }[],
  path: string,
): string {
  const page = rendered.find((entry) => entry.path === path);
  if (page === undefined) throw new Error(`missing page ${path}`);
  return page.content;
}

function publishedTree(root: string): ReadonlyMap<string, string> {
  const projectionRoot = join(root, "generated", "gherkin");
  const tree = new Map<string, string>();

  for (const entry of readdirSync(projectionRoot, { recursive: true, withFileTypes: true })) {
    if (entry.isFile()) {
      const absolute = join(entry.parentPath, entry.name);
      tree.set(
        absolute.slice(projectionRoot.length + 1).replaceAll("\\", "/"),
        readFileSync(absolute, "utf8"),
      );
    }
  }

  return tree;
}

describe("the generated Gherkin-shaped READ projection", () => {
  it("double-renders byte-identically and sorts independently of input order", () => {
    const contexts = [
      specContext({
        id: "spec:z.decision",
        specKind: "decision",
        title: "Later",
        sections: { decision: { decision: "Stay on Markdown" } },
      }),
      specContext({
        id: "spec:a.behavior",
        specKind: "behavior",
        title: "Earlier",
        narrative: "Owned narrative.",
        sections: {
          intent: { outcome: "Read any Spec" },
          behavior: { rules: ["Title-only"] },
        },
      }),
    ];

    const first = renderGherkinView(readerStub(contexts));
    const second = renderGherkinView(readerStub([...contexts].reverse()));

    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(first.map((page) => page.path)).toEqual([
      "index.md",
      "spec/a.behavior.feature.md",
      "spec/z.decision.feature.md",
    ]);
    expect(pageByPath(first, "index.md")).toContain("Generated Gherkin-shaped READ projection");
    expect(pageByPath(first, "spec/a.behavior.feature.md")).toContain("Feature: Earlier");
    expect(pageByPath(first, "spec/a.behavior.feature.md")).toContain("- outcome: Read any Spec");
    expect(pageByPath(first, "spec/a.behavior.feature.md")).toContain("Rule: Title-only");
  });

  it("labels the index as diagnostic when validation errors are present", () => {
    const diagnostic = renderGherkinView(
      readerStub(
        [specContext()],
        [
          {
            validatorId: "conformance/referential-integrity",
            family: "conformance",
            severity: "error",
            message: "missing target",
          },
          {
            validatorId: "honesty/readiness-floor",
            family: "honesty",
            severity: "warning",
            message: "advisory warning",
          },
        ],
      ),
    );

    expect(pageByPath(renderGherkinView(readerStub([specContext()])), "index.md")).not.toContain(
      "Diagnostic projection",
    );
    expect(pageByPath(diagnostic, "index.md")).toContain(
      "Diagnostic projection — validation errors present",
    );
    expect(pageByPath(diagnostic, "index.md")).toContain("1 error and 1 warning");
  });

  it("marks refused kinds with the ruled lie-reason and never uses .sdp.gherkin", () => {
    const pages = renderGherkinView(
      readerStub([
        specContext({
          id: "spec:probe.decision",
          specKind: "decision",
          title: "A decision",
          sections: {
            decision: {
              context: "Kind honesty",
              decision: "Stay Markdown",
              rationale: ["Feature cannot distinguish the slots"],
            },
          },
        }),
      ]),
    );

    const page = pageByPath(pages, "spec/probe.decision.feature.md");
    expect(page).toContain(`# LOSSY: ${GHERKIN_KIND_LIE_REASONS.decision}`);
    expect(page).toContain("# LOSSY: decision: Stay Markdown");
    expect(pages.every((entry) => !entry.path.endsWith(".sdp.gherkin"))).toBe(true);
    expect(page).not.toContain(".sdp.gherkin");
  });

  it("marks every populated section that a canonical Gherkin shape cannot represent", () => {
    const pages = renderGherkinView(
      readerStub([
        specContext({
          id: "spec:probe.lossy-sections",
          sections: {
            intent: { outcome: "Keep omissions visible." },
            behavior: { rules: ["Rendered behavior"] },
            constraints: [{ statement: "Remain bounded." }],
            model: { terms: { Order: "A purchase." } },
            design: { description: "A design note." },
            decision: { decision: "A local choice." },
            verification: { criteria: ["Markers remain visible."] },
            ui: { description: "A UI note." },
          },
        }),
      ]),
    );
    const page = pageByPath(pages, "spec/probe.lossy-sections.feature.md");

    for (const section of ["constraints", "decision", "design", "model", "ui"]) {
      expect(page).toContain(
        `# LOSSY: ${section} section is present but cannot be represented honestly`,
      );
    }
    expect(page).not.toContain("# LOSSY: behavior section");
    expect(page).not.toContain("# LOSSY: intent section");
    expect(page).not.toContain("# LOSSY: verification section");
  });

  it("escapes hostile characters so they cannot close a fence or invent a DocString", () => {
    const hostile = 'quotes " ``` fence """ docstring\nnewline';
    const pages = renderGherkinView(
      readerStub([
        specContext({
          id: "spec:probe.hostile",
          title: hostile,
          narrative: hostile,
        }),
      ]),
    );
    const page = pageByPath(pages, "spec/probe.hostile.feature.md");

    expect(page).toContain(escapeGherkinViewText(hostile));
    expect(page).not.toContain("```");
    expect(page).not.toContain('"""');
    expect(page.split("\n").some((line) => line.includes("quotes"))).toBe(true);
  });

  it("renders the checkout-v1 corpus as a disposable generated view", () => {
    const first = renderGherkinView(createReader(extract({ root: checkoutRoot }).graph));
    const second = renderGherkinView(createReader(extract({ root: checkoutRoot }).graph));

    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(first.some((page) => page.path === "index.md")).toBe(true);
    expect(first.some((page) => page.path === "spec/decisions.order-lifecycle.feature.md")).toBe(
      true,
    );
    expect(pageByPath(first, "spec/decisions.order-lifecycle.feature.md")).toContain(
      GHERKIN_KIND_LIE_REASONS.decision,
    );
    expect(first.every((page) => !page.path.endsWith(".sdp.gherkin"))).toBe(true);
  });
});

describe("sdp gherkin publication", () => {
  it("publishes diagnostic output for validation errors and returns nonzero", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["gherkin", root], capture.output, {
          extract: (options) => {
            const result = extract(options);
            const source = result.graph.nodes.find((node) => node.nodeType === "Primitive");
            if (source === undefined) throw new Error("diagnostic probe needs a Spec");

            return {
              ...result,
              graph: {
                ...result.graph,
                edges: [
                  ...result.graph.edges,
                  {
                    from: source.id,
                    type: "dependsOn",
                    to: "spec:probe.missing",
                    claim: "declared",
                  },
                ],
              },
            };
          },
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain("spec:probe.missing");
      expect(readFileSync(join(root, "generated", "gherkin", "index.md"), "utf8")).toContain(
        "Diagnostic projection — validation errors present",
      );
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("surfaces the explicit command in help and names Gherkin on bad input", () => {
    const capture = createCaptureOutput();
    expect(runSdpCli(["gherkin", "--bogus"], capture.output)).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe("sdp gherkin: unknown option --bogus\n");
  });

  it("publishes only generated/gherkin wholesale and regenerates byte-identically without tmp residue", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      const viewRoot = join(root, "generated", "gherkin");
      const stale = join(viewRoot, "departed.md");
      mkdirSync(viewRoot, { recursive: true });
      writeFileSync(stale, "stale\n", "utf8");
      const firstCapture = createCaptureOutput();

      expect(
        runSdpCli(["gherkin", root], firstCapture.output, { renderGherkinView: () => pages }),
      ).toBe(0);
      expect([...publishedTree(root).keys()].sort()).toEqual(["index.md", "spec/probe.feature.md"]);
      expect(existsSync(stale)).toBe(false);
      expect(existsSync(`${viewRoot}.tmp`)).toBe(false);
      expect(firstCapture.readStdout()).toContain("generated/gherkin (2 pages)");
      const first = publishedTree(root);

      expect(
        runSdpCli(["gherkin", root], createCaptureOutput().output, {
          renderGherkinView: () => pages,
        }),
      ).toBe(0);
      expect(publishedTree(root)).toEqual(first);
      expect(existsSync(`${viewRoot}.tmp`)).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("passes --check-clean only when twin renders and the published bytes agree", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      expect(
        runSdpCli(["gherkin", root], createCaptureOutput().output, {
          renderGherkinView: () => pages,
        }),
      ).toBe(0);
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["gherkin", root, "--check-clean"], capture.output, {
          renderGherkinView: () => pages,
        }),
      ).toBe(0);
      expect(capture.readStderr()).toBe("");
      expect(publishedTree(root)).toEqual(
        new Map([
          ["index.md", "# Generated Gherkin\n"],
          ["spec/probe.feature.md", "Feature: Probe\n"],
        ]),
      );
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("refuses perturbed published bytes and removes both live and temporary roots", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      expect(
        runSdpCli(["gherkin", root], createCaptureOutput().output, {
          renderGherkinView: () => pages,
        }),
      ).toBe(0);
      const page = join(root, "generated", "gherkin", "index.md");
      writeFileSync(page, `${readFileSync(page, "utf8")}perturbed\n`, "utf8");
      mkdirSync(join(root, "generated", "gherkin.tmp"), { recursive: true });
      writeFileSync(join(root, "generated", "gherkin.tmp", "partial.md"), "partial\n", "utf8");
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["gherkin", root, "--check-clean"], capture.output, {
          renderGherkinView: () => pages,
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain(
        "generated Gherkin view differs from the current projection",
      );
      expect(existsSync(join(root, "generated", "gherkin"))).toBe(false);
      expect(existsSync(join(root, "generated", "gherkin.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("refuses divergent --check-clean twins and removes both publication roots", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      expect(
        runSdpCli(["gherkin", root], createCaptureOutput().output, {
          renderGherkinView: () => pages,
        }),
      ).toBe(0);
      let renderCount = 0;
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["gherkin", root, "--check-clean"], capture.output, {
          renderGherkinView: () => {
            renderCount += 1;
            return renderCount === 1 ? pages : pages.slice(0, 1);
          },
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain("two independent renders diverged");
      expect(existsSync(join(root, "generated", "gherkin"))).toBe(false);
      expect(existsSync(join(root, "generated", "gherkin.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("removes planted stale live and tmp output when the authored corpus fails", () => {
    const root = materializeExtractCorpus("invalid-non-static-id");

    try {
      for (const directory of ["gherkin", "gherkin.tmp"]) {
        const projection = join(root, "generated", directory);
        mkdirSync(projection, { recursive: true });
        writeFileSync(join(projection, "stale.md"), "stale\n", "utf8");
      }
      const capture = createCaptureOutput();

      expect(runSdpCli(["gherkin", root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(existsSync(join(root, "generated", "gherkin"))).toBe(false);
      expect(existsSync(join(root, "generated", "gherkin.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });
});
