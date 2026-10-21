import { specTest, testAnchorId, ref } from "@libar-dev/software-delivery-protocol";

import { specOracle, oracleAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "../src/projections/studio/pages/index.js";
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
    expect(html).not.toContain("<b>Links:</b> </span>");
    expect(html).toContain('href="specs/probe.zeta.html#question.choice"');
    expect(html).toContain('text="spec:probe.zeta#question.choice"');
    for (const facet of ["blocking", "decider", "deferral", "pack"])
      expect(html).toContain(`data-facet="${facet}"`);
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
      "superseded",
    ])
      expect(decisions).toContain(value);
    const backlog = main(content(result, "backlog.html"));
    expect(backlog).toContain("impl:probe.use");
    expect(backlog).toContain("2 decisions left out");
    expect(backlog).toContain("2 entries, 2 declarations, 0 open, 0 blocking");
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
    expect(diff).toContain("1 Specs added.");
    expect(diff).toContain("1 Specs removed.");
    expect(diff).toContain("1 Specs changed.");
    expect(diff).toContain("1 Packs with membership or order changes.");
    expect(diff).toContain("1 Specs with binding changes.");
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
    expect(queue).toContain("1 dependency cycles");
    expect(queue).toContain("1 blocking and 0 non-blocking owner questions");
    expect(queue).toContain("1 questions have no decider");
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
  });
});
