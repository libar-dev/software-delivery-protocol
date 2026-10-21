import { evaluateBodyWithReader } from "../../reader/evaluate-body.js";
import type { Reader } from "../../reader/reader.js";
import type { ValidationReport } from "../../validate/contracts.js";
import { graphReportId } from "../../validate/validators.js";

export interface StudioRecipeAnswers {
  readonly all: ReadonlyMap<number, unknown>;
  readonly packs: ReadonlyMap<string, unknown>;
  readonly specs: ReadonlyMap<string, ReadonlyMap<number, unknown>>;
}

type RecipeCaller = (
  number: number,
  params?: Readonly<Record<string, unknown>>,
) => Promise<unknown>;
export async function evaluateStudioRecipe(
  reader: Reader,
  number: number,
  params: Readonly<Record<string, unknown>> = {},
): Promise<unknown> {
  return evaluateBodyWithReader("return recipes(params.number, params.parameters);", {
    reader,
    graph: reader.graph,
    report: { validatorId: graphReportId, findings: reader.findings() },
    params: { number, parameters: params },
  });
}

/**
 * @sdpAnchor impl:protocol.studio-recipes
 * @sdpLabel evaluates shipped recipe bodies once and shares answers between Studio pages
 * @sdpReferences spec:consumers.spec-studio.data.recipe-answers, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.reader, api:protocol.evaluate-body
 * @sdpRole projection
 */
export async function studioRecipeAnswers(
  reader: Reader,
  report: ValidationReport,
): Promise<StudioRecipeAnswers> {
  const value = await evaluateBodyWithReader("return recipes;", {
    reader,
    graph: reader.graph,
    report,
  });
  if (typeof value !== "function") throw new Error("The body evaluator returned no recipe caller.");
  const evaluate = value as RecipeCaller;
  const all = new Map<number, unknown>();
  const packs = new Map<string, unknown>();
  const specs = new Map<string, ReadonlyMap<number, unknown>>();
  // Lane S3 adds recipe 46 for the queue.
  for (const number of [17, 20, 24, 31, 33, 43, 44, 51])
    all.set(number, await evaluate(number, {}));
  for (const pack of reader.packs()) packs.set(pack.id, await evaluate(29, { pack: pack.id }));
  for (const spec of reader.specs()) {
    const answers = new Map<number, unknown>();
    answers.set(21, await evaluate(21, { spec: spec.id }));
    answers.set(30, await evaluate(30, { specs: [spec.id] }));
    if (spec.specKind !== "example") answers.set(34, await evaluate(34, { spec: spec.id }));
    specs.set(spec.id, answers);
  }
  return { all, packs, specs };
}
