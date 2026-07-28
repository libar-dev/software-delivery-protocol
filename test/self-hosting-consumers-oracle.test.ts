import { describe, expect, it } from "vitest";

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

describe("the reader entry-map oracle", () => {
  it("assigns a distinct expected outcome to every generated reader witness", () => {
    const outcomes = readerSpace.examples.map(({ point }) =>
      expectedReaderOutcome(completeConditions(point)),
    );

    expect(readerSpace.examples.map(({ spec }) => spec).sort()).toEqual([
      "spec:consumers.reader.changeset-entry",
      "spec:consumers.reader.concept-entry",
      "spec:consumers.reader.file-entry",
    ]);
    expect(outcomes).toEqual([
      {
        kind: "the coverage-unknown files name {coverageUnknownFile}",
        coverageUnknownFile: "src/price-book.ts",
      },
      {
        kind: "the reader names {matchedId} as a match on the field {matchedField}",
        matchedId: "spec:orders.order-management",
        matchedField: "sections.behavior.rules",
      },
      {
        kind: "the file entry names the node {nodeId} the graph records at that path",
        nodeId: "impl:orders.create-order",
      },
    ]);
    expect(new Set(outcomes.map(({ kind }) => kind)).size).toBe(3);
    expect(outcomes.every(({ kind }) => kind !== "unspecified")).toBe(true);
  });
});
