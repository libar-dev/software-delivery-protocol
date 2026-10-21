import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BuildArgs } from "../src/cli/build-args.js";
import type { GraphSchema } from "../src/index.js";
import { extract, validateGraph } from "../src/index.js";
import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";
import { verbHelpText } from "../src/cli/help.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { writeProbeCorpus } from "./helpers/probe-corpus.js";

const roots = ["design-review", "census", "mermaid", "gherkin", "spec-studio"];
const assets = {
  script: resolve("dist/studio/studio.js"),
  stylesheet: resolve("dist/studio/studio.css"),
};
const temporary: string[] = [];
afterEach(() => {
  for (const root of temporary.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "sdp-generate-"));
  temporary.push(root);
  writeProbeCorpus(root);
  return { root, capture: createCaptureOutput() };
}
describe("help before argument parsing", () => {
  it.each([
    "build",
    "validate",
    "view",
    "census",
    "mermaid",
    "gherkin",
    "studio",
    "generate",
    "import",
    "new",
    "q",
  ])("answers %s --help without reading any other argument or touching files", async (command) => {
    const { root, capture } = fixture();
    const derive = vi.fn(() => {
      throw new Error("Help must not extract.");
    });
    const read = vi.fn(() => {
      throw new Error("Help must not read.");
    });
    expect(
      await runSdpCli(
        [
          command,
          "--unknown",
          join(root, "missing"),
          "--rules",
          "--params",
          "@absent.json",
          "--help",
        ],
        capture.output,
        { extract: derive, readEngineFile: read, query: { extract: derive, readStdin: read } },
      ),
    ).toBe(0);
    expect(capture.readStderr()).toBe("");
    expect(capture.readStdout()).toBe(`${verbHelpText(command) ?? ""}\n`);
    expect(capture.readStdout().startsWith("Usage:\n")).toBe(true);
    const [usage = "", description = ""] = (verbHelpText(command) ?? "").split("\n\n");
    expect(SDP_HELP_TEXT).toContain(usage.replace("Usage:\n", ""));
    expect(SDP_HELP_TEXT).toContain(description);
    expect(derive).not.toHaveBeenCalled();
    expect(read).not.toHaveBeenCalled();
    expect(existsSync(join(root, "generated"))).toBe(false);
  });
  it("gives new and new spec the same shared help followed by the scaffold paragraph", async () => {
    const first = createCaptureOutput();
    const second = createCaptureOutput();
    expect(await runSdpCli(["new", "--help"], first.output)).toBe(0);
    expect(await runSdpCli(["new", "spec", "--help"], second.output)).toBe(0);
    expect(first.readStdout()).toBe(second.readStdout());
    expect(first.readStdout()).toContain("PATH is cwd-relative");
    expect(SDP_HELP_TEXT).toContain("docs/agent-surface/upgrade-guide.md");
  });
});
describe("one-build generation", () => {
  it("extracts once, validates once, and synchronizes the selected vault before publishing", async () => {
    const { root, capture } = fixture();
    const derive = vi.fn(extract);
    const validate = vi.fn(validateGraph);
    const synchronize = vi.fn((parsed: BuildArgs, graph: GraphSchema) => {
      expect(parsed.vault).toBe("chosen-vault");
      expect(graph.nodes.length).toBe(2);
      expect(roots.some((name) => existsSync(join(root, "generated", name)))).toBe(false);
      return 0;
    });
    expect(
      await runSdpCli(["generate", root, "--vault", "chosen-vault"], capture.output, {
        extract: derive,
        validateGraph: validate,
        synchronizeVaultBeforeGenerate: synchronize,
        studioAssets: assets,
      }),
    ).toBe(0);
    expect(derive).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledTimes(1);
    expect(synchronize).toHaveBeenCalledTimes(1);
    const publications = capture
      .readStdout()
      .split("\n")
      .filter((line) =>
        roots.some((name) => line.startsWith(`Wrote ${join(root, "generated", name)} (`)),
      );
    expect(
      publications.map((line) =>
        roots.find((name) => line.startsWith(`Wrote ${join(root, "generated", name)} (`)),
      ),
    ).toEqual(roots);
    expect(capture.readStdout().match(/^2 specs/gmu)).toHaveLength(1);
    expect(capture.readStdout().match(/^validate:/gmu)).toHaveLength(1);
  });
  it("publishes every root despite validation errors and follows validation's exit", async () => {
    const { root, capture } = fixture();
    writeProbeCorpus(root);
    writeFileSync(
      join(root, "second.sdp.md"),
      readFileSync(join(root, "second.sdp.md"), "utf8").replace(
        "spec:probe.first",
        "spec:probe.missing",
      ),
    );
    expect(await runSdpCli(["generate", root], capture.output, { studioAssets: assets })).toBe(1);
    expect(roots.every((name) => existsSync(join(root, "generated", name)))).toBe(true);
    expect(capture.readStderr()).toContain("conformance/referential-integrity");
  });
  it("removes stale roots and publishes none when extraction fails", async () => {
    const { root, capture } = fixture();
    for (const name of roots) mkdirSync(join(root, "generated", name), { recursive: true });
    writeFileSync(join(root, "bad.sdp.md"), "---\nid: broken\n---\n# Broken\n");
    const synchronize = vi.fn(() => 0);
    expect(
      await runSdpCli(["generate", root], capture.output, {
        synchronizeVaultBeforeGenerate: synchronize,
      }),
    ).toBe(1);
    expect(roots.some((name) => existsSync(join(root, "generated", name)))).toBe(false);
    expect(synchronize).not.toHaveBeenCalled();
  });
  it.each(["refuses", "throws"])(
    "publishes no root when vault synchronization %s",
    async (failure) => {
      const { root, capture } = fixture();
      const synchronize = () => {
        if (failure === "throws") throw new Error("vault refused");
        return 1;
      };
      expect(
        await runSdpCli(["generate", root], capture.output, {
          synchronizeVaultBeforeGenerate: synchronize,
        }),
      ).toBe(1);
      expect(roots.some((name) => existsSync(join(root, "generated", name)))).toBe(false);
    },
  );
  it("checks prior roots before invalidation, leaving the vault untouched in check mode", async () => {
    const { root, capture } = fixture();
    expect(await runSdpCli(["generate", root], capture.output, { studioAssets: assets })).toBe(0);
    const vault = join(root, "vault");
    mkdirSync(vault);
    writeFileSync(join(vault, "user.md"), "keep");
    const synchronize = vi.fn(() => {
      throw new Error("check mode must leave the vault alone");
    });
    const derive = vi.fn(extract);
    expect(
      await runSdpCli(["generate", root, "--check-clean", "--vault", vault], capture.output, {
        studioAssets: assets,
        extract: derive,
        synchronizeVaultBeforeGenerate: synchronize,
      }),
    ).toBe(0);
    expect(derive).toHaveBeenCalledTimes(2);
    expect(synchronize).not.toHaveBeenCalled();
    expect(readFileSync(join(vault, "user.md"), "utf8")).toBe("keep");
  });
  it("applies the Design Review repeat-render check without requiring prior view bytes", async () => {
    const { root, capture } = fixture();
    expect(await runSdpCli(["generate", root], capture.output, { studioAssets: assets })).toBe(0);
    rmSync(join(root, "generated", "design-review"), { recursive: true });
    expect(
      await runSdpCli(["generate", root, "--check-clean"], capture.output, {
        studioAssets: assets,
      }),
    ).toBe(0);
    const render = vi.fn(() => [{ path: "index.md", content: String(render.mock.calls.length) }]);
    expect(
      await runSdpCli(["generate", root, "--check-clean"], capture.output, {
        studioAssets: assets,
        renderDesignReview: render,
      }),
    ).toBe(1);
    expect(existsSync(join(root, "generated", "design-review"))).toBe(false);
    expect(roots.slice(1).every((name) => existsSync(join(root, "generated", name)))).toBe(true);
  });
  it.each(["census", "mermaid", "gherkin", "spec-studio"])(
    "removes only %s when its prior tree is absent",
    async (missing) => {
      const { root, capture } = fixture();
      expect(await runSdpCli(["generate", root], capture.output, { studioAssets: assets })).toBe(0);
      rmSync(join(root, "generated", missing), { recursive: true });
      expect(
        await runSdpCli(["generate", root, "--check-clean"], capture.output, {
          studioAssets: assets,
        }),
      ).toBe(1);
      expect(roots.filter((name) => existsSync(join(root, "generated", name)))).toEqual(
        roots.filter((name) => name !== missing),
      );
    },
  );
  it.each([
    ["--vault"],
    ["--vault", ""],
    ["--vault", "--check-clean"],
    ["--vault", "a", "--vault", "b"],
  ])("refuses malformed vault arguments before building: %j", async (...args) => {
    const { root, capture } = fixture();
    expect(await runSdpCli(["generate", root, ...args], capture.output)).toBe(1);
    expect(capture.readStderr()).toContain("--vault");
    expect(existsSync(join(root, "generated"))).toBe(false);
  });
});
