#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

import { generateContracts } from "../codegen/contracts.js";
import { InvalidExcludePathError, normalizeExcludes } from "../extract/discover.js";
import { extract } from "../extract/index.js";
import { serializeGraph } from "../extract/serialize.js";
import type { GraphSchema } from "../graph/schema.js";
import { importFindingIds, importTypeScriptSpec } from "../index.js";
import type { ImportResult } from "../index.js";
import { renderDesignReview } from "../projections/design-review.js";
import { createReader } from "../reader/reader.js";
import type { Finding } from "../validate/contracts.js";
import { validateGraph } from "../validate/validators.js";

export const SDP_HELP_TEXT = `sdp — Libar Software Delivery Protocol
Usage:
  sdp --help
  sdp build [root] [--exclude PATH]... [--check-clean]
  sdp validate [root] [--exclude PATH]... [--check-clean]
  sdp view [root] [--exclude PATH]... [--check-clean]
  sdp import <path...> [--dry-run]

Commands:
  build      Extract every *.sdp.ts and *.sdp.md under root (default: cwd), plus the anchor
              constants in the other *.ts/*.tsx source files, into <root>/generated/graph.json — then derive the
             executable contracts (per-example step contracts + per-parent space contracts,
             the A2 mechanism) into <root>/generated/contracts/. Exits 1 and writes nothing on
             any hard error — the emitted artifacts are all-or-nothing. --check-clean
             additionally runs a second independent extraction + generation and fails on any
             byte divergence (the determinism self-check). Repeat --exclude PATH to omit exact
             root-relative POSIX path prefixes from both extraction surfaces.
  validate   build, then run the conformance + honesty checks over the one graph (one
             validation path). A check error exits 1; gaps and orphans inform as warnings.
             graph.json is still written when the checks fail — the graph is the faithful
             projection; check errors describe the repo's conformance, not the artifact.
  view       validate, then generate the Design Review — the one read-only human view, a pure
              projection of the graph — into <root>/generated/design-review/ (rewritten
              wholesale, so no stale page survives). The view is written even when checks
              fail: findings render in it, which is what a review surface is for. Exit code
              follows validate. --check-clean additionally re-renders independently and fails
              on any byte divergence.
  import     Convert one or more *.sdp.ts files or recursively scanned roots to write-beside
              *.sdp.md documents. The TypeScript source is never deleted. --dry-run writes
              each would-be document to stdout, headed by its target path, without writing.
              Existing Markdown siblings and non-emitting carrier refusals are rendered as
              findings and never throw or overwrite. Exits 0 only when every requested source
              emits (or would emit); any finding error or operational failure exits 1. Publication
              creates atomic hard links; the target filesystem must support them (FAT/exFAT and
              some network mounts do not).`;

interface CliOutput {
  stdout?: { write: (chunk: string) => void };
  stderr?: { write: (chunk: string) => void };
}

/**
 * The internal injection seam — never a CLI flag, never part of the agent surface. Extraction and
 * rendering are deterministic (P3), so the --check-clean divergence branches and the error
 * boundaries are unreachable from honest inputs; their coverage substitutes these producers.
 * `removeArtifact` rides the same seam: a denied recovery-path removal (EACCES/EPERM) is
 * deterministic only through injection — never a chmod trick in a test.
 */
interface ImportHooks {
  readonly readFileSync?: typeof readFileSync;
  readonly writeFileSync?: typeof writeFileSync;
  readonly existsSync?: typeof existsSync;
  readonly renameSync?: typeof renameSync;
  readonly rmSync?: typeof rmSync;
  readonly importTypeScriptSpec?: typeof importTypeScriptSpec;
}

interface CliHooks {
  readonly extract?: typeof extract;
  readonly generateContracts?: typeof generateContracts;
  readonly renderDesignReview?: typeof renderDesignReview;
  readonly validateGraph?: typeof validateGraph;
  readonly rmSync?: typeof rmSync;
  readonly import?: ImportHooks;
}

const defaultCliOutput: CliOutput = {
  stdout: process.stdout,
  stderr: process.stderr,
};

function writeStdout(output: CliOutput, text: string): void {
  if (output.stdout !== undefined) {
    output.stdout.write(text);
  }
}

function writeStderr(output: CliOutput, text: string): void {
  if (output.stderr !== undefined) {
    output.stderr.write(text);
  }
}

