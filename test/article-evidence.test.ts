import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  evidenceBlocks,
  evidenceMarkers,
  measurementLabel,
  parseArguments,
  replaceEvidenceBlock,
  summarizeValidation,
  validateEvidenceMarkers,
  withPinnedSource,
} from "../docs/articles/sync-evidence.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("article evidence CLI entry", () => {
  it("runs when invoked through a symlinked checkout path", () => {
    const linkParent = mkdtempSync(path.join(tmpdir(), "sdp-article-link-"));
    try {
      const linkedRoot = path.join(linkParent, "checkout");
      symlinkSync(repositoryRoot, linkedRoot, "dir");
      const result = spawnSync(
        process.execPath,
        [path.join(linkedRoot, "docs/articles/sync-evidence.mjs"), "--print-pin"],
        { encoding: "utf8" },
      );
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toMatch(/^[0-9a-f]{40}$/u);
    } finally {
      rmSync(linkParent, { recursive: true, force: true });
    }
  });
});

// Import the CLI's helpers directly: an import must not validate a checkout or regenerate files.
describe("article evidence replacement", () => {
  it.each([null, "text"])("preserves replacement tokens literally with language %s", (language) => {
    const opening = "<!-- evidence:probe -->";
    const closing = "<!-- /evidence:probe -->";
    const original = `Before\n${opening}\nold evidence\n${closing}\nAfter\n`;
    const body = "Literal $$, $&, $`, and $' must survive.";
    const block = { id: "probe", file: "article.md", language };
    const expectedBody = language === null ? body : `\`\`\`text\n${body}\n\`\`\``;
    const expected = `Before\n${opening}\n${expectedBody}\n${closing}\nAfter\n`;

    const updated = replaceEvidenceBlock(original, block, body);
    expect(updated).toBe(expected);
    expect(replaceEvidenceBlock(updated, block, body)).toBe(expected);
  });

  it("refuses a missing evidence block", () => {
    expect(() =>
      replaceEvidenceBlock(
        "No markers",
        { id: "probe", file: "article.md", language: null },
        "body",
      ),
    ).toThrow("article.md is missing the probe evidence markers");
  });
});

describe("article validation evidence", () => {
  it("counts only honesty gaps, including located diagnostics", () => {
    expect(
      summarizeValidation(
        "validate: 0 errors · 3 warnings\n" +
          "[warning] honesty/gaps — missing verifier\n" +
          "[warning] honesty/gaps — another missing verifier\n" +
          "specs/probe.sdp.md:9 — [warning] honesty/gaps — missing verifier\n",
      ),
    ).toBe("0 errors and 3 intentional warnings (3 `honesty/gaps`)");
  });

  it("reports zero counts for documented rules without warnings", () => {
    expect(summarizeValidation("validate: 0 errors · 0 warnings")).toBe(
      "0 errors and 0 intentional warnings (0 `honesty/gaps`)",
    );
  });

  it.each(["honesty/orphans", "conformance/prose-mentions"])(
    "refuses to label %s intentional",
    (rule) => {
      expect(() =>
        summarizeValidation(`validate: 0 errors · 1 warnings\n[warning] ${rule} — unlinked\n`),
      ).toThrow(`Unexpected self-hosting warning rule: ${rule}`);
    },
  );

  it("refuses unparsed warnings and missing summaries", () => {
    expect(() => summarizeValidation("validate: 0 errors · 1 warnings\nunknown format")).toThrow(
      "Warning breakdown does not match",
    );
    expect(() => summarizeValidation("No summary")).toThrow(
      "Could not read the self-hosting validation summary",
    );
  });
});

const probeBlock = { id: "probe", file: "article.md", language: null };
const probeText = "<!-- evidence:probe -->\nbody\n<!-- /evidence:probe -->";

