import type { SpecContext } from "../reader/reader.js";
import { escapeRenderedField, sectionDescription } from "./owned-prose.js";
import {
  asArray,
  asRecord,
  asText,
  renderInlineCode,
  renderDynamicValue,
  textEntries,
} from "./design-review-markdown.js";
import {
  renderBehavior,
  renderConstraints,
  renderIntent,
  renderModel,
} from "./design-review-section-content.js";

function renderDecision(decision: Record<string, unknown>): readonly string[] {
  const lines: string[] = ["## Decision"];
  const description = sectionDescription(decision);

  if (description.length > 0) {
    lines.push("", ...description);
  }

  const context = asText(decision.context);

  if (context !== undefined) {
    lines.push("", `**Context.** ${escapeRenderedField(context)}`);
  }

  const chosen = asText(decision.decision);

  if (chosen !== undefined) {
    lines.push("", `**Decision.** ${escapeRenderedField(chosen)}`);
  }

  for (const field of ["rationale", "alternatives", "consequences"]) {
    const entries = textEntries(decision[field]);

    if (entries.length > 0) {
      lines.push(
        "",
        `**${field[0]?.toUpperCase() ?? ""}${field.slice(1)}.**`,
        "",
        ...entries.map((entry) => `- ${escapeRenderedField(entry)}`),
      );
    }
  }

  return lines.length === 1 ? [] : lines;
}

function renderVerification(verification: Record<string, unknown>): readonly string[] {
  const lines: string[] = ["## Verification intent"];
  const description = sectionDescription(verification);

  if (description.length > 0) {
    lines.push("", ...description);
  }

  const mode = asText(verification.mode);

  if (mode !== undefined) {
    lines.push("", `- **mode:** ${renderInlineCode(mode)}`);
  }

  const criteria = textEntries(verification.criteria);

  if (criteria.length > 0) {
    lines.push(
      "",
      "### Criteria",
      "",
      ...criteria.map((criterion) => `- ${escapeRenderedField(criterion)}`),
    );
  }

  return lines.length === 1 ? [] : lines;
}

/** Open sections render entries in authored order, with structured values nested under their items. */
function renderOpenBag(name: string, content: Record<string, unknown>): readonly string[] {
  const description = sectionDescription(content);
  const entries = Object.entries(content).filter(([key]) => key !== "description");

  if (entries.length === 0 && description.length === 0) {
    return [];
  }

  const lines = [`## ${name[0]?.toUpperCase() ?? ""}${name.slice(1)}`];

  if (description.length > 0) {
    lines.push("", ...description);
  }

  if (entries.length > 0) {
    lines.push("");
  }

  for (const [key, value] of entries) {
    const item = `- ${renderInlineCode(key)}:`;

    if (typeof value === "string") {
      const [first = "", ...rest] = value.split("\n");
      lines.push(
        first.length === 0 ? item : `${item} ${escapeRenderedField(first)}`,
        ...rest.map((line) => `  ${escapeRenderedField(line)}`),
      );
    } else if (asArray(value) !== undefined || asRecord(value) !== undefined) {
      lines.push(
        item,
        "",
        "  ```json",
        ...JSON.stringify(renderDynamicValue(value), null, 2)
          .split("\n")
          .map((line) => `  ${line}`),
        "  ```",
      );
    } else {
      lines.push(`${item} ${renderInlineCode(JSON.stringify(value))}`);
    }
  }

  return lines;
}

export function renderSections(context: SpecContext): readonly string[] {
  const sections = (context.sections ?? {}) as Record<string, unknown>;
  const lines: string[] = [];
  const append = (rendered: readonly string[]): void => {
    if (rendered.length > 0) {
      lines.push("", ...rendered);
    }
  };

  const intent = asRecord(sections.intent);

  if (intent !== undefined) {
    append(renderIntent(intent));
  }

  const behavior = asRecord(sections.behavior);

  if (behavior !== undefined) {
    append(renderBehavior(behavior));
  }

  const constraints = asArray(sections.constraints);

  if (constraints !== undefined && constraints.length > 0) {
    append(renderConstraints(constraints));
  }

  const model = asRecord(sections.model);

  if (model !== undefined) {
    append(renderModel(model));
  }

  const decision = asRecord(sections.decision);

  if (decision !== undefined) {
    append(renderDecision(decision));
  }

  const verification = asRecord(sections.verification);

  if (verification !== undefined) {
    append(renderVerification(verification));
  }

  for (const name of ["design", "ui"]) {
    const bag = asRecord(sections[name]);

    if (bag !== undefined) {
      append(renderOpenBag(name, bag));
    }
  }

  return lines;
}
