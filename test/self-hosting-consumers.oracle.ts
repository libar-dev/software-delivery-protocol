import { oracleAnchorId, ref, specOracle } from "@libar-dev/software-delivery-protocol";

import type {
  ReaderConditions,
  ReaderOutcome,
} from "../generated/contracts/consumers.reader.space.js";

export const readerEntryMapOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.reader-entry-map"),
  label: "expected reader outcome for each graph entry mode",
  models: ref("spec:consumers.reader"),
});

export function expectedReaderOutcome(conditions: ReaderConditions): ReaderOutcome {
  switch (conditions.entry) {
    case "concept":
      return {
        kind: "the reader names {matchedId} as a match on the field {matchedField}",
        matchedId: conditions.conceptSpecId,
        matchedField: "sections.behavior",
      };
    case "file":
      return {
        kind: "the file entry names the node {nodeId} the graph records at that path",
        nodeId: conditions.bindingId,
      };
    case "changeset":
      return {
        kind: "the coverage-unknown files name {coverageUnknownFile}",
        coverageUnknownFile: conditions.unrecordedFile,
      };
  }
}
