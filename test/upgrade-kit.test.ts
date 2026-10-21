import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  codeAnchor,
  codeAnchorId,
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { extract, schemaVersion, validateGraph } from "../src/index.js";
import type { GraphSchema, PrimitiveNode } from "../src/index.js";
import { SDP_HELP_TEXT } from "../src/cli/sdp.js";
import { catalogRecipe, shippedRecipe } from "./helpers/recipe-probe.js";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  CapabilityAdoptionConditions,
  CapabilityAdoptionOutcome,
} from "../generated/contracts/consumers.upgrade-kit.capability-adoption.space.js";
import type {
  RuleKeyProposalConditions,
  RuleKeyProposalOutcome,
} from "../generated/contracts/consumers.upgrade-kit.rule-key-proposal.space.js";
import { countsACorpusContract } from "../generated/contracts/consumers.upgrade-kit.capability-adoption.counts-a-corpus.contract.js";
import { proposalAppliesCleanContract } from "../generated/contracts/consumers.upgrade-kit.rule-key-proposal.proposal-applies-clean.contract.js";
import { collisionAndUnkeyableContract } from "../generated/contracts/consumers.upgrade-kit.rule-key-proposal.collision-and-unkeyable.contract.js";
import { registerCountsACorpus } from "./consumers.upgrade-kit.capability-adoption.counts-a-corpus.test.generated.js";
import { registerProposalAppliesClean } from "./consumers.upgrade-kit.rule-key-proposal.proposal-applies-clean.test.generated.js";
import { registerCollisionAndUnkeyable } from "./consumers.upgrade-kit.rule-key-proposal.collision-and-unkeyable.test.generated.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

interface Count {
  inUse: number;
  applicable: number;
}
interface Adoption {
  totals: Record<string, number>;
  capabilities: {
    capability: string;
    inUse: number | null;
    applicable: number | null;
    carriedBy: string;
  }[];
  packs: { id: string; members: number; capabilities: Record<string, Count> }[];
  specs: {
    id: string;
    packs: string[];
    inUse: Record<string, number>;
    couldApply: Record<string, number>;
  }[];
  leftOut: string[];
}
interface Proposal {
  schema: string;
  base: string;
  reason: string;
  changes: { scope: string[]; request: string; text: string; reason: string }[];
}
interface Proposed {
  scope: Record<string, unknown>;
  totals: { specs: number; entries: number; keyed: number; proposed: number; unkeyable: number };
  proposal: Proposal | null;
  unkeyable: { spec: string; entry: string; file: string; line: number | null; reason: string }[];
}
function probe(id: string, sections: PrimitiveNode["sections"] = {}): PrimitiveNode {
  return {
    id: `spec:probe.${id}`,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    title: id,
    file: `${id}.sdp.md`,
    sections: { intent: { outcome: "Probe the upgrade kit." }, ...sections },
  };
}
function graph(nodes: GraphSchema["nodes"], edges: GraphSchema["edges"] = []): GraphSchema {
  return { schemaVersion, nodes, edges };
}

const guideAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.upgrade-guide"),
  label: "realizes the shipped upgrade guide document",
  satisfies: ref("spec:consumers.upgrade-kit"),
});
void guideAnchor;

const guideTestAnchor = specTest({
  id: testAnchorId("test:protocol.upgrade-guide"),
  verifies: ref("spec:consumers.upgrade-kit"),
});
void guideTestAnchor;

