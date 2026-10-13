import type { StudioData } from "../data.js";
import { embedData } from "../data.js";
import { pagePath } from "../paths.js";
import type { Finding } from "../../../validate/contracts.js";

export interface StudioPage {
  readonly path: string;
  readonly content: string;
}

function escape(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function findings(rows: readonly Finding[]): string {
  return `<ul>${rows.map((finding) => `<li>${escape(finding.severity)}: ${escape(finding.message)}</li>`).join("")}</ul>`;
}

/** Minimal S1 renderer. The pages lane replaces this while keeping its data-to-page-set seam. */
export function renderStudio(data: StudioData): readonly StudioPage[] {
  const frame = (title: string, body: string, nested = false): string => {
    const prefix = nested ? "../" : "";
    const rail = data.rail.packs
      .map(
        (pack) =>
          `<li><a href="${prefix}${pagePath(pack.id) ?? "index.html"}">${escape(pack.title ?? pack.id)}</a></li>`,
      )
      .join("");
    return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><link rel="stylesheet" href="${prefix}assets/studio.css"><script defer src="${prefix}assets/studio.js"></script></head><body><nav><a href="${prefix}index.html">Studio</a> <a href="${prefix}search.html">Search</a></nav><main>${body}</main><aside><ul>${rail}</ul><p>${String(data.rail.findings.errors)} errors, ${String(data.rail.findings.warnings)} warnings</p></aside></body></html>\n`;
  };
  return [
    {
      path: "index.html",
      content: frame(
        "Spec Studio",
        `<h1>Spec Studio</h1><h2 id="packs">Packs</h2><ul>${data.packs.map(({ context }) => `<li><a href="${pagePath(context.id) ?? "index.html"}">${escape(context.title ?? context.id)}</a> <code>${escape(context.id)}</code></li>`).join("")}</ul><h2 id="specs">Specs</h2><ul>${data.specs.map((spec) => `<li><a href="${pagePath(spec.id) ?? "index.html"}">${escape(spec.title ?? spec.id)}</a> <code>${escape(spec.id)}</code></li>`).join("")}</ul><h2 id="findings">Findings</h2>${findings(data.findings)}`,
      ),
    },
    {
      path: "search.html",
      content: frame(
        "Search",
        `<h1>Search</h1><noscript>Search needs JavaScript. <a href="index.html">Browse the index</a>.</noscript><script type="application/json" id="sdp-data">${embedData(data.search)}</script>`,
      ),
    },
    ...data.packs.map(({ context }) => ({
      path: pagePath(context.id) ?? "index.html",
      content: frame(
        context.title ?? context.id,
        `<h1>${escape(context.title ?? context.id)}</h1><code>${escape(context.id)}</code>${findings(data.findings.filter((finding) => finding.subjectId === context.id))}`,
        true,
      ),
    })),
    ...data.specs.map((spec) => ({
      path: pagePath(spec.id) ?? "index.html",
      content: frame(
        spec.title ?? spec.id,
        `<h1>${escape(spec.title ?? spec.id)}</h1><code>${escape(spec.id)}</code>${findings(data.findings.filter((finding) => finding.subjectId === spec.id))}`,
        true,
      ),
    })),
  ];
}
