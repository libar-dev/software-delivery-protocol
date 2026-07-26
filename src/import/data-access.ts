export type ImportData = Record<string, unknown>;

export function isImportData(value: unknown): value is ImportData {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function importData(value: unknown): ImportData | undefined {
  return isImportData(value) ? value : undefined;
}

export function importText(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function importTexts(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    const text = importText(entry);
    return text === undefined ? [] : [text];
  });
}

function isRelation(value: unknown): value is { readonly type: string; readonly target: string } {
  const candidate = importData(value);
  return (
    candidate !== undefined &&
    importText(candidate.type) !== undefined &&
    importText(candidate.target) !== undefined
  );
}

export function targetsForRelationType(relations: unknown, type: string): readonly string[] {
  if (!Array.isArray(relations)) {
    return [];
  }

  return relations.flatMap((relation) =>
    isRelation(relation) && relation.type === type ? [relation.target] : [],
  );
}
