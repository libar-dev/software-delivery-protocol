import { readFileSync } from "node:fs";

import { Project } from "ts-morph";

import type { GraphSchema } from "../graph/schema.js";
import type { Pack } from "../model/pack.js";
import type { Spec } from "../model/spec.js";
import type { AuthoredModel } from "../validate/authored-model.js";
import type { Finding, ValidationReport } from "../validate/contracts.js";
import { deriveGraph } from "./derive.js";
import { discoverSpecFiles } from "./discover.js";
import { extractFindingIds, reifySourceFile } from "./reify.js";
import type { ReifiedPack, ReifiedSpec } from "./reify.js";

export { PROTOCOL_MODULE_SPECIFIER, extractFindingIds } from "./reify.js";
export { serializeGraph } from "./serialize.js";

export const extractValidatorId = "extract";

export interface ExtractOptions {
  /** The extraction root: every `*.sdp.ts` below it (minus tooling output) is read. */
  readonly root: string;
}

export interface ExtractionResult {
  readonly graph: GraphSchema;
  /**
   * The full extraction report — the existing `ValidationReport`/`Finding` currency, no parallel
   * shape. Extraction always completes and reports every finding (L3); with any hard error present
   * the emitted artifact is withheld by `sdp build`, but programmatic callers still get the
   * partial in-memory graph plus this report.
   */
  readonly report: ValidationReport;
  /**
   * The MD-14 Slice-1 bridge: the extractor now feeds the existing pre-graph floor checks through
   * this `AuthoredModel`; it dissolves at the Slice-3 re-key that points the validators at the
   * graph. Duplicated-id carriers stay in the model (truthful record of what was authored) but are
   * excluded from the graph, which cannot be keyed on an ambiguous id.
   */
  readonly model: AuthoredModel;
}

function compareCodeUnits(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  return left > right ? 1 : 0;
}

function sortFindings(findings: readonly Finding[]): readonly Finding[] {
  return [...findings].sort(
    (left, right) =>
      compareCodeUnits(left.file ?? "", right.file ?? "") ||
      (left.line ?? 0) - (right.line ?? 0) ||
      compareCodeUnits(left.validatorId, right.validatorId),
  );
}

function findDuplicatedIds(
  specs: readonly ReifiedSpec[],
  packs: readonly ReifiedPack[],
  findings: Finding[],
): ReadonlySet<string> {
  const sites = new Map<string, { file: string; line: number }[]>();

  for (const entry of [...specs, ...packs]) {
    const list = sites.get(entry.id) ?? [];
    list.push({ file: entry.file, line: entry.line });
    sites.set(entry.id, list);
  }

  const duplicated = new Set<string>();

  for (const [id, locations] of sites) {
    if (locations.length < 2) {
      continue;
    }

    duplicated.add(id);

    for (const location of locations) {
      findings.push({
        validatorId: extractFindingIds.duplicateId,
        family: "conformance",
        severity: "error",
        message: `${location.file}:${String(location.line)} — id "${id}" is reified from ${String(locations.length)} sites (ambiguity is loud, L2); every site is reported and none enters the graph`,
        subjectId: id,
        file: location.file,
        line: location.line,
      });
    }
  }

  return duplicated;
}

/**
 * The extractor — the producer, the only component that reads source (`03` §1), Slice 1: the
 * declared layer only. Spec files are reified standalone by pure AST reading (no type checker, no
 * tsconfig dependence, no import following — static reification without execution, MD-14), then
 * the one graph is derived. Anchors, `satisfies`/anchored-`verifies` edges, and the inferred layer
 * ride Slice 2; the graph-validator gate rides Slice 3.
 */
export function extract(options: ExtractOptions): ExtractionResult {
  const files = discoverSpecFiles(options.root);
  const project = new Project({ useInMemoryFileSystem: true });
  const specs: ReifiedSpec[] = [];
  const packs: ReifiedPack[] = [];
  const findings: Finding[] = [];

  for (const file of files) {
    const sourceText = readFileSync(file.absolutePath, "utf8");
    const sourceFile = project.createSourceFile(file.relativePath, sourceText);
    const reified = reifySourceFile(sourceFile, file.relativePath);
    specs.push(...reified.specs);
    packs.push(...reified.packs);
    findings.push(...reified.findings);
  }

  const duplicated = findDuplicatedIds(specs, packs, findings);
  const graph = deriveGraph(
    specs.filter((entry) => !duplicated.has(entry.id)),
    packs.filter((entry) => !duplicated.has(entry.id)),
  );

  const model: AuthoredModel = {
    specs: specs.map((entry) => entry.data as unknown as Spec),
    packs: packs.map((entry) => entry.data as unknown as Pack),
    // Anchor extraction rides Slice 2; an empty list is the honest Slice-1 reading.
    anchors: [],
  };

  return {
    graph,
    report: { validatorId: extractValidatorId, findings: sortFindings(findings) },
    model,
  };
}
