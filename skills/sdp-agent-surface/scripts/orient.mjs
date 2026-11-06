#!/usr/bin/env node
// Runs the orientation queries over one graph derivation and prints each answer as its number
// and title, the command that runs it, and its answer.
//
//   node scripts/orient.mjs [--only N[,N]...] [--subjects JSON | @PATH] [--json] [--root PATH | --protocol] [--exclude PATH]... [--timeout MS]
//
// Each body under orientation/ takes its subject from `params` and derives a default from the
// graph when none is given, so the queries run in any corpus. In the Protocol source checkout,
// orientation/protocol-checkout.json supplies the subjects the notes were written against.
// `--subjects` replaces them, keyed by query number: '{"10":{"specs":["spec:example.id"]}}'.
// A subject that names no selected query, a parameter its body does not read, or a value outside
// that parameter's form is refused.
// A body with a `// Subject:` line takes what the agent arrives with; unless `--subjects` names
// it, its answer prints shortened, as a demonstration, beside the call that runs it in full.
// `--json` prints every answer in full. `--protocol` selects the root as the runner does.
// `--timeout` stops the graph query, and the CLI process that runs it, after that many milliseconds.

import { spawnSync } from "node:child_process";
import {
  closeSync,
  mkdtempSync,
  openSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspect } from "node:util";

import {
  optionArguments,
  protocolArguments,
  queryArguments,
  readsPackageRoot,
  runnerEnvironment,
  selectRuntime,
  shellWord,
  skewWarning,
} from "./q.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const bodies = join(here, "orientation");

const isText = (value) => typeof value === "string";
const isTexts = (value) => Array.isArray(value) && value.every(isText);
const text = { form: "a string", fits: isText };
const texts = { form: "a list of strings", fits: isTexts };
const textOrTexts = {
  form: "a string or a list of strings",
  fits: (value) => isText(value) || isTexts(value),
};

/**
 * The form of each parameter an orientation body reads, checked before the graph derives. A body
 * that reads a parameter this map does not name does not load.
 */
const parameterForms = new Map([
  ["addresses", textOrTexts],
  ["decider", text],
  ["file", text],
  ["files", texts],
  ["pack", text],
  ["specs", textOrTexts],
  ["term", text],
  ["terms", textOrTexts],
]);

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
      const formless = accepts.filter((key) => !parameterForms.has(key));
      if (formless.length > 0)
        throw new Error(
          `orientation/${name} reads ${formless.map((key) => `params.${key}`).join(", ")}, which parameterForms gives no form`,
        );
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
 * The combined body for a run whose output this process cannot read. The answers print as the
 * query prints them; when a query failed, the body prints them itself and throws, so the query,
 * and with it the run, still exits 1.
 */
export function inheritedBody(queries) {
  return [
    `const answers = await (async () => {\n${combinedBody(queries)}\n})();`,
    "const failed = answers.filter((answer) => answer.error !== undefined).length;",
    "if (failed === 0) return answers;",
    "process.stdout.write(`${JSON.stringify(answers, null, 2)}\\n`);",
    "throw new Error(`${failed} of ${answers.length} orientation queries failed: report each as a finding.`);",
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
    for (const [name, value] of Object.entries(subject)) {
      const { form, fits } = parameterForms.get(name);
      if (!fits(value)) return { error: `orient: answer ${key} takes ${name} as ${form}.` };
    }
  }
  return { subjects: parsed };
}

/**
 * Runs Node on `args` and returns the child's status and output, which comes back through files
 * in a fresh temporary directory: some sandboxes, Codex's among them, refuse a child's piped
 * output, with EPERM or silently, yet let it write to a file this process opens. Where no
 * temporary directory can be made, as in a read-only sandbox, the output comes back through
 * pipes, and `refused` is set when those are refused too.
 */
function captured(args, options) {
  let place;
  try {
    place = mkdtempSync(join(tmpdir(), "sdp-orient-"));
  } catch {
    const piped = spawnSync(process.execPath, args, { ...options, encoding: "utf8" });
    return piped.error?.code === "EPERM" ? { ...piped, refused: true } : piped;
  }
  try {
    const out = openSync(join(place, "stdout"), "w");
    const err = openSync(join(place, "stderr"), "w");
    let run;
    try {
      // The child reads an empty standard input, as `input: ""` gives a piped one.
      run = spawnSync(process.execPath, args, {
        ...options,
        input: undefined,
        stdio: ["ignore", out, err],
      });
    } finally {
      closeSync(out);
      closeSync(err);
    }
    return {
      ...run,
      stdout: readFileSync(join(place, "stdout"), "utf8"),
      stderr: readFileSync(join(place, "stderr"), "utf8"),
    };
  } finally {
    rmSync(place, { recursive: true, force: true });
  }
}

