#!/usr/bin/env node

import { mkdirSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { extract } from "../extract/index.js";
import { serializeGraph } from "../extract/serialize.js";
import type { Finding } from "../validate/contracts.js";

export const SDP_HELP_TEXT = `sdp — Libar Software Delivery Protocol
Usage:
  sdp --help
  sdp build [root] [--check-clean]
  sdp validate

Commands:
  build      Extract every *.sdp.ts under root (default: cwd), plus the anchor constants in the
             other *.ts/*.tsx source files, into <root>/generated/graph.json.
             Exits 1 and writes nothing on any hard error — the emitted artifact is
             all-or-nothing. --check-clean additionally runs a second independent extraction
             and fails on any byte divergence (the determinism self-check).
  validate   Validation gate not wired yet (Slice 3: graph validator gate)`;

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

function runBuild(args: readonly string[], output: CliOutput): number {
  let root: string | undefined;
  let checkClean = false;

  for (const argument of args) {
    if (argument === "--check-clean") {
      checkClean = true;
      continue;
    }

    if (argument.startsWith("--")) {
      writeStderr(output, `Unknown option for build: ${argument}\n`);
      return 1;
    }

    if (root !== undefined) {
      writeStderr(output, "sdp build takes at most one root argument.\n");
      return 1;
    }

    root = argument;
  }

  const resolvedRoot = resolve(process.cwd(), root ?? ".");
  const result = extract({ root: resolvedRoot });
  const findings = result.report.findings;

  for (const finding of findings) {
    writeStderr(output, formatFinding(finding));
  }

  const errorCount = findings.filter((finding) => finding.severity === "error").length;
  const warningCount = findings.length - errorCount;
  const summary = `${String(result.model.specs.length)} specs · ${String(result.model.packs.length)} packs · ${String(result.model.anchors.length)} anchors → ${String(result.graph.nodes.length)} nodes · ${String(result.graph.edges.length)} edges (${String(errorCount)} errors, ${String(warningCount)} warnings)\n`;
  const graphPath = join(resolvedRoot, "generated", "graph.json");

  // A stale projection is as dishonest as a partial one: a failed build must not leave a previous
  // graph.json behind that downstream consumers could read as current.
  const failBuild = (message: string): number => {
    rmSync(graphPath, { force: true });
    writeStderr(output, message);
    return 1;
  };

  if (errorCount > 0) {
    writeStdout(output, summary);
    return failBuild(
      "sdp build: hard errors present — graph.json not written; any previous graph.json at this root was removed.\n",
    );
  }

  const serialized = serializeGraph(result.graph);

  if (checkClean) {
    const second = serializeGraph(extract({ root: resolvedRoot }).graph);

    if (second !== serialized) {
      return failBuild(
        "sdp build --check-clean: two independent extractions diverged — the build is not deterministic; any previous graph.json at this root was removed.\n",
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
  return 0;
}

export function runSdpCli(args: readonly string[], output: CliOutput = defaultCliOutput): number {
  const [command, ...rest] = args;

  if (command === undefined || command === "--help") {
    writeStdout(output, `${SDP_HELP_TEXT}\n`);
    return 0;
  }

  if (command === "build") {
    return runBuild(rest, output);
  }

  if (command === "validate") {
    writeStderr(output, "sdp validate gate is not wired yet (Slice 3: graph validator gate).\n");
    return 1;
  }

  writeStderr(output, `${SDP_HELP_TEXT}\n\nUnknown command: ${command}\n`);
  return 1;
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
