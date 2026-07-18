import type { ReifiedSpec } from "../extract/reify.js";

const relationTypes = [
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
  "verifies",
  "supersedes",
] as const;

function isRelationList(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}

function isRelation(value: unknown): value is { readonly type: string; readonly target: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "target" in value &&
    typeof value.type === "string" &&
    typeof value.target === "string"
  );
}

function targetsForRelationType(relations: unknown, type: string): readonly string[] {
  if (!isRelationList(relations)) return [];

  return relations.flatMap((relation) =>
    isRelation(relation) && relation.type === type ? [relation.target] : [],
  );
}

export function emitMarkdownSpec(reified: ReifiedSpec): string {
  const data = reified.data;
  const relationLines = relationTypes.flatMap((type) => {
    const targets = targetsForRelationType(data.relations, type);

    if (targets.length === 0) return [];
    if (targets.length === 1) return targets.map((target) => `  ${type}: ${target}`);
    return [`  ${type}:`, ...targets.map((target) => `    - ${target}`)];
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
  const narrative = data.narrative;

  return typeof narrative === "string" ? `${envelope}\n\n${narrative}\n\n` : `${envelope}\n`;
}
