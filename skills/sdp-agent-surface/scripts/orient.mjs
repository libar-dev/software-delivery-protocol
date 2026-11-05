#!/usr/bin/env node
// Runs the orientation queries over one graph derivation and prints each answer under its
// heading and the line its body teaches, with the pointer to the notes that say how to read it.
//
//   node scripts/orient.mjs [--only N[,N]...] [--subjects JSON | @PATH] [--json] [--root PATH | --protocol] [--exclude PATH]... [--timeout MS]
//
// Each body under orientation/ takes its subject from `params` and derives a default from the
// graph when none is given, so the queries run in any corpus. In the Protocol source checkout,
// orientation/protocol-checkout.json supplies the subjects the notes were written against.
// `--subjects` replaces them, keyed by query number: '{"10":{"specs":["spec:example.id"]}}'.
// A subject that names no selected query, or a parameter its body does not read, is refused.
// A body with a `// Subject:` line takes what the agent arrives with; unless `--subjects` names
// it, its answer prints shortened, as a demonstration, beside the call that runs it in full.
// `--json` prints every answer in full. `--protocol` selects the root as the runner does.
// `--timeout` stops the graph query, and the CLI process that runs it, after that many milliseconds.

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspect } from "node:util";

import {
  optionArguments,
  protocolArguments,
  queryArguments,
  readsPackageRoot,
  selectRuntime,
  skewWarning,
} from "./q.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const bodies = join(here, "orientation");

/** The orientation queries in order: number, title, what each teaches, its subject, notes anchor and body. */
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
      const teaches = /^\/\/ Teaches: (?<line>.+)$/mu.exec(source)?.groups?.line;
      if (teaches === undefined) throw new Error(`orientation/${name} has no "// Teaches:" line`);
      const subject = /^\/\/ Subject: (?<json>.+)$/mu.exec(source)?.groups?.json;
      // The parameters the body reads, which are the only ones a subject may give it.
      const accepts = [
        ...new Set([...source.matchAll(/\bparams\.(?<key>[A-Za-z_]\w*)/gu)].map((m) => m[1])),
      ].sort();
      return {
        number,
        title: heading.title,
        teaches,
        subject,
        accepts,
        notes: `references/orientation.md#${anchor}`,
        source,
      };
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

/**
 * A demonstration's answer, shortened: each list keeps its first item and counts the rest, and
 * each string keeps its first hundred characters.
 */
export function compactAnswer(value) {
  if (Array.isArray(value)) {
    const kept = value.slice(0, 1).map(compactAnswer);
    return value.length > 1 ? [...kept, `… ${value.length - 1} more`] : kept;
  }
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, compactAnswer(item)]),
    );
  return typeof value === "string" && value.length > 100 ? `${value.slice(0, 100)}…` : value;
}

const subjectsUsage =
  `--subjects takes a JSON object keyed by answer number, each value an object of the parameters ` +
  `that answer reads, such as '{"8":{"terms":["vault"]}}'.`;

/** What each flag that takes a value says when it ends the line, where it would mean its default. */
const valueUsage = new Map([
  ["--timeout", "orient: --timeout takes a whole number of milliseconds"],
  ["--only", "orient: --only takes answer numbers joined by commas, such as --only 1,5"],
  ["--subjects", `orient: ${subjectsUsage}`],
  ["--root", "orient: --root takes a path"],
  ["--exclude", "orient: --exclude takes a path"],
]);

function parseArguments(given) {
  // `--name=value` reads as `--name value`, as the query runner reads it.
  const args = optionArguments(given, [...valueUsage.keys()]);
  const options = {
    only: undefined,
    subjects: undefined,
    json: false,
    timeout: undefined,
    pass: [],
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (valueUsage.has(arg) && index + 1 >= args.length) return { error: valueUsage.get(arg) };
    if (arg === "--json") options.json = true;
    else if (arg === "--timeout") {
      options.timeout = Number(args[++index]);
      if (!Number.isInteger(options.timeout) || options.timeout <= 0)
        return { error: "orient: --timeout takes a whole number of milliseconds" };
    } else if (arg === "--only") options.only = (args[++index] ?? "").split(",").map(Number);
    else if (arg === "--subjects") options.subjects = args[++index];
    else if (arg === "--root" || arg === "--exclude") options.pass.push(arg, args[++index] ?? "");
    else if (arg === "--protocol") options.pass.push(arg);
    else return { error: `orient: unknown argument ${arg}` };
  }
  return options;
}

