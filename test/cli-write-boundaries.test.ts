import {
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { writeBuildInfo, writeRecipeFiles } from "../src/cli/build-artifacts.js";
import { extract } from "../src/extract/index.js";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

function writeCarrier(root: string, file: string, id: string): void {
  writeFileSync(
    join(root, file),
    `---\nid: ${id}\nkind: rule\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Probe\n\n## Intent\n\n- outcome: Exercise publication.\n\n## Rule\n`,
  );
}

describe("build write boundaries", () => {
  it.each(
    ["graph.json", "imports.json", "registrars.json"].flatMap((name) =>
      ["symbolic", "hard"].map((kind) => ({ name, kind })),
    ),
  )("replaces a stale $kind link at $name without touching its target", ({ name, kind }) => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-stage-link-"));
    const root = join(workspace, "corpus");
    const sentinel = join(workspace, "sentinel");
    const temporary = join(root, "generated", `${name}.tmp`);
    mkdirSync(join(root, "generated"), { recursive: true });
    writeFileSync(sentinel, "unrelated bytes\n");
    writeFileSync(join(root, "source.ts"), "export const value = 1;\n");
    writeFileSync(join(root, "tsconfig.json"), '{"files":["source.ts"]}');
    writeFileSync(
      join(root, "imports-config.json"),
      JSON.stringify({ adapter: "typescript", tsconfig: "tsconfig.json", roots: ["."] }),
    );
    if (kind === "symbolic") symlinkSync(sentinel, temporary);
    else linkSync(sentinel, temporary);
    try {
      const capture = createCaptureOutput();
      expect(
        runSdpCli(["build", root, "--imports", join(root, "imports-config.json")], capture.output),
        capture.readStderr(),
      ).toBe(0);
      expect(readFileSync(sentinel, "utf8")).toBe("unrelated bytes\n");
      const published = join(root, "generated", name);
      expect(lstatSync(published).isSymbolicLink()).toBe(false);
      expect(lstatSync(published).nlink).toBe(1);
      expect(existsSync(temporary)).toBe(false);
      expect(() => JSON.parse(readFileSync(published, "utf8")) as unknown).not.toThrow();
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  // BuildHooks: the filesystem hooks stand in for every guarded mutation, not recovery alone.
  it("routes a successful build's ordinary removals and writes through the filesystem hooks", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-build-hooks-"));
    const removed: string[] = [];
    const written: string[] = [];
    writeCarrier(root, "probe.sdp.md", "spec:probe.hooks");
    try {
      const capture = createCaptureOutput();
      expect(
        runSdpCli(["build", root], capture.output, {
          rmSync: (path, options) => {
            removed.push(String(path));
            rmSync(path, options);
          },
          writeFileSync: (path, data, options) => {
            written.push(String(path));
            writeFileSync(path, data, options);
          },
        }),
        capture.readStderr(),
      ).toBe(0);
      expect(removed.some((path) => path.endsWith(join("generated", "design-review.tmp")))).toBe(
        true,
      );
      expect(written.some((path) => path.endsWith(join("generated", "graph.json.tmp")))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("names an unresolvable output parent when generated is a dangling link", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-dangling-output-"));
    const parent = join(root, "generated");
    symlinkSync(join(root, "missing"), parent, "dir");
    try {
      const capture = createCaptureOutput();
      expect(runSdpCli(["build", root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain(`unsafe output parent "${parent}"`);
      expect(capture.readStderr()).toContain("cannot be resolved");
      expect(lstatSync(parent).isSymbolicLink()).toBe(true);
      expect(existsSync(join(root, "missing"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses a staging link planted after stale removal", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-stage-race-"));
    const root = join(workspace, "corpus");
    const sentinel = join(workspace, "sentinel");
    mkdirSync(root);
    writeFileSync(sentinel, "unrelated bytes\n");
    try {
      const capture = createCaptureOutput();
      expect(
        runSdpCli(["build", root], capture.output, {
          writeFileSync: (path, data, options) => {
            if (String(path).endsWith("graph.json.tmp")) symlinkSync(sentinel, String(path));
            writeFileSync(path, data, options);
          },
        }),
      ).toBe(1);
      expect(readFileSync(sentinel, "utf8")).toBe("unrelated bytes\n");
      expect(capture.readStderr()).toContain("EEXIST");
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(false);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it.each([
    "build",
    "view",
    "census",
    "mermaid",
    "gherkin",
    "studio",
    "generate",
    "vault",
    "stamp",
  ])("%s refuses an escaping generated parent before writing or cleanup", async (command) => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-output-parent-"));
    const root = join(workspace, "corpus");
    const outside = join(workspace, "outside");
    mkdirSync(root);
    mkdirSync(join(outside, "design-review"), { recursive: true });
    writeFileSync(join(outside, "graph.json"), "unrelated graph\n");
    writeFileSync(join(outside, "design-review", "index.md"), "unrelated page\n");
    const sentinels = [
      "design-review",
      "census",
      "mermaid",
      "gherkin",
      "spec-studio",
      "obsidian-vault/sdp",
    ].flatMap((name) => [name, `${name}.tmp`]);
    for (const name of sentinels) {
      mkdirSync(join(outside, name), { recursive: true });
      writeFileSync(join(outside, name, "sentinel"), "keep");
    }
    writeFileSync(join(outside, "spec-studio/index.html"), "old page");
    symlinkSync(outside, join(root, "generated"), "dir");
    try {
      const capture = createCaptureOutput();
      expect(await runSdpCli([command, root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("escapes the extraction root");
      expect(readFileSync(join(outside, "graph.json"), "utf8")).toBe("unrelated graph\n");
      expect(readFileSync(join(outside, "design-review", "index.md"), "utf8")).toBe(
        "unrelated page\n",
      );
      for (const name of sentinels)
        expect(readFileSync(join(outside, name, "sentinel"), "utf8")).toBe("keep");
      expect(existsSync(join(outside, "registrars.json"))).toBe(false);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });
});

describe("explicit symlinked watch root", () => {
  it("keeps the named root in ordinary command output", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-named-root-"));
    const root = join(workspace, "corpus");
    const alias = join(workspace, "alias");
    mkdirSync(root);
    symlinkSync(root, alias, "dir");
    try {
      const capture = createCaptureOutput();
      expect(runSdpCli(["build", alias], capture.output)).toBe(0);
      expect(capture.readStdout()).toContain(join(alias, "generated", "graph.json"));
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it.each(["validate", "studio", "vault"])(
    "%s starts and reruns through the named root",
    async (command) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-root-link-"));
      const root = join(workspace, "corpus");
      const alias = join(workspace, "alias");
      mkdirSync(root);
      symlinkSync(root, alias, "dir");
      symlinkSync(root, join(root, "loop"), "dir");
      writeCarrier(root, "probe.sdp.md", "spec:probe.watch");
      const subscriptions = new Map<string, (event: string, filename: string) => void>();
      const abort = new AbortController();
      const capture = createCaptureOutput();
      let cycles = 0;
      const timer = setTimeout(() => {
        abort.abort();
      }, 2_000);
      try {
        const exitCode = await runSdpCli(
          [
            command,
            alias,
            "--watch",
            ...(command === "vault" ? ["--out", join(root, ".vault")] : []),
          ],
          capture.output,
          {
            abortSignal: abort.signal,
            studioAssets: {
              script: join(process.cwd(), "dist/studio/studio.js"),
              stylesheet: join(process.cwd(), "dist/studio/studio.css"),
            },
            createNativeWatch: (directory, listener) => {
              subscriptions.set(directory, listener);
              return { on: () => undefined, close: () => undefined };
            },
            onWatchCycleComplete: (cycle) => {
              expect(cycle.exitCode, capture.readStderr()).toBe(0);
              cycles += 1;
              if (cycles === 1) {
                writeCarrier(root, "next.sdp.md", "spec:probe.next");
                subscriptions.get(alias)?.("rename", "next.sdp.md");
              } else abort.abort();
            },
          },
        );
        expect(exitCode, capture.readStderr()).toBe(0);
        expect(cycles).toBe(2);
        expect([...subscriptions.keys()]).toEqual([alias]);
        expect(capture.readStderr()).not.toContain("watch failed");
        expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toContain(
          "spec:probe.next",
        );
      } finally {
        clearTimeout(timer);
        abort.abort();
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );
});

describe("portable projection publication", () => {
  it.each([
    ["view", "design-review"],
    ["mermaid", "mermaid"],
    ["gherkin", "gherkin"],
  ])("%s refuses case-colliding pages and removes stale output", (command, directory) => {
    const root = mkdtempSync(join(tmpdir(), "sdp-page-collision-"));
    const view = join(root, "generated", directory);
    mkdirSync(view, { recursive: true });
    writeFileSync(join(view, "stale.md"), "stale\n");
    writeCarrier(root, "first.sdp.md", "spec:probe.Twin");
    writeCarrier(root, "second.sdp.md", "spec:probe.twin");
    try {
      const capture = createCaptureOutput();
      expect(runSdpCli([command, root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("case-insensitive publication path collision");
      expect(capture.readStderr()).toContain("spec:probe.Twin");
      expect(capture.readStderr()).toContain("spec:probe.twin");
      expect(existsSync(view)).toBe(false);
      expect(existsSync(`${view}.tmp`)).toBe(false);
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

/**
 * @sdpAnchor test:protocol.cli-write-boundaries
 * @sdpVerifies spec:extraction.build-pipeline, spec:consumers.wholesale-view-rewrite, spec:consumers.design-review, spec:consumers.mermaid-view, spec:consumers.gherkin-view, spec:consumers.projections-model
 */
describe("publication boundary regressions", () => {
  it.each(["symbolic", "hard"])(
    "stamp replaces a %s link without modifying its target",
    async (kind) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-stamp-boundary-"));
      const root = join(workspace, "root"),
        studio = join(root, "generated/spec-studio"),
        sentinel = join(workspace, "sentinel");
      mkdirSync(studio, { recursive: true });
      writeFileSync(join(studio, "index.html"), "page");
      writeFileSync(sentinel, "keep");
      for (const name of ["stamp.json", "stamp.json.tmp"])
        (kind === "hard" ? linkSync : symlinkSync)(sentinel, join(studio, name));
      try {
        expect(await runSdpCli(["stamp", root], createCaptureOutput().output)).toBe(0);
        expect(readFileSync(sentinel, "utf8")).toBe("keep");
        expect(lstatSync(join(studio, "stamp.json")).nlink).toBe(1);
      } finally {
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  // spec:consumers.spec-studio.sharing#rule.stampVerb
  it("a stamp that fails after staging leaves no staging file in the page set", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-stamp-failed-"));
    const studio = join(root, "generated/spec-studio");
    // A directory at stamp.json makes the final rename fail after the stamp was staged.
    mkdirSync(join(studio, "stamp.json"), { recursive: true });
    writeFileSync(join(studio, "index.html"), "page");
    try {
      const capture = createCaptureOutput();
      expect(await runSdpCli(["stamp", root, "--commit", "abc"], capture.output)).toBe(1);
      expect(capture.readStderr()).toMatch(/^sdp stamp: /u);
      expect(existsSync(join(studio, "stamp.json.tmp"))).toBe(false);
      expect(readFileSync(join(studio, "index.html"), "utf8")).toBe("page");
      expect(lstatSync(join(studio, "stamp.json")).isDirectory()).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(["view", "census", "mermaid", "gherkin", "studio", "vault", "generate"])(
    "%s recovery preserves outside output after a parent swap",
    async (command) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-recovery-boundary-"));
      const root = join(workspace, "root"),
        outside = join(workspace, "outside");
      mkdirSync(join(root, "generated"), { recursive: true });
      mkdirSync(outside);
      const names = [
        "design-review",
        "census",
        "mermaid",
        "gherkin",
        "spec-studio",
        "contracts.tmp",
        ".projection-suite.tmp",
      ];
      for (const name of names.flatMap((name) => [name, `${name}.tmp`])) {
        mkdirSync(join(outside, name));
        writeFileSync(join(outside, name, "sentinel"), "keep");
      }
      let swapped = false;
      try {
        expect(
          await runSdpCli([command, root], createCaptureOutput().output, {
            extract: (options) => {
              if (!swapped) {
                renameSync(join(root, "generated"), join(root, "saved"));
                symlinkSync(outside, join(root, "generated"));
                swapped = true;
              }
              return extract(options);
            },
          }),
        ).toBe(1);
        expect(swapped).toBe(true);
        for (const name of names.flatMap((name) => [name, `${name}.tmp`]))
          expect(readFileSync(join(outside, name, "sentinel"), "utf8")).toBe("keep");
        expect(existsSync(join(outside, "obsidian-vault"))).toBe(false);
      } finally {
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  it.each(["inside-link", "replaced-directory"])(
    "build refuses %s generated identity",
    async (kind) => {
      const root = mkdtempSync(join(tmpdir(), "sdp-generated-identity-"));
      mkdirSync(join(root, "generated"));
      let swapped = false;
      try {
        const capture = createCaptureOutput();
        expect(
          await runSdpCli(["build", root], capture.output, {
            writeFileSync: (path, data, options) => {
              writeFileSync(path, data, options);
              if (!swapped) {
                renameSync(join(root, "generated"), join(root, "saved"));
                if (kind === "inside-link")
                  symlinkSync(join(root, "saved"), join(root, "generated"));
                else mkdirSync(join(root, "generated"));
                writeFileSync(join(root, "generated", "sentinel"), "keep");
                swapped = true;
              }
            },
          }),
        ).toBe(1);
        expect(capture.readStderr()).toContain("unsafe output parent");
        expect(readFileSync(join(root, "generated/sentinel"), "utf8")).toBe("keep");
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

  // spec:consumers.obsidian-vault#rule.defaultInsideRoot
  it.each(["vault", "generate"])(
    "%s refuses a default vault linked outside the root but allows an explicit outside vault",
    async (command) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-default-vault-"));
      const root = join(workspace, "root"),
        outside = join(workspace, "outside");
      mkdirSync(join(root, "generated"), { recursive: true });
      mkdirSync(outside);
      symlinkSync(outside, join(root, "generated/obsidian-vault"));
      try {
        const refused = createCaptureOutput();
        expect(await runSdpCli([command, root], refused.output)).toBe(1);
        expect(refused.readStderr()).toMatch(
          /sdp vault: the default vault \S*generated\/obsidian-vault does not resolve inside the root; choose a vault directory explicitly to place it elsewhere/u,
        );
        expect(existsSync(join(outside, "sdp"))).toBe(false);
        const capture = createCaptureOutput();
        expect(
          await runSdpCli(
            [command, root, command === "vault" ? "--out" : "--vault", outside],
            capture.output,
            {
              studioAssets: {
                script: join(process.cwd(), "dist/studio/studio.js"),
                stylesheet: join(process.cwd(), "dist/studio/studio.css"),
              },
            },
          ),
          capture.readStderr(),
        ).toBe(0);
        expect(existsSync(join(outside, "sdp/index.md"))).toBe(true);
      } finally {
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  // spec:consumers.obsidian-vault#rule.defaultInsideRoot
  it.each(["vault", "generate"])(
    "%s holds a default vault linked inside the root to the placement rules where it resolves",
    async (command) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-default-vault-inside-"));
      const root = join(workspace, "root");
      const assets = {
        studioAssets: {
          script: join(process.cwd(), "dist/studio/studio.js"),
          stylesheet: join(process.cwd(), "dist/studio/studio.css"),
        },
      };
      mkdirSync(join(root, "generated"), { recursive: true });
      mkdirSync(join(root, "vaults/main"), { recursive: true });
      writeCarrier(root, "probe.sdp.md", "spec:probe.vault");
      symlinkSync(join(root, "vaults/main"), join(root, "generated/obsidian-vault"));
      try {
        // Under an excluded prefix, the target is a lawful vault directory.
        const accepted = createCaptureOutput();
        expect(
          await runSdpCli([command, root, "--exclude", "vaults"], accepted.output, assets),
          accepted.readStderr(),
        ).toBe(0);
        expect(existsSync(join(root, "vaults/main/sdp/index.md"))).toBe(true);

        // Read as source, the same target is refused as any vault directory there would be.
        rmSync(join(root, "vaults/main/sdp"), { recursive: true });
        const refused = createCaptureOutput();
        expect(await runSdpCli([command, root], refused.output, assets)).toBe(1);
        expect(refused.readStderr()).toContain("lies inside the root and would be read as source");
        expect(existsSync(join(root, "vaults/main/sdp"))).toBe(false);

        // A link that resolves nowhere is refused before anything is created through it.
        rmSync(join(root, "generated/obsidian-vault"));
        symlinkSync(join(workspace, "missing"), join(root, "generated/obsidian-vault"));
        const dangling = createCaptureOutput();
        expect(await runSdpCli([command, root], dangling.output, assets)).toBe(1);
        expect(dangling.readStderr()).toContain("does not resolve inside the root");
        expect(existsSync(join(workspace, "missing"))).toBe(false);
      } finally {
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  it.each([false, true])(
    "projection suite refuses a linked generated parent (check-clean: %s)",
    (checkClean) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-suite-boundary-"));
      const root = join(workspace, "root"),
        outside = join(workspace, "outside");
      mkdirSync(root);
      mkdirSync(outside);
      const names = [
        "design-review",
        "census",
        "mermaid",
        "gherkin",
        "spec-studio",
        ".projection-suite.tmp",
      ].flatMap((name) => [name, `${name}.tmp`]);
      for (const name of names) {
        mkdirSync(join(outside, name));
        writeFileSync(join(outside, name, "sentinel"), "keep");
      }
      symlinkSync(outside, join(root, "generated"));
      try {
        const result = spawnSync(
          process.execPath,
          ["projection-suite.mjs", root, ...(checkClean ? ["--check-clean"] : [])],
          { encoding: "utf8" },
        );
        expect(result.status).toBe(1);
        for (const name of names)
          expect(readFileSync(join(outside, name, "sentinel"), "utf8")).toBe("keep");
      } finally {
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  it("package artifacts unlink stale staging links and refuse linked recipe directories", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-package-boundary-"));
    const dist = join(workspace, "dist"),
      outside = join(workspace, "outside");
    mkdirSync(join(dist, "cli"), { recursive: true });
    mkdirSync(outside);
    const sentinel = join(outside, "01-old.js");
    writeFileSync(sentinel, "keep");
    symlinkSync(sentinel, join(dist, "cli", `build-info.json.${String(process.pid)}.tmp`));
    try {
      writeBuildInfo(dist, "unknown");
      expect(readFileSync(sentinel, "utf8")).toBe("keep");
      symlinkSync(outside, join(dist, "recipes"));
      expect(() => {
        writeRecipeFiles(dist, []);
      }).toThrow(/real directory/u);
      expect(readFileSync(sentinel, "utf8")).toBe("keep");
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });
});

it("package artifacts refuse a linked recipe directory before stale cleanup", () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-recipes-boundary-"));
  const dist = join(root, "dist"),
    outside = join(root, "outside");
  mkdirSync(dist);
  mkdirSync(outside);
  writeFileSync(join(outside, "01-old.js"), "keep");
  symlinkSync(outside, join(dist, "recipes"));
  try {
    expect(() => {
      writeRecipeFiles(dist, []);
    }).toThrow(/real directory/u);
    expect(readFileSync(join(outside, "01-old.js"), "utf8")).toBe("keep");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it.each(["direct-empty", "direct-managed", "checkout-empty", "checkout-managed", "studio-direct"])(
  "watch leaves outside bytes unchanged after %s parent swap",
  async (variant) => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-vault-watch-swap-"));
    const root = join(workspace, "root"),
      outside = join(workspace, "outside");
    mkdirSync(root);
    mkdirSync(outside);
    writeCarrier(root, "probe.sdp.md", "spec:probe.watch");
    const git = (...args: string[]) => {
      const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
      if (result.status !== 0) throw new Error(result.stderr);
    };
    if (variant.startsWith("checkout")) {
      git("init", "-b", "initial");
      git("config", "user.email", "test@example.test");
      git("config", "user.name", "Test");
      writeFileSync(join(root, ".gitignore"), "generated/\n");
      git("add", "probe.sdp.md", ".gitignore");
      git("commit", "-m", "initial");
      git("checkout", "-b", "linked");
      symlinkSync(outside, join(root, "generated"));
      git("add", "-f", "generated");
      git("commit", "-m", "link");
      git("checkout", "initial");
    }
    if (variant.endsWith("managed")) {
      expect(
        await runSdpCli(
          ["vault", root, "--out", join(outside, "obsidian-vault")],
          createCaptureOutput().output,
        ),
      ).toBe(0);
    }
    if (variant === "studio-direct") {
      mkdirSync(join(outside, "spec-studio"));
      mkdirSync(join(outside, "spec-studio.tmp"));
      writeFileSync(join(outside, "spec-studio/index.html"), "keep");
      writeFileSync(join(outside, "spec-studio.tmp/sentinel"), "keep");
    }
    const index = join(
      outside,
      variant === "studio-direct" ? "spec-studio/index.html" : "obsidian-vault/sdp/index.md",
    );
    const prior = existsSync(index) ? readFileSync(index, "utf8") : undefined;
    const manifest = join(outside, "obsidian-vault/sdp/.sdp-vault.json");
    const priorManifest = existsSync(manifest) ? readFileSync(manifest, "utf8") : undefined;
    const subscriptions = new Map<string, (event: string, file: string) => void>();
    const abort = new AbortController();
    const capture = createCaptureOutput();
    let cycles = 0;
    const timer = setTimeout(() => {
      abort.abort();
    }, 10000);
    try {
      await runSdpCli(
        [variant === "studio-direct" ? "studio" : "vault", root, "--watch"],
        capture.output,
        {
          studioAssets: {
            script: join(process.cwd(), "dist/studio/studio.js"),
            stylesheet: join(process.cwd(), "dist/studio/studio.css"),
          },
          abortSignal: abort.signal,
          createNativeWatch: (dir, listener) => {
            subscriptions.set(dir, listener);
            return { on: () => undefined, close: () => undefined };
          },
          onWatchCycleComplete: (cycle) => {
            cycles++;
            if (cycles === 1) {
              expect(cycle.exitCode, capture.readStderr()).toBe(0);
              if (variant.startsWith("checkout")) git("checkout", "linked");
              else {
                renameSync(join(root, "generated"), join(root, "saved"));
                symlinkSync(outside, join(root, "generated"));
              }
              subscriptions.get(root)?.("change", "probe.sdp.md");
            } else {
              expect(cycle.exitCode).toBe(1);
              abort.abort();
            }
          },
        },
      );
      expect(cycles).toBe(2);
      if (variant === "studio-direct")
        expect(readFileSync(join(outside, "spec-studio.tmp/sentinel"), "utf8")).toBe("keep");
      expect(existsSync(index) ? readFileSync(index, "utf8") : undefined).toBe(prior);
      expect(existsSync(manifest) ? readFileSync(manifest, "utf8") : undefined).toBe(priorManifest);
    } finally {
      clearTimeout(timer);
      abort.abort();
      rmSync(workspace, { recursive: true, force: true });
    }
  },
);

// spec:consumers.wholesale-view-rewrite#rule.osMetadata: Finder's `.DS_Store` is never a page.
describe("operating-system metadata under a published root", () => {
  const studioAssets = {
    studioAssets: {
      script: join(process.cwd(), "dist/studio/studio.js"),
      stylesheet: join(process.cwd(), "dist/studio/studio.css"),
    },
  };
  const roots: Record<string, readonly string[]> = {
    census: ["census"],
    mermaid: ["mermaid"],
    gherkin: ["gherkin"],
    studio: ["spec-studio"],
    generate: ["census", "mermaid", "gherkin", "spec-studio"],
  };

  /**
   * Plants operating-system files in every folder of a published root, as Finder does in each one
   * shown: its `.DS_Store`, an AppleDouble `._` file and Windows's `Thumbs.db`.
   */
  function plantEverywhere(directory: string): number {
    for (const name of [".DS_Store", "._index.md", "Thumbs.db"])
      writeFileSync(join(directory, name), "operating-system metadata\n");
    let planted = 1;
    for (const entry of readdirSync(directory, { withFileTypes: true }))
      if (entry.isDirectory()) planted += plantEverywhere(join(directory, entry.name));
    return planted;
  }

  it.each([false, true])(
    "the projection suite certifies roots holding OS files (stray page: %s)",
    (stray) => {
      const root = mkdtempSync(join(tmpdir(), "sdp-os-metadata-suite-"));
      writeCarrier(root, "probe.sdp.md", "spec:probe.metadata");
      const suite = (...flags: string[]) =>
        spawnSync(process.execPath, ["projection-suite.mjs", root, ...flags], {
          encoding: "utf8",
        });
      try {
        expect(suite().status).toBe(0);
        for (const name of ["design-review", "census", "mermaid", "gherkin", "spec-studio"])
          plantEverywhere(join(root, "generated", name));
        if (stray) writeFileSync(join(root, "generated/census/stray.md"), "no run wrote this\n");
        const certified = suite("--check-clean");
        expect(certified.status, certified.stderr).toBe(stray ? 1 : 0);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
    120_000,
  );

  it.each(Object.keys(roots))(
    "sdp %s --check-clean certifies a root holding .DS_Store and still refuses a stray page",
    async (command) => {
      const root = mkdtempSync(join(tmpdir(), "sdp-os-metadata-"));
      writeCarrier(root, "probe.sdp.md", "spec:probe.metadata");
      try {
        const published = createCaptureOutput();
        expect(await runSdpCli([command, root], published.output, studioAssets)).toBe(0);
        const folders = (roots[command] ?? []).map((name) => join(root, "generated", name));
        expect(folders.map((folder) => plantEverywhere(folder) > 0)).toEqual(
          folders.map(() => true),
        );

        const certified = createCaptureOutput();
        expect(
          await runSdpCli([command, root, "--check-clean"], certified.output, studioAssets),
          certified.readStderr(),
        ).toBe(0);
        for (const folder of folders) expect(existsSync(folder)).toBe(true);

        const stray = join(folders[0] ?? root, "stray.md");
        writeFileSync(stray, "a page no run wrote\n");
        const refused = createCaptureOutput();
        expect(
          await runSdpCli([command, root, "--check-clean"], refused.output, studioAssets),
        ).toBe(1);
        expect(existsSync(stray)).toBe(false);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
    60_000,
  );

  it("reads a directory named .DS_Store as content, never as metadata", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-os-metadata-dir-"));
    writeCarrier(root, "probe.sdp.md", "spec:probe.metadata");
    try {
      expect(await runSdpCli(["census", root], createCaptureOutput().output)).toBe(0);
      mkdirSync(join(root, "generated/census/.DS_Store"));
      writeFileSync(join(root, "generated/census/.DS_Store/page.md"), "not metadata\n");
      expect(await runSdpCli(["census", root, "--check-clean"], createCaptureOutput().output)).toBe(
        1,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("removes every published tree with bounded retries", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-os-metadata-retries-"));
    const recursive: { path: string; maxRetries: unknown }[] = [];
    writeCarrier(root, "probe.sdp.md", "spec:probe.metadata");
    try {
      expect(
        await runSdpCli(["generate", root], createCaptureOutput().output, {
          ...studioAssets,
          rmSync: (path, options) => {
            if (options?.recursive === true)
              recursive.push({ path: String(path), maxRetries: options.maxRetries });
            rmSync(path, options);
          },
        }),
      ).toBe(0);
      expect(recursive.length).toBeGreaterThan(0);
      expect(recursive.filter((call) => call.maxRetries === undefined)).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
