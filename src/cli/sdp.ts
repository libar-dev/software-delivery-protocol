#!/usr/bin/env node

import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { SDP_HELP_TEXT, NEW_SPEC_HELP_TEXT, verbHelpText } from "./help.js";
import { runVault, runVaultWatch } from "./vault-command.js";
import type { VaultHooks } from "./vault-command.js";
import { runGenerate } from "./generate-command.js";
import type { GenerateHooks } from "./generate-command.js";
import { parseBuildArgs } from "./build-args.js";
import { BUILD_INFO_FILE, UNKNOWN_COMMIT, parseBuildCommit } from "./build-info.js";
import { runBuild } from "./build-command.js";
import { runCensus } from "./census-command.js";
import type { CensusHooks } from "./census-command.js";
import { runGherkinView } from "./gherkin-command.js";
import type { GherkinViewHooks } from "./gherkin-command.js";
import { parseImportArgs, runImport } from "./import-command.js";
import type { ImportHooks } from "./import-command.js";
import { parseNewSpecArgs, runNewSpec } from "./new-spec-command.js";
import { runMermaid } from "./mermaid-command.js";
import type { MermaidHooks } from "./mermaid-command.js";
import { defaultCliOutput, errorMessage, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";
import { parseQueryArgs, runQuery } from "./q-command.js";
import type { QueryHooks } from "./q-command.js";
import { runStamp } from "./stamp-command.js";
import { runStudio, runStudioWatch } from "./studio-command.js";
import type { StudioHooks } from "./studio-command.js";
import { runValidateWatch } from "./validate-watch.js";
import type { ValidateWatchHooks } from "./validate-watch.js";
import { runValidate, runValidateRules, runView } from "./validate-view-command.js";

export { SDP_HELP_TEXT } from "./help.js";

/** Reads one file the package ships, by URL; `sdp --version` reads through it. */
export type EngineFileReader = (url: URL) => string;

interface CliHooks
  extends
    CensusHooks,
    MermaidHooks,
    GherkinViewHooks,
    ValidateWatchHooks,
    StudioHooks,
    GenerateHooks,
    VaultHooks {
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
 * @sdpSatisfies spec:consumers.agent-surface, spec:consumers.command-line
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */

/**
 * @sdpAnchor impl:protocol.engine-provenance-cli
 * @sdpLabel prints sdp version and the commit parsed from the build-info file beside the compiled CLI
 * @sdpSatisfies spec:consumers.engine-provenance
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */

/**
 * The query and corpus-rule branches await operator-supplied async bodies;
 * `validate --watch` stays open until abort. Other branches complete synchronously. The dispatcher's return
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

  if (rest.includes("--help")) {
    const help = verbHelpText(command);
    if (help !== undefined) {
      writeStdout(output, `${help}\n`);
      return 0;
    }
  }

  if (command === "stamp") {
    const { version, commit } = readEngineProvenance(hooks.readEngineFile);
    return runStamp(rest, output, `sdp ${version} (${commit})`);
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
    command !== "studio" &&
    command !== "generate" &&
    command !== "vault" &&
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

    const parsed = parseNewSpecArgs(newRest, output);

    return parsed === undefined ? 1 : runNewSpec(parsed, output);
  }

  if (command === "q") {
    if (rest.includes("--help")) {
      writeStdout(output, `${SDP_HELP_TEXT}\n`);
      return 0;
    }
    const parsed = parseQueryArgs(rest, output);

    return parsed === undefined ? 1 : runQuery(parsed, output, hooks.query);
  }

  const parsed = parseBuildArgs(rest, output, command);

  if (parsed === undefined) {
    return 1;
  }

  if (command === "vault")
    return parsed.watch ? runVaultWatch(parsed, output, hooks) : runVault(parsed, output, hooks);

  if (command === "generate") return runGenerate(parsed, output, hooks);

  if (command === "build") {
    return runBuild(parsed, output, "build", hooks).exitCode;
  }

  if (command === "validate") {
    return parsed.watch
      ? runValidateWatch(parsed, output, hooks, hooks)
      : parsed.rules === undefined
        ? runValidate(parsed, output, "validate", hooks).exitCode
        : runValidateRules(parsed, output, hooks).then((result) => result.exitCode);
  }

  if (command === "view") {
    return runView(parsed, output, hooks);
  }

  if (command === "census") {
    return runCensus(parsed, output, hooks);
  }

  if (command === "studio") {
    return parsed.watch ? runStudioWatch(parsed, output, hooks) : runStudio(parsed, output, hooks);
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
    return realpathSync.native(executedPath) === realpathSync.native(fileURLToPath(moduleUrl));
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
