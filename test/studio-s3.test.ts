import { specTest, testAnchorId, ref } from "@libar-dev/software-delivery-protocol";

import { specOracle, oracleAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";
import type { StudioPage } from "../src/projections/studio/pages/index.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerBlockingFirst } from "./consumers.spec-studio.registers.blocking-first.test.generated.js";
import { registerDependencyFirst } from "./consumers.spec-studio.owner-queue.dependency-first.test.generated.js";
import { registerChangedEntry } from "./consumers.spec-studio.diff-page.changed-entry.test.generated.js";
import { registerSameWordTwice } from "./consumers.spec-studio.glossary-page.same-word-twice.test.generated.js";
import { dependencyFirstContract } from "../generated/contracts/consumers.spec-studio.owner-queue.dependency-first.contract.js";
import { changedEntryContract } from "../generated/contracts/consumers.spec-studio.diff-page.changed-entry.contract.js";
import { sameWordTwiceContract } from "../generated/contracts/consumers.spec-studio.glossary-page.same-word-twice.contract.js";
import type {
  RegistersConditions,
  RegistersOutcome,
} from "../generated/contracts/consumers.spec-studio.registers.space.js";
import type {
  OwnerQueueConditions,
  OwnerQueueOutcome,
} from "../generated/contracts/consumers.spec-studio.owner-queue.space.js";
import type {
  DiffPageConditions,
  DiffPageOutcome,
} from "../generated/contracts/consumers.spec-studio.diff-page.space.js";
import type {
  GlossaryPageConditions,
  GlossaryPageOutcome,
} from "../generated/contracts/consumers.spec-studio.glossary-page.space.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function required<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) throw new Error("Expected a value");
  return value;
}
function corpus(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-s3-"));
  roots.push(root);
  for (const [name, content] of Object.entries(files)) writeFileSync(join(root, name), content);
  return root;
}
function carrier(
  id: string,
  body = "",
  relations = "{}",
  readiness = "scoped",
  kind = "behavior",
): string {
  return `---\nid: ${id}\nkind: ${kind}\naltitude: story\nreadiness: ${readiness}\nrelations: ${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Read the design.\n${body}`;
}
async function pages(root: string) {
  return renderStudio(await createStudioData(createReader(extract({ root }).graph)));
}
const content = (rows: readonly StudioPage[], path: string): string =>
  required(rows.find((p) => p.path === path)).content;
const main = (html: string) => required(/<main id="main">(.*?)<\/main>/su.exec(html)?.[1]);
interface World<P> {
  point: Partial<P>;
  root: string;
  pages?: readonly StudioPage[];
}
function world<P>(point: Partial<P>): World<P> {
  return { point, root: corpus({}) };
}

const registersOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-registers"),
  models: ref("spec:consumers.spec-studio.registers"),
});
void registersOracle;
function expectedRegisters(p: Partial<RegistersConditions>): RegistersOutcome {
  return p.blockingSpec === undefined
    ? unspecified
    : { kind: "the page lists {first} first", first: p.blockingSpec };
}
const questionsAnchor = specTest({
  id: testAnchorId("test:protocol.studio-registers-blocking-first"),
  verifies: ref("spec:consumers.spec-studio.registers.blocking-first"),
});
void questionsAnchor;
registerBlockingFirst<World<RegistersConditions>>({
  createWorld: world,
  invoke: async (w) => {
    writeFileSync(
      join(w.root, "z.sdp.md"),
      carrier(
        required(w.point.blockingSpec),
        "\n### Open questions\n- [blocking #choice] Which choice?\n  - decider: owner\n  - provisional: Keep it.\n  - trigger: A reader asks.\n",
      ),
    );
    writeFileSync(
      join(w.root, "a.sdp.md"),
      carrier(required(w.point.otherSpec), "\n### Open questions\n- [non-blocking] Which other?\n"),
    );
    w.pages = await pages(w.root);
  },
  expected: expectedRegisters,
  observe: (w) => ({
    kind: "the page lists {first} first",
    first: required(
      /data-question-spec="([^"]+)"/u.exec(main(content(required(w.pages), "questions.html")))?.[1],
    ),
  }),
  assertions: (w) => {
    const html = main(content(required(w.pages), "questions.html"));
    expect(html).toContain("deferral");
    expect(html).toContain("Provisional:");
    expect(html).toContain("Keep it.");
    expect(html).toContain("1 blocking question.");
    expect(html).toContain("1 non-blocking question.");
    expect(html).toContain("1 deferral.");
    expect(html).not.toContain("<b>Links:</b> </span>");
    expect(html).toContain('href="specs/probe.zeta.html#question.choice"');
    expect(html).toContain('text="spec:probe.zeta#question.choice"');
    for (const facet of ["blocking", "decider", "deferral", "pack"])
      expect(html).toContain(`data-filter="${facet}"`);
  },
});
const queueOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-owner-queue"),
  models: ref("spec:consumers.spec-studio.owner-queue"),
});
void queueOracle;
function expectedQueue(p: Partial<OwnerQueueConditions>): OwnerQueueOutcome {
  return p.dependency === undefined
    ? unspecified
    : { kind: "the queue lists {first} first", first: p.dependency };
}
const queueAnchor = specTest({
  id: testAnchorId("test:protocol.studio-queue-dependency-first"),
  verifies: ref("spec:consumers.spec-studio.owner-queue.dependency-first"),
});
void queueAnchor;
registerDependencyFirst<World<OwnerQueueConditions>>({
  createWorld: world,
  invoke: async (w) => {
    writeFileSync(
      join(w.root, "a.sdp.md"),
      carrier(
        required(w.point.dependent),
        "\n## Behavior\n- rule: Alpha.\n",
        `\n  dependsOn: ${required(w.point.dependency)}`,
      ),
    );
    writeFileSync(
      join(w.root, "z.sdp.md"),
      carrier(
        required(w.point.dependency),
        "\n## Behavior\n- rule: Zeta.\n",
        `\n  refines: ${required(w.point.dependent)}`,
      ),
    );
    w.pages = await pages(w.root);
  },
  expected: expectedQueue,
  observe: (w) => ({
    kind: "the queue lists {first} first",
    first: required(
      /data-statement="([^"]+)"/u.exec(main(content(required(w.pages), "queue.html")))?.[1],
    ),
  }),
  assertions: (w) => {
    const html = main(content(required(w.pages), "queue.html"));
    const alpha =
      required(html.split(`id="${required(w.point.dependent)}"`)[1]).split("</li>")[0] ?? "";
    expect(alpha.includes(`href="#${required(w.point.dependency)}"`)).toBe(
      paramsForStep(
        dependencyFirstContract,
        "the row of the Spec that rests on the other links it: {linked}",
      ).linked,
    );
    expect(html).toContain("can be made now");
    expect(html).toContain("Round 1");
    const filters = [...html.matchAll(/<sdp-filter>(.*?)<\/sdp-filter>/gsu)].map((m) => m[1]);
    expect(filters).toHaveLength(2);
    expect(filters[0]).toContain('data-filter="pack"');
    expect(filters[0]).toContain('data-filter="floor"');
    expect(filters[1]).toContain('data-filter="pack"');
    expect(alpha).toContain('data-pack=""');
    expect(alpha).toContain('data-floor="defined"');
  },
});
const diffOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-diff-page"),
  models: ref("spec:consumers.spec-studio.diff-page"),
});
void diffOracle;
function expectedDiff(p: Partial<DiffPageConditions>): DiffPageOutcome {
  return p.before === undefined || p.after === undefined
    ? unspecified
    : {
        kind: "the Spec's row shows the base value {baseShown} and the built value {nowShown}",
        baseShown: p.before,
        nowShown: p.after,
      };
}
const diffAnchor = specTest({
  id: testAnchorId("test:protocol.studio-diff-changed-entry"),
  verifies: ref("spec:consumers.spec-studio.diff-page.changed-entry"),
});
void diffAnchor;
registerChangedEntry<World<DiffPageConditions>>({
  createWorld: world,
  invoke: async (w) => {
    const file = join(w.root, "a.sdp.md");
    const design = (value: string) =>
      carrier(
        "spec:probe.alpha",
        `\n## Design\n- ${required(w.point.key)}: ${value}\n`,
        "{}",
        "idea",
      );
    writeFileSync(file, design(required(w.point.before)));
    const capture = createCaptureOutput();
    expect(await runSdpCli(["build", w.root], capture.output)).toBe(0);
    const base = join(corpus({}), "base.json");
    writeFileSync(base, readFileSync(join(w.root, "generated/graph.json")));
    writeFileSync(file, design(required(w.point.after)));
    const assets = { script: join(w.root, "fixture.js"), stylesheet: join(w.root, "fixture.css") };
    writeFileSync(assets.script, "");
    writeFileSync(assets.stylesheet, "");
    expect(
      await runSdpCli(
        ["studio", w.root, "--base", base, "--base-label", "First pass"],
        capture.output,
        { studioAssets: assets },
      ),
      capture.readStderr(),
    ).toBe(0);
    w.pages = ["diff.html", "specs/probe.alpha.html"].map((path) => ({
      path,
      content: readFileSync(join(w.root, "generated/spec-studio", path), "utf8"),
    }));
  },
  expected: expectedDiff,
  observe: (w) => {
    const html = main(content(required(w.pages), "diff.html"));
    return {
      kind: "the Spec's row shows the base value {baseShown} and the built value {nowShown}",
      baseShown: required(/<b>Base<\/b><pre>(.*?)<\/pre>/su.exec(html)?.[1]),
      nowShown: required(/<b>Now<\/b><pre>(.*?)<\/pre>/su.exec(html)?.[1]),
    };
  },
  assertions: (w) => {
    const html = main(content(required(w.pages), "specs/probe.alpha.html"));
    expect(html.includes("Changed since the base graph First pass:")).toBe(
      paramsForStep(
        changedEntryContract,
        "the Spec's page carries the changed-since-base line: {changeNote}",
      ).changeNote,
    );
    expect(html).toContain('href="../diff.html#spec:probe.alpha"');
  },
});
const glossaryOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-glossary-page"),
  models: ref("spec:consumers.spec-studio.glossary-page"),
});
void glossaryOracle;
function expectedGlossary(p: Partial<GlossaryPageConditions>): GlossaryPageOutcome {
  return p.term === undefined
    ? unspecified
    : { kind: "the page lists the term {rows} times", rows: 2 };
}
const glossaryAnchor = specTest({
  id: testAnchorId("test:protocol.studio-glossary-same-word-twice"),
  verifies: ref("spec:consumers.spec-studio.glossary-page.same-word-twice"),
});
void glossaryAnchor;
registerSameWordTwice<World<GlossaryPageConditions>>({
  createWorld: world,
  invoke: async (w) => {
    for (const name of ["alpha", "beta"])
      writeFileSync(
        join(w.root, `${name}.sdp.md`),
        carrier(
          `spec:probe.${name}`,
          `\n## Model\n- **${required(w.point.term)}** — ${name === "alpha" ? `[#${required(w.point.key)}] ` : ""}The ${name} definition.\n`,
          "{}",
          "scoped",
          "model",
        ),
      );
    w.pages = await pages(w.root);
  },
  expected: expectedGlossary,
  observe: (w) => ({
    kind: "the page lists the term {rows} times",
    rows: (main(content(required(w.pages), "glossary.html")).match(/data-term="order"/gu) ?? [])
      .length,
  }),
  assertions: (w) => {
    const html = main(content(required(w.pages), "glossary.html"));
    const address = paramsForStep(
      sameWordTwiceContract,
      "the keyed row shows the address {address}",
    ).address;
    expect(html).toContain(`text="${address}"`);
    expect(html).toContain('href="specs/probe.alpha.html#term.order"');
    expect(main(content(required(w.pages), "specs/probe.alpha.html"))).toContain('id="term.order"');
  },
});

const navigationAnchor = specTest({
  id: testAnchorId("test:protocol.studio-navigation"),
  verifies: ref("spec:consumers.spec-studio.navigation"),
});
void navigationAnchor;

describe("Studio register pages", () => {
  it("renders declaration citations, decision reasons and design backlog from the shipped answers", async () => {
    const root = corpus({
      "model.sdp.md": carrier(
        "spec:probe.model",
        "\n## Model\n- **Order** — A definition.\n\n## Design\n- limit: `type Limit = 10;` The limit.\n- other: `type Other = 20;` Another.\n",
        "{}",
        "defined",
        "model",
      ),
      "old.sdp.md": carrier(
        "spec:probe.old",
        "\n## Decision\n- decision: Older.\n",
        "{}",
        "defined",
        "decision",
      ),
      "new.sdp.md": carrier(
        "spec:probe.new",
        "\n## Decision\n- decision: Newer.\n",
        "\n  supersedes:\n    target: spec:probe.old\n    reason: Replaces the older choice.\n  refines:\n    target: spec:probe.old\n    reason: Narrows the part.\n",
        "defined",
        "decision",
      ),
      "source.ts":
        "/**\n * @sdpAnchor impl:probe.use\n * @sdpReferences spec:probe.model\n */\n// spec:probe.model#design.limit\nexport const limit = 10;\n",
    });
    const result = await pages(root);
    const declarations = main(content(result, "declarations.html"));
    expect(declarations).toContain("type Limit = 10;");
    expect(declarations).toContain("source.ts:5");
    expect(declarations).toContain("no citation recorded");
    expect(declarations).toContain('href="specs/probe.model.html#design.limit"');
    expect(declarations).toContain('data-citation="recorded"');
    expect(declarations).toContain("1 Spec pins declarations.");
    const decisions = main(content(result, "decisions.html"));
    for (const value of [
      "Supersedes",
      "Superseded by",
      "Refines",
      "Refined by",
      "Shapes",
      "Questions",
      "Replaces the older choice.",
      "Narrows the part.",
    ])
      expect(decisions).toContain(value);
    const oldRow = required(
      [...decisions.matchAll(/<section class="spec-row">(.*?)<\/section>/gsu)]
        .map((m) => m[1])
        .find((row) => row?.includes("<code>spec:probe.old</code>")),
    );
    expect(oldRow).toContain(" · superseded</p>");
    expect(decisions).toContain("1 superseded decision.");
    const backlog = main(content(result, "backlog.html"));
    expect(backlog).toContain("impl:probe.use");
    expect(backlog).toContain("2 decisions left out");
    expect(backlog).toContain("2 entries, 2 declarations, 0 open, 0 blocking");
    expect(backlog).toContain("1 Spec in the design backlog.");
  });
  it("reaches each page in order, marks it current and omits every diff reference without a base", async () => {
    const result = await pages(corpus({}));
    const labels = [
      "Packs",
      "Architecture",
      "Tests",
      "Evidence",
      "Queue",
      "Questions",
      "Decisions",
      "Declarations",
      "Backlog",
      "Glossary",
    ];
    for (const page of result) {
      const nav = required(/<nav aria-label="Studio">(.*?)<\/nav>/su.exec(page.content)?.[1]);
      expect([...nav.matchAll(/<a[^>]*>(.*?)<\/a>/gu)].map((m) => m[1])).toEqual(labels);
      if (page.path !== "search.html")
        expect(nav).toContain(`href="${page.path}" aria-current="page"`);
      expect(page.content).not.toContain("diff.html");
      expect(page.content).not.toContain("Changed since");
    }
    const index = main(content(result, "index.html"));
    expect(index).toContain("See what the owner can state first");
    expect(index).toContain("See the components by context and layer");
  });
  it("refuses malformed base flags and unreadable JSON before extraction", async () => {
    const root = corpus({ "broken.sdp.md": "---\nid: invalid\n---\n" });
    for (const args of [
      ["--base-label", "Pass"],
      ["--base", "a", "--base", "b"],
      ["--base", "/missing-base.json"],
    ]) {
      const capture = createCaptureOutput();
      expect(await runSdpCli(["studio", root, ...args], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("--base");
      expect(capture.readStderr()).not.toContain("invalid");
    }
  });
});

describe("Studio base comparison", () => {
  it.each(["graph", "nested", "file alias", "root alias", "input alias"])(
    "refuses a base in generated output before writing through %s",
    async (variant) => {
      const root = corpus({ "a.sdp.md": carrier("spec:probe.alpha", "", "{}", "idea") });
      const capture = createCaptureOutput();
      expect(await runSdpCli(["build", root], capture.output)).toBe(0);
      const graph = join(root, "generated/graph.json");
      const bytes = readFileSync(graph);
      mkdirSync(join(root, "generated/spec-studio"));
      const outside = corpus({});
      let base = graph;
      let commandRoot = root;
      if (variant === "nested") {
        base = join(root, "generated/spec-studio/base.json");
        writeFileSync(base, bytes);
      } else if (variant === "file alias") {
        base = join(outside, "base.json");
        symlinkSync(graph, base);
      } else if (variant === "root alias") {
        commandRoot = join(outside, "root");
        symlinkSync(root, commandRoot);
      } else if (variant === "input alias") {
        const target = join(outside, "base.json");
        writeFileSync(target, bytes);
        base = join(root, "generated/spec-studio/base.json");
        symlinkSync(target, base);
      }
      const sentinel = join(root, "generated/spec-studio/diff.html");
      writeFileSync(sentinel, "Prior publication");
      writeFileSync(
        join(root, "a.sdp.md"),
        carrier("spec:probe.alpha", "\n## Design\n- limit: Changed.\n", "{}", "idea"),
      );
      const assets = { script: join(root, "fixture.js"), stylesheet: join(root, "fixture.css") };
      writeFileSync(assets.script, "");
      writeFileSync(assets.stylesheet, "");
      for (const flags of [[], ["--check-clean"]]) {
        const refusal = createCaptureOutput();
        expect(
          await runSdpCli(["studio", commandRoot, "--base", base, ...flags], refusal.output, {
            studioAssets: assets,
          }),
        ).toBe(1);
        expect(refusal.readStderr().trim().split("\n")).toHaveLength(1);
        expect(refusal.readStderr()).toContain("--base");
        expect(refusal.readStderr()).toContain(base);
        expect(readFileSync(base)).toEqual(bytes);
        expect(readFileSync(graph)).toEqual(bytes);
        expect(readFileSync(sentinel, "utf8")).toBe("Prior publication");
      }
    },
  );
  it("renders only existing sides for added and removed entries and one value for moved entries", async () => {
    const root = corpus({
      "a.sdp.md": carrier(
        "spec:probe.alpha",
        "\n## Design\n- limit: before\n- gone: old entry\n- first: first value\n- second: second value\n",
        "{}",
        "idea",
      ),
    });
    const base = extract({ root }).graph;
    writeFileSync(
      join(root, "a.sdp.md"),
      carrier(
        "spec:probe.alpha",
        "\n## Design\n- limit: after\n- fresh: null\n- second: second value\n- first: first value\n",
        "{}",
        "idea",
      ),
    );
    const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
      base: { graph: base, label: null },
      runs: [],
    });
    const diff = main(content(renderStudio(data), "diff.html"));
    const entry = (key: string) =>
      required(
        [...diff.matchAll(/<div class="entry">(.*?)<\/div>/gsu)]
          .map((m) => m[1])
          .find((row) => row?.includes(`<code>design.${key}</code>`)),
      );
    expect(entry("limit")).toContain("<b>Base</b><pre>before</pre><b>Now</b><pre>after</pre>");
    expect(entry("fresh")).toContain("<b>Now</b><pre>null</pre>");
    expect(entry("fresh")).not.toContain("<b>Base</b>");
    expect(entry("gone")).toContain("<b>Base</b><pre>old entry</pre>");
    expect(entry("gone")).not.toContain("<b>Now</b>");
    expect(entry("first")).toContain("moved");
    expect([...entry("first").matchAll(/<pre>/gu)]).toHaveLength(1);
  });
  it.each(["invalid graph", "different schema"])(
    "shows per-Pack diagnostics without no-change claims for %s",
    async (variant) => {
      const root = corpus({
        "a.sdp.md": carrier("spec:probe.alpha", "", "{}", "idea"),
        "p.pack.sdp.md": "---\nid: pack:probe\nspecs: [spec:probe.alpha]\n---\n# Probe\n",
      });
      const graph = extract({ root }).graph;
      const base =
        variant === "invalid graph" ? { nodes: "oops" } : { ...graph, schemaVersion: "0.9.0" };
      const data = await createStudioData(createReader(graph), undefined, {
        base: { graph: base, label: "First pass" },
        runs: [],
      });
      const pack = main(content(renderStudio(data), "packs/probe.html"));
      const changes = required(
        /<section id="changed-since-base">(.*?)<\/section>/su.exec(pack)?.[1],
      );
      expect(changes).toContain("First pass");
      expect(changes).toContain("Diagnostics");
      expect(changes).toContain(
        variant === "invalid graph"
          ? "Supply the graph written at the base commit."
          : "schemaVersion",
      );
      expect(changes).not.toContain("No membership or order change.");
      expect(changes).not.toContain("<p>None.</p>");
    },
  );
  it("keeps additions, removals, Pack order and anchor bindings apart and escapes compared values", async () => {
    const root = corpus({
      "a.sdp.md": carrier(
        "spec:probe.alpha",
        "\n## Design\n- limit: `<script>before</script>`\n",
        "{}",
        "idea",
      ),
      "old.sdp.md": carrier("spec:probe.removed"),
      "p.pack.sdp.md":
        "---\nid: pack:probe\nspecs: [spec:probe.alpha, spec:probe.removed]\n---\n# Probe\n",
    });
    const base = extract({ root }).graph;
    writeFileSync(
      join(root, "a.sdp.md"),
      carrier("spec:probe.alpha", "\n## Design\n- limit: `<script>after</script>`\n", "{}", "idea"),
    );
    rmSync(join(root, "old.sdp.md"));
    writeFileSync(join(root, "new.sdp.md"), carrier("spec:probe.added"));
    writeFileSync(
      join(root, "p.pack.sdp.md"),
      "---\nid: pack:probe\nspecs: [spec:probe.added, spec:probe.alpha]\n---\n# Probe\n",
    );
    writeFileSync(
      join(root, "code.ts"),
      "/**\n * @sdpAnchor impl:probe.alpha\n * @sdpReferences spec:probe.alpha\n */\nexport const alpha = 1;\n",
    );
    const reader = createReader(extract({ root }).graph);
    const inputs = { base: { graph: base, label: "<first>" }, runs: [] };
    const data = await createStudioData(reader, undefined, inputs);
    expect(data.recipes.packDiffs.get("pack:probe")).toMatchObject({
      totals: { added: 1, removed: 1, changed: 1 },
    });
    const first = renderStudio(data);
    expect(renderStudio(await createStudioData(reader, undefined, inputs))).toEqual(first);
    const diff = main(content(first, "diff.html"));
    expect(diff).toContain("1 Spec added.");
    expect(diff).toContain("1 Spec removed.");
    expect(diff).toContain("1 Spec changed.");
    expect(diff).toContain("1 Pack with membership or order changes.");
    expect(diff).toContain("1 Spec with binding changes.");
    expect(diff).toContain("&lt;script&gt;before&lt;/script&gt;");
    expect(diff).not.toContain("<script>");
    expect(diff).not.toContain('href="specs/probe.removed.html"');
    expect(diff.indexOf("Specs changed")).toBeLessThan(
      diff.indexOf("Bindings, derived from anchors"),
    );
    expect(diff).toContain("impl:probe.alpha");
    const pack = main(content(first, "packs/probe.html"));
    for (const label of [
      "Changed since the base",
      "Changed members",
      "Added members",
      "Members added",
      "Members removed",
    ])
      expect(pack).toContain(label);
    expect(main(content(first, "specs/probe.added.html"))).toContain(
      "New since the base graph &lt;first&gt;",
    );
    expect(pack).toContain("Base input: schema 0.11.0, 2 Specs.");
    expect(main(content(first, "specs/probe.alpha.html"))).toContain(
      "Base input: schema 0.11.0, 2 Specs.",
    );
    expect(content(first, "diff.html")).toContain('href="diff.html" aria-current="page"');
  });
  it("shows unreadable graph values as the recipe's diagnostics on the named diff page", async () => {
    const data = await createStudioData(
      createReader(extract({ root: corpus({}) }).graph),
      undefined,
      { base: { graph: {}, label: "First pass" }, runs: [] },
    );
    const diff = main(content(renderStudio(data), "diff.html"));
    expect(diff).toContain("First pass");
    expect(diff).toContain("Supply the graph written at the base commit.");
  });
  it("leaves the base file unchanged and certifies repeat publication with the same input", async () => {
    const root = corpus({ "a.sdp.md": carrier("spec:probe.alpha", "", "{}", "idea") });
    const base = join(corpus({}), "base.json");
    const capture = createCaptureOutput();
    expect(await runSdpCli(["build", root], capture.output)).toBe(0);
    const bytes = readFileSync(join(root, "generated/graph.json"));
    writeFileSync(base, bytes);
    const assets = { script: join(root, "fixture.js"), stylesheet: join(root, "fixture.css") };
    writeFileSync(assets.script, "");
    writeFileSync(assets.stylesheet, "");
    const args = ["studio", root, "--base", base, "--base-label", "Pass 1"];
    expect(await runSdpCli(args, capture.output, { studioAssets: assets })).toBe(0);
    const first = readFileSync(join(root, "generated/spec-studio/diff.html"), "utf8");
    expect(
      await runSdpCli([...args, "--check-clean"], capture.output, { studioAssets: assets }),
      capture.readStderr(),
    ).toBe(0);
    expect(readFileSync(base)).toEqual(bytes);
    expect(first).not.toContain(base);
    expect(first).not.toContain(root);
    const broken = join(corpus({}), "broken.json");
    writeFileSync(broken, "{invalid");
    const refusal = createCaptureOutput();
    expect(await runSdpCli(["studio", root, "--base", broken], refusal.output)).toBe(1);
    expect(refusal.readStderr().trim().split("\n")).toHaveLength(1);
    expect(refusal.readStderr()).toContain(broken);
  });
  it("keeps a cycle's round separate from statements that rest on nothing, and lists owner holds", async () => {
    const root = corpus({
      "a.sdp.md": carrier(
        "spec:probe.alpha",
        "\n## Behavior\n- rule: A.\n",
        "\n  dependsOn: spec:probe.beta",
      ),
      "b.sdp.md": carrier(
        "spec:probe.beta",
        "\n## Behavior\n- rule: B.\n",
        "\n  dependsOn: spec:probe.alpha",
      ),
      "q.sdp.md": carrier(
        "spec:probe.question",
        "\n### Open questions\n- [blocking #choice] Which choice?\n  - decider: owner\n  - provisional: Keep it.\n- [non-blocking] Who decides this?\n",
        "\n  dependsOn: spec:probe.alpha",
      ),
    });
    const queue = main(content(await pages(root), "queue.html"));
    expect(queue).toContain("2 statements in round 1");
    expect(queue).toContain("0 statements rest on no waiting Spec");
    expect(queue).toContain("1 dependency cycle.");
    expect(queue).toContain("1 blocking and 0 non-blocking owner questions");
    expect(queue).toContain("1 question has no decider");
    expect(queue).toContain('href="specs/probe.question.html#question.choice"');
    expect(queue).toContain("holds <a");
  });
  it("sorts terms without locale collation and keeps non-letter headings addressable", async () => {
    const root = corpus({
      "m.sdp.md": carrier(
        "spec:probe.model",
        "\n## Model\n- **zeta** — A `z`.\n- **Alpha** — An a.\n- **_other** — An underscore.\n",
        "{}",
        "idea",
        "model",
      ),
    });
    const page = main(content(await pages(root), "glossary.html"));
    expect(page).toContain('id="letter.other"');
    expect(page).toContain('href="#letter.other"');
    expect(page.indexOf('data-term="Alpha"')).toBeLessThan(page.indexOf('data-term="zeta"'));
    expect(page).toContain("A <code>z</code>.");
    expect(page).toContain("3 terms defined by 1 Spec.");
  });
  it("orders queue floor options by rung and carries the Pack and floor on each row", async () => {
    const root = corpus({
      "scoped.sdp.md": carrier(
        "spec:probe.scoped",
        "\n### Open questions\n- [blocking #choice] Which choice?\n  - decider: owner\n\n## Behavior\n- rule: Scoped.\n",
        "\n  dependsOn: spec:probe.defined",
        "idea",
      ),
      "defined.sdp.md": carrier(
        "spec:probe.defined",
        "\n## Behavior\n- rule: Defined.\n",
        "\n  dependsOn: spec:probe.scoped",
        "idea",
      ),
      "ready.sdp.md": carrier(
        "spec:probe.ready",
        "\n## Behavior\n- rule: Ready.\n",
        "\n  dependsOn: spec:probe.settled",
        "idea",
      ),
      "settled.sdp.md": carrier(
        "spec:probe.settled",
        "\n## Behavior\n- rule: Settled.\n",
        "\n  dependsOn: spec:probe.defined",
        "defined",
      ),
      "p.pack.sdp.md":
        "---\nid: pack:probe\nspecs: [spec:probe.scoped, spec:probe.defined, spec:probe.ready]\n---\n# Probe\n",
    });
    const queue = main(content(await pages(root), "queue.html"));
    const floor = required(/<select data-filter="floor">(.*?)<\/select>/su.exec(queue)?.[1]);
    expect([...floor.matchAll(/<option value="([^"]+)"/gu)].map((m) => m[1])).toEqual([
      "any",
      "scoped",
      "defined",
      "ready",
    ]);
    for (const rung of ["scoped", "defined", "ready"]) {
      const row =
        required(queue.split(`data-statement="spec:probe.${rung}"`)[1]).split("</li>")[0] ?? "";
      expect(row).toContain('data-pack="pack:probe"');
      expect(row).toContain(`data-floor="${rung}"`);
    }
    const questions = required(queue.split("<h2>Owner questions</h2>")[1]);
    expect(questions).toContain('data-row data-pack="pack:probe"');
  });
  it("uses authored term keys and orders duplicate terms by Spec id", async () => {
    const root = corpus({
      "a.sdp.md": carrier(
        "spec:probe.zeta",
        "\n## Model\n- **order** — The zeta definition.\n",
        "{}",
        "idea",
        "model",
      ),
      "z.sdp.md": carrier(
        "spec:probe.alpha",
        "\n## Model\n- **order** — [#purchase] The alpha definition.\n",
        "{}",
        "idea",
        "model",
      ),
    });
    const result = await pages(root);
    const page = main(content(result, "glossary.html"));
    expect(page).toContain('href="specs/probe.alpha.html#term.purchase"');
    expect(page).toContain('text="spec:probe.alpha#term.purchase"');
    expect(page).not.toContain("#term.order");
    expect(page.indexOf("The alpha definition.")).toBeLessThan(
      page.indexOf("The zeta definition."),
    );
    expect(main(content(result, "specs/probe.alpha.html"))).toContain('id="term.purchase"');
  });
});

