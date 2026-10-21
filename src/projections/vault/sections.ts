import type { SpecContext } from "../../reader/reader.js";
import { renderStepText } from "../../notation/slots.js";

const record = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const keyFor = (keys: Readonly<Record<string, string>> | undefined, value: string) =>
  Object.entries(keys ?? {}).find(([, v]) => v === value)?.[0];
const block = (section: string, key: string | undefined) =>
  key === undefined ? "" : ` ^${section}-${key}`;
/**
 * @sdpAnchor impl:protocol.vault-sections
 * @sdpLabel renders sections in graph order with keyed entry block ids
 * @sdpSatisfies spec:consumers.obsidian-vault.notes
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */

export function renderSections(context: SpecContext, text: (v: string) => string): string[] {
  const lines: string[] = [];
  const prose = (value: unknown): string =>
    text(typeof value === "string" ? value : JSON.stringify(value));
  const gherkin = (value: unknown): void => {
    const content = Object.entries(record(value)).flatMap(([phase, steps]) =>
      Array.isArray(steps)
        ? steps.map(
            (step: unknown) =>
              `${phase[0]?.toUpperCase() ?? ""}${phase.slice(1)} ${renderStepText(String(step))}`,
          )
        : [],
    );
    const fence = "`".repeat(
      Math.max(
        2,
        ...content.flatMap((line) => [...line.matchAll(/`+/gu)].map((m) => m[0].length)),
      ) + 1,
    );
    lines.push("", `${fence}gherkin`, ...content, fence);
  };
  for (const [section, content] of Object.entries(context.sections ?? {})) {
    lines.push(
      "",
      `## ${section === "ui" ? "UI" : `${section[0]?.toUpperCase() ?? ""}${section.slice(1)}`}`,
      "",
    );
    if (section === "constraints" && Array.isArray(content)) {
      for (const item of content)
        for (const [key, value] of Object.entries(record(item)))
          lines.push(`- ${key}: ${prose(value)}`);
      continue;
    }
    const bag = record(content);
    for (const [key, value] of Object.entries(bag)) {
      if (key === "ruleKeys" || key === "termKeys" || key === "stepKeys") continue;
      if (key === "description") {
        lines.push(prose(value), "");
        continue;
      }
      if (section === "intent" && key === "openQuestions" && Array.isArray(value)) {
        lines.push("### Open questions", "");
        for (const question of value) {
          if (typeof question === "string") {
            lines.push(`- ${text(question)}`);
            continue;
          }
          const q = record(question);
          lines.push(
            `- ${q.blocking === true ? "[blocking] " : ""}${prose(q.question)}${block("question", typeof q.key === "string" ? q.key : undefined)}`,
          );
          for (const field of ["decider", "links", "provisional", "trigger"])
            if (q[field] !== undefined)
              lines.push(
                `  - ${field}: ${Array.isArray(q[field]) ? q[field].map(prose).join(", ") : prose(q[field])}`,
              );
        }
      } else if (section === "behavior" && key === "exampleSpace") gherkin(value);
      else if (section === "behavior" && key === "examples" && Array.isArray(value)) {
        for (const example of value)
          if (typeof example === "string") lines.push(`- ${text(example)}`);
          else gherkin(example);
      } else if (
        section === "behavior" &&
        (key === "rules" || key === "flows") &&
        Array.isArray(value)
      ) {
        value.forEach((entry: unknown, index: number) =>
          lines.push(
            `- ${prose(entry)}${block("rule", keyFor(context.sections?.behavior?.ruleKeys, `${key}[${String(index)}]`))}`,
          ),
        );
      } else if (section === "model" && key === "terms") {
        for (const [term, definition] of Object.entries(record(value)))
          lines.push(
            `- **${text(term)}**: ${prose(definition)}${block("term", keyFor(context.sections?.model?.termKeys, term))}`,
          );
      } else if (section === "design" || section === "ui") {
        lines.push(
          `- ${key}: ${prose(value)}${/^[a-z][A-Za-z0-9]*$/u.test(key) ? block(section, key) : ""}`,
        );
      } else if (Array.isArray(value))
        for (const entry of value) lines.push(`- ${key}: ${prose(entry)}`);
      else lines.push(`- ${key}: ${prose(value)}`);
    }
  }
  return lines;
}
