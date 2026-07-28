import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import { createReader, extract } from "../src/index.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

// The recipe corpus is executable documentation: every fenced `js` body in the catalog must run
// verbatim through the real front door, or the catalog is lying about what an agent can paste.
// Invariants below are shape-level only — the corpus grows every phase, so a frozen count in a
// recipe check is rot with a timer on it.
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

async function runRecipe(recipe: Recipe): Promise<unknown> {
  const capture = createCaptureOutput();
  const exitCode = await runSdpCli(
    ["q", recipe.body, "--root", repoRoot, "--json"],
    capture.output,
    queryHooks,
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

    // Completeness, not just soundness: the rows must be exactly the operational
    // `ready ∧ kind≠example ∧ ¬implemented` set. The excluded example set is checked separately,
    // so filtering it from backlog work cannot hide missing verification evidence.
    const expected = [...primitivesById.values()]
      .filter(
        (node) =>
          node.readiness === "ready" &&
          node.specKind !== "example" &&
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

    expect(numberAt(result, "excludedReadyExamples")).toBe(excluded.length);
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

  it("names all three blast-radius result classes", async () => {
    const result = asRecord(await runRecipe(recipeByOrdinal(4)));

    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(["impactedSpecs", "impactedPacks", "atRisk", "coverageUnknown"]),
    );
    expect(asArray(result.changedFiles).length).toBeGreaterThan(0);

    for (const item of asArray(result.impactedSpecs)) {
      const row = asRecord(item);

      expect(primitivesById.has(stringAt(row, "id"))).toBe(true);
      expect(asArray(row.reasons).length).toBeGreaterThan(0);
    }

    for (const item of asArray(result.atRisk)) {
      for (const reason of asArray(asRecord(item).reasons)) {
        expect(claims).toContain(stringAt(asRecord(reason), "claim"));
      }
    }

    for (const file of asArray(result.coverageUnknown)) {
      expect(typeof file).toBe("string");
    }
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

    for (const row of rows) {
      expect(Array.isArray(asRecord(row).declared)).toBe(true);
      expect(Array.isArray(asRecord(row).enabled)).toBe(true);
    }
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
});
