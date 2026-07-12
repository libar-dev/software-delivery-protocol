import {
  SPEC_SECTION_NAMES,
  hasUnboundSlot,
  parseSlots,
} from "@libar-dev/software-delivery-protocol";
import type { FileReification } from "../../../../src/extract/reify.js";

import { parseFrontmatter } from "./micro-yaml.js";

const sectionNames = new Set<string>(SPEC_SECTION_NAMES);
const phases = ["given", "when", "then"] as const;
type Phase = (typeof phases)[number];

interface MarkdownInspection {
  readonly reification: FileReification;
  readonly droppedProse: readonly string[];
  readonly unboundUsedSteps: readonly string[];
}

interface Fence {
  readonly language: string;
  readonly content: readonly string[];
  readonly start: number;
  readonly end: number;
}

function fencesIn(lines: readonly string[]): readonly Fence[] {
  const fences: Fence[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const open = /^```([A-Za-z-]+)$/u.exec(lines[index] ?? "");

    if (open === null) {
      continue;
    }

    const end = lines.indexOf("```", index + 1);

    if (end === -1) {
      throw new Error(`unterminated ${open[1] ?? ""} fence`);
    }

    fences.push({
      language: open[1] ?? "",
      content: lines.slice(index + 1, end),
      start: index,
      end,
    });
    index = end;
  }

  return fences;
}

function parseSteps(lines: readonly string[]): Record<Phase, string[]> | undefined {
  const parsed: Record<Phase, string[]> = { given: [], when: [], then: [] };
  let current: Phase | undefined;

  for (const raw of lines) {
    const line = raw.trim();
    const keyword = /^(Given|When|Then)\s+(.+)$/u.exec(line);

    if (keyword !== null) {
      current = keyword[1]?.toLowerCase() as Phase;
      parsed[current].push(keyword[2] ?? "");
      continue;
    }

    const continuation = /^And\s+(.+)$/u.exec(line);

    if (continuation !== null && current !== undefined) {
      parsed[current].push(continuation[1] ?? "");
      continue;
    }

    if (line.length > 0) {
      return undefined;
    }
  }

  return phases.some((phase) => parsed[phase].length > 0) ? parsed : undefined;
}

function h2Ranges(lines: readonly string[]): ReadonlyMap<string, readonly string[]> {
  const result = new Map<string, readonly string[]>();
  const headings: Array<{ name: string; index: number }> = [];

  for (const [index, line] of lines.entries()) {
    const match = /^## (.+)$/u.exec(line);

    if (match !== null) {
      headings.push({ name: match[1] ?? "", index });
    }
  }

  for (const [position, heading] of headings.entries()) {
    const next = headings[position + 1]?.index ?? lines.length;
    result.set(heading.name, lines.slice(heading.index + 1, next));
  }

  return result;
}

function keyValueLines(lines: readonly string[]): Map<string, string[]> {
  const values = new Map<string, string[]>();

  for (const line of lines) {
    const match = /^- ([A-Za-z]+):\s*(.+)$/u.exec(line.trim());

    if (match === null) {
      continue;
    }

    values.set(match[1] ?? "", [...(values.get(match[1] ?? "") ?? []), match[2] ?? ""]);
  }

  return values;
}

function parseIntent(lines: readonly string[]): Record<string, unknown> | undefined {
  const values = keyValueLines(lines);
  const intent: Record<string, unknown> = {};

  for (const name of ["actor", "outcome", "value"] as const) {
    const value = values.get(name)?.[0];

    if (value !== undefined) {
      intent[name] = value;
    }
  }

  const openQuestions = lines.flatMap((line) => {
    const match = /^- \[(blocking|non-blocking)\]\s+(.+)$/u.exec(line.trim());

    return match === null
      ? []
      : [{ question: match[2] ?? "", blocking: match[1] === "blocking" }];
  });

  if (openQuestions.length > 0) {
    intent.openQuestions = openQuestions;
  }

  return Object.keys(intent).length === 0 ? undefined : intent;
}

function parseModel(lines: readonly string[]): Record<string, unknown> | undefined {
  const terms: Record<string, string> = {};

  for (const line of lines) {
    const match = /^- \*\*([^*]+)\*\* — (.+)$/u.exec(line.trim());

    if (match !== null) {
      terms[match[1] ?? ""] = match[2] ?? "";
    }
  }

  return Object.keys(terms).length === 0 ? undefined : { terms };
}

function parseDecision(lines: readonly string[]): Record<string, unknown> | undefined {
  const values = keyValueLines(lines);
  const decision = values.get("decision")?.[0];
  const rationale = values.get("rationale");
  const consequences = values.get("consequences");

  if (decision === undefined && rationale === undefined && consequences === undefined) {
    return undefined;
  }

  return {
    ...(decision === undefined ? {} : { decision }),
    ...(rationale === undefined ? {} : { rationale }),
    ...(consequences === undefined ? {} : { consequences }),
  };
}

