import { lstatSync, mkdirSync, realpathSync, unlinkSync, writeFileSync } from "node:fs";
import type { PathLike } from "node:fs";
import { basename, dirname, isAbsolute, relative, resolve, sep } from "node:path";

import { reifyMarkdownCarrier } from "../extract/markdown.js";
import type { ReifiedSpec } from "../extract/reify.js";
import { specId } from "../ids.js";
import { emitMarkdownSpec } from "../import/emit-markdown.js";
import { SPEC_ALTITUDES, SPEC_KINDS } from "../model/descriptors.js";
import type { SpecAltitude, SpecKind } from "../model/descriptors.js";
import type { CliOutput } from "./output.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";

export const NEW_SPEC_HELP_TEXT = `sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME

Scaffold an honest idea-rung Markdown Spec. PATH is cwd-relative and must end
in .sdp.md; parent directories are created as needed. The file is never
overwritten. Readiness is always idea; relations are always empty. The kind's
typed section is a bare heading with no invented content. constraint emits
envelope, title, and Intent only, with no twin section.`;

const requiredFlags = ["--id", "--kind", "--altitude", "--title", "--outcome"] as const;

export interface NewSpecArgs {
  readonly path: string;
  readonly id: string;
  readonly kind: SpecKind;
  readonly altitude: SpecAltitude;
  readonly title: string;
  readonly outcome: string;
}

export interface NewSpecHooks {
  readonly mkdirSync?: (path: PathLike, options: { recursive: true }) => string | undefined;
  /** Runs after the parent is held and verified, before the write — tests inject a swap here. */
  readonly onBeforeScaffoldWrite?: () => void;
}

function refuse(output: CliOutput, message: string): void {
  writeStderr(output, `sdp new spec: ${message}\n`);
}

function takeFlagValue(
  flag: string,
  value: string | undefined,
  output: CliOutput,
): string | undefined {
  if (value === undefined) {
    refuse(output, `${flag} requires a value.`);
    return undefined;
  }

  if (value.startsWith("--")) {
    refuse(output, `${flag} expects a value, got ${value}`);
    return undefined;
  }

  return value;
}

function requireSingleLine(flag: string, value: string, output: CliOutput): string | undefined {
  if (value.trim().length === 0) {
    refuse(output, `${flag} requires a nonempty single-line value.`);
    return undefined;
  }

  if (value.includes("\n") || value.includes("\r")) {
    refuse(output, `${flag} must be a single line.`);
    return undefined;
  }

  return value;
}

export function parseNewSpecArgs(
  args: readonly string[],
  output: CliOutput,
): NewSpecArgs | undefined {
  if (args.includes("--help")) {
    writeStdout(output, `${NEW_SPEC_HELP_TEXT}\n`);
    return undefined;
  }

  let path: string | undefined;
  const values: Partial<Record<(typeof requiredFlags)[number], string>> = {};

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === undefined) {
      continue;
    }

    if (requiredFlags.some((flag) => flag === argument)) {
      const flag = argument as (typeof requiredFlags)[number];
      const value = takeFlagValue(flag, args[index + 1], output);

      if (value === undefined) {
        return undefined;
      }

      if (values[flag] !== undefined) {
        refuse(output, `${flag} may be supplied only once.`);
        return undefined;
      }

      values[flag] = value;
      index += 1;
      continue;
    }

    if (argument.startsWith("--")) {
      refuse(output, `unknown option ${argument}`);
      return undefined;
    }

    if (path !== undefined) {
      refuse(output, "takes exactly one PATH.");
      return undefined;
    }

    path = argument;
  }

  if (path === undefined) {
    refuse(output, "requires a cwd-relative .sdp.md PATH.");
    return undefined;
  }

  for (const flag of requiredFlags) {
    if (values[flag] === undefined) {
      refuse(output, `${flag} is required.`);
      return undefined;
    }
  }

  const id = values["--id"];
  const kind = values["--kind"];
  const altitude = values["--altitude"];
  const title = values["--title"];
  const outcome = values["--outcome"];

  if (
    id === undefined ||
    kind === undefined ||
    altitude === undefined ||
    title === undefined ||
    outcome === undefined
  ) {
    refuse(output, "requires --id, --kind, --altitude, --title, and --outcome.");
    return undefined;
  }

  const singleTitle = requireSingleLine("--title", title, output);
  const singleOutcome = requireSingleLine("--outcome", outcome, output);

  if (singleTitle === undefined || singleOutcome === undefined) {
    return undefined;
  }

  const ratifiedKind = SPEC_KINDS.find((candidate) => candidate === kind);

  if (ratifiedKind === undefined) {
    refuse(output, `--kind ${kind} is not a ratified Spec kind (${SPEC_KINDS.join(", ")}).`);
    return undefined;
  }

  const ratifiedAltitude = SPEC_ALTITUDES.find((candidate) => candidate === altitude);

  if (ratifiedAltitude === undefined) {
    refuse(
      output,
      `--altitude ${altitude} is not a ratified altitude (${SPEC_ALTITUDES.join(", ")}).`,
    );
    return undefined;
  }

  try {
    specId(id);
  } catch (error) {
    refuse(output, `--id ${errorMessage(error)}`);
    return undefined;
  }

  return {
    path,
    id,
    kind: ratifiedKind,
    altitude: ratifiedAltitude,
    title: singleTitle,
    outcome: singleOutcome,
  };
}