/**
 * The one text rendering of a finding: location comes from the structured `file`/`line` fields
 * (messages never embed it — stating it twice is the duplication the model itself forbids).
 * Graph-validator findings often carry `file` without `line` (`Primitive` nodes are line-free by
 * design), so each part renders only when known.
 */
function formatFinding(finding: Finding | ImportResult["findings"][number]): string {
  const location =
    finding.file === undefined
      ? ""
      : `${finding.file}${finding.line === undefined ? "" : `:${String(finding.line)}`} — `;

  return `${location}[${finding.severity}] ${finding.validatorId} — ${finding.message}\n`;
}

interface ImportArgs {
  readonly paths: readonly string[];
  readonly dryRun: boolean;
}

function parseImportArgs(args: readonly string[], output: CliOutput): ImportArgs | undefined {
  const paths: string[] = [];
  let dryRun = false;

  for (const argument of args) {
    if (argument === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (argument.startsWith("--")) {
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

function collectImportPaths(path: string, collected: string[]): void {
  const entry = statSync(path);

  if (entry.isFile()) {
    if (path.endsWith(".sdp.ts")) {
      collected.push(path);
    }
    return;
  }

  if (!entry.isDirectory()) {
    return;
  }

  for (const child of readdirSync(path, { withFileTypes: true }).sort((first, second) =>
    first.name.localeCompare(second.name),
  )) {
    collectImportPaths(join(path, child.name), collected);
  }
}

function targetExistsFinding(targetPath: string): Finding {
  return {
    validatorId: importFindingIds.targetExists,
    family: "conformance",
    severity: "error",
    message: `the Markdown target already exists and will not be overwritten: ${targetPath}`,
    file: targetPath,
    line: 1,
  };
}

function noSourcesFinding(path: string): ImportResult["findings"][number] {
  return {
    validatorId: importFindingIds.noSources,
    family: "conformance",
    severity: "info",
    message: "the requested import path contains no .sdp.ts carrier",
    file: path,
    line: 1,
  };
}

interface PlannedImport {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly content: string;
}

interface PreparedImport extends PlannedImport {
  readonly temporaryPath: string;
}

function runImport(parsed: ImportArgs, output: CliOutput, hooks: CliHooks): number {
  const importHooks = hooks.import ?? {};
  const read = importHooks.readFileSync ?? readFileSync;
  const write = importHooks.writeFileSync ?? writeFileSync;
  const targetExists = importHooks.existsSync ?? existsSync;
  const rename = importHooks.renameSync ?? renameSync;
  const remove = importHooks.rmSync ?? rmSync;
  const runImportTypeScriptSpec = importHooks.importTypeScriptSpec ?? importTypeScriptSpec;
  const sourcePaths: string[] = [];

  try {
    for (const path of parsed.paths) {
      collectImportPaths(path, sourcePaths);
    }
  } catch (error) {
    writeStderr(output, `sdp import: ${errorMessage(error)}\n`);
    return 1;
  }

  const planned: PlannedImport[] = [];

  for (const sourcePath of [...new Set(sourcePaths)].sort()) {
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

      if (findings.some((finding) => finding.severity === "error") || result.emitted === undefined)
        return 1;

      if (targetPath === undefined) return 1;
      planned.push({ sourcePath, targetPath, content: result.emitted.content });
    } catch (error) {
      writeStderr(output, `sdp import: ${errorMessage(error)}\n`);
      return 1;
    }
  }

  if (planned.length === 0) {
    for (const path of parsed.paths) writeStderr(output, formatFinding(noSourcesFinding(path)));
    return 1;
  }

  if (parsed.dryRun) {
    for (const entry of planned)
      writeStdout(output, `=== ${entry.targetPath} ===\n${entry.content}`);
    return 0;
  }

  const prepared: PreparedImport[] = planned.map((entry, index) => ({
    ...entry,
    temporaryPath: `${entry.targetPath}.sdp-import-${String(process.pid)}-${String(index)}.tmp`,
  }));
  const publishedPaths: string[] = [];

  try {
    for (const entry of prepared) {
      write(entry.temporaryPath, entry.content, "utf8");
    }
    for (const entry of prepared) {
      if (targetExists(entry.targetPath))
        throw new Error(`Markdown target already exists: ${entry.targetPath}`);
      rename(entry.temporaryPath, entry.targetPath);
      publishedPaths.push(entry.targetPath);
    }
  } catch (error) {
    for (const path of [...prepared.map((entry) => entry.temporaryPath), ...publishedPaths])
      remove(path, { force: true });
    writeStderr(output, `sdp import: ${errorMessage(error)}\n`);
    return 1;
  }

  for (const entry of planned) writeStdout(output, `Wrote ${entry.targetPath}\n`);
  return 0;
}

interface BuildArgs {
  /** The resolved extraction root. */
  readonly root: string;
  readonly exclude: readonly string[];
  readonly checkClean: boolean;
}

function parseBuildArgs(
  args: readonly string[],
  output: CliOutput,
  command: string,
): BuildArgs | undefined {
  let root: string | undefined;
  let checkClean = false;
  const rawExcludes: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === undefined) {
      continue;
    }

    if (argument === "--check-clean") {
      checkClean = true;
      continue;
    }

    if (argument === "--exclude") {
      const exclude = args[index + 1];

      if (exclude === undefined) {
        writeStderr(output, `sdp ${command}: --exclude requires a path.\n`);
        return undefined;
      }

      if (exclude.startsWith("--")) {
        writeStderr(output, `sdp ${command}: --exclude expects a path, got ${exclude}\n`);
        return undefined;
      }

      rawExcludes.push(exclude);
      index += 1;
      continue;
    }

    if (argument.startsWith("--")) {
      writeStderr(output, `sdp ${command}: unknown option ${argument}\n`);
      return undefined;
    }

    if (root !== undefined) {
      writeStderr(output, `sdp ${command} takes at most one root argument.\n`);
      return undefined;
    }

    root = argument;
  }

  let exclude: readonly string[];

  try {
    exclude = normalizeExcludes(rawExcludes);
  } catch (error) {
    if (error instanceof InvalidExcludePathError) {
      writeStderr(output, `sdp ${command}: invalid --exclude path "${error.path}"\n`);
      return undefined;
    }

    throw error;
  }

  const resolvedRoot = resolve(process.cwd(), root ?? ".");

  // First contact fails clean: a typo'd root is invocation feedback, never a Node stack trace.
  if (!isDirectory(resolvedRoot)) {
    writeStderr(output, `sdp ${command}: root "${resolvedRoot}" is not a directory.\n`);
    return undefined;
  }

  return { root: resolvedRoot, exclude, checkClean };
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Stale-artifact removal for recovery paths: never throws (recovery must not crash out of the
 * one-line law) and never silent about a survivor. Only the nothing-readable failures are
 * swallowed — ENOENT, and ENOTDIR because `force: true` is not enough on every supported
 * runtime (Node 20 ignores only ENOENT, so a path through `generated`-as-a-file still raises
 * ENOTDIR through the file parent, and such a path holds no readable artifact). Any other
 * failure (EACCES/EPERM/EBUSY) means a readable artifact may persist: the failure is returned
 * so the caller reports the survivor instead of letting a stale artifact read as current.
 * Success-path removals stay raw `rmSync`: there a swallowed failure could rename a stale temp
 * tree into place, and the surrounding try/catch already routes the error into the one-line law.
 */
function removeArtifact(path: string, rm: typeof rmSync): string | undefined {
  try {
    rm(path, { recursive: true, force: true });
    return undefined;
  } catch (error) {
    const code = error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined;

    return code === "ENOENT" || code === "ENOTDIR" ? undefined : errorMessage(error);
  }
}

/**
 * Removes every recovery-path artifact and reports each survivor on its own line — the surfaced
 * counterpart of the stale-artifact law: when removal cannot keep the promise, the consumer is
 * told what not to trust instead of being promised silently.
 */
function removeArtifacts(
  paths: readonly string[],
  output: CliOutput,
  command: string,
  rm: typeof rmSync,
): void {
  for (const path of paths) {
    const failure = removeArtifact(path, rm);

    if (failure !== undefined) {
      writeStderr(
        output,
        `sdp ${command}: stale ${path} could not be removed (${failure}) — do not read it as current.\n`,
      );
    }
  }
}

interface BuildOutcome {
  readonly exitCode: number;
  /** Present only when the build succeeded — the graph the checks consume. */
  readonly graph?: GraphSchema;
}

/** Byte-equality over two generated-contract file maps — the contracts half of --check-clean. */
function contractFilesEqual(
  first: ReadonlyMap<string, string>,
  second: ReadonlyMap<string, string>,
): boolean {
  if (first.size !== second.size) {
    return false;
  }

  for (const [path, content] of first) {
    if (second.get(path) !== content) {
      return false;
    }
  }

  return true;
}

const regenerabilityAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.regenerability"),
  label: "repeats graph and contract producers for deterministic regeneration",
  satisfies: ref("spec:extraction.regenerability"),
});
void regenerabilityAnchor;

