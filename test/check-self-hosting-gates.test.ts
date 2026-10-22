import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const guardPath = join(repoRoot, "check-self-hosting-gates.mjs");
const roots: string[] = [];
import { codeAnchor, codeAnchorId, ref, specTest, testAnchorId } from "../src/anchors.js";
import { extract } from "../src/extract/index.js";

const roadmapPath = "specs/roadmap.pack.sdp.md";
const copiedPaths = [
  "AGENTS.md",
  "CONTEXT.md",
  "package.json",
  "docs/concept/DECISIONS.md",
  ["plans", "16-carrier-ruling.md"].join("/"),
  ["plans", "17-self-hosting-v1.md"].join("/"),
  ["plans", "18-self-hosting-phase-2.md"].join("/"),
  roadmapPath,
] as const;

function copyRecordTree(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-gates-"));
  roots.push(root);

  for (const path of copiedPaths) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    copyFileSync(join(repoRoot, path), join(root, path));
  }

  return root;
}

function runGuard(root: string) {
  mkdirSync(join(root, "generated"), { recursive: true });
  writeFileSync(join(root, "generated/graph.json"), JSON.stringify(extract({ root }).graph));
  return spawnSync(process.execPath, [guardPath, root], { encoding: "utf8" });
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

// The script is outside the TypeScript carrier; this suite asserts its realization with the handbook.
const roadmapPractice = codeAnchor({
  id: codeAnchorId("impl:protocol.roadmap-practice"),
  label: "realizes the roadmap handbook and its current-record gate",
  satisfies: ref("spec:protocol.roadmap-replaces-plans"),
  role: "validator",
});
void roadmapPractice;
const roadmapPracticeTest = specTest({
  id: testAnchorId("test:protocol.roadmap-practice"),
  verifies: ref("spec:protocol.roadmap-replaces-plans"),
});
void roadmapPracticeTest;

describe("the self-hosting records gate", () => {
  it("accepts the current record without requiring the historical ledger shape", () => {
    const result = runGuard(copyRecordTree());

    expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: "" });
  });

  it("fails when a frozen historical owner-packet pin is broken", () => {
    const root = copyRecordTree();
    const path = join(root, "plans", "17-self-hosting-v1.md");
    const source = readFileSync(path, "utf8");
    writeFileSync(
      path,
      source.replace(
        "aca79090529c2f6625ceafc78f33e16da81bfcb1",
        "0000000000000000000000000000000000000000",
      ),
    );

    const result = runGuard(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Gate 1 ledger SHA disagrees with the owner packet");
  });

  it.each([
    ["pack:roadmap", "the handbook does not name the roadmap Pack"],
    ["recipe 53", "the handbook does not name the roadmap recipe"],
  ])("refuses a missing handbook pointer: %s", (token, message) => {
    const root = copyRecordTree();
    const path = join(root, "AGENTS.md");
    writeFileSync(path, readFileSync(path, "utf8").replaceAll(token, "removed"));
    const result = runGuard(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(`AGENTS.md — ${message}`);
  });

  it("names a missing roadmap manifest", () => {
    const root = copyRecordTree();
    rmSync(join(root, roadmapPath));
    const result = runGuard(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "generated/graph.json — the roadmap Pack pack:roadmap is missing",
    );
  });

  it.each(["absent", "corrupt"])("names the generated graph when %s", (state) => {
    const root = copyRecordTree();
    if (state === "corrupt") {
      mkdirSync(join(root, "generated"), { recursive: true });
      writeFileSync(join(root, "generated/graph.json"), "{broken");
    }
    const result = spawnSync(process.execPath, [guardPath, root], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "generated/graph.json — the generated graph is missing or unreadable",
    );
  });

  it("accepts quoted priority with a comment and rejects a renamed roadmap id", () => {
    const root = copyRecordTree();
    const path = join(root, roadmapPath);
    writeFileSync(
      path,
      readFileSync(path, "utf8").replace("order: priority", 'order: "priority" # advisory'),
    );
    expect(runGuard(root).status).toBe(0);
    writeFileSync(path, readFileSync(path, "utf8").replace("id: pack:roadmap", "id: pack:renamed"));
    const result = runGuard(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "generated/graph.json — the roadmap Pack pack:roadmap is missing",
    );
  });

  it.each(["", "order: reading", "---\n# Roadmap\norder: priority"])(
    "requires a priority roadmap node derived from the manifest: %s",
    (order) => {
      const root = copyRecordTree();
      writeFileSync(
        join(root, roadmapPath),
        `---\nid: pack:roadmap\nspecs: []\n${order}\n---\n# Roadmap\n`,
      );
      const result = runGuard(root);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        order === ""
          ? "generated/graph.json — the roadmap Pack pack:roadmap does not state order: priority"
          : "generated/graph.json — the roadmap Pack pack:roadmap is missing",
      );
    },
  );

  it.each(["[]", "[spec:probe.built]", "[spec:probe.dependent, spec:probe.dependency]"])(
    "checks no content, dependency order or plan number: %s",
    (members) => {
      const root = copyRecordTree();
      writeFileSync(
        join(root, roadmapPath),
        `---\nid: pack:roadmap\norder: priority\nspecs: ${members}\n---\n# Roadmap\n`,
      );
      writeFileSync(join(root, "plans", "999-next.md"), "No status header.\n");
      const result = runGuard(root);
      expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: "" });
    },
  );

  it("keeps the documented green gate and semantic plan-status ban", () => {
    const root = copyRecordTree();
    const path = join(root, "AGENTS.md");
    writeFileSync(path, readFileSync(path, "utf8").replace("`check:temporal` →", ""));
    writeFileSync(
      join(root, "CONTEXT.md"),
      readFileSync(join(root, "CONTEXT.md"), "utf8") + "\nplan 999 is EXECUTED\n",
    );
    const result = runGuard(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("documented green-gate legs disagree");
    expect(result.stderr).toContain("CONTEXT.md — carries plan-status wording");
  });

  it("ships the roadmap, recovery and review convention in the handbook", () => {
    const source = readFileSync(join(repoRoot, "AGENTS.md"), "utf8");
    const flat = (text: string) => text.replace(/\s+/gu, " ");
    const bullet = (label: string) => {
      const match = source.split(`- **${label}**`)[1]?.split(/^-(?= \*\*)|^## /mu)[0];
      expect(match, label).toBeDefined();
      return flat(match ?? "");
    };
    const next = flat(source.split("> **Next work**")[1]?.split(/^## /mu)[0] ?? "");
    for (const clause of ["pack:roadmap", "recipe 53", "frozen history"])
      expect(next).toContain(clause);
    const commits = bullet("Commits are recovery boundaries, not workflow gates.");
    for (const clause of [
      "first commit message",
      "working rules",
      "draft pull request",
      "first coherent commit",
      "Without such an instruction, ask before committing",
      "never force one per todo",
      "create empty commits",
      "absorb unrelated or pre-existing changes",
      "commit from an unsafe dirty baseline",
    ])
      expect(commits).toContain(clause);
    const reviews = bullet("Reviews travel as proposals.");
    for (const clause of [
      "branch-head commit",
      "a proposal composed in a preview names the preview's merge commit",
      "recipe 38",
      "recipe 49",
      "decider",
      "provisional",
      "links",
      "code defect",
    ])
      expect(reviews).toContain(clause);
    expect(reviews).not.toContain("never a preview's merge commit");
    const evidence = bullet("Tests are the evidence.");
    for (const clause of [
      "removed before merge",
      "run evidence",
      "merge commits",
      "The Protocol merges its pull requests with merge commits",
      "head ref",
      "squash or rebase merge",
      "durable ref",
    ])
      expect(evidence).toContain(clause);
    const forward = bullet("Plan the next PR.");
    for (const clause of ["recipe 55", "owner's reason"]) expect(forward).toContain(clause);
    expect(bullet("DECISIONS.md admits sparingly, and reads by name.")).toContain(
      "its paper trail is git and the pull request description",
    );
    expect(flat(source)).not.toMatch(/plan \d+ is (?:EXECUTING|EXECUTED|DRAFTED)/u);
    expect(source).not.toContain("highest primary-numbered plan");
  });
});
