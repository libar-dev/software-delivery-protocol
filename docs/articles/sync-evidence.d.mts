export function replaceEvidenceBlock(
  original: string,
  block: { readonly id: string; readonly file: string; readonly language: string | null },
  generated: string,
): string;

export function summarizeValidation(output: string): string;
