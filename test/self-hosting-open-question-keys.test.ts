import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, expect } from "vitest";

import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";

import { keyedQuestionResolvesContract } from "../generated/contracts/model.open-question-keys.keyed-question-resolves.contract.js";
import { renamedKeyBreaksContract } from "../generated/contracts/model.open-question-keys.renamed-key-breaks.contract.js";
import { repeatedKeyRefusedContract } from "../generated/contracts/model.open-question-keys.repeated-key-refused.contract.js";
import type {
  OpenQuestionKeysConditions,
  OpenQuestionKeysOutcome,
} from "../generated/contracts/model.open-question-keys.space.js";
import { extract, graphValidatorIds, validateGraph } from "../src/index.js";
import type { ExtractionResult, Finding, PrimitiveNode } from "../src/index.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerKeyedQuestionResolves } from "./model.open-question-keys.keyed-question-resolves.test.generated.js";
import { registerRenamedKeyBreaks } from "./model.open-question-keys.renamed-key-breaks.test.generated.js";
import { registerRepeatedKeyRefused } from "./model.open-question-keys.repeated-key-refused.test.generated.js";

const REIFIED_STEP = "the first carrier is reified: {reified}";
const EXTRACT_STEP = "the extraction findings name {extractMessage}";
const KEYS_STEP = "the graph holds the question keys {keys}";
const MENTIONS_STEP = "the report holds {mentionErrors} prose-mention errors";
const MENTIONING_ID = "spec:probe.mentioning";
const SUBJECT_FILE = "subject.sdp.md";
const MENTIONING_FILE = "mentioning.sdp.md";
const QUESTION_KEY = /^[a-z][A-Za-z0-9]*$/u;
const QUESTION_LINE = /^- \[(?:blocking|non-blocking)(?: #([^\]]*))?\] \S.*$/u;

/** Every Then value of one point, written the way the example Specs write them. */
interface KeyAnswer {
  readonly reified: boolean;
  readonly extractMessage: string;
  readonly keys: string;
  readonly mentionErrors: number;
}

const openQuestionKeysOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.open-question-keys"),
  label: "expected reification, question keys and mention errors by the key rules",
  models: ref("spec:model.open-question-keys"),
});
void openQuestionKeysOracleAnchor;

/** The slot joins the carrier's open-question lines with a semicolon and a space. */
function questionLines(questions: string): readonly string[] {
  return questions.split("; ");
}

/**
 * Authored from the Spec's rules, independently of the extractor. A key off the grammar or one that
 * repeats an earlier key refuses the first carrier whole, so the graph then holds no key and the
 * address names a missing Spec. Otherwise the address resolves when it names the first Spec and a
 * key one of its questions carries; every other address is one prose-mention error.
 */
function answerFor(point: Partial<OpenQuestionKeysConditions>): KeyAnswer | undefined {
  if (point.specId === undefined || point.questions === undefined || point.address === undefined) {
    return undefined;
  }
  const keys: string[] = [];
  let refusal = "";
  for (const line of questionLines(point.questions)) {
    const key = QUESTION_LINE.exec(line)?.[1];
    if (key === undefined) continue;
    if (!QUESTION_KEY.test(key)) {
      refusal = "open question keys must be lower-camel ASCII";
      break;
    }
    if (keys.includes(key)) {
      refusal = "open question keys must be unique";
      break;
    }
    keys.push(key);
  }
  const reified = refusal === "";
  const heldKeys = reified ? keys : [];
  const [targetId, entry = ""] = point.address.split("#");
  const resolves =
    reified &&
    targetId === point.specId &&
    entry.startsWith("question.") &&
    heldKeys.includes(entry.slice("question.".length));
  return {
    reified,
    extractMessage: refusal,
    keys: heldKeys.join(", "),
    mentionErrors: resolves ? 0 : 1,
  };
}

function expectedOutcome(point: Partial<OpenQuestionKeysConditions>): OpenQuestionKeysOutcome {
  const answer = answerFor(point);
  return answer === undefined
    ? unspecified
    : { kind: MENTIONS_STEP, mentionErrors: answer.mentionErrors };
}

