import { mergeParams } from "./params.js";
import { readFileSync } from "node:fs";
import { isatty } from "node:tty";
import { inspect } from "node:util";
import { evaluateBody } from "../reader/evaluate-body.js";
export { compileBody } from "../reader/evaluate-body.js";

import { InvalidExcludePathError, normalizeExcludes } from "../extract/discover.js";
import { extract } from "../extract/index.js";
import type { GraphSchema } from "../graph/schema.js";
import { validateGraph } from "../validate/validators.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { resolveExtractionRoot } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { errorMessage, formatFinding, writeStderr, writeStdout } from "./output.js";

/**
 * The agent front door (`spec:decisions.agent-front-door`): one evaluation sink over the same
 * `createReader` seam the package exports. A single sink adds no query vocabulary, which is what
 * keeps it the opposite of the verb wall the agent-surface ruling forbids — the schema stays the
 * contract and the body does the composing.
 *
 * The trust stance is recorded, not implied: the sink evaluates operator-supplied JavaScript with
 * exactly the trust of running a local script through the package's own runner. No sandbox is
 * claimed and none exists. What the boundary does police is identity — a supplied root is resolved
 * and validated into a canonical absolute directory before extraction sees it.
 *
 * Freshness is derive-in-process, never a committed artifact read: the extractor runs on every
 * invocation so a just-authored Spec is queryable immediately and no stale `generated/` tree can
 * answer in the graph's name. This is not a second read of source — the sink never parses a
 * carrier; it consumes the extractor's derived output in memory, so the extractor remains the only
 * component that reads source.
 *
 * The sink writes nothing, anywhere. It is a pure read tool.
 */

/** The bounded default rendering: elision is `util.inspect`'s own visible notation, and `--json` is the exact escape. */
const inspectOptions = {
  depth: 4,
  maxArrayLength: 200,
  maxStringLength: 4000,
  breakLength: 100,
  colors: false,
} as const;

export interface QueryArgs {
  readonly root: string;
  readonly exclude: readonly string[];
  /** `undefined` means "not supplied on argv" — stdin decides whether that is a body or a refusal. */
  readonly body: string | undefined;
  readonly json: boolean;
  /** The JSON object `--params` supplied, already parsed, or `{}` without the flag. */
  readonly params: Readonly<Record<string, unknown>>;
}

export interface QueryHooks {
  readonly extract?: typeof extract;
  readonly isStdinTty?: () => boolean;
  readonly readStdin?: () => string;
}

function defaultIsStdinTty(): boolean {
  return isatty(0);
}

function defaultReadStdin(): string {
  return readFileSync(0, "utf8");
}

const queryParamsAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.query-params"),
  label: "reads --params as JSON data and injects it as the sink's fourth binding, params",
  satisfies: ref("spec:consumers.agent-surface.recipe-parameters"),
  component: componentAnchorId("component:protocol.cli"),
  role: "service",
});
void queryParamsAnchor;

export function parseQueryArgs(args: readonly string[], output: CliOutput): QueryArgs | undefined {
  let root: string | undefined;
  let body: string | undefined;
  let json = false;
  const rawParams: string[] = [];
  const rawExcludes: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === undefined) {
      continue;
    }

    if (argument === "--json") {
      json = true;
      continue;
    }

    if (argument === "--root" || argument === "--exclude") {
      const value = args[index + 1];

      if (value === undefined) {
        writeStderr(output, `sdp q: ${argument} requires a path.\n`);
        return undefined;
      }

      if (value.startsWith("--")) {
        writeStderr(output, `sdp q: ${argument} expects a path, got ${value}\n`);
        return undefined;
      }

      if (argument === "--root") {
        if (root !== undefined) {
          writeStderr(output, "sdp q takes at most one --root.\n");
          return undefined;
        }

        root = value;
      } else {
        rawExcludes.push(value);
      }

      index += 1;
      continue;
    }

    if (argument === "--params") {
      const value = args[index + 1];

      if (value === undefined) {
        writeStderr(output, "sdp q: --params requires a JSON object, @PATH or KEY=@PATH.\n");
        return undefined;
      }

      if (value.startsWith("--")) {
        writeStderr(
          output,
          `sdp q: --params expects a JSON object, @PATH or KEY=@PATH, got ${value}\n`,
        );
        return undefined;
      }

      rawParams.push(value);
      index += 1;
      continue;
    }

    if (argument.startsWith("--")) {
      writeStderr(output, `sdp q: unknown option ${argument}\n`);
      return undefined;
    }

    if (body !== undefined) {
      writeStderr(output, "sdp q takes at most one body argument.\n");
      return undefined;
    }

    body = argument;
  }

  let exclude: readonly string[];

  try {
    exclude = normalizeExcludes(rawExcludes);
  } catch (error) {
    if (error instanceof InvalidExcludePathError) {
      writeStderr(output, `sdp q: invalid --exclude path "${error.path}"\n`);
      return undefined;
    }

    throw error;
  }

  const resolvedRoot = resolveExtractionRoot(root, output, "q");

  if (resolvedRoot === undefined) {
    return undefined;
  }

  const params = mergeParams(rawParams, output, "q");
  if (params === undefined) return undefined;

  return { root: resolvedRoot, exclude, body, json, params };
}

