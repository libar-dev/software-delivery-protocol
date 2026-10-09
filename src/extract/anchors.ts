import { Node, VariableDeclarationKind } from "ts-morph";
import type { CallExpression, ObjectLiteralExpression, SourceFile, Statement } from "ts-morph";

import { CODE_ANCHOR_NAMESPACES } from "../ids.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { CODE_ANCHOR_LAYERS } from "../model/anchors.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { Finding, Severity } from "../validate/contracts.js";
import { graphValidatorIds } from "../validate/validators.js";
import {
  checkIdText,
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
 * reads the two representations of an anchor and nothing else. The **constant form** is a
 * top-level `const` initialized with a `codeAnchor(…)`/`specTest(…)`/`specOracle(…)` call bound
 * to a Protocol import. The **comment form** (`spec:decisions.anchor-comment-form`) is a `/** … *\/`
 * block leading a top-level statement and carrying reserved `@sdp-*` lines; it needs no import.
 * Both feed one closed envelope, so identical content yields identical graph data.
 *
 * An anchor is almost all envelope: the id, the binding targets, and the structural attributes
 * are binding identity (hard errors when non-static or grammar-failing); only `label` is
 * degradable detail.
 */

type AnchorFlavor = "code" | "test" | "oracle";

const ANCHOR_BUILDER_FLAVORS = {
  codeAnchor: "code",
  specTest: "test",
  specOracle: "oracle",
} as const;

type AnchorBuilderName = keyof typeof ANCHOR_BUILDER_FLAVORS;

const FLAVOR_TARGET_FIELDS: Record<AnchorFlavor, "satisfies" | "verifies" | "models"> = {
  code: "satisfies",
  test: "verifies",
  oracle: "models",
};

const FLAVOR_ID_NAMESPACES: Record<AnchorFlavor, readonly string[]> = {
  code: CODE_ANCHOR_NAMESPACES,
  test: ["test"],
  oracle: ["oracle"],
};

const ANCHOR_ID_NAMESPACES: readonly string[] = [
  ...FLAVOR_ID_NAMESPACES.code,
  ...FLAVOR_ID_NAMESPACES.test,
  ...FLAVOR_ID_NAMESPACES.oracle,
];

/** The closed envelope per flavor, in the order the contract message lists it. */
const FLAVOR_CONTRACTS: Record<AnchorFlavor, readonly string[]> = {
  code: ["id", "satisfies", "label", "component", "uses", "references", "role", "layer", "context"],
  test: ["id", "verifies", "label"],
  oracle: ["id", "models", "label"],
};

/** The fields a `component:` anchor alone may carry (the architectural annotation decision). */
const COMPONENT_ONLY_FIELDS: ReadonlySet<string> = new Set(["layer", "context"]);

const CODE_ANCHOR_LAYER_SET: ReadonlySet<string> = new Set(CODE_ANCHOR_LAYERS);

/** Every protocol authoring builder, for the misplaced-call scan (§1.3 of the Slice-2 plan). */
const AUTHORING_BUILDER_NAMES = new Set<string>([
  "spec",
  "pack",
  "codeAnchor",
  "specTest",
  "specOracle",
]);

/**
 * The comment-form line grammar: one reserved tag per line, read off the raw comment text after
 * the delimiters are stripped, never through the TypeScript JSDoc tag parser. A tag with no value
 * still matches, so it can be refused loudly rather than ignored.
 */
const ANCHOR_COMMENT_TAG_LINE = /^\s*\*?\s*@sdp-([a-z]+)(?:\s+(.*?))?\s*$/u;
const ANCHOR_COMMENT_OPEN = "/**";
const ANCHOR_COMMENT_CLOSE = "*/";

/** The tag names map onto the envelope fields one to one, except the opener. */
const ANCHOR_COMMENT_TAG_FIELDS: ReadonlyMap<string, string> = new Map([["anchor", "id"]]);

const anchorExtractionAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.anchor-extraction"),
  label: "anchor reification seam: the constant form and the comment form",
  satisfies: ref("spec:model.anchors"),
  component: componentAnchorId("component:protocol.extract"),
});

void anchorExtractionAnchor;

