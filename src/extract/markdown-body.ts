import type { Finding } from "../validate/contracts.js";
import { addMarkdownFinding, capMarkdownFindings, markdownFinding } from "./markdown-support.js";
import { mapOwner } from "./markdown-body-owners.js";
import { isUnsupportedCommonMarkBlock, normalizeProse } from "./markdown-body-content.js";
import type { MarkdownLine } from "./markdown-body-content.js";
import type { MarkdownBodyResult } from "./markdown-types.js";

const primaryOwners = new Set(["Behavior", "Rule", "Workflow", "Contract"]);
const recognized = [
  "Intent",
  "Behavior",
  "Rule",
  "Workflow",
  "Contract",
  "Example space",
  "Constraints",
  "Model",
  "Design",
  "Decision",
  "UI",
] as const;
const recognizedOwners = new Set<string>(recognized);
const verificationModes = ["manual", "reviewed", "contract", "executable"] as const;
const suggestionOrder = [
  ...recognized,
  ...verificationModes.map((mode) => `Verification — ${mode}`),
];

interface MarkdownOwner {
  readonly name: string;
  readonly line: number;
  readonly content: MarkdownLine[];
}

function structure(file: string, line: number, message: string): Finding {
  return markdownFinding(file, line, message, "extract/invalid-markdown-structure");
}

function asciiTrim(text: string): string {
  return text.replace(/^[\t ]+|[\t ]+$/gu, "");
}

function levenshtein(left: string, right: string): number {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      const earlier = previous[column];
      const before = previous[column - 1];
      const currentBefore = current[column - 1];
      const deletion = earlier === undefined ? row : earlier + 1;
      const insertion = currentBefore === undefined ? column : currentBefore + 1;
      const substitution =
        before === undefined ? row : before + (left[row - 1] === right[column - 1] ? 0 : 1);
      current.push(Math.min(deletion, insertion, substitution));
    }
    previous = current;
  }
  return previous[right.length] ?? Math.max(left.length, right.length);
}

function ownerName(text: string): string | undefined {
  if (recognizedOwners.has(text)) return text;
  const mode = /^Verification — (manual|reviewed|contract|executable)$/u.exec(text);
  return mode === null ? undefined : text;
}

function ownerKey(name: string): string {
  return name.startsWith("Verification — ") ? "Verification" : name;
}

function headingFinding(file: string, line: number, text: string): Finding {
  const lowercase = text.replace(/[A-Z]/gu, (letter) => letter.toLowerCase());
  let candidate: string | undefined;
  let distance = Number.POSITIVE_INFINITY;
  for (const heading of suggestionOrder) {
    const current = levenshtein(
      lowercase,
      heading.replace(/[A-Z]/gu, (letter) => letter.toLowerCase()),
    );
    if (current < distance) {
      candidate = heading;
      distance = current;
    }
  }
  const suffix = candidate !== undefined && distance <= 2 ? `; did you mean "${candidate}"?` : "";
  return markdownFinding(
    file,
    line,
    `heading "${text}" is not recognized${suffix}`,
    "extract/unrecognized-heading",
  );
}

function narrative(lines: readonly MarkdownLine[], file: string, findings: Finding[]): string {
  for (const line of lines) {
    if (line.text === "") continue;
    if (/<\/?[A-Za-z][^>]*>|<!--|-->|<![A-Za-z]|<\?/u.test(line.text)) {
      addMarkdownFinding(findings, structure(file, line.line, "raw HTML is unsupported"));
      continue;
    }
    if (
      /^(?:-|```|\||>|<|#)/u.test(line.text) ||
      /^[\t ]/u.test(line.text) ||
      isUnsupportedCommonMarkBlock(line.text)
    )
      addMarkdownFinding(
        findings,
        structure(file, line.line, "narrative accepts CommonMark paragraphs only"),
      );
  }
  return normalizeProse(lines);
}

export function parseMarkdownBody(
  body: string,
  baseLine: number,
  file: string,
  kind: string,
): MarkdownBodyResult {
  const lines = body
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((text, index) => ({ text, line: baseLine + index }));
  const findings: Finding[] = [];
  const first = lines[0];
  if (!first?.text.startsWith("# ")) {
    return {
      ok: false,
      findings: [structure(file, baseLine, "the first body line must be an H1 title")],
    };
  }
  const title = asciiTrim(first.text.slice(2));
  if (/^[\t ]/u.test(first.text.slice(2)) || title.length === 0 || title.endsWith("#"))
    addMarkdownFinding(
      findings,
      structure(file, first.line, "the H1 title must be nonempty and carry no closing marker"),
    );
  const before: MarkdownLine[] = [];
  const owners: MarkdownOwner[] = [];
  let current: MarkdownOwner | undefined;
  let inFence = false;
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) continue;
    if (line.text.startsWith("```")) inFence = line.text !== "```" ? true : false;
    if (inFence || line.text === "```") {
      if (current === undefined) before.push(line);
      else current.content.push(line);
      continue;
    }
    if (line.text.startsWith("# ")) {
      addMarkdownFinding(findings, structure(file, line.line, "only the first H1 is accepted"));
      continue;
    }
    if (line.text.startsWith("## ")) {
      const rawHeading = line.text.slice(3);
      const heading = asciiTrim(rawHeading);
      if (/^[\t ]/u.test(rawHeading) || heading.length === 0 || heading.endsWith("#")) {
        addMarkdownFinding(
          findings,
          structure(file, line.line, "H2 headings require text without closing markers"),
        );
        continue;
      }
      const owner = ownerName(heading);
      if (owner === undefined) {
        addMarkdownFinding(findings, headingFinding(file, line.line, heading));
        continue;
      }
      current = { name: owner, line: line.line, content: [] };
      owners.push(current);
      continue;
    }
    if (line.text.startsWith("### ") && current !== undefined) {
      current.content.push(line);
      continue;
    }
    if (line.text.startsWith("##") || line.text.startsWith("###") || line.text.startsWith("#")) {
      addMarkdownFinding(
        findings,
        structure(file, line.line, "headings must use exact column-one Markdown syntax"),
      );
      continue;
    }
    if (current === undefined) before.push(line);
    else current.content.push(line);
  }
  const data: Record<string, unknown> = { title };
  const prose = narrative(before, file, findings);
  if (prose.length > 0) data.narrative = prose;
  const ownerNames = new Set<string>();
  let primarySeen = false;
  for (const owner of owners) {
    const name = ownerKey(owner.name);
    if (ownerNames.has(name) || (primaryOwners.has(owner.name) && primarySeen))
      addMarkdownFinding(
        findings,
        structure(file, owner.line, "a single-valued Markdown owner is authored more than once"),
      );
    else {
      ownerNames.add(name);
      if (primaryOwners.has(owner.name)) primarySeen = true;
      mapOwner(data, owner.name, owner.content, file, kind, findings);
    }
  }
  const capped = capMarkdownFindings(findings, file, "extract/invalid-markdown-structure");
  return capped.length === 0
    ? { ok: true, body: { data }, findings: capped }
    : { ok: false, findings: capped };
}
