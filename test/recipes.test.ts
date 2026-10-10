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
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { recipeFiles, writeBuildArtifacts, writeRecipeFiles } from "../src/cli/build-artifacts.js";
import { compileBody } from "../src/cli/q-command.js";
import { runSdpCli } from "../src/cli/sdp.js";
import {
  createReader,
  extract,
  extractValidatorId,
  schemaVersion,
  validateGraph,
} from "../src/index.js";
import type { ExtractionResult, GraphEdge, GraphNode, GraphSchema } from "../src/index.js";
import { expectedComponentIds, expectedUsesEdges } from "./self-hosting-oracle/structural-edges.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { countMapSets } from "./helpers/map-sets.js";

// The recipe corpus is executable documentation: every fenced `js` body in the catalog must run
// verbatim through the real front door, or the catalog is lying about what an agent can paste.
// Invariants below are shape-level only — the corpus grows every phase, so a frozen count in a
// recipe check is rot with a timer on it.
import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const recipesPath = "docs/agent-surface/recipes.md";

// The seam is the production one: `runSdpCli` parses the same argv, compiles the same body, injects
// the same `g` / `graph` / `report` / `params` bindings, and shapes the same output. Only the
// extraction is memoized — derived once from the repository root with the standard exclude list (the
// corpus-oracle derivation pattern), because deriving the whole corpus once per recipe buys nothing
// the single derivation does not already prove. Nothing here names a write path, so the suite stays pooled.
// The project's own exclusions, stated once. Every documented `sdp q` invocation that names any
// exclusion at this root must name all of them: without the full set the corpus reports extraction
// errors and the sink refuses the body outright, so a shorter list in a doc is an invocation that
// cannot run as written — the one failure mode running the bodies through an injected extraction
// cannot see.
const standardExcludes = ["explorations", "examples", "test/fixtures/import/parity"] as const;

const derived = extract({
  root: repoRoot,
  exclude: [...standardExcludes],
});

const primitivesById = new Map(
  derived.graph.nodes
    .filter((node) => node.nodeType === "Primitive")
    .map((node) => [node.id, node] as const),
);

// The reader over the same derivation: completeness expectations below are computed from the
// graph, never frozen, so the corpus can grow without rotting the check while an under-reporting
// recipe body still reddens.
const reader = createReader(derived.graph);

interface Recipe {
  readonly ordinal: number;
  readonly title: string;
  readonly body: string;
}

const headingPattern = /^## (?<ordinal>\d+)\. (?<title>.+)$/u;

/**
 * One pass over the catalog, pairing each numbered recipe heading with the fenced `js` body that
 * follows it. A heading with no body, or a second body under one heading, breaks the pairing and
 * the count assertion below names it — a new recipe cannot enter the catalog unchecked.
 */
function parseRecipes(markdown: string): readonly Recipe[] {
  const lines = markdown.split("\n");
  const recipes: Recipe[] = [];
  let pending: { readonly ordinal: number; readonly title: string } | undefined;
  let openedAt: number | undefined;

  for (const [index, line] of lines.entries()) {
    const heading = headingPattern.exec(line);
    const ordinal = heading?.groups?.ordinal;
    const title = heading?.groups?.title;

    if (ordinal !== undefined && title !== undefined) {
      pending = { ordinal: Number(ordinal), title };
      continue;
    }

    if (line === "```js") {
      openedAt = index + 1;
      continue;
    }

    if (line === "```" && openedAt !== undefined) {
      recipes.push({
        ordinal: pending?.ordinal ?? -1,
        title: pending?.title ?? "(unheaded body)",
        body: lines.slice(openedAt, index).join("\n"),
      });
      openedAt = undefined;
      pending = undefined;
    }
  }

  return recipes;
}

const source = readFileSync(join(repoRoot, recipesPath), "utf8");
const recipes = parseRecipes(source);
const documentedHeadingCount = source
  .split("\n")
  .filter((line) => headingPattern.test(line)).length;

const queryHooks = {
  query: {
    extract: () => derived,
    // A recipe body always arrives on argv here, exactly as the catalog documents it; a stdin read
    // would mean the argv path silently failed.
    isStdinTty: () => true,
    readStdin: (): string => {
      throw new Error("a recipe body must reach the sink on argv, never through stdin");
    },
  },
};

/**
 * Runs one body through the real argv seam. A recipe parameter travels the way a caller passes
 * it, as JSON data on `--params`, never spliced into the body; without one the body runs exactly
 * as the catalog prints it and falls back to its sample.
 */
async function runRecipe(
  recipe: Recipe,
  params?: Readonly<Record<string, unknown>>,
  extraction: ExtractionResult = derived,
): Promise<unknown> {
  const capture = createCaptureOutput();
  const exitCode = await runSdpCli(
    [
      "q",
      recipe.body,
      "--root",
      repoRoot,
      "--json",
      ...(params === undefined ? [] : ["--params", JSON.stringify(params)]),
    ],
    capture.output,
    {
      query: {
        ...queryHooks.query,
        extract: () => extraction,
      },
    },
  );

  // The expected stderr is the empty string, not a self-comparison: a recipe run over the green
  // corpus has nothing to say on stderr, and the object shape keeps the actual output in the
  // failure diff when it does.
  expect(
    { recipe: recipe.title, exitCode, stderr: capture.readStderr() },
    `recipe ${String(recipe.ordinal)} must run as written`,
  ).toEqual({ recipe: recipe.title, exitCode: 0, stderr: "" });

  return JSON.parse(capture.readStdout()) as unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`expected an object, got ${JSON.stringify(value)}`);
  }

  return value as Record<string, unknown>;
}

function asArray(value: unknown): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`expected an array, got ${JSON.stringify(value)}`);
  }

  return value as readonly unknown[];
}

function stringAt(record: Record<string, unknown>, key: string): string {
  const value = record[key];

  if (typeof value !== "string") {
    throw new Error(`expected a string at ${key}, got ${JSON.stringify(value)}`);
  }

  return value;
}

function numberAt(record: Record<string, unknown>, key: string): number {
  const value = record[key];

  if (typeof value !== "number") {
    throw new Error(`expected a number at ${key}, got ${JSON.stringify(value)}`);
  }

  return value;
}

const claims = ["declared", "anchored", "inferred"];
const rungs = ["idea", "scoped", "defined", "ready"];

function recipeByOrdinal(ordinal: number): Recipe {
  const recipe = recipes.find((entry) => entry.ordinal === ordinal);

  if (recipe === undefined) {
    throw new Error(`the catalog has no recipe ${String(ordinal)}`);
  }

  return recipe;
}

function edgeId(edge: { readonly from: string; readonly to: string }): string {
  return `${edge.from} -> ${edge.to}`;
}

// Lawful first path segments that collide with Object.prototype own/inherited keys. The ID
// grammar admits them (`src/ids.ts`); family maps built as `{}` do not.
const HOSTILE_PATH_SEGMENTS = ["constructor", "toString", "valueOf", "hasOwnProperty"] as const;

type HostilePathSegment = (typeof HOSTILE_PATH_SEGMENTS)[number];

function hostileSpecId(family: HostilePathSegment, leaf: string): string {
  return `spec:${family}.${leaf}`;
}

function extractionWithHostilePrimitives(input: {
  readonly leaf: string;
  readonly readiness: "idea" | "scoped" | "defined" | "ready";
  readonly decidedByTarget?: string;
}): ExtractionResult {
  const nodes = HOSTILE_PATH_SEGMENTS.map((family) => ({
    id: hostileSpecId(family, input.leaf),
    nodeType: "Primitive" as const,
    claim: "declared" as const,
    specKind: "rule" as const,
    altitude: "story" as const,
    readiness: input.readiness,
    title: `hostile family fixture ${family}`,
    file: "specs/fixture-hostile-family.sdp.md",
  }));
  const decidedByTarget = input.decidedByTarget;
  const edges =
    decidedByTarget === undefined
      ? []
      : HOSTILE_PATH_SEGMENTS.map((family) => ({
          from: hostileSpecId(family, input.leaf),
          type: "decidedBy" as const,
          to: decidedByTarget,
          claim: "declared" as const,
        }));

  return {
    counts: derived.counts,
    report: derived.report,
    graph: {
      schemaVersion: derived.graph.schemaVersion,
      nodes: [...derived.graph.nodes, ...nodes],
      edges: [...derived.graph.edges, ...edges],
    },
  };
}

function assertOwnHostileFamilyIds(byFamily: Record<string, unknown>, leaf: string): void {
  for (const family of HOSTILE_PATH_SEGMENTS) {
    expect(Object.hasOwn(byFamily, family), `missing own family key ${family}`).toBe(true);
    const ids = asArray(byFamily[family]).map((row) => stringAt(asRecord(row), "id"));
    expect(ids).toContain(hostileSpecId(family, leaf));
  }
}

function structuralGroundTruth() {
  const components = derived.graph.nodes
    .filter((node) => node.nodeType === "CodeNode" && node.id.startsWith("component:"))
    .map((node) => node.id)
    .sort();
  const memberOfEdges = derived.graph.edges.filter((edge) => edge.type === "memberOf");
  const usesEdges = derived.graph.edges.filter((edge) => edge.type === "uses");
  const structuralIds = new Set(
    [...memberOfEdges, ...usesEdges].flatMap((edge) => [edge.from, edge.to]),
  );
  const danglingStructuralFindings = derived.report.findings.filter(
    (finding) =>
      finding.validatorId === "conformance/referential-integrity" &&
      [finding.subjectId, finding.relatedId].some(
        (id) => id !== undefined && structuralIds.has(id),
      ),
  );

  return {
    components,
    memberOfEdges,
    usesEdges,
    danglingStructuralFindings,
  };
}

const addressAndCycleRecipesImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.address-and-cycle-recipes"),
  label: "asserts realization of the shipped address resolution and dependency cycle recipes",
  satisfies: ref("spec:consumers.agent-surface.address-and-cycle-recipes"),
});
void addressAndCycleRecipesImplementationAnchor;
const addressAndCycleRecipesTestAnchor = specTest({
  id: testAnchorId("test:protocol.address-and-cycle-recipes"),
  label: "recipe checks verify the address resolution and dependency cycle recipes",
  verifies: ref("spec:consumers.agent-surface.address-and-cycle-recipes"),
});
void addressAndCycleRecipesTestAnchor;
const registerRecipesImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.register-recipes"),
  label: "asserts realization of the shipped register recipes",
  satisfies: ref("spec:consumers.agent-surface.register-recipes"),
});
void registerRecipesImplementationAnchor;
const registerRecipesTestAnchor = specTest({
  id: testAnchorId("test:protocol.register-recipes"),
  label: "recipe checks verify the register recipes",
  verifies: ref("spec:consumers.agent-surface.register-recipes"),
});
void registerRecipesTestAnchor;
describe("the agent-surface recipe corpus", () => {
  // Given: the catalog as authored. When: its structure is read. Then: every documented recipe
  // carries exactly one runnable body, so a new recipe cannot dodge the check by omitting one.
  it("pairs every documented recipe with exactly one fenced body", () => {
    expect(recipes.length).toBe(documentedHeadingCount);
    expect(recipes.filter((recipe) => recipe.ordinal === -1)).toEqual([]);
    expect(recipes.map((recipe) => recipe.ordinal)).toEqual(
      recipes.map((_recipe, index) => index + 1),
    );
  });

  // The self-hosting form pins this root's mandatory exclusions, while the adopter form keeps
  // root and repeatable exclusions project-selected. The two contracts are checked separately so
  // portability cannot weaken the root's real invocation.
  it("keeps self-hosting and adopter invocation forms distinct", () => {
    const onRampSources = [
      recipesPath,
      ".agents/skills/sdp-agent-surface/SKILL.md",
      ".agents/skills/sdp-authoring/SKILL.md",
      ".agents/skills/sdp-sessions/SKILL.md",
    ];
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const localQuery = packageJson.scripts["sdp:q"] ?? "";

    for (const path of standardExcludes) {
      expect(localQuery).toContain(`--exclude ${path}`);
    }

    for (const source of onRampSources) {
      const lines = readFileSync(join(repoRoot, source), "utf8").split("\n");
      const selfHostingLines = lines.filter((line) => line.startsWith("pnpm --silent sdp:q '"));
      const adopterLines = lines.filter((line) => line.startsWith("pnpm exec sdp q '"));

      expect({ source, selfHosting: selfHostingLines.length > 0 }).toEqual({
        source,
        selfHosting: true,
      });
      // A body in double quotes is shell-expanded before the sink sees it. The one lawful
      // double-quoted body is a shipped recipe file read whole by command substitution.
      expect({
        source,
        otherQuoting: lines.filter(
          (line) => line.includes(' q "') && line.includes("sdp") && !line.includes(' q "$(cat '),
        ),
      }).toEqual({ source, otherQuoting: [] });

      expect({ source, adopterForms: adopterLines.length }).toEqual({
        source,
        adopterForms: 2,
      });
      for (const line of adopterLines) {
        expect(standardExcludes.some((path) => line.includes(`--exclude ${path}`))).toBe(false);
        expect(line.match(/--exclude PATH/gu)?.length ?? 0).toBeLessThanOrEqual(2);
      }
    }
  });

  it("keeps on-ramp recipe mentions synchronized with the catalog", () => {
    const countWords = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
      "twenty",
      "twenty-one",
      "twenty-two",
      "twenty-three",
      "twenty-four",
      "twenty-five",
      "twenty-six",
      "twenty-seven",
      "twenty-eight",
      "twenty-nine",
      "thirty",
      "thirty-one",
      "thirty-two",
    ] as const;
    const countWord = countWords[recipes.length];
    const lastOrdinal = recipes[recipes.length - 1]?.ordinal;
    const intro = source.slice(0, source.indexOf("## 1."));
    const parameterizedMention = /Recipes (?<list>[0-9, and]+)/u.exec(intro)?.groups?.list ?? "";
    const parameterizedOrdinals = [...parameterizedMention.matchAll(/\d+/gu)].map((match) =>
      Number(match[0]),
    );
    const introProse = intro.replace(/\s+/gu, " ");
    const onRamps = {
      agents: readFileSync(join(repoRoot, "AGENTS.md"), "utf8"),
      agentSurface: readFileSync(
        join(repoRoot, ".agents/skills/sdp-agent-surface/SKILL.md"),
        "utf8",
      ),
      authoring: readFileSync(join(repoRoot, ".agents/skills/sdp-authoring/SKILL.md"), "utf8"),
      sessions: readFileSync(join(repoRoot, ".agents/skills/sdp-sessions/SKILL.md"), "utf8"),
    };
    const parameterizedRecipes = recipes.filter((recipe) => /\bparams\./u.test(recipe.body));

    // A parameter is data on `--params`, never source spliced into a body, and no recipe reads
    // the environment. The intro teaches exactly that and names no retired channel.
    expect(introProse).toContain("Pass it as JSON data with `--params`, never by editing the body");
    expect(source).not.toContain("SDP_CHANGED_FILES_JSON");
    for (const recipe of recipes) {
      expect({ recipe: recipe.ordinal, env: recipe.body.includes("process.env") }).toEqual({
        recipe: recipe.ordinal,
        env: false,
      });
    }

    expect(countWord).toBeDefined();
    if (countWord === undefined) {
      throw new Error(`recipe count ${String(recipes.length)} is outside the checked prose range`);
    }
    expect(lastOrdinal).toBe(recipes.length);
    expect(onRamps.agentSurface).toContain(`catalog contains ${countWord} ready-made bodies`);
    expect(onRamps.agentSurface).toContain(`Recipes 1-${String(recipes.length)}`);
    expect(onRamps.agents).toContain(`${countWord} runnable \`sdp q\` bodies`);
    expect(parameterizedOrdinals).toEqual(parameterizedRecipes.map((recipe) => recipe.ordinal));
    expect(onRamps.authoring).toContain("sdp new spec");
    expect(onRamps.authoring).toContain("sdp validate --watch");
    expect(onRamps.authoring).not.toContain("--dry-run");
    expect(onRamps.sessions).toContain("sdp new spec");
    expect(onRamps.sessions).toContain("validate --watch");
    expect(onRamps.agents).toContain("new spec");
    expect(onRamps.agents).toContain("sdp validate --watch");

    const agentSurfaceProse = onRamps.agentSurface.toLowerCase().replace(/\s+/gu, " ");
    for (const phrase of [
      "component membership",
      "uses fan-in and fan-out",
      "structural neighborhood",
      "census structural coverage",
      "projection-coverage upper bound",
      "architecture map",
      "decision map",
      "planning slice",
      "open-question register",
      "dependency footing",
      "mention audit",
      "entry search",
      "pinned declarations",
      "address resolution",
      "dependency cycles",
      "references into a design",
      "roles, layers and contexts",
      "pack design",
      "design-change impact",
      "decision register",
      "architecture crossings",
    ]) {
      expect(agentSurfaceProse).toContain(phrase);
    }

    for (let ordinal = 12; ordinal <= recipes.length; ordinal += 1) {
      expect(onRamps.sessions).toContain(`recipe ${String(ordinal)}`);
    }
  });

  it("keeps every body plain JavaScript with a return", () => {
    for (const recipe of recipes) {
      expect({ recipe: recipe.title, hasReturn: recipe.body.includes("return ") }).toEqual({
        recipe: recipe.title,
        hasReturn: true,
      });
      expect(recipe.body).not.toMatch(/^\s*import\s/mu);
      expect(recipe.body).not.toMatch(/^\s*export\s/mu);
      // Single quotes would break the documented `sdp q '<body>'` invocation in any shell.
      expect(recipe.body).not.toContain("'");
    }
  });

  it("runs every body through the front door without throwing", async () => {
    for (const recipe of recipes) {
      const value = await runRecipe(recipe);

      expect({ recipe: recipe.title, returned: value !== null && value !== undefined }).toEqual({
        recipe: recipe.title,
        returned: true,
      });
    }
  });

  it("returns the non-example build backlog and audits excluded example evidence", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(1)));
    const byFamily = asRecord(result.byFamily);
    const entries = Object.values(byFamily).flatMap((family) => asArray(family));

    expect(numberAt(result, "total")).toBe(entries.length);

    // Completeness, not just soundness: the rows must be exactly the operational ready,
    // unimplemented set excluding example evidence and decision records. Both exclusions are
    // checked separately so the backlog filter cannot hide either census.
    const expected = [...primitivesById.values()]
      .filter(
        (node) =>
          node.readiness === "ready" &&
          node.specKind !== "example" &&
          node.specKind !== "decision" &&
          !(node.deliveryFacts ?? []).includes("implemented"),
      )
      .map((node) => node.id)
      .sort();

    expect(entries.map((entry) => stringAt(asRecord(entry), "id")).sort()).toEqual(expected);

    const excluded = [...primitivesById.values()].filter(
      (node) =>
        node.readiness === "ready" &&
        node.specKind === "example" &&
        !(node.deliveryFacts ?? []).includes("implemented"),
    );
    const excludedWithoutVerifier = excluded
      .filter((node) => !(node.deliveryFacts ?? []).includes("has-verifier"))
      .map((node) => node.id)
      .sort();

    const excludedDecisions = [...primitivesById.values()].filter(
      (node) =>
        node.readiness === "ready" &&
        node.specKind === "decision" &&
        !(node.deliveryFacts ?? []).includes("implemented"),
    );

    expect(numberAt(result, "excludedReadyExamples")).toBe(excluded.length);
    expect(numberAt(result, "excludedReadyDecisions")).toBe(excludedDecisions.length);
    expect(
      asArray(result.excludedWithoutVerifier)
        .map((id) => {
          if (typeof id !== "string") {
            throw new Error(`expected an excluded example id, got ${JSON.stringify(id)}`);
          }

          return id;
        })
        .sort(),
    ).toEqual(excludedWithoutVerifier);
  });

  it("returns a drift alarm of code-bound specs below ready, with the floor named", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(2)));
    const alarms = asArray(result.alarms);

    expect(numberAt(result, "total")).toBe(alarms.length);

    // Completeness, not just soundness: the alarm must name exactly the graph's
    // `implemented ∧ ¬ready` set — a silently shortened alarm is the lie this catalog exists
    // to prevent.
    const expected = [...primitivesById.values()]
      .filter(
        (node) => (node.deliveryFacts ?? []).includes("implemented") && node.readiness !== "ready",
      )
      .map((node) => node.id)
      .sort();

    expect(alarms.map((alarm) => stringAt(asRecord(alarm), "id")).sort()).toEqual(expected);

    for (const alarm of alarms) {
      const row = asRecord(alarm);

      expect([...rungs, "none"]).toContain(stringAt(row, "floorReached"));
      expect(Object.keys(row)).toContain("firstUnmetClause");
    }
  });

  it("returns one spec's guarantees with its relations and verifier bindings", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(3)));

    expect(result.found).not.toBe(false);
    expect(primitivesById.has(stringAt(result, "id"))).toBe(true);
    expect(asArray(result.sections).length).toBeGreaterThan(0);
    // The binding-language guard: a verifier binding is existence, and the recipe says so.
    expect(stringAt(result, "verifierBindingMeans")).toContain("exists");

    for (const end of [...asArray(result.relationsOut), ...asArray(result.relationsIn)]) {
      expect(claims).toContain(stringAt(asRecord(end), "claim"));
    }

    for (const binding of asArray(result.verifiers)) {
      const row = asRecord(binding);

      expect(claims).toContain(stringAt(row, "claim"));
      expect(typeof row.enabled).toBe("boolean");
    }

    for (const binding of asArray(result.implementations)) {
      expect(claims).toContain(stringAt(asRecord(binding), "claim"));
    }
  });

  it("keeps hostile changed filenames as inert JSON data", async () => {
    const sentinel = `/tmp/sdp-recipe-4-${String(process.pid)}-sentinel`;
    const hostileChangedFiles = [
      `changed-"double"-${sentinel}.ts`,
      "changed-'single'.ts",
      "changed-`backtick`.ts",
      `changed-$(touch ${sentinel}).ts`,
      "changed:semicolon;name.ts",
      "changed with spaces.ts",
      "changed-Unicode-Δ-文件.ts",
      "changed-embedded\nnewline.ts",
    ];
    const recipe = recipeByOrdinal(4);
    rmSync(sentinel, { force: true });

    expect(recipe.body).toContain("params.files");
    expect(recipe.body).not.toContain("process.env");
    for (const filename of hostileChangedFiles) {
      expect(recipe.body).not.toContain(filename);
    }

    try {
      const result = asRecord(await runRecipe(recipe, { files: hostileChangedFiles }));

      expect([...asArray(result.changedFiles)].sort()).toEqual([...hostileChangedFiles].sort());
      expect([...asArray(result.coverageUnknownFiles)].sort()).toEqual(
        [...hostileChangedFiles].sort(),
      );
      expect(existsSync(sentinel)).toBe(false);
    } finally {
      rmSync(sentinel, { force: true });
    }
  });

  it("returns the complete diff-to-at-risk bridge", async () => {
    const normalChangedFiles = ["src/reader/reader.ts", "docs/agent-surface/recipes.md"];
    const result = asRecord(await runRecipe(recipeByOrdinal(4), { files: normalChangedFiles }));
    const changedFiles = asArray(result.changedFiles).map((file) => stringAt({ file }, "file"));
    const radius = reader.blastRadius(changedFiles);

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        "changedFiles",
        "impactedSpecs",
        "atRiskSpecs",
        "atRiskOther",
        "coverageUnknownFiles",
        "unlinkedUnits",
      ]),
    );
    expect(changedFiles).toEqual(radius.changedFiles);

    const impactedSpecs = asArray(result.impactedSpecs);
    expect(impactedSpecs.map((item) => stringAt(asRecord(item), "id")).sort()).toEqual(
      radius.impactedSpecs.map((item) => item.id).sort(),
    );

    for (const item of impactedSpecs) {
      const row = asRecord(item);
      const expected = radius.impactedSpecs.find(
        (candidate) => candidate.id === stringAt(row, "id"),
      );

      expect(expected).toBeDefined();
      expect(asArray(row.reasons).length).toBeGreaterThan(0);
      expect(asArray(row.reasons)).toEqual(
        expected?.reasons.map((reason) =>
          reason.throughBinding === undefined
            ? { file: reason.file, via: null }
            : {
                file: reason.file,
                via: reason.throughBinding.id,
                edgeType: reason.throughBinding.edgeType,
                claim: reason.throughBinding.claim,
              },
        ),
      );

      for (const reason of asArray(row.reasons)) {
        const shaped = asRecord(reason);
        if (shaped.via === null) {
          expect(shaped).toEqual({ file: expect.any(String) as unknown, via: null });
        } else {
          expect(stringAt(shaped, "edgeType")).toBeTruthy();
          expect(claims).toContain(stringAt(shaped, "claim"));
        }
      }
    }

    const atRiskRows = [...asArray(result.atRiskSpecs), ...asArray(result.atRiskOther)];
    expect(atRiskRows.map((item) => stringAt(asRecord(item), "id")).sort()).toEqual(
      radius.atRisk.map((item) => item.id).sort(),
    );

    const expectedAtRisk = radius.atRisk
      .map((item) => ({
        id: item.id,
        nodeType: item.nodeType,
        reasons: item.reasons.map((reason) => ({
          from: reason.from,
          edgeType: reason.edgeType,
          to: reason.to,
          claim: reason.claim,
        })),
      }))
      .sort((left, right) => left.id.localeCompare(right.id));
    expect(
      atRiskRows
        .map((item) => {
          const row = asRecord(item);
          return {
            id: stringAt(row, "id"),
            nodeType: stringAt(row, "nodeType"),
            reasons: asArray(row.reasons),
          };
        })
        .sort((left, right) => left.id.localeCompare(right.id)),
    ).toEqual(expectedAtRisk);

    for (const reason of atRiskRows.flatMap((item) => asArray(asRecord(item).reasons))) {
      expect(claims).toContain(stringAt(asRecord(reason), "claim"));
    }

    for (const item of asArray(result.atRiskOther)) {
      expect(stringAt(asRecord(item), "nodeType")).not.toBe("Primitive");
    }

    expect(asArray(result.coverageUnknownFiles)).toEqual(radius.coverageUnknown);
    expect(asArray(result.unlinkedUnits)).toEqual(
      radius.unlinked.map((unit) => ({ id: unit.id, file: unit.file })),
    );
  });

  it("names a changed identity-only unit as unlinked, never coverage-unknown or dropped", async () => {
    const file = "src/probe/identity-only.ts";
    const unit: GraphNode = {
      id: "impl:probe.identity-only",
      nodeType: "CodeNode",
      claim: "anchored",
      file,
      line: 1,
    };
    const extraction: ExtractionResult = {
      counts: derived.counts,
      report: derived.report,
      graph: {
        schemaVersion: derived.graph.schemaVersion,
        nodes: [...derived.graph.nodes, unit],
        edges: derived.graph.edges,
      },
    };
    const result = asRecord(await runRecipe(recipeByOrdinal(4), { files: [file] }, extraction));

    expect(result.unlinkedUnits).toEqual([{ id: unit.id, file }]);
    expect(result.coverageUnknownFiles).toEqual([]);
    expect(result.impactedSpecs).toEqual([]);
  });

  it("returns a pack's review backbone with its verifier gaps", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(5)));
    const members = numberAt(result, "memberCount");
    const byStatedReadiness = asRecord(result.byStatedReadiness);

    expect(stringAt(result, "id").startsWith("pack:")).toBe(true);
    expect(Object.keys(byStatedReadiness).length).toBeGreaterThan(0);
    expect(
      Object.values(byStatedReadiness).reduce<number>((sum, count) => sum + Number(count), 0),
    ).toBe(members);

    for (const gap of asArray(result.verifierGaps)) {
      const row = asRecord(gap);

      expect(typeof row.priority).toBe("boolean");
      expect(primitivesById.has(stringAt(row, "id"))).toBe(true);
    }
  });

  it("returns concept matches carrying the fields that matched", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(6)));
    const matches = asArray(result.matches);

    expect(stringAt(result, "term").length).toBeGreaterThan(0);
    expect(numberAt(result, "total")).toBeGreaterThanOrEqual(matches.length);

    for (const match of matches) {
      const row = asRecord(match);

      expect(stringAt(row, "nodeType").length).toBeGreaterThan(0);
      expect(asArray(row.matchedIn).length).toBeGreaterThan(0);
    }
  });

  it("returns readiness divergence as an array, where empty is lawful", async () => {
    const rows = asArray(await runRecipe(recipeByOrdinal(7)));

    // Empty is lawful only when the corpus really diverges nowhere: the expectation re-runs the
    // stated-versus-derived comparison over the reader, so a body that drops rows reddens even on
    // the healthy corpus where the honest answer is [].
    const rank = (rung: string | undefined): number =>
      rung === undefined ? -1 : rungs.indexOf(rung);
    const expected = reader
      .specs()
      .filter((spec) => rank(spec.derivedReadiness) < rank(spec.statedReadiness))
      .map((spec) => spec.id)
      .sort();

    expect(rows.map((entry) => stringAt(asRecord(entry), "id")).sort()).toEqual(expected);

    for (const entry of rows) {
      const row = asRecord(entry);

      expect(primitivesById.has(stringAt(row, "id"))).toBe(true);
      expect(rungs).toContain(stringAt(row, "statedReadiness"));
      expect([...rungs, "none"]).toContain(stringAt(row, "floorReached"));
    }
  });

  it("returns the warn-level signals as data rather than as a gate", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(8)));
    const signals = asArray(result.signals);

    expect(numberAt(result, "errors")).toBeGreaterThanOrEqual(0);
    expect(numberAt(result, "warnings")).toBeGreaterThanOrEqual(signals.length);

    for (const signal of signals) {
      const row = asRecord(signal);

      expect(["conformance", "honesty"]).toContain(stringAt(row, "family"));
      expect(stringAt(row, "message").length).toBeGreaterThan(0);
    }
  });

  it("returns promotion preflight without conferring a readiness edit", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(9)));

    expect(result.found).toBe(true);
    expect(primitivesById.has(stringAt(result, "id"))).toBe(true);
    expect(rungs).toContain(stringAt(result, "statedReadiness"));
    expect([...rungs, "none"]).toContain(stringAt(result, "floorReached"));
    expect(result.promotionRequiresHumanStatement).toBe(true);
    expect(Array.isArray(result.currentFloorFailures)).toBe(true);
    // Every field the recipe reported stays, and the next rung's failures join them.
    expect(Object.keys(result)).toEqual([
      "id",
      "found",
      "statedReadiness",
      "floorReached",
      "nextRung",
      "currentFloorFailures",
      "firstUnmetClause",
      "nextRungFailures",
      "nextRungFirstUnmetClause",
      "promotionRequiresHumanStatement",
    ]);
    const context = reader.specContext(stringAt(result, "id"));
    expect(result.nextRungFailures).toEqual(
      JSON.parse(JSON.stringify(context?.nextRungFailures)) as unknown,
    );
    expect(result.nextRungFirstUnmetClause).toBe(context?.nextRungFailures[0]?.clauseId ?? null);
  });

  it("names the next rung's unmet clause and the dependency that breaks it on a probe", async () => {
    const recipe = recipeByOrdinal(9);
    const ruleNode = (
      id: string,
      readiness: "idea" | "scoped" | "defined" | "ready",
      blocking = false,
    ) => ({
      id,
      nodeType: "Primitive" as const,
      claim: "declared" as const,
      specKind: "rule" as const,
      altitude: "story" as const,
      readiness,
      title: id,
      file: "specs/probe.sdp.md",
      sections: {
        intent: {
          outcome: "Probe promotion preflight.",
          ...(blocking ? { openQuestions: [{ question: "Settled?", blocking: true }] } : {}),
        },
        behavior: { rules: ["The probe states one rule."] },
      },
    });
    const declared = (from: string, type: "refines" | "dependsOn" | "decidedBy", to: string) => ({
      from,
      to,
      type,
      claim: "declared" as const,
    });
    const probe: ExtractionResult = {
      ...derived,
      graph: {
        schemaVersion: derived.graph.schemaVersion,
        nodes: [
          ruleNode("spec:probe.subject", "defined"),
          ruleNode("spec:probe.basis", "scoped"),
          ruleNode("spec:probe.held", "scoped", true),
          {
            id: "impl:probe.code",
            nodeType: "CodeNode",
            claim: "anchored",
            file: "src/probe.ts",
          },
        ],
        edges: [
          declared("spec:probe.subject", "dependsOn", "spec:probe.basis"),
          declared("spec:probe.subject", "decidedBy", "impl:probe.code"),
          declared("spec:probe.basis", "refines", "spec:probe.subject"),
          declared("spec:probe.held", "refines", "spec:probe.subject"),
        ],
      },
    };
    const targetClause = "typed-dependency-targets-are-defined";

    expect(await runRecipe(recipe, { spec: "spec:probe.subject" }, probe)).toEqual({
      id: "spec:probe.subject",
      found: true,
      statedReadiness: "defined",
      floorReached: "defined",
      nextRung: "ready",
      currentFloorFailures: [],
      firstUnmetClause: null,
      nextRungFailures: [
        {
          clauseId: targetClause,
          description:
            "Every refines, dependsOn, constrainedBy, and decidedBy target states at least defined.",
          targets: [
            { type: "dependsOn", id: "spec:probe.basis", statedReadiness: "scoped" },
            { type: "decidedBy", id: "impl:probe.code" },
          ],
        },
      ],
      nextRungFirstUnmetClause: targetClause,
      promotionRequiresHumanStatement: true,
    });

    // A failure of any other clause carries no targets field.
    const held = asRecord(await runRecipe(recipe, { spec: "spec:probe.held" }, probe));
    expect(held.nextRung).toBe("defined");
    expect(held.nextRungFailures).toEqual([
      {
        clauseId: "no-blocking-open-questions",
        description: "Spec has no blocking open question in intent.openQuestions.",
      },
    ]);
    expect(held.nextRungFirstUnmetClause).toBe("no-blocking-open-questions");
  });

  it("keeps declared examples distinct from enabled verifier bindings", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(10)));
    const rows = asArray(result.rows);
    // The completeness predicate mirrors the recipe's row predicate exactly: a spec whose only
    // binding is an off-contract (not-enabled, non-example) verify edge lawfully produces no row.
    const expected = reader
      .specs()
      .filter((spec) => {
        const verifiers = reader.specContext(spec.id)?.verifiers ?? [];

        return verifiers.some((binding) => binding.via === "example" || binding.enabled);
      })
      .map((spec) => spec.id)
      .sort();

    expect(numberAt(result, "total")).toBe(rows.length);
    expect(rows.map((row) => stringAt(asRecord(row), "id")).sort()).toEqual(expected);

    let withDeclaredOnly = 0;

    for (const row of rows) {
      const record = asRecord(row);
      const id = stringAt(record, "id");
      const verifiers = reader.specContext(id)?.verifiers ?? [];
      const declared = verifiers
        .filter((binding) => binding.via === "example")
        .map((binding) => binding.verifierId);
      const enabled = verifiers
        .filter((binding) => binding.enabled)
        .map((binding) => binding.verifierId);

      expect(asArray(record.declared)).toEqual(declared);
      expect(asArray(record.enabled)).toEqual(enabled);

      if (declared.some((verifierId) => !enabled.includes(verifierId))) {
        withDeclaredOnly += 1;
      }
    }

    expect(numberAt(result, "withDeclaredOnly")).toBe(withDeclaredOnly);
  });

  it("returns the complete non-ready ladder grouped by family", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(11)));
    const rows = Object.values(asRecord(result.byFamily)).flatMap((family) => asArray(family));
    const expected = reader
      .specs()
      .filter((spec) => spec.statedReadiness !== "ready")
      .map((spec) => spec.id)
      .sort();

    expect(numberAt(result, "total")).toBe(rows.length);
    expect(rows.map((row) => stringAt(asRecord(row), "id")).sort()).toEqual(expected);
  });

  it("returns every committed structural component with non-empty membership", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(12)));
    const rows = asArray(result.components).map(asRecord);
    const expectedIds = [...expectedComponentIds].sort();

    expect(rows.map((row) => stringAt(row, "id")).sort()).toEqual(expectedIds);

    for (const row of rows) {
      const id = stringAt(row, "id");
      const members = asArray(row.members).map((member) => stringAt({ member }, "member"));
      const expectedMembers = derived.graph.edges
        .filter((edge) => edge.type === "memberOf" && edge.to === id)
        .map((edge) => edge.from)
        .sort();

      expect(members).toEqual(expectedMembers);
      expect(members.length).toBeGreaterThan(0);
      expect(numberAt(row, "memberCount")).toBe(members.length);
    }
  });

  it("returns exact component uses fan-in and fan-out from the structural oracle", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(13)));
    const rows = asArray(result.components).map(asRecord);
    const expectedUses = expectedUsesEdges.map(([from, to]) => ({ from, to }));

    expect(rows.map((row) => stringAt(row, "id")).sort()).toEqual([...expectedComponentIds].sort());

    for (const row of rows) {
      const id = stringAt(row, "id");
      const usesOut = asArray(row.usesOut).map((target) => stringAt({ target }, "target"));
      const usedBy = asArray(row.usedBy).map((source) => stringAt({ source }, "source"));
      const expectedOut = expectedUses
        .filter((edge) => edge.from === id)
        .map((edge) => edge.to)
        .sort();
      const expectedIn = expectedUses
        .filter((edge) => edge.to === id)
        .map((edge) => edge.from)
        .sort();

      expect(usesOut).toEqual(expectedOut);
      expect(usedBy).toEqual(expectedIn);
      expect(numberAt(row, "fanOut")).toBe(expectedOut.length);
      expect(numberAt(row, "fanIn")).toBe(expectedIn.length);
    }

    expect(rows.some((row) => numberAt(row, "fanOut") > 0)).toBe(true);
    expect(rows.some((row) => numberAt(row, "fanIn") > 0)).toBe(true);
  });

  it("returns a component structural neighborhood and an exact absent shape", async () => {
    const recipe = recipeByOrdinal(14);
    const result = asRecord(await runRecipe(recipe));
    const id = "component:protocol.reader";
    const members = derived.graph.edges
      .filter((edge) => edge.type === "memberOf" && edge.to === id)
      .map((edge) => edge.from)
      .sort();
    const usesOut = derived.graph.edges
      .filter((edge) => edge.type === "uses" && edge.from === id)
      .map((edge) => edge.to)
      .sort();
    const usedBy = derived.graph.edges
      .filter((edge) => edge.type === "uses" && edge.to === id)
      .map((edge) => edge.from)
      .sort();
    const satisfiedSpecs = [
      ...new Set(
        derived.graph.edges
          .filter((edge) => edge.type === "satisfies" && members.includes(edge.from))
          .map((edge) => edge.to),
      ),
    ].sort();

    expect(result).toEqual({
      found: true,
      id,
      members,
      usesOut,
      usedBy,
      satisfiedSpecs,
    });

    const absent = await runRecipe(recipe, { component: "component:protocol.nonexistent" });
    expect(absent).toEqual({ found: false });
  });

  it("reports census structural coverage from graph and report ground truth", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(15)));
    const expected = structuralGroundTruth();
    const expectedFindings = expected.danglingStructuralFindings.map(
      (finding) => finding.subjectId ?? finding.relatedId ?? finding.validatorId,
    );

    for (const [key, count, ids] of [
      ["components", expected.components.length, expected.components],
      ["memberOfEdges", expected.memberOfEdges.length, expected.memberOfEdges.map(edgeId).sort()],
      ["usesEdges", expected.usesEdges.length, expected.usesEdges.map(edgeId).sort()],
      ["danglingStructuralFindings", expectedFindings.length, expectedFindings.sort()],
    ] as const) {
      const row = asRecord(result[key]);
      expect(numberAt(row, "count")).toBe(count);
      expect(asArray(row.ids)).toEqual(ids);
    }
  });

  it("reports graph-side upper bounds for every shipped projection root", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(16)));
    const primitiveCount = derived.graph.nodes.filter(
      (node) => node.nodeType === "Primitive",
    ).length;
    const packCount = derived.graph.nodes.filter((node) => node.nodeType === "Pack").length;
    const anchorCount = derived.graph.nodes.filter(
      (node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode",
    ).length;
    const memberSpecCount = derived.graph.edges.filter((edge) => edge.type === "belongsTo").length;
    const diagramSubjectCount = primitiveCount + packCount;

    expect(result).toEqual({
      designReview: { packs: packCount, memberSpecs: memberSpecCount },
      census: { specs: primitiveCount, anchors: anchorCount },
      mermaid: { diagramSubjects: diagramSubjectCount },
      gherkin: { specs: primitiveCount },
    });
  });

  it("returns the architecture map of every live component with recomputed fan-in and fan-out", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(17)));
    const rows = asArray(result.components).map(asRecord);
    const expected = structuralGroundTruth();
    const componentIds = new Set(expected.components);
    const ownerByMember = new Map(
      expected.memberOfEdges.map((edge) => [edge.from, edge.to] as const),
    );
    const ownerOf = (id: string): string | undefined =>
      componentIds.has(id) ? id : ownerByMember.get(id);
    const usesOutByComponent = new Map<string, Set<string>>();
    const usedByByComponent = new Map<string, Set<string>>();

    for (const edge of expected.usesEdges) {
      const from = ownerOf(edge.from);
      const to = ownerOf(edge.to);
      if (from === undefined || to === undefined || from === to) {
        continue;
      }

      const outgoing = usesOutByComponent.get(from) ?? new Set<string>();
      outgoing.add(to);
      usesOutByComponent.set(from, outgoing);
      const incoming = usedByByComponent.get(to) ?? new Set<string>();
      incoming.add(from);
      usedByByComponent.set(to, incoming);
    }

    const ids = rows.map((row) => stringAt(row, "id")).sort();
    expect(ids).toEqual(expected.components);
    expect(ids).toContain("component:protocol.import");
    expect(ids).toContain("component:protocol.testing");

    for (const row of rows) {
      const id = stringAt(row, "id");
      const expectedOut = [...(usesOutByComponent.get(id) ?? [])].sort();
      const expectedIn = [...(usedByByComponent.get(id) ?? [])].sort();
      const expectedMemberIds = expected.memberOfEdges
        .filter((edge) => edge.to === id)
        .map((edge) => edge.from)
        .sort();
      const members = asArray(row.members).map(asRecord);

      expect(row.declared).toBe(true);
      expect(numberAt(row, "fanOut")).toBe(expectedOut.length);
      expect(numberAt(row, "fanIn")).toBe(expectedIn.length);
      expect(members.map((member) => stringAt(member, "id")).sort()).toEqual(expectedMemberIds);

      const anchorIds = new Set([id, ...expectedMemberIds]);
      const expectedSatisfied = [
        ...new Set(
          derived.graph.edges
            .filter((edge) => edge.type === "satisfies" && anchorIds.has(edge.from))
            .map((edge) => edge.to),
        ),
      ].sort();
      expect(asArray(row.satisfiedSpecs)).toEqual(expectedSatisfied);

      const expectedShaping = new Map<string, string[]>();
      for (const edge of derived.graph.edges.filter(
        (candidate) => candidate.type === "decidedBy" && expectedSatisfied.includes(candidate.from),
      )) {
        const subjects = expectedShaping.get(edge.to) ?? [];
        subjects.push(edge.from);
        expectedShaping.set(edge.to, subjects);
      }
      expect(asArray(row.shapingDecisions).map(asRecord)).toEqual(
        [...expectedShaping]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([decisionId, subjects]) => ({
            id: decisionId,
            subjects: [...new Set(subjects)].sort(),
          })),
      );
    }

    expect(asArray(result.unresolvedUses)).toEqual([]);
  });

  it("explains the shared policy and adapter collaborations from graph intent and binding claims", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(17)));
    const uses = asArray(result.usesEdges).map(asRecord);
    expect(uses.filter((edge) => edge.to === "impl:protocol.delivery-facts")).toEqual(
      [
        "impl:protocol.authored-honesty-delivery-facts",
        "impl:protocol.derive-graph",
        "impl:protocol.reader",
      ].map((from) => ({ from, to: "impl:protocol.delivery-facts", claim: "anchored" })),
    );
    expect(uses).toContainEqual({
      from: "impl:protocol.example-runner-adapter",
      to: "impl:protocol.example-runner",
      claim: "anchored",
    });

    const subjects = asArray(result.subjects).map(asRecord);
    for (const [id, concept] of [
      ["spec:extraction.delivery-facts", "Shared policy"],
      ["spec:extraction.example-runner", "Ports and adapters"],
      ["spec:extraction.derive-graph", "One read model"],
    ] as const) {
      const subject = subjects.find((row) => row.id === id);
      expect(subject).toMatchObject({ id, resolved: true, specKind: "behavior" });
      expect(subject?.design).toContain(concept);
      expect(reader.findByConcept(concept).map((node) => node.id)).toContain(id);
    }

    for (const id of [
      "spec:extraction.derive-graph",
      "spec:consumers.reader",
      "spec:validation.authored-honesty",
    ]) {
      const subject = subjects.find((row) => row.id === id);
      expect(asArray(subject?.relations)).toContainEqual(
        expect.objectContaining({
          type: "dependsOn",
          otherId: "spec:extraction.delivery-facts",
          claim: "declared",
          resolved: true,
        }),
      );
    }

    const graphComponent = asArray(result.components)
      .map(asRecord)
      .find((row) => row.id === "component:protocol.graph");
    expect(asArray(graphComponent?.realizations)).toContainEqual({
      from: "impl:protocol.delivery-facts",
      to: "spec:extraction.delivery-facts",
      claim: "anchored",
    });
    expect(asArray(graphComponent?.usedBy)).toEqual([
      "component:protocol.cli",
      "component:protocol.codegen",
      "component:protocol.extract",
      "component:protocol.projections",
      "component:protocol.reader",
      "component:protocol.validate",
    ]);
    const derivation = subjects.find((row) => row.id === "spec:extraction.derive-graph");
    expect(asArray(derivation?.relations)).toContainEqual(
      expect.objectContaining({
        type: "constrainedBy",
        otherId: "spec:extraction.determinism",
        claim: "declared",
      }),
    );
  });

  it("retains local uses and their claims without counting a component as its own dependency", async () => {
    const template = derived.graph.edges.find((edge) => edge.type === "uses");
    if (template === undefined) throw new Error("expected a uses edge template");
    const localUse = {
      ...template,
      from: "impl:protocol.delivery-facts",
      to: "impl:protocol.example-space",
      claim: "inferred" as const,
    };
    const dirty = {
      ...derived,
      graph: { ...derived.graph, edges: [...derived.graph.edges, localUse] },
    };
    const result = asRecord(await runRecipe(recipeByOrdinal(17), undefined, dirty));
    expect(asArray(result.usesEdges)).toContainEqual({
      from: localUse.from,
      to: localUse.to,
      claim: "inferred",
    });
    const component = asArray(result.components)
      .map(asRecord)
      .find((row) => row.id === "component:protocol.graph");
    expect(asArray(component?.usesOut)).not.toContain("component:protocol.graph");
    expect(asArray(component?.usedBy)).not.toContain("component:protocol.graph");
    expect(component?.fanOut).toBe(2);
    expect(component?.fanIn).toBe(6);
  });

  it("preserves an unresolved responsibility without inventing its design", async () => {
    const missingId = "spec:extraction.delivery-facts";
    const dirty = {
      ...derived,
      graph: {
        ...derived.graph,
        nodes: derived.graph.nodes.filter((node) => node.id !== missingId),
      },
    };
    const result = asRecord(await runRecipe(recipeByOrdinal(17), undefined, dirty));
    expect(asArray(result.subjects)).toContainEqual({
      id: missingId,
      resolved: false,
      title: null,
      specKind: null,
      outcome: null,
      design: null,
      relations: [],
    });
  });

  // Given: a clone of the live ExtractionResult with component:protocol.testing removed while its
  // memberOf edge survives, plus one synthetic uses edge aimed at a component id no node declares.
  // When: catalog recipe 17 runs through real runSdpCli on that override.
  // Then: the dangling component keeps a declared:false row with its members, and the uses edge
  // with no resolvable owner surfaces in unresolvedUses instead of silently dropping.
  it("keeps a dangling component row and surfaces unresolved uses edges", async () => {
    const missingComponentId = "component:protocol.testing";
    const retainedMemberId = "impl:protocol.example-testing-helpers";
    const usesEdgeTemplate = derived.graph.edges.find((edge) => edge.type === "uses");
    if (usesEdgeTemplate === undefined) {
      throw new Error("live graph has no uses edge to clone");
    }

    const ghostTargetId = "component:protocol.nonexistent";
    const dirty: ExtractionResult = {
      counts: derived.counts,
      report: derived.report,
      graph: {
        schemaVersion: derived.graph.schemaVersion,
        nodes: derived.graph.nodes.filter((node) => node.id !== missingComponentId),
        edges: [
          ...derived.graph.edges,
          { ...usesEdgeTemplate, from: "component:protocol.cli", to: ghostTargetId },
        ],
      },
    };

    const result = asRecord(await runRecipe(recipeByOrdinal(17), undefined, dirty));
    const dangling = asArray(result.components)
      .map(asRecord)
      .find((row) => stringAt(row, "id") === missingComponentId);

    if (dangling === undefined) {
      throw new Error(`architecture map dropped the dangling ${missingComponentId} row`);
    }

    expect(dangling.declared).toBe(false);
    expect(asArray(dangling.members).map((member) => stringAt(asRecord(member), "id"))).toContain(
      retainedMemberId,
    );
    expect(asArray(result.unresolvedUses).map(asRecord)).toContainEqual({
      from: "component:protocol.cli",
      to: ghostTargetId,
    });
  });

  // Given: a clone of the live ExtractionResult with impl:protocol.agent-surface removed
  // and its memberOf edge retained — invalid, but still a graph validateGraph can report.
  // When: catalog recipe 17 runs through real runSdpCli on that override.
  // Then: validateGraph reports conformance/referential-integrity, the sink exits 0, and
  // the unresolved member row keeps null label/file/line under component:protocol.reader.
  it("preserves an unresolved architecture-map member when memberOf outlives the node", async () => {
    const missingMemberId = "impl:protocol.agent-surface";
    const ownerComponentId = "component:protocol.reader";
    const dirty: ExtractionResult = {
      counts: derived.counts,
      report: derived.report,
      graph: {
        schemaVersion: derived.graph.schemaVersion,
        nodes: derived.graph.nodes.filter((node) => node.id !== missingMemberId),
        edges: derived.graph.edges,
      },
    };

    expect(dirty.graph.nodes.some((node) => node.id === missingMemberId)).toBe(false);
    expect(
      dirty.graph.edges.some(
        (edge) =>
          edge.type === "memberOf" && edge.from === missingMemberId && edge.to === ownerComponentId,
      ),
    ).toBe(true);

    const graphReport = validateGraph(dirty.graph);
    expect(
      graphReport.findings.some(
        (finding) =>
          finding.family === "conformance" &&
          finding.validatorId === "conformance/referential-integrity" &&
          (finding.subjectId === missingMemberId || finding.relatedId === missingMemberId),
      ),
    ).toBe(true);

    const result = asRecord(await runRecipe(recipeByOrdinal(17), undefined, dirty));
    const owner = asArray(result.components)
      .map(asRecord)
      .find((row) => stringAt(row, "id") === ownerComponentId);

    if (owner === undefined) {
      throw new Error(`architecture map has no row for ${ownerComponentId}`);
    }

    const unresolved = asArray(owner.members)
      .map(asRecord)
      .find((row) => stringAt(row, "id") === missingMemberId);

    expect(unresolved).toEqual({
      id: missingMemberId,
      label: null,
      file: null,
      line: null,
    });
  });

  it("returns the decision map ranked by live shaping fan-in", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(18)));
    const ranking = asArray(result.ranking).map(asRecord);
    const decisionIds = new Set(
      derived.graph.nodes
        .filter((node) => node.nodeType === "Primitive" && node.specKind === "decision")
        .map((node) => node.id),
    );
    const interDecisionFanIn = (id: string, type: string): number =>
      derived.graph.edges.filter(
        (edge) =>
          edge.type === type &&
          edge.to === id &&
          decisionIds.has(edge.from) &&
          decisionIds.has(edge.to),
      ).length;
    const decidedSubjectCount = (id: string): number =>
      new Set(
        derived.graph.edges
          .filter((edge) => edge.type === "decidedBy" && edge.to === id)
          .map((edge) => edge.from),
      ).size;
    const shapingFanIn = (id: string): number =>
      interDecisionFanIn(id, "dependsOn") +
      interDecisionFanIn(id, "refines") +
      decidedSubjectCount(id);

    expect(numberAt(result, "total")).toBe(decisionIds.size);
    expect(ranking.length).toBe(decisionIds.size);

    const fanIns = ranking.map((row) => numberAt(row, "fanIn"));
    expect(fanIns).toEqual([...fanIns].sort((left, right) => right - left));

    const top = ranking[0];
    if (top === undefined) {
      throw new Error("decision map ranking is empty");
    }

    expect(numberAt(top, "fanIn")).toBe(shapingFanIn(stringAt(top, "id")));

    for (const row of ranking) {
      expect(numberAt(row, "fanIn")).toBe(shapingFanIn(stringAt(row, "id")));
    }
  });

  it("returns a planning-slice neighborhood and an exact absent shape", async () => {
    const recipe = recipeByOrdinal(19);
    const result = asRecord(await runRecipe(recipe));
    const id = "spec:consumers.agent-surface";
    const parents = [
      ...new Set(
        derived.graph.edges
          .filter((edge) => edge.type === "refines" && edge.from === id)
          .map((edge) => edge.to),
      ),
    ].sort();
    const children = [
      ...new Set(
        derived.graph.edges
          .filter((edge) => edge.type === "refines" && edge.to === id)
          .map((edge) => edge.from),
      ),
    ].sort();

    expect(result.found).toBe(true);
    expect(stringAt(result, "id")).toBe(id);
    expect(asRecord(result.refinementNeighborhood)).toEqual({ parents, children });

    const readinessById = new Map(
      derived.graph.nodes
        .filter((node) => node.nodeType === "Primitive")
        .map((node) => [node.id, node.readiness] as const),
    );
    const dependencyNeighbors = (end: "from" | "to"): readonly Record<string, unknown>[] =>
      [
        ...new Set(
          derived.graph.edges
            .filter(
              (edge) => edge.type === "dependsOn" && edge[end === "to" ? "from" : "to"] === id,
            )
            .map((edge) => edge[end]),
        ),
      ]
        .sort()
        .map((specId) => ({
          id: specId,
          statedReadiness: readinessById.get(specId) ?? null,
        }));
    expect(asRecord(result.dependencies)).toEqual({
      dependsOn: dependencyNeighbors("to"),
      dependedOnBy: dependencyNeighbors("from"),
    });

    const expectedShaping = new Map<string, string[]>();
    for (const edge of derived.graph.edges.filter(
      (candidate) =>
        candidate.type === "decidedBy" && [id, ...parents, ...children].includes(candidate.from),
    )) {
      const subjects = expectedShaping.get(edge.to) ?? [];
      subjects.push(edge.from);
      expectedShaping.set(edge.to, subjects);
    }
    expect(asArray(result.shapingDecisions).map(asRecord)).toEqual(
      [...expectedShaping]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([decisionId, subjects]) => ({
          id: decisionId,
          subjects: [...new Set(subjects)].sort(),
        })),
    );
    expect(Object.keys(result)).not.toContain("constrainingDecisions");
    expect(Object.keys(result)).not.toContain("blastRadiusEntryPoints");

    const unknownId = "spec:consumers.nonexistent";
    const absent = await runRecipe(recipe, { spec: unknownId });
    expect(absent).toEqual({ id: unknownId, found: false });
  });

  // Given: catalog recipe 19 with its parameter naming the structural-anchor
  // decision (live graph: one outgoing dependsOn, two inbound dependsOn from MD-34/MD-35).
  // When: the otherwise unchanged body runs through real runSdpCli.
  // Then: dependencies.dependsOn and dependencies.dependedOnBy are both non-empty and name the
  // exact ready decision neighbors — so dropping, reversing, renaming, or readiness-skewing either
  // direction reddens this characterization.
  it("returns non-empty bidirectional dependencies for the structural-anchor planning slice", async () => {
    const recipe = recipeByOrdinal(19);
    const catalogId = "spec:consumers.agent-surface";
    const id = "spec:decisions.structural-anchor-semantics";
    expect(recipe.body).toContain(`const id = params.spec ?? "${catalogId}";`);

    const result = asRecord(await runRecipe(recipe, { spec: id }));
    const dependencies = asRecord(result.dependencies);
    const dependsOn = asArray(dependencies.dependsOn).map(asRecord);
    const dependedOnBy = asArray(dependencies.dependedOnBy).map(asRecord);

    expect(dependsOn.length).toBeGreaterThan(0);
    expect(dependedOnBy.length).toBeGreaterThan(0);
    expect(dependsOn).toEqual([
      { id: "spec:decisions.binding-not-liveness", statedReadiness: "ready" },
    ]);
    expect(dependedOnBy).toEqual([
      {
        id: "spec:decisions.architectural-significance-rides-primitives",
        statedReadiness: "ready",
      },
      {
        id: "spec:decisions.jsdoc-graph-extraction-refused",
        statedReadiness: "ready",
      },
    ]);
  });

  // Given: the live planning-slice Spec and its SpecContext bindings.
  // When: catalog recipe 19 is evaluated through the real CLI runner.
  // Then: the machine contract names `implementations` at the top level and on each
  // component row — never `abstractions` — and those ids equal live SpecContext
  // implementations plus memberOf-derived component ownership.
  it("returns planning-slice implementations, never abstractions", async () => {
    const id = "spec:consumers.agent-surface";
    const context = reader.specContext(id);
    if (context === undefined) {
      throw new Error(`live graph has no SpecContext for ${id}`);
    }

    const result = asRecord(await runRecipe(recipeByOrdinal(19)));
    const componentRows = asArray(result.components).map(asRecord);
    const expectedImplIds = context.implementations.map((binding) => binding.codeId).sort();
    const ownedByComponent = (componentId: string): readonly string[] =>
      expectedImplIds.filter((codeId) =>
        derived.graph.edges.some(
          (edge) => edge.type === "memberOf" && edge.from === codeId && edge.to === componentId,
        ),
      );

    expect(Object.keys(result)).toContain("implementations");
    expect(Object.keys(result)).not.toContain("abstractions");

    const topLevelIds = asArray(result.implementations).map((entry) =>
      stringAt(asRecord(entry), "id"),
    );
    expect([...topLevelIds].sort()).toEqual(expectedImplIds);

    for (const row of componentRows) {
      expect(Object.keys(row)).toContain("implementations");
      expect(Object.keys(row)).not.toContain("abstractions");
      expect(
        asArray(row.implementations)
          .map((entry) => stringAt({ entry }, "entry"))
          .sort(),
      ).toEqual(ownedByComponent(stringAt(row, "id")));
    }

    const ownedImplIds = componentRows.flatMap((row) =>
      asArray(row.implementations).map((entry) => stringAt({ entry }, "entry")),
    );
    const directlySatisfyingComponents = componentRows
      .filter((row) => row.directlySatisfies === true)
      .map((row) => stringAt(row, "id"));
    expect(
      [...new Set([...topLevelIds, ...ownedImplIds, ...directlySatisfyingComponents])].sort(),
    ).toEqual(expectedImplIds);
  });

  // Given: a clone of the live ExtractionResult with component:protocol.reader removed and its
  // memberOf edges retained — invalid, but still a graph validateGraph can report.
  // When: catalog recipe 19 runs through real runSdpCli on that override.
  // Then: validateGraph reports conformance/referential-integrity, the sink exits 0, the
  // unresolved component row keeps null label/file/line, impl:protocol.agent-surface is retained,
  // and that component contributes no entry point.
  it("preserves an unresolved component row when memberOf outlives the node", async () => {
    const missingComponentId = "component:protocol.reader";
    const retainedImplId = "impl:protocol.agent-surface";
    const dirty: ExtractionResult = {
      counts: derived.counts,
      report: derived.report,
      graph: {
        schemaVersion: derived.graph.schemaVersion,
        nodes: derived.graph.nodes.filter((node) => node.id !== missingComponentId),
        edges: derived.graph.edges,
      },
    };

    expect(dirty.graph.nodes.some((node) => node.id === missingComponentId)).toBe(false);
    expect(
      dirty.graph.edges.some(
        (edge) =>
          edge.type === "memberOf" &&
          edge.from === retainedImplId &&
          edge.to === missingComponentId,
      ),
    ).toBe(true);

    const graphReport = validateGraph(dirty.graph);
    expect(
      graphReport.findings.some(
        (finding) =>
          finding.family === "conformance" &&
          finding.validatorId === "conformance/referential-integrity" &&
          (finding.subjectId === missingComponentId || finding.relatedId === missingComponentId),
      ),
    ).toBe(true);

    const result = asRecord(await runRecipe(recipeByOrdinal(19), undefined, dirty));
    const unresolved = asArray(result.components)
      .map(asRecord)
      .find((row) => stringAt(row, "id") === missingComponentId);

    expect(unresolved).toEqual(
      expect.objectContaining({
        id: missingComponentId,
        label: null,
        file: null,
        line: null,
      }),
    );
    expect(
      asArray(result.implementations).map((entry) => stringAt(asRecord(entry), "id")),
    ).toContain(retainedImplId);
    expect(
      unresolved === undefined
        ? []
        : asArray(unresolved.implementations).map((entry) => stringAt({ entry }, "entry")),
    ).toContain(retainedImplId);
    expect(
      asArray(result.entryPoints)
        .map(asRecord)
        .filter(
          (entry) =>
            stringAt(entry, "role") === "component" && stringAt(entry, "id") === missingComponentId,
        ),
    ).toEqual([]);
  });

  // Given: the live graph plus ready non-example/non-decision primitives whose first path segments
  // are Object.prototype keys, with no resolving implementation.
  // When: catalog recipe 1 runs through real runSdpCli on that override.
  // Then: each hostile family is an own byFamily key carrying the exact synthetic Spec id.
  it("groups backlog rows under lawful Object.prototype path segments", async () => {
    const leaf = "hostile-backlog";
    const extraction = extractionWithHostilePrimitives({ leaf, readiness: "ready" });
    const result = asRecord(await runRecipe(recipeByOrdinal(1), undefined, extraction));
    assertOwnHostileFamilyIds(asRecord(result.byFamily), leaf);
  });

  // Given: the live graph plus below-ready primitives whose first path segments are
  // Object.prototype keys.
  // When: catalog recipe 11 runs through real runSdpCli on that override.
  // Then: each hostile family is an own byFamily key carrying the exact synthetic Spec id.
  it("groups lower-ladder rows under lawful Object.prototype path segments", async () => {
    const leaf = "hostile-lower";
    const extraction = extractionWithHostilePrimitives({ leaf, readiness: "idea" });
    const result = asRecord(await runRecipe(recipeByOrdinal(11), undefined, extraction));
    assertOwnHostileFamilyIds(asRecord(result.byFamily), leaf);
  });

  // Given: the live graph plus primitives that declare decidedBy to an existing ready decision,
  // with first path segments that collide with Object.prototype.
  // When: catalog recipe 18 runs through real runSdpCli on that override.
  // Then: the decision's decidedSubjectsByFamily keeps each hostile family as an own key with the
  // exact synthetic Spec id.
  it("groups decided subjects under lawful Object.prototype path segments", async () => {
    const leaf = "hostile-decided-subject";
    const decisionId = "spec:decisions.agent-front-door";
    const decision = derived.graph.nodes.find(
      (node) =>
        node.nodeType === "Primitive" &&
        node.id === decisionId &&
        node.specKind === "decision" &&
        node.readiness === "ready",
    );
    if (decision === undefined) {
      throw new Error(`live graph has no ready decision ${decisionId}`);
    }

    const extraction = extractionWithHostilePrimitives({
      leaf,
      readiness: "ready",
      decidedByTarget: decisionId,
    });
    const result = asRecord(await runRecipe(recipeByOrdinal(18), undefined, extraction));
    const row = asArray(result.decisions)
      .map(asRecord)
      .find((entry) => stringAt(entry, "id") === decisionId);
    if (row === undefined) {
      throw new Error(`decision map has no row for ${decisionId}`);
    }

    const byFamily = asRecord(row.decidedSubjectsByFamily);
    for (const family of HOSTILE_PATH_SEGMENTS) {
      expect(Object.hasOwn(byFamily, family), `missing own family key ${family}`).toBe(true);
      expect(asArray(byFamily[family])).toContain(hostileSpecId(family, leaf));
    }
  });
});