export interface ReifiedAnchor {
  /** Plain anchor-shaped data (`CodeAnchor`/`SpecTestAnchor`/`SpecOracleAnchor`) — built from the
   *  AST or the comment text, never evaluated. Binding targets (`satisfies`, `verifies`) are
   *  always lists here, whichever shape the author wrote. */
  readonly data: Record<string, unknown>;
  readonly id: string;
  readonly flavor: AnchorFlavor;
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
  return builder in ANCHOR_BUILDER_FLAVORS;
}

function namespaceOf(id: string): string {
  return id.slice(0, id.indexOf(":"));
}

function flavorOfNamespace(namespace: string): AnchorFlavor | undefined {
  return FLAVOR_ID_NAMESPACES.code.includes(namespace)
    ? "code"
    : FLAVOR_ID_NAMESPACES.test.includes(namespace)
      ? "test"
      : FLAVOR_ID_NAMESPACES.oracle.includes(namespace)
        ? "oracle"
        : undefined;
}

type IdFailure = Exclude<IdReification, { ok: true }>;

/* ----- the one envelope, fed by two field readers ----- */

/**
 * A field's value as one representation offers it. The constant form reads AST nodes (id builders
 * unwrap in id slots, structural ids must come through their builders, lists are fresh array
 * literals); the comment form reads tag text (lists split on commas). Each reader reports its own
 * failures through the envelope and returns `undefined` when the field cannot be kept.
 */
interface FieldReader {
  /** One id. `structuralBuilders` names the builders a structural slot insists on. */
  id(
    expectedNamespaces: readonly string[],
    path: string,
    structuralBuilders?: readonly string[],
  ): string | undefined;
  /** A list of ids; the whole list fails when its shape or any element fails. */
  idList(
    expectedNamespaces: readonly string[],
    path: string,
    structuralBuilders?: readonly string[],
  ): readonly string[] | undefined;
  /** One id or a list of ids, normalized to a list (`satisfies` / `verifies`). */
  idOrList(expectedNamespaces: readonly string[], path: string): readonly string[] | undefined;
  /** A static string. Degradable fields drop with a warning; the rest fail the envelope. */
  text(path: string, degradable: boolean): string | undefined;
}

class AnchorEnvelope {
  readonly data: Record<string, unknown> = {};
  readonly authoredNames = new Set<string>();
  readonly authoredLines = new Map<string, number>();
  sawOpaqueEntry = false;
  envelopeOk = true;

  constructor(
    readonly flavor: AnchorFlavor,
    readonly file: string,
    readonly siteLine: number,
    readonly subjectId: string | undefined,
    readonly findings: Finding[],
  ) {}

