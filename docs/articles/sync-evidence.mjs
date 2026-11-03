import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function replaceEvidenceBlock(original, block, generated) {
  const opening = `<!-- evidence:${block.id} -->`;
  const closing = `<!-- /evidence:${block.id} -->`;
  const pattern = new RegExp(
    `${opening.replaceAll("-", "\\-")}\\n[\\s\\S]*?\\n${closing.replaceAll("-", "\\-")}`,
  );
  if (!pattern.test(original)) {
    throw new Error(`${block.file} is missing the ${block.id} evidence markers.`);
  }
  const body = generated.trim();
  const replacement = block.language
    ? `${opening}\n\`\`\`${block.language}\n${body}\n\`\`\`\n${closing}`
    : `${opening}\n${body}\n${closing}`;
  return original.replace(pattern, () => replacement);
}

export function summarizeValidation(output) {
  const summary = output.match(/validate: (\d+) errors · (\d+) warnings/);
  if (!summary) {
    throw new Error("Could not read the self-hosting validation summary.");
  }
  // Recognize both diagnostic rules; baselineMetrics checks which are expected at the pin.
  const counts = new Map([
    ["honesty/gaps", 0],
    ["conformance/prose-mentions", 0],
  ]);
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

function main() {
  const articlesDir = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(articlesDir, "../..");
  const playbook = readFileSync(path.join(articlesDir, "README.md"), "utf8");
  const pinnedCommit = playbook.match(/Pinned source baseline:.*tree\/([0-9a-f]{40})/)?.[1];

  if (!pinnedCommit) {
    throw new Error("The publication plan does not name a full pinned source commit.");
  }

  if (process.argv.includes("--print-pin")) {
    console.log(pinnedCommit);
    process.exit(0);
  }

  const check = process.argv.includes("--check");
  const sourceArgument = process.argv.slice(2).find((argument) => argument !== "--check");
  const sourceRoot = path.resolve(sourceArgument ?? repositoryRoot);
  const realSourceRoot = realpathSync(sourceRoot);
  const sourceCommit = execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();

  if (sourceCommit !== pinnedCommit) {
    throw new Error(
      `Article baseline ${pinnedCommit} does not match source checkout ${sourceCommit}. ` +
        "Pass a checkout of the pinned commit as the source path.",
    );
  }

  const sourceStatus = execFileSync(
    "git",
    ["-C", sourceRoot, "status", "--porcelain", "--", ".", ":(exclude)node_modules"],
    { encoding: "utf8" },
  ).trim();
  if (sourceStatus) {
    throw new Error(
      "The pinned source checkout must be clean before generating article evidence. " +
        `Found changed or untracked paths:\n${sourceStatus}`,
    );
  }

  if (!existsSync(path.join(sourceRoot, "dist/cli/sdp.js"))) {
    throw new Error(`Build the source checkout first: npm --prefix ${sourceRoot} run build`);
  }

  const buildInfoPath = path.join(sourceRoot, "dist/cli/build-info.json");
  if (!existsSync(buildInfoPath)) {
    throw new Error(
      `Build metadata is missing at ${buildInfoPath}; rebuild the pinned source checkout.`,
    );
  }
  const buildCommit = JSON.parse(readFileSync(buildInfoPath, "utf8")).commit;
  if (buildCommit !== pinnedCommit) {
    throw new Error(
      `Article baseline ${pinnedCommit} does not match the CLI build ${buildCommit ?? "unknown"}. ` +
        "Rebuild the pinned source checkout before generating evidence.",
    );
  }

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
    const warningRules = query(`return [...new Set(report.findings
      .filter((finding) => finding.severity === "warning")
      .map((finding) => finding.validatorId))]`);
    for (const rule of warningRules) {
      if (rule !== "honesty/gaps") {
        throw new Error(`Unexpected self-hosting warning rule: ${rule}`);
      }
    }
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
    return JSON.stringify(
      {
        total: answer.total,
        alarms: answer.alarms.map((alarm) => ({
          id: alarm.id,
          statedReadiness: alarm.statedReadiness,
          floorReached: alarm.floorReached,
          implementationBindings: alarm.implementationBindings,
        })),
      },
      null,
      2,
    );
  }

  function constantAnchor() {
    const source = sourceText("examples/checkout-v1/src/orders/create-order.use-case.ts");
    const importLine = source.split("\n")[0];
    const anchor = source.match(
      /export const createOrderUseCaseAnchor = codeAnchor\(\{[\s\S]*?\n\}\);/,
    )?.[0];
    if (!anchor) throw new Error("Could not locate the create-order constant anchor.");
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
    const match = page.match(/```mermaid\n([\s\S]*?)\n```/);
    if (!match) throw new Error("Could not read the generated checkout-roadmap Mermaid block.");
    return match[1];
  }

  const blocks = [
    {
      id: "self-hosting-census",
      file: "01-the-spec-is-the-prompt-is-the-design.md",
      language: null,
      generate: articleCensus,
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
    { id: "baseline-metrics", file: "README.md", language: null, generate: baselineMetrics },
  ];

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
}

// Node resolves the main module through symlinks, so compare real paths: a symlinked checkout
// path must still run the check rather than exit 0 having checked nothing.
if (
  process.argv[1] &&
  realpathSync(path.resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))
) {
  main();
}
