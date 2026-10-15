import { pagePath } from "../paths.js";
import { count, escape, link, relative } from "./html.js";
import type { PageContext } from "./html.js";
import { codeSpans, plainTitle } from "./code-spans.js";

/**
 * Writes the shared navigation and the rail appropriate to the selected graph node.
 * @sdpAnchor impl:protocol.studio-frame
 * @sdpSatisfies spec:consumers.spec-studio.shell
 * @sdpReferences spec:consumers.spec-studio, spec:consumers.spec-studio.responsive, spec:consumers.spec-studio.lenses
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function frame(ctx: PageContext, title: string, body: string, selected?: string): string {
  const prefix = relative(ctx, "index.html").replace(/index\.html$/u, "");
  const isPack = selected?.startsWith("pack:") ?? false;
  const selectedSpec = ctx.data.specs.find((spec) => spec.id === selected);
  const packs = isPack
    ? ctx.data.rail.packs.filter((pack) => pack.id === selected)
    : selectedSpec
      ? ctx.data.rail.packs.filter((pack) => selectedSpec.packs.includes(pack.id))
      : ctx.data.rail.packs;
  const packRail = packs
    .map(
      (pack) =>
        `<h2>${link(ctx, pack.id, pack.title ?? pack.id, codeSpans(pack.title ?? pack.id))}</h2>${
          isPack || selectedSpec
            ? `<ol>${pack.members
                .map((member) => {
                  const path = pagePath(member.id);
                  const resolved = ctx.data.specs.some((s) => s.id === member.id);
                  const label = codeSpans(member.title ?? member.id);
                  return `<li>${isPack ? `<a href="#${escape(member.id)}">${label}</a>` : path !== null && resolved ? `<a href="${escape(relative(ctx, path))}"${member.id === selected ? ' aria-current="page"' : ""}>${label}</a>` : label}</li>`;
                })
                .join("")}</ol>`
            : ""
        }`,
    )
    .join("");
  const exampleSpaces = [
    ...new Map(
      packs.flatMap((pack) =>
        pack.members.filter((m) => m.ownsExampleSpace).map((m) => [m.id, m] as const),
      ),
    ).values(),
  ];
  const rail = `${packRail}${(!isPack && !selectedSpec) || exampleSpaces.length === 0 ? "" : `<h2>Example spaces</h2><ul>${exampleSpaces.map((m) => `<li>${link(ctx, m.id, m.title ?? m.id, codeSpans(m.title ?? m.id))}</li>`).join("")}</ul>`}<h2>Findings</h2><p><a href="${prefix}index.html#findings">${count(ctx.data.rail.findings.errors, "error")} · ${count(ctx.data.rail.findings.warnings, "warning", "warnings", false)}</a></p>`;
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title === "Spec Studio" ? "Spec Studio" : `${escape(plainTitle(title))} · Spec Studio`}</title><link rel="stylesheet" href="${prefix}assets/studio.css"><script defer src="${prefix}assets/studio.js"></script></head><body><a class="skip-link" href="#main">Skip to the page</a><header class="top"><a class="brand" href="${prefix}index.html">Spec Studio</a><nav aria-label="Studio"><a href="${prefix}index.html#packs">Packs</a></nav><sdp-search page-root="${prefix}"><form action="${prefix}search.html" role="search"><label class="visually-hidden" for="q">Search the corpus</label><input id="q" name="q" type="search" placeholder="Search Specs, keys and files"><button type="submit">Search</button></form></sdp-search><sdp-stamp page-root="${prefix}"></sdp-stamp></header><div class="layout"><nav class="rail" aria-label="${isPack ? "Pack members" : selectedSpec ? "Spec Packs" : "Packs"}">${rail}</nav><main id="main">${body}</main></div></body></html>\n`;
}
