import { Node, VariableDeclarationKind } from "ts-morph";
import type { CallExpression, ObjectLiteralExpression, SourceFile } from "ts-morph";

import { CODE_ANCHOR_NAMESPACES } from "../ids.js";
import type { Finding, Severity } from "../validate/contracts.js";
import {
  collectProtocolBindings,
  duplicatePropertyMessage,
  extractFindingIds,
  peekId,
  readPropertyName,
  reifyStaticIdExpression,
  reifyStaticString,
  resolveBuilderCall,
  resolveProtocolCalleeBuilder,
  unwrapTransparent,
} from "./reify.js";
import type { IdReification, ProtocolBindings } from "./reify.js";

/**
 * Anchor reification — the anchored layer's producer half (`04` §2). Source files are real product
 * code, so there is no recognized-statement sweep here (the opposite of spec files): the extractor
 * only looks for the anchor-constant form — a top-level `const` initialized with a
 * `codeAnchor(…)`/`specTest(…)` call bound to the protocol import. The decorator and JSDoc forms
 * stay unextracted Representations.
 *
 * An anchor is almost all envelope: `id` and the `satisfies`/`verifies` target are binding
 * identity (hard errors when non-static or grammar-failing); only `label` is degradable detail.
 */

const ANCHOR_BUILDER_TARGET_FIELDS = {
  codeAnchor: "satisfies",
  specTest: "verifies",
} as const;

type AnchorBuilderName = keyof typeof ANCHOR_BUILDER_TARGET_FIELDS;

const ANCHOR_ID_NAMESPACES: Record<AnchorBuilderName, readonly string[]> = {
  codeAnchor: CODE_ANCHOR_NAMESPACES,
  specTest: ["test"],
};

/** Every protocol authoring builder, for the misplaced-call scan (§1.3 of the Slice-2 plan). */
const AUTHORING_BUILDER_NAMES = new Set<string>(["spec", "pack", "codeAnchor", "specTest"]);

export interface ReifiedAnchor {
  /** Plain `CodeAnchor`/`SpecTestAnchor`-shaped data — built from the AST, never evaluated. */
  readonly data: Record<string, unknown>;
  readonly id: string;
  readonly flavor: "code" | "test";
  readonly file: string;
  readonly line: number;
}

export interface AnchorFileReification {
  readonly anchors: readonly ReifiedAnchor[];
  readonly findings: readonly Finding[];
}

function createAnchorFinding(
  validatorId: string,
  severity: Severity,
  message: string,
  file: string,
  line: number,
  subjectId?: string,
  path?: string,
): Finding {
  return {
    validatorId,
    family: "conformance",
    severity,
    // Location lives in the structured `file`/`line` fields only; renderers print it (one
    // diagnostic rendering rule — same as `createExtractFinding`).
    message,
    subjectId,
    path,
    file,
    line,
  };
}

function isAnchorBuilderName(builder: string): builder is AnchorBuilderName {
  return builder in ANCHOR_BUILDER_TARGET_FIELDS;
}

function appendAnchorIdFinding(
  failure: Exclude<IdReification, { ok: true }>,
  file: string,
  subjectId: string | undefined,
  path: string,
  findings: Finding[],
): void {
  findings.push(
    createAnchorFinding(
      failure.kind === "non-static"
        ? extractFindingIds.nonStaticEnvelope
        : extractFindingIds.invalidId,
      "error",
      `anchor field "${path}" did not reify: ${failure.reason}`,
      file,
      failure.line,
      subjectId,
      path,
    ),
  );
}

