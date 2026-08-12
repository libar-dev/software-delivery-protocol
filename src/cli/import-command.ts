import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { importFindingIds, importTypeScriptSpec } from "../index.js";
import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { Finding } from "../validate/contracts.js";
import { publishImports } from "./import-publish.js";
import type { ImportPublicationHooks, PlannedImport } from "./import-publish.js";
import { scanImportPaths } from "./import-scan.js";
import type { ImportScanHooks } from "./import-scan.js";
import type { CliOutput } from "./output.js";
import { errorMessage, formatFinding, writeStderr, writeStdout } from "./output.js";

export interface ImportHooks extends ImportPublicationHooks, ImportScanHooks {
  readonly readFileSync?: typeof readFileSync;
  readonly existsSync?: typeof existsSync;
  readonly importTypeScriptSpec?: typeof importTypeScriptSpec;
}

export interface ImportArgs {
  readonly paths: readonly string[];
  readonly dryRun: boolean;
}

export function parseImportArgs(
  args: readonly string[],
  output: CliOutput,
): ImportArgs | undefined {
  const paths: string[] = [];
  let dryRun = false;
  let operandsOnly = false;

  for (const argument of args) {
    if (!operandsOnly && argument === "--") {
      operandsOnly = true;
      continue;
    }

    if (!operandsOnly && argument === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (!operandsOnly && argument.startsWith("--")) {
      writeStderr(output, `sdp import: unknown option ${argument}\n`);
      return undefined;
    }

    paths.push(resolve(process.cwd(), argument));
  }

  if (paths.length === 0) {
    writeStderr(output, "sdp import: requires at least one path.\n");
    return undefined;
  }

  return { paths, dryRun };
}

function targetExistsFinding(targetPath: string): Finding {
  return {
    validatorId: importFindingIds.targetExists,
    family: "conformance",
    severity: "error",
    message: "the Markdown target already exists and will not be overwritten",
    file: targetPath,
  };
}

const sdpImportAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.sdp-import"),
  label: "plans, refuses, and publishes TypeScript-to-Markdown Spec imports",
  satisfies: ref("spec:carrier.sdp-import"),
});
void sdpImportAnchor;

export function runImport(parsed: ImportArgs, output: CliOutput, hooks: ImportHooks = {}): number {
  const read = hooks.readFileSync ?? readFileSync;
  const targetExists = hooks.existsSync ?? existsSync;
  const runImportTypeScriptSpec = hooks.importTypeScriptSpec ?? importTypeScriptSpec;
  const scan = scanImportPaths(parsed.paths, hooks);
  const planned: PlannedImport[] = [];
  let failed =
    scan.findings.some((finding) => finding.severity === "error") ||
    scan.operationalFailures.length > 0;

  for (const finding of scan.findings) {
    writeStderr(output, formatFinding(finding));
  }

  for (const failure of scan.operationalFailures) {
    writeStderr(output, `sdp import: ${failure}\n`);
  }

  for (const sourcePath of scan.sourcePaths) {
    try {
      const result = runImportTypeScriptSpec(read(sourcePath, "utf8"), sourcePath);
      const findings = [...result.findings];
      const targetPath = result.emitted?.path;

      if (targetPath !== undefined && targetExists(targetPath)) {
        findings.push(targetExistsFinding(targetPath));
      }

      for (const finding of findings) {
        writeStderr(output, formatFinding(finding));
      }

      if (
        findings.some((finding) => finding.severity === "error") ||
        result.emitted === undefined ||
        targetPath === undefined
      ) {
        failed = true;
        continue;
      }

      planned.push({ sourcePath, targetPath, content: result.emitted.content });
    } catch (error) {
      failed = true;
      const detail = error instanceof Error ? error.message : errorMessage(error);
      writeStderr(output, `sdp import: ${sourcePath} — ${detail}\n`);
    }
  }

  if (failed || planned.length === 0) {
    return 1;
  }

  if (parsed.dryRun) {
    for (const entry of planned) {
      writeStdout(output, `=== ${entry.targetPath} ===\n${entry.content}`);
    }
    return 0;
  }

  if (!publishImports(planned, output, hooks)) {
    return 1;
  }

  for (const entry of planned) {
    writeStdout(output, `Wrote ${entry.targetPath}\n`);
  }
  return 0;
}
