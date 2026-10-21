import { Script } from "node:vm";
import { compileBody } from "../../src/cli/q-command.js";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import ts from "typescript";
import { afterEach, expect } from "vitest";
import { extract, generateContracts, validateGraph, createReader } from "../../src/index.js";
import type { ExtractionResult, GraphSchema } from "../../src/index.js";
import { emitMarkdownSpec } from "../../src/import/emit-markdown.js";
import type { ReifiedSpec } from "../../src/extract/reify.js";
import { reifySourceFile } from "../../src/extract/reify.js";
import { Project } from "ts-morph";
import { planExample, runExamplePlan } from "../../src/runner/index.js";
import type { ExampleContract, ParamShape } from "../../src/runner/index.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function root(): string {
  const value = mkdtempSync(join(tmpdir(), "sdp-keys-"));
  roots.push(value);
  return value;
}
function markdown(id: string, kind: string, body: string, parent?: string): string {
  return `---\nid: ${id}\nkind: ${kind}\naltitude: story\nreadiness: scoped\nrelations: ${parent ? `\n  refines: ${parent}\n  verifies: ${parent}` : "{}"}\n---\n# Probe\n\n## Intent\n- outcome: Probe keys.\n\n${body}\n`;
}
function typeScript(id: string, kind: string, sections: object, parent?: string): string {
  return `import { spec, specId, ref, refines, verifies } from "@libar-dev/software-delivery-protocol";\nexport const subject = spec({ id: specId(${JSON.stringify(id)}), title: "Probe", kind: ${JSON.stringify(kind)}, altitude: "story", readiness: "scoped", intent: { outcome: "Probe keys." }, relations: [${parent ? `refines(ref(${JSON.stringify(parent)})), verifies(ref(${JSON.stringify(parent)}))` : ""}], ...SECTIONS });`.replace(
    ", ...SECTIONS",
    `, ${JSON.stringify(sections).slice(1, -1)}`,
  );
}
function reifiedTs(source: string): readonly ReifiedSpec[] {
  const project = new Project({ useInMemoryFileSystem: true });
  return reifySourceFile(project.createSourceFile("subject.sdp.ts", source), "subject.sdp.ts")
    .specs;
}
function primitive(graph: GraphSchema, id: string) {
  return graph.nodes.find((n) => n.nodeType === "Primitive" && n.id === id);
}
const recipeBodies = new Map(
  [
    ...readFileSync(resolve("docs/agent-surface/recipes.md"), "utf8").matchAll(
      /^## (\d+)\.[\s\S]*?\n```js\n([\s\S]*?)\n```/gm,
    ),
  ].map((m) => [Number(m[1]), m[2] ?? ""]),
);
async function recipe(number: number, graph: GraphSchema, params: object): Promise<unknown> {
  const body = recipeBodies.get(number);
  if (!body) throw new Error(`Missing recipe ${String(number)}`);
  return compileBody(body)(createReader(graph), graph, validateGraph(graph), params);
}

