import { Buffer } from "node:buffer";

import { isAlias, isMap, isScalar, isSeq } from "yaml";
import type { Node } from "yaml";

import { parseId } from "../ids.js";
import type { Finding } from "../validate/contracts.js";
import { addMarkdownFinding, markdownFinding, markdownLine } from "./markdown-support.js";

const nonStringPlainScalars = /^(?:[-+]?\d+(?:\.\d+)?|\.inf|\.nan|true|false|null|~)$/iu;
const reservedEnvelopeKeys = new Set([
  "claim",
  "deliveryFacts",
  "nodeType",
  "specKind",
  "satisfies",
  "verifies",
  "belongsTo",
  "models",
]);

export function isReservedEnvelopeKey(value: string): boolean {
  return reservedEnvelopeKeys.has(value);
}

function isNode(value: unknown): value is Node {
  return isAlias(value) || isMap(value) || isScalar(value) || isSeq(value);
}

export function markdownScalarLine(node: unknown, source: string, baseLine: number): number {
  return markdownLine(source, isNode(node) ? (node.range?.[0] ?? 0) : 0, baseLine);
}

export function isMarkdownStringScalar(
  node: unknown,
): node is Node & { readonly value: string; readonly source?: string } {
  return (
    isScalar(node) &&
    typeof node.value === "string" &&
    !nonStringPlainScalars.test(node.source ?? "")
  );
}

export function inspectMarkdownNodes(
  root: Node,
  source: string,
  baseLine: number,
  file: string,
  findings: Finding[],
): void {
  const pending: { readonly node: Node; readonly depth: number }[] = [{ node: root, depth: 1 }];
  let count = 0;
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined) break;
    count += 1;
    const line = markdownScalarLine(current.node, source, baseLine);
    if (count > 2_000)
      addMarkdownFinding(
        findings,
        markdownFinding(file, line, "frontmatter exceeds the 2,000 node limit"),
      );
    if (current.depth > 16)
      addMarkdownFinding(
        findings,
        markdownFinding(file, line, "frontmatter exceeds the depth limit of 16"),
      );
    if (isAlias(current.node))
      addMarkdownFinding(findings, markdownFinding(file, line, "YAML aliases are not accepted"));
    if (current.node.tag !== undefined)
      addMarkdownFinding(findings, markdownFinding(file, line, "YAML tags are not accepted"));
    if ("anchor" in current.node && typeof current.node.anchor === "string")
      addMarkdownFinding(findings, markdownFinding(file, line, "YAML anchors are not accepted"));
    if (
      isScalar(current.node) &&
      Buffer.byteLength(current.node.source ?? String(current.node.value), "utf8") > 16 * 1024
    )
      addMarkdownFinding(
        findings,
        markdownFinding(file, line, "scalar exceeds the 16 KiB byte limit"),
      );
    if (isMap(current.node))
      for (let index = current.node.items.length - 1; index >= 0; index -= 1) {
        const pair = current.node.items[index];
        if (pair !== undefined) {
          if (isNode(pair.key)) pending.push({ node: pair.key, depth: current.depth + 1 });
          if (isNode(pair.value)) pending.push({ node: pair.value, depth: current.depth + 1 });
        }
      }
    if (isSeq(current.node))
      for (let index = current.node.items.length - 1; index >= 0; index -= 1) {
        const item = current.node.items[index];
        if (isNode(item)) pending.push({ node: item, depth: current.depth + 1 });
      }
  }
}

export function markdownRelationTargets(
  value: unknown,
  source: string,
  baseLine: number,
  file: string,
  findings: Finding[],
): readonly string[] {
  const values = isSeq(value) ? value.items : [value];
  if (values.length === 0) {
    addMarkdownFinding(
      findings,
      markdownFinding(
        file,
        markdownScalarLine(value, source, baseLine),
        "relation values must not be empty",
      ),
    );
    return [];
  }
  const targets: string[] = [];
  for (const target of values) {
    if (!isMarkdownStringScalar(target)) {
      addMarkdownFinding(
        findings,
        markdownFinding(
          file,
          markdownScalarLine(target, source, baseLine),
          "relation targets must be string scalars",
        ),
      );
      continue;
    }
    try {
      if (parseId(target.value).namespace !== "spec")
        throw new Error("relation target must use the spec namespace");
      if (targets.includes(target.value))
        throw new Error("duplicate target within one relation type");
      targets.push(target.value);
    } catch (error: unknown) {
      addMarkdownFinding(
        findings,
        markdownFinding(
          file,
          markdownScalarLine(target, source, baseLine),
          error instanceof Error ? error.message : "invalid relation target",
        ),
      );
    }
  }
  return targets;
}
