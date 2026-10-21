import { escape, link } from "./html.js";
import type { PageContext } from "./html.js";
import { codeSpans } from "./text.js";

export function titleLink(ctx: PageContext, id: string): string {
  const title = ctx.data.specs.find((s) => s.id === id)?.title ?? id;
  return link(ctx, id, title, codeSpans(title));
}
export function summary(lines: readonly string[]): string {
  return `<ul class="summary">${lines.map((line) => `<li>${line}</li>`).join("")}</ul>`;
}
export const total = (n: number, singular: string, plural = `${singular}s`): string =>
  `${String(n)} ${n === 1 ? singular : plural}`;
export function filterBar(
  facets: Readonly<
    Record<
      string,
      { readonly label: string; readonly values: readonly string[]; readonly ordered?: boolean }
    >
  >,
): string {
  return `<form hidden class="filter-bar">${Object.entries(facets)
    .map(
      ([key, facet]) =>
        `<label>${escape(facet.label)}<select data-facet="${escape(key)}"><option value="any">Any</option>${(facet.ordered
          ? [...new Set(facet.values)]
          : [...new Set(facet.values)].sort()
        )
          .map((value) => `<option value="${escape(value)}">${escape(value)}</option>`)
          .join("")}</select></label>`,
    )
    .join("")}</form>`;
}
export function filtered(body: string, filters: string, rows: number): string {
  return `<sdp-filter>${filters}<output aria-live="polite">${String(rows)} of ${String(rows)} shown</output>${body}</sdp-filter>`;
}
export const packFacet = (ctx: PageContext) => ({
  label: "Pack",
  values: ctx.data.packs.map((p) => p.context.id),
});
