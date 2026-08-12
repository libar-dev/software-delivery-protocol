import { describe, expect, it } from "vitest";

import { changesetEntryContract } from "../generated/contracts/consumers.reader.changeset-entry.contract.js";
import { conceptEntryContract } from "../generated/contracts/consumers.reader.concept-entry.contract.js";
import { fileEntryContract } from "../generated/contracts/consumers.reader.file-entry.contract.js";
import type { ReaderConditions } from "../generated/contracts/consumers.reader.space.js";
import { readerSpace } from "../generated/contracts/consumers.reader.space.js";
import { expectedReaderOutcome } from "./self-hosting-consumers.oracle.js";

function completeConditions(point: Partial<ReaderConditions>): ReaderConditions {
  if (point.entry === undefined) {
    throw new Error("every reader witness must bind its entry mode");
  }

  return {
    concept: point.concept ?? "",
    conceptSpecId: point.conceptSpecId ?? "",
    boundFile: point.boundFile ?? "",
    bindingId: point.bindingId ?? "",
    unrecordedFile: point.unrecordedFile ?? "",
    entry: point.entry,
  };
}

interface AnyContractStep {
  readonly kind: "given" | "when" | "then";
  readonly text: string;
  readonly params: Readonly<Record<string, unknown>>;
}

interface AnyContract {
  readonly spec: string;
  readonly steps: readonly AnyContractStep[];
}

const contractsBySpec = {
  "spec:consumers.reader.changeset-entry": changesetEntryContract,
  "spec:consumers.reader.concept-entry": conceptEntryContract,
  "spec:consumers.reader.file-entry": fileEntryContract,
} as const satisfies Record<string, AnyContract>;

describe("the reader entry-map oracle", () => {
  it("assigns every generated reader witness the outcome its contract's Then step records", () => {
    expect(readerSpace.examples.map(({ spec }) => spec).sort()).toEqual(
      Object.keys(contractsBySpec).sort(),
    );

    // The oracle is authoritative only if it restates the authored expectation, so each outcome
    // is compared to the contract-recorded Then parameters — never to a hand-copied literal a
    // transcription slip could move in step with the oracle.
    const outcomes = readerSpace.examples.map(({ spec, point }) => {
      const outcome = expectedReaderOutcome(completeConditions(point));
      const { kind, ...fields } = outcome;
      const contract: AnyContract = contractsBySpec[spec];
      expect(contract.spec).toBe(spec);
      const thenStep = contract.steps.find((step) => step.kind === "then" && step.text === kind);
      expect(
        thenStep,
        `${spec} states no Then step matching the oracle outcome "${kind}"`,
      ).toBeDefined();
      expect(thenStep?.params).toEqual(fields);
      return outcome;
    });

    expect(new Set(outcomes.map(({ kind }) => kind)).size).toBe(3);
    expect(outcomes.every(({ kind }) => kind !== "unspecified")).toBe(true);
  });
});
