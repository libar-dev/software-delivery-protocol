#!/usr/bin/env node

import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { parseBuildArgs } from "./build-args.js";
import { runBuild } from "./build-command.js";
import { parseImportArgs, runImport } from "./import-command.js";
import type { ImportHooks } from "./import-command.js";
import { defaultCliOutput, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";
import { runValidate, runView } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

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

interface CliHooks extends ValidationViewHooks {
  readonly import?: ImportHooks;
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

    return parsed === undefined ? 1 : runImport(parsed, output, hooks.import);
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
