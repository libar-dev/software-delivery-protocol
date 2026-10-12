import type { FileReification, ReifiedSpec } from "./reify.js";
import { setOwn } from "./set-own.js";
import type { Finding } from "../validate/contracts.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";

const normalizationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.authoring-normalization"),
  label: "normalizes rule markers and question fields after carrier reification",
  satisfies: [
    ref("spec:model.rule-keys"),
    ref("spec:model.open-question-fields"),
    ref("spec:model.relation-reasons"),
  ],
  component: componentAnchorId("component:protocol.extract"),
  role: "codec",
});
void normalizationAnchor;

export const entryKeyPattern = /^[a-z][A-Za-z0-9]*$/u;
export const questionFields = ["decider", "links", "provisional", "trigger"] as const;

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function oneLine(value: unknown): value is string {
  return (
    typeof value === "string" && value.trim().length > 0 && !/[\r\n\u0085\u2028\u2029]/u.test(value)
  );
}

/** Closed options shared by the TypeScript and Markdown relation envelopes. */
export function relationOptionsRefusal(value: unknown, type: string): string | undefined {
  if (!record(value)) return "relation options must be a fresh object";
  for (const key of Object.keys(value)) {
    if (key !== "reason" && !(key === "exercises" && type === "verifies")) {
      return `relation attribute "${key}" is not accepted on ${type}`;
    }
  }
  if (Object.hasOwn(value, "reason") && !oneLine(value.reason)) {
    return "relation reason must be one nonempty line";
  }
  if (Object.hasOwn(value, "exercises")) {
    const keys: unknown = value.exercises;
    if (
      !Array.isArray(keys) ||
      keys.length === 0 ||
      keys.some((key: unknown) => typeof key !== "string" || !entryKeyPattern.test(key))
    ) {
      return "exercises must be a nonempty list of lower-camel ASCII keys";
    }
    if (new Set(keys).size !== keys.length) return "exercises must not repeat a key";
  }
  return undefined;
}

function error(spec: ReifiedSpec, path: string, message: string, findings: Finding[]): void {
  const locationEntry = path
    .replace(/^behavior\.(rules|flows)/u, (_, field: string) =>
      field === "rules" ? "rule" : "flow",
    )
    .replace(/^intent\.openQuestions/u, "question");
  findings.push({
    validatorId: "extract/unrecognized-property",
    family: "conformance",
    severity: "error",
    message,
    subjectId: spec.id,
    path,
    file: spec.file,
    line: spec.entryLines?.find((row) => row.entry === locationEntry)?.line ?? spec.line,
  });
}

function normalizeRules(spec: ReifiedSpec, findings: Finding[]): void {
  const behavior = spec.data.behavior;
  if (!record(behavior)) return;
  const entries: { field: "rules" | "flows"; index: number; text: string; line?: number }[] = [];
  for (const field of Object.keys(behavior)) {
    const values: unknown = behavior[field];
    if ((field !== "rules" && field !== "flows") || !Array.isArray(values)) continue;
    values.forEach((text: unknown, index) => {
      if (typeof text === "string")
        entries.push({
          field,
          index,
          text,
          line: spec.entryLines?.find(
            (row) => row.entry === `${field === "rules" ? "rule" : "flow"}[${String(index)}]`,
          )?.line,
        });
    });
  }
  // Physical entry lines preserve a Markdown owner's interleaved rules and flows. With any line
  // missing there is no physical order to recover, so the collection order stands.
  if (entries.every((entry) => entry.line !== undefined))
    entries.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
  const sites = new Map<string, string[]>();
  const keys: Record<string, string> = {};
  for (const { field, index, text } of entries) {
    if (!text.startsWith("[#")) continue;
    const path = `behavior.${field}[${String(index)}]`;
    const match = /^\[#([a-z][A-Za-z0-9]*)\] ([^\s][\s\S]*)$/u.exec(text);
    if (match?.[1] === undefined || match[2] === undefined) {
      error(
        spec,
        path,
        "rule key markers must be [#<lower-camel ASCII key>] followed by one space and text",
        findings,
      );
      continue;
    }
    const values = behavior[field] as string[];
    values[index] = match[2];
    const key = match[1];
    const paths = sites.get(key) ?? [];
    paths.push(path);
    sites.set(key, paths);
    setOwn(keys, key, `${field}[${String(index)}]`);
  }
  for (const [key, paths] of sites) {
    if (paths.length < 2) continue;
    Reflect.deleteProperty(keys, key);
    for (const path of paths)
      error(
        spec,
        path,
        `rule key "${key}" is repeated; rule keys must be unique within a Spec`,
        findings,
      );
  }
  if (Object.keys(keys).length > 0) behavior.ruleKeys = keys;
}

function normalizeQuestions(spec: ReifiedSpec, findings: Finding[]): void {
  const intent = spec.data.intent;
  if (!record(intent) || !Array.isArray(intent.openQuestions)) return;
  intent.openQuestions.forEach((question: unknown, index) => {
    if (!record(question)) return;
    for (const field of questionFields) {
      if (!Object.hasOwn(question, field)) continue;
      const value = question[field];
      let refusal: string | undefined;
      if (field === "links") {
        if (
          !Array.isArray(value) ||
          value.length === 0 ||
          value.some((link: unknown) => !oneLine(link))
        ) {
          refusal = "question links must be a nonempty list of strings";
        } else if (new Set(value).size !== value.length)
          refusal = "question links must not repeat a target";
      } else if (!oneLine(value)) refusal = `question ${field} must be one nonempty line`;
      else if (field === "decider" && !/^[a-z][a-z0-9-]*$/u.test(value))
        refusal = "question decider must be a lowercase kebab token";
      else if (field === "trigger" && question.blocking !== true)
        refusal = "a question trigger requires a blocking question";
      if (refusal !== undefined) {
        error(spec, `intent.openQuestions[${String(index)}].${field}`, refusal, findings);
        Reflect.deleteProperty(question, field);
      }
    }
  });
}

/** Each carrier calls this once after mapping its physical syntax to the common Spec shape. */
export function normalizeAuthoring(
  result: FileReification,
  refuseWholeFile = false,
): FileReification {
  const findings = [...result.findings];
  for (const spec of result.specs) {
    normalizeRules(spec, findings);
    normalizeQuestions(spec, findings);
  }
  return {
    ...result,
    specs: refuseWholeFile && findings.some((row) => row.severity === "error") ? [] : result.specs,
    findings,
  };
}
