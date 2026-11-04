import { execFileSync, spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Markers are structural lines, never examples inside a Markdown fence.
export function evidenceMarkers(original, file) {
  const blocks = new Map();
  let active;
  let fence;
  let offset = 0;
  for (const line of original.split("\n")) {
    const marker = /^<!-- (\/?evidence):([a-z0-9-]+) -->$/.exec(line);
    if (/<!--\s*\/?evidence\s*:/.test(line)) {
      if (fence || !marker) throw new Error(`${file}: malformed or fenced evidence marker.`);
      const [, direction, id] = marker;
      if (direction === "evidence") {
        if (active || blocks.has(id))
          throw new Error(`${file}: nested or duplicate evidence: ${id}`);
        active = { id, start: offset };
      } else {
        if (!active || active.id !== id)
          throw new Error(`${file}: unmatched evidence closing: ${id}`);
        blocks.set(id, { start: active.start, end: offset + line.length });
        active = undefined;
      }
    }
    const delimiter = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (delimiter) {
      const run = delimiter[1];
      const rest = line.slice(delimiter[0].length);
      if (!fence) fence = run;
      else if (run[0] === fence[0] && run.length >= fence.length && /^[ \t]*\r?$/.test(rest)) fence = undefined;
    }
    offset += line.length + 1;
  }
  if (active) throw new Error(`${file}: unclosed evidence: ${active.id}`);
  return blocks;
}

export function validateEvidenceMarkers(documents, blocks) {
  const expected = new Map(blocks.map((block) => [block.id, block.file]));
  const seen = new Set();
  for (const [file, text] of documents) {
    for (const id of evidenceMarkers(text, file).keys()) {
      if (!expected.has(id)) throw new Error(`${file}: unknown evidence block: ${id}`);
      if (seen.has(id)) throw new Error(`${file}: duplicate evidence block: ${id}`);
      if (expected.get(id) !== file) throw new Error(`${file}: misplaced evidence block: ${id}`);
      seen.add(id);
    }
  }
  for (const [id, file] of expected) {
    if (!seen.has(id)) throw new Error(`${file} is missing the ${id} evidence markers.`);
  }
}

export function replaceEvidenceBlock(original, block, generated) {
  const range = evidenceMarkers(original, block.file).get(block.id);
  if (!range) throw new Error(`${block.file} is missing the ${block.id} evidence markers.`);
  const body = generated.trim();
  // Carrier excerpts contain their own triple-backtick notation fences.
  const fence = block.language === "markdown" ? "````" : "```";
  const content = block.language ? `${fence}${block.language}\n${body}\n${fence}` : body;
  const replacement = `<!-- evidence:${block.id} -->\n${content}\n<!-- /evidence:${block.id} -->`;
  return original.slice(0, range.start) + replacement + original.slice(range.end);
}

export function parseArguments(args) {
  let check = false;
  let printPin = false;
  let source;
  let separator = false;
  const usage = "Usage: sync-evidence.mjs [--check] [--] SOURCE_REPOSITORY | --print-pin";
  for (const argument of args) {
    if (argument === "--" && !separator) separator = true;
    else if (argument === "--check" && !separator && !check) check = true;
    else if (argument === "--print-pin" && !separator && !printPin) printPin = true;
    else if (!separator && argument.startsWith("-"))
      throw new Error(`Unknown or repeated option: ${argument}\n${usage}`);
    else if (source !== undefined)
      throw new Error(`Only one source repository is allowed.\n${usage}`);
    else source = argument;
  }
  if (printPin ? check || source !== undefined : !source) throw new Error(usage);
  return { check, printPin, source };
}

// Read raw blobs rather than checking out files: sparse patterns, attributes and filter
// drivers belong to the supplied repository, not the pin. Preserve binary bytes and modes.
function materializeTree(git, commit, source) {
  const entries = git(["ls-tree", "-r", "-z", commit])
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map((entry) => {
      const tab = entry.indexOf("\t");
      const [mode, type, oid] = entry.slice(0, tab).split(" ");
      const file = entry.slice(tab + 1);
      if (type !== "blob" || !["100644", "100755", "120000"].includes(mode))
        throw new Error(`Unsupported pinned tree entry: ${mode} ${file}`);
      return { mode, oid, file };
    });
  for (const { mode, oid, file } of entries) {
    const target = path.join(source, file);
    mkdirSync(path.dirname(target), { recursive: true });
    if (mode === "120000") symlinkSync(git(["cat-file", "blob", oid]), target);
    else {
      // Direct stdout to the file: neither the tree nor a single large blob needs
      // to fit in execFileSync's output buffer.
      const output = openSync(target, "w", mode === "100755" ? 0o755 : 0o644);
      try {
        git(["cat-file", "blob", oid], undefined, output);
      } finally {
        closeSync(output);
      }
    }
  }
}

// The supplied checkout provides objects only. Its files, checkout settings, ignored outputs
// and dependencies never participate. Worktree registration is temporary git metadata.
export function withPinnedSource(repository, commit, scratchRoot, action) {
  const root = realpathSync(repository);
  const env = { ...process.env, GIT_NO_REPLACE_OBJECTS: "1" };
  const git = (args, input, output = "pipe") =>
    execFileSync("git", ["--no-replace-objects", "-C", root, ...args], {
      env,
      input,
      stdio: ["pipe", output, "pipe"],
      maxBuffer: 128 * 1024 * 1024,
    });
  const top = git(["rev-parse", "--show-toplevel"]).toString("utf8").trim();
  if (realpathSync(top) !== root)
    throw new Error("Pass the source repository root, not a subdirectory.");
  mkdirSync(scratchRoot, { recursive: true });
  const temporary = mkdtempSync(path.join(scratchRoot, "article-evidence-"));
  const source = path.join(temporary, "source");
  let added = false;
  try {
    git(["worktree", "add", "--detach", "--no-checkout", source, commit]);
    added = true;
    materializeTree(git, commit, source);
    execFileSync("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], {
      cwd: source,
      env,
      stdio: "pipe",
    });
    execFileSync("npm", ["run", "build"], { cwd: source, env, stdio: "pipe" });
    return action(source);
  } finally {
    try {
      if (added) git(["worktree", "remove", "--force", source]);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  }
}

export function measurementLabel(commit, body) {
  return `Measured at commit \`${commit}\`:\n\n${body}`;
}

export function summarizeValidation(output) {
  const summary = output.match(/validate: (\d+) errors · (\d+) warnings/);
  if (!summary) {
    throw new Error("Could not read the self-hosting validation summary.");
  }
  const counts = new Map([["honesty/gaps", 0]]);
  const warnings = [...output.matchAll(/\[warning\] (\S+) —/g)];
  for (const [, rule] of warnings) {
    if (!counts.has(rule)) {
      throw new Error(`Unexpected self-hosting warning rule: ${rule}`);
    }
    counts.set(rule, counts.get(rule) + 1);
  }
  if (warnings.length !== Number(summary[2])) {
    throw new Error("Warning breakdown does not match the self-hosting validation summary.");
  }
  const breakdown = [...counts].map(([rule, count]) => `${count} \`${rule}\``).join(", ");
  return `${summary[1]} errors and ${summary[2]} intentional warnings (${breakdown})`;
}

export function evidenceBlocks(sourceRoot, pinnedCommit) {
  const realSourceRoot = realpathSync(sourceRoot);
  const exclusions = [
    "--exclude",
    "explorations",
    "--exclude",
    "examples",
    "--exclude",
    "test/fixtures/import/parity",
  ];

  function runCli(args) {
    const result = spawnSync(
      process.execPath,
      [path.join(sourceRoot, "dist/cli/sdp.js"), ...args],
      {
        cwd: sourceRoot,
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
      },
    );
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
    if (result.status !== 0) {
      throw new Error(`sdp ${args.join(" ")} failed:\n${output}`);
    }
    return output.replaceAll(realSourceRoot, "<repo>").replaceAll(sourceRoot, "<repo>").trim();
  }

  function query(body, root = sourceRoot, selfHosting = true) {
    const args = ["q", body, "--root", root, "--json", ...(selfHosting ? exclusions : [])];
    return JSON.parse(runCli(args));
  }

  function recipe(number, parameters = {}, root = sourceRoot, selfHosting = true) {
    return query(
      `return await recipes(${number}, ${JSON.stringify(parameters)})`,
      root,
      selfHosting,
    );
  }

  function sourceText(relativePath) {
    return readFileSync(path.join(sourceRoot, relativePath), "utf8");
  }

  function selfHostingCensus() {
    const specs = query(`return {
    schemaVersion: graph.schemaVersion,
    specs: g.specs().length,
    packs: graph.nodes.filter((n) => n.nodeType === "Pack").map((p) => ({ id: p.id, members: p.members.length })),
    nodes: graph.nodes.length,
    nodeTypes: graph.nodes.reduce((a, n) => ((a[n.nodeType] = (a[n.nodeType] || 0) + 1), a), {}),
    edges: graph.edges.length,
    edgeClaims: graph.edges.reduce((a, e) => ((a[e.claim] = (a[e.claim] || 0) + 1), a), {}),
    locations: graph.locations.length,
    readiness: g.specs().reduce((a, s) => ((a[s.statedReadiness] = (a[s.statedReadiness] || 0) + 1), a), {}),
    deliveryFacts: {
      implemented: g.specs().filter((s) => s.deliveryFacts.includes("implemented")).length,
      hasVerifier: g.specs().filter((s) => s.deliveryFacts.includes("has-verifier")).length,
      observed: g.specs().filter((s) => s.deliveryFacts.includes("observed")).length
    }
  }`);
    return {
      ...specs,
      backlog: recipe(1),
      drift: recipe(2),
      designBacklog: recipe(33),
      questions: recipe(20).totals,
      recipes: readdirSync(path.join(sourceRoot, "dist/recipes")).filter((file) =>
        file.endsWith(".js"),
      ).length,
    };
  }

  function articleCensus() {
    const census = selfHostingCensus();
    return `| Measure | Value |
|---|---|
| Authored Specs | ${census.specs}: ${census.readiness.ready ?? 0} \`ready\`, ${census.readiness.scoped ?? 0} \`scoped\`, ${census.readiness.idea ?? 0} \`idea\` |
| Packs | ${census.packs.length} |
| Source and test bindings | ${census.nodeTypes.CodeNode ?? 0} CodeNodes and ${census.nodeTypes.Anchor ?? 0} Anchors |
| Graph | ${census.nodes.toLocaleString("en-US")} nodes, ${census.edges.toLocaleString("en-US")} edges, ${census.locations.toLocaleString("en-US")} locations |
| Delivery facts | ${census.deliveryFacts.implemented} \`implemented\`, ${census.deliveryFacts.hasVerifier} \`has-verifier\`, ${census.deliveryFacts.observed} \`observed\` |
| Operational build backlog | ${census.backlog.total} |
| Drift alarm | ${census.drift.total} |
| Runnable recipes | ${census.recipes} |`;
  }

  function baselineMetrics() {
    const census = selfHostingCensus();
    const validation = runCli(["validate", ".", ...exclusions]);
    const validationSummary = summarizeValidation(validation);
    const skills = readdirSync(path.join(sourceRoot, ".agents/skills"), {
      withFileTypes: true,
    }).filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(path.join(sourceRoot, ".agents/skills", entry.name, "SKILL.md")),
    ).length;
    const packNames = census.packs.map((pack) => `\`${pack.id.replace(/^pack:/, "")}\``).join(", ");
    return `| Metric | Value |
|---|---|
| Schema | \`${census.schemaVersion}\` |
| Specs and readiness | ${census.specs}: ${census.readiness.ready ?? 0} \`ready\`, ${census.readiness.scoped ?? 0} \`scoped\`, ${census.readiness.idea ?? 0} \`idea\` |
| Packs | ${census.packs.length}: ${packNames} |
| Nodes, edges and locations | ${census.nodes.toLocaleString("en-US")} nodes (${census.nodeTypes.Primitive} Primitive, ${census.nodeTypes.Pack} Pack, ${census.nodeTypes.CodeNode} CodeNode, ${census.nodeTypes.Anchor} Anchor); ${census.edges.toLocaleString("en-US")} edges (${census.edgeClaims.declared.toLocaleString("en-US")} declared, ${census.edgeClaims.anchored.toLocaleString("en-US")} anchored); ${census.locations.toLocaleString("en-US")} locations |
| Delivery facts | ${census.deliveryFacts.implemented} \`implemented\`, ${census.deliveryFacts.hasVerifier} \`has-verifier\`, ${census.deliveryFacts.observed} \`observed\` |
| Build backlog | ${census.backlog.total}, with ${census.backlog.excludedReadyExamples} ready examples and ${census.backlog.excludedReadyDecisions} ready decisions audited and excluded |
| Drift alarm | ${census.drift.total} |
| Design backlog | ${census.designBacklog.totals.specs} |
| Open questions | ${census.questions.questions} across ${census.questions.specs} Specs: ${census.questions.blocking} blocking (${census.questions.deferrals} deferrals, ${census.questions.holds} holds), ${census.questions.nonBlocking} non-blocking |
| Validation | ${validationSummary} |
| Shipped recipes | ${census.recipes} |
| Repository-owned skills | ${skills} |`;
  }

  function exampleBuild() {
    return runCli(["build", "examples/checkout-v1"])
      .split("\n")
      .filter((line) => /^\d+ specs/.test(line) || line.startsWith("Wrote "))
      .join("\n");
  }

  function exampleDrift() {
    const answer = recipe(2, {}, path.join(sourceRoot, "examples/checkout-v1"), false);
    return JSON.stringify(answer, null, 2);
  }

  function constantAnchor() {
    const source = sourceText("examples/checkout-v1/src/orders/create-order.use-case.ts");
    const importLine = source.split("\n")[0];
    const opening = "export const createOrderUseCaseAnchor = codeAnchor({";
    const closing = "\n});";
    const start = source.indexOf(opening);
    const end = start < 0 ? -1 : source.indexOf(closing, start + opening.length);
    if (end < 0) throw new Error("Could not locate the create-order constant anchor.");
    const anchor = source.slice(start, end + closing.length);
    return `${importLine}\n\n// …\n\n${anchor}`;
  }

  function commentAnchor() {
    const source = sourceText("src/projections/census.ts");
    const anchorIndex = source.indexOf("@sdpAnchor impl:protocol.census-page");
    const start = source.lastIndexOf("/**", anchorIndex);
    const end = source.indexOf("*/", anchorIndex);
    if (anchorIndex < 0 || start < 0 || end < 0)
      throw new Error("Could not locate the census comment anchor.");
    return source.slice(start, end + 2);
  }

  function oracle() {
    const source = sourceText("examples/checkout-v1/test/orders/create-order.oracle.ts");
    const start = source.indexOf("export function expected(");
    const end = source.indexOf("\n}", start);
    if (start < 0 || end < 0) throw new Error("Could not locate the create-order oracle.");
    return source.slice(start, end + 2);
  }

  function byFile() {
    return JSON.stringify(query(`return g.byFile("src/projections/census.ts")`), null, 2);
  }

  function roadmapMermaid() {
    runCli(["mermaid", "examples/checkout-v1"]);
    const page = sourceText("examples/checkout-v1/generated/mermaid/pack/checkout-roadmap.md");
    const opening = "```mermaid\n";
    const start = page.indexOf(opening);
    const end = start < 0 ? -1 : page.indexOf("\n```", start + opening.length);
    if (end < 0) throw new Error("Could not read the generated checkout-roadmap Mermaid block.");
    return page.slice(start + opening.length, end);
  }

  const blocks = [
    {
      id: "self-hosting-census",
      file: "01-the-spec-is-the-prompt-is-the-design.md",
      language: null,
      generate: () => measurementLabel(pinnedCommit, articleCensus()),
    },
    {
      id: "roadmap-mermaid",
      file: "02-one-graph-many-views.md",
      language: "mermaid",
      generate: roadmapMermaid,
    },
    {
      id: "example-build",
      file: "03-walkthrough-intent-to-verified-code.md",
      language: "text",
      generate: exampleBuild,
    },
    {
      id: "create-order-carrier",
      file: "03-walkthrough-intent-to-verified-code.md",
      language: "markdown",
      generate: () => sourceText("examples/checkout-v1/specs/orders/create-order.sdp.md"),
    },
    {
      id: "valid-cart-carrier",
      file: "03-walkthrough-intent-to-verified-code.md",
      language: "markdown",
      generate: () =>
        sourceText("examples/checkout-v1/specs/orders/create-order-valid-cart.sdp.md"),
    },
    {
      id: "example-drift",
      file: "03-walkthrough-intent-to-verified-code.md",
      language: "json",
      generate: exampleDrift,
    },
    {
      id: "constant-anchor",
      file: "03-walkthrough-intent-to-verified-code.md",
      language: "ts",
      generate: constantAnchor,
    },
    {
      id: "comment-anchor",
      file: "03-walkthrough-intent-to-verified-code.md",
      language: "ts",
      generate: commentAnchor,
    },
    {
      id: "oracle",
      file: "03-walkthrough-intent-to-verified-code.md",
      language: "ts",
      generate: oracle,
    },
    {
      id: "by-file",
      file: "04-stop-building-verb-walls-for-coding-agents.md",
      language: "json",
      generate: byFile,
    },
    {
      id: "baseline-metrics",
      file: "README.md",
      language: null,
      generate: () => measurementLabel(pinnedCommit, baselineMetrics()),
    },
  ];

  return blocks;
}

