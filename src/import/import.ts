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

interface ImportFinding {
  readonly validatorId: (typeof importFindingIds)[keyof typeof importFindingIds];
  readonly family: "conformance";
  readonly severity: "info";
  readonly message: string;
  readonly file: string;
  readonly line: number;
}

export interface ImportResult {
  readonly emitted?: {
    readonly path: string;
    readonly content: string;
  };
  readonly findings: readonly (Finding | ImportFinding)[];
}

function importFinding(
  validatorId: ImportFinding["validatorId"],
  message: string,
  file: string,
): ImportFinding {
  return {
    validatorId,
    family: "conformance",
    severity: "info",
    message,
    file,
    line: 1,
  };
}

export function importTypeScriptSpec(sourceText: string, relativePath: string): ImportResult {
  if (!relativePath.endsWith(".sdp.ts")) {
    return {
      findings: [
        importFinding(
          importFindingIds.invalidSourcePath,
          `the TypeScript import source must end with .sdp.ts: ${relativePath}`,
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
        importFinding(
          importFindingIds.refusal,
          `the TypeScript carrier at ${relativePath} was refused`,
          relativePath,
        ),
      ],
    };
  }

  if (reification.specs.length > 1) {
    return {
      findings: [
        importFinding(
          importFindingIds.unsupportedConstruct,
          `the TypeScript carrier at ${relativePath} reifies more than one Spec`,
          relativePath,
        ),
      ],
    };
  }

  const packFindings =
    reification.packs.length === 0
      ? []
      : [
          importFinding(
            importFindingIds.packUnsupported,
            `the Pack portion of ${relativePath} remains TypeScript-authored`,
            relativePath,
          ),
        ];

  const spec = reification.specs[0];
  if (spec === undefined) {
    return {
      findings:
        packFindings.length > 0
          ? packFindings
          : [
              importFinding(
                importFindingIds.empty,
                `the TypeScript carrier at ${relativePath} contains no Specs or Packs`,
                relativePath,
              ),
            ],
    };
  }

  try {
    return {
      emitted: {
        path: relativePath.replace(/\.sdp\.ts$/u, ".sdp.md"),
        content: emitMarkdownSpec(spec),
      },
      findings: packFindings,
    };
  } catch (error) {
    if (error instanceof MarkdownEmissionError) {
      return {
        findings: [
          ...packFindings,
          importFinding(
            importFindingIds.unsupportedConstruct,
            `the TypeScript carrier at ${relativePath} cannot emit faithful Markdown: ${error.reason}`,
            relativePath,
          ),
        ],
      };
    }
    throw error;
  }
}
