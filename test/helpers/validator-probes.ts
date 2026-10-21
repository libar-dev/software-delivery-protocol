import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { GraphEdge, GraphNode, GraphSchema, PrimitiveNode } from "../../src/graph/schema.js";
import { schemaVersion } from "../../src/graph/schema.js";
import { graphValidatorIds } from "../../src/validate/validators.js";
import { extractFindingIds } from "../../src/extract/reify.js";
import { activeValidatorFixtures } from "../fixtures/graph-validator.fixtures.js";
import { deriveFixtureGraph } from "./fixture-graph.js";
import type { Probe, ProbeEntry } from "./validator-audit.js";

function primitive(id = "spec:probe.subject", extra: Partial<PrimitiveNode> = {}): PrimitiveNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    title: "Probe",
    file: "probe.sdp.md",
    sections: {
      intent: { outcome: "Exercise a check." },
      behavior: { rules: ["Keep the probe local."] },
    },
    ...extra,
  };
}
function graph(nodes: GraphNode[], edges: GraphEdge[] = []): Probe {
  return { graph: { schemaVersion, nodes, edges } };
}
const subject = primitive();
const target = primitive("spec:probe.target", {
  sections: {
    intent: { outcome: "Keep the near-miss target lawful." },
    behavior: { rules: ["Keep a keyed rule."], ruleKeys: { known: "rules[0]" } },
  },
});
function relation(
  type: GraphEdge["type"],
  to = target.id,
  extra: Partial<GraphEdge> = {},
): GraphEdge {
  return { from: subject.id, type, to, claim: "declared", ...extra };
}
function graphPair(id: string, refusing: Probe, accepting: Probe): ProbeEntry {
  return { id, refusing, accepting };
}
const testAnchor: GraphNode = {
  id: "test:probe.bound",
  nodeType: "Anchor",
  claim: "anchored",
  file: "test.ts",
  line: 1,
};
const code: GraphNode = {
  id: "impl:probe.unit",
  nodeType: "CodeNode",
  claim: "anchored",
  file: "unit.ts",
  line: 1,
};
const component: GraphNode = { ...code, id: "component:probe.domain" };
const enabled: GraphEdge = {
  from: testAnchor.id,
  type: "verifies",
  to: subject.id,
  claim: "anchored",
};

function fixture(name: string): GraphSchema {
  const entry = activeValidatorFixtures.find((f) => f.name === name);
  if (!entry) throw new Error(`Unknown validator fixture ${name}`);
  return deriveFixtureGraph(entry.model);
}
const duplicate = fixture("invalid-duplicate-id");
const authoringShape = fixture("invalid-hand-authored-delivery-fact-in-section");
const decisionA = primitive("spec:probe.old", { specKind: "decision" });
const decisionB = primitive("spec:probe.new", { specKind: "decision" });
const shaping = relation("decidedBy", decisionA.id);
const replacement: GraphEdge = {
  from: decisionB.id,
  type: "supersedes",
  to: decisionA.id,
  claim: "declared",
};
const example = primitive("spec:probe.example", { specKind: "example", readiness: "ready" });
const verifies: GraphEdge = {
  from: example.id,
  type: "verifies",
  to: subject.id,
  claim: "declared",
};
const oracle: GraphNode = { ...testAnchor, id: "oracle:probe.expected" };
const model: GraphEdge = { from: oracle.id, type: "models", to: subject.id, claim: "anchored" };
const pack: GraphNode = {
  id: "pack:probe.members",
  nodeType: "Pack",
  claim: "declared",
  title: "Probe",
  file: "probe.pack.sdp.md",
  members: [subject.id],
};
const ready = primitive(subject.id, { readiness: "ready" });