it("reads each owner question's provisional reading from its reader Spec and key", async () => {
  const root = corpus({
    "a.sdp.md": carrier(
      "spec:probe.alpha",
      "\n### Open questions\n- [blocking #first] First choice?\n  - decider: owner\n  - provisional: Alpha `<first>`.\n- [non-blocking #second] Second choice?\n  - decider: owner\n  - provisional: Alpha second.\n- [non-blocking] Unkeyed choice?\n  - decider: owner\n  - provisional: Alpha unkeyed.\n- [non-blocking #absent] No reading?\n  - decider: owner\n",
    ),
    "z.sdp.md": carrier(
      "spec:probe.zeta",
      "\n### Open questions\n- [blocking #first] Zeta choice?\n  - decider: owner\n  - provisional: Zeta first.\n",
    ),
  });
  const extracted = extract({ root });
  expect(extracted.report.findings).toEqual([]);
  const data = await createStudioData(createReader(extracted.graph));
  const queue = data.recipes.all.get(46) as {
    questions: { address: string | null; index: number }[];
  };
  expect(queue.questions.every((row) => !Object.hasOwn(row, "provisional"))).toBe(true);
  const all = new Map(data.recipes.all);
  all.set(46, {
    ...queue,
    questions: queue.questions.map((row) => ({
      ...row,
      index: row.address === null ? row.index : 999,
    })),
  });
  const specs = data.specs.map((spec) => ({
    ...spec,
    designColumns: {
      ...spec.designColumns,
      openQuestions: [...spec.designColumns.openQuestions].reverse(),
    },
  }));
  const before = JSON.stringify(queue);
  const html = main(
    content(renderStudio({ ...data, specs, recipes: { ...data.recipes, all } }), "queue.html"),
  );
  const rows = [...html.matchAll(/<div data-row data-pack="[^"]*">(.*?)<\/div>/gsu)].map((match) =>
    required(match[1]),
  );
  expect(rows).toHaveLength(5);
  for (const [question, reading] of [
    ["First choice?", "Alpha <code>&lt;first&gt;</code>."],
    ["Second choice?", "Alpha second."],
    ["Unkeyed choice?", "Alpha unkeyed."],
    ["Zeta choice?", "Zeta first."],
  ]) {
    const row = required(rows.find((value) => value.includes(required(question))));
    expect(row).toContain(`<p>Provisional: ${required(reading)}</p>`);
    expect(row.indexOf("Provisional:")).toBeLessThan(row.indexOf("holds "));
  }
  expect(required(rows.find((row) => row.includes("No reading?")))).not.toContain("Provisional:");
  expect(JSON.stringify(queue)).toBe(before);
});