/** A shell word for `value`: as written when every character is safe, else single-quoted. */
export function shellWord(value) {
  return /^[\w@%+=:,./-]+$/u.test(value) ? value : `'${value.replaceAll("'", `'\\''`)}'`;
}

/**
 * The subjects `--subjects` gives, checked against the selected queries before the graph derives:
 * `{ subjects }`, with `undefined` when none are given, or `{ error }`.
 */
export function readSubjects(value, queries, selected) {
  if (value === undefined) return { subjects: undefined };
  let parsed;
  try {
    parsed = JSON.parse(value.startsWith("@") ? readFileSync(value.slice(1), "utf8") : value);
  } catch (error) {
    return {
      error: `orient: --subjects is not readable JSON (${String(error?.message ?? error)}). ${subjectsUsage}`,
    };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))
    return { error: `orient: ${subjectsUsage}` };
  for (const [key, subject] of Object.entries(parsed)) {
    const query = queries.find((candidate) => String(candidate.number) === key);
    if (query === undefined)
      return { error: `orient: --subjects key "${key}" is no answer number. ${subjectsUsage}` };
    if (!selected.includes(query))
      return {
        error: `orient: --subjects gives answer ${key} a subject, but --only leaves it out.`,
      };
    const example = query.subject ?? "{}";
    if (subject === null || typeof subject !== "object" || Array.isArray(subject))
      return {
        error: `orient: answer ${key} takes an object of parameters, such as '${example}'.`,
      };
    const unread = Object.keys(subject).filter((name) => !query.accepts.includes(name));
    if (unread.length > 0)
      return {
        error: `orient: answer ${key} reads ${query.accepts.length === 0 ? "no parameters" : query.accepts.join(" or ")}, not ${unread.join(", ")}.`,
      };
  }
  return { subjects: parsed };
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
  const selected = protocolArguments(runtime, options.pass);
  if ("error" in selected) {
    console.error(selected.error);
    return 2;
  }

  const all = orientationQueries();
  const unknown = (options.only ?? []).filter(
    (number) => !all.some((query) => query.number === number),
  );
  if (unknown.length > 0) {
    console.error(
      `orient: --only names no answer ${unknown.join(", ")}; the answers are numbered ${String(all[0]?.number)} to ${String(all.at(-1)?.number)}.`,
    );
    return 2;
  }
  const queries = all.filter(
    (query) => options.only === undefined || options.only.includes(query.number),
  );
  const read = readSubjects(options.subjects, all, queries);
  if ("error" in read) {
    console.error(read.error);
    return 2;
  }
  const given = read.subjects;
  const subjects =
    given ??
    (runtime.mode === "source" && readsPackageRoot(runtime, selected.args)
      ? JSON.parse(readFileSync(join(bodies, "protocol-checkout.json"), "utf8"))
      : {});

  const result = spawnSync(
    process.execPath,
    queryArguments(runtime, [
      combinedBody(queries),
      "--params",
      JSON.stringify({ subjects }),
      "--json",
      ...selected.args,
    ]),
    {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      timeout: options.timeout,
      killSignal: "SIGKILL",
    },
  );
  if (result.error?.code === "ETIMEDOUT") {
    console.error(
      `orient: the graph query did not finish within ${String(options.timeout)} ms and was stopped; run orientation again without --timeout.`,
    );
    return 1;
  }
  if (result.status !== 0) {
    process.stderr.write(result.stderr ?? "");
    process.stdout.write(result.stdout ?? "");
    return result.status ?? 1;
  }
  const answers = JSON.parse(result.stdout);
  const failed = answers.filter((answer) => answer.error !== undefined);
  const script = relative(process.cwd(), process.argv[1] ?? fileURLToPath(import.meta.url));
  // The corpus this run read, so the printed call answers over the same graph.
  const corpus = options.pass.map((arg) => ` ${shellWord(arg)}`).join("");

  if (options.json) {
    const titled = answers.map((answer) => {
      const query = queries.find((q) => q.number === answer.number);
      return { ...answer, title: query?.title, teaches: query?.teaches, notes: query?.notes };
    });
    process.stdout.write(`${JSON.stringify(titled, null, 2)}\n`);
  } else {
    const render = (value) =>
      inspect(value, {
        depth: Infinity,
        maxArrayLength: Infinity,
        maxStringLength: Infinity,
        breakLength: 120,
      });
    for (const answer of answers) {
      const query = queries.find((q) => q.number === answer.number);
      const demonstration =
        query?.subject !== undefined && given?.[String(answer.number)] === undefined;
      process.stdout.write(`## ${answer.number}. ${query?.title}\nTeaches: ${query?.teaches}\n\n`);
      if (answer.error !== undefined) process.stdout.write(`FAILED: ${answer.error}\n`);
      else if (!demonstration) process.stdout.write(`${render(answer.answer)}\n`);
      else
        process.stdout.write(
          `${render(compactAnswer(answer.answer))}\n\nA shortened demonstration. In full, on what you hold:\n` +
            `node ${shellWord(script)} --only ${answer.number} --subjects ${shellWord(`{"${answer.number}":${query.subject}}`)}${corpus}\n`,
        );
      process.stdout.write(`\nRead it with ${query?.notes}\n\n`);
    }
  }
  // Extraction warnings reach stderr even when the graph derives, and the query's hint closes the
  // run: an agent must see both.
  process.stderr.write(result.stderr ?? "");
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
