import { posix } from "node:path";
import type { StudioData } from "../data.js";
import { pagePath } from "../paths.js";
import type { Finding } from "../../../validate/contracts.js";
import type { CodeUnitBinding, PackMemberQuestion } from "../../../reader/reader.js";

export interface PageContext {
  readonly data: StudioData;
  readonly path: string;
}

export function escape(value: unknown): string {
  return (
    value === null || value === undefined
      ? ""
      : typeof value === "string"
        ? value
        : JSON.stringify(value)
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
export const code = (value: unknown): string => `<code>${escape(value)}</code>`;
export const sourceCode = (file?: string, line?: number): string =>
  file === undefined || line === undefined
    ? code(location(file, line))
    : `<code data-source-file="${escape(file)}" data-source-line="${String(line)}">${escape(location(file, line))}</code>`;
export const copy = (value: string): string => `<sdp-copy text="${escape(value)}"></sdp-copy>`;
export const location = (file?: string, line?: number): string =>
  file === undefined
    ? "location not recorded"
    : `${file}${line === undefined ? "" : `:${String(line)}`}`;
export const present = (value: boolean): string => (value ? "present" : "none");
export const count = (
  n: number,
  singular: string,
  plural = `${singular}s`,
  opening = true,
): string => `${n === 0 ? (opening ? "No" : "no") : String(n)} ${n === 1 ? singular : plural}`;
/** The verb that agrees with a count: `rests` after one, `rest` after any other count. */
export const verb = (n: number, plural: string, singular = `${plural}s`): string =>
  n === 1 ? singular : plural;
export const badge = (rung?: string): string =>
  rung === undefined
    ? "stated rung not recorded"
    : `<span class="badge rung-${escape(rung)}">${escape(rung)}</span>`;
export const rungLine = (stated?: string, floor?: string): string =>
  `${badge(stated)} <span class="floor">floor ${escape(floor ?? "none")}</span>`;
export const list = (rows: readonly string[], className = "plain-list"): string =>
  rows.length === 0
    ? "<p>None.</p>"
    : `<ul class="${className}">${rows.map((row) => `<li>${row}</li>`).join("")}</ul>`;
export const relative = (ctx: PageContext, path: string): string =>
  posix.relative(posix.dirname(ctx.path), path);

export function link(ctx: PageContext, id: string, label = id, htmlLabel = escape(label)): string {
  const [base = "", fragment] = id.split("#");
  const path = pagePath(base);
  const spec = ctx.data.specs.find((s) => s.id === base);
  const pack = ctx.data.packs.find((p) => p.context.id === base);
  if (path === null || (!spec && !pack)) return htmlLabel;
  if (
    fragment !== undefined &&
    !ctx.data.search.records.find((r) => r.id === base)?.entries.some((e) => e.address === id)
  )
    return htmlLabel;
  return `<a href="${escape(relative(ctx, path))}${fragment === undefined ? "" : `#${escape(fragment)}`}">${htmlLabel}</a>`;
}

export function findingList(ctx: PageContext, rows: readonly Finding[]): string {
  return list(
    rows.map(
      (f) =>
        `${escape(f.severity)} · ${code(f.validatorId)}${f.subjectId === undefined ? "" : ` · ${link(ctx, f.subjectId)}`} · ${escape(f.message)}${f.file === undefined ? "" : ` · ${sourceCode(f.file, f.line)}`}`,
    ),
  );
}

export function unitList(rows: readonly CodeUnitBinding[]): string {
  return list(
    rows.map(
      (unit) =>
        `${code(unit.codeId)}${unit.label === undefined ? "" : ` · ${escape(unit.label)}`} · ${sourceCode(unit.file, unit.line)}${unit.file === undefined ? "" : copy(location(unit.file, unit.line))}${unit.role === undefined ? "" : ` · role ${escape(unit.role)}`}${unit.component === undefined ? "" : ` · component ${code(unit.component.id)}${unit.component.layer === undefined ? "" : ` · layer ${escape(unit.component.layer)}`}${unit.component.context === undefined ? "" : ` · context ${escape(unit.component.context)}`}`}${unit.layer === undefined ? "" : ` · layer ${escape(unit.layer)}`}${unit.context === undefined ? "" : ` · context ${escape(unit.context)}`}`,
    ),
    "units",
  );
}

export function questionFields(
  ctx: PageContext,
  q: PackMemberQuestion,
  text: (value: string) => string,
): string {
  return [
    q.decider === undefined
      ? ""
      : `<span class="field"><b>Decider:</b> ${escape(q.decider)}</span>`,
    q.links === undefined
      ? ""
      : `<span class="field"><b>Links:</b> ${q.links.map((id) => link(ctx, id)).join(", ")}</span>`,
    q.provisional === undefined
      ? ""
      : `<span class="field"><b>Provisional:</b> ${text(q.provisional)}</span>`,
    q.trigger === undefined ? "" : `<span class="field"><b>Trigger:</b> ${text(q.trigger)}</span>`,
  ].join("");
}
