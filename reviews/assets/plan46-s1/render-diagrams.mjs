// Offline SVG rasterization for geometry review. It executes no page JavaScript.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [repositoryPages, platformPages, rendererRoot] = process.argv.slice(2);
if (!repositoryPages || !platformPages || !rendererRoot) throw new Error("Pass repository Studio root, platform Studio root, renderer package root");
const { Resvg } = createRequire(join(rendererRoot, "package.json"))("@resvg/resvg-js");
const style = '<rect width="100%" height="100%" fill="#fff"/><style>text{font:12px monospace;fill:#1d2125}.node rect{fill:#f3f4f2;stroke:#5b636b}.edge path{stroke:#5b636b}.edge text{font-size:11px;fill:#5b636b}marker path{fill:#5b636b}</style><defs>';
for (const [name, root] of [["protocol", repositoryPages], ["platform", platformPages]]) {
  const html = readFileSync(join(root, "architecture.html"), "utf8");
  const source = /<svg .*?<\/svg>/s.exec(html)?.[0];
  if (!source) throw new Error(`No architecture SVG for ${name}`);
  const svg = source.replace("<defs>", style);
  writeFileSync(new URL(`${name}-architecture.png`, import.meta.url), new Resvg(svg, { background: "#fff", font: { defaultFontFamily: "Menlo" } }).render().asPng());
}