interface KeyWorld {
  readonly point: Partial<OpenQuestionKeysConditions>;
  readonly root: string;
  readonly subjectSource: string;
  result?: ExtractionResult;
  validation?: readonly Finding[];
}

const temporaryRoots = new Set<string>();

afterEach(() => {
  for (const root of temporaryRoots) rmSync(root, { recursive: true, force: true });
  temporaryRoots.clear();
});

/**
 * The first carrier: a story-altitude rule Spec stating `scoped`, with an Intent outcome, the
 * open-question lines of the slot, one rule, and one declared `refines` on the second.
 */
function subjectCarrier(specId: string, questions: string): string {
  return `---
id: ${specId}
kind: rule
altitude: story
readiness: scoped
relations:
  refines: ${MENTIONING_ID}
---
# Probe subject

## Intent
- outcome: Carry the open questions of the key probe.

### Open questions
${questionLines(questions).join("\n")}

## Rule
- The probe states one rule.
`;
}

/**
 * The second carrier: a story-altitude rule Spec stating `idea`, with an Intent outcome and one
 * rule, whose narrative names the address and which declares `dependsOn` on the first.
 */
function mentioningCarrier(specId: string, address: string): string {
  return `---
id: ${MENTIONING_ID}
kind: rule
altitude: story
readiness: idea
relations:
  dependsOn: ${specId}
---
# Probe mentioning

The probe cites ${address} by its address.

## Intent
- outcome: Name the subject's open question by its address.

## Rule
- The probe states one rule.
`;
}

function createWorld(point: Partial<OpenQuestionKeysConditions>): KeyWorld {
  const { specId, questions, address } = point;
  if (specId === undefined || questions === undefined || address === undefined) {
    throw new Error("The generated point must bind the Spec id, its questions and the address.");
  }
  const root = mkdtempSync(join(tmpdir(), "sdp-open-question-keys-"));
  temporaryRoots.add(root);
  const subjectSource = subjectCarrier(specId, questions);
  writeFileSync(join(root, SUBJECT_FILE), subjectSource);
  writeFileSync(join(root, MENTIONING_FILE), mentioningCarrier(specId, address));
  return { point, root, subjectSource };
}

function invoke(world: KeyWorld): void {
  const result = extract({ root: world.root });
  world.result = result;
  world.validation = validateGraph(result.graph).findings;
}

function resultOf(world: KeyWorld): ExtractionResult {
  if (world.result === undefined) throw new Error("The extractor must reify both carriers.");
  return world.result;
}

function mentionErrorsOf(world: KeyWorld): readonly Finding[] {
  return (world.validation ?? []).filter(
    (finding) =>
      finding.validatorId === graphValidatorIds.proseMentions && finding.severity === "error",
  );
}

/** Every key an open question carries, over every Spec of the graph in node order. */
function graphKeys(result: ExtractionResult): readonly string[] {
  return result.graph.nodes
    .filter((node): node is PrimitiveNode => node.nodeType === "Primitive")
    .flatMap((node) => {
      const intent = (node.sections as Record<string, unknown> | undefined)?.intent;
      const questions = (intent as Record<string, unknown> | undefined)?.openQuestions;
      return (Array.isArray(questions) ? questions : []).flatMap((question: unknown) => {
        const key = (question as Record<string, unknown> | null)?.key;
        return typeof key === "string" ? [key] : [];
      });
    });
}

function observedAnswer(world: KeyWorld): KeyAnswer {
  const result = resultOf(world);
  return {
    reified: result.graph.nodes.some((node) => node.id === world.point.specId),
    extractMessage: result.report.findings.map((finding) => finding.message).join("; "),
    keys: graphKeys(result).join(", "),
    mentionErrors: mentionErrorsOf(world).length,
  };
}

function observe(world: KeyWorld): OpenQuestionKeysOutcome {
  return { kind: MENTIONS_STEP, mentionErrors: observedAnswer(world).mentionErrors };
}