function main() {
  const { check, printPin, source: sourceArgument } = parseArguments(process.argv.slice(2));
  const articlesDir = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(articlesDir, "../..");
  const playbook = readFileSync(path.join(articlesDir, "README.md"), "utf8");
  // Bound the link search on each candidate line; repeated incomplete labels must not
  // cause rescans of the rest of the playbook. Accept the playbook's quoted bold label
  // and the plain label used by small source fixtures.
  const pinnedCommit = playbook
    .split("\n")
    .map((line) =>
      /^(?:> \*\*)?Pinned source baseline:[^\r\n]{0,200}tree\/([0-9a-f]{40})(?![0-9a-f])/.exec(
        line,
      ),
    )
    .find((match) => match)?.[1];

  if (!pinnedCommit) {
    throw new Error("The publication plan does not name a full pinned source commit.");
  }

  if (printPin) {
    console.log(pinnedCommit);
    return;
  }

  const documents = new Map(
    readdirSync(articlesDir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => [name, readFileSync(path.join(articlesDir, name), "utf8")]),
  );
  validateEvidenceMarkers(documents, evidenceBlocks(repositoryRoot, pinnedCommit));
  return withPinnedSource(
    sourceArgument,
    pinnedCommit,
    path.join(repositoryRoot, ".scratch"),
    (sourceRoot) => {
      const blocks = evidenceBlocks(sourceRoot, pinnedCommit);
      const drift = [];
      for (const block of blocks) {
        const filePath = path.join(articlesDir, block.file);
        const original = readFileSync(filePath, "utf8");
        const updated = replaceEvidenceBlock(original, block, block.generate());
        if (updated === original) continue;
        if (check) {
          drift.push(`${block.file}: ${block.id}`);
        } else {
          writeFileSync(filePath, updated);
          console.log(`Updated ${block.file}: ${block.id}`);
        }
      }

      if (drift.length > 0) {
        console.error(`Article evidence is stale:\n${drift.join("\n")}`);
        process.exitCode = 1;
      } else {
        console.log(
          `${check ? "Checked" : "Synchronized"} ${blocks.length} evidence blocks at ${pinnedCommit}.`,
        );
      }
    },
  );
}

// Node resolves the main module through symlinks, so compare real paths: a symlinked checkout
// path must still run the check rather than exit 0 having checked nothing.
if (
  process.argv[1] &&
  realpathSync(path.resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))
) {
  main();
}