it("renders a keying proposal as one line per keyed entry and readable changed rule text", async () => {
  const root = corpus({
    "probe.sdp.md": carrier(
      "spec:probe.keying",
      "\n## Behavior\n- rule: First rule.\n- rule: Second rule.\n",
    ),
  });
  const base = extract({ root }).graph;
  const path = join(root, "probe.sdp.md");
  writeFileSync(
    path,
    readFileSync(path, "utf8")
      .replace("- rule: First rule.", "- rule: [#first] First rule.")
      .replace("- rule: Second rule.", "- rule: [#second] Revised second rule."),
  );
  const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
    base: { graph: base, label: "Before keying" },
    runs: [],
  });
  const html = main(content(renderStudio(data), "diff.html"));
  const entries = [...html.matchAll(/<div class="entry">(.*?)<\/div>/gsu)].map((m) => m[1] ?? "");
  expect(entries).toHaveLength(2);
  expect(entries[0]).toBe(
    "<p><code>rule.first</code> · keyed · First rule. · Base: none · Now: <code>spec:probe.keying#rule.first</code></p>",
  );
  expect(entries[1]).toContain("<b>Base</b><p>Second rule.</p>");
  expect(entries[1]).toContain("<b>Now</b><p>Revised second rule.</p>");
  expect(entries[1]).not.toMatch(/<pre>|&quot;list&quot;|&quot;text&quot;/u);
});