describe("upgrade kit", () => {
  const guide = readFileSync(
    new URL("../docs/agent-surface/upgrade-guide.md", import.meta.url),
    "utf8",
  );
  it("applies unchanged scopes while sending only moved changes to a person", () => {
    expect(guide).toContain("Send each change whose scope moved since the base to a person");
    expect(guide).toMatch(/ask an agent to apply the remaining changes/u);
    expect(guide).toContain("The recipes write no carriers and grant no approval.");
  });
  it("names a carrying Spec in every guide section", () => {
    for (const section of guide.split(/^## /mu).slice(1)) {
      expect(section, section.split("\n")[0]).toMatch(/`spec:[a-z0-9.-]+`/u);
    }
  });
  it("teaches the upgrade steps in the pinned order", () => {
    expect([...guide.matchAll(/^## (.+)$/gmu)].map((match) => match[1])).toEqual([
      "Measure the corpus",
      "Propose and apply rule keys",
      "Choose capabilities to adopt",
      "Move rules files onto shipped recipes",
      "Read large Packs and waiting statements",
      "Publish the roots",
      "Pass subjects as data",
    ]);
    expect(guide.slice(0, guide.indexOf("## Measure"))).toContain("pnpm exec sdp --version");
    const section = (heading: string) => guide.split(`## ${heading}\n`)[1]?.split(/^## /mu)[0];
    expect(section("Measure the corpus")).toContain("recipes(47, params)");
    expect(section("Propose and apply rule keys")).toContain("recipes(48, params)");
    expect(section("Propose and apply rule keys")).toContain("recipes(38, params)");
    for (const ordinal of [25, 26, 42, 50, 51]) {
      expect(section("Move rules files onto shipped recipes")).toContain(
        `recipe ${String(ordinal)}`,
      );
    }
    expect(section("Read large Packs and waiting statements")).toContain("part.of");
    expect(section("Read large Packs and waiting statements")).toContain("recipe 36");
    expect(section("Read large Packs and waiting statements")).toContain("recipe 46");
    expect(section("Publish the roots")).toContain("pnpm exec sdp generate .");
    expect(section("Pass subjects as data")).toContain("--params @adoption.json");
    expect(section("Pass subjects as data")).toContain("--params KEY=@PATH");
  });
  it("runs the guide's rules file on a clean corpus with no address parameters", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-guide-rules-"));
    try {
      writeFileSync(join(root, "first.sdp.md"), document("first", ["Probe rule."], "{}"));
      const snippet = guide
        .split("## Move rules files onto shipped recipes\n")[1]
        ?.match(/```js\n([\s\S]*?)\n```/u)?.[1];
      expect(snippet).toBeDefined();
      const file = join(root, "rules.js");
      writeFileSync(file, snippet ?? "");
      const capture = createCaptureOutput();
      expect(
        await runSdpCli(["validate", root, "--rules", file], capture.output),
        capture.readStdout(),
      ).toBe(0);
      expect(capture.readStdout()).toContain("validate: 0 errors");
      expect(capture.readStdout()).not.toContain("unresolved-address");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  it("names the recipes' carrying Specs and teaches rule-key proposal as the rule-key action", () => {
    const catalog = readFileSync(
      new URL("../docs/agent-surface/recipes.md", import.meta.url),
      "utf8",
    );
    for (const [ordinal, law] of [
      [47, "capability-adoption"],
      [48, "rule-key-proposal"],
    ] as const) {
      const prose = catalog.split(`## ${String(ordinal)}. `)[1]?.split("```js")[0];
      expect(prose).toContain(`spec:consumers.upgrade-kit.${law}`);
    }
    const ruleKeys = guide.split("### ruleKeys\n")[1]?.split(/^### /mu)[0];
    expect(ruleKeys).toContain("recipe 48");
    expect(ruleKeys).not.toContain("recipe 34");
  });
  it("ships the guide and names every reported capability's law and measurement", async () => {
    const guide = readFileSync(
      new URL("../docs/agent-surface/upgrade-guide.md", import.meta.url),
      "utf8",
    );
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      files: string[];
    };
    expect(pkg.files).toContain("docs/agent-surface/upgrade-guide.md");
    expect(SDP_HELP_TEXT).toContain("docs/agent-surface/upgrade-guide.md");
    const answer = await catalogRecipe<Adoption>(47, graph([]));
    const sections = guide.split(/^### /mu).slice(1);
    expect(sections).toHaveLength(answer.capabilities.length);
    for (const row of answer.capabilities) {
      const section = sections.find((text) => text.startsWith(`${row.capability}\n`));
      expect(section).toBeDefined();
      expect(section).toContain(row.carriedBy);
      expect(section?.toLowerCase()).toContain("recipe 47");
    }
  });
  it("counts rules, reasons and unknown external perspectives", async () => {
    const input = graph(
      [
        probe("first", {
          behavior: { rules: ["one", "two", "three"], ruleKeys: { one: "rules[0]" } },
        }),
        probe("second"),
      ],
      [
        {
          from: "spec:probe.first",
          to: "spec:probe.second",
          type: "dependsOn",
          claim: "declared",
          reason: "Probe reason",
        },
        { from: "spec:probe.second", to: "spec:probe.first", type: "refines", claim: "declared" },
      ],
    );
    const answer = await catalogRecipe<Adoption>(47, input);
    expect(answer.capabilities).toEqual(
      expect.arrayContaining([
        { capability: "ruleKeys", inUse: 1, applicable: 3, carriedBy: "spec:model.rule-keys" },
        {
          capability: "relationReasons",
          inUse: 1,
          applicable: 2,
          carriedBy: "spec:model.relation-reasons",
        },
        {
          capability: "perspectives",
          inUse: null,
          applicable: null,
          carriedBy: "spec:consumers.review-perspectives",
        },
      ]),
    );
  });
  it("coins collisions and lists an unkeyable entry", async () => {
    const answer = await catalogRecipe<Proposed>(
      48,
      graph([
        probe("first", {
          behavior: {
            rules: [
              "A part fits the budget.",
              "Every part fits the budget again.",
              "Ο κανόνας ισχύει.",
            ],
          },
        }),
      ]),
      { commit: "probe" },
    );
    expect(answer.proposal?.changes.map((row) => row.text)).toEqual([
      "[#partFitsBudget] A part fits the budget.",
      "[#partFitsBudget2] Every part fits the budget again.",
    ]);
    expect(answer.unkeyable).toEqual([
      {
        spec: "spec:probe.first",
        entry: "rule[2]",
        file: "first.sdp.md",
        line: null,
        reason: "no word to coin a key from",
      },
    ]);
  });
});

const RULE_ROW = "the rule-key row reads {ruleKeys}";
const REASON_ROW = "the relation-reason row reads {relationReasons}";
const PERSPECTIVES = "the perspectives row reads {perspectives}";
const KEYS = "the proposal adds the keys {keys}";
const UNKEYABLE = "the proposal leaves {unkeyable} entries unkeyed";
const CHECK = "the proposal check reports {moved} moved changes and {problems} schema problems";
const VALIDATE = "the probe validates with {errors} errors once an agent applies the proposal";

function document(id: string, rules: string[], relations: string) {
  return `---\nid: spec:probe.${id}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Probe the upgrade kit.\n\n## Behavior\n${rules.map((text) => `- rule: ${text}\n`).join("")}`;
}
interface AdoptionWorld {
  point: Partial<CapabilityAdoptionConditions>;
  answer?: Adoption;
}
const adoptionOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.capability-adoption"),
  models: ref("spec:consumers.upgrade-kit.capability-adoption"),
});
void adoptionOracleAnchor;

function expectedAdoption(point: Partial<CapabilityAdoptionConditions>): CapabilityAdoptionOutcome {
  return point.keyed === undefined || point.rules === undefined
    ? unspecified
    : { kind: RULE_ROW, ruleKeys: `${point.keyed} of ${point.rules}` };
}
function adoptionRows(world: AdoptionWorld) {
  const row = (name: string) => {
    const value = world.answer?.capabilities.find((item) => item.capability === name);
    if (!value) throw new Error(`Missing capability ${name}`);
    return `${String(value.inUse)} of ${String(value.applicable)}`;
  };
  return {
    ruleKeys: row("ruleKeys"),
    relationReasons: row("relationReasons"),
    perspectives: row("perspectives"),
  };
}
const countsAnchor = specTest({
  id: testAnchorId("test:protocol.capability-adoption.counts-a-corpus"),
  verifies: ref("spec:consumers.upgrade-kit.capability-adoption.counts-a-corpus"),
});
void countsAnchor;

registerCountsACorpus({
  createWorld: (point): AdoptionWorld => ({ point }),
  async invoke(world) {
    const root = mkdtempSync(join(tmpdir(), "sdp-adoption-"));
    try {
      writeFileSync(
        join(root, "first.sdp.md"),
        document(
          "first",
          Array.from(
            { length: world.point.rules ?? 0 },
            (_, index) =>
              `${index < (world.point.keyed ?? 0) ? `[#key${index}] ` : ""}Probe rule ${index}.`,
          ),
          "{ dependsOn: { target: spec:probe.second, reason: Probe reason } }",
        ),
      );
      writeFileSync(
        join(root, "second.sdp.md"),
        document("second", [], "{ refines: spec:probe.first }"),
      );
      world.answer = await shippedRecipe<Adoption>("47-capability-adoption.js", root);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (world): CapabilityAdoptionOutcome => ({
    kind: RULE_ROW,
    ruleKeys: adoptionRows(world).ruleKeys,
  }),
  expected: expectedAdoption,
  assertions(world) {
    expect(adoptionRows(world)).toEqual({
      ...paramsForStep(countsACorpusContract, RULE_ROW),
      ...paramsForStep(countsACorpusContract, REASON_ROW),
      ...paramsForStep(countsACorpusContract, PERSPECTIVES),
    });
  },
});
interface ProposalWorld {
  point: Partial<RuleKeyProposalConditions>;
  keys?: string;
  unkeyable?: number;
  moved?: number;
  problems?: number;
  errors?: number;
}
const proposalOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.rule-key-proposal"),
  models: ref("spec:consumers.upgrade-kit.rule-key-proposal"),
});
void proposalOracleAnchor;

function expectedProposal(point: Partial<RuleKeyProposalConditions>): RuleKeyProposalOutcome {
  switch (point.rules) {
    case "The bundle is composed on each invocation. / Each part fits the budget.":
      return { kind: KEYS, keys: "bundleComposedInvocation, partFitsBudget" };
    case "A part fits the budget. / Every part fits the budget again. / Ο κανόνας ισχύει.":
      return { kind: KEYS, keys: "partFitsBudget, partFitsBudget2" };
    default:
      return unspecified;
  }
}
async function invokeProposal(world: ProposalWorld) {
  const root = mkdtempSync(join(tmpdir(), "sdp-key-proposal-"));
  try {
    const file = join(root, "first.sdp.md");
    writeFileSync(file, document("first", (world.point.rules ?? "").split(" / "), "{}"));
    const capture = createCaptureOutput();
    expect(await runSdpCli(["build", root], capture.output)).toBe(0);
    const base = JSON.parse(
      readFileSync(join(root, "generated/graph.json"), "utf8"),
    ) as GraphSchema;
    const answer = await shippedRecipe<Proposed>("48-the-rule-key-proposal.js", root, {
      commit: "probe-commit",
      specs: ["spec:probe.first"],
    });
    if (!answer.proposal) throw new Error("Expected a proposal");
    const checked = await shippedRecipe<{
      schemaProblems: unknown[];
      totals: { moved: number; unresolved: number };
    }>("38-the-proposal-check.js", root, { proposal: answer.proposal, base });
    expect(checked.totals.unresolved).toBe(0);
    world.moved = checked.totals.moved;
    world.problems = checked.schemaProblems.length;
    world.unkeyable = answer.unkeyable.length;
    world.keys = answer.proposal.changes
      .map((change) => /^\[#([^\]]+)\]/u.exec(change.text)?.[1])
      .join(", ");
    const lines = readFileSync(file, "utf8").split("\n");
    for (const change of answer.proposal.changes) {
      const line = Number(/ line (\d+), after/u.exec(change.request)?.[1]) - 1;
      expect(lines[line]).toBe(`- rule: ${change.text.replace(/^\[#[^\]]+\] /u, "")}`);
      lines[line] = `- rule: ${change.text}`;
    }
    writeFileSync(file, lines.join("\n"));
    const validation = createCaptureOutput();
    expect(await runSdpCli(["validate", root], validation.output)).toBe(0);
    expect(validation.readStdout()).toContain("validate: 0 errors");
    world.errors = validateGraph(extract({ root }).graph).findings.filter(
      (finding) => finding.severity === "error",
    ).length;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
const proposalAdapters = {
  createWorld: (point: Partial<RuleKeyProposalConditions>): ProposalWorld => ({ point }),
  invoke: invokeProposal,
  observe: (world: ProposalWorld): RuleKeyProposalOutcome => ({
    kind: KEYS,
    keys: world.keys ?? "",
  }),
  expected: expectedProposal,
};
const appliesAnchor = specTest({
  id: testAnchorId("test:protocol.rule-key-proposal.proposal-applies-clean"),
  verifies: ref("spec:consumers.upgrade-kit.rule-key-proposal.proposal-applies-clean"),
});
void appliesAnchor;

registerProposalAppliesClean({
  ...proposalAdapters,
  assertions(world) {
    expect(world).toMatchObject({
      ...paramsForStep(proposalAppliesCleanContract, KEYS),
      ...paramsForStep(proposalAppliesCleanContract, UNKEYABLE),
      ...paramsForStep(proposalAppliesCleanContract, CHECK),
      ...paramsForStep(proposalAppliesCleanContract, VALIDATE),
    });
  },
});
const collisionAnchor = specTest({
  id: testAnchorId("test:protocol.rule-key-proposal.collision-and-unkeyable"),
  verifies: ref("spec:consumers.upgrade-kit.rule-key-proposal.collision-and-unkeyable"),
});
void collisionAnchor;

registerCollisionAndUnkeyable({
  ...proposalAdapters,
  assertions(world) {
    expect(world).toMatchObject({
      ...paramsForStep(collisionAndUnkeyableContract, KEYS),
      ...paramsForStep(collisionAndUnkeyableContract, UNKEYABLE),
      ...paramsForStep(collisionAndUnkeyableContract, CHECK),
    });
  },
});

const component = (id: string) => ({
  id: `component:probe.${id}`,
  nodeType: "CodeNode" as const,
  claim: "anchored" as const,
  file: "source.ts",
});
const pack = (id: string, members: string[]) => ({
  id: `pack:probe.${id}`,
  nodeType: "Pack" as const,
  claim: "declared" as const,
  members,
  file: `${id}.pack.sdp.md`,
});

const adoptionAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.capability-adoption-recipe"),
  label: "realizes capability adoption in the shipped recipe catalog",
  satisfies: ref("spec:consumers.upgrade-kit.capability-adoption"),
  role: "projection",
});
void adoptionAnchor;

describe("capability adoption details", () => {
  it.each(["refines", "verifies"] as const)(
    "counts distinct step skeletons and vocabulary keys inherited through %s",
    async (relation) => {
      const root = mkdtempSync(join(tmpdir(), "sdp-adoption-steps-"));
      try {
        writeFileSync(
          join(root, "parent.sdp.md"),
          `${document("parent", ["Probe rule."], "{}")}\n## Example space\n\`\`\`gwt-vocabulary\nGiven [#items] A cart with {items:number} items\nWhen [#runs] The probe runs\nThen [#ends] The probe ends with {result:string}\n\`\`\`\n`,
        );
        writeFileSync(
          join(root, "child.sdp.md"),
          `---\nid: spec:probe.child\nkind: example\naltitude: story\nreadiness: idea\nrelations: { ${relation}: spec:probe.parent }\n---\n# Child\n\n## Intent\n- outcome: Probe vocabulary inheritance.\n\n\`\`\`gwt\nGiven A cart with {items: 2} items\nAnd A cart with {items: 2} items\nWhen The probe runs\nThen The probe ends with {result: "done"}\n\`\`\`\n`,
        );
        writeFileSync(
          join(root, "steps.pack.sdp.md"),
          "---\nid: pack:probe.steps\nspecs: [spec:probe.parent, spec:probe.child]\n---\n# Steps\n",
        );
        const input = extract({ root }).graph;
        expect(
          validateGraph(input).findings.filter((finding) => finding.severity === "error"),
        ).toEqual([]);
        const answer = await catalogRecipe<Adoption>(47, input, { detail: true });
        expect(answer.capabilities.find((row) => row.capability === "stepKeys")).toMatchObject({
          inUse: 6,
          applicable: 6,
        });
        expect(answer.specs.find((row) => row.id === "spec:probe.child")).toMatchObject({
          inUse: { stepKeys: 3 },
        });
        expect(
          answer.specs.find((row) => row.id === "spec:probe.child")?.couldApply,
        ).not.toHaveProperty("stepKeys");
        expect(answer.packs[0]?.capabilities.stepKeys).toEqual({ inUse: 6, applicable: 6 });
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );
  it("counts repeated vocabulary and example steps once per skeleton within a Spec", async () => {
    const input = graph([
      probe("repeat", {
        behavior: {
          exampleSpace: { given: ["A value {value:string}", "A value {value:string}"] },
          examples: [
            {
              given: ['A value {value: "{done}"}', 'A value {value: "other"}'],
              when: [],
              then: [],
            },
          ],
          stepKeys: { value: "A value {value}" },
        },
      }),
    ]);
    const answer = await catalogRecipe<Adoption>(47, input, { detail: true });
    expect(answer.capabilities.find((row) => row.capability === "stepKeys")).toMatchObject({
      inUse: 1,
      applicable: 1,
    });
  });
  it("counts all capabilities and deduplicates shared components and repeated Pack members", async () => {
    const first = {
      ...probe("first", {
        intent: {
          outcome: "Probe",
          openQuestions: [
            "Plain question",
            { key: "choice", question: "Choose", links: ["spec:probe.second"], decider: "owner" },
          ],
        },
        behavior: {
          rules: ["One rule", "Another"],
          flows: ["A flow"],
          ruleKeys: { flow: "flows[0]" },
          examples: [{ given: ["A step"], when: ["It runs"], then: ["It works"] }],
          stepKeys: { runs: "It runs" },
        },
        model: {
          terms: { first: "First term", second: "Second term" },
          termKeys: { first: "first" },
        },
        design: {
          description: "Not an entry",
          id: "`component:probe.shared` describes it",
          pinned: "``a ` b`` explains it",
          plain: "Plain value",
        },
      }),
      readiness: "ready" as const,
    };
    const second = {
      ...probe("second", { design: { id: "component:probe.shared", uncited: "`Uncited`" } }),
      specKind: "example" as const,
    };
    const third = {
      ...probe("third", {
        design: { id: "component:probe.planned" },
        behavior: {
          exampleSpace: { given: ["A vocabulary step"] },
          stepKeys: { vocab: "A vocabulary step" },
        },
      }),
      readiness: "ready" as const,
      specKind: "decision" as const,
    };
    const input: GraphSchema = {
      ...graph([
        first,
        second,
        third,
        component("shared"),
        component("bare"),
        {
          id: "test:probe.verifier",
          nodeType: "Anchor",
          claim: "anchored",
          file: "test.ts",
          line: 1,
        },
        pack("z", [first.id, second.id, first.id]),
        pack("a", [first.id, second.id, "spec:missing"]),
      ]),
      edges: [
        { from: "component:probe.shared", type: "satisfies", to: first.id, claim: "anchored" },
        { from: "component:probe.shared", type: "satisfies", to: second.id, claim: "anchored" },
        { from: second.id, type: "verifies", to: first.id, claim: "declared", exercises: ["flow"] },
        { from: first.id, type: "dependsOn", to: third.id, claim: "declared", reason: "Probe" },
        { from: first.id, type: "belongsTo", to: "pack:probe.z", claim: "declared" },
        { from: "test:probe.verifier", type: "verifies", to: first.id, claim: "anchored" },
        { from: first.id, type: "verifies", to: third.id, claim: "declared", exercises: [] },
        // A malformed binding must still stay outside the authored-relation counts.
        { from: first.id, type: "verifies", to: third.id, claim: "anchored" },
      ],
      citations: [
        { address: `${first.id}#design.pinned`, file: "source.ts", line: 10 },
        { address: `${first.id}#design.pinned`, file: "source.ts", line: 11 },
        { address: `${first.id}#design.plain`, file: "source.ts", line: 12 },
      ],
    };
    const snapshot = JSON.stringify(input);
    const answer = await catalogRecipe<Adoption>(47, input, {
      detail: true,
      perspectives: [{ name: "security" }],
    });
    expect(answer.totals).toEqual({
      specs: 3,
      packs: 2,
      examples: 1,
      decisions: 1,
      componentUnits: 2,
      statedReady: 2,
      floorReady: 1,
    });
    expect(answer.capabilities.map((row) => [row.capability, row.inUse, row.applicable])).toEqual([
      ["ruleKeys", 1, 3],
      ["questionKeys", 1, 2],
      ["questionFields", 1, 2],
      ["relationReasons", 1, 3],
      ["exercises", 1, 1],
      ["pinnedDeclarations", 3, 6],
      ["componentDesigns", 2, 3],
      ["stepKeys", 2, 4],
      ["termKeys", 1, 2],
      ["entryCitations", 1, 3],
      ["perspectives", 1, null],
    ]);
    expect(
      answer.packs.map((row) => [row.id, row.members, row.capabilities.componentDesigns]),
    ).toEqual([
      ["pack:probe.a", 2, { inUse: 1, applicable: 1 }],
      ["pack:probe.z", 2, { inUse: 1, applicable: 1 }],
    ]);
    expect(answer.specs[0]).toEqual({
      id: first.id,
      packs: ["pack:probe.a", "pack:probe.z"],
      inUse: {
        ruleKeys: 1,
        questionKeys: 1,
        questionFields: 1,
        relationReasons: 1,
        pinnedDeclarations: 2,
        componentDesigns: 1,
        stepKeys: 1,
        termKeys: 1,
        entryCitations: 1,
      },
      couldApply: {
        ruleKeys: 2,
        questionKeys: 1,
        questionFields: 1,
        relationReasons: 1,
        pinnedDeclarations: 1,
        stepKeys: 2,
        termKeys: 1,
        entryCitations: 1,
      },
    });
    expect(answer.leftOut).toEqual([]);
    expect(answer).not.toHaveProperty("findings");
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(
      await catalogRecipe(
        47,
        { ...input, nodes: [...input.nodes].reverse(), edges: [...input.edges].reverse() },
        { detail: true, perspectives: [{ name: "security" }] },
      ),
    ).toEqual(answer);
    const selected = await catalogRecipe<Adoption>(47, input, { detail: [second.id, second.id] });
    expect(selected.specs.map((row) => row.id)).toEqual([second.id]);
    expect(selected.leftOut).toEqual(["Spec rows; pass detail: true or a list of Spec ids."]);
    expect(
      (await catalogRecipe<Adoption>(47, input, { perspectives: [] })).capabilities.at(-1)?.inUse,
    ).toBe(0);
  });
  it.each([null, 1, "all", {}, ["spec:missing"], [true]])("diagnoses detail %j", async (detail) => {
    expect(await catalogRecipe(47, graph([]), { detail })).toHaveProperty("diagnostics");
  });
});

const proposalAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.rule-key-proposal-recipe"),
  label: "realizes the rule-key proposal in the shipped recipe catalog",
  satisfies: ref("spec:consumers.upgrade-kit.rule-key-proposal"),
  role: "projection",
});
void proposalAnchor;

describe("rule-key proposal details", () => {
  it("drops possessives and apostrophes before coining keys", async () => {
    const input = graph([
      probe("possessives", {
        behavior: {
          rules: [
            "A history projection's fold",
            "A history projection’s fold",
            "A reader's don't split apostrophe",
          ],
        },
      }),
    ]);
    const answer = await catalogRecipe<Proposed>(48, input, { commit: "abc" });
    expect(answer.proposal?.changes.map((change) => change.text)).toEqual([
      "[#historyProjectionFold] A history projection's fold",
      "[#historyProjectionFold2] A history projection’s fold",
      "[#readerDontSplit] A reader's don't split apostrophe",
    ]);
  });
  it("preserves scope and entry order and skips existing keys and tags", async () => {
    const a = probe("a", {
      behavior: {
        rules: [
          "Existing key.",
          "[extension] Part fits the budget.",
          "Part fits the budget again.",
          "Implemented",
          "123 456",
          "the and",
          "Café lowerCamel lowerCamel runs",
          "[first] [second] 42 déjà vu works",
        ],
        flows: ["Part fits the budget last."],
        ruleKeys: { partFitsBudget: "rules[0]" },
      },
    });
    const b = probe("b", { behavior: { rules: ["Other rule."] } });
    const input: GraphSchema = {
      ...graph([a, b, pack("ordered", [b.id, a.id, b.id])]),
      locations: [{ spec: a.id, entry: "rule[1]", file: a.file, line: 12 }],
    };
    const snapshot = JSON.stringify(input);
    const answer = await catalogRecipe<Proposed>(48, input, {
      commit: "abc",
      pack: "pack:probe.ordered",
    });
    expect(answer.totals).toEqual({ specs: 2, entries: 10, keyed: 1, proposed: 8, unkeyable: 1 });
    expect(answer.proposal?.changes.map((row) => /^\[#([^\]]+)\]/u.exec(row.text)?.[1])).toEqual([
      "otherRule",
      "partFitsBudget2",
      "partFitsBudget3",
      "implemented",
      "theAnd",
      "cafeLowerCamel",
      "dejaVuWorks",
      "partFitsBudget4",
    ]);
    expect(answer.proposal?.changes[1]).toEqual({
      scope: [a.id],
      request:
        "Add the key marker [#partFitsBudget2] and one space at the start of the text of rule[1] of spec:probe.a, at a.sdp.md line 12, after its rule: or flow: label where it has one.",
      text: "[#partFitsBudget2] [extension] Part fits the budget.",
      reason: `Gives the entry the address ${a.id}#rule.partFitsBudget2.`,
    });
    expect(answer.proposal?.changes[0]?.request).toBe(
      "Add the key marker [#otherRule] and one space at the start of the text of rule[0] of spec:probe.b, at b.sdp.md, after its rule: or flow: label where it has one.",
    );
    expect(answer.proposal?.reason).toContain("in pack:probe.ordered");
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(await catalogRecipe(48, input, { commit: "abc", pack: "pack:probe.ordered" })).toEqual(
      answer,
    );
    const selected = await catalogRecipe<Proposed>(48, input, {
      commit: "abc",
      specs: [b.id, a.id],
    });
    expect(selected.scope).toEqual({ specs: [b.id, a.id] });
    expect(selected.proposal?.reason).toBe(
      "Key every rule and flow entry in spec:probe.b, spec:probe.a so a review, a register row or an example can cite it.",
    );
    expect((await catalogRecipe<Proposed>(48, input, { commit: "abc" })).proposal?.reason).toBe(
      "Key every rule and flow entry in the corpus so a review, a register row or an example can cite it.",
    );
    expect(
      (await catalogRecipe<Proposed>(48, graph([probe("empty")]), { commit: "abc" })).proposal,
    ).toBeNull();
  });
  it("diagnoses both scopes even when each resolves", async () => {
    const first = probe("first");
    const input = graph([first, pack("first", [first.id])]);
    expect(
      await catalogRecipe(48, input, {
        commit: "abc",
        pack: "pack:probe.first",
        specs: [first.id],
      }),
    ).toEqual({
      diagnostics: [{ parameter: "scope", problem: "Supply pack or specs, not both." }],
    });
  });
  it.each([
    {},
    { commit: "" },
    { commit: 1 },
    { commit: "abc", pack: "pack:missing" },
    { commit: "abc", specs: ["spec:missing"] },
    { commit: "abc", specs: [], pack: "pack:missing" },
    { commit: "abc", specs: "all" },
  ])("diagnoses invalid parameters %j", async (params) => {
    const answer = await catalogRecipe<Record<string, unknown>>(48, graph([]), params);
    expect(answer).toHaveProperty("diagnostics");
    expect(answer).not.toHaveProperty("proposal");
  });
});

it("drops leading digit words before checking word repeats", async () => {
  const answer = await catalogRecipe<Proposed>(
    48,
    graph([probe("digits", { behavior: { rules: ["42 alpha 42 beta"] } })]),
    { commit: "abc" },
  );
  expect(answer.proposal?.changes[0]?.text).toBe("[#alpha42Beta] 42 alpha 42 beta");
});
