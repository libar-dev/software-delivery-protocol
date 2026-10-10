#!/usr/bin/env node

import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { parseBuildArgs } from "./build-args.js";
import { BUILD_INFO_FILE, UNKNOWN_COMMIT, parseBuildCommit } from "./build-info.js";
import { runBuild } from "./build-command.js";
import { runCensus } from "./census-command.js";
import type { CensusHooks } from "./census-command.js";
import { runGherkinView } from "./gherkin-command.js";
import type { GherkinViewHooks } from "./gherkin-command.js";
import { parseImportArgs, runImport } from "./import-command.js";
import type { ImportHooks } from "./import-command.js";
import { NEW_SPEC_HELP_TEXT, parseNewSpecArgs, runNewSpec } from "./new-spec-command.js";
import { runMermaid } from "./mermaid-command.js";
import type { MermaidHooks } from "./mermaid-command.js";
import { defaultCliOutput, errorMessage, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";
import { parseQueryArgs, runQuery } from "./q-command.js";
import type { QueryHooks } from "./q-command.js";
import { runValidateWatch } from "./validate-watch.js";
import type { ValidateWatchHooks } from "./validate-watch.js";
import { runValidate, runView } from "./validate-view-command.js";

export const SDP_HELP_TEXT = `sdp — Libar Software Delivery Protocol
Usage:
  sdp --help
  sdp --version
  sdp build [root] [--exclude PATH]... [--check-clean]
  sdp validate [root] [--exclude PATH]... [--check-clean | --watch]
  sdp view [root] [--exclude PATH]... [--check-clean]
  sdp census [root] [--exclude PATH]... [--check-clean]
  sdp mermaid [root] [--exclude PATH]... [--check-clean]
  sdp gherkin [root] [--exclude PATH]... [--check-clean]
  sdp import <path...> [--dry-run]
  sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME
  sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--params JSON | --params @PATH] [--json]

Options:
  --version  Print one line, sdp <package version> (<commit>), and exit 0. The commit is the full
             hash the build recorded beside the compiled CLI, or unknown; the CLI never runs git,
             and neither value enters the graph or any projection.

Commands:
  build      Extract every *.sdp.ts, *.sdp.md, and *.sdp.gherkin under root (default: cwd), plus
             the anchor constants in the other *.ts/*.tsx source files, into
             <root>/generated/graph.json — then derive the
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
             --watch re-runs the same validate path on carrier create/change/delete/rename
             and stays alive after findings; operator stop (SIGINT) exits 0. --watch cannot
             be combined with --check-clean.
  view       validate, then generate the Design Review — the contextual read-only human view —
             into <root>/generated/design-review/ (rewritten wholesale). Findings remain data;
             exit code follows validate. --check-clean independently re-renders.
  census     validate, then generate the taxonomy census into <root>/generated/census/ as a
             separate wholesale tmp-to-rename projection. --check-clean independently re-renders
             and refuses when the checked-in/generated page differs from the current projection.
  mermaid    validate, then generate Mermaid diagrams into <root>/generated/mermaid/ as a
             separate wholesale tmp-to-rename projection. --check-clean independently re-renders
             and refuses when the published bytes differ from the current projection.
  gherkin    validate, then generate a Gherkin-shaped READ projection of every Spec into
             <root>/generated/gherkin/ as a separate wholesale tmp-to-rename projection. The
             pages are disposable and never use .sdp.gherkin. --check-clean independently
             re-renders and refuses when the published bytes differ from the current projection.
  import     Convert one or more *.sdp.ts files or recursively scanned roots to write-beside
             *.sdp.md documents. The TypeScript source is never deleted. --dry-run writes
             each would-be document to stdout, headed by its target path, without writing.
             Existing Markdown siblings and non-emitting carrier refusals are rendered as
             findings and never throw or overwrite. Exits 0 only when every requested source
             emits (or would emit); any finding error or operational failure exits 1. Publication
             creates atomic hard links; the target filesystem must support them (FAT/exFAT and
             some network mounts do not).
  new spec   Scaffold an honest idea-rung Markdown Spec at a cwd-relative .sdp.md PATH. Always
             emits readiness: idea and relations: {}; never overwrites; never invents typed
             content. constraint emits envelope, title, and Intent only, with no twin section.
  q          The agent front door: derive the graph under --root (default: cwd) in process, then
             evaluate the supplied body and print what it returns. The body is the single
             positional argument, or stdin when stdin is not a terminal; with neither, q refuses
             with a usage note and exits 1 rather than waiting. It is a plain JavaScript async function
             body — no import/export, no TypeScript-only syntax — and \`return\` is the output
             contract. Four bindings are injected: \`g\`, the reader over the derived graph (the
             same createReader the package exports); \`graph\`, the raw graph schema object;
             \`report\`, the validation report, so honesty findings are queryable data rather than a
             gate — checks never gate the read path; and \`params\`, the JSON object --params
             supplies, or {} without it. --params takes the JSON inline or, as @PATH, a file
             holding it; a value that is not a JSON object or a file that cannot be read refuses
             before the body runs. A recipe reads its parameter from \`params\` and falls back to the
             catalog's sample. The graph is derived on every invocation, so a
             just-authored Spec is queryable immediately and no committed artifact answers in the
             graph's name; nothing is written anywhere. Output is bounded util.inspect (depth 4);
             --json prints JSON.stringify instead, unbounded. A body that throws exits 1, as does a
             graph that fails to derive.

Agent skills and reference:
  Shipped in the package. Paths are relative to the package directory PKG, which is
  node_modules/@libar-dev/software-delivery-protocol in an adopter and the repository root in a
  source checkout.
  .agents/skills/sdp-agent-surface/SKILL.md   the skill for reading the graph through q
  .agents/skills/sdp-authoring/SKILL.md       the skill for authoring Specs, Packs, and anchors
  .agents/skills/sdp-sessions/SKILL.md        the skill for routing a delivery session
  docs/agent-surface/recipes.md               the recipe catalog: runnable q bodies
  dist/recipes/NN-slug.js                     each catalog body as a file, run as shipped with
                                              sdp q "$(cat PKG/dist/recipes/NN-slug.js)"
  CONTEXT.md                                  the Protocol's glossary, which the skills and
                                              recipes use
  specs/                                      the Protocol's own Specs and Pack, which the skills
                                              and recipes cite by id
  Read a cited Protocol Spec: sdp q 'return g.specContext("spec:model.anchors")' --root PKG/specs
  That graph holds intent only. The package ships no source anchors, so its delivery facts are
  empty and its gap warnings are not evidence about what the Protocol has realized.`;

/** Reads one file the package ships, by URL; `sdp --version` reads through it. */
export type EngineFileReader = (url: URL) => string;

interface CliHooks extends CensusHooks, MermaidHooks, GherkinViewHooks, ValidateWatchHooks {
  readonly import?: ImportHooks;
  readonly query?: QueryHooks;
  readonly readEngineFile?: EngineFileReader;
}

export interface EngineProvenance {
  readonly version: string;
  readonly commit: string;
}

const readShippedFile: EngineFileReader = (url) => readFileSync(url, "utf8");

/**
 * The engine's identity, read from two files and never from git: the version from the
 * `package.json` two directories above this module, which is the package root from `dist/cli/` and
 * from `src/cli/` alike, and the commit from the record the build wrote beside the compiled CLI.
 * A file that is absent or does not answer reads as `unknown`.
 */
export function readEngineProvenance(read: EngineFileReader = readShippedFile): EngineProvenance {
  let version = "unknown";

  try {
    const manifest = JSON.parse(read(new URL("../../package.json", import.meta.url))) as unknown;
    const value =
      typeof manifest === "object" && manifest !== null
        ? (manifest as Record<string, unknown>).version
        : undefined;

    if (typeof value === "string" && /^\S+$/u.test(value)) {
      version = value;
    }
  } catch {
    // An unreadable manifest names no version.
  }

  let commit = UNKNOWN_COMMIT;

  try {
    commit = parseBuildCommit(read(new URL(`./${BUILD_INFO_FILE}`, import.meta.url)));
  } catch {
    // A build that recorded nothing names no commit.
  }

  return { version, commit };
}

/**
 * @sdpAnchor impl:protocol.agent-surface-cli
 * @sdpLabel CLI verb dispatcher and agent-surface front of the package CLI
 * @sdpSatisfies spec:consumers.agent-surface
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */

/**
 * @sdpAnchor impl:protocol.engine-provenance-cli
 * @sdpLabel sdp --version names the package version and the commit the build recorded
 * @sdpSatisfies spec:consumers.engine-provenance
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */

/**
 * Every verb but `q` and `validate --watch` completes synchronously. `q` awaits an
 * operator-supplied async body; `validate --watch` stays open until abort. The dispatcher's return
 * type carries those asynchronous branches rather than making every caller of a synchronous verb
 * await a resolved promise.
 */
export function runSdpCli(
  args: readonly string[],
  output: CliOutput = defaultCliOutput,
  hooks: CliHooks = {},
): number | Promise<number> {
  const [command, ...rest] = args;

  if (command === undefined || command === "--help") {
    writeStdout(output, `${SDP_HELP_TEXT}\n`);
    return 0;
  }

  if (command === "--version") {
    const { version, commit } = readEngineProvenance(hooks.readEngineFile);

    writeStdout(output, `sdp ${version} (${commit})\n`);
    return 0;
  }

  if (
    command !== "build" &&
    command !== "validate" &&
    command !== "view" &&
    command !== "census" &&
    command !== "mermaid" &&
    command !== "gherkin" &&
    command !== "import" &&
    command !== "new" &&
    command !== "q"
  ) {
    writeStderr(output, `${SDP_HELP_TEXT}\n\nUnknown command: ${command}\n`);
    return 1;
  }

  if (command === "import") {
    const parsed = parseImportArgs(rest, output);

    return parsed === undefined ? 1 : runImport(parsed, output, hooks.import);
  }

  if (command === "new") {
    const [noun, ...newRest] = rest;

    if (noun === "--help") {
      writeStdout(output, `${NEW_SPEC_HELP_TEXT}\n`);
      return 0;
    }

    if (noun === undefined) {
      writeStdout(output, `${NEW_SPEC_HELP_TEXT}\n`);
      writeStderr(
        output,
        "sdp new: requires spec. Usage: sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME\n",
      );
      return 1;
    }

    if (noun !== "spec") {
      writeStderr(
        output,
        "sdp new: requires spec. Usage: sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME\n",
      );
      return 1;
    }

    if (newRest.includes("--help")) {
      writeStdout(output, `${NEW_SPEC_HELP_TEXT}\n`);
      return 0;
    }

    const parsed = parseNewSpecArgs(newRest, output);

    return parsed === undefined ? 1 : runNewSpec(parsed, output);
  }

  if (command === "q") {
    const parsed = parseQueryArgs(rest, output);

    return parsed === undefined ? 1 : runQuery(parsed, output, hooks.query);
  }

  const parsed = parseBuildArgs(rest, output, command);

  if (parsed === undefined) {
    return 1;
  }

  if (command === "build") {
    return runBuild(parsed, output, "build", hooks).exitCode;
  }

  if (command === "validate") {
    return parsed.watch
      ? runValidateWatch(parsed, output, hooks, hooks)
      : runValidate(parsed, output, "validate", hooks).exitCode;
  }

  if (command === "view") {
    return runView(parsed, output, hooks);
  }

  if (command === "census") {
    return runCensus(parsed, output, hooks);
  }

  return command === "mermaid"
    ? runMermaid(parsed, output, hooks)
    : runGherkinView(parsed, output, hooks);
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

/**
 * The stdout error handler the entrypoint installs. A downstream reader closing early
 * (`sdp q '…' --json | head`) surfaces as an asynchronous 'error' event on the stdout socket,
 * which no try/catch inside a command can reach — and nobody is listening for output any more, so
 * the honest answer is a quiet successful exit, not an engine stack trace. Anything other than
 * EPIPE stays fatal.
 */
export function onStdoutError(error: NodeJS.ErrnoException, exit: (code: number) => void): void {
  if (error.code === "EPIPE") {
    exit(0);
    return;
  }

  throw error;
}

if (isCliEntrypoint(process.argv[1], import.meta.url)) {
  process.stdout.on("error", (error: NodeJS.ErrnoException) => {
    onStdoutError(error, (code) => {
      // A hard exit, not `process.exitCode`: pending writes would re-emit the same error.
      process.exit(code);
    });
  });

  const outcome = runSdpCli(process.argv.slice(2));

  if (typeof outcome === "number") {
    process.exitCode = outcome;
  } else {
    void outcome.then(
      (exitCode) => {
        process.exitCode = exitCode;
      },
      // A rejection here is an engine defect escaping every command-level catch (the commands
      // render their own failures); it still reports through the diagnostic currency and exits 1
      // instead of dying as an unhandled rejection.
      (error: unknown) => {
        writeStderr(defaultCliOutput, `sdp: ${errorMessage(error)}\n`);
        process.exitCode = 1;
      },
    );
  }
}
