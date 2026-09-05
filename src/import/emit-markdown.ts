import type { ReifiedSpec } from "../extract/reify.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { importData, importText, importTexts, targetsForRelationType } from "./data-access.js";
import type { ImportData } from "./data-access.js";
import { assertMarkdownEmissionFidelity } from "./markdown-fidelity.js";
import { MarkdownEmissionError } from "./markdown-fidelity.js";

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

function section(
  heading: string,
  description: unknown,
  items: readonly string[],
): string | undefined {
  const prose = importText(description);
  if (prose === undefined && items.length === 0) return undefined;
  return [`## ${heading}`, prose, items.length > 0 ? items.join("\n") : undefined]
    .filter((part): part is string => part !== undefined)
    .join("\n\n");
}

function fence(kind: "gwt" | "gwt-vocabulary", value: unknown): string | undefined {
  const example = importData(value);
  if (example === undefined) return undefined;
  const given = importTexts(example.given);
  const when = importTexts(example.when);
  const outcome = importTexts(example.then);
  const action = when[0];
  if (given.length === 0 || action === undefined || outcome.length === 0) return undefined;
  const steps = [
    ...given.map((step, index) => `${index === 0 ? "Given" : "And"} ${step}`),
    `When ${action}`,
    ...outcome.map((step, index) => `${index === 0 ? "Then" : "And"} ${step}`),
  ];
  return ["```" + kind, ...steps, "```"].join("\n");
}