type KeyContract =
  | typeof keyedQuestionResolvesContract
  | typeof renamedKeyBreaksContract
  | typeof repeatedKeyRefusedContract;

/** The Then values the example Spec states, read from its generated contract. */
function statedAnswer(contract: KeyContract): KeyAnswer {
  return {
    reified: paramsForStep(contract, REIFIED_STEP).reified,
    extractMessage: paramsForStep(contract, EXTRACT_STEP).extractMessage,
    keys: paramsForStep(contract, KEYS_STEP).keys,
    mentionErrors: paramsForStep(contract, MENTIONS_STEP).mentionErrors,
  };
}

/** The 1-based line of the first carrier's open question that repeats an earlier key. */
function repeatedKeyLine(world: KeyWorld): number {
  const lines = world.subjectSource.split("\n");
  const seen = new Set<string>();
  const index = lines.findIndex((line) => {
    const key = QUESTION_LINE.exec(line)?.[1];
    if (key === undefined) return false;
    if (seen.has(key)) return true;
    seen.add(key);
    return false;
  });
  return index + 1;
}

/**
 * The comparator checks the mention-error step; these assertions check every other Then the same
 * two ways: the Spec's value against the oracle, and the observed value against the oracle.
 */
function assertionsFor(contract: KeyContract): (world: KeyWorld) => void {
  return (world) => {
    const answer = answerFor(world.point);
    expect(statedAnswer(contract)).toEqual(answer);
    expect(observedAnswer(world)).toEqual(answer);
    const result = resultOf(world);
    if (answer?.reified === false) {
      // The refusal is the structure finding at the line of the repeated entry, and the address
      // then names a missing Spec rather than a missing entry.
      expect(result.report.findings).toMatchObject([
        {
          validatorId: "extract/invalid-markdown-structure",
          severity: "error",
          file: SUBJECT_FILE,
          line: repeatedKeyLine(world),
        },
      ]);
      expect(mentionErrorsOf(world)[0]?.message).toContain("points to missing target");
    } else if (answer?.mentionErrors === 1) {
      expect(mentionErrorsOf(world)[0]?.message).toContain("points to missing entry");
    }
    // The declared dependsOn backs the mention, so no prose-mention warning joins an error.
    expect(
      (world.validation ?? []).filter(
        (finding) =>
          finding.validatorId === graphValidatorIds.proseMentions && finding.severity === "warning",
      ),
    ).toEqual([]);
  };
}

const keyedQuestionResolvesTestAnchor = specTest({
  id: testAnchorId("test:protocol.open-question-keys.keyed-question-resolves"),
  label: "verifies a keyed question is reified and its question address resolves",
  verifies: ref("spec:model.open-question-keys.keyed-question-resolves"),
});
void keyedQuestionResolvesTestAnchor;
registerKeyedQuestionResolves({
  createWorld,
  invoke,
  observe,
  expected: expectedOutcome,
  assertions: assertionsFor(keyedQuestionResolvesContract),
});

const renamedKeyBreaksTestAnchor = specTest({
  id: testAnchorId("test:protocol.open-question-keys.renamed-key-breaks"),
  label: "verifies a renamed question key fails the mention of its old address",
  verifies: ref("spec:model.open-question-keys.renamed-key-breaks"),
});
void renamedKeyBreaksTestAnchor;
registerRenamedKeyBreaks({
  createWorld,
  invoke,
  observe,
  expected: expectedOutcome,
  assertions: assertionsFor(renamedKeyBreaksContract),
});

const repeatedKeyRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.open-question-keys.repeated-key-refused"),
  label: "verifies a repeated question key refuses its carrier whole",
  verifies: ref("spec:model.open-question-keys.repeated-key-refused"),
});
void repeatedKeyRefusedTestAnchor;
registerRepeatedKeyRefused({
  createWorld,
  invoke,
  observe,
  expected: expectedOutcome,
  assertions: assertionsFor(repeatedKeyRefusedContract),
});