const graphPairs: ProbeEntry[] = [
  graphPair(
    graphValidatorIds.referentialIntegrity,
    graph([subject, target], [relation("dependsOn", "spec:probe.absent")]),
    graph([subject, target], [relation("dependsOn")]),
  ),
  graphPair(
    graphValidatorIds.duplicateIds,
    { graph: duplicate },
    {
      graph: {
        ...duplicate,
        nodes: duplicate.nodes.map((n, i) => (i === 1 ? { ...n, id: "spec:orders.distinct" } : n)),
      },
    },
  ),
  graphPair(
    graphValidatorIds.claimSeparation,
    graph([{ ...subject, claim: "inferred" }]),
    graph([subject]),
  ),
  graphPair(
    graphValidatorIds.structuralAnchors,
    graph([code, component], [{ from: code.id, type: "uses", to: code.id, claim: "anchored" }]),
    graph(
      [code, component],
      [{ from: code.id, type: "uses", to: component.id, claim: "anchored" }],
    ),
  ),
  graphPair(
    graphValidatorIds.verifiesLinkage,
    graph([subject, example, testAnchor], [verifies]),
    graph([subject, example, testAnchor], [verifies, { ...enabled, to: example.id }]),
  ),
  graphPair(
    graphValidatorIds.oracleLinkage,
    graph([subject, oracle], [model]),
    graph(
      [
        primitive(subject.id, {
          sections: {
            ...subject.sections,
            behavior: {
              ...subject.sections?.behavior,
              exampleSpace: {
                given: ["a value {n:number}"],
                when: ["it runs"],
                then: ["it returns {n:number}"],
              },
            },
          },
        }),
        oracle,
      ],
      [model],
    ),
  ),
  graphPair(
    graphValidatorIds.packCoherence,
    graph([subject, pack]),
    graph([subject, pack], [relation("belongsTo", pack.id)]),
  ),
  graphPair(
    graphValidatorIds.orphans,
    graph([subject, target]),
    graph([subject, target], [relation("dependsOn")]),
  ),
  graphPair(
    graphValidatorIds.proseMentions,
    graph(
      [primitive(subject.id, { narrative: "See spec:probe.absent." }), target],
      [relation("dependsOn")],
    ),
    graph(
      [primitive(subject.id, { narrative: "See spec:probe.target." }), target],
      [relation("dependsOn")],
    ),
  ),
  graphPair(
    graphValidatorIds.ruleExercises,
    graph([subject, target], [relation("verifies", target.id, { exercises: ["unknown"] })]),
    graph([subject, target], [relation("verifies", target.id, { exercises: ["known"] })]),
  ),
  graphPair(
    graphValidatorIds.authoringShape,
    { graph: authoringShape },
    {
      graph: {
        ...authoringShape,
        nodes: authoringShape.nodes.map((n) =>
          n.nodeType === "Primitive"
            ? {
                ...n,
                sections: { ...n.sections, behavior: { rules: n.sections?.behavior?.rules } },
              }
            : n,
        ),
      },
    },
  ),
  graphPair(
    graphValidatorIds.deliveryFacts,
    graph([{ ...subject, deliveryFacts: ["implemented"] }]),
    graph([{ ...subject, deliveryFacts: [] }]),
  ),
  graphPair(
    graphValidatorIds.readinessFloor,
    graph(
      [
        primitive(subject.id, {
          readiness: "defined",
          sections: { ...subject.sections, behavior: undefined },
        }),
        target,
      ],
      [relation("dependsOn")],
    ),
    graph([primitive(subject.id, { readiness: "defined" }), target], [relation("dependsOn")]),
  ),
  graphPair(
    graphValidatorIds.gaps,
    graph([ready, testAnchor]),
    graph([ready, testAnchor], [enabled]),
  ),
  graphPair(
    graphValidatorIds.supersededDecisions,
    graph([subject, decisionA, decisionB], [shaping, replacement]),
    graph([subject, decisionA, decisionB], [shaping, { ...replacement, type: "refines" }]),
  ),
];

function corpus(path: string): string {
  return readFileSync(fileURLToPath(new URL(`../fixtures/${path}.txt`, import.meta.url)), "utf8");
}
function carriers(text: string, file = "probe.sdp.ts"): Probe {
  return { carriers: { [file]: text } };
}
function carrierPair(
  id: string,
  text: string,
  from: string,
  to: string,
  file = "probe.sdp.ts",
): ProbeEntry {
  if (!text.includes(from)) throw new Error(`Probe replacement absent for ${id}`);
  return { id, refusing: carriers(text, file), accepting: carriers(text.replace(from, to), file) };
}
const tsSpec = corpus("extract/invalid-malformed-id/malformed-id.sdp.ts");
const healthy = tsSpec.replace('specId("spec:")', 'specId("spec:probe.healthy")');
const syntax = corpus("gherkin/parent-child/basic.sdp.gherkin");
const gherkinHeader = "@spec.probe.parent @altitude.story @readiness.idea\nFeature: Probe\n";
const badTags = (n: number): string =>
  Array.from({ length: n }, () => "@readines.ready").join(" ") + "\n" + gherkinHeader;
