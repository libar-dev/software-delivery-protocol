import { readFileSync } from "node:fs";
import type { RulesInput } from "./build-args.js";
import { compileBody } from "./q-command.js";
import { errorMessage, oneLine } from "./output.js";
import type { GraphSchema } from "../graph/schema.js";
import { createReader } from "../reader/reader.js";
import type {
  CorpusFinding,
  CorpusValidationReport,
  ValidationReport,
} from "../validate/contracts.js";
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function nonempty(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}
function checkFinding(value: unknown): string | undefined {
  const row = object(value) ? value : {};
  if (typeof row.validatorId !== "string" || !/^[a-z][a-z0-9-]*$/u.test(row.validatorId))
    return "validatorId";
  if (!nonempty(row.subjectId)) return "subjectId";
  if (row.severity !== "error" && row.severity !== "warning") return "severity";
  if (!nonempty(row.message)) return "message";
  for (const field of ["relatedId", "path"])
    if (row[field] !== undefined && typeof row[field] !== "string") return field;
  if (row.file !== undefined && !nonempty(row.file)) return "file";
  if (
    row.line !== undefined &&
    (typeof row.line !== "number" ||
      !Number.isInteger(row.line) ||
      row.line < 1 ||
      row.file === undefined)
  )
    return "line";
  return undefined;
}
function copyFinding(value: Record<string, unknown>, rulesFile: string): CorpusFinding {
  return {
    rulesFile,
    validatorId: value.validatorId as string,
    subjectId: value.subjectId as string,
    severity: value.severity as CorpusFinding["severity"],
    message: value.message as string,
    ...Object.fromEntries(
      ["relatedId", "path", "file", "line"]
        .filter((key) => value[key] !== undefined)
        .map((key) => [key, value[key]]),
    ),
  };
}

/** Runs each operator-selected body against independent copies and commits only a lawful answer. */
export async function runCorpusRules(
  graph: GraphSchema,
  report: ValidationReport,
  files: readonly RulesInput[],
): Promise<CorpusValidationReport> {
  const corpusFindings: CorpusFinding[] = [];
  const corpusFailures: { rulesFile: string; reason: string }[] = [];
  for (const { rulesFile, params } of files) {
    let source: string;
    try {
      source = readFileSync(rulesFile, "utf8");
    } catch (error) {
      corpusFailures.push({
        rulesFile,
        reason: `cannot be read (${oneLine(errorMessage(error))})`,
      });
      continue;
    }
    let body: ReturnType<typeof compileBody>;
    try {
      body = compileBody(source);
    } catch (error) {
      corpusFailures.push({
        rulesFile,
        reason: oneLine(errorMessage(error)).replace(/^the body /u, ""),
      });
      continue;
    }
    try {
      const cloned = structuredClone(graph);
      const answer: unknown = await body(
        createReader(cloned),
        cloned,
        structuredClone(report),
        structuredClone(params),
      );
      if (!object(answer) || !Array.isArray(answer.findings)) {
        let reason = "returned no findings array";
        if (object(answer) && Object.hasOwn(answer, "diagnostics"))
          reason += `; diagnostics: ${JSON.stringify(answer.diagnostics)}`;
        else if (object(answer) && Object.hasOwn(answer, "unknownParams"))
          reason += `; unknownParams: ${JSON.stringify(answer.unknownParams)}; accepts: ${JSON.stringify(answer.accepts)}`;
        corpusFailures.push({ rulesFile, reason });
        continue;
      }
      const findings: CorpusFinding[] = [];
      let failure: string | undefined;
      for (const [index, value] of (answer.findings as unknown[]).entries()) {
        const field = checkFinding(value);
        if (field !== undefined) {
          failure = `finding ${String(index + 1)} has no lawful ${field}`;
          break;
        }
        findings.push(copyFinding(value as Record<string, unknown>, rulesFile));
      }
      if (failure === undefined) corpusFindings.push(...findings);
      else corpusFailures.push({ rulesFile, reason: failure });
    } catch (error) {
      corpusFailures.push({ rulesFile, reason: `threw: ${oneLine(errorMessage(error))}` });
    }
  }
  return { ...report, corpusFindings, corpusFailures };
}
