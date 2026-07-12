import {
  SPEC_ALTITUDES,
  SPEC_KINDS,
  SPEC_READINESS,
  SPEC_RELATION_TYPES,
  hasUnboundSlot,
  parseId,
  parseSlots,
} from "@libar-dev/software-delivery-protocol";

const phases = ["given", "when", "then"] as const;
type Phase = (typeof phases)[number];
const verificationModes = new Set(["manual", "reviewed", "contract", "executable"]);

export interface ParsedRelation {
  readonly type: string;
  readonly target: string;
}

export interface ParsedSdp {
  readonly id: string;
  readonly kind: string;
  readonly altitude: string;
  readonly readiness: string;
  readonly relations: readonly ParsedRelation[];
  readonly title: string;
  readonly sections: Readonly<Record<string, unknown>>;
  readonly droppedProse: readonly string[];
  readonly unboundUsedSteps: readonly string[];
  readonly cases?: readonly string[];
}

const kinds = new Set<string>(SPEC_KINDS);
const altitudes = new Set<string>(SPEC_ALTITUDES);
const readinessValues = new Set<string>(SPEC_READINESS);
const relationTypes = new Set<string>(SPEC_RELATION_TYPES);

function outside(path: string, line: number, reason: string): never {
  // This spike throws because it has no recovery grammar. A product parser would emit a
  // structured extract/* finding and preserve every independently reifiable declaration.
  throw new Error(`${path}:${String(line)}: outside the grammar subset — ${reason}`);
}

function isBlankOrComment(line: string): boolean {
  return line.trim().length === 0 || line.trimStart().startsWith("#");
}

function nextStructural(lines: readonly string[], start: number): number {
  let index = start;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (!isBlankOrComment(line) && /^  \S/u.test(line)) {
      break;
    }
    index += 1;
  }

  return index;
}

function parseSteps(
  lines: readonly string[],
  path: string,
  baseLine: number,
  baseIndent: number,
  subject: "a structured example" | "an example space",
): Record<Phase, string[]> {
  const result: Record<Phase, string[]> = { given: [], when: [], then: [] };
  let current: Phase | undefined;
  let currentPhaseIndex = -1;

  for (const [offset, raw] of lines.entries()) {
    if (isBlankOrComment(raw)) {
      continue;
    }

    const primary = new RegExp(`^ {${String(baseIndent)}}(Given|When|Then)\\s+(.+)$`, "u").exec(
      raw,
    );
    if (primary !== null) {
      const next = primary[1]?.toLowerCase() as Phase;
      const nextPhaseIndex = phases.indexOf(next);
      if (nextPhaseIndex < currentPhaseIndex) {
        outside(
          path,
          baseLine + offset,
          `${primary[1] ?? "step"} may not appear after ${phases[currentPhaseIndex] ?? "a later phase"}`,
        );
      }
      current = next;
      currentPhaseIndex = nextPhaseIndex;
      result[current].push(primary[2] ?? "");
      continue;
    }

    const continuation = new RegExp(`^ {${String(baseIndent + 2)}}And\\s+(.+)$`, "u").exec(
      raw,
    );
    if (continuation !== null && current !== undefined) {
      result[current].push(continuation[1] ?? "");
      continue;
    }

    outside(path, baseLine + offset, `expected a Given/When/Then step, found ${JSON.stringify(raw)}`);
  }

  if (phases.some((phase) => result[phase].length === 0)) {
    outside(path, baseLine, `${subject} needs at least one Given, When, and Then step`);
  }

  return result;
}

function childLines(
  lines: readonly string[],
  start: number,
  path: string,
  allowSteps = false,
): { readonly lines: readonly string[]; readonly end: number } {
  const end = nextStructural(lines, start);
  const block = lines.slice(start, end);

  for (const [offset, line] of block.entries()) {
    if (isBlankOrComment(line)) continue;

    if (!/^ {4}\S/u.test(line) && !/^ {6}\S/u.test(line)) {
      outside(path, start + offset + 1, "block content must remain indented beneath its keyword");
    }

    const content = line.trimStart();
    const beginsBlockKeyword =
      /^(?:spec|intent|model|decision|rule|cases|verification)(?:\s|$)/u.test(content) ||
      /^example space(?:\s|$)/u.test(content);
    const beginsStepKeyword = /^(?:Given|When|Then|And)\b/u.test(content);
    const beginsRelationKeyword = relationTypes.has(content.split(/\s+/u)[0] ?? "");

    if (beginsBlockKeyword || beginsRelationKeyword || (!allowSteps && beginsStepKeyword)) {
      outside(
        path,
        start + offset + 1,
        `structural keyword ${JSON.stringify(content.split(/\s+/u)[0] ?? content)} is indented as block content`,
      );
    }
  }

  return { lines: block, end };
}

