import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

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
typed section is a bare heading with no invented content. constraint has no
lawful bare skeleton and is refused.`;

const requiredFlags = ["--id", "--kind", "--altitude", "--title", "--outcome"] as const;

export interface NewSpecArgs {
  readonly path: string;
  readonly id: string;
  readonly kind: SpecKind;
  readonly altitude: SpecAltitude;
  readonly title: string;
  readonly outcome: string;
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

  if (ratifiedKind === "constraint") {
    refuse(
      output,
      "--kind constraint has no lawful bare skeleton: Constraints require one statement, and a scaffolder must not invent that content.",
    );
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

export function runNewSpec(parsed: NewSpecArgs, output: CliOutput): number {
  const targetPath = resolveScaffoldPath(parsed.path, output);

  if (targetPath === undefined) {
    return 1;
  }

  if (existsSync(targetPath)) {
    writeStderr(
      output,
      `sdp new spec: ${targetPath} already exists and will not be overwritten.\n`,
    );
    return 1;
  }

  try {
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, scaffoldDocument(parsed), { encoding: "utf8", flag: "wx" });
  } catch (error) {
    writeStderr(output, `sdp new spec: ${errorMessage(error)}\n`);
    return 1;
  }

  writeStdout(output, `Wrote ${targetPath}\n`);
  return 0;
}