function runBuild(
  parsed: BuildArgs,
  output: CliOutput,
  command: string,
  hooks: CliHooks,
): BuildOutcome {
  const { root: resolvedRoot, exclude, checkClean } = parsed;
  const extractionOptions = { root: resolvedRoot, exclude };
  const runExtract = hooks.extract ?? extract;
  const runGenerateContracts = hooks.generateContracts ?? generateContracts;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const graphPath = join(resolvedRoot, "generated", "graph.json");
  const contractsPath = join(resolvedRoot, "generated", "contracts");
  const viewPath = join(resolvedRoot, "generated", "design-review");

  // A stale projection is as dishonest as a partial one: a failed build must not leave a previous
  // graph.json (or contracts tree) behind that downstream consumers could read as current — nor a
  // half-written temp twin. Recovery rides removeArtifacts, which never throws (the one-line law
  // holds) and names any survivor it could not remove.
  const failBuild = (message: string): BuildOutcome => {
    writeStderr(output, message);
    removeArtifacts(
      [graphPath, `${graphPath}.tmp`, contractsPath, `${contractsPath}.tmp`],
      output,
      command,
      recoveryRm,
    );
    return { exitCode: 1 };
  };

  // Every build replaces the graph a Design Review derives from. Invalidate that downstream
  // projection before extraction so neither success, failure, nor an interrupted later stage can
  // leave an older view readable beside a newer (or missing) graph.
  for (const staleViewPath of [viewPath, `${viewPath}.tmp`]) {
    const failure = removeArtifact(staleViewPath, recoveryRm);

    if (failure !== undefined) {
      return failBuild(
        `sdp ${command}: stale ${staleViewPath} could not be removed (${failure}) — build stopped so it cannot read as current.\n`,
      );
    }
  }

  try {
    const result = runExtract(extractionOptions);
    const findings = result.report.findings;

    for (const finding of findings) {
      writeStderr(output, formatFinding(finding));
    }

    // An empty authored model is conformant — no finding, exit 0 — but a typo'd cwd must never be
    // a silent success, so the CLI (the invocation surface) says where it looked. A finding that
    // names a spec file proves spec files were found (a failed file is not an absent one), so the
    // note stays silent beside it.
    if (
      result.counts.specs === 0 &&
      !findings.some(
        (finding) =>
          finding.file?.endsWith(".sdp.ts") === true || finding.file?.endsWith(".sdp.md") === true,
      )
    ) {
      writeStderr(
        output,
        `note: no *.sdp.ts or *.sdp.md spec files found under ${resolvedRoot} — the authored model is empty. Is this the right extraction root?\n`,
      );
    }

    const extractionErrorCount = findings.filter((finding) => finding.severity === "error").length;

    if (extractionErrorCount > 0) {
      const warningCount = findings.length - extractionErrorCount;
      writeStdout(
        output,
        `${String(result.counts.specs)} specs · ${String(result.counts.packs)} packs · ${String(result.counts.anchors)} anchors → ${String(result.graph.nodes.length)} nodes · ${String(result.graph.edges.length)} edges (${String(extractionErrorCount)} errors, ${String(warningCount)} warnings)\n`,
      );
      return failBuild(`sdp ${command}: hard errors present — graph.json not written.\n`);
    }

    const serialized = serializeGraph(result.graph);

    // The contracts codegen stage (plan 13): pure over the graph the checks consume; its
    // diagnostics are ordinary build findings (all warnings — a drift is named, never gates).
    const contracts = runGenerateContracts(result.graph);

    for (const finding of contracts.findings) {
      writeStderr(output, formatFinding(finding));
    }

    const allFindings = [...findings, ...contracts.findings];
    const errorCount = allFindings.filter((finding) => finding.severity === "error").length;
    const warningCount = allFindings.length - errorCount;
    const summary = `${String(result.counts.specs)} specs · ${String(result.counts.packs)} packs · ${String(result.counts.anchors)} anchors → ${String(result.graph.nodes.length)} nodes · ${String(result.graph.edges.length)} edges (${String(errorCount)} errors, ${String(warningCount)} warnings)\n`;

    if (checkClean) {
      const secondResult = runExtract(extractionOptions);
      const second = serializeGraph(secondResult.graph);

      if (second !== serialized) {
        return failBuild(
          `sdp ${command} --check-clean: two independent extractions diverged — the build is not deterministic.\n`,
        );
      }

      const secondContracts = runGenerateContracts(secondResult.graph);

      if (!contractFilesEqual(contracts.files, secondContracts.files)) {
        return failBuild(
          `sdp ${command} --check-clean: two independent contract generations diverged — the build is not deterministic.\n`,
        );
      }
    }

    // Temp-then-rename so a crash mid-write can never leave a truncated graph.json looking current.
    const temporaryPath = `${graphPath}.tmp`;
    mkdirSync(join(resolvedRoot, "generated"), { recursive: true });
    writeFileSync(temporaryPath, serialized, "utf8");
    renameSync(temporaryPath, graphPath);

    // The contracts tree is owned wholesale — rewritten every build via temp-then-rename, and
    // removed outright when nothing generates (a stale contract must never look current).
    const contractsTemporaryPath = `${contractsPath}.tmp`;
    rmSync(contractsTemporaryPath, { recursive: true, force: true });

    if (contracts.files.size > 0) {
      mkdirSync(contractsTemporaryPath, { recursive: true });

      for (const [relativePath, content] of contracts.files) {
        writeFileSync(join(contractsTemporaryPath, relativePath), content, "utf8");
      }

      rmSync(contractsPath, { recursive: true, force: true });
      renameSync(contractsTemporaryPath, contractsPath);
    } else {
      rmSync(contractsPath, { recursive: true, force: true });
    }

    writeStdout(output, summary);
    writeStdout(output, `Wrote ${graphPath}\n`);

    if (contracts.files.size > 0) {
      writeStdout(output, `Wrote ${contractsPath} (${String(contracts.files.size)} modules)\n`);
    }

    return { exitCode: 0, graph: result.graph };
  } catch (error) {
    // Failures past root discovery keep the same law as the typo'd root: one line of invocation
    // feedback, exit 1, never a Node stack trace — and the stale-artifact removal above holds.
    return failBuild(`sdp ${command}: ${errorMessage(error)}\n`);
  }
}

