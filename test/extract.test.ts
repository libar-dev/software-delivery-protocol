import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import {
  deriveGraph,
  extract,
  extractFindingIds,
  graphValidatorIds,
  reifyTypeScriptCarrier,
  serializeGraph,
  validateGraph,
} from "../src/index.js";
import type { GraphSchema, PrimitiveNode } from "../src/index.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const exampleRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));

const materializedRoots: string[] = [];

function corpusRoot(name: string): string {
  const root = materializeExtractCorpus(name);
  materializedRoots.push(root);
  return root;
}

function exclusionSpecSource(id: string): string {
  return `import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const declared = spec({
  id: specId("${id}"),
  title: "${id}",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
  intent: { outcome: "Exercise extraction discovery." },
});
`;
}

function exclusionAnchorSource(id: string, target: string): string {
  return `import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

export const binding = codeAnchor({
  id: codeAnchorId("${id}"),
  satisfies: ref("${target}"),
});
`;
}

function exclusionRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-exclusions-"));
  materializedRoots.push(root);

  mkdirSync(join(root, "explorations"));
  mkdirSync(join(root, "dist"));
  writeFileSync(join(root, "included.sdp.ts"), exclusionSpecSource("spec:orders.included"), "utf8");
  writeFileSync(
    join(root, "included.ts"),
    exclusionAnchorSource("impl:orders.included", "spec:orders.included"),
    "utf8",
  );
  writeFileSync(
    join(root, "single.sdp.ts"),
    exclusionSpecSource("spec:orders.file-prefix"),
    "utf8",
  );
  writeFileSync(
    join(root, "explorations", "hidden.sdp.ts"),
    exclusionSpecSource("spec:orders.excluded"),
    "utf8",
  );
  writeFileSync(
    join(root, "explorations", "hidden.ts"),
    exclusionAnchorSource("impl:orders.excluded", "spec:orders.excluded"),
    "utf8",
  );
  writeFileSync(
    join(root, "dist", "fixed.sdp.ts"),
    exclusionSpecSource("spec:orders.fixed-exclude"),
    "utf8",
  );

  return root;
}

function temporaryCorpusRoot(name: string): string {
  const root = mkdtempSync(join(tmpdir(), `sdp-${name}-`));
  materializedRoots.push(root);
  mkdirSync(join(root, "specs"), { recursive: true });
  return root;
}

function typeScriptCarrierSource(id: string, title: string): string {
  return `import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const carrier = spec({
  id: specId("${id}"),
  title: "${title}",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Exercise carrier routing." },
  behavior: { rules: ["Both carriers derive one graph."] },
});
`;
}

function markdownCarrierSource(id: string, title: string): string {
  return `---
id: ${id}
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# ${title}

## Intent
- outcome: Exercise carrier routing.

## Behavior
- rule: Both carriers derive one graph.
`;
}

afterAll(() => {
  for (const root of materializedRoots) {
    removeMaterializedCorpus(root);
  }
});

function primitiveNode(graph: GraphSchema, id: string): PrimitiveNode | undefined {
  const node = graph.nodes.find((entry) => entry.id === id);

  return node?.nodeType === "Primitive" ? node : undefined;
}

/**
 * On-disk extractor corpora (the extractor reads files, not in-memory objects), should-fail /
 * should-pass style: each pins one extraction finding id. The corpora are committed as
 * `*.sdp.ts.txt` / `*.ts.txt` and materialized into temp directories — see
 * `helpers/extract-corpus.ts`.
 */