describe("article evidence structure", () => {
  it.each([
    ["duplicate", `${probeText}\n${probeText}`],
    ["fenced", `\`\`\`\`markdown\n${probeText}\n\`\`\`\``],
    ["tilde fenced", `~~~\n${probeText}\n~~~`],
    ["shadowed", `\`\`\`\`\n${probeText}\n\`\`\`\`\n${probeText}`],
    ["nested", "<!-- evidence:probe -->\n" + probeText + "\n<!-- /evidence:probe -->"],
    ["unclosed", "<!-- evidence:probe -->\nbody"],
    ["unmatched", "<!-- /evidence:probe -->"],
    ["inline", `prefix ${probeText}`],
  ])("refuses %s markers", (_name, text) => {
    expect(() => replaceEvidenceBlock(text, probeBlock, "new body")).toThrow();
  });

  it("refuses unknown, misplaced and missing blocks across every article", () => {
    expect(() => {
      validateEvidenceMarkers(
        new Map([
          ["article.md", probeText],
          ["extra.md", probeText.replaceAll("probe", "unknown")],
        ]),
        [probeBlock],
      );
    }).toThrow("unknown evidence block");
    expect(() => {
      validateEvidenceMarkers(
        new Map([
          ["article.md", probeText],
          ["extra.md", probeText],
        ]),
        [probeBlock],
      );
    }).toThrow("duplicate evidence block");
    expect(() => {
      validateEvidenceMarkers(new Map([["extra.md", probeText]]), [probeBlock]);
    }).toThrow("misplaced evidence block");
    expect(() => {
      validateEvidenceMarkers(new Map(), [probeBlock]);
    }).toThrow("missing");
  });

  it("preserves nested carrier fences and detects edits to both carrier excerpts", () => {
    const blocks = evidenceBlocks(repositoryRoot, "pin");
    for (const [id, file] of [
      ["create-order-carrier", "create-order.sdp.md"],
      ["valid-cart-carrier", "create-order-valid-cart.sdp.md"],
    ] as const) {
      const block = blocks.find((entry) => entry.id === id);
      expect(block, id).toBeDefined();
      if (!block) throw new Error(id);
      const source = readFileSync(
        path.join(repositoryRoot, "examples/checkout-v1/specs/orders", file),
        "utf8",
      ).trim();
      expect(block.generate()).toBe(source + "\n");
      const original = readFileSync(path.join(repositoryRoot, "docs/articles", block.file), "utf8");
      expect(replaceEvidenceBlock(original, block, source)).toBe(original);
      const range = evidenceMarkers(original, block.file).get(id);
      if (!range) throw new Error(id);
      const changed =
        original.slice(0, range.start) +
        original.slice(range.start, range.end).replace("readiness:", "altered:") +
        original.slice(range.end);
      expect(replaceEvidenceBlock(changed, block, block.generate())).not.toBe(changed);
      expect(original.slice(range.start, range.end)).toContain("````markdown");
    }
  });

  it("renders the entire drift recipe answer including firstUnmetClause", () => {
    const expected = execFileSync(
      process.execPath,
      [
        path.join(repositoryRoot, "dist/cli/sdp.js"),
        "q",
        "return recipes(2)",
        "--root",
        "examples/checkout-v1",
        "--json",
      ],
      { cwd: repositoryRoot, encoding: "utf8" },
    );
    const block = evidenceBlocks(repositoryRoot, "pin").find(
      (entry) => entry.id === "example-drift",
    );
    if (!block) throw new Error("Missing drift generator");
    expect(JSON.parse(block.generate())).toEqual(JSON.parse(expected));
    expect(block.generate()).toContain('"firstUnmetClause"');
  });

  it("moves measurement labels with the pin inside both generated blocks", () => {
    expect(measurementLabel("new-pin", "table")).toBe("Measured at commit `new-pin`:\n\ntable");
    for (const id of ["self-hosting-census", "baseline-metrics"]) {
      const block = evidenceBlocks(repositoryRoot, "new-pin").find((entry) => entry.id === id);
      if (!block) throw new Error(id);
      if (id === "self-hosting-census") {
        expect(block.generate()).toMatch(/^Measured at commit `new-pin`:/);
      }
      const original = readFileSync(path.join(repositoryRoot, "docs/articles", block.file), "utf8");
      const range = evidenceMarkers(original, block.file).get(id);
      if (!range) throw new Error(id);
      expect(original.slice(range.start, range.end)).toMatch(/Measured at commit `[0-9a-f]{40}`/);
      const updated = replaceEvidenceBlock(original, block, measurementLabel("new-pin", "table"));
      expect(updated.slice(range.start)).toContain("Measured at commit `new-pin`");
    }
  }, 60_000);

  it("describes build diagnostics without calling them validation totals", () => {
    const article = readFileSync(
      path.join(repositoryRoot, "docs/articles/03-walkthrough-intent-to-verified-code.md"),
      "utf8",
    );
    expect(article).not.toContain("build output above carries the validation totals");
    expect(article).toContain("extraction and contract-generation diagnostics");
  });
});

