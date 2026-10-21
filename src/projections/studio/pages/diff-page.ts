import { frame } from "./frame.js";
import { code, escape, link, list, relative } from "./html.js";
import type { PageContext } from "./html.js";
import { answer } from "./register-answers.js";
import type { Delta, Diff } from "./register-answers.js";
import { summary, titleLink } from "./register-common.js";

export function baseLabel(ctx: PageContext): string {
  const label = ctx.data.inputs.base?.label;
  return `the base graph${label === null || label === undefined ? "" : ` ${escape(label)}`}`;
}
function baseMetadata(ctx: PageContext): string {
  const base = answer(ctx, 35).base;
  return base === undefined
    ? ""
    : `<p>Base input: schema ${escape(base.schemaVersion)}, ${String(base.specs)} Specs.</p>`;
}
export function specChangeNote(ctx: PageContext, id: string): string {
  if (ctx.data.inputs.base === undefined) return "";
  const diff = answer(ctx, 35),
    path = `${relative(ctx, "diff.html")}#${id}`;
  if (diff.specs?.added.includes(id))
    return `<p>New since ${baseLabel(ctx)}. <a href="${escape(path)}">See the diff</a>.</p>${baseMetadata(ctx)}`;
  const changed = diff.specs?.changed.find((s) => s.id === id);
  return changed === undefined
    ? ""
    : `<p class="change-note">Changed since ${baseLabel(ctx)}: <a href="${escape(path)}">${changed.parts.map((p) => code(p.part)).join(", ")}</a></p>${baseMetadata(ctx)}`;
}
export function packChangeNote(ctx: PageContext, id: string): string {
  if (ctx.data.inputs.base === undefined) return "";
  const diff = ctx.data.recipes.packDiffs.get(id) as Diff;
  const pack = diff.packs?.find((p) => p.id === id);
  const changed = diff.specs?.changed ?? [];
  const added = diff.specs?.added ?? [];
  return `<section id="changed-since-base"><h2>Changed since the base</h2><p>Compared with ${baseLabel(ctx)}. <a href="${escape(relative(ctx, "diff.html"))}">Read the diff</a>.</p>${baseMetadata(ctx)}<h3>Changed members</h3>${list(changed.map((s) => link(ctx, s.id)))}<h3>Added members</h3>${list(added.map((s) => link(ctx, s)))}<h3>Pack membership</h3>${pack === undefined ? "<p>No membership or order change.</p>" : packDelta(ctx, pack)}</section>`;
}
function packDelta(ctx: PageContext, pack: NonNullable<Diff["packs"]>[number]): string {
  return `<p>${escape(pack.change)} · ${link(ctx, pack.id)}</p><p>Members added: ${pack.membersAdded.map((id) => link(ctx, id)).join(", ") || "None"}</p><p>Members removed: ${pack.membersRemoved.map(code).join(", ") || "None"}</p><p>Order ${pack.reordered ? "changed" : "unchanged"}.</p>`;
}
const valueText = (value: unknown): string =>
  typeof value === "string" ? value : JSON.stringify(value, null, 2);
function bindingDelta(delta: Delta): string {
  return `<p>Added: ${delta.added.map(code).join(", ") || "None"}</p><p>Removed: ${delta.removed.map(code).join(", ") || "None"}</p>`;
}
/**
 * @sdpAnchor impl:protocol.studio-diff
 * @sdpSatisfies spec:consumers.spec-studio.diff-page
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.studio-recipes
 * @sdpRole projection
 */
export function diffPage(ctx: PageContext): string {
  const diff = answer(ctx, 35),
    t = diff.totals;
  const names =
    diff.base === undefined || diff.head === undefined
      ? `Compared with ${baseLabel(ctx)}. The supplied base graph could not be compared. See the recipe's diagnostics.`
      : `Compared with ${baseLabel(ctx)}, schema ${escape(diff.base.schemaVersion)}, ${String(diff.base.specs)} Specs; the built graph has schema ${escape(diff.head.schemaVersion)}, ${String(diff.head.specs)} Specs.`;
  return frame(
    ctx,
    "Design diff",
    `<header class="page-head"><h1>Design diff</h1><p>${names}</p><p>The comparison reads the two graphs only. Recipe 35 with detail enabled.</p>${t === undefined ? "" : summary([`${String(t.added)} Specs added.`, `${String(t.removed)} Specs removed.`, `${String(t.changed)} Specs changed.`, `${String(t.packs)} Packs with membership or order changes.`, `${String(t.bindings)} Specs with binding changes.`])}</header><h2>Specs added</h2>${list((diff.specs?.added ?? []).map((id) => `<span id="${escape(id)}">${titleLink(ctx, id)} · ${code(id)}</span>`))}<h2>Specs removed</h2>${list((diff.specs?.removed ?? []).map(code))}<h2>Specs changed</h2>${(diff.specs?.changed ?? []).map((s) => `<section class="spec-row" id="${escape(s.id)}"><h3>${titleLink(ctx, s.id)}</h3><p>${code(s.id)}</p>${s.parts.map((p) => `<div class="entry"><p>${code(p.part)} · ${escape(p.change)}</p><b>Base</b><pre>${escape(valueText(p.from))}</pre><b>Now</b><pre>${escape(valueText(p.to))}</pre></div>`).join("")}</section>`).join("") || "<p>None.</p>"}<h2>Packs with membership or order changes</h2>${(diff.packs ?? []).map((p) => `<section class="spec-row">${packDelta(ctx, p)}</section>`).join("") || "<p>None.</p>"}<h2>Bindings, derived from anchors</h2>${
      (diff.bindings ?? [])
        .map(
          (b) =>
            `<section class="spec-row"><h3>${titleLink(ctx, b.id)}</h3>${(
              [
                ["implementedBy", "Implementing units"],
                ["referencedBy", "Referencing units"],
                ["verifiers", "Enabled verifiers"],
                ["deliveryFacts", "Delivery facts"],
              ] as const
            )
              .map(([key, label]) => `<h4>${label}</h4>${bindingDelta(b[key])}`)
              .join("")}</section>`,
        )
        .join("") || "<p>None.</p>"
    }<h2>Diagnostics</h2>${list(diff.diagnostics.map((d) => `<pre>${escape(JSON.stringify(d, null, 2))}</pre>`))}`,
  );
}