/**
 * `sdp validate` = `sdp build` + the checks (one validation path, MD-14). Extraction hard errors
 * keep build semantics and short-circuit the checks — checking a partial graph would validate a
 * phantom. With extraction clean the artifact is written even when checks fail: the graph is the
 * faithful projection, and the check errors describe the repo's conformance, not the artifact.
 */
function runValidate(
  parsed: BuildArgs,
  output: CliOutput,
  command: string,
  hooks: CliHooks,
): BuildOutcome {
  const build = runBuild(parsed, output, command, hooks);

  if (build.graph === undefined) {
    return build;
  }

  const runValidateGraph = hooks.validateGraph ?? validateGraph;

  try {
    const findings = runValidateGraph(build.graph).findings;

    for (const finding of findings) {
      writeStderr(output, formatFinding(finding));
    }

    const errorCount = findings.filter((finding) => finding.severity === "error").length;
    const warningCount = findings.length - errorCount;
    writeStdout(
      output,
      `validate: ${String(errorCount)} errors · ${String(warningCount)} warnings (conformance + honesty over the one graph)\n`,
    );

    return { exitCode: errorCount > 0 ? 1 : 0, graph: build.graph };
  } catch (error) {
    // The checks ride the same one-line law as every stage past discovery. graph.json stays — it
    // was cleanly built, and the failure describes the checks, not the artifact.
    writeStderr(output, `sdp ${command}: ${errorMessage(error)}\n`);
    return { exitCode: 1 };
  }
}

