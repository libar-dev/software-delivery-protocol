import type { CliOutput } from "../../src/cli/output.js";

export interface CaptureOutput {
  readonly output: CliOutput;
  readonly readStdout: () => string;
  readonly readStderr: () => string;
}

/**
 * The one CLI capture harness: an injected `CliOutput` whose streams append to buffers the
 * assertions read back. Shared here so a change to the write contract touches one file, not one
 * copy per suite.
 */
export function createCaptureOutput(): CaptureOutput {
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
    readStdout: () => stdoutChunks.join(""),
    readStderr: () => stderrChunks.join(""),
  };
}
