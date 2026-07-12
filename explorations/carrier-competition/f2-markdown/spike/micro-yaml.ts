import { SPEC_RELATION_TYPES } from "@libar-dev/software-delivery-protocol";

const relationTypes = new Set<string>(SPEC_RELATION_TYPES);

export interface ParsedFrontmatter {
  readonly envelope: Record<string, unknown>;
  readonly body: string;
  readonly bodyStartLine: number;
}

/**
 * Deliberately tiny frontmatter subset for this evidence spike: flat scalar envelope fields and
 * one two-space-indented relations map. It is not a product parser, emits no recovery findings,
 * and throws on anything outside the subset so the exhibit cannot silently accept more grammar
 * than it demonstrates. No YAML dependency is added for an exploration.
 */
export function parseFrontmatter(text: string): ParsedFrontmatter {
  const lines = text.replaceAll("\r\n", "\n").split("\n");

  if (lines[0] !== "---") {
    throw new Error("outside the frontmatter subset: document must start with ---");
  }

  const close = lines.indexOf("---", 1);

  if (close === -1) {
    throw new Error("outside the frontmatter subset: closing --- is missing");
  }

  const envelope: Record<string, unknown> = {};
  const relations: Record<string, string> = {};
  let inRelations = false;
  let relationsSeen = false;

  for (const [offset, line] of lines.slice(1, close).entries()) {
    const lineNumber = offset + 2;

    if (line.trim().length === 0 || line.trimStart().startsWith("#")) {
      continue;
    }

    if (line === "relations:") {
      if (relationsSeen) {
        throw new Error(
          `outside the frontmatter subset at line ${String(lineNumber)}: duplicate "relations" key`,
        );
      }

      relationsSeen = true;
      inRelations = true;
      continue;
    }

    if (line.startsWith("  ")) {
      if (!inRelations) {
        throw new Error(
          `outside the frontmatter subset at line ${String(lineNumber)}: nesting is only supported below relations`,
        );
      }

      const match = /^  ([A-Za-z]+):\s*(\S.*)$/u.exec(line);

      if (match === null || !relationTypes.has(match[1] ?? "")) {
        throw new Error(
          `outside the frontmatter subset at line ${String(lineNumber)}: relation must use a ratified relation type`,
        );
      }

      const type = match[1] ?? "";

      // A repeated type must refuse, never last-wins: silently dropping a declared relation
      // would lose graph edges. One target per type is the spike subset; the YAML list form is
      // a named note (README), not built — a product parser would emit an extract/* finding.
      if (type in relations) {
        throw new Error(
          `outside the frontmatter subset at line ${String(lineNumber)}: duplicate relation type "${type}" — one target per type; the list form is a named note, not part of the spike`,
        );
      }

      relations[type] = match[2] ?? "";
      continue;
    }

    inRelations = false;
    const match = /^([A-Za-z]+):\s*(\S.*)$/u.exec(line);

    if (match === null || !["id", "kind", "altitude", "readiness"].includes(match[1] ?? "")) {
      throw new Error(
        `outside the frontmatter subset at line ${String(lineNumber)}: expected a scalar envelope field`,
      );
    }

    const field = match[1] ?? "";

    if (field in envelope) {
      throw new Error(
        `outside the frontmatter subset at line ${String(lineNumber)}: duplicate envelope field "${field}"`,
      );
    }

    envelope[field] = match[2] ?? "";
  }

  envelope.relations = Object.entries(relations).map(([type, target]) => ({
    type,
    target,
    claim: "declared",
  }));

  return {
    envelope,
    body: lines.slice(close + 1).join("\n"),
    bodyStartLine: close + 2,
  };
}
