import type { Finding } from "../validate/contracts.js";

const MAX_FINDINGS = 100;
const invalidFrontmatterFindingId = "extract/invalid-frontmatter";

export function markdownFinding(
  file: string,
  line: number,
  message: string,
  validatorId = invalidFrontmatterFindingId,
): Finding {
  return { validatorId, family: "conformance", severity: "error", message, file, line };
}

export function markdownLine(source: string, offset: number, baseLine: number): number {
  return baseLine + source.slice(0, offset).split(/\r\n|\n/u).length - 1;
}

export function addMarkdownFinding(findings: Finding[], entry: Finding): void {
  if (findings.length < MAX_FINDINGS) findings.push(entry);
}

export function capMarkdownFindings(
  findings: readonly Finding[],
  file: string,
): readonly Finding[] {
  return findings.length < MAX_FINDINGS
    ? findings
    : [
        ...findings.slice(0, MAX_FINDINGS - 1),
        markdownFinding(file, 1, "finding limit reached; additional findings suppressed"),
      ];
}
