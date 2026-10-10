import { Node, VariableDeclarationKind, ts } from "ts-morph";
import type { CallExpression, ObjectLiteralExpression, SourceFile } from "ts-morph";

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
 * to a Protocol import. The **comment form** (`spec:decisions.anchor-comment-form`) is any
 * top-level `/** … *\/` block carrying reserved `@sdp…` tags; it needs no import. Both feed one
 * closed envelope, so identical content yields identical graph data.
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
 * The comment-form line grammar (`spec:decisions.anchor-comment-form`): one TSDoc-compatible tag
 * per line, read off the raw comment text after the delimiters are stripped, never through the
 * TypeScript JSDoc tag parser. Every line that opens with `@sdp` is a reserved tag line; the known
 * tags map onto the envelope fields, and an unknown or misspelled one (`@sdp-anchor`,
 * `@sdpAnchor:`) is refused, never read as prose. A tag with no value still matches, so it can be
 * refused loudly rather than ignored.
 */
const COMMENT_LINE_BODY = /^\s*\*?\s*(.*?)\s*$/u;
const COMMENT_TAG = /^@([A-Za-z][A-Za-z0-9]*)(?:\s+(.*))?$/u;
const RESERVED_TAG_PREFIX = "sdp";
const COMMENT_OPEN = "/**";
const COMMENT_CLOSE = "*/";

/** The reserved tags, each the envelope field it carries. */
const COMMENT_TAG_FIELDS: ReadonlyMap<string, string> = new Map([
  ["sdpAnchor", "id"],
  ["sdpLabel", "label"],
  ["sdpSatisfies", "satisfies"],
  ["sdpVerifies", "verifies"],
  ["sdpModels", "models"],
  ["sdpReferences", "references"],
  ["sdpComponent", "component"],
  ["sdpUses", "uses"],
  ["sdpRole", "role"],
  ["sdpLayer", "layer"],
  ["sdpContext", "context"],
]);

/** `role` and `context` are one token each: a free vocabulary, but never free-form prose. */
const STRUCTURAL_TOKEN = /^[a-z][a-z0-9-]*$/u;

const anchorExtractionAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.anchor-extraction"),
  label: "anchor reification seam: the constant form and the comment form",
  satisfies: ref("spec:model.anchors"),
  component: componentAnchorId("component:protocol.extract"),
  references: [ref("spec:decisions.anchor-comment-form")],
  role: "extractor",
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

          if (value === undefined) {
            return;
          }

          if (!STRUCTURAL_TOKEN.test(value)) {
            this.failEnvelope(
              line,
              `anchor field "${name}" reified to "${value}", which is not one token of the form ${STRUCTURAL_TOKEN.source} — role and context are vocabulary, never prose`,
              name,
            );
            return;
          }

          this.data[name] = value;
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

interface CommentTag {
  readonly tag: string;
  readonly value: string | undefined;
  readonly line: number;
  /** A line that opens with `@sdp` but is not spelled as a tag: refused, never prose. */
  readonly malformed: boolean;
}

interface CommentBlock {
  /** The block's first line: the binding site. */
  readonly line: number;
  readonly tags: readonly CommentTag[];
  /** Non-empty lines after the first reserved tag that do not open a tag: refused continuations. */
  readonly continuations: readonly number[];
}

function commentFieldReader(tag: CommentTag, value: string, envelope: AnchorEnvelope): FieldReader {
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

  const readOne = (expectedNamespaces: readonly string[], path: string): string | undefined => {
    if (value.includes(",")) {
      envelope.failEnvelope(
        tag.line,
        `tag "@${tag.tag}" names more than one target; exactly one is required`,
        path,
      );
      return undefined;
    }

    return readId(value, expectedNamespaces, path);
  };

  const readList = (
    expectedNamespaces: readonly string[],
    path: string,
  ): readonly string[] | undefined => {
    const ids: string[] = [];
    let ok = true;

    for (const [position, entry] of value.split(",").entries()) {
      const text = entry.trim();
      const entryPath = `${path}[${String(position)}]`;

      if (text.length === 0) {
        envelope.failEnvelope(
          tag.line,
          `tag "@${tag.tag}" carries an empty list item at "${entryPath}"`,
          entryPath,
        );
        ok = false;
        continue;
      }

      const id = readId(text, expectedNamespaces, entryPath);

      if (id === undefined) {
        ok = false;
        continue;
      }

      ids.push(id);
    }

    return ok ? ids : undefined;
  };

  return {
    id: readOne,
    idList: readList,
    idOrList: readList,
    text: () => value,
  };
}

/**
 * One `/** … *\/` block reduced to its reserved tag lines. A line that opens with `@sdp` is a
 * reserved tag line wherever it stands, so a misspelled tag is refused rather than read as prose.
 * Prose may precede the first reserved tag; after it, every non-empty line must open a tag
 * (`@…`), so an accidentally wrapped target is refused rather than read as prose. Other TSDoc
 * tags (`@param`, `@returns`) are not read.
 */