function intentSection(
  intent: ImportData | undefined,
  example: string | undefined,
): string | undefined {
  const fields = ["actor", "problem", "outcome", "value"].flatMap((name) => {
    const value = importText(intent?.[name]);
    return value === undefined ? [] : [`- ${name}: ${value}`];
  });
  const repeated = [
    ...importTexts(intent?.risks).map((value) => `- risk: ${value}`),
    ...importTexts(intent?.assumptions).map((value) => `- assumption: ${value}`),
  ];
  const questions = Array.isArray(intent?.openQuestions)
    ? intent.openQuestions.flatMap((question) => {
        const entry = importData(question);
        const value = importText(entry?.question);
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

function behaviorSection(data: ImportData, behavior: ImportData): string | undefined {
  const rules = importTexts(behavior.rules);
  const flows = importTexts(behavior.flows);
  const kind = importText(data.kind);
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

function exampleSpaceSection(
  behavior: ImportData,
  hasPrimaryBehavior: boolean,
): string | undefined {
  const vocabulary = fence("gwt-vocabulary", behavior.exampleSpace);
  return vocabulary === undefined
    ? undefined
    : section("Example space", hasPrimaryBehavior ? undefined : behavior.description, [vocabulary]);
}

function constraintsSection(value: unknown): string | undefined {
  const constraint = Array.isArray(value) ? importData(value[0]) : undefined;
  const statement = importText(constraint?.statement);
  if (statement === undefined) return undefined;
  const optional = ["flavor", "target", "measurableBy"].flatMap((name) => {
    const field = importText(constraint?.[name]);
    return field === undefined ? [] : [`- ${name}: ${field}`];
  });
  return section("Constraints", undefined, [`- statement: ${statement}`, ...optional]);
}

function modelSection(model: ImportData | undefined): string | undefined {
  const terms = importData(model?.terms);
  const items =
    terms === undefined
      ? []
      : Object.entries(terms).flatMap(([term, definition]) => {
          const value = importText(definition);
          return value === undefined ? [] : [`- **${term}** — ${value}`];
        });
  return section("Model", model?.description, items);
}

function openSection(heading: "Design" | "UI", value: ImportData | undefined): string | undefined {
  const items =
    value === undefined
      ? []
      : Object.entries(value).flatMap(([key, field]) => {
          const content = importText(field);
          return key === "description" || !camelKey.test(key) || content === undefined
            ? []
            : [`- ${key}: ${content}`];
        });
  return section(heading, value?.description, items);
}

function decisionSection(decision: ImportData | undefined): string | undefined {
  const singles = ["context", "decision"].flatMap((name) => {
    const value = importText(decision?.[name]);
    return value === undefined ? [] : [`- ${name}: ${value}`];
  });
  const repeated = [
    ...importTexts(decision?.rationale).map((value) => `- rationale: ${value}`),
    ...importTexts(decision?.alternatives).map((value) => `- alternative: ${value}`),
    ...importTexts(decision?.consequences).map((value) => `- consequence: ${value}`),
  ];
  return section("Decision", decision?.description, [...singles, ...repeated]);
}

function verificationSection(verification: ImportData | undefined): string | undefined {
  const mode = importText(verification?.mode);
  if (mode === undefined || !verificationModes.some((candidate) => candidate === mode))
    return undefined;
  return section(
    `Verification — ${mode}`,
    verification?.description,
    importTexts(verification?.criteria).map((value) => `- ${value}`),
  );
}

export interface EmitMarkdownOptions {
  /**
   * Emit the kind's lawful typed-section heading even when that section has no
   * authored content. Import emission stays loss-less and still omits empty
   * sections; only the idea-rung scaffolder opts in.
   */
  readonly scaffold?: boolean;
}

function scaffoldBehaviorHeading(kind: string | undefined): string | undefined {
  if (kind === "behavior" || kind === "example") return "## Behavior";
  if (kind === "workflow") return "## Workflow";
  if (kind === "rule") return "## Rule";
  if (kind === "contract") return "## Contract";
  return undefined;
}

const sdpImportMarkdownEmitAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.sdp-import-markdown-emit"),
  label: "emits the Markdown document twin for an imported Spec",
  satisfies: ref("spec:carrier.sdp-import"),
  component: componentAnchorId("component:protocol.import"),
});
void sdpImportMarkdownEmitAnchor;

export function emitMarkdownSpec(reified: ReifiedSpec, options: EmitMarkdownOptions = {}): string {
  const data = reified.data;
  const title = importText(data.title);
  const scaffold = options.scaffold === true;

  if (title === undefined) {
    throw new MarkdownEmissionError("first divergent path: title (Markdown requires an H1 title)");
  }

  if (title.includes("\n") || title.includes("\r")) {
    throw new MarkdownEmissionError(
      "first divergent path: title (multi-line titles are not representable)",
    );
  }

  const relationKeys = new Set<string>();

  for (const relation of Array.isArray(data.relations) ? data.relations : []) {
    const value = importData(relation);
    const key = `${String(value?.type)}\u0000${String(value?.target)}`;

    if (relationKeys.has(key)) {
      throw new MarkdownEmissionError("first divergent path: relations (duplicate relation entry)");
    }

    relationKeys.add(key);
  }
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
    `# ${title}`,
  ].join("\n");
  const behavior = importData(data.behavior);
  const examples = Array.isArray(behavior?.examples) ? behavior.examples : [];
  const example = importText(data.kind) === "example" ? fence("gwt", examples[0]) : undefined;
  const primaryBehavior = behavior === undefined ? undefined : behaviorSection(data, behavior);
  const kind = importText(data.kind);
  const scaffoldHeading =
    scaffold && primaryBehavior === undefined ? scaffoldBehaviorHeading(kind) : undefined;
  const sections = [
    importText(data.narrative),
    intentSection(importData(data.intent), example),
    primaryBehavior ?? scaffoldHeading,
    behavior === undefined
      ? undefined
      : exampleSpaceSection(behavior, primaryBehavior !== undefined),
    constraintsSection(data.constraints),
    modelSection(importData(data.model)) ?? (scaffold && kind === "model" ? "## Model" : undefined),
    openSection("Design", importData(data.design)),
    decisionSection(importData(data.decision)) ??
      (scaffold && kind === "decision" ? "## Decision" : undefined),
    verificationSection(importData(data.verification)),
    openSection("UI", importData(data.ui)),
  ].filter((value): value is string => value !== undefined);
  const document =
    sections.length === 0 ? `${envelope}\n` : `${envelope}\n\n${sections.join("\n\n")}\n`;
  if (!scaffold) {
    assertMarkdownEmissionFidelity(reified, document);
  }
  return document;
}
