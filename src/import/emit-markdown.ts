import type { ReifiedSpec } from "../extract/reify.js";
import { assertMarkdownEmissionFidelity } from "./markdown-fidelity.js";

const relationTypes = [
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
  "verifies",
  "supersedes",
] as const;
const verificationModes = ["manual", "reviewed", "contract", "executable"] as const;
const camelKey = /^[a-z][A-Za-z0-9]*$/u;

type Data = Record<string, unknown>;

function isRecord(value: unknown): value is Data {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function record(value: unknown): Data | undefined {
  return isRecord(value) ? value : undefined;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function texts(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const item of value) {
    const value = text(item);
    if (value !== undefined) result.push(value);
  }
  return result;
}

function isRelation(value: unknown): value is { readonly type: string; readonly target: string } {
  const candidate = record(value);
  return (
    candidate !== undefined &&
    text(candidate.type) !== undefined &&
    text(candidate.target) !== undefined
  );
}

function targetsForRelationType(relations: unknown, type: string): readonly string[] {
  if (!Array.isArray(relations)) return [];
  const targets: string[] = [];
  for (const relation of relations)
    if (isRelation(relation) && relation.type === type) targets.push(relation.target);
  return targets;
}

function section(
  heading: string,
  description: unknown,
  items: readonly string[],
): string | undefined {
  const prose = text(description);
  if (prose === undefined && items.length === 0) return undefined;
  return [`## ${heading}`, prose, items.length > 0 ? items.join("\n") : undefined]
    .filter((part): part is string => part !== undefined)
    .join("\n\n");
}

function fence(kind: "gwt" | "gwt-vocabulary", value: unknown): string | undefined {
  const example = record(value);
  if (example === undefined) return undefined;
  const given = texts(example.given);
  const when = texts(example.when);
  const outcome = texts(example.then);
  const action = when[0];
  if (given.length === 0 || action === undefined || outcome.length === 0) return undefined;
  const steps = [
    ...given.map((step, index) => `${index === 0 ? "Given" : "And"} ${step}`),
    `When ${action}`,
    ...outcome.map((step, index) => `${index === 0 ? "Then" : "And"} ${step}`),
  ];
  return ["```" + kind, ...steps, "```"].join("\n");
}

function intentSection(intent: Data | undefined, example: string | undefined): string | undefined {
  const fields = ["actor", "problem", "outcome", "value"].flatMap((name) => {
    const value = text(intent?.[name]);
    return value === undefined ? [] : [`- ${name}: ${value}`];
  });
  const repeated = [
    ...texts(intent?.risks).map((value) => `- risk: ${value}`),
    ...texts(intent?.assumptions).map((value) => `- assumption: ${value}`),
  ];
  const questions = Array.isArray(intent?.openQuestions)
    ? intent.openQuestions.flatMap((question) => {
        const entry = record(question);
        const value = text(entry?.question);
        return value === undefined || typeof entry?.blocking !== "boolean"
          ? []
          : [`- [${entry.blocking ? "blocking" : "non-blocking"}] ${value}`];
      })
    : [];
  const fieldBlock = [...fields, ...repeated].join("\n");
  const questionBlock =
    questions.length === 0 ? undefined : ["### Open questions", "", ...questions].join("\n");
  const blocks = [fieldBlock.length === 0 ? undefined : fieldBlock, questionBlock, example].filter(
    (block): block is string => block !== undefined,
  );
  return section("Intent", intent?.description, blocks.length === 0 ? [] : [blocks.join("\n\n")]);
}

function behaviorSection(data: Data, behavior: Data): string | undefined {
  const rules = texts(behavior.rules);
  const flows = texts(behavior.flows);
  const kind = text(data.kind);
  const ownsExampleSpace = fence("gwt-vocabulary", behavior.exampleSpace) !== undefined;
  if (kind === "behavior" && ownsExampleSpace && rules.length === 0 && flows.length === 0)
    return undefined;
  if (kind === "behavior")
    return section("Behavior", behavior.description, [
      ...rules.map((value) => `- rule: ${value}`),
      ...flows.map((value) => `- flow: ${value}`),
    ]);
  if (kind === "rule")
    return section(
      "Rule",
      behavior.description,
      rules.map((value) => `- ${value}`),
    );
  if (kind === "workflow")
    return section("Workflow", behavior.description, [
      ...flows.map((value) => `- ${value}`),
      ...rules.map((value) => `- rule: ${value}`),
    ]);
  if (kind === "contract")
    return section(
      "Contract",
      behavior.description,
      rules.map((value) => `- ${value}`),
    );
  return undefined;
}

function exampleSpaceSection(behavior: Data, hasPrimaryBehavior: boolean): string | undefined {
  const vocabulary = fence("gwt-vocabulary", behavior.exampleSpace);
  return vocabulary === undefined
    ? undefined
    : section("Example space", hasPrimaryBehavior ? undefined : behavior.description, [vocabulary]);
}

function constraintsSection(value: unknown): string | undefined {
  const constraint = Array.isArray(value) ? record(value[0]) : undefined;
  const statement = text(constraint?.statement);
  if (statement === undefined) return undefined;
  const optional = ["flavor", "target", "measurableBy"].flatMap((name) => {
    const field = text(constraint?.[name]);
    return field === undefined ? [] : [`- ${name}: ${field}`];
  });
  return section("Constraints", undefined, [`- statement: ${statement}`, ...optional]);
}

function modelSection(model: Data | undefined): string | undefined {
  const terms = record(model?.terms);
  const items =
    terms === undefined
      ? []
      : Object.entries(terms).flatMap(([term, definition]) => {
          const value = text(definition);
          return value === undefined ? [] : [`- **${term}** — ${value}`];
        });
  return section("Model", model?.description, items);
}

function openSection(heading: "Design" | "UI", value: Data | undefined): string | undefined {
  const items =
    value === undefined
      ? []
      : Object.entries(value).flatMap(([key, field]) => {
          const content = text(field);
          return key === "description" || !camelKey.test(key) || content === undefined
            ? []
            : [`- ${key}: ${content}`];
        });
  return section(heading, value?.description, items);
}

function decisionSection(decision: Data | undefined): string | undefined {
  const singles = ["context", "decision"].flatMap((name) => {
    const value = text(decision?.[name]);
    return value === undefined ? [] : [`- ${name}: ${value}`];
  });
  const repeated = [
    ...texts(decision?.rationale).map((value) => `- rationale: ${value}`),
    ...texts(decision?.alternatives).map((value) => `- alternative: ${value}`),
    ...texts(decision?.consequences).map((value) => `- consequence: ${value}`),
  ];
  return section("Decision", decision?.description, [...singles, ...repeated]);
}

function verificationSection(verification: Data | undefined): string | undefined {
  const mode = text(verification?.mode);
  if (mode === undefined || !verificationModes.some((candidate) => candidate === mode))
    return undefined;
  return section(
    `Verification — ${mode}`,
    verification?.description,
    texts(verification?.criteria).map((value) => `- ${value}`),
  );
}

export function emitMarkdownSpec(reified: ReifiedSpec): string {
  const data = reified.data;
  const relationLines = relationTypes.flatMap((type) => {
    const targets = targetsForRelationType(data.relations, type);
    if (targets.length === 0) return [];
    const target = targets[0];
    return targets.length === 1 && target !== undefined
      ? [`  ${type}: ${target}`]
      : [`  ${type}:`, ...targets.map((target) => `    - ${target}`)];
  });
  const envelopeRelations =
    relationLines.length === 0 ? ["relations: {}"] : ["relations:", ...relationLines];
  const envelope = [
    "---",
    `id: ${String(data.id)}`,
    `kind: ${String(data.kind)}`,
    `altitude: ${String(data.altitude)}`,
    `readiness: ${String(data.readiness)}`,
    ...envelopeRelations,
    "---",
    `# ${String(data.title)}`,
  ].join("\n");
  const behavior = record(data.behavior);
  const examples = Array.isArray(behavior?.examples) ? behavior.examples : [];
  const example = text(data.kind) === "example" ? fence("gwt", examples[0]) : undefined;
  const primaryBehavior = behavior === undefined ? undefined : behaviorSection(data, behavior);
  const sections = [
    text(data.narrative),
    intentSection(record(data.intent), example),
    primaryBehavior,
    behavior === undefined
      ? undefined
      : exampleSpaceSection(behavior, primaryBehavior !== undefined),
    constraintsSection(data.constraints),
    modelSection(record(data.model)),
    openSection("Design", record(data.design)),
    decisionSection(record(data.decision)),
    verificationSection(record(data.verification)),
    openSection("UI", record(data.ui)),
  ].filter((value): value is string => value !== undefined);
  const document =
    sections.length === 0 ? `${envelope}\n` : `${envelope}\n\n${sections.join("\n\n")}\n`;
  assertMarkdownEmissionFidelity(reified, document);
  return document;
}
