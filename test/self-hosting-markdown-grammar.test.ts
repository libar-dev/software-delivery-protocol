import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import type { ExampleContract } from "@libar-dev/software-delivery-protocol/runner";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";

import { continuationLineRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.continuation-line-refused.contract.js";
import { foreignFenceRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.foreign-fence-refused.contract.js";
import { h3RefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.h3-refused.contract.js";
import { keyedBulletRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.keyed-bullet-refused.contract.js";
import { orderedListRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.ordered-list-refused.contract.js";
import { plainBulletRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.plain-bullet-refused.contract.js";
import { rawHtmlRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.raw-html-refused.contract.js";
import { repeatedFieldRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.repeated-field-refused.contract.js";
import { secondPrimaryOwnerRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.second-primary-owner-refused.contract.js";
import type {
  MarkdownBodyGrammarConditions,
  MarkdownBodyGrammarOutcome,
} from "../generated/contracts/carrier.markdown-body-grammar.space.js";
import { tableRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.table-refused.contract.js";
import type {
  Step,
  StepParams,
} from "../generated/contracts/carrier.markdown-body-grammar.table-refused.contract.js";
import { trailingProseRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.trailing-prose-refused.contract.js";
import { unrecognizedHeadingRefusedContract } from "../generated/contracts/carrier.markdown-body-grammar.unrecognized-heading-refused.contract.js";
import { extract } from "../src/index.js";
import type { ExtractionResult } from "../src/index.js";
import { registerContinuationLineRefused } from "./carrier.markdown-body-grammar.continuation-line-refused.test.generated.js";
import { registerForeignFenceRefused } from "./carrier.markdown-body-grammar.foreign-fence-refused.test.generated.js";
import { registerH3Refused } from "./carrier.markdown-body-grammar.h3-refused.test.generated.js";
import { registerKeyedBulletRefused } from "./carrier.markdown-body-grammar.keyed-bullet-refused.test.generated.js";
import { registerOrderedListRefused } from "./carrier.markdown-body-grammar.ordered-list-refused.test.generated.js";
import { registerPlainBulletRefused } from "./carrier.markdown-body-grammar.plain-bullet-refused.test.generated.js";
import { registerRawHtmlRefused } from "./carrier.markdown-body-grammar.raw-html-refused.test.generated.js";
import { registerRepeatedFieldRefused } from "./carrier.markdown-body-grammar.repeated-field-refused.test.generated.js";
import { registerSecondPrimaryOwnerRefused } from "./carrier.markdown-body-grammar.second-primary-owner-refused.test.generated.js";
import { registerTableRefused } from "./carrier.markdown-body-grammar.table-refused.test.generated.js";
import { registerTrailingProseRefused } from "./carrier.markdown-body-grammar.trailing-prose-refused.test.generated.js";
import { registerUnrecognizedHeadingRefused } from "./carrier.markdown-body-grammar.unrecognized-heading-refused.test.generated.js";
import { paramsForStep } from "./helpers/generated-contract.js";

// The body-grammar probes: each bound point names the section owner and the construct that the
// grammar refuses, the world writes exactly that carrier beside one healthy sibling, and the
// outcome is the refusal finding the parser reports while the sibling survives.

const REFUSAL_STEP =
  "the carrier is refused whole with the finding {findingId} whose message contains {reason} at line {line}" as const;

// Every sibling binds the same three vocabulary steps, so one contract shape types them all.
type RefusalContract = ExampleContract<Step, StepParams>;

const temporaryRoots = new Set<string>();

afterEach(() => {
  for (const root of temporaryRoots) rmSync(root, { recursive: true, force: true });
  temporaryRoots.clear();
});

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-markdown-grammar-"));
  temporaryRoots.add(root);
  return root;
}

function envelope(id: string, title: string): string {
  return `---
id: ${id}
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# ${title}

## Intent
- outcome: Carry one body construct for the grammar probe.
`;
}

// One tail per construct literal: the lines that follow the probe's Intent, opened by the owner
// heading the bound point names. A construct the vocabulary does not know is a test defect.
const constructTails: Record<string, (owner: string) => string> = {
  "a table row": (owner) => `## ${owner}\n| a | b |\n`,
  "a bullet wrapped onto an indented second line": (owner) =>
    `## ${owner}\n- rule: The first half of a rule\n  and the second half on its own line.\n`,
  "an ordered list item": (owner) => `## ${owner}\n1. The first step.\n`,
  "a ts fence": (owner) => `## ${owner}\n\`\`\`ts\ntype Probe = string;\n\`\`\`\n`,
  "an H3 heading": (owner) => `## ${owner}\n### Tables\n`,
  "a plain bullet": (owner) => `## ${owner}\n- A plain bullet with no key.\n`,
  "a bullet opening with one word and a colon": (owner) =>
    `## ${owner}\n- Applied: the command committed.\n`,
  "a paragraph after the first bullet": (owner) =>
    `## ${owner}\n- rule: The first rule.\n\nA paragraph that follows the bullet.\n`,
  "a second statement field": (owner) =>
    `## ${owner}\n- statement: The first statement.\n- statement: The second statement.\n`,
  "a rule bullet": (owner) => `## ${owner}\n- rule: A rule under the heading.\n`,
  "a plain bullet after a Behavior section": (owner) =>
    `## Behavior\n- rule: The first rule.\n\n## ${owner}\n- The second rule.\n`,
  "a line break tag": (owner) => `## ${owner}\n- rule: A rule with a <br> inside.\n`,
};

interface GrammarWorld {
  readonly root?: string;
  result?: ExtractionResult;
}

function grammarWorld(point: Partial<MarkdownBodyGrammarConditions>): GrammarWorld {
  if (point.owner === undefined || point.construct === undefined) return {};

  const tail = constructTails[point.construct];
  if (tail === undefined) throw new Error(`No carrier tail for construct ${point.construct}.`);

  const root = temporaryRoot();
  writeFileSync(join(root, "sibling.sdp.md"), envelope("spec:probe.sibling", "Healthy sibling"));
  writeFileSync(
    join(root, "refused.sdp.md"),
    `${envelope("spec:probe.refused", "Refused probe")}\n${tail(point.owner)}`,
  );
  return { root };
}

function invokeExtraction(world: GrammarWorld): void {
  if (world.root === undefined) return;
  world.result = extract({ root: world.root });
}

function adaptersFor(contract: RefusalContract) {
  const step = REFUSAL_STEP;
  const outcome = (): MarkdownBodyGrammarOutcome => {
    const { findingId, reason, line } = paramsForStep(contract, step);
    return { kind: REFUSAL_STEP, findingId, reason, line };
  };

  return {
    createWorld: grammarWorld,
    invoke: invokeExtraction,
    observe: (world: GrammarWorld): MarkdownBodyGrammarOutcome => {
      if (world.result === undefined) throw new Error("The refusal point requires an extraction.");

      // The line pins the construct that caused the finding, so a refusal of the same class at
      // another line (the closing fence, a recovery diagnostic) cannot stand in for it.
      const { findingId, reason, line } = paramsForStep(contract, step);
      const refusal = world.result.report.findings.find(
        (finding) =>
          finding.validatorId === findingId &&
          finding.message.includes(reason) &&
          finding.line === line &&
          finding.file?.endsWith("refused.sdp.md") === true,
      );
      expect(
        refusal,
        `${findingId} containing ${JSON.stringify(reason)} at line ${String(line)}; got ${JSON.stringify(world.result.report.findings.map((finding) => [finding.validatorId, finding.line, finding.message]))}`,
      ).toBeDefined();
      expect(refusal?.severity).toBe("error");
      expect(
        world.result.graph.nodes
          .filter((node) => node.nodeType === "Primitive")
          .map((node) => node.id),
      ).toEqual(["spec:probe.sibling"]);
      return outcome();
    },
    expected: (point: Partial<MarkdownBodyGrammarConditions>): MarkdownBodyGrammarOutcome =>
      point.owner === undefined || point.construct === undefined ? unspecified : outcome(),
  };
}

// Each anchor sits beside the registration it binds, so the corpus oracle can resolve both in
// this file; the anchor is the binding and the registration is the site.
const tableRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.table-refused"),
  label: "the table point verifies the block-structure refusal",
  verifies: ref("spec:carrier.markdown-body-grammar.table-refused"),
});
void tableRefusedTestAnchor;
registerTableRefused(adaptersFor(tableRefusedContract));

const continuationLineRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.continuation-line-refused"),
  label: "the continuation-line point verifies the one-line entry rule",
  verifies: ref("spec:carrier.markdown-body-grammar.continuation-line-refused"),
});
void continuationLineRefusedTestAnchor;
registerContinuationLineRefused(adaptersFor(continuationLineRefusedContract));

const orderedListRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.ordered-list-refused"),
  label: "the ordered-list point verifies the list-entry rule",
  verifies: ref("spec:carrier.markdown-body-grammar.ordered-list-refused"),
});
void orderedListRefusedTestAnchor;
registerOrderedListRefused(adaptersFor(orderedListRefusedContract));

const foreignFenceRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.foreign-fence-refused"),
  label: "the foreign-fence point verifies the closed fence set",
  verifies: ref("spec:carrier.markdown-body-grammar.foreign-fence-refused"),
});
void foreignFenceRefusedTestAnchor;
registerForeignFenceRefused(adaptersFor(foreignFenceRefusedContract));

const h3RefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.h3-refused"),
  label: "the H3 point verifies the single-H3 rule",
  verifies: ref("spec:carrier.markdown-body-grammar.h3-refused"),
});
void h3RefusedTestAnchor;
registerH3Refused(adaptersFor(h3RefusedContract));

const plainBulletRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.plain-bullet-refused"),
  label: "the plain-bullet point verifies the open-section key rule",
  verifies: ref("spec:carrier.markdown-body-grammar.plain-bullet-refused"),
});
void plainBulletRefusedTestAnchor;
registerPlainBulletRefused(adaptersFor(plainBulletRefusedContract));

const keyedBulletRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.keyed-bullet-refused"),
  label: "the keyed-bullet point verifies the keyed-bullet rule",
  verifies: ref("spec:carrier.markdown-body-grammar.keyed-bullet-refused"),
});
void keyedBulletRefusedTestAnchor;
registerKeyedBulletRefused(adaptersFor(keyedBulletRefusedContract));

const trailingProseRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.trailing-prose-refused"),
  label: "the trailing-prose point verifies the prose-ownership rule",
  verifies: ref("spec:carrier.markdown-body-grammar.trailing-prose-refused"),
});
void trailingProseRefusedTestAnchor;
registerTrailingProseRefused(adaptersFor(trailingProseRefusedContract));

const repeatedFieldRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.repeated-field-refused"),
  label: "the repeated-field point verifies the at-most-once rule",
  verifies: ref("spec:carrier.markdown-body-grammar.repeated-field-refused"),
});
void repeatedFieldRefusedTestAnchor;
registerRepeatedFieldRefused(adaptersFor(repeatedFieldRefusedContract));

const unrecognizedHeadingRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.unrecognized-heading-refused"),
  label: "the unrecognized-heading point verifies the closed owner set",
  verifies: ref("spec:carrier.markdown-body-grammar.unrecognized-heading-refused"),
});
void unrecognizedHeadingRefusedTestAnchor;
registerUnrecognizedHeadingRefused(adaptersFor(unrecognizedHeadingRefusedContract));

const secondPrimaryOwnerRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.second-primary-owner-refused"),
  label: "the second-primary-owner point verifies the one-primary-owner rule",
  verifies: ref("spec:carrier.markdown-body-grammar.second-primary-owner-refused"),
});
void secondPrimaryOwnerRefusedTestAnchor;
registerSecondPrimaryOwnerRefused(adaptersFor(secondPrimaryOwnerRefusedContract));

const rawHtmlRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-body-grammar.raw-html-refused"),
  label: "the raw-HTML point verifies the raw-HTML refusal outside code spans",
  verifies: ref("spec:carrier.markdown-body-grammar.raw-html-refused"),
});
void rawHtmlRefusedTestAnchor;
registerRawHtmlRefused(adaptersFor(rawHtmlRefusedContract));
