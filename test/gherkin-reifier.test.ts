import { describe, expect, it } from "vitest";

import { reifyGherkinCarrier } from "../src/extract/gherkin.js";
import { extractFindingIds } from "../src/extract/reify.js";
import { deriveGraph } from "../src/extract/derive.js";
import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { validateGraph } from "../src/validate/validators.js";

const FEATURE_TAGS = "@spec.probe.parent @altitude.feature @readiness.defined";
const SCENARIO_TAGS = "@spec.probe.child @altitude.story @readiness.defined";

function reify(sourceText: string) {
  return reifyGherkinCarrier(sourceText, "probe.feature");
}

function feature(body = "", tags = FEATURE_TAGS): string {
  return `${tags}\nFeature: Probe feature${body.length === 0 ? "" : `\n${body}`}\n`;
}

function scenario(body = "    Given a value", tags = SCENARIO_TAGS): string {
  return `  ${tags}\n  Scenario: Probe scenario\n${body}`;
}

function refusal(sourceText: string, validatorId: string = extractFindingIds.gherkinGrammar) {
  const result = reify(sourceText);
  expect(result.specs).toEqual([]);
  expect(result.packs).toEqual([]);
  expect(result.findings).toHaveLength(1);
  expect(result.findings[0]).toMatchObject({
    validatorId,
    family: "conformance",
    severity: "error",
    file: "probe.feature",
  });
  return result.findings[0];
}