describe("article evidence arguments", () => {
  it("accepts the forwarded pnpm separator", () => {
    expect(parseArguments(["--check", "--", "/source"])).toEqual({
      check: true,
      printPin: false,
      source: "/source",
    });
  });

  it.each([
    ["/source", "--chek"],
    ["--verbose", "/source"],
    ["one", "two"],
    ["--print-pin", "--chek"],
    [],
    ["--check"],
    ["--print-pin", "/source"],
  ])("refuses invalid arguments %j before touching manuscripts", (...args) => {
    const article = path.join(repositoryRoot, "docs/articles/README.md");
    const before = readFileSync(article, "utf8");
    const result = spawnSync(
      process.execPath,
      [path.join(repositoryRoot, "docs/articles/sync-evidence.mjs"), ...args],
      { encoding: "utf8" },
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Usage:");
    expect(readFileSync(article, "utf8")).toBe(before);
  });

  it("documents an explicit source repository and disposable writes", () => {
    const playbook = readFileSync(path.join(repositoryRoot, "docs/articles/README.md"), "utf8");
    expect(playbook).not.toContain("omit `$SOURCE_DIR`");
    expect(playbook).toContain("Always pass the source repository explicitly");
    expect(playbook).toContain("Both commands create a temporary worktree");
  });
});

// Small real git repositories exercise materialization, npm's lockfile install and the build
// without reinstalling the Protocol's full dependency tree for every regression probe.
describe("pinned evidence source", () => {
  it.each(["source", "build", "outputs"])("uses only the pin and isolates %s", (focus) => {
    const temporary = mkdtempSync(path.join(tmpdir(), "sdp-article-pin-"));
    const repo = path.join(temporary, "repository");
    const scratch = path.join(temporary, "scratch");
    mkdirSync(repo);
    const git = (...args: string[]) =>
      execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
    const read = (root: string, file: string) => readFileSync(path.join(root, file), "utf8");
    try {
      git("init");
      writeFileSync(
        path.join(repo, "package.json"),
        JSON.stringify({
          name: "pin-probe",
          version: "1.0.0",
          scripts: { build: "node build.cjs" },
        }),
      );
      writeFileSync(
        path.join(repo, "package-lock.json"),
        JSON.stringify({
          name: "pin-probe",
          version: "1.0.0",
          lockfileVersion: 3,
          packages: { "": { name: "pin-probe", version: "1.0.0" } },
        }),
      );
      writeFileSync(path.join(repo, "source.txt"), "pinned source");
      writeFileSync(
        path.join(repo, ".gitignore"),
        "*.test.generated.ts\ndist/\nnode_modules/\ngenerated/\n",
      );
      writeFileSync(
        path.join(repo, "build.cjs"),
        "const fs = require('node:fs'); fs.mkdirSync('dist'); fs.writeFileSync('dist/result', fs.readFileSync('source.txt'));\n",
      );
      git("add", "package.json", "package-lock.json", "source.txt", ".gitignore", "build.cjs");
      git(
        "-c",
        "user.name=Test",
        "-c",
        "user.email=test@example.invalid",
        "-c",
        "commit.gpgsign=false",
        "commit",
        "-m",
        "pin",
      );
      const commit = git("rev-parse", "HEAD");
      git("update-index", "--skip-worktree", "source.txt");
      writeFileSync(path.join(repo, "source.txt"), "hidden edit");
      writeFileSync(path.join(repo, "phantom.test.generated.ts"), "/** @sdpAnchor impl:phantom */");
      writeFileSync(path.join(repo, "untracked.txt"), "hidden untracked");
      git("config", "status.showUntrackedFiles", "no");
      for (const dir of ["dist", "node_modules", "generated"]) mkdirSync(path.join(repo, dir));
      writeFileSync(path.join(repo, "dist/result"), "stale build");
      writeFileSync(path.join(repo, "node_modules/foreign.txt"), "foreign dependency");
      writeFileSync(path.join(repo, "generated/sentinel"), "keep output");
      expect(git("status", "--porcelain")).toBe("");
      let materialized = "";
      withPinnedSource(repo, commit, scratch, (source) => {
        materialized = source;
        if (focus === "source") {
          expect(read(source, "source.txt")).toBe("pinned source");
          expect(existsSync(path.join(source, "phantom.test.generated.ts"))).toBe(false);
          expect(existsSync(path.join(source, "untracked.txt"))).toBe(false);
          expect(existsSync(path.join(source, "node_modules/foreign.txt"))).toBe(false);
        }
        if (focus === "build") expect(read(source, "dist/result")).toBe("pinned source");
        mkdirSync(path.join(source, "generated"), { recursive: true });
        writeFileSync(path.join(source, "generated/sentinel"), "new output");
      });
      expect(read(repo, "generated/sentinel")).toBe("keep output");
      expect(existsSync(materialized)).toBe(false);
      expect(read(repo, "dist/result")).toBe("stale build");
      expect(read(repo, "source.txt")).toBe("hidden edit");
      expect(() =>
        withPinnedSource(repo, commit, scratch, () => {
          throw new Error("probe failure");
        }),
      ).toThrow("probe failure");
      expect(readdirSync(scratch)).toEqual([]);
      expect(git("worktree", "list", "--porcelain").match(/^worktree /gm)).toHaveLength(1);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  });
});
