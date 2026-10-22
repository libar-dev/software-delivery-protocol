import type { StudioData } from "../data.js";
import { packPage } from "./pack-page.js";
import { specPage } from "./spec-page.js";
import type { PackContext } from "../../../reader/reader.js";
import { pagePath } from "../paths.js";
import type { StudioPage } from "./index.js";
import { escape } from "./html.js";
import { plainTitle } from "./code-spans.js";
export function exportPath(id: string): string {
  return (pagePath(id) ?? "packs/unknown.html").replace(/^packs\//u, "exports/");
}
function decode(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}
const mainContent = (html: string): string =>
  /<main id="main">([\s\S]*)<\/main>/u.exec(html)?.[1] ?? "";
/**
 * @sdpAnchor impl:protocol.studio-pack-export
 * @sdpLabel copies rendered canvas content into one inline-styled document with prefixed element references
 * @sdpSatisfies spec:consumers.spec-studio.export
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function packExport(
  pack: PackContext,
  pages: readonly StudioPage[],
  stylesheet: string,
): StudioPage {
  const packPath = pagePath(pack.id) ?? "";
  const contents = [
    {
      path: packPath,
      prefix: "pack/",
      html: pages.find((p) => p.path === packPath)?.content ?? "",
      id: pack.id,
    },
    ...pack.members.flatMap((member) => {
      const path = pagePath(member.id);
      const page = pages.find((p) => p.path === path);
      return page
        ? [{ path: page.path, prefix: `${member.id}/`, html: page.content, id: member.id }]
        : [];
    }),
  ];

  const target = (href: string, path: string): { id?: string; text: string } => {
    const url = new URL(decode(href), `https://studio.invalid/${path}`);
    const destination = preparedByPath.get(url.pathname.slice(1));
    let fragment = "";
    try {
      fragment = decodeURIComponent(url.hash.slice(1));
    } catch {
      /* Generated fragments are encoded; preserve an unreadable one as text. */
    }
    if (destination && url.origin === "https://studio.invalid") {
      if (!fragment) return { id: destination.id, text: destination.id };
      if (destination.ids.has(fragment))
        return { id: destination.prefix + fragment, text: fragment };
    }
    return { text: fragment || decode(href) };
  };
  // Attribute values are escaped by the page renderer. Restrict transformations to tags so authored prose stays byte-for-byte intact.
  const prepared = contents.map((content) => {
    let html = mainContent(content.html)
      .replace(
        /<(sdp-intent-panel|sdp-copy|sdp-compose|template|script|button|form)\b[^>]*>[\s\S]*?<\/\1>/gu,
        "",
      )
      .replace(/<p class="export-download">[\s\S]*?<\/p>/gu, "")
      .replace(
        /<details\b([^>]*)>/gu,
        (_tag: string, attrs: string) =>
          `<details${attrs.replace(/\sopen(?:="[^"]*")?/gu, "")} open>`,
      );
    if (content.id === pack.id)
      html = html.replace(
        /(<div class="ids">[\s\S]*?<\/div>)/u,
        "$1<p>Exported from the Spec Studio</p>",
      );
    const ids = new Set([...html.matchAll(/\sid="([^"]*)"/gu)].map((m) => decode(m[1] ?? "")));
    return { ...content, html, ids };
  });
  // Resolve links against the ids retained after control removal.
  const preparedByPath = new Map(prepared.map((c) => [c.path, c]));

  const sections = prepared
    .map((content, index) => {
      const mapped = (id: string): string => content.prefix + decode(id);
      let html = content.html.replace(/<\/?[A-Za-z][^>]*>/gu, (tag) => {
        let result = tag.replace(
          /\sid="([^"]*)"/gu,
          (_attr: string, id: string) => ` id="${escape(mapped(id))}"`,
        );
        result = result.replace(
          /\b(aria-describedby|aria-labelledby|aria-controls|aria-owns|aria-details|aria-errormessage|aria-activedescendant|aria-flowto|for|form|headers|itemref|list|popovertarget|commandfor)="([^"]*)"/gu,
          (_attr: string, name: string, ids: string) =>
            `${name}="${escape(ids.split(/\s+/u).map(mapped).join(" "))}"`,
        );
        result = result.replace(
          /url\(#([^)]*)\)/gu,
          (_value: string, id: string) => `url(#${escape(mapped(id))})`,
        );
        if (!/^<a\b/u.test(tag))
          result = result.replace(
            /\s(xlink:href|href)="#([^"]*)"/gu,
            (_attribute: string, name: string, id: string) => ` ${name}="#${escape(mapped(id))}"`,
          );
        return result;
      });
      html = html.replace(
        /<a\b([^>]*)>([\s\S]*?)<\/a>/gu,
        (_whole: string, attrs: string, inner: string) => {
          const href = /\bhref="([^"]*)"/u.exec(attrs)?.[1];
          if (href === undefined) return inner;
          const dest = target(href, content.path);
          if (dest.id !== undefined) {
            const url = new URL(decode(href), `https://studio.invalid/${content.path}`);
            const page = preparedByPath.get(url.pathname.slice(1));
            if (page)
              return `<a${attrs.replace(/\bhref="[^"]*"/u, `href="#${escape(dest.id)}"`)}>${inner}</a>`;
          }
          // SVG node labels already name their id. Keep the drawing's geometry when removing its link.
          if (/<(rect|text|path)\b/u.test(inner)) return `<g>${inner}</g>`;
          const path = new URL(
            decode(href),
            `https://studio.invalid/${content.path}`,
          ).pathname.slice(1);
          const graphId = pages
            .find((p) => p.path === path)
            ?.content.match(/<div class="ids"><span><code>([^<]*)<\/code>/u)?.[1];
          return `<code>${escape(graphId ? decode(graphId) : dest.text)}</code>`;
        },
      );
      const member = pack.members.find((m) => m.id === content.id);
      const title =
        index === 0
          ? ""
          : `<h2>${String(pack.members.findIndex((m) => m.id === content.id) + 1)}. ${escape(plainTitle(member?.title ?? content.id))}</h2><p><code>${escape(content.id)}</code></p>`;
      return `<section id="${escape(content.id)}"${index === 0 ? "" : " data-export-member"}>${title}${html}</section>`;
    })
    .join("");
  return {
    path: exportPath(pack.id),
    content: `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(plainTitle(pack.title ?? pack.id))}</title><style>${stylesheet}\nmain { max-width: 90rem; margin: auto; padding: 1rem; } .export > section + section { break-before: page; margin-top: 3rem; } sdp-maturity-map table { min-width: 0; }\n</style></head><body><main class="export">${sections}</main></body></html>\n`,
  };
}

export function exportPages(
  data: StudioData,
  pages: readonly StudioPage[],
  stylesheet: string,
): StudioPage[] {
  // Exports carry the graph's design. Named browsing inputs can contain commits and times.
  const graphOnly: StudioData = {
    ...data,
    inputs: { runs: [] },
    recipes: {
      ...data.recipes,
      all: new Map([...data.recipes.all].filter(([number]) => number !== 45 && number !== 35)),
    },
  };
  const sources =
    data.inputs.base === undefined && !data.recipes.all.has(45)
      ? pages
      : [
          ...data.packs.map(({ context, totals }) => {
            const path = pagePath(context.id) ?? "";
            return { path, content: packPage({ data: graphOnly, path }, context, totals) };
          }),
          ...data.specs.map((spec) => {
            const path = pagePath(spec.id) ?? "";
            return { path, content: specPage({ data: graphOnly, path }, spec) };
          }),
        ];
  return data.packs.map(({ context }) => packExport(context, sources, stylesheet));
}
