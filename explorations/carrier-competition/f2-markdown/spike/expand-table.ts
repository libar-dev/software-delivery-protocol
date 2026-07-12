import { hasUnboundSlot, parseSlots } from "@libar-dev/software-delivery-protocol";

import { parseFrontmatter } from "./micro-yaml.js";

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

export function expandTable(text: string): readonly ExpandedDocument[] {
  const parsed = parseFrontmatter(text);
  const id = parsed.envelope.id;
  const altitude = parsed.envelope.altitude;
  const title = /^# (.+)$/mu.exec(parsed.body)?.[1];
  const fence = /```gwt-table\n([\s\S]*?)\n```/u.exec(parsed.body)?.[1];

  if (typeof id !== "string" || typeof altitude !== "string" || title === undefined || fence === undefined) {
    throw new Error("gwt-table host requires id, altitude, H1 title, and one gwt-table fence");
  }

  const lines = fence.split("\n");
  const separator = lines.indexOf("");

  if (separator === -1) {
    throw new Error("gwt-table requires a blank line between template steps and its table");
  }

  const templates = lines.slice(0, separator);
  const table = lines.slice(separator + 1).filter((line) => line.trim().length > 0);
  const headers = cells(table[0] ?? "");

  if (headers[0] !== "point" || table.length < 3) {
    throw new Error("gwt-table requires a point column, separator row, and at least one point");
  }

  const declaredSlots = new Set(
    templates.flatMap((line) =>
      parseSlots(line).map((slot) => {
        if (slot.form !== "bare" || !hasUnboundSlot(line)) {
          throw new Error("gwt-table template slots must be unbound {slot} forms");
        }

        return slot.name;
      }),
    ),
  );

  if (
    headers.slice(1).some((header) => !declaredSlots.has(header)) ||
    [...declaredSlots].some((slot) => !headers.includes(slot))
  ) {
    throw new Error("gwt-table headers must name every template slot exactly once");
  }

  return table.slice(2).map((row) => {
    const values = cells(row);
    const point = values[0] ?? "";
    const bindings = new Map(headers.slice(1).map((header, index) => [header, values[index + 1] ?? ""]));
    const steps = templates.map((line) =>
      line.replace(/\{([A-Za-z][A-Za-z0-9_-]*)\}/gu, (_whole, name: string) =>
        `{${name}: ${bindings.get(name) ?? ""}}`,
      ),
    );
    const childId = `${id}.${point}`;

    return {
      point,
      filename: `${childId.slice("spec:".length)}.sdp.md`,
      content: `---\nid: ${childId}\nkind: example\naltitude: ${altitude}\nreadiness: defined\nrelations:\n  refines: ${id}\n---\n# ${title}: ${point}\n\n## Intent\n\n- outcome: Show the ${point} point in the order-total example space.\n- value: The table expands to one bound point per example.\n\n\`\`\`gwt\n${steps.join("\n")}\n\`\`\`\n`,
    };
  });
}
