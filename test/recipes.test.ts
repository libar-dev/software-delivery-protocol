import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import { createReader, extract, validateGraph } from "../src/index.js";
import type { ExtractionResult, GraphEdge, GraphNode } from "../src/index.js";
import { expectedComponentIds, expectedUsesEdges } from "./self-hosting-oracle/structural-edges.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

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
// the same `g` / `graph` / `report` bindings, and shapes the same output. Only the extraction is
// memoized — derived once from the repository root with the standard exclude list (the corpus-oracle
// derivation pattern), because deriving the whole corpus once per recipe buys nothing the single
// derivation does not already prove. Nothing here names a write path, so the suite stays pooled.
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

async function runRecipe(
  recipe: Recipe,
  changedFiles?: readonly string[],
  extraction: ExtractionResult = derived,
): Promise<unknown> {
  const previousChangedFiles = process.env.SDP_CHANGED_FILES_JSON;
  if (changedFiles === undefined) {
    delete process.env.SDP_CHANGED_FILES_JSON;
  } else {
    process.env.SDP_CHANGED_FILES_JSON = JSON.stringify(changedFiles);
  }

  try {
    const capture = createCaptureOutput();
    const exitCode = await runSdpCli(
      ["q", recipe.body, "--root", repoRoot, "--json"],
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
  } finally {
    if (previousChangedFiles === undefined) {
      delete process.env.SDP_CHANGED_FILES_JSON;
    } else {
      process.env.SDP_CHANGED_FILES_JSON = previousChangedFiles;
    }
  }
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
      expect({
        source,
        otherQuoting: lines.filter((line) => line.includes(' q "') && line.includes("sdp")),
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
    const parameterizedRecipes = recipes.filter(
      (recipe) =>
        recipe.ordinal !== 4 &&
        /^(?:const (?:id|term|subject|scope|addresses) = )/u.test(recipe.body),
    );

    // Recipe 4 receives filenames as data. Intro guidance must never teach callers to construct
    // executable query source from repository-controlled paths.
    const parameterGuidance =
      /\*\*Some recipes open with a parameter\.[\s\S]*?(?=\n\n\*\*Recipe 4 is different)/u.exec(
        intro,
      )?.[0] ?? "";
    expect(parameterGuidance).not.toMatch(
      /\b4\b[\s\S]*?(?:changed-file list|substitut(?:e|ion))/iu,
    );
    expect(introProse).toContain("Recipe 4 filenames travel via `SDP_CHANGED_FILES_JSON`");
    expect(introProse).toContain("callers never substitute filenames into the JavaScript fence");

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
    ]) {
      expect(agentSurfaceProse).toContain(phrase);
    }

    for (const ordinal of [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]) {
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

    expect(recipe.body).toContain("process.env.SDP_CHANGED_FILES_JSON");
    for (const filename of hostileChangedFiles) {
      expect(recipe.body).not.toContain(filename);
    }

    try {
      const result = asRecord(await runRecipe(recipe, hostileChangedFiles));

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
    const result = asRecord(await runRecipe(recipeByOrdinal(4), normalChangedFiles));
    const changedFiles = asArray(result.changedFiles).map((file) => stringAt({ file }, "file"));
    const radius = reader.blastRadius(changedFiles);

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        "changedFiles",
        "impactedSpecs",
        "atRiskSpecs",
        "atRiskOther",
        "coverageUnknownFiles",
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
    const catalogLine = 'const id = "spec:model.enrichment-lifecycle";';
    expect(recipe.body).toContain(catalogLine);
    const retarget = (id: string) => ({
      ...recipe,
      body: recipe.body.replace(catalogLine, `const id = "${id}";`),
    });
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

    expect(await runRecipe(retarget("spec:probe.subject"), undefined, probe)).toEqual({
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
    const held = asRecord(await runRecipe(retarget("spec:probe.held"), undefined, probe));
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

    const absent = await runRecipe({
      ...recipe,
      body: recipe.body.replace("component:protocol.reader", "component:protocol.nonexistent"),
    });
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
    const absent = await runRecipe({
      ...recipe,
      body: recipe.body.replace(id, unknownId),
    });
    expect(absent).toEqual({ id: unknownId, found: false });
  });

  // Given: catalog recipe 19 with only the opening id retargeted to the structural-anchor
  // decision (live graph: one outgoing dependsOn, two inbound dependsOn from MD-34/MD-35).
  // When: the otherwise unchanged body runs through real runSdpCli.
  // Then: dependencies.dependsOn and dependencies.dependedOnBy are both non-empty and name the
  // exact ready decision neighbors — so dropping, reversing, renaming, or readiness-skewing either
  // direction reddens this characterization.
  it("returns non-empty bidirectional dependencies for the structural-anchor planning slice", async () => {
    const recipe = recipeByOrdinal(19);
    const catalogId = "spec:consumers.agent-surface";
    const id = "spec:decisions.structural-anchor-semantics";
    expect(recipe.body).toContain(`const id = "${catalogId}";`);

    const result = asRecord(
      await runRecipe({
        ...recipe,
        body: recipe.body.replace(catalogId, id),
      }),
    );
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
  it.each([20, 21, 22, 23, 24, 25, 26, 27, 28])(
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
    const body = recipe.body.replace('const term = "suffix";', 'const term = "retry";');
    const result = asRecord(await runRecipe({ ...recipe, body }, undefined, probe));
    expect(
      asArray(result.matches)
        .map(asRecord)
        .map((row) => row.text),
    ).toEqual([text, JSON.stringify({ detail: text })]);
    const capture = createCaptureOutput();
    expect(
      await runSdpCli(["q", body, "--root", repoRoot], capture.output, {
        query: { ...queryHooks.query, extract: () => probe },
      }),
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
    const result = asRecord(
      await runRecipe(
        { ...recipe, body: recipe.body.replace('const term = "suffix";', 'const term = "retry";') },
        undefined,
        carrierRegisterProbe(),
      ),
    );
    const expected = [
      ["design", "retryLimit", "3"],
      ["design", "retryEnabled", "true"],
      ["design", "retryPolicy", '{"mode":"fixed"}'],
      ["design", "retryWorkers", '["alpha","beta"]'],
      ["design", "retryEmptyList", "[]"],
      ["design", "retryEmptyObject", "{}"],
      ["design", "retryLong", JSON.stringify({ detail: "x".repeat(300) })],
      ["ui", "retryVisible", "false"],
    ].map(([section, entry, text]) => ({
      id: "spec:probe.carrier",
      section,
      entry,
      address: `spec:probe.carrier#${section ?? ""}.${entry ?? ""}`,
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
        { ...recipe, body: recipe.body.replace('const term = "suffix";', 'const term = "retry";') },
        undefined,
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
    expect(result.matches).toEqual([
      {
        id: node.id,
        section: "design",
        entry: "retryWorkers",
        address: `${node.id}#design.retryWorkers`,
        matchedIn: ["key"],
        text: '["retry later"]',
      },
      {
        id: node.id,
        section: "design",
        entry: "retryWorkers[0]",
        address: null,
        matchedIn: ["text"],
        text: "retry later",
      },
      {
        id: node.id,
        section: "design",
        entry: "retryPolicy",
        address: `${node.id}#design.retryPolicy`,
        matchedIn: ["key"],
        text: '{"mode":"retry fixed","options":["retry soon"]}',
      },
      {
        id: node.id,
        section: "design",
        entry: "retryPolicy.mode",
        address: null,
        matchedIn: ["text"],
        text: "retry fixed",
      },
      {
        id: node.id,
        section: "design",
        entry: "retryPolicy.options[0]",
        address: null,
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
        { ...recipe, body: recipe.body.replace('const term = "suffix";', 'const term = "retry";') },
        undefined,
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
        matchedIn: ["key"],
        text: "null",
      },
    ]);
    expect(result.totals).toEqual({ matches: 1, specs: 1, shown: 1 });
  });

  it("keeps register counts under totals and top-level plural nouns as arrays", async () => {
    const check = (value: unknown, insideTotals = false): void => {
      if (typeof value === "number") {
        expect(insideTotals).toBe(true);
      } else if (Array.isArray(value)) {
        value.forEach((entry) => {
          check(entry, insideTotals);
        });
      } else if (typeof value === "object" && value !== null) {
        for (const [key, entry] of Object.entries(value))
          check(entry, insideTotals || key === "totals");
      }
    };
    for (const ordinal of [20, 21, 22, 23, 24, 25, 26, 27, 28]) {
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
      const result = asRecord(
        await runRecipe(
          {
            ...recipe,
            body: recipe.body.replace('const term = "suffix";', `const term = "${term}";`),
          },
          undefined,
          extraction,
        ),
      );
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
    const retarget = (id: string) => ({
      ...recipe,
      body: recipe.body.replace(
        'const id = "spec:extraction.derive-graph";',
        `const id = "${id}";`,
      ),
    });
    expect(await runRecipe(retarget("spec:probe.absent"), undefined, registerProbe())).toEqual({
      id: "spec:probe.absent",
      found: false,
    });
    const synthetic = asRecord(
      await runRecipe(retarget("spec:probe.b"), undefined, registerProbe()),
    );
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
    const result = asRecord(
      await runRecipe(
        {
          ...recipe,
          body: recipe.body.replace('const term = "suffix";', 'const term = "needle";'),
        },
        undefined,
        { ...probe, graph },
      ),
    );
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
    const scoped = async (scope: string[]) =>
      asRecord(
        await runRecipe(
          {
            ...recipe,
            body: recipe.body.replace(
              "const scope = [];",
              `const scope = ${JSON.stringify(scope)};`,
            ),
          },
          undefined,
          probe,
        ),
      );
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
      asRecord(
        await runRecipe(
          {
            ...recipe,
            body: recipe.body.replace('const term = "suffix";', `const term = "${term}";`),
          },
          undefined,
          extraction,
        ),
      );
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

/** Recipe 25 with its opening parameter replaced, as the catalog tells a reader to do. */
function addressResolution(addresses: readonly unknown[]): Recipe {
  const recipe = recipeByOrdinal(25);
  const opening = /^const addresses = \[\n[\s\S]*?\n\];\n/u;
  expect(recipe.body).toMatch(opening);
  return {
    ...recipe,
    body: recipe.body.replace(opening, `const addresses = ${JSON.stringify(addresses)};\n`),
  };
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
    expect(await runRecipe(recipeByOrdinal(25))).toEqual({
      totals: { addresses: 4, resolved: 1, malformed: 1, spec: 1, entry: 1 },
      rows: [
        {
          address: "spec:consumers.design-review#ui.packPage",
          resolves: true,
          id: "spec:consumers.design-review",
          section: "ui",
          key: "packPage",
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
      addressResolution([
        "spec:probe.plain#design.constructor",
        "spec:probe.authored#design.constructor",
      ]),
      undefined,
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
          reason: "entry",
        },
        {
          address: "spec:probe.authored#design.constructor",
          resolves: true,
          id: "spec:probe.authored",
          section: "design",
          key: "constructor",
          reason: null,
        },
      ],
    });
  });

  it("resolves the design's probe addresses with one row and one reason each", async () => {
    const result = await runRecipe(
      addressResolution([
        "spec:probe.a#design.shape",
        "spec:probe.a#question.shapeOpen",
        "spec:probe.z#design.shape",
        "spec:probe.a#Design.shape",
      ]),
      undefined,
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
    const resolved = (address: string, section: string, key: string) => ({
      address,
      resolves: true,
      id: "spec:probe.keyed",
      section,
      key,
      reason: null,
    });
    const refused = (address: unknown, reason: string) => ({
      address,
      resolves: false,
      id: null,
      section: null,
      key: null,
      reason,
    });
    const result = await runRecipe(
      addressResolution([
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
      ]),
      undefined,
      extraction,
    );
    expect(result).toEqual({
      totals: { addresses: 10, resolved: 4, malformed: 3, spec: 0, entry: 3 },
      rows: [
        resolved("spec:probe.keyed#question.shapeOpen", "question", "shapeOpen"),
        resolved("spec:probe.keyed#question.description", "question", "description"),
        refused("spec:probe.keyed#design.description", "entry"),
        refused("spec:probe.keyed#ui.description", "entry"),
        refused("spec:probe.keyed#question.ownerOpen", "entry"),
        resolved("spec:probe.keyed#design.shape", "design", "shape"),
        refused("spec:probe.keyed", "malformed"),
        refused(42, "malformed"),
        refused("pack:probe.keyed#design.shape", "malformed"),
        resolved("spec:probe.keyed#question.shapeOpen", "question", "shapeOpen"),
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
      asArray(
        asRecord(
          await runRecipe(
            {
              ...recipe,
              body: recipe.body.replace('const term = "suffix";', `const term = "${term}";`),
            },
            undefined,
            keyedQuestionProbe(),
          ),
        ).matches,
      )
        .map(asRecord)
        .filter((row) => row.id === "spec:probe.keyed");
    expect(await search("shape open")).toEqual([
      {
        id: "spec:probe.keyed",
        section: "intent",
        entry: "openQuestions[0].question",
        address: "spec:probe.keyed#question.shapeOpen",
        matchedIn: ["key"],
        text: "Is the shape final?",
      },
    ]);
    const owner = await search("owns");
    expect(owner.map((row) => [row.entry, row.address])).toEqual([
      ["openQuestions[2].question", null],
    ]);
    const description = await search("description");
    expect(description.map((row) => [row.entry, row.address, row.matchedIn])).toEqual([
      ["openQuestions[1].question", "spec:probe.keyed#question.description", ["key", "text"]],
    ]);
  });
});

const studioPackId = "pack:spec-studio-v1";

/** One recipe 27 row, computed from the raw graph rather than through the reader. */
function referenceRowFromGraph(extraction: ExtractionResult, memberId: string) {
  const nodes = new Map(extraction.graph.nodes.map((node) => [node.id, node] as const));
  const member = nodes.get(memberId);
  const unitsBy = (type: "references" | "satisfies") =>
    extraction.graph.edges
      .filter((edge) => edge.type === type && edge.to === memberId)
      .filter((edge) => nodes.get(edge.from)?.nodeType === "CodeNode")
      .map((edge) => edge.from)
      .sort();

  return {
    id: memberId,
    resolved: member?.nodeType === "Primitive",
    referencedBy: unitsBy("references").map((id) => ({ id, file: nodes.get(id)?.file ?? null })),
    implementedBy: unitsBy("satisfies"),
    hasVerifier:
      member?.nodeType === "Primitive" && (member.deliveryFacts ?? []).includes("has-verifier"),
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
    label: "written against the Studio design",
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
  it("returns one row per Studio member with three independent facts", async () => {
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
      unbound: count(
        (row) =>
          !listed(row, "referencedBy") && !listed(row, "implementedBy") && row.hasVerifier !== true,
      ),
    });

    const absent = await runRecipe({
      ...recipe,
      body: recipe.body.replace(studioPackId, "pack:absent-v1"),
    });
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
    });
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
});
