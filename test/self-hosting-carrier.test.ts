import { oneLiteralBindingContract } from "../generated/contracts/carrier.slot-notation.one-literal-binding.contract.js";
import { droppedListWarnsContract } from "../generated/contracts/model.open-question-fields.dropped-list-warns.contract.js";
import type {
  OpenQuestionFieldsConditions,
  OpenQuestionFieldsOutcome,
} from "../generated/contracts/model.open-question-fields.space.js";
import { registerOneLiteralBinding } from "./carrier.slot-notation.one-literal-binding.test.generated.js";
import { registerDroppedListWarns } from "./model.open-question-fields.dropped-list-warns.test.generated.js";
import { generateContracts } from "../src/codegen/contracts.js";
import { extract, schemaVersion } from "../src/index.js";
import type { ExtractionResult } from "../src/index.js";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { boundedParityContract } from "../generated/contracts/carrier.markdown-parser.bounded-parity.contract.js";
import type {
  MarkdownParserConditions,
  MarkdownParserOutcome,
} from "../generated/contracts/carrier.markdown-parser.space.js";
import { refusedGuessContract } from "../generated/contracts/carrier.slot-notation.refused-guess.contract.js";
import type {
  SlotNotationConditions,
  SlotNotationOutcome,
} from "../generated/contracts/carrier.slot-notation.space.js";
import { typedDeclarationContract } from "../generated/contracts/carrier.slot-notation.typed-declaration.contract.js";
import {
  parseSlots,
  reifyMarkdownCarrier,
  reifyTypeScriptCarrier,
  stepSkeleton,
} from "../src/index.js";
import type { CarrierReification, SlotGroup } from "../src/index.js";
import { registerBoundedParity } from "./carrier.markdown-parser.bounded-parity.test.generated.js";
import { registerRefusedGuess } from "./carrier.slot-notation.refused-guess.test.generated.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerTypedDeclaration } from "./carrier.slot-notation.typed-declaration.test.generated.js";

/**
 * The bound executable points of the carrier family: the ruled Markdown parser's bounded parity,
 * and the slot micro-notation the carrier's fenced blocks own. The parity point reads one
 * same-class row of the matrix from the paired probe carriers the matrix already owns — the claim
 * under test is exactly the authored one, a shared validator ID with severity and
 * extract-versus-refuse outcomes left carrier-specific, so the point asserts the agreement and the
 * divergence together. The notation points parse one step text in process; no filesystem is
 * involved.
 *
 * `test/extract-parity.test.ts` and `test/notation.test.ts` stay as regression evidence over the
 * whole matrix, the four named non-claims, and every slot spelling; these points state the laws,
 * never every row.
 */
const fixtureRoot = new URL("./fixtures/import/parity/", import.meta.url);

interface ParityWorld {
  probe: string;
  findingId: string;
  typeScript: CarrierReification | undefined;
  markdown: CarrierReification | undefined;
}

function parityWorld(point: Partial<MarkdownParserConditions>): ParityWorld {
  return {
    probe: point.probe ?? "",
    findingId: "",
    typeScript: undefined,
    markdown: undefined,
  };
}

function reifiedOf(world: ParityWorld, carrier: "typeScript" | "markdown"): CarrierReification {
  const reification = world[carrier];

  if (reification === undefined) {
    throw new Error("The reification step must run before the carrier outcomes are asserted.");
  }

  return reification;
}

/** The severity the shared finding class carries on one carrier — the half parity never claims. */
function severityOf(world: ParityWorld, carrier: "typeScript" | "markdown"): string | undefined {
  return reifiedOf(world, carrier).findings.find(
    (finding) => finding.validatorId === world.findingId,
  )?.severity;
}

function invokeParity(world: ParityWorld): void {
  world.typeScript = reifyTypeScriptCarrier(
    readFileSync(new URL(`${world.probe}.sdp.ts`, fixtureRoot), "utf8"),
    `${world.probe}.sdp.ts`,
  );
  world.markdown = reifyMarkdownCarrier(
    readFileSync(new URL(`${world.probe}.sdp.md`, fixtureRoot), "utf8"),
    `${world.probe}.sdp.md`,
  );
}

function observeParity(world: ParityWorld): MarkdownParserOutcome {
  const { findingId } = paramsForStep(
    boundedParityContract,
    "both carriers report the finding class {findingId}",
  );
  world.findingId = findingId;

  for (const carrier of ["typeScript", "markdown"] as const) {
    expect(
      reifiedOf(world, carrier).findings.map((finding) => finding.validatorId),
      carrier,
    ).toContain(findingId);
  }

  return { kind: "both carriers report the finding class {findingId}", findingId };
}

function expectedParity(point: Partial<MarkdownParserConditions>): MarkdownParserOutcome {
  if (point.probe === undefined) {
    return unspecified;
  }

  const { findingId } = paramsForStep(
    boundedParityContract,
    "both carriers report the finding class {findingId}",
  );

  return { kind: "both carriers report the finding class {findingId}", findingId };
}