  failEnvelope(line: number, message: string, path?: string): void {
    this.findings.push(
      createAnchorFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        message,
        this.file,
        line,
        this.subjectId,
        path,
      ),
    );
    this.envelopeOk = false;
  }

  failStructural(line: number, message: string, path: string, relatedId?: string): void {
    this.findings.push({
      ...createAnchorFinding(
        graphValidatorIds.structuralAnchors,
        "error",
        message,
        this.file,
        line,
        this.subjectId,
        path,
      ),
      ...(relatedId === undefined ? {} : { relatedId }),
    });
    this.envelopeOk = false;
  }

  failId(failure: IdFailure, path: string): void {
    this.findings.push(
      createAnchorFinding(
        failure.kind === "non-static"
          ? extractFindingIds.nonStaticEnvelope
          : extractFindingIds.invalidId,
        "error",
        `anchor field "${path}" did not reify: ${failure.reason}`,
        this.file,
        failure.line,
        this.subjectId,
        path,
      ),
    );
    this.envelopeOk = false;
  }

  dropDetail(line: number, path: string, reason: string): void {
    this.findings.push(
      createAnchorFinding(
        extractFindingIds.nonStaticSection,
        "warning",
        `property "${path}" dropped: at "${path}", ${reason}`,
        this.file,
        line,
        this.subjectId,
        path,
      ),
    );
  }

  /** Records an authored name; a repeat is ambiguity (L2) and fails the envelope. */
  markAuthored(name: string, line: number): boolean {
    if (this.authoredNames.has(name)) {
      this.failEnvelope(line, duplicatePropertyMessage(name), name);
      return false;
    }

    this.authoredNames.add(name);
    this.authoredLines.set(name, line);
    return true;
  }

  private contractMessage(name: string): string {
    return `anchor field "${name}" is outside the binding contract (${FLAVOR_CONTRACTS[this.flavor].join(" · ")}) — an anchor asserts a binding only, never system-truth content`;
  }

  /** One authored field, dispatched by name under the flavor's closed envelope. */
  field(name: string, line: number, reader: FieldReader): void {
    if (!this.markAuthored(name, line)) {
      return;
    }

    const targetField = FLAVOR_TARGET_FIELDS[this.flavor];

    if (name === "id") {
      const id = reader.id(FLAVOR_ID_NAMESPACES[this.flavor], "id");

      if (id !== undefined) {
        this.data.id = id;
      }
      return;
    }

    if (name === targetField) {
      if (this.flavor === "oracle") {
        const id = reader.id(["spec"], name);

        if (id !== undefined) {
          this.data[name] = id;
        }
        return;
      }

      const targets = reader.idOrList(["spec"], name);

      if (targets !== undefined) {
        this.data[name] = targets;
      }
      return;
    }

    if (name === "label") {
      const label = reader.text("label", true);

      if (label !== undefined) {
        this.data.label = label;
      }
      return;
    }

    if (this.flavor === "code") {
      switch (name) {
        case "component": {
          const id = reader.id(["component"], "component", ["componentAnchorId"]);

          if (id !== undefined) {
            this.data.component = id;
          }
          return;
        }
        case "uses": {
          const ids = reader.idList(CODE_ANCHOR_NAMESPACES, "uses", [
            "codeAnchorId",
            "componentAnchorId",
          ]);

          if (ids !== undefined) {
            this.data.uses = ids;
          }
          return;
        }
        case "references": {
          const ids = reader.idList(["spec"], "references");

          if (ids !== undefined) {
            this.data.references = ids;
          }
          return;
        }
        case "role":
        case "context": {
          const value = reader.text(name, false);

          if (value !== undefined) {
            this.data[name] = value;
          }
          return;
        }
        case "layer": {
          const value = reader.text("layer", false);

          if (value === undefined) {
            return;
          }

          if (!CODE_ANCHOR_LAYER_SET.has(value)) {
            this.failEnvelope(
              line,
              `anchor field "layer" reified to "${value}", which is not one of ${CODE_ANCHOR_LAYERS.join(" · ")} — the layer set is closed`,
              "layer",
            );
            return;
          }

          this.data.layer = value;
          return;
        }
        default:
          break;
      }
    }

    // An anchor asserts a binding only — never system-truth content (R1). The typed anchor cannot
    // carry a foreign field, so a smuggled one (readiness, a delivery fact, acceptance criteria)
    // is an envelope error, not droppable detail — the extraction-layer twin of authoring-shape
    // honesty, on the anchored surface.
    this.failEnvelope(line, this.contractMessage(name), name);
  }

  private lineOf(name: string): number {
    return this.authoredLines.get(name) ?? this.siteLine;
  }

  private checkTargetList(name: string): void {
    const targets = this.data[name];

    if (!Array.isArray(targets)) {
      return;
    }

    const list = targets as readonly string[];

    if (list.length === 0) {
      this.failEnvelope(
        this.lineOf(name),
        `anchor field "${name}" must name at least one target when present`,
        name,
      );
    }

    const seen = new Set<string>();

    for (const target of list) {
      if (seen.has(target)) {
        this.failEnvelope(
          this.lineOf(name),
          `anchor target "${target}" is authored more than once in "${name}" (ambiguity is loud, L2); one edge per target, so the anchor is not extracted`,
          name,
        );
        continue;
      }

      seen.add(target);
    }
  }

  private checkStructuralList(name: string, describe: string): void {
    const targets = this.data[name];

    if (!Array.isArray(targets)) {
      return;
    }

    const list = targets as readonly string[];

    if (list.length === 0) {
      this.failStructural(
        this.lineOf(name),
        `anchor field "${name}" must be non-empty when present`,
        name,
      );
    }

    const seen = new Set<string>();

    for (const target of list) {
      if (seen.has(target)) {
        this.failStructural(
          this.lineOf(name),
          `${describe} target "${target}" is authored more than once; targets must be unique.`,
          name,
          target,
        );
        continue;
      }

      seen.add(target);
    }
  }

  private checkCodeStructure(): void {
    this.checkStructuralList("uses", "Structural uses");
    this.checkStructuralList("references", "References");

    const satisfies = Array.isArray(this.data.satisfies)
      ? new Set(this.data.satisfies as readonly string[])
      : new Set<string>();
    const references = Array.isArray(this.data.references)
      ? (this.data.references as readonly string[])
      : [];

    for (const target of references) {
      if (satisfies.has(target)) {
        this.failStructural(
          this.lineOf("references"),
          `Spec "${target}" is named in both "satisfies" and "references"; a realized target is not also a design reference.`,
          "references",
          target,
        );
      }
    }

    // `layer` and `context` describe the declared component (v0 03 §2.5); on any other code
    // anchor they are foreign fields. Judged on authored names, so a value that failed to reify
    // is still called out once, and only when the id resolved to a non-component namespace.
    const id = this.data.id;

    if (typeof id !== "string" || namespaceOf(id) === "component") {
      return;
    }

    for (const name of COMPONENT_ONLY_FIELDS) {
      if (this.authoredNames.has(name)) {
        this.failEnvelope(
          this.lineOf(name),
          `anchor field "${name}" belongs to a component: anchor only; "${id}" declares no component`,
          name,
        );
      }
    }
  }

  /** The closing pass: structural law, then absence, judged on authored names only. */
  finish(): ReifiedAnchor | undefined {
    if (this.flavor === "code") {
      this.checkTargetList("satisfies");
      this.checkCodeStructure();
    } else if (this.flavor === "test") {
      this.checkTargetList("verifies");
    }

    const required = this.flavor === "code" ? ["id"] : ["id", FLAVOR_TARGET_FIELDS[this.flavor]];

    for (const name of required) {
      if (!this.authoredNames.has(name) && !this.sawOpaqueEntry) {
        this.failEnvelope(
          this.siteLine,
          `anchor field "${name}" is missing — the binding cannot be constructed without it`,
          name,
        );
      }
    }

    if (!this.envelopeOk) {
      return undefined;
    }

    return {
      data: this.data,
      id: this.data.id as string,
      flavor: this.flavor,
      file: this.file,
      line: this.siteLine,
    };
  }
}

