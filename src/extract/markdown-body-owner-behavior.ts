import type { Finding } from "../validate/contracts.js";
import { parseSectionContent } from "./markdown-body-content.js";
import type { MarkdownLine } from "./markdown-body-content.js";
import {
  addDescription,
  append,
  isRecord,
  keyed,
  propertyFinding,
  reservedMarkdownProperties,
  single,
  structureFinding,
} from "./markdown-body-owner-support.js";
import { addMarkdownFinding } from "./markdown-support.js";

interface OpenQuestion {
  readonly question: string;
  readonly blocking: boolean;
}

function isOpenQuestionArray(value: unknown): value is readonly OpenQuestion[] {
  return (
    Array.isArray(value) &&
    value.every((item): item is OpenQuestion => {
      if (item === null || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return typeof candidate.question === "string" && typeof candidate.blocking === "boolean";
    })
  );
}

export function mapIntent(
  section: Record<string, unknown>,
  target: Record<string, unknown>,
  lines: readonly MarkdownLine[],
  file: string,
  kind: string,
  findings: Finding[],
): void {
  const parsed = parseSectionContent(lines, file, findings);
  addDescription(section, parsed.description, file, lines[0]?.line ?? 1, findings);
  if (parsed.fences.length > 0) {
    if (kind !== "example" || parsed.fences.length !== 1 || parsed.fences[0]?.kind !== "gwt")
      addMarkdownFinding(
        findings,
        structureFinding(
          file,
          parsed.fences[0]?.line ?? 1,
          "only an example Intent may own one gwt fence",
        ),
      );
    else {
      const fence = parsed.fences[0];
      const trailing = lines.find((line) => line.line > fence.endLine && line.text.length > 0);
      if (trailing !== undefined)
        addMarkdownFinding(
          findings,
          structureFinding(
            file,
            trailing.line,
            "the example gwt fence must immediately follow the Intent block",
          ),
        );
      else {
        const example: Record<string, unknown> = {
          given: fence.steps.given,
          when: fence.steps.when,
          then: fence.steps.result,
        };
        const behavior = isRecord(target.behavior) ? target.behavior : {};
        const examples: unknown[] = [];
        if (Array.isArray(behavior.examples))
          for (const current of behavior.examples) examples.push(current);
        behavior.examples = [...examples, example];
        target.behavior = behavior;
      }
    }
  }
  if (parsed.h3 !== undefined && parsed.h3.text !== "### Open questions")
    addMarkdownFinding(
      findings,
      structureFinding(file, parsed.h3.line, "only ### Open questions is accepted under Intent"),
    );
  for (const item of parsed.items) {
    const question = /^\[(blocking|non-blocking)\] (.+)$/u.exec(item.text);
    if (question?.[1] !== undefined && question[2] !== undefined) {
      if (!item.afterH3 || parsed.h3?.text !== "### Open questions")
        addMarkdownFinding(
          findings,
          structureFinding(file, item.line, "open questions require ### Open questions"),
        );
      else {
        const entry = { question: question[2], blocking: question[1] === "blocking" };
        section.openQuestions = isOpenQuestionArray(section.openQuestions)
          ? [...section.openQuestions, entry]
          : [entry];
      }
      continue;
    }
    const entry = keyed(item.text);
    if (item.afterH3) {
      addMarkdownFinding(
        findings,
        structureFinding(file, item.line, "Intent fields must precede ### Open questions"),
      );
      continue;
    }
    if (entry === undefined) {
      addMarkdownFinding(
        findings,
        structureFinding(file, item.line, "Intent entries require a field name"),
      );
      continue;
    }
    if (["actor", "problem", "outcome", "value"].includes(entry.key))
      single(section, entry.key, entry.value, file, item.line, findings);
    else if (entry.key === "risk") append(section, "risks", entry.value);
    else if (entry.key === "assumption") append(section, "assumptions", entry.value);
    else addMarkdownFinding(findings, propertyFinding(file, item.line, entry.key));
  }
}

export function mapBehavior(
  section: Record<string, unknown>,
  owner: string,
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
        "this behavior owner does not accept an H3 or fence",
      ),
    );
  for (const item of parsed.items) {
    const entry = keyed(item.text);
    if (entry !== undefined && reservedMarkdownProperties.has(entry.key)) {
      addMarkdownFinding(findings, propertyFinding(file, item.line, entry.key));
      continue;
    }
    if (owner === "Behavior") {
      if (entry?.key === "rule") append(section, "rules", entry.value);
      else if (entry?.key === "flow") append(section, "flows", entry.value);
      else
        addMarkdownFinding(
          findings,
          structureFinding(file, item.line, "Behavior entries require rule or flow"),
        );
    } else if (owner === "Workflow" && entry?.key === "rule") append(section, "rules", entry.value);
    else if (entry !== undefined)
      addMarkdownFinding(findings, propertyFinding(file, item.line, entry.key));
    else append(section, owner === "Workflow" ? "flows" : "rules", item.text);
  }
}

export function mapExampleSpace(
  section: Record<string, unknown>,
  lines: readonly MarkdownLine[],
  file: string,
  findings: Finding[],
): void {
  const parsed = parseSectionContent(lines, file, findings);
  addDescription(section, parsed.description, file, lines[0]?.line ?? 1, findings);
  if (
    parsed.items.length > 0 ||
    parsed.h3 !== undefined ||
    parsed.fences.length !== 1 ||
    parsed.fences[0]?.kind !== "gwt-vocabulary"
  ) {
    addMarkdownFinding(
      findings,
      structureFinding(
        file,
        lines[0]?.line ?? 1,
        "Example space requires exactly one gwt-vocabulary fence",
      ),
    );
    return;
  }
  const fence = parsed.fences[0];
  const vocabulary: Record<string, unknown> = {
    given: fence.steps.given,
    when: fence.steps.when,
    then: fence.steps.result,
  };
  section.exampleSpace = vocabulary;
}