describe("extraction corpora", () => {
  it("invalid-non-static-id: envelope hard error; the static sibling still extracts (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-id") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("id");
    expect(errors[0]?.file).toBe("non-static-id.sdp.ts");
    expect(result.counts.specs).toBe(1);
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:orders.static-sibling"]);
  });

  it("invalid-malformed-id: a static id failing the id grammar is an invalid-id hard error", () => {
    const result = extract({ root: corpusRoot("invalid-malformed-id") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.invalidId);
    expect(result.counts.specs).toBe(0);
    expect(result.graph.nodes).toEqual([]);
  });

  it("invalid-non-static-section: that one property drops with a warning; the spec survives", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-section") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("intent.value");

    const node = primitiveNode(result.graph, "spec:orders.non-static-section");
    expect(node?.sections?.intent?.outcome).toBe(
      "Survive extraction with only the non-static property dropped.",
    );
    expect(node?.sections?.intent?.value).toBeUndefined();
  });

  it("invalid-hand-authored-satisfies-edge: a raw relations[] entry is an envelope error", () => {
    const result = extract({ root: corpusRoot("invalid-hand-authored-satisfies-edge") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("relations[0]");
    expect(result.counts.specs).toBe(0);
    expect(result.graph.nodes).toEqual([]);
    expect(result.graph.edges).toEqual([]);
  });

  it("duplicate-id: TypeScript and Markdown sites are excluded before graph derivation; the healthy sibling remains", () => {
    const result = extract({ root: corpusRoot("duplicate-id") });
    const duplicateFindings = result.report.findings.filter(
      (finding) => finding.validatorId === extractFindingIds.duplicateId,
    );

    // This is the extraction boundary, not the `conformance/duplicate-ids` graph backstop: the
    // ambiguous carriers never enter deriveGraph, so every later consumer sees only the sibling.
    expect(duplicateFindings).toEqual([
      expect.objectContaining({
        file: "first-site.sdp.ts",
        subjectId: "spec:fixture.duplicate",
        validatorId: extractFindingIds.duplicateId,
      }),
      expect.objectContaining({
        file: "second-site.sdp.md",
        subjectId: "spec:fixture.duplicate",
        validatorId: extractFindingIds.duplicateId,
      }),
    ]);
    expect(result.report.findings).toHaveLength(2);
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:fixture.healthy-sibling"]);
    expect(result.graph.nodes.some((node) => node.id === "spec:fixture.duplicate")).toBe(false);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === "spec:fixture.duplicate" || edge.to === "spec:fixture.duplicate",
      ),
    ).toEqual([]);
    expect(serializeGraph(result.graph)).toContain("spec:fixture.healthy-sibling");
    expect(result.counts.specs).toBe(3);
  });

  it("dangling-relation: the edge is emitted, not dropped; referential integrity flags it", () => {
    const result = extract({ root: corpusRoot("dangling-relation") });

    expect(result.report.findings).toEqual([]);
    expect(result.graph.edges).toContainEqual({
      from: "spec:orders.dangling-relation",
      type: "refines",
      to: "spec:orders.missing-target",
      claim: "declared",
    });

    const validation = validateGraph(result.graph).findings;
    expect(
      validation.some((finding) => finding.validatorId === graphValidatorIds.referentialIntegrity),
    ).toBe(true);
  });

  it("unrecognized-statement: the stray statement warns and is ignored; the spec extracts", () => {
    const result = extract({ root: corpusRoot("unrecognized-statement") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.unrecognizedStatement);
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:orders.recognized"]);
  });

  it("invalid-reserved-property: a hand-authored delivery fact at the top level is an envelope hard error; the sibling survives (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-reserved-property") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.reservedProperty);
    expect(errors[0]?.path).toBe("deliveryFacts");
    expect(errors[0]?.subjectId).toBe("spec:orders.reserved-property");
    expect(result.counts.specs).toBe(1);
    expect(result.graph.nodes.map((node) => node.id)).toEqual([
      "spec:orders.reserved-static-sibling",
    ]);
  });

  it("unrecognized-property: a typoed section name drops with a warning; the spec survives without it", () => {
    const result = extract({ root: corpusRoot("unrecognized-property") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.unrecognizedProperty);
    expect(warnings[0]?.path).toBe("behaviour");

    const node = primitiveNode(result.graph, "spec:orders.typoed-section");
    expect(node).toBeDefined();
    expect(JSON.stringify(node)).not.toContain("behaviour");
  });

  it("unrecognized in-section property: warns before canonical serialization drops it", () => {
    const reified = reifyTypeScriptCarrier(
      `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const carrier = spec({
  id: specId("spec:orders.unrecognized-section-property"),
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  behavior: { rules: ["Keep known content."], notes: "Must not disappear silently." },
});`,
      "unrecognized-section-property.sdp.ts",
    );

    const graph = deriveGraph(reified.specs, reified.packs, []);

    expect(reified.findings).toMatchObject([
      {
        validatorId: extractFindingIds.unrecognizedProperty,
        severity: "warning",
        path: "behavior.notes",
      },
    ]);
    expect(
      primitiveNode(graph, "spec:orders.unrecognized-section-property")?.sections?.behavior,
    ).toEqual({ rules: ["Keep known content."] });
    expect(serializeGraph(graph)).not.toContain("Must not disappear silently.");
  });

  it("reserved model term: refuses a term key that collides with the section description field", () => {
    const reified = reifyTypeScriptCarrier(
      `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const carrier = spec({
  id: specId("spec:orders.reserved-description-term"),
  kind: "model",
  altitude: "story",
  readiness: "idea",
  model: { terms: { description: "A term that collides with section vocabulary." } },
});`,
      "reserved-description-term.sdp.ts",
    );

    expect(reified.specs).toEqual([]);
    expect(reified.findings).toMatchObject([
      {
        validatorId: extractFindingIds.reservedProperty,
        severity: "error",
        path: "model.terms.description",
      },
    ]);
  });

  it("id-shaped-string-content: a raw id-shaped string in section content is prose — kept, edge-free, finding-free", () => {
    const result = extract({ root: corpusRoot("id-shaped-string-content") });

    // The MD-10 guard covers the typed affordance only (`ref(…)` is rejected, below); prose that
    // happens to look like an id is content by definition — the documented boundary, pinned.
    expect(result.report.findings).toEqual([]);

    const node = primitiveNode(result.graph, "spec:orders.id-shaped-string");
    expect(node?.sections?.behavior?.examples).toEqual(["spec:orders.promoted-child"]);
    expect(result.graph.edges).toEqual([]);
  });

  it("invalid-parse-error: a parse-broken file is excluded whole, loudly, on both surfaces; siblings survive (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-parse-error") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(2);
    expect(errors.every((finding) => finding.validatorId === extractFindingIds.parseError)).toBe(
      true,
    );
    expect(errors.map((finding) => finding.file)).toEqual([
      "parse-broken-binding.ts",
      "parse-broken.sdp.ts",
    ]);
    expect(errors.every((finding) => typeof finding.line === "number")).toBe(true);

    // No phantom carriers: nothing from either parse-broken file enters the graph — not the
    // carrier the recovered AST would swallow, not the well-formed binding above the break.
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:orders.healthy-sibling"]);
    expect(result.graph.edges).toEqual([]);
    expect(result.counts).toEqual({ specs: 1, packs: 0, anchors: 0 });
    expect(JSON.stringify(result.graph)).not.toContain("spec:orders.swallowed");
  });

  it("invalid-missing-envelope-fields: every absent required field reports in one pass — spec, pack, and anchor carriers", () => {
    const result = extract({ root: corpusRoot("invalid-missing-envelope-fields") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(
      errors.every((finding) => finding.validatorId === extractFindingIds.nonStaticEnvelope),
    ).toBe(true);

    const pathsByFile = new Map<string, string[]>();

    for (const finding of errors) {
      const list = pathsByFile.get(finding.file ?? "") ?? [];
      list.push(finding.path ?? "");
      pathsByFile.set(finding.file ?? "", list);
    }

    expect(pathsByFile.get("bare-spec.sdp.ts")).toEqual(["id", "kind", "altitude", "readiness"]);
    expect(pathsByFile.get("bare-pack.sdp.ts")).toEqual(["id", "specs"]);
    expect(pathsByFile.get("bare-binding.ts")).toEqual(["id", "satisfies"]);
    expect(errors).toHaveLength(8);
    expect(result.graph.nodes).toEqual([]);
    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 0 });
  });

  it("invalid-duplicate-property: a property authored twice in one carrier fails the envelope loudly; the last value never wins", () => {
    const result = extract({ root: corpusRoot("invalid-duplicate-property") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(2);
    expect(
      errors.every((finding) => finding.validatorId === extractFindingIds.nonStaticEnvelope),
    ).toBe(true);
    expect(errors.every((finding) => finding.message.includes("authored more than once"))).toBe(
      true,
    );

    const specError = errors.find((finding) => finding.file === "duplicate-id-property.sdp.ts");
    expect(specError?.path).toBe("id");
    expect(specError?.subjectId).toBe("spec:orders.first-authored-id");

    const anchorError = errors.find((finding) => finding.file === "duplicate-target-property.ts");
    expect(anchorError?.path).toBe("satisfies");
    expect(anchorError?.subjectId).toBe("impl:orders.duplicate-target-binding");

    expect(result.graph.nodes).toEqual([]);
    expect(result.graph.edges).toEqual([]);
    expect(JSON.stringify(result.graph)).not.toContain("spec:orders.last-authored-id");
    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 0 });
  });

  it("ref-in-section-content: an id builder in section content drops the owning property (MD-10)", () => {
    const result = extract({ root: corpusRoot("ref-in-section-content") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("behavior.examples");
    expect(warnings[0]?.message).toContain("relations carry linkage");

    const node = primitiveNode(result.graph, "spec:orders.ref-in-section");
    expect(node?.sections?.behavior?.rules).toEqual([
      "A real rule survives beside the dropped property.",
    ]);
    expect(node?.sections?.behavior?.examples).toBeUndefined();
    // Nothing was smuggled: the graph carries no edge and no content naming the ref target.
    expect(result.graph.edges).toEqual([]);
    expect(JSON.stringify(result.graph.nodes)).not.toContain("spec:orders.promoted-child");
  });

  it("invalid-wrong-builder: an id wrapping the wrong builder is an invalid-id hard error — the builder's contract, restated statically", () => {
    const result = extract({ root: corpusRoot("invalid-wrong-builder") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(2);
    expect(errors.every((finding) => finding.validatorId === extractFindingIds.invalidId)).toBe(
      true,
    );
    expect(
      errors.every((finding) =>
        finding.message.includes("the builder's own contract, restated statically"),
      ),
    ).toBe(true);
    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 0 });
    expect(result.graph.nodes).toEqual([]);
  });

  it("opaque-envelope-entries: a shorthand or spread entry never double-reports its fields as missing", () => {
    const result = extract({ root: corpusRoot("opaque-envelope-entries") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    // One fresh-literal error per carrier — and no false absence report stacked on top: a
    // non-static field is not an absent one.
    expect(errors).toHaveLength(2);
    expect(
      errors.every((finding) => finding.validatorId === extractFindingIds.nonStaticEnvelope),
    ).toBe(true);
    expect(result.report.findings.some((finding) => finding.message.includes("is missing"))).toBe(
      false,
    );
    expect(result.counts.specs).toBe(0);
  });

  it("duplicate-section-property: a repeated name inside section content drops with a warning; the first authored value survives", () => {
    const result = extract({ root: corpusRoot("duplicate-section-property") });

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);

    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("intent.outcome");
    expect(warnings[0]?.message).toContain("authored more than once");

    const node = primitiveNode(result.graph, "spec:orders.nested-duplicate");
    expect(node?.sections?.intent?.outcome).toBe("first authored value");
  });
});

describe("Markdown carrier discovery", () => {
  it("routes the five defused target documents through real discovery with their exact nodes", () => {
    const result = extract({ root: corpusRoot("self-hosting-carrier") });

    expect(result.report.findings).toEqual([]);
    expect(result.counts).toEqual({ specs: 5, packs: 0, anchors: 0 });
    expect(
      result.graph.nodes.map((node) =>
        node.nodeType === "Primitive"
          ? {
              id: node.id,
              file: node.file,
              specKind: node.specKind,
              title: node.title,
              sections: node.sections,
            }
          : node,
      ),
    ).toEqual([
      {
        id: "spec:carrier.envelope-contract",
        file: "specs/carrier/envelope-contract.sdp.md",
        specKind: "contract",
        title: "The Markdown envelope is explicit and bounded",
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
      },
      {
        id: "spec:carrier.markdown-authoring",
        file: "specs/carrier/markdown-authoring.sdp.md",
        specKind: "behavior",
        title: "Markdown authoring enters the one graph",
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
      },
      {
        id: "spec:carrier.markdown-parser",
        file: "specs/carrier/markdown-parser.sdp.md",
        specKind: "behavior",
        title: "The product parser reifies the ruled Markdown subset",
        sections: {
          intent: { outcome: "Reify authored Markdown without a second graph or validation path." },
          behavior: {
            rules: [
              "The parser accepts only the ruled heading grammar and excludes one malformed carrier while continuing healthy siblings.",
            ],
          },
        },
      },
      {
        id: "spec:carrier.prose-ownership-rule",
        file: "specs/carrier/prose-ownership-rule.sdp.md",
        specKind: "rule",
        title: "Every prose edge has one owner",
        sections: {
          intent: { outcome: "Keep free prose in the graph without ambiguous attachment." },
          behavior: {
            rules: [
              "Narrative lives before the first H2; descriptions live only under their owning singular sections; unowned prose is refused.",
            ],
          },
        },
      },
      {
        id: "spec:carrier.sdp-import",
        file: "specs/carrier/sdp-import.sdp.md",
        specKind: "behavior",
        title: "Existing intent can later be imported into the ruled carrier",
        sections: {
          intent: { outcome: "Name import as deferred work without claiming an emitter exists." },
        },
      },
    ]);
  });

  it("derives semantically equivalent accepted subsets through extract and serializeGraph", () => {
    const markdownRoot = temporaryCorpusRoot("markdown-equivalence");
    const typeScriptRoot = temporaryCorpusRoot("typescript-equivalence");
    const id = "spec:carrier.accepted-subset";
    const title = "Accepted carrier subset";

    writeFileSync(
      join(markdownRoot, "specs", "equivalent.sdp.md"),
      markdownCarrierSource(id, title),
      "utf8",
    );
    writeFileSync(
      join(typeScriptRoot, "specs", "equivalent.sdp.ts"),
      typeScriptCarrierSource(id, title),
      "utf8",
    );

    const markdown = extract({ root: markdownRoot });
    const typeScript = extract({ root: typeScriptRoot });
    const markdownSerialized = serializeGraph(markdown.graph);
    const typeScriptSerialized = serializeGraph(typeScript.graph);

    // This is accepted-subset equivalence only; full Markdown/TS parity waits for multi-entry
    // constraint syntax and the deferred hardening work.
    expect(markdown.report.findings).toEqual([]);
    expect(typeScript.report.findings).toEqual([]);
    expect(markdown.graph.nodes[0]?.file).toBe("specs/equivalent.sdp.md");
    expect(typeScript.graph.nodes[0]?.file).toBe("specs/equivalent.sdp.ts");
    expect(markdownSerialized.replace("equivalent.sdp.md", "equivalent.sdp")).toBe(
      typeScriptSerialized.replace("equivalent.sdp.ts", "equivalent.sdp"),
    );
  });

  it("excludes a malformed Markdown carrier while retaining its healthy TypeScript sibling", () => {
    const root = temporaryCorpusRoot("mixed-carrier-failure");
    writeFileSync(join(root, "specs", "broken.sdp.md"), "not a Markdown carrier", "utf8");
    writeFileSync(
      join(root, "specs", "healthy.sdp.ts"),
      typeScriptCarrierSource("spec:carrier.healthy-sibling", "Healthy sibling"),
      "utf8",
    );

    const result = extract({ root });

    expect(result.report.findings).toMatchObject([
      {
        validatorId: "extract/invalid-frontmatter",
        file: "specs/broken.sdp.md",
        line: 1,
      },
    ]);
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["spec:carrier.healthy-sibling"]);
  });

  it("reports same-ID TypeScript and Markdown carriers at both sites without deriving either", () => {
    const root = temporaryCorpusRoot("cross-carrier-duplicate");
    const id = "spec:carrier.cross-carrier-duplicate";
    writeFileSync(
      join(root, "specs", "duplicate.sdp.md"),
      markdownCarrierSource(id, "Markdown"),
      "utf8",
    );
    writeFileSync(
      join(root, "specs", "duplicate.sdp.ts"),
      typeScriptCarrierSource(id, "TypeScript"),
      "utf8",
    );

    const result = extract({ root });
    const duplicateFindings = result.report.findings.filter(
      (finding) => finding.validatorId === extractFindingIds.duplicateId,
    );

    expect(duplicateFindings).toHaveLength(2);
    expect(duplicateFindings.map((finding) => finding.file)).toEqual([
      "specs/duplicate.sdp.md",
      "specs/duplicate.sdp.ts",
    ]);
    expect(duplicateFindings.every((finding) => finding.subjectId === id)).toBe(true);
    expect(result.counts.specs).toBe(2);
    expect(result.graph.nodes).toEqual([]);
  });
});

