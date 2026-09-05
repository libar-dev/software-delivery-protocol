import { Project } from "ts-morph";

import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { Finding } from "../validate/contracts.js";
export { reifyMarkdownCarrier } from "./markdown.js";
export { reifyGherkinCarrier } from "./gherkin.js";
import { extractFindingIds, reifySourceFile } from "./reify.js";
import type { ReifiedPack, ReifiedSpec } from "./reify.js";
import type { ProtocolBindingScope } from "./protocol-bindings.js";

export interface CarrierReification {
  readonly specs: readonly ReifiedSpec[];
  readonly packs: readonly ReifiedPack[];
  readonly findings: readonly Finding[];
}

export type CarrierReifier = (sourceText: string, relativePath: string) => CarrierReification;

function finding(validatorId: string, message: string, file: string, line: number): Finding {
  return {
    validatorId,
    family: "conformance",
    severity: "error",
    message,
    file,
    line,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "an unknown value was thrown";
}

function reificationFailure(
  validatorId: string,
  relativePath: string,
  error: unknown,
): CarrierReification {
  return {
    specs: [],
    packs: [],
    findings: [
      finding(
        validatorId,
        `the carrier could not be reified: ${errorMessage(error)}`,
        relativePath,
        1,
      ),
    ],
  };
}

const carrierReificationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.carrier-reification"),
  label: "reifies each canonical carrier surface into specs, packs, and findings",
  satisfies: ref("spec:extraction.derive-graph"),
  component: componentAnchorId("component:protocol.extract"),
});
void carrierReificationAnchor;

/**
 * Reifies exactly one TypeScript carrier from source text. Source construction, syntax diagnostics,
 * and AST mapping stay inside this total boundary; discovery and cross-file coordination stay in
 * `extract()`.
 */
export function reifyTypeScriptCarrier(
  sourceText: string,
  relativePath: string,
  bindingScope?: ProtocolBindingScope,
): CarrierReification {
  try {
    const project = new Project({ useInMemoryFileSystem: true, compilerOptions: { noLib: true } });
    const sourceFile = project.createSourceFile(relativePath, sourceText);
    const [firstDiagnostic] = project.getProgram().getSyntacticDiagnostics(sourceFile);

    if (firstDiagnostic !== undefined) {
      const text = firstDiagnostic.getMessageText();

      return {
        specs: [],
        packs: [],
        findings: [
          finding(
            extractFindingIds.parseError,
            `the file does not parse: ${typeof text === "string" ? text : text.getMessageText()} — the error-tolerant parse recovers by guessing, so the file cannot be reified faithfully and its content is excluded`,
            relativePath,
            firstDiagnostic.getLineNumber(),
          ),
        ],
      };
    }

    return reifySourceFile(sourceFile, relativePath, bindingScope);
  } catch (error: unknown) {
    return reificationFailure(
      extractFindingIds.parseError,
      relativePath,
      error instanceof Error ? error : String(error),
    );
  }
}
