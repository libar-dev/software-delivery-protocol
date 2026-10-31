import { readFileSync } from "node:fs";
import type { CliOutput } from "./output.js";
import { errorMessage, oneLine, writeStderr } from "./output.js";

/** How a refusal names a parsed JSON value that is not an object. */
function jsonKind(value: unknown): string {
  return value === null ? "null" : Array.isArray(value) ? "an array" : `a ${typeof value}`;
}

/** Inspect object-key tokens before JSON.parse discards repeated keys. Nested values stay opaque. */
function repeatedTopLevelKey(source: string): string | undefined {
  if (!source.trimStart().startsWith("{")) return undefined;
  const keys = new Set<string>();
  let depth = 0;
  for (let index = 0; index < source.length; index++) {
    const character = source[index];
    if (character === '"') {
      const start = index;
      for (index++; index < source.length; index++) {
        if (source[index] === "\\") index++;
        else if (source[index] === '"') break;
      }
      if (depth !== 1) continue;
      let next = index + 1;
      while (/[ \t\r\n]/u.test(source[next] ?? "")) next++;
      if (source[next] !== ":") continue;
      const key: unknown = JSON.parse(source.slice(start, index + 1));
      if (typeof key !== "string") continue;
      if (keys.has(key)) return key;
      keys.add(key);
    } else if (character === "{" || character === "[") depth++;
    else if (character === "}" || character === "]") depth--;
  }
  return undefined;
}

/**
 * `--params` carries a recipe's parameter as data, never as body source: a JSON object inline, or
 * `@PATH` naming a file that holds one, or `KEY=@PATH` binding any JSON value to one key.
 * Paths resolve from the working directory. Each input is read and parsed
 * here, before the graph derives, so a value that is not JSON, JSON that is not an object, or a
 * file that cannot be read refuses the invocation before the body could run.
 */
function readParams(
  value: string,
  output: CliOutput,
  command: string,
): { readonly params: Readonly<Record<string, unknown>> } | undefined {
  let text = value;
  let source = "--params";
  let key: string | undefined;
  // Inline JSON and @PATH are recognized first, so `=@` inside either is never read as a key.
  const keyed = /^[ \t\r\n]*[{["]|^@/u.test(value) ? null : /^([^=]+)=@(.*)$/su.exec(value);
  if (keyed !== null) {
    key = keyed[1];
    if (key === undefined || !/^[a-z][A-Za-z0-9]*$/u.test(key)) {
      writeStderr(output, `sdp ${command}: --params KEY=@PATH requires a lower-camel key.\n`);
      return undefined;
    }
  }

  if (value.startsWith("@") || keyed !== null) {
    const path = keyed === null ? value.slice(1) : (keyed[2] ?? "");

    if (path === "") {
      writeStderr(output, `sdp ${command}: --params @PATH requires a path after @.\n`);
      return undefined;
    }

    source = `--params file ${JSON.stringify(path)}`;

    try {
      // A byte-order mark is not JSON text, though an editor may save one; it is dropped.
      text = readFileSync(path, "utf8").replace(/^\uFEFF/u, "");
    } catch (error) {
      writeStderr(
        output,
        `sdp ${command}: ${source} could not be read (${oneLine(errorMessage(error))}).\n`,
      );
      return undefined;
    }
  }

  let parsed: unknown;

  try {
    if (key === undefined) {
      const repeated = repeatedTopLevelKey(text);
      if (repeated !== undefined) {
        writeStderr(
          output,
          `sdp ${command}: --params key ${JSON.stringify(repeated)} was given twice.\n`,
        );
        return undefined;
      }
    }
    parsed = JSON.parse(text) as unknown;
  } catch (error) {
    writeStderr(
      output,
      `sdp ${command}: ${source} is not valid JSON (${oneLine(errorMessage(error))}).\n`,
    );
    return undefined;
  }

  if (key !== undefined) {
    return { params: { [key]: parsed } };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    writeStderr(
      output,
      `sdp ${command}: ${source} must be a JSON object, got ${jsonKind(parsed)}.\n`,
    );
    return undefined;
  }

  return { params: parsed as Readonly<Record<string, unknown>> };
}

/**
 * @sdpAnchor impl:protocol.parameter-codec
 * @sdpLabel decodes recipe parameters and refuses duplicate keys
 * @sdpSatisfies spec:consumers.agent-surface.recipe-parameters
 * @sdpComponent component:protocol.cli
 * @sdpRole codec
 */
export function mergeParams(
  forms: readonly string[],
  output: CliOutput,
  command: string,
): Readonly<Record<string, unknown>> | undefined {
  const params: Record<string, unknown> = {};
  for (const value of forms) {
    const supplied = readParams(value, output, command);
    if (supplied === undefined) return undefined;
    for (const [key, item] of Object.entries(supplied.params)) {
      if (Object.hasOwn(params, key)) {
        writeStderr(
          output,
          `sdp ${command}: --params key ${JSON.stringify(key)} was given twice.\n`,
        );
        return undefined;
      }
      Object.defineProperty(params, key, {
        value: item,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
  }
  return params;
}

/** File references in already validated parameter forms, for the validate watcher. */
export function parameterFiles(forms: readonly string[]): readonly string[] {
  return forms.flatMap((value) => {
    if (value.startsWith("@")) return [value.slice(1)];
    if (/^[ \t\r\n]*[{["]/u.test(value)) return [];
    const keyed = /^[^=]+=@(.*)$/su.exec(value);
    return keyed?.[1] === undefined ? [] : [keyed[1]];
  });
}
