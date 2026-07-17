import type { Finding } from "../validate/contracts.js";
import { addMarkdownFinding, markdownFinding } from "./markdown-support.js";

export const reservedMarkdownProperties = new Set([
  "implemented",
  "hasVerifier",
  "observed",
  "claim",
  "deliveryFacts",
  "nodeType",
  "specKind",
  "satisfies",
  "verifies",
  "belongsTo",
  "models",
]);

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function structureFinding(file: string, line: number, message: string): Finding {
  return markdownFinding(file, line, message, "extract/invalid-markdown-structure");
}

export function propertyFinding(file: string, line: number, name: string): Finding {
  return markdownFinding(
    file,
    line,
    `property "${name}" is not accepted`,
    reservedMarkdownProperties.has(name)
      ? "extract/reserved-property"
      : "extract/unrecognized-property",
  );
}

export function append(record: Record<string, unknown>, name: string, value: string): void {
  const current = record[name];
  record[name] = isStringArray(current) ? [...current, value] : [value];
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item): item is string => typeof item === "string");
}

export function single(
  record: Record<string, unknown>,
  name: string,
  value: string,
  file: string,
  line: number,
  findings: Finding[],
): void {
  if (record[name] !== undefined)
    addMarkdownFinding(
      findings,
      structureFinding(file, line, `field "${name}" is authored more than once`),
    );
  else record[name] = value;
}

export function keyed(text: string): { readonly key: string; readonly value: string } | undefined {
  const match = /^([A-Za-z][A-Za-z0-9]*): (.+)$/u.exec(text);
  return match?.[1] === undefined || match[2] === undefined
    ? undefined
    : { key: match[1], value: match[2] };
}

export function addDescription(
  record: Record<string, unknown>,
  description: string,
  file: string,
  line: number,
  findings: Finding[],
): void {
  if (description.length === 0) return;
  if (record.description !== undefined)
    addMarkdownFinding(
      findings,
      structureFinding(file, line, "behavior description has more than one owner"),
    );
  else record.description = description;
}