describe("Gherkin carrier reifier", () => {
  it("reifies the closed accepted grammar into carrier-neutral Spec data", () => {
    const source = `@wip ${FEATURE_TAGS} @depends-on.spec:probe.dependency @constrained-by.spec:probe.constraint @decided-by.spec:probe.decision @refines.spec:probe.parent-parent @verifies.spec:probe.verification
Feature: Complete carrier
  Narrative first line
  continues here.

  - problem: Carrier drift
  - outcome: One graph
  - value: Deterministic authoring
  - actor: A maintainer
  - description: Closed Gherkin surface
  - risk: Parser drift
  - risk: Silent tags
  - assumption: English source
  - criterion: Graph parity
  - verification-mode: executable

  Second paragraph.

  @example-space
  Scenario: Shared vocabulary
    Given an item {item:string}
    And a quantity {quantity:number}
    When the item is added
    But inventory rejects it
    Then the cart is unchanged
    And an error is recorded

  @wip ${SCENARIO_TAGS} @refines.spec:probe.explicit-parent
  Scenario: Concrete child
    Scenario narrative.

    - outcome: Bind one point
    - criterion: The point is exact
    Given an item {item: "book"}
    And a quantity {quantity: 2}
    When the item is added
    But inventory rejects it
    Then the cart is unchanged
    And an error is recorded

  Rule: First title-only rule

  Rule: Second title-only rule
`;

    const result = reify(source);

    expect(result.findings).toEqual([]);
    expect(result.specs).toHaveLength(2);
    expect(result.specs[0]).toMatchObject({
      id: "spec:probe.parent",
      file: "probe.feature",
      line: 1,
      data: {
        id: "spec:probe.parent",
        kind: "behavior",
        altitude: "feature",
        readiness: "defined",
        title: "Complete carrier",
        narrative: "Narrative first line continues here.\n\nSecond paragraph.",
        intent: {
          problem: "Carrier drift",
          outcome: "One graph",
          value: "Deterministic authoring",
          actor: "A maintainer",
          description: "Closed Gherkin surface",
          risks: ["Parser drift", "Silent tags"],
          assumptions: ["English source"],
        },
        verification: { mode: "executable", criteria: ["Graph parity"] },
        behavior: {
          rules: ["First title-only rule", "Second title-only rule"],
          exampleSpace: {
            given: ["an item {item:string}", "a quantity {quantity:number}"],
            when: ["the item is added", "inventory rejects it"],
            then: ["the cart is unchanged", "an error is recorded"],
          },
        },
      },
    });
    expect(result.specs[0]?.data.relations).toEqual([
      { type: "dependsOn", target: "spec:probe.dependency", claim: "declared" },
      { type: "constrainedBy", target: "spec:probe.constraint", claim: "declared" },
      { type: "decidedBy", target: "spec:probe.decision", claim: "declared" },
      { type: "refines", target: "spec:probe.parent-parent", claim: "declared" },
      { type: "verifies", target: "spec:probe.verification", claim: "declared" },
    ]);
    expect(result.specs[1]).toMatchObject({
      id: "spec:probe.child",
      data: {
        kind: "example",
        title: "Concrete child",
        narrative: "Scenario narrative.",
        intent: { outcome: "Bind one point" },
        verification: { criteria: ["The point is exact"] },
        relations: [
          { type: "refines", target: "spec:probe.explicit-parent", claim: "declared" },
          { type: "verifies", target: "spec:probe.parent", claim: "declared" },
        ],
        behavior: {
          examples: [
            {
              given: ['an item {item: "book"}', "a quantity {quantity: 2}"],
              when: ["the item is added", "inventory rejects it"],
              then: ["the cart is unchanged", "an error is recorded"],
            },
          ],
        },
      },
    });
    expect(JSON.stringify(result.specs)).not.toContain("@wip");
    expect(JSON.stringify(result.specs)).not.toMatch(/"id":"\d+"/u);
  });

  it("defaults each missing nesting relation independently", () => {
    const result = reify(
      feature(scenario("    Given a value", `${SCENARIO_TAGS} @verifies.spec:probe.other`)),
    );

    expect(result.findings).toEqual([]);
    expect(result.specs[1]?.data.relations).toEqual([
      { type: "verifies", target: "spec:probe.other", claim: "declared" },
      { type: "refines", target: "spec:probe.parent", claim: "declared" },
    ]);
  });

  it("feeds Gherkin and Markdown relations through the same validation path", () => {
    const gherkinSource = reifyGherkinCarrier(
      "@spec.probe.source @altitude.feature @readiness.defined @constrained-by.spec:probe.target\nFeature: Source\n",
      "source.feature",
    );
    const markdownSource = reifyMarkdownCarrier(
      "---\nid: spec:probe.source\nkind: behavior\naltitude: feature\nreadiness: defined\nrelations:\n  constrainedBy: spec:probe.target\n---\n# Source\n",
      "source.sdp.md",
    );
    const target = reifyMarkdownCarrier(
      "---\nid: spec:probe.target\nkind: behavior\naltitude: feature\nreadiness: idea\nrelations: {}\n---\n# Wrong-kind target\n\n## Intent\n- outcome: Exercise relation validation.\n",
      "target.sdp.md",
    );
    const projectFinding = (sourceSpecs: typeof gherkinSource.specs) =>
      validateGraph(deriveGraph([...sourceSpecs, ...target.specs], [], [])).findings.map(
        ({ validatorId, family, severity, message, subjectId, relatedId, path }) => ({
          validatorId,
          family,
          severity,
          message,
          subjectId,
          relatedId,
          path,
        }),
      );

    expect(gherkinSource.findings).toEqual([]);
    expect(markdownSource.findings).toEqual([]);
    const gherkinFindings = projectFinding(gherkinSource.specs);
    expect(gherkinFindings).toEqual(projectFinding(markdownSource.specs));
    const constrainedByFinding = gherkinFindings.find(
      (finding) =>
        finding.validatorId === "conformance/claim-separation" &&
        finding.subjectId === "spec:probe.source",
    );
    expect(constrainedByFinding?.message).toContain("constrainedBy bounds");
  });

  it.each([
    [
      "a missing Feature identity",
      feature("", "@altitude.feature @readiness.defined"),
      "missing @spec.<dotted-id>",
    ],
    [
      "a duplicate Feature identity",
      feature("", `${FEATURE_TAGS} @spec.probe.other`),
      "duplicate identity tag",
    ],
    [
      "a missing Scenario identity",
      feature(scenario("    Given a value", "@altitude.story @readiness.defined")),
      "missing @spec.<dotted-id>",
    ],
    [
      "a duplicate altitude",
      feature("", `${FEATURE_TAGS} @altitude.epic`),
      "duplicate altitude tag",
    ],
    [
      "a readiness outside the descriptor set",
      feature("", "@spec.probe.parent @altitude.feature @readiness.finished"),
      "outside idea | scoped | defined | ready",
    ],
    ["a kind tag", feature("", `${FEATURE_TAGS} @kind.behavior`), "kind is structural"],
    ["a Pack tag", feature("", `${FEATURE_TAGS} @pack.checkout`), "Pack membership"],
    [
      "a supersedes tag",
      feature("", `${FEATURE_TAGS} @supersedes.spec:probe.old`),
      "outside the behavior/example carrier vocabulary",
    ],
    [
      "an implemented lookalike",
      feature("", `${FEATURE_TAGS} @implemented`),
      "delivery-fact lookalike",
    ],
    [
      "a claim lookalike",
      feature("", `${FEATURE_TAGS} @claim.declared`),
      "authored claim lookalike",
    ],
    [
      "a lifecycle lookalike",
      feature("", `${FEATURE_TAGS} @status-ready`),
      "lifecycle-status lookalike",
    ],
    [
      "an architect lookalike",
      feature("", `${FEATURE_TAGS} @architect-implemented`),
      "architect-status lookalike",
    ],
    [
      "a graph-aware near miss",
      feature("", `${FEATURE_TAGS} @readines.ready`),
      'did you mean "@readiness."',
    ],
    ["an unknown description key", feature("  - outcom: Value"), 'did you mean "outcome"'],
    ["a heading-shaped description line", feature("  Intent:"), "has no description headings"],
    [
      "a duplicate singular description key",
      feature("  - outcome: First\n  - outcome: Second"),
      'key "outcome" is authored more than once',
    ],
    [
      "a Rule with children",
      feature(
        `  Rule: Positional nesting\n${scenario("      Given a value").replace(/^ {2}/gmu, "    ")}`,
      ),
      "Scenarios following a Rule nest under it positionally",
    ],
    ["a Rule description", feature("  Rule: Described\n    prose"), "Rules are title-only"],
    ["a tagged Rule", feature("  @wip\n  Rule: Tagged"), "Rules are title-only"],
    [
      "two example-space pseudo-scenarios",
      feature(
        "  @example-space\n  Scenario: First\n    Given one\n\n  @example-space\n  Scenario: Second\n    Given two",
      ),
      "more than one @example-space",
    ],
    [
      "graph-aware metadata on example-space",
      feature("  @example-space @spec.probe.space\n  Scenario: Space\n    Given one"),
      "reserved graph-aware head",
    ],
    [
      "a Scenario Outline",
      feature(
        `  ${SCENARIO_TAGS}\n  Scenario Outline: Outlined\n    Given <value>\n\n    Examples:\n      | value |\n      | one   |`,
      ),
      "Scenario Outline",
    ],
    ["a Background", feature("  Background: Shared\n    Given one"), 'construct "Background"'],
    [
      "a doc string",
      feature(scenario('    Given a value\n      """\n      body\n      """')),
      "carries a doc string",
    ],
    [
      "a data table",
      feature(scenario("    Given a value\n      | key | value |")),
      "carries a data table",
    ],
    ["a star step", feature(scenario("    * a value")), 'step keyword "*"'],
    ["a leading And", feature(scenario("    And a value")), "starts with conjunction step"],
    [
      "a malformed identity",
      feature("", "@spec.bad..path @altitude.feature @readiness.defined"),
      "empty path segment",
      extractFindingIds.invalidId,
    ],
    [
      "a malformed relation target",
      feature("", `${FEATURE_TAGS} @refines.probe.parent`),
      "missing namespace",
      extractFindingIds.invalidId,
    ],
  ])(
    "refuses %s",
    (_name, sourceText, message, validatorId: string = extractFindingIds.gherkinGrammar) => {
      const found = refusal(sourceText, validatorId);
      expect(found?.message).toContain(message);
      expect(found?.line).toBeGreaterThan(0);
    },
  );

  it("refuses a non-English language header at its source line", () => {
    const found = refusal(`# language: fr\n${FEATURE_TAGS}\nFonctionnalité: Essai\n`);

    expect(found?.line).toBe(1);
    expect(found?.message).toContain('language "fr" is refused');
  });

  it("normalizes the first parser diagnostic as Gherkin syntax and excludes the file", () => {
    const found = refusal(
      `${FEATURE_TAGS}\nFeature: First\n  Scenario: One\n    Given a value\nFeature: Second\n`,
      extractFindingIds.gherkinSyntax,
    );

    expect(found?.line).toBe(5);
    expect(found?.message).toContain("does not parse");
  });
});
