import { code, copy, escape, link } from "./html.js";
import type { PageContext } from "./html.js";

export interface RunInput {
  index: number;
  tool: string | null;
  toolVersion: string | null;
  specVersion: string;
  commit: string | null;
  branch: string | null;
  build: string | null;
  start: number | null;
  stop: number | null;
  summary: Record<"tests" | "passed" | "failed" | "skipped" | "pending" | "other", number>;
  sameCommit: boolean | null;
}
export interface RunFile {
  file: string;
  anchors: { id: string; verifies: string[] }[];
  specs: string[];
  results: {
    input: number;
    name: string;
    suite: string | null;
    status: string;
    duration: number | null;
  }[];
}
export interface RunEvidence {
  inputs?: RunInput[];
  diagnostics: { input: number | null; problem: string }[];
  totals?: {
    inputs: number;
    tests: number;
    joined: number;
    unjoined: number;
    files: number;
    specs: number;
  };
  files?: RunFile[];
  unjoined?: {
    input: number;
    name: string;
    filePath: string | null;
    status: string;
    reason: "noFilePath" | "noTestAnchor";
  }[];
}
export const runEvidence = (ctx: PageContext): RunEvidence | undefined =>
  ctx.data.recipes.all.get(45) as RunEvidence | undefined;
const recorded = (value: unknown): string => escape(value ?? "not recorded");
function time(value: number | null): string {
  if (value === null || !Number.isFinite(new Date(value).getTime())) return "not recorded";
  return new Date(value).toISOString();
}
function runName(input: RunInput): string {
  return `Run ${String(input.index + 1)}: external run evidence from ${input.tool ?? "not recorded"}${input.toolVersion === null ? "" : ` ${input.toolVersion}`}`;
}
function runDetails(input: RunInput): string {
  return `Build: ${recorded(input.build)} · Branch: ${recorded(input.branch)} · Commit: ${recorded(input.commit)} · Start: ${time(input.start)} · Stop: ${time(input.stop)}`;
}
export function runInputSentence(input: RunInput): string {
  return `<p>${escape(runName(input))}. ${runDetails(input)}.</p>`;
}
export function runHeader(input: RunInput, level = 2): string {
  return `<h${String(level)}>${escape(runName(input))}</h${String(level)}><p>${runDetails(input)}</p>`;
}

/**
 * @sdpAnchor impl:protocol.studio-run-rows
 * @sdpSatisfies spec:consumers.spec-studio.runs-page, spec:consumers.spec-studio.verification-panels
 * @sdpLabel renders recipe 45 file rows shared by the runs page and verification panel
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function runRows(
  ctx: PageContext,
  specId?: string,
  anchorId?: string,
  inputIndex?: number,
  renderedFiles?: Set<string>,
): string {
  const evidence = runEvidence(ctx);
  if (evidence === undefined) return "";
  const files = (evidence.files ?? []).filter(
    (file) =>
      (specId === undefined || file.specs.includes(specId)) &&
      (anchorId === undefined || file.anchors.some((a) => a.id === anchorId)) &&
      (inputIndex === undefined || file.results.some((result) => result.input === inputIndex)) &&
      !renderedFiles?.has(file.file),
  );
  return files
    .map((file) => {
      renderedFiles?.add(file.file);
      const heading = `<h3>External run evidence from ${code(file.file)}${copy(file.file)}</h3><p>Test anchors: ${file.anchors.map((a) => code(a.id)).join(", ")}. Specs verified by those bindings: ${file.specs.map((id) => link(ctx, id)).join(", ") || "none"}.</p>`;
      const sections = (evidence.inputs ?? [])
        .map((input) => {
          const results = file.results.filter(
            (r) =>
              r.input === input.index && (inputIndex === undefined || input.index === inputIndex),
          );
          if (!results.length) return "";
          return `${inputIndex === undefined ? runHeader(input, 4) : ""}<div class="table-scroll" role="region" aria-label="External test file results" tabindex="0"><table><thead><tr><th>Name</th><th>Suite</th><th>Result</th><th>Duration</th></tr></thead><tbody>${results.map((r) => `<tr data-run-result><td>${escape(r.name)}</td><td>${recorded(r.suite)}</td><td>${escape(r.status)}</td><td>${r.duration === null ? "not recorded" : `${String(Number(r.duration.toFixed(2)))} ms`}</td></tr>`).join("")}</tbody></table></div>`;
        })
        .join("");
      return `<section class="run-file">${heading}${sections}</section>`;
    })
    .join("");
}
