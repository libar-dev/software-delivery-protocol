import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { runSdpCli, SDP_HELP_TEXT } from "../src/cli/sdp.js";
import { runStudio } from "../src/cli/studio-command.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "../src/projections/studio/pages/index.js";
import { createReader } from "../src/reader/reader.js";
import { extract } from "../src/extract/index.js";
import type { Finding } from "../src/validate/contracts.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const anchor = specTest({
  id: testAnchorId("test:protocol.studio-publisher"),
  verifies: ref("spec:consumers.spec-studio.publisher"),
});
void anchor;

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function corpus(mode: "valid" | "validation" | "extraction" = "valid") {
  const root = mkdtempSync(join(tmpdir(), "sdp-studio-"));
  roots.push(root);
  writeFileSync(
    join(root, "member.sdp.md"),
    mode === "extraction"
      ? "---\nid: broken\n---\n# Broken\n"
      : `---\nid: spec:probe.member\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${mode === "validation" ? "\n  dependsOn: spec:probe.missing" : "{}"}\n---\n# Member <title>\n\n## Intent\n- outcome: Read the member.\n`,
  );
  writeFileSync(
    join(root, "probe.pack.sdp.md"),
    "---\nid: pack:probe\nspecs:\n  - spec:probe.member\n---\n# Probe\n",
  );
  writeFileSync(join(root, "source.ts"), "export const untouched = 1;\n");
  const assets = { script: join(root, "fixture.js"), stylesheet: join(root, "fixture.css") };
  writeFileSync(assets.script, "/* browser fixture */\n");
  writeFileSync(assets.stylesheet, "/* stylesheet fixture */\n");
  return {
    root,
    assets,
    parsed: { root, exclude: [], checkClean: false },
    capture: createCaptureOutput(),
    studio: join(root, "generated/spec-studio"),
  };
}

function required<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Expected a value");
  return value;
}

function files(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const visit = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      const key = `${prefix}${entry.name}`;
      if (entry.isDirectory()) visit(path, `${key}/`);
      else result[key] = readFileSync(path).toString("base64");
    }
  };
  visit(root, "");
  return result;
}

function seed(path: string) {
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, "stale.html"), "old");
}

