import { readFileSync, readdirSync } from "node:fs";
import type { Session } from "node:inspector";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import { ts } from "ts-morph";
import type { GraphSchema } from "../graph/schema.js";
import { createReader } from "./reader.js";
import type { Reader } from "./reader.js";
import type { ValidationReport } from "../validate/contracts.js";
import { validateGraph } from "../validate/validators.js";

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
    // The function constructor omits positions. Diagnose the same body in a named wrapper only
    // on refusal, so evaluation keeps the constructor's existing runtime behavior.
    throw diagnoseRefusal(source, error);
  }
}

const bodyFile = "sdp-q-body";
const wrapperHead = "(async function(g, graph, report, params, recipes) {\n";

// The engine ends a line at LF, CR, CRLF (one terminator), U+2028 and U+2029. Positions count
// lines the same way, or a body split by CR alone would be read as one line.
const lineTerminators = /\r\n|[\n\r\u2028\u2029]/gu;

function diagnoseRefusal(source: string, refusal: unknown): BodyParseError {
  const wrapper = `${wrapperHead}${source}\n})`;
  const lines = source.split(lineTerminators);
  const lastLine = lines.length;
  const pastEnd = (message: string) =>
    new BodyParseError(lastLine, (lines[lastLine - 1]?.length ?? 0) + 1, message);
  const closingEarly = (): BodyParseError | undefined => {
    const brace = closingBrace(wrapper) - wrapperHead.length;
    if (brace < 0 || brace >= source.length) return undefined;
    const { line, column } = bodyPosition(source, brace);
    return new BodyParseError(
      line,
      column,
      "this brace closes the function the body runs in, before the body ends",
    );
  };

  try {
    new Script(wrapper, { filename: bodyFile });
  } catch (syntaxError) {
    const stack = syntaxError instanceof Error ? (syntaxError.stack ?? "") : "";
    // The line and the caret are read apart: Node prints a caret only when the error's range
    // ends on its first line, yet the line it names still marks where the error starts.
    const lineMatch = /^sdp-q-body:(\d+)/u.exec(stack);
    const caret = /^sdp-q-body:\d+\n[^\n]*\n([^\n^]*)\^/u.exec(stack);
    const wrapperLine = Number(lineMatch?.[1] ?? 2);
    // An error on the wrapper's closing line means the body stopped short or closed the wrapper
    // early; never name the wrapper's own brace, a token the caller never wrote.
    if (wrapperLine - 1 > lastLine) {
      return closingEarly() ?? pastEnd("the body ends before it is complete");
    }
    const line = Math.max(1, wrapperLine - 1);
    const caretColumn = caret?.[1] === undefined ? undefined : caret[1].length + 1;
    const column =
      caretColumn ?? engineColumn(wrapper, wrapperLine) ?? (lines[line - 1]?.length ?? 0) + 1;
    return new BodyParseError(line, column, oneLine(errorMessage(syntaxError)));
  }

  // The wrapper compiles while the constructor refused: the body closed the function it runs in
  // and went on outside it, which the constructor's single-function check refuses.
  return closingEarly() ?? pastEnd(oneLine(errorMessage(refusal)));
}

/**
 * The engine's own start column for an error on `wrapperLine`, read through an in-process
 * inspector session: the stack carries no caret once the error's range runs past its first line.
 * Without an inspector (a build without one, or a permission model that withholds it), the
 * caller places the error at the end of that line, which the error's range still covers.
 */
function engineColumn(wrapper: string, wrapperLine: number): number | undefined {
  let session: Session;
  try {
    session = new (process.getBuiltinModule("node:inspector").Session)();
    session.connect();
  } catch {
    return undefined;
  }
  let column: number | undefined;
  try {
    session.post("Runtime.enable");
    session.post(
      "Runtime.compileScript",
      { expression: wrapper, sourceURL: bodyFile, persistScript: false },
      (error, result) => {
        const details = error === null ? result.exceptionDetails : undefined;
        if (details?.lineNumber === wrapperLine - 1) column = details.columnNumber + 1;
      },
    );
  } finally {
    session.disconnect();
  }
  return column;
}

/** The offset of the brace that closes the wrapper's function, read from its recoverable parse. */
function closingBrace(wrapper: string): number {
  const file = ts.createSourceFile(
    `${bodyFile}.js`,
    wrapper,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.JS,
  );
  // The wrapper's function starts right after its opening parenthesis, whatever follows it.
  const functionAt = (node: ts.Node): ts.FunctionExpression | undefined =>
    ts.isFunctionExpression(node) && node.getStart(file) === 1
      ? node
      : ts.forEachChild(node, (child) =>
          child.pos <= 1 && child.end > 1 ? functionAt(child) : undefined,
        );
  return (functionAt(file)?.body.end ?? 0) - 1;
}

function bodyPosition(source: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lineStart = 0;
  for (const terminator of source.matchAll(lineTerminators)) {
    const next = terminator.index + terminator[0].length;
    if (next > offset) break;
    line += 1;
    lineStart = next;
  }
  return { line, column: offset - lineStart + 1 };
}

export class BodyParseError extends Error {
  constructor(line: number, column: number, message: string) {
    super(`the body does not parse at line ${String(line)}, column ${String(column)}: ${message}`);
  }
}

function plainObject(value: unknown): value is Readonly<Record<string, unknown>> {
  if (typeof value !== "object" || value === null) return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function freezeAnswer(value: unknown, seen = new Set<object>()): unknown {
  if (typeof value !== "object" || value === null || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) freezeAnswer(child, seen);
  return Object.freeze(value);
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
  const report = input.report ?? validateGraph(input.graph);
  return evaluateBodyWithReader(body, {
    ...input,
    reader: createReader(input.graph, report),
    report,
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
    memoizeParameterlessRecipes?: boolean;
  },
): Promise<unknown> {
  const { reader: g, graph, report, params = {} } = input;
  if (!plainObject(params)) throw new Error("evaluateBody: params takes one parameters object");
  const compiled = compileBody(body);
  const recipeBodies = new Map<number, CompiledBody>();
  const answers = new Map<number, Promise<unknown>>();
  const recipes: RecipeCaller = async (number, parameters = {}) => {
    if (!Number.isInteger(number))
      throw new Error(`recipes: ${String(number)} is not a recipe number`);
    const directory = recipeDirectory();
    const file = readdirSync(directory).find((name) =>
      new RegExp(`^${String(number).padStart(2, "0")}-[a-z0-9-]+\\.js$`, "u").test(name),
    );
    if (file === undefined)
      throw new Error(`recipes: the catalog holds no recipe ${String(number)}`);
    if (!plainObject(parameters))
      throw new Error(`recipes: recipe ${String(number)} takes one parameters object`);
    let recipeBody = recipeBodies.get(number);
    if (recipeBody === undefined) {
      recipeBody = compileBody(readFileSync(join(directory, file), "utf8"));
      recipeBodies.set(number, recipeBody);
    }
    if (input.memoizeParameterlessRecipes && Object.keys(parameters).length === 0) {
      const previous = answers.get(number);
      if (previous !== undefined) return previous;
      const answer = recipeBody(g, graph, report, parameters, recipes).then((value) =>
        freezeAnswer(value),
      );
      answers.set(number, answer);
      return answer;
    }
    return recipeBody(g, graph, report, parameters, recipes);
  };
  return compiled(g, graph, report, params, recipes);
}
