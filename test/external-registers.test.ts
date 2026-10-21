import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";
import { recipeFiles } from "../src/cli/build-artifacts.js";
import { compileBody } from "../src/cli/q-command.js";
import { createReader, schemaVersion, validateGraph } from "../src/index.js";
import type { GraphSchema } from "../src/index.js";

const anchor = codeAnchor({
  id: codeAnchorId("impl:protocol.external-registers-recipe"),
  label: "asserts realization of the shipped external-registers recipe",
  satisfies: ref("spec:validation.external-registers"),
});
void anchor;
const catalog = readFileSync(new URL("../docs/agent-surface/recipes.md", import.meta.url), "utf8");
async function run(
  params: Record<string, unknown>,
  graph: GraphSchema = { schemaVersion, nodes: [], edges: [] },
) {
  const recipe = recipeFiles(catalog).find((row) => row.ordinal === 50);
  if (recipe === undefined) throw new Error("Recipe 50 is missing.");
  return (await compileBody(recipe.content)(
    createReader(graph),
    graph,
    validateGraph(graph),
    params,
  )) as {
    diagnostics?: { parameter: string; problem: string }[];
    findings?: Record<string, unknown>[];
    tokens?: Record<string, unknown>[];
    totals?: Record<string, number>;
  };
}
const parameters = { register: { tokens: ["E-1"] }, pattern: "\\bE-\\d+\\b" };
describe("external register recipe", () => {
  it.each([
    [{}, "register"],
    [{ ...parameters, pattern: undefined }, "pattern"],
    [{ ...parameters, severity: "fatal" }, "severity"],
    [{ ...parameters, severity: null }, "severity"],
    [{ ...parameters, uncited: 1 }, "uncited"],
    [{ ...parameters, uncited: null }, "uncited"],
    [{ ...parameters, register: [] }, "register"],
    [{ ...parameters, register: { tokens: [""] } }, "register"],
    [{ ...parameters, register: { tokens: [{ token: "E-1", retired: "yes" }] } }, "register"],
    [{ ...parameters, register: { tokens: ["E-1", { token: "E-1", retired: true }] } }, "register"],
    [{ ...parameters, pattern: "[" }, "pattern"],
    [{ ...parameters, pattern: "x*" }, "pattern"],
    [{ ...parameters, pattern: "E" }, "pattern"],
  ] as const)(
    "diagnoses malformed input without a findings array: %j",
    async (params, parameter) => {
      const result = await run(params);
      expect(result.findings).toBeUndefined();
      expect(result.diagnostics?.map((row) => row.parameter)).toContain(parameter);
    },
  );
  it("reads text, authored keys and reasons while leaving identities, Packs and source alone", async () => {
    const graph: GraphSchema = {
      schemaVersion,
      nodes: [
        {
          id: "spec:E-99.owner",
          nodeType: "Primitive",
          claim: "declared",
          specKind: "behavior",
          altitude: "story",
          readiness: "idea",
          title: "E-1 E-1",
          narrative: "E-2 E-1",
          file: "E-90.sdp.md",
          sections: {
            intent: {
              outcome: "E-3",
              openQuestions: [
                {
                  key: "E-4",
                  question: "E-5",
                  blocking: false,
                  decider: "E-6",
                  links: ["E-7"],
                  provisional: "E-8",
                  trigger: "E-9",
                },
              ],
            },
            behavior: {
              rules: ["E-10 E-10"],
              ruleKeys: { "E-11": "rules[0]" },
              examples: [{ given: ["E-12"], when: ["E-13"], then: ["E-14"] }],
            },
            design: { "E-15": { nested: "E-16" } },
            ui: { "E-17": "E-18" },
            model: { terms: { "E-19": "E-20" } },
          },
        },
        {
          id: "spec:probe.second",
          nodeType: "Primitive",
          claim: "declared",
          specKind: "behavior",
          altitude: "story",
          readiness: "idea",
          title: "Second",
          file: "second.sdp.md",
          sections: { intent: { outcome: "E-1" } },
        },
        {
          id: "pack:probe",
          nodeType: "Pack",
          claim: "declared",
          title: "E-91",
          members: [],
          modelRefs: [],
          framing: "E-92",
          file: "E-93.pack.sdp.md",
        },
      ],
      edges: [
        {
          from: "spec:E-99.owner",
          to: "spec:probe.second",
          type: "refines",
          claim: "declared",
          reason: "E-21",
        },
      ],
      locations: [
        { spec: "spec:E-99.owner", file: "E-90.sdp.md", entry: "rule[0]", line: 20 },
        { spec: "spec:E-99.owner", file: "E-90.sdp.md", entry: "design.E-15", line: 24 },
        { spec: "spec:E-99.owner", file: "E-90.sdp.md", entry: "question[0].links", line: 13 },
        {
          spec: "spec:E-99.owner",
          file: "E-90.sdp.md",
          entry: "relation.refines.spec:probe.second",
          line: 6,
        },
      ],
    };
    const before = JSON.stringify(graph);
    const result = await run(
      {
        register: {
          tokens: [
            { token: "E-10", retired: true, corpusColumn: "ignored" },
            "E-22",
            { token: "E-23", retired: true },
          ],
        },
        pattern: parameters.pattern,
        uncited: true,
        severity: "warning",
      },
      graph,
    );
    expect(JSON.stringify(graph)).toBe(before);
    expect(result.totals).toEqual({
      specs: 2,
      citations: 25,
      tokens: 21,
      unknown: 21,
      retired: 1,
      uncited: 1,
    });
    expect(result.tokens?.map((row) => row.token)).toEqual(
      Array.from({ length: 21 }, (_, index) => `E-${String(index + 1)}`).sort(),
    );
    expect(result.tokens?.find((row) => row.token === "E-1")).toEqual({
      token: "E-1",
      held: false,
      retired: false,
      citations: 4,
      specs: ["spec:E-99.owner", "spec:probe.second"],
    });
    expect(result.findings?.find((row) => row.relatedId === "E-1")).toEqual({
      validatorId: "unknown-token",
      subjectId: "spec:E-99.owner",
      relatedId: "E-1",
      severity: "warning",
      message: "spec:E-99.owner cites E-1, which the register does not list",
      file: "E-90.sdp.md",
      path: "title",
    });
    expect(result.findings?.find((row) => row.relatedId === "E-10")).toMatchObject({
      validatorId: "retired-token",
      path: "behavior.rules[0]",
      line: 20,
    });
    expect(result.findings?.find((row) => row.relatedId === "E-7")).toMatchObject({
      path: "intent.openQuestions[0].links[0]",
      line: 13,
    });
    expect(result.findings?.find((row) => row.relatedId === "E-16")).toMatchObject({
      path: "design.E-15.nested",
    });
    expect(result.findings?.find((row) => row.relatedId === "E-16")).not.toHaveProperty("line");
    expect(result.findings?.find((row) => row.relatedId === "E-21")).toMatchObject({
      path: "relation.refines.spec:probe.second",
      line: 6,
    });
    expect(result.findings?.at(-1)).toEqual({
      validatorId: "uncited-token",
      subjectId: "E-22",
      severity: "warning",
      message: "E-22 is held by the register and no Spec cites it",
    });
    expect((await run({ ...parameters, uncited: false })).findings).toEqual([]);
  });
  it("orders uncited findings by the register and never reports retired uncited tokens", async () => {
    expect(
      (
        await run({
          register: { tokens: ["E-9", "E-1", { token: "E-3", retired: true }] },
          pattern: parameters.pattern,
          uncited: true,
        })
      ).findings?.map((row) => row.subjectId),
    ).toEqual(["E-9", "E-1"]);
  });
  it("orders cited findings by Spec id and then token in code-unit order", async () => {
    const result = await run(parameters, {
      schemaVersion,
      edges: [],
      nodes: ["z", "a"].map((suffix) => ({
        id: `spec:probe.${suffix}`,
        nodeType: "Primitive",
        claim: "declared",
        specKind: "behavior",
        altitude: "story",
        readiness: "idea",
        title: "E-9 E-10 E-2",
        file: `${suffix}.sdp.md`,
      })),
    });
    expect(result.findings?.map((row) => [row.subjectId, row.relatedId])).toEqual([
      ["spec:probe.a", "E-10"],
      ["spec:probe.a", "E-2"],
      ["spec:probe.a", "E-9"],
      ["spec:probe.z", "E-10"],
      ["spec:probe.z", "E-2"],
      ["spec:probe.z", "E-9"],
    ]);
  });
  it("defaults token objects to held and keeps held and retired rows distinct", async () => {
    const result = await run(
      {
        register: { tokens: [{ token: "E-1" }, { token: "E-2", retired: true }, "E-3"] },
        pattern: parameters.pattern,
      },
      {
        schemaVersion,
        edges: [],
        nodes: [
          {
            id: "spec:probe.tokens",
            nodeType: "Primitive",
            claim: "declared",
            specKind: "behavior",
            altitude: "story",
            readiness: "idea",
            title: "E-1 E-2 E-3 E-4",
            file: "tokens.sdp.md",
          },
        ],
      },
    );
    expect(result.diagnostics).toBeUndefined();
    expect(result.tokens?.map(({ token, held, retired }) => ({ token, held, retired }))).toEqual([
      { token: "E-1", held: true, retired: false },
      { token: "E-2", held: false, retired: true },
      { token: "E-3", held: true, retired: false },
      { token: "E-4", held: false, retired: false },
    ]);
  });
  it("reports lines only for located top-level Design and UI text and keys", async () => {
    const result = await run(parameters, {
      schemaVersion,
      edges: [],
      nodes: [
        {
          id: "spec:probe.nested",
          nodeType: "Primitive",
          claim: "declared",
          specKind: "behavior",
          altitude: "story",
          readiness: "idea",
          title: "Probe",
          file: "nested.sdp.md",
          sections: {
            design: { top: "E-2", object: { "E-3": "E-4" }, array: ["E-5"] },
            ui: { top: "E-6", object: { "E-7": "E-8" }, array: ["E-9"] },
          },
        },
      ],
      locations: [
        ...["design", "ui"].flatMap((section) =>
          ["top", "object", "array"].map((key) => ({
            spec: "spec:probe.nested",
            file: "nested.sdp.md",
            entry: `${section}.${key}`,
            line: 24,
          })),
        ),
      ],
    });
    for (const finding of result.findings ?? []) {
      if (["E-2", "E-6"].includes(String(finding.relatedId))) expect(finding.line).toBe(24);
      else expect(finding).not.toHaveProperty("line");
    }
    expect(result.findings).toHaveLength(8);
  });
  it("reports one diagnostic when a pattern matches empty only inside text", async () => {
    const result = await run(
      { register: { tokens: [] }, pattern: "(?=E)" },
      {
        schemaVersion,
        edges: [],
        nodes: [
          {
            id: "spec:probe.empty",
            nodeType: "Primitive",
            claim: "declared",
            specKind: "behavior",
            altitude: "story",
            readiness: "idea",
            title: "E E E",
            narrative: "E E",
            file: "empty.sdp.md",
          },
        ],
      },
    );
    expect(result).toEqual({
      diagnostics: [{ parameter: "pattern", problem: "must not match the empty string" }],
    });
  });
  it("gives the external-register task a catalog on-ramp", () => {
    const section = catalog.split("## 50. External registers\n")[1]?.split("```js")[0];
    expect(section).toContain("*When you need this:*");
  });
});
