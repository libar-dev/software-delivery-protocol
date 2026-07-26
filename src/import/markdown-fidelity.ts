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

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeRelations(data: Record<string, unknown>): Record<string, unknown> {
  if (!isUnknownArray(data.relations)) return { ...data, relations: [] };
  return {
    ...data,
    relations: [...data.relations].sort((left, right) =>
      compareCodeUnits(relationKey(left), relationKey(right)),
    ),
  };
}

function firstDivergentPath(left: unknown, right: unknown, path = ""): string | undefined {
  if (isDeepStrictEqual(left, right)) {
    return undefined;
  }

  if (isUnknownArray(left) && isUnknownArray(right)) {
    const length = Math.max(left.length, right.length);

    for (let index = 0; index < length; index += 1) {
      const divergent = firstDivergentPath(left[index], right[index], `${path}[${String(index)}]`);

      if (divergent !== undefined) {
        return divergent;
      }
    }
  }

  if (isRecord(left) && isRecord(right)) {
    const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort(compareCodeUnits);

    for (const key of keys) {
      const childPath = path.length === 0 ? key : `${path}.${key}`;
      const divergent = firstDivergentPath(left[key], right[key], childPath);

      if (divergent !== undefined) {
        return divergent;
      }
    }
  }

  return path.length === 0 ? "document" : path;
}

export function assertMarkdownEmissionFidelity(reified: ReifiedSpec, document: string): void {
  const result = reifyMarkdownCarrier(document, reified.file.replace(/\.sdp\.ts$/u, ".sdp.md"));
  const emitted = result.specs[0];

  if (result.findings.length > 0 || emitted === undefined) {
    throw new MarkdownEmissionError(
      `first divergent path: document (the emitted Markdown is not accepted by the ruled grammar: ${result.findings[0]?.message ?? "no Spec was reified"})`,
    );
  }

  const divergent = firstDivergentPath(
    normalizeRelations(reified.data),
    normalizeRelations(emitted.data),
  );

  if (divergent !== undefined) {
    throw new MarkdownEmissionError(
      `first divergent path: ${divergent} (the emitted Markdown does not preserve the authored Spec data)`,
    );
  }
}