/**
 * The anchored-layer corpora: anchor constants in `*.ts` source files, committed defused as
 * `*.ts.txt`. Each pins one outcome, should-fail / should-pass style (`05` §5).
 */
const extractContractTestAnchor = specTest({
  id: testAnchorId("test:protocol.extract"),
  label: "extraction contracts verify graph derivation",
  verifies: ref("spec:extraction.derive-graph"),
});
void extractContractTestAnchor;

describe("anchor extraction corpora", () => {
  it("anchored-binding: the full ladder — anchored edges and delivery facts per `02` §2", () => {
    const result = extract({ root: corpusRoot("anchored-binding") });

    expect(result.report.findings).toEqual([]);
    expect(result.counts.anchors).toBe(2);

    const anchoredEdges = result.graph.edges.filter((edge) => edge.claim === "anchored");
    expect(anchoredEdges).toEqual(
      expect.arrayContaining([
        {
          from: "impl:orders.anchored-parent-use-case",
          type: "satisfies",
          to: "spec:orders.anchored-parent",
          claim: "anchored",
        },
        {
          from: "test:orders.anchored-parent.example",
          type: "verifies",
          to: "spec:orders.anchored-parent.example",
          claim: "anchored",
        },
      ]),
    );
    expect(anchoredEdges).toHaveLength(2);

    const factsById = new Map(
      result.graph.nodes
        .filter((node) => node.nodeType === "Primitive")
        .map((node) => [node.id, node.deliveryFacts ?? []]),
    );
    // The parent: implemented from the resolving satisfies binding, has-verifier from the
    // enabled example; the example: has-verifier from the test anchored directly to it.
    expect(factsById.get("spec:orders.anchored-parent")).toEqual(["implemented", "has-verifier"]);
    expect(factsById.get("spec:orders.anchored-parent.example")).toEqual(["has-verifier"]);

    const codeNode = result.graph.nodes.find(
      (node) => node.id === "impl:orders.anchored-parent-use-case",
    );
    const testNode = result.graph.nodes.find(
      (node) => node.id === "test:orders.anchored-parent.example",
    );
    expect(codeNode?.nodeType).toBe("CodeNode");
    expect(testNode?.nodeType).toBe("Anchor");

    // The enabled trace is also conformance-clean: no verifies-linkage surfacing.
    expect(validateGraph(result.graph).findings).toEqual([]);
  });

  it("unenabled-verifier: a declared verifies without a test binding confers nothing (MD-7) and is surfaced", () => {
    const result = extract({ root: corpusRoot("unenabled-verifier") });

    expect(result.report.findings).toEqual([]);

    for (const node of result.graph.nodes) {
      if (node.nodeType === "Primitive") {
        expect(node.deliveryFacts ?? []).toEqual([]);
      }
    }

    // The verifies-linkage check names the incomplete spec↔test trace — informative, never a gate.
    const validation = validateGraph(result.graph).findings;
    expect(validation.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.verifiesLinkage);
    expect(validation[0]?.subjectId).toBe("spec:orders.unverified-parent.example");
  });

  it("invalid-non-static-anchor: envelope hard error; the static sibling still extracts (L3)", () => {
    const result = extract({ root: corpusRoot("invalid-non-static-anchor") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.nonStaticEnvelope);
    expect(errors[0]?.path).toBe("satisfies");
    expect(result.counts.anchors).toBe(1);
    expect(
      result.graph.nodes.some((node) => node.id === "impl:orders.static-sibling-binding"),
    ).toBe(true);
  });

  it("invalid-anchor-namespace: a code anchor with a test: id is an invalid-id hard error", () => {
    const result = extract({ root: corpusRoot("invalid-anchor-namespace") });
    const errors = result.report.findings.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(extractFindingIds.invalidId);
    expect(result.counts.anchors).toBe(0);
  });

  it("duplicate-anchor-id: both sites reported (L2); neither enters the graph; the counts record both", () => {
    const result = extract({ root: corpusRoot("duplicate-anchor-id") });
    const errors = result.report.findings.filter(
      (finding) => finding.validatorId === extractFindingIds.duplicateId,
    );

    expect(errors).toHaveLength(2);
    expect(new Set(errors.map((finding) => finding.file)).size).toBe(2);
    expect(errors.every((finding) => finding.subjectId === "impl:orders.duplicate-binding")).toBe(
      true,
    );
    expect(result.graph.nodes).toEqual([]);
    expect(result.counts.anchors).toBe(2);
  });

  it("dangling-anchor: the edge is emitted, no fact is conferred, and referential integrity flags it", () => {
    const result = extract({ root: corpusRoot("dangling-anchor") });

    expect(result.report.findings).toEqual([]);
    expect(result.graph.edges).toContainEqual({
      from: "impl:orders.dangling-binding",
      type: "satisfies",
      to: "spec:orders.missing-implementation-target",
      claim: "anchored",
    });
    expect(
      result.graph.nodes.some(
        (node) => node.nodeType === "Primitive" && (node.deliveryFacts ?? []).length > 0,
      ),
    ).toBe(false);

    const validation = validateGraph(result.graph).findings;
    expect(
      validation.some((finding) => finding.validatorId === graphValidatorIds.referentialIntegrity),
    ).toBe(true);
  });

  it("misplaced-anchor: authoring calls outside their surface warn and are not extracted", () => {
    const result = extract({ root: corpusRoot("misplaced-anchor") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(2);
    expect(
      warnings.every((finding) => finding.validatorId === extractFindingIds.misplacedAuthoring),
    ).toBe(true);
    expect(result.counts.anchors).toBe(0);
    expect(result.counts.specs).toBe(0);
  });

  it("non-static-anchor-label: the label drops with a warning; the binding survives whole", () => {
    const result = extract({ root: corpusRoot("non-static-anchor-label") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.validatorId).toBe(extractFindingIds.nonStaticSection);
    expect(warnings[0]?.path).toBe("label");

    const node = result.graph.nodes.find((entry) => entry.id === "impl:orders.non-static-label");
    expect(node?.nodeType).toBe("CodeNode");
    expect(node?.nodeType === "CodeNode" ? node.label : "node missing").toBeUndefined();
    expect(result.graph.edges).toContainEqual({
      from: "impl:orders.non-static-label",
      type: "satisfies",
      to: "spec:orders.labelled-target",
      claim: "anchored",
    });
  });
});

/**
 * The import-surface and discovery corpora: the namespace import form and the discovery walk are
 * extraction surface area too — a carrier the author believes exists must never silently fall
 * out of the graph (L2).
 */
describe("import-surface and discovery corpora", () => {
  it("namespace-import: carriers authored as `ns.builder(…)` extract on both surfaces — the full anchored ladder", () => {
    const result = extract({ root: corpusRoot("namespace-import") });

    expect(result.report.findings).toEqual([]);
    expect(result.counts).toEqual({ specs: 2, packs: 0, anchors: 2 });

    expect(result.graph.edges).toEqual(
      expect.arrayContaining([
        {
          from: "spec:orders.namespace-parent.example",
          type: "refines",
          to: "spec:orders.namespace-parent",
          claim: "declared",
        },
        {
          from: "spec:orders.namespace-parent.example",
          type: "verifies",
          to: "spec:orders.namespace-parent",
          claim: "declared",
        },
        {
          from: "impl:orders.namespace-binding",
          type: "satisfies",
          to: "spec:orders.namespace-parent",
          claim: "anchored",
        },
        {
          from: "test:orders.namespace-parent.example",
          type: "verifies",
          to: "spec:orders.namespace-parent.example",
          claim: "anchored",
        },
      ]),
    );
    expect(result.graph.edges).toHaveLength(4);

    const parent = primitiveNode(result.graph, "spec:orders.namespace-parent");
    expect(parent?.deliveryFacts).toEqual(["implemented", "has-verifier"]);
    expect(validateGraph(result.graph).findings).toEqual([]);
  });

  it("namespace-misplaced-authoring: the misplaced-authoring sweep sees the property-access spelling (L2)", () => {
    const result = extract({ root: corpusRoot("namespace-misplaced-authoring") });
    const warnings = result.report.findings.filter((finding) => finding.severity === "warning");

    expect(result.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(warnings).toHaveLength(2);
    expect(
      warnings.every((finding) => finding.validatorId === extractFindingIds.misplacedAuthoring),
    ).toBe(true);
    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 0 });
    expect(result.graph.nodes).toEqual([]);
  });

  it("dot-directory-skipped: discovery never descends into a dot-directory, so a stray copy raises no duplicate-id noise", () => {
    const root = corpusRoot("dot-directory-skipped");

    // The stray copies are genuinely on disk — the clean result below is the walker's skip, not a
    // missing fixture.
    expect(existsSync(join(root, ".history", "surface-spec.sdp.ts"))).toBe(true);
    expect(existsSync(join(root, ".history", "surface-binding.ts"))).toBe(true);

    const result = extract({ root });

    expect(result.report.findings).toEqual([]);
    expect(result.counts).toEqual({ specs: 1, packs: 0, anchors: 1 });
    expect(result.graph.nodes.map((node) => node.id)).toEqual([
      "spec:orders.dot-directory-surface",
      "impl:orders.dot-directory-binding",
    ]);
  });

  it("shadowed-namespace-local: a parameter or local shadowing the import is somebody else's value — no spurious misplaced-authoring", () => {
    const result = extract({ root: corpusRoot("shadowed-namespace-local") });

    expect(
      result.report.findings.filter(
        (finding) => finding.validatorId === extractFindingIds.misplacedAuthoring,
      ),
    ).toEqual([]);
    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 1 });
    expect(result.graph.nodes.map((node) => node.id)).toEqual(["impl:orders.shadow-surface"]);
  });

  it("default-import: a binding authored through a default-import local extracts — it never silently falls out (L2)", () => {
    const result = extract({ root: corpusRoot("default-import") });

    expect(result.report.findings).toEqual([]);
    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 1 });
    expect(result.graph.edges).toEqual([
      {
        from: "impl:orders.default-import-surface",
        type: "satisfies",
        to: "spec:orders.default-import-parent",
        claim: "anchored",
      },
    ]);
  });

  it("consumer exclusions are case-sensitive root-relative prefixes applied before either surface classifies", () => {
    // Given: spec and anchor carriers below a consumer-selected directory, a file prefix, a
    // nonexistent prefix, and a fixed tooling directory.
    const root = exclusionRoot();

    // When: the consumer excludes only the lower-case directory and exact file prefix.
    const result = extract({
      root,
      exclude: ["explorations", "explorations", "single.sdp.ts", "does-not-exist"],
    });

    // Then: both excluded carrier classes are absent; fixed-directory behavior stays independent.
    expect(result.report.findings).toEqual([]);
    expect(result.counts).toEqual({ specs: 1, packs: 0, anchors: 1 });
    expect(result.graph.nodes.map((node) => node.id)).toEqual([
      "spec:orders.included",
      "impl:orders.included",
    ]);
    expect(JSON.stringify(result.graph)).not.toContain("excluded");
    expect(JSON.stringify(result.graph)).not.toContain("file-prefix");
    expect(JSON.stringify(result.graph)).not.toContain("fixed-exclude");

    // When: the exclusion's code units differ in case.
    const caseVariant = extract({ root, exclude: ["EXPLORATIONS"] });

    // Then: the lower-case path remains in scope.
    expect(caseVariant.graph.nodes.map((node) => node.id)).toContain("spec:orders.excluded");
  });

  it.each([
    "",
    ".",
    "./explorations",
    "explorations/",
    "/explorations",
    "../x",
    "a/../b",
    "a//b",
    "a\\b",
  ])("rejects the invalid consumer exclusion %j", (exclude) => {
    // Given: an extraction root.
    const root = exclusionRoot();

    // When / Then: malformed consumer scope is refused rather than broadened or normalized.
    expect(() => extract({ root, exclude: [exclude] })).toThrow(
      `invalid --exclude path "${exclude}"`,
    );
  });
});

