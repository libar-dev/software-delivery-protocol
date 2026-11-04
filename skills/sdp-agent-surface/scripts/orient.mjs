#!/usr/bin/env node
// Runs the orientation queries over one graph derivation and prints each answer under its
// heading, with the pointer to the notes that say how to read it.
//
//   node scripts/orient.mjs [--only N[,N]...] [--subjects JSON | @PATH] [--json] [--root PATH] [--exclude PATH]...
//
// Each body under orientation/ takes its subject from `params` and derives a default from the
// graph when none is given, so the queries run in any corpus. In the Protocol source checkout,
// orientation/protocol-checkout.json supplies the subjects the notes were written against.
// `--subjects` replaces them, keyed by query number: '{"10":{"specs":["spec:example.id"]}}'.

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspect } from "node:util";

import { queryArguments, selectRuntime, skewWarning } from "./q.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const bodies = join(here, "orientation");

/** The orientation queries in order: number, title, notes anchor and body. */
export function orientationQueries() {
  return readdirSync(bodies)
    .filter((name) => /^\d{2}-[a-z0-9-]+\.js$/u.test(name))
    .sort()
    .map((name) => {
      const source = readFileSync(join(bodies, name), "utf8");
      const heading = /^\/\/ (?<number>\d+)\. (?<title>[^:]+):/u.exec(source)?.groups;
      if (heading === undefined)
        throw new Error(`orientation/${name} does not open with its "// N. Title:" line`);
      const number = Number(heading.number);
      const anchor = `${number}-${heading.title
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/gu, "-")
        .replace(/-$/u, "")}`;
      return { number, title: heading.title, notes: `references/orientation.md#${anchor}`, source };
    });
}

/**
 * One `sdp q` body that runs every selected query over the same graph. Each query's body becomes
 * an async function of its own `params`, read from `params.subjects[N]`, so subjects stay data and
 * a failing query reports its error without stopping the rest.
 */
export function combinedBody(queries) {
  const calls = queries.map(
    (query) => `answers.push(await run(${query.number}, async (params) => {\n${query.source}\n}));`,
  );
  return [
    "const answers = [];",
    "const run = async (number, body) => {",
    "  try {",
    "    return { number, answer: await body(params.subjects?.[String(number)] ?? {}) };",
    "  } catch (error) {",
    "    return { number, error: String(error?.stack ?? error) };",
    "  }",
    "};",
    ...calls,
    "return answers;",
  ].join("\n");
}

function parseArguments(args) {
  const options = { only: undefined, subjects: undefined, json: false, pass: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") options.json = true;
    else if (arg === "--only") options.only = (args[++index] ?? "").split(",").map(Number);
    else if (arg === "--subjects") options.subjects = args[++index];
    else if (arg === "--root" || arg === "--exclude") options.pass.push(arg, args[++index] ?? "");
    else if (arg.startsWith("--root=") || arg.startsWith("--exclude=")) options.pass.push(arg);
    else return { error: `orient: unknown argument ${arg}` };
  }
  return options;
}

function readSubjects(value) {
  if (value === undefined) return undefined;
  const text = value.startsWith("@") ? readFileSync(value.slice(1), "utf8") : value;
  return JSON.parse(text);
}

function main(args) {
  const options = parseArguments(args);
  if ("error" in options) {
    console.error(options.error);
    return 2;
  }
  const runtime = selectRuntime();
  if ("error" in runtime) {
    console.error(runtime.error);
    return 2;
  }
  const warning = skewWarning(runtime);
  if (warning !== undefined) console.error(warning);

  const queries = orientationQueries().filter(
    (query) => options.only === undefined || options.only.includes(query.number),
  );
  const ownRoot = options.pass.some((arg) => arg === "--root" || arg.startsWith("--root="));
  const subjects =
    readSubjects(options.subjects) ??
    (runtime.mode === "source" && !ownRoot
      ? JSON.parse(readFileSync(join(bodies, "protocol-checkout.json"), "utf8"))
      : {});

  const result = spawnSync(
    process.execPath,
    queryArguments(runtime, [
      combinedBody(queries),
      "--params",
      JSON.stringify({ subjects }),
      "--json",
      ...options.pass,
    ]),
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );
  if (result.status !== 0) {
    process.stderr.write(result.stderr ?? "");
    process.stdout.write(result.stdout ?? "");
    return result.status ?? 1;
  }
  const answers = JSON.parse(result.stdout);
  const failed = answers.filter((answer) => answer.error !== undefined);

  if (options.json) {
    const titled = answers.map((answer) => {
      const query = queries.find((q) => q.number === answer.number);
      return { ...answer, title: query?.title, notes: query?.notes };
    });
    process.stdout.write(`${JSON.stringify(titled, null, 2)}\n`);
  } else {
    for (const answer of answers) {
      const query = queries.find((q) => q.number === answer.number);
      process.stdout.write(`## ${answer.number}. ${query?.title}\n\n`);
      process.stdout.write(
        answer.error === undefined
          ? `${inspect(answer.answer, { depth: Infinity, maxArrayLength: Infinity, maxStringLength: Infinity, breakLength: 120 })}\n`
          : `FAILED: ${answer.error}\n`,
      );
      process.stdout.write(`\nRead it with ${query?.notes}\n\n`);
    }
  }
  if (failed.length > 0) {
    console.error(
      `orient: ${failed.length} of ${answers.length} queries failed: report each as a finding.`,
    );
    return 1;
  }
  return 0;
}

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
) {
  process.exitCode = main(process.argv.slice(2));
}
