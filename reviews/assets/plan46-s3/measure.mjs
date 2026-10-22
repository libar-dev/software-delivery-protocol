import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { performance } from "node:perf_hooks";

const protocol = process.cwd();
const copy = resolve(process.argv[2] ?? "/tmp/build-s3-platform-measured");
const source =
  process.argv[3] ?? "/Users/darkomijic/dev-libar/libar-platform/.git";
if (existsSync(copy))
  throw new Error(`The disposable copy already exists: ${copy}`);
const commands = [];
function run(command) {
  const start = performance.now();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: protocol,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  const seconds = (performance.now() - start) / 1000;
  commands.push({ command, cwd: protocol, status: result.status, seconds });
  if (result.status !== 0)
    throw new Error(`${command.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const cli = [process.execPath, join(protocol, "dist/cli/sdp.js")];
const sourceCommit = run(["git", "rev-parse", "HEAD"]).trim();
run(["git", "clone", "-q", source, copy]);
run(["git", "-C", copy, "checkout", "-q", "b038bd4"]);
run([...cli, "build", copy]);
const basePath = `${copy}-base.json`;
const baseBytes = readFileSync(join(copy, "generated/graph.json"));
writeFileSync(basePath, baseBytes);
const id = "spec:advanced.coalesced-recomputation";
const context = JSON.parse(
  run([
    ...cli,
    "q",
    'return g.specContext("spec:advanced.coalesced-recomputation")',
    "--root",
    copy,
    "--json",
  ]),
);
const file = join(copy, context.file);
const before = context.sections.design.deferred;
const after = before.replace(
  "the dirty-mark table",
  "the coalesced dirty-mark table",
);
if (before === after)
  throw new Error(
    "The measurement's Design entry no longer matches the probe.",
  );
const carrier = readFileSync(file, "utf8");
const sourceEntry = `- deferred: ${before}`;
if (carrier.split(sourceEntry).length !== 2)
  throw new Error("Expected one authored Design entry.");
writeFileSync(file, carrier.replace(sourceEntry, `- deferred: ${after}`));
const args = [
  ...cli,
  "studio",
  copy,
  "--base",
  basePath,
  "--base-label",
  "platform b038bd4 before the S3 probe",
];
run(args);
const buildSeconds = commands.at(-1).seconds;
const studio = join(copy, "generated/spec-studio");
const firstDiff = readFileSync(join(studio, "diff.html"));
run([...args, "--check-clean"]);
if (!readFileSync(basePath).equals(baseBytes))
  throw new Error("The base input changed.");
if (!readFileSync(join(studio, "diff.html")).equals(firstDiff))
  throw new Error("Repeat publication changed the diff page.");
const answer = JSON.parse(
  run([
    ...cli,
    "q",
    "return {diff:await recipes(35,{base:params.base,detail:true}),queue:await recipes(46)}",
    "--root",
    copy,
    "--params",
    `base=@${basePath}`,
    "--json",
  ]),
);
const queuePage = readFileSync(join(studio, "queue.html"), "utf8");
const renderedStatements = [
  ...queuePage.matchAll(/data-statement="([^"]+)"/gu),
].map((match) => match[1]);
if (
  JSON.stringify(renderedStatements) !==
  JSON.stringify(answer.queue.statements.map((row) => row.id))
)
  throw new Error("The rendered queue differs from recipe 46.");
function countFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).reduce(
    (n, entry) =>
      n + (entry.isDirectory() ? countFiles(join(directory, entry.name)) : 1),
    0,
  );
}
console.log(
  JSON.stringify(
    {
      sourceCommit,
      node: process.version,
      copyCommit: "b038bd4",
      commands,
      edit: {
        address: `${id}#design.deferred`,
        file: context.file,
        before,
        after,
      },
      studio: {
        files: countFiles(studio),
        buildSeconds,
        checkClean: true,
        inputUnchanged: true,
        queueMatchesRecipe: true,
      },
      diff: {
        base: answer.diff.base,
        head: answer.diff.head,
        totals: answer.diff.totals,
        changed: answer.diff.specs.changed,
      },
      queue: {
        totals: answer.queue.totals,
        firstRound: answer.queue.statements.filter((row) => row.round === 1),
      },
    },
    null,
    2,
  ),
);