/* ----- the constant form ----- */

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

function constantFieldReader(
  initializer: Node,
  bindings: ProtocolBindings,
  envelope: AnchorEnvelope,
): FieldReader {
  const readId = (
    node: Node,
    expectedNamespaces: readonly string[],
    path: string,
    structuralBuilders?: readonly string[],
  ): string | undefined => {
    const result =
      structuralBuilders === undefined
        ? reifyStaticIdExpression(node, expectedNamespaces, bindings, path)
        : reifyStructuralId(node, structuralBuilders, expectedNamespaces, bindings, path);

    if (!result.ok) {
      envelope.failId(result, path);
      return undefined;
    }

    return result.id;
  };

  const readElements = (
    elements: readonly Node[],
    expectedNamespaces: readonly string[],
    path: string,
    structuralBuilders?: readonly string[],
  ): readonly string[] | undefined => {
    const ids: string[] = [];
    let ok = true;

    for (const [position, element] of elements.entries()) {
      const id = readId(
        element,
        expectedNamespaces,
        `${path}[${String(position)}]`,
        structuralBuilders,
      );

      if (id === undefined) {
        ok = false;
        continue;
      }

      ids.push(id);
    }

    return ok ? ids : undefined;
  };

  return {
    id: (expectedNamespaces, path, structuralBuilders) =>
      readId(initializer, expectedNamespaces, path, structuralBuilders),
    idList: (expectedNamespaces, path, structuralBuilders) => {
      const unwrapped = unwrapTransparent(initializer);

      if (!Node.isArrayLiteralExpression(unwrapped)) {
        envelope.failEnvelope(
          initializer.getStartLineNumber(),
          `anchor field "${path}" must be a fresh array literal of ${structuralBuilders === undefined ? "ref(…)" : structuralBuilders.map((name) => `${name}(…)`).join(" or ")} references`,
          path,
        );
        return undefined;
      }

      return readElements(unwrapped.getElements(), expectedNamespaces, path, structuralBuilders);
    },
    idOrList: (expectedNamespaces, path) => {
      const unwrapped = unwrapTransparent(initializer);

      if (Node.isArrayLiteralExpression(unwrapped)) {
        return readElements(unwrapped.getElements(), expectedNamespaces, path);
      }

      const id = readId(unwrapped, expectedNamespaces, path);
      return id === undefined ? undefined : [id];
    },
    text: (path, degradable) => {
      const result = reifyStaticString(initializer, path);

      if (result.ok) {
        return result.value as string;
      }

      if (degradable) {
        envelope.dropDetail(result.failure.line, path, result.failure.reason);
      } else {
        envelope.failEnvelope(
          result.failure.line,
          `anchor field "${path}" did not reify: ${result.failure.reason}`,
          path,
        );
      }

      return undefined;
    },
  };
}

