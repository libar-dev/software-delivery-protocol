import { describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { reifyTypeScriptCarrier } from "../src/extract/carrier.js";
import { reifyGherkinCarrier } from "../src/extract/gherkin.js";
import { deriveGraph } from "../src/extract/derive.js";
import { serializeGraph } from "../src/extract/serialize.js";
import { generateContracts } from "../src/codegen/contracts.js";
import { parseId, specId } from "../src/ids.js";
import { validateGraph } from "../src/validate/validators.js";
import type { ExampleContract } from "../src/runner/index.js";
import { planExample, runExamplePlan } from "../src/runner/index.js";
import {
  compareContractOutcome,
  createRunnableExample,
  completeRunnableExample,
} from "../src/testing/index.js";
import { bindingTypechecks, createStepWorld, invokeStep } from "./helpers/key-worlds.js";

const keyedContentAnchor = specTest({
  id: testAnchorId("test:protocol.keyed-content"),
  verifies: [ref("spec:carrier.step-keys"), ref("spec:model.term-addresses")],
});
void keyedContentAnchor;

function md(body: string, kind = "behavior"): string {
  return `---\nid: spec:probe.keys\nkind: ${kind}\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Keys\n\n## Intent\n- outcome: Probe keys.\n\n${body}\n`;
}
function tsCarrier(body: string) {
  return reifyTypeScriptCarrier(
    `import { spec, specId } from "@libar-dev/software-delivery-protocol";\nexport const subject = spec({id:specId("spec:probe.keys"),title:"Keys",kind:"behavior",altitude:"story",readiness:"idea",${body}});`,
    "keys.sdp.ts",
  );
}
function graph(result: ReturnType<typeof reifyMarkdownCarrier>) {
  return deriveGraph(result.specs, [], []);
}

describe("keyed carrier content", () => {
  it("preserves authored key order, strips markers, records terms and never records steps", () => {
    const result = reifyMarkdownCarrier(
      md(
        "## Example space\n```gwt-vocabulary\nGiven [#zeta] {n:number} items\nWhen [#alpha] run\nThen done\n```\n\n## Model\n- **slot** — unkeyed\n- **term.with.dot** — [#description] a definition\n- **key** — [#alpha] another definition",
      ),
      "keys.sdp.md",
    );
    expect(result.findings).toEqual([]);
    const derived = graph(result);
    const data = JSON.parse(serializeGraph(derived)) as typeof derived;
    const node = data.nodes[0];
    expect(node?.nodeType === "Primitive" && node.sections?.behavior).toMatchObject({
      exampleSpace: { given: ["{n:number} items"] },
      stepKeys: { zeta: "{n} items", alpha: "run" },
    });
    if (node?.nodeType !== "Primitive") throw new Error("Missing Spec");
    expect(Object.keys(node.sections?.behavior ?? {})).toEqual(["exampleSpace", "stepKeys"]);
    expect(Object.keys(node.sections?.model ?? {})).toEqual(["terms", "termKeys"]);
    expect(Object.keys(node.sections?.behavior?.stepKeys ?? {})).toEqual(["zeta", "alpha"]);
    expect(data.locations?.map(({ entry, key }) => ({ entry, ...(key ? { key } : {}) }))).toEqual([
      { entry: "term[0]" },
      { entry: "term[1]", key: "description" },
      { entry: "term[2]", key: "alpha" },
    ]);
  });

  it.each(["[#bad-key] text", "[#good]  text", "[#good]\ttext", "[#good] "])(
    "refuses malformed markers at their physical step and term: %s",
    (text) => {
      const result = reifyMarkdownCarrier(
        md(
          `## Example space\n\`\`\`gwt-vocabulary\nGiven ${text}\nWhen run\nThen done\n\`\`\`\n\n## Model\n- **term** — ${text}`,
        ),
        "keys.sdp.md",
      );
      expect(result.specs).toEqual([]);
      expect(result.findings).toMatchObject([
        { path: "behavior.exampleSpace.given[0]", line: 15 },
        { path: "model.terms.term", line: 21 },
      ]);
    },
  );

  it("keeps later markers as ordinary text and permits a repeated keyed skeleton", () => {
    const result = tsCarrier(
      'behavior:{exampleSpace:{given:["[#items] {n:number} items", "{n:number} items", "[#items] {n:number} items"],when:["run"],then:["done [#later]"]}},model:{terms:{slot:"definition [#later]"}}',
    );
    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data.behavior).toMatchObject({
      stepKeys: { items: "{n} items" },
      exampleSpace: { then: ["done [#later]"] },
    });
  });

  it("drops each conflicting TypeScript key while preserving its Spec and marker-free text", () => {
    const result = tsCarrier(
      'behavior:{exampleSpace:{given:["[#same] one", "[#same] two", "[#a] three", "[#b] three"],when:["run"],then:["done"]}},model:{terms:{one:"[#same] first",two:"[#same] second"}}',
    );
    expect(result.specs).toHaveLength(1);
    expect(result.findings).toHaveLength(6);
    expect(
      result.findings.every(
        (f) => f.validatorId === "extract/unrecognized-property" && f.line === 2,
      ),
    ).toBe(true);
    expect(result.specs[0]?.data.behavior).not.toHaveProperty("stepKeys");
    expect(result.specs[0]?.data.model).toEqual({ terms: { one: "first", two: "second" } });
  });

  it("refuses a Gherkin carrier whole at every conflicting step", () => {
    const result = reifyGherkinCarrier(
      "@spec.probe.keys @altitude.story @readiness.idea\nFeature: Keys\n  @example-space\n  Scenario: Vocabulary\n    Given [#same] one\n    And [#same] two\n    When run\n    Then done\n",
      "keys.sdp.gherkin",
    );
    expect(result.specs).toEqual([]);
    expect(result.findings).toMatchObject([
      { path: "behavior.exampleSpace.given[0]", line: 5 },
      { path: "behavior.exampleSpace.given[1]", line: 6 },
    ]);
  });

  it("keeps keyed fence text and derived key maps out of the prose mention scan", () => {
    const result = reifyMarkdownCarrier(
      md(
        "## Example space\n```gwt-vocabulary\nGiven [#ref] see spec:absent\nWhen run\nThen done\n```\n\n## Model\n- **spec:missing** — [#term] a definition",
      ),
      "keys.sdp.md",
    );
    expect(
      validateGraph(graph(result)).findings.filter(
        (f) => f.validatorId === "conformance/prose-mentions",
      ),
    ).toEqual([]);
  });

  it("checks term addresses and refuses them in Spec id slots", () => {
    expect(parseId("spec:probe.keys#term.description").subpath).toBe("term.description");
    expect(() => specId("spec:probe.keys#term.description")).toThrow(
      "an entry address is not a Spec id",
    );
    expect(() => parseId("spec:probe.keys#step.items")).toThrow(
      "section design, ui, question, rule, or term",
    );
  });

  it("locates mentions inside keyed and unkeyed definitions, even when a term contains dots", () => {
    const result = reifyMarkdownCarrier(
      md(
        "## Model\n- **term.with.dot** — [#first] see spec:absent#term.key\n- **unkeyed** — see spec:other#term.key",
        "model",
      ),
      "keys.sdp.md",
    );
    const findings = validateGraph(graph(result)).findings.filter(
      (f) => f.validatorId === "conformance/prose-mentions",
    );
    expect(findings).toMatchObject([
      { path: "model.terms.term.with.dot", line: 14 },
      { path: "model.terms.unkeyed", line: 15 },
    ]);
  });

  it.each([
    ["items", "count"],
    ["[#cartSize] ", ""],
  ])(
    "breaks a keyed binding when its parameter or key changes: %s -> %s",
    async (before, after) => {
      const world = createStepWorld({
        carrier: "Markdown",
        vocabulary: "[#cartSize] {items:number} items",
        example: "{items: 2} items",
        before,
        after,
      });
      await invokeStep(world);
      expect(world.answer.stillBound).toBe(false);
    },
  );
});

