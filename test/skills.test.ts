import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildGraphIndex,
  deriveReadiness,
  evaluateBody,
  evaluateReadinessFloor,
  extract,
  generateContracts,
  graphValidatorIds,
  refines,
  spec,
  specId,
  validateGraph,
} from "../src/index.js";
import type { PrimitiveNode } from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";
import { checkVaultDirectory, reportVaultError, vaultDirectory } from "../src/cli/vault-command.js";
import { isExcludedDiscoveryDirectory } from "../src/extract/discover.js";
import { parseMarkdownBody } from "../src/extract/markdown-body.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderVault } from "../src/projections/vault/notes.js";
import { VaultGuardError } from "../src/projections/vault/sync.js";
import { createReader } from "../src/reader/reader.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { renderStudio } from "./helpers/studio-render.js";

import { parse } from "yaml";
import { describe, expect, it } from "vitest";

import {
  codeAnchor,
  codeAnchorId,
  graphClaims,
  graphEdgeTypes,
  graphNodeTypes,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const skillPaths = [
  ".agents/skills/sdp-agent-surface/SKILL.md",
  ".agents/skills/sdp-authoring/SKILL.md",
  ".agents/skills/sdp-sessions/SKILL.md",
] as const;
const studioSkillPath = ".agents/skills/sdp-studio/SKILL.md";
const vaultSkillPath = ".agents/skills/sdp-vault/SKILL.md";

it("discovers the design slice's summary and detail parameter", () => {
  const { body } = readSkill(".agents/skills/sdp-agent-surface/SKILL.md");
  const detail = body.slice(
    body.indexOf("A recipe that takes `params.detail`"),
    body.indexOf("To filter any shipped answer"),
  );
  expect(detail).toContain("the design slice, recipe 54");
});
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

function readSkill(path: string) {
  const source = readFileSync(join(repoRoot, path), "utf8");
  const match = /^---\n(?<frontmatter>[\s\S]*?)\n---\n(?<body>[\s\S]+)$/u.exec(source);

  if (match?.groups?.frontmatter === undefined || match.groups.body === undefined) {
    throw new Error(`${path} does not carry one YAML frontmatter block`);
  }

  return {
    source,
    body: match.groups.body,
    frontmatter: parse(match.groups.frontmatter) as Record<string, unknown>,
  };
}

it("teaches the named-file exception to both carrier-watch descriptions", () => {
  const { body } = readSkill(".agents/skills/sdp-authoring/SKILL.md");
  const discovery = body.slice(
    body.indexOf("The watcher ignores"),
    body.indexOf("Events during a run"),
  );
  const anchors = body.slice(
    body.indexOf("- `sdp validate --watch`"),
    body.indexOf("The law is `spec:decisions.anchor-comment-form`"),
  );
  for (const paragraph of [discovery, anchors]) {
    expect(paragraph).toContain("named rules and parameter files");
    expect(paragraph).not.toContain("carrier edits only");
  }
});

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

function documentedCommands(body: string): readonly string[] {
  return shellFenceLines(body)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.startsWith("pnpm --silent sdp:q ") ||
        line.startsWith("pnpm --silent sdp ") ||
        line.startsWith("pnpm exec sdp "),
    );
}

/** The public commands, read from the help's usage block: one token each, two for `new spec`. */
function publicCommands(): ReadonlySet<string> {
  const usage = SDP_HELP_TEXT.slice(
    SDP_HELP_TEXT.indexOf("Usage:"),
    SDP_HELP_TEXT.indexOf("Options:"),
  );
  const commands = new Set<string>();
  for (const match of usage.matchAll(
    /^ {2}sdp (?<first>[a-z][\w-]*)(?: (?<second>[a-z][\w-]*))?/gmu,
  )) {
    const { first, second } = match.groups ?? {};
    if (first !== undefined) commands.add(second === undefined ? first : `${first} ${second}`);
  }
  return commands;
}

/** The command a documented invocation runs, when it is one the CLI knows. */
function documentedCommand(line: string, commands: ReadonlySet<string>): string | undefined {
  if (line.startsWith("pnpm --silent sdp:q ")) return commands.has("q") ? "q" : undefined;
  const rest = /^(?:pnpm --silent sdp|pnpm exec sdp) (?<rest>.+)$/u.exec(line)?.groups?.rest;
  const [first, second] = (rest ?? "").split(/\s+/u);
  if (first === undefined || first === "") return undefined;
  if (second !== undefined && commands.has(`${first} ${second}`)) return `${first} ${second}`;
  return commands.has(first) ? first : undefined;
}

function assertPlanningHomes(authoring: string): void {
  const placement = authoring
    .split("### Place what is not settled\n")[1]
    ?.split("\n### ")[0]
    ?.replace(/\s+/gu, " ");
  expect(placement).toBeDefined();
  for (const home of [
    "An open question goes under Intent's `### Open questions`.",
    "A deferral is a `[blocking]` open question that names its re-entry trigger in a `trigger:` field, plus `dependsOn` when another Spec must hold first; `spec:decisions.planning-truths-placement` rules this home.",
    "An unsettled fact that bounds other Specs is a `constraint` Spec whose `[blocking]` open question names the check that would settle it. Each Spec it bounds declares `constrainedBy`.",
    "A ruling that awaits its owner is a `decision` Spec below `ready`, with `decidedBy` from each Spec it shapes.",
    "A statement a test checks lives in the Spec that states it, plus an `example` Spec that `verifies` it.",
    "Derive a count, a register, or a review scope each time you need it:",
    "Group a body of work in a Pack named for its capability, never its plan number; keep its Specs in reading order. Membership confers no readiness, delivery fact or gate; the Pack remains a review aggregate after the work ends.",
    "A plan file points to the Pack and carrying Specs for intended truth and derived state. It may keep an advisory execution and recovery record; plan numbering, recorded work order and staleness confer no graph structure or workflow authority.",
  ])
    expect(placement).toContain(home);
}

const authoringOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.authoring-on-ramp"),
  label: "skill-asset checks verify the authoring on-ramp",
  verifies: ref("spec:consumers.authoring-on-ramp"),
});
void authoringOnRampTestAnchor;

const deliverySessionOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.delivery-session-on-ramp"),
  label: "skill-asset checks verify advisory delivery-session routing",
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
  it("keeps planning truth in graph homes and session routing advisory", () => {
    const authoring = readSkill(skillPaths[1]).body;
    const sessions = readSkill(skillPaths[2]).body;
    assertPlanningHomes(authoring);
    expect(sessions).toContain("one current graph serves every work shape");
    expect(sessions).toContain("All preflights are advisory");
    expect(sessions).toContain('Never hand off a carried "verified" verdict');
  });
  it.each([
    "An open question goes",
    "A deferral is",
    "An unsettled fact",
    "A ruling that awaits",
    "A statement a test checks",
    "Derive a count",
    "Group a body of work",
    "A plan file points",
  ])("rejects missing planning guidance: %s", (opening) => {
    const authoring = readSkill(skillPaths[1]).body;
    const withoutHome = authoring.replace(new RegExp(`^- ${opening}[^]*?(?=^\\n|^- )`, "mu"), "");
    expect(withoutHome).not.toBe(authoring);
    expect(() => {
      assertPlanningHomes(withoutHome);
    }).toThrow();
  });
  it("owns skills under .agents and exposes them to Claude through one relative symlink", () => {
    const claudeSkills = join(repoRoot, ".claude", "skills");

    expect(lstatSync(claudeSkills).isSymbolicLink()).toBe(true);
    expect(readlinkSync(claudeSkills)).toBe("../.agents/skills");
  });

  it("ships every skill folder in the package and indexes it in the help", () => {
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      files: string[];
    };
    const folders = readdirSync(join(repoRoot, ".agents", "skills"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `.agents/skills/${entry.name}/SKILL.md`)
      .sort();

    expect(folders).toEqual([...allSkillPaths].sort());
    for (const path of folders) {
      expect(packageJson.files).toContain(path);
      expect(SDP_HELP_TEXT).toContain(path);
    }
  });

  it("uses the repository's two-field single-file convention", () => {
    for (const path of allSkillPaths) {
      const skill = readSkill(path);
      const folder = basename(dirname(path));

      expect(Object.keys(skill.frontmatter).sort()).toEqual(["description", "name"]);
      expect(skill.frontmatter.name).toBe(folder);
      expect(typeof skill.frontmatter.description).toBe("string");
      expect(String(skill.frontmatter.description).length).toBeGreaterThan(40);
    }
  });

  it("keeps every skill graph-first and the authoring law linked to carrying Specs", () => {
    for (const path of allSkillPaths) {
      const { source } = readSkill(path);

      expect(source).toContain("sdp q");
      expect(source).toContain("docs/agent-surface/recipes.md");
      expect(source).toContain(
        "node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md",
      );
      expect(source).toContain("spec:");
    }

    const authoring = readSkill(".agents/skills/sdp-authoring/SKILL.md").source;
    for (const required of [
      "Place what is not settled",
      "Write the Markdown body",
      "spec:carrier.markdown-body-grammar",
      "spec:validation.typed-dependency-floor",
      "spec:decisions.planning-truths-placement",
      "spec:decisions.decision-readiness-posture",
      "spec:extraction.delivery-facts",
      "recipe 20",
      "recipe 22",
      "sdp census",
      "spec:validation.readiness-floor",
      "spec:validation.kind-evidence",
      "spec:validation.oracle-target-eligibility",
      "spec:decisions.content-only-sections",
      "spec:decisions.point-per-example",
      "spec:decisions.binding-not-liveness",
      "spec:decisions.architectural-annotation",
      "spec:decisions.anchor-comment-form",
      "spec:decisions.anchor-binding-grain",
      "spec:decisions.adopted-registrars-committed",
      "spec:extraction.runnable-modules",
      "sdp build",
      "generate:self-hosting",
      "generate:example",
      "bindExample",
      "specTest",
      "specOracle",
      "codeAnchor",
      "componentAnchorId",
      "constant form",
      "comment form",
      "@sdpAnchor",
      "@libar-dev/software-delivery-protocol/anchors",
      "recipe 28",
      ".test.generated.ts",
      "mints nothing and reports nothing",
      "document-realization",
      "registrar",
      "contract-dependent-suites.mjs",
      "mutation",
      "cannot detect",
    ]) {
      expect(authoring).toContain(required);
    }

    const surface = readSkill(".agents/skills/sdp-agent-surface/SKILL.md").source;
    for (const required of [
      "How delivery state derives",
      "declared",
      "anchored",
      "inferred",
      "verifies the Spec directly",
      "enabled verifier",
      "designed-and-deferred",
    ]) {
      expect(surface).toContain(required);
    }
  });

  it("names the complete closed graph schema in the shape section", () => {
    // Lockstep with the engine: adding or removing a node type, edge type, or claim must
    // force this prose to move with it, as the task-sheet test does for the catalog.
    const surface = readSkill(".agents/skills/sdp-agent-surface/SKILL.md").source;

    expect(surface).toContain("The shape of the graph");
    for (const name of [...graphNodeTypes, ...graphEdgeTypes, ...graphClaims]) {
      expect(surface).toContain(`\`${name}\``);
    }
  });

  it("routes delivery sessions through the five advisory graph shapes", () => {
    const sessions = readSkill(".agents/skills/sdp-sessions/SKILL.md").source;

    for (const required of [
      "spec:consumers.delivery-session-on-ramp",
      "Capture / refine",
      "recipe 6",
      "recipe 11",
      "recipe 9",
      "Design",
      "recipe 7",
      "Implement",
      "recipe 1",
      "recipe 3",
      "Review",
      "recipe 5",
      "recipe 8",
      "Close / slim",
      "recipe 2",
      "recipe 4",
      "Never hand off a carried",
      "re-runs the named evidence",
      "never create a process state machine",
    ]) {
      expect(sessions).toContain(required);
    }

    const authoring = readSkill(".agents/skills/sdp-authoring/SKILL.md").source;
    for (const required of [
      "Capture a cheap idea",
      "readiness: idea",
      "relations: {}",
      "promotion preflight (recipe 9)",
      "If a fact straddles kinds",
    ]) {
      expect(authoring).toContain(required);
    }
  });

  it("documents only valid CLI verbs and keeps root-specific exclusions intact", () => {
    const commands = publicCommands();
    const rootExclusions = ["explorations", "examples", "test/fixtures/import/parity"];
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const localQuery = packageJson.scripts["sdp:q"] ?? "";

    expect([...commands].sort()).toEqual(
      [
        "build",
        "census",
        "generate",
        "gherkin",
        "import",
        "mermaid",
        "new spec",
        "q",
        "stamp",
        "studio",
        "validate",
        "vault",
        "view",
      ].sort(),
    );
    expect(documentedCommand("pnpm exec sdp frobnicate .", commands)).toBeUndefined();
    expect(documentedCommand("pnpm exec sdp new widget PATH", commands)).toBeUndefined();
    expect(documentedCommand("pnpm exec sdp new spec PATH", commands)).toBe("new spec");

    for (const exclusion of rootExclusions) {
      expect(localQuery).toContain(`--exclude ${exclusion}`);
    }

    for (const path of allSkillPaths) {
      const documented = documentedCommands(readSkill(path).body);
      expect(documented.length).toBeGreaterThan(0);

      for (const line of documented) {
        expect({ path, line, known: documentedCommand(line, commands) !== undefined }).toEqual({
          path,
          line,
          known: true,
        });
        // The repository's own `sdp` script at this root needs the three fixture exclusions.
        if (line.startsWith("pnpm --silent sdp ") && / \.(?: |$)/u.test(line)) {
          for (const exclusion of rootExclusions) {
            expect({ path, line, exclusion: line.includes(`--exclude ${exclusion}`) }).toEqual({
              path,
              line,
              exclusion: true,
            });
          }
        }
      }
    }
  });

  it("uses the local runtime or package runner instead of a colliding global binary", () => {
    // The hazard is a documented invocation the collector above would never collect: a bare
    // `sdp` resolves to whatever binary shadows it on PATH (macOS ships an unrelated `sdp`),
    // so the check scans every shell-fenced line rather than the pnpm-prefixed subset.
    for (const path of allSkillPaths) {
      const bareInvocations = shellFenceLines(readSkill(path).body).filter((line) =>
        /^\s*(?:sdp|npx +sdp|npm +exec +sdp)\b/u.test(line),
      );

      expect({ path, bareInvocations }).toEqual({ path, bareInvocations: [] });
    }
  });

  it("contains no contradictory shortcuts for readiness or verifier realization", () => {
    const forbidden = [
      "has-verifier means tests pass",
      "ready is conferred by tooling",
      "ready is derived from the floor",
      "bindExample call sites are extracted",
      "verification mode proves a verifier exists",
    ];

    for (const path of allSkillPaths) {
      const source = readSkill(path).source.toLowerCase();

      for (const claim of forbidden) {
        expect(source).not.toContain(claim);
      }
    }
  });

  it("states no recipe-catalog size in an on-ramp", () => {
    // The catalog's size is derived, never quoted: an on-ramp points to the catalog and names
    // recipes by number and name. A recipe's own number is not a size.
    const size = catalogOrdinals().length;
    const sizeStatement = catalogSizePattern();

    expect(size).toBeGreaterThan(0);
    for (const statement of [
      "the forty runnable sdp q bodies",
      "the 40 recipe bodies",
      "thirty-two graph-first recipes",
      "catalog contains forty-one ready-made bodies",
    ]) {
      expect(statement).toMatch(sizeStatement);
    }
    for (const ordinal of [
      "recipes 33 to 40",
      "recipes 12-16",
      "run recipe 4 and recipe 22",
      "Use recipe 6 to locate recipes.",
      "Recipe 35 compares bodies.",
      "recipes 4, 29 and 35 return summary bodies",
    ]) {
      expect(ordinal).not.toMatch(sizeStatement);
    }

    for (const path of ["AGENTS.md", "README.md", ...allSkillPaths]) {
      const text = teachingText(readFileSync(join(repoRoot, path), "utf8"));
      const wholeRange = new RegExp(`\\brecipes 1 ?(?:-|–|to) ?${String(size)}\\b`, "iu");
      expect({ path, stated: sizeStatement.exec(text)?.[0] ?? null }).toEqual({
        path,
        stated: null,
      });
      expect({ path, wholeRange: wholeRange.exec(text)?.[0] ?? null }).toEqual({
        path,
        wholeRange: null,
      });
    }
  });
});