interface World {
  root: string;
  extractMessage: string;
  answer: Record<string, unknown>;
}
interface StepPoint {
  carrier?: string;
  vocabulary?: string;
  example?: string;
  before?: string;
  after?: string;
}
export interface StepWorld extends World {
  point: Partial<StepPoint>;
  sources: Map<string, string>;
  first?: ExtractionResult;
  second?: ExtractionResult;
  contract?: string;
  secondContract?: string;
}
function steps(given: string, vocabulary: boolean) {
  return {
    given: given.split("; "),
    when: ["the probe runs"],
    then: [
      vocabulary ? "the probe ends with {result:string}" : 'the probe ends with {result: "done"}',
    ],
  };
}
function fence(given: string, vocabulary: boolean) {
  const value = steps(given, vocabulary);
  return `${vocabulary ? "## Example space\n```gwt-vocabulary" : "```gwt"}\n${value.given.map((t) => `Given ${t}`).join("\n")}\nWhen ${value.when[0] ?? ""}\nThen ${value.then[0] ?? ""}\n\`\`\``;
}
export function createStepWorld(point: Partial<StepPoint>): StepWorld {
  const sources = new Map<string, string>();
  if (point.carrier === "TypeScript") {
    sources.set(
      "parent.sdp.ts",
      typeScript("spec:probe.parent", "behavior", {
        behavior: {
          rules: ["The probe states one rule."],
          exampleSpace: steps(point.vocabulary ?? "", true),
        },
      }),
    );
    sources.set(
      "child.sdp.ts",
      typeScript(
        "spec:probe.child",
        "example",
        { behavior: { examples: [steps(point.example ?? "", false)] } },
        "spec:probe.parent",
      ),
    );
  } else if (point.carrier === "Gherkin") {
    const lines = (given: string, vocab: boolean) =>
      fence(given, vocab)
        .split("\n")
        .filter((l) => /^(Given|When|Then)/.test(l))
        .map((l) => `    ${l}`)
        .join("\n");
    sources.set(
      "probe.sdp.gherkin",
      `@spec.probe.parent @altitude.story @readiness.scoped\nFeature: Probe\n  - outcome: Probe keys.\n\n  @example-space\n  Scenario: Vocabulary\n${lines(point.vocabulary ?? "", true)}\n\n  @spec.probe.child @altitude.story @readiness.scoped\n  Scenario: Child\n${lines(point.example ?? "", false)}\n\n  Rule: The probe states one rule.\n`,
    );
  } else {
    sources.set(
      "parent.sdp.md",
      markdown(
        "spec:probe.parent",
        "behavior",
        `## Behavior\n- rule: The probe states one rule.\n\n${fence(point.vocabulary ?? "", true)}`,
      ),
    );
    sources.set(
      "child.sdp.md",
      markdown(
        "spec:probe.child",
        "example",
        fence(point.example ?? "", false),
        "spec:probe.parent",
      ),
    );
  }
  return { root: root(), point, sources, extractMessage: "", answer: {} };
}
function contractValue(source: string): ExampleContract<string, Record<string, ParamShape>> {
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports: Record<string, unknown> = {};
  new Script(js).runInNewContext({ exports });
  return Object.values(exports)[0] as ExampleContract<string, Record<string, ParamShape>>;
}
const compileOptions: ts.CompilerOptions = {
  noEmit: true,
  strict: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
  types: ["node"],
  baseUrl: resolve("."),
  paths: {
    "@libar-dev/software-delivery-protocol/runner": ["src/runner/index.ts"],
    "@libar-dev/software-delivery-protocol/vitest": ["src/adapters/vitest.ts"],
  },
};
function bindingSource(source: string): string {
  const declaration = /export const (\w+)Contract/.exec(source)?.[1];
  if (declaration === undefined) throw new Error("Missing contract declaration");
  const types = /export type StepParams = \{([\s\S]*?)\n\};/.exec(source)?.[1] ?? "";
  const bindings = types
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => {
      const m = /readonly ("(?:[^"\\]|\\.)*"): (.*);$/.exec(l.trim());
      if (m?.[1] === undefined || m[2] === undefined)
        throw new Error(`Cannot read generated params: ${l}`);
      return `${m[1]}: (world: string[], params: ${m[2]}) => { world.push(${m[1]}); void params; }`;
    });
  return `import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";\nimport { ${declaration}Contract as contract } from "./second.js";\nexport const bindings = { ${bindings.join(",\n")} };\nbindExample(contract, () => [] as string[], bindings);`;
}
export function bindingTypechecks(first: string, second: string, folder = root()): boolean {
  writeFileSync(join(folder, "second.ts"), second);
  writeFileSync(join(folder, "binding.ts"), bindingSource(first));
  const program = ts.createProgram([join(folder, "binding.ts")], compileOptions);
  return ts.getPreEmitDiagnostics(program).length === 0;
}

export async function invokeStep(world: StepWorld): Promise<void> {
  for (const [file, source] of world.sources) writeFileSync(join(world.root, file), source);
  const first = extract({ root: world.root });
  world.first = first;
  const generated = generateContracts(first.graph);
  world.extractMessage = first.report.findings[0]?.message ?? "";
  world.answer.contractFinding =
    generated.findings.find((f) => f.subjectId === "spec:probe.child")?.validatorId ?? "";
  world.answer.stillBound = false;
  world.contract = generated.files.get("probe.child.contract.ts");
  for (const [file, source] of world.sources) {
    const reworded = source.replaceAll(world.point.before ?? "", world.point.after ?? "");
    world.sources.set(file, reworded);
    writeFileSync(join(world.root, file), reworded);
  }
  const second = extract({ root: world.root });
  world.second = second;
  world.secondContract = generateContracts(second.graph).files.get("probe.child.contract.ts");
  world.answer.bindingKey = world.contract
    ? (contractValue(world.contract).steps[0]?.key ?? "")
    : "";
  world.answer.rewordedBindingKey = world.secondContract
    ? (contractValue(world.secondContract).steps[0]?.key ?? "")
    : "";
  if (world.contract && world.secondContract) {
    const typechecks = bindingTypechecks(world.contract, world.secondContract, world.root);
    world.answer.stillBound = typechecks;
    if (typechecks) {
      const firstContract = contractValue(world.contract);
      const secondContract = contractValue(world.secondContract);
      const hits: string[] = [];
      const exports: { bindings?: Record<string, (world: string[], params: ParamShape) => void> } =
        {};
      const compiled = ts.transpileModule(bindingSource(world.contract), {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      }).outputText;
      new Script(compiled).runInNewContext({
        require: (name: string) =>
          name === "./second.js"
            ? { childContract: secondContract }
            : { bindExample: () => undefined },
        exports,
      });
      const bindings = exports.bindings;
      if (!bindings) throw new Error("Binding source must export its authored handlers");
      await runExamplePlan(planExample(secondContract, bindings), hits);
      expect(hits).toEqual(firstContract.steps.map((step) => step.key));
    }
  }
  if (world.point.carrier === "TypeScript") {
    const importedRoot = root();
    const data: unknown[] = [];
    const imported: unknown[] = [];
    for (const [file, source] of world.sources)
      for (const spec of reifiedTs(source)) {
        const md = emitMarkdownSpec(spec);
        writeFileSync(join(importedRoot, file.replace(/\.ts$/, ".md")), md);
        data.push([spec.id, spec.data.behavior]);
        if (file.startsWith("parent"))
          world.answer.importedStep = md.split("\n").find((l) => l.startsWith("Given "));
      }
    for (const node of extract({ root: importedRoot }).graph.nodes)
      if (node.nodeType === "Primitive") imported.push([node.id, node.sections?.behavior]);
    world.answer.keptOnImport = isDeepStrictEqual(data.sort(), imported.sort());
  }
}
export function assertStepWorld(world: StepWorld): void {
  if (world.extractMessage)
    expect(world.first?.report.findings[0]).toMatchObject({
      validatorId: "extract/unrecognized-property",
      severity: "error",
    });
}

