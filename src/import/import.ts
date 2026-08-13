import { reifyTypeScriptCarrier } from "../extract/carrier.js";
import { emitMarkdownSpec } from "./emit-markdown.js";
import { MarkdownEmissionError } from "./markdown-fidelity.js";
import type { Finding } from "../validate/contracts.js";

export const importFindingIds = {
  refusal: "import/refusal",
  packUnsupported: "import/pack-unsupported",
  targetExists: "import/target-exists",
  unsupportedConstruct: "import/unsupported-construct",
  invalidSourcePath: "import/invalid-source-path",
  noSources: "import/no-sources",
  empty: "import/empty",
} as const;

export interface ImportResult {
  readonly emitted?: {
    readonly path: string;
    readonly content: string;
  };
  readonly findings: readonly Finding[];
}

function importFinding(
  validatorId: (typeof importFindingIds)[keyof typeof importFindingIds],
  message: string,
  file: string,
): Finding {
  return {
    validatorId,
    family: "conformance",
    severity: "error",
    message,
    file,
  };
}

export function importTypeScriptSpec(sourceText: string, relativePath: string): ImportResult {
  if (!relativePath.endsWith(".sdp.ts")) {
    return {
      findings: [
        importFinding(
          importFindingIds.invalidSourcePath,
          "the TypeScript import source must end with .sdp.ts",
          relativePath,
        ),
      ],
    };
  }

  // No binding scope on purpose: imported carriers must use the public package specifier;
  // relative builder imports are a source-checkout affordance and refuse here (fail-closed).
  const reification = reifyTypeScriptCarrier(sourceText, relativePath);

  if (reification.findings.length > 0) {
    return {
      findings: [
        ...reification.findings,
        importFinding(importFindingIds.refusal, "the TypeScript carrier was refused", relativePath),
      ],
    };
  }

  const packFindings =
    reification.packs.length === 0
      ? []
      : [
          importFinding(
            importFindingIds.packUnsupported,
            "`sdp import` converts Spec carriers; Pack manifests are out of scope — the TypeScript manifest stays a lawful per-ID option",
            relativePath,
          ),
        ];

  if (reification.specs.length > 1) {
    return {
      findings: [
        ...packFindings,
        importFinding(
          importFindingIds.unsupportedConstruct,
          "the TypeScript carrier reifies more than one Spec",
          relativePath,
        ),
      ],
    };
  }

  const spec = reification.specs[0];
  if (spec === undefined) {
    return {
      findings:
        packFindings.length > 0
          ? packFindings
          : [
              importFinding(
                importFindingIds.empty,
                "the TypeScript carrier contains no Specs or Packs",
                relativePath,
              ),
            ],
    };
  }

  if (packFindings.length > 0) {
    return { findings: packFindings };
  }

  try {
    return {
      emitted: {
        path: relativePath.replace(/\.sdp\.ts$/u, ".sdp.md"),
        content: emitMarkdownSpec(spec),
      },
      findings: [],
    };
  } catch (error) {
    if (error instanceof MarkdownEmissionError) {
      return {
        findings: [
          importFinding(
            importFindingIds.unsupportedConstruct,
            `the TypeScript carrier cannot emit faithful Markdown: ${error.reason}`,
            relativePath,
          ),
        ],
      };
    }
    throw error;
  }
}
