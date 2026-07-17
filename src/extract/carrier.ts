import { Project } from "ts-morph";

import type { Finding } from "../validate/contracts.js";
import { extractFindingIds, reifySourceFile } from "./reify.js";
import type { ReifiedPack, ReifiedSpec } from "./reify.js";

const invalidFrontmatterFindingId = "extract/invalid-frontmatter";

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

/**
 * Reifies exactly one TypeScript carrier from source text. Source construction, syntax diagnostics,
 * and AST mapping stay inside this total boundary; discovery and cross-file coordination stay in
 * `extract()`.
 */
export const reifyTypeScriptCarrier: CarrierReifier = (sourceText, relativePath) => {
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

    return reifySourceFile(sourceFile, relativePath);
  } catch (error: unknown) {
    return reificationFailure(extractFindingIds.parseError, relativePath, error);
  }
};

/**
 * The public Markdown carrier seam. The bounded grammar lands in the next parser slices; until
 * then every input refuses loudly rather than being silently ignored or misclassified.
 */
export const reifyMarkdownCarrier: CarrierReifier = (sourceText, relativePath) => ({
  specs: [],
  packs: [],
  findings: [
    finding(
      invalidFrontmatterFindingId,
      sourceText.length === 0
        ? "Markdown carrier reification is not available yet; an empty carrier cannot be mapped"
        : "Markdown carrier reification is not available yet; carrier content cannot be mapped",
      relativePath,
      1,
    ),
  ],
});