/**
 * The graph-validator corpora: extraction is clean (the repo's authoring shape is fine), and the
 * conformance + honesty checks over the derived graph carry the verdict — exactly the
 * `sdp validate` = `sdp build` + checks split (one validation path, MD-14).
 */
describe("graph-validator corpora", () => {
  it("invalid-ready-with-unresolved-dependency: the conformance error and the floor failure both fire — two families, two statements", () => {
    const result = extract({ root: corpusRoot("invalid-ready-with-unresolved-dependency") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    const errors = validation.filter((finding) => finding.severity === "error");

    expect(errors.map((finding) => [finding.validatorId, finding.relatedId])).toEqual([
      [graphValidatorIds.referentialIntegrity, "spec:payments.authorize-payment"],
      [graphValidatorIds.readinessFloor, "all-relations-resolve"],
    ]);
    // The target-rung clause evaluates resolving targets only — no third failure.
    expect(
      validation.some(
        (finding) => finding.relatedId === "depends-on-and-refines-targets-are-defined",
      ),
    ).toBe(false);
  });

  it("invalid-ready-with-target-below-defined: every reference resolves; the one error is the floor clause", () => {
    const result = extract({ root: corpusRoot("invalid-ready-with-target-below-defined") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    const errors = validation.filter((finding) => finding.severity === "error");

    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(graphValidatorIds.readinessFloor);
    expect(errors[0]?.subjectId).toBe("spec:orders.create-order");
    expect(errors[0]?.relatedId).toBe("depends-on-and-refines-targets-are-defined");
  });

  it("invalid-hand-authored-delivery-fact-in-section: the smuggled key fails over the graph end-to-end (MD-16)", () => {
    const result = extract({ root: corpusRoot("invalid-hand-authored-delivery-fact-in-section") });

    // Extraction reifies section interiors as content — the honesty check is the graph's.
    expect(result.report.findings).toEqual([]);

    const errors = validateGraph(result.graph).findings.filter(
      (finding) => finding.severity === "error",
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]?.validatorId).toBe(graphValidatorIds.authoringShape);
    expect(errors[0]?.relatedId).toBe("has-verifier");
    expect(errors[0]?.path).toBe("behavior.has-verifier");
  });

  it("invalid-duplicate-pack-member: a duplicated manifest entry is a pack-coherence error", () => {
    const result = extract({ root: corpusRoot("invalid-duplicate-pack-member") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.packCoherence);
    expect(validation[0]?.severity).toBe("error");
    expect(validation[0]?.subjectId).toBe("pack:checkout-v1");
    expect(validation[0]?.relatedId).toBe("spec:orders.create-order");
  });

  it("invalid-non-model-modelref: a resolving but wrong-kind modelRef is a pack-coherence error", () => {
    const result = extract({ root: corpusRoot("invalid-non-model-modelref") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.packCoherence);
    expect(validation[0]?.severity).toBe("error");
    expect(validation[0]?.path).toBe("modelRefs[0]");
  });

  it("non-example-verifier: a declared verifies from a non-example kind is surfaced, never gated", () => {
    const result = extract({ root: corpusRoot("non-example-verifier") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.verifiesLinkage);
    expect(validation[0]?.severity).toBe("warning");
    expect(validation[0]?.subjectId).toBe("spec:orders.reconciliation-workflow");
  });

  it("orphan-spec: no relations and nothing pointing at it — a warning, never a gate", () => {
    const result = extract({ root: corpusRoot("orphan-spec") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.orphans);
    expect(validation[0]?.severity).toBe("warning");
    expect(validation[0]?.subjectId).toBe("spec:orders.stranded");
  });

  it("ready-without-verifier: the cleared floor plus the surfaced gap — informative only", () => {
    const result = extract({ root: corpusRoot("ready-without-verifier") });

    expect(result.report.findings).toEqual([]);

    const validation = validateGraph(result.graph).findings;
    expect(validation).toHaveLength(1);
    expect(validation[0]?.validatorId).toBe(graphValidatorIds.gaps);
    expect(validation[0]?.severity).toBe("warning");
    expect(validation[0]?.subjectId).toBe("spec:orders.order-total-rule");
  });
});

describe("determinism self-check (rebuild twice, byte-compare — distinct from the golden oracle)", () => {
  it("two independent extractions of the example serialize byte-identically", () => {
    const first = serializeGraph(extract({ root: exampleRoot }).graph);
    const second = serializeGraph(extract({ root: exampleRoot }).graph);

    expect(second).toBe(first);
  });
});