export function parseGrammar(text: string, path: string): ParsedSdp {
  const lines = text.replace(/\r\n?/gu, "\n").split("\n");
  let index = 0;

  while (index < lines.length && isBlankOrComment(lines[index] ?? "")) index += 1;

  const specMatch = /^spec ([a-z0-9][a-z0-9.-]*)$/u.exec(lines[index] ?? "");
  if (specMatch === null) outside(path, index + 1, "the first declaration must be spec <id>");
  const id = `spec:${specMatch[1] ?? ""}`;
  index += 1;

  const descriptor = /^ {2}([a-z]+) · ([a-z]+) · ([a-z]+)$/u.exec(lines[index] ?? "");
  if (descriptor === null) outside(path, index + 1, "expected kind · altitude · readiness");
  const [, kind = "", altitude = "", readiness = ""] = descriptor;
  if (!kinds.has(kind)) outside(path, index + 1, `unknown kind ${JSON.stringify(kind)}`);
  if (!altitudes.has(altitude)) outside(path, index + 1, `unknown altitude ${JSON.stringify(altitude)}`);
  if (!readinessValues.has(readiness)) {
    outside(path, index + 1, `unknown readiness ${JSON.stringify(readiness)}`);
  }
  index += 1;

  const relations: ParsedRelation[] = [];
  const relationKeys = new Set<string>();
  while (index < lines.length) {
    const match = /^ {2}([A-Za-z]+) ([a-z0-9][a-z0-9.:-]*)$/u.exec(lines[index] ?? "");
    if (match === null) break;
    const type = match[1] ?? "";
    if (!relationTypes.has(type)) outside(path, index + 1, `unknown relation ${JSON.stringify(type)}`);
    const rawTarget = match[2] ?? "";
    const target = rawTarget.includes(":") ? rawTarget : `spec:${rawTarget}`;
    try {
      parseId(target);
    } catch {
      outside(path, index + 1, `invalid relation target ${JSON.stringify(target)}`);
    }
    const relationKey = `${type}\u0000${target}`;
    if (relationKeys.has(relationKey)) {
      outside(path, index + 1, `duplicate ${type} relation to ${JSON.stringify(target)}`);
    }
    relationKeys.add(relationKey);
    relations.push({ type, target });
    index += 1;
  }

  if (/^ {2}[a-z]+ · [a-z]+(?: · [a-z]+)?$/u.test(lines[index] ?? "")) {
    outside(path, index + 1, "the descriptor line may be declared only once");
  }

  while (index < lines.length && isBlankOrComment(lines[index] ?? "")) index += 1;
  const title = lines[index] ?? "";
  if (title.trim().length === 0 || /^\s/u.test(title)) {
    outside(path, index + 1, "the first prose line after the envelope is the unindented title");
  }
  index += 1;

  const sections: Record<string, unknown> = {};
  const seen = new Set<string>();
  const droppedProse: string[] = [];
  const unboundUsedSteps: string[] = [];
  let cases: readonly string[] | undefined;

  const markSeen = (name: string, line: number): void => {
    if (seen.has(name)) outside(path, line, `duplicate ${name} block`);
    seen.add(name);
  };

  while (index < lines.length) {
    const raw = lines[index] ?? "";
    if (isBlankOrComment(raw)) {
      index += 1;
      continue;
    }

    if (/^spec\b/u.test(raw)) {
      outside(path, index + 1, "one spec per file; a second spec declaration is not prose");
    }

    if (!raw.startsWith(" ")) {
      const paragraph: string[] = [];
      while (index < lines.length) {
        const proseLine = lines[index] ?? "";
        if (proseLine.trim().length === 0 || proseLine.startsWith("  ")) break;
        if (/^spec\b/u.test(proseLine)) {
          outside(
            path,
            index + 1,
            "one spec per file; a second spec declaration is not prose",
          );
        }
        if (!proseLine.trimStart().startsWith("#")) paragraph.push(proseLine.trim());
        index += 1;
      }
      if (paragraph.length > 0) droppedProse.push(paragraph.join(" "));
      continue;
    }

    if (raw === "  intent") {
      markSeen("intent", index + 1);
      const block = childLines(lines, index + 1, path);
      const intent: Record<string, unknown> = {};
      for (const [offset, line] of block.lines.entries()) {
        if (isBlankOrComment(line)) continue;
        const scalar = /^ {4}(actor|outcome|value):\s*(.+)$/u.exec(line);
        if (scalar !== null) {
          const key = scalar[1] ?? "";
          if (intent[key] !== undefined) outside(path, index + offset + 2, `duplicate ${key}`);
          intent[key] = scalar[2] ?? "";
          continue;
        }
        const question = /^ {4}\? (.+\?) \[(blocking|non-blocking)\]$/u.exec(line);
        if (question !== null) {
          const entries = (intent.openQuestions as Array<Record<string, unknown>> | undefined) ?? [];
          entries.push({ question: question[1] ?? "", blocking: question[2] === "blocking" });
          intent.openQuestions = entries;
          continue;
        }
        outside(path, index + offset + 2, `unrecognized intent line ${JSON.stringify(line.trim())}`);
      }
      sections.intent = intent;
      index = block.end;
      continue;
    }

    if (raw === "  model") {
      markSeen("model", index + 1);
      const block = childLines(lines, index + 1, path);
      const terms: Record<string, string> = {};
      for (const [offset, line] of block.lines.entries()) {
        if (isBlankOrComment(line)) continue;
        const term = /^ {4}([A-Za-z][A-Za-z0-9]*) — (.+)$/u.exec(line);
        if (term === null) outside(path, index + offset + 2, "model terms use name — definition");
        const name = term[1] ?? "";
        if (terms[name] !== undefined) outside(path, index + offset + 2, `duplicate model term ${name}`);
        terms[name] = term[2] ?? "";
      }
      sections.model = { terms };
      index = block.end;
      continue;
    }

    if (raw === "  decision") {
      markSeen("decision", index + 1);
      const block = childLines(lines, index + 1, path);
      const decision: Record<string, unknown> = {};
      let listKey: "rationale" | "consequences" | undefined;
      for (const [offset, line] of block.lines.entries()) {
        if (isBlankOrComment(line)) continue;
        const scalar = /^ {4}decision:\s*(.+)$/u.exec(line);
        if (scalar !== null) {
          if (decision.decision !== undefined) outside(path, index + offset + 2, "duplicate decision");
          decision.decision = scalar[1] ?? "";
          listKey = undefined;
          continue;
        }
        const listStart = /^ {4}(rationale|consequences):$/u.exec(line);
        if (listStart !== null) {
          listKey = listStart[1] as "rationale" | "consequences";
          if (decision[listKey] !== undefined) outside(path, index + offset + 2, `duplicate ${listKey}`);
          decision[listKey] = [];
          continue;
        }
        const item = /^ {6}- (.+)$/u.exec(line);
        if (item !== null && listKey !== undefined) {
          (decision[listKey] as string[]).push(item[1] ?? "");
          continue;
        }
        outside(path, index + offset + 2, `unrecognized decision line ${JSON.stringify(line.trim())}`);
      }
      sections.decision = decision;
      index = block.end;
      continue;
    }

    const verification = /^ {2}verification ([a-z]+)$/u.exec(raw);
    if (verification !== null) {
      markSeen("verification", index + 1);
      const mode = verification[1] ?? "";
      if (!verificationModes.has(mode)) {
        outside(path, index + 1, `unknown verification mode ${JSON.stringify(mode)}`);
      }
      const block = childLines(lines, index + 1, path);
      const criteria = block.lines.flatMap((line, offset) => {
        if (isBlankOrComment(line)) return [];
        const item = /^ {4}- (.+)$/u.exec(line);
        if (item === null) outside(path, index + offset + 2, "verification criteria use - item");
        return [item[1] ?? ""];
      });
      sections.verification = { mode, criteria };
      index = block.end;
      continue;
    }

    if (raw === "  example space") {
      markSeen("example space", index + 1);
      const block = childLines(lines, index + 1, path, true);
      const steps = parseSteps(block.lines, path, index + 2, 4, "an example space");
      for (const step of phases.flatMap((phase) => steps[phase])) {
        for (const slot of parseSlots(step)) {
          if (slot.form !== "typed") {
            outside(path, index + 1, "example-space slots must declare a type");
          }
        }
      }
      sections.behavior = {
        ...(sections.behavior as object | undefined),
        exampleSpace: steps,
      };
      index = block.end;
      continue;
    }

    if (raw === "  rule") {
      markSeen("rule", index + 1);
      const block = childLines(lines, index + 1, path);
      const rules = block.lines.map((line) => line.trim()).filter(Boolean);
      sections.behavior = { ...(sections.behavior as object | undefined), rules };
      index = block.end;
      continue;
    }

    if (raw === "  cases") {
      markSeen("cases", index + 1);
      const caseLines = lines.slice(index + 1);
      for (const [offset, line] of caseLines.entries()) {
        if (isBlankOrComment(line)) continue;
        if (!/^ {4}\S/u.test(line) && !/^ {6}\S/u.test(line)) {
          outside(
            path,
            index + offset + 2,
            "cases must be the final structural block in its file",
          );
        }
      }
      cases = caseLines;
      break;
    }

    if (/^ {2}(Given|When|Then)\s+/u.test(raw)) {
      markSeen("example", index + 1);
      const stepLines: string[] = [];
      while (index < lines.length) {
        const line = lines[index] ?? "";
        if (/^ {2}(Given|When|Then)\s+/u.test(line) || /^ {4}And\s+/u.test(line)) {
          stepLines.push(line);
          index += 1;
          continue;
        }
        break;
      }
      const steps = parseSteps(
        stepLines,
        path,
        index - stepLines.length + 1,
        2,
        "a structured example",
      );
      for (const step of phases.flatMap((phase) => steps[phase])) {
        if (hasUnboundSlot(step)) unboundUsedSteps.push(step);
      }
      sections.behavior = {
        ...(sections.behavior as object | undefined),
        examples: [steps],
      };
      continue;
    }

    outside(path, index + 1, `unrecognized structural line ${JSON.stringify(raw.trim())}`);
  }

  return {
    id,
    kind,
    altitude,
    readiness,
    relations,
    title,
    sections,
    droppedProse,
    unboundUsedSteps,
    ...(cases === undefined ? {} : { cases }),
  };
}
