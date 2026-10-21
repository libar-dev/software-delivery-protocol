import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import assert from "node:assert/strict";

// Run only against a disposable clone, as the lane procedure describes.
const root = resolve(process.argv[2] ?? "/tmp/plan46-v-platform");
const cli = fileURLToPath(new URL("../../../dist/cli/sdp.js", import.meta.url));
const out = join(root, "generated/obsidian-vault");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
function run() {
  const start = performance.now();
  const result = spawnSync(process.execPath, [cli, "vault", root], { encoding: "utf8" });
  return { code: result.status, seconds: Number(((performance.now() - start) / 1000).toFixed(3)), stdout: result.stdout, stderr: result.stderr };
}
function files(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = prefix + entry.name;
    return entry.isDirectory() ? files(join(directory, entry.name), `${path}/`) : [path];
  });
}
function plainOutsideCode(text) {
  const prose = text.replace(/^(`{3,})[^\n]*\n[\s\S]*?^\1\s*$/gmu, "");
  const runs = [...prose.matchAll(/`+/gu)];
  let result = "", at = 0;
  for (let i = 0; i < runs.length; i++) {
    const open = runs[i];
    const closing = runs.findIndex((run, j) => j > i && run[0].length === open[0].length);
    if (closing < 0) continue;
    const close = runs[closing];
    result += prose.slice(at, open.index);
    at = close.index + close[0].length;
    i = closing;
  }
  return result + prose.slice(at);
}
const initial = run();
assert.equal(initial.code, 0, initial.stderr);
const generatedFiles = files(join(out, "sdp"));
let links = 0;
for (const path of generatedFiles.filter((path) => path.endsWith(".md"))) {
  const prose = plainOutsideCode(readFileSync(join(out, "sdp", path), "utf8"));
  for (const match of prose.matchAll(/(?<!\\)\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/gu)) {
    const [target, block] = match[1].split("#^");
    assert.ok(statSync(join(out, target)).isFile(), `${path} -> ${target}`);
    if (block) assert.match(readFileSync(join(out, target), "utf8"), new RegExp(` \\^${block}$`, "m"));
    links++;
  }
}
const intent = join(out, "intent/acceptance.md");
mkdirSync(dirname(intent), { recursive: true });
const intentBytes = Buffer.from("# Intent for the next pass\n\nKeep these exact bytes.\n");
writeFileSync(intent, intentBytes);
const beforeIntent = digest(readFileSync(intent));
const note = join(out, "sdp", generatedFiles.find((path) => path.startsWith("specs/") && path.endsWith(".md")));
const original = readFileSync(note);
const edited = Buffer.concat([original, Buffer.from("\nA person's edit.\n")]);
writeFileSync(note, edited);
const refused = run();
assert.equal(refused.code, 1);
assert.match(refused.stderr, /has changed since this command wrote it \(changed\)/u);
assert.deepEqual(readFileSync(note), edited);
writeFileSync(note, original);
const repaired = run();
assert.equal(repaired.code, 0, repaired.stderr);
assert.deepEqual(readFileSync(intent), intentBytes);
const answer = {
  root, vault: out,
  filesUnderSdp: generatedFiles.length,
  notes: generatedFiles.filter((p) => p.endsWith(".md")).length,
  bases: generatedFiles.filter((p) => p.endsWith(".base")).length,
  links, unresolvedLinks: 0,
  initialSeconds: initial.seconds,
  refusedSeconds: refused.seconds,
  repairedSeconds: repaired.seconds,
  generatedEditRefused: true,
  intentBeforeSha256: beforeIntent,
  intentAfterSha256: digest(readFileSync(intent)),
  summaries: [initial.stdout.trim().split("\n").at(-1), repaired.stdout.trim().split("\n").at(-1)],
};
console.log(JSON.stringify(answer, null, 2));
