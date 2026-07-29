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
  ".agents/skills/sdp-sessions/SKILL.md",
] as const;

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

function shellFenceLines(body: string): readonly string[] {
  const lines: string[] = [];
  let inShellFence = false;

  for (const line of body.split("\n")) {
    if (line.startsWith("```") && line !== "```") {
      inShellFence = line === "```sh";
      continue;
    }
    if (line === "```") {
      inShellFence = false;
      continue;
    }
    if (inShellFence) {
      lines.push(line);
    }
  }

  return lines;
}

const authoringRecipesImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.authoring-recipes"),
  label: "asserts realization of the shipped authoring recipe catalog",
  satisfies: ref("spec:consumers.agent-surface.authoring-recipes"),
});
void authoringRecipesImplementationAnchor;

function documentedCommands(body: string): readonly string[] {
  return shellFenceLines(body).filter(
    (line) => line.startsWith("pnpm --silent sdp:q ") || line.startsWith("pnpm exec sdp "),
  );
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

  it("keeps every skill graph-first and the authoring law linked to carrying Specs", () => {
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
    // The hazard is a documented invocation the collector above would never collect: a bare
    // `sdp` resolves to whatever binary shadows it on PATH (macOS ships an unrelated `sdp`),
    // so the check scans every shell-fenced line rather than the pnpm-prefixed subset.
    for (const path of skillPaths) {
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
