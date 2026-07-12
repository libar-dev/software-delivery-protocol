import { SPEC_SECTION_NAMES } from "@libar-dev/software-delivery-protocol";
import type { FileReification } from "../../../../src/extract/reify.js";

import { parseGrammar } from "./grammar-parse.js";

export interface SdpInspection {
  readonly reification: FileReification;
  readonly droppedProse: readonly string[];
  readonly droppedStructures: readonly string[];
  readonly unboundUsedSteps: readonly string[];
}

export function inspectSdp(text: string, relativePath: string): SdpInspection {
  const parsed = parseGrammar(text, relativePath);
  const data: Record<string, unknown> = {
    id: parsed.id,
    title: parsed.title,
    kind: parsed.kind,
    altitude: parsed.altitude,
    readiness: parsed.readiness,
    relations: parsed.relations.map((relation) => ({
      type: relation.type,
      target: relation.target,
      claim: "declared",
    })),
  };

  for (const name of SPEC_SECTION_NAMES) {
    if (parsed.sections[name] !== undefined) data[name] = parsed.sections[name];
  }

  return {
    reification: {
      specs: [{ data, id: parsed.id, file: relativePath, line: 1 }],
      packs: [],
      findings: [],
    },
    droppedProse: parsed.droppedProse,
    droppedStructures:
      parsed.cases === undefined ? [] : ["cases block (pre-graph expansion input)"],
    unboundUsedSteps: parsed.unboundUsedSteps,
  };
}

export function reifySdp(text: string, relativePath: string): FileReification {
  return inspectSdp(text, relativePath).reification;
}
