import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { replaceEvidenceBlock, summarizeValidation } from "../docs/articles/sync-evidence.mjs";

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
  it("counts both documented warning rules, including located diagnostics", () => {
    expect(
      summarizeValidation(
        "validate: 0 errors · 3 warnings\n" +
          "[warning] honesty/gaps — missing verifier\n" +
          "[warning] honesty/gaps — another missing verifier\n" +
          "specs/probe.sdp.md:9 — [warning] conformance/prose-mentions — missing relation\n",
      ),
    ).toBe(
      "0 errors and 3 intentional warnings (2 `honesty/gaps`, 1 `conformance/prose-mentions`)",
    );
  });

  it("reports zero counts for documented rules without warnings", () => {
    expect(summarizeValidation("validate: 0 errors · 0 warnings")).toBe(
      "0 errors and 0 intentional warnings (0 `honesty/gaps`, 0 `conformance/prose-mentions`)",
    );
  });

  it("refuses to label an undocumented warning rule intentional", () => {
    expect(() =>
      summarizeValidation(
        "validate: 0 errors · 1 warnings\n[warning] honesty/orphans — unlinked\n",
      ),
    ).toThrow("Unexpected self-hosting warning rule: honesty/orphans");
  });

  it("refuses unparsed warnings and missing summaries", () => {
    expect(() => summarizeValidation("validate: 0 errors · 1 warnings\nunknown format")).toThrow(
      "Warning breakdown does not match",
    );
    expect(() => summarizeValidation("No summary")).toThrow(
      "Could not read the self-hosting validation summary",
    );
  });
});
