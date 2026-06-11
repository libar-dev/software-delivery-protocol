import { readFileSync } from "node:fs";

import { Project } from "ts-morph";
import type { Program, SourceFile } from "ts-morph";

import type { GraphSchema } from "../graph/schema.js";
import type { Finding, ValidationReport } from "../validate/contracts.js";
import { reifyAnchorSourceFile } from "./anchors.js";
import type { ReifiedAnchor } from "./anchors.js";
import { deriveGraph } from "./derive.js";
import { discoverFiles } from "./discover.js";
import type { DiscoveredSourceFile } from "./discover.js";
import { PROTOCOL_MODULE_SPECIFIER, extractFindingIds, reifySourceFile } from "./reify.js";
import type { ReifiedPack, ReifiedSpec } from "./reify.js";

export { PROTOCOL_MODULE_SPECIFIER, extractFindingIds } from "./reify.js";
export { serializeGraph } from "./serialize.js";

export const extractValidatorId = "extract";

export interface ExtractOptions {
  /**
   * The extraction root: every `*.sdp.ts` below it (minus tooling output) is read as the declared
   * layer, and every other `*.ts`/`*.tsx` source file is swept for anchor constants (the anchored
   * layer).
   */
  readonly root: string;
}

export interface ExtractionCounts {
  readonly specs: number;
  readonly packs: number;
  readonly anchors: number;
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
   * Authored-carrier counts as reified — duplicate-id carriers included: the truthful record of
   * what was authored even when ambiguity (L2) excludes a carrier from the graph, which cannot be
   * keyed on an ambiguous id. Everything else about the authored layer is read off the graph
   * itself (one validation path, MD-14).
   */
  readonly counts: ExtractionCounts;
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
  anchors: readonly ReifiedAnchor[],
  findings: Finding[],
): ReadonlySet<string> {
  const sites = new Map<string, { file: string; line: number }[]>();

  for (const entry of [...specs, ...packs, ...anchors]) {
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
        message: `id "${id}" is reified from ${String(locations.length)} sites (ambiguity is loud, L2); every site is reported and none enters the graph`,
        subjectId: id,
        file: location.file,
        line: location.line,
      });
    }
  }

  return duplicated;
}

interface ParsedSourceFile {
  readonly file: DiscoveredSourceFile;
  readonly sourceFile: SourceFile;
}

/**
 * A file carrying a syntactic diagnostic is excluded whole: the parser is error-tolerant, so past
 * the first syntax error the recovered AST is guesswork — content bleeds between carriers — and
 * reifying it would put unfaithful shapes in the graph, or silently drop a binding the author
 * believes exists (L2). One hard error per file, carrying the first diagnostic; every other file
 * still extracts (graceful partial extraction, L3, at file granularity).
 */
function fileParses(program: Program, source: ParsedSourceFile, findings: Finding[]): boolean {
  const [firstDiagnostic] = program.getSyntacticDiagnostics(source.sourceFile);

  if (firstDiagnostic === undefined) {
    return true;
  }

  const text = firstDiagnostic.getMessageText();

  findings.push({
    validatorId: extractFindingIds.parseError,
    family: "conformance",
    severity: "error",
    message: `the file does not parse: ${typeof text === "string" ? text : text.getMessageText()} — the error-tolerant parse recovers by guessing, so the file cannot be reified faithfully and its content is excluded from the graph (ambiguity is loud, L2)`,
    file: source.file.relativePath,
    line: firstDiagnostic.getLineNumber(),
  });

  return false;
}

/**
 * The extractor — the producer, the only component that reads source (`03` §1): the declared
 * layer (spec files, pack manifests) plus the anchored layer (anchor constants in source files).
 * Files are reified standalone by pure AST reading (no type checker, no tsconfig dependence, no
 * import following — static reification without execution, MD-14); a file that does not parse is
 * excluded whole, loudly (`fileParses`). Then the one graph is derived, delivery facts included.
 * The conformance + honesty checks consume the graph (`validateGraph`), never any pre-graph
 * shape. The inferred layer is empty by decision, not omission: its consumers (the reader's entry
 * adapters and file-level impact) resolve off the curated layers (`06` §2), so the first inferred
 * producer is the aspirational impact graph.
 */
export function extract(options: ExtractOptions): ExtractionResult {
  const files = discoverFiles(options.root);
  // The project only ever parses: reification is pure AST reading and the program exists solely
  // for syntactic diagnostics, so the default lib would never be read — `noLib` skips loading it.
  const project = new Project({ useInMemoryFileSystem: true, compilerOptions: { noLib: true } });
  const specs: ReifiedSpec[] = [];
  const packs: ReifiedPack[] = [];
  const anchors: ReifiedAnchor[] = [];
  const findings: Finding[] = [];
  const specSources: ParsedSourceFile[] = [];
  const anchorSources: ParsedSourceFile[] = [];

  for (const file of files.specFiles) {
    const sourceText = readFileSync(file.absolutePath, "utf8");
    specSources.push({ file, sourceFile: project.createSourceFile(file.relativePath, sourceText) });
  }

  for (const file of files.anchorCandidateFiles) {
    const sourceText = readFileSync(file.absolutePath, "utf8");

    // Anchors are recognized by import binding, and the contract takes the specifier written
    // verbatim — so a raw text test skips the AST work for the bulk of source files. An
    // escape-spelled specifier (same cooked value, different raw text) sits outside the binding
    // contract here, exactly as `require` and re-aliased locals do.
    if (!sourceText.includes(PROTOCOL_MODULE_SPECIFIER)) {
      continue;
    }

    anchorSources.push({
      file,
      sourceFile: project.createSourceFile(file.relativePath, sourceText),
    });
  }

  // One program, requested after every file is added: ts-morph rebuilds the program whenever a
  // file lands, so asking per file would redo the work quadratically.
  const program = project.getProgram();

  for (const source of specSources) {
    if (!fileParses(program, source, findings)) {
      continue;
    }

    const reified = reifySourceFile(source.sourceFile, source.file.relativePath);
    specs.push(...reified.specs);
    packs.push(...reified.packs);
    findings.push(...reified.findings);
  }

  for (const source of anchorSources) {
    if (!fileParses(program, source, findings)) {
      continue;
    }

    const reified = reifyAnchorSourceFile(source.sourceFile, source.file.relativePath);
    anchors.push(...reified.anchors);
    findings.push(...reified.findings);
  }

  const duplicated = findDuplicatedIds(specs, packs, anchors, findings);
  const graph = deriveGraph(
    specs.filter((entry) => !duplicated.has(entry.id)),
    packs.filter((entry) => !duplicated.has(entry.id)),
    anchors.filter((entry) => !duplicated.has(entry.id)),
  );

  return {
    graph,
    report: { validatorId: extractValidatorId, findings: sortFindings(findings) },
    counts: { specs: specs.length, packs: packs.length, anchors: anchors.length },
  };
}
