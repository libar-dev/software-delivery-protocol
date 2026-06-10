import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

import { SDP_HELP_TEXT, isCliEntrypoint, runSdpCli } from "../src/cli/sdp.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const exampleRoot = join(repoRoot, "examples", "checkout-v1");

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

describe("sdp cli", () => {
  it("prints the exact help text for no args", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli([], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`${SDP_HELP_TEXT}\n`);
    expect(capture.readStderr()).toBe("");
  });

  it("prints the exact help text for --help", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["--help"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`${SDP_HELP_TEXT}\n`);
    expect(capture.readStderr()).toBe("");
  });

  it("builds the checkout-v1 example: writes graph.json (and no temp leftover) and exits 0", () => {
    rmSync(join(exampleRoot, "generated"), { recursive: true, force: true });
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", exampleRoot], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe("");
    expect(capture.readStdout()).toContain("9 specs · 1 packs · 3 anchors → 13 nodes · 25 edges");
    expect(readdirSync(join(exampleRoot, "generated"))).toEqual(["graph.json"]);
  });

  it("builds cleanly with no root argument from the repository root (the default-root path)", () => {
    // The repo itself must stay a clean default root: corpora are committed defused
    // (*.sdp.ts.txt / *.ts.txt), so the only *.sdp.ts under the root is the example model, and
    // the anchor sweep finds only the example's anchors (recognition is by import binding — this
    // repo's own tests import the protocol by relative path, so they bind nothing).
    rmSync(join(repoRoot, "generated"), { recursive: true, force: true });
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe("");
    expect(capture.readStdout()).toContain("9 specs · 1 packs · 3 anchors → 13 nodes · 25 edges");
    rmSync(join(repoRoot, "generated"), { recursive: true, force: true });
  });

  it("passes --check-clean on the example (determinism self-check through the CLI)", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", exampleRoot, "--check-clean"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe("");
  });

  it("end-to-end determinism self-check: delete generated/, rebuild, byte-identical", () => {
    const graphPath = join(exampleRoot, "generated", "graph.json");
    expect(runSdpCli(["build", exampleRoot], createCaptureOutput().output)).toBe(0);
    const firstBuild = readFileSync(graphPath, "utf8");

    rmSync(join(exampleRoot, "generated"), { recursive: true, force: true });
    expect(runSdpCli(["build", exampleRoot], createCaptureOutput().output)).toBe(0);

    expect(readFileSync(graphPath, "utf8")).toBe(firstBuild);
  });

  it("exits 1, writes nothing, and removes a stale graph.json on a hard-error corpus", () => {
    const corpusRoot = materializeExtractCorpus("invalid-non-static-id");

    try {
      const stalePath = join(corpusRoot, "generated", "graph.json");
      mkdirSync(join(corpusRoot, "generated"), { recursive: true });
      writeFileSync(stalePath, '{ "stale": true }\n', "utf8");

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(capture.readStderr()).toContain("graph.json not written");
      // The stale artifact is gone: a failed build leaves no graph that could read as current.
      expect(existsSync(stalePath)).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("recognizes the published-bin path: a .bin-style symlink resolves to the entry module", () => {
    const directory = mkdtempSync(join(tmpdir(), "sdp-bin-"));

    try {
      const entryFile = join(directory, "sdp.js");
      writeFileSync(entryFile, "// stand-in for the built CLI entry\n", "utf8");
      const binLink = join(directory, "sdp");
      symlinkSync(entryFile, binLink);
      const moduleUrl = pathToFileURL(entryFile).href;

      expect(isCliEntrypoint(binLink, moduleUrl)).toBe(true);
      expect(isCliEntrypoint(entryFile, moduleUrl)).toBe(true);
      expect(isCliEntrypoint(join(directory, "unrelated.js"), moduleUrl)).toBe(false);
      expect(isCliEntrypoint(undefined, moduleUrl)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("validates the example: exit 0, the artifact written, and exactly the one surfaced warning", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["validate", exampleRoot, "--check-clean"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toContain("9 specs · 1 packs · 3 anchors → 13 nodes · 25 edges");
    expect(capture.readStdout()).toContain(
      "validate: 0 errors · 1 warnings (conformance + honesty over the one graph)",
    );
    // The standing warning is the invalid-cart example's unenabled verifier — informative, never
    // a gate (it is the surfaced absence the check exists for, not noise to silence).
    expect(capture.readStderr()).toContain("conformance/verifies-linkage");
    expect(capture.readStderr()).not.toContain("[error]");
    expect(existsSync(join(exampleRoot, "generated", "graph.json"))).toBe(true);
  });

  it("gates on the checks, not the build: a clean-building broken link validates to exit 1 with the artifact kept", () => {
    const corpusRoot = materializeExtractCorpus("dangling-relation");

    try {
      expect(runSdpCli(["build", corpusRoot], createCaptureOutput().output)).toBe(0);

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["validate", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("conformance/referential-integrity");
      expect(capture.readStdout()).toContain("validate: 1 errors · 0 warnings");
      // The artifact stays: the graph is the faithful projection — the check errors describe the
      // repo's conformance, not the artifact.
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("short-circuits the checks on extraction hard errors: validate keeps build semantics", () => {
    const corpusRoot = materializeExtractCorpus("invalid-non-static-id");

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["validate", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(capture.readStderr()).toContain("sdp validate: hard errors present");
      expect(capture.readStdout()).not.toContain("conformance");
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("prints help plus an unknown-command error", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["bogus"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe(`${SDP_HELP_TEXT}\n\nUnknown command: bogus\n`);
  });
});