function registerProbe(): ExtractionResult {
  const primitive = (
    id: string,
    sections: Extract<
      ExtractionResult["graph"]["nodes"][number],
      { nodeType: "Primitive" }
    >["sections"] = {},
  ) => ({
    id,
    nodeType: "Primitive" as const,
    claim: "declared" as const,
    specKind: "behavior" as const,
    altitude: "story" as const,
    readiness: "defined" as const,
    title: "Title retry spec:probe.TitleOnly",
    file: "specs/probe.sdp.md",
    sections,
  });
  return {
    ...derived,
    graph: {
      schemaVersion: derived.graph.schemaVersion,
      nodes: [
        primitive("spec:probe.a", {
          intent: {
            outcome: "Probe",
            openQuestions: ["bare", { question: "later", blocking: false }],
          },
        }),
        primitive("spec:probe.b", {
          intent: {
            outcome: "Probe",
            openQuestions: [
              { question: "first", blocking: true },
              { question: "second", blocking: false },
            ],
          },
          behavior: {
            rules: [
              "spec:probe.child spec:probe.child spec:probe.b spec:probe.backed spec:probe.Target spec:probe.missing.",
            ],
            exampleSpace: { given: ["spec:probe.hiddenSpace"], when: ["act"], then: ["observe"] },
            examples: [
              { given: ["spec:probe.hiddenExample"], when: ["act"], then: ["observe"] },
              "spec:probe.stringExample",
            ],
          },
          design: { examples: "spec:probe.designMention spec:probe.child" },
        }),
        {
          id: "pack:probe",
          nodeType: "Pack",
          claim: "declared",
          title: "Probe pack",
          members: [],
          file: "probe.pack.sdp.md",
          modelRefs: [],
        },
        primitive("spec:probe.child"),
        primitive("spec:probe.backed"),
        primitive("spec:probe.Target"),
        {
          ...primitive("spec:probe.search", {
            intent: {
              outcome: "retry",
              openQuestions: [
                "retryable",
                "retry-worker",
                "RETRY.",
                "worker retry",
                "retry the worker",
              ],
            },
            design: {
              retryWorker: "retry-worker",
              workerRetry: "unrelated",
              description: "unrelated",
            },
            ui: { retryWorker: "retry" },
            model: { terms: { retryWorker: "retry" } },
            behavior: {
              exampleSpace: { given: ["retry"], when: ["act"], then: ["observe"] },
              examples: [{ given: ["retry"], when: ["act"], then: ["observe"] }],
            },
          }),
          narrative: "retry",
        },
      ],
      edges: [
        { from: "spec:probe.b", to: "pack:probe", type: "dependsOn", claim: "declared" },
        { from: "spec:probe.b", to: "spec:probe.Target", type: "verifies", claim: "inferred" },
        { from: "spec:probe.b", to: "spec:probe.a", type: "refines", claim: "declared" },
        { from: "spec:probe.b", to: "spec:probe.backed", type: "dependsOn", claim: "declared" },
        { from: "spec:probe.b", to: "spec:probe.unresolved", type: "dependsOn", claim: "declared" },
        { from: "spec:probe.b", to: "spec:probe.a", type: "constrainedBy", claim: "declared" },
        { from: "spec:probe.b", to: "spec:probe.a", type: "decidedBy", claim: "declared" },
        { from: "spec:probe.child", to: "spec:probe.b", type: "refines", claim: "declared" },
        { from: "spec:probe.b", to: "spec:probe.a", type: "verifies", claim: "declared" },
        { from: "spec:probe.b", to: "spec:probe.a", type: "supersedes", claim: "declared" },
      ],
    },
  };
}

