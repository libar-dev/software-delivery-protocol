import { hasUnboundSlot, parseSlots } from "@libar-dev/software-delivery-protocol";

import { parseGrammar } from "./grammar-parse.js";

export interface ExpandedDocument {
  readonly point: string;
  readonly filename: string;
  readonly content: string;
}

function cells(line: string): readonly string[] {
  return line
    .trim()
    .replace(/^\|/u, "")
    .replace(/\|$/u, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparator(cellsInRow: readonly string[]): boolean {
  return cellsInRow.every((cell) => /^:?-+:?$/u.test(cell));
}

export function expandTable(text: string, path = "table.sdp"): readonly ExpandedDocument[] {
  const parsed = parseGrammar(text, path);
  const lines = parsed.cases;
  if (lines === undefined) throw new Error("cases host requires one cases block");

  const separator = lines.findIndex((line) => line.trim().length === 0);
  if (separator === -1) {
    throw new Error("cases requires a blank line between template steps and its table");
  }

  const templates = lines
    .slice(0, separator)
    .filter((line) => line.trim().length > 0)
    .map((line) => line.slice(2));
  const table = lines.slice(separator + 1).filter((line) => line.trim().length > 0);
  const headers = cells(table[0] ?? "");
  const separatorCells = cells(table[1] ?? "");

  if (
    headers[0] !== "point" ||
    table.length < 3 ||
    separatorCells.length !== headers.length ||
    !isSeparator(separatorCells)
  ) {
    throw new Error("cases requires a point column, a valid separator row, and at least one point");
  }
  if (new Set(headers).size !== headers.length) {
    throw new Error("cases headers must be unique");
  }

  const declaredSlots = new Set<string>();
  for (const line of templates) {
    for (const slot of parseSlots(line)) {
      if (slot.form !== "bare" || !hasUnboundSlot(line)) {
        throw new Error("cases template slots must be unbound {slot} forms");
      }
      declaredSlots.add(slot.name);
    }
  }
  if (
    headers.slice(1).some((header) => !declaredSlots.has(header)) ||
    [...declaredSlots].some((slot) => !headers.includes(slot))
  ) {
    throw new Error("cases headers must name every template slot exactly once");
  }

  const seenPoints = new Set<string>();
  return table.slice(2).map((row) => {
    const values = cells(row);
    if (values.length !== headers.length) {
      throw new Error(`cases row has ${String(values.length)} cells; expected ${String(headers.length)}`);
    }
    const point = values[0] ?? "";
    if (!/^[a-z0-9][a-z0-9-]*$/u.test(point)) {
      throw new Error(`cases point ${JSON.stringify(point)} is not a stable id segment`);
    }
    if (seenPoints.has(point)) throw new Error(`duplicate cases point ${JSON.stringify(point)}`);
    seenPoints.add(point);

    const bindings = new Map(
      headers.slice(1).map((header, index) => [header, values[index + 1] ?? ""]),
    );
    if ([...bindings.values()].some((value) => value.length === 0)) {
      throw new Error(`cases point ${JSON.stringify(point)} has an empty binding`);
    }
    const steps = templates.map((line) =>
      line.replace(/\{([A-Za-z][A-Za-z0-9_-]*)\}/gu, (_whole, name: string) =>
        `{${name}: ${bindings.get(name) ?? ""}}`,
      ),
    );
    const childId = `${parsed.id.slice("spec:".length)}.${point}`;
    return {
      point,
      filename: `${childId}.sdp`,
      content: `# GENERATED from ${path}; never hand-edit.\nspec ${childId}\n  example · story · defined\n  refines ${parsed.id.slice("spec:".length)}\n\n${parsed.title}: ${point}\n\n  intent\n    outcome: Show the ${point} point in the order-total example space.\n    value: The cases block expands to one bound point per example.\n\n${steps.join("\n")}\n`,
    };
  });
}
