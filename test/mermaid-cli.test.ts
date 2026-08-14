import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const pages = [
  { path: "domains/orders.md", content: "# Orders\n" },
  { path: "index.md", content: "# Mermaid\n\n```mermaid\ngraph TD\n```\n" },
] as const;

function publishedTree(root: string): ReadonlyMap<string, string> {
  const projectionRoot = join(root, "generated", "mermaid");
  const tree = new Map<string, string>();

  for (const entry of readdirSync(projectionRoot, { recursive: true, withFileTypes: true })) {
    if (entry.isFile()) {
      const absolute = join(entry.parentPath, entry.name);
      tree.set(absolute.slice(projectionRoot.length + 1), readFileSync(absolute, "utf8"));
    }
  }

  return tree;
}

describe("sdp mermaid publication", () => {
  it("surfaces the explicit command in help and names Mermaid on bad input", () => {
    expect(SDP_HELP_TEXT).toContain("sdp mermaid [root] [--exclude PATH]... [--check-clean]");
    expect(SDP_HELP_TEXT).toContain("mermaid");

    const capture = createCaptureOutput();
    expect(runSdpCli(["mermaid", "--bogus"], capture.output)).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe("sdp mermaid: unknown option --bogus\n");
  });

  it("publishes only generated/mermaid wholesale and regenerates byte-identically without tmp residue", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      const mermaidRoot = join(root, "generated", "mermaid");
      const stale = join(mermaidRoot, "departed.md");
      mkdirSync(mermaidRoot, { recursive: true });
      writeFileSync(stale, "stale\n", "utf8");
      const firstCapture = createCaptureOutput();

      expect(
        runSdpCli(["mermaid", root], firstCapture.output, { renderMermaid: () => pages }),
      ).toBe(0);
      expect([...publishedTree(root).keys()].sort()).toEqual(["domains/orders.md", "index.md"]);
      expect(existsSync(stale)).toBe(false);
      expect(existsSync(`${mermaidRoot}.tmp`)).toBe(false);
      expect(firstCapture.readStdout()).toContain("generated/mermaid (2 pages)");
      const first = publishedTree(root);

      expect(
        runSdpCli(["mermaid", root], createCaptureOutput().output, {
          renderMermaid: () => pages,
        }),
      ).toBe(0);
      expect(publishedTree(root)).toEqual(first);
      expect(existsSync(`${mermaidRoot}.tmp`)).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("passes --check-clean only when twin renders and the published bytes agree", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      expect(
        runSdpCli(["mermaid", root], createCaptureOutput().output, {
          renderMermaid: () => pages,
        }),
      ).toBe(0);
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["mermaid", root, "--check-clean"], capture.output, {
          renderMermaid: () => pages,
        }),
      ).toBe(0);
      expect(capture.readStderr()).toBe("");
      expect(publishedTree(root)).toEqual(
        new Map([
          ["domains/orders.md", "# Orders\n"],
          ["index.md", "# Mermaid\n\n```mermaid\ngraph TD\n```\n"],
        ]),
      );
      expect(existsSync(join(root, "generated", "mermaid.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("refuses perturbed published bytes and removes both live and temporary roots", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      expect(
        runSdpCli(["mermaid", root], createCaptureOutput().output, {
          renderMermaid: () => pages,
        }),
      ).toBe(0);
      const page = join(root, "generated", "mermaid", "index.md");
      writeFileSync(page, `${readFileSync(page, "utf8")}perturbed\n`, "utf8");
      mkdirSync(join(root, "generated", "mermaid.tmp"), { recursive: true });
      writeFileSync(join(root, "generated", "mermaid.tmp", "partial.md"), "partial\n", "utf8");
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["mermaid", root, "--check-clean"], capture.output, {
          renderMermaid: () => pages,
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain(
        "generated Mermaid differs from the current projection",
      );
      expect(existsSync(join(root, "generated", "mermaid"))).toBe(false);
      expect(existsSync(join(root, "generated", "mermaid.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("refuses divergent --check-clean twins and removes both publication roots", () => {
    const root = materializeExtractCorpus("anchored-binding");

    try {
      expect(
        runSdpCli(["mermaid", root], createCaptureOutput().output, {
          renderMermaid: () => pages,
        }),
      ).toBe(0);
      let renderCount = 0;
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["mermaid", root, "--check-clean"], capture.output, {
          renderMermaid: () => {
            renderCount += 1;
            return renderCount === 1 ? pages : pages.slice(0, 1);
          },
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain("two independent renders diverged");
      expect(existsSync(join(root, "generated", "mermaid"))).toBe(false);
      expect(existsSync(join(root, "generated", "mermaid.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("removes planted stale live and tmp output when the authored corpus fails", () => {
    const root = materializeExtractCorpus("invalid-non-static-id");

    try {
      for (const directory of ["mermaid", "mermaid.tmp"]) {
        const projection = join(root, "generated", directory);
        mkdirSync(projection, { recursive: true });
        writeFileSync(join(projection, "stale.md"), "stale\n", "utf8");
      }
      const capture = createCaptureOutput();

      expect(runSdpCli(["mermaid", root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(existsSync(join(root, "generated", "mermaid"))).toBe(false);
      expect(existsSync(join(root, "generated", "mermaid.tmp"))).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("refuses validation errors that retain a graph and removes both publication roots", () => {
    const root = materializeExtractCorpus("anchored-binding");
    const mermaidRoot = join(root, "generated", "mermaid");
    let renders = 0;

    try {
      for (const directory of [mermaidRoot, `${mermaidRoot}.tmp`]) {
        mkdirSync(directory, { recursive: true });
        writeFileSync(join(directory, "stale.md"), "stale\n", "utf8");
      }
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["mermaid", root], capture.output, {
          validateGraph: () => ({
            validatorId: "graph/report",
            findings: [
              {
                validatorId: "conformance/referential-integrity",
                family: "conformance",
                severity: "error",
                message: "retained-graph validation failure",
                subjectId: "spec:probe.invalid",
              },
            ],
          }),
          renderMermaid: () => {
            renders += 1;
            return pages;
          },
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain("retained-graph validation failure");
      expect(renders).toBe(0);
      expect(existsSync(mermaidRoot)).toBe(false);
      expect(existsSync(`${mermaidRoot}.tmp`)).toBe(false);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it("does not alter census or Design Review bytes while publishing Mermaid", () => {
    const root = materializeExtractCorpus("anchored-binding");
    const censusPage = join(root, "generated", "census", "index.md");
    const reviewPage = join(root, "generated", "design-review", "index.md");
    const censusBytes = "# Census sentinel\n";
    const reviewBytes = "# Design Review sentinel\n";

    try {
      const capture = createCaptureOutput();

      expect(
        runSdpCli(["mermaid", root], capture.output, {
          renderMermaid: () => {
            // Build invalidation has already run. From render through publication, Mermaid owns
            // only its own root and must not couple to either sibling projection.
            mkdirSync(join(root, "generated", "census"), { recursive: true });
            mkdirSync(join(root, "generated", "design-review"), { recursive: true });
            writeFileSync(censusPage, censusBytes, "utf8");
            writeFileSync(reviewPage, reviewBytes, "utf8");
            return pages;
          },
        }),
      ).toBe(0);
      expect(readFileSync(censusPage, "utf8")).toBe(censusBytes);
      expect(readFileSync(reviewPage, "utf8")).toBe(reviewBytes);
      expect(capture.readStdout()).toContain("generated/mermaid");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