describe("contract keys and Then outcomes", () => {
  function child(given: string, then = "done") {
    return reifyMarkdownCarrier(
      md(`\`\`\`gwt\nGiven ${given}\nWhen run\nThen ${then}\n\`\`\``, "example")
        .replaceAll("spec:probe.keys", "spec:probe.child")
        .replace("relations: {}", "relations:\n  refines: spec:probe.keys"),
      "child.sdp.md",
    ).specs;
  }
  function boundGraph(parent: ReturnType<typeof tsCarrier>, given: string, then = "done") {
    return deriveGraph(
      [...parent.specs, ...child(given, then)],
      [],
      [
        {
          id: "test:probe.child",
          flavor: "test",
          file: "test/child.test.ts",
          line: 1,
          data: { id: "test:probe.child", verifies: ["spec:probe.child"] },
        },
      ],
    );
  }

  it("breaks an unchanged typed handler when a still-compatible bound point changes slot type", () => {
    const firstParent = tsCarrier(
      'behavior:{exampleSpace:{given:["[#cartSize] {items:number} items"],when:["run"],then:["done"]}}',
    );
    const secondParent = tsCarrier(
      'behavior:{exampleSpace:{given:["[#cartSize] {items:string} items"],when:["run"],then:["done"]}}',
    );
    const first = generateContracts(boundGraph(firstParent, "{items: 2} items")).files.get(
      "probe.child.contract.ts",
    );
    const second = generateContracts(boundGraph(secondParent, '{items: "two"} items')).files.get(
      "probe.child.contract.ts",
    );
    if (!first || !second) throw new Error("Both compatible points must generate contracts");
    expect(first).toContain('readonly "cartSize": { readonly items: number }');
    expect(second).toContain('readonly "cartSize": { readonly items: string }');
    expect(bindingTypechecks(first, second)).toBe(false);
  });

  it("withholds a child marker where the vocabulary step carries no marker", () => {
    const parent = tsCarrier(
      'behavior:{exampleSpace:{given:["start"],when:["run"],then:["done"]}}',
    );
    const generated = generateContracts(boundGraph(parent, "[#startKey] start"));
    expect(generated.files.has("probe.child.contract.ts")).toBe(false);
    expect(generated.registrars.size).toBe(0);
    expect(generated.findings).toMatchObject([
      {
        validatorId: "contracts/conflicting-step-key",
        message:
          'example "spec:probe.child" step "start" carries key "startKey" but its vocabulary step carries none; step contract withheld',
      },
    ]);
  });

  it("keys a standalone example and a generated Then registrar by the authored keys", () => {
    const parent = tsCarrier(
      'behavior:{exampleSpace:{given:["start"],when:["run"],then:["[#done] complete {result:string}"]}}',
    );
    const generated = generateContracts(boundGraph(parent, "start", 'complete {result: "ok"}'));
    expect(generated.files.get("probe.child.contract.ts")).toContain(
      'key: "done", text: "complete {result}"',
    );
    expect(generated.registrars.get("test/probe.child.test.generated.ts")).toContain(
      'key: "done",',
    );
    const standalone = reifyMarkdownCarrier(
      md("```gwt\nGiven [#start] initial\nWhen run\nThen [#done] complete\n```", "example"),
      "standalone.sdp.md",
    );
    expect(generateContracts(graph(standalone)).files.get("probe.keys.contract.ts")).toContain(
      'key: "start", text: "initial"',
    );
  });

  it("uses a keyed Then for the Outcome union and the registrar binding", () => {
    const result = tsCarrier(
      'behavior:{exampleSpace:{given:["start"],when:["run"],then:["[#done] complete {result:string}"]}}',
    );
    const derived = graph(result);
    const generated = generateContracts(derived);
    expect(generated.files.get("probe.keys.space.ts")).toContain(
      'readonly kind: "done"; readonly result: string',
    );
  });

  it("withholds a colliding space and its registrars, while naming the space collision", () => {
    const parent = tsCarrier(
      'behavior:{exampleSpace:{given:["[#same] first", "same"],when:["run"],then:["done"]}}',
    );
    const generated = generateContracts(boundGraph(parent, "first"));
    expect(generated.files.has("probe.child.contract.ts")).toBe(true);
    expect(generated.registrars.size).toBe(0);
    expect(generated.files.has("probe.keys.space.ts")).toBe(false);
    expect(generated.findings).toMatchObject([
      {
        validatorId: "contracts/duplicate-step-key",
        subjectId: "spec:probe.keys",
        path: "behavior.exampleSpace",
        message: 'contract key "same" names both "first" and "same"; space contract withheld',
      },
    ]);
  });

  it("dispatches keyed steps and renders a failure from their current wording", async () => {
    const contract: ExampleContract<"done", { done: { total: number } }> = {
      spec: "spec:probe.example",
      title: "Example",
      steps: [
        {
          kind: "then" as const,
          key: "done" as const,
          text: "the result is now {total}",
          params: { total: 3 },
        },
      ],
    };
    const calls: number[] = [];
    const plan = planExample(contract, {
      done: (_world: unknown, { total }) => {
        calls.push(total);
        throw new Error("red");
      },
    });
    expect(plan.steps[0]).toMatchObject({
      key: "done",
      text: "the result is now {total}",
      label: "Then the result is now 3",
    });
    await expect(runExamplePlan(plan, {})).rejects.toThrow(
      "at step: Then the result is now 3\nred",
    );
    expect(calls).toEqual([3]);
  });

  it("compares an oracle by contract key and lists keys when no Then matches", async () => {
    const step = {
      kind: "then" as const,
      key: "done",
      text: "the result is now {total}",
      params: { total: 3 },
    };
    const execution = createRunnableExample(
      "spec:probe.example",
      {},
      [],
      {
        createWorld: () => ({}),
        invoke: () => undefined,
        expected: () => ({ kind: "done", total: 3 }),
        observe: () => ({ kind: "done", total: 3 }),
      },
      [step],
    );
    compareContractOutcome(execution, step);
    await expect(completeRunnableExample(execution)).resolves.toBeUndefined();
    const missed = createRunnableExample(
      "spec:probe.example",
      {},
      [],
      { ...execution.adapters, expected: () => ({ kind: "absent", total: 3 }) },
      [step],
    );
    await expect(completeRunnableExample(missed)).rejects.toMatchObject({
      message:
        'scenario spec:probe.example: oracle selected "absent"; available Then steps: "done"',
    });
  });
});