function readCommentBlock(text: string, line: number): CommentBlock | undefined {
  const body = text.slice(COMMENT_OPEN.length, -COMMENT_CLOSE.length);
  const tags: CommentTag[] = [];
  const continuations: number[] = [];

  for (const [offset, rawLine] of body.split(/\r?\n/u).entries()) {
    const content = COMMENT_LINE_BODY.exec(rawLine)?.[1] ?? "";
    const tagMatch = COMMENT_TAG.exec(content);

    if (content.startsWith(`@${RESERVED_TAG_PREFIX}`)) {
      const value = tagMatch?.[2];
      tags.push(
        tagMatch?.[1] === undefined
          ? {
              tag: (content.split(/\s/u, 1)[0] ?? content).slice(1),
              value: undefined,
              line: line + offset,
              malformed: true,
            }
          : {
              tag: tagMatch[1],
              value: value === undefined || value.length === 0 ? undefined : value,
              line: line + offset,
              malformed: false,
            },
      );
      continue;
    }

    if (tagMatch !== null || tags.length === 0) {
      continue;
    }

    if (content.length > 0) {
      continuations.push(line + offset);
    }
  }

  return tags.length === 0 ? undefined : { line, tags, continuations };
}

function malformedTagMessage(tag: CommentTag): string {
  return `malformed reserved tag "@${tag.tag}": a line that opens with @sdp is a reserved tag, written as @sdp and a camelCase name, then whitespace and its value`;
}

function isCommentBlock(text: string): boolean {
  return (
    text.startsWith(COMMENT_OPEN) &&
    text.endsWith(COMMENT_CLOSE) &&
    text.length >= COMMENT_OPEN.length + COMMENT_CLOSE.length
  );
}

