import type { Finding } from "../validate/contracts.js";

function countLabel(count: number, singular: string): string {
  return `${String(count)} ${singular}${count === 1 ? "" : "s"}`;
}

/** Labels a retained projection when the graph carries validation errors. */
export function renderDiagnosticBanner(findings: readonly Finding[]): readonly string[] {
  const errorCount = findings.filter((finding) => finding.severity === "error").length;

  if (errorCount === 0) {
    return [];
  }

  const warningCount = findings.length - errorCount;
  return [
    "> [!WARNING]",
    "> **Diagnostic projection — validation errors present.**",
    `> Published from a graph with ${countLabel(errorCount, "error")} and ${countLabel(warningCount, "warning")}; the projection command returns nonzero.`,
    "",
  ];
}
