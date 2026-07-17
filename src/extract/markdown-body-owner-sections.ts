import type { Finding } from "../validate/contracts.js";
import { parseSectionContent } from "./markdown-body-content.js";
import type { MarkdownLine } from "./markdown-body-content.js";
import {
  addDescription,
  append,
  keyed,
  propertyFinding,
  reservedMarkdownProperties,
  single,
  structureFinding,
} from "./markdown-body-owner-support.js";
import { addMarkdownFinding, markdownFinding } from "./markdown-support.js";

const camelKey = /^[a-z][A-Za-z0-9]*$/u;

export function mapConstraints(
  target: Record<string, unknown>,
  lines: readonly MarkdownLine[],
  file: string,
  findings: Finding[],
): void {
  const parsed = parseSectionContent(lines, file, findings);
  if (parsed.description.length > 0)
    addMarkdownFinding(
      findings,
      markdownFinding(
        file,
        lines[0]?.line ?? 1,
        "Constraints prose has no owner",
        "extract/unowned-prose",
      ),
    );
  if (parsed.h3 !== undefined || parsed.fences.length > 0)
    addMarkdownFinding(
      findings,
      structureFinding(
        file,
        parsed.h3?.line ?? parsed.fences[0]?.line ?? 1,
        "Constraints accept one flat list entry",
      ),
    );
  const constraint: Record<string, unknown> = {};
  for (const item of parsed.items) {
    const entry = keyed(item.text);
    if (entry !== undefined && reservedMarkdownProperties.has(entry.key)) {
      addMarkdownFinding(findings, propertyFinding(file, item.line, entry.key));
      continue;
    }
    if (
      entry === undefined ||
      !["statement", "flavor", "target", "measurableBy"].includes(entry.key)
    ) {
      addMarkdownFinding(
        findings,
        structureFinding(file, item.line, "Constraints entries require a recognized field"),
      );
      continue;
    }
    single(constraint, entry.key, entry.value, file, item.line, findings);
  }
  if (constraint.statement === undefined)
    addMarkdownFinding(
      findings,
      structureFinding(file, lines[0]?.line ?? 1, "Constraints require one statement"),
    );
  target.constraints = [constraint];
}

export function mapModel(
  section: Record<string, unknown>,
  lines: readonly MarkdownLine[],
  file: string,
  findings: Finding[],
): void {
  const parsed = parseSectionContent(lines, file, findings);
  addDescription(section, parsed.description, file, lines[0]?.line ?? 1, findings);
  if (parsed.h3 !== undefined || parsed.fences.length > 0)
    addMarkdownFinding(
      findings,
      structureFinding(
        file,
        parsed.h3?.line ?? parsed.fences[0]?.line ?? 1,
        "Model does not accept an H3 or fence",
      ),
    );
  const terms: Record<string, string> = {};
  for (const item of parsed.items) {
    const match = /^\*\*([^*]+)\*\* — (.+)$/u.exec(item.text);
    if (match?.[1] === undefined || match[2] === undefined)
      addMarkdownFinding(
        findings,
        structureFinding(file, item.line, "Model entries require **TERM** — DEFINITION"),
      );
    else if (terms[match[1]] !== undefined)
      addMarkdownFinding(findings, structureFinding(file, item.line, "model terms must be unique"));
    else terms[match[1]] = match[2];
  }
  if (Object.keys(terms).length > 0) section.terms = terms;
}

export function mapOpen(
  section: Record<string, unknown>,
  lines: readonly MarkdownLine[],
  file: string,
  findings: Finding[],
): void {
  const parsed = parseSectionContent(lines, file, findings);
  addDescription(section, parsed.description, file, lines[0]?.line ?? 1, findings);
  if (parsed.h3 !== undefined || parsed.fences.length > 0)
    addMarkdownFinding(
      findings,
      structureFinding(
        file,
        parsed.h3?.line ?? parsed.fences[0]?.line ?? 1,
        "open sections do not accept an H3 or fence",
      ),
    );
  for (const item of parsed.items) {
    const entry = keyed(item.text);
    if (entry === undefined || !camelKey.test(entry.key))
      addMarkdownFinding(
        findings,
        structureFinding(file, item.line, "open section keys must be lower-camel ASCII"),
      );
    else if (section[entry.key] !== undefined)
      addMarkdownFinding(
        findings,
        structureFinding(file, item.line, "open section keys must be unique"),
      );
    else if (reservedMarkdownProperties.has(entry.key))
      addMarkdownFinding(findings, propertyFinding(file, item.line, entry.key));
    else section[entry.key] = entry.value;
  }
}

export function mapDecision(
  section: Record<string, unknown>,
  lines: readonly MarkdownLine[],
  file: string,
  findings: Finding[],
): void {
  const parsed = parseSectionContent(lines, file, findings);
  addDescription(section, parsed.description, file, lines[0]?.line ?? 1, findings);
  if (parsed.h3 !== undefined || parsed.fences.length > 0)
    addMarkdownFinding(
      findings,
      structureFinding(
        file,
        parsed.h3?.line ?? parsed.fences[0]?.line ?? 1,
        "Decision does not accept an H3 or fence",
      ),
    );
  const arrays: Record<string, string> = {
    rationale: "rationale",
    alternative: "alternatives",
    consequence: "consequences",
  };
  for (const item of parsed.items) {
    const entry = keyed(item.text);
    if (entry !== undefined && reservedMarkdownProperties.has(entry.key)) {
      addMarkdownFinding(findings, propertyFinding(file, item.line, entry.key));
      continue;
    }
    if (entry?.key === "context" || entry?.key === "decision")
      single(section, entry.key, entry.value, file, item.line, findings);
    else if (entry !== undefined && arrays[entry.key] !== undefined) {
      const name = arrays[entry.key];
      if (name !== undefined) append(section, name, entry.value);
    } else
      addMarkdownFinding(
        findings,
        structureFinding(file, item.line, "Decision entries require a recognized field"),
      );
  }
}

export function mapVerification(
  section: Record<string, unknown>,
  lines: readonly MarkdownLine[],
  file: string,
  findings: Finding[],
): void {
  const parsed = parseSectionContent(lines, file, findings);
  addDescription(section, parsed.description, file, lines[0]?.line ?? 1, findings);
  if (parsed.h3 !== undefined || parsed.fences.length > 0)
    addMarkdownFinding(
      findings,
      structureFinding(
        file,
        parsed.h3?.line ?? parsed.fences[0]?.line ?? 1,
        "Verification accepts plain criteria only",
      ),
    );
  for (const item of parsed.items) {
    const entry = keyed(item.text);
    if (entry === undefined) append(section, "criteria", item.text);
    else addMarkdownFinding(findings, propertyFinding(file, item.line, entry.key));
  }
}
