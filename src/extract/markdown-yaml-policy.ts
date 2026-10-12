import { setOwn } from "./set-own.js";
import { relationOptionsRefusal } from "./authoring-normalization.js";
import { Buffer } from "node:buffer";

import { isAlias, isMap, isScalar, isSeq } from "yaml";
import type { Node } from "yaml";

import { parseId } from "../ids.js";
import type { Finding } from "../validate/contracts.js";
import { addMarkdownFinding, markdownFinding, markdownLine } from "./markdown-support.js";
import { entryAddressSlotReason } from "./reify.js";

const invalidIdFindingId = "extract/invalid-id";

const nonStringPlainScalars =
  /^(?:true|false|null|~|0o[0-7]+|0x[0-9a-f]+|[-+]?[0-9]+|[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+|[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)|[-+]?\.inf|\.nan)$/iu;
const reservedEnvelopeKeys = new Set([
  "implemented",
  "has-verifier",
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
    (node.type !== "PLAIN" || !nonStringPlainScalars.test(node.source ?? ""))
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
  let nodeLimitReported = false;
  let depthLimitReported = false;
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined) break;
    count += 1;
    const line = markdownScalarLine(current.node, source, baseLine);
    if (count > 2_000 && !nodeLimitReported) {
      addMarkdownFinding(
        findings,
        markdownFinding(file, line, "frontmatter exceeds the 2,000 node limit"),
      );
      nodeLimitReported = true;
    }
    if (current.depth > 16 && !depthLimitReported) {
      addMarkdownFinding(
        findings,
        markdownFinding(file, line, "frontmatter exceeds the depth limit of 16"),
      );
      depthLimitReported = true;
    }
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

export function markdownSpecIdList(
  value: unknown,
  field: "specs" | "modelRefs",
  source: string,
  baseLine: number,
  file: string,
  findings: Finding[],
): readonly string[] {
  if (!isSeq(value)) {
    addMarkdownFinding(
      findings,
      markdownFinding(
        file,
        markdownScalarLine(value, source, baseLine),
        `frontmatter field "${field}" must be a YAML list`,
      ),
    );
    return [];
  }

  const ids: string[] = [];
  for (const entry of value.items) {
    const line = markdownScalarLine(entry, source, baseLine);
    if (!isMarkdownStringScalar(entry)) {
      addMarkdownFinding(
        findings,
        markdownFinding(file, line, `${field} entries must be string scalars`),
      );
      continue;
    }
    try {
      const parsed = parseId(entry.value);
      const addressReason = entryAddressSlotReason(entry.value, parsed);
      if (addressReason !== undefined) throw new Error(addressReason);
      if (parsed.namespace !== "spec")
        throw new Error(`${field} entries must use the spec namespace`);
    } catch (error: unknown) {
      addMarkdownFinding(
        findings,
        markdownFinding(
          file,
          line,
          error instanceof Error ? error.message : "invalid id",
          invalidIdFindingId,
        ),
      );
      continue;
    }
    if (ids.includes(entry.value)) {
      addMarkdownFinding(findings, markdownFinding(file, line, `duplicate entry in ${field}`));
      continue;
    }
    ids.push(entry.value);
  }
  return ids;
}

export interface MarkdownRelationTarget {
  readonly target: string;
  readonly reason?: string;
  readonly exercises?: readonly string[];
  readonly line: number;
}

export function markdownRelationTargets(
  value: unknown,
  type: string,
  source: string,
  baseLine: number,
  file: string,
  findings: Finding[],
): readonly MarkdownRelationTarget[] {
  const values = isSeq(value) ? value.items : [value];
  const fail = (node: unknown, message: string, id?: string): void => {
    addMarkdownFinding(
      findings,
      markdownFinding(file, markdownScalarLine(node, source, baseLine), message, id),
    );
  };
  if (values.length === 0) {
    fail(value, "relation values must not be empty");
    return [];
  }
  const targets: MarkdownRelationTarget[] = [];
  for (const entry of values) {
    let targetNode: unknown = entry;
    const options: Record<string, unknown> = {};
    let ok = true;
    if (isMap(entry)) {
      targetNode = undefined;
      const names = new Set<string>();
      for (const pair of entry.items) {
        if (!isMarkdownStringScalar(pair.key) || names.has(pair.key.value)) {
          fail(pair.key, "relation object keys must be unique strings");
          ok = false;
          continue;
        }
        const key = pair.key.value;
        names.add(key);
        if (key === "target") targetNode = pair.value;
        else if (key === "exercises" && isSeq(pair.value)) {
          setOwn(
            options,
            "exercises",
            pair.value.items.map((item) => (isMarkdownStringScalar(item) ? item.value : null)),
          );
        } else if (isMarkdownStringScalar(pair.value)) setOwn(options, key, pair.value.value);
        else {
          fail(pair.value, `relation attribute "${key}" must be a string scalar or exercises list`);
          ok = false;
        }
      }
      const refusal = relationOptionsRefusal(options, type);
      if (refusal !== undefined) {
        fail(entry, refusal);
        ok = false;
      }
    }
    if (!isMarkdownStringScalar(targetNode)) {
      fail(entry, "relation targets must be string scalars or objects with a target");
      continue;
    }
    try {
      const parsed = parseId(targetNode.value);
      const addressReason = entryAddressSlotReason(targetNode.value, parsed);
      if (addressReason !== undefined) {
        fail(targetNode, addressReason, invalidIdFindingId);
        continue;
      }
      if (parsed.namespace !== "spec")
        throw new Error("relation target must use the spec namespace");
      if (targets.some((target) => target.target === targetNode.value))
        throw new Error("duplicate target within one relation type");
      if (ok)
        targets.push({
          target: targetNode.value,
          ...(typeof options.reason === "string" ? { reason: options.reason } : {}),
          ...(Array.isArray(options.exercises) ? { exercises: options.exercises as string[] } : {}),
          line: markdownScalarLine(entry, source, baseLine),
        });
    } catch (error: unknown) {
      fail(targetNode, error instanceof Error ? error.message : "invalid relation target");
    }
  }
  return targets;
}
