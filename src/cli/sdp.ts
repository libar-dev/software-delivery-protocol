#!/usr/bin/env node

export const SDP_HELP_TEXT = `sdp — Libar Software Delivery Protocol
Usage:
  sdp --help
  sdp build
  sdp validate

Commands:
  build      Not implemented yet (Slice 1: extractor)
  validate   Validation gate not wired yet (Slice 3: graph validator gate)`;

interface CliOutput {
  stdout?: { write: (chunk: string) => void };
  stderr?: { write: (chunk: string) => void };
}

const defaultCliOutput: CliOutput = {
  stdout: process.stdout,
  stderr: process.stderr,
};

function writeStdout(output: CliOutput, text: string): void {
  if (output.stdout !== undefined) {
    output.stdout.write(text);
  }
}

function writeStderr(output: CliOutput, text: string): void {
  if (output.stderr !== undefined) {
    output.stderr.write(text);
  }
}

export function runSdpCli(args: readonly string[], output: CliOutput = defaultCliOutput): number {
  const [command] = args;

  if (command === undefined || command === "--help") {
    writeStdout(output, `${SDP_HELP_TEXT}\n`);
    return 0;
  }

  if (command === "build") {
    writeStderr(output, "sdp build is not implemented yet (Slice 1: extractor).\n");
    return 1;
  }

  if (command === "validate") {
    writeStderr(output, "sdp validate gate is not wired yet (Slice 3: graph validator gate).\n");
    return 1;
  }

  writeStderr(output, `${SDP_HELP_TEXT}\n\nUnknown command: ${command}\n`);
  return 1;
}

const executedPath = process.argv[1];

if (
  executedPath !== undefined &&
  (executedPath.endsWith("/dist/cli/sdp.js") || executedPath.endsWith("\\dist\\cli\\sdp.js"))
) {
  process.exitCode = runSdpCli(process.argv.slice(2));
}
