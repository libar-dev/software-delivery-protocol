import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { isatty } from "node:tty";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

/**
 * A content fingerprint of a tree, `"absent"` when it does not exist: the "writes nothing" case
 * compares before and after, so it detects a write at the invoking root without requiring the
 * gitignored `generated/` tree to exist (both reads are `"absent"` in a clean clone).
 */
function fingerprintTree(root: string): string {
  if (!existsSync(root)) {
    return "absent";
  }

  const hash = createHash("sha256");

  const walk = (directory: string): void => {
    const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    for (const entry of entries) {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(path);
      } else {
        hash.update(path);
        hash.update(readFileSync(path));
      }
    }
  };

  walk(root);
  return hash.digest("hex");
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

  it("refuses an empty --root instead of reinterpreting it as the working directory", async () => {
    // An unset shell variable must not become "answer about cwd at exit 0" — the wrong-corpus
    // answer is the one failure mode an agent cannot detect from the output.
    const capture = createCaptureOutput();

    const exitCode = await runQ(["return 1", "--root", ""], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("--root requires a path");
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

  it("runs the body when extraction itself only warns — the warning is data, never a gate", async () => {
    const warningRoot = materializeExtractCorpus("unrecognized-statement");
    const capture = createCaptureOutput();

    try {
      const exitCode = await runQ(
        ["return g.specs().map((spec) => spec.id)", "--root", warningRoot, "--json"],
        capture,
        terminalStdin,
      );

      // The refusal is keyed to a graph that did not derive, never to a graph that merely had
      // something to say: a warning-level extraction finding leaves the body running.
      expect(exitCode).toBe(0);
      expect(JSON.parse(capture.readStdout())).toEqual(["spec:orders.recognized"]);
      // And it still reaches the operator, through the one diagnostic currency, beside the
      // answer rather than instead of it.
      expect(capture.readStderr()).toContain("[warning] extract/unrecognized-statement");
    } finally {
      removeMaterializedCorpus(warningRoot);
    }
  });

  it("detects a terminal from the file descriptor, never from a stream property", async () => {
    const forged = !isatty(0);
    const descriptor = Object.getOwnPropertyDescriptor(process.stdin, "isTTY");
    const capture = createCaptureOutput();

    // The gen-1 footgun the front-door ruling named by name: `process.stdin.isTTY` is a stream
    // property that can be absent, stale, or — as here — simply wrong, while `isatty(0)` asks the
    // descriptor itself. Forging the property must not move the answer. The forgery is this
    // process's own property rather than its descriptors, and it is restored below.
    Object.defineProperty(process.stdin, "isTTY", { value: forged, configurable: true });

    try {
      const exitCode = await runQ(["--root", corpusRoot], capture, {
        query: { readStdin: () => "return g.specs().length" },
      });

      if (isatty(0)) {
        expect(exitCode).toBe(1);
        expect(capture.readStderr()).toContain("stdin is a terminal");
      } else {
        expect(exitCode).toBe(0);
        expect(capture.readStdout()).toBe("2\n");
      }
    } finally {
      if (descriptor === undefined) {
        delete (process.stdin as { isTTY?: boolean }).isTTY;
      } else {
        Object.defineProperty(process.stdin, "isTTY", descriptor);
      }
    }
  });

  it("puts --exclude through the strict exclusion contract before deriving anything", async () => {
    // The trust boundary the ruling records is identity, not containment: an exclusion path is
    // resolved and validated at the edge, so an absolute path, a traversal, the empty string, and
    // the root itself are refused by name rather than quietly reinterpreted.
    for (const path of ["/etc", "../outside", "", "."]) {
      const capture = createCaptureOutput();

      expect(
        await runQ(["return 1", "--root", corpusRoot, "--exclude", path], capture, terminalStdin),
      ).toBe(1);
      expect(capture.readStderr()).toContain(`invalid --exclude path "${path}"`);
      expect(capture.readStdout()).toBe("");
    }
  });

  it("reports a throw from rendering the return value through the one diagnostic currency", async () => {
    // The rendering path runs after the body's own try/catch; a hostile custom-inspect method (or
    // a poisoned getter) must still exit 1 as `sdp q: …`, never escape as an unhandled rejection.
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "const custom = Symbol.for('nodejs.util.inspect.custom'); return { [custom]() { throw new Error('rendering refused'); } };",
        "--root",
        corpusRoot,
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("sdp q: rendering refused");
  });

  it("refuses a --json return value whose toJSON yields no JSON form", async () => {
    // `JSON.stringify` answers `undefined` here rather than throwing; printing that would put the
    // literal text `undefined` on stdout under a success exit — non-JSON on the JSON contract.
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return { toJSON: () => undefined }", "--root", corpusRoot, "--json"],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("has no JSON form");
  });

  it("writes nothing: the sink is a pure read tool", async () => {
    const rootGenerated = join(repoRoot, "generated");
    const before = fingerprintTree(rootGenerated);
    const capture = createCaptureOutput();

    const exitCode = await runQ(["return g.specs().length", "--root", corpusRoot], capture, {
      query: { isStdinTty: () => true, readStdin: () => "" },
    });

    expect(exitCode).toBe(0);
    expect(existsSync(join(corpusRoot, "generated"))).toBe(false);
    // cwd is the repository root under the pooled runner, so an unchanged fingerprint pins "no
    // write at the invoking root" in the direction the test name claims.
    expect(fingerprintTree(rootGenerated)).toBe(before);
  });
});
