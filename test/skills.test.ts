import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  buildGraphIndex,
  deriveReadiness,
  evaluateBody,
  evaluateReadinessFloor,
  extract,
  generateContracts,
  refines,
  spec,
  specId,
  validateGraph,
} from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";
import { reportVaultError } from "../src/cli/vault-command.js";
import { parseMarkdownBody } from "../src/extract/markdown-body.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { VaultGuardError } from "../src/projections/vault/sync.js";
import { createReader } from "../src/reader/reader.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import {
  bareInvocation,
  catalogHeadings,
  catalogSizePattern,
  describeHandbook,
  describeOnRamp,
  misnamedRecipes,
  taughtQueryBodies,
  teachingText,
} from "./helpers/on-ramp-checks.js";
import { answeredStderr } from "./helpers/query-hint.js";
import { renderStudio } from "./helpers/studio-render.js";

import { parse } from "yaml";
import { describe, expect, it } from "vitest";

import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const skillPaths = [
  "skills/sdp-agent-surface/SKILL.md",
  "skills/sdp-authoring/SKILL.md",
  "skills/sdp-sessions/SKILL.md",
] as const;
const studioSkillPath = "skills/sdp-studio/SKILL.md";
const vaultSkillPath = "skills/sdp-vault/SKILL.md";

/** Every shipped skill; the generic checks run over all of them. */
const allSkillPaths = [...skillPaths, studioSkillPath, vaultSkillPath] as const;

const authoringOnRampImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.authoring-on-ramp"),
  label: "asserts realization of the shipped graph-first authoring skill document",
  satisfies: ref("spec:consumers.authoring-on-ramp"),
});
void authoringOnRampImplementationAnchor;

const deliverySessionOnRampImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.delivery-session-on-ramp"),
  label: "asserts realization of the shipped advisory delivery-session skill document",
  satisfies: ref("spec:consumers.delivery-session-on-ramp"),
});
void deliverySessionOnRampImplementationAnchor;

/** A skill's disclosed reference files, beside its SKILL.md, in name order. */
function skillReferences(path: string): readonly string[] {
  const folder = join(repoRoot, dirname(path), "references");
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => join(dirname(path), "references", name));
}

/**
 * A skill as one teaching text: its SKILL.md followed by every reference it discloses, so a
 * passage the skill moves behind a pointer is still checked. The frontmatter is SKILL.md's.
 */
function readSkill(path: string) {
  const entry = readFileSync(join(repoRoot, path), "utf8");
  const match = /^---\n(?<frontmatter>[\s\S]*?)\n---\n(?<body>[\s\S]+)$/u.exec(entry);

  if (match?.groups?.frontmatter === undefined || match.groups.body === undefined) {
    throw new Error(`${path} does not carry one YAML frontmatter block`);
  }

  const references = skillReferences(path).map((reference) =>
    readFileSync(join(repoRoot, reference), "utf8"),
  );

  return {
    source: [entry, ...references].join("\n"),
    body: [match.groups.body, ...references].join("\n"),
    entry,
    frontmatter: parse(match.groups.frontmatter) as Record<string, unknown>,
  };
}

// A fence inside a numbered step is indented, so fences are matched after trimming.
function shellFenceLines(body: string): readonly string[] {
  const lines: string[] = [];
  let inShellFence = false;

  for (const line of body.split("\n")) {
    const fence = line.trim();
    if (fence.startsWith("```") && fence !== "```") {
      inShellFence = fence === "```sh";
      continue;
    }
    if (fence === "```") {
      inShellFence = false;
      continue;
    }
    if (inShellFence) {
      lines.push(line);
    }
  }

  return lines;
}

const authoringDirectory = "skills/sdp-authoring";
const authoringFile = (name: string) => join(authoringDirectory, name);

/** The bodies of one file's fences in one language, in order. */
function fencesIn(path: string, lang: string): readonly string[] {
  const text = readFileSync(join(repoRoot, path), "utf8");
  return [...text.matchAll(/^```(?<lang>\S+)\n(?<body>[\s\S]*?)\n```$/gmu)]
    .filter((match) => match.groups?.lang === lang)
    .map((match) => match.groups?.body ?? "");
}

/** The one fence a file carries in a language; a second or a missing one fails. */
function onlyFence(path: string, lang: string): string {
  const fences = fencesIn(path, lang);
  expect({ path, lang, fences: fences.length }).toEqual({ path, lang, fences: 1 });
  return fences[0] ?? "";
}

/** A lawful `idea` Spec standing in for a target the taught fences name. */
function stubCarrier(id: string): string {
  return `---\nid: ${id}\nkind: rule\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Stub\n\n## Intent\n\n- outcome: Stand in for a target the taught fences name.\n`;
}

const taughtCarrier = () => onlyFence(authoringFile("references/carrier.md"), "sdp.md");

/** The taught carrier and both taught anchors, their targets, and the two silent non-bindings. */
function taughtCorpus(carrier = taughtCarrier()): Record<string, string> {
  const [constant = "", comment = ""] = fencesIn(authoringFile("references/binding.md"), "ts");
  return {
    "specs/create-order.sdp.md": `${carrier}\n`,
    "specs/checkout.sdp.md": stubCarrier("spec:orders.checkout"),
    "specs/order-numbering.sdp.md": stubCarrier("spec:orders.order-numbering"),
    "src/constant.ts": `${constant}\n`,
    "src/comment.ts": `${comment}\n`,
    // A builder imported from a lookalike module, and a comment opening with `/*`: neither binds.
    "src/lookalike.ts":
      'import { codeAnchor, codeAnchorId, ref } from "./my-anchors";\n\nconst lookalike = codeAnchor({ id: codeAnchorId("impl:orders.lookalike"), satisfies: ref("spec:orders.create-order") });\nvoid lookalike;\n',
    "src/single-star.ts":
      "/*\n * @sdpAnchor impl:orders.single-star\n * @sdpSatisfies spec:orders.create-order\n */\nexport const singleStar = 1;\n",
  };
}

interface TaughtSections {
  intent?: { openQuestions?: { key?: string; blocking?: boolean }[] };
  behavior?: { ruleKeys?: Record<string, string> };
}

const authoringOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.authoring-on-ramp"),
  label: "skill-asset checks verify the authoring on-ramp",
  verifies: ref("spec:consumers.authoring-on-ramp"),
});
void authoringOnRampTestAnchor;

describeOnRamp("sdp-authoring", {
  realizes: ["spec:consumers.authoring-on-ramp", "spec:consumers.adopter-on-ramp"],
});

describe("the authoring on-ramp", () => {
  const touched = [
    "specs/create-order.sdp.md",
    "src/constant.ts",
    "src/comment.ts",
    "src/lookalike.ts",
    "src/single-star.ts",
  ];

  // spec:consumers.authoring-on-ramp#rule.opensOnGraph and #rule.capture: the loop checks an edit
  // with a query that writes nothing, each rung against its floor. #rule.binding: both taught
  // anchor forms bind, and the two silent non-bindings show as empty rows. The structural-binding
  // rule: the taught `@sdpRole` extracts without a finding.
  it("checks an edit as taught: each rung against its floor, the files' findings, what each file records", async () => {
    const check = onlyFence(authoringFile("SKILL.md"), "js");
    const lawful = probeGraph(taughtCorpus());
    expect(lawful.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(await evaluateBody(check, { graph: lawful.graph, params: { files: touched } })).toEqual({
      rungs: { "spec:orders.create-order": "stated scoped, floor scoped" },
      findings: [],
      recorded: [
        ["src/constant.ts", ["impl:orders.create-order"]],
        ["src/comment.ts", ["impl:orders.read-model-rebuild"]],
        ["src/lookalike.ts", []],
        ["src/single-star.ts", []],
      ],
      errors: 0,
    });

    const above = probeGraph(
      taughtCorpus(taughtCarrier().replace("readiness: scoped", "readiness: defined")),
    );
    const answer = (await evaluateBody(check, {
      graph: above.graph,
      params: { files: touched },
    })) as { rungs: Record<string, string>; findings: string[]; errors: number };
    expect(answer.rungs["spec:orders.create-order"]).toBe("stated defined, floor scoped");
    expect(answer.findings).toContain("error honesty/readiness-floor spec:orders.create-order");
    expect(answer.errors).toBe(1);
  });

  // spec:model.open-question-keys, spec:model.rule-keys and spec:model.relation-reasons, as the
  // carrier fence writes them; a key outside the marker is no key.
  it("extracts the taught carrier with its question key, rule key and reason, and no key outside the marker", async () => {
    const { graph } = probeGraph(taughtCorpus());
    const sections = createReader(graph).specContext("spec:orders.create-order")?.sections as
      | TaughtSections
      | undefined;
    expect(sections?.intent?.openQuestions?.[0]).toMatchObject({ key: "cartLock", blocking: true });
    expect(sections?.behavior?.ruleKeys).toEqual({ onePerCart: "rules[0]" });
    expect(
      graph.edges.find(
        (edge) => edge.type === "dependsOn" && edge.from === "spec:orders.create-order",
      )?.reason,
    ).toBe("each created order takes the next number");

    const prose = readFileSync(join(repoRoot, authoringFile("references/carrier.md")), "utf8");
    const address = /`(spec:<id>#question\.[A-Za-z0-9]+)`/u
      .exec(prose)?.[1]
      ?.replace("spec:<id>", "spec:orders.create-order");
    expect(address).toBeDefined();
    const resolution = (await evaluateBody("return recipes(25, params)", {
      graph,
      params: { addresses: [address] },
    })) as { rows: { resolves: boolean }[] };
    expect(resolution.rows.map((row) => row.resolves)).toEqual([true]);

    const inverted = probeGraph(
      taughtCorpus(taughtCarrier().replace(/\[blocking (#\w+)\]/u, "[blocking] $1")),
    );
    const invertedSections = createReader(inverted.graph).specContext("spec:orders.create-order")
      ?.sections as TaughtSections | undefined;
    expect(invertedSections?.intent?.openQuestions?.[0]?.key).toBeUndefined();
  });

  // The executable transition and the sole has-verifier source: the build places a registrar
  // only beside an anchored suite.
  it("emits a registrar only beside a suite whose top-level specTest anchor verifies the example", () => {
    const step = "a cart with {items:number} items";
    const point = "a cart with {items: 2} items";
    const bare = generateContracts(probeGraph(exampleCarriers(step, point)).graph);
    const anchored = generateContracts(
      probeGraph({ ...exampleCarriers(step, point), "suites/probe.test.ts": anchoredSuite }).graph,
    );
    expect([...bare.registrars.keys()]).toEqual([]);
    expect([...anchored.registrars.keys()]).toEqual(["suites/probe.child.test.generated.ts"]);
  });

  // spec:carrier.step-keys#rule.contractKey, as the examples reference teaches it.
  it("keys a step in the vocabulary, as the step-key law and the contract generator agree", () => {
    const examples = readFileSync(join(repoRoot, authoringFile("references/examples.md")), "utf8");
    const [, marked, key, step] =
      /`Given (\[#([a-z][A-Za-z0-9]*)\] ([^`]+))`/u.exec(examples) ?? [];
    if (marked === undefined || key === undefined || step === undefined) {
      throw new Error("the examples reference must teach one keyed Given step");
    }
    const point = step.replace(/\{(\w+):number\}/u, "{$1: 2}");
    expect(point).not.toBe(step);

    const keyed = generateContracts(probeGraph(exampleCarriers(marked, point)).graph);
    expect(keyed.findings.filter((finding) => finding.subjectId === "spec:probe.child")).toEqual(
      [],
    );
    expect(keyed.files.get("probe.child.contract.ts")).toContain(`"${key}"`);

    const childOnly = generateContracts(
      probeGraph(exampleCarriers(step, `[#${key}] ${point}`)).graph,
    );
    expect(childOnly.files.has("probe.child.contract.ts")).toBe(false);
    expect(childOnly.findings.map((finding) => finding.validatorId)).toContain(
      "contracts/conflicting-step-key",
    );
  });

  // spec:validation.corpus-rules#rule.readsGraphOnly and #design.ruleFinding.
  it("runs the taught rules file as a rules file runs, failing on a recipe's diagnostics", async () => {
    const body = onlyFence(authoringFile("references/rules.md"), "js");
    const { graph } = probeGraph(termCorpus);
    const run = (params: Record<string, unknown>) =>
      evaluateBody(body, { graph, params }) as Promise<{ findings: { validatorId: string }[] }>;

    expect((await run({})).findings).toEqual([]);
    expect(
      (await run({ addresses: ["spec:probe.terms#term.missing"] })).findings.map(
        (finding) => finding.validatorId,
      ),
    ).toEqual(["unresolved-address"]);
    await expect(run({ severity: "warn" })).rejects.toThrow(/diagnostics/u);
  });
});

const deliverySessionOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.delivery-session-on-ramp"),
  label: "skill-asset checks verify the advisory delivery-session skill",
  verifies: ref("spec:consumers.delivery-session-on-ramp"),
});
void deliverySessionOnRampTestAnchor;

const graphFirstPlanningImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.graph-first-planning"),
  label: "realizes placement homes and advisory session guidance in the shipped skills",
  satisfies: [ref("spec:consumers.graph-first-planning")],
});
void graphFirstPlanningImplementationAnchor;
const graphFirstPlanningTestAnchor = specTest({
  id: testAnchorId("test:protocol.graph-first-planning"),
  label: "checks placement homes and advisory graph-first session guidance",
  verifies: ref("spec:consumers.graph-first-planning"),
});
void graphFirstPlanningTestAnchor;

describe("Protocol skill assets", () => {
  // spec:consumers.graph-first-planning and the adopter outcome: each ruled home is one line
  // naming its carrying Spec, and that Spec resolves.
  it("names a resolving carrying Spec on every ruled home", () => {
    const entry = readFileSync(join(repoRoot, "skills/sdp-authoring/SKILL.md"), "utf8");
    const homes = entry.split("\n## Ruled homes\n")[1]?.split("\n## ")[0] ?? "";
    const bullets = homes.split(/\n(?=- )/u).filter((bullet) => bullet.startsWith("- "));
    expect(bullets.length).toBeGreaterThan(0);
    const reader = createReader(shippedCorpusGraph());
    for (const bullet of bullets) {
      const cited = [...bullet.matchAll(/`(spec:[a-z0-9.-]+)(?:#[a-z]+\.[A-Za-z0-9]+)?`/gu)].map(
        (match) => match[1] ?? "",
      );
      expect({ bullet, cited: cited.length > 0 }).toEqual({ bullet, cited: true });
      for (const id of cited) {
        expect({ id, resolves: reader.specContext(id) !== undefined }).toEqual({
          id,
          resolves: true,
        });
      }
    }
  });
  it("owns skills at the plugin root and exposes them to project discovery through relative symlinks", () => {
    expect(lstatSync(join(repoRoot, "skills")).isDirectory()).toBe(true);
    for (const link of [".agents/skills", ".claude/skills"]) {
      expect({ link, symlink: lstatSync(join(repoRoot, link)).isSymbolicLink() }).toEqual({
        link,
        symlink: true,
      });
      expect({ link, target: readlinkSync(join(repoRoot, link)) }).toEqual({
        link,
        target: "../skills",
      });
    }
  });

  it("ships the plugin manifest and every skill folder in the package and indexes them in the help", () => {
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      files: string[];
    };
    const folders = readdirSync(join(repoRoot, "skills"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `skills/${entry.name}/SKILL.md`)
      .sort();

    expect(folders).toEqual([...allSkillPaths].sort());
    expect(packageJson.files).toContain("plugin.json");
    expect(packageJson.files).toContain("skills/**");
    expect(packageJson.files).toContain("hooks/**");
    expect(SDP_HELP_TEXT).toContain("plugin.json");
    for (const path of folders) {
      expect(SDP_HELP_TEXT).toContain(path);
    }
  });

  it("declares the package as a portable Agent Plugin and nothing client-specific", () => {
    // Ajv 6 reads draft-07; every keyword the 1.0.0 schema uses means the same there, so only the
    // 2020-12 meta-schema tag is dropped before compiling.
    const Ajv = createRequire(import.meta.url)("ajv") as new () => {
      compile: (schema: unknown) => (value: unknown) => boolean;
    };
    const { $schema: _metaSchema, ...schema } = JSON.parse(
      readFileSync(join(repoRoot, "test/fixtures/agent-plugins/1.0.0/plugin.schema.json"), "utf8"),
    ) as Record<string, unknown>;
    void _metaSchema;
    const conforms = new Ajv().compile(schema);
    const manifest = JSON.parse(readFileSync(join(repoRoot, "plugin.json"), "utf8")) as Record<
      string,
      unknown
    >;
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      name: string;
      version: string;
      license: string;
    };

    expect(conforms(manifest)).toBe(true);
    expect(conforms({ ...manifest, skills: "./skills" })).toBe(false);
    expect(manifest.$schema).toBe("https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
    // A client without a manifest of its own names the plugin after its directory, which is the
    // package's unscoped name wherever it is installed or cloned.
    expect(manifest.name).toBe(packageJson.name.split("/").pop());
    expect(manifest.version).toBe(packageJson.version);
    expect(manifest.license).toBe(packageJson.license);
    for (const clientOnly of [".claude-plugin", ".codex-plugin", "mcp.json"]) {
      expect({ clientOnly, present: existsSync(join(repoRoot, clientOnly)) }).toEqual({
        clientOnly,
        present: false,
      });
    }
    // No reverse-domain client extension directory sits at the plugin root.
    expect(
      readdirSync(repoRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && /^[a-z0-9-]+\.[a-z0-9.-]+$/u.test(entry.name))
        .map((entry) => entry.name),
    ).toEqual([]);
    // The one hooks file is shared: Claude Code and Codex both read `hooks/hooks.json` at the plugin
    // root, so it holds one SessionStart handler whose every field both read, in shell form through
    // the plugin-root variable both set, running a script inside the plugin.
    const hooksFile = JSON.parse(readFileSync(join(repoRoot, "hooks/hooks.json"), "utf8")) as {
      description: string;
      hooks: Record<string, { matcher?: string; hooks: Record<string, unknown>[] }[]>;
    };
    expect(Object.keys(hooksFile).sort()).toEqual(["description", "hooks"]);
    expect(Object.keys(hooksFile.hooks)).toEqual(["SessionStart"]);
    expect(hooksFile.hooks.SessionStart).toEqual([
      {
        hooks: [
          {
            type: "command",
            command: 'node "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.mjs"',
            timeout: 30,
            statusMessage: "Deriving orientation answers",
          },
        ],
      },
    ]);
    expect(existsSync(join(repoRoot, "hooks/session-start.mjs"))).toBe(true);
  });

  it("states no recipe-catalog size in the handbook or the README", () => {
    const size = catalogHeadings().size;
    const sizeStatement = catalogSizePattern(size);
    const wholeRange = new RegExp(`\\brecipes 1 ?(?:-|–|to) ?${String(size)}\\b`, "iu");
    for (const path of ["AGENTS.md", "README.md"]) {
      const text = teachingText(readFileSync(join(repoRoot, path), "utf8"));
      expect({
        path,
        stated: sizeStatement.exec(text)?.[0] ?? null,
        wholeRange: wholeRange.exec(text)?.[0] ?? null,
      }).toEqual({ path, stated: null, wholeRange: null });
    }
  });
});

describeHandbook("AGENTS.md");

// The skill-shape checks flag what goes stale or runs another recipe or program, never a
// wording a reader can judge: a subset count, a capital after a recipe's number, `npx sdp`.
describe("the skill-shape checks' detectors", () => {
  it("flags only the catalog's own size quoted before recipes", () => {
    const sizeStatement = catalogSizePattern(56);
    const flagged = (text: string) => sizeStatement.exec(text)?.[0] ?? null;

    expect(flagged("Five shipped recipes run unchanged as a rules file.")).toBeNull();
    expect(flagged("The 12 bodies above run as written.")).toBeNull();
    expect(flagged("Recipe 56 and the other recipes compose it.")).toBeNull();
    expect(flagged("The catalog holds 56 recipes.")).toBe("56 recipes");
    expect(flagged("all fifty-six shipped recipes")).toBe("fifty-six shipped recipes");
    expect(flagged("Fifty six recipes ship.")).toBe("Fifty six recipes");
    expect(catalogSizePattern(13).exec("thirteen recipes")?.[0]).toBe("thirteen recipes");
  });

  it("flags a recipe's number only beside another recipe's name", () => {
    const headings = catalogHeadings();
    const title = (ordinal: number) => headings.get(ordinal) ?? "";

    expect(misnamedRecipes(`recipe 21, ${title(21)}, reads footing`, headings)).toEqual([]);
    expect(misnamedRecipes("run recipe 9, Then state the rung", headings)).toEqual([]);
    expect(misnamedRecipes(`recipe 21, ${title(53)}, reads`, headings)).toEqual([
      `"recipe 21, ${title(53)}" names recipe 53`,
    ]);
    expect(misnamedRecipes(`${title(54).toLowerCase()} (recipe 29)`, headings)).toHaveLength(1);
  });

  it("reads a taught body whole, whatever operators it quotes, and reports one it cannot read", () => {
    const fenced = (line: string) => `\`\`\`sh\n${line}\n\`\`\`\n`;

    expect(
      taughtQueryBodies(fenced("pnpm --silent sdp:q 'return false || missingFunction()'")),
    ).toEqual({ bodies: ["return false || missingFunction()"], unparsed: [] });
    expect(
      taughtQueryBodies(
        fenced("node <skill-dir>/scripts/q.mjs 'return a && b; c | d' --json && echo done"),
      ),
    ).toEqual({ bodies: ["return a && b; c | d"], unparsed: [] });
    expect(taughtQueryBodies(fenced("pnpm --silent sdp:q 'return 1")).unparsed).toHaveLength(1);
  });

  it("refuses only a copied line that starts with a bare sdp", () => {
    expect(bareInvocation("sdp validate .")).toBe(true);
    expect(bareInvocation("npx sdp validate .")).toBe(false);
    expect(bareInvocation("pnpm exec sdp q 'return g.specs().length'")).toBe(false);
    expect(bareInvocation("sdp q 'return g.specs().length'")).toBe(true);
  });
});

const readingOnRampImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.reading-on-ramp"),
  label: "asserts realization of the shipped graph-reading skill document",
  satisfies: ref("spec:consumers.reading-on-ramp"),
});
void readingOnRampImplementationAnchor;

const readingOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.reading-on-ramp"),
  label: "skill-asset checks verify the graph-reading on-ramp",
  verifies: ref("spec:consumers.reading-on-ramp"),
});
void readingOnRampTestAnchor;

// What holds each rule of `spec:consumers.reading-on-ramp`:
// - `#schemaPointer`, `#factLimits` and the recipe-naming rule: G5 (every law target cited, among
//   them `spec:extraction.derive-graph`, `spec:extraction.claim-taxonomy`,
//   `spec:extraction.delivery-facts`) and G6 (recipe numbers, names and files);
// - `#runner`: G7 and the runner tests below ("keeps the checkout's exclusions…", "refuses with a
//   named remedy…", "passes the runner's exclusions…");
// - `#protocolRoot`: "selects the Protocol's own Specs with --protocol, and only the root";
// - `#orientation` and `#orientationOutput`: "runs every orientation query…", "prints what each
//   query teaches…", "orients over a draft decision…", "prints the field names a body reads…";
// - `#taskIndex`: G4 (the catalog index path resolves and ships);
// - `#pairing` and `#stateAndLaw`: meaning, audited by a reader; no token pin.
describe("the graph-reading on-ramp", () => {
  describeOnRamp("sdp-agent-surface", { realizes: ["spec:consumers.reading-on-ramp"] });

  // The runner and the scripts that derive this checkout's graph share one exclusion list.
  it("passes the runner's exclusions wherever this checkout derives its own graph", async () => {
    const runner = (await import(
      pathToFileURL(join(repoRoot, "skills/sdp-agent-surface/scripts/q.mjs")).href
    )) as { sourceCheckoutExclusions: readonly string[] };
    const { scripts } = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const excludes = runner.sourceCheckoutExclusions.map((path) => `--exclude ${path}`).join(" ");

    expect(scripts["sdp:q"]).toBe("node ./skills/sdp-agent-surface/scripts/q.mjs");
    for (const script of ["generate:self-hosting", "check:self-hosting"]) {
      expect({ script, excluded: scripts[script]?.includes(excludes) }).toEqual({
        script,
        excluded: true,
      });
    }
  });

  // Lockstep with recipe 36: each field the large-scope reading names is one a refused, a whole
  // or a diagnosed bundle carries, and a refused bundle carries no members.
  it("names the context bundle's fields as recipe 36 answers them", async () => {
    const section = flat(
      skillSection("skills/sdp-agent-surface/SKILL.md", "## Read a large scope in parts"),
    );
    const named = [...section.matchAll(/`(?<path>[a-z][A-Za-z]*(?:\.[a-z][A-Za-z]*)?)`/gu)].map(
      (match) => match.groups?.path ?? "",
    );
    const { graph } = probeGraph(termCorpus);
    const answers = (await Promise.all(
      [
        { pack: "pack:probe.review", budget: 1, part: 1 },
        { pack: "pack:probe.review", part: 1 },
        { pack: "pack:probe.absent", part: 1 },
      ].map((params) => evaluateBody("return recipes(36, params)", { graph, params })),
    )) as Record<string, unknown>[];
    const paths = new Set(
      answers.flatMap((answer) =>
        Object.entries(answer).flatMap(([key, value]) => [
          key,
          ...(typeof value === "object" && value !== null && !Array.isArray(value)
            ? Object.keys(value).map((inner) => `${key}.${inner}`)
            : []),
        ]),
      ),
    );

    expect(named.length).toBeGreaterThan(0);
    expect(named.filter((path) => !paths.has(path))).toEqual([]);
    expect(answers[0]?.budgetExceeded).toBe(true);
    expect(answers[0]?.members).toBeUndefined();
  });

  it("runs every orientation query over the Protocol and over a corpus with no subjects given", () => {
    const skill = join(repoRoot, "skills/sdp-agent-surface");
    const notes = readFileSync(join(skill, "references/orientation.md"), "utf8");
    const headings = [...notes.matchAll(/^## (?<heading>\d+\. .+)$/gmu)].map(
      (match) => match.groups?.heading ?? "",
    );
    const slug = (heading: string) =>
      heading
        .toLowerCase()
        .replaceAll(/[^a-z0-9 -]/gu, "")
        .replaceAll(" ", "-");

    for (const root of [[], ["--root", "examples/checkout-v1"]]) {
      const run = spawnSync(
        process.execPath,
        [join(skill, "scripts/orient.mjs"), "--json", ...root],
        {
          cwd: repoRoot,
          encoding: "utf8",
        },
      );
      expect({ root, status: run.status, stderr: run.stderr }).toEqual({
        root,
        status: 0,
        stderr: answeredStderr,
      });
      const answers = JSON.parse(run.stdout) as {
        number: number;
        title: string;
        teaches: string;
        notes: string;
        error?: string;
      }[];
      expect(answers.map((answer) => `${String(answer.number)}. ${answer.title}`)).toEqual(
        headings,
      );
      for (const answer of answers) {
        expect({ number: answer.number, error: answer.error }).toEqual({
          number: answer.number,
          error: undefined,
        });
        expect(answer.teaches.length).toBeGreaterThan(0);
        expect(answer.notes).toBe(
          `references/orientation.md#${slug(`${String(answer.number)}. ${answer.title}`)}`,
        );
      }
    }
  }, 120_000);

  // A body copied from an answer reads what the answer printed: orientation 1 names the fields a
  // binding row carries (a `codeId` or a `verifierId`, never an edge's `from`), and orientation 6
  // prints recipe 20's totals under the recipe's own field name.
  it("prints the field names a body reads: a binding row's, and a composed recipe's own", () => {
    const scripts = join(repoRoot, "skills/sdp-agent-surface/scripts");
    const answer = (args: readonly string[]): unknown => {
      const run = spawnSync(process.execPath, args, { cwd: repoRoot, encoding: "utf8" });
      expect(run.status, run.stderr).toBe(0);
      return JSON.parse(run.stdout);
    };
    const answers = answer([join(scripts, "orient.mjs"), "--json", "--only", "1,6"]) as {
      number: number;
      answer?: { surface?: { binding?: string }; totals?: unknown };
    }[];
    const numbered = (number: number) => answers.find((entry) => entry.number === number)?.answer;
    const binding = numbered(1)?.surface?.binding?.split(" ") ?? [];

    expect(binding).toEqual(expect.arrayContaining(["codeId", "verifierId", "via", "enabled"]));
    expect(binding).not.toContain("from");
    expect(numbered(6)?.totals).toEqual(
      answer([join(scripts, "q.mjs"), "return (await recipes(20)).totals", "--json"]),
    );
  }, 120_000);

  it("prints what each query teaches and shortens an arrival query unless its subject is given", async () => {
    const script = join(repoRoot, "skills/sdp-agent-surface/scripts/orient.mjs");
    const orient = (await import(pathToFileURL(script).href)) as {
      orientationQueries: () => {
        number: number;
        title: string;
        teaches: string;
        subject?: string;
      }[];
    };
    const queries = orient.orientationQueries();
    // The arrival queries take what an agent arrives with: a word, a file, a Spec, an address.
    expect(
      queries.filter((query) => query.subject !== undefined).map((query) => query.number),
    ).toEqual([8, 9, 10, 11]);
    const section = (stdout: string, number: number) =>
      stdout.split(/^## /mu).find((part) => part.startsWith(`${String(number)}. `)) ?? "";
    const run = (args: readonly string[]) =>
      spawnSync(process.execPath, [script, "--only", "4,10", ...args], {
        cwd: repoRoot,
        encoding: "utf8",
      });

    const demonstration = run([]);
    expect(demonstration.status, demonstration.stderr).toBe(0);
    for (const query of queries.filter((candidate) => [4, 10].includes(candidate.number))) {
      expect(section(demonstration.stdout, query.number)).toContain(
        `${String(query.number)}. ${query.title}\nTeaches: ${query.teaches}\n`,
      );
    }
    expect(section(demonstration.stdout, 4)).not.toContain("A shortened demonstration");
    const shortened = section(demonstration.stdout, 10);
    expect(shortened).toMatch(/'… \d+ more'/u);
    expect(shortened).toContain(`--only 10 --subjects '{"10":{"specs":["<a Spec id>"]}}'`);

    // Given its subject, the query answers in full: every rule of the Spec, none counted away.
    const full = run(["--subjects", '{"10":{"specs":["spec:consumers.agent-surface"]}}']);
    expect(full.status, full.stderr).toBe(0);
    const rules = readFileSync(join(repoRoot, "specs/consumers/agent-surface.sdp.md"), "utf8")
      .split("\n")
      .filter((line) => line.startsWith("- rule: "));
    expect(rules.length).toBeGreaterThan(1);
    expect(section(full.stdout, 10)).not.toContain("A shortened demonstration");
    expect(section(full.stdout, 10).match(/'line \d+ /gu)).toHaveLength(rules.length);
  }, 120_000);

  it("refuses a malformed or missing argument before deriving the graph, naming its form", () => {
    const script = join(repoRoot, "skills/sdp-agent-surface/scripts/orient.mjs");
    const form = `such as '{"8":{"terms":["vault"]}}'`;
    const cases: [string[], string][] = [
      // A flag that ends the line would otherwise answer on its default subject or corpus.
      [["--subjects"], "orient: --subjects takes a JSON object keyed by answer number"],
      [["--only"], "orient: --only takes answer numbers"],
      [["--root"], "orient: --root takes a path"],
      [["--subjects", "vault"], "orient: --subjects is not readable JSON"],
      [["--subjects", '["vault"]'], form],
      [
        ["--subjects", '{"terms":["vault"]}'],
        'orient: --subjects key "terms" is no answer number.',
      ],
      [
        ["--subjects", '{"10":{"specs":["spec:x"]}}'],
        "orient: --subjects gives answer 10 a subject, but --only leaves it out.",
      ],
      [["--subjects", '{"8":["vault"]}'], "orient: answer 8 takes an object of parameters"],
      [["--subjects", '{"8":{"word":"vault"}}'], "orient: answer 8 reads term or terms, not word."],
      [["--only", "12"], "orient: --only names no answer 12"],
    ];
    for (const [args, message] of cases) {
      const run = spawnSync(process.execPath, [script, "--only", "8", ...args], {
        cwd: repoRoot,
        encoding: "utf8",
      });
      expect({
        args,
        status: run.status,
        stdout: run.stdout,
        refused: run.stderr.includes(message),
        derived: run.stderr.includes("hint:"),
      }).toEqual({ args, status: 2, stdout: "", refused: true, derived: false });
    }
  });

  it("prints a full-answer call that reads the corpus this run read, runnable as printed", () => {
    // The runner reached through a path with a space, as a client's cache may place it.
    const place = mkdtempSync(join(tmpdir(), "sdp orient "));
    const scripts = join(place, "my scripts");
    symlinkSync(join(repoRoot, "skills/sdp-agent-surface/scripts"), scripts, "dir");
    try {
      const run = spawnSync(
        process.execPath,
        [join(scripts, "orient.mjs"), "--only", "10", "--root", "examples/checkout-v1"],
        { cwd: repoRoot, encoding: "utf8" },
      );
      expect(run.status, run.stderr).toBe(0);
      const printed = /^node .+$/mu.exec(run.stdout)?.[0] ?? "";
      expect(printed).toMatch(/^node '[^']+\/my scripts\/orient\.mjs' --only 10 /u);
      expect(printed.endsWith(" --root examples/checkout-v1")).toBe(true);

      const copied = spawnSync(printed.replace("<a Spec id>", "spec:orders.create-order"), {
        cwd: repoRoot,
        encoding: "utf8",
        shell: true,
      });
      expect(copied.status, copied.stderr).toBe(0);
      expect(copied.stdout).toContain("id: 'spec:orders.create-order'");
      expect(copied.stdout).not.toContain("found: false");
    } finally {
      rmSync(place, { recursive: true, force: true });
    }
  }, 120_000);

  it("warns of skew only when the skill and the CLI come from different builds", async () => {
    const place = mkdtempSync(join(tmpdir(), "sdp-skew-"));
    try {
      // Two copies of one package: the CLI's, and the skill's as a client caches it.
      const packageRoot = (name: string, commit: string | undefined) => {
        const root = join(place, name);
        mkdirSync(join(root, "dist", "cli"), { recursive: true });
        writeFileSync(
          join(root, "package.json"),
          JSON.stringify({ name: "@libar-dev/software-delivery-protocol", version: "1.2.3" }),
        );
        if (commit !== undefined)
          writeFileSync(join(root, "dist", "cli", "build-info.json"), JSON.stringify({ commit }));
        return realpathSync(root);
      };
      const cli = packageRoot("cli", "a".repeat(40));
      const cached = packageRoot("cached", "a".repeat(40));
      mkdirSync(join(cached, "skills/sdp-agent-surface/scripts"), { recursive: true });
      copyFileSync(
        join(repoRoot, "skills/sdp-agent-surface/scripts/q.mjs"),
        join(cached, "skills/sdp-agent-surface/scripts/q.mjs"),
      );
      const runner = (await import(
        pathToFileURL(join(cached, "skills/sdp-agent-surface/scripts/q.mjs")).href
      )) as { skewWarning: (runtime: { packageRoot: string }) => string | undefined };
      const buildInfo = join(cached, "dist", "cli", "build-info.json");

      expect(runner.skewWarning({ packageRoot: cli })).toBeUndefined();
      expect(runner.skewWarning({ packageRoot: cached })).toBeUndefined();
      writeFileSync(buildInfo, JSON.stringify({ commit: "b".repeat(40) }));
      expect(runner.skewWarning({ packageRoot: cli })).toContain(
        `sdp q: this skill comes from ${cached} but the CLI from ${cli}`,
      );
      writeFileSync(buildInfo, JSON.stringify({ commit: "unknown" }));
      expect(runner.skewWarning({ packageRoot: cli })).toContain("their teaching may differ");
      rmSync(buildInfo);
      expect(runner.skewWarning({ packageRoot: cli })).toContain("their teaching may differ");
    } finally {
      rmSync(place, { recursive: true, force: true });
    }
  });

  it("selects the Protocol's own Specs with --protocol, and only the root", async () => {
    const runner = (await import(
      pathToFileURL(join(repoRoot, "skills/sdp-agent-surface/scripts/q.mjs")).href
    )) as {
      protocolArguments: (
        runtime: { mode: string; packageRoot: string },
        args: readonly string[],
      ) => { args: string[] } | { error: string };
    };
    const source = { mode: "source", packageRoot: repoRoot };
    const project = { mode: "adopter", packageRoot: "/project/node_modules/@libar-dev/sdp" };

    expect(runner.protocolArguments(source, ["return 1", "--protocol", "--json"])).toEqual({
      args: ["return 1", "--json", "--root", repoRoot],
    });
    expect(runner.protocolArguments(project, ["return 1", "--protocol"])).toEqual({
      args: ["return 1", "--root", join(project.packageRoot, "specs")],
    });
    expect(runner.protocolArguments(source, ["return 1", "--params", "--protocol"])).toEqual({
      args: ["return 1", "--params", "--protocol"],
    });
    expect(runner.protocolArguments(source, ["return 1", "--protocol", "--root", "."])).toEqual({
      error: "sdp q: --protocol selects the root; pass --protocol or --root, not both.",
    });

    // Here the checkout's own graph derives, exclusions and bindings included; its specs/ alone
    // holds intent only, as the installed package's does.
    const body = 'return g.specContext("spec:consumers.reading-on-ramp")?.deliveryFacts ?? null';
    const facts = (args: readonly string[]) => {
      const run = spawnSync(
        process.execPath,
        [join(repoRoot, "skills/sdp-agent-surface/scripts/q.mjs"), body, "--json", ...args],
        { cwd: repoRoot, encoding: "utf8" },
      );
      expect(run.status, run.stderr).toBe(0);
      return JSON.parse(run.stdout) as unknown;
    };
    expect(facts(["--protocol"])).toEqual(expect.arrayContaining(["implemented"]));
    expect(facts(["--root", "specs"])).toEqual([]);
  }, 120_000);

  it("keeps the checkout's exclusions whenever --root resolves to the checkout", async () => {
    const runner = (await import(
      pathToFileURL(join(repoRoot, "skills/sdp-agent-surface/scripts/q.mjs")).href
    )) as {
      queryArguments: (
        runtime: { cli: string; packageRoot: string; exclusions: readonly string[] },
        args: readonly string[],
        cwd?: string,
      ) => string[];
      sourceCheckoutExclusions: readonly string[];
    };
    const runtime = {
      cli: join(repoRoot, "dist/cli/sdp.js"),
      packageRoot: repoRoot,
      exclusions: runner.sourceCheckoutExclusions,
    };
    const excluded = (args: readonly string[], cwd = repoRoot): boolean =>
      // The runner appends its exclusions after the CLI path, the verb and the caller's arguments.
      runner.queryArguments(runtime, args, cwd).length > args.length + 2;

    expect(excluded(["return 1"])).toBe(true);
    expect(excluded(["return 1", "--root", "."])).toBe(true);
    expect(excluded(["return 1", "--root", "./"])).toBe(true);
    expect(excluded(["return 1", "--root", repoRoot])).toBe(true);
    expect(excluded(["return 1", "--root=."])).toBe(true);
    expect(excluded(["return 1", "--root", ".."], join(repoRoot, "specs"))).toBe(true);
    expect(excluded(["return 1", "--root", "examples/checkout-v1"])).toBe(false);
    expect(excluded(["return 1", "--root", "specs"])).toBe(false);
    expect(excluded(["return 1", "--exclude", "specs", "--root", "examples/checkout-v1"])).toBe(
      false,
    );

    for (const root of [".", repoRoot]) {
      const run = spawnSync(
        process.execPath,
        [
          join(repoRoot, "skills/sdp-agent-surface/scripts/q.mjs"),
          "return g.specs().length > 0",
          "--root",
          root,
          "--json",
        ],
        { cwd: repoRoot, encoding: "utf8" },
      );
      expect({ root, status: run.status, stdout: run.stdout.trim() }).toEqual({
        root,
        status: 0,
        stdout: "true",
      });
    }
  }, 120_000);

  it("orients over a draft decision and passes extraction warnings through", () => {
    const corpus = mkdtempSync(join(tmpdir(), "sdp-orient-draft-"));
    mkdirSync(join(corpus, "specs"));
    mkdirSync(join(corpus, "outside"));
    writeFileSync(
      join(corpus, "specs/draft.sdp.md"),
      "---\nid: spec:probe.draft-decision\nkind: decision\naltitude: feature\nreadiness: idea\nrelations: {}\n---\n# A draft decision\n\n## Intent\n\n- outcome: Settle a question later.\n\n## Decision\n\n- context: The question is open and no ruling exists yet.\n",
    );
    // A linked carrier is skipped with an extraction warning while the graph still derives.
    writeFileSync(
      join(corpus, "outside/linked.sdp.md"),
      "---\nid: spec:probe.linked\nkind: rule\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Linked\n\n## Intent\n\n- outcome: Be reached through a link.\n\n## Rule\n",
    );
    symlinkSync("../outside/linked.sdp.md", join(corpus, "specs/linked.sdp.md"));
    try {
      const run = spawnSync(
        process.execPath,
        [
          join(repoRoot, "skills/sdp-agent-surface/scripts/orient.mjs"),
          "--root",
          corpus,
          "--only",
          "10",
          "--subjects",
          '{"10":{"specs":["spec:probe.draft-decision"]}}',
          "--json",
        ],
        { cwd: repoRoot, encoding: "utf8" },
      );
      expect(run.status, run.stderr).toBe(0);
      expect(run.stderr).toContain("extract/symbolic-link-skipped");
      const [answer] = JSON.parse(run.stdout) as {
        error?: string;
        answer: { id: string; decision: string | null }[];
      }[];
      expect(answer?.error).toBeUndefined();
      expect(answer?.answer[0]).toMatchObject({ id: "spec:probe.draft-decision", decision: null });
    } finally {
      rmSync(corpus, { recursive: true, force: true });
    }
  }, 120_000);

  it("refuses with a named remedy where no runtime is installed", () => {
    const outside = mkdtempSync(join(tmpdir(), "sdp-runner-"));
    try {
      const run = spawnSync(
        process.execPath,
        [join(repoRoot, "skills/sdp-agent-surface/scripts/q.mjs"), "return 1"],
        { cwd: outside, encoding: "utf8" },
      );
      expect(run.status).toBe(2);
      expect(run.stderr).toContain("@libar-dev/software-delivery-protocol is not installed");
      expect(run.stdout).toBe("");
    } finally {
      rmSync(outside, { force: true, recursive: true });
    }
  });
});

const adopterOnRampImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.adopter-on-ramp"),
  label: "asserts realization of the shipped adopter teaching in the authoring skill",
  satisfies: ref("spec:consumers.adopter-on-ramp"),
});
void adopterOnRampImplementationAnchor;

const adopterOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.adopter-on-ramp"),
  label: "skill-asset checks verify the adopter on-ramp",
  verifies: ref("spec:consumers.adopter-on-ramp"),
});
void adopterOnRampTestAnchor;