function carrierRegisterProbe(): ExtractionResult {
  const root = mkdtempSync(join(tmpdir(), "sdp-register-carrier-"));
  try {
    writeFileSync(
      join(root, "probe.sdp.ts"),
      `
import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const probe = spec({
  id: specId("spec:probe.carrier"), title: "Carrier register probe",
  kind: "behavior", altitude: "story", readiness: "idea",
  intent: { outcome: "Search authored entries", openQuestions: [{ question: "Who owns this?" }] },
  design: {
    retryLimit: 3, retryEnabled: true, retryPolicy: { mode: "fixed" },
    retryWorkers: ["alpha", "beta"], retryEmptyList: [], retryEmptyObject: {},
    nested: { steps: ["retry later"] }, retryLong: { detail: ${JSON.stringify("x".repeat(300))} }
  },
  ui: { retryVisible: false }
});`,
    );
    const extraction = extract({ root });
    expect(extraction.report.findings).toEqual([]);
    expect(extraction.graph.nodes.some((node) => node.id === "spec:probe.carrier")).toBe(true);
    return extraction;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("register recipe semantics", () => {
  it.each([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])(
    "runs recipe %s as written in default output",
    async (ordinal) => {
      const capture = createCaptureOutput();
      expect(
        await runSdpCli(
          ["q", recipeByOrdinal(ordinal).body, "--root", repoRoot],
          capture.output,
          queryHooks,
        ),
      ).toBe(0);
      expect(capture.readStderr()).toBe("");
      expect(capture.readStdout()).toContain("totals:");
    },
  );

  it("renders long JSON values with the same default text bound as strings", async () => {
    const extraction = carrierRegisterProbe();
    const node = extraction.graph.nodes.find((node) => node.nodeType === "Primitive");
    if (node?.nodeType !== "Primitive") throw new Error("missing carrier probe");
    const text = "x".repeat(5000);
    const probe = {
      ...extraction,
      graph: {
        ...extraction.graph,
        nodes: [
          { ...node, sections: { design: { retryText: text, retryObject: { detail: text } } } },
        ],
      },
    };
    const recipe = recipeByOrdinal(23);
    const result = asRecord(await runRecipe(recipe, { term: "retry" }, probe));
    expect(
      asArray(result.matches)
        .map(asRecord)
        .map((row) => row.text),
    ).toEqual([text, JSON.stringify({ detail: text })]);
    const capture = createCaptureOutput();
    expect(
      await runSdpCli(
        ["q", recipe.body, "--root", repoRoot, "--params", JSON.stringify({ term: "retry" })],
        capture.output,
        { query: { ...queryHooks.query, extract: () => probe } },
      ),
    ).toBe(0);
    expect(capture.readStderr()).toBe("");
    expect(capture.readStdout()).not.toContain(text);
    expect(capture.readStdout()).toContain("... 1000 more characters");
    expect(capture.readStdout()).toContain("... 1013 more characters");
  });

  it("registers an omitted blocking flag through a TypeScript carrier", async () => {
    const result = asRecord(
      await runRecipe(recipeByOrdinal(20), undefined, carrierRegisterProbe()),
    );
    expect(result.totals).toEqual({
      questions: 1,
      blocking: 0,
      nonBlocking: 1,
      specs: 1,
      specsWithBlocking: 0,
      malformed: 0,
    });
    expect(result.malformed).toEqual([]);
    expect(asArray(result.specs).map(asRecord)[0]?.questions).toEqual([
      { question: "Who owns this?", blocking: false, key: null },
    ]);
  });

  it("searches coined keys of every value shape through a TypeScript carrier", async () => {
    const recipe = recipeByOrdinal(23);
    const result = asRecord(await runRecipe(recipe, { term: "retry" }, carrierRegisterProbe()));
    // The line is the one the TypeScript carrier records for the entry's property; a nested path
    // is no entry of the location table, so it has none.
    const expected = (
      [
        ["design", "retryLimit", "3", 8],
        ["design", "retryEnabled", "true", 8],
        ["design", "retryPolicy", '{"mode":"fixed"}', 8],
        ["design", "retryWorkers", '["alpha","beta"]', 9],
        ["design", "retryEmptyList", "[]", 9],
        ["design", "retryEmptyObject", "{}", 9],
        ["design", "retryLong", JSON.stringify({ detail: "x".repeat(300) }), 10],
        ["ui", "retryVisible", "false", 12],
      ] as const
    ).map(([section, entry, text, line]) => ({
      id: "spec:probe.carrier",
      section,
      entry,
      address: `spec:probe.carrier#${section}.${entry}`,
      line,
      text,
      matchedIn: ["key"],
    }));
    expect(result.matches).toEqual([
      ...expected.slice(0, 6),
      {
        id: "spec:probe.carrier",
        section: "design",
        entry: "nested.steps[0]",
        address: null,
        line: null,
        text: "retry later",
        matchedIn: ["text"],
      },
      ...expected.slice(6),
    ]);
    expect(result.totals).toEqual({ matches: 9, specs: 1, shown: 9 });
  });

  it("searches strings inside a matching coined list or object key", async () => {
    const extraction = carrierRegisterProbe();
    const node = extraction.graph.nodes.find((node) => node.nodeType === "Primitive");
    if (node?.nodeType !== "Primitive") throw new Error("missing carrier probe");
    const recipe = recipeByOrdinal(23);
    const result = asRecord(
      await runRecipe(
        recipe,
        { term: "retry" },
        {
          ...extraction,
          graph: {
            ...extraction.graph,
            nodes: [
              {
                ...node,
                sections: {
                  design: {
                    retryWorkers: ["retry later"],
                    retryPolicy: { mode: "retry fixed", options: ["retry soon"] },
                  },
                },
              },
            ],
          },
        },
      ),
    );
    // The swapped sections keep the probe's location table, which locates both top-level keys.
    expect(result.matches).toEqual([
      {
        id: node.id,
        section: "design",
        entry: "retryWorkers",
        address: `${node.id}#design.retryWorkers`,
        line: 9,
        matchedIn: ["key"],
        text: '["retry later"]',
      },
      {
        id: node.id,
        section: "design",
        entry: "retryWorkers[0]",
        address: null,
        line: null,
        matchedIn: ["text"],
        text: "retry later",
      },
      {
        id: node.id,
        section: "design",
        entry: "retryPolicy",
        address: `${node.id}#design.retryPolicy`,
        line: 8,
        matchedIn: ["key"],
        text: '{"mode":"retry fixed","options":["retry soon"]}',
      },
      {
        id: node.id,
        section: "design",
        entry: "retryPolicy.mode",
        address: null,
        line: null,
        matchedIn: ["text"],
        text: "retry fixed",
      },
      {
        id: node.id,
        section: "design",
        entry: "retryPolicy.options[0]",
        address: null,
        line: null,
        matchedIn: ["text"],
        text: "retry soon",
      },
    ]);
    expect(result.totals).toEqual({ matches: 5, specs: 1, shown: 5 });
  });

  it("searches a null coined-key value in the reader graph", async () => {
    const extraction = carrierRegisterProbe();
    const recipe = recipeByOrdinal(23);
    const node = extraction.graph.nodes.find((node) => node.nodeType === "Primitive");
    if (node?.nodeType !== "Primitive") throw new Error("missing carrier probe");
    const result = asRecord(
      await runRecipe(
        recipe,
        { term: "retry" },
        {
          ...extraction,
          graph: {
            ...extraction.graph,
            nodes: [{ ...node, sections: { design: { retryNothing: null } } }],
          },
        },
      ),
    );
    expect(result.matches).toEqual([
      {
        id: node.id,
        section: "design",
        entry: "retryNothing",
        address: `${node.id}#design.retryNothing`,
        // The probe's location table never saw this key: not located, never absent.
        line: null,
        matchedIn: ["key"],
        text: "null",
      },
    ]);
    expect(result.totals).toEqual({ matches: 1, specs: 1, shown: 1 });
  });

  // A source line is a location, not a count, so a number under `line` may sit in a row. Recipes
  // 29 and 30 are left out: their rows carry per-member design counts and a distance by law.
  it("keeps register counts under totals and top-level plural nouns as arrays", async () => {
    const check = (value: unknown, insideTotals = false, key = ""): void => {
      if (typeof value === "number") {
        expect({ key, insideTotals: insideTotals || key === "line" }).toEqual({
          key,
          insideTotals: true,
        });
      } else if (Array.isArray(value)) {
        value.forEach((entry) => {
          check(entry, insideTotals, key);
        });
      } else if (typeof value === "object" && value !== null) {
        for (const [name, entry] of Object.entries(value))
          check(entry, insideTotals || name === "totals", name);
      }
    };
    for (const ordinal of [20, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32]) {
      const output = asRecord(await runRecipe(recipeByOrdinal(ordinal)));
      check(output);
      for (const key of [
        "specs",
        "malformed",
        "footing",
        "unresolved",
        "unbacked",
        "reverseOnly",
        "tokens",
        "matches",
        "rows",
        "cycles",
        "roles",
        "layers",
        "contexts",
      ]) {
        if (key in output) expect(Array.isArray(output[key])).toBe(true);
      }
    }
  });

  it.each([
    { term: "retry", key: "entry", text: "retry", matchedIn: ["text"] },
    { term: "retry", key: "entry", text: "retryable", matchedIn: [] },
    { term: "retry", key: "entry", text: "retry-worker", matchedIn: ["text"] },
    { term: "retry", key: "retryWorker", text: "unrelated", matchedIn: ["key"] },
    { term: "Retry", key: "entry", text: "RETRY.", matchedIn: ["text"] },
    { term: "retry worker", key: "retryWorker", text: "retry-worker", matchedIn: ["key", "text"] },
    { term: "retry worker", key: "entry", text: "worker retry", matchedIn: [] },
    { term: "retry worker", key: "entry", text: "retry the worker", matchedIn: [] },
    { term: "server", key: "entry", text: "HTTPServer", matchedIn: ["text"] },
    { term: "v", key: "entry", text: "v2", matchedIn: [] },
  ])(
    "pins whole-token matching for $term in $key / $text",
    async ({ term, key, text, matchedIn }) => {
      const probe = registerProbe();
      const node = probe.graph.nodes.find((entry) => entry.id === "spec:probe.search");
      if (node?.nodeType !== "Primitive") throw new Error("entry-search probe is missing");
      const extraction: ExtractionResult = {
        ...probe,
        graph: {
          ...probe.graph,
          nodes: [{ ...node, narrative: undefined, sections: { design: { [key]: text } } }],
          edges: [],
        },
      };
      const recipe = recipeByOrdinal(23);
      const result = asRecord(await runRecipe(recipe, { term }, extraction));
      expect(asRecord(result.totals).matches).toBe(matchedIn.length === 0 ? 0 : 1);
      expect(result.matches).toEqual(
        matchedIn.length === 0
          ? []
          : [
              {
                id: node.id,
                section: "design",
                entry: key,
                address: `${node.id}#design.${key}`,
                // The in-memory probe carries no location table: not located, never absent.
                line: null,
                matchedIn,
                text,
              },
            ],
      );
    },
  );

  it("registers every authored question, blocking Specs first", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(20)));
    const expected = derived.graph.nodes
      .filter((node) => node.nodeType === "Primitive")
      .flatMap((node) => node.sections?.intent?.openQuestions ?? []);
    expect(asRecord(result.totals).questions).toBe(expected.length);
    expect(asArray(result.specs)).toHaveLength(numberAt(asRecord(result.totals), "specs"));
    const blocking = asArray(result.specs)
      .map(asRecord)
      .map((row) => numberAt(asRecord(row.totals), "blocking") > 0);
    expect(blocking).toEqual([...blocking].sort((left, right) => Number(right) - Number(left)));
    const synthetic = asRecord(await runRecipe(recipeByOrdinal(20), undefined, registerProbe()));
    expect(synthetic).toEqual({
      totals: {
        questions: 9,
        blocking: 1,
        nonBlocking: 8,
        specs: 3,
        specsWithBlocking: 1,
        malformed: 0,
      },
      malformed: [],
      specs: [
        {
          id: "spec:probe.b",
          statedReadiness: "defined",
          totals: { blocking: 1 },
          questions: [
            { blocking: true, question: "first", key: null },
            { blocking: false, question: "second", key: null },
          ],
        },
        {
          id: "spec:probe.a",
          statedReadiness: "defined",
          totals: { blocking: 0 },
          questions: [
            { blocking: false, question: "bare", key: null },
            { blocking: false, question: "later", key: null },
          ],
        },
        {
          id: "spec:probe.search",
          statedReadiness: "defined",
          totals: { blocking: 0 },
          questions: [
            "retryable",
            "retry-worker",
            "RETRY.",
            "worker retry",
            "retry the worker",
          ].map((question) => ({ blocking: false, question, key: null })),
        },
      ],
    });
    const empty = { ...registerProbe(), graph: { ...registerProbe().graph, nodes: [], edges: [] } };
    expect(await runRecipe(recipeByOrdinal(20), undefined, empty)).toEqual({
      totals: {
        questions: 0,
        blocking: 0,
        nonBlocking: 0,
        specs: 0,
        specsWithBlocking: 0,
        malformed: 0,
      },
      specs: [],
      malformed: [],
    });
  });

  it("reports one-hop footing of all four types, including unresolved targets", async () => {
    const recipe = recipeByOrdinal(21);
    const result = asRecord(await runRecipe(recipe));
    const types = ["refines", "dependsOn", "constrainedBy", "decidedBy"];
    const edges = derived.graph.edges.filter(
      (edge) => edge.from === "spec:extraction.derive-graph" && types.includes(edge.type),
    );
    expect(
      asArray(result.footing)
        .map(asRecord)
        .map((row) => ({ type: row.type, id: row.id, claim: row.claim })),
    ).toEqual(
      [...edges]
        .sort(
          (left, right) =>
            types.indexOf(left.type) - types.indexOf(right.type) || left.to.localeCompare(right.to),
        )
        .map((edge) => ({ type: edge.type, id: edge.to, claim: edge.claim })),
    );
    const assertReadiness = (output: Record<string, unknown>, extraction: ExtractionResult) => {
      const independent = createReader(extraction.graph);
      const rows = asArray(output.footing).map(asRecord);
      const expectedStated: Record<string, number> = {
        idea: 0,
        scoped: 0,
        defined: 0,
        ready: 0,
        unresolved: 0,
        nonSpec: 0,
      };
      const expectedFloor: Record<string, number> = {
        idea: 0,
        scoped: 0,
        defined: 0,
        ready: 0,
        none: 0,
      };
      for (const row of rows) {
        const target = independent.specContext(String(row.id));
        expect(row.statedReadiness).toBe(target?.statedReadiness ?? null);
        expect(row.floorReached).toBe(
          target === undefined ? null : (target.derivedReadiness ?? "none"),
        );
        const stated = target?.statedReadiness ?? (row.resolved ? "nonSpec" : "unresolved");
        expectedStated[stated] = (expectedStated[stated] ?? 0) + 1;
        if (target !== undefined) {
          const floor = target.derivedReadiness ?? "none";
          expectedFloor[floor] = (expectedFloor[floor] ?? 0) + 1;
        }
      }
      expect(asRecord(output.totals).byStatedReadiness).toEqual(expectedStated);
      expect(asRecord(output.totals).byFloorReached).toEqual(expectedFloor);
    };
    assertReadiness(result, derived);
    expect(await runRecipe(recipe, { spec: "spec:probe.absent" }, registerProbe())).toEqual({
      id: "spec:probe.absent",
      found: false,
    });
    const synthetic = asRecord(await runRecipe(recipe, { spec: "spec:probe.b" }, registerProbe()));
    assertReadiness(synthetic, registerProbe());
    expect(asRecord(synthetic.totals).relations).toBe(6);
    expect(asRecord(synthetic.totals).byType).toEqual({
      refines: 1,
      dependsOn: 3,
      constrainedBy: 1,
      decidedBy: 1,
    });
    expect(asArray(synthetic.footing).map(asRecord)).toContainEqual({
      type: "dependsOn",
      id: "spec:probe.unresolved",
      claim: "declared",
      resolved: false,
      statedReadiness: null,
      floorReached: null,
    });
    expect(
      asArray(synthetic.footing)
        .map(asRecord)
        .map((row) => row.claim),
    ).toEqual(["declared", "declared", "declared", "declared", "declared", "declared"]);
    expect(asRecord(asRecord(synthetic.totals).byStatedReadiness).unresolved).toBe(1);
    expect(asRecord(asRecord(synthetic.totals).byStatedReadiness).nonSpec).toBe(1);
  });

  it("audits mention pairs, skips fences, and preserves full ids and direction", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(22), undefined, registerProbe()));
    expect(result.totals).toEqual({
      occurrences: 8,
      pairs: 6,
      backed: 1,
      unbacked: 1,
      reverseOnly: 1,
      unresolved: 3,
    });
    expect(result.unbacked).toEqual([
      {
        from: "spec:probe.b",
        to: "spec:probe.Target",
        totals: { occurrences: 1 },
        at: [{ section: "behavior", entry: "rules[0]" }],
      },
    ]);
    expect(result.reverseOnly).toEqual([
      {
        from: "spec:probe.b",
        to: "spec:probe.child",
        totals: { occurrences: 3 },
        at: [
          { section: "behavior", entry: "rules[0]" },
          { section: "design", entry: "examples" },
        ],
      },
    ]);
    expect(
      asArray(result.unresolved)
        .map(asRecord)
        .map((row) => row.to),
    ).toEqual(["spec:probe.designMention", "spec:probe.missing", "spec:probe.stringExample"]);
  });

  it("resolves entry mentions and retains every token and pair location through a probe root", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-entry-mentions-"));
    try {
      writeFileSync(
        join(root, "probe.sdp.ts"),
        `
import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const target = spec({
  id: specId("spec:probe.target"), title: "Target", kind: "behavior", altitude: "story", readiness: "idea",
  design: { step1: "Present", description: "Leading prose" }
});
export const source = spec({
  id: specId("spec:probe.source"), title: "spec:probe.titleOnly", kind: "behavior", altitude: "story", readiness: "idea",
  intent: { outcome: "spec:probe.target#design.step1 spec:probe.target#design.missing.",
    openQuestions: [{ question: "spec:probe.target#design.missing", blocking: false }] },
  behavior: { rules: ["spec:probe.target#design.missing spec:probe.target#design.missing"],
    exampleSpace: { given: ["spec:probe.hiddenSpace"], when: ["act"], then: ["observe"] },
    examples: [{ given: ["spec:probe.hiddenExample"], when: ["act"], then: ["observe"] }] },
  design: { malformed: "spec:x#foo spec:x#design.Foo spec:probe..broken spec:probe.target##design.step1",
    absent: "spec:probe.absent#ui.step1", leading: "spec:probe.target#design.description",
    own: "spec:probe.source#design.own spec:probe.source#ui.missing",
    boundaries: "aspec:probe.ignore -spec:probe.ignore" }
});`,
      );
      const result = asRecord(await runRecipe(recipeByOrdinal(22), undefined, extract({ root })));
      const unresolved = asArray(result.unresolved).map(asRecord);
      const at = [
        { section: "intent", entry: "outcome" },
        { section: "intent", entry: "openQuestions[0].question" },
        { section: "behavior", entry: "rules[0]" },
      ];
      expect(unresolved).toContainEqual({
        from: "spec:probe.source",
        to: "spec:probe.target#design.missing",
        reason: "entry",
        totals: { occurrences: 4 },
        at,
      });
      for (const to of [
        "spec:x#foo",
        "spec:x#design.Foo",
        "spec:probe..broken",
        "spec:probe.target##design.step1",
      ])
        expect(unresolved).toContainEqual({
          from: "spec:probe.source",
          to,
          reason: "malformed",
          totals: { occurrences: 1 },
          at: [{ section: "design", entry: "malformed" }],
        });
      expect(unresolved).toContainEqual({
        from: "spec:probe.source",
        to: "spec:probe.absent#ui.step1",
        reason: "spec",
        totals: { occurrences: 1 },
        at: [{ section: "design", entry: "absent" }],
      });
      for (const [to, entry] of [
        ["spec:probe.target#design.description", "leading"],
        ["spec:probe.source#ui.missing", "own"],
      ])
        expect(unresolved).toContainEqual({
          from: "spec:probe.source",
          to,
          reason: "entry",
          totals: { occurrences: 1 },
          at: [{ section: "design", entry }],
        });
      expect(unresolved).toHaveLength(8);
      expect(result.unbacked).toEqual([
        {
          from: "spec:probe.source",
          to: "spec:probe.target",
          totals: { occurrences: 6 },
          at: [...at, { section: "design", entry: "leading" }],
        },
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  function mentionTokenProbe(outcome: string): ExtractionResult {
    const probe = registerProbe();
    const primitive = (id: string, sections: Record<string, unknown>) => ({
      id,
      nodeType: "Primitive" as const,
      claim: "declared" as const,
      specKind: "behavior" as const,
      altitude: "story" as const,
      readiness: "idea" as const,
      title: "Token probe",
      file: "specs/probe.sdp.md",
      sections,
    });
    const graph = {
      schemaVersion: probe.graph.schemaVersion,
      nodes: [
        primitive("spec:probe.target", {
          intent: { outcome: "Exist under the prefix." },
          design: { step1: "One." },
        }),
        primitive("spec:probe.other", { intent: { outcome: "Exist as well." } }),
        primitive("spec:probe.cafe", {
          intent: { outcome: "Exist under a prefix too." },
          design: { step1: "One." },
        }),
        primitive("spec:probe.mentioning", { intent: { outcome } }),
      ],
      edges: [],
    };
    return { ...probe, graph };
  }

  it.each([
    ["an underscore", "spec:probe.target_v2", "spec:probe.target_v2"],
    ["a slash", "spec:probe.target/extra", "spec:probe.target/extra"],
    ["a comma", "spec:probe.target,spec:probe.other", "spec:probe.target,spec:probe.other"],
    ["an underscore and a letter", "spec:probe.target_x", "spec:probe.target_x"],
    ["a slash and a letter", "spec:probe.target/x", "spec:probe.target/x"],
    ["a comma and a letter", "spec:probe.target,x", "spec:probe.target,x"],
    ["a letter outside ASCII", "spec:probe.targeté", "spec:probe.targeté"],
    // An escape is read as its punctuation, so the underscore stays inside the token.
    ["an escaped underscore", "spec:probe.target\\_x", "spec:probe.target_x"],
    // A character outside ASCII that is not a separator stays in the token, so a valid prefix
    // never resolves on its own.
    ["a combining mark", "spec:probe.cafe\u0301", "spec:probe.cafe\u0301"],
    [
      "a combining mark after an entry key",
      "spec:probe.cafe#design.step1\u0301",
      "spec:probe.cafe#design.step1\u0301",
    ],
    ["a zero-width space", "spec:probe.cafe\u200bx", "spec:probe.cafe\u200bx"],
    ["fullwidth connector punctuation", "spec:probe.cafe\uff3fx", "spec:probe.cafe\uff3fx"],
    // A control character other than whitespace stays in the token too.
    ["a NUL", "spec:probe.cafe\u0000missing", "spec:probe.cafe\u0000missing"],
    ["an escape character", "spec:probe.cafe\u001bmissing", "spec:probe.cafe\u001bmissing"],
    ["a delete character", "spec:probe.cafe\u007fmissing", "spec:probe.cafe\u007fmissing"],
    ["a C1 control character", "spec:probe.cafe\u0080missing", "spec:probe.cafe\u0080missing"],
    [
      "a hyphenated entry key",
      "spec:probe.target#design.step-1",
      "spec:probe.target#design.step-1",
    ],
    ["an entry suffix with no key", "spec:probe.target#design.", "spec:probe.target#design"],
    [
      "an entry suffix outside design and ui",
      "spec:probe.target#model.x",
      "spec:probe.target#model.x",
    ],
  ])(
    "reads the whole mention token through %s as malformed, never the existing prefix",
    async (_case, written, token) => {
      const result = asRecord(
        await runRecipe(recipeByOrdinal(22), undefined, mentionTokenProbe(`Read ${written} now`)),
      );

      expect(result).toEqual({
        totals: {
          occurrences: 1,
          pairs: 1,
          backed: 0,
          unbacked: 0,
          reverseOnly: 0,
          unresolved: 1,
        },
        unresolved: [
          {
            from: "spec:probe.mentioning",
            to: token,
            reason: "malformed",
            totals: { occurrences: 1 },
            at: [{ section: "intent", entry: "outcome" }],
          },
        ],
        unbacked: [],
        reverseOnly: [],
      });
    },
  );

  it.each([
    ["a sentence dot", "Read spec:probe.target."],
    ["a comma", "Read spec:probe.target, then stop."],
    ["a colon", "Read spec:probe.target: then stop."],
    ["a closing parenthesis", "Read it (spec:probe.target) now."],
    ["bold", "Read **spec:probe.target** now."],
    ["emphasis", "Read _spec:probe.target_ now."],
    ["strikethrough", "Read ~~spec:probe.target~~ now."],
    ["backticks", "Read `spec:probe.target` now."],
    ["ASCII double quotes", 'Read "spec:probe.target" now.'],
    ["ASCII single quotes", "Read 'spec:probe.target' now."],
    ["typographic double quotes", "Read “spec:probe.target” now."],
    ["typographic single quotes", "Read ‘spec:probe.target’ now."],
    ["an em dash", "Read spec:probe.target—see the rest."],
    ["an en dash", "Read spec:probe.target–see the rest."],
    ["an ellipsis", "Read spec:probe.target… and stop."],
    ["an escaped star", "Read spec:probe.target\\* now."],
    ["an escaped exclamation mark", "Read spec:probe.target\\! now."],
    ["U+0085", "Read spec:probe.target\u0085then stop."],
    ["a no-break space", "Read spec:probe.target\u00a0then stop."],
    ["a tab", "Read spec:probe.target\tthen stop."],
    ["an arrow", "Read spec:probe.target→then stop."],
  ])("reads the clean id through Markdown punctuation: %s", async (_case, outcome) => {
    const result = asRecord(
      await runRecipe(recipeByOrdinal(22), undefined, mentionTokenProbe(outcome)),
    );

    expect(result).toEqual({
      totals: { occurrences: 1, pairs: 1, backed: 0, unbacked: 1, reverseOnly: 0, unresolved: 0 },
      unresolved: [],
      unbacked: [
        {
          from: "spec:probe.mentioning",
          to: "spec:probe.target",
          totals: { occurrences: 1 },
          at: [{ section: "intent", entry: "outcome" }],
        },
      ],
      reverseOnly: [],
    });
  });

  it("reads a placeholder or a bare prefix as prose, not a mention", async () => {
    const result = asRecord(
      await runRecipe(
        recipeByOrdinal(22),
        undefined,
        mentionTokenProbe("Write spec:<id> for a Spec, or the bare spec: prefix, as prose."),
      ),
    );

    expect(result).toEqual({
      totals: { occurrences: 0, pairs: 0, backed: 0, unbacked: 0, reverseOnly: 0, unresolved: 0 },
      unresolved: [],
      unbacked: [],
      reverseOnly: [],
    });
  });

  it("scans nested arrays in examples while skipping object fences by position", async () => {
    const probe = registerProbe();
    const graph = {
      ...probe.graph,
      nodes: probe.graph.nodes.map((node) =>
        node.id === "spec:probe.b" && node.nodeType === "Primitive"
          ? {
              ...node,
              sections: {
                behavior: { examples: [["spec:probe.arrayMention"]] },
                design: { exampleSpace: "spec:probe.openMention" },
              },
            }
          : node,
      ),
    };
    const result = asRecord(
      await runRecipe(recipeByOrdinal(22), undefined, {
        ...probe,
        graph: graph as unknown as ExtractionResult["graph"],
      }),
    );
    expect(result.unresolved).toEqual([
      {
        from: "spec:probe.b",
        to: "spec:probe.arrayMention",
        reason: "spec",
        totals: { occurrences: 1 },
        at: [{ section: "behavior", entry: "examples[0][0]" }],
      },
      {
        from: "spec:probe.b",
        to: "spec:probe.openMention",
        reason: "spec",
        totals: { occurrences: 1 },
        at: [{ section: "design", entry: "exampleSpace" }],
      },
    ]);
  });

  it("addresses only lawful Design and UI entry keys in search results", async () => {
    const probe = registerProbe();
    const graph = {
      ...probe.graph,
      nodes: probe.graph.nodes.map((node) =>
        node.id === "spec:probe.search" && node.nodeType === "Primitive"
          ? {
              ...node,
              narrative: undefined,
              sections: {
                design: {
                  retryWorker: "needle",
                  description: "needle",
                  "retry-worker": "needle",
                  RetryWorker: "needle",
                },
                ui: { retryWorker: "needle" },
                behavior: { rules: ["needle"] },
              },
            }
          : node,
      ),
    };
    const recipe = recipeByOrdinal(23);
    const result = asRecord(await runRecipe(recipe, { term: "needle" }, { ...probe, graph }));
    const rows = asArray(result.matches).map(asRecord);
    for (const section of ["design", "ui"])
      expect(
        rows.find((row) => row.section === section && row.entry === "retryWorker")?.address,
      ).toBe(`spec:probe.search#${section}.retryWorker`);
    for (const entry of ["description", "retry-worker", "RetryWorker", "rules[0]"])
      expect(rows.find((row) => row.entry === entry)?.address).toBeNull();
  });

  it("scopes mentions by the mentioning Spec only", async () => {
    const probe = registerProbe();
    const recipe = recipeByOrdinal(22);
    const scoped = async (scope: string[]) => asRecord(await runRecipe(recipe, { scope }, probe));
    const all = asRecord(await runRecipe(recipe, undefined, probe));
    expect(await scoped(["spec:probe.b"])).toEqual(all);
    for (const scope of [
      ["spec:probe.child"],
      ["spec:probe.absent"],
      ["spec:probe.a", "spec:probe.child"],
    ]) {
      expect(await scoped(scope)).toEqual({
        totals: { occurrences: 0, pairs: 0, backed: 0, unbacked: 0, reverseOnly: 0, unresolved: 0 },
        unresolved: [],
        unbacked: [],
        reverseOnly: [],
      });
    }
  });

  it.each([
    "one question",
    {},
    [42],
    [{ blocking: true }],
    [null],
    [""],
    [{ question: "valid", blocking: "yes" }],
    [{ question: "valid", blocking: null }],
    [{ question: "valid", blocking: undefined }],
  ])("reports malformed open questions without counting them: %j", async (authored) => {
    const probe = registerProbe();
    const node = probe.graph.nodes.find((node) => node.id === "spec:probe.a");
    if (node?.nodeType !== "Primitive") throw new Error("missing question probe");
    const malformed = {
      ...node,
      sections: { intent: { openQuestions: authored } },
    } as unknown as typeof node;
    const result = asRecord(
      await runRecipe(recipeByOrdinal(20), undefined, {
        ...probe,
        graph: { ...probe.graph, nodes: [malformed], edges: [] },
      }),
    );
    expect(asRecord(result.totals).questions).toBe(0);
    expect(asRecord(result.totals).malformed).toBe(1);
    expect(result.specs).toEqual([]);
    expect(asArray(result.malformed).map(asRecord)).toEqual([
      {
        id: node.id,
        section: "intent",
        entry: Array.isArray(authored) ? "openQuestions[0]" : "openQuestions",
        reason: !Array.isArray(authored)
          ? "Expected a list"
          : typeof authored[0] === "object" && authored[0] !== null && "question" in authored[0]
            ? "Expected a question and boolean blocking flag"
            : "Expected non-empty question text",
      },
    ]);
  });

  it.each([
    { question: "valid", key: "AggregateReach" },
    { question: "valid", key: "aggregate-reach" },
    { question: "valid", key: "" },
    { question: "valid", key: 7 },
    { question: "valid", key: null },
    { question: "valid", blocking: true, key: undefined },
  ])("reports an off-grammar question key as malformed: %j", async (authored) => {
    const probe = registerProbe();
    const node = probe.graph.nodes.find((node) => node.id === "spec:probe.a");
    if (node?.nodeType !== "Primitive") throw new Error("missing question probe");
    const malformed = {
      ...node,
      sections: { intent: { openQuestions: [authored, { question: "kept", key: "kept" }] } },
    } as unknown as typeof node;
    const result = asRecord(
      await runRecipe(recipeByOrdinal(20), undefined, {
        ...probe,
        graph: { ...probe.graph, nodes: [malformed], edges: [] },
      }),
    );
    expect(asRecord(result.totals).questions).toBe(1);
    expect(asArray(result.specs).map(asRecord)[0]?.questions).toEqual([
      { blocking: false, question: "kept", key: "kept" },
    ]);
    expect(result.malformed).toEqual([
      {
        id: node.id,
        section: "intent",
        entry: "openQuestions[0]",
        reason: "Expected a lower-camel question key",
      },
    ]);
  });

  it("searches whole tokens, coined keys, narrative and fence steps", async () => {
    const recipe = recipeByOrdinal(23);
    const search = async (term: string, extraction = registerProbe()) =>
      asRecord(await runRecipe(recipe, { term }, extraction));
    const retry = await search("retry");
    const rows = asArray(retry.matches).map(asRecord);
    const entries = rows.map((row) => row.entry);
    expect(entries).toContain("outcome");
    expect(entries).not.toContain("openQuestions[0]"); // retryable
    expect(entries).toContain("openQuestions[1]"); // retry-worker
    expect(rows).toContainEqual({
      id: "spec:probe.search",
      section: "design",
      entry: "retryWorker",
      address: "spec:probe.search#design.retryWorker",
      line: null,
      matchedIn: ["key", "text"],
      text: "retry-worker",
    });
    expect(asArray((await search("Retry")).matches)).toEqual(retry.matches);
    expect(entries).toContain("openQuestions[2]"); // RETRY.
    const phrase = await search("retry worker");
    expect(phrase.tokens).toEqual(["retry", "worker"]);
    expect(
      asArray(phrase.matches)
        .map(asRecord)
        .map((row) => row.entry),
    ).toEqual(["openQuestions[1]", "retryWorker", "retryWorker", "terms.retryWorker"]);
    expect(entries).toContain(null);
    expect(entries).toContain("exampleSpace.given[0]");
    expect(entries).toContain("examples[0].given[0]");
    expect(asArray((await search("outcome")).matches)).toEqual([]);
    expect(asArray((await search("description")).matches)).toEqual([]);
    expect(asArray((await search("try")).matches)).toEqual([]);
    expect(asArray((await search("!!!")).matches)).toEqual([]);
    const probe = registerProbe();
    const capped: ExtractionResult = {
      ...probe,
      graph: {
        ...probe.graph,
        nodes: probe.graph.nodes.map((node) =>
          node.id === "spec:probe.search" && node.nodeType === "Primitive"
            ? {
                ...node,
                sections: { behavior: { rules: Array.from({ length: 60 }, () => "retry") } },
                narrative: undefined,
              }
            : node,
        ),
      },
    };
    const many = await search("retry", capped);
    expect(asRecord(many.totals).matches).toBe(60);
    expect(asRecord(many.totals).specs).toBe(1);
    expect(asArray(many.matches)).toHaveLength(50);
  });

  // Recipe 24 reads the span with the inline code span law: an opening run of any length closes
  // at the next run of exactly that length. The independent scanner below states that law as a
  // loop, so the corpus check holds whatever the corpus pins, with no frozen count.
  it("lists every pinned declaration this corpus holds", async () => {
    const leadingSpan = (value: string): string | undefined => {
      const opening = /^`+/u.exec(value)?.[0].length ?? 0;
      if (opening === 0) return undefined;
      let index = opening;
      while (index < value.length) {
        // The span law closes a span on its own line, so a line ending before the closing run
        // means the value opens with no span.
        if (value[index] === "\n" || value[index] === "\r") return undefined;
        if (value[index] !== "`") {
          index += 1;
          continue;
        }
        let end = index;
        while (value[end] === "`") end += 1;
        if (end - index === opening && index > opening) return value.slice(opening, index);
        index = end;
      }
      return undefined;
    };
    const expected = reader.specs().flatMap((spec) =>
      Object.entries(reader.specContext(spec.id)?.sections?.design ?? {}).flatMap(
        ([key, value]) => {
          if (key === "description" || typeof value !== "string") return [];
          const declaration = leadingSpan(value);
          return declaration === undefined ? [] : [{ spec: spec.id, key, declaration }];
        },
      ),
    );
    const result = asRecord(await runRecipe(recipeByOrdinal(24)));
    const rows = asArray(result.rows).map(asRecord);
    expect(result.totals).toEqual({
      entries: rows.length,
      specs: new Set(rows.map((row) => row.spec)).size,
    });
    expect(rows).toEqual(expected);
  });

  it("reads spans of any run length and skips every entry that pins nothing", async () => {
    const probe = registerProbe();
    const node = probe.graph.nodes.find((entry) => entry.id === "spec:probe.search");
    const other = probe.graph.nodes.find((entry) => entry.id === "spec:probe.a");
    if (node?.nodeType !== "Primitive" || other?.nodeType !== "Primitive") {
      throw new Error("pinned-declarations probe is missing");
    }
    const extraction: ExtractionResult = {
      ...probe,
      graph: {
        ...probe.graph,
        nodes: [
          {
            ...node,
            narrative: undefined,
            sections: {
              design: {
                fnResume: "`resume(id: string): void` restarts generation",
                typeTick: "``a`b`` keeps the single backtick",
                typeFence: "`a``b` keeps the double run",
                fnUnclosed: "`resume(id: string) never closes",
                fnLater: "calls `resume(id)` later",
                description: "`describe(): void` is framing",
                tableNested: { inner: "`nested(): void`" },
                fnList: ["`nested(): void`"],
                typeTriple: "```a``b``` keeps the double run inside a triple run",
                fnFirst: "`first` prose `last`",
                fnOpenTwo: "``a`",
                fnOpenTwoLonger: "``a`b```",
                fnOpenThree: "```x`",
                fnMultiline: "`a\nb`",
                typeLineSep: '`type S = "\u2028"`',
                typeParaSep: '`type S = "\u2029"`',
              },
            },
          },
          { ...other, sections: { design: { validatorId: "`isId(value: unknown): boolean`" } } },
        ],
        edges: [],
      },
    };
    const recipe = recipeByOrdinal(24);
    expect(await runRecipe(recipe, undefined, extraction)).toEqual({
      totals: { entries: 8, specs: 2 },
      rows: [
        { spec: "spec:probe.a", key: "validatorId", declaration: "isId(value: unknown): boolean" },
        { spec: "spec:probe.search", key: "fnResume", declaration: "resume(id: string): void" },
        { spec: "spec:probe.search", key: "typeTick", declaration: "a`b" },
        { spec: "spec:probe.search", key: "typeFence", declaration: "a``b" },
        { spec: "spec:probe.search", key: "typeTriple", declaration: "a``b" },
        { spec: "spec:probe.search", key: "fnFirst", declaration: "first" },
        { spec: "spec:probe.search", key: "typeLineSep", declaration: 'type S = "\u2028"' },
        { spec: "spec:probe.search", key: "typeParaSep", declaration: 'type S = "\u2029"' },
      ],
    });
  });
});