// The recipe catalog by category and the call forms, as the CLI prints them after refusing a call
// with no body, each form run through the query runner beside this script: one source, so the
// listing is the installed package's own. It derives no graph.
function recipeCatalog(runtime) {
  const listed = captured([runtime.cli, "q"], {
    env: runnerEnvironment(),
    input: "",
    timeout: 30_000,
  });
  const text = listed.stderr ?? "";
  const start = text.indexOf("\n\n");
  return start === -1 || !text.includes("The recipes by category")
    ? undefined
    : text.slice(start + 2).trimEnd();
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
  // The subjects the notes were written against, which a call without --subjects reads here.
  const defaults =
    runtime.mode === "source" && readsPackageRoot(runtime, selected.args)
      ? JSON.parse(readFileSync(join(bodies, "protocol-checkout.json"), "utf8"))
      : {};
  const subjects = given ?? defaults;

  const graphQuery = (body) =>
    queryArguments(runtime, [
      body,
      "--params",
      JSON.stringify({ subjects }),
      "--json",
      ...selected.args,
    ]);
  const result = captured(graphQuery(combinedBody(queries)), {
    maxBuffer: 256 * 1024 * 1024,
    timeout: options.timeout,
    killSignal: "SIGKILL",
  });
  if (result.error?.code === "ETIMEDOUT") {
    console.error(
      `orient: the graph query did not finish within ${String(options.timeout)} ms and was stopped; run orientation again without --timeout.`,
    );
    return 1;
  }
  if (result.refused) {
    // A sandbox that refuses temporary files and piped output, as a read-only one does, may still
    // let the query write to this process's own output: the answers then print as the query
    // prints them, with no title, command or catalog, and a failed query still fails the run.
    console.error(
      "orient: this environment refuses a temporary file and captured output (EPERM), so the answers follow as `sdp q --json` prints them: a list of numbered answers, with no title or command beside each. references/orientation.md notes each by number; run scripts/q.mjs with no body for the recipe catalog. Report an answer with an `error` as a finding.",
    );
    const inherited = spawnSync(process.execPath, graphQuery(inheritedBody(queries)), {
      stdio: "inherit",
      timeout: options.timeout,
      killSignal: "SIGKILL",
    });
    if (inherited.error !== undefined) {
      console.error(`orient: the graph query did not run (${inherited.error.message}).`);
      return 1;
    }
    return inherited.status ?? 1;
  }
  if (result.error !== undefined) {
    console.error(
      result.error.code === "E2BIG"
        ? "orient: the subjects are too long to pass to the graph query; give fewer or shorter subjects."
        : `orient: the graph query did not run (${result.error.message}).`,
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
    // Each answer is its command and what that command prints: the command is the explanation.
    for (const answer of answers) {
      const query = queries.find((q) => q.number === answer.number);
      const key = String(answer.number);
      const own = given?.[key];
      const demonstration = query?.subject !== undefined && own === undefined;
      // An answer --subjects leaves out ran on no subject; where the checkout supplies one, the
      // command says so, or as printed it would read the checkout's subject instead.
      const leftOut = given !== undefined && own === undefined && Object.hasOwn(defaults, key);
      const subject =
        own !== undefined
          ? JSON.stringify({ [key]: own })
          : demonstration
            ? `{"${key}":${query.subject}}`
            : leftOut
              ? JSON.stringify({ [key]: {} })
              : undefined;
      const command = `node ${shellWord(script)} --only ${key}${subject === undefined ? "" : ` --subjects ${shellWord(subject)}`}${corpus}`;
      process.stdout.write(`## ${key}. ${query?.title}\n\n$ ${command}\n`);
      if (answer.error !== undefined) process.stdout.write(`FAILED: ${answer.error}\n\n`);
      else
        process.stdout.write(
          `${render(demonstration ? compactAnswer(answer.answer) : answer.answer)}\n\n`,
        );
    }
    const catalog = recipeCatalog(runtime);
    if (catalog !== undefined) process.stdout.write(`## Recipes\n\n${catalog}\n`);
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
  // A reader that stops early, as `orient.mjs | head` does, closes stdout: nobody reads the rest,
  // so the run ends quietly with the status it reached. Any other output error stays fatal.
  process.stdout.on("error", (error) => {
    if (error.code !== "EPIPE") throw error;
    // A hard exit: a pending write would raise the same error again.
    process.exit(process.exitCode ?? 0);
  });
  process.exitCode = main(process.argv.slice(2));
}