describe("adopter teaching", () => {
  // spec:consumers.adopter-on-ramp#rule.grammarTable: one row per section owner, citing the grammar.
  it("teaches every Markdown section owner and links the carrying grammar", () => {
    const authoring = readFileSync(
      join(repoRoot, "skills/sdp-authoring/references/carrier.md"),
      "utf8",
    );
    const parser = readFileSync(join(repoRoot, "src/extract/markdown-body.ts"), "utf8");
    const ownerList = /const recognized = \[([\s\S]*?)\] as const;/u.exec(parser)?.[1];
    expect(ownerList).toBeDefined();
    const owners = [...(ownerList ?? "").matchAll(/"([^"\n]+)"/gu)].map((match) => match[1] ?? "");
    expect(owners.length).toBeGreaterThan(0);
    for (const owner of [...owners, "Verification — "]) {
      expect(authoring).toContain(`\`## ${owner}`);
    }
    expect(authoring).toContain("spec:carrier.markdown-body-grammar");
  });
});

describe("adopter rule meanings", () => {
  it.each([true, false])(
    "defined examples ignore parent readiness but read its vocabulary: matches=%s",
    (matches) => {
      const parent = spec({
        id: specId("spec:probe.parent"),
        title: "Deferred parent",
        kind: "behavior",
        altitude: "feature",
        readiness: "scoped",
        intent: {
          outcome: "Exercise the point",
          openQuestions: [{ question: "When to return?", blocking: true }],
        },
        behavior: {
          exampleSpace: {
            given: [matches ? "a cart with {n:number} items" : "a basket with {n:number} items"],
            when: ["submit"],
            then: ["created"],
          },
        },
      });
      const example = spec({
        id: specId("spec:probe.child"),
        title: "Complete point",
        kind: "example",
        altitude: "story",
        readiness: "defined",
        relations: [refines(parent.id)],
        intent: { outcome: "Created" },
        behavior: {
          examples: [{ given: ["a cart with {n: 2} items"], when: ["submit"], then: ["created"] }],
        },
      });
      const index = buildGraphIndex(deriveFixtureGraph({ specs: [parent, example] }));
      const node = index.primitivesById.get(example.id);
      if (node === undefined) throw new Error("missing example probe");
      expect(deriveReadiness(node, index)).toBe(matches ? "defined" : "scoped");
      const clauses = evaluateReadinessFloor(node, index).map((failure) => failure.clauseId);
      expect(clauses).toEqual(matches ? [] : ["kind-evidence-complete"]);
    },
  );
});