function assertParity(world: ParityWorld): void {
  const { typeScriptSeverity, typeScriptSpecs } = paramsForStep(
    boundedParityContract,
    "the TypeScript carrier reports severity {typeScriptSeverity} and extracts {typeScriptSpecs} specs",
  );
  const { markdownSeverity, markdownSpecs } = paramsForStep(
    boundedParityContract,
    "the Markdown carrier reports severity {markdownSeverity} and extracts {markdownSpecs} specs",
  );

  expect(severityOf(world, "typeScript")).toBe(typeScriptSeverity);
  expect(reifiedOf(world, "typeScript").specs).toHaveLength(typeScriptSpecs);
  expect(severityOf(world, "markdown")).toBe(markdownSeverity);
  expect(reifiedOf(world, "markdown").specs).toHaveLength(markdownSpecs);
}

const boundedParityTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-parser.bounded-parity"),
  label: "the bounded-parity point verifies one shared finding class and its split outcomes",
  verifies: ref("spec:carrier.markdown-parser.bounded-parity"),
});
void boundedParityTestAnchor;

registerBoundedParity({
  createWorld: parityWorld,
  invoke: invokeParity,
  observe: observeParity,
  expected: expectedParity,
  // The severity/count halves are different-kind Thens than the finding-ID oracle.
  assertions: assertParity,
});

/* ----- spec:carrier.slot-notation ----- */

interface SlotWorld {
  stepText: string;
  slots: readonly SlotGroup[] | undefined;
}

function createSlotWorld(point: Partial<SlotNotationConditions>): SlotWorld {
  return { stepText: (point.stepText ?? "").replaceAll("'", '"'), slots: undefined };
}

function invokeSlotParse(world: SlotWorld): void {
  world.slots = parseSlots(world.stepText);
}

function observeSlotCount(world: SlotWorld): SlotNotationOutcome {
  if (world.slots === undefined) {
    throw new Error("The parse step must run before the slot groups are observed.");
  }

  return {
    kind: "the notation finds {slotCount} slot groups",
    slotCount: world.slots.length,
  };
}

function expectedSlotCount(point: Partial<SlotNotationConditions>): SlotNotationOutcome {
  if (point.stepText === undefined) {
    return unspecified;
  }

  return { kind: "the notation finds {slotCount} slot groups", slotCount: 1 };
}

const slotNotationTypedTestAnchor = specTest({
  id: testAnchorId("test:protocol.slot-notation.typed-declaration"),
  label: "the declaration point verifies the typed form and its skeleton",
  verifies: ref("spec:carrier.slot-notation.typed-declaration"),
});
void slotNotationTypedTestAnchor;
registerTypedDeclaration({
  createWorld: createSlotWorld,
  invoke: invokeSlotParse,
  observe: observeSlotCount,
  expected: expectedSlotCount,
  // Second and third Thens are different kinds than the oracle's slot-count Then.
  assertions: (world) => {
    const first = world.slots?.[0];
    const { form, slotName } = paramsForStep(
      typedDeclarationContract,
      "the first group has the form {form} and the name {slotName}",
    );
    const { skeleton } = paramsForStep(typedDeclarationContract, "the step skeleton is {skeleton}");

    expect(first?.form).toBe(form);
    expect(first?.name).toBe(slotName);
    expect(stepSkeleton(world.stepText)).toBe(skeleton);
  },
});

const slotNotationRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.slot-notation.refused-guess"),
  label: "the refusal point verifies prose braces and the unusable slot",
  verifies: ref("spec:carrier.slot-notation.refused-guess"),
});
void slotNotationRefusedTestAnchor;
registerRefusedGuess({
  createWorld: createSlotWorld,
  invoke: invokeSlotParse,
  observe: observeSlotCount,
  expected: expectedSlotCount,
  // Second and third Thens are different kinds than the oracle's slot-count Then.
  assertions: (world) => {
    const first = world.slots?.[0];
    const { form, slotName } = paramsForStep(
      refusedGuessContract,
      "the first group has the form {form} and the name {slotName}",
    );
    const { skeleton } = paramsForStep(refusedGuessContract, "the step skeleton is {skeleton}");

    expect(first?.form).toBe(form);
    expect(first?.name).toBe(slotName);
    // The stray brace stays prose in the skeleton; only the identifier-led group normalizes.
    expect(stepSkeleton(world.stepText)).toBe(skeleton);
  },
});

