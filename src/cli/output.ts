import type { Finding } from "../validate/contracts.js";

export interface CliOutput {
  readonly stdout?: { readonly write: (chunk: string) => void };
  readonly stderr?: { readonly write: (chunk: string) => void };
}

export const defaultCliOutput: CliOutput = {
  stdout: process.stdout,
  stderr: process.stderr,
};

export function writeStdout(output: CliOutput, text: string): void {
  output.stdout?.write(text);
}

export function writeStderr(output: CliOutput, text: string): void {
  output.stderr?.write(text);
}

export function formatFinding(finding: Finding): string {
  const location =
    finding.file === undefined
      ? ""
      : `${finding.file}${finding.line === undefined ? "" : `:${String(finding.line)}`} — `;

  return `${location}[${finding.severity}] ${finding.validatorId} — ${finding.message}\n`;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