const readmeClauses = [
  ["commit pin", /github:libar-dev\/software-delivery-protocol#<sha>/u],
  ["npm script approval", /allowScripts/u],
  ["npm git approval", /allow-git=root/u],
  ["pnpm repository approval", /allowBuilds/u],
  ["pnpm 10 exact approval", /onlyBuiltDependencies \(pnpm 10\)/u],
  ["installed CLI check", /node_modules\/\.bin\/sdp --version/u],
  [
    "vitest subpath requirement",
    /\.\/vitest subpath needs Vitest 2 or later installed beside the package/u,
  ],
  ["recipe subject as params", /dist\/recipes\/25-address-resolution\.js\)" --params/u],
] as const;

describe("adopter install and upgrade guidance", () => {
  it.each(readmeClauses)("the README teaches %s", (_clause, pattern) => {
    const readme = readFileSync(join(repoRoot, "README.md"), "utf8");
    // Keep underscores in executable paths while ignoring code spans and line wrapping.
    expect(readme.replaceAll("`", "").replaceAll(/\s+/gu, " ")).toMatch(pattern);
  });
});

// The glossary's term names the text format; a file written in it is a carrier file. The README's
// definition is the first one an outsider meets, so it keeps the two levels apart the same way.
describe("the carrier's two levels", () => {
  it("glosses the format and the file, and the README defines them the same way", () => {
    const rows = readFileSync(join(repoRoot, "CONTEXT.md"), "utf8")
      .split("\n")
      .filter((line) => line.startsWith("| **carrier** |"));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toContain("the text format that carries the authored `Spec` document");
    expect(rows[0]).toContain(
      '"A carrier" or "a carrier file" is also one file written in that format; say which level when it matters',
    );

    const readme = readFileSync(join(repoRoot, "README.md"), "utf8");
    const carriers = readme
      .slice(readme.indexOf("## Carriers"), readme.indexOf("## Installed CLI"))
      .replaceAll(/\s+/gu, " ");
    expect(carriers).toContain(
      "A carrier is the text format a Spec or a Pack is written in; a carrier file is one file written in it.",
    );
    expect(carriers).not.toMatch(/A carrier is the file/u);
  });
});

function grammarProbe(section: string) {
  return parseMarkdownBody(
    `# Teaching probe\n\n${section}\n`,
    1,
    "teaching-probe.sdp.md",
    "behavior",
  );
}

// Each pair changes only the cardinality or prose permission taught in the table.
// The text checks above and these parser checks must both pass: neither alone binds the teaching.
describe("taught grammar agrees with parser behavior", () => {
  it.each(["wrapped continuation", "indented continuation"])("refuses %s", (label) => {
    const entry = "## Design\n- choice: A value.";
    expect(grammarProbe(entry).findings).toEqual([]);
    expect(
      grammarProbe(`${entry}\n${label.startsWith("indented") ? "  " : ""}More value.`).ok,
    ).toBe(false);
  });

  it("allows leading prose under either owner and refuses it under both", () => {
    const behavior = "## Behavior\n- rule: A rule.";
    const space =
      "## Example space\n```gwt-vocabulary\nGiven a cart\nWhen submit\nThen created\n```";
    const behaviorProse = behavior.replace("\n-", "\nBehavior prose.\n\n-");
    const spaceProse = space.replace("\n```", "\nSpace prose.\n\n```");
    expect(grammarProbe(`${behaviorProse}\n\n${space}`).findings).toEqual([]);
    expect(grammarProbe(`${behavior}\n\n${spaceProse}`).findings).toEqual([]);
    expect(grammarProbe(`${behaviorProse}\n\n${spaceProse}`).ok).toBe(false);
  });

  it.each(["Rule", "Workflow", "Contract", "Verification — manual"])(
    "refuses Note as a plain %s entry",
    (owner) => {
      expect(grammarProbe(`## ${owner}\n- A note: x`).findings).toEqual([]);
      expect(grammarProbe(`## ${owner}\n- Note: x`).ok).toBe(false);
    },
  );

  it.each([
    [
      "unique Model terms",
      "## Model\n- **Term** — A definition.",
      "\n- **Term** — Another definition.",
    ],
    ["unique Design keys", "## Design\n- choice: A value.", "\n- choice: Another value."],
    ["unique UI keys via Design form", "## UI\n- choice: A value.", "\n- choice: Another value."],
    ...["actor", "problem", "outcome", "value"].map((key) => [
      `single Intent ${key}`,
      `## Intent\n- ${key}: A value.`,
      `\n- ${key}: Another value.`,
    ]),
    ...["statement", "flavor", "target", "measurableBy"].map((key) => [
      `single Constraints ${key}`,
      `## Constraints\n- statement: A constraint.${key === "statement" ? "" : `\n- ${key}: A value.`}`,
      `\n- ${key}: Another value.`,
    ]),
    ...["context", "decision"].map((key) => [
      `single Decision ${key}`,
      `## Decision\n- ${key}: A value.`,
      `\n- ${key}: Another value.`,
    ]),
  ])("refuses %s duplicates", (_label, lawful, duplicate) => {
    expect(grammarProbe(lawful).findings).toEqual([]);
    expect(grammarProbe(`${lawful}${duplicate}`).ok).toBe(false);
  });

  it.each(["Behavior", "Rule", "Workflow", "Contract"])(
    "allows %s alone and refuses a second primary owner",
    (owner) => {
      const entry = owner === "Behavior" ? "rule: A rule." : "A plain rule.";
      const section = `## ${owner}\n- ${entry}`;
      expect(grammarProbe(section).findings).toEqual([]);
      const other = owner === "Behavior" ? "Rule" : "Behavior";
      const otherEntry = other === "Behavior" ? "rule: Another rule." : "Another plain rule.";
      const second = `## ${other}\n- ${otherEntry}`;
      expect(grammarProbe(second).findings).toEqual([]);
      expect(grammarProbe(`${section}\n\n${second}`).findings).toContainEqual(
        expect.objectContaining({
          message: "a single-valued Markdown owner is authored more than once",
        }),
      );
    },
  );

  it("allows leading prose in Design and refuses it in Constraints", () => {
    expect(grammarProbe("## Design\nLeading prose.\n\n- choice: A value.").findings).toEqual([]);
    expect(grammarProbe("## Constraints\n- statement: A constraint.").findings).toEqual([]);
    expect(grammarProbe("## Constraints\nLeading prose.\n\n- statement: A constraint.").ok).toBe(
      false,
    );
  });

  it.each([
    ["Intent", "risk", "assumption"],
    ["Decision", "rationale", "alternative", "consequence"],
  ])("allows the taught repeatable %s entries", (owner, ...keys) => {
    for (const key of keys) {
      expect(
        grammarProbe(`## ${owner}\n- ${key}: A value.\n- ${key}: Another value.`).findings,
      ).toEqual([]);
    }
  });
});

/** The text from a heading up to the next heading of the same or a higher level. */
/**
 * The section under a heading, found by its text at whatever level the skill now gives it (a
 * passage moved into a reference file can rise a level), ending at the next heading of the
 * same or a higher level.
 */
function skillSection(path: string, heading: string): string {
  const { source } = readSkill(path);
  const text = heading.replace(/^#+ /u, "");
  const escaped = text.replaceAll(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const found = new RegExp(`^(?<hashes>#{1,6}) ${escaped}$`, "mu").exec(source);
  if (found?.groups?.hashes === undefined) throw new Error(`${path} has no heading ${heading}`);
  const level = found.groups.hashes.length;
  const rest = source.slice(found.index + found[0].length + 1);
  const next = new RegExp(`^#{1,${String(level)}} `, "mu").exec(rest);
  return next === null ? rest : rest.slice(0, next.index);
}

function flat(text: string): string {
  return text.replaceAll(/\s+/gu, " ");
}

/** Writes the files into a fresh extraction root, extracts it, and removes the root. */
function probeGraph(files: Readonly<Record<string, string>>) {
  const root = mkdtempSync(join(tmpdir(), "sdp-skill-probe-"));
  try {
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), text);
    }
    return extract({ root });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function probeCarrier(id: string, kind: string, body: string, relations = "{}"): string {
  return `---\nid: ${id}\nkind: ${kind}\naltitude: story\nreadiness: scoped\nrelations: ${relations}\n---\n# Probe\n\n## Intent\n- outcome: Probe the taught behavior.\n\n${body}\n`;
}

/** A behavior parent whose example space opens with the Given step, and one example child. */
function exampleCarriers(vocabularyStep: string, childStep: string): Record<string, string> {
  return {
    "parent.sdp.md": probeCarrier(
      "spec:probe.parent",
      "behavior",
      `## Behavior\n- rule: The probe states one rule.\n\n## Example space\n\`\`\`gwt-vocabulary\nGiven ${vocabularyStep}\nWhen the probe runs\nThen the probe ends with {result:string}\n\`\`\``,
    ),
    "child.sdp.md": probeCarrier(
      "spec:probe.child",
      "example",
      `\`\`\`gwt\nGiven ${childStep}\nWhen the probe runs\nThen the probe ends with {result: "done"}\n\`\`\``,
      "\n  refines: spec:probe.parent\n  verifies: spec:probe.parent",
    ),
  };
}

const anchoredSuite =
  "/**\n * @sdpAnchor test:probe.suite\n * @sdpVerifies spec:probe.child\n */\nexport const probeSuite = 1;\n";

/** A model Spec with one keyed term, a Pack, an anchored file and an unanchored file citing it. */
const termCorpus = {
  "terms.sdp.md": probeCarrier(
    "spec:probe.terms",
    "model",
    "## Model\n- **step key** — [#stepKey] the key a step carries",
  ),
  "probe.pack.sdp.md":
    "---\nid: pack:probe.review\nspecs:\n  - spec:probe.terms\n---\n# Probe review\n\nThe probe's framing.\n",
  "src/cited.ts":
    "/**\n * @sdpAnchor impl:probe.cited\n * @sdpReferences spec:probe.terms\n */\n// checks spec:probe.terms#term.missing\nexport const cited = 1;\n",
  "src/plain.ts": "// checks spec:probe.terms#term.unrecorded\nexport const plain = 1;\n",
};

/** The `sdp <verb>` line of the help's usage block. */
function usageLine(verb: string): string {
  const line = SDP_HELP_TEXT.split("\n").find((candidate) =>
    candidate.startsWith(`  sdp ${verb} `),
  );
  if (line === undefined) throw new Error(`the help has no usage line for ${verb}`);
  return line;
}

describe("the reviewed skill teaching", () => {
  it("teaches entry addresses, term addresses and anchored source citations as the engine derives them", async () => {
    const { graph } = probeGraph(termCorpus);
    const report = validateGraph(graph);
    const search = (await evaluateBody('return recipes(23, { term: "step key" })', {
      graph,
      report,
    })) as { matches: { address: string | null }[] };
    expect(search.matches.map((match) => match.address)).toContain("spec:probe.terms#term.stepKey");
    expect((graph.citations ?? []).map((citation) => citation.file)).toEqual(["src/cited.ts"]);
    expect(report.findings.filter((finding) => finding.message.includes("term.missing"))).toEqual(
      [],
    );
    const citations = (await evaluateBody("return recipes(51)", { graph, report })) as {
      findings: { subjectId: string }[];
    };
    expect(citations.findings.map((finding) => finding.subjectId)).toEqual([
      "spec:probe.terms#term.missing",
    ]);
  });
});

let shippedCorpus: ReturnType<typeof extract> | undefined;
/** The Protocol's own Specs as the package ships them, extracted once for the citation checks. */
function shippedCorpusGraph() {
  shippedCorpus ??= extract({ root: join(repoRoot, "specs") });
  return shippedCorpus.graph;
}

/**
 * Runs the proposal check as `sdp-sessions` teaches it, over a probe whose first change's scope
 * moved since its base, whose third names a Spec the head lacks and whose fourth declares a
 * relation to one. The fields the routing step names must be fields the answer carries, and the
 * base step's hazard must hold: with the head as its own base, a moved change reads unmoved.
 */
async function assertProposalRouting(text: string): Promise<void> {
  const body = /`(return await recipes\(38, params\))`/u.exec(text)?.[1];
  const form = /`(--params proposal=@\S+ --params base=@[^`]+)`/u.exec(text)?.[1];
  if (body === undefined || form === undefined) {
    throw new Error("the receive steps must teach the proposal-check body and its parameters");
  }
  for (const flag of form.match(/--[a-z]+/gu) ?? []) expect(usageLine("q")).toContain(flag);

  const carrierWith = (limit: string) => ({
    "a.sdp.md": probeCarrier("spec:probe.a", "behavior", `## Design\n- limit: ${limit}`),
    "b.sdp.md": probeCarrier("spec:probe.b", "behavior", "## Behavior\n- rule: A second rule."),
  });
  const base = probeGraph(carrierWith("ten")).graph;
  const head = probeGraph(carrierWith("twelve")).graph;
  const proposal = {
    schema: "sdp-proposal/1",
    base: "0123456",
    reason: "Tighten the limit.",
    changes: [
      { scope: ["spec:probe.a#design.limit"], request: "Lower the limit." },
      { scope: ["spec:probe.b"], request: "Add an example." },
      { scope: ["spec:probe.c"], request: "Name a Spec the head lacks." },
      {
        scope: ["spec:probe.b"],
        request: "Depend on a Spec the head lacks.",
        relation: {
          action: "declare",
          from: "spec:probe.b",
          type: "dependsOn",
          target: "spec:probe.missing-target",
        },
      },
    ],
  };
  interface Row {
    moved: boolean | null;
    scope: Record<string, unknown>[];
    relationTarget: { ref: string; resolvesAtHead: boolean } | null;
  }
  const answer = (await evaluateBody(body, { graph: head, params: { proposal, base } })) as {
    schemaProblems: unknown[];
    totals: { unresolved: number };
    changes: Row[];
  };
  expect(answer.schemaProblems).toEqual([]);
  expect(answer.changes.map((change) => change.moved)).toEqual([true, false, false, false]);
  expect(answer.totals.unresolved).toBe(2);

  // Every field the routing step names is carried by the answer, a change, a scope row or a
  // relation target.
  const carried = new Set(
    [
      answer,
      ...answer.changes,
      ...answer.changes.flatMap((change) => change.scope),
      ...answer.changes.flatMap((change) => (change.relationTarget ? [change.relationTarget] : [])),
    ].flatMap((value) => Object.keys(value)),
  );
  const routing = text.split(/^\d+\. /mu).find((step) => step.includes("schemaProblems")) ?? "";
  const named = [...routing.matchAll(/`([a-z][A-Za-z]*)(?:: (?:true|false|null))?`/gu)]
    .map((match) => match[1] ?? "")
    .filter((name) => !["true", "false", "null"].includes(name));
  expect(named.length).toBeGreaterThan(0);
  for (const name of named)
    expect({ name, carried: carried.has(name) }).toEqual({ name, carried: true });

  // Routed on those fields, only the change whose scope stayed put and resolves applies.
  const toPerson = (row: Row) =>
    row.moved !== false ||
    row.scope.some((item) => item.resolvesAtHead === false) ||
    row.relationTarget?.resolvesAtHead === false;
  expect(answer.changes.map((row) => (toPerson(row) ? "person" : "apply"))).toEqual([
    "person",
    "apply",
    "person",
    "person",
  ]);

  const selfBased = (await evaluateBody(body, {
    graph: head,
    params: { proposal, base: head },
  })) as { changes: Row[] };
  expect(selfBased.changes[0]?.moved).toBe(false);
}

const studioOnRampImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.studio-on-ramp"),
  label: "asserts realization of the shipped Studio skill document",
  satisfies: ref("spec:consumers.studio-on-ramp"),
});
void studioOnRampImplementationAnchor;

const studioOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.studio-on-ramp"),
  label: "skill-asset checks verify the Studio on-ramp against the verbs, workflow and pages",
  verifies: ref("spec:consumers.studio-on-ramp"),
});
void studioOnRampTestAnchor;

describe("the Studio on-ramp", () => {
  const studio = () => readSkill(studioSkillPath);
  const pagesPath = "skills/sdp-studio/references/pages.md";
  const previewsPath = "skills/sdp-studio/references/previews.md";
  const read = (path: string) => readFileSync(join(repoRoot, path), "utf8");
  const workflowText = () => read(".github/workflows/studio-preview.yml");
  const studioAssets = {
    script: join(repoRoot, "dist", "studio", "studio.js"),
    stylesheet: join(repoRoot, "dist", "studio", "studio.css"),
  };

  describeOnRamp("sdp-studio", { realizes: ["spec:consumers.studio-on-ramp"] });

  it("is its own shipped skill, which the reading skill points to", () => {
    expect(studio().frontmatter.name).toBe("sdp-studio");
    expect(readSkill(skillPaths[0]).source).toContain("`sdp-studio`");
  });

  it("teaches the publishing run as the studio and generate verbs take it", async () => {
    // `sdp generate` takes neither optional input; `sdp studio` takes both.
    for (const flag of ["--base", "--runs"]) {
      expect(usageLine("studio")).toContain(flag);
      expect(usageLine("generate")).not.toContain(flag);
    }

    const root = mkdtempSync(join(tmpdir(), "sdp-studio-skill-"));
    try {
      writeFileSync(join(root, "a.sdp.md"), probeCarrier("spec:probe.a", "behavior", ""));
      mkdirSync(join(root, "generated"));
      writeFileSync(join(root, "generated", "graph.json"), "{}");
      const refused = createCaptureOutput();
      expect(
        await runSdpCli(
          ["studio", root, "--base", join(root, "generated", "graph.json")],
          refused.output,
        ),
      ).toBe(1);
      expect(refused.readStderr()).toContain("--base");
      mkdirSync(join(root, "generated", "census"));
      writeFileSync(join(root, "generated", "census", "base.json"), "{}");
      const beneathPageRoot = createCaptureOutput();
      expect(
        await runSdpCli(
          ["studio", root, "--base", join(root, "generated", "census", "base.json")],
          beneathPageRoot.output,
        ),
      ).toBe(1);
      expect(beneathPageRoot.readStderr()).toContain("writes or removes");

      // A base graph the build does not own is read as given and adds the diff page.
      expect(await runSdpCli(["build", root], createCaptureOutput().output)).toBe(0);
      writeFileSync(
        join(root, "generated", "mybase.json"),
        readFileSync(join(root, "generated", "graph.json"), "utf8"),
      );
      await runSdpCli(
        ["studio", root, "--base", join(root, "generated", "mybase.json")],
        createCaptureOutput().output,
        { studioAssets },
      );
      expect(existsSync(join(root, "generated", "spec-studio", "diff.html"))).toBe(true);
      expect(
        await runSdpCli(
          ["generate", root, "--runs", join(root, "x.json")],
          createCaptureOutput().output,
        ),
      ).toBe(1);

      // Build, then stamp, last: a later validate removes the page set and its stamp.
      expect(
        await runSdpCli(["stamp", root, "--commit", "abc1234"], createCaptureOutput().output),
      ).toBe(0);
      expect(existsSync(join(root, "generated", "spec-studio", "stamp.json"))).toBe(true);
      await runSdpCli(["validate", root], createCaptureOutput().output);
      expect(existsSync(join(root, "generated", "spec-studio"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("teaches stamping and the preview workflow as the workflow declares them", () => {
    const text = read(previewsPath);
    const fence = /```yaml\n([\s\S]*?)\n```/u.exec(text)?.[1];
    if (fence === undefined) throw new Error("the previews reference must show the preview job");
    const caller = parse(fence) as {
      on: unknown;
      jobs: Record<string, Record<string, unknown>>;
    };
    const job = caller.jobs["studio-preview"];
    const workflow = parse(workflowText()) as {
      on: { workflow_call: { inputs: Record<string, unknown> } };
      jobs: Record<
        string,
        {
          if?: string;
          permissions?: unknown;
          steps?: { uses?: string; "continue-on-error"?: boolean; with?: unknown }[];
        }
      >;
    };

    expect(String(job?.uses)).toMatch(
      /^libar-dev\/software-delivery-protocol\/\.github\/workflows\/studio-preview\.yml@/u,
    );
    for (const input of Object.keys(job?.with ?? {})) {
      expect(Object.keys(workflow.on.workflow_call.inputs)).toContain(input);
    }
    expect(job?.permissions).toEqual(workflow.jobs.deploy?.permissions);

    // The silent preview hazards the reference states, held to the workflow.
    expect(caller.on).toBe("pull_request");
    expect(workflow.jobs.build?.if).toContain("github.event_name == 'pull_request'");
    expect(workflow.jobs.deploy?.if).toContain(
      "github.event.pull_request.head.repo.full_name == github.repository",
    );
    expect(JSON.stringify(workflow.jobs.deploy?.steps)).toContain("gh-pages");
    const download = workflow.jobs.build?.steps?.find((step) =>
      step.uses?.startsWith("actions/download-artifact"),
    );
    expect(download?.["continue-on-error"]).toBe(true);
    expect(JSON.stringify(workflow.jobs.build?.steps)).toContain(
      "spec-studio-pr-${{ github.event.pull_request.number }}",
    );
    expect(text).toContain("`spec-studio-pr-<number>`");
    expect(workflowText()).toContain('destination="preview/$PR_NUMBER"');
    expect(text).toContain("`preview/<number>/`");
  });

  it("has the preview's run evidence checked against the stamp, never assumed to match it", async () => {
    // The preview stamps the commit it builds, GitHub's merge commit on a pull request.
    const workflow = workflowText();
    expect(workflow).toContain("CORPUS_COMMIT: ${{ github.sha }}");
    expect(workflow).toContain('--commit "$CORPUS_COMMIT"');
    // Reports reach the Studio as they are, their recorded commit included.
    expect(workflow).toContain('inputs+=(--runs "$report")');
    expect(workflow).not.toContain("environment.commit");
    expect(read("src/cli/stamp-command.ts")).toContain("corpusCommit");

    // The body the skill teaches, run as written.
    const line = shellFenceLines(studio().body).find((entry) => entry.includes("recipes(45"));
    const body = /q\.mjs '([^']+)'/u.exec(line ?? "")?.[1];
    if (body === undefined) throw new Error("the Studio skill must teach one run-evidence body");
    // A shipped skill runs it through the reading runner, from the project root.
    expect(line).toContain("../sdp-agent-surface/scripts/q.mjs '");
    expect(line).toContain("--params runs=@");
    const report = (environment?: Record<string, unknown>) => ({
      reportFormat: "CTRF",
      specVersion: "0.0.0",
      results: {
        tool: { name: "vitest" },
        summary: { tests: 0, passed: 0, failed: 0, pending: 0, skipped: 0, other: 0 },
        ...(environment === undefined ? {} : { environment }),
        tests: [],
      },
    });
    const preview = "aaaaaaa";
    expect(
      await evaluateBody(body, {
        graph: probeGraph({}).graph,
        params: {
          runs: [report({ commit: "bbbbbbb" }), report(), report({ commit: preview })],
          commit: preview,
        },
      }),
    ).toEqual([
      { commit: "bbbbbbb", sameCommit: false },
      { commit: null, sameCommit: null },
      { commit: preview, sameCommit: true },
    ]);
  });

  it("maps each task to a page the Studio writes", async () => {
    const taught = [...read(pagesPath).matchAll(/`([a-z/<>]+\.html)`/gu)].map(
      (match) => match[1] ?? "",
    );
    const { graph } = probeGraph({
      "a.sdp.md": probeCarrier(
        "spec:probe.camelCase",
        "behavior",
        "## Behavior\n- rule: One rule.",
      ),
      "probe.pack.sdp.md":
        "---\nid: pack:probe.review\nspecs:\n  - spec:probe.camelCase\n---\n# Probe review\n\nFraming.\n",
    });
    const run = {
      results: {
        tool: { name: "vitest" },
        summary: {
          tests: 0,
          passed: 0,
          failed: 0,
          pending: 0,
          skipped: 0,
          other: 0,
          start: 0,
          stop: 0,
        },
        tests: [],
      },
    };
    const reader = createReader(graph);
    const withInputs = renderStudio(
      await createStudioData(reader, undefined, {
        base: { graph, label: "last design pass" },
        runs: [run],
      }),
    ).map((page) => page.path);
    const without = renderStudio(await createStudioData(reader)).map((page) => page.path);

    expect(taught.length).toBeGreaterThan(10);
    for (const page of taught) {
      const pattern = new RegExp(
        `^${page.replace("<name>", "[^/]+").replaceAll(".", "\\.")}$`,
        "u",
      );
      expect({ page, written: withInputs.some((path) => pattern.test(path)) }).toEqual({
        page,
        written: true,
      });
    }
    for (const page of ["diff.html", "runs.html"]) {
      expect(taught).toContain(page);
      expect(without).not.toContain(page);
    }
    // `<name>` is the id after its namespace, an uppercase letter written `_` and its lowercase.
    expect(withInputs).toContain("specs/probe.camel_case.html");
    expect(withInputs).toContain("exports/probe.review.html");
  });

  it("names each page's recipe by its catalog number and name", () => {
    // A recipe the skill does not run is named by number and name
    // (`spec:consumers.shipped-protocol-corpus#rule.skillShape`): a bare number tells the reader
    // nothing until it is looked up.
    const headings = catalogHeadings();
    const cells = read(pagesPath)
      .split("\n")
      .filter((line) => line.startsWith("| ") && !/^\| (?:Task|-)/u.test(line))
      .map((row) => row.split("|").at(-2)?.trim() ?? "");
    expect(cells.length).toBeGreaterThan(10);
    const unnamed = cells
      .filter((cell) => cell !== "none")
      .flatMap((cell) => cell.split("; "))
      .filter((mention) => {
        const match = /^(?<ordinal>\d+), (?<name>.+)$/u.exec(mention);
        return match === null || headings.get(Number(match.groups?.ordinal)) !== match.groups?.name;
      });
    expect(unnamed).toEqual([]);
  });

  it("receives the composing panel's hand-off through the proposal check", async () => {
    const receive = skillSection(studioSkillPath, "## Receive composed intent");

    // Every panel label the skill quotes is one the panel shows.
    const panel = read("src/studio-elements/intent-panel-element.ts");
    const labels = [...receive.matchAll(/`([A-Z][a-z]+(?: [a-z]+)+)`/gu)].map((m) => m[1] ?? "");
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels)
      expect({ label, shown: panel.includes(label) }).toEqual({
        label,
        shown: true,
      });

    // The memo ends with the exact proposal under `## The proposal`.
    const proposal = {
      schema: "sdp-proposal/1",
      base: "0123456",
      reason: "Probe the memo.",
      changes: [{ scope: ["spec:probe.a"], request: "Add an example." }],
    };
    const { memo } = (await evaluateBody("return recipes(49, params)", {
      graph: probeGraph({}).graph,
      params: { proposal },
    })) as { memo: string };
    expect(receive).toContain("`## The proposal`");
    const saved = /## The proposal\n\n```json\n([\s\S]*?)\n```/u.exec(memo)?.[1];
    expect(JSON.parse(saved ?? "null")).toEqual(proposal);

    // Applying goes through the one receive procedure, in the sessions skill.
    const target = "../sdp-sessions/references/proposals.md";
    expect(receive).toContain(`](${target})`);
    expect(existsSync(join(repoRoot, "skills/sdp-studio", target))).toBe(true);
  });
});

const vaultOnRampImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.vault-on-ramp"),
  label: "asserts realization of the shipped vault skill document",
  satisfies: ref("spec:consumers.vault-on-ramp"),
});
void vaultOnRampImplementationAnchor;

const vaultOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.vault-on-ramp"),
  label: "skill-asset checks verify the vault on-ramp against the verb, its guard and its notes",
  verifies: ref("spec:consumers.vault-on-ramp"),
});
void vaultOnRampTestAnchor;