function reifyAnchorCall(
  call: CallExpression,
  builder: AnchorBuilderName,
  file: string,
  bindings: ProtocolBindings,
  findings: Finding[],
): ReifiedAnchor | undefined {
  const flavor = ANCHOR_BUILDER_FLAVORS[builder];
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

  const subjectId = peekId(objectLiteral, FLAVOR_ID_NAMESPACES[flavor], bindings);
  const envelope = new AnchorEnvelope(flavor, file, call.getStartLineNumber(), subjectId, findings);

  for (const property of objectLiteral.getProperties()) {
    if (!Node.isPropertyAssignment(property)) {
      // The absence pass must not call an authored field missing (a non-static field is not an
      // absent one): a shorthand entry still names its field; a spread or accessor is opaque.
      if (Node.isShorthandPropertyAssignment(property)) {
        envelope.authoredNames.add(property.getName());
      } else {
        envelope.sawOpaqueEntry = true;
      }

      envelope.failEnvelope(
        property.getStartLineNumber(),
        "the anchor object literal must be fresh: only plain property assignments are static (a spread or shorthand entry could carry binding fields opaquely)",
      );
      continue;
    }

    const name = readPropertyName(property);

    if (name === undefined) {
      envelope.sawOpaqueEntry = true;
      envelope.failEnvelope(
        property.getStartLineNumber(),
        "computed property names are non-static",
      );
      continue;
    }

    const initializer = property.getInitializer();

    if (initializer === undefined) {
      if (envelope.markAuthored(name, property.getStartLineNumber())) {
        envelope.failEnvelope(
          property.getStartLineNumber(),
          `property "${name}" carries no initializer`,
          name,
        );
      }
      continue;
    }

    envelope.field(
      name,
      property.getStartLineNumber(),
      constantFieldReader(initializer, bindings, envelope),
    );
  }

  return envelope.finish();
}

/* ----- the comment form ----- */

interface AnchorCommentTag {
  readonly name: string;
  readonly value: string | undefined;
  readonly line: number;
}

function commentFieldReader(
  tag: AnchorCommentTag,
  value: string,
  envelope: AnchorEnvelope,
): FieldReader {
  const readId = (
    text: string,
    expectedNamespaces: readonly string[],
    path: string,
  ): string | undefined => {
    const checked = checkIdText(text, expectedNamespaces);

    if (!checked.ok) {
      envelope.failId({ ok: false, kind: "invalid", line: tag.line, reason: checked.reason }, path);
      return undefined;
    }

    return checked.id;
  };

  const readList = (
    expectedNamespaces: readonly string[],
    path: string,
  ): readonly string[] | undefined => {
    const ids: string[] = [];
    let ok = true;

    for (const [position, entry] of value.split(",").entries()) {
      const id = readId(entry.trim(), expectedNamespaces, `${path}[${String(position)}]`);

      if (id === undefined) {
        ok = false;
        continue;
      }

      ids.push(id);
    }

    return ok ? ids : undefined;
  };

  return {
    id: (expectedNamespaces, path) => readId(value, expectedNamespaces, path),
    idList: readList,
    idOrList: readList,
    text: () => value,
  };
}

