import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

it("writes a fresh vault from the CLI", async () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-vault-"));
  try {
    writeFileSync(
      join(root, "member.sdp.md"),
      "---\nid: spec:probe.member\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Member\n\n## Intent\n- outcome: Read the graph.\n",
    );
    const capture = createCaptureOutput();
    expect(await runSdpCli(["vault", root], capture.output)).toBe(0);
    expect(
      readFileSync(
        join(root, "generated/obsidian-vault/sdp/specs/probe/spec.probe.member.md"),
        "utf8",
      ),
    ).toContain("# Member");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

import { mkdirSync, renameSync, symlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { buildOwnedPaths } from "../src/cli/vault-command.js";
import {
  inspectVault,
  LIST,
  parseList,
  serializeList,
  synchronizeVault,
  temporary,
  VaultGuardError,
} from "../src/projections/vault/sync.js";
import { createText, escapeText } from "../src/projections/vault/text.js";
import { renderVault } from "../src/projections/vault/notes.js";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { bytes, carrier, checkLinks, probe, put } from "./helpers/vault-probe.js";
function scratch(run: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), "sdp-vault-unit-"));
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
it.each([...buildOwnedPaths, "generated", "."])(
  "refuses vault placement %s before the build changes anything",
  async (path) => {
    const root = mkdtempSync(join(tmpdir(), "sdp-vault-place-"));
    try {
      probe(root);
      put(join(root, "generated/design-review/stale"), "keep");
      const before = bytes(root),
        capture = createCaptureOutput();
      expect(await runSdpCli(["vault", root, "--out", join(root, path)], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("overlaps generated/");
      expect(bytes(root)).toEqual(before);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
);
it.each(["notes", "src/vault"])("refuses discoverable %s before the build", async (path) => {
  const root = mkdtempSync(join(tmpdir(), "sdp-vault-place-"));
  try {
    probe(root);
    put(join(root, "generated/graph.json"), "keep");
    const c = createCaptureOutput();
    expect(await runSdpCli(["vault", root, "--out", join(root, path)], c.output)).toBe(1);
    expect(c.readStderr()).toContain("would be read as source");
    expect(readFileSync(join(root, "generated/graph.json"), "utf8")).toBe("keep");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
it("accepts an explicitly excluded vault and a vault outside the extraction root", async () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-vault-place-")),
    out = mkdtempSync(join(tmpdir(), "sdp-vault-out-"));
  try {
    probe(root);
    for (const args of [
      ["--out", join(root, "notes"), "--exclude", "notes"],
      ["--out", out],
    ])
      expect(await runSdpCli(["vault", root, ...args], createCaptureOutput().output)).toBe(0);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(out, { recursive: true, force: true });
  }
});
it.each([
  ["--root"],
  ["--out"],
  ["--root", "--watch"],
  ["--out", "--watch"],
  ["--root", ".", "--root", "."],
  ["--out", "x", "--out", "x"],
  [".", "--root", "."],
  ["--root", ".", "."],
  ["--check-clean"],
  ["--vault", "x"],
  ["--wat"],
])("refuses invalid vault options %j", async (...args) => {
  expect(await runSdpCli(["vault", ...args], createCaptureOutput().output)).toBe(1);
});
it("rejects malformed lists, including duplicate and reordered paths", () => {
  const sha = "a".repeat(64),
    valid = serializeList({ "a.md": [sha], "b.md": [sha] });
  expect(parseList(valid)).toBeDefined();
  const bad = [
    valid.replace('"b.md"', '"a.md"'),
    valid.replace('"a.md"', '"z.md"'),
    valid.replace('"a.md"', '"../a.md"'),
    valid.replace(sha, "A".repeat(64)),
    valid.trimEnd(),
    valid.replace('"a.md"', '"/a.md"'),
    serializeList({ [LIST]: [sha] }),
    serializeList({ ".a.sdp-tmp": [sha] }),
    serializeList({ "a//b": [sha] }),
    valid.replace('"schema":', '"extra": 1, "schema":'),
  ];
  for (const value of bad) expect(parseList(value), value).toBeUndefined();
  scratch((root) => {
    put(join(root, "sdp", LIST), bad[0] ?? "");
    const before = bytes(root);
    expect(() => inspectVault(root)).toThrow(VaultGuardError);
    expect(bytes(root)).toEqual(before);
  });
});
it("guards hidden unknowns, changed notes, links and special files without cleanup", () => {
  scratch((root) => {
    synchronizeVault(root, [{ path: "specs/a.md", content: "a" }]);
    const folder = join(root, "sdp");
    put(join(folder, ".DS_Store"), "unknown");
    put(join(folder, "specs/.a.md.sdp-tmp"), "partial");
    symlinkSync(join(folder, "specs/a.md"), join(folder, "link"));
    execFileSync("mkfifo", [join(folder, "pipe")]);
    put(join(folder, "specs/a.md"), "changed");
    const before = bytes(join(folder, "specs"));
    try {
      inspectVault(root);
      expect.fail("guard must refuse");
    } catch (error) {
      expect(error).toBeInstanceOf(VaultGuardError);
      const e = error as VaultGuardError;
      expect(e.refusals.map((r) => [r.path, r.reason])).toEqual(
        expect.arrayContaining([
          ["sdp/.DS_Store", "unknown"],
          ["sdp/specs/.a.md.sdp-tmp", "unknown"],
          ["sdp/specs/a.md", "changed"],
          ["sdp/link", "not a file"],
          ["sdp/pipe", "not a file"],
        ]),
      );
    }
    expect(bytes(join(folder, "specs"))).toEqual(before);
  });
});
it("refuses a symlink as the generated folder", () => {
  scratch((root) => {
    mkdirSync(join(root, "other"));
    symlinkSync(join(root, "other"), join(root, "sdp"));
    expect(() => inspectVault(root)).toThrow(VaultGuardError);
  });
});
it("recognizes a complete interrupted note and refuses a truncated temporary", () => {
  scratch((root) => {
    synchronizeVault(root, [{ path: "specs/a.md", content: "old" }]);
    let renames = 0;
    expect(() =>
      synchronizeVault(
        root,
        [{ path: "specs/a.md", content: "new" }],
        inspectVault(root),
        (from, to) => {
          if (++renames === 1) throw new Error("stop");
          renameSync(from, to);
        },
      ),
    ).toThrow("stop");
    const state = inspectVault(root);
    expect(state.list.files["specs/a.md"]).toHaveLength(2);
    expect(state.temporaries).toEqual(["specs/.a.md.sdp-tmp"]);
    synchronizeVault(root, [{ path: "specs/a.md", content: "new" }], state);
    expect(inspectVault(root).list.files["specs/a.md"]).toHaveLength(1);
    put(join(root, "sdp", temporary("specs/a.md")), "ne");
    expect(() => inspectVault(root)).toThrow(VaultGuardError);
  });
});
it("escapes Obsidian constructs and preserves other code spans", () => {
  scratch((root) => {
    probe(root);
    const reader = createReader(extract({ root }).graph);
    const { text } = createText(reader);
    expect(escapeText("[[x]] ![[y]] %%hidden%% ==hi== $math$ #tag ^block")).toBe(
      "\\[[x]] !\\[[y]] \\%%hidden\\%% \\==hi\\== \\$math\\$ \\#tag \\^block",
    );
    expect(text("`[[x]] #tag $x$`")).toBe("`[[x]] #tag $x$`");
    expect(text("`spec:probe.member`")).toBe(
      "[[sdp/specs/probe/spec.probe.member.md|spec:probe.member]]",
    );
    expect(text("`two spec:probe.member`")).toBe("`two spec:probe.member`");
    expect(text("spec:probe.absent")).toBe("spec:probe.absent");
    expect(text("spec:probe.member#design.absent")).toBe("spec:probe.member#design.absent");
  });
});
it("renders unresolved relation ends and missing exercised rules as code", () => {
  scratch((root) => {
    probe(root);
    put(
      join(root, "member.sdp.md"),
      carrier(
        "spec:probe.member",
        "Member",
        "example",
        "idea",
        "",
        "{verifies: {target: spec:probe.other, exercises: [absent]}, dependsOn: spec:probe.missing}",
      ),
    );
    const files = renderVault(extract({ root }).graph);
    const note = files.find((f) => f.path === "specs/probe/spec.probe.member.md")?.content ?? "";
    expect(note).toContain("`spec:probe.missing`");
    expect(note).toContain("exercises `absent`");
    expect(note).not.toContain("#^rule-absent");
  });
});
it("puts subject findings on notes and every other finding on the index", () => {
  scratch((root) => {
    probe(root);
    const graph = extract({ root }).graph;
    const files = renderVault(graph, [
      {
        validatorId: "probe",
        family: "conformance",
        severity: "error",
        subjectId: "spec:probe.member",
        message: "Member error",
      },
      {
        validatorId: "probe",
        family: "honesty",
        severity: "warning",
        subjectId: "impl:missing",
        file: "source.ts",
        line: 2,
        message: "[[escaped]]",
      },
    ]);
    const index = files.find((f) => f.path === "index.md")?.content ?? "";
    expect(index).toContain("1 errors · 1 warnings");
    expect(index).toContain("- warning · probe · `source.ts:2` · \\[[escaped]]");
    expect(index).not.toContain("Member error");
    expect(files.find((f) => f.path === "specs/probe/spec.probe.member.md")?.content).toContain(
      "Member error",
    );
  });
});
it("keeps build outputs untouched on a case collision", async () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-vault-case-"));
  try {
    put(join(root, "one.sdp.md"), carrier("spec:probe.Member"));
    put(join(root, "two.sdp.md"), carrier("spec:probe.member"));
    put(join(root, "generated/graph.json"), "keep graph");
    put(join(root, "generated/design-review/page.md"), "keep page");
    const before = bytes(root);
    expect(await runSdpCli(["vault", root], createCaptureOutput().output)).toBe(1);
    expect(bytes(root)).toEqual(before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
it("makes generate refuse an edited vault before invalidating any root", async () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-generate-vault-"));
  try {
    probe(root);
    expect(await runSdpCli(["vault", root], createCaptureOutput().output)).toBe(0);
    put(join(root, "generated/obsidian-vault/sdp/index.md"), "My edit");
    put(join(root, "generated/design-review/stale.md"), "Keep");
    const before = bytes(root);
    expect(await runSdpCli(["generate", root], createCaptureOutput().output)).toBe(1);
    expect(bytes(root)).toEqual(before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
it("uses --vault for generate and leaves it alone in check mode", async () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-generate-vault-"));
  try {
    probe(root);
    const out = join(root, "generated/custom-vault");
    const hooks = {
      studioAssets: {
        script: resolve("dist/studio/studio.js"),
        stylesheet: resolve("dist/studio/studio.css"),
      },
    };
    expect(
      await runSdpCli(["generate", root, "--vault", out], createCaptureOutput().output, hooks),
    ).toBe(0);
    expect(checkLinks(out)).toBeGreaterThan(0);
    put(join(out, "sdp/index.md"), "My edit");
    const before = bytes(out);
    expect(
      await runSdpCli(
        ["generate", root, "--vault", out, "--check-clean"],
        createCaptureOutput().output,
        hooks,
      ),
    ).toBe(0);
    expect(bytes(out)).toEqual(before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it("preserves literal backslashes before escaped Obsidian constructs", () => {
  expect(escapeText("\\[[person]]")).toBe("\\\\\\[[person]]");
});

it("orders integer-looking file-list paths by code units", () => {
  const sha = "a".repeat(64);
  const serialized = serializeList({ "2": [sha], "10": [sha] });
  expect(serialized.indexOf('"10"')).toBeLessThan(serialized.indexOf('"2"'));
  expect(parseList(serialized)).toBeDefined();
});
