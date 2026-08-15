import { GHERKIN_KIND_LIE_REASONS } from "../extract/gherkin-kind-honesty.js";
import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { SpecKind } from "../model/descriptors.js";
import type {
  BehaviorSection,
  GivenWhenThen,
  IntentSection,
  SpecSections,
  VerificationSection,
} from "../model/sections.js";
import type { Reader, SpecContext } from "../reader/reader.js";

export interface GherkinViewPage {
  /** POSIX path under the projection root (`generated/gherkin/`). */
  readonly path: string;
  readonly content: string;
}

const gherkinViewAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.gherkin-view"),
  label: "renders a generated Gherkin-shaped READ projection of any Spec",
  satisfies: ref("spec:consumers.gherkin-view"),
});
void gherkinViewAnchor;

const CANONICAL_KINDS = new Set<SpecKind>(["behavior", "example"]);

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Escapes authored text so a generated Gherkin-shaped page cannot invent structure. */
export function escapeGherkinViewText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("```", "'''")
    .replaceAll('"""', "'''")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replaceAll("\n", " ");
}

function pagePathOf(id: string): string {
  const separator = id.indexOf(":");
  const expectedNamespace = "spec";
  const namespace = separator === -1 ? "" : id.slice(0, separator);
  const body = separator === -1 ? "" : id.slice(separator + 1);
  if (namespace === expectedNamespace && /^[A-Za-z0-9][A-Za-z0-9.#-]*$/u.test(body)) {
    return `${expectedNamespace}/${body}.feature.md`;
  }
  return `${expectedNamespace}/${encodeURIComponent(id)}.feature.md`;
}

function commentary(reason: string): string {
  return `# LOSSY: ${escapeGherkinViewText(reason)}`;
}

function relationTag(type: string, target: string): string {
  const headByType: Readonly<Record<string, string>> = {
    refines: "refines",
    dependsOn: "depends-on",
    constrainedBy: "constrained-by",
    decidedBy: "decided-by",
    verifies: "verifies",
    supersedes: "supersedes",
  };
  const head = headByType[type];
  if (head === undefined) return `@${escapeGherkinViewText(type)}.${escapeGherkinViewText(target)}`;
  return `@${head}.${escapeGherkinViewText(target)}`;
}

function identityTags(context: SpecContext): readonly string[] {
  const dottedId = context.id.startsWith("spec:") ? context.id.slice("spec:".length) : context.id;
  return [
    `@spec.${escapeGherkinViewText(dottedId)}`,
    `@altitude.${escapeGherkinViewText(context.altitude)}`,
    `@readiness.${escapeGherkinViewText(context.statedReadiness)}`,
    ...context.relationsOut
      .slice()
      .sort(
        (left, right) =>
          compareCodeUnits(left.type, right.type) || compareCodeUnits(left.otherId, right.otherId),
      )
      .map((relation) => relationTag(relation.type, relation.otherId)),
  ];
}

function keyedIntent(intent: IntentSection | undefined): readonly string[] {
  if (intent === undefined) return [];
  const lines: string[] = [];
  const singular: readonly (readonly [keyof IntentSection, string])[] = [
    ["problem", "problem"],
    ["outcome", "outcome"],
    ["value", "value"],
    ["actor", "actor"],
    ["description", "description"],
  ];
  for (const [field, key] of singular) {
    const value = intent[field];
    if (typeof value === "string" && value.length > 0) {
      lines.push(`  - ${key}: ${escapeGherkinViewText(value)}`);
    }
  }
  for (const risk of intent.risks ?? []) {
    lines.push(`  - risk: ${escapeGherkinViewText(risk)}`);
  }
  for (const assumption of intent.assumptions ?? []) {
    lines.push(`  - assumption: ${escapeGherkinViewText(assumption)}`);
  }
  for (const question of intent.openQuestions ?? []) {
    const text = typeof question === "string" ? question : question.question;
    lines.push(commentary(`open question cannot be carried honestly: ${text}`));
  }
  return lines;
}

function keyedVerification(verification: VerificationSection | undefined): readonly string[] {
  if (verification === undefined) return [];
  const lines: string[] = [];
  if (verification.mode !== undefined) {
    lines.push(`  - verification-mode: ${escapeGherkinViewText(verification.mode)}`);
  }
  for (const criterion of verification.criteria ?? []) {
    lines.push(`  - criterion: ${escapeGherkinViewText(criterion)}`);
  }
  if (typeof verification.description === "string" && verification.description.length > 0) {
    lines.push(commentary(`verification description: ${verification.description}`));
  }
  return lines;
}

function narrativeLines(narrative: string | undefined): readonly string[] {
  if (narrative === undefined || narrative.trim().length === 0) return [];
  return narrative
    .split(/\n\n/u)
    .map((paragraph) => `  ${escapeGherkinViewText(paragraph.replaceAll("\n", " "))}`);
}

function stepLines(phase: "Given" | "When" | "Then", steps: readonly string[]): readonly string[] {
  return steps.map((step, index) => {
    const keyword = index === 0 ? phase : "And";
    return `    ${keyword} ${escapeGherkinViewText(step)}`;
  });
}

function renderExampleSpace(space: BehaviorSection["exampleSpace"]): readonly string[] {
  if (space === undefined) return [];
  return [
    "  @example-space",
    "  Scenario: Shared vocabulary",
    ...stepLines("Given", space.given ?? []),
    ...stepLines("When", space.when ?? []),
    ...stepLines("Then", space.then ?? []),
    "",
  ];
}

function isStructuredExample(example: unknown): example is GivenWhenThen {
  return (
    typeof example === "object" &&
    example !== null &&
    Array.isArray((example as GivenWhenThen).given) &&
    Array.isArray((example as GivenWhenThen).when) &&
    Array.isArray((example as GivenWhenThen).then)
  );
}

function renderInlineExamples(examples: BehaviorSection["examples"]): readonly string[] {
  if (examples === undefined) return [];
  const lines: string[] = [];
  for (const [index, example] of examples.entries()) {
    if (typeof example === "string") {
      lines.push(commentary(`inline example prose cannot be a Scenario: ${example}`));
      continue;
    }
    if (!isStructuredExample(example)) {
      lines.push(commentary(`unrecognized inline example at index ${String(index)}`));
      continue;
    }
    lines.push(
      `  # LOSSY: inline example ${String(index + 1)} is not a child Spec; rendered as commentary Scenario`,
    );
    lines.push(`  Scenario: Inline example ${String(index + 1)}`);
    lines.push(...stepLines("Given", example.given));
    lines.push(...stepLines("When", example.when));
    lines.push(...stepLines("Then", example.then));
    lines.push("");
  }
  return lines;
}

function renderBehavior(behavior: BehaviorSection | undefined, kind: SpecKind): readonly string[] {
  if (behavior === undefined) return [];
  const lines: string[] = [];
  if (typeof behavior.description === "string" && behavior.description.length > 0) {
    lines.push(commentary(`behavior description: ${behavior.description}`));
  }
  for (const flow of behavior.flows ?? []) {
    lines.push(commentary(`flow cannot be carried honestly: ${flow}`));
  }
  if (kind === "example") {
    for (const example of behavior.examples ?? []) {
      if (typeof example === "string") {
        lines.push(commentary(`example prose cannot be a step: ${example}`));
        continue;
      }
      if (!isStructuredExample(example)) continue;
      lines.push(...stepLines("Given", example.given));
      lines.push(...stepLines("When", example.when));
      lines.push(...stepLines("Then", example.then));
    }
    return lines;
  }
  lines.push(...renderExampleSpace(behavior.exampleSpace));
  lines.push(...renderInlineExamples(behavior.examples));
  for (const rule of behavior.rules ?? []) {
    lines.push(`  Rule: ${escapeGherkinViewText(rule)}`);
    lines.push("");
  }
  return lines;
}

function renderRefusedKindContent(
  sections: SpecSections | undefined,
  kind: SpecKind,
): readonly string[] {
  if (sections === undefined) return [];
  const lines: string[] = [];
  const constraints = sections.constraints;
  if (constraints !== undefined) {
    for (const constraint of constraints) {
      const target = constraint.target === undefined ? "" : ` target=${constraint.target}`;
      lines.push(commentary(`constraint${target}: ${constraint.statement}`));
    }
  }
  const model = sections.model;
  if (model !== undefined) {
    const terms = model.terms ?? {};
    for (const key of Object.keys(terms).sort(compareCodeUnits)) {
      lines.push(commentary(`model term ${key}: ${terms[key] ?? ""}`));
    }
    if (typeof model.description === "string" && model.description.length > 0) {
      lines.push(commentary(`model description: ${model.description}`));
    }
  }
  const decision = sections.decision;
  if (decision !== undefined) {
    if (decision.context !== undefined) {
      lines.push(commentary(`decision context: ${decision.context}`));
    }
    if (decision.decision !== undefined) lines.push(commentary(`decision: ${decision.decision}`));
    for (const rationale of decision.rationale ?? []) {
      lines.push(commentary(`decision rationale: ${rationale}`));
    }
    for (const alternative of decision.alternatives ?? []) {
      lines.push(commentary(`decision alternative: ${alternative}`));
    }
    for (const consequence of decision.consequences ?? []) {
      lines.push(commentary(`decision consequence: ${consequence}`));
    }
  }
  if (kind === "workflow" || kind === "contract") {
    lines.push(...renderBehavior(sections.behavior, kind));
  }
  return lines;
}

function isPopulatedSection(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "object" && value !== null && Object.keys(value).length > 0;
}

function renderUnrepresentedSections(
  sections: SpecSections | undefined,
  kind: SpecKind,
  refused: boolean,
): readonly string[] {
  if (sections === undefined) return [];

  const represented = new Set<string>(["intent", "verification"]);
  if (!refused || kind === "workflow" || kind === "contract") represented.add("behavior");
  if (refused) {
    represented.add("constraints");
    represented.add("model");
    represented.add("decision");
  }

  return Object.entries(sections)
    .filter(([name, value]) => !represented.has(name) && isPopulatedSection(value))
    .sort(([left], [right]) => compareCodeUnits(left, right))
    .map(([name]) => commentary(`${name} section is present but cannot be represented honestly`));
}

function renderSpecPage(context: SpecContext): GherkinViewPage {
  const kind = context.specKind;
  const lieReason = (GHERKIN_KIND_LIE_REASONS as Readonly<Record<string, string>>)[kind];
  const title = escapeGherkinViewText(context.title ?? context.id);
  const keyword = kind === "example" ? "Scenario" : "Feature";
  const lines = [
    "# Generated Gherkin-shaped READ projection — disposable; not a carrier; not round-trippable.",
    commentary(`source ${context.file}; kind ${kind}`),
    ...(lieReason === undefined
      ? CANONICAL_KINDS.has(kind)
        ? []
        : [commentary(`unrecognized kind ${kind} cannot be carried honestly`)]
      : [commentary(lieReason)]),
    "",
    identityTags(context).join(" "),
    `${keyword}: ${title}`,
    ...narrativeLines(context.narrative),
    ...keyedIntent(context.sections?.intent),
    ...keyedVerification(context.sections?.verification),
    ...(lieReason === undefined
      ? renderBehavior(context.sections?.behavior, kind)
      : renderRefusedKindContent(context.sections, kind)),
    ...renderUnrepresentedSections(context.sections, kind, lieReason !== undefined),
    "",
    "_Generated from the one graph by `sdp gherkin` — read-only; regenerate to update._",
    "",
  ];

  return { path: pagePathOf(context.id), content: lines.join("\n") };
}

function renderIndex(specs: readonly SpecContext[]): GherkinViewPage {
  const lines = [
    "# Generated Gherkin-shaped READ projection",
    "",
    "Disposable. Not a carrier. Not round-trippable. Never `.sdp.gherkin`.",
    "",
    ...(specs.length === 0
      ? ["No Specs."]
      : specs.map((spec) => {
          const lie = (GHERKIN_KIND_LIE_REASONS as Readonly<Record<string, string>>)[spec.specKind];
          const marker = lie === undefined ? "" : " — LOSSY";
          return `- [\`${spec.id}\`](${pagePathOf(spec.id)})${marker}`;
        })),
    "",
    "_Generated from the one graph by `sdp gherkin` — read-only; regenerate to update._",
    "",
  ];
  return { path: "index.md", content: lines.join("\n") };
}

/**
 * Pure Gherkin-shaped READ projection. It reads only the Reader; it performs no filesystem
 * access and carries no clock or run identity.
 */
export function renderGherkinView(reader: Reader): readonly GherkinViewPage[] {
  const contexts = reader
    .specs()
    .slice()
    .sort((left, right) => compareCodeUnits(left.id, right.id))
    .flatMap((spec) => {
      const context = reader.specContext(spec.id);
      return context === undefined ? [] : [context];
    });
  return [renderIndex(contexts), ...contexts.map(renderSpecPage)].sort((left, right) =>
    compareCodeUnits(left.path, right.path),
  );
}