/** Extracts a Markdown probe corpus from a temporary root the operating system names. */
function markdownProbe(prefix: string, files: Readonly<Record<string, string>>): ExtractionResult {
  const root = mkdtempSync(join(tmpdir(), prefix));
  try {
    for (const [name, text] of Object.entries(files)) writeFileSync(join(root, name), text);
    const extraction = extract({ root });
    expect(extraction.report.findings.filter((finding) => finding.severity === "error")).toEqual(
      [],
    );
    return extraction;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const cycleProbeSpec = (letter: string, dependsOn: readonly string[], design = ""): string =>
  `---
id: spec:probe.${letter}
kind: rule
altitude: story
readiness: idea
relations:
  dependsOn:
${dependsOn.map((target) => `    - spec:probe.${target}`).join("\n")}
---
# Probe ${letter}

## Intent
- outcome: Rest on other probe Specs.

## Rule
- The probe states one rule.
${design}`;

/**
 * A synthetic extraction built in memory: `count` idea-rung rule Specs, each resting on the next
 * through `dependsOn`, and the last on the first when `closed`. The probe is the recipe's walk over
 * a graph this size, not the extractor, so the stub carries only what the query sink reads: the
 * graph, an error-free report, and the counts.
 */
function dependencyChain(count: number, closed = false): ExtractionResult {
  const ids = Array.from(
    { length: count },
    (_, position) => `spec:probe.n${String(position).padStart(5, "0")}`,
  );
  const nodes: GraphNode[] = ids.map((id) => ({
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "rule",
    altitude: "story",
    readiness: "idea",
    title: id,
    file: `specs/${id}.sdp.md`,
    sections: { intent: { outcome: "Rest on the next probe Spec." } },
  }));
  const edges: GraphEdge[] = ids.slice(0, -1).map((from, position) => ({
    from,
    type: "dependsOn",
    to: ids[position + 1] ?? from,
    claim: "declared",
  }));
  const [first] = ids;
  const last = ids[ids.length - 1];
  if (closed && first !== undefined && last !== undefined) {
    edges.push({ from: last, type: "dependsOn", to: first, claim: "declared" });
  }
  return {
    graph: { schemaVersion, nodes, edges },
    report: { validatorId: extractValidatorId, findings: [] },
    counts: { specs: count, packs: 0, anchors: 0 },
  };
}

/** The design's five-Spec probe: `a`, `b`, `c` rest on each other, `d` on itself, `e` on `a`. */
function cycleProbe(): ExtractionResult {
  return markdownProbe("sdp-cycle-probe-", {
    "a.sdp.md": cycleProbeSpec("a", ["b"], "\n## Design\n- shape: A shape.\n"),
    "b.sdp.md": cycleProbeSpec("b", ["a", "c"]),
    "c.sdp.md": cycleProbeSpec("c", ["a"]),
    "d.sdp.md": cycleProbeSpec("d", ["d"]),
    "e.sdp.md": cycleProbeSpec("e", ["a"]),
  });
}

/** One Spec with keyed and unkeyed open questions and a `description` in Design and UI. */
function keyedQuestionProbe(): ExtractionResult {
  return markdownProbe("sdp-keyed-question-probe-", {
    "keyed.sdp.md": `---
id: spec:probe.keyed
kind: rule
altitude: story
readiness: idea
relations: {}
---
# Keyed probe

## Intent
- outcome: Carry keyed questions.

### Open questions
- [blocking #shapeOpen] Is the shape final?
- [non-blocking #description] Is description a key?
- [non-blocking] Who owns the page?

## Rule
- The probe states one rule.

## Design
Leading prose of the design.

- shape: A shape.

## UI
Leading prose of the page.

- panel: One panel.
`,
    "mentioning.sdp.md": `---
id: spec:probe.mentioning
kind: rule
altitude: story
readiness: idea
relations: {}
---
# Mentioning probe

## Intent
- outcome: Cite spec:probe.keyed#question.shapeOpen, spec:probe.keyed#question.description, and spec:probe.keyed#question.missing.

## Rule
- The probe states one rule.
`,
  });
}

/**
 * The dependency cycles of a graph by mutual reachability, a second derivation independent of the
 * recipe's own walk: the sets it must report, each with the length of the shortest closed path
 * from its first member.
 */
function dependencyCycleOracle(extraction: ExtractionResult) {
  const ids = extraction.graph.nodes
    .filter((node) => node.nodeType === "Primitive")
    .map((node) => node.id);
  const known = new Set(ids);
  const targets = new Map(ids.map((id) => [id, new Set<string>()]));
  for (const edge of extraction.graph.edges) {
    if (edge.type === "dependsOn" && edge.claim === "declared" && known.has(edge.to))
      targets.get(edge.from)?.add(edge.to);
  }
  const reachableFrom = (start: string): Set<string> => {
    const seen = new Set<string>();
    const queue = [...(targets.get(start) ?? [])];
    for (const next of queue) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(...(targets.get(next) ?? []));
    }
    return seen;
  };
  const reach = new Map(ids.map((id) => [id, reachableFrom(id)]));
  const sets = new Map<string, string[]>();
  for (const id of ids) {
    const members = ids
      .filter((other) => other === id || (reach.get(id)?.has(other) && reach.get(other)?.has(id)))
      .sort();
    if (members.length > 1 || targets.get(id)?.has(id)) sets.set(members.join(" "), members);
  }
  const shortestReturn = (members: readonly string[]): number => {
    const inside = new Set(members);
    const start = members[0] ?? "";
    const distance = new Map([[start, 0]]);
    const queue = [start];
    let best = Number.POSITIVE_INFINITY;
    for (const current of queue) {
      for (const next of targets.get(current) ?? []) {
        if (!inside.has(next)) continue;
        const steps = (distance.get(current) ?? 0) + 1;
        if (next === start) best = Math.min(best, steps);
        if (!distance.has(next)) {
          distance.set(next, steps);
          queue.push(next);
        }
      }
    }
    return best;
  };
  return {
    targets,
    sets: [...sets.values()]
      .sort((left, right) => ((left[0] ?? "") < (right[0] ?? "") ? -1 : 1))
      .map((members) => ({ members, length: shortestReturn(members) })),
  };
}

/** Checks a recipe 26 answer against the oracle: the same sets, each with a shortest closed path. */
function expectCyclesToMatchOracle(result: Record<string, unknown>, extraction: ExtractionResult) {
  const oracle = dependencyCycleOracle(extraction);
  const cycles = asArray(result.cycles).map(asRecord);
  expect(cycles.map((entry) => entry.members)).toEqual(oracle.sets.map((set) => set.members));
  cycles.forEach((entry, index) => {
    const members = asArray(entry.members).map(String);
    const cycle = asArray(entry.cycle).map(String);
    expect(cycle[0]).toBe(members[0]);
    expect(cycle[cycle.length - 1]).toBe(members[0]);
    expect(cycle.length - 1).toBe(oracle.sets[index]?.length);
    for (let step = 1; step < cycle.length; step += 1) {
      expect(members).toContain(cycle[step]);
      expect(oracle.targets.get(cycle[step - 1] ?? "")?.has(cycle[step] ?? "")).toBe(true);
    }
  });
  expect(result.totals).toEqual({
    sets: oracle.sets.filter((set) => set.members.length > 1).length,
    selfDependent: oracle.sets.filter((set) => set.members.length === 1).length,
    specsInCycles: oracle.sets.reduce((sum, set) => sum + set.members.length, 0),
  });
}

describe("address resolution and dependency cycles", () => {
  it("resolves the catalog's addresses on this corpus as written", async () => {
    // The value and the line are read from the raw graph, the node's section and the location
    // table, so an edit to the Spec moves the expectation with it.
    const holder = primitivesById.get("spec:consumers.design-review");
    const location = derived.graph.locations?.find(
      (row) => row.spec === "spec:consumers.design-review" && row.entry === "ui.packPage",
    );
    expect(location).toBeDefined();
    expect(await runRecipe(recipeByOrdinal(25))).toEqual({
      totals: { addresses: 4, resolved: 1, malformed: 1, spec: 1, entry: 1 },
      rows: [
        {
          address: "spec:consumers.design-review#ui.packPage",
          resolves: true,
          id: "spec:consumers.design-review",
          section: "ui",
          key: "packPage",
          value: holder?.sections?.ui?.packPage,
          file: "specs/consumers/design-review.sdp.md",
          line: location?.line,
          reason: null,
        },
        ...[
          ["spec:consumers.design-review#ui.memberTable", "entry"],
          ["spec:consumers.absent#design.anyKey", "spec"],
          ["spec:consumers.design-review", "malformed"],
        ].map(([address, reason]) => ({
          address,
          resolves: false,
          id: null,
          section: null,
          key: null,
          value: null,
          file: null,
          line: null,
          reason,
        })),
      ],
    });
  });

  it("reports this corpus's dependency cycles as an independent reachability check finds them", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(26)));
    expectCyclesToMatchOracle(result, derived);
    // The design's answer on this corpus: no Spec rests on itself through `dependsOn`.
    expect(result.cycles).toEqual([]);
  });

  it("reports the probe's one set and one self-dependent Spec, and nothing for a Spec that only reaches a set", async () => {
    const extraction = cycleProbe();
    const result = asRecord(await runRecipe(recipeByOrdinal(26), undefined, extraction));
    expect(result).toEqual({
      totals: { sets: 1, selfDependent: 1, specsInCycles: 4 },
      cycles: [
        {
          members: ["spec:probe.a", "spec:probe.b", "spec:probe.c"],
          cycle: ["spec:probe.a", "spec:probe.b", "spec:probe.a"],
        },
        { members: ["spec:probe.d"], cycle: ["spec:probe.d", "spec:probe.d"] },
      ],
    });
    expectCyclesToMatchOracle(result, extraction);
  });

  it("reports a self-loop inside a larger set only with that set", async () => {
    const probe = cycleProbe();
    const extraction: ExtractionResult = {
      ...probe,
      graph: {
        ...probe.graph,
        edges: [
          ...probe.graph.edges,
          { from: "spec:probe.b", to: "spec:probe.b", type: "dependsOn", claim: "declared" },
          { from: "spec:probe.e", to: "spec:probe.absent", type: "dependsOn", claim: "declared" },
        ],
      },
    };
    const result = asRecord(await runRecipe(recipeByOrdinal(26), undefined, extraction));
    expect(result.totals).toEqual({ sets: 1, selfDependent: 1, specsInCycles: 4 });
    expect(asArray(result.cycles).map((entry) => asRecord(entry).members)).toEqual([
      ["spec:probe.a", "spec:probe.b", "spec:probe.c"],
      ["spec:probe.d"],
    ]);
    expectCyclesToMatchOracle(result, extraction);
  });

  it("walks targets in code-unit order, so of two tied shortest cycles the first target's is reported", async () => {
    // `A` rests on `Z` and on `b`, and each rests back on `A`: two closed paths of two steps.
    // In code units `Z` comes before `b`; reversed or alphabetical order would pick `b`.
    const extraction = markdownProbe("sdp-cycle-tie-probe-", {
      "start.sdp.md": cycleProbeSpec("A", ["b", "Z"]),
      "upper.sdp.md": cycleProbeSpec("Z", ["A"]),
      "lower.sdp.md": cycleProbeSpec("b", ["A"]),
    });
    const result = asRecord(await runRecipe(recipeByOrdinal(26), undefined, extraction));
    expect(result).toEqual({
      totals: { sets: 1, selfDependent: 0, specsInCycles: 3 },
      cycles: [
        {
          members: ["spec:probe.A", "spec:probe.Z", "spec:probe.b"],
          cycle: ["spec:probe.A", "spec:probe.Z", "spec:probe.A"],
        },
      ],
    });
    expectCyclesToMatchOracle(result, extraction);
  });

  // A chain this long overflows a recursive walk; the recipe's explicit stack must not.
  it("walks a chain of 10,000 Specs and one cycle of 5,000 without recursing", async () => {
    const chain = asRecord(
      await runRecipe(recipeByOrdinal(26), undefined, dependencyChain(10_000)),
    );
    expect(chain).toEqual({
      totals: { sets: 0, selfDependent: 0, specsInCycles: 0 },
      cycles: [],
    });

    const ring = dependencyChain(5_000, true);
    const ids = ring.graph.nodes.map((node) => node.id);
    const result = asRecord(await runRecipe(recipeByOrdinal(26), undefined, ring));
    expect(result.totals).toEqual({ sets: 1, selfDependent: 0, specsInCycles: 5_000 });
    const [only, ...rest] = asArray(result.cycles).map(asRecord);
    expect(rest).toEqual([]);
    expect(only?.members).toEqual(ids);
    expect(only?.cycle).toEqual([...ids, ids[0]]);
  });

  it("resolves an inherited property name only where the Spec authors it as a key", async () => {
    const designProbeSpec = (leaf: string, entry: string): string => `---
id: spec:probe.${leaf}
kind: rule
altitude: story
readiness: idea
relations: {}
---
# Probe ${leaf}

## Intent
- outcome: Carry one Design entry.

## Rule
- The probe states one rule.

## Design
- ${entry}
`;
    const extraction = markdownProbe("sdp-inherited-key-probe-", {
      "plain.sdp.md": designProbeSpec("plain", "shape: A shape."),
      "authored.sdp.md": designProbeSpec("authored", "constructor: An authored constructor."),
    });
    const result = await runRecipe(
      recipeByOrdinal(25),
      {
        addresses: [
          "spec:probe.plain#design.constructor",
          "spec:probe.authored#design.constructor",
        ],
      },
      extraction,
    );
    expect(result).toEqual({
      totals: { addresses: 2, resolved: 1, malformed: 0, spec: 0, entry: 1 },
      rows: [
        {
          address: "spec:probe.plain#design.constructor",
          resolves: false,
          id: null,
          section: null,
          key: null,
          value: null,
          file: null,
          line: null,
          reason: "entry",
        },
        {
          address: "spec:probe.authored#design.constructor",
          resolves: true,
          id: "spec:probe.authored",
          section: "design",
          key: "constructor",
          value: "An authored constructor.",
          file: "authored.sdp.md",
          line: 17,
          reason: null,
        },
      ],
    });
  });

  it("resolves the design's probe addresses with one row and one reason each", async () => {
    const result = await runRecipe(
      recipeByOrdinal(25),
      {
        addresses: [
          "spec:probe.a#design.shape",
          "spec:probe.a#question.shapeOpen",
          "spec:probe.z#design.shape",
          "spec:probe.a#Design.shape",
        ],
      },
      cycleProbe(),
    );
    expect(result).toEqual({
      totals: { addresses: 4, resolved: 1, malformed: 1, spec: 1, entry: 1 },
      rows: [
        {
          address: "spec:probe.a#design.shape",
          resolves: true,
          id: "spec:probe.a",
          section: "design",
          key: "shape",
          value: "A shape.",
          file: "a.sdp.md",
          line: 19,
          reason: null,
        },
        ...[
          ["spec:probe.a#question.shapeOpen", "entry"],
          ["spec:probe.z#design.shape", "spec"],
          ["spec:probe.a#Design.shape", "malformed"],
        ].map(([address, reason]) => ({
          address,
          resolves: false,
          id: null,
          section: null,
          key: null,
          value: null,
          file: null,
          line: null,
          reason,
        })),
      ],
    });
  });

  it("resolves a keyed question, refuses description in Design and UI, and keeps repeats", async () => {
    const extraction = keyedQuestionProbe();
    const sections = createReader(extraction.graph).specContext("spec:probe.keyed")?.sections;
    expect(sections?.design).toHaveProperty("description");
    expect(sections?.ui).toHaveProperty("description");
    const resolved = (
      address: string,
      section: string,
      key: string,
      value: string,
      line: number,
    ) => ({
      address,
      resolves: true,
      id: "spec:probe.keyed",
      section,
      key,
      value,
      file: "keyed.sdp.md",
      line,
      reason: null,
    });
    const refused = (address: unknown, reason: string) => ({
      address,
      resolves: false,
      id: null,
      section: null,
      key: null,
      value: null,
      file: null,
      line: null,
      reason,
    });
    const result = await runRecipe(
      recipeByOrdinal(25),
      {
        addresses: [
          "spec:probe.keyed#question.shapeOpen",
          "spec:probe.keyed#question.description",
          "spec:probe.keyed#design.description",
          "spec:probe.keyed#ui.description",
          "spec:probe.keyed#question.ownerOpen",
          "spec:probe.keyed#design.shape",
          "spec:probe.keyed",
          42,
          "pack:probe.keyed#design.shape",
          "spec:probe.keyed#question.shapeOpen",
        ],
      },
      extraction,
    );
    expect(result).toEqual({
      totals: { addresses: 10, resolved: 4, malformed: 3, spec: 0, entry: 3 },
      rows: [
        resolved(
          "spec:probe.keyed#question.shapeOpen",
          "question",
          "shapeOpen",
          "Is the shape final?",
          14,
        ),
        resolved(
          "spec:probe.keyed#question.description",
          "question",
          "description",
          "Is description a key?",
          15,
        ),
        refused("spec:probe.keyed#design.description", "entry"),
        refused("spec:probe.keyed#ui.description", "entry"),
        refused("spec:probe.keyed#question.ownerOpen", "entry"),
        resolved("spec:probe.keyed#design.shape", "design", "shape", "A shape.", 24),
        refused("spec:probe.keyed", "malformed"),
        refused(42, "malformed"),
        refused("pack:probe.keyed#design.shape", "malformed"),
        resolved(
          "spec:probe.keyed#question.shapeOpen",
          "question",
          "shapeOpen",
          "Is the shape final?",
          14,
        ),
      ],
    });
  });

  it("registers a keyed question with its key and an unkeyed one with a null key", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(20), undefined, keyedQuestionProbe()));
    expect(asArray(result.specs).map(asRecord)[0]?.questions).toEqual([
      { blocking: true, question: "Is the shape final?", key: "shapeOpen" },
      { blocking: false, question: "Is description a key?", key: "description" },
      { blocking: false, question: "Who owns the page?", key: null },
    ]);
  });

  it("audits a question address against the target's open question keys", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(22), undefined, keyedQuestionProbe()));
    expect(result.unresolved).toEqual([
      {
        from: "spec:probe.mentioning",
        to: "spec:probe.keyed#question.missing",
        reason: "entry",
        totals: { occurrences: 1 },
        at: [{ section: "intent", entry: "outcome" }],
      },
    ]);
    expect(asRecord(result.totals).occurrences).toBe(3);
  });

  it("addresses a keyed question's text and matches its key, never the key as a row", async () => {
    const recipe = recipeByOrdinal(23);
    const search = async (term: string) =>
      asArray(asRecord(await runRecipe(recipe, { term }, keyedQuestionProbe())).matches)
        .map(asRecord)
        .filter((row) => row.id === "spec:probe.keyed");
    expect(await search("shape open")).toEqual([
      {
        id: "spec:probe.keyed",
        section: "intent",
        entry: "openQuestions[0].question",
        address: "spec:probe.keyed#question.shapeOpen",
        line: 14,
        matchedIn: ["key"],
        text: "Is the shape final?",
      },
    ]);
    // An unkeyed question has no address but still a line: the table locates every question.
    const owner = await search("owns");
    expect(owner.map((row) => [row.entry, row.address, row.line])).toEqual([
      ["openQuestions[2].question", null, 16],
    ]);
    const description = await search("description");
    expect(description.map((row) => [row.entry, row.address, row.matchedIn])).toEqual([
      ["openQuestions[1].question", "spec:probe.keyed#question.description", ["key", "text"]],
    ]);
  });
});