function reifyCommentBlock(
  block: CommentBlock,
  file: string,
  findings: Finding[],
): ReifiedAnchor | undefined {
  const opener = block.tags.find((tag) => tag.tag === "sdpAnchor");

  // The flavor is the opener's namespace; without it no other line can be judged, and the block
  // is refused with the one finding the constant form gives a missing id.
  if (opener === undefined) {
    for (const tag of block.tags.filter((candidate) => candidate.malformed)) {
      findings.push(
        createAnchorFinding(
          extractFindingIds.nonStaticEnvelope,
          "error",
          malformedTagMessage(tag),
          file,
          tag.line,
          undefined,
          tag.tag,
        ),
      );
    }
    findings.push(
      createAnchorFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        'anchor field "id" is missing — a comment block carrying @sdp… tags must open its anchor with @sdpAnchor <id>',
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
      ? { ok: false as const, reason: 'tag "@sdpAnchor" carries no id' }
      : opener.value.includes(",")
        ? { ok: false as const, reason: 'tag "@sdpAnchor" names more than one id' }
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
    if (tag.malformed) {
      envelope.failEnvelope(tag.line, malformedTagMessage(tag), tag.tag);
      continue;
    }

    const name = COMMENT_TAG_FIELDS.get(tag.tag);

    if (name === undefined) {
      envelope.failEnvelope(
        tag.line,
        `tag "@${tag.tag}" is not a reserved anchor tag (${[...COMMENT_TAG_FIELDS.keys()].map((known) => `@${known}`).join(" · ")}) — the envelope is closed`,
        tag.tag,
      );
      continue;
    }

    if (tag.value === undefined) {
      if (envelope.markAuthored(name, tag.line)) {
        envelope.failEnvelope(tag.line, `tag "@${tag.tag}" carries no value`, name);
      }
      continue;
    }

    envelope.field(name, tag.line, commentFieldReader(tag, tag.value, envelope));
  }

  for (const line of block.continuations) {
    envelope.failEnvelope(
      line,
      "a line after the first reserved tag must open a tag — a wrapped target is refused, never read as prose",
    );
  }

  return envelope.finish();
}

interface TopLevelComment {
  readonly pos: number;
  readonly text: string;
  readonly line: number;
}

/**
 * Every top-level comment of a file, in source order: the leading and trailing comments of each
 * top-level statement, then the comments after the last statement (the end-of-file token's
 * leading trivia, which is all of a comment-only file). Attachment to a declaration is not
 * recorded: a block above the first import is simply an anchor in that file.
 */
function topLevelComments(sourceFile: SourceFile): readonly TopLevelComment[] {
  const seen = new Set<number>();
  const comments: TopLevelComment[] = [];
  const collect = (ranges: readonly { getPos(): number; getText(): string }[]): void => {
    for (const range of ranges) {
      if (seen.has(range.getPos())) {
        continue;
      }

      seen.add(range.getPos());
      comments.push({
        pos: range.getPos(),
        text: range.getText(),
        line: sourceFile.getLineAndColumnAtPos(range.getPos()).line,
      });
    }
  };

  for (const statement of sourceFile.getStatements()) {
    collect(statement.getLeadingCommentRanges());
    collect(statement.getTrailingCommentRanges());
  }

  // The end-of-file token is not a ts-morph node; its leading trivia holds every comment after
  // the last statement, which is the whole of a comment-only file.
  const fullText = sourceFile.getFullText();
  collect(
    (ts.getLeadingCommentRanges(fullText, sourceFile.compilerNode.endOfFileToken.pos) ?? []).map(
      (range) => ({
        getPos: () => range.pos,
        getText: () => fullText.slice(range.pos, range.end),
      }),
    ),
  );

  return comments.sort((left, right) => left.pos - right.pos);
}

function isJsDocNode(node: ts.Node): boolean {
  return node.kind >= ts.SyntaxKind.FirstJSDocNode && node.kind <= ts.SyntaxKind.LastJSDocNode;
}

/**
 * Every comment of a file, in source order. A comment sits in the trivia between two tokens, as
 * the leading trivia of the next token or the trailing trivia of the one before, so a walk over
 * every token, closing delimiters and the end-of-file token included, misses none: not one before
 * the closing brace of an empty body, not one in an empty JSX expression. JSX text and a doc
 * comment's own content are not trivia, so neither is scanned for comments.
 */
function everyComment(sourceFile: SourceFile): readonly TopLevelComment[] {
  const root = sourceFile.compilerNode;
  const fullText = root.getFullText();
  const ranges = new Map<number, ts.CommentRange>();
  const jsxText: { readonly pos: number; readonly end: number }[] = [];
  const visit = (node: ts.Node): void => {
    if (isJsDocNode(node)) {
      return;
    }

    if (node.kind === ts.SyntaxKind.JsxText) {
      jsxText.push({ pos: node.pos, end: node.end });
      return;
    }

    for (const range of [
      ...(ts.getLeadingCommentRanges(fullText, node.pos) ?? []),
      ...(ts.getTrailingCommentRanges(fullText, node.end) ?? []),
    ]) {
      ranges.set(range.pos, range);
    }

    for (const child of node.getChildren(root)) {
      visit(child);
    }
  };

  visit(root);
  return [...ranges.values()]
    .filter((range) => !jsxText.some((text) => range.pos >= text.pos && range.pos < text.end))
    .sort((left, right) => left.pos - right.pos)
    .map((range) => ({
      pos: range.pos,
      text: fullText.slice(range.pos, range.end),
      line: sourceFile.getLineAndColumnAtPos(range.pos).line,
    }));
}

/**
 * A reserved tag in a nested position (a class body, a function body, an object literal, a JSX
 * expression) is refused, never ignored: the author believes a binding exists (L2). A nested
 * comment is judged by the grammar the top level reads: a `/** … *\/` block with a reserved tag
 * line is refused, and a `//` or `/*` comment, or prose that mentions a tag, stays unread.
 */
function reportMisplacedReservedTags(
  sourceFile: SourceFile,
  topLevelPositions: ReadonlySet<number>,
  file: string,
  findings: Finding[],
): void {
  for (const comment of everyComment(sourceFile)) {
    if (
      topLevelPositions.has(comment.pos) ||
      !isCommentBlock(comment.text) ||
      readCommentBlock(comment.text, comment.line) === undefined
    ) {
      continue;
    }

    findings.push(
      createAnchorFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        "misplaced reserved tag: an @sdp… tag binds only from a top-level /** … */ comment, never from a nested position",
        file,
        comment.line,
      ),
    );
  }
}

/* ----- the file sweep ----- */

/**
 * Reifies the anchors of one source file standalone — no type checker, no import following
 * (static reification without execution, MD-14). The comment form is read off every top-level
 * `/** … *\/` block whether or not the file imports anything, and a reserved tag anywhere else is
 * refused; the constant form, and the misplaced-authoring scan, need a Protocol import binding. The scan warns loudly
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

  if (sourceFile.getFullText().includes(`@${RESERVED_TAG_PREFIX}`)) {
    const comments = topLevelComments(sourceFile);

    for (const comment of comments) {
      if (!isCommentBlock(comment.text)) {
        continue;
      }

      const block = readCommentBlock(comment.text, comment.line);
      const reified =
        block === undefined ? undefined : reifyCommentBlock(block, relativePath, findings);

      if (reified !== undefined) {
        anchors.push(reified);
      }
    }

    reportMisplacedReservedTags(
      sourceFile,
      new Set(comments.map((comment) => comment.pos)),
      relativePath,
      findings,
    );
  }

  if (!hasBindings) {
    return { anchors, findings };
  }

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
