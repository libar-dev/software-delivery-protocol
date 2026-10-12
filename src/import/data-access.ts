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