/**
 * `sdp view` = `sdp validate` + the Design Review render. The view directory is owned wholesale —
 * removed and rewritten every run (a deleted spec's page must not survive as a stale artifact),
 * via temp-then-rename so a crash mid-write never leaves a half-written tree looking current.
 * The view is written even when checks fail: findings render *in* it — a review surface that
 * refused to show findings would hide exactly what it exists to show — so the exit code is
 * validate's, the artifacts stay.
 */
function runView(parsed: BuildArgs, output: CliOutput, hooks: CliHooks): number {
  const render = hooks.renderDesignReview ?? renderDesignReview;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const viewPath = join(parsed.root, "generated", "design-review");
  const validate = runValidate(parsed, output, "view", hooks);

  if (validate.graph === undefined) {
    // Build semantics: no graph, no view — and a stale view from a previous run is as dishonest
    // as a stale graph.json, so it goes the same way (never-throw: this runs outside the
    // try/catch, and a `generated`-as-a-file root must still fail on build's one line).
    removeArtifacts([viewPath], output, "view", recoveryRm);
    return validate.exitCode;
  }

  // The graph's stale-artifact law, applied to the view: a failed render must not leave a
  // previous design-review behind that a reviewer could read as current — nor a partial temp
  // tree from a write that failed mid-loop.
  const temporaryPath = `${viewPath}.tmp`;
  const failView = (message: string): number => {
    writeStderr(output, message);
    removeArtifacts([viewPath, temporaryPath], output, "view", recoveryRm);
    return 1;
  };

  try {
    const pages = render(createReader(validate.graph));

    if (parsed.checkClean) {
      const second = render(createReader(validate.graph));

      if (JSON.stringify(second) !== JSON.stringify(pages)) {
        return failView(
          "sdp view --check-clean: two independent renders diverged — the view is not deterministic.\n",
        );
      }
    }

    rmSync(temporaryPath, { recursive: true, force: true });

    for (const page of pages) {
      const target = join(temporaryPath, page.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, page.content, "utf8");
    }

    rmSync(viewPath, { recursive: true, force: true });
    renameSync(temporaryPath, viewPath);
    writeStdout(output, `Wrote ${viewPath} (${String(pages.length)} pages)\n`);
    return validate.exitCode;
  } catch (error) {
    // Failures past root discovery keep the same law as the typo'd root: one line of invocation
    // feedback, exit 1, never a Node stack trace — and the stale-artifact removal above holds.
    return failView(`sdp view: ${errorMessage(error)}\n`);
  }
}