it("lists keyed lines in head rule order with rendered text for added, renamed and removed keys", async () => {
  const root = corpus({
    "probe.sdp.md": carrier(
      "spec:probe.keying",
      "\n## Behavior\n- rule: [#zOld] Same `<script>` text.\n- flow: Middle flow.\n- rule: [#aDrop] Dropped key text.\n",
    ),
  });
  const base = extract({ root }).graph;
  writeFileSync(
    join(root, "probe.sdp.md"),
    carrier(
      "spec:probe.keying",
      "\n## Behavior\n- rule: Dropped key text.\n- flow: [#fMiddle] Middle flow.\n- rule: [#bNew] Same `<script>` text.\n",
    ),
  );
  const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
    base: { graph: base, label: null },
    runs: [],
  });
  const before = JSON.stringify(data.recipes.all.get(35));
  const rendered = renderStudio(data);
  const html = main(content(rendered, "diff.html"));
  const entries = [...html.matchAll(/<div class="entry">(.*?)<\/div>/gsu)].map((m) => m[1] ?? "");
  expect(entries).toEqual([
    "<p><code>rule.aDrop</code> · keyed · Dropped key text. · Base: <code>spec:probe.keying#rule.aDrop</code> · Now: none</p>",
    "<p><code>rule.fMiddle</code> · keyed · Middle flow. · Base: none · Now: <code>spec:probe.keying#rule.fMiddle</code></p>",
    "<p><code>rule.bNew</code> · keyed · Same <code>&lt;script&gt;</code> text. · Base: <code>spec:probe.keying#rule.zOld</code> · Now: <code>spec:probe.keying#rule.bNew</code></p>",
  ]);
  expect(main(content(rendered, "specs/probe.keying.html"))).toContain(
    "Same <code>&lt;script&gt;</code> text.",
  );
  expect(html).not.toContain("<script>");
  expect(JSON.stringify(data.recipes.all.get(35))).toBe(before);
  expect(renderStudio(data)).toEqual(rendered);
});

