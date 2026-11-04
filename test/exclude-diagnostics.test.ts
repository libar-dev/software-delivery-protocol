import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { extract } from "../src/extract/index.js";

import { discoverFiles, normalizeExcludes } from "../src/extract/discover.js";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return { ...actual, statSync: vi.fn(actual.statSync) };
});

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

  it("does not stat excluded link targets that cannot hide a carrier or anchor", () => {
    const workspace = temporaryRoot();
    const root = join(workspace, "corpus");
    const outside = join(workspace, "outside");
    mkdirSync(root);
    mkdirSync(outside);
    for (const name of ["node_modules", "dist", "generated", "coverage", ".hidden"]) {
      symlinkSync(outside, join(root, name), "dir");
    }
    const stat = vi.mocked(statSync);
    stat.mockClear();

    expect(discoverFiles(root).skippedLinks).toEqual([]);
    expect(stat).not.toHaveBeenCalled();

    symlinkSync(join(outside, "missing"), join(root, "linked.sdp.md"));
    expect(discoverFiles(root).skippedLinks).toEqual(["linked.sdp.md"]);
    expect(stat).toHaveBeenCalledTimes(1);
  });

  it("names skipped candidate links while resolving an explicitly linked root", () => {
    const workspace = temporaryRoot();
    const root = join(workspace, "corpus");
    const outside = join(workspace, "outside");
    const alias = join(workspace, "alias");
    mkdirSync(root);
    mkdirSync(outside);
    symlinkSync(root, alias, "dir");
    writeFileSync(
      join(root, "included.sdp.md"),
      "---\nid: spec:probe.included\nkind: rule\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Included\n\n## Intent\n- outcome: Keep a real carrier.\n",
    );
    writeFileSync(join(outside, "hidden.sdp.md"), "invalid carrier");
    for (const name of ["linked.sdp.md", "linked.ts", "other.txt"]) {
      symlinkSync(join(outside, "hidden.sdp.md"), join(root, name));
    }
    symlinkSync(outside, join(root, "directory"), "dir");
    symlinkSync(root, join(root, "loop"), "dir");
    symlinkSync(join(outside, "missing"), join(root, "dangling.sdp.md"));
    for (const name of ["node_modules", "dist", "generated", "coverage", ".hidden", "excluded"]) {
      symlinkSync(outside, join(root, name), "dir");
    }
    mkdirSync(join(root, "omitted"));
    symlinkSync(outside, join(root, "omitted", "nested"), "dir");
    const exclude = ["excluded", "omitted"];
    const discovered = discoverFiles(alias, exclude);
    expect(discovered.specFiles).toEqual([
      {
        absolutePath: join(realpathSync.native(root), "included.sdp.md"),
        relativePath: "included.sdp.md",
      },
    ]);
    expect(discovered.anchorCandidateFiles).toEqual([]);
    const result = extract({ root: alias, exclude });
    expect(result.counts).toEqual({ specs: 1, packs: 0, anchors: 0 });
    expect(result.report.findings).toEqual(
      ["dangling.sdp.md", "directory", "linked.sdp.md", "linked.ts", "loop"].map((file) => ({
        validatorId: "extract/symbolic-link-skipped",
        family: "conformance",
        severity: "warning",
        file,
        message: `symbolic link "${file}" is skipped; discovery never follows links below the root`,
      })),
    );
  });

  // spec:extraction.excludes#rule.canonicalDiscovery
  it.each([
    ["CLAUDE.md", false],
    ["types.d.ts", false],
    ["other.txt", false],
    ["other.feature", false],
    ["x.sdp.md", true],
    ["x.pack.sdp.md", true],
    ["x.sdp.ts", true],
    ["x.sdp.gherkin", true],
    ["source.ts", true],
    ["source.tsx", true],
    // Discovery skips dot-directories, never dot-files: a dot-named candidate link can hide one.
    [".x.sdp.md", true],
    [".x.pack.sdp.md", true],
    [".x.sdp.ts", true],
    [".x.sdp.gherkin", true],
    [".source.ts", true],
    [".source.tsx", true],
    [".types.d.ts", false],
    [".other.txt", false],
  ])("warns for the skipped file link %s only when its name is a candidate", (name, warns) => {
    const root = temporaryRoot();
    writeFileSync(join(root, "AGENTS.md"), "This file is not a discovery candidate.\n");
    symlinkSync("AGENTS.md", join(root, name));

    const result = extract({ root });

    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 0 });
    expect(result.report.findings).toEqual(
      warns
        ? [
            {
              validatorId: "extract/symbolic-link-skipped",
              family: "conformance",
              severity: "warning",
              file: name,
              message: `symbolic link "${name}" is skipped; discovery never follows links below the root`,
            },
          ]
        : [],
    );
  });

  it("warns once for a directory link even when its name is not a candidate filename", () => {
    const workspace = temporaryRoot();
    const root = join(workspace, "corpus");
    const outside = join(workspace, "outside");
    mkdirSync(root);
    mkdirSync(outside);
    writeFileSync(join(outside, "hidden.sdp.md"), "invalid carrier");
    symlinkSync(outside, join(root, "CLAUDE.md"), "dir");

    const result = extract({ root });

    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 0 });
    expect(result.report.findings).toEqual([
      {
        validatorId: "extract/symbolic-link-skipped",
        family: "conformance",
        severity: "warning",
        file: "CLAUDE.md",
        message:
          'symbolic link "CLAUDE.md" is skipped; discovery never follows links below the root',
      },
    ]);
  });

  // spec:extraction.excludes#rule.canonicalDiscovery
  it("judges a link by the entry it stands for, so a dot-named directory link stays silent", () => {
    const workspace = temporaryRoot();
    const root = join(workspace, "corpus");
    const outside = join(workspace, "outside");
    mkdirSync(root);
    mkdirSync(outside);
    writeFileSync(join(outside, "hidden.sdp.md"), "invalid carrier");
    // A regular dot-named file is read, so its linked twin warns even when the target is missing.
    writeFileSync(
      join(root, ".regular.sdp.md"),
      "---\nid: spec:probe.dot-regular\nkind: rule\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Dot regular\n\n## Intent\n- outcome: Keep a dot-named carrier.\n",
    );
    symlinkSync(join(outside, "hidden.sdp.md"), join(root, ".linked.sdp.md"));
    symlinkSync(join(outside, "missing.ts"), join(root, ".dangling.ts"));
    // A dot-directory is skipped, so a dot-named directory link hides nothing, whatever its name.
    symlinkSync(outside, join(root, ".x.sdp.md"), "dir");
    symlinkSync(outside, join(root, ".cache"), "dir");
    // Outside the dot rule, a directory link warns even with a candidate name.
    symlinkSync(outside, join(root, "x.sdp.md"), "dir");

    const result = extract({ root });

    expect(result.counts).toEqual({ specs: 1, packs: 0, anchors: 0 });
    expect(result.report.findings).toEqual(
      [".dangling.ts", ".linked.sdp.md", "x.sdp.md"].map((file) => ({
        validatorId: "extract/symbolic-link-skipped",
        family: "conformance",
        severity: "warning",
        file,
        message: `symbolic link "${file}" is skipped; discovery never follows links below the root`,
      })),
    );
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
    writeFileSync(join(root, "behavior.sdp.gherkin"), "", "utf8");
    writeFileSync(join(root, "markdown.sdp.md"), "", "utf8");
    writeFileSync(join(root, "typescript.sdp.ts"), "", "utf8");

    expect(discoverFiles(root).specFiles.map((file) => file.relativePath)).toEqual([
      "behavior.sdp.gherkin",
      "markdown.sdp.md",
      "typescript.sdp.ts",
    ]);
  });
});
