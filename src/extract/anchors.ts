import { Node, VariableDeclarationKind } from "ts-morph";
import type { CallExpression, ObjectLiteralExpression, SourceFile } from "ts-morph";

import { CODE_ANCHOR_NAMESPACES } from "../ids.js";
import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { Finding, Severity } from "../validate/contracts.js";
import { graphValidatorIds } from "../validate/validators.js";
import {
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
import { collectProtocolBindings } from "./protocol-bindings.js";
import type { ProtocolBindings, ProtocolBindingScope } from "./protocol-bindings.js";
import type { IdReification } from "./reify.js";

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
  specOracle: "models",
} as const;

const anchorExtractionAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.anchor-extraction"),
  label: "anchor-constant reification seam",
  satisfies: ref("spec:model.anchors"),
});

void anchorExtractionAnchor;

type AnchorBuilderName = keyof typeof ANCHOR_BUILDER_TARGET_FIELDS;

const ANCHOR_ID_NAMESPACES: Record<AnchorBuilderName, readonly string[]> = {
  codeAnchor: CODE_ANCHOR_NAMESPACES,
  specTest: ["test"],
  specOracle: ["oracle"],
};

/** Every protocol authoring builder, for the misplaced-call scan (§1.3 of the Slice-2 plan). */
const AUTHORING_BUILDER_NAMES = new Set<string>([
  "spec",
  "pack",
  "codeAnchor",
  "specTest",
  "specOracle",
]);

export interface ReifiedAnchor {
  /** Plain anchor-shaped data (`CodeAnchor`/`SpecTestAnchor`/`SpecOracleAnchor`) — built from the
   *  AST, never evaluated. */
  readonly data: Record<string, unknown>;
  readonly id: string;
  readonly flavor: "code" | "test" | "oracle";
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

function reifyStructuralId(
  node: Node,
  allowedBuilders: readonly string[],
  expectedNamespaces: readonly string[],
  bindings: ProtocolBindings,
  path: string,
): IdReification {
  const builderCall = resolveBuilderCall(node, bindings);

  if (builderCall === undefined || !allowedBuilders.includes(builderCall.builder)) {
    return {
      ok: false,
      kind: "non-static",
      line: node.getStartLineNumber(),
      reason: `${path} must use ${allowedBuilders.map((name) => `${name}(…)`).join(" or ")} with one string literal`,
    };
  }

  return reifyStaticIdExpression(node, expectedNamespaces, bindings, path);
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
  const authoredLines = new Map<string, number>();
  let sawOpaqueEntry = false;
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

  const failStructural = (
    line: number,
    message: string,
    path: string,
    relatedId?: string,
  ): void => {
    findings.push({
      ...createAnchorFinding(
        graphValidatorIds.structuralAnchors,
        "error",
        message,
        file,
        line,
        subjectId,
        path,
      ),
      ...(relatedId === undefined ? {} : { relatedId }),
    });
    envelopeOk = false;
  };

  for (const property of objectLiteral.getProperties()) {
    if (!Node.isPropertyAssignment(property)) {
      // The absence pass must not call an authored field missing (a non-static field is not an
      // absent one): a shorthand entry still names its field; a spread or accessor is opaque.
      if (Node.isShorthandPropertyAssignment(property)) {
        authoredNames.add(property.getName());
      } else {
        sawOpaqueEntry = true;
      }

      failEnvelope(
        property.getStartLineNumber(),
        "the anchor object literal must be fresh: only plain property assignments are static (a spread or shorthand entry could carry binding fields opaquely)",
      );
      continue;
    }

    const name = readPropertyName(property);

    if (name === undefined) {
      sawOpaqueEntry = true;
      failEnvelope(property.getStartLineNumber(), "computed property names are non-static");
      continue;
    }

    if (authoredNames.has(name)) {
      failEnvelope(property.getStartLineNumber(), duplicatePropertyMessage(name), name);
      continue;
    }

    authoredNames.add(name);
    authoredLines.set(name, property.getStartLineNumber());
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

    if (builder === "codeAnchor" && name === "component") {
      const idResult = reifyStructuralId(
        initializer,
        ["componentAnchorId"],
        ["component"],
        bindings,
        "component",
      );

      if (!idResult.ok) {
        appendAnchorIdFinding(idResult, file, subjectId, "component", findings);
        envelopeOk = false;
        continue;
      }

      data.component = idResult.id;
      continue;
    }

    if (builder === "codeAnchor" && name === "uses") {
      const unwrapped = unwrapTransparent(initializer);

      if (!Node.isArrayLiteralExpression(unwrapped)) {
        failEnvelope(
          initializer.getStartLineNumber(),
          'anchor field "uses" must be a fresh array literal of codeAnchorId(…) references',
          "uses",
        );
        continue;
      }

      const targets: string[] = [];
      let targetsOk = true;

      for (const [position, element] of unwrapped.getElements().entries()) {
        const path = `uses[${String(position)}]`;
        const idResult = reifyStructuralId(
          element,
          ["codeAnchorId", "componentAnchorId"],
          CODE_ANCHOR_NAMESPACES,
          bindings,
          path,
        );

        if (!idResult.ok) {
          appendAnchorIdFinding(idResult, file, subjectId, path, findings);
          envelopeOk = false;
          targetsOk = false;
          continue;
        }

        targets.push(idResult.id);
      }

      if (targetsOk) {
        data.uses = targets;
      }
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
      `anchor field "${name}" is outside the binding contract (id · ${targetField} · label${builder === "codeAnchor" ? " · component · uses" : ""}) — an anchor asserts a binding only, never system-truth content`,
      name,
    );
  }

  if (builder === "codeAnchor") {
    const uses = Array.isArray(data.uses) ? (data.uses as readonly string[]) : undefined;

    if (uses !== undefined) {
      if (uses.length === 0) {
        failStructural(
          authoredLines.get("uses") ?? call.getStartLineNumber(),
          'anchor field "uses" must be non-empty when present',
          "uses",
        );
      }

      const seen = new Set<string>();

      for (const target of uses) {
        if (seen.has(target)) {
          failStructural(
            authoredLines.get("uses") ?? call.getStartLineNumber(),
            `Structural uses target "${target}" is authored more than once; targets must be unique.`,
            "uses",
            target,
          );
          continue;
        }

        seen.add(target);
      }
    }
  }

  // Absence is judged on authored names, never on reified values (see `reifySpecCall`).
  for (const required of ["id", targetField]) {
    if (!authoredNames.has(required) && !sawOpaqueEntry) {
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
    flavor: builder === "codeAnchor" ? "code" : builder === "specTest" ? "test" : "oracle",
    file,
    line: call.getStartLineNumber(),
  };
}

/**
 * Reifies the anchor constants of one source file standalone — no type checker, no import
 * following (static reification without execution, MD-14). Also runs the misplaced-authoring scan:
 * a protocol authoring call outside its recognized surface warns loudly (L2 — a binding the
 * author believes exists must never silently fall out of the graph) and is not extracted. The
 * scan reaches exactly as far as the import-binding contract (`PROTOCOL_MODULE_SPECIFIER`):
 * a call through an out-of-contract binding (`require`, a re-aliased local, an element access)
 * is indistinguishable from any other library's call without evaluating, so it stays silent —
 * the named boundary of the L2 claim, not an oversight.
 */
export function reifyAnchorSourceFile(
  sourceFile: SourceFile,
  relativePath: string,
  bindingScope?: ProtocolBindingScope,
): AnchorFileReification {
  const bindings = collectProtocolBindings(sourceFile, bindingScope);

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