describeOnRamp("sdp-vault", { realizes: ["spec:consumers.vault-on-ramp"] });

describe("the vault on-ramp", () => {
  const vault = () => readSkill(vaultSkillPath).source;
  /** The one body the skill teaches through the reading skill's runner. */
  const taughtBody = () => {
    const body = /scripts\/q\.mjs '([^']+)'/u.exec(vault())?.[1];
    if (body === undefined) throw new Error("the vault skill must teach one runner body");
    return body;
  };

  it("is its own skill, which the reading skill points to", () => {
    expect(readSkill(skillPaths[0]).source).toContain("`sdp-vault`");
  });

  it("defers placement and the watch to a help text that states them", () => {
    expect(vault()).toContain("`sdp vault --help`");
    const help = flat(SDP_HELP_TEXT.slice(SDP_HELP_TEXT.indexOf("  vault      ")));
    for (const clause of [
      "Open DIR itself as an Obsidian vault.",
      "Keep your notes outside sdp/, by convention in intent/.",
      "--out resolves against cwd; an in-root vault must be under a skipped directory or excluded prefix",
      "--watch reruns on carriers and TypeScript sources",
    ]) {
      expect(help).toContain(clause);
    }
  });

  it("names every refusal reason the guard prints, and no other", () => {
    // A reason added to the guard fails the type check here before it reaches the prose.
    type Reason = VaultGuardError["refusals"][number]["reason"];
    const all: Record<Reason, true> = {
      unknown: true,
      changed: true,
      "not a file": true,
      malformed: true,
    };
    const reasons = Object.keys(all) as Reason[];
    const capture = createCaptureOutput();
    reportVaultError(
      new VaultGuardError(
        reasons.map((reason, index) => ({ path: `sdp/${String(index)}`, reason })),
      ),
      capture.output,
    );
    const printed = capture
      .readStderr()
      .split("\n")
      .flatMap((line) => /\(([a-z ]+)\)$/u.exec(line)?.[1] ?? []);
    const taught = [...vault().matchAll(/^- `\(([a-z ]+)\)`:/gmu)].map((match) => match[1]);
    expect([...taught].sort()).toEqual([...printed].sort());
    expect([...printed].sort()).toEqual([...reasons].sort());
  });

  it("quotes the failed-index warning the command writes", () => {
    const quoted = /"(The last regeneration failed)"/u.exec(vault())?.[1];
    expect(quoted).toBeDefined();
    expect(readFileSync(join(repoRoot, "src/cli/vault-command.ts"), "utf8")).toContain(
      `> [!warning] ${quoted ?? ""}`,
    );
  });

  it("checks converted links with a body that looks bare ids up apart from entry addresses", async () => {
    const { graph } = probeGraph({
      "limit.sdp.md": probeCarrier("spec:probe.limit", "behavior", "## Design\n- limit: ten"),
      "probe.pack.sdp.md":
        "---\nid: pack:probe.review\nspecs:\n  - spec:probe.limit\n---\n# Probe review\n\nThe framing.\n",
    });
    const refs = [
      "spec:probe.limit",
      "pack:probe.review",
      "spec:probe.missing",
      "spec:probe.limit#design.limit",
      "spec:probe.limit#design.missing",
    ];
    const rows = (await evaluateBody(taughtBody(), { graph, params: { refs } })) as string[];
    expect(rows).toEqual([
      "spec:probe.limit: found",
      "pack:probe.review: found",
      "spec:probe.missing: unknown",
      expect.stringMatching(/^spec:probe\.limit#design\.limit: limit\.sdp\.md:\d+$/u),
      "spec:probe.limit#design.missing: entry",
    ]);
  });

  it("resolves both links of its example in the graph the example's call selects", async () => {
    const call = /^ *node <skill-dir>\/\.\.\/sdp-agent-surface\/scripts\/q\.mjs .+$/mu.exec(
      vault(),
    )?.[0];
    expect(call?.endsWith(" --protocol")).toBe(true);
    const params = JSON.parse(/--params '([^']+)'/u.exec(call ?? "")?.[1] ?? "{}") as {
      refs: string[];
    };
    // `--protocol` selects the Protocol's own Specs, in a project as the package ships them.
    const { graph } = extract({ root: join(repoRoot, "specs") });
    const rows = (await evaluateBody(taughtBody(), { graph, params })) as string[];
    expect(rows).toEqual([
      "spec:model.rule-keys: found",
      expect.stringMatching(
        /^spec:consumers\.obsidian-vault#rule\.guard: consumers\/obsidian-vault\.sdp\.md:\d+$/u,
      ),
    ]);
  });

  it("holds the base hazard it states: a newer graph reports a moved entry as unmoved", async () => {
    // The person read the vault at one graph; under --watch it then synchronized to another.
    const limitGraph = (limit: string) =>
      probeGraph({
        "limit.sdp.md": probeCarrier(
          "spec:probe.limit",
          "behavior",
          `## Design\n- limit: ${limit}`,
        ),
      }).graph;
    const read = limitGraph("ten");
    const latestSync = limitGraph("twelve");
    const proposal = {
      schema: "sdp-proposal/1",
      base: "0123456",
      reason: "Answer the limit the person read.",
      changes: [{ scope: ["spec:probe.limit#design.limit"], request: "Lower the limit to eight." }],
    };
    const moved = async (base: typeof read) =>
      (
        (await evaluateBody("return await recipes(38, params)", {
          graph: latestSync,
          params: { proposal, base },
        })) as { changes: { moved: boolean | null }[] }
      ).changes.map((change) => change.moved);
    expect(await moved(read)).toEqual([true]);
    expect(await moved(latestSync)).toEqual([false]);
  });
});

