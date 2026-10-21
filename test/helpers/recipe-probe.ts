import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect } from "vitest";
import { recipeFiles } from "../../src/cli/build-artifacts.js";
import { compileBody } from "../../src/cli/q-command.js";
import { runSdpCli } from "../../src/cli/sdp.js";
import { createReader, validateGraph } from "../../src/index.js";
import type { GraphSchema } from "../../src/index.js";
import { createCaptureOutput } from "./cli-capture.js";

const catalog = fileURLToPath(new URL("../../docs/agent-surface/recipes.md", import.meta.url));

export async function catalogRecipe<T>(
  ordinal: number,
  graph: GraphSchema,
  params: Record<string, unknown> = {},
): Promise<T> {
  const recipe = recipeFiles(readFileSync(catalog, "utf8")).find((row) => row.ordinal === ordinal);
  if (recipe === undefined) throw new Error(`Missing recipe ${String(ordinal)}`);
  return (await compileBody(recipe.content)(
    createReader(graph),
    graph,
    validateGraph(graph),
    params,
  )) as T;
}

export async function shippedRecipe<T>(
  file: string,
  root: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const body = readFileSync(new URL(`../../dist/recipes/${file}`, import.meta.url), "utf8");
  const capture = createCaptureOutput();
  const exitCode = await runSdpCli(
    ["q", body, "--root", root, "--params", JSON.stringify(params), "--json"],
    capture.output,
  );
  expect({ exitCode, stderr: capture.readStderr() }).toEqual({ exitCode: 0, stderr: "" });
  return JSON.parse(capture.readStdout()) as T;
}
