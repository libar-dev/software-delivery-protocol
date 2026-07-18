import { isDeepStrictEqual } from "node:util";

import { reifyMarkdownCarrier } from "../extract/markdown.js";
import type { ReifiedSpec } from "../extract/reify.js";

export class MarkdownEmissionError extends Error {
  constructor(readonly reason: string) {
    super(reason);
    this.name = "MarkdownEmissionError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}

function relationKey(value: unknown): string {
  return isRecord(value) ? `${String(value.type)}\u0000${String(value.target)}` : "";
}

function normalizeRelations(data: Record<string, unknown>): Record<string, unknown> {
  if (!isUnknownArray(data.relations)) return { ...data, relations: [] };
  return {
    ...data,
    relations: [...data.relations].sort((left, right) =>
      relationKey(left).localeCompare(relationKey(right)),
    ),
  };
}

export function assertMarkdownEmissionFidelity(reified: ReifiedSpec, document: string): void {
  const result = reifyMarkdownCarrier(document, reified.file.replace(/\.sdp\.ts$/u, ".sdp.md"));
  const emitted = result.specs[0];

  if (result.findings.length > 0 || emitted === undefined)
    throw new MarkdownEmissionError("the emitted Markdown is not accepted by the ruled grammar");
  if (!isDeepStrictEqual(normalizeRelations(reified.data), normalizeRelations(emitted.data)))
    throw new MarkdownEmissionError(
      "the emitted Markdown does not preserve the authored Spec data",
    );
}