describeOnRamp("sdp-sessions", {
  realizes: ["spec:consumers.delivery-session-on-ramp", "spec:consumers.graph-first-planning"],
});

describe("the delivery-session on-ramp", () => {
  const folder = join(repoRoot, "skills/sdp-sessions");
  const read = (file: string) => readFileSync(join(folder, file), "utf8");
  const teaching = () =>
    ["SKILL.md", "references/proposals.md", "references/design-pass.md"]
      .map(read)
      .join("\n")
      .replaceAll(/\s+/gu, " ");
  const orient = (args: readonly string[]) => {
    const run = spawnSync(
      process.execPath,
      [
        join(repoRoot, "skills/sdp-agent-surface/scripts/orient.mjs"),
        ...args,
        "--json",
        "--root",
        "examples/checkout-v1",
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );
    expect({ args, status: run.status, stderr: run.stderr }).toEqual({
      args,
      status: 0,
      stderr: answeredStderr,
    });
    return JSON.parse(run.stdout) as { number: number; answer: unknown; error?: string }[];
  };

  it("checks a received proposal with the body and fields the proposal check has", async () => {
    await assertProposalRouting(read("references/proposals.md"));
  });

  it("names in the design pass only parameters and fields its recipes take and return", async () => {
    const pass = read("references/design-pass.md");
    const { graph } = probeGraph(termCorpus);
    const run = (number: number, params: Record<string, unknown>) =>
      evaluateBody(`return recipes(${String(number)}, params)`, { graph, params }) as Promise<
        Record<string, unknown>
      >;
    // The answers a pass reads besides its parameters: a refused bundle and a selection.
    const probes: Record<number, Record<string, unknown>> = {
      36: { pack: "pack:probe.review", budget: 1 },
      37: { pack: "pack:probe.review", perspective: { name: "all" } },
    };
    const numbers = [...pass.matchAll(/\(recipe (\d+),/gu)].map((match) => Number(match[1]));
    expect(numbers.length).toBeGreaterThan(0);
    const known = new Set<string>();
    for (const number of numbers) {
      const { accepts } = (await run(number, { "?": 1 })) as unknown as { accepts: string[] };
      for (const name of accepts) known.add(name);
      const probe = probes[number];
      if (probe !== undefined)
        for (const key of Object.keys(await run(number, probe))) known.add(key);
    }
    const named = [...pass.matchAll(/`([a-z][A-Za-z]*)(?:: (?:true|false|null))?`/gu)].map(
      (match) => match[1] ?? "",
    );
    expect(named.length).toBeGreaterThan(0);
    for (const name of named)
      expect({ name, known: known.has(name) }).toEqual({ name, known: true });
  });

  it("runs the orientation answers it names, and the fields it reads from them", () => {
    const text = teaching();
    const numbers = [
      ...new Set([...text.matchAll(/orientation (\d+)/gu)].map((m) => Number(m[1]))),
    ];
    expect(numbers.length).toBeGreaterThan(0);
    const answers = orient(["--only", numbers.join(",")]);
    expect(answers.map((answer) => answer.number).sort()).toEqual([...numbers].sort());
    for (const answer of answers) {
      expect({ number: answer.number, error: answer.error }).toEqual({
        number: answer.number,
        error: undefined,
      });
    }
    for (const [, number, field] of text.matchAll(/orientation (\d+)'s `([A-Za-z]+)`/gu)) {
      const answer = answers.find((entry) => entry.number === Number(number))?.answer;
      expect({ number, field, read: String(field) in Object(answer) }).toEqual({
        number,
        field,
        read: true,
      });
    }
  }, 60_000);

  it("re-measures a hand-off with the one orientation run it teaches", () => {
    const skill = read("SKILL.md").replaceAll(/\s+/gu, " ");
    const taught =
      /`node <skill-dir>\/\.\.\/sdp-agent-surface\/scripts\/orient\.mjs --only ([\d,]+) --subjects '([^']+)'`/u.exec(
        skill,
      );
    if (taught?.[1] === undefined || taught[2] === undefined) {
      throw new Error("the hand-off must teach one orientation run");
    }
    const subjects = taught[2].replaceAll("spec:…", "spec:orders.create-order");
    const answers = orient(["--only", taught[1], "--subjects", subjects]);
    expect(answers.map((answer) => answer.number)).toEqual(taught[1].split(",").map(Number));
    for (const answer of answers) expect(answer.error).toBeUndefined();
    const read10 = answers.find((answer) => answer.number === 10)?.answer as { id: string }[];
    expect(read10.map((row) => row.id)).toEqual(["spec:orders.create-order"]);
  }, 60_000);
});
