import { readFileSync } from "node:fs";
import { posix, win32 } from "node:path";
import type { RulesInput } from "./build-args.js";
import { BodyParseError, evaluateBody } from "../reader/evaluate-body.js";
import { mergeParams } from "./params.js";
import { errorMessage, oneLine } from "./output.js";
import type { GraphSchema } from "../graph/schema.js";
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
function rootRelativeFile(value: unknown): value is string {
  if (
    !nonempty(value) ||
    value.includes("\\") ||
    posix.isAbsolute(value) ||
    win32.isAbsolute(value)
  )
    return false;
  const normalized = posix.normalize(value);
  return normalized !== ".." && !normalized.startsWith("../");
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
  if (row.file !== undefined && !rootRelativeFile(row.file)) return "file";
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
/**
 * @sdpAnchor impl:protocol.corpus-rule-runner
 * @sdpLabel runs selected corpus rules and separates their failures
 * @sdpSatisfies spec:validation.corpus-rules
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */
export async function runCorpusRules(
  graph: GraphSchema,
  report: ValidationReport,
  files: readonly RulesInput[],
): Promise<CorpusValidationReport> {
  const corpusFindings: CorpusFinding[] = [];
  const corpusFailures: { rulesFile: string; reason: string }[] = [];
  for (const file of files) {
    const { rulesFile } = file;
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
    let params = file.params;
    if (file.rereadParams === true) {
      let diagnostic = "";
      const reread = mergeParams(
        file.paramForms ?? [],
        {
          stderr: {
            write(text) {
              diagnostic += text;
            },
          },
        },
        "validate",
      );
      if (reread === undefined) {
        corpusFailures.push({
          rulesFile,
          reason: `its parameters cannot be read (${oneLine(diagnostic)
            .replace(/^sdp validate: /u, "")
            .replace(/\.$/u, "")})`,
        });
        continue;
      }
      params = reread;
    }
    try {
      const answer = await evaluateBody(source, {
        graph: structuredClone(graph),
        report: structuredClone(report),
        params: structuredClone(params),
      });
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
      corpusFailures.push({
        rulesFile,
        reason:
          error instanceof BodyParseError
            ? error.message.replace(/^the body /u, "")
            : `threw: ${oneLine(errorMessage(error))}`,
      });
    }
  }
  return { ...report, corpusFindings, corpusFailures };
}
