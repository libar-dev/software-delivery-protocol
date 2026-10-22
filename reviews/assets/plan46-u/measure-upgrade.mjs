import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { validateGraph } from "../../../dist/index.js";

// Run from the Protocol checkout against a fresh, disposable platform clone at b038bd4.
const [copy, output] = process.argv.slice(2).map((path) => resolve(path));
if (!copy || !output) throw new Error("Usage: node reviews/assets/plan46-u/measure-upgrade.mjs COPY OUTPUT");
const cli = resolve("dist/cli/sdp.js");
const git = (...args) => execFileSync("git", ["-C", copy, ...args], { encoding: "utf8" }).trim();
const commit = git("rev-parse", "HEAD");
if (!commit.startsWith("b038bd4") || git("status", "--porcelain"))
  throw new Error("The measurement requires a clean disposable clone at b038bd4.");
mkdirSync(output, { recursive: true });
const run = (args) => execFileSync(process.execPath, [cli, ...args], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
const query = (number, params = {}) => {
  const path = join(output, `params-${number}.json`);
  writeFileSync(path, JSON.stringify(params));
  return JSON.parse(run(["q", `return await recipes(${number}, params)`, "--root", copy, "--params", `@${path}`, "--json"]));
};
const save = (name, value) => writeFileSync(join(output, name), `${JSON.stringify(value, null, 2)}\n`);
const before = query(47, { perspectives: [] });
save("before.json", before);
run(["build", copy]);
const base = JSON.parse(readFileSync(join(copy, "generated/graph.json"), "utf8"));
save("base-graph.json", base);
const beforeFindings = validateGraph(base).findings;
const answer = query(48, { commit, pack: "pack:application" });
if (!answer.proposal || answer.unkeyable.length) throw new Error("Expected a complete Pack proposal.");
save("proposal-answer.json", answer);
save("proposal.json", answer.proposal);
const checked = query(38, { proposal: answer.proposal, base });
save("proposal-check.json", checked);
if (checked.schemaProblems.length || checked.totals.moved || checked.totals.unresolved)
  throw new Error("The proposal check did not clear.");

// These are the agent's edits. The recipe itself never opens or writes a carrier.
const files = new Map();
for (const change of answer.proposal.changes) {
  const location = /, at (.+) line (\d+), after its rule: or flow: label where it has one\.$/u.exec(change.request);
  if (!location) throw new Error(`No located entry: ${change.request}`);
  const path = resolve(copy, location[1]);
  if (!path.startsWith(`${copy}/`)) throw new Error("A request left the copy.");
  const lines = files.get(path) ?? readFileSync(path, "utf8").split("\n");
  const index = Number(location[2]) - 1;
  const text = change.text.replace(/^\[#[a-z][A-Za-z0-9]*\] /u, "");
  const prefix = /^(?:- (?:rule|flow): |- )/u.exec(lines[index])?.[0];
  if (!prefix || lines[index] !== prefix + text) throw new Error(`Entry moved: ${change.request}`);
  lines[index] = prefix + change.text;
  files.set(path, lines);
}
for (const [path, lines] of files) writeFileSync(path, lines.join("\n"));
const validation = run(["validate", copy]);
writeFileSync(join(output, "validate.txt"), validation);
const after = query(47, { perspectives: [] });
const afterFindings = validateGraph(JSON.parse(readFileSync(join(copy, "generated/graph.json"), "utf8"))).findings;
const findingsChanged = JSON.stringify(beforeFindings) !== JSON.stringify(afterFindings);
if (findingsChanged) throw new Error("The upgrade changed the baseline findings.");
save("after.json", after);
writeFileSync(join(output, "diff-stat.txt"), `${git("diff", "--stat")}\n`);
const summary = { commit, pack: "pack:application", before: before.totals, capabilities: before.capabilities, proposal: answer.totals, check: { schemaProblems: checked.schemaProblems.length, ...checked.totals }, filesEdited: files.size,
  beforeWarnings: beforeFindings.filter((row) => row.severity === "warning").length,
  afterWarnings: afterFindings.filter((row) => row.severity === "warning").length,
  findingsChanged, validation: validation.trim(), afterRuleKeys: after.capabilities.find((row) => row.capability === "ruleKeys") };
save("summary.json", summary);
console.log(JSON.stringify(summary, null, 2));