interface TermPoint {
  carrier?: string;
  specId?: string;
  terms?: string;
  address?: string;
}
export interface TermWorld extends World {
  point: Partial<TermPoint>;
  result?: ExtractionResult;
}
export function createTermWorld(point: Partial<TermPoint>): TermWorld {
  const value: TermWorld = { root: root(), point, extractMessage: "", answer: {} };
  const terms = Object.fromEntries(
    (point.terms ?? "").split("; ").map((l) => {
      const m = /^- \*\*(.*?)\*\* — (.*)$/.exec(l);
      return [m?.[1] ?? "", m?.[2] ?? ""];
    }),
  );
  const source =
    point.carrier === "TypeScript"
      ? typeScript(point.specId ?? "", "model", { model: { terms } })
      : markdown(
          point.specId ?? "",
          "model",
          `## Model\n${(point.terms ?? "").split("; ").join("\n")}`,
        );
  writeFileSync(
    join(value.root, point.carrier === "TypeScript" ? "subject.sdp.ts" : "subject.sdp.md"),
    source,
  );
  writeFileSync(
    join(value.root, "mention.sdp.md"),
    markdown("spec:probe.mention", "rule", "## Rule\n- The probe states one rule.")
      .replace("relations: {}", `relations:\n  dependsOn: ${point.specId ?? ""}`)
      .replace("# Probe", `# Probe\n\nThe probe cites ${point.address ?? ""}.`),
  );
  return value;
}
export async function invokeTerm(world: TermWorld): Promise<void> {
  const result = extract({ root: world.root });
  world.result = result;
  world.extractMessage = result.report.findings[0]?.message ?? "";
  const subject = primitive(result.graph, world.point.specId ?? "");
  const model = subject?.nodeType === "Primitive" ? subject.sections?.model : undefined;
  const keys = model?.termKeys ?? {};
  world.answer.reified = !!subject;
  world.answer.keys = Object.keys(keys).join(", ");
  world.answer.mentionErrors = validateGraph(result.graph).findings.filter(
    (f) => f.validatorId === "conformance/prose-mentions" && f.severity === "error",
  ).length;
  const resolution = (await recipe(25, result.graph, { addresses: [world.point.address] })) as {
    rows: { resolves: boolean; value: unknown; file: string; line: number }[];
  };
  const row = resolution.rows[0];
  const key = (world.point.address ?? "").split("#term.")[1] ?? "";
  const term = keys[key];
  const location = result.graph.locations?.find(
    (l) => l.spec === world.point.specId && l.key === key && l.entry.startsWith("term["),
  );
  world.answer.resolved =
    row?.resolves === true &&
    row.value === model?.terms?.[term ?? ""] &&
    row.file === location?.file &&
    row.line === location.line;
  if (term) {
    const search = (await recipe(23, result.graph, { term })) as {
      matches: { address: string; line: number }[];
    };
    world.answer.found = search.matches.some(
      (r) => r.address === world.point.address && r.line === location?.line,
    );
  } else world.answer.found = false;
  const audit = (await recipe(22, result.graph, { scope: ["spec:probe.mention"] })) as {
    unresolved: { to: string; reason: string }[];
  };
  world.answer.auditReason =
    audit.unresolved.find((r) => r.to === world.point.address)?.reason ?? "";
  if (world.point.carrier === "TypeScript") {
    const specs = reifiedTs(readFileSync(join(world.root, "subject.sdp.ts"), "utf8"));
    const spec = specs[0];
    if (!spec) throw new Error("No imported Spec");
    const md = emitMarkdownSpec(spec);
    const importedRoot = root();
    writeFileSync(join(importedRoot, "subject.sdp.md"), md);
    world.answer.importedEntry = md.split("\n").find((l) => l.startsWith("- **"));
    const imported = primitive(extract({ root: importedRoot }).graph, world.point.specId ?? "");
    world.answer.keptOnImport =
      JSON.stringify(model) ===
      JSON.stringify(imported?.nodeType === "Primitive" ? imported.sections?.model : undefined);
  }
}
export function assertTermWorld(world: TermWorld): void {
  if (world.extractMessage)
    expect(world.result?.report.findings[0]?.path).toMatch(/^model\.terms\./);
  if (world.extractMessage)
    expect(world.result?.report.findings[0]).toMatchObject({
      validatorId: "extract/unrecognized-property",
      severity: "error",
    });
}