const markdown =
  "---\nid: spec:probe.markdown\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Probe\n\n## Intent\n- outcome: Extract a Markdown probe.\n";
const extractionPairs: ProbeEntry[] = [
  carrierPair(
    extractFindingIds.parseError,
    healthy.replace("export const", "export const ="),
    "export const =",
    "export const",
  ),
  carrierPair(
    extractFindingIds.nonStaticEnvelope,
    corpus("extract/invalid-non-static-id/non-static-id.sdp.ts"),
    '`spec:orders.${"non-static"}`',
    '"spec:orders.non-static"',
  ),
  carrierPair(
    extractFindingIds.invalidId,
    tsSpec,
    'specId("spec:")',
    'specId("spec:probe.healthy")',
  ),
  {
    id: extractFindingIds.duplicateId,
    refusing: { carriers: { "a.sdp.ts": healthy, "b.sdp.ts": healthy } },
    accepting: {
      carriers: {
        "a.sdp.ts": healthy,
        "b.sdp.ts": healthy.replace(
          'specId("spec:probe.healthy")',
          'specId("spec:probe.distinct")',
        ),
      },
    },
  },
  carrierPair(
    extractFindingIds.reservedProperty,
    corpus("extract/invalid-reserved-property/reserved-property.sdp.ts"),
    'deliveryFacts: ["implemented"],',
    "",
  ),
  carrierPair(
    extractFindingIds.nonStaticSection,
    corpus("extract/invalid-non-static-section/non-static-section.sdp.ts"),
    '["Computed", "at runtime."].join(" ")',
    '"Computed at runtime."',
  ),
  carrierPair(
    extractFindingIds.unownedProse,
    healthy.replace('title: "', 'description: "Unowned prose",\n  title: "'),
    'description: "Unowned prose",',
    "",
  ),
  carrierPair(
    extractFindingIds.unrecognizedStatement,
    corpus("extract/unrecognized-statement/unrecognized-statement.sdp.ts"),
    'export function strayHelper(): string {\n  return "outside the authored grammar";\n}',
    "",
  ),
  carrierPair(
    extractFindingIds.unrecognizedProperty,
    corpus("extract/unrecognized-property/typoed-section.sdp.ts"),
    "behaviour:",
    "behavior:",
  ),
  carrierPair(
    extractFindingIds.misplacedAuthoring,
    `import { codeAnchor, codeAnchorId } from "@libar-dev/software-delivery-protocol";\nfunction bind() { const anchor = codeAnchor({ id: codeAnchorId("impl:probe.unit") }); }`,
    'function bind() { const anchor = codeAnchor({ id: codeAnchorId("impl:probe.unit") }); }',
    'const anchor = codeAnchor({ id: codeAnchorId("impl:probe.unit") });',
    "probe.ts",
  ),
  carrierPair(
    extractFindingIds.gherkinSyntax,
    syntax + "\nFeature: Another\n",
    "\nFeature: Another\n",
    "",
    "probe.sdp.gherkin",
  ),
  carrierPair(
    extractFindingIds.gherkinGrammar,
    syntax.replace("@spec.fixture.gherkin-parent", "@readines.ready\n@spec.fixture.gherkin-parent"),
    "@readines.ready\n",
    "",
    "probe.sdp.gherkin",
  ),
  {
    id: extractFindingIds.tooManyGherkinFindings,
    refusing: carriers(badTags(100), "probe.sdp.gherkin"),
    accepting: carriers(badTags(99), "probe.sdp.gherkin"),
  },
  carrierPair(
    extractFindingIds.invalidFrontmatter,
    markdown.replace("kind: behavior", "kind: [behavior"),
    "kind: [behavior",
    "kind: behavior",
    "probe.sdp.md",
  ),
  carrierPair(
    extractFindingIds.unrecognizedHeading,
    markdown + "\n## Foreign\n",
    "## Foreign",
    "## Behavior",
    "probe.sdp.md",
  ),
  carrierPair(
    extractFindingIds.invalidMarkdownStructure,
    markdown + "\n## Behavior\n- rule: Works.\n  Wrapped text\n",
    "\n  Wrapped text",
    "",
    "probe.sdp.md",
  ),
];

// Add a new finding id as one graphPair(...) or carrierPair(...) row. The closed audit checks it against both registries.
export const validatorProbeTable: readonly ProbeEntry[] = [...graphPairs, ...extractionPairs];