/**
 * Body input is argv or stdin, and the choice is made by asking the file descriptor rather than by
 * probing a stream property: an interactive invocation with no body prints the usage line and
 * refuses instead of blocking on a terminal that will never send anything.
 */
function resolveBody(parsed: QueryArgs, output: CliOutput, hooks: QueryHooks): string | undefined {
  if (parsed.body !== undefined) {
    return parsed.body;
  }

  if ((hooks.isStdinTty ?? defaultIsStdinTty)()) {
    writeStderr(
      output,
      "sdp q: no body supplied and stdin is a terminal.\nPass the async function body as an argument or pipe it on stdin, for example: sdp q 'return g.specs().length'\n",
    );
    return undefined;
  }

  try {
    return (hooks.readStdin ?? defaultReadStdin)();
  } catch (error) {
    writeStderr(output, `sdp q: stdin could not be read (${errorMessage(error)}).\n`);
    return undefined;
  }
}

const buildPipelineQueryAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.build-pipeline-query"),
  label:
    "runQuery reads one body, derives the graph once for the reader, raw graph and report, and prints the return or refuses on stderr",
  satisfies: [
    ref("spec:extraction.build-pipeline"),
    ref("spec:consumers.agent-surface.evaluation-sink"),
  ],
  component: componentAnchorId("component:protocol.cli"),
  role: "service",
});
void buildPipelineQueryAnchor;

export async function runQuery(
  parsed: QueryArgs,
  output: CliOutput,
  hooks: QueryHooks = {},
): Promise<number> {
  const body = resolveBody(parsed, output, hooks);

  if (body === undefined) {
    return 1;
  }

  if (body.trim() === "") {
    writeStderr(output, "sdp q: the body is empty — `return` is the output contract.\n");
    return 1;
  }

  let graph: GraphSchema;

  try {
    const result = (hooks.extract ?? extract)({ root: parsed.root, exclude: parsed.exclude });

    for (const finding of result.report.findings) {
      writeStderr(output, formatFinding(finding));
    }

    if (result.report.findings.some((finding) => finding.severity === "error")) {
      writeStderr(output, "sdp q: the graph did not derive — the body was not run.\n");
      return 1;
    }

    graph = result.graph;
  } catch (error) {
    writeStderr(output, `sdp q: ${errorMessage(error)}\n`);
    return 1;
  }

  // Findings are data, never a gate: the sink hands the report to the body as `report` and runs it.
  // Checks police conformance and honesty; they have never gated the read path.
  let value: unknown;

  try {
    const report = validateGraph(graph);
    value = await evaluateBody(body, { graph, report, params: parsed.params });
  } catch (error) {
    writeStderr(output, `sdp q: ${errorMessage(error)}\n`);
    return 1;
  }

  // Rendering the return can throw too (a hostile custom-inspect method, a poisoned getter); it
  // reports through the one currency rather than escaping the sink as an unhandled rejection.
  try {
    return writeReturnValue(value, parsed.json, output);
  } catch (error) {
    writeStderr(output, `sdp q: ${errorMessage(error)}\n`);
    return 1;
  }
}

/**
 * `JSON.stringify` under its honest type: the lib says `string`, but a `toJSON` yielding
 * `undefined` really answers `undefined` — the case the `--json` path must refuse rather than
 * interpolate onto stdout.
 */
const stringifyValue: (value: unknown, replacer: undefined, space: number) => string | undefined =
  JSON.stringify;

function writeReturnValue(value: unknown, json: boolean, output: CliOutput): number {
  if (value === undefined) {
    writeStderr(output, "sdp q: the body returned nothing — `return` is the output contract.\n");
    return 0;
  }

  if (!json) {
    writeStdout(output, `${inspect(value, inspectOptions)}\n`);
    return 0;
  }

  if (typeof value === "function" || typeof value === "symbol") {
    writeStderr(output, `sdp q: a ${typeof value} return value has no JSON form.\n`);
    return 1;
  }

  let serialized: string | undefined;

  try {
    serialized = stringifyValue(value, undefined, 2);
  } catch (error) {
    writeStderr(
      output,
      `sdp q: the return value is not JSON-serializable (${errorMessage(error)}).\n`,
    );
    return 1;
  }

  // `JSON.stringify` answers `undefined` (not a throw) when a `toJSON` yields no JSON form;
  // interpolating that would put the literal text `undefined` on stdout under a success exit.
  if (serialized === undefined) {
    writeStderr(output, "sdp q: the return value has no JSON form.\n");
    return 1;
  }

  writeStdout(output, `${serialized}\n`);
  return 0;
}
