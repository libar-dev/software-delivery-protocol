import { lstatSync, readFileSync, readlinkSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  ".agents/skills/sdp-agent-surface/SKILL.md",
  ".agents/skills/sdp-authoring/SKILL.md",
] as const;

const authoringOnRampImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.authoring-on-ramp"),
  label: "asserts realization of the shipped graph-first authoring skill document",
  satisfies: ref("spec:consumers.authoring-on-ramp"),
});
void authoringOnRampImplementationAnchor;

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

const authoringRecipesImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.authoring-recipes"),
  label: "asserts realization of the shipped authoring recipe catalog",
  satisfies: ref("spec:consumers.agent-surface.authoring-recipes"),
});
void authoringRecipesImplementationAnchor;

function documentedCommands(body: string): readonly string[] {
  const commands: string[] = [];
  let inShellFence = false;

  for (const line of body.split("\n")) {
    if (line === "```sh") {
      inShellFence = true;
      continue;
    }
    if (line === "```") {
      inShellFence = false;
      continue;
    }
    if (
      inShellFence &&
      (line.startsWith("pnpm --silent sdp:q ") || line.startsWith("pnpm exec sdp "))
    ) {
      commands.push(line);
    }
  }

  return commands;
}

const authoringOnRampTestAnchor = specTest({
  id: testAnchorId("test:protocol.authoring-on-ramp"),
  label: "skill-asset checks verify the authoring on-ramp",
  verifies: ref("spec:consumers.authoring-on-ramp"),
});
void authoringOnRampTestAnchor;

const authoringRecipesTestAnchor = specTest({
  id: testAnchorId("test:protocol.authoring-recipes"),
  label: "skill-asset checks verify the authoring recipes",
  verifies: ref("spec:consumers.agent-surface.authoring-recipes"),
});
void authoringRecipesTestAnchor;

describe("Protocol skill assets", () => {
  it("owns skills under .agents and exposes them to Claude through one relative symlink", () => {
    const claudeSkills = join(repoRoot, ".claude", "skills");

    expect(lstatSync(claudeSkills).isSymbolicLink()).toBe(true);
    expect(readlinkSync(claudeSkills)).toBe("../.agents/skills");
  });

  it("uses the repository's two-field single-file convention", () => {
    for (const path of skillPaths) {
      const skill = readSkill(path);
      const folder = basename(dirname(path));

      expect(Object.keys(skill.frontmatter).sort()).toEqual(["description", "name"]);
      expect(skill.frontmatter.name).toBe(folder);
      expect(typeof skill.frontmatter.description).toBe("string");
      expect(String(skill.frontmatter.description).length).toBeGreaterThan(40);
    }
  });

  it("keeps both skills graph-first and the authoring law linked to carrying Specs", () => {
    for (const path of skillPaths) {
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
      "spec:validation.readiness-floor",
      "spec:validation.kind-evidence",
      "spec:decisions.content-only-sections",
      "spec:decisions.point-per-example",
      "spec:decisions.binding-not-liveness",
      "sdp build",
      "bindExample",
      "specTest",
      "contract-dependent-suites.mjs",
      "mutation",
      "cannot detect",
    ]) {
      expect(authoring).toContain(required);
    }
  });

  it("documents only valid CLI verbs and keeps root-specific exclusions intact", () => {
    const knownVerbs = new Set(["build", "q"]);
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const localQuery = packageJson.scripts["sdp:q"] ?? "";

    for (const exclusion of ["explorations", "examples", "test/fixtures/import/parity"]) {
      expect(localQuery).toContain(`--exclude ${exclusion}`);
    }

    for (const path of skillPaths) {
      const commands = documentedCommands(readSkill(path).body);
      expect(commands.length).toBeGreaterThan(0);

      for (const command of commands) {
        const verb = command.startsWith("pnpm --silent sdp:q ")
          ? "q"
          : /exec sdp (?<verb>[\w-]+)/u.exec(command)?.groups?.verb;
        expect(verb === undefined ? false : knownVerbs.has(verb)).toBe(true);
      }
    }
  });

  it("uses the local runtime or package runner instead of a colliding global binary", () => {
    const agentSurface = readSkill(".agents/skills/sdp-agent-surface/SKILL.md");
    const authoring = readSkill(".agents/skills/sdp-authoring/SKILL.md");

    expect(
      documentedCommands(agentSurface.body).every(
        (line) => line.startsWith("pnpm --silent ") || line.startsWith("pnpm exec "),
      ),
    ).toBe(true);
    expect(
      documentedCommands(authoring.body).every(
        (line) => line.startsWith("pnpm --silent ") || line.startsWith("pnpm exec "),
      ),
    ).toBe(true);
  });

  it("contains no contradictory shortcuts for readiness or verifier realization", () => {
    const forbidden = [
      "has-verifier means tests pass",
      "ready is conferred by tooling",
      "ready is derived from the floor",
      "bindExample call sites are extracted",
      "verification mode proves a verifier exists",
    ];

    for (const path of skillPaths) {
      const source = readSkill(path).source.toLowerCase();

      for (const claim of forbidden) {
        expect(source).not.toContain(claim);
      }
    }
  });

  it("keeps recipe-count prose synchronized with the executable catalog", () => {
    const catalog = readFileSync(join(repoRoot, "docs/agent-surface/recipes.md"), "utf8");
    const headings = [...catalog.matchAll(/^## \d+\. /gmu)];
    const countWords = [
      "zero",
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
      "twenty",
    ] as const;
    const countWord = countWords[headings.length];

    expect(countWord).toBeDefined();
    if (countWord === undefined) {
      throw new Error(`recipe count ${String(headings.length)} is outside the checked prose range`);
    }

    const agents = readFileSync(join(repoRoot, "AGENTS.md"), "utf8");
    const skill = readSkill(".agents/skills/sdp-agent-surface/SKILL.md").source;
    expect(agents).toContain(`${countWord} runnable \`sdp q\` bodies`);
    expect(skill).toContain(`catalog contains ${countWord} ready-made bodies`);
  });
});