function reifyAnchorCall(
  call: CallExpression,
  builder: AnchorBuilderName,
  file: string,
  bindings: ProtocolBindings,
  findings: Finding[],
): ReifiedAnchor | undefined {
  const callArguments = call.getArguments();
  const [firstArgument] = callArguments;
  let objectLiteral: ObjectLiteralExpression | undefined;

  if (callArguments.length === 1 && firstArgument !== undefined) {
    const unwrapped = unwrapTransparent(firstArgument);

    if (Node.isObjectLiteralExpression(unwrapped)) {
      objectLiteral = unwrapped;
    }
  }

  if (objectLiteral === undefined) {
    findings.push(
      createAnchorFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        `${builder}(…) must take exactly one fresh object literal argument`,
        file,
        call.getStartLineNumber(),
      ),
    );

    return undefined;
  }

  const targetField = ANCHOR_BUILDER_TARGET_FIELDS[builder];
  const subjectId = peekId(objectLiteral, ANCHOR_ID_NAMESPACES[builder], bindings);
  const data: Record<string, unknown> = {};
  const authoredNames = new Set<string>();
  let envelopeOk = true;

  const failEnvelope = (line: number, message: string, path?: string): void => {
    findings.push(
      createAnchorFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        message,
        file,
        line,
        subjectId,
        path,
      ),
    );
    envelopeOk = false;
  };

  for (const property of objectLiteral.getProperties()) {
    if (!Node.isPropertyAssignment(property)) {
      failEnvelope(
        property.getStartLineNumber(),
        "the anchor object literal must be fresh: only plain property assignments are static (a spread or shorthand entry could carry binding fields opaquely)",
      );
      continue;
    }

    const name = readPropertyName(property);

    if (name === undefined) {
      failEnvelope(property.getStartLineNumber(), "computed property names are non-static");
      continue;
    }

    if (authoredNames.has(name)) {
      failEnvelope(property.getStartLineNumber(), duplicatePropertyMessage(name), name);
      continue;
    }

    authoredNames.add(name);
    const initializer = property.getInitializer();

    if (initializer === undefined) {
      failEnvelope(
        property.getStartLineNumber(),
        `property "${name}" carries no initializer`,
        name,
      );
      continue;
    }

    if (name === "id") {
      const idResult = reifyStaticIdExpression(
        initializer,
        ANCHOR_ID_NAMESPACES[builder],
        bindings,
        "id",
      );

      if (!idResult.ok) {
        appendAnchorIdFinding(idResult, file, subjectId, "id", findings);
        envelopeOk = false;
        continue;
      }

      data.id = idResult.id;
      continue;
    }

    if (name === targetField) {
      const idResult = reifyStaticIdExpression(initializer, ["spec"], bindings, targetField);

      if (!idResult.ok) {
        appendAnchorIdFinding(idResult, file, subjectId, targetField, findings);
        envelopeOk = false;
        continue;
      }

      data[targetField] = idResult.id;
      continue;
    }

    if (name === "label") {
      const result = reifyStaticString(initializer, "label");

      if (!result.ok) {
        findings.push(
          createAnchorFinding(
            extractFindingIds.nonStaticSection,
            "warning",
            `property "label" dropped: at "${result.failure.path}", ${result.failure.reason}`,
            file,
            result.failure.line,
            subjectId,
            "label",
          ),
        );
        continue;
      }

      data.label = result.value;
      continue;
    }

    // An anchor asserts a binding only — never system-truth content (R1). The typed anchor cannot
    // carry a foreign field, so a smuggled one (readiness, a delivery fact, acceptance criteria)
    // is an envelope error, not droppable detail — the extraction-layer twin of authoring-shape
    // honesty, on the anchored surface.
    failEnvelope(
      property.getStartLineNumber(),
      `anchor field "${name}" is outside the binding contract (id · ${targetField} · label) — an anchor asserts a binding only, never system-truth content`,
      name,
    );
  }

  // Absence is judged on authored names, never on reified values (see `reifySpecCall`).
  for (const required of ["id", targetField]) {
    if (!authoredNames.has(required)) {
      failEnvelope(
        call.getStartLineNumber(),
        `anchor field "${required}" is missing — the binding cannot be constructed without it`,
        required,
      );
    }
  }

  if (!envelopeOk) {
    return undefined;
  }

  return {
    data,
    id: data.id as string,
    flavor: builder === "codeAnchor" ? "code" : "test",
    file,
    line: call.getStartLineNumber(),
  };
}

/**
 * Reifies the anchor constants of one source file standalone — no type checker, no import
 * following (static reification without execution, MD-14). Also runs the misplaced-authoring scan:
 * any protocol authoring call outside its recognized surface warns loudly (L2 — a binding the
 * author believes exists must never silently fall out of the graph) and is not extracted.
 */
export function reifyAnchorSourceFile(
  sourceFile: SourceFile,
  relativePath: string,
): AnchorFileReification {
  const bindings = collectProtocolBindings(sourceFile);

  if (bindings.named.size === 0 && bindings.namespaceLocals.size === 0) {
    return { anchors: [], findings: [] };
  }

  const anchors: ReifiedAnchor[] = [];
  const findings: Finding[] = [];
  const recognizedCalls = new Set<CallExpression>();

  for (const statement of sourceFile.getStatements()) {
    if (!Node.isVariableStatement(statement)) {
      continue;
    }

    if (statement.getDeclarationKind() !== VariableDeclarationKind.Const) {
      continue;
    }

    for (const declaration of statement.getDeclarations()) {
      const initializer = declaration.getInitializer();
      const builderCall =
        initializer === undefined ? undefined : resolveBuilderCall(initializer, bindings);

      if (builderCall === undefined || !isAnchorBuilderName(builderCall.builder)) {
        continue;
      }

      recognizedCalls.add(builderCall.call);
      const reified = reifyAnchorCall(
        builderCall.call,
        builderCall.builder,
        relativePath,
        bindings,
        findings,
      );

      if (reified !== undefined) {
        anchors.push(reified);
      }
    }
  }

  sourceFile.forEachDescendant((node) => {
    if (!Node.isCallExpression(node)) {
      return;
    }

    const builder = resolveProtocolCalleeBuilder(node.getExpression(), bindings);

    if (builder === undefined || !AUTHORING_BUILDER_NAMES.has(builder)) {
      return;
    }

    if (recognizedCalls.has(node)) {
      return;
    }

    const surface = isAnchorBuilderName(builder)
      ? "an anchor binds through a top-level const declaration (the anchor-constant form)"
      : "spec(…)/pack(…) calls are extracted from *.sdp.ts files only (the .sdp.ts extension, MD-15)";

    findings.push(
      createAnchorFinding(
        extractFindingIds.misplacedAuthoring,
        "warning",
        `"${builder}(…)" call is outside its recognized authoring surface and is not extracted — ${surface}`,
        relativePath,
        node.getStartLineNumber(),
      ),
    );
  });

  return { anchors, findings };
}
