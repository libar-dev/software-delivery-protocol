import { execFileSync, spawnSync } from "node:child_process";
import { builtinModules, createRequire } from "node:module";
import { readFileSync, readdirSync, statSync } from "node:fs";
import {
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { glob } from "tinyglobby";

import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";

const packageName = "@libar-dev/software-delivery-protocol";
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const importFixture = join(repositoryRoot, "test/fixtures/import/round-trip/behavior.sdp.ts.txt");

const expectedRootExports = [
  "CODE_ANCHOR_LAYERS",
  "CODE_ANCHOR_NAMESPACES",
  "ENTRY_ADDRESS_SECTIONS",
  "MAX_MERMAID_EDGES_PER_DIAGRAM",
  "MAX_MERMAID_NODES_PER_DIAGRAM",
  "PROTOCOL_ANCHORS_MODULE_SPECIFIER",
  "PROTOCOL_MODULE_SPECIFIER",
  "SPEC_ALTITUDES",
  "SPEC_KINDS",
  "SPEC_KIND_DISPLAY_LABELS",
  "SPEC_READINESS",
  "SPEC_RELATION_TYPES",
  "SPEC_SECTION_NAMES",
  "anchorId",
  "authoredEdgeTypes",
  "boundSlotValues",
  "buildGraphIndex",
  "codeAnchor",
  "codeAnchorId",
  "componentAnchorId",
  "computeDeliveryFacts",
  "constrainedBy",
  "contractsFindingIds",
  "createReader",
  "decidedBy",
  "deliveryFactNames",
  "dependsOn",
  "deriveGraph",
  "deriveReadiness",
  "derivedEdgeTypes",
  "duplicateIdExclusionAnchor",
  "emitMarkdownSpec",
  "escapeGherkinViewText",
  "escapeMermaidLabel",
  "GHERKIN_KIND_LIE_REASONS",
  "gherkinKindLieReason",
  "evaluateReadinessFloor",
  "evaluateBody",
  "extract",
  "extractAnchor",
  "extractFindingIds",
  "extractValidatorId",
  "formatId",
  "generateContracts",
  "graphClaims",
  "graphEdgeTypes",
  "graphNodeTypes",
  "graphReportId",
  "graphValidatorIds",
  "hasUnboundSlot",
  "importFindingIds",
  "importTypeScriptSpec",
  "isEnabledExampleVerify",
  "isResolvingTestAnchorVerify",
  "kindEvidence",
  "machineToken",
  "matchConcept",
  "mentionTokens",
  "MarkdownEmissionError",
  "mermaidToken",
  "oracleAnchorId",
  "pack",
  "packId",
  "parseId",
  "parseSlots",
  "readinessFloorAnchor",
  "readinessFloors",
  "ref",
  "refines",
  "reifyMarkdownCarrier",
  "reifyTypeScriptCarrier",
  "renderCensus",
  "renderDesignReview",
  "renderGherkinView",
  "renderMermaid",
  "renderStepText",
  "schemaVersion",
  "serializeGraph",
  "spec",
  "specId",
  "specOracle",
  "specTest",
  "stepSkeleton",
  "supersedes",
  "testAnchorId",
  "validateGraph",
  "validateStructuralAnchorEdges",
  "validationSeverities",
  "validatorFamilies",
  "verifies",
] as const;

const typeOnlyRootExports = [
  "ConceptRecord",
  "CarrierReification",
  "CarrierReifier",
  "ImportResult",
  "ReifiedAnchor",
  "ReifiedPack",
  "ReifiedSpec",
  "GherkinRefusedKind",
] as const;

// npm 11.6.2 selects a directory's files with exactly these two packages, pinned to the versions it
// bundles: pacote loads the actual tree with Arborist and hands it to npm-packlist. Calling them in
// process makes the reference need no registry and run no lifecycle script.
const requireCommonJs = createRequire(import.meta.url);
const Arborist = requireCommonJs("@npmcli/arborist") as new (options: { path: string }) => {
  loadActual(): Promise<unknown>;
};
const packlist = requireCommonJs("npm-packlist") as (
  tree: unknown,
  options: { path: string },
) => Promise<string[]>;

async function npm11Selection(path: string): Promise<string[]> {
  return packlist(await new Arborist({ path }).loadActual(), { path });
}

// npm writes its cache even to pack, and `npm test` hands every script the user's cache through
// npm_config_cache. A cache the suite owns keeps packing and installing working where that cache
// is read-only. Installing the tarball still fetches its dependencies from the npm registry.
const suiteNpmCache = join(tmpdir(), "sdp-package-smoke-npm-cache");

function run(command: string, args: readonly string[], cwd: string): string {
  const env = command === "npm" ? { ...process.env, npm_config_cache: suiteNpmCache } : undefined;
  return execFileSync(command, args, { cwd, encoding: "utf8", env });
}

const subpathExports = ["anchors", "concept-match", "runner", "vitest", "testing"] as const;

// Node's own rule for a file's module format: the extension, then the nearest package.json.
function moduleFormat(file: string): "commonjs" | "module" {
  if (file.endsWith(".cjs")) return "commonjs";
  if (file.endsWith(".mjs")) return "module";
  for (let directory = dirname(file); ; directory = dirname(directory)) {
    try {
      const manifest = JSON.parse(readFileSync(join(directory, "package.json"), "utf8")) as {
        readonly type?: string;
      };
      return manifest.type === "module" ? "module" : "commonjs";
    } catch {
      if (dirname(directory) === directory) return "commonjs";
    }
  }
}

interface PackedPackage {
  readonly filename: string;
  readonly files: readonly { readonly path: string; readonly size: number }[];
}

async function packBuiltPackage(destination: string): Promise<PackedPackage> {
  const source = await mkdtemp(join(tmpdir(), "sdp-pack-source-"));
  try {
    const manifest = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8")) as {
      readonly files: string[];
      scripts?: Record<string, string>;
    };
    // npm 10 runs prepare even with --ignore-scripts. Pack a script-free copy so the pooled
    // suite cannot rebuild dist/ while another worker reads its CLI or Studio assets.
    delete manifest.scripts;
    await writeFile(join(source, "package.json"), JSON.stringify(manifest));
    const paths = [
      ...(await glob(manifest.files, { cwd: repositoryRoot, absolute: true, dot: true })),
      join(repositoryRoot, "README.md"),
      join(repositoryRoot, "LICENSE"),
    ];
    for (const path of new Set(paths)) {
      const target = join(source, relative(repositoryRoot, path));
      await mkdir(dirname(target), { recursive: true });
      await copyFile(path, target);
    }
    const [packed] = JSON.parse(
      run("npm", ["pack", "--json", "--pack-destination", destination], source),
    ) as [PackedPackage];
    return packed;
  } finally {
    await rm(source, { recursive: true, force: true });
  }
}