const oneLiteralBindingAnchor = specTest({
  id: testAnchorId("test:protocol.slot-notation.one-literal-binding"),
  verifies: ref("spec:carrier.slot-notation.one-literal-binding"),
});
void oneLiteralBindingAnchor;
registerOneLiteralBinding({
  createWorld: createSlotWorld,
  invoke: invokeSlotParse,
  observe: observeSlotCount,
  expected: expectedSlotCount,
  assertions: (world) => {
    const { form, slotName } = paramsForStep(
      oneLiteralBindingContract,
      "the first group has the form {form} and the name {slotName}",
    );
    expect(world.slots?.[0]).toMatchObject({ form, name: slotName });
    expect(stepSkeleton(world.stepText)).toBe(
      paramsForStep(oneLiteralBindingContract, "the step skeleton is {skeleton}").skeleton,
    );
    const generated = generateContracts({
      schemaVersion,
      nodes: [
        {
          id: "spec:probe.slot-parent",
          nodeType: "Primitive",
          claim: "declared",
          specKind: "rule",
          altitude: "story",
          readiness: "idea",
          title: "Probe",
          file: "probe.sdp.md",
          sections: { behavior: { exampleSpace: { given: [world.stepText], when: [], then: [] } } },
        },
      ],
      edges: [],
    });
    const params = paramsForStep(
      oneLiteralBindingContract,
      "contract generation declares {dimensionCount} dimensions and reports {generationFinding}",
    );
    const space = generated.files.get("probe.slot-parent.space.ts");
    expect(space).toBeDefined();
    expect(space?.match(/\{ name: /gu) ?? []).toHaveLength(params.dimensionCount);
    expect(generated.findings.map((f) => f.validatorId)).toEqual([params.generationFinding]);
  },
});

interface DroppedQuestionWorld {
  construct: OpenQuestionFieldsConditions["construct"];
  result?: ExtractionResult;
}
function createDroppedQuestionWorld(
  point: Partial<OpenQuestionFieldsConditions>,
): DroppedQuestionWorld {
  return { construct: point.construct ?? "a non-static question text" };
}
function invokeDroppedQuestion(world: DroppedQuestionWorld): void {
  const root = mkdtempSync(join(tmpdir(), "sdp-dropped-question-"));
  const question =
    world.construct === "a non-static question text"
      ? "{ text: questionText(), blocking: true }"
      : world.construct === "a non-static blocking flag"
        ? '{ text: "An open question", blocking: blockingFlag() }'
        : '{ text: "An open question", blocking: true }, ...otherQuestions';
  try {
    writeFileSync(
      join(root, "probe.sdp.ts"),
      `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const probe = spec({ id: specId("spec:probe.questions"), title: "Probe question drop", kind: "rule", altitude: "story", readiness: "idea", intent: { outcome: "Read the blocking question.", openQuestions: [${question}] }, behavior: { rules: ["Keep one rule."] } });`,
    );
    world.result = extract({ root });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
function observeDroppedQuestion(world: DroppedQuestionWorld): OpenQuestionFieldsOutcome {
  const finding = world.result?.report.findings[0];
  if (!finding) throw new Error("The non-static question must be reported.");
  return {
    kind: "the extractor reports {findingId} at severity {severity}",
    findingId: finding.validatorId,
    severity: finding.severity,
  };
}
function expectedDroppedQuestion(
  point: Partial<OpenQuestionFieldsConditions>,
): OpenQuestionFieldsOutcome {
  return point.construct === undefined
    ? unspecified
    : {
        kind: "the extractor reports {findingId} at severity {severity}",
        findingId: "extract/non-static-section",
        severity: "warning",
      };
}
function assertDroppedQuestion(world: DroppedQuestionWorld, questionCount: number): void {
  expect(world.result?.report.findings).toHaveLength(1);
  const node = world.result?.graph.nodes.find((n) => n.id === "spec:probe.questions");
  expect(node).toBeDefined();
  expect(
    node?.nodeType === "Primitive" ? (node.sections?.intent?.openQuestions ?? []) : undefined,
  ).toHaveLength(questionCount);
}
const droppedListWarnsAnchor = specTest({
  id: testAnchorId("test:protocol.open-question-fields.dropped-list-warns"),
  verifies: ref("spec:model.open-question-fields.dropped-list-warns"),
});
void droppedListWarnsAnchor;
registerDroppedListWarns({
  createWorld: createDroppedQuestionWorld,
  invoke: invokeDroppedQuestion,
  observe: observeDroppedQuestion,
  expected: expectedDroppedQuestion,
  assertions: (world) => {
    assertDroppedQuestion(
      world,
      paramsForStep(
        droppedListWarnsContract,
        "the Spec stays in the graph with {questionCount} open questions",
      ).questionCount,
    );
  },
});

it.each([
  "a non-static question text",
  "a non-static blocking flag",
  "a spread in the list",
] as const)("drops the whole question list for %s", (construct) => {
  const world = createDroppedQuestionWorld({ construct });
  invokeDroppedQuestion(world);
  expect(observeDroppedQuestion(world)).toEqual(expectedDroppedQuestion({ construct }));
  assertDroppedQuestion(world, 0);
});
