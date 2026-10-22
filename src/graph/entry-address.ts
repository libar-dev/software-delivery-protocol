import type { PrimitiveNode } from "./schema.js";
import { ENTRY_ADDRESS_SECTIONS, codeAnchorId, componentAnchorId, parseId, ref } from "../ids.js";

import { codeAnchor } from "../model/code-anchor.js";

const entryAddressAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.entry-address-resolution"),
  label: "resolves entry addresses for prose validation and citation readers",
  satisfies: [ref("spec:extraction.entry-citations"), ref("spec:validation.prose-mentions")],
  component: componentAnchorId("component:protocol.graph"),
  role: "reader",
});
void entryAddressAnchor;

export interface EntryResolution {
  readonly entry: string | null;
  readonly resolves: boolean;
  readonly reason: "malformed" | "section" | "entry" | null;
}

const record = (value: unknown): Readonly<Record<string, unknown>> | undefined =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Readonly<Record<string, unknown>>)
    : undefined;

export type AddressResolution = Omit<EntryResolution, "reason"> & {
  readonly reason: EntryResolution["reason"] | "spec";
};

export function resolveEntryAddress(target: PrimitiveNode, address: string): EntryResolution;
export function resolveEntryAddress(
  target: PrimitiveNode | undefined,
  address: string,
): AddressResolution;
export function resolveEntryAddress(
  target: PrimitiveNode | undefined,
  address: string,
): AddressResolution {
  const miss = (reason: AddressResolution["reason"]) => ({
    entry: null,
    resolves: false,
    reason,
  });
  let subpath: string | undefined;
  try {
    subpath = parseId(address).subpath;
  } catch {
    return miss("malformed");
  }
  if (subpath === undefined) return miss("malformed");
  if (target === undefined) return miss("spec");
  if (address.split("#")[0] !== target.id) return miss("malformed");
  const section = subpath.slice(0, subpath.indexOf("."));
  if (!ENTRY_ADDRESS_SECTIONS.some((value) => value === section)) return miss("malformed");
  const key = subpath.slice(section.length + 1);
  const sections = target.sections;
  if (section === "question") {
    const questions = sections?.intent?.openQuestions;
    if (!Array.isArray(questions)) return miss("section");
    const position = questions.findIndex((question) => record(question)?.key === key);
    return position < 0
      ? miss("entry")
      : { entry: `question[${String(position)}]`, resolves: true, reason: null };
  }
  if (section === "rule") {
    const keys = sections?.behavior?.ruleKeys;
    if (keys === undefined) return miss("section");
    const path = Object.hasOwn(keys, key) ? keys[key] : undefined;
    const match = typeof path === "string" ? /^(rules|flows)\[(\d+)\]$/u.exec(path) : null;
    const list = match?.[1];
    const position = match?.[2];
    return list === undefined || position === undefined
      ? miss("entry")
      : {
          entry: `${list === "rules" ? "rule" : "flow"}[${position}]`,
          resolves: true,
          reason: null,
        };
  }
  const content = record(sections)?.[section];
  if (section === "design" || section === "ui") {
    const entries = record(content);
    if (entries === undefined) return miss("section");
    return key === "description" || !Object.hasOwn(entries, key)
      ? miss("entry")
      : { entry: `${section}.${key}`, resolves: true, reason: null };
  }
  if (section !== "term") return miss("malformed");
  // A Model term resolves through its authored name, even without a location row.
  const model = record(sections?.model);
  const keys = record(model?.termKeys);
  if (keys === undefined) return miss("section");
  const term = Object.hasOwn(keys, key) ? keys[key] : undefined;
  const terms = record(model?.terms);
  const position =
    typeof term === "string" && terms !== undefined ? Object.keys(terms).indexOf(term) : -1;
  return position < 0
    ? miss("entry")
    : { entry: `${section}[${String(position)}]`, resolves: true, reason: null };
}
