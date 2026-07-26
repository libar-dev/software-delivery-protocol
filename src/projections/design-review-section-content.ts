import { renderStepText } from "../notation/slots.js";
import { escapeRenderedField, sectionDescription } from "./owned-prose.js";
import { asArray, asRecord, asText, tableCell, textEntries } from "./design-review-markdown.js";

export function renderIntent(intent: Record<string, unknown>): readonly string[] {
  const description = sectionDescription(intent);
  const lines: string[] = ["## Intent", "", ...description];

  if (description.length > 0) {
    lines.push("");
  }

  for (const field of ["actor", "problem", "outcome", "value"]) {
    const text = asText(intent[field]);

    if (text !== undefined) {
      lines.push(`- **${field}:** ${escapeRenderedField(text)}`);
    }
  }

  for (const field of ["risks", "assumptions"]) {
    const entries = textEntries(intent[field]);

    if (entries.length > 0) {
      lines.push(`- **${field}:**`);
      lines.push(...entries.map((entry) => `  - ${escapeRenderedField(entry)}`));
    }
  }

  const openQuestions = asArray(intent.openQuestions) ?? [];

  if (openQuestions.length > 0) {
    lines.push("", "### Open questions", "");

    for (const entry of openQuestions) {
      const prose = asText(entry);

      if (prose !== undefined) {
        lines.push(`- ${escapeRenderedField(prose)}`);
        continue;
      }

      const structured = asRecord(entry);
      const question = asText(structured?.question) ?? "(malformed open-question entry)";
      const blocking = structured?.blocking === true ? " — **blocking**" : "";
      lines.push(`- ${escapeRenderedField(question)}${blocking}`);
    }
  }

  return lines;
}

export function renderBehavior(behavior: Record<string, unknown>): readonly string[] {
  const description = sectionDescription(behavior);
  const lines: string[] = ["## Behavior"];

  if (description.length > 0) {
    lines.push("", ...description);
  }

  const rules = textEntries(behavior.rules);

  if (rules.length > 0) {
    lines.push("", "### Rules", "", ...rules.map((rule) => `- ${escapeRenderedField(rule)}`));
  }

  const examples = asArray(behavior.examples) ?? [];

  if (examples.length > 0) {
    lines.push("", "### Examples", "");

    for (const entry of examples) {
      const prose = asText(entry);

      if (prose !== undefined) {
        lines.push(`- ${escapeRenderedField(prose)}`);
        continue;
      }

      const structured = asRecord(entry);

      if (structured === undefined) {
        continue;
      }

      lines.push("- Example:");

      for (const phase of ["given", "when", "then"]) {
        const steps = textEntries(structured[phase]);

        if (steps.length > 0) {
          lines.push(`  - **${phase}**`);
          lines.push(...steps.map((step) => `    - ${escapeRenderedField(renderStepText(step))}`));
        }
      }
    }
  }

  const flows = textEntries(behavior.flows);

  if (flows.length > 0) {
    lines.push("", "### Flows", "", ...flows.map((flow) => `- ${escapeRenderedField(flow)}`));
  }

  const space = asRecord(behavior.exampleSpace);

  if (space !== undefined) {
    const spaceLines: string[] = [];

    for (const phase of ["given", "when", "then"]) {
      const steps = textEntries(space[phase]);

      if (steps.length > 0) {
        spaceLines.push(`  - **${phase}**`);
        spaceLines.push(...steps.map((step) => `    - ${escapeRenderedField(step)}`));
      }
    }

    if (spaceLines.length > 0) {
      lines.push("", "### Example space", "", "- Step vocabulary:", ...spaceLines);
    }
  }

  return lines.length === 1 ? [] : lines;
}

export function renderConstraints(entries: readonly unknown[]): readonly string[] {
  const lines = [
    "## Constraints",
    "",
    "| Flavor | Statement | Target | Measurable by |",
    "|---|---|---|---|",
  ];

  for (const entry of entries) {
    const constraint = asRecord(entry) ?? {};
    const cell = (field: string): string => tableCell(asText(constraint[field]) ?? "—");
    lines.push(
      `| ${cell("flavor")} | ${cell("statement")} | ${cell("target")} | ${cell("measurableBy")} |`,
    );
  }

  return lines;
}

export function renderModel(model: Record<string, unknown>): readonly string[] {
  const terms = asRecord(model.terms) ?? {};
  const names = Object.keys(terms).sort();
  const description = sectionDescription(model);

  if (names.length === 0 && description.length === 0) {
    return [];
  }

  const lines = ["## Domain vocabulary"];

  if (description.length > 0) {
    lines.push("", ...description);
  }

  if (names.length > 0) {
    lines.push("", "| Term | Definition |", "|---|---|");
  }

  for (const name of names) {
    lines.push(`| ${tableCell(name)} | ${tableCell(asText(terms[name]) ?? "—")} |`);
  }

  return lines;
}