it.each([false, true])(
  "counts keyed rules apart from changed parts, mixed changes: %s",
  async (mixed) => {
    const root = corpus({
      "probe.sdp.md": carrier(
        "spec:probe.keying",
        "\n## Behavior\n- rule: First rule.\n- flow: Last flow.\n\n## Design\n- limit: Original limit.\n",
      ),
    });
    const base = extract({ root }).graph;
    const path = join(root, "probe.sdp.md");
    writeFileSync(
      path,
      readFileSync(path, "utf8")
        .replace("rule: First", "rule: [#first] First")
        .replace("flow: Last", "flow: [#last] Last")
        .replace("Original limit.", mixed ? "Revised limit." : "Original limit."),
    );
    const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
      base: { graph: base, label: "Before keying" },
      runs: [],
    });
    const html = main(content(renderStudio(data), "specs/probe.keying.html"));
    const note = required(/<p class="change-note">(.*?)<\/p>/su.exec(html)?.[1]);
    expect(note).toContain("2 rules keyed, wording unchanged");
    expect(note).toContain('href="../diff.html#spec:probe.keying"');
    expect(note.includes("<code>design.limit</code>")).toBe(mixed);
    expect(note).not.toMatch(/<code>rule\.(first|last)<\/code>/u);
  },
);

