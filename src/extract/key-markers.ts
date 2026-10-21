import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { stepSkeleton } from "../notation/slots.js";
import type { Finding } from "../validate/contracts.js";
import type { ReifiedSpec } from "./reify.js";
import { setOwn } from "./set-own.js";

/** Only a leading [# opens carrier syntax. Other brackets remain ordinary text. */
export function parseKeyMarker(text: string): { text: string; key?: string; malformed?: true } {
  if (!text.startsWith("[#")) return { text };
  const match = /^\[#([a-z][A-Za-z0-9]*)\] (\S[\s\S]*)$/u.exec(text);
  return match?.[1] === undefined || match[2] === undefined
    ? { text, malformed: true }
    : { text: match[2], key: match[1] };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

interface Site {
  readonly key: string;
  readonly target: string;
  readonly path: string;
}

function refusal(spec: ReifiedSpec, path: string, message: string, findings: Finding[]): void {
  const terms =
    record(spec.data.model) && record(spec.data.model.terms)
      ? Object.keys(spec.data.model.terms)
      : [];
  const location = path.startsWith("model.terms.")
    ? `term[${String(terms.indexOf(path.slice("model.terms.".length)))}]`
    : path;
  findings.push({
    validatorId: "extract/unrecognized-property",
    family: "conformance",
    severity: "error",
    subjectId: spec.id,
    file: spec.file,
    path,
    message,
    line: spec.entryLines?.find((row) => row.entry === location)?.line ?? spec.line,
  });
}

function normalizeSteps(spec: ReifiedSpec, findings: Finding[]): void {
  const behavior = spec.data.behavior;
  if (!record(behavior)) return;
  const sites: Site[] = [];
  const visit = (entry: unknown, path: string): void => {
    if (!record(entry)) return;
    for (const phase of ["given", "when", "then"]) {
      const values: unknown = entry[phase];
      if (!Array.isArray(values)) continue;
      values.forEach((value: unknown, index) => {
        if (typeof value !== "string") return;
        const parsed = parseKeyMarker(value);
        const stepPath = `${path}.${phase}[${String(index)}]`;
        if (parsed.malformed) {
          refusal(
            spec,
            stepPath,
            "step key markers must be [#<lower-camel ASCII key>] followed by one space and text",
            findings,
          );
        } else if (parsed.key !== undefined) {
          values[index] = parsed.text;
          sites.push({ key: parsed.key, target: stepSkeleton(parsed.text), path: stepPath });
        }
      });
    }
  };
  visit(behavior.exampleSpace, "behavior.exampleSpace");
  if (Array.isArray(behavior.examples))
    behavior.examples.forEach((entry: unknown, index) => {
      visit(entry, `behavior.examples[${String(index)}]`);
    });
  const keys: Record<string, string> = {};
  for (const site of sites) {
    const twoSteps = sites.some((other) => other.key === site.key && other.target !== site.target);
    const twoKeys = sites.some((other) => other.target === site.target && other.key !== site.key);
    if (twoSteps)
      refusal(
        spec,
        site.path,
        `step key "${site.key}" names two steps; a step key names one step within a Spec`,
        findings,
      );
    if (twoKeys)
      refusal(
        spec,
        site.path,
        `step "${site.target}" carries two step keys; a step carries one key within a Spec`,
        findings,
      );
    if (!twoSteps && !twoKeys) setOwn(keys, site.key, site.target);
  }
  if (Object.keys(keys).length > 0) behavior.stepKeys = keys;
}

function normalizeTerms(spec: ReifiedSpec, findings: Finding[]): void {
  const model = spec.data.model;
  if (!record(model) || !record(model.terms)) return;
  const sites: Site[] = [];
  for (const [term, value] of Object.entries(model.terms)) {
    if (typeof value !== "string") continue;
    const parsed = parseKeyMarker(value);
    const path = `model.terms.${term}`;
    if (parsed.malformed)
      refusal(
        spec,
        path,
        "term key markers must be [#<lower-camel ASCII key>] followed by one space and text",
        findings,
      );
    else if (parsed.key !== undefined) {
      setOwn(model.terms, term, parsed.text);
      sites.push({ key: parsed.key, target: term, path });
    }
  }
  const keys: Record<string, string> = {};
  for (const site of sites) {
    if (sites.some((other) => other.key === site.key && other.target !== site.target))
      refusal(
        spec,
        site.path,
        `term key "${site.key}" is repeated; term keys must be unique within a Spec`,
        findings,
      );
    else setOwn(keys, site.key, site.target);
  }
  if (Object.keys(keys).length > 0) model.termKeys = keys;
}

const keyedContentAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.key-markers"),
  label: "normalizes step and term markers across the three carriers",
  satisfies: [ref("spec:carrier.step-keys"), ref("spec:model.term-addresses")],
  component: componentAnchorId("component:protocol.extract"),
  role: "codec",
});
void keyedContentAnchor;

export function normalizeKeyedContent(spec: ReifiedSpec, findings: Finding[]): void {
  normalizeSteps(spec, findings);
  normalizeTerms(spec, findings);
}
