import { evaluateBody } from "../../reader/evaluate-body.js";
import type { Reader } from "../../reader/reader.js";

export interface StudioRecipeAnswers {
  readonly all: ReadonlyMap<number, unknown>;
  readonly packs: ReadonlyMap<string, unknown>;
  readonly specs: ReadonlyMap<string, ReadonlyMap<number, unknown>>;
}

type RecipeCaller = (
  number: number,
  params?: Readonly<Record<string, unknown>>,
) => Promise<unknown>;
const callers = new WeakMap<Reader, Promise<RecipeCaller>>();

export async function evaluateStudioRecipe(
  reader: Reader,
  number: number,
  params: Readonly<Record<string, unknown>> = {},
): Promise<unknown> {
  let caller = callers.get(reader);
  if (caller === undefined) {
    // Retain one evaluator context for the build so every call shares its graph and report.
    caller = evaluateBody("return recipes;", { graph: reader.graph }).then((value) => {
      if (typeof value !== "function")
        throw new Error("The body evaluator returned no recipe caller.");
      return value as RecipeCaller;
    });
    callers.set(reader, caller);
  }
  return (await caller)(number, params);
}

/**
 * @sdpAnchor impl:protocol.studio-recipes
 * @sdpLabel evaluates shipped recipe bodies once and shares answers between Studio pages
 * @sdpReferences spec:consumers.spec-studio.data.recipe-answers, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.reader, api:protocol.evaluate-body
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
