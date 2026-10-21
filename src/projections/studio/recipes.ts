import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { compileBody } from "../../cli/q-command.js";
import type { Reader } from "../../reader/reader.js";
import type { ValidationReport } from "../../validate/contracts.js";
import { validateGraph } from "../../validate/validators.js";

export interface StudioRecipeAnswers {
  readonly all: ReadonlyMap<number, unknown>;
  readonly packs: ReadonlyMap<string, unknown>;
  readonly specs: ReadonlyMap<string, ReadonlyMap<number, unknown>>;
}

const cache = new WeakMap<
  Reader,
  {
    report: ValidationReport;
    files: readonly string[];
    bodies: Map<number, ReturnType<typeof compileBody>>;
  }
>();
const directory = (): string =>
  fileURLToPath(
    new URL(
      import.meta.url.endsWith(".ts") ? "../../../dist/recipes/" : "../recipes/",
      import.meta.url,
    ),
  );

// R1 replaces this adapter with evaluateBody. No page owns an evaluation path.
export async function evaluateStudioRecipe(
  reader: Reader,
  number: number,
  params: Readonly<Record<string, unknown>> = {},
): Promise<unknown> {
  const dir = directory();
  let build = cache.get(reader);
  if (build === undefined) {
    build = { report: validateGraph(reader.graph), files: readdirSync(dir), bodies: new Map() };
    cache.set(reader, build);
  }
  let body = build.bodies.get(number);
  if (body === undefined) {
    const file = build.files.find(
      (name) => name.startsWith(`${String(number).padStart(2, "0")}-`) && name.endsWith(".js"),
    );
    if (file === undefined) throw new Error(`Studio recipe ${String(number)} is not shipped`);
    body = compileBody(readFileSync(`${dir}/${file}`, "utf8"));
    build.bodies.set(number, body);
  }
  return body(reader, reader.graph, build.report, params);
}

/**
 * @sdpAnchor impl:protocol.studio-recipes
 * @sdpLabel evaluates shipped recipe bodies once and shares answers between Studio pages
 * @sdpReferences spec:consumers.spec-studio.data.recipe-answers, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.reader, impl:protocol.build-pipeline-query
 * @sdpRole projection
 */
export async function studioRecipeAnswers(reader: Reader): Promise<StudioRecipeAnswers> {
  const all = new Map<number, unknown>();
  const packs = new Map<string, unknown>();
  const specs = new Map<string, ReadonlyMap<number, unknown>>();
  // Later slices add their assigned bodies to this list when those bodies ship.
  for (const number of [17, 20, 24, 31, 33, 43, 44])
    all.set(number, await evaluateStudioRecipe(reader, number));
  for (const pack of reader.packs())
    packs.set(pack.id, await evaluateStudioRecipe(reader, 29, { pack: pack.id }));
  for (const spec of reader.specs()) {
    const answers = new Map<number, unknown>();
    answers.set(21, await evaluateStudioRecipe(reader, 21, { spec: spec.id }));
    answers.set(30, await evaluateStudioRecipe(reader, 30, { specs: [spec.id] }));
    if (spec.specKind !== "example")
      answers.set(34, await evaluateStudioRecipe(reader, 34, { spec: spec.id }));
    specs.set(spec.id, answers);
  }
  return { all, packs, specs };
}