describe("Studio publication", () => {
  it("publishes the layout, copies fixture assets and replaces stale pages and temporary siblings", async () => {
    const c = corpus();
    seed(c.studio);
    seed(`${c.studio}.tmp`);
    const before = ["member.sdp.md", "probe.pack.sdp.md", "source.ts"].map((file) =>
      readFileSync(join(c.root, file)),
    );
    expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(0);
    expect(Object.keys(files(c.studio)).sort()).toEqual([
      "architecture.html",
      "assets/studio.css",
      "assets/studio.js",
      "evidence.html",
      "index.html",
      "packs/probe.html",
      "search.html",
      "specs/probe.member.html",
      "tests.html",
    ]);
    expect(readFileSync(join(c.studio, "assets/studio.js"))).toEqual(readFileSync(c.assets.script));
    expect(readFileSync(join(c.studio, "assets/studio.css"))).toEqual(
      readFileSync(c.assets.stylesheet),
    );
    expect(existsSync(`${c.studio}.tmp`)).toBe(false);
    expect(
      ["member.sdp.md", "probe.pack.sdp.md", "source.ts"].map((file) =>
        readFileSync(join(c.root, file)),
      ),
    ).toEqual(before);
    expect(existsSync(join(c.studio, "stamp.json"))).toBe(false);
  });

  it("writes byte-identical pages twice and opens every placeholder link inside the page set", async () => {
    const c = corpus();
    expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(0);
    const first = files(c.studio);
    expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(0);
    expect(files(c.studio)).toEqual(first);
    for (const [path, encoded] of Object.entries(first).filter(([path]) =>
      path.endsWith(".html"),
    )) {
      const html = Buffer.from(encoded, "base64").toString("utf8");
      expect(html).not.toContain(c.root);
      expect(html).not.toContain("<title>Member <title>");
      for (const match of html.matchAll(/(?:href|src)="([^"]+)"/gu)) {
        const target = new URL(required(match[1]), `file:///studio/${path}`);
        expect(target.protocol).toBe("file:");
        expect(target.pathname).toMatch(/^\/studio\//u);
        expect(first[target.pathname.slice("/studio/".length)]).toBeDefined();
        if (target.hash !== "")
          expect(
            Buffer.from(required(first[target.pathname.slice(8)]), "base64").toString(),
          ).toContain(`id="${target.hash.slice(1)}"`);
      }
    }
    expect(Buffer.from(required(first["search.html"]), "base64").toString()).toContain(
      'id="sdp-data"',
    );
    for (const [path, content] of Object.entries(first))
      if (path.endsWith(".html") && path !== "search.html")
        expect(Buffer.from(content, "base64").toString()).not.toContain('id="sdp-data"');
  });

  it("publishes validation findings and returns nonzero without withholding the pages", async () => {
    const c = corpus("validation");
    expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(1);
    const index = readFileSync(join(c.studio, "index.html"), "utf8");
    const spec = readFileSync(join(c.studio, "specs/probe.member.html"), "utf8");
    expect(index).toContain("spec:probe.missing");
    expect(spec).toContain("spec:probe.missing");
    expect(c.capture.readStdout()).toContain("validate: 1 errors");
  });

  it("shows a finding with an anchor subject or no subject only on the index", async () => {
    const c = corpus();
    const reader = createReader(extract({ root: c.root }).graph);
    const finding: Finding = {
      validatorId: "probe",
      family: "conformance",
      severity: "warning",
      message: "Anchor finding",
      subjectId: "test:probe",
    };
    const data = {
      ...(await createStudioData(reader)),
      findings: [finding, { ...finding, subjectId: undefined, message: "No subject finding" }],
    };
    const pages = renderStudio(data);
    expect(pages.find((page) => page.path === "index.html")?.content).toContain("Anchor finding");
    expect(pages.find((page) => page.path === "index.html")?.content).toContain(
      "No subject finding",
    );
    for (const page of pages.filter((page) => page.path !== "index.html"))
      expect(page.content).not.toMatch(/Anchor finding|No subject finding/u);
  });

  it("leaves no root or temporary after an extraction failure", async () => {
    const c = corpus("extraction");
    seed(c.studio);
    seed(`${c.studio}.tmp`);
    expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(1);
    expect(existsSync(c.studio)).toBe(false);
    expect(existsSync(`${c.studio}.tmp`)).toBe(false);
  });

  it.each(["build", "validate", "view", "census", "mermaid", "gherkin"])(
    "%s invalidates the Studio and its temporary sibling",
    async (command) => {
      const c = corpus();
      seed(c.studio);
      seed(`${c.studio}.tmp`);
      expect(await runSdpCli([command, c.root], c.capture.output)).toBe(0);
      expect(existsSync(c.studio)).toBe(false);
      expect(existsSync(`${c.studio}.tmp`)).toBe(false);
    },
  );

  it("refuses extraction when invalidation cannot remove the Studio", async () => {
    const c = corpus();
    let extracted = false;
    expect(
      await runStudio(c.parsed, c.capture.output, {
        studioAssets: c.assets,
        extract: (options) => {
          extracted = true;
          return extract(options);
        },
        rmSync: (path, options) => {
          if (String(path) === c.studio) throw new Error("cannot remove");
          rmSync(path, options);
        },
      }),
    ).toBe(1);
    expect(extracted).toBe(false);
    expect(c.capture.readStderr()).toContain("cannot remove");
  });

  it("check-clean accepts clean pages and replaces them with identical bytes", async () => {
    const c = corpus();
    expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(0);
    const before = files(c.studio);
    expect(
      await runStudio({ ...c.parsed, checkClean: true }, c.capture.output, {
        studioAssets: c.assets,
      }),
    ).toBe(0);
    expect(files(c.studio)).toEqual(before);
  });

  it.each(["missing", "drift", "stale"])(
    "check-clean refuses %s output and removes it",
    async (mode) => {
      const c = corpus();
      if (mode !== "missing")
        expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(0);
      if (mode === "drift") writeFileSync(join(c.studio, "index.html"), "changed");
      if (mode === "stale") writeFileSync(join(c.studio, "stale.html"), "old");
      expect(
        await runStudio({ ...c.parsed, checkClean: true }, c.capture.output, {
          studioAssets: c.assets,
        }),
      ).toBe(1);
      expect(existsSync(c.studio)).toBe(false);
      expect(existsSync(`${c.studio}.tmp`)).toBe(false);
    },
  );

  it("check-clean refuses independently divergent renders", async () => {
    const c = corpus();
    expect(await runStudio(c.parsed, c.capture.output, { studioAssets: c.assets })).toBe(0);
    let count = 0;
    expect(
      await runStudio({ ...c.parsed, checkClean: true }, c.capture.output, {
        studioAssets: c.assets,
        renderStudio: (data) =>
          renderStudio(data).map((page) => ({
            ...page,
            content: `${page.content}${String(count++)}`,
          })),
      }),
    ).toBe(1);
    expect(c.capture.readStderr()).toContain("independent renders diverged");
    expect(existsSync(c.studio)).toBe(false);
  });

  it("removes output when an asset cannot be read", async () => {
    const c = corpus();
    seed(c.studio);
    expect(
      await runStudio(c.parsed, c.capture.output, {
        studioAssets: { ...c.assets, script: join(c.root, "missing.js") },
      }),
    ).toBe(1);
    expect(existsSync(c.studio)).toBe(false);
    expect(existsSync(`${c.studio}.tmp`)).toBe(false);
  });

  it("refuses a renderer path that would overwrite authored source", async () => {
    const c = corpus();
    const before = readFileSync(join(c.root, "source.ts"));
    expect(
      await runStudio(c.parsed, c.capture.output, {
        studioAssets: c.assets,
        renderStudio: () => [{ path: "../../source.ts", content: "overwritten" }],
      }),
    ).toBe(1);
    expect(readFileSync(join(c.root, "source.ts"))).toEqual(before);
    expect(existsSync(c.studio)).toBe(false);
    expect(existsSync(`${c.studio}.tmp`)).toBe(false);
  });

  it("dispatches studio with shared exclusions and advertises only its ruled flags", async () => {
    const c = corpus();
    mkdirSync(join(c.root, "excluded"));
    writeFileSync(join(c.root, "excluded/bad.sdp.md"), "bad carrier");
    expect(
      await runSdpCli(["studio", c.root, "--exclude", "excluded"], c.capture.output, {
        studioAssets: c.assets,
      }),
    ).toBe(0);
    expect(SDP_HELP_TEXT).toContain("sdp studio [root] [--exclude PATH]... [--check-clean]");
    expect(SDP_HELP_TEXT).toContain("generated/spec-studio/");
    expect(await runSdpCli(["studio", c.root, "--out", "elsewhere"], c.capture.output)).toBe(1);
    expect(await runSdpCli(["studio", c.root, "--watch"], c.capture.output)).toBe(1);
  });
});
