export interface ConceptRecord {
  readonly id: string;
  readonly nodeType: "Primitive" | "Pack" | "Anchor" | "CodeNode";
  readonly title?: string;
  readonly label?: string;
  readonly framing?: string;
  readonly narrative?: string;
  readonly sections?: object;
}

export type ConceptMatchField =
  | "id"
  | "title"
  | "label"
  | "framing"
  | "narrative"
  | `sections.${string}`;

export interface ConceptMatch {
  readonly id: string;
  readonly nodeType: ConceptRecord["nodeType"];
  readonly title?: string;
  readonly matchedIn: readonly ConceptMatchField[];
}

function compare(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function contains(value: unknown, needle: string, includeKeys: boolean): boolean {
  if (typeof value === "string") return value.toLowerCase().includes(needle);
  if (Array.isArray(value))
    return value.some((entry: unknown) => contains(entry, needle, includeKeys));
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).some(
      ([key, entry]: [string, unknown]) =>
        (includeKeys && key.toLowerCase().includes(needle)) || contains(entry, needle, includeKeys),
    );
  }
  return false;
}

/**
 * Ranks matches by the first field that matched, then by id using code-unit order.
 *
 * @sdpAnchor impl:protocol.studio-concept-match
 * @sdpSatisfies spec:consumers.spec-studio.search
 * @sdpComponent component:protocol.reader
 * @sdpRole utility
 */
export function matchConcept(
  records: readonly ConceptRecord[],
  term: string,
): readonly ConceptMatch[] {
  const needle = term.toLowerCase().trim();
  if (needle.length === 0) return [];
  const fieldRank: Readonly<Record<string, number>> = {
    id: 0,
    title: 1,
    label: 2,
    framing: 3,
    narrative: 4,
  };
  const matches: { match: ConceptMatch; rank: number }[] = [];
  for (const node of [...records].sort((a, b) => compare(a.id, b.id))) {
    const matchedIn: ConceptMatchField[] = [];
    if (node.id.toLowerCase().includes(needle)) matchedIn.push("id");
    if (node.nodeType === "Primitive" || node.nodeType === "Pack") {
      if (node.title?.toLowerCase().includes(needle)) matchedIn.push("title");
    } else if (node.label?.toLowerCase().includes(needle)) matchedIn.push("label");
    if (node.nodeType === "Pack" && node.framing?.toLowerCase().includes(needle))
      matchedIn.push("framing");
    if (node.nodeType === "Primitive") {
      if (node.narrative?.toLowerCase().includes(needle)) matchedIn.push("narrative");
      for (const [name, content] of Object.entries(node.sections ?? {}).sort(([a], [b]) =>
        compare(a, b),
      )) {
        if (contains(content, needle, name === "model")) matchedIn.push(`sections.${name}`);
      }
    }
    if (matchedIn.length === 0) continue;
    matches.push({
      match: {
        id: node.id,
        nodeType: node.nodeType,
        ...((node.nodeType === "Primitive" || node.nodeType === "Pack") && node.title !== undefined
          ? { title: node.title }
          : {}),
        matchedIn,
      },
      rank: Math.min(...matchedIn.map((field) => fieldRank[field] ?? 4)),
    });
  }
  return matches
    .sort((a, b) => a.rank - b.rank || compare(a.match.id, b.match.id))
    .map(({ match }) => match);
}
