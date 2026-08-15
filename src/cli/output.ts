import type { Finding } from "../validate/contracts.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";

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

const diagnosticCliAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.diagnostic-rendering-cli"),
  label: "composes structured finding fields into the one command-line diagnostic form",
  satisfies: ref("spec:validation.diagnostic-rendering"),
  component: componentAnchorId("component:protocol.cli"),
});
void diagnosticCliAnchor;

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
