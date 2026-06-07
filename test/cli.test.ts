import { describe, expect, it } from "vitest";

import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";

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

  it("rejects build as not implemented", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe("sdp build is not implemented yet (Slice 1: extractor).\n");
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
