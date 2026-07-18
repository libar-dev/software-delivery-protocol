import { parseSlots } from "../notation/slots.js";
import type { Finding } from "../validate/contracts.js";
import { addMarkdownFinding, markdownFinding } from "./markdown-support.js";

export interface MarkdownLine {
  readonly text: string;
  readonly line: number;
}

export interface MarkdownListItem {
  readonly text: string;
  readonly line: number;
  readonly afterH3: boolean;
}

export interface MarkdownFence {
  readonly kind: "gwt" | "gwt-vocabulary";
  readonly line: number;
  readonly steps: {
    readonly given: readonly string[];
    readonly when: readonly string[];
    readonly result: readonly string[];
  };
}

const ASCII_TRIM = /^[\t ]+|[\t ]+$/gu;

function bodyFinding(file: string, line: number, message: string): Finding {
  return markdownFinding(file, line, message, "extract/invalid-markdown-structure");
}

export function normalizeProse(lines: readonly MarkdownLine[]): string {
  const paragraphs: string[] = [];
  let paragraph: string[] = [];
  for (const line of lines) {
    const trimmed = line.text.replace(ASCII_TRIM, "");
    if (trimmed.length === 0) {
      if (paragraph.length > 0) paragraphs.push(paragraph.join(" "));
      paragraph = [];
    } else paragraph.push(trimmed);
  }
  if (paragraph.length > 0) paragraphs.push(paragraph.join(" "));
  return paragraphs.join("\n\n");
}

function isHtml(text: string): boolean {
  return /<\/?[A-Za-z][^>]*>/u.test(text);
}

export function isUnsupportedCommonMarkBlock(text: string): boolean {
  return (
    /^(?:[*+][\t ]|\d+[.)][\t ]|<)/u.test(text) ||
    /^(?:={3,}|(?:\*[\t ]*){3,}|(?:-[\t ]*){3,}|(?:_[\t ]*){3,})[\t ]*$/u.test(text)
  );
}

function parseFence(
  lines: readonly MarkdownLine[],
  start: number,
  file: string,
  findings: Finding[],
): { readonly fence?: MarkdownFence; readonly end: number } {
  const opening = lines[start];
  if (opening === undefined) return { end: start };
  const kind =
    opening.text === "```gwt"
      ? "gwt"
      : opening.text === "```gwt-vocabulary"
        ? "gwt-vocabulary"
        : undefined;
  if (kind === undefined) {
    addMarkdownFinding(
      findings,
      bodyFinding(file, opening.line, "fences must be exact gwt or gwt-vocabulary fences"),
    );
    return { end: start + 1 };
  }
  const body: MarkdownLine[] = [];
  let end = start + 1;
  while (end < lines.length && lines[end]?.text !== "```") {
    const line = lines[end];
    if (line !== undefined) body.push(line);
    end += 1;
  }
  if (end === lines.length) {
    addMarkdownFinding(
      findings,
      bodyFinding(file, opening.line, "fence must close with an exact ``` line"),
    );
    return { end };
  }
  const steps: { given: string[]; when: string[]; result: string[] } = {
    given: [],
    when: [],
    result: [],
  };
  let phase: "given" | "when" | "result" | undefined;
  for (const line of body) {
    if (line.text.length === 0 || /^[\t ]/u.test(line.text)) {
      addMarkdownFinding(
        findings,
        bodyFinding(file, line.line, "fence bodies cannot contain blank or indented lines"),
      );
      continue;
    }
    const match = /^(Given|When|Then|And) (.+)$/u.exec(line.text);
    if (match?.[2] === undefined) {
      addMarkdownFinding(
        findings,
        bodyFinding(file, line.line, "fence steps require a phase and nonempty text"),
      );
      continue;
    }
    const label = match[1];
    const text = match[2];
    const next = label === "And" ? phase : label === "Then" ? "result" : label?.toLowerCase();
    if (next === undefined || (next !== "given" && next !== "when" && next !== "result")) {
      addMarkdownFinding(
        findings,
        bodyFinding(file, line.line, "And requires a preceding GWT phase"),
      );
      continue;
    }
    if (next === "when" && steps.given.length === 0) {
      addMarkdownFinding(
        findings,
        bodyFinding(file, line.line, "GWT fences must begin with Given steps"),
      );
    }
    const order = { given: 0, when: 1, result: 2 };
    if (phase !== undefined && order[next] < order[phase]) {
      addMarkdownFinding(findings, bodyFinding(file, line.line, "GWT phases cannot regress"));
      continue;
    }
    if (next === "when" && steps.when.length > 0)
      addMarkdownFinding(
        findings,
        bodyFinding(file, line.line, "a GWT fence has exactly one When step"),
      );
    phase = next;
    parseSlots(text);
    steps[next].push(text);
  }
  if (steps.given.length === 0 || steps.when.length !== 1 || steps.result.length === 0)
    addMarkdownFinding(
      findings,
      bodyFinding(
        file,
        opening.line,
        "a GWT fence requires Given, exactly one When, and Then steps",
      ),
    );
  return { fence: { kind, line: opening.line, steps }, end: end + 1 };
}

export function parseSectionContent(
  lines: readonly MarkdownLine[],
  file: string,
  findings: Finding[],
): {
  readonly description: string;
  readonly items: readonly MarkdownListItem[];
  readonly fences: readonly MarkdownFence[];
  readonly h3?: MarkdownLine;
} {
  const prose: MarkdownLine[] = [];
  const items: MarkdownListItem[] = [];
  const fences: MarkdownFence[] = [];
  let h3: MarkdownLine | undefined;
  let structured = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) continue;
    if (line.text === "") {
      if (!structured) prose.push(line);
      continue;
    }
    if (isHtml(line.text)) {
      addMarkdownFinding(findings, bodyFinding(file, line.line, "raw HTML is unsupported"));
      continue;
    }
    if (isUnsupportedCommonMarkBlock(line.text)) {
      addMarkdownFinding(
        findings,
        bodyFinding(file, line.line, "nested or unsupported Markdown structure"),
      );
      continue;
    }
    if (line.text.startsWith("```")) {
      structured = true;
      const parsed = parseFence(lines, index, file, findings);
      if (parsed.fence !== undefined) fences.push(parsed.fence);
      index = parsed.end - 1;
      continue;
    }
    if (line.text.startsWith("### ")) {
      structured = true;
      if (h3 !== undefined)
        addMarkdownFinding(
          findings,
          bodyFinding(file, line.line, "an H3 owner is authored more than once"),
        );
      else h3 = line;
      continue;
    }
    if (line.text.startsWith("#")) {
      addMarkdownFinding(findings, bodyFinding(file, line.line, "unsupported heading structure"));
      continue;
    }
    if (line.text.startsWith("- ")) {
      structured = true;
      const text = line.text.slice(2);
      if (text.trim().length === 0 || /^[\t ]/u.test(text))
        addMarkdownFinding(findings, bodyFinding(file, line.line, "list text must not be empty"));
      else items.push({ text, line: line.line, afterH3: h3 !== undefined });
      continue;
    }
    if (/^[\t ]/u.test(line.text) || line.text.startsWith("|") || line.text.startsWith(">")) {
      addMarkdownFinding(
        findings,
        bodyFinding(file, line.line, "nested or unsupported Markdown structure"),
      );
      continue;
    }
    if (!structured) {
      prose.push(line);
      continue;
    }
    addMarkdownFinding(
      findings,
      markdownFinding(
        file,
        line.line,
        "prose after structured content has no owner",
        "extract/unowned-prose",
      ),
    );
  }
  return { description: normalizeProse(prose), items, fences, h3 };
}