it("marks only members with exclusively keyed changes as keyed only", async () => {
  const root = corpus({
    "keyed.sdp.md": carrier("spec:probe.keyed", "\n## Behavior\n- rule: Keep it.\n"),
    "mixed.sdp.md": carrier(
      "spec:probe.mixed",
      "\n## Behavior\n- rule: Keep it.\n- rule: Old wording.\n",
    ),
    "p.pack.sdp.md":
      "---\nid: pack:probe\nspecs: [spec:probe.keyed, spec:probe.mixed]\n---\n# Probe\n",
  });
  const base = extract({ root }).graph;
  for (const name of ["keyed", "mixed"]) {
    const path = join(root, `${name}.sdp.md`);
    writeFileSync(
      path,
      readFileSync(path, "utf8")
        .replace("rule: Keep", "rule: [#keep] Keep")
        .replace("Old wording.", "New wording."),
    );
  }
  const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
    base: { graph: base, label: null },
    runs: [],
  });
  const html = main(content(renderStudio(data), "packs/probe.html"));
  const changes = required(/<section id="changed-since-base">(.*?)<\/section>/su.exec(html)?.[1]);
  expect(changes).toContain(
    '<li><a href="../specs/probe.keyed.html">spec:probe.keyed</a> · keyed only</li>',
  );
  expect(changes).toContain('<li><a href="../specs/probe.mixed.html">spec:probe.mixed</a></li>');
});