export function runSdpCli(
  args: readonly string[],
  output: CliOutput = defaultCliOutput,
  hooks: CliHooks = {},
): number {
  const [command, ...rest] = args;

  if (command === undefined || command === "--help") {
    writeStdout(output, `${SDP_HELP_TEXT}\n`);
    return 0;
  }

  if (command !== "build" && command !== "validate" && command !== "view" && command !== "import") {
    writeStderr(output, `${SDP_HELP_TEXT}\n\nUnknown command: ${command}\n`);
    return 1;
  }

  if (command === "import") {
    const parsed = parseImportArgs(rest, output);

    return parsed === undefined ? 1 : runImport(parsed, output, hooks);
  }

  const parsed = parseBuildArgs(rest, output, command);

  if (parsed === undefined) {
    return 1;
  }

  if (command === "build") {
    return runBuild(parsed, output, "build", hooks).exitCode;
  }

  if (command === "validate") {
    return runValidate(parsed, output, "validate", hooks).exitCode;
  }

  return runView(parsed, output, hooks);
}

/**
 * True when this module is the executed entry point. npm exposes the CLI as a
 * `node_modules/.bin/sdp` symlink and Node keeps the symlink path in `process.argv[1]`, so a
 * path-suffix check would silently no-op for the installed binary; realpath-comparing both sides
 * recognizes every route to the entry file (direct, symlinked, or behind a symlinked directory).
 * Fails closed: an unresolvable path means we are not the entry point.
 */
export function isCliEntrypoint(executedPath: string | undefined, moduleUrl: string): boolean {
  if (executedPath === undefined) {
    return false;
  }

  try {
    return realpathSync(executedPath) === realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return false;
  }
}

if (isCliEntrypoint(process.argv[1], import.meta.url)) {
  process.exitCode = runSdpCli(process.argv.slice(2));
}