function isNotFound(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

function pathExists(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if (isNotFound(error)) {
      return false;
    }

    throw error;
  }
}

function containedWithin(candidate: string, root: string): boolean {
  const relativePath = relative(root, candidate);
  return relativePath !== ".." && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath);
}

function closestExistingAncestor(path: string): string | undefined {
  let current = path;

  for (;;) {
    try {
      lstatSync(current);
      return current;
    } catch (error) {
      if (!isNotFound(error)) {
        return undefined;
      }

      const parent = dirname(current);

      if (parent === current) {
        return undefined;
      }

      current = parent;
    }
  }
}

function workingDirectoryReal(output: CliOutput): string | undefined {
  try {
    return realpathSync(process.cwd());
  } catch (error) {
    refuse(
      output,
      `PATH cannot be resolved inside the current working directory: ${errorMessage(error)}`,
    );
    return undefined;
  }
}

function assertExistingBoundary(path: string, rootReal: string, output: CliOutput): boolean {
  const existing = closestExistingAncestor(path);

  if (existing === undefined) {
    refuse(output, "PATH cannot be resolved inside the current working directory.");
    return false;
  }

  try {
    const existingReal = realpathSync(existing);

    if (!containedWithin(existingReal, rootReal)) {
      refuse(output, "PATH escapes the current working directory through a parent symlink.");
      return false;
    }
  } catch (error) {
    refuse(
      output,
      `PATH escapes the current working directory through a parent symlink: ${errorMessage(error)}`,
    );
    return false;
  }

  return true;
}

function resolveScaffoldPath(rawPath: string, output: CliOutput): string | undefined {
  if (rawPath.trim().length === 0) {
    refuse(output, "PATH must be a nonempty cwd-relative .sdp.md path.");
    return undefined;
  }

  if (isAbsolute(rawPath)) {
    refuse(output, "PATH must be cwd-relative, not absolute.");
    return undefined;
  }

  const posixPath = rawPath.replaceAll("\\", "/");

  if (posixPath.split("/").includes("..")) {
    refuse(output, "PATH must stay cwd-relative and must not contain .. segments.");
    return undefined;
  }

  if (!posixPath.endsWith(".sdp.md") || posixPath.endsWith(".pack.sdp.md")) {
    refuse(output, "PATH must be a .sdp.md Spec carrier.");
    return undefined;
  }

  const cwd = process.cwd();
  const resolved = resolve(cwd, rawPath);
  const relativePath = relative(cwd, resolved);

  if (relativePath.startsWith(`..${sep}`) || relativePath === ".." || isAbsolute(relativePath)) {
    refuse(output, "PATH must stay cwd-relative and must not contain .. segments.");
    return undefined;
  }

  const cwdReal = workingDirectoryReal(output);

  if (cwdReal === undefined || !assertExistingBoundary(resolved, cwdReal, output)) {
    return undefined;
  }

  return resolved;
}

function scaffoldDocument(parsed: NewSpecArgs): string {
  const reified: ReifiedSpec = {
    data: {
      id: parsed.id,
      kind: parsed.kind,
      altitude: parsed.altitude,
      readiness: "idea",
      title: parsed.title,
      relations: [],
      intent: { outcome: parsed.outcome },
    },
    id: parsed.id,
    file: parsed.path,
    line: 1,
  };

  return emitMarkdownSpec(reified, { scaffold: true });
}

