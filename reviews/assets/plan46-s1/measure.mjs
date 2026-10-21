// Run sequentially: every Studio publisher replaces the projection roots of its corpus.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { performance } from "node:perf_hooks";
const [base, head, platform] = process.argv.slice(2);
if (!base || !head || !platform) throw new Error("Pass base checkout, head checkout, platform copy");
const cases = [
  { name: "base-repository", engine: base, root: base, protocol: true },
  { name: "head-repository", engine: head, root: head, protocol: true },
  { name: "base-platform", engine: base, root: platform },
  { name: "head-platform", engine: head, root: platform },
];
function files(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(root, entry.name)) : [join(root, entry.name)],
  ).sort();
}
const measurements = [];
for (let trial = 1; trial <= 3; trial++) {
  for (const item of cases) {
    const args = [join(item.engine, "dist/cli/sdp.js"), "studio", item.root];
    if (item.protocol) args.push("--exclude", "explorations", "--exclude", "examples", "--exclude", "test/fixtures/import/parity");
    const start = performance.now();
    const result = spawnSync(process.execPath, args, { encoding: "utf8" });
    const seconds = (performance.now() - start) / 1000;
    if (result.status !== 0) throw new Error(result.stderr + result.stdout);
    const root = join(item.root, "generated/spec-studio");
    const pages = files(root);
    const hash = createHash("sha256");
    let bytes = 0;
    for (const path of pages) { const content = readFileSync(path); bytes += content.length; hash.update(relative(root, path)); hash.update("\0"); hash.update(content); }
    const row = { name: item.name, trial, seconds, files: pages.length, bytes, sha256: hash.digest("hex"), command: ["node", `${item.name.startsWith("base-") ? "$BASE" : "$HEAD"}/dist/cli/sdp.js`, "studio", item.protocol ? (item.name.startsWith("base-") ? "$BASE" : "$HEAD") : "$PLATFORM", ...args.slice(3)] };
    measurements.push(row);
    process.stderr.write(`${item.name} ${trial}: ${seconds.toFixed(3)}s, ${bytes} bytes\n`);
  }
}
const architecture = readFileSync(join(platform, "generated/spec-studio/architecture.html"), "utf8");
const drawings = [...architecture.matchAll(/<sdp-diagram subject="([^"]+)"[^>]*>(.*?)<\/sdp-diagram>/gs)].map(match => ({ subject: match[1], boxes: [...match[2].matchAll(/class="node"/g)].length, edges: [...match[2].matchAll(/class="edge"/g)].length }));
process.stdout.write(JSON.stringify({ measurements, platformArchitecture: { drawings, totalBoxes: drawings.reduce((n, d) => n + d.boxes, 0), totalEdges: drawings.reduce((n, d) => n + d.edges, 0) } }, null, 2) + "\n");