const studioPackId = "pack:spec-studio-v1";

/** Plain code-unit order, the order the reader sorts relations and units in. */
function codeUnitOrder(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** One recipe 27 row, computed from the raw graph rather than through the reader. */
function referenceRowFromGraph(extraction: ExtractionResult, memberId: string) {
  const nodes = new Map(extraction.graph.nodes.map((node) => [node.id, node] as const));
  const member = nodes.get(memberId);
  const unitsBy = (type: "references" | "satisfies", specId: string) =>
    extraction.graph.edges
      .filter((edge) => edge.type === type && edge.to === specId)
      .filter((edge) => nodes.get(edge.from)?.nodeType === "CodeNode")
      .map((edge) => edge.from)
      .sort();
  const located = (ids: readonly string[]) =>
    ids.map((id) => ({ id, file: nodes.get(id)?.file ?? null }));
  const factsOf = (id: string) => {
    const node = nodes.get(id);
    return node?.nodeType === "Primitive" ? (node.deliveryFacts ?? []) : [];
  };
  // Builds on: the member's own declared `dependsOn` and `refines` edges whose target carries
  // `implemented`, in relation then id order, each with the units that realize the target.
  const buildsOn = extraction.graph.edges
    .filter((edge) => edge.from === memberId && edge.claim === "declared")
    .filter((edge) => edge.type === "dependsOn" || edge.type === "refines")
    .filter((edge) => factsOf(edge.to).includes("implemented"))
    .sort((left, right) => codeUnitOrder(left.type, right.type) || codeUnitOrder(left.to, right.to))
    .map((edge) => ({
      id: edge.to,
      via: edge.type,
      implementedBy: located(unitsBy("satisfies", edge.to)),
    }));

  return {
    id: memberId,
    resolved: member?.nodeType === "Primitive",
    referencedBy: located(unitsBy("references", memberId)),
    implementedBy: unitsBy("satisfies", memberId),
    hasVerifier: factsOf(memberId).includes("has-verifier"),
    buildsOn,
  };
}

/** Every value one CodeNode field carries, with its units, computed from the raw graph. */
function taxonomyFromGraph(extraction: ExtractionResult, field: "role" | "layer" | "context") {
  const byValue = new Map<string, string[]>();
  for (const node of extraction.graph.nodes) {
    const value = node.nodeType === "CodeNode" ? node[field] : undefined;
    if (value !== undefined) byValue.set(value, [...(byValue.get(value) ?? []), node.id]);
  }
  return [...byValue.keys()]
    .sort()
    .map((value) => ({ value, units: [...(byValue.get(value) ?? [])].sort() }));
}

/**
 * The base graph plus one identity-only code unit that references two Studio members and carries
 * a role, one component with a layer and a context, and a dangling member on the Studio Pack.
 */
function referenceProbe(): {
  readonly extraction: ExtractionResult;
  readonly targets: readonly [string, string];
} {
  const pack = derived.graph.nodes.find((node) => node.id === studioPackId);
  if (pack?.nodeType !== "Pack") throw new Error(`the corpus must hold ${studioPackId}`);
  const [first, second] = pack.members;
  if (first === undefined || second === undefined) {
    throw new Error(`${studioPackId} must hold at least two members`);
  }
  const unit: GraphNode = {
    id: "impl:probe.studio-reader",
    nodeType: "CodeNode",
    claim: "anchored",
    label: "answers to the Studio design",
    file: "src/probe/studio-reader.ts",
    line: 1,
    role: "probe-role",
  };
  const seam: GraphNode = {
    id: "component:probe.studio-seam",
    nodeType: "CodeNode",
    claim: "anchored",
    file: "src/probe/studio-seam.ts",
    line: 1,
    layer: "domain",
    context: "probe-context",
  };
  const references: readonly GraphEdge[] = [first, second].map((to) => ({
    from: unit.id,
    type: "references",
    to,
    claim: "anchored",
  }));

  return {
    targets: [first, second],
    extraction: {
      counts: derived.counts,
      report: derived.report,
      graph: {
        schemaVersion: derived.graph.schemaVersion,
        nodes: [
          ...derived.graph.nodes.map((node) =>
            node === pack
              ? { ...pack, members: [...pack.members, "spec:probe.absent-member"] }
              : node,
          ),
          unit,
          seam,
        ],
        edges: [...derived.graph.edges, ...references],
      },
    },
  };
}

describe("design references and the architecture taxonomy", () => {
  it("returns one row per Studio member with four independent facts", async () => {
    const recipe = recipeByOrdinal(27);
    const result = asRecord(await runRecipe(recipe));
    const pack = derived.graph.nodes.find((node) => node.id === studioPackId);
    if (pack?.nodeType !== "Pack") throw new Error(`the corpus must hold ${studioPackId}`);
    const rows = asArray(result.rows).map(asRecord);

    expect(result.found).toBe(true);
    expect(result.id).toBe(studioPackId);
    expect(rows.map((row) => stringAt(row, "id"))).toEqual(pack.members);
    expect(rows).toEqual(pack.members.map((id) => referenceRowFromGraph(derived, id)));

    const count = (test: (row: Record<string, unknown>) => boolean) => rows.filter(test).length;
    const listed = (row: Record<string, unknown>, key: string) => asArray(row[key]).length > 0;
    expect(result.totals).toEqual({
      members: rows.length,
      withReferences: count((row) => listed(row, "referencedBy")),
      withImplementations: count((row) => listed(row, "implementedBy")),
      withVerifier: count((row) => row.hasVerifier === true),
      withBuildsOn: count((row) => listed(row, "buildsOn")),
      unbound: count(
        (row) =>
          !listed(row, "referencedBy") && !listed(row, "implementedBy") && row.hasVerifier !== true,
      ),
    });

    const absent = await runRecipe(recipe, { pack: "pack:absent-v1" });
    expect(absent).toEqual({ id: "pack:absent-v1", found: false });
  });

  it("lists a referencing unit beside the realizing units without conferring implemented", async () => {
    const { extraction, targets } = referenceProbe();
    const [target] = targets;
    const before = asArray(asRecord(await runRecipe(recipeByOrdinal(27))).rows).map(asRecord);
    const after = asArray(
      asRecord(await runRecipe(recipeByOrdinal(27), undefined, extraction)).rows,
    ).map(asRecord);
    const rowFor = (rows: readonly Record<string, unknown>[], id: string) =>
      rows.find((row) => row.id === id);

    expect(asArray(rowFor(after, target)?.referencedBy)).toContainEqual({
      id: "impl:probe.studio-reader",
      file: "src/probe/studio-reader.ts",
    });
    expect(rowFor(after, target)?.implementedBy).toEqual(rowFor(before, target)?.implementedBy);
    expect(rowFor(after, target)?.hasVerifier).toBe(rowFor(before, target)?.hasVerifier);
    expect(createReader(extraction.graph).specContext(target)?.deliveryFacts).toEqual(
      reader.specContext(target)?.deliveryFacts,
    );
    expect(rowFor(after, "spec:probe.absent-member")).toEqual({
      id: "spec:probe.absent-member",
      resolved: false,
      referencedBy: [],
      implementedBy: [],
      hasVerifier: false,
      buildsOn: [],
    });
  });

  it("lists the reader beside each Studio member that depends on it, with its realizing units", async () => {
    const rows = asArray(asRecord(await runRecipe(recipeByOrdinal(27))).rows).map(asRecord);
    const readerId = "spec:consumers.reader";
    const readerUnits = derived.graph.edges
      .filter((edge) => edge.type === "satisfies" && edge.to === readerId)
      .map((edge) => edge.from)
      .sort()
      .map((id) => ({
        id,
        file: derived.graph.nodes.find((node) => node.id === id)?.file ?? null,
      }));
    const dependents = derived.graph.edges
      .filter((edge) => edge.type === "dependsOn" && edge.to === readerId)
      .map((edge) => edge.from)
      .filter((id) => rows.some((row) => row.id === id))
      .sort();

    // The design that builds on the reader says so on its own side; the reader's code names
    // none of its consumers' designs.
    expect(reader.specContext(readerId)?.deliveryFacts).toContain("implemented");
    expect(readerUnits.map((unit) => unit.file)).toContain("src/reader/reader.ts");
    expect(dependents).toEqual(["spec:consumers.spec-studio", "spec:consumers.spec-studio.data"]);
    for (const id of dependents) {
      expect(asArray(rows.find((row) => row.id === id)?.buildsOn), id).toContainEqual({
        id: readerId,
        via: "dependsOn",
        implementedBy: readerUnits,
      });
    }
    expect(
      derived.graph.edges.filter(
        (edge) => edge.type === "references" && dependents.includes(edge.to),
      ),
    ).toEqual([]);
    // A target with no `implemented` fact stays out of the column: the Studio depends on the
    // edit model, which no unit realizes.
    expect(reader.specContext("spec:consumers.edit-model")?.deliveryFacts).not.toContain(
      "implemented",
    );
    const studio = asArray(rows.find((row) => row.id === "spec:consumers.spec-studio")?.buildsOn);
    expect(studio.map((entry) => asRecord(entry).id)).not.toContain("spec:consumers.edit-model");
  });

  it("derives builds-on from the member's relations without conferring a fact on it", async () => {
    const pack = derived.graph.nodes.find((node) => node.id === studioPackId);
    if (pack?.nodeType !== "Pack") throw new Error(`the corpus must hold ${studioPackId}`);
    const [member] = pack.members;
    if (member === undefined) throw new Error(`${studioPackId} must hold a member`);
    const primitives = derived.graph.nodes.filter((node) => node.nodeType === "Primitive");
    const related = new Set(
      derived.graph.edges.filter((edge) => edge.from === member).map((edge) => edge.to),
    );
    const built = primitives.find(
      (node) =>
        node.id !== member &&
        !related.has(node.id) &&
        (node.deliveryFacts ?? []).includes("implemented"),
    );
    const unbuilt = primitives.find(
      (node) =>
        node.id !== member &&
        !related.has(node.id) &&
        !(node.deliveryFacts ?? []).includes("implemented"),
    );
    if (built === undefined || unbuilt === undefined) {
      throw new Error("the corpus must hold an implemented and an unimplemented Spec");
    }
    const extraction: ExtractionResult = {
      counts: derived.counts,
      report: derived.report,
      graph: {
        schemaVersion: derived.graph.schemaVersion,
        nodes: derived.graph.nodes,
        edges: [
          ...derived.graph.edges,
          { from: member, type: "dependsOn", to: built.id, claim: "declared" },
          { from: member, type: "refines", to: unbuilt.id, claim: "declared" },
        ],
      },
    };
    const rowFor = async (probe: ExtractionResult) =>
      asArray(asRecord(await runRecipe(recipeByOrdinal(27), undefined, probe)).rows)
        .map(asRecord)
        .find((row) => row.id === member);
    const before = await rowFor(derived);
    const after = await rowFor(extraction);

    expect(after).toEqual(referenceRowFromGraph(extraction, member));
    expect(asArray(after?.buildsOn)).toContainEqual({
      id: built.id,
      via: "dependsOn",
      implementedBy: referenceRowFromGraph(extraction, built.id).implementedBy.map((id) => ({
        id,
        file: derived.graph.nodes.find((node) => node.id === id)?.file ?? null,
      })),
    });
    expect(asArray(after?.buildsOn).map((entry) => asRecord(entry).id)).not.toContain(unbuilt.id);
    expect(after?.implementedBy).toEqual(before?.implementedBy);
    expect(after?.hasVerifier).toBe(before?.hasVerifier);
    expect(createReader(extraction.graph).specContext(member)?.deliveryFacts).toEqual(
      reader.specContext(member)?.deliveryFacts,
    );
  });

  it("returns the role, layer, and context taxonomy from the code units alone", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(28)));
    const units = derived.graph.nodes.filter((node) => node.nodeType === "CodeNode");
    const references = derived.graph.edges.filter((edge) => edge.type === "references");

    expect(result).toEqual({
      totals: {
        codeUnits: units.length,
        withRole: units.filter((unit) => unit.role !== undefined).length,
        withLayer: units.filter((unit) => unit.layer !== undefined).length,
        withContext: units.filter((unit) => unit.context !== undefined).length,
        references: references.length,
        referencingUnits: new Set(references.map((edge) => edge.from)).size,
        referencedSpecs: new Set(references.map((edge) => edge.to)).size,
      },
      roles: taxonomyFromGraph(derived, "role"),
      layers: taxonomyFromGraph(derived, "layer"),
      contexts: taxonomyFromGraph(derived, "context"),
    });
  });

  it("counts references as edges apart from the units that carry them", async () => {
    const { extraction } = referenceProbe();
    const before = asRecord(asRecord(await runRecipe(recipeByOrdinal(28))).totals);
    const result = asRecord(await runRecipe(recipeByOrdinal(28), undefined, extraction));
    const after = asRecord(result.totals);
    const valueRow = (key: string, value: string) =>
      asArray(result[key])
        .map(asRecord)
        .find((row) => row.value === value);

    expect(numberAt(after, "codeUnits")).toBe(numberAt(before, "codeUnits") + 2);
    expect(numberAt(after, "references")).toBe(numberAt(before, "references") + 2);
    expect(numberAt(after, "referencingUnits")).toBe(numberAt(before, "referencingUnits") + 1);
    expect(valueRow("roles", "probe-role")).toEqual({
      value: "probe-role",
      units: ["impl:probe.studio-reader"],
    });
    expect(valueRow("contexts", "probe-context")).toEqual({
      value: "probe-context",
      units: ["component:probe.studio-seam"],
    });
    expect(asArray(valueRow("layers", "domain")?.units)).toContain("component:probe.studio-seam");
  });

  // The sink compiles a body this way and calls it with the same four bindings; calling the
  // compiled body directly keeps the count to the body alone.
  it("creates each taxonomy bucket once, however many units share the value", async () => {
    const ids = Array.from(
      { length: 20_000 },
      (_unit, index) => `component:probe.unit-${String(index).padStart(5, "0")}`,
    );
    const graph: GraphSchema = {
      schemaVersion,
      // Reverse insertion: each row lists its units in id order, never the graph's.
      nodes: [...ids].reverse().map(
        (id): GraphNode => ({
          id,
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/probe.ts",
          role: "service",
          context: "probe",
        }),
      ),
      edges: [],
    };
    const body = compileBody(recipeByOrdinal(28).body);
    const reader = createReader(graph);
    const report = validateGraph(graph);
    const { value, sets } = countMapSets(() => body(reader, graph, report, {}));
    const result = asRecord(await value);

    // Two buckets, `service` and `probe`, two Map sets. Replacing the bucket on every insertion
    // would set once per unit and attribute, 40,000 here.
    expect(sets).toBe(2);
    expect(result.roles).toEqual([{ value: "service", units: ids }]);
    expect(result.contexts).toEqual([{ value: "probe", units: ids }]);
    expect(result.layers).toEqual([]);
  });
});

const recipeParametersCatalogAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.recipe-parameters-catalog"),
  label: "asserts realization of the catalog recipes that read their parameter from params",
  satisfies: ref("spec:consumers.agent-surface.recipe-parameters"),
});
void recipeParametersCatalogAnchor;
const recipeParametersTestAnchor = specTest({
  id: testAnchorId("test:protocol.recipe-parameters"),
  label: "recipe checks verify parameters passed as data and the shipped recipe files",
  verifies: ref("spec:consumers.agent-surface.recipe-parameters"),
});
void recipeParametersTestAnchor;

const shippedRecipesDirectory = join(repoRoot, "dist", "recipes");

/** The file the build owes a recipe: its two-digit number, then its heading in lower kebab case. */
function shippedRecipeName(recipe: Recipe): string {
  const slug = recipe.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");

  return `${String(recipe.ordinal).padStart(2, "0")}-${slug}.js`;
}

function readShippedRecipe(recipe: Recipe): string {
  const path = join(shippedRecipesDirectory, shippedRecipeName(recipe));

  if (!existsSync(path)) {
    throw new Error(`${path} is missing: run npm run build before the recipe check`);
  }

  return readFileSync(path, "utf8");
}

/** The body `sdp q "$(cat FILE)"` hands the sink: command substitution drops trailing newlines. */
function shippedBody(recipe: Recipe): string {
  return readShippedRecipe(recipe).replace(/\n+$/u, "");
}

/** The catalog text a recipe owns, heading through the line before the next numbered heading. */
function recipeProse(recipe: Recipe): string {
  const start = source.indexOf(`\n## ${String(recipe.ordinal)}. `);
  const next = source.indexOf(`\n## ${String(recipe.ordinal + 1)}. `, start + 1);

  return source.slice(start, next === -1 ? undefined : next).replace(recipe.body, "");
}