function acceptScaffoldDocument(
  document: string,
  parsed: NewSpecArgs,
  output: CliOutput,
): string | undefined {
  const extracted = reifyMarkdownCarrier(document, parsed.path);
  const hardError = extracted.findings.find((finding) => finding.severity === "error");

  if (hardError !== undefined || extracted.specs.length === 0) {
    const detail =
      hardError === undefined
        ? "the emitted Markdown is not accepted by the extractor"
        : `${hardError.validatorId} — ${hardError.message}`;
    refuse(output, `--outcome ${detail}`);
    return undefined;
  }

  return document;
}

export function runNewSpec(
  parsed: NewSpecArgs,
  output: CliOutput,
  hooks: NewSpecHooks = {},
): number {
  const targetPath = resolveScaffoldPath(parsed.path, output);

  if (targetPath === undefined) {
    return 1;
  }

  try {
    if (pathExists(targetPath)) {
      writeStderr(
        output,
        `sdp new spec: ${targetPath} already exists and will not be overwritten.\n`,
      );
      return 1;
    }
  } catch (error) {
    writeStderr(output, `sdp new spec: ${errorMessage(error)}\n`);
    return 1;
  }

  let document: string;

  try {
    const accepted = acceptScaffoldDocument(scaffoldDocument(parsed), parsed, output);

    if (accepted === undefined) {
      return 1;
    }

    document = accepted;
  } catch (error) {
    writeStderr(output, `sdp new spec: ${errorMessage(error)}\n`);
    return 1;
  }

  const createParent = hooks.mkdirSync ?? mkdirSync;
  const parentPath = dirname(targetPath);

  try {
    createParent(parentPath, { recursive: true });
  } catch (error) {
    writeStderr(output, `sdp new spec: ${errorMessage(error)}\n`);
    return 1;
  }

  const cwdReal = workingDirectoryReal(output);

  if (cwdReal === undefined) {
    return 1;
  }

  // The create must go through a held directory handle, never a re-traversed path: between any
  // path-based check and the write, the checked parent can be swapped for a symlink that
  // redirects the create outside the working directory. Node has no openat-style API, so chdir
  // is the handle — it binds the process to the parent's inode, the relative `wx` create names
  // that inode directly, and a swap after the bind cannot redirect it.
  const scaffoldName = basename(targetPath);
  let restoreCwd: string;

  try {
    restoreCwd = realpathSync(".");
    process.chdir(parentPath);
  } catch (error) {
    refuse(
      output,
      `PATH cannot be resolved inside the current working directory: ${errorMessage(error)}`,
    );
    return 1;
  }

  try {
    let heldReal: string;

    try {
      heldReal = realpathSync(".");
    } catch (error) {
      refuse(
        output,
        `PATH escapes the current working directory through a parent symlink: ${errorMessage(error)}`,
      );
      return 1;
    }

    if (!containedWithin(heldReal, cwdReal)) {
      refuse(output, "PATH escapes the current working directory through a parent symlink.");
      return 1;
    }

    hooks.onBeforeScaffoldWrite?.();

    try {
      if (pathExists(scaffoldName)) {
        writeStderr(
          output,
          `sdp new spec: ${targetPath} already exists and will not be overwritten.\n`,
        );
        return 1;
      }

      writeFileSync(scaffoldName, document, { encoding: "utf8", flag: "wx" });
    } catch (error) {
      writeStderr(output, `sdp new spec: ${errorMessage(error)}\n`);
      return 1;
    }

    // The held directory itself may have been renamed out of the working directory between the
    // verification and the write; the create followed the inode, so verify the landing spot and
    // undo a relocated scaffold. The success report happens here, immediately after the check and
    // while the handle is still held, so no operation separates the revalidation from the claim.
    try {
      if (!containedWithin(realpathSync("."), cwdReal)) {
        unlinkSync(scaffoldName);
        refuse(output, "PATH escapes the current working directory through a parent symlink.");
        return 1;
      }
    } catch (error) {
      refuse(
        output,
        `PATH escapes the current working directory through a parent symlink: ${errorMessage(error)}`,
      );
      return 1;
    }

    writeStdout(output, `Wrote ${targetPath}\n`);
    return 0;
  } finally {
    try {
      process.chdir(restoreCwd);
    } catch {
      try {
        process.chdir(cwdReal);
      } catch {
        // Both restore targets vanished concurrently; the CLI exits right after this return.
      }
    }
  }
}