/** The recipe numbers the catalog's numbered headings carry, in order. */
function catalogOrdinals(): readonly number[] {
  const catalog = readFileSync(join(repoRoot, "docs/agent-surface/recipes.md"), "utf8");
  return [...catalog.matchAll(/^## (\d+)\. /gmu)].map((match) => Number(match[1]));
}

/**
 * A count, in digits or words up to ninety-nine, followed within three words by recipes or bodies.
 * A number that names recipes, after `recipe` or `recipes` or after another such number through a
 * list or range joiner, is the recipe's own number and never a count.
 */
function catalogSizePattern(): RegExp {
  const ones = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const words = [
    ...ones,
    ...tens.flatMap((ten) => [ten, ...ones.slice(0, 9).map((one) => `${ten}-${one}`)]),
  ];
  const counts = words.sort((left, right) => right.length - left.length).join("|");
  const recipeOwnNumber = String.raw`(?<!\brecipes?\s+(?:\d+\s*(?:,|-|–|to|and|or)\s*)*)`;
  return new RegExp(
    `${recipeOwnNumber}\\b(?:${counts}|\\d+)(?:\\s+[\\w-]+){0,3}?\\s+(?:recipes|bodies)\\b`,
    "iu",
  );
}

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

describe("the graph-reading on-ramp", () => {
  it("maps a task to every catalog recipe in one sheet", () => {
    const surface = readSkill(".agents/skills/sdp-agent-surface/SKILL.md").source;
    const heading = "### Which recipe answers a task";
    const start = surface.indexOf(heading);
    expect(start).toBeGreaterThan(-1);
    const sheet = surface
      .slice(start + heading.length)
      .trimStart()
      .split("\n\n")[0];
    const rows = (sheet ?? "").split("\n").filter((line) => /^\| [^-]/u.test(line));
    const ordinals = rows.flatMap((row) =>
      [...row.matchAll(/\(recipe (\d+)\)/gu)].map((match) => Number(match[1])),
    );

    expect(rows.length).toBeGreaterThan(1);
    for (const row of rows.slice(1)) {
      expect({ row, namesRecipe: /\(recipe \d+\)/u.test(row) }).toEqual({ row, namesRecipe: true });
    }
    expect([...new Set(ordinals)].sort((left, right) => left - right)).toEqual(catalogOrdinals());
  });

  it("links the Specs that own the graph contract, the claims and the sink", () => {
    const surface = readSkill(".agents/skills/sdp-agent-surface/SKILL.md").source;
    for (const owner of [
      "spec:consumers.agent-surface",
      "spec:decisions.agent-front-door",
      "spec:extraction.derive-graph",
      "spec:extraction.claim-taxonomy",
      "spec:consumers.agent-surface.evaluation-sink",
    ]) {
      expect(surface).toContain(`\`${owner}\``);
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
  it("teaches every Markdown section owner and links the carrying grammar", () => {
    const authoring = readSkill(".agents/skills/sdp-authoring/SKILL.md").source;
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

// Match the teaching clause, not a nearby citation or an unrelated use of its terms.
// Whitespace and Markdown emphasis are incidental; polarity, homes, and thresholds are not.
function teachingText(source: string): string {
  return source.replaceAll(/[`*_]/gu, "").replaceAll(/\s+/gu, " ");
}

const adopterClauses = [
  ["open-question home", /open question (?:goes )?under Intent's ### Open questions/u],
  ["blocking floor", /A \[blocking\] entry holds the Spec below defined/u],
  ["blocking deferral", /A deferral (?:is|belongs in) a \[blocking\] open question/u],
  ["deferral trigger", /A deferral[^.]*that names its re-entry trigger/u],
  ["deferral precondition", /plus dependsOn when another Spec must hold first/u],
  ["independent defined floor", /defined floor does not read the parent's readiness/u],
  [
    "complete example children",
    /example children can still state defined once their bound points are complete/u,
  ],
  [
    "example vocabulary agreement",
    /bound points are complete and match the parent's example vocabulary, when it has one/u,
  ],
  ["physical entry line", /a wrapped or indented continuation is refused/u],
  [
    "one leading prose owner",
    /Leading prose may stand under that owner or under Example space, not both/u,
  ],
  ["Note is refused", /parser reads - Note: x as a key and refuses it/u],
  ["ready reads parent", /ready floor does read the parent's readiness/u],
  ["ready waits for defined parent", /their ready waits until the parent states defined/u],
  ["unsettled constraint home", /An unsettled fact that bounds other Specs is a constraint Spec/u],
  [
    "unsettled blocking check",
    /constraint Spec whose \[blocking\] open question names the check that would settle it/u,
  ],
  ["bounded relation", /Each Spec it bounds declares constrainedBy/u],
  ["bounded defined allowed", /A bounded Spec can still state defined/u],
  ["bounded ready waits", /the floor refuses its ready until the constraint states defined/u],
  [
    "pending decision below ready",
    /A ruling that awaits its owner is a decision Spec below ready/u,
  ],
  ["shaping relation", /with decidedBy from each Spec it shapes/u],
  ["owner states ready", /The owner's ratification is the edit that states ready/u],
  ["checked statement home", /A statement a test checks lives in the Spec that states it/u],
  ["checking example relation", /plus an example Spec that verifies it/u],
  ["example test binding", /Bind the example with a specTest anchor/u],
  ["derived verifier fact", /The graph (?:then )?derives has-verifier on the Spec/u],
  [
    "verifier existence versus passing",
    /has-verifier (?:says|means) a bound verifier exists, not that it (?:passed|has passed)/u,
  ],
  ["CI owns outcomes", /pass and fail stay in CI/u],
  ["no authored checked status", /Author no checked or verified status/u],
  [
    "fresh derived counts registers scope",
    /Derive a count, a register, or a review scope each time you need it/u,
  ],
  ["census source", /census counts from sdp census/u],
  ["open-question register source", /open questions from recipe 20/u],
  ["dependency register source", /one Spec's dependencies from recipe 21/u],
  ["mention register source", /prose mentions from recipe 22/u],
  ["delta scope source", /a change's review scope from changed-file blast radius \(recipe 4\)/u],
  ["no quoted counts", /In prose, name the recipe and leave the number out/u],
  ["operator-selected policy", /operator-selected rules file through sdp validate --rules PATH/u],
  ["per-file policy parameters", /Each --params follows its own --rules/u],
  [
    "separate policy findings",
    /Corpus findings name their rule and rules file and print apart from Protocol/u,
  ],
  ["policy failures", /any Protocol error, corpus error or failed rules file exits 1/u],
  ["watch policy rereads", /every cycle rereads rules and parameter files/u],
  [
    "Constraints leading-prose exception",
    /A section may open with paragraphs, except Constraints, which takes its entries only/u,
  ],
  ["one primary owner", /A Spec carries at most one of Behavior, Rule, Workflow, and Contract/u],
] as const;

const grammarRows = [
  ["Intent", /actor:, problem:, outcome:, value: at most once each/u],
  ["Intent", /risk: and assumption: any number of times/u],
  ["Behavior", /rule: and flow: entries/u],
  ["Rule", /plain entries, one rule each/u],
  ["Workflow", /plain entries, one flow each/u],
  ["Workflow", /plus rule: entries/u],
  ["Contract", /plain entries, one rule each/u],
  ["Example space", /one gwt-vocabulary fence/u],
  ["Example space", /and no entries/u],
  ["Constraints", /one constraint:/u],
  ["Constraints", /statement: \(required\)/u],
  ["Constraints", /statement: \(required\), flavor:, target:, measurableBy:, once each/u],
  ["Model", /\*\*term\*\* — definition/u],
  ["Model", /terms (?:are|must be) unique/u],
  ["Design", /lowerCamelKey: one-line value/u],
  ["Design", /keys (?:are|must be) unique/u],
  ["Decision", /context: and decision: once each/u],
  ["Decision", /rationale:, alternative:, consequence: repeated/u],
  ["UI", /the Design form/u],
  ["Verification — <mode>", /plain entries, one criterion each/u],
  ["Verification — <mode>", /the mode is manual, reviewed, contract, or executable/u],
  ["Verification — <mode>", /after an em dash/u],
] as const;

describe("adopter rule meanings", () => {
  it.each(adopterClauses)("teaches %s", (_clause, pattern) => {
    const authoring = readSkill(".agents/skills/sdp-authoring/SKILL.md").source;
    expect(teachingText(authoring)).toMatch(pattern);
  });

  it.each([
    [
      "independent defined floor",
      "defined floor does not read the parent's readiness",
      "defined floor does not read the parent",
    ],
    [
      "independent defined floor",
      "defined floor does not read the parent's readiness",
      "defined floor does read the parent's readiness",
    ],
    [
      "example vocabulary agreement",
      "complete and match the parent's example vocabulary, when it has one",
      "complete even when they do not match the parent's example vocabulary",
    ],
    [
      "ready reads parent",
      "ready floor does read the parent's readiness",
      "ready floor does not read the parent's readiness",
    ],
    [
      "physical entry line",
      "a wrapped or indented continuation is refused",
      "a wrapped or indented continuation is accepted",
    ],
    [
      "one leading prose owner",
      "Leading prose may stand under that owner or under Example space, not both",
      "Leading prose may sit under both the behavior owner and Example space",
    ],
    [
      "Note is refused",
      "The parser reads - Note: x as a key and refuses it",
      "The parser accepts - Note: x",
    ],
    [
      "open-question home",
      "An open question goes under Intent's ### Open questions.",
      "An open question goes outside Intent's ### Open questions.",
    ],
  ])("rejects the opposite teaching for %s: %s", (name, original, opposite) => {
    const text = teachingText(readSkill(".agents/skills/sdp-authoring/SKILL.md").source);
    const pattern = adopterClauses.find(([clause]) => clause === name)?.[1];
    expect(pattern).toBeDefined();
    if (pattern === undefined) throw new Error("missing teaching clause");
    expect(text).toContain(original);
    expect(text).toMatch(pattern);
    expect(text.replace(original, opposite)).not.toMatch(pattern);
  });

  it("accepts a harmless open-question instruction frame", () => {
    const pattern = adopterClauses.find(([name]) => name === "open-question home")?.[1];
    if (pattern === undefined) throw new Error("missing home clause");
    const text = teachingText(readSkill(".agents/skills/sdp-authoring/SKILL.md").source);
    expect(text.replace("An open question goes under", "Put an open question under")).toMatch(
      pattern,
    );
  });

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

  it.each(grammarRows)("teaches the %s grammar row", (heading, pattern) => {
    const authoring = readSkill(".agents/skills/sdp-authoring/SKILL.md").source;
    const rows = authoring.split("\n").filter((line) => line.startsWith(`| \`## ${heading}\``));
    expect(rows).toHaveLength(1);
    // Preserve Model's bold-term syntax while ignoring the table's code-span delimiters.
    expect((rows[0] ?? "").replaceAll("`", "").replaceAll(/\s+/gu, " ")).toMatch(pattern);
  });

  it("keeps graph-reader verifier teaching about existence and CI outcomes", () => {
    const surface = teachingText(readSkill(".agents/skills/sdp-agent-surface/SKILL.md").source);
    expect(surface).toMatch(/It says a resolving verifier binding exists/u);
    expect(surface).toMatch(/Pass, fail, skip, and quarantine are CI's/u);
  });

  it("keeps session teaching advisory and separate from permission", () => {
    const sessions = teachingText(readSkill(".agents/skills/sdp-sessions/SKILL.md").source);
    expect(sessions).toMatch(/All preflights are advisory/u);
    expect(sessions).toMatch(
      /They never authorize, block, scope, unlock, or advance delivery work/u,
    );
  });
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

/**
 * The keyed open-question marker the authoring skill teaches, as one code span, and the address it
 * says that marker has, read from the sentence that pairs them.
 */
function taughtQuestionMarker(): { readonly marker: string; readonly address: string } {
  const text = readSkill(".agents/skills/sdp-authoring/SKILL.md").source;
  const taught = /`([^`]+)` is\s+addressed as\s+`(spec:<id>#question\.[^`]+)`/u.exec(text);
  const marker = taught?.[1];
  const address = taught?.[2];
  if (marker === undefined || address === undefined) {
    throw new Error("the authoring skill must pair one keyed marker with its question address");
  }
  return { marker, address };
}

/**
 * Writes the marker on one open question of a Spec in a temporary corpus, beside a second Spec
 * that names the address and declares `dependsOn` on the first, then extracts and validates.
 */
function probeQuestionMarker(marker: string, addressTemplate: string) {
  const subjectId = "spec:probe.taught";
  const address = addressTemplate.replace("spec:<id>", subjectId);
  const root = mkdtempSync(join(tmpdir(), "sdp-taught-marker-"));
  try {
    writeFileSync(
      join(root, "taught.sdp.md"),
      `---
id: ${subjectId}
kind: rule
altitude: story
readiness: idea
relations: {}
---
# Taught marker probe

## Intent
- outcome: Carry the keyed question the authoring skill teaches.

### Open questions
- ${marker} Does the owner widen the aggregate?

## Rule
- The probe states one rule.
`,
    );
    writeFileSync(
      join(root, "citing.sdp.md"),
      `---
id: spec:probe.citing
kind: rule
altitude: story
readiness: idea
relations:
  dependsOn: ${subjectId}
---
# Citing probe

The probe cites ${address} by its address.

## Intent
- outcome: Name the taught question by its address.

## Rule
- The probe states one rule.
`,
    );
    const extraction = extract({ root });
    const subject = extraction.graph.nodes.find(
      (node): node is PrimitiveNode => node.nodeType === "Primitive" && node.id === subjectId,
    );
    const intent = (subject?.sections as Record<string, unknown> | undefined)?.intent;
    const questions = (intent as Record<string, unknown> | undefined)?.openQuestions;
    const first: unknown = Array.isArray(questions) ? questions[0] : undefined;
    return {
      address,
      extractionErrors: extraction.report.findings.filter(
        (finding) => finding.severity === "error",
      ),
      key: (first as Record<string, unknown> | undefined)?.key,
      mentionFindings: validateGraph(extraction.graph).findings.filter(
        (finding) => finding.validatorId === graphValidatorIds.proseMentions,
      ),
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("the taught question marker", () => {
  it("extracts the key the skill's marker carries and resolves the address the skill gives it", () => {
    const { marker, address } = taughtQuestionMarker();
    const probe = probeQuestionMarker(marker, address);
    expect(probe.address).toBe(address.replace("spec:<id>", "spec:probe.taught"));
    expect(probe.extractionErrors).toEqual([]);
    expect(probe.key).toBe(address.slice(address.indexOf("#question.") + "#question.".length));
    expect(probe.mentionFindings).toEqual([]);
  });

  it("leaves the address unresolved when the key stands outside the brackets", () => {
    const { marker, address } = taughtQuestionMarker();
    const inverted = /^\[(\S+) (#\S+)\]$/u.exec(marker);
    if (inverted?.[1] === undefined || inverted[2] === undefined) {
      throw new Error("the taught marker must carry its flag and its key inside the brackets");
    }
    const probe = probeQuestionMarker(`[${inverted[1]}] ${inverted[2]}`, address);
    expect(probe.key).toBeUndefined();
    expect(probe.mentionFindings).toHaveLength(1);
    expect(probe.mentionFindings[0]?.severity).toBe("error");
    expect(probe.mentionFindings[0]?.message).toContain("points to missing entry");
  });
});

/** The text from a heading up to the next heading of the same or a higher level. */
function skillSection(path: string, heading: string): string {
  const { source } = readSkill(path);
  const start = source.indexOf(`\n${heading}\n`);
  if (start === -1) throw new Error(`${path} has no heading ${heading}`);
  const level = /^#+/u.exec(heading)?.[0].length ?? 2;
  const rest = source.slice(start + heading.length + 2);
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
  const surfacePath = skillPaths[0];
  const authoringPath = skillPaths[1];
  const sessionsPath = skillPaths[2];

  it("creates the anchored suite before generating, and the build places the registrar beside it", () => {
    const steps = skillSection(authoringPath, "## Make an example executable");
    const anchorFirst = steps.indexOf("top-level `specTest` anchor");
    expect(anchorFirst).toBeGreaterThan(-1);
    expect(anchorFirst).toBeLessThan(steps.indexOf("npm run generate:self-hosting"));
    expect(shellFenceLines(steps).map((line) => line.trim())).not.toContainEqual(
      expect.stringContaining("sdp build . --exclude"),
    );

    const step = "a cart with {items:number} items";
    const point = "a cart with {items: 2} items";
    const bare = generateContracts(probeGraph(exampleCarriers(step, point)).graph);
    const anchored = generateContracts(
      probeGraph({ ...exampleCarriers(step, point), "suites/probe.test.ts": anchoredSuite }).graph,
    );
    expect([...bare.registrars.keys()]).toEqual([]);
    expect([...anchored.registrars.keys()]).toEqual(["suites/probe.child.test.generated.ts"]);
  });

  it("keys a step in the vocabulary, as the step-key law and the contract generator agree", () => {
    const keying = skillSection(authoringPath, "### Key a step or a term");
    const taught = /`Given (\[#([a-z][A-Za-z0-9]*)\] ([^`]+))`/u.exec(keying);
    const [, marked, key, step] = taught ?? [];
    if (marked === undefined || key === undefined || step === undefined) {
      throw new Error("the authoring skill must teach one keyed Given step");
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

    const text = flat(keying);
    for (const clause of [
      "after the keyword in the parent's vocabulary",
      "inherits the key",
      "Keying only the child when the vocabulary step is unkeyed withholds its contract",
      "Introducing a key changes the contract key from the skeleton to that key",
      "the oracle's outcome `kind`",
      "performs no step-key migration",
    ]) {
      expect(text).toContain(clause);
    }
  });

  it("owns publishing in one reader section that agrees with each verb's flags", () => {
    const section = skillSection(surfacePath, "## Publish pages and notes");
    const publish = flat(section);
    const studioBullet =
      section.split("\n- ").find((bullet) => bullet.startsWith("Use `sdp studio`")) ?? "";
    const studioFlags = [...studioBullet.matchAll(/`(--[a-z-]+)/gu)].map((match) => match[1]);
    expect(studioFlags).toEqual(["--base", "--base-label", "--runs"]);
    for (const flag of studioFlags) expect(usageLine("studio")).toContain(flag);

    const neither = /takes neither `(--[a-z-]+)` nor `(--[a-z-]+)`/u.exec(publish);
    expect(neither).not.toBeNull();
    for (const flag of [neither?.[1], neither?.[2]]) {
      expect(usageLine("studio")).toContain(flag);
      expect(usageLine("generate")).not.toContain(`${flag ?? ""} `);
    }
    expect(publish).toContain("writes the Studio without optional inputs");
    expect(publish).toContain("Keep supplied inputs outside the paths the build writes or removes");
    expect(publish).toContain("run `sdp stamp` with the corpus commit, then upload");
    expect(publish).toContain("A later build removes the stamp");

    for (const path of [authoringPath, sessionsPath]) {
      const text = flat(readSkill(path).source);
      expect(text).toContain('"Publish pages and notes"');
      expect(text).not.toContain("Use `sdp stamp` after publication");
    }
  });

  it("names the vault's owned folder, the person's notes and the roots a vault run removes", () => {
    const publish = flat(skillSection(surfacePath, "## Publish pages and notes"));
    for (const clause of [
      "the command owns its `sdp/` folder",
      "Keep personal notes outside that folder, conventionally under `intent/`",
      "`sdp vault` enters the shared build and invalidates the five page roots",
      "use `sdp generate --vault DIR`",
    ]) {
      expect(publish).toContain(clause);
    }
    expect(usageLine("generate")).toContain("[--vault DIR]");
    const vaultHelp = flat(SDP_HELP_TEXT.slice(SDP_HELP_TEXT.indexOf("  vault      ")));
    expect(vaultHelp).toContain("Keep your notes outside sdp/, by convention in intent/.");
  });

  it("teaches entry addresses, term addresses and anchored source citations as the engine derives them", async () => {
    const addresses = flat(skillSection(surfacePath, "### Entry addresses"));
    for (const clause of [
      "`spec:<id>#term.<key>` a keyed Model term",
      "An unresolved entry address mentioned in Spec prose is a Protocol prose-mentions error.",
      "An entry address cited in source is recorded only when the source file carries a recognized anchor.",
      "only when recipe 51 is selected through `validate --rules`; ordinary validation does not report them",
      "a keyed rule or flow, or a keyed Model term",
      'off-grammar keys such as `"01"`, return `address: null`',
    ]) {
      expect(addresses).toContain(clause);
    }
    expect(readSkill(surfacePath).source).not.toContain('a lawful `"01"` key included');
    const citing = flat(skillSection(authoringPath, "### Cite an entry from source"));
    expect(citing).toContain("recorded only when the source file carries a recognized anchor");
    expect(citing).toContain("only when recipe 51 is selected through `validate --rules`");

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

  it("states what an empty or ready answer establishes and no more", () => {
    const surface = flat(readSkill(surfacePath).source);
    for (const clause of [
      "Recipe 1 lists ready, unimplemented Specs excluding examples and decisions. Recipe 33 applies the same exclusions at `defined`. An empty answer establishes absence only within that recipe's selection.",
      '`floorReached: "ready"`: the structural floor allows `ready`. Read `statedReadiness` separately to learn whether the author has stated it.',
    ]) {
      expect(surface).toContain(clause);
    }
    expect(surface).not.toContain("the author has not stated it");
    expect(surface).not.toContain("nothing stated `ready` is unbuilt");
    const sessions = flat(readSkill(sessionsPath).source);
    expect(sessions).toContain("Specs carrying both `implemented` and `has-verifier`");
    expect(sessions).not.toMatch(/implemented, verified Specs?/u);
  });

  it("teaches a refused bundle as the end of pagination, as recipe 36 refuses", async () => {
    const parts = flat(skillSection(surfacePath, "### Read a large scope in parts"));
    for (const clause of [
      "Check `diagnostics` and `budgetExceeded` before using `part.of`",
      "with the same scope, budget and declaration mode",
      "`budgetExceeded: true`, `part.of: null` and `oversized`",
      "A refusal is not a partial bundle.",
    ]) {
      expect(parts).toContain(clause);
    }
    for (const path of [authoringPath, sessionsPath]) {
      const text = flat(readSkill(path).source);
      expect(text).toContain('"Read a large scope in parts"');
      expect(text).not.toMatch(/from 1 through (?:the returned )?`part\.of`/u);
    }

    const { graph } = probeGraph(termCorpus);
    const refused = (await evaluateBody(
      'return recipes(36, { pack: "pack:probe.review", budget: 1, part: 1 })',
      { graph },
    )) as Record<string, unknown>;
    expect(refused.budgetExceeded).toBe(true);
    expect(refused.part).toEqual({ index: 1, of: null });
    expect(refused.oversized).toBeDefined();
    expect(refused.members).toBeUndefined();
  });

  it("keeps corpus rules in one section whose composed rules file runs as taught", async () => {
    const rules = skillSection(authoringPath, "## Write and run corpus rules");
    expect(rules).toContain("sdp validate --rules PATH [--params FORM]...");
    expect(rules).toContain("spec:validation.corpus-rules#design.ruleFinding");
    expect(rules).toContain("spec:validation.corpus-rules#rule.readsGraphOnly");
    expect(skillSection(authoringPath, "### Place what is not settled")).not.toContain("--rules");
    expect(skillSection(authoringPath, "### Author behavior and examples in Gherkin")).not.toMatch(
      /recipe 5[01]|--rules/u,
    );

    const body = /```js\n([\s\S]*?)\n```/u.exec(rules)?.[1];
    if (body === undefined) throw new Error("the corpus-rules section must carry a rules file");
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

  it("points every skill at the installed upgrade guide and triggers authoring on upgrades and rules", () => {
    for (const path of skillPaths) {
      expect(flat(readSkill(path).source)).toContain(
        "`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/upgrade-guide.md` in an adopter",
      );
    }
    const description = String(readSkill(authoringPath).frontmatter.description);
    expect(description).toContain("upgrading a corpus to new Protocol capabilities");
    expect(description).toContain("corpus rules files");
  });

  it("orders the reader as a task route and leaves recipe contracts to the catalog", () => {
    const { source } = readSkill(surfacePath);
    const order = [
      "## Bootstrap discipline",
      "## Answer a task with a recipe",
      "## The contract",
      "## The entry adapters",
      "## The shape of the graph",
      "## How delivery state derives",
      "## Empty answers that mislead",
    ].map((heading) => source.indexOf(`\n${heading}\n`));
    expect(order.every((index) => index > -1)).toBe(true);
    expect(order).toEqual([...order].sort((left, right) => left - right));
    expect(flat(source)).toContain("The catalog owns recipe contracts; carrying Specs own law.");

    const description = String(readSkill(sessionsPath).frontmatter.description);
    expect(description.startsWith("Route delivery work")).toBe(true);
    for (const trigger of [
      "resuming",
      "handing off",
      "a change proposal received from a reviewer",
    ]) {
      expect(description).toContain(trigger);
    }
  });

  it("states the graph's flat topology and which node types carry lines, as the graph does", () => {
    const shape = flat(skillSection(surfacePath, "## The shape of the graph"));
    for (const clause of [
      "The graph's topology is flat",
      "Section content may contain nested values.",
      "Primitive and Pack nodes carry no source lines; Anchor and CodeNode nodes carry their binding file and line.",
    ]) {
      expect(shape).toContain(clause);
    }
    expect(shape).not.toContain("nothing nested");
    expect(shape).not.toContain("Nodes carry no lines");

    const { graph } = probeGraph({
      ...termCorpus,
      ...exampleCarriers("a cart with {items:number} items", "a cart with {items: 2} items"),
      "suites/probe.test.ts": anchoredSuite,
    });
    const lines = Object.fromEntries(
      ["Primitive", "Pack", "Anchor", "CodeNode"].map((type) => [
        type,
        graph.nodes
          .filter((node) => node.nodeType === type)
          .map((node) => typeof (node as { line?: unknown }).line),
      ]),
    );
    expect(new Set(lines.Primitive)).toEqual(new Set(["undefined"]));
    expect(new Set(lines.Pack)).toEqual(new Set(["undefined"]));
    expect(new Set(lines.Anchor)).toEqual(new Set(["number"]));
    expect(new Set(lines.CodeNode)).toEqual(new Set(["number"]));
  });
});

/** Every `spec:` id and entry address a skill cites, placeholders and probe ids left out. */
function citedProtocolReferences(source: string): { ids: string[]; addresses: string[] } {
  const cited = [
    ...new Set(
      [...source.matchAll(/spec:[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)*(?:#[a-z]+\.[A-Za-z0-9]+)?/gu)]
        .map((match) => match[0])
        .filter((reference) => !/[<>]/u.test(reference)),
    ),
  ];
  return {
    ids: [...new Set(cited.map((reference) => reference.split("#")[0] ?? reference))],
    addresses: cited.filter((reference) => reference.includes("#")),
  };
}

let shippedCorpus: ReturnType<typeof extract> | undefined;
/** The Protocol's own Specs as the package ships them, extracted once for the citation checks. */
function shippedCorpusGraph() {
  shippedCorpus ??= extract({ root: join(repoRoot, "specs") });
  return shippedCorpus.graph;
}

async function assertCitationsResolve(path: string, required: readonly string[]): Promise<void> {
  const { ids, addresses } = citedProtocolReferences(readSkill(path).source);
  for (const id of required) expect(ids).toContain(id);
  const graph = shippedCorpusGraph();
  const reader = createReader(graph);
  for (const id of ids) {
    expect({ path, id, resolves: reader.specContext(id) !== undefined }).toEqual({
      path,
      id,
      resolves: true,
    });
  }
  const resolution = (await evaluateBody("return recipes(25, params)", {
    graph,
    params: { addresses },
  })) as { rows: { address: string; resolves: boolean }[] };
  expect(resolution.rows.filter((row) => !row.resolves)).toEqual([]);
  expect(resolution.rows).toHaveLength(addresses.length);
}

/** The body of the one documented `sdp q '…'` line that calls the proposal check. */
function taughtProposalCheckBody(path: string): string {
  const line = shellFenceLines(readSkill(path).body)
    .map((entry) => entry.trim())
    .find((entry) => entry.includes(" q '") && entry.includes("recipes(38"));
  const body = /\bq '([^']+)'/u.exec(line ?? "")?.[1];
  if (body === undefined) throw new Error(`${path} must teach one proposal-check invocation`);
  expect(line).toContain("--params proposal=@proposal.json");
  expect(line).toMatch(/--params base=@\S+/u);
  return body;
}

/**
 * Runs the taught proposal check over a probe whose first change's scope moved since its base,
 * whose third names a Spec the head lacks, and whose fourth declares a relation to one.
 */
async function assertTaughtRouting(path: string): Promise<void> {
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
    scope: { resolvesAtHead: boolean }[];
    relationTarget: { ref: string; resolvesAtHead: boolean } | null;
  }
  const answer = (await evaluateBody(taughtProposalCheckBody(path), {
    graph: head,
    params: { proposal, base },
  })) as { schemaProblems: unknown[]; totals: { unresolved: number }; changes: Row[] };
  expect(answer.schemaProblems).toEqual([]);
  expect(answer.changes.map((change) => change.moved)).toEqual([true, false, false, false]);
  expect(answer.changes[2]?.scope.map((item) => item.resolvesAtHead)).toEqual([false]);
  // The relation's target is reported apart from the scope, which resolves and has not moved.
  expect(answer.changes[3]?.scope.map((item) => item.resolvesAtHead)).toEqual([true]);
  expect(answer.changes[3]?.relationTarget).toEqual({
    ref: "spec:probe.missing-target",
    resolvesAtHead: false,
  });
  expect(answer.totals.unresolved).toBe(2);

  const routing = flat(readSkill(path).source);
  for (const clause of [
    "If `schemaProblems` is non-empty, the answer has no change rows: return the proposal for correction.",
    "Send a change to the person when its `moved` is `true` or `null`, which the check could not compare, when any `scope` item has `resolvesAtHead: false`, or when its `relationTarget` has `resolvesAtHead: false`.",
    "Apply only the remaining `moved: false` changes, as ordinary carrier edits through `sdp-authoring`",
    "`spec:consumers.intent-composition#rule.changedScope`",
  ]) {
    expect(routing).toContain(clause);
  }

  // The routing as taught: only the change whose scope stayed put and whose target resolves applies.
  const toPerson = (row: Row) =>
    row.moved !== false ||
    row.scope.some((item) => !item.resolvesAtHead) ||
    row.relationTarget?.resolvesAtHead === false;
  expect(answer.changes.map((row) => (toPerson(row) ? "person" : "apply"))).toEqual([
    "person",
    "apply",
    "person",
    "person",
  ]);
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
  const section = (heading: string) => flat(skillSection(studioSkillPath, heading));

  it("is its own shipped skill, which the reading skill points to", () => {
    const { frontmatter } = studio();
    expect(frontmatter.name).toBe("sdp-studio");
    const description = String(frontmatter.description);
    expect(description.startsWith("Publish, share and read the Spec Studio")).toBe(true);
    for (const trigger of ["pull-request previews", "Studio link", "composing panel"]) {
      expect(description).toContain(trigger);
    }
    expect(flat(skillSection(skillPaths[0], "## Publish pages and notes"))).toContain(
      "Follow `sdp-studio` for previews, page reading, exports and composing-panel hand-offs.",
    );
    for (const path of [skillPaths[1], skillPaths[2]]) {
      expect(readSkill(path).source).toContain("`sdp-studio`");
    }
  });

  it("starts from what the agent holds", () => {
    const start = section("## Start from what you hold");
    for (const holding of [
      "**A repository**",
      "**A page set or a link**",
      "**Composed intent**",
      "**A CI workflow to set up**",
    ]) {
      expect(start).toContain(holding);
    }
    expect(start).toContain("navigating them needs no local graph");
  });

  it("teaches the publishing run as the studio and generate verbs take it", async () => {
    const publish = skillSection(studioSkillPath, "## Publish the page set");
    const taughtFlags = new Set(
      shellFenceLines(publish)
        .filter((line) => line.includes(" studio "))
        .flatMap((line) =>
          [...line.slice(line.indexOf(" studio ")).matchAll(/(--[a-z-]+)/gu)].map(
            (match) => match[1],
          ),
        ),
    );
    expect([...taughtFlags].sort()).toEqual(
      ["--base", "--base-label", "--exclude", "--runs", "--watch"].sort(),
    );
    for (const flag of taughtFlags) {
      expect(usageLine("studio")).toMatch(new RegExp(`${flag ?? ""}(?![a-z-])`, "u"));
    }
    for (const flag of ["--base", "--runs"]) expect(usageLine("generate")).not.toContain(flag);

    const text = flat(publish);
    for (const clause of [
      "`sdp generate` writes the Studio beside the other four page roots, with no optional input.",
      "Build the Studio last.",
      "`spec:consumers.spec-studio.publisher#rule.buildInvalidates`",
      "Keep every input outside `generated/` and every other path the build writes or removes.",
      "nothing serves or reloads the page",
    ]) {
      expect(text).toContain(clause);
    }

    const root = mkdtempSync(join(tmpdir(), "sdp-studio-skill-"));
    try {
      writeFileSync(join(root, "a.sdp.md"), probeCarrier("spec:probe.a", "behavior", ""));
      mkdirSync(join(root, "generated"));
      writeFileSync(join(root, "generated", "graph.json"), "{}");
      const refused = createCaptureOutput();
      const exitCode = await runSdpCli(
        ["studio", root, "--base", join(root, "generated", "graph.json")],
        refused.output,
      );
      expect(exitCode).toBe(1);
      expect(refused.readStderr()).toContain("--base");
      const generate = createCaptureOutput();
      expect(
        await runSdpCli(["generate", root, "--runs", join(root, "x.json")], generate.output),
      ).toBe(1);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("teaches stamping and the preview workflow as the workflow declares them", () => {
    const share = skillSection(studioSkillPath, "## Stamp and share");
    const text = flat(share);
    for (const clause of [
      "Stamp after the final build",
      "a later build removes it with the page set",
      "`spec:consumers.spec-studio.sharing#rule.stampLifetime`",
      "Build from a clean checkout of the commit you stamp.",
      "through `file://` they stay text",
      "a pull request from a fork never deploys",
    ]) {
      expect(text).toContain(clause);
    }
    for (const flag of ["--commit", "--source"]) expect(usageLine("stamp")).toContain(flag);

    const fence = /```yaml\n([\s\S]*?)\n```/u.exec(share)?.[1];
    if (fence === undefined) throw new Error("the Studio skill must show the preview job");
    const job = (parse(fence) as { jobs: Record<string, Record<string, unknown>> }).jobs[
      "studio-preview"
    ];
    const workflow = parse(
      readFileSync(join(repoRoot, ".github/workflows/studio-preview.yml"), "utf8"),
    ) as {
      on: { workflow_call: { inputs: Record<string, unknown> } };
      jobs: Record<string, { if?: string; permissions?: unknown; steps?: { with?: unknown }[] }>;
    };
    expect(String(job?.uses)).toMatch(
      /^libar-dev\/software-delivery-protocol\/\.github\/workflows\/studio-preview\.yml@/u,
    );
    for (const input of Object.keys(job?.with ?? {})) {
      expect(Object.keys(workflow.on.workflow_call.inputs)).toContain(input);
    }
    expect(job?.permissions).toEqual(workflow.jobs.deploy?.permissions);
    expect(workflow.jobs.deploy?.if).toContain(
      "github.event.pull_request.head.repo.full_name == github.repository",
    );
    expect(JSON.stringify(workflow.jobs.build?.steps)).toContain(
      "spec-studio-pr-${{ github.event.pull_request.number }}",
    );
    expect(text).toContain("`spec-studio-pr-<number>`");
    expect(text).toContain("`preview/<number>/`");
  });

  it("has the preview's run evidence checked against the stamp, never assumed to match it", async () => {
    const text = flat(skillSection(studioSkillPath, "## Stamp and share"));
    for (const clause of [
      "The workflow builds and stamps GitHub's pull-request merge commit, not the branch head.",
      "Run evidence keeps the commit each CTRF report records in `results.environment.commit`, which may name another commit or none",
      "a report uploaded in the same workflow run does not establish that they match.",
      "Compare each run's commit on `runs.html` with the stamp's before you treat its results as evidence for the preview commit",
      "`spec:consumers.spec-studio.runs-page#rule.commitShown`",
      "recipe 45 with `params.commit` set to the stamp's `corpusCommit` answers `sameCommit` per report, `null` when the report records no commit.",
    ]) {
      expect(text).toContain(clause);
    }
    expect(text).not.toContain("its stamp and its run evidence name that commit");
    expect(readFileSync(join(repoRoot, "src/cli/stamp-command.ts"), "utf8")).toContain(
      "corpusCommit",
    );

    // The workflow hands each downloaded report to the Studio as it is, its recorded commit included.
    const workflow = readFileSync(join(repoRoot, ".github/workflows/studio-preview.yml"), "utf8");
    expect(workflow).toContain('inputs+=(--runs "$report")');
    expect(workflow).not.toContain("environment.commit");

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
    const evidence = (await evaluateBody("return recipes(45, params)", {
      graph: probeGraph({}).graph,
      params: {
        runs: [report({ commit: "bbbbbbb" }), report(), report({ commit: preview })],
        commit: preview,
      },
    })) as { inputs: { commit: string | null; sameCommit: boolean | null }[] };
    expect(evidence.inputs.map(({ commit, sameCommit }) => ({ commit, sameCommit }))).toEqual([
      { commit: "bbbbbbb", sameCommit: false },
      { commit: null, sameCommit: null },
      { commit: preview, sameCommit: true },
    ]);
  });

  it("maps each task to a page the Studio writes, and states what a page does not", async () => {
    const reading = skillSection(studioSkillPath, "## Read the pages by task");
    const taught = [...reading.matchAll(/`([a-z/<>]+\.html)`/gu)].map((match) => match[1] ?? "");
    const { graph } = probeGraph({
      "a.sdp.md": probeCarrier("spec:probe.a", "behavior", "## Behavior\n- rule: One rule."),
      "probe.pack.sdp.md":
        "---\nid: pack:probe.review\nspecs:\n  - spec:probe.a\n---\n# Probe review\n\nFraming.\n",
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
    expect(withInputs).toContain("exports/probe.review.html");

    const limits = flat(reading);
    for (const clause of [
      "The queue's order sets no priority",
      "never a verdict on a verifier",
      "`spec:consumers.spec-studio.diagrams#rule.textEquivalent`",
      "It carries no stamp, date, commit or composing panel",
    ]) {
      expect(limits).toContain(clause);
    }
  });

  it("receives the composing panel's hand-off through the proposal check", async () => {
    const receive = section("## Receive composed intent");
    for (const clause of [
      "The memo ends with the exact proposal under `## The proposal`",
      "`Not in the proposal`",
      "`Copy scoped intent`",
      "`git fetch origin pull/<number>/merge`",
      "`schemas/sdp-proposal-1.schema.json`",
      "render its memo with recipe 49",
    ]) {
      expect(receive).toContain(clause);
    }
    const panel = readFileSync(
      join(repoRoot, "src/studio-elements/intent-panel-element.ts"),
      "utf8",
    );
    expect(panel).toContain("Not in the proposal");
    expect(panel).toContain("Copy scoped intent");
    expect(readFileSync(join(repoRoot, "schemas/sdp-proposal-1.schema.json"), "utf8")).toContain(
      "sdp-proposal/1",
    );

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
    const saved = /## The proposal\n\n```json\n([\s\S]*?)\n```/u.exec(memo)?.[1];
    expect(JSON.parse(saved ?? "null")).toEqual(proposal);

    await assertTaughtRouting(studioSkillPath);
  });

  it("cites resolving Studio Specs for law and leaves flags to each verb's help", async () => {
    expect(flat(studio().body)).toContain("each verb's `--help` owns its flags");
    await assertCitationsResolve(studioSkillPath, [
      "spec:consumers.studio-on-ramp",
      "spec:consumers.spec-studio",
      "spec:consumers.spec-studio.publisher",
      "spec:consumers.spec-studio.data.inputs",
      "spec:consumers.spec-studio.sharing",
      "spec:consumers.spec-studio.export",
      "spec:consumers.spec-studio.intent-panel",
      "spec:consumers.intent-composition",
    ]);
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

describe("the vault on-ramp", () => {
  const vault = () => readSkill(vaultSkillPath);
  const section = (heading: string) => flat(skillSection(vaultSkillPath, heading));

  it("is its own shipped skill, which the reading skill points to", () => {
    const { frontmatter } = vault();
    expect(frontmatter.name).toBe("sdp-vault");
    const description = String(frontmatter.description);
    expect(description.startsWith("Keep the Protocol's Obsidian vault")).toBe(true);
    for (const trigger of [
      "vault directory",
      "refused or failed synchronization",
      "intent notes",
    ]) {
      expect(description).toContain(trigger);
    }
    expect(flat(skillSection(skillPaths[0], "## Publish pages and notes"))).toContain(
      "For linked notes, use `sdp-vault`.",
    );
    for (const path of [skillPaths[1], skillPaths[2]]) {
      expect(readSkill(path).source).toContain("`sdp-vault`");
    }
  });

  it("places the vault where the command accepts it", () => {
    const place = section("## Choose the vault directory");
    for (const clause of [
      "`--out` resolves against the working directory, not the root.",
      "`spec:consumers.obsidian-vault#design.buildOwnedPaths`",
      "Open the vault directory itself in Obsidian, never its `sdp/` folder",
    ]) {
      expect(place).toContain(clause);
    }
    const skipped = /discovery skips \(([^)]+)\)/u.exec(place)?.[1] ?? "";
    const names = [...skipped.matchAll(/`([a-z_-]+)\/`/gu)].map((match) => match[1] ?? "");
    expect(names.sort()).toEqual(["coverage", "dist", "generated", "node_modules"]);
    for (const name of names) expect(isExcludedDiscoveryDirectory(name)).toBe(true);
    expect(skipped).toContain("a dot-directory");
    expect(isExcludedDiscoveryDirectory(".notes")).toBe(true);
    expect(isExcludedDiscoveryDirectory("specs")).toBe(false);

    const root = mkdtempSync(join(tmpdir(), "sdp-vault-skill-"));
    try {
      const args = (vaultDir: string, exclude: readonly string[] = []) => ({
        root,
        exclude,
        checkClean: false,
        vault: vaultDir,
      });
      expect(vaultDirectory(args("design-vault"))).toBe(resolve("design-vault"));
      expect(() => {
        checkVaultDirectory(args(join(root, "notes")));
      }).toThrow(/lies inside the root/u);
      expect(() => {
        checkVaultDirectory(args(join(root, "notes"), ["notes"]));
      }).not.toThrow();
      expect(() => {
        checkVaultDirectory(args(join(root, "generated", "obsidian-vault")));
      }).not.toThrow();
      expect(() => {
        checkVaultDirectory(args(join(root, "generated", "spec-studio")));
      }).toThrow(/overlaps generated\/spec-studio/u);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("keeps the person's notes outside the folder the command owns", () => {
    const apart = section("## Keep the person's notes apart");
    for (const clause of [
      "The command writes, moves and removes files only under `sdp/`.",
      "by convention under `intent/`",
      "`spec:decisions.vault-owned-folder`",
      "An edit to a generated note never reaches the carrier",
    ]) {
      expect(apart).toContain(clause);
    }
    expect(SDP_HELP_TEXT.replaceAll(/\s+/gu, " ")).toContain(
      "Keep your notes outside sdp/, by convention in intent/.",
    );
  });

  it("teaches synchronizing and watching as the verbs and the failed index state them", () => {
    const sync = section("## Synchronize and watch");
    for (const clause of [
      "`sdp vault` enters the shared build, so it removes the five page roots.",
      "run `sdp generate --vault DIR`",
      "a `.ts` or `.tsx` source other than a `.d.ts`",
      "`sdp validate --watch` follows no source files.",
    ]) {
      expect(sync).toContain(clause);
    }
    expect(usageLine("generate")).toContain("[--vault DIR]");
    expect(usageLine("vault")).toContain("[--watch]");
    const warning = /`(The last regeneration failed[^`]+)`/u.exec(sync)?.[1];
    expect(warning).toBeDefined();
    expect(readFileSync(join(repoRoot, "src/cli/vault-command.ts"), "utf8")).toContain(
      `> [!warning] ${warning ?? ""}`,
    );
  });

  it("names every refusal the guard prints and how to recover from it", () => {
    const recover = skillSection(vaultSkillPath, "## Recover a refused run");
    const capture = createCaptureOutput();
    reportVaultError(
      new VaultGuardError([
        { path: "sdp/a.md", reason: "changed" },
        { path: "sdp/b.md", reason: "unknown" },
        { path: "sdp/c", reason: "not a file" },
        { path: "sdp/.sdp-vault.json", reason: "malformed" },
      ]),
      capture.output,
    );
    const printed = capture.readStderr().split("\n").filter(Boolean);
    const reasons = [...recover.matchAll(/^\| `\(([a-z ]+)\)`/gmu)].map((match) => match[1]);
    expect(reasons).toEqual(["changed", "unknown", "not a file", "malformed"]);
    for (const reason of reasons) {
      expect(printed.some((line) => line.endsWith(`(${reason ?? ""})`))).toBe(true);
    }
    expect(flat(recover)).toContain(`\`${printed.at(-1) ?? ""}\``);
    expect(flat(recover)).toContain(
      "`sdp vault: warning: sdp/<path> has changed; delete it to regenerate`",
    );
    expect(readFileSync(join(repoRoot, "src/cli/vault-command.ts"), "utf8")).toContain(
      "has changed; delete it to regenerate",
    );
    expect(flat(recover)).toContain("Save the person's words before you delete anything");
  });

  it("converts a note's links back to the addresses the vault wrote, then checks the proposal", async () => {
    const intent = section("## Turn intent notes into carrier edits");
    for (const clause of [
      "`spec.<path>.md#^design-limit` names `spec:<path>#design.limit`",
      "A term note `term.<path>.<key>` names `spec:<path>#term.<key>`",
      "`spec:consumers.obsidian-vault.notes#rule.addressRoundTrip`",
      "render its memo with the proposal memo (recipe 49)",
    ]) {
      expect(intent).toContain(clause);
    }

    const { graph } = probeGraph({
      ...termCorpus,
      "limit.sdp.md": probeCarrier("spec:probe.limit", "behavior", "## Design\n- limit: ten"),
    });
    const files = renderVault(graph);
    const note = files.find((file) => file.path === "specs/probe/spec.probe.limit.md");
    expect(note?.content).toMatch(/- limit: ten \^design-limit$/mu);
    const term = files.find((file) => file.path === "terms/term.probe.terms.stepKey.md");
    expect(term).toBeDefined();

    // The conversion the skill teaches, applied to what the vault wrote.
    const toId = (noteName: string) => noteName.replace(".", ":");
    const toAddress = (noteName: string, block: string) =>
      `${toId(noteName)}#${block.replace(/^\^/u, "").replace("-", ".")}`;
    const termAddress = (termNote: string) =>
      termNote.replace(/^term\.(.*)\.([A-Za-z0-9]+)$/u, "spec:$1#term.$2");
    const resolution = (await evaluateBody("return recipes(25, params)", {
      graph,
      params: {
        addresses: [
          toAddress("spec.probe.limit", "^design-limit"),
          termAddress("term.probe.terms.stepKey"),
        ],
      },
    })) as { rows: { address: string; resolves: boolean }[] };
    expect(resolution.rows).toEqual([
      expect.objectContaining({ address: "spec:probe.limit#design.limit", resolves: true }),
      expect.objectContaining({ address: "spec:probe.terms#term.stepKey", resolves: true }),
    ]);

    await assertTaughtRouting(vaultSkillPath);
  });

  it("takes the proposal's base from the graph the person read, never from the latest synchronization", async () => {
    const intent = section("## Turn intent notes into carrier edits");
    for (const clause of [
      "Establish the commit whose graph the person read; it is the proposal's base.",
      "record that commit in a note under `intent/`",
      "Otherwise write the graph with that commit's own engine, as the design diff's catalog entry (recipe 35) shows",
      "A later synchronization does not change this base",
      "Use the current graph only when the person confirms it is the version their intent addresses and its carriers match the named commit.",
      "When the reading base cannot be established, ask the person to review the current design and restate the intent against a known commit before you write a proposal.",
    ]) {
      expect(intent).toContain(clause);
    }
    expect(intent).not.toContain("If no carrier changed since the last synchronization");

    // The person read the vault at graph A; under --watch it then synchronized to graph B.
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
    const syncedNote = renderVault(latestSync).find(
      (file) => file.path === "specs/probe/spec.probe.limit.md",
    );
    expect(syncedNote?.content).toMatch(/- limit: twelve \^design-limit$/mu);

    const proposal = {
      schema: "sdp-proposal/1",
      base: "0123456",
      reason: "Answer the limit the person read.",
      changes: [{ scope: ["spec:probe.limit#design.limit"], request: "Lower the limit to eight." }],
    };
    const moved = async (base: typeof read) =>
      (
        (await evaluateBody(taughtProposalCheckBody(vaultSkillPath), {
          graph: latestSync,
          params: { proposal, base },
        })) as { changes: { moved: boolean | null }[] }
      ).changes.map((change) => change.moved);
    // Against the graph the person read, the change goes to the person; against the latest
    // synchronization the same change would be applied over a limit the person never saw.
    expect(await moved(read)).toEqual([true]);
    expect(await moved(latestSync)).toEqual([false]);
  });

  it("cites resolving vault Specs for law and leaves flags to the verb's help", async () => {
    expect(flat(vault().body)).toContain("`sdp vault --help` owns the flags");
    await assertCitationsResolve(vaultSkillPath, [
      "spec:consumers.vault-on-ramp",
      "spec:consumers.obsidian-vault",
      "spec:consumers.obsidian-vault.notes",
      "spec:consumers.obsidian-vault.iteration",
      "spec:decisions.vault-owned-folder",
      "spec:consumers.intent-composition",
    ]);
  });
});
