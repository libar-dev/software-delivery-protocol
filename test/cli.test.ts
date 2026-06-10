import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));
const hardErrorCorpusRoot = fileURLToPath(
  new URL("./fixtures/extract/invalid-non-static-id", import.meta.url),
);

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

  it("builds the checkout-v1 example: writes graph.json and exits 0", () => {
    rmSync(join(exampleRoot, "generated"), { recursive: true, force: true });
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", exampleRoot], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe("");
    expect(capture.readStdout()).toContain("9 specs · 1 packs → 10 nodes · 22 edges");
    expect(existsSync(join(exampleRoot, "generated", "graph.json"))).toBe(true);
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

  it("exits 1 and writes nothing on a hard-error corpus (the artifact is all-or-nothing)", () => {
    rmSync(join(hardErrorCorpusRoot, "generated"), { recursive: true, force: true });
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", hardErrorCorpusRoot], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStderr()).toContain("extract/non-static-envelope");
    expect(capture.readStderr()).toContain("graph.json not written");
    expect(existsSync(join(hardErrorCorpusRoot, "generated"))).toBe(false);
  });

  it("rejects validate as not wired", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["validate"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe(
      "sdp validate gate is not wired yet (Slice 3: graph validator gate).\n",
    );
  });

  it("prints help plus an unknown-command error", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["bogus"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe(`${SDP_HELP_TEXT}\n\nUnknown command: bogus\n`);
  });
});
