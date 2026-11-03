export function replaceEvidenceBlock(
  original: string,
  block: { readonly id: string; readonly file: string; readonly language: string | null },
  generated: string,
): string;

export function summarizeValidation(output: string): string;

export function evidenceMarkers(
  original: string,
  file: string,
): Map<string, { start: number; end: number }>;
export function validateEvidenceMarkers(
  documents: ReadonlyMap<string, string>,
  blocks: readonly { id: string; file: string }[],
): void;
export function parseArguments(args: string[]): {
  check: boolean;
  printPin: boolean;
  source: string | undefined;
};
export function withPinnedSource<T>(
  repository: string,
  commit: string,
  scratchRoot: string,
  action: (source: string) => T,
): T;
export function measurementLabel(commit: string, body: string): string;
export function evidenceBlocks(
  sourceRoot: string,
  pinnedCommit: string,
): { id: string; file: string; language: string | null; generate: () => string }[];