it("renders changed list values as lists instead of raw JSON arrays", async () => {
  const root = corpus({
    "probe.sdp.md": carrier("spec:probe.lists", "\n## Behavior\n- rule: Read it.\n").replace(
      "- outcome: Read the design.",
      "- outcome: Read the design.\n- risk: First risk.\n- risk: Second risk.",
    ),
  });
  const base = extract({ root }).graph;
  const path = join(root, "probe.sdp.md");
  writeFileSync(
    path,
    readFileSync(path, "utf8").replace("Second risk.", "Changed risk `<script>`."),
  );
  const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
    base: { graph: base, label: null },
    runs: [],
  });
  const html = main(content(renderStudio(data), "diff.html"));
  expect(html).toContain(
    '<ul class="plain-list"><li><pre>First risk.</pre></li><li><pre>Second risk.</pre></li></ul>',
  );
  expect(html).toContain("Changed risk `&lt;script&gt;`.");
  expect(html).not.toContain("&quot;risks&quot;");
  expect(html).not.toContain("<script>");
});

it("retains the owning list when readable rule text moves to a flow", async () => {
  const root = corpus({
    "probe.sdp.md": carrier("spec:probe.move", "\n## Behavior\n- rule: [#read] Read it.\n"),
  });
  const base = extract({ root }).graph;
  const path = join(root, "probe.sdp.md");
  writeFileSync(path, readFileSync(path, "utf8").replace("- rule:", "- flow:"));
  const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
    base: { graph: base, label: null },
    runs: [],
  });
  const html = main(content(renderStudio(data), "diff.html"));
  expect(html).toContain("rule.read</code> · moved");
  expect(html).toContain('<b>Now</b><p>Read it.</p><p class="entry-line">Flow</p>');
});
