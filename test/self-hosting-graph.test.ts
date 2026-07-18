import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { extract, validateGraph } from "../src/index.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const expectedSpecs = [
  {
    id: "spec:carrier.markdown-authoring",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/markdown-authoring.sdp.md",
    title: "Markdown authoring enters the one graph",
    narrative: null,
    sections: {
      intent: {
        outcome: "Author new Protocol Specs in Markdown without creating a second truth path.",
      },
      behavior: {
        rules: [
          "Markdown and TypeScript carriers feed the same reification and graph-derivation path.",
        ],
      },
    },
    deliveryFacts: ["implemented"],
  },
  {
    id: "spec:carrier.envelope-contract",
    specKind: "contract",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/envelope-contract.sdp.md",
    title: "The Markdown envelope is explicit and bounded",
    narrative: null,
    sections: {
      intent: {
        outcome: "Make a Markdown Spec's identity and descriptors deterministic to reify.",
      },
      behavior: {
        rules: [
          "A Markdown Spec declares id, kind, altitude, readiness, and relations in bounded YAML frontmatter; its first H1 declares title.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.markdown-parser",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/markdown-parser.sdp.md",
    title: "The product parser reifies the ruled Markdown subset",
    narrative: null,
    sections: {
      intent: {
        problem: "Prevent carrier-specific graph and validation paths from diverging.",
        outcome: "Reify authored Markdown without a second graph or validation path.",
        value: "Markdown-carried intent remains subject to the Protocol's deterministic checks.",
      },
      behavior: {
        rules: [
          "The parser accepts only the ruled heading grammar and excludes one malformed carrier while continuing healthy siblings.",
          "The ruled Markdown parser has a bounded refusal-parity claim with the TypeScript carrier for `extract/non-static-envelope`, `extract/invalid-id`, `extract/duplicate-id`, `extract/reserved-property`, `extract/unowned-prose`, and `extract/unrecognized-property`.",
          "Named non-claim — `extract/parse-error` remains distinct because YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.",
          "Named non-claim — `extract/non-static-section` remains distinct because TypeScript degrades optional section properties while Markdown refuses malformed documents whole.",
          "Named non-claim — `extract/unrecognized-statement` remains distinct because Markdown owns prose and structures, not TypeScript statement recognition.",
          "Named non-claim — `extract/misplaced-authoring` remains distinct because Markdown has no executable authoring-call surface.",
        ],
      },
      verification: {
        mode: "executable",
        criteria: [
          "`test/extract-parity.test.ts` executes the settled refusal-parity matrix, including the six same-class findings and four named non-claims.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:carrier.sdp-import",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/carrier/sdp-import.sdp.md",
    title: "TypeScript-carried Specs can become Markdown twins",
    narrative: null,
    sections: {
      intent: {
        actor: "A coding agent or maintainer.",
        outcome:
          "Convert a TypeScript-carrier Spec into an idiomatic `.sdp.md` twin beside its source.",
        value:
          "The TypeScript DSL survives as an import source while Markdown becomes the authored twin.",
      },
      behavior: {
        rules: [
          "Import writes the emitted Markdown sibling beside the TypeScript carrier and never deletes the source carrier.",
          "Import refuses an existing Markdown sibling rather than overwriting it.",
          "Refusal outcomes retain the TypeScript reifier findings and add import-local findings honestly.",
          "Import consumes the TypeScript reifier so source acceptance follows one validation path.",
        ],
        exampleSpace: {
          given: ["a TS-carrier spec"],
          when: ["importTypeScriptSpec runs"],
          [["t", "hen"].join("")]: ["the emitted Markdown re-parses to an equal graph"],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.sdp-import.round-trip",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/carrier/sdp-import.round-trip.sdp.md",
    title: "A TypeScript carrier survives import as an equal Markdown graph",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the import round-trip against a TypeScript-carrier fixture.",
      },
      behavior: {
        examples: [
          {
            given: ["a TS-carrier spec"],
            when: ["importTypeScriptSpec runs"],
            [["t", "hen"].join("")]: ["the emitted Markdown re-parses to an equal graph"],
          },
        ],
      },
      verification: {
        mode: "executable",
        criteria: [
          "The bound test runs `assertAuthoredRoundTrip` against the import behavior fixture.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:carrier.prose-ownership-rule",
    specKind: "rule",
    altitude: "story",
    readiness: "defined",
    file: "specs/carrier/prose-ownership-rule.sdp.md",
    title: "Every prose edge has one owner",
    narrative: null,
    sections: {
      intent: { outcome: "Keep free prose in the graph without ambiguous attachment." },
      behavior: {
        rules: [
          "Narrative lives before the first H2; descriptions live only under their owning singular sections; unowned prose is refused.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:protocol.self-hosting",
    specKind: "behavior",
    altitude: "epic",
    readiness: "defined",
    file: "specs/protocol/self-hosting.sdp.md",
    title: "The Protocol authors and validates itself",
    narrative:
      "The Protocol's own delivery model exercises the same carrier, graph, checks, and projections offered to consumers.",
    sections: {
      intent: { outcome: "Prove the Protocol can carry its own intended truth honestly." },
      behavior: {
        rules: [
          "All authored carriers derive one regenerable graph through one validation path.",
          "Self-hosting remains deterministic in a clean clone.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:extraction.derive-graph",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/derive-graph.sdp.md",
    title: "Carrier reification derives the one graph",
    narrative: null,
    sections: {
      intent: { outcome: "Expose one carrier-neutral derivation seam." },
      behavior: {
        rules: ["Carrier reification feeds deriveGraph once; no consumer creates a second graph."],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:extraction.determinism",
    specKind: "constraint",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/determinism.sdp.md",
    title: "Committed source derives byte-identical output",
    narrative: null,
    sections: {
      intent: { outcome: "Make regeneration independent of location and prior generated state." },
      constraints: [
        {
          flavor: "quality",
          statement:
            "Two clean derivations of the same committed source produce byte-identical generated trees.",
          target: "sha256(tree@run1) == sha256(tree@run2)",
          measurableBy: "test/cli.test.ts clean-repo determinism",
        },
      ],
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:extraction.build-pipeline",
    specKind: "workflow",
    altitude: "feature",
    readiness: "defined",
    file: "specs/extraction/build-pipeline.sdp.md",
    title: "The build pipeline has one ordered flow",
    narrative: null,
    sections: {
      intent: { outcome: "Turn authored carriers into validated derived artifacts." },
      behavior: {
        rules: ["Every command uses the same extracted graph and validation seam."],
        flows: [
          "Discover carriers.",
          "Reify carriers.",
          "Derive the graph.",
          "Validate the graph.",
          "Emit derived artifacts.",
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.readiness-floor",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/readiness-floor.sdp.md",
    title: "Stated readiness must clear its floor",
    narrative: null,
    sections: {
      intent: { outcome: "Refuse maturity claims that their authored evidence does not support." },
      behavior: {
        rules: [
          "A Spec may state a readiness only when every clause in that readiness floor passes.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.sdp.md",
    title: "Duplicate carrier IDs are excluded loudly",
    narrative: null,
    sections: {
      intent: { outcome: "Prevent ambiguous authored identity from entering the graph." },
      behavior: {
        rules: [
          "If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.",
        ],
        exampleSpace: {
          given: [
            "a {firstCarrier:string} carrier declares {specId:string}",
            "a {secondCarrier:string} carrier declares {specId:string}",
          ],
          when: ["the extraction root is read"],
          [["t", "hen"].join("")]: [
            "both sites report {findingId:string}",
            "no graph node is emitted for {specId:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids.dual-carrier",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.dual-carrier.sdp.md",
    title: "TypeScript and Markdown duplicates are both refused",
    narrative: null,
    sections: {
      intent: { outcome: "Execute the duplicate-ID rule across both carrier surfaces." },
      behavior: {
        examples: [
          {
            given: [
              'a {firstCarrier: "TypeScript"} carrier declares {specId: "spec:fixture.duplicate"}',
              'a {secondCarrier: "Markdown"} carrier declares {specId: "spec:fixture.duplicate"}',
            ],
            when: ["the extraction root is read"],
            [["t", "hen"].join("")]: [
              'both sites report {findingId: "extract/duplicate-id"}',
              'no graph node is emitted for {specId: "spec:fixture.duplicate"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:model.protocol-domain",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/model/protocol-domain.sdp.md",
    title: "The Protocol domain uses one ratified language",
    narrative: null,
    sections: {
      intent: { outcome: "Give self-hosting specs the same core vocabulary." },
      model: {
        terms: {
          Pack: "A grouping and review aggregate that states no system truth.",
          Spec: "The one authored truth-primitive.",
          anchor: "An in-code identity binding that states no intent.",
          "delivery fact": "A machine-derived realization signal.",
        },
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.plain-language-references",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/plain-language-references.sdp.md",
    title: "Durable references lead with meaning",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep design rationale readable without decoding registries.",
      },
      decision: {
        context: "Decision codes are useful lookup keys but poor standalone prose.",
        decision:
          "Durable references lead with plain-language meaning; decision codes follow parenthetically when useful.",
        rationale: ["Meaning survives registry churn."],
        consequences: ["AGENTS and plans lead with names."],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:decisions.concept-docs-dissolve",
    specKind: "decision",
    altitude: "feature",
    readiness: "defined",
    file: "specs/decisions/concept-docs-dissolve.sdp.md",
    title: "Concept documents may dissolve after executable truth lands",
    narrative: null,
    sections: {
      intent: {
        outcome: "Keep intended truth authoritative while allowing exposition to shrink.",
      },
      decision: {
        context: "Concept documents currently carry both laws and unsettled representation.",
        decision:
          "Concept documents may dissolve only after their semantic contract is carried by executable Specs and lean registries.",
        rationale: ["Executable truth is easier to validate and consume."],
        consequences: ["Deletion is later work, never part of phase 1."],
      },
    },
    deliveryFacts: [],
  },
] as const;

const expectedPackMembers = [
  "spec:carrier.markdown-authoring",
  "spec:carrier.envelope-contract",
  "spec:carrier.markdown-parser",
  "spec:carrier.sdp-import",
  "spec:carrier.sdp-import.round-trip",
  "spec:carrier.prose-ownership-rule",
  "spec:protocol.self-hosting",
  "spec:extraction.derive-graph",
  "spec:extraction.determinism",
  "spec:extraction.build-pipeline",
  "spec:validation.readiness-floor",
  "spec:validation.duplicate-ids",
  "spec:model.protocol-domain",
  "spec:validation.duplicate-ids.dual-carrier",
  "spec:decisions.plain-language-references",
  "spec:decisions.concept-docs-dissolve",
] as const;

const expectedDeclaredRelations = [
  ["spec:carrier.markdown-authoring", "dependsOn", "spec:carrier.markdown-parser"],
  ["spec:carrier.envelope-contract", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.markdown-parser", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.markdown-parser", "dependsOn", "spec:carrier.envelope-contract"],
  ["spec:carrier.sdp-import", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.sdp-import.round-trip", "refines", "spec:carrier.sdp-import"],
  ["spec:carrier.sdp-import.round-trip", "verifies", "spec:carrier.sdp-import"],
  ["spec:carrier.prose-ownership-rule", "refines", "spec:carrier.markdown-authoring"],
  ["spec:protocol.self-hosting", "dependsOn", "spec:carrier.markdown-authoring"],
  ["spec:protocol.self-hosting", "dependsOn", "spec:model.protocol-domain"],
  ["spec:protocol.self-hosting", "decidedBy", "spec:decisions.concept-docs-dissolve"],
  ["spec:extraction.derive-graph", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.derive-graph", "constrainedBy", "spec:extraction.determinism"],
  ["spec:extraction.determinism", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.build-pipeline", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.build-pipeline", "dependsOn", "spec:extraction.derive-graph"],
  ["spec:validation.readiness-floor", "refines", "spec:protocol.self-hosting"],
  ["spec:validation.readiness-floor", "dependsOn", "spec:model.protocol-domain"],
  ["spec:validation.duplicate-ids", "refines", "spec:protocol.self-hosting"],
  ["spec:validation.duplicate-ids", "dependsOn", "spec:carrier.markdown-parser"],
  ["spec:validation.duplicate-ids.dual-carrier", "refines", "spec:validation.duplicate-ids"],
  ["spec:validation.duplicate-ids.dual-carrier", "verifies", "spec:validation.duplicate-ids"],
  ["spec:model.protocol-domain", "refines", "spec:protocol.self-hosting"],
  ["spec:decisions.plain-language-references", "refines", "spec:protocol.self-hosting"],
  ["spec:decisions.concept-docs-dissolve", "refines", "spec:protocol.self-hosting"],
] as const;

const expectedWarnings = [] as const;

const expectedAnchors = [
  {
    id: "impl:protocol.extract",
    nodeType: "CodeNode",
    label: "extracts authored carriers and bindings into one graph",
    type: "satisfies",
    target: "spec:extraction.derive-graph",
    file: "src/extract/index.ts",
    constant: "extractAnchor",
    site: "export function extract",
  },
  {
    id: "impl:protocol.derive-graph",
    nodeType: "CodeNode",
    label: "derives the graph from reified carriers and bindings",
    type: "satisfies",
    target: "spec:extraction.derive-graph",
    file: "src/extract/derive.ts",
    constant: "deriveGraphAnchor",
    site: "export function deriveGraph",
  },
  {
    id: "test:protocol.extract",
    nodeType: "Anchor",
    label: "extraction contracts verify graph derivation",
    type: "verifies",
    target: "spec:extraction.derive-graph",
    file: "test/extract.test.ts",
    constant: "extractContractTestAnchor",
    site: 'describe("anchor extraction corpora",',
  },
  {
    id: "test:protocol.extraction-determinism",
    nodeType: "Anchor",
    label: "clean-repo pipeline determinism verifies byte-identical output",
    type: "verifies",
    target: "spec:extraction.determinism",
    file: "test/cli.test.ts",
    constant: "cleanRepoDeterminismTestAnchor",
    site: 'it("clean-repo determinism: the full pipeline at a different absolute path is byte-identical"',
  },
  {
    id: "impl:protocol.readiness-floor",
    nodeType: "CodeNode",
    label: "evaluates the stated readiness floor against the graph",
    type: "satisfies",
    target: "spec:validation.readiness-floor",
    file: "src/validate/readiness-floor.ts",
    constant: "readinessFloorAnchor",
    site: "export function evaluateReadinessFloor",
  },
  {
    id: "test:protocol.readiness-floor",
    nodeType: "Anchor",
    label: "readiness-floor contracts verify stated maturity",
    type: "verifies",
    target: "spec:validation.readiness-floor",
    file: "test/readiness.test.ts",
    constant: "readinessFloorTestAnchor",
    site: 'describe("readiness and validation contracts",',
  },
  {
    id: "impl:protocol.markdown-authoring",
    nodeType: "CodeNode",
    label: "reifies Markdown authoring into the one carrier path",
    type: "satisfies",
    target: "spec:carrier.markdown-authoring",
    file: "src/extract/markdown.ts",
    constant: "markdownAuthoringAnchor",
    site: "export function reifyMarkdownCarrier",
  },
  {
    id: "impl:protocol.markdown-parser",
    nodeType: "CodeNode",
    label: "reifies the ruled Markdown parser input",
    type: "satisfies",
    target: "spec:carrier.markdown-parser",
    file: "src/extract/markdown.ts",
    constant: "markdownParserAnchor",
    site: "export function reifyMarkdownCarrier",
  },
  {
    id: "test:protocol.markdown-parser",
    nodeType: "Anchor",
    label: "Markdown reifier tests verify the ruled parser",
    type: "verifies",
    target: "spec:carrier.markdown-parser",
    file: "test/markdown-reifier.test.ts",
    constant: "markdownParserTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.envelope-contract",
    nodeType: "CodeNode",
    label: "parses the bounded Markdown frontmatter envelope",
    type: "satisfies",
    target: "spec:carrier.envelope-contract",
    file: "src/extract/markdown.ts",
    constant: "envelopeContractAnchor",
    site: "export function parseMarkdownFrontmatter",
  },
  {
    id: "test:protocol.envelope-contract",
    nodeType: "Anchor",
    label: "frontmatter contract tests verify the Markdown envelope",
    type: "verifies",
    target: "spec:carrier.envelope-contract",
    file: "test/markdown-reifier.test.ts",
    constant: "envelopeContractTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.prose-ownership",
    nodeType: "CodeNode",
    label: "reads Markdown body content through its prose owners",
    type: "satisfies",
    target: "spec:carrier.prose-ownership-rule",
    file: "src/extract/markdown.ts",
    constant: "proseOwnershipAnchor",
    site: "export function readMarkdownBody",
  },
  {
    id: "test:protocol.prose-ownership",
    nodeType: "Anchor",
    label: "Markdown reifier tests verify prose ownership",
    type: "verifies",
    target: "spec:carrier.prose-ownership-rule",
    file: "test/markdown-reifier.test.ts",
    constant: "proseOwnershipTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.duplicate-id-exclusion",
    nodeType: "CodeNode",
    label: "excludes duplicated carrier ids from the graph",
    type: "satisfies",
    target: "spec:validation.duplicate-ids",
    file: "src/extract/index.ts",
    constant: "duplicateIdExclusionAnchor",
    site: "function findDuplicatedIds",
  },
  {
    id: "test:protocol.duplicate-ids.dual-carrier",
    nodeType: "Anchor",
    label: "dual-carrier duplicate-ID contract verifies carrier exclusion",
    type: "verifies",
    target: "spec:validation.duplicate-ids.dual-carrier",
    file: "test/self-hosting-duplicate-ids.test.ts",
    constant: "dualCarrierDuplicateTestAnchor",
    site: "bindExample(",
  },
  {
    id: "test:protocol.sdp-import.round-trip",
    nodeType: "Anchor",
    label: "TypeScript import round-trip contract preserves authored data",
    type: "verifies",
    target: "spec:carrier.sdp-import.round-trip",
    file: "test/self-hosting-sdp-import.test.ts",
    constant: "sdpImportRoundTripTestAnchor",
    site: "bindExample(",
  },
] as const;

function lineContaining(source: string, token: string): number {
  const line = source.split("\n").findIndex((entry) => entry.includes(token));

  return line + 1;
}

describe("the self-hosting phase-1 carrier corpus", () => {
  it("derives the sixteen Markdown-canonical specs and their exact Pack checkpoint from the root", () => {
    // Given: the repository root with evidence and the worked example excluded from the authored model.
    const result = extract({
      root: repoRoot,
      exclude: ["explorations", "examples", "test/fixtures/import/parity"],
    });

    // When: the root corpus is reified through the public extractor.
    const nodeIds = result.graph.nodes.map((node) => node.id).sort();
    const primitiveNodes = result.graph.nodes.filter((node) => node.nodeType === "Primitive");
    const packNode = result.graph.nodes.find((node) => node.id === "pack:self-hosting-v1");

    // Then: the frozen corpus enters one graph with exact descriptors and its direct bindings.
    expect(result.report.findings).toEqual([]);
    expect(
      validateGraph(result.graph).findings.map(({ validatorId, family, severity, subjectId }) => ({
        validatorId,
        family,
        severity,
        subjectId,
      })),
    ).toEqual(expectedWarnings);
    expect(result.counts).toEqual({ specs: 16, packs: 1, anchors: 16 });
    expect(nodeIds).toEqual(
      [
        "pack:self-hosting-v1",
        "spec:carrier.envelope-contract",
        "spec:carrier.markdown-authoring",
        "spec:carrier.markdown-parser",
        "spec:carrier.prose-ownership-rule",
        "spec:carrier.sdp-import",
        "spec:carrier.sdp-import.round-trip",
        "spec:decisions.concept-docs-dissolve",
        "spec:decisions.plain-language-references",
        "spec:extraction.build-pipeline",
        "spec:extraction.derive-graph",
        "spec:extraction.determinism",
        "spec:model.protocol-domain",
        "spec:protocol.self-hosting",
        "spec:validation.duplicate-ids",
        "spec:validation.duplicate-ids.dual-carrier",
        "spec:validation.readiness-floor",
        ...expectedAnchors.map((anchor) => anchor.id),
      ].sort(),
    );
    expect(result.graph.nodes).toHaveLength(33);
    expect(
      primitiveNodes
        .map((node) => ({
          id: node.id,
          specKind: node.specKind,
          altitude: node.altitude,
          readiness: node.readiness,
          title: node.title,
          narrative: node.narrative ?? null,
          sections: node.sections,
          deliveryFacts: node.deliveryFacts ?? [],
          file: node.file,
        }))
        .sort((left, right) => left.id.localeCompare(right.id)),
    ).toEqual(
      [...expectedSpecs]
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((spec) => ({
          id: spec.id,
          specKind: spec.specKind,
          altitude: spec.altitude,
          readiness: spec.readiness,
          title: spec.title,
          narrative: spec.narrative,
          sections: spec.sections,
          deliveryFacts: spec.deliveryFacts,
          file: spec.file,
        })),
    );
    expect(
      result.graph.edges
        .filter((edge) => edge.claim === "declared" && edge.type !== "belongsTo")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual([...expectedDeclaredRelations].sort());
    expect(
      primitiveNodes.reduce<Record<string, number>>(
        (histogram, node) => ({
          ...histogram,
          [node.readiness]: (histogram[node.readiness] ?? 0) + 1,
        }),
        {},
      ),
    ).toEqual({ defined: 9, ready: 7 });
    expect(
      result.graph.edges
        .filter((edge) => edge.type === "belongsTo")
        .map((edge) => [edge.from, edge.to, edge.claim]),
    ).toEqual(expectedPackMembers.map((id) => [id, "pack:self-hosting-v1", "declared"]));
    expect(packNode).toEqual({
      id: "pack:self-hosting-v1",
      nodeType: "Pack",
      claim: "declared",
      title: "Self-hosting phase 1",
      framing: "The Protocol authors and validates its own phase-1 delivery model.",
      modelRefs: ["spec:model.protocol-domain"],
      file: "specs/self-hosting.pack.sdp.ts",
    });
    expect(result.graph.edges).toHaveLength(57);
    expect(
      result.graph.edges
        .filter((edge) => edge.claim === "anchored")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual(expectedAnchors.map((anchor) => [anchor.id, anchor.type, anchor.target]).sort());
    const expectedAnchorNodes = expectedAnchors
      .map((anchor) => {
        const source = readFileSync(join(repoRoot, anchor.file), "utf8");

        return {
          id: anchor.id,
          nodeType: anchor.nodeType,
          claim: "anchored",
          label: anchor.label,
          file: anchor.file,
          line: lineContaining(source, `const ${anchor.constant}`),
        };
      })
      .sort((left, right) => left.id.localeCompare(right.id));
    expect(
      result.graph.nodes
        .filter((node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode")
        .map((node) => ({
          id: node.id,
          nodeType: node.nodeType,
          claim: node.claim,
          label: node.label,
          file: node.file,
          line: node.line,
        }))
        .sort((left, right) => left.id.localeCompare(right.id)),
    ).toEqual(expectedAnchorNodes);
    for (const anchor of expectedAnchors) {
      const source = readFileSync(join(repoRoot, anchor.file), "utf8");
      const anchorLine = lineContaining(source, `const ${anchor.constant}`);
      const siteLine = lineContaining(source, anchor.site);
      const node = result.graph.nodes.find((entry) => entry.id === anchor.id);

      expect(anchorLine).toBeGreaterThan(0);
      expect(siteLine, anchor.id).toBeGreaterThan(0);
      expect(Math.abs(anchorLine - siteLine), anchor.id).toBeLessThanOrEqual(20);
      expect(node).toMatchObject({ file: anchor.file, line: anchorLine, claim: "anchored" });
    }

    const childId = "spec:validation.duplicate-ids.dual-carrier";
    const parentId = "spec:validation.duplicate-ids";
    const child = primitiveNodes.find((node) => node.id === childId);
    const parent = primitiveNodes.find((node) => node.id === parentId);

    expect(child?.deliveryFacts).toEqual(["has-verifier"]);
    expect(parent?.deliveryFacts).toEqual(["implemented", "has-verifier"]);
    expect(
      result.graph.edges.filter(
        (edge) =>
          edge.from === "test:protocol.duplicate-ids.dual-carrier" &&
          edge.type === "verifies" &&
          edge.claim === "anchored",
      ),
    ).toEqual([
      {
        from: "test:protocol.duplicate-ids.dual-carrier",
        type: "verifies",
        to: childId,
        claim: "anchored",
      },
    ]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.type === "verifies" && edge.claim === "anchored" && edge.to === parentId,
      ),
    ).toEqual([]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === childId && edge.type === "verifies" && edge.claim === "declared",
      ),
    ).toEqual([{ from: childId, type: "verifies", to: parentId, claim: "declared" }]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === childId && edge.type === "refines" && edge.claim === "declared",
      ),
    ).toEqual([{ from: childId, type: "refines", to: parentId, claim: "declared" }]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === "impl:protocol.duplicate-id-exclusion" && edge.type === "satisfies",
      ),
    ).toEqual([
      {
        from: "impl:protocol.duplicate-id-exclusion",
        type: "satisfies",
        to: parentId,
        claim: "anchored",
      },
    ]);

    const importChildId = "spec:carrier.sdp-import.round-trip";
    const importParentId = "spec:carrier.sdp-import";
    const importChild = primitiveNodes.find((node) => node.id === importChildId);
    const importParent = primitiveNodes.find((node) => node.id === importParentId);

    expect(importChild?.deliveryFacts).toEqual(["has-verifier"]);
    expect(importParent?.deliveryFacts).toEqual(["has-verifier"]);
    expect(
      result.graph.edges.filter(
        (edge) =>
          edge.from === "test:protocol.sdp-import.round-trip" &&
          edge.type === "verifies" &&
          edge.claim === "anchored",
      ),
    ).toEqual([
      {
        from: "test:protocol.sdp-import.round-trip",
        type: "verifies",
        to: importChildId,
        claim: "anchored",
      },
    ]);
  });
});
