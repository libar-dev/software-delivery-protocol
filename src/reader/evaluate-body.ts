import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import type { GraphSchema } from "../graph/schema.js";
import { createReader } from "./reader.js";
import type { Reader } from "./reader.js";
import type { ValidationReport } from "../validate/contracts.js";
import { validateGraph } from "../validate/validators.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function oneLine(message: string): string {
  return message.replace(/\s+/gu, " ").trim();
}

type RecipeCaller = (
  number: number,
  parameters?: Readonly<Record<string, unknown>>,
) => Promise<unknown>;

type CompiledBody = (
  g: Reader,
  graph: GraphSchema,
  report: ValidationReport,
  params: unknown,
  recipes?: RecipeCaller,
) => Promise<unknown>;

type AsyncBodyConstructor = new (...parameterNamesThenBody: readonly string[]) => CompiledBody;

/** Never called: it exists only so its prototype yields the async-function constructor. */
async function asyncBodyShape(): Promise<void> {
  await Promise.resolve();
}

/**
 * The body is a plain JavaScript async function body — no `import`/`export`, no TypeScript-only
 * syntax — so the runner never has to resolve a module on the operator's behalf and no staleness
 * switch exists to forget. `return` is the output contract. The binding names, in order, are the
 * scripted contract every recipe and skill depends on.
 */
export function compileBody(source: string): CompiledBody {
  const { constructor: AsyncBody } = Object.getPrototypeOf(asyncBodyShape) as {
    readonly constructor: AsyncBodyConstructor;
  };

  try {
    return new AsyncBody("g", "graph", "report", "params", "recipes", source);
  } catch (error) {
    // The function constructor omits positions. Compile the same body in a named wrapper
    // only on refusal, so evaluation keeps the constructor's existing runtime behavior.
    try {
      new Script(`(async function(g, graph, report, params, recipes) {\n${source}\n})`, {
        filename: "sdp-q-body",
      });
    } catch (syntaxError) {
      const stack = syntaxError instanceof Error ? (syntaxError.stack ?? "") : "";
      const position = /^sdp-q-body:(\d+)\n[^\n]*\n([^\n]*)\^/u.exec(stack);
      const lines = source.split("\n");
      const wrapperLine = Number(position?.[1] ?? 2);
      const line = Math.max(1, Math.min(lines.length, wrapperLine - 1));
      // An error on the wrapper's closing line means the body stopped short; the engine would
      // name the wrapper's own brace, a token the caller never wrote.
      const pastEnd = wrapperLine - 1 > lines.length;
      const column = pastEnd
        ? (lines[line - 1]?.length ?? 0) + 1
        : (position?.[2]?.length ?? 0) + 1;
      const message = pastEnd
        ? "the body ends before it is complete"
        : oneLine(errorMessage(syntaxError));
      throw new BodyParseError(line, column, message);
    }
    throw error;
  }
}

export class BodyParseError extends Error {
  constructor(line: number, column: number, message: string) {
    super(`the body does not parse at line ${String(line)}, column ${String(column)}: ${message}`);
  }
}

const queryAnswerShapeAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.query-answer-shapes"),
  label: "reports parse positions in the caller's query body",
  satisfies: ref("spec:consumers.agent-surface.evaluation-sink"),
  component: componentAnchorId("component:protocol.reader"),
  role: "service",
});
void queryAnswerShapeAnchor;

function plainObject(value: unknown): value is Readonly<Record<string, unknown>> {
  if (typeof value !== "object" || value === null) return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

// Both source tests and bundled entries read this package's built bodies. Walking from the
// module also works for the CommonJS main entry, whose bundle supplies __dirname.
function recipeDirectory(): string {
  let directory =
    typeof __dirname === "string" ? __dirname : dirname(fileURLToPath(import.meta.url));
  for (;;) {
    try {
      const metadata = JSON.parse(readFileSync(join(directory, "package.json"), "utf8")) as {
        name?: unknown;
      };
      if (metadata.name === "@libar-dev/software-delivery-protocol")
        return join(directory, "dist", "recipes");
    } catch {
      // A nested module directory need not hold package metadata.
    }
    const parent = dirname(directory);
    if (parent === directory) throw new Error("recipes: cannot locate the running package");
    directory = parent;
  }
}

/**
 * @sdpAnchor api:protocol.evaluate-body
 * @sdpLabel evaluates bodies and shipped recipes over one in-memory reader, graph and report
 * @sdpSatisfies spec:consumers.agent-surface.evaluation-sink
 * @sdpComponent component:protocol.reader
 * @sdpRole service
 */
export async function evaluateBody(
  body: string,
  input: {
    graph: GraphSchema;
    report?: ValidationReport;
    params?: Readonly<Record<string, unknown>>;
  },
): Promise<unknown> {
  return evaluateBodyWithReader(body, {
    ...input,
    reader: createReader(input.graph),
    report: input.report ?? validateGraph(input.graph),
  });
}

/** Internal entry for projections that already hold the build's reader and report. */
export async function evaluateBodyWithReader(
  body: string,
  input: {
    reader: Reader;
    graph: GraphSchema;
    report: ValidationReport;
    params?: Readonly<Record<string, unknown>>;
  },
): Promise<unknown> {
  const { reader: g, graph, report, params = {} } = input;
  if (!plainObject(params)) throw new Error("evaluateBody: params takes one parameters object");
  const compiled = compileBody(body);
  const recipeBodies = new Map<number, CompiledBody>();
  const recipes: RecipeCaller = async (number, parameters = {}) => {
    const directory = recipeDirectory();
    const file = Number.isInteger(number)
      ? readdirSync(directory).find((name) =>
          new RegExp(`^${String(number).padStart(2, "0")}-[a-z0-9-]+\\.js$`, "u").test(name),
        )
      : undefined;
    if (file === undefined)
      throw new Error(`recipes: the catalog holds no recipe ${String(number)}`);
    if (!plainObject(parameters))
      throw new Error(`recipes: recipe ${String(number)} takes one parameters object`);
    let recipeBody = recipeBodies.get(number);
    if (recipeBody === undefined) {
      recipeBody = compileBody(readFileSync(join(directory, file), "utf8"));
      recipeBodies.set(number, recipeBody);
    }
    return recipeBody(g, graph, report, parameters, recipes);
  };
  return compiled(g, graph, report, params, recipes);
}