async function runShipped(
  body: string,
  params: readonly string[],
): Promise<{ readonly exitCode: number; readonly stdout: string; readonly stderr: string }> {
  const capture = createCaptureOutput();
  const exitCode = await runSdpCli(
    ["q", body, "--root", repoRoot, "--json", ...params],
    capture.output,
    queryHooks,
  );

  return { exitCode, stdout: capture.readStdout(), stderr: capture.readStderr() };
}

describe("recipe parameters and the shipped recipe files", () => {
  it("reads each parameter from params, falls back to the catalog sample, and names it", () => {
    const parameterized = recipes.filter((recipe) => /\bparams\./u.test(recipe.body));

    expect(parameterized.map((recipe) => recipe.ordinal)).toEqual(
      expect.arrayContaining([3, 4, 5, 9, 19, 21, 22, 25, 27]),
    );

    for (const recipe of parameterized) {
      const names = new Set(
        [...recipe.body.matchAll(/\bparams\.([A-Za-z]+)/gu)].map((match) => match[1] ?? ""),
      );

      for (const name of names) {
        expect({
          recipe: recipe.ordinal,
          fallback: recipe.body.includes(`params.${name} ?? `),
        }).toEqual({ recipe: recipe.ordinal, fallback: true });
        expect({
          recipe: recipe.ordinal,
          named: recipeProse(recipe).includes(`\`params.${name}\``),
        }).toEqual({ recipe: recipe.ordinal, named: true });
      }
    }
  });

  it("ships every catalog body as dist/recipes/NN-slug.js, byte for byte", () => {
    const shipped = readdirSync(shippedRecipesDirectory)
      .filter((entry) => entry.endsWith(".js"))
      .sort();

    expect(shipped).toEqual(recipes.map(shippedRecipeName).sort());
    for (const recipe of recipes) {
      expect({ recipe: recipe.ordinal, bytes: readShippedRecipe(recipe) }).toEqual({
        recipe: recipe.ordinal,
        bytes: `${recipe.body}\n`,
      });
    }

    // The build step derives the same pairing the check parses: one file per numbered heading.
    expect(recipeFiles(source).map((file) => file.fileName)).toEqual(
      recipes.map(shippedRecipeName),
    );

    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      readonly files: readonly string[];
    };
    expect(packageJson.files).toContain("dist/**");
  });

  it("runs every shipped file, read whole, to the answer its catalog body gives", async () => {
    for (const recipe of recipes) {
      const shipped = await runRecipe({ ...recipe, body: shippedBody(recipe) });

      expect({ recipe: recipe.ordinal, shipped }).toEqual({
        recipe: recipe.ordinal,
        shipped: await runRecipe(recipe),
      });
    }
  });

  it("refuses a catalog whose bodies and headings do not pair, rather than guess a file name", () => {
    expect(() => recipeFiles("## 1. One\n\n```js\nreturn 1;\n```\n## 1. Again\n")).toThrow(
      "recipe 1 is numbered twice",
    );
    expect(() => recipeFiles("```js\nreturn 1;\n```\n")).toThrow("has no numbered heading");
    expect(() => recipeFiles("## 2. Two\n\n## 3. Three\n```js\nreturn 3;\n```\n")).toThrow(
      "recipe 2 has no js body",
    );
    expect(() => recipeFiles("## 4. Four\n```js\nreturn 4;\n")).toThrow("is never closed");
    expect(() => recipeFiles("## 5. !!!\n```js\nreturn 5;\n```\n")).toThrow("has no heading text");
    expect(recipeFiles("## 7. Roles, layers and contexts\n```js\nreturn 7;\n```\n")).toEqual([
      { ordinal: 7, fileName: "07-roles-layers-and-contexts.js", content: "return 7;\n" },
    ]);
  });

  it("reads a CRLF catalog as its LF bodies, and refuses a catalog with no recipe before publishing", () => {
    const crlf = source.replaceAll("\n", "\r\n");

    expect(recipeFiles(crlf)).toEqual(recipeFiles(source));
    expect(() => recipeFiles("# Agent-surface recipes\r\n\r\nNo bodies yet.\r\n")).toThrow(
      "has no numbered recipe",
    );

    // Through the build step: a CRLF catalog publishes every body, and an empty one publishes
    // nothing and removes nothing.
    const root = mkdtempSync(join(tmpdir(), "sdp-recipe-files-"));
    const catalogPath = join(root, recipesPath);
    const recipesOut = join(root, "dist", "recipes");

    try {
      mkdirSync(join(root, "docs", "agent-surface"), { recursive: true });
      writeFileSync(catalogPath, crlf);
      writeBuildArtifacts({ root, outDir: join(root, "dist"), git: () => "unknown" });
      expect(readdirSync(recipesOut).sort()).toEqual(recipes.map(shippedRecipeName).sort());
      for (const recipe of recipes) {
        expect({
          recipe: recipe.ordinal,
          bytes: readFileSync(join(recipesOut, shippedRecipeName(recipe)), "utf8"),
        }).toEqual({ recipe: recipe.ordinal, bytes: `${recipe.body}\n` });
      }

      writeFileSync(catalogPath, "# Agent-surface recipes\r\n");
      expect(() => {
        writeBuildArtifacts({ root, outDir: join(root, "dist"), git: () => "unknown" });
      }).toThrow("has no numbered recipe");
      expect(readdirSync(recipesOut).sort()).toEqual(recipes.map(shippedRecipeName).sort());
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("removes only completed recipe files the catalog no longer owes, never another run's temporary file", () => {
    const outDir = mkdtempSync(join(tmpdir(), "sdp-recipe-stale-"));
    const directory = join(outDir, "recipes");
    const foreignTemporary = "01-one.js.4242.tmp";

    try {
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, "02-retired.js"), "return 2;\n");
      writeFileSync(join(directory, foreignTemporary), "return 'half written';\n");

      writeRecipeFiles(outDir, recipeFiles("## 1. One\n```js\nreturn 1;\n```\n"));

      expect(readdirSync(directory).sort()).toEqual(["01-one.js", foreignTemporary]);
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
  });

  it("passes recipe 4 its changed files from a file named with @PATH", async () => {
    const directory = mkdtempSync(join(tmpdir(), "sdp-recipe-params-"));
    const files = ["src/reader/reader.ts", "docs/agent-surface/recipes.md", "absent/file.ts"];

    try {
      const path = join(directory, "changed.json");
      writeFileSync(path, JSON.stringify({ files }));

      const run = await runShipped(shippedBody(recipeByOrdinal(4)), ["--params", `@${path}`]);
      expect({ exitCode: run.exitCode, stderr: run.stderr }).toEqual({ exitCode: 0, stderr: "" });

      const result = asRecord(JSON.parse(run.stdout));
      const radius = reader.blastRadius(files);
      expect(result.changedFiles).toEqual(radius.changedFiles);
      expect(asArray(result.impactedSpecs).map((row) => stringAt(asRecord(row), "id"))).toEqual(
        radius.impactedSpecs.map((item) => item.id),
      );
      expect(result.coverageUnknownFiles).toEqual(radius.coverageUnknown);
      expect(result.coverageUnknownFiles).toContain("absent/file.ts");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("resolves the addresses recipe 25 receives as data", async () => {
    const holder = reader.specs().find((spec) => {
      const design = reader.specContext(spec.id)?.sections?.design;
      return (
        design !== undefined && Object.keys(design).some((key) => /^[a-z][A-Za-z0-9]*$/u.test(key))
      );
    });
    if (holder === undefined) throw new Error("the corpus holds no keyed Design entry");
    const key = Object.keys(reader.specContext(holder.id)?.sections?.design ?? {}).find(
      (candidate) => candidate !== "description" && /^[a-z][A-Za-z0-9]*$/u.test(candidate),
    );
    if (key === undefined) throw new Error(`${holder.id} holds no addressable Design key`);
    const addresses = [
      `${holder.id}#design.${key}`,
      `${holder.id}#design.noSuchKey`,
      "spec:probe.absent#design.anyKey",
      holder.id,
    ];

    const run = await runShipped(shippedBody(recipeByOrdinal(25)), [
      "--params",
      JSON.stringify({ addresses }),
    ]);
    expect({ exitCode: run.exitCode, stderr: run.stderr }).toEqual({ exitCode: 0, stderr: "" });

    const result = asRecord(JSON.parse(run.stdout));
    expect(result.totals).toEqual({
      addresses: 4,
      resolved: 1,
      malformed: 1,
      spec: 1,
      entry: 1,
    });
    expect(asArray(result.rows).map((row) => asRecord(row).reason)).toEqual([
      null,
      "entry",
      "spec",
      "malformed",
    ]);
  });

  it("reads the Pack the Pack recipes review from params.pack", async () => {
    const packIds = reader.packs().map((pack) => pack.id);
    const chosen = packIds[packIds.length - 1];
    if (chosen === undefined) throw new Error("the corpus holds no Pack");
    const members = reader.packContext(chosen)?.members.length;

    for (const ordinal of [5, 27]) {
      const body = shippedBody(recipeByOrdinal(ordinal));
      const run = await runShipped(body, ["--params", JSON.stringify({ pack: chosen })]);
      expect({ exitCode: run.exitCode, stderr: run.stderr }).toEqual({ exitCode: 0, stderr: "" });

      const result = asRecord(JSON.parse(run.stdout));
      expect(result.id).toBe(chosen);
      expect(ordinal === 5 ? result.memberCount : asRecord(result.totals).members).toBe(members);

      const absent = await runShipped(body, ["--params", '{"pack":"pack:absent-v1"}']);
      expect(JSON.parse(absent.stdout)).toEqual({ id: "pack:absent-v1", found: false });
    }

    // Without the parameter, recipe 5 falls back to its sample: the first Pack in the graph.
    expect(asRecord(await runRecipe(recipeByOrdinal(5))).id).toBe(packIds[0]);
  });
});

const designRecipesImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.design-recipes"),
  label: "asserts realization of the shipped design recipes",
  satisfies: ref("spec:consumers.agent-surface.design-recipes"),
});
void designRecipesImplementationAnchor;
const designRecipesTestAnchor = specTest({
  id: testAnchorId("test:protocol.design-recipes"),
  label: "recipe checks verify the design recipes",
  verifies: ref("spec:consumers.agent-surface.design-recipes"),
});
void designRecipesTestAnchor;

type ProbeSpecKind = Extract<GraphNode, { nodeType: "Primitive" }>["specKind"];
type ProbeReadiness = Extract<GraphNode, { nodeType: "Primitive" }>["readiness"];
type ProbeSections = Extract<GraphNode, { nodeType: "Primitive" }>["sections"];

/** One Spec of an in-memory probe graph. */
function probeSpec(
  id: string,
  specKind: ProbeSpecKind = "rule",
  readiness: ProbeReadiness = "idea",
  sections: ProbeSections = { intent: { outcome: "Probe." } },
): GraphNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind,
    altitude: "story",
    readiness,
    title: `Title of ${id}`,
    file: `specs/${id}.sdp.md`,
    sections,
  };
}

/** One code unit of an in-memory probe graph, with its structural attributes. */
function probeUnit(
  id: string,
  line: number,
  structure: { readonly layer?: "edge" | "domain"; readonly context?: string } = {},
): GraphNode {
  return { id, nodeType: "CodeNode", claim: "anchored", file: "src/probe.ts", line, ...structure };
}

function probeEdge(
  from: string,
  type: GraphEdge["type"],
  to: string,
  claim: GraphEdge["claim"] = "declared",
): GraphEdge {
  return { from, type, to, claim };
}

/**
 * A synthetic extraction built in memory. The probe is the recipe's reading of a graph, not the
 * extractor, so the stub carries only what the query sink reads: the graph, an error-free report,
 * and the counts.
 */
