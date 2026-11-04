import { extractFindingIds } from "./reify.js";
import type { Finding } from "../validate/contracts.js";

const MAX_FINDINGS = 100;
const invalidFrontmatterFindingId = extractFindingIds.invalidFrontmatter;

export function markdownFinding(
  file: string,
  line: number,
  message: string,
  validatorId: string = invalidFrontmatterFindingId,
): Finding {
  return { validatorId, family: "conformance", severity: "error", message, file, line };
}

export function markdownLine(source: string, offset: number, baseLine: number): number {
  return baseLine + source.slice(0, offset).split(/\r\n|\n/u).length - 1;
}

function isAsciiBlank(character: string | undefined): boolean {
  return character === " " || character === "\t";
}

// A scan rather than `/[\t ]+$/`: that regex retries every start inside an interior run of
// blanks, so one long padded line would make extraction quadratic in its length.
export function asciiTrimEnd(text: string): string {
  let end = text.length;
  while (end > 0 && isAsciiBlank(text[end - 1])) end -= 1;
  return text.slice(0, end);
}

export function asciiTrim(text: string): string {
  let start = 0;
  while (start < text.length && isAsciiBlank(text[start])) start += 1;
  return asciiTrimEnd(text.slice(start));
}

export function addMarkdownFinding(findings: Finding[], entry: Finding): void {
  if (findings.length < MAX_FINDINGS) findings.push(entry);
}

export function report(
  findings: Finding[],
  file: string,
  line: number,
  message: string,
  validatorId?: string,
): void {
  addMarkdownFinding(findings, markdownFinding(file, line, message, validatorId));
}

export function capMarkdownFindings(
  findings: readonly Finding[],
  file: string,
  validatorId: string = invalidFrontmatterFindingId,
): readonly Finding[] {
  return findings.length < MAX_FINDINGS
    ? findings
    : [
        ...findings.slice(0, MAX_FINDINGS - 1),
        markdownFinding(
          file,
          1,
          "finding limit reached; additional findings suppressed",
          validatorId,
        ),
      ];
}