function distFiles(): Record<string, { inode: string; size: string; mtime: string }> {
  return Object.fromEntries(
    readdirSync(join(repositoryRoot, "dist"), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const path = join(entry.parentPath, entry.name);
        const stats = statSync(path, { bigint: true });
        return [
          path,
          { inode: String(stats.ino), size: String(stats.size), mtime: String(stats.mtimeNs) },
        ];
      }),
  );
}

function consumerDriver(): string {
  const namedImports = expectedRootExports.join(", ");
  const boundValues = expectedRootExports.join(", ");

  return `import * as protocol from "${packageName}";
import { ${namedImports} } from "${packageName}";

void [${boundValues}];

const typeScript = protocol.reifyTypeScriptCarrier(\`import { spec } from "${packageName}";
const carrier = spec({ id: "spec:package.typescript", kind: "behavior", altitude: "story", readiness: "idea" });\`, "package.sdp.ts");
const markdown = protocol.reifyMarkdownCarrier(\`---
id: spec:package.markdown
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Package Markdown carrier

## Intent
- outcome: The installed runtime parses YAML frontmatter.
\`, "package.sdp.md");
const graph = protocol.deriveGraph([...typeScript.specs, ...markdown.specs], [], []);

if (
  typeScript.findings.length !== 0 ||
  markdown.findings.length !== 0 ||
  graph.nodes.length !== 2
) {
  throw new Error("Installed package did not reify both carriers into a graph.");
}

const cycleAnswer = await protocol.evaluateBody("return recipes(26)", { graph });
if (cycleAnswer.findings.length !== 0) throw new Error("Installed evaluator could not run its shipped recipe.");

console.log(
  JSON.stringify({
    exports: Object.keys(protocol).sort(),
    nodes: graph.nodes.map((node) => node.id),
  }),
);
`;
}

const shippedProtocolCorpusImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.shipped-protocol-corpus"),
  label: "asserts the published package ships the Protocol corpus",
  satisfies: ref("spec:consumers.shipped-protocol-corpus"),
});
void shippedProtocolCorpusImplementationAnchor;

const shippedProtocolCorpusTestAnchor = specTest({
  id: testAnchorId("test:protocol.shipped-protocol-corpus"),
  label: "package smoke checks verify the shipped corpus",
  verifies: [ref("spec:consumers.shipped-protocol-corpus"), ref("spec:consumers.adopter-on-ramp")],
});
void shippedProtocolCorpusTestAnchor;

describe("published package surface", () => {
  it("CommonJS trusts relative builders only in an identified Protocol root", async () => {
    const root = await mkdtemp(join(tmpdir(), "sdp-cjs-builder-trust-"));
    const protocol = requireCommonJs(join(repositoryRoot, "dist/index.cjs")) as Pick<
      typeof import("../src/index.js"),
      "extract"
    >;
    try {
      await mkdir(join(root, "src"));
      await writeFile(join(root, "src/anchors.ts"), "export {};\n");
      await writeFile(
        join(root, "binding.ts"),
        `import { codeAnchor, codeAnchorId } from "./src/anchors.js";
import { codeAnchor as publicAnchor, codeAnchorId as publicId } from "${packageName}/anchors";
const relativeBinding = codeAnchor({ id: codeAnchorId("impl:probe.relative") });
const packageBinding = publicAnchor({ id: publicId("impl:probe.package") });
`,
      );
      const anchorIds = (): string[] =>
        protocol
          .extract({ root })
          .graph.nodes.map((node) => node.id)
          .sort();

      expect(anchorIds()).toEqual(["impl:probe.package"]);
      await writeFile(join(root, "package.json"), JSON.stringify({ name: packageName }));
      expect(anchorIds()).toEqual(["impl:probe.package", "impl:probe.relative"]);
      await writeFile(join(root, "package.json"), JSON.stringify({ name: "consumer" }));
      expect(anchorIds()).toEqual(["impl:probe.package"]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  // The CommonJS root requires its dependencies as it loads. Node runs an ES module through
  // require() by default only from 20.19 and 22.12, so while any of them is an ES module the
  // declared engines must admit no older release.
  it("keeps the CommonJS root loadable on every Node release its engines admit", async () => {
    const entry = join(repositoryRoot, "dist/index.cjs");
    const source = await readFile(entry, "utf8");
    const specifiers = [
      ...new Set(
        [...source.matchAll(/\brequire\("([^"]+)"\)/gu)].map(([, specifier]) => specifier),
      ),
    ].filter(
      (specifier): specifier is string =>
        specifier !== undefined &&
        !specifier.startsWith(".") &&
        !specifier.startsWith("node:") &&
        !builtinModules.includes(specifier),
    );
    expect(specifiers).toContain("ts-morph");
    const requireFromEntry = createRequire(entry);
    // Each resolves through the `require` condition, or the root fails as it loads.
    const esModules = specifiers.filter(
      (specifier) => moduleFormat(requireFromEntry.resolve(specifier)) === "module",
    );
    const manifest = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8")) as {
      readonly engines: { readonly node: string };
    };
    if (esModules.length > 0) expect(manifest.engines.node).toBe("^20.19.0 || >=22.12.0");

    const loaded = spawnSync(
      process.execPath,
      [
        "-e",
        `const m = require(${JSON.stringify(entry)}); if (typeof m.extract !== "function") process.exit(2);`,
      ],
      { encoding: "utf8" },
    );
    expect(loaded.status, loaded.stderr).toBe(0);
  });

  it("packs where the user's npm cache is read-only", async () => {
    const destination = await mkdtemp(join(tmpdir(), "sdp-pack-read-only-cache-"));
    const readOnlyCache = join(destination, "read-only-cache");
    const userCache = process.env.npm_config_cache;
    try {
      await mkdir(readOnlyCache);
      await chmod(readOnlyCache, 0o555);
      process.env.npm_config_cache = readOnlyCache;
      const packed = await packBuiltPackage(destination);
      expect(packed.filename).toMatch(/\.tgz$/u);
    } finally {
      if (userCache === undefined) delete process.env.npm_config_cache;
      else process.env.npm_config_cache = userCache;
      await chmod(readOnlyCache, 0o755);
      await rm(destination, { recursive: true, force: true });
    }
  }, 60_000);

  it("packing leaves every repository dist file's inode, size and mtime untouched", async () => {
    const destination = await mkdtemp(join(tmpdir(), "sdp-pack-unchanged-"));
    try {
      const before = distFiles();
      await packBuiltPackage(destination);
      expect(distFiles()).toEqual(before);
    } finally {
      await rm(destination, { recursive: true, force: true });
    }
  }, 60_000);

  it("packs the same files and bytes as npm 11 selects from the built repository", async () => {
    const destination = await mkdtemp(join(tmpdir(), "sdp-pack-selection-"));
    try {
      const before = distFiles();
      const expected = await npm11Selection(repositoryRoot);
      const packed = await packBuiltPackage(destination);
      expect(distFiles()).toEqual(before);
      expect(packed.files.map((file) => file.path).sort()).toEqual([...expected].sort());
      const tarball = join(destination, packed.filename);
      const paths = run("tar", ["-tzf", tarball], destination).trim().split("\n");
      expect(paths.sort()).toEqual(expected.map((path) => `package/${path}`).sort());
      const unpacked = join(destination, "unpacked");
      await mkdir(unpacked);
      run("tar", ["-xzf", tarball, "-C", unpacked], destination);
      const manifest = JSON.parse(await readFile(join(repositoryRoot, "package.json"), "utf8")) as {
        scripts?: Record<string, string>;
      };
      delete manifest.scripts;
      expect(JSON.parse(await readFile(join(unpacked, "package/package.json"), "utf8"))).toEqual(
        manifest,
      );
      for (const path of expected) {
        if (path === "package.json") continue;
        expect(await readFile(join(unpacked, "package", path)), path).toEqual(
          await readFile(join(repositoryRoot, path)),
        );
      }
    } finally {
      await rm(destination, { recursive: true, force: true });
    }
  }, 60_000);

  it.each(["dist/adapters/vitest.js", "dist/index.cjs"])(
    "%s keeps Vitest runner code outside the package",
    async (entry) => {
      const built = await readFile(join(repositoryRoot, entry), "utf8");
      expect(built.match(/\b(?:initSuite|createSuiteCollector)\b/gu) ?? []).toEqual([]);
      if (entry === "dist/adapters/vitest.js") {
        expect(built).toMatch(/from ["'](?:vitest|@vitest\/[^"']+)["']/u);
      }
    },
  );

  it("registers and passes one bindExample test with the installed consumer's Vitest", async () => {
    const packageRoot = await mkdtemp(join(tmpdir(), "sdp-vitest-smoke-"));
    const consumer = join(packageRoot, "consumer");

    try {
      const packed = await packBuiltPackage(packageRoot);
      // Vitest looks for a config in every ancestor directory, and the system temp directory may
      // sit inside another Vitest project. This one would select no test in the consumer.
      await writeFile(
        join(packageRoot, "vitest.config.mjs"),
        'export default { test: { include: ["no-such-directory/**"] } };\n',
      );
      await mkdir(consumer);
      await writeFile(join(consumer, "vitest.config.mjs"), "export default {};\n");
      await writeFile(
        join(consumer, "package.json"),
        JSON.stringify({ name: "sdp-vitest-smoke", private: true, type: "module" }),
      );
      run(
        "npm",
        [
          "install",
          "--ignore-scripts",
          "--no-audit",
          "--no-fund",
          join(packageRoot, packed.filename),
        ],
        consumer,
      );
      // npm 10 crashes installing Vitest 4.1 from the registry, with or without this package, so
      // the consumer takes the repository's installed Vitest through a link; the adapter still
      // resolves `vitest` from the consumer's own node_modules.
      await symlink(
        join(repositoryRoot, "node_modules/vitest"),
        join(consumer, "node_modules/vitest"),
        "dir",
      );
      await writeFile(
        join(consumer, "bound.test.js"),
        `import { expect } from "vitest";
import { bindExample } from "${packageName}/vitest";

bindExample({
  spec: "spec:package.bound-example",
  title: "The installed adapter uses the consumer's runner",
  steps: [{ kind: "then", key: "freshWorld", text: "the world is fresh", params: {} }],
}, () => ({ fresh: true }), {
  freshWorld: world => expect(world.fresh).toBe(true),
});
`,
      );
      const executed = spawnSync(
        process.execPath,
        ["node_modules/vitest/vitest.mjs", "run", "--reporter=json"],
        { cwd: consumer, encoding: "utf8" },
      );
      expect(executed.status, executed.stdout + executed.stderr).toBe(0);
      const result = JSON.parse(executed.stdout) as {
        readonly numTotalTests: number;
        readonly numPassedTests: number;
        readonly numFailedTests: number;
      };
      expect(result).toMatchObject({ numTotalTests: 1, numPassedTests: 1, numFailedTests: 0 });
    } finally {
      await rm(packageRoot, { force: true, recursive: true });
    }
  }, 60_000);

  it("proves the installed tarball lists import, dry-runs conversion without writes, and exposes the barrel", async () => {
    const packageRoot = await mkdtemp(join(tmpdir(), "sdp-package-smoke-"));
    const consumer = join(packageRoot, "consumer");

    try {
      // npm ci or the check gate has built dist/. Reuse that build here; the separate git-install
      // gate proves prepare from a clean commit without rebuilding inside the pooled suite.
      const packed = await packBuiltPackage(packageRoot);
      const packedPaths = packed.files.map((file) => file.path);
      const adopterAssets = [
        "CONTEXT.md",
        "plugin.json",
        "skills/sdp-agent-surface/SKILL.md",
        "skills/sdp-authoring/SKILL.md",
        "skills/sdp-sessions/SKILL.md",
        "skills/sdp-studio/SKILL.md",
        "skills/sdp-vault/SKILL.md",
        "docs/agent-surface/recipes.md",
        "docs/agent-surface/upgrade-guide.md",
        "docs/agent-surface/architecture.md",
      ];

      const packedAssets = [
        ...adopterAssets,
        "schemas/sdp-proposal-1.schema.json",
        "docs/concept/DECISIONS.md",
      ];

      expect(packedPaths).toEqual(expect.arrayContaining(packedAssets));
      expect(
        packedPaths.filter(
          (path) =>
            !["LICENSE", "README.md", "package.json", ...packedAssets].includes(path) &&
            !path.startsWith("dist/") &&
            !path.startsWith("specs/") &&
            !path.startsWith("skills/"),
        ),
      ).toEqual([]);
      // Each skill ships whole, its references and scripts beside its SKILL.md, and nothing else.
      const skillPaths: string[] = [];
      const walkSkills = async (directory: string): Promise<void> => {
        for (const entry of await readdir(join(repositoryRoot, directory), {
          withFileTypes: true,
        })) {
          const path = `${directory}/${entry.name}`;
          if (entry.isDirectory()) await walkSkills(path);
          else if (entry.name !== ".DS_Store" && !entry.name.startsWith("._"))
            skillPaths.push(path);
        }
      };
      await walkSkills("skills");
      expect(packedPaths.filter((path) => path.startsWith("skills/")).sort()).toEqual(
        skillPaths.sort(),
      );
      const carrierPaths: string[] = [];
      const walkCarriers = async (directory: string): Promise<void> => {
        for (const entry of await readdir(join(repositoryRoot, directory), {
          withFileTypes: true,
        })) {
          const path = `${directory}/${entry.name}`;
          if (entry.isDirectory()) await walkCarriers(path);
          else if (entry.name !== ".DS_Store" && !entry.name.startsWith("._")) {
            expect(path.endsWith(".sdp.md") || path.endsWith(".sdp.gherkin")).toBe(true);
            carrierPaths.push(path);
          }
        }
      };
      await walkCarriers("specs");
      expect(packedPaths.filter((path) => path.startsWith("specs/")).sort()).toEqual(
        carrierPaths.sort(),
      );
      expect(
        packedPaths.filter((path) => !path.startsWith("dist/") && /\.tsx?$/u.test(path)),
      ).toEqual([]);

      const tarball = packed.filename;
      const packedManifest = JSON.parse(
        run("tar", ["-xOf", join(packageRoot, tarball), "package/package.json"], repositoryRoot),
      ) as {
        peerDependencies?: Record<string, string>;
        peerDependenciesMeta?: Record<string, unknown>;
      };
      expect(packedManifest.peerDependencies ?? {}).not.toHaveProperty("vitest");
      expect(packedManifest.peerDependenciesMeta ?? {}).not.toHaveProperty("vitest");

      await mkdir(consumer);
      await writeFile(
        join(consumer, "package.json"),
        JSON.stringify({ name: "sdp-package-smoke", private: true, type: "module" }),
      );

      run(
        "npm",
        [
          "install",
          "--ignore-scripts",
          "--no-audit",
          "--no-fund",
          "--omit=dev",
          join(packageRoot, tarball),
        ],
        consumer,
      );
      expect(await readdir(join(consumer, "node_modules"))).not.toContain("vitest");
      await writeFile(join(consumer, "consumer.mjs"), consumerDriver());
      await writeFile(
        join(consumer, "node-free-loader.mjs"),
        `export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("node:")) throw new Error("Unexpected Node dependency: " + specifier);
  return nextResolve(specifier, context);
}
`,
      );
      expect(
        run(
          process.execPath,
          [
            "--no-warnings",
            "--loader",
            "./node-free-loader.mjs",
            "--input-type=module",
            "-e",
            `import { matchConcept } from "${packageName}/concept-match";
if (matchConcept([{ id: "spec:smoke", nodeType: "Primitive", title: "needle" }], "needle")[0]?.id !== "spec:smoke") throw new Error("Matcher not callable");
console.log("node-free matcher available");`,
          ],
          consumer,
        ),
      ).toBe("node-free matcher available\n");
      await writeFile(
        join(consumer, "type-surface.mts"),
        `import { ${expectedRootExports.join(", ")} } from "${packageName}";
import type { ${typeOnlyRootExports.join(", ")} } from "${packageName}";
import { matchConcept as standaloneMatcher } from "${packageName}/concept-match";
import type { ConceptRecord as StandaloneConceptRecord } from "${packageName}/concept-match";
${subpathExports.map((subpath, index) => `import * as subpath${String(index)} from "${packageName}/${subpath}";`).join("\n")}
const record: StandaloneConceptRecord = { id: "spec:smoke", nodeType: "Primitive" };
standaloneMatcher([record], "smoke");
void [${expectedRootExports.join(", ")}];
void [${subpathExports.map((_, index) => `subpath${String(index)}`).join(", ")}];
`,
      );

      run(
        join(repositoryRoot, "node_modules", ".bin", "tsc"),
        [
          "--module",
          "NodeNext",
          "--moduleResolution",
          "NodeNext",
          "--target",
          "ES2022",
          "--strict",
          "--skipLibCheck",
          "--noEmit",
          "type-surface.mts",
        ],
        consumer,
      );
      // Node16 resolution forbids a CommonJS file from typing an ESM declaration, so the
      // `require` condition must name declarations of its own.
      await writeFile(
        join(consumer, "type-surface.cts"),
        `import { ${expectedRootExports.join(", ")} } from "${packageName}";
import type { ${typeOnlyRootExports.join(", ")} } from "${packageName}";
void [${expectedRootExports.join(", ")}];
`,
      );
      run(
        join(repositoryRoot, "node_modules", ".bin", "tsc"),
        [
          "--module",
          "Node16",
          "--moduleResolution",
          "Node16",
          "--target",
          "ES2022",
          "--strict",
          "--skipLibCheck",
          "--noEmit",
          "type-surface.cts",
        ],
        consumer,
      );
      // The subpaths are ES modules only, and Node refuses to require them: TypeScript must
      // refuse the same CommonJS import instead of typing it.
      await writeFile(
        join(consumer, "subpath-require.cts"),
        `${subpathExports.map((subpath, index) => `import * as subpath${String(index)} from "${packageName}/${subpath}";`).join("\n")}
void [${subpathExports.map((_, index) => `subpath${String(index)}`).join(", ")}];
`,
      );
      const refused = spawnSync(
        join(repositoryRoot, "node_modules", ".bin", "tsc"),
        [
          "--module",
          "NodeNext",
          "--moduleResolution",
          "NodeNext",
          "--target",
          "ES2022",
          "--strict",
          "--skipLibCheck",
          "--noEmit",
          "subpath-require.cts",
        ],
        { cwd: consumer, encoding: "utf8" },
      );
      expect(refused.status).not.toBe(0);
      for (const subpath of subpathExports) {
        expect(refused.stdout).toContain(
          `error TS2307: Cannot find module '${packageName}/${subpath}'`,
        );
      }

      const sdpHelp = run(join(consumer, "node_modules", ".bin", "sdp"), ["--help"], consumer);
      for (const path of [...adopterAssets, "schemas/sdp-proposal-1.schema.json", "specs/"]) {
        expect(sdpHelp).toContain(path);
      }
      expect(sdpHelp.replaceAll(/\s+/gu, " ")).toMatch(/That graph holds intent only\./u);
      const anchorsClause =
        /(?:package ships no source anchors|No source anchors ship in the package)/u;
      const help = sdpHelp.replaceAll(/\s+/gu, " ");
      expect(help).toMatch(anchorsClause);
      for (const original of [
        "The package ships no source anchors",
        "No source anchors ship in the package",
      ]) {
        if (!help.includes(original)) continue;
        expect(help.replace(original, "No source anchors ship in the package")).toMatch(
          anchorsClause,
        );
        expect(help.replace(original, "The package ships source anchors")).not.toMatch(
          anchorsClause,
        );
        expect(help.replace(original, "Source anchors ship in the package")).not.toMatch(
          anchorsClause,
        );
      }
      expect(sdpHelp.replaceAll(/\s+/gu, " ")).toMatch(/its delivery facts are empty/u);
      expect(sdpHelp.replaceAll(/\s+/gu, " ")).toMatch(
        /its gap and verifier-linkage warnings are not evidence about what the Protocol has realized/u,
      );
      const installedCli = join(consumer, "node_modules", ".bin", "sdp");
      const intentOnly = JSON.parse(
        run(
          installedCli,
          [
            "q",
            'return { specs: g.specs().length, anchors: graph.nodes.filter(n => n.nodeType === "Anchor").length, code: graph.nodes.filter(n => n.nodeType === "CodeNode").length, delivered: g.specs().filter(s => s.deliveryFacts.length > 0).length }',
            "--root",
            "node_modules/@libar-dev/software-delivery-protocol/specs",
            "--json",
          ],
          consumer,
        ),
      ) as { specs: number; anchors: number; code: number; delivered: number };
      expect(intentOnly.specs).toBeGreaterThan(0);
      expect(intentOnly.anchors).toBe(0);
      expect(intentOnly.code).toBe(0);
      expect(intentOnly.delivered).toBe(0);
      await writeFile(
        join(consumer, "own.sdp.md"),
        `---
id: spec:package.own
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Own corpus

## Intent
- outcome: Discovery keeps the installed corpus outside this graph.
`,
      );
      expect(
        JSON.parse(run(installedCli, ["q", "return g.specs().map(s => s.id)", "--json"], consumer)),
      ).toEqual(["spec:package.own"]);
      await rm(join(consumer, "own.sdp.md"));
      await copyFile(importFixture, join(consumer, "behavior.sdp.ts"));
      const sdpImportDryRun = run(
        join(consumer, "node_modules", ".bin", "sdp"),
        ["import", "--dry-run", "behavior.sdp.ts"],
        consumer,
      );
      const driver = run(process.execPath, ["consumer.mjs"], consumer);
      const barrelCheck = run(
        process.execPath,
        [
          "-e",
          `const m=require("${packageName}"); if(typeof m.emitMarkdownSpec!=="function"||typeof m.importTypeScriptSpec!=="function"||typeof m.importFindingIds!=="object"||typeof m.MarkdownEmissionError!=="function") process.exit(1); console.log("barrel imports available")`,
        ],
        consumer,
      );
      const installedAgentSkill = await readFile(
        join(
          consumer,
          "node_modules",
          "@libar-dev",
          "software-delivery-protocol",
          "skills/sdp-agent-surface/SKILL.md",
        ),
        "utf8",
      );
      const installedAuthoringSkill = await readFile(
        join(
          consumer,
          "node_modules",
          "@libar-dev",
          "software-delivery-protocol",
          "skills/sdp-authoring/SKILL.md",
        ),
        "utf8",
      );
      const installedSessionsSkill = await readFile(
        join(
          consumer,
          "node_modules",
          "@libar-dev",
          "software-delivery-protocol",
          "skills/sdp-sessions/SKILL.md",
        ),
        "utf8",
      );

      expect(JSON.parse(driver)).toEqual({
        exports: [...expectedRootExports].sort(),
        nodes: ["spec:package.typescript", "spec:package.markdown"],
      });
      expect(sdpHelp).toContain("sdp import");
      expect(sdpHelp).toContain(
        "sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME",
      );
      expect(sdpImportDryRun).toContain("id: spec:round-trip.behavior");
      expect(await readdir(consumer)).not.toContain("behavior.sdp.md");
      expect(barrelCheck).toBe("barrel imports available\n");
      expect(installedAgentSkill).toContain("name: sdp-agent-surface");
      expect(installedAuthoringSkill).toContain("name: sdp-authoring");
      expect(installedSessionsSkill).toContain("name: sdp-sessions");
      for (const skill of ["sdp-studio", "sdp-vault"]) {
        const installed = await readFile(
          join(
            consumer,
            "node_modules",
            "@libar-dev",
            "software-delivery-protocol",
            `skills/${skill}/SKILL.md`,
          ),
          "utf8",
        );
        expect(installed).toContain(`name: ${skill}`);
      }
    } finally {
      await rm(packageRoot, { force: true, recursive: true });
    }
  }, 60_000);
});
