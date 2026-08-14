import { afterEach, describe, expect, it } from "vitest";

import { reifyGherkinCarrier } from "../src/extract/gherkin.js";
import { extractFindingIds } from "../src/extract/reify.js";
import { deriveGraph } from "../src/extract/derive.js";
import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { extract } from "../src/index.js";
import { validateGraph } from "../src/validate/validators.js";
import { materializeGherkinCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const FEATURE_TAGS = "@spec.probe.parent @altitude.feature @readiness.defined";
const SCENARIO_TAGS = "@spec.probe.child @altitude.story @readiness.defined";

function reify(sourceText: string) {
  return reifyGherkinCarrier(sourceText, "probe.sdp.gherkin");
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
    file: "probe.sdp.gherkin",
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
      file: "probe.sdp.gherkin",
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
      "source.sdp.gherkin",
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

  it("keeps harmless distance-two short-head decoration tags graph-inert", () => {
    const undecorated = reify(feature(scenario()));
    const decorated = reify(
      feature(
        scenario("    Given a value", `${SCENARIO_TAGS} @paced`),
        `${FEATURE_TAGS} @kindle.ci`,
      ),
    );

    expect(undecorated.findings).toEqual([]);
    expect(decorated.findings).toEqual([]);
    expect(decorated.specs).toEqual(undecorated.specs);
  });

  it("suggests exactly one unique reserved head for a length ≤5 one-edit near miss", () => {
    const found = refusal(feature("", `${FEATURE_TAGS} @spe.probe`));

    expect(found?.message.match(/did you mean/gu)).toHaveLength(1);
    expect(found?.message.match(/@spec\./gu)).toHaveLength(1);
  });

  it.each([
    ["@constrained-bi.spec:probe.constraint", "constrained-bi", "constrained-by"],
    ["@decided-bi.spec:probe.decision", "decided-bi", "decided-by"],
    ["@constraind-by.spec:probe.constraint", "constraind-by", "constrained-by"],
  ])("suggests lawful long reserved head for one-edit near-miss %s", (tag, authoredHead, head) => {
    const found = refusal(feature("", `${FEATURE_TAGS} ${tag}`));

    expect(found?.message).toContain(`authored head "${authoredHead}"`);
    expect(found?.message).toContain(`reserved graph-aware head "${head}"`);
    expect(found?.message).toContain(`did you mean "@${head}."`);
  });

  it("refuses an example-space near miss without suggesting invalid decoration syntax", () => {
    const found = refusal(feature("", `${FEATURE_TAGS} @example-spac`));

    expect(found?.message).toContain('authored head "example-spac"');
    expect(found?.message).toContain('reserved graph-aware head "example-space"');
    expect(found?.message).not.toContain("did you mean");
  });

  it("suggests a unique long reserved head for a length >5 two-edit near miss", () => {
    const found = refusal(feature("", `${FEATURE_TAGS} @constraind-bi.spec:probe.constraint`));

    expect(found?.message).toContain('authored head "constraind-bi"');
    expect(found?.message).toContain('reserved graph-aware head "constrained-by"');
    expect(found?.message).toContain('did you mean "@constrained-by."');
  });

  it.each(["@king.dom", "@packs.nightly"])(
    "refuses one-edit short-head decoration %s without recommending illegal metadata",
    (tag) => {
      const found = refusal(feature("", `${FEATURE_TAGS} ${tag}`));

      expect(found?.message).not.toContain("did you mean");
    },
  );

  it.each([
    ["an ordinary Scenario", feature(scenario("")), 4],
    [
      "an @example-space pseudo-scenario",
      feature("  @example-space\n  Scenario: Empty vocabulary"),
      4,
    ],
  ])("refuses step-less %s at its Scenario line", (_name, sourceText, line) => {
    const found = refusal(sourceText);

    expect(found?.line).toBe(line);
  });

  it("accepts a Feature with zero Scenarios", () => {
    const result = reify(feature());

    expect(result.findings).toEqual([]);
    expect(result.specs).toHaveLength(1);
    expect(result.specs[0]?.data).not.toHaveProperty("behavior");
  });

  it("accepts an ordinary Scenario with one Given step", () => {
    const result = reify(feature(scenario()));

    expect(result.findings).toEqual([]);
    expect(result.specs).toHaveLength(2);
    expect(result.specs[1]?.data.behavior).toEqual({
      examples: [{ given: ["a value"], when: [], then: [] }],
    });
  });

  it("classifies keyed bullets and non-heading colon lines exactly", () => {
    const result = reify(
      feature("  Context: details\n  lowercase label:\n\n  - outcome: Parsed outcome\n\n  Next."),
    );

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data.intent).toEqual({ outcome: "Parsed outcome" });
    expect(result.specs[0]?.data.narrative).toBe("Context: details lowercase label:\n\nNext.");
  });

  it("collects four independent semantic findings in physical source order", () => {
    const source = `${FEATURE_TAGS} @readines.ready
Feature: Multiple findings
  - outcom: Misspelled outcome
  ${SCENARIO_TAGS} @king.dom
  Scenario: Empty point
`;

    const result = reify(source);

    expect(result.specs).toEqual([]);
    expect(result.packs).toEqual([]);
    expect(result.findings).toHaveLength(4);
    expect(result.findings.map(({ validatorId, line }) => ({ validatorId, line }))).toEqual([
      { validatorId: extractFindingIds.gherkinGrammar, line: 1 },
      { validatorId: extractFindingIds.gherkinGrammar, line: 3 },
      { validatorId: extractFindingIds.gherkinGrammar, line: 4 },
      { validatorId: extractFindingIds.gherkinGrammar, line: 5 },
    ]);
  });

  it("caps semantic findings at one hundred with a final suppression finding", () => {
    const emptyScenarios = Array.from(
      { length: 101 },
      (_, index) =>
        `  @spec.probe.empty-${String(index)} @altitude.story @readiness.defined\n  Scenario: Empty ${String(index)}`,
    ).join("\n");
    const result = reify(feature(emptyScenarios));

    expect(result.specs).toEqual([]);
    expect(result.findings).toHaveLength(100);
    expect(result.findings.at(-1)).toMatchObject({
      validatorId: extractFindingIds.tooManyGherkinFindings,
      file: "probe.sdp.gherkin",
      line: 1,
    });
    expect(result.findings.at(-1)?.subjectId).toBeUndefined();
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

describe("Gherkin carrier physical description locations", () => {
  const temporaryRoots: string[] = [];

  afterEach(() => {
    for (const root of temporaryRoots.splice(0)) removeMaterializedCorpus(root);
  });

  it.each([
    [
      "a Feature bad description key after leading blanks and comments at physical line 6",
      `${FEATURE_TAGS}
Feature: Probe feature

  # leading comment

  - outcom: Value
`,
      6,
      'did you mean "outcome"',
    ],
    [
      "a Feature bad description key after an interior comment at physical line 5",
      `${FEATURE_TAGS}
Feature: Probe feature
  - outcome: First
  # interior comment
  - outcom: Second
`,
      5,
      'did you mean "outcome"',
    ],
    [
      "a Scenario bad description key after leading blanks and comments at physical line 9",
      `${FEATURE_TAGS}
Feature: Probe feature

  ${SCENARIO_TAGS}
  Scenario: Probe scenario

    # leading comment

    - outcom: Value
    Given a value
`,
      9,
      'did you mean "outcome"',
    ],
    [
      "a Scenario bad description key after an interior comment at physical line 9",
      `${FEATURE_TAGS}
Feature: Probe feature

  ${SCENARIO_TAGS}
  Scenario: Probe scenario

    - outcome: First
    # interior comment
    - outcom: Second
    Given a value
`,
      9,
      'did you mean "outcome"',
    ],
    [
      "a Rule description after a blank line at physical line 6",
      `${FEATURE_TAGS}
Feature: Probe feature

  Rule: Described

    prose under rule
`,
      6,
      "Rules are title-only",
    ],
    [
      "an @example-space description after a blank line at physical line 7",
      `${FEATURE_TAGS}
Feature: Probe feature

  @example-space
  Scenario: Space

    prose under space
    Given one
`,
      7,
      "@example-space pseudo-scenario cannot carry a description",
    ],
  ] as const)("reports %s", (_name, sourceText, line, message) => {
    const found = refusal(sourceText);

    expect(found?.message).toContain(message);
    expect(found?.line).toBe(line);
  });

  it("reports Feature and Scenario bad description keys at the same physical lines under CRLF", () => {
    const featureSource = `${FEATURE_TAGS}
Feature: Probe feature

  # leading comment

  - outcom: Value
`;
    const scenarioSource = `${FEATURE_TAGS}
Feature: Probe feature

  ${SCENARIO_TAGS}
  Scenario: Probe scenario

    # leading comment

    - outcom: Value
    Given a value
`;

    const featureFound = refusal(featureSource.replaceAll("\n", "\r\n"));
    const scenarioFound = refusal(scenarioSource.replaceAll("\n", "\r\n"));

    expect(featureFound?.message).toContain('did you mean "outcome"');
    expect(featureFound?.line).toBe(6);
    expect(scenarioFound?.message).toContain('did you mean "outcome"');
    expect(scenarioFound?.line).toBe(9);
  });

  it("extracts defused description-location fixtures at physical one-based lines", () => {
    const root = materializeGherkinCorpus("description-location");
    temporaryRoots.push(root);

    const result = extract({ root });

    expect(result.counts.specs).toBe(0);
    expect(result.graph.nodes).toEqual([]);
    expect(
      result.report.findings.map(({ file, line, validatorId }) => ({ file, line, validatorId })),
    ).toEqual([
      {
        file: "example-space-description.sdp.gherkin",
        line: 7,
        validatorId: extractFindingIds.gherkinGrammar,
      },
      {
        file: "feature-interior.sdp.gherkin",
        line: 5,
        validatorId: extractFindingIds.gherkinGrammar,
      },
      {
        file: "feature-leading.sdp.gherkin",
        line: 6,
        validatorId: extractFindingIds.gherkinGrammar,
      },
      {
        file: "rule-description.sdp.gherkin",
        line: 6,
        validatorId: extractFindingIds.gherkinGrammar,
      },
      {
        file: "scenario-interior.sdp.gherkin",
        line: 9,
        validatorId: extractFindingIds.gherkinGrammar,
      },
      {
        file: "scenario-leading.sdp.gherkin",
        line: 9,
        validatorId: extractFindingIds.gherkinGrammar,
      },
    ]);
  });
});
