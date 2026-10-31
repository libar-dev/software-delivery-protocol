import type { Architecture } from "./architecture-page.js";
import type { PageContext } from "./html.js";
import { code, copy, escape, link, list, location, sourceCode } from "./html.js";
import { codeSpans } from "./code-spans.js";
import { compare } from "../diagrams/model.js";

/**
 * @sdpAnchor impl:protocol.studio-unit-register
 * @sdpLabel renders component source bindings and role-grouped recorded units
 * @sdpSatisfies spec:consumers.spec-studio.lenses.architecture.unit-register
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function unitRegister(
  ctx: PageContext,
  architecture: Architecture,
): {
  index: string;
  source: (id: string) => string;
  members: (id: string) => string;
  unowned: string;
} {
  const units = ctx.data.codeUnits;
  const row = (id: string): string => {
    const unit = units.find((r) => r.id === id);
    if (!unit) return code(id);
    const bindings = (edge: string) =>
      list(
        (ctx.data.search.records.find((r) => r.id === id)?.bindings ?? [])
          .filter((b) => b.edge === edge)
          .map((b) => link(ctx, b.specId)),
      );
    return `<li data-unit="${escape(id)}">${code(id)} ${codeSpans(unit.label ?? "")} · ${sourceCode(unit.file, unit.line)}${copy(location(unit.file, unit.line))}<p>Satisfies</p>${bindings("satisfies")}<p>References</p>${bindings("references")}</li>`;
  };
  const groups = (ids: string[]): string => {
    const role = (id: string) => units.find((r) => r.id === id)?.role ?? null;
    const tokens = [...new Set(ids.map(role))].sort((a, b) =>
      a === null ? 1 : b === null ? -1 : compare(a, b),
    );
    return (
      tokens
        .map(
          (token) =>
            `<details><summary>Role ${escape(token ?? "not stated")}</summary><ul>${ids
              .filter((id) => role(id) === token)
              .sort(compare)
              .map(row)
              .join("")}</ul></details>`,
        )
        .join("") || "<p>None.</p>"
    );
  };
  const declared = architecture.components
    .filter((c) => c.declared)
    .sort((a, b) => compare(a.id, b.id));
  const members = new Set(declared.flatMap((c) => c.members.map((m) => m.id)));
  const unowned = units
    .filter((u) => !members.has(u.id) && !declared.some((c) => c.id === u.id))
    .map((u) => u.id);
  return {
    index: `<section><h2>Significant units</h2><p>Recorded bindings state no review approval or execution verdict.</p>${list(declared.map((c) => `<a href="#${escape(c.id)}">${code(c.id)}</a>`))}</section>`,
    source: (id) => `<h3>Component source binding</h3><ul>${row(id)}</ul>`,
    members: (id) => groups(declared.find((c) => c.id === id)?.members.map((m) => m.id) ?? []),
    unowned: `<section><h2>No component</h2>${groups(unowned)}</section>`,
  };
}
