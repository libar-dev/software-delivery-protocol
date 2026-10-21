import { frame } from "./frame.js";
import { code, escape } from "./html.js";
import type { PageContext } from "./html.js";
import { runEvidence, runHeader, runRows } from "./run-rows.js";

/**
 * @sdpAnchor impl:protocol.studio-runs-page
 * @sdpSatisfies spec:consumers.spec-studio.runs-page, spec:observation.run-evidence
 * @sdpLabel renders readable CTRF inputs, file results, unjoined records and diagnostics
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function runsPage(ctx: PageContext): string {
  const evidence = runEvidence(ctx);
  const runs = (evidence?.inputs ?? [])
    .map((input) => {
      const unjoined = (evidence?.unjoined ?? [])
        .filter((row) => row.input === input.index)
        .map(
          (row) =>
            `<li>${escape(row.name)} · ${code(row.filePath ?? "no file path")} · ${escape(row.status)} · ${row.reason === "noFilePath" ? "no file path" : "no test anchor in that file"}</li>`,
        )
        .join("");
      return `<section>${runHeader(input)}<p>${(["passed", "failed", "skipped", "pending", "other"] as const).map((key) => `${String(input.summary[key])} ${key}`).join(", ")}.</p>${runRows(ctx, undefined, undefined, input.index)}<h3>Unjoined records</h3>${unjoined ? `<ul>${unjoined}</ul>` : "<p>None.</p>"}</section>`;
    })
    .join("");
  const diagnostics = (evidence?.diagnostics ?? [])
    .map(
      (d) =>
        `<li>${d.input === null ? "Run input" : `Input ${String(d.input + 1)}`}: ${escape(d.problem)}</li>`,
    )
    .join("");
  return frame(
    ctx,
    "Runs",
    `<header class="page-head"><h1>Runs</h1><p>External run evidence from test files, read beside verifier bindings. Results describe the reported tests in each file.</p></header>${runs}<h2>Input diagnostics</h2>${diagnostics ? `<ul>${diagnostics}</ul>` : "<p>None.</p>"}`,
  );
}