/** The leading `/** … *\/` blocks of one statement, each reduced to its reserved tag lines. */
function readAnchorCommentBlocks(
  statement: Statement,
  sourceFile: SourceFile,
): readonly { readonly line: number; readonly tags: readonly AnchorCommentTag[] }[] {
  const blocks: { readonly line: number; readonly tags: readonly AnchorCommentTag[] }[] = [];

  for (const range of statement.getLeadingCommentRanges()) {
    const text = range.getText();

    if (
      !text.startsWith(ANCHOR_COMMENT_OPEN) ||
      !text.endsWith(ANCHOR_COMMENT_CLOSE) ||
      text.length < ANCHOR_COMMENT_OPEN.length + ANCHOR_COMMENT_CLOSE.length
    ) {
      continue;
    }

    const line = sourceFile.getLineAndColumnAtPos(range.getPos()).line;
    const body = text.slice(ANCHOR_COMMENT_OPEN.length, -ANCHOR_COMMENT_CLOSE.length);
    const tags: AnchorCommentTag[] = [];

    for (const [offset, rawLine] of body.split(/\r?\n/u).entries()) {
      const match = ANCHOR_COMMENT_TAG_LINE.exec(rawLine);

      if (match?.[1] === undefined) {
        continue;
      }

      const value = match[2];
      tags.push({
        name: match[1],
        value: value === undefined || value.length === 0 ? undefined : value,
        line: line + offset,
      });
    }

    if (tags.length > 0) {
      blocks.push({ line, tags });
    }
  }

  return blocks;
}

function reifyAnchorComment(
  block: { readonly line: number; readonly tags: readonly AnchorCommentTag[] },
  file: string,
  findings: Finding[],
): ReifiedAnchor | undefined {
  const opener = block.tags.find((tag) => tag.name === "anchor");

  // The flavor is the opener's namespace; without it no other line can be judged, and the block
  // is refused with the one finding the constant form gives a missing id.
  if (opener === undefined) {
    findings.push(
      createAnchorFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        'anchor field "id" is missing — a comment block carrying @sdp-* lines must open with @sdp-anchor <id>',
        file,
        block.line,
        undefined,
        "id",
      ),
    );
    return undefined;
  }

  const opened =
    opener.value === undefined
      ? { ok: false as const, reason: 'tag "@sdp-anchor" carries no id' }
      : checkIdText(opener.value, ANCHOR_ID_NAMESPACES);

  if (!opened.ok) {
    findings.push(
      createAnchorFinding(
        extractFindingIds.invalidId,
        "error",
        `anchor field "id" did not reify: ${opened.reason}`,
        file,
        opener.line,
        undefined,
        "id",
      ),
    );
    return undefined;
  }

  const flavor = flavorOfNamespace(namespaceOf(opened.id));

  if (flavor === undefined) {
    return undefined;
  }

  const envelope = new AnchorEnvelope(flavor, file, block.line, opened.id, findings);

  for (const tag of block.tags) {
    const name = ANCHOR_COMMENT_TAG_FIELDS.get(tag.name) ?? tag.name;

    if (tag.value === undefined) {
      if (envelope.markAuthored(name, tag.line)) {
        envelope.failEnvelope(tag.line, `tag "@sdp-${tag.name}" carries no value`, name);
      }
      continue;
    }

    envelope.field(name, tag.line, commentFieldReader(tag, tag.value, envelope));
  }

  return envelope.finish();
}

/* ----- the file sweep ----- */

/**
 * Reifies the anchors of one source file standalone — no type checker, no import following
 * (static reification without execution, MD-14). The comment form is read off every top-level
 * statement's leading `/** … *\/` blocks whether or not the file imports anything; the constant
 * form, and the misplaced-authoring scan, need a Protocol import binding. The scan warns loudly
 * on a protocol authoring call outside its recognized surface (L2 — a binding the author believes
 * exists must never silently fall out of the graph) and reaches exactly as far as the
 * import-binding contract (`PROTOCOL_MODULE_SPECIFIER`): a call through an out-of-contract
 * binding (`require`, a re-aliased local, an element access) is indistinguishable from any other
 * library's call without evaluating, so it stays silent — the named boundary of the L2 claim.
 */
export function reifyAnchorSourceFile(
  sourceFile: SourceFile,
  relativePath: string,
  bindingScope?: ProtocolBindingScope,
): AnchorFileReification {
  const bindings = collectProtocolBindings(sourceFile, bindingScope);
  const hasBindings = bindings.named.size > 0 || bindings.namespaceLocals.size > 0;
  const anchors: ReifiedAnchor[] = [];
  const findings: Finding[] = [];
  const recognizedCalls = new Set<CallExpression>();

  for (const statement of sourceFile.getStatements()) {
    for (const block of readAnchorCommentBlocks(statement, sourceFile)) {
      const reified = reifyAnchorComment(block, relativePath, findings);

      if (reified !== undefined) {
        anchors.push(reified);
      }
    }

    if (!hasBindings || !Node.isVariableStatement(statement)) {
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

  if (!hasBindings) {
    return { anchors, findings };
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
