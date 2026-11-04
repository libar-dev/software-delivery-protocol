import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  statSync,
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

describe("article evidence delimiter scans", () => {
  it.each([
    ["backtick", "`", "carriage return", "\r"],
    ["backtick", "`", "line separator", "\u2028"],
    ["backtick", "`", "paragraph separator", "\u2029"],
    ["tilde", "~", "carriage return", "\r"],
    ["tilde", "~", "line separator", "\u2028"],
    ["tilde", "~", "paragraph separator", "\u2029"],
  ])(
    "%s fence (%s) followed by %s completes within the subprocess deadline",
    (_name, delimiter, _tailName, tail) => {
      const script = path.join(repositoryRoot, "docs/articles/sync-evidence.mjs");
      const result = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "--eval",
          `import { evidenceMarkers } from ${JSON.stringify(script)};
           const article = "# Article\\n\\n" + ${JSON.stringify(delimiter)}.repeat(100_000)
             + ${JSON.stringify(tail)} + "\\n\\nprose\\n";
           console.log(JSON.stringify([...evidenceMarkers(article, "article.md")]));`,
        ],
        { encoding: "utf8", timeout: 5_000 },
      );
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe("[]");
    },
    15_000,
  );

  const pin = "a".repeat(40);
  const cases = [
    {
      id: "pin",
      file: "README.md",
      prefix: "Pinned source baseline:x",
      complete: `> **Pinned source baseline:** commit [pin](https://example.test/tree/${pin}).\n`,
      expected: pin,
      error: "The publication plan does not name a full pinned source commit.",
    },
    {
      id: "constant-anchor",
      file: "examples/checkout-v1/src/orders/create-order.use-case.ts",
      prefix: "export const createOrderUseCaseAnchor = codeAnchor({",
      complete:
        'import { codeAnchor } from "./anchors";\n// earlier delimiter\n});\n' +
        'export const createOrderUseCaseAnchor = codeAnchor({\n  id: "impl:probe",\n});\ntrailing text',
      expected:
        'import { codeAnchor } from "./anchors";\n\n// …\n\n' +
        'export const createOrderUseCaseAnchor = codeAnchor({\n  id: "impl:probe",\n});',
      error: "Could not locate the create-order constant anchor.",
    },
    {
      id: "roadmap-mermaid",
      file: "examples/checkout-v1/generated/mermaid/pack/checkout-roadmap.md",
      prefix: "```mermaid\nx",
      complete: "Earlier fence\n```\n\n```mermaid\ngraph TD\n  A --> B\n```\ntrailing text",
      expected: "graph TD\n  A --> B",
      error: "Could not read the generated checkout-roadmap Mermaid block.",
    },
  ];

  for (const probe of cases) {
    it.each(["complete", "missing opening", "missing closing", "adversarial"])(
      `${probe.id}: handles %s input within the subprocess deadline`,
      (scenario) => {
        const temporary = mkdtempSync(path.join(tmpdir(), "sdp-article-scan-"));
        try {
          const input =
            scenario === "complete"
              ? probe.complete
              : scenario === "missing opening"
                ? "unrelated text\n});\n```\n"
                : scenario === "missing closing"
                  ? probe.prefix
                  : probe.prefix.repeat(100_000) +
                    (probe.id === "pin" ? `\n${probe.complete}` : "");
          const file = path.join(temporary, probe.file);
          mkdirSync(path.dirname(file), { recursive: true });
          writeFileSync(file, input);
          // The Mermaid generator runs the CLI first. Keep this probe about parsing its
          // generated page, without invoking a full graph build on adversarial text.
          mkdirSync(path.join(temporary, "dist/cli"), { recursive: true });
          writeFileSync(path.join(temporary, "dist/cli/sdp.js"), "");
          const script = path.join(repositoryRoot, "docs/articles/sync-evidence.mjs");
          const copiedScript = path.join(temporary, "sync-evidence.mjs");
          copyFileSync(script, copiedScript);
          const args =
            probe.id === "pin"
              ? [copiedScript, "--print-pin"]
              : [
                  "--input-type=module",
                  "--eval",
                  `import { evidenceBlocks } from ${JSON.stringify(copiedScript)};
                   console.log(evidenceBlocks(${JSON.stringify(temporary)}, "pin")
                     .find((block) => block.id === ${JSON.stringify(probe.id)}).generate());`,
                ];
          // Synchronous regex work cannot be interrupted by Vitest's own timeout. A
          // generous child deadline catches polynomial scans without a tight benchmark.
          const result = spawnSync(process.execPath, args, {
            encoding: "utf8",
            timeout: 5_000,
          });
          expect(result.error, `${probe.id}: ${scenario}`).toBeUndefined();
          const succeeds =
            scenario === "complete" || (scenario === "adversarial" && probe.id === "pin");
          expect(result.status).toBe(succeeds ? 0 : 1);
          if (succeeds) expect(result.stdout.trim()).toBe(probe.expected);
          else expect(result.stderr).toContain(probe.error);
        } finally {
          rmSync(temporary, { recursive: true, force: true });
        }
      },
      15_000,
    );
  }
});

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

  it("refuses a repository without the pin before executing its CLI", () => {
    const temporary = mkdtempSync(path.join(tmpdir(), "sdp-article-unpinned-"));
    const sentinel = path.join(temporary, "executed");
    try {
      execFileSync("git", ["init", temporary], { stdio: "pipe" });
      mkdirSync(path.join(temporary, "dist/cli"), { recursive: true });
      writeFileSync(
        path.join(temporary, "dist/cli/sdp.js"),
        `require("node:fs").writeFileSync(${JSON.stringify(sentinel)}, "executed");`,
      );
      const result = spawnSync(
        process.execPath,
        [path.join(repositoryRoot, "docs/articles/sync-evidence.mjs"), "--check", temporary],
        { encoding: "utf8" },
      );
      expect(existsSync(sentinel)).toBe(false);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("invalid reference");
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  });

  it("generates evidence from the materialized pin, never the supplied checkout", () => {
    const temporary = mkdtempSync(path.join(tmpdir(), "sdp-article-main-"));
    const articles = path.join(temporary, "articles/docs/articles");
    const repo = path.join(temporary, "repository");
    const sentinel = path.join(temporary, "executed");
    const git = (...args: string[]) =>
      execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
    // Stop at the first generator's CLI call: its origin is the observation under test.
    const cli = (origin: string) =>
      `require("node:fs").appendFileSync(${JSON.stringify(sentinel)}, ${JSON.stringify(origin + "\n")}); process.exit(1);`;
    try {
      mkdirSync(articles, { recursive: true });
      mkdirSync(repo);
      git("init", "-q");
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
      writeFileSync(
        path.join(repo, "build.cjs"),
        `const fs = require("node:fs"); fs.mkdirSync("dist/cli", { recursive: true }); fs.writeFileSync("dist/cli/sdp.js", ${JSON.stringify(cli("materialized"))});`,
      );
      writeFileSync(path.join(repo, ".gitignore"), "dist/\n");
      git("add", "package.json", "package-lock.json", "build.cjs", ".gitignore");
      git(
        "-c",
        "user.name=Test",
        "-c",
        "user.email=test@example.invalid",
        "-c",
        "commit.gpgsign=false",
        "commit",
        "-qm",
        "pin",
      );
      const pin = git("rev-parse", "HEAD");
      mkdirSync(path.join(repo, "dist/cli"), { recursive: true });
      writeFileSync(path.join(repo, "dist/cli/sdp.js"), cli("supplied"));

      // Run the real entry point with a toy pin, independent of HEAD's engine and corpus.
      copyFileSync(
        path.join(repositoryRoot, "docs/articles/sync-evidence.mjs"),
        path.join(articles, "sync-evidence.mjs"),
      );
      const documents = new Map([["README.md", `Pinned source baseline: x/tree/${pin}\n`]]);
      for (const block of evidenceBlocks(repo, pin)) {
        documents.set(
          block.file,
          (documents.get(block.file) ?? "") +
            `<!-- evidence:${block.id} -->\nold\n<!-- /evidence:${block.id} -->\n`,
        );
      }
      for (const [file, text] of documents) writeFileSync(path.join(articles, file), text);
      const result = spawnSync(
        process.execPath,
        [path.join(articles, "sync-evidence.mjs"), "--check", repo],
        { encoding: "utf8" },
      );
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(readFileSync(sentinel, "utf8")).toBe("materialized\n");
      expect(git("worktree", "list", "--porcelain").match(/^worktree /gm)).toHaveLength(1);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
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

  it.each(["```", "~~~"])("recognizes markers after a CRLF %s closing fence", (fence) => {
    const original = `${fence}text\nexample\n${fence}\r\n${probeText}`;
    const range = evidenceMarkers(original, "article.md").get("probe");
    expect(range).toBeDefined();
    expect(original.slice(range?.start, range?.end)).toBe(probeText);
  });

  for (const fence of ["```", "~~~"]) {
    it.each(["\u2028", "\u2029", "\u00a0", "\v", "\f"])(
      `keeps ${fence} open with a non-CommonMark closing tail %j`,
      (tail) => {
        expect(() =>
          evidenceMarkers(`${fence}\ncode\n${fence}${tail}\n${probeText}`, "article.md"),
        ).toThrow("malformed or fenced evidence marker");
      },
    );
    it.each(["", " ", "\t", " \t\r"])(
      `closes ${fence} with a CommonMark closing tail %j`,
      (tail) => {
        expect(
          evidenceMarkers(`${fence}\ncode\n${fence}${tail}\n${probeText}`, "article.md").has(
            "probe",
          ),
        ).toBe(true);
      },
    );
  }

  it("preserves nested carrier fences and detects edits independently of HEAD", () => {
    const temporary = mkdtempSync(path.join(tmpdir(), "sdp-article-carriers-"));
    try {
      const orders = path.join(temporary, "examples/checkout-v1/specs/orders");
      mkdirSync(orders, { recursive: true });
      const blocks = evidenceBlocks(temporary, "pin");
      for (const [id, file] of [
        ["create-order-carrier", "create-order.sdp.md"],
        ["valid-cart-carrier", "create-order-valid-cart.sdp.md"],
      ] as const) {
        // Deliberately differs from the published pin: future carrier edits must not
        // require an article refresh. check:articles owns equality at the pin.
        const source =
          `---\nreadiness: ready\n---\nA later carrier edit: ${id}\n\n` +
          "```gwt\nGiven a changed example\n```\n";
        writeFileSync(path.join(orders, file), source);
        const block = blocks.find((entry) => entry.id === id);
        expect(block, id).toBeDefined();
        if (!block) throw new Error(id);
        expect(block.generate()).toBe(source);
        const original = readFileSync(
          path.join(repositoryRoot, "docs/articles", block.file),
          "utf8",
        );
        const rendered = replaceEvidenceBlock(original, block, source);
        expect(replaceEvidenceBlock(rendered, block, source)).toBe(rendered);
        const range = evidenceMarkers(rendered, block.file).get(id);
        if (!range) throw new Error(id);
        const changed =
          rendered.slice(0, range.start) +
          rendered.slice(range.start, range.end).replace("readiness:", "altered:") +
          rendered.slice(range.end);
        expect(replaceEvidenceBlock(changed, block, block.generate())).toBe(rendered);
        expect(rendered.slice(range.start, range.end)).toContain("````markdown");
        expect(rendered.slice(range.start, range.end)).toContain("```gwt");
      }
    } finally {
      rmSync(temporary, { recursive: true, force: true });
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

  it.each(["-checkout", "--check", "--"])("accepts %s as an operand after --", (source) => {
    expect(parseArguments(["--check", "--", source])).toEqual({
      check: true,
      printPin: false,
      source,
    });
    expect(() => parseArguments(["--check", "--", source, "second"])).toThrow("Only one source");
  });

  it.each(
    [
      ["/source", "--chek"],
      ["--verbose", "/source"],
      ["one", "two"],
      ["--print-pin", "--chek"],
      [],
      ["--check"],
      ["--print-pin", "/source"],
    ].map((args) => [args]),
  )("refuses invalid arguments %j before touching manuscripts", (args) => {
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

  it("does not offer an implicit source repository", () => {
    const playbook = readFileSync(path.join(repositoryRoot, "docs/articles/README.md"), "utf8");
    expect(playbook).not.toContain("omit `$SOURCE_DIR`");
  });
});

// Small real git repositories exercise materialization, npm's lockfile install and the build
// without reinstalling the Protocol's full dependency tree for every regression probe.
describe("pinned evidence source", () => {
  it("materializes blobs totaling more than the former batch buffer", () => {
    const temporary = mkdtempSync(path.join(tmpdir(), "sdp-article-large-"));
    const repo = path.join(temporary, "repository");
    mkdirSync(repo);
    const git = (...args: string[]) =>
      execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", stdio: "pipe" }).trim();
    try {
      git("init", "-q");
      writeFileSync(
        path.join(repo, "package.json"),
        JSON.stringify({ name: "large-probe", version: "1.0.0", scripts: { build: "node -e ''" } }),
      );
      writeFileSync(
        path.join(repo, "package-lock.json"),
        JSON.stringify({
          name: "large-probe",
          version: "1.0.0",
          lockfileVersion: 3,
          packages: { "": { name: "large-probe", version: "1.0.0" } },
        }),
      );
      const size = 48 * 1024 * 1024;
      for (const file of ["a.bin", "b.bin", "c.bin"])
        writeFileSync(path.join(repo, file), Buffer.alloc(size, 42));
      git("add", "package.json", "package-lock.json", "a.bin", "b.bin", "c.bin");
      git(
        "-c",
        "user.name=Test",
        "-c",
        "user.email=test@example.invalid",
        "-c",
        "commit.gpgsign=false",
        "commit",
        "-qm",
        "pin",
      );
      withPinnedSource(
        repo,
        git("rev-parse", "HEAD"),
        path.join(temporary, "scratch"),
        (source) => {
          for (const file of ["a.bin", "b.bin", "c.bin"]) {
            expect(statSync(path.join(source, file)).size).toBe(size);
            expect(readFileSync(path.join(source, file)).equals(Buffer.alloc(size, 42))).toBe(true);
          }
        },
      );
      expect(git("worktree", "list", "--porcelain").match(/^worktree /gm)).toHaveLength(1);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  }, 30_000);

  it.each(["source", "build", "outputs", "sparse checkout", "replace ref", "smudge filter"])(
    "uses only the pin and isolates %s",
    (focus) => {
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
        writeFileSync(path.join(repo, "omitted.txt"), "always present");
        writeFileSync(path.join(repo, "binary"), Buffer.from([0, 255, 10, 13]));
        chmodSync(path.join(repo, "binary"), 0o755);
        symlinkSync("source.txt", path.join(repo, "source-link"));
        writeFileSync(
          path.join(repo, ".gitignore"),
          "*.test.generated.ts\ndist/\nnode_modules/\ngenerated/\n",
        );
        writeFileSync(
          path.join(repo, "build.cjs"),
          "const fs = require('node:fs'); fs.mkdirSync('dist'); fs.writeFileSync('dist/result', fs.readFileSync('source.txt'));\n",
        );
        git(
          "add",
          "package.json",
          "package-lock.json",
          "source.txt",
          "omitted.txt",
          "binary",
          "source-link",
          ".gitignore",
          "build.cjs",
        );
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
        writeFileSync(
          path.join(repo, "phantom.test.generated.ts"),
          "/** @sdpAnchor impl:phantom */",
        );
        writeFileSync(path.join(repo, "untracked.txt"), "hidden untracked");
        git("config", "status.showUntrackedFiles", "no");
        for (const dir of ["dist", "node_modules", "generated"]) mkdirSync(path.join(repo, dir));
        writeFileSync(path.join(repo, "dist/result"), "stale build");
        writeFileSync(path.join(repo, "node_modules/foreign.txt"), "foreign dependency");
        writeFileSync(path.join(repo, "generated/sentinel"), "keep output");
        expect(git("status", "--porcelain")).toBe("");
        if (focus === "sparse checkout") {
          git("sparse-checkout", "set", "--no-cone", "/*", "!/omitted.txt");
          expect(existsSync(path.join(repo, "omitted.txt"))).toBe(false);
        }
        if (focus === "replace ref") {
          const original = git("rev-parse", `${commit}:source.txt`);
          const replacement = execFileSync("git", ["-C", repo, "hash-object", "-w", "--stdin"], {
            input: "replaced source",
            encoding: "utf8",
          }).trim();
          git("replace", original, replacement);
          expect(git("show", `${commit}:source.txt`)).toBe("replaced source");
        }
        if (focus === "smudge filter") {
          writeFileSync(path.join(repo, ".git/info/attributes"), "source.txt filter=probe\n");
          git("config", "filter.probe.smudge", "sed s/pinned/filtered/");
          git("config", "filter.probe.required", "true");
        }
        let materialized = "";
        withPinnedSource(repo, commit, scratch, (source) => {
          materialized = source;
          if (focus !== "build" && focus !== "outputs")
            expect(read(source, "source.txt")).toBe("pinned source");
          expect(read(source, "omitted.txt")).toBe("always present");
          expect(readFileSync(path.join(source, "binary"))).toEqual(Buffer.from([0, 255, 10, 13]));
          expect(statSync(path.join(source, "binary")).mode & 0o100).toBe(0o100);
          expect(readlinkSync(path.join(source, "source-link"))).toBe("source.txt");
          if (focus === "source") {
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
    },
  );
});