function parseVerification(
  heading: string,
  lines: readonly string[],
): Record<string, unknown> | undefined {
  const criteria = lines
    .map((line) => /^- (.+)$/u.exec(line.trim())?.[1])
    .filter((line): line is string => line !== undefined);
  const mode = heading.includes("—") ? heading.split("—").at(-1)?.trim() : undefined;

  return mode === undefined && criteria.length === 0
    ? undefined
    : { ...(mode === undefined ? {} : { mode }), criteria };
}

function proseParagraphs(lines: readonly string[], fences: readonly Fence[]): readonly string[] {
  const insideFence = new Set<number>();

  for (const fence of fences) {
    for (let index = fence.start; index <= fence.end; index += 1) {
      insideFence.add(index);
    }
  }

  const paragraphs: string[] = [];
  let current: string[] = [];

  const flush = (): void => {
    if (current.length > 0) {
      paragraphs.push(current.join(" "));
      current = [];
    }
  };

  for (const [index, raw] of lines.entries()) {
    const line = raw.trim();

    if (
      insideFence.has(index) ||
      line.length === 0 ||
      line.startsWith("#") ||
      line.startsWith("-")
    ) {
      flush();
      continue;
    }

    current.push(line);
  }

  flush();
  return paragraphs;
}

export function inspectMarkdown(text: string, relativePath: string): MarkdownInspection {
  const parsed = parseFrontmatter(text);
  const lines = parsed.body.split("\n");
  const title = lines.map((line) => /^# (.+)$/u.exec(line)?.[1]).find(Boolean);
  const sections: Record<string, unknown> = {};
  const ranges = h2Ranges(lines);

  const intentLines = ranges.get("Intent");
  const intent = intentLines === undefined ? undefined : parseIntent(intentLines);

  if (intent !== undefined) {
    sections.intent = intent;
  }

  const modelLines = ranges.get("Model");
  const model = modelLines === undefined ? undefined : parseModel(modelLines);

  if (model !== undefined) {
    sections.model = model;
  }

  const decisionLines = ranges.get("Decision");
  const decision = decisionLines === undefined ? undefined : parseDecision(decisionLines);

  if (decision !== undefined) {
    sections.decision = decision;
  }

  const verificationHeading = [...ranges.keys()].find((heading) =>
    heading.startsWith("Verification"),
  );

  if (verificationHeading !== undefined) {
    const verification = parseVerification(
      verificationHeading,
      ranges.get(verificationHeading) ?? [],
    );

    if (verification !== undefined) {
      sections.verification = verification;
    }
  }

  const ruleLines = ranges.get("Rule");

  if (ruleLines !== undefined) {
    const rules = ruleLines
      .map((line) => /^- (.+)$/u.exec(line.trim())?.[1])
      .filter((line): line is string => line !== undefined);

    if (rules.length > 0) {
      sections.behavior = { rules };
    }
  }

  const fences = fencesIn(lines);
  const unboundUsedSteps: string[] = [];

  for (const fence of fences) {
    if (fence.language !== "gwt" && fence.language !== "gwt-vocabulary") {
      continue;
    }

    const steps = parseSteps(fence.content);

    if (fence.language === "gwt-vocabulary") {
      if (steps === undefined) {
        throw new Error(`${relativePath}: gwt-vocabulary must contain Given/When/Then steps`);
      }

      for (const step of phases.flatMap((phase) => steps[phase])) {
        parseSlots(step);
      }

      sections.behavior = {
        ...(typeof sections.behavior === "object" ? sections.behavior : {}),
        exampleSpace: steps,
      };
      continue;
    }

    if (steps === undefined) {
      const prose = fence.content.map((line) => line.trim()).filter(Boolean).join(" ");
      sections.behavior = {
        ...(typeof sections.behavior === "object" ? sections.behavior : {}),
        examples: [prose],
      };
      continue;
    }

    for (const step of phases.flatMap((phase) => steps[phase])) {
      if (hasUnboundSlot(step)) {
        unboundUsedSteps.push(step);
      }
    }

    sections.behavior = {
      ...(typeof sections.behavior === "object" ? sections.behavior : {}),
      examples: [steps],
    };
  }

  const data: Record<string, unknown> = {
    ...parsed.envelope,
    ...(title === undefined ? {} : { title }),
  };

  for (const name of SPEC_SECTION_NAMES) {
    if (sectionNames.has(name) && sections[name] !== undefined) {
      data[name] = sections[name];
    }
  }

  const id = typeof data.id === "string" ? data.id : "";
  const reification: FileReification = {
    specs: [{ data, id, file: relativePath, line: 1 }],
    packs: [],
    findings: [],
  };

  return {
    reification,
    droppedProse: proseParagraphs(lines, fences),
    unboundUsedSteps,
  };
}

export function reifyMarkdown(text: string, relativePath: string): FileReification {
  return inspectMarkdown(text, relativePath).reification;
}
