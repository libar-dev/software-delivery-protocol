import type { StudioInputs } from "./inputs.js";
import { evaluateBodyWithReader } from "../../reader/evaluate-body.js";
import type { Reader } from "../../reader/reader.js";
import type { ValidationReport } from "../../validate/contracts.js";
import { graphReportId } from "../../validate/validators.js";
import type { Roadmaps } from "./pages/register-answers.js";

export interface StudioRecipeAnswers {
  readonly all: ReadonlyMap<number, unknown>;
  readonly packs: ReadonlyMap<string, unknown>;
  readonly slices: ReadonlyMap<string, unknown>;
  readonly packDiffs: ReadonlyMap<string, unknown>;
  readonly specs: ReadonlyMap<string, ReadonlyMap<number, unknown>>;
  readonly roadmapMemos: ReadonlyMap<string, string>;
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
 * @sdpSatisfies spec:consumers.spec-studio.data.recipe-answers
 * @sdpLabel evaluates shipped recipe bodies once and shares answers between Studio pages
 * @sdpReferences spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.reader, api:protocol.evaluate-body
 * @sdpRole service
 */
export async function studioRecipeAnswers(
  reader: Reader,
  report: ValidationReport,
  inputs: StudioInputs = { runs: [] },
): Promise<StudioRecipeAnswers> {
  const value = await evaluateBodyWithReader("return recipes;", {
    reader,
    graph: reader.graph,
    report,
    memoizeParameterlessRecipes: true,
  });
  if (typeof value !== "function") throw new Error("The body evaluator returned no recipe caller.");
  const evaluate = value as RecipeCaller;
  const all = new Map<number, unknown>();
  const packs = new Map<string, unknown>();
  const slices = new Map<string, unknown>();
  const packDiffs = new Map<string, unknown>();
  const specs = new Map<string, ReadonlyMap<number, unknown>>();
  const roadmapMemos = new Map<string, string>();
  for (const number of [17, 20, 24, 31, 33, 43, 44, 46, 51])
    all.set(number, await evaluate(number, {}));
  all.set(52, await evaluate(52, { detail: true }));
  const roadmaps = (await evaluate(53, {})) as Roadmaps;
  all.set(53, roadmaps);
  for (const roadmap of roadmaps.roadmaps) {
    const result = (await evaluate(55, { pack: roadmap.pack })) as { memo: string | null };
    if (result.memo === null) throw new Error(`Roadmap memo could not render: ${roadmap.pack}`);
    roadmapMemos.set(roadmap.pack, result.memo);
  }
  if (inputs.runs.length > 0) all.set(45, await evaluate(45, { runs: inputs.runs }));
  if (inputs.base !== undefined)
    all.set(35, await evaluate(35, { base: inputs.base.graph, detail: true }));
  for (const pack of reader.packs()) {
    packs.set(pack.id, await evaluate(29, { pack: pack.id }));
    slices.set(pack.id, await evaluate(54, { pack: pack.id, detail: true }));
    if (inputs.base !== undefined)
      packDiffs.set(
        pack.id,
        await evaluate(35, { base: inputs.base.graph, pack: pack.id, detail: true }),
      );
  }
  for (const spec of reader.specs()) {
    const answers = new Map<number, unknown>();
    answers.set(21, await evaluate(21, { spec: spec.id }));
    answers.set(30, await evaluate(30, { specs: [spec.id] }));
    if (spec.specKind !== "example") answers.set(34, await evaluate(34, { spec: spec.id }));
    specs.set(spec.id, answers);
  }
  return { all, packs, slices, packDiffs, specs, roadmapMemos };
}
