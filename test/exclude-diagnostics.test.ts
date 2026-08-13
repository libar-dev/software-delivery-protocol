import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { discoverFiles, normalizeExcludes } from "../src/extract/discover.js";

const temporaryRoots: string[] = [];

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-exclude-diagnostics-"));
  temporaryRoots.push(root);
  return root;
}

describe("exclusion diagnostics", () => {
  afterEach(() => {
    for (const root of temporaryRoots.splice(0)) {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("rejects a Windows drive-letter absolute path instead of accepting an unmatched prefix", () => {
    // Given: a Windows absolute path, which cannot identify a root-relative POSIX prefix.
    const windowsAbsolute = "C:/work/specs";

    // When / Then: the library boundary rejects it loudly.
    expect(() => normalizeExcludes([windowsAbsolute])).toThrow(
      'normalizeExcludes: invalid exclusion path "C:/work/specs"',
    );
  });

  it("keeps the library diagnostic distinct from CLI flag wording", () => {
    // Given: a malformed library exclusion value.
    const invalidPath = "./specs";

    // When / Then: the reusable normalizer names its own boundary, not a CLI flag.
    expect(() => normalizeExcludes([invalidPath])).toThrow(
      'normalizeExcludes: invalid exclusion path "./specs"',
    );
  });

  it("excludes only an exact prefix or a path-segment descendant", () => {
    // Given: sibling paths where one merely begins with the other prefix's code units.
    const root = temporaryRoot();
    mkdirSync(join(root, "foo"));
    mkdirSync(join(root, "foobar"));
    writeFileSync(join(root, "foo", "excluded.sdp.ts"), "", "utf8");
    writeFileSync(join(root, "foobar", "included.sdp.ts"), "", "utf8");

    // When: only the `foo` prefix is excluded.
    const discovered = discoverFiles(root, ["foo"]);

    // Then: `foo` is absent, while `foobar` remains because a slash segment boundary is required.
    expect(discovered.specFiles.map((file) => file.relativePath)).toEqual([
      "foobar/included.sdp.ts",
    ]);
  });
  it("discovers the Gherkin carrier suffix beside the existing carriers", () => {
    const root = temporaryRoot();
    writeFileSync(join(root, "behavior.feature"), "", "utf8");
    writeFileSync(join(root, "markdown.sdp.md"), "", "utf8");
    writeFileSync(join(root, "typescript.sdp.ts"), "", "utf8");

    expect(discoverFiles(root).specFiles.map((file) => file.relativePath)).toEqual([
      "behavior.feature",
      "markdown.sdp.md",
      "typescript.sdp.ts",
    ]);
  });
});
