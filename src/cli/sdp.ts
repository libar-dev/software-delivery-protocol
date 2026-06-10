#!/usr/bin/env node

import { mkdirSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { extract } from "../extract/index.js";
import { serializeGraph } from "../extract/serialize.js";
import type { GraphSchema } from "../graph/schema.js";
import { renderDesignReview } from "../projections/design-review.js";
import { createReader } from "../reader/reader.js";
import type { Finding } from "../validate/contracts.js";
import { validateGraph } from "../validate/validators.js";

export const SDP_HELP_TEXT = `sdp — Libar Software Delivery Protocol
Usage:
  sdp --help
  sdp build [root] [--check-clean]
  sdp validate [root] [--check-clean]
  sdp view [root] [--check-clean]

Commands:
  build      Extract every *.sdp.ts under root (default: cwd), plus the anchor constants in the
             other *.ts/*.tsx source files, into <root>/generated/graph.json.
             Exits 1 and writes nothing on any hard error — the emitted artifact is
             all-or-nothing. --check-clean additionally runs a second independent extraction
             and fails on any byte divergence (the determinism self-check).
  validate   build, then run the conformance + honesty checks over the one graph (one
             validation path). A check error exits 1; gaps and orphans inform as warnings.
             graph.json is still written when the checks fail — the graph is the faithful
             projection; check errors describe the repo's conformance, not the artifact.
  view       validate, then generate the Design Review — the one read-only human view, a pure
             projection of the graph — into <root>/generated/design-review/ (rewritten
             wholesale, so no stale page survives). The view is written even when checks
             fail: findings render in it, which is what a review surface is for. Exit code
             follows validate. --check-clean additionally re-renders independently and fails
             on any byte divergence.`;

interface CliOutput {
  stdout?: { write: (chunk: string) => void };
  stderr?: { write: (chunk: string) => void };
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

function formatFinding(finding: Finding): string {
  return `[${finding.severity}] ${finding.validatorId} — ${finding.message}\n`;
}

interface BuildArgs {
  /** The resolved extraction root. */
  readonly root: string;
  readonly checkClean: boolean;
}

function parseBuildArgs(
  args: readonly string[],
  output: CliOutput,
  command: string,
): BuildArgs | undefined {
  let root: string | undefined;
  let checkClean = false;

  for (const argument of args) {
    if (argument === "--check-clean") {
      checkClean = true;
      continue;
    }

    if (argument.startsWith("--")) {
      writeStderr(output, `Unknown option for ${command}: ${argument}\n`);
      return undefined;
    }

    if (root !== undefined) {
      writeStderr(output, `sdp ${command} takes at most one root argument.\n`);
      return undefined;
    }

    root = argument;
  }

  return { root: resolve(process.cwd(), root ?? "."), checkClean };
}

interface BuildOutcome {
  readonly exitCode: number;
  /** Present only when the build succeeded — the graph the checks consume. */
  readonly graph?: GraphSchema;
}

function runBuild(parsed: BuildArgs, output: CliOutput, command: string): BuildOutcome {
  const { root: resolvedRoot, checkClean } = parsed;
  const result = extract({ root: resolvedRoot });
  const findings = result.report.findings;

  for (const finding of findings) {
    writeStderr(output, formatFinding(finding));
  }

  const errorCount = findings.filter((finding) => finding.severity === "error").length;
  const warningCount = findings.length - errorCount;
  const summary = `${String(result.counts.specs)} specs · ${String(result.counts.packs)} packs · ${String(result.counts.anchors)} anchors → ${String(result.graph.nodes.length)} nodes · ${String(result.graph.edges.length)} edges (${String(errorCount)} errors, ${String(warningCount)} warnings)\n`;
  const graphPath = join(resolvedRoot, "generated", "graph.json");

  // A stale projection is as dishonest as a partial one: a failed build must not leave a previous
  // graph.json behind that downstream consumers could read as current.
  const failBuild = (message: string): BuildOutcome => {
    rmSync(graphPath, { force: true });
    writeStderr(output, message);
    return { exitCode: 1 };
  };

  if (errorCount > 0) {
    writeStdout(output, summary);
    return failBuild(
      `sdp ${command}: hard errors present — graph.json not written; any previous graph.json at this root was removed.\n`,
    );
  }

  const serialized = serializeGraph(result.graph);

  if (checkClean) {
    const second = serializeGraph(extract({ root: resolvedRoot }).graph);

    if (second !== serialized) {
      return failBuild(
        `sdp ${command} --check-clean: two independent extractions diverged — the build is not deterministic; any previous graph.json at this root was removed.\n`,
      );
    }
  }

  // Temp-then-rename so a crash mid-write can never leave a truncated graph.json looking current.
  const temporaryPath = `${graphPath}.tmp`;
  mkdirSync(join(resolvedRoot, "generated"), { recursive: true });
  writeFileSync(temporaryPath, serialized, "utf8");
  renameSync(temporaryPath, graphPath);
  writeStdout(output, summary);
  writeStdout(output, `Wrote ${graphPath}\n`);
  return { exitCode: 0, graph: result.graph };
}

/**
 * `sdp validate` = `sdp build` + the checks (one validation path, MD-14). Extraction hard errors
 * keep build semantics and short-circuit the checks — checking a partial graph would validate a
 * phantom. With extraction clean the artifact is written even when checks fail: the graph is the
 * faithful projection, and the check errors describe the repo's conformance, not the artifact.
 */
function runValidate(parsed: BuildArgs, output: CliOutput, command: string): BuildOutcome {
  const build = runBuild(parsed, output, command);

  if (build.graph === undefined) {
    return build;
  }

  const findings = validateGraph(build.graph).findings;

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
}

/**
 * `sdp view` = `sdp validate` + the Design Review render. The view directory is owned wholesale —
 * removed and rewritten every run (a deleted spec's page must not survive as a stale artifact),
 * via temp-then-rename so a crash mid-write never leaves a half-written tree looking current.
 * The view is written even when checks fail: findings render *in* it — a review surface that
 * refused to show findings would hide exactly what it exists to show — so the exit code is
 * validate's, the artifacts stay.
 */
function runView(parsed: BuildArgs, output: CliOutput): number {
  const viewPath = join(parsed.root, "generated", "design-review");
  const validate = runValidate(parsed, output, "view");

  if (validate.graph === undefined) {
    // Build semantics: no graph, no view — and a stale view from a previous run is as dishonest
    // as a stale graph.json, so it goes the same way.
    rmSync(viewPath, { recursive: true, force: true });
    return validate.exitCode;
  }

  const pages = renderDesignReview(createReader(validate.graph));

  if (parsed.checkClean) {
    const second = renderDesignReview(createReader(validate.graph));

    if (JSON.stringify(second) !== JSON.stringify(pages)) {
      rmSync(viewPath, { recursive: true, force: true });
      writeStderr(
        output,
        "sdp view --check-clean: two independent renders diverged — the view is not deterministic; any previous design-review at this root was removed.\n",
      );
      return 1;
    }
  }

  const temporaryPath = `${viewPath}.tmp`;
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
}

export function runSdpCli(args: readonly string[], output: CliOutput = defaultCliOutput): number {
  const [command, ...rest] = args;

  if (command === undefined || command === "--help") {
    writeStdout(output, `${SDP_HELP_TEXT}\n`);
    return 0;
  }

  if (command !== "build" && command !== "validate" && command !== "view") {
    writeStderr(output, `${SDP_HELP_TEXT}\n\nUnknown command: ${command}\n`);
    return 1;
  }

  const parsed = parseBuildArgs(rest, output, command);

  if (parsed === undefined) {
    return 1;
  }

  if (command === "build") {
    return runBuild(parsed, output, "build").exitCode;
  }

  if (command === "validate") {
    return runValidate(parsed, output, "validate").exitCode;
  }

  return runView(parsed, output);
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
