import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function createCaptureOutput() {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  return {
    output: {
      stdout: {
        write(chunk: string) {
          stdoutChunks.push(chunk);
        },
      },
      stderr: {
        write(chunk: string) {
          stderrChunks.push(chunk);
        },
      },
    },
    readStdout() {
      return stdoutChunks.join("");
    },
    readStderr() {
      return stderrChunks.join("");
    },
  };
}

// A committed corpus root, materialized per suite: the sink derives the graph in process from real
// on-disk files, so the fixture exercises the same production path the repository root does at a
// size the assertions can read. The suite never names the repository root as `--root`, so nothing
// here can touch root generated/ and the file stays in the pooled test leg.
const corpusRoot = materializeExtractCorpus("anchored-binding");
const parentId = "spec:orders.anchored-parent";
const exampleId = "spec:orders.anchored-parent.example";

// stdin is a real terminal-or-not decision in production; the suite drives both answers through the
// injected hooks rather than reshaping the process's own descriptors under a parallel test runner.
const pipedStdin = (body: string) => ({
  query: { isStdinTty: () => false, readStdin: () => body },
});
const terminalStdin = {
  query: {
    isStdinTty: () => true,
    readStdin: (): string => {
      throw new Error("stdin must never be read when it is a terminal");
    },
  },
};

async function runQ(
  args: readonly string[],
  capture: ReturnType<typeof createCaptureOutput>,
  hooks: Parameters<typeof runSdpCli>[2] = {},
): Promise<number> {
  return await runSdpCli(["q", ...args], capture.output, hooks);
}

describe("sdp q — the agent front door", () => {
  afterAll(() => {
    removeMaterializedCorpus(corpusRoot);
  });

  it("evaluates an argv body over the derived graph and prints the pre-shaped return", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return g.specs().map((spec) => spec.id)", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`[ '${parentId}', '${exampleId}' ]\n`);
    expect(capture.readStderr()).toBe("");
  });

  it("reads the body from stdin when stdin is not a terminal", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["--root", corpusRoot],
      capture,
      pipedStdin("return g.specs().length"),
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("2\n");
  });

  it("prefers the argv body over stdin when both are available", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return 'argv'", "--root", corpusRoot],
      capture,
      pipedStdin("return 'stdin'"),
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("'argv'\n");
  });

  it("refuses with no body when stdin is a terminal instead of waiting on it", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(["--root", corpusRoot], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("no body supplied and stdin is a terminal");
  });

  it("refuses an empty body rather than evaluating nothing", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(["   ", "--root", corpusRoot], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStderr()).toContain("the body is empty");
  });

  it("prints JSON for --json", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return { ids: g.specs().map((spec) => spec.id) }", "--root", corpusRoot, "--json"],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({ ids: [parentId, exampleId] });
  });

  it("exits 1 and names the failure when the body throws", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["throw new Error('the body refused')", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("sdp q: the body refused");
  });

  it("exits 1 on a body that does not compile", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(["return (", "--root", corpusRoot], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("sdp q:");
  });

  it("awaits an asynchronous body", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return await Promise.resolve(g.specs().length)", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("2\n");
  });

  it("injects a live reader: the entry adapters answer from the derived graph", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "const context = g.specContext(g.specs()[0].id); return { concept: g.findByConcept('anchored').length > 0, boundSpecs: g.byFile('bindings.ts').specs, facts: context.deliveryFacts };",
        "--root",
        corpusRoot,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      concept: true,
      boundSpecs: [parentId, exampleId],
      facts: ["implemented", "has-verifier"],
    });
  });

  it("injects the raw graph schema alongside the reader", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return { sameGraph: graph === g.graph, nodeTypes: [...new Set(graph.nodes.map((node) => node.nodeType))].sort() }",
        "--root",
        corpusRoot,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      sameGraph: true,
      nodeTypes: ["Anchor", "CodeNode", "Primitive"],
    });
  });

  it("injects the validation report as data, never as a gate", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return { validatorId: report.validatorId, findings: report.findings.length, sameAsReader: report.findings.length === g.findings().length }",
        "--root",
        corpusRoot,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      validatorId: "graph",
      findings: 0,
      sameAsReader: true,
    });
  });

  it("runs the body when the graph merely reports findings — checks never gate the read path", async () => {
    const findingRoot = materializeExtractCorpus("orphan-spec");
    const capture = createCaptureOutput();

    try {
      const exitCode = await runQ(
        [
          "return report.findings.map((finding) => finding.severity)",
          "--root",
          findingRoot,
          "--json",
        ],
        capture,
        terminalStdin,
      );

      expect(exitCode).toBe(0);

      const severities = JSON.parse(capture.readStdout()) as readonly string[];
      expect(severities.length).toBeGreaterThan(0);
      expect(severities).not.toContain("error");
    } finally {
      removeMaterializedCorpus(findingRoot);
    }
  });

  it("refuses to run the body when the graph does not derive, rendering the extraction findings", async () => {
    const brokenRoot = materializeExtractCorpus("duplicate-id");
    const capture = createCaptureOutput();

    try {
      const exitCode = await runQ(
        ["return 'the body must not run'", "--root", brokenRoot],
        capture,
        terminalStdin,
      );

      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toContain("[error]");
      expect(capture.readStderr()).toContain("the graph did not derive");
    } finally {
      removeMaterializedCorpus(brokenRoot);
    }
  });

  it("reports a body that returns nothing rather than printing a silent blank", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["g.specs().length;", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("the body returned nothing");
  });

  it("refuses an unknown option and a second body without deriving anything", async () => {
    const unknownOption = createCaptureOutput();
    expect(await runQ(["return 1", "--wat"], unknownOption, terminalStdin)).toBe(1);
    expect(unknownOption.readStderr()).toContain("unknown option --wat");

    const secondBody = createCaptureOutput();
    expect(await runQ(["return 1", "return 2"], secondBody, terminalStdin)).toBe(1);
    expect(secondBody.readStderr()).toContain("at most one body argument");

    const missingRoot = createCaptureOutput();
    expect(await runQ(["return 1", "--root"], missingRoot, terminalStdin)).toBe(1);
    expect(missingRoot.readStderr()).toContain("--root requires a path");
  });

  it("refuses a root that is not a directory, naming the resolved absolute path", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return 1", "--root", join(corpusRoot, "no-such-directory")],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStderr()).toContain("is not a directory");
    expect(capture.readStderr()).toContain(join(corpusRoot, "no-such-directory"));
  });

  it("honours --exclude, so the sink omits exactly the paths the caller names", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return g.specs().map((spec) => spec.id)",
        "--root",
        corpusRoot,
        "--exclude",
        "verifying-example.sdp.ts",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`[ '${parentId}' ]\n`);
  });

  it("writes nothing: the sink is a pure read tool", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(["return g.specs().length", "--root", corpusRoot], capture, {
      query: { isStdinTty: () => true, readStdin: () => "" },
    });

    expect(exitCode).toBe(0);
    expect(existsSync(join(corpusRoot, "generated"))).toBe(false);
    expect(existsSync(join(repoRoot, "generated", "graph.json"))).toBe(true);
  });
});