function syntheticExtraction(
  nodes: readonly GraphNode[],
  edges: readonly GraphEdge[],
): ExtractionResult {
  return {
    graph: { schemaVersion, nodes: [...nodes], edges: [...edges] },
    report: { validatorId: extractValidatorId, findings: [] },
    counts: {
      specs: nodes.filter((node) => node.nodeType === "Primitive").length,
      packs: nodes.filter((node) => node.nodeType === "Pack").length,
      anchors: nodes.filter((node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode")
        .length,
    },
  };
}

const designFollowedTypes = new Set(["refines", "dependsOn", "constrainedBy", "decidedBy"]);

/** The units bound to a Spec by one edge type, read from the raw graph in code-unit order. */
function rawUnits(extraction: ExtractionResult, type: "satisfies" | "references", specId: string) {
  const nodes = new Map(extraction.graph.nodes.map((node) => [node.id, node] as const));
  return extraction.graph.edges
    .filter((edge) => edge.type === type && edge.to === specId)
    .map((edge) => nodes.get(edge.from))
    .filter(
      (node): node is Extract<GraphNode, { nodeType: "CodeNode" }> => node?.nodeType === "CodeNode",
    )
    .sort((left, right) => codeUnitOrder(left.id, right.id));
}

/** The resolving verifiers of a Spec from the raw graph: test anchors and enabled examples. */
function rawEnabledVerifiers(extraction: ExtractionResult, specId: string): string[] {
  const nodes = new Map(extraction.graph.nodes.map((node) => [node.id, node] as const));
  const anchoredBy = (id: string) =>
    extraction.graph.edges.some(
      (edge) =>
        edge.type === "verifies" &&
        edge.to === id &&
        edge.claim === "anchored" &&
        nodes.get(edge.from)?.nodeType === "Anchor",
    );
  return extraction.graph.edges
    .filter((edge) => edge.type === "verifies" && edge.to === specId)
    .filter((edge) => {
      const source = nodes.get(edge.from);
      if (source?.nodeType === "Anchor") return edge.claim === "anchored";
      return (
        source?.nodeType === "Primitive" &&
        source.specKind === "example" &&
        edge.claim === "declared" &&
        anchoredBy(source.id)
      );
    })
    .map((edge) => edge.from)
    .sort(codeUnitOrder);
}

/**
 * Design-change impact by relaxation, a second derivation independent of the recipe's walk: the
 * shortest number of inbound `refines`, `dependsOn`, `constrainedBy` or `decidedBy` hops from any
 * changed Spec to every Spec that rests on it.
 */
function impactOracle(extraction: ExtractionResult, changed: readonly string[]) {
  const specIds = new Set(
    extraction.graph.nodes.filter((node) => node.nodeType === "Primitive").map((node) => node.id),
  );
  const relations = extraction.graph.edges.filter(
    (edge) =>
      designFollowedTypes.has(edge.type) &&
      edge.claim === "declared" &&
      specIds.has(edge.from) &&
      specIds.has(edge.to),
  );
  const distance = new Map(changed.filter((id) => specIds.has(id)).map((id) => [id, 0]));
  for (let moved = true; moved; ) {
    moved = false;
    for (const edge of relations) {
      const via = distance.get(edge.to);
      const current = distance.get(edge.from);
      if (via !== undefined && (current === undefined || via + 1 < current)) {
        distance.set(edge.from, via + 1);
        moved = true;
      }
    }
  }
  return { distance, relations };
}

/** The `uses` crossings of a graph computed straight from its edges, beside the recipe's own. */
function crossingOracle(extraction: ExtractionResult) {
  const units = new Map(
    extraction.graph.nodes
      .filter((node) => node.nodeType === "CodeNode")
      .map((node) => [node.id, node] as const),
  );
  const owner = (id: string) => {
    if (id.startsWith("component:")) return units.get(id);
    const memberOf = extraction.graph.edges.find(
      (edge) => edge.type === "memberOf" && edge.from === id,
    );
    return memberOf === undefined || !units.has(id) ? undefined : units.get(memberOf.to);
  };
  const uses = extraction.graph.edges.filter((edge) => edge.type === "uses");
  const resolved = uses.filter(
    (edge) => owner(edge.from) !== undefined && owner(edge.to) !== undefined,
  );
  const rows = resolved
    .map((edge) => {
      const from = owner(edge.from);
      const to = owner(edge.to);
      const differs = (["context", "layer"] as const).filter(
        (field) =>
          from?.[field] !== undefined && to?.[field] !== undefined && from[field] !== to[field],
      );
      const describe = (node: typeof from) => ({
        id: node?.id,
        layer: node?.layer ?? null,
        context: node?.context ?? null,
      });
      return {
        from: edge.from,
        to: edge.to,
        fromComponent: describe(from),
        toComponent: describe(to),
        differs: [...differs],
      };
    })
    .filter((row) => row.differs.length > 0)
    .sort(
      (left, right) => codeUnitOrder(left.from, right.from) || codeUnitOrder(left.to, right.to),
    );
  return { uses, resolved, rows };
}

/**
 * The Pack design probe: three members in a Pack, two Specs it rests on, one Spec resting on it,
 * comment-form anchors with a component, and, injected after extraction, a member the graph does
 * not hold and a `decidedBy` whose target is no Spec.
 */
function packDesignProbe(): ExtractionResult {
  const extraction = markdownProbe("sdp-pack-design-probe-", {
    "probe.pack.sdp.md": `---
id: pack:probe-design-v1
specs:
  - spec:probe.page
  - spec:probe.store
  - spec:probe.note
---
# Probe design

The probe's framing.
`,
    "page.sdp.md": `---
id: spec:probe.page
kind: behavior
altitude: story
readiness: scoped
relations:
  dependsOn: spec:probe.base
  decidedBy: spec:probe.choice
---
# Probe page

## Intent
- outcome: Render the probe page.

### Open questions
- [blocking #layout] Which layout holds?
- [non-blocking] Who reads the page?

## Behavior
- rule: The page renders.

## Design
- render: \`render(): string\` returns the page.
- shape: A plain shape.

## UI
- panel: One panel.
`,
    "store.sdp.md": `---
id: spec:probe.store
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:probe.page
---
# Probe store

## Intent
- outcome: Store the page.

## Behavior
- rule: The store keeps the page.
`,
    "note.sdp.md": `---
id: spec:probe.note
kind: rule
altitude: story
readiness: idea
relations:
  refines: spec:probe.page
---
# Probe note

## Intent
- outcome: Note the page.

## Rule
- The note states one rule.
`,
    "base.sdp.md": `---
id: spec:probe.base
kind: rule
altitude: story
readiness: idea
relations: {}
---
# Probe base

## Intent
- outcome: Rest the page on a base.

## Rule
- The base states one rule.
`,
    "choice.sdp.md": `---
id: spec:probe.choice
kind: decision
altitude: story
readiness: idea
relations: {}
---
# Probe choice

## Intent
- outcome: Decide the page.

## Decision
- context: The page needs a choice.
- decision: The page takes the plain shape.
`,
    "reader.sdp.md": `---
id: spec:probe.reader
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:probe.store
---
# Probe reader

## Intent
- outcome: Read the stored page.

## Behavior
- rule: The reader reads the page.
`,
    "code.ts": `/**
 * @sdpAnchor component:probe.web
 * @sdpLayer edge
 * @sdpContext studio
 */

/**
 * @sdpAnchor impl:probe.page
 * @sdpSatisfies spec:probe.page
 * @sdpComponent component:probe.web
 * @sdpRole projection
 */

/**
 * @sdpAnchor impl:probe.store
 * @sdpReferences spec:probe.store
 */

/**
 * @sdpAnchor test:probe.page
 * @sdpVerifies spec:probe.page
 */
export const probe = 1;
`,
  });
  return {
    ...extraction,
    graph: {
      ...extraction.graph,
      nodes: extraction.graph.nodes.map((node) =>
        node.nodeType === "Pack"
          ? { ...node, members: [...node.members, "spec:probe.absent"] }
          : node,
      ),
      edges: [
        ...extraction.graph.edges,
        probeEdge("spec:probe.page", "decidedBy", "spec:probe.gone"),
      ],
    },
  };
}

describe("design recipes", () => {
  it("returns the Pack design of every corpus Pack as the raw graph states it", async () => {
    const locations = derived.graph.locations ?? [];
    const pinned = /^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u;
    const keyed = (content: unknown) =>
      typeof content === "object" && content !== null
        ? Object.entries(content).filter(([key]) => key !== "description")
        : [];
    const memberOfEdges = new Map(
      derived.graph.edges
        .filter((edge) => edge.type === "memberOf")
        .map((edge) => [edge.from, edge.to] as const),
    );
    const nodes = new Map(derived.graph.nodes.map((node) => [node.id, node] as const));
    const unitOf = (unit: Extract<GraphNode, { nodeType: "CodeNode" }>) => {
      const componentId = memberOfEdges.get(unit.id);
      const component = componentId === undefined ? undefined : nodes.get(componentId);
      return {
        id: unit.id,
        file: unit.file,
        line: unit.line ?? null,
        role: unit.role ?? null,
        component:
          componentId === undefined
            ? null
            : {
                id: componentId,
                layer: component?.nodeType === "CodeNode" ? (component.layer ?? null) : null,
                context: component?.nodeType === "CodeNode" ? (component.context ?? null) : null,
              },
      };
    };
    const packs = derived.graph.nodes.filter((node) => node.nodeType === "Pack");
    expect(packs.length).toBeGreaterThan(0);

    for (const pack of packs) {
      const result = asRecord(await runRecipe(recipeByOrdinal(29), { pack: pack.id }));
      const members = asArray(result.members).map(asRecord);
      expect(result.found).toBe(true);
      expect(members.map((member) => member.id)).toEqual(pack.members);

      for (const member of members) {
        const node = primitivesById.get(stringAt(member, "id"));
        if (node === undefined) {
          expect(member).toEqual({ id: member.id, resolved: false });
          continue;
        }
        const questions = node.sections?.intent?.openQuestions ?? [];
        const design = keyed(node.sections?.design);
        expect({
          id: member.id,
          statedReadiness: member.statedReadiness,
          statedNextRung: member.statedNextRung,
          design: member.design,
          questions: member.questions,
          decisions: asArray(member.decisions).map((entry) => asRecord(entry).id),
          implementedBy: member.implementedBy,
          referencedBy: member.referencedBy,
        }).toEqual({
          id: node.id,
          statedReadiness: node.readiness,
          statedNextRung: rungs[rungs.indexOf(node.readiness) + 1] ?? null,
          design: {
            entries: design.length + keyed(node.sections?.ui).length,
            declarations: design.filter(
              ([, value]) => typeof value === "string" && pinned.test(value),
            ).length,
            openQuestions: questions.length,
            blockingQuestions: questions.filter(
              (entry) => typeof entry !== "string" && entry.blocking === true,
            ).length,
          },
          questions: questions.map((entry, index) => {
            const key = typeof entry === "string" ? undefined : entry.key;
            return {
              key: key ?? null,
              blocking: typeof entry !== "string" && entry.blocking === true,
              address: key === undefined ? null : `${node.id}#question.${key}`,
              line:
                locations.find(
                  (row) => row.spec === node.id && row.entry === `question[${String(index)}]`,
                )?.line ?? null,
              question: typeof entry === "string" ? entry : entry.question,
            };
          }),
          decisions: [
            ...new Set(
              derived.graph.edges
                .filter((edge) => edge.from === node.id && edge.type === "decidedBy")
                .map((edge) => edge.to),
            ),
          ].sort(codeUnitOrder),
          implementedBy: rawUnits(derived, "satisfies", node.id).map(unitOf),
          referencedBy: rawUnits(derived, "references", node.id).map(unitOf),
        });
        // The stated next rung's clauses pass through from the one floor evaluator unchanged.
        const context = reader.packContext(pack.id);
        const fromReader = context?.members.find((entry) => entry.id === node.id);
        expect(member.statedNextRungFailures).toEqual(
          (fromReader?.statedNextRungFailures ?? []).map((failure) => ({ ...failure })),
        );
      }

      const inside = new Set(pack.members);
      const outside = (ids: readonly string[]) =>
        [...new Set(ids)]
          .filter((id) => !inside.has(id) && primitivesById.has(id))
          .sort(codeUnitOrder);
      const memberEdges = derived.graph.edges.filter(
        (edge) => edge.claim === "declared" && edge.type !== "belongsTo",
      );
      const boundary = asRecord(result.boundary);
      expect({
        restsOn: asArray(boundary.restsOn).map((row) => asRecord(row).id),
        restedOnBy: asArray(boundary.restedOnBy).map((row) => asRecord(row).id),
      }).toEqual({
        restsOn: outside(
          memberEdges
            .filter((edge) => inside.has(edge.from) && designFollowedTypes.has(edge.type))
            .map((edge) => edge.to),
        ),
        restedOnBy: outside(
          memberEdges.filter((edge) => inside.has(edge.to)).map((edge) => edge.from),
        ),
      });
    }

    // Without the parameter the body reads its sample, the Studio Pack.
    expect(asRecord(await runRecipe(recipeByOrdinal(29))).id).toBe(studioPackId);
    expect(await runRecipe(recipeByOrdinal(29), { pack: "pack:absent-v1" })).toEqual({
      id: "pack:absent-v1",
      found: false,
    });
  });

  it("returns the probe Pack's design exactly, member by member", async () => {
    const result = await runRecipe(
      recipeByOrdinal(29),
      { pack: "pack:probe-design-v1" },
      packDesignProbe(),
    );
    const bound = (type: string, members: readonly string[]) => ({ type, members });
    const counts = (total: number, enabled: number) => ({ total, enabled });
    const empty = { entries: 0, declarations: 0, openQuestions: 0, blockingQuestions: 0 };

    expect(result).toEqual({
      found: true,
      id: "pack:probe-design-v1",
      title: "Probe design",
      totals: {
        members: 4,
        unresolved: 1,
        heldBelowNextRung: 2,
        waitingForAuthor: 1,
        entries: 3,
        declarations: 1,
        openQuestions: 2,
        blockingQuestions: 1,
        withImplementations: 1,
        withReferences: 1,
        restsOn: 2,
        restedOnBy: 1,
      },
      members: [
        {
          id: "spec:probe.page",
          resolved: true,
          title: "Probe page",
          specKind: "behavior",
          statedReadiness: "scoped",
          floorReached: "scoped",
          statedNextRung: "defined",
          statedNextRungFailures: [
            {
              clauseId: "no-blocking-open-questions",
              description: "Spec has no blocking open question in intent.openQuestions.",
            },
          ],
          design: { entries: 3, declarations: 1, openQuestions: 2, blockingQuestions: 1 },
          questions: [
            {
              key: "layout",
              blocking: true,
              address: "spec:probe.page#question.layout",
              line: 16,
              question: "Which layout holds?",
            },
            {
              key: null,
              blocking: false,
              address: null,
              line: 17,
              question: "Who reads the page?",
            },
          ],
          decisions: [
            { id: "spec:probe.choice", statedReadiness: "idea", resolved: true },
            { id: "spec:probe.gone", statedReadiness: null, resolved: false },
          ],
          implementedBy: [
            {
              id: "impl:probe.page",
              file: "code.ts",
              line: 7,
              role: "projection",
              component: { id: "component:probe.web", layer: "edge", context: "studio" },
            },
          ],
          referencedBy: [],
          verifiers: counts(1, 1),
          examples: counts(0, 0),
        },
        {
          id: "spec:probe.store",
          resolved: true,
          title: "Probe store",
          specKind: "behavior",
          statedReadiness: "defined",
          floorReached: "defined",
          statedNextRung: "ready",
          statedNextRungFailures: [
            {
              clauseId: "typed-dependency-targets-are-defined",
              description:
                "Every refines, dependsOn, constrainedBy, and decidedBy target states at least defined.",
              targets: [{ type: "refines", id: "spec:probe.page", statedReadiness: "scoped" }],
            },
          ],
          design: empty,
          questions: [],
          decisions: [],
          implementedBy: [],
          referencedBy: [
            { id: "impl:probe.store", file: "code.ts", line: 14, role: null, component: null },
          ],
          verifiers: counts(0, 0),
          examples: counts(0, 0),
        },
        {
          // The floor already holds the stated next rung: the rung waits for its author.
          id: "spec:probe.note",
          resolved: true,
          title: "Probe note",
          specKind: "rule",
          statedReadiness: "idea",
          floorReached: "defined",
          statedNextRung: "scoped",
          statedNextRungFailures: [],
          design: empty,
          questions: [],
          decisions: [],
          implementedBy: [],
          referencedBy: [],
          verifiers: counts(0, 0),
          examples: counts(0, 0),
        },
        { id: "spec:probe.absent", resolved: false },
      ],
      boundary: {
        // The dangling `decidedBy` is referential integrity's finding and joins no boundary row.
        restsOn: [
          {
            id: "spec:probe.base",
            title: "Probe base",
            statedReadiness: "idea",
            implemented: false,
            via: [bound("dependsOn", ["spec:probe.page"])],
          },
          {
            id: "spec:probe.choice",
            title: "Probe choice",
            statedReadiness: "idea",
            implemented: false,
            via: [bound("decidedBy", ["spec:probe.page"])],
          },
        ],
        restedOnBy: [
          {
            id: "spec:probe.reader",
            title: "Probe reader",
            statedReadiness: "idea",
            implemented: false,
            via: [bound("refines", ["spec:probe.store"])],
          },
        ],
      },
    });
  });

  it("reaches every Spec resting on the corpus sample, by a shortest path of real edges", async () => {
    const recipe = recipeByOrdinal(30);
    const sample = "spec:validation.readiness-floor";
    const result = asRecord(await runRecipe(recipe));
    const { distance, relations } = impactOracle(derived, [sample]);
    const rows = asArray(result.rows).map(asRecord);

    expect(result.changed).toEqual([{ id: sample, resolved: true }]);
    expect(rows.map((row) => [row.id, row.distance])).toEqual(
      [...distance.entries()].sort(
        ([leftId, left], [rightId, right]) => left - right || codeUnitOrder(leftId, rightId),
      ),
    );
    expect(rows.length).toBeGreaterThan(1);
    for (const row of rows) {
      const path = asArray(row.path).map(asRecord);
      expect(path).toHaveLength(numberAt(row, "distance"));
      path.forEach((hop, index) => {
        expect(hop.to).toBe(index === 0 ? sample : path[index - 1]?.from);
        expect(
          relations.some(
            (edge) => edge.from === hop.from && edge.type === hop.type && edge.to === hop.to,
          ),
        ).toBe(true);
      });
      if (path.length > 0) expect(path[path.length - 1]?.from).toBe(row.id);

      const id = stringAt(row, "id");
      const located = (type: "satisfies" | "references") =>
        rawUnits(derived, type, id).map((unit) => ({
          id: unit.id,
          file: unit.file,
          line: unit.line ?? null,
        }));
      expect({
        id,
        statedReadiness: row.statedReadiness,
        implementedBy: row.implementedBy,
        referencedBy: row.referencedBy,
        enabledVerifiers: row.enabledVerifiers,
        packs: row.packs,
      }).toEqual({
        id,
        statedReadiness: primitivesById.get(id)?.readiness,
        implementedBy: located("satisfies"),
        referencedBy: located("references"),
        enabledVerifiers: rawEnabledVerifiers(derived, id),
        packs: derived.graph.edges
          .filter((edge) => edge.type === "belongsTo" && edge.from === id)
          .map((edge) => edge.to)
          .sort(codeUnitOrder),
      });
    }
    expect(result.totals).toEqual({
      specs: rows.length,
      dependents: rows.length - 1,
      units: new Set(
        rows.flatMap((row) =>
          [...asArray(row.implementedBy), ...asArray(row.referencedBy)].map((unit) =>
            stringAt(asRecord(unit), "id"),
          ),
        ),
      ).size,
    });
  });

  it("walks a dependency chain inbound only, once per Spec, and keeps a reference apart", async () => {
    const extraction = syntheticExtraction(
      [
        probeSpec("spec:probe.choice", "decision"),
        probeSpec("spec:probe.root"),
        probeSpec("spec:probe.twin"),
        probeSpec("spec:probe.join"),
        probeSpec("spec:probe.mid"),
        probeSpec("spec:probe.leaf"),
        probeSpec("spec:probe.far"),
        probeSpec("spec:probe.outside"),
        probeSpec("spec:probe.side"),
        probeSpec("spec:probe.mid.sample", "example"),
        probeUnit("impl:probe.root-unit", 3),
        probeUnit("impl:probe.mid-ref", 7),
        {
          id: "test:probe.root",
          nodeType: "Anchor",
          claim: "anchored",
          file: "test/probe.test.ts",
          line: 1,
        },
        {
          id: "pack:probe-v1",
          nodeType: "Pack",
          claim: "declared",
          members: ["spec:probe.mid"],
          file: "probe.pack.sdp.md",
        },
      ],
      [
        probeEdge("spec:probe.root", "decidedBy", "spec:probe.choice"),
        probeEdge("spec:probe.twin", "refines", "spec:probe.choice"),
        probeEdge("spec:probe.twin", "dependsOn", "spec:probe.root"),
        probeEdge("spec:probe.mid", "dependsOn", "spec:probe.root"),
        probeEdge("spec:probe.join", "dependsOn", "spec:probe.twin"),
        probeEdge("spec:probe.join", "refines", "spec:probe.root"),
        probeEdge("spec:probe.leaf", "refines", "spec:probe.mid"),
        probeEdge("spec:probe.leaf", "constrainedBy", "spec:probe.mid"),
        probeEdge("spec:probe.far", "constrainedBy", "spec:probe.leaf"),
        probeEdge("spec:probe.root", "dependsOn", "spec:probe.outside"),
        probeEdge("spec:probe.mid.sample", "verifies", "spec:probe.mid"),
        probeEdge("test:probe.root", "verifies", "spec:probe.root", "anchored"),
        probeEdge("impl:probe.root-unit", "satisfies", "spec:probe.root", "anchored"),
        probeEdge("impl:probe.mid-ref", "references", "spec:probe.mid", "anchored"),
        probeEdge("spec:probe.mid", "belongsTo", "pack:probe-v1"),
      ],
    );
    const result = await runRecipe(
      recipeByOrdinal(30),
      { specs: ["spec:probe.choice", "spec:probe.absent"] },
      extraction,
    );
    const hop = (from: string, type: string, to: string) => ({ from, type, to });
    const viaRoot = hop("spec:probe.root", "decidedBy", "spec:probe.choice");
    const viaMid = hop("spec:probe.mid", "dependsOn", "spec:probe.root");
    // Of two relations between one pair, the walk takes the first by type.
    const viaLeaf = hop("spec:probe.leaf", "constrainedBy", "spec:probe.mid");
    const row = (id: string, distance: number, path: readonly unknown[], extra = {}) => ({
      id,
      distance,
      path,
      statedReadiness: "idea",
      implementedBy: [],
      referencedBy: [],
      enabledVerifiers: [],
      packs: [],
      ...extra,
    });

    expect(result).toEqual({
      changed: [
        { id: "spec:probe.choice", resolved: true },
        { id: "spec:probe.absent", resolved: false },
      ],
      totals: { specs: 7, dependents: 6, units: 2 },
      rows: [
        row("spec:probe.choice", 0, []),
        row("spec:probe.root", 1, [viaRoot], {
          implementedBy: [{ id: "impl:probe.root-unit", file: "src/probe.ts", line: 3 }],
          enabledVerifiers: ["test:probe.root"],
        }),
        // Reached once, by its shorter path through `refines`, never again through `root`.
        row("spec:probe.twin", 1, [hop("spec:probe.twin", "refines", "spec:probe.choice")]),
        // Two shortest paths: `root` is dequeued before `twin`, so its path is the one kept.
        row("spec:probe.join", 2, [viaRoot, hop("spec:probe.join", "refines", "spec:probe.root")]),
        // The example declares `verifies` but no test anchor binds it, so it is not enabled.
        row("spec:probe.mid", 2, [viaRoot, viaMid], {
          referencedBy: [{ id: "impl:probe.mid-ref", file: "src/probe.ts", line: 7 }],
          packs: ["pack:probe-v1"],
        }),
        row("spec:probe.leaf", 3, [viaRoot, viaMid, viaLeaf]),
        row("spec:probe.far", 4, [
          viaRoot,
          viaMid,
          viaLeaf,
          hop("spec:probe.far", "constrainedBy", "spec:probe.leaf"),
        ]),
      ],
    });
  });

  it("registers every corpus decision with its supersession, subjects and keyed questions", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(31)));
    const decisions = [...primitivesById.values()]
      .filter((node) => node.specKind === "decision")
      .sort((left, right) => codeUnitOrder(left.id, right.id));
    const ends = (type: string, side: "from" | "to", id: string) =>
      derived.graph.edges
        .filter((edge) => edge.type === type && edge.claim === "declared" && edge[side] === id)
        .map((edge) => (side === "from" ? edge.to : edge.from))
        .sort(codeUnitOrder);
    const rows = asArray(result.rows).map(asRecord);

    expect(rows).toEqual(
      decisions.map((node) => ({
        id: node.id,
        title: node.title ?? null,
        statedReadiness: node.readiness,
        supersedes: ends("supersedes", "from", node.id),
        supersededBy: ends("supersedes", "to", node.id),
        shapes: ends("decidedBy", "to", node.id),
        questions: (node.sections?.intent?.openQuestions ?? []).flatMap((entry) =>
          typeof entry === "string" || entry.key === undefined
            ? []
            : [
                {
                  key: entry.key,
                  blocking: entry.blocking === true,
                  address: `${node.id}#question.${entry.key}`,
                },
              ],
        ),
        packs: ends("belongsTo", "from", node.id),
      })),
    );
    expect(rows.some((row) => asArray(row.supersededBy).length > 0)).toBe(true);
    const totals = asRecord(result.totals);
    expect(totals.decisions).toBe(decisions.length);
    expect(
      Object.values(asRecord(totals.byRung)).reduce<number>((sum, n) => sum + Number(n), 0),
    ).toBe(decisions.length);
  });

  it("registers a supersedes pair both ways and a decision that shapes nothing", async () => {
    const extraction = syntheticExtraction(
      [
        probeSpec("spec:probe.old", "decision", "ready"),
        probeSpec("spec:probe.new", "decision", "defined", {
          intent: {
            outcome: "Replace the old decision.",
            openQuestions: [
              { question: "Which scope?", blocking: true, key: "scope" },
              "A bare question.",
              { question: "Later?", blocking: false },
            ],
          },
        }),
        probeSpec("spec:probe.lone", "decision"),
        probeSpec("spec:probe.subject"),
        probeSpec("spec:probe.legacy"),
        {
          id: "pack:probe-v1",
          nodeType: "Pack",
          claim: "declared",
          members: ["spec:probe.new"],
          file: "probe.pack.sdp.md",
        },
      ],
      [
        probeEdge("spec:probe.new", "supersedes", "spec:probe.old"),
        probeEdge("spec:probe.subject", "decidedBy", "spec:probe.new"),
        probeEdge("spec:probe.legacy", "decidedBy", "spec:probe.old"),
        probeEdge("spec:probe.new", "belongsTo", "pack:probe-v1"),
      ],
    );
    const row = (id: string, statedReadiness: string, extra = {}) => ({
      id,
      title: `Title of ${id}`,
      statedReadiness,
      supersedes: [],
      supersededBy: [],
      shapes: [],
      questions: [],
      packs: [],
      ...extra,
    });

    expect(await runRecipe(recipeByOrdinal(31), undefined, extraction)).toEqual({
      totals: {
        decisions: 3,
        byRung: { idea: 1, defined: 1, ready: 1 },
        superseded: 1,
        shapingNothing: 1,
      },
      rows: [
        row("spec:probe.lone", "idea"),
        row("spec:probe.new", "defined", {
          supersedes: ["spec:probe.old"],
          shapes: ["spec:probe.subject"],
          questions: [{ key: "scope", blocking: true, address: "spec:probe.new#question.scope" }],
          packs: ["pack:probe-v1"],
        }),
        // A superseded decision stays a row, with the decision that supersedes it.
        row("spec:probe.old", "ready", {
          supersededBy: ["spec:probe.new"],
          shapes: ["spec:probe.legacy"],
        }),
      ],
    });
  });

  it("reports the corpus's architecture crossings as the raw edges state them", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(32)));
    const oracle = crossingOracle(derived);
    const tally = (field: "context" | "layer") => {
      const counts: Record<string, number> = {};
      for (const row of oracle.rows.filter((entry) => entry.differs.includes(field))) {
        const pair = `${String(row.fromComponent[field])} -> ${String(row.toComponent[field])}`;
        counts[pair] = (counts[pair] ?? 0) + 1;
      }
      return counts;
    };

    expect(result.rows).toEqual(oracle.rows);
    expect(result.totals).toEqual({
      usesEdges: oracle.uses.length,
      resolvedToComponents: oracle.resolved.length,
      crossings: oracle.rows.length,
      contextCrossings: oracle.rows.filter((row) => row.differs.includes("context")).length,
      layerCrossings: oracle.rows.filter((row) => row.differs.includes("layer")).length,
      byContextPair: tally("context"),
      byLayerPair: tally("layer"),
    });
    expect(Object.keys(asRecord(asRecord(result.totals).byLayerPair))).toEqual(
      Object.keys(tally("layer")).sort(codeUnitOrder),
    );
  });

  it("names a crossing of two contexts and of two layers, and skips what cannot cross", async () => {
    const extraction = syntheticExtraction(
      [
        probeUnit("component:probe.web", 1, { layer: "edge", context: "studio" }),
        probeUnit("component:probe.core", 2, { layer: "domain", context: "engine" }),
        probeUnit("component:probe.store", 3, { layer: "domain", context: "studio" }),
        probeUnit("component:probe.loose", 4, { context: "studio" }),
        probeUnit("impl:probe.page", 5),
        probeUnit("impl:probe.model", 6),
        probeUnit("impl:probe.rule", 7),
        probeUnit("impl:probe.free", 8),
      ],
      [
        probeEdge("impl:probe.page", "memberOf", "component:probe.web", "anchored"),
        probeEdge("impl:probe.model", "memberOf", "component:probe.core", "anchored"),
        probeEdge("impl:probe.rule", "memberOf", "component:probe.core", "anchored"),
        probeEdge("impl:probe.page", "uses", "impl:probe.model", "anchored"),
        probeEdge("impl:probe.page", "uses", "component:probe.store", "anchored"),
        probeEdge("impl:probe.model", "uses", "impl:probe.rule", "anchored"),
        probeEdge("component:probe.web", "uses", "component:probe.loose", "anchored"),
        probeEdge("impl:probe.free", "uses", "impl:probe.model", "anchored"),
        probeEdge("component:probe.store", "uses", "component:probe.core", "anchored"),
      ],
    );
    const component = (id: string, layer: string | null, context: string) => ({
      id,
      layer,
      context,
    });
    const web = component("component:probe.web", "edge", "studio");
    const core = component("component:probe.core", "domain", "engine");
    const store = component("component:probe.store", "domain", "studio");

    expect(await runRecipe(recipeByOrdinal(32), undefined, extraction)).toEqual({
      totals: {
        usesEdges: 6,
        // `impl:probe.free` belongs to no component, so its edge is counted and never a row.
        resolvedToComponents: 5,
        crossings: 3,
        contextCrossings: 2,
        layerCrossings: 2,
        byContextPair: { "studio -> engine": 2 },
        byLayerPair: { "edge -> domain": 2 },
      },
      rows: [
        {
          from: "component:probe.store",
          to: "component:probe.core",
          fromComponent: store,
          toComponent: core,
          differs: ["context"],
        },
        {
          from: "impl:probe.page",
          to: "component:probe.store",
          fromComponent: web,
          toComponent: store,
          differs: ["layer"],
        },
        {
          from: "impl:probe.page",
          to: "impl:probe.model",
          fromComponent: web,
          toComponent: core,
          differs: ["context", "layer"],
        },
      ],
    });
  });
});

const entryLocationRecipesAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.entry-location-recipes"),
  label:
    "asserts realization of the entry lines the entry search and address resolution recipes return",
  satisfies: ref("spec:extraction.entry-locations"),
});
void entryLocationRecipesAnchor;

describe("entry lines in entry search and address resolution", () => {
  it("resolves every keyed corpus entry to its value and the line the location table records", async () => {
    const lawfulKey = /^[a-z][A-Za-z0-9]*$/u;
    const located = (derived.graph.locations ?? []).filter(
      (row) =>
        (row.key !== undefined && row.entry.startsWith("question[")) ||
        /^(design|ui)\./u.test(row.entry),
    );
    const addresses = located.flatMap((row) => {
      const [section, key] = row.entry.startsWith("question[")
        ? ["question", row.key ?? ""]
        : row.entry.split(/\.(.*)/su);
      return lawfulKey.test(key ?? "") ? [`${row.spec}#${section ?? ""}.${key ?? ""}`] : [];
    });
    expect(addresses.length).toBeGreaterThan(0);

    const result = asRecord(await runRecipe(recipeByOrdinal(25), { addresses }));
    const rows = asArray(result.rows).map(asRecord);
    expect(asRecord(result.totals).resolved).toBe(addresses.length);
    for (const row of rows) {
      const id = stringAt(row, "id");
      const section = stringAt(row, "section");
      const key = stringAt(row, "key");
      const node = primitivesById.get(id);
      const questions = node?.sections?.intent?.openQuestions ?? [];
      const index = questions.findIndex((entry) => typeof entry !== "string" && entry.key === key);
      const entry = section === "question" ? `question[${String(index)}]` : `${section}.${key}`;
      const location = located.find(
        (candidate) => candidate.spec === id && candidate.entry === entry,
      );
      const question = questions[index];
      const authored: Record<string, unknown> | undefined =
        section === "design" ? node?.sections?.design : node?.sections?.ui;
      expect({ address: row.address, value: row.value, file: row.file, line: row.line }).toEqual({
        address: row.address,
        value:
          section === "question"
            ? typeof question === "string"
              ? question
              : question?.question
            : authored?.[key],
        file: location?.file,
        line: location?.line,
      });
    }
  });

  it("gives each corpus entry-search row the line of a located entry and null otherwise", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(23), { term: "page" }));
    const rows = asArray(result.matches).map(asRecord);
    const locations = derived.graph.locations ?? [];
    const expectedLine = (row: Record<string, unknown>) => {
      const entry = typeof row.entry === "string" ? row.entry : "";
      const question = /^openQuestions\[(\d+)\](?:\.question)?$/u.exec(entry)?.[1];
      const name =
        row.section === "intent" && question !== undefined
          ? `question[${question}]`
          : row.section === "design" || row.section === "ui"
            ? `${row.section}.${entry}`
            : undefined;
      return (
        locations.find((location) => location.spec === row.id && location.entry === name)?.line ??
        null
      );
    };

    expect(rows.map((row) => [row.id, row.entry, row.line])).toEqual(
      rows.map((row) => [row.id, row.entry, expectedLine(row)]),
    );
    expect(rows.some((row) => typeof row.line === "number")).toBe(true);
    expect(rows.some((row) => row.line === null)).toBe(true);
  });

  it("gives a string-form open question the line its question[n] row records, as the object form", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-entry-search-string-question-"));

    try {
      writeFileSync(
        join(root, "subject.sdp.ts"),
        `import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const subject = spec({
  id: specId("spec:probe.questions"),
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  title: "Questions",
  intent: {
    outcome: "Ask.",
    openQuestions: [
      "Which gadget ships first?",
      { question: "Who owns the gadget?", blocking: false },
    ],
  },
});
`,
      );
      const extraction = extract({ root });
      expect(extraction.report.findings).toEqual([]);
      const lineOf = (entry: string) =>
        extraction.graph.locations?.find(
          (row) => row.spec === "spec:probe.questions" && row.entry === entry,
        )?.line;
      expect([lineOf("question[0]"), lineOf("question[1]")]).toEqual([12, 13]);

      const result = asRecord(await runRecipe(recipeByOrdinal(23), { term: "gadget" }, extraction));
      expect(
        asArray(result.matches)
          .map(asRecord)
          .map((row) => [row.entry, row.line]),
      ).toEqual([
        ["openQuestions[0]", 12],
        ["openQuestions[1].question", 13],
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
