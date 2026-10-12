import { Node, SyntaxKind, VariableDeclarationKind } from "ts-morph";
import type {
  ArrayLiteralExpression,
  CallExpression,
  NumericLiteral,
  ObjectLiteralExpression,
  PropertyAssignment,
  SourceFile,
} from "ts-morph";

import { deliveryFactNames } from "../graph/schema.js";
import { CODE_ANCHOR_NAMESPACES, codeAnchorId, componentAnchorId, parseId, ref } from "../ids.js";
import type { IdParts } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { SPEC_ALTITUDES, SPEC_KINDS, SPEC_READINESS } from "../model/descriptors.js";
import { SPEC_RELATION_TYPES } from "../model/relations.js";
import { SPEC_SECTION_NAMES } from "../model/sections.js";
import type { Finding, Severity } from "../validate/contracts.js";
import { collectProtocolBindings, isProtocolBuilderModuleSpecifier } from "./protocol-bindings.js";
import type { ProtocolBindings, ProtocolBindingScope } from "./protocol-bindings.js";
import { setOwn } from "./set-own.js";

/**
 * Static reification (`04` §1): a spec file is a JSON file that TypeScript happens to validate
 * (P5), so reification reads the AST and never evaluates — no imports are followed, no builder is
 * called (evaluation is the phantom-value trap MD-14 closes). Recognized builders are matched by
 * import binding from this one module specifier — named imports (authored aliasing survives),
 * namespace imports (`ns.builder(…)`), and a default-import local treated the same (the package
 * ships no default export, but an interop consumer can author through one) — so lookalike
 * builders from other modules stay non-static. The boundary is the import declaration: a binding
 * reached any other way (`require`, a re-aliased local, an element access) is out of contract and
 * stays out of the graph.
 */
/**
 * The extraction finding ids, pinned. Two tiers (`spec:extraction.determinism`), covering both authored surfaces (spec
 * files and anchor constants): envelope failures (`non-static-envelope` · `invalid-id` ·
 * `duplicate-id` · `reserved-property`) are hard errors — the carrier is not extracted and the
 * build fails; content failures (`non-static-section` · `unrecognized-statement` ·
 * `unrecognized-property` · `misplaced-authoring`) degrade loudly — one property, statement, or
 * call is dropped and the rest survives (graceful partial extraction, L3). The content-tier ids
 * name the *tier*, not the artifact: `non-static-envelope` is the general envelope-failure id —
 * a non-static or opaque entry, a required field missing, a property name authored twice —
 * everything that leaves the carrier unconstructable; `non-static-section` also covers an
 * anchor's degradable `label`, `unrecognized-property` covers a spec or pack property outside
 * its authored shape (a typoed section name must never silently fall out of the graph, L2), and
 * `misplaced-authoring`
 * covers any protocol authoring call outside its recognized surface (an anchor builder not in
 * top-level-const position; a `spec(…)`/`pack(…)` call in a non-`.sdp.ts` file) — a binding the
 * author believes exists must never silently fall out of the graph (L2). `reserved-property` is
 * the envelope-tier honesty twin: a hand-authored piece of derived graph vocabulary (a delivery
 * fact, a `claim`, an edge field) impersonates machine truth, so the carrier is rejected whole.
 * Above both tiers sits the one file-level id: `parse-error` — a file carrying a syntactic
 * diagnostic is never reified, because the error-tolerant parse recovers by guessing and content
 * bleeds between carriers; one hard error per file, carrying the first diagnostic, and the whole
 * file's content stays out of the graph (ambiguity is loud, L2).
 */
export const extractFindingIds = {
  parseError: "extract/parse-error",
  gherkinSyntax: "extract/gherkin-syntax",
  gherkinGrammar: "extract/gherkin-grammar",
  tooManyGherkinFindings: "extract/too-many-gherkin-findings",
  nonStaticEnvelope: "extract/non-static-envelope",
  invalidId: "extract/invalid-id",
  duplicateId: "extract/duplicate-id",
  reservedProperty: "extract/reserved-property",
  nonStaticSection: "extract/non-static-section",
  unownedProse: "extract/unowned-prose",
  unrecognizedStatement: "extract/unrecognized-statement",
  unrecognizedProperty: "extract/unrecognized-property",
  misplacedAuthoring: "extract/misplaced-authoring",
} as const;

/**
 * Builders whose single string-literal argument reifies to an id, mapped to the namespaces that
 * builder accepts (its own runtime contract — the extractor never evaluates, so it re-states the
 * check statically).
 */
export const ID_UNWRAP_BUILDERS: ReadonlyMap<string, readonly string[]> = new Map<
  string,
  readonly string[]
>([
  ["specId", ["spec"]],
  ["packId", ["pack"]],
  ["ref", ["spec"]],
  ["codeAnchorId", CODE_ANCHOR_NAMESPACES],
  ["componentAnchorId", ["component"]],
  ["testAnchorId", ["test"]],
  ["oracleAnchorId", ["oracle"]],
]);

const RELATION_BUILDER_NAMES = new Set<string>(SPEC_RELATION_TYPES);
const SPEC_KIND_VALUES = new Set<string>(SPEC_KINDS);
const SPEC_ALTITUDE_VALUES = new Set<string>(SPEC_ALTITUDES);
const SPEC_READINESS_VALUES = new Set<string>(SPEC_READINESS);
const SPEC_SECTION_NAME_SET = new Set<string>(SPEC_SECTION_NAMES);

/**
 * Derived graph vocabulary an authored carrier must never state: the delivery facts plus the
 * graph's own node and edge fields. Hand-authoring one impersonates machine truth, so it is an
 * envelope-tier hard error — the extraction-layer twin of authoring-shape honesty
 * (`spec:validation.authored-honesty`) on the top-level authored shape, exactly as raw `relations[]` entries and foreign
 * anchor fields are on theirs. In-section content stays the honesty checks' jurisdiction: it
 * reifies through and the `honesty/authoring-shape` validator sees it in the model.
 */
const RESERVED_DERIVED_PROPERTIES = new Set<string>([
  ...deliveryFactNames,
  // camel `hasVerifier` joins the kebab delivery facts: every delivery-fact spelling is reserved in both carriers (R-6 parity).
  "hasVerifier",
  "deliveryFacts",
  "claim",
  "nodeType",
  "specKind",
  "satisfies",
  "verifies",
  "belongsTo",
  "models",
]);

export interface ReifiedEntryLine {
  readonly entry: string;
  readonly line: number;
}

export interface ReifiedSpec {
  /** Plain `Spec`-shaped data in authored property order — built from the AST, never evaluated. */
  readonly data: Record<string, unknown>;
  readonly id: string;
  readonly file: string;
  readonly line: number;
  readonly entryLines?: readonly ReifiedEntryLine[];
}

export interface ReifiedPack {
  readonly data: Record<string, unknown>;
  readonly id: string;
  readonly file: string;
  readonly line: number;
}

export interface FileReification {
  readonly specs: readonly ReifiedSpec[];
  readonly packs: readonly ReifiedPack[];
  readonly findings: readonly Finding[];
}

function createExtractFinding(
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
    // Location lives in the structured `file`/`line` fields only; renderers print it. Embedding
    // it in the message too would state the same information twice (one diagnostic rendering
    // rule).
    message,
    subjectId,
    path,
    file,
    line,
  };
}

/* ----- the static value grammar ----- */

interface StaticFailure {
  readonly path: string;
  readonly line: number;
  readonly reason: string;
}

export type StaticResult =
  | { readonly ok: true; readonly value: unknown }
  | { readonly ok: false; readonly failure: StaticFailure };

function staticFailure(node: Node, path: string, reason: string): StaticResult {
  return { ok: false, failure: { path, line: node.getStartLineNumber(), reason } };
}

function describeNonStatic(node: Node): string {
  return `${node.getKindName()} is outside the static value grammar (string/number/boolean literals, array and fresh object literals; TypeScript assertions and parentheses are transparent; id builders unwrap in id slots only)`;
}

/** TypeScript assertions and parentheses are transparent; every other wrapper is non-static. */
export function unwrapTransparent(node: Node): Node {
  let current = node;

  for (;;) {
    if (Node.isParenthesizedExpression(current)) {
      current = current.getExpression();
      continue;
    }

    if (Node.isAsExpression(current)) {
      current = current.getExpression();
      continue;
    }

    return current;
  }
}

export interface ResolvedBuilderCall {
  readonly call: CallExpression;
  readonly builder: string;
}

/**
 * A binding identifier matched by text can be lexically shadowed — a parameter or local sharing
 * the import's name is somebody else's value, and attributing its calls to the protocol would
 * raise spurious findings. The walk is syntactic (no type checker, MD-14): parameters, variable
 * declarations, function/class declaration names, and catch bindings on the path to the file top.
 */
function isShadowedAtUse(use: Node, name: string): boolean {
  for (let scope = use.getParent(); scope !== undefined; scope = scope.getParent()) {
    if (
      (Node.isFunctionDeclaration(scope) ||
        Node.isFunctionExpression(scope) ||
        Node.isArrowFunction(scope) ||
        Node.isMethodDeclaration(scope) ||
        Node.isConstructorDeclaration(scope) ||
        Node.isGetAccessorDeclaration(scope) ||
        Node.isSetAccessorDeclaration(scope)) &&
      scope.getParameters().some((parameter) => parameter.getName() === name)
    ) {
      return true;
    }

    if (Node.isCatchClause(scope) && scope.getVariableDeclaration()?.getName() === name) {
      return true;
    }

    if (Node.isBlock(scope) || Node.isModuleBlock(scope)) {
      for (const statement of scope.getStatements()) {
        if (
          Node.isVariableStatement(statement) &&
          statement.getDeclarations().some((declaration) => declaration.getName() === name)
        ) {
          return true;
        }

        if (
          (Node.isFunctionDeclaration(statement) || Node.isClassDeclaration(statement)) &&
          statement.getName() === name
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * The callee form mirrors the import form: a bare identifier from a named import, or
 * `ns.builder(…)` through a namespace- or default-import local — unless the binding is lexically
 * shadowed at the use site. Anything else (an element access, a re-aliased local, a `require`
 * binding) is not an import binding of the protocol package, so it stays non-static and out of
 * the graph — the recognized-forms boundary the misplaced-authoring sweep polices.
 */
export function resolveProtocolCalleeBuilder(
  callee: Node,
  bindings: ProtocolBindings,
): string | undefined {
  if (Node.isIdentifier(callee)) {
    const builder = bindings.named.get(callee.getText());

    return builder !== undefined && !isShadowedAtUse(callee, callee.getText())
      ? builder
      : undefined;
  }

  if (Node.isPropertyAccessExpression(callee)) {
    const qualifier = callee.getExpression();

    return Node.isIdentifier(qualifier) &&
      bindings.namespaceLocals.has(qualifier.getText()) &&
      !isShadowedAtUse(qualifier, qualifier.getText())
      ? callee.getName()
      : undefined;
  }

  return undefined;
}

export function resolveBuilderCall(
  node: Node,
  bindings: ProtocolBindings,
): ResolvedBuilderCall | undefined {
  const unwrapped = unwrapTransparent(node);

  if (!Node.isCallExpression(unwrapped)) {
    return undefined;
  }

  const builder = resolveProtocolCalleeBuilder(unwrapped.getExpression(), bindings);

  return builder === undefined ? undefined : { call: unwrapped, builder };
}

export function readPropertyName(property: PropertyAssignment): string | undefined {
  const nameNode = property.getNameNode();

  if (Node.isIdentifier(nameNode)) {
    return nameNode.getText();
  }

  if (Node.isStringLiteral(nameNode)) {
    return nameNode.getLiteralValue();
  }

  return undefined;
}

/**
 * The open sections and the Model terms keep authored key order, which a JavaScript object breaks
 * for an integer-like key: it moves ahead of every other key. Those shapes read a numeric property
 * name as the key evaluation gives it, so `1` and `"1"` name one key, and refuse it. A numeric
 * name whose key is not integer-like, such as `1.5`, stays unread, as every numeric name was
 * before the refusal.
 */
const INTEGER_KEY_SHAPE_PATHS: ReadonlySet<string> = new Set(["design", "ui", "model.terms"]);
const INTEGER_LIKE_KEY = /^(0|[1-9][0-9]*)$/u;

/**
 * The key JavaScript gives a numeric property name: ToString of its numeric value, so `0x10` is
 * `"16"`, `1e3` is `"1000"`, and `1e21` is `"1e+21"`. `getLiteralValue` parses the literal text
 * as an integer and would read `1e21` as `1`.
 */
function numericPropertyKey(nameNode: NumericLiteral): string {
  return String(Number(nameNode.getLiteralText()));
}

function readKeyedPropertyName(
  property: PropertyAssignment,
  shapePath: string,
): string | undefined {
  const nameNode = property.getNameNode();

  if (INTEGER_KEY_SHAPE_PATHS.has(shapePath) && Node.isNumericLiteral(nameNode)) {
    const key = numericPropertyKey(nameNode);

    if (INTEGER_LIKE_KEY.test(key)) {
      return key;
    }
  }

  return readPropertyName(property);
}

function isRefusedIntegerKey(shapePath: string, name: string): boolean {
  return INTEGER_KEY_SHAPE_PATHS.has(shapePath) && INTEGER_LIKE_KEY.test(name);
}

/**
 * A method or accessor whose name is integer-like names the same key a property would, so those
 * shapes refuse it as they refuse the property. Any other method or accessor drops as non-static.
 */
function refusedIntegerMemberName(member: Node, shapePath: string): string | undefined {
  if (
    !Node.isMethodDeclaration(member) &&
    !Node.isGetAccessorDeclaration(member) &&
    !Node.isSetAccessorDeclaration(member)
  ) {
    return undefined;
  }

  const nameNode = member.getNameNode();
  const name = Node.isNumericLiteral(nameNode)
    ? numericPropertyKey(nameNode)
    : Node.isStringLiteral(nameNode)
      ? nameNode.getLiteralValue()
      : undefined;

  return name !== undefined && isRefusedIntegerKey(shapePath, name) ? name : undefined;
}

/**
 * A property name authored twice at one object tier is ambiguity, never detail: evaluation keeps
 * the last value while diagnostics key on the first seen. tsc reports the duplication (TS1117) to
 * typechecking authors; the extractor reads files standalone, so it is the backstop — at every
 * tier: the envelope fails the carrier whole, the section tier drops the repeat and keeps the
 * first authored value (L3). The consequence clause names the caller's tier.
 */
export function duplicatePropertyMessage(
  name: string,
  consequence = "so the carrier is not extracted",
): string {
  return `property "${name}" is authored more than once in this carrier (ambiguity is loud, L2); evaluation would keep the last value silently, ${consequence}`;
}

export function reifyStaticString(node: Node, path: string): StaticResult {
  const unwrapped = unwrapTransparent(node);

  if (Node.isStringLiteral(unwrapped) || Node.isNoSubstitutionTemplateLiteral(unwrapped)) {
    return { ok: true, value: unwrapped.getLiteralValue() };
  }

  return staticFailure(unwrapped, path, describeNonStatic(unwrapped));
}

export type IdReification =
  | { readonly ok: true; readonly id: string }
  | {
      readonly ok: false;
      readonly kind: "non-static" | "invalid";
      readonly line: number;
      readonly reason: string;
    };

/**
 * The one refusal every id slot gives an entry address. The `#` sub-part names an entry inside a
 * Spec; `parseId` admits it so prose can carry it, and no Spec identity, relation target, Pack
 * member, model reference, or anchor target ever holds one.
 */
export function entryAddressSlotReason(value: string, parsed: IdParts): string | undefined {
  return parsed.subpath === undefined
    ? undefined
    : `id "${value}" is an entry address where a Spec id is required`;
}

function namespacesList(namespaces: readonly string[]): string {
  return namespaces.map((entry) => `"${entry}"`).join(" · ");
}

function namespacesLabel(namespaces: readonly string[]): string {
  return namespaces.length === 1
    ? `${namespacesList(namespaces)} is required`
    : `one of ${namespacesList(namespaces)} is required`;
}

export type IdTextCheck =
  | { readonly ok: true; readonly id: string }
  | { readonly ok: false; readonly reason: string };

/**
 * The id grammar check every id slot shares, over the bare text: `parseId` must accept it, its
 * namespace must be one of the slot's, and it must not be an entry address. The constant form
 * reaches it through `reifyStaticIdExpression`; the comment form reads tag text and calls it
 * directly, so one grammar serves both representations of an anchor.
 */
export function checkIdText(idText: string, expectedNamespaces: readonly string[]): IdTextCheck {
  try {
    const parsed = parseId(idText);

    if (!expectedNamespaces.includes(parsed.namespace)) {
      return {
        ok: false,
        reason: `id "${idText}" carries namespace "${parsed.namespace}" where ${namespacesLabel(expectedNamespaces)}`,
      };
    }

    const addressReason = entryAddressSlotReason(idText, parsed);

    return addressReason === undefined
      ? { ok: true, id: idText }
      : { ok: false, reason: addressReason };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : `id "${idText}" fails the id grammar`,
    };
  }
}

/**
 * An id slot accepts a string literal or an id-builder unwrap (`specId` / `packId` / `ref` /
 * `codeAnchorId` / `testAnchorId` around a string literal); the reified string must clear the
 * `parseId` grammar and carry one of the slot's namespaces — and, when a builder wraps it, one of
 * that builder's own namespaces (its runtime contract, restated statically) — the graph is never
 * keyed on a malformed id or on a carrier evaluation would have rejected.
 */
export function reifyStaticIdExpression(
  node: Node,
  expectedNamespaces: readonly string[],
  bindings: ProtocolBindings,
  path: string,
): IdReification {
  const unwrapped = unwrapTransparent(node);
  const builderCall = resolveBuilderCall(unwrapped, bindings);
  const builderNamespaces =
    builderCall === undefined ? undefined : ID_UNWRAP_BUILDERS.get(builderCall.builder);
  let stringResult: StaticResult;

  if (builderCall !== undefined && builderNamespaces !== undefined) {
    const [argument] = builderCall.call.getArguments();
    stringResult =
      argument === undefined || builderCall.call.getArguments().length !== 1
        ? staticFailure(builderCall.call, path, "id builder must wrap exactly one string literal")
        : reifyStaticString(argument, path);
  } else {
    stringResult = reifyStaticString(unwrapped, path);
  }

  if (!stringResult.ok) {
    return {
      ok: false,
      kind: "non-static",
      line: stringResult.failure.line,
      reason: stringResult.failure.reason,
    };
  }

  const idText = stringResult.value as string;
  const line = unwrapped.getStartLineNumber();

  // The wrapping builder's contract checks first: it is the narrower statement, and the one
  // evaluation would enforce (the builder throws on a foreign namespace).
  if (builderCall !== undefined && builderNamespaces !== undefined) {
    let namespace: string | undefined;

    try {
      namespace = parseId(idText).namespace;
    } catch {
      namespace = undefined;
    }

    if (namespace !== undefined && !builderNamespaces.includes(namespace)) {
      return {
        ok: false,
        kind: "invalid",
        line,
        reason: `id "${idText}" carries namespace "${namespace}" where ${builderCall.builder}(…) accepts only ${namespacesList(builderNamespaces)} — the builder's own contract, restated statically`,
      };
    }
  }

  const checked = checkIdText(idText, expectedNamespaces);

  return checked.ok
    ? { ok: true, id: idText }
    : { ok: false, kind: "invalid", line, reason: checked.reason };
}

function reifyStaticValue(node: Node, path: string, bindings: ProtocolBindings): StaticResult {
  const unwrapped = unwrapTransparent(node);

  if (Node.isStringLiteral(unwrapped) || Node.isNoSubstitutionTemplateLiteral(unwrapped)) {
    return { ok: true, value: unwrapped.getLiteralValue() };
  }

  if (Node.isNumericLiteral(unwrapped)) {
    return { ok: true, value: unwrapped.getLiteralValue() };
  }

  if (
    Node.isPrefixUnaryExpression(unwrapped) &&
    unwrapped.getOperatorToken() === SyntaxKind.MinusToken
  ) {
    const operand = unwrapTransparent(unwrapped.getOperand());

    if (Node.isNumericLiteral(operand)) {
      return { ok: true, value: -operand.getLiteralValue() };
    }

    return staticFailure(operand, path, describeNonStatic(operand));
  }

  if (unwrapped.getKind() === SyntaxKind.TrueKeyword) {
    return { ok: true, value: true };
  }

  if (unwrapped.getKind() === SyntaxKind.FalseKeyword) {
    return { ok: true, value: false };
  }

  if (Node.isArrayLiteralExpression(unwrapped)) {
    return reifyStaticArray(unwrapped, path, bindings);
  }

  if (Node.isObjectLiteralExpression(unwrapped)) {
    return reifyStaticObject(unwrapped, path, bindings);
  }

  const builderCall = resolveBuilderCall(unwrapped, bindings);

  if (builderCall !== undefined) {
    // Id builders unwrap in id slots only (`reifyStaticIdExpression`), never in a value position:
    // a `ref(…)` riding section content would survive as a plain string the graph treats as
    // ordinary prose — a smuggled reference no referential check ever sees. Sections carry
    // content, relations carry linkage (MD-10). The guard covers the typed affordance only: a
    // raw id-shaped string in content is prose by definition — never a reference, never an edge,
    // never validated — exactly as any sentence naming a spec is. Closing that would mean
    // policing prose, which checks never do (conformance and honesty, never content-quality);
    // the boundary is pinned by the `id-shaped-string-content` corpus.
    if (ID_UNWRAP_BUILDERS.has(builderCall.builder)) {
      return staticFailure(
        unwrapped,
        path,
        `call to "${builderCall.builder}" is an id builder outside an id slot — sections carry content, relations carry linkage (MD-10), so a spec reference cannot ride along as content`,
      );
    }

    return staticFailure(
      unwrapped,
      path,
      `call to "${builderCall.builder}" is non-static in a value position`,
    );
  }

  return staticFailure(unwrapped, path, describeNonStatic(unwrapped));
}

/** Arrays are strict: dropping one element would silently reshape its siblings, so any non-static element fails the whole array value. */
function reifyStaticArray(
  arrayLiteral: ArrayLiteralExpression,
  path: string,
  bindings: ProtocolBindings,
): StaticResult {
  const values: unknown[] = [];

  for (const [index, element] of arrayLiteral.getElements().entries()) {
    const elementPath = `${path}[${String(index)}]`;
    const result = reifyStaticValue(element, elementPath, bindings);

    if (!result.ok) {
      return result;
    }

    values.push(result.value);
  }

  return { ok: true, value: values };
}

/**
 * `placeholders` names the properties whose non-static value reifies to the mapped marker instead
 * of failing the object — today only an open question's `key` (`reifyOpenQuestions`).
 */
function reifyStaticObject(
  objectLiteral: ObjectLiteralExpression,
  path: string,
  bindings: ProtocolBindings,
  placeholders?: ReadonlyMap<string, unknown>,
): StaticResult {
  const value: Record<string, unknown> = {};
  const seenNames = new Set<string>();

  for (const property of objectLiteral.getProperties()) {
    if (!Node.isPropertyAssignment(property)) {
      return staticFailure(
        property,
        path,
        "only plain property assignments are static (no spreads, shorthand, methods, or accessors)",
      );
    }

    const name = readPropertyName(property);

    if (name === undefined) {
      return staticFailure(property, path, "computed property names are non-static");
    }

    // A repeated name would last-win silently — the carrier-level duplicate guard, kept at every
    // object tier (ambiguity is loud, L2).
    if (seenNames.has(name)) {
      return staticFailure(
        property,
        `${path}.${name}`,
        duplicatePropertyMessage(name, "so the value cannot be reified faithfully"),
      );
    }

    seenNames.add(name);

    const initializer = property.getInitializer();

    if (initializer === undefined) {
      return staticFailure(property, path, "property carries no initializer");
    }

    const result = reifyStaticValue(initializer, `${path}.${name}`, bindings);

    if (result.ok) {
      setOwn(value, name, result.value);
      continue;
    }

    if (placeholders?.has(name)) {
      setOwn(value, name, placeholders.get(name));
      continue;
    }

    return result;
  }

  return { ok: true, value };
}

/**
 * What a non-static open-question `key` reifies to. `checkOpenQuestionKeys` refuses it at the
 * key's line exactly as it refuses a static key off the grammar, and deletes it, so the marker
 * never reaches the graph.
 */
const NON_STATIC_OPEN_QUESTION_KEY = Symbol("non-static open question key");
const OPEN_QUESTION_PLACEHOLDERS: ReadonlyMap<string, unknown> = new Map([
  ["key", NON_STATIC_OPEN_QUESTION_KEY],
]);

/**
 * The one array that is not strict about one property: an open question's `key` is the key
 * check's to refuse, so a non-static key drops alone with that check's error while the question
 * and its siblings stay (`spec:model.open-question-keys`). Everything else keeps the strict array
 * rule — a non-static `question`, a spread, or a non-static prose element still fails the whole
 * `openQuestions` value, as `reifyStaticArray` would.
 */
function reifyOpenQuestions(
  arrayLiteral: ArrayLiteralExpression,
  path: string,
  bindings: ProtocolBindings,
): StaticResult {
  const values: unknown[] = [];

  for (const [index, element] of arrayLiteral.getElements().entries()) {
    const elementPath = `${path}[${String(index)}]`;
    const unwrapped = unwrapTransparent(element);
    const result = Node.isObjectLiteralExpression(unwrapped)
      ? reifyStaticObject(unwrapped, elementPath, bindings, OPEN_QUESTION_PLACEHOLDERS)
      : reifyStaticValue(element, elementPath, bindings);

    if (!result.ok) {
      return result;
    }

    values.push(result.value);
  }

  return { ok: true, value: values };
}

function containsDescription(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(containsDescription);
  }

  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.entries(value as Record<string, unknown>).some(
    ([name, entry]) => name === "description" || containsDescription(entry),
  );
}

/* ----- lossy reification: the section tier ----- */

interface LossyDrop {
  /** The property removed — the drop unit (`spec:extraction.determinism`: that one property, the
   * rest survives). */
  readonly droppedPath: string;
  /** The deepest failing node, for the message. */
  readonly failurePath: string;
  readonly line: number;
  readonly reason: string;
}

interface LossyObjectResult {
  readonly value: Record<string, unknown>;
  readonly drops: readonly LossyDrop[];
}

interface SectionPropertyIssue {
  readonly kind: "unrecognized" | "integer-like";
  readonly name: string;
  readonly path: string;
  readonly line: number;
}

interface SectionSanitization {
  readonly value: unknown;
  readonly issues: readonly SectionPropertyIssue[];
}

const GWT_PROPERTY_NAMES = new Set(["given", "when", "then"]);
const RECOGNIZED_SECTION_PROPERTIES: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  [
    "intent",
    new Set([
      "description",
      "actor",
      "problem",
      "outcome",
      "value",
      "risks",
      "assumptions",
      "openQuestions",
    ]),
  ],
  ["intent.openQuestions[]", new Set(["question", "blocking", "key"])],
  ["behavior", new Set(["description", "rules", "examples", "flows", "exampleSpace"])],
  ["behavior.examples[]", GWT_PROPERTY_NAMES],
  ["behavior.exampleSpace", GWT_PROPERTY_NAMES],
  ["constraints[]", new Set(["flavor", "statement", "target", "measurableBy"])],
  ["model", new Set(["description", "terms"])],
  [
    "decision",
    new Set(["description", "context", "decision", "rationale", "alternatives", "consequences"]),
  ],
  ["verification", new Set(["description", "mode", "criteria"])],
]);
const AUTHORING_SHAPE_PATHS = new Set([
  "intent",
  "behavior",
  "constraints[]",
  "model",
  "decision",
  "verification",
]);

/**
 * Section content degrades property-by-property: a non-static property inside a section drops with
 * a warning while its static siblings survive. Lossiness recurses through object nesting only —
 * arrays stay strict (see `reifyStaticArray`), so a failure inside an array drops the owning
 * property wholesale. The one exception is an open question's `key` (`reifyOpenQuestions`).
 */
function reifyObjectLossy(
  objectLiteral: ObjectLiteralExpression,
  path: string,
  bindings: ProtocolBindings,
): LossyObjectResult {
  const value: Record<string, unknown> = {};
  const drops: LossyDrop[] = [];
  const seenNames = new Set<string>();

  for (const property of objectLiteral.getProperties()) {
    // Reported once by the section check, like an integer-like property.
    if (refusedIntegerMemberName(property, path) !== undefined) {
      continue;
    }

    if (!Node.isPropertyAssignment(property)) {
      const name = Node.isShorthandPropertyAssignment(property) ? property.getName() : "<entry>";
      drops.push({
        droppedPath: `${path}.${name}`,
        failurePath: `${path}.${name}`,
        line: property.getStartLineNumber(),
        reason:
          "only plain property assignments are static (no spreads, shorthand, methods, or accessors)",
      });
      continue;
    }

    const name = readKeyedPropertyName(property, path);

    if (name === undefined) {
      drops.push({
        droppedPath: path,
        failurePath: path,
        line: property.getStartLineNumber(),
        reason: "computed property names are non-static",
      });
      continue;
    }

    const propertyPath = `${path}.${name}`;

    // A repeated name would last-win silently; at the section tier the repeat drops with a
    // warning and the first authored value survives (graceful partial extraction, L3).
    if (seenNames.has(name)) {
      drops.push({
        droppedPath: propertyPath,
        failurePath: propertyPath,
        line: property.getStartLineNumber(),
        reason: duplicatePropertyMessage(
          name,
          "so the repeat drops and the first authored value survives",
        ),
      });
      continue;
    }

    seenNames.add(name);

    // An integer-like key is refused whatever its value, so its value is never reified: the
    // section check reports the one error, and no non-static warning joins it.
    if (isRefusedIntegerKey(path, name)) {
      continue;
    }

    const initializer = property.getInitializer();

    if (initializer === undefined) {
      drops.push({
        droppedPath: propertyPath,
        failurePath: propertyPath,
        line: property.getStartLineNumber(),
        reason: "property carries no initializer",
      });
      continue;
    }

    const inner = unwrapTransparent(initializer);

    if (Node.isObjectLiteralExpression(inner)) {
      const nested = reifyObjectLossy(inner, propertyPath, bindings);
      setOwn(value, name, nested.value);
      drops.push(...nested.drops);
      continue;
    }

    const result =
      propertyPath === "intent.openQuestions" && Node.isArrayLiteralExpression(inner)
        ? reifyOpenQuestions(inner, propertyPath, bindings)
        : reifyStaticValue(initializer, propertyPath, bindings);

    if (result.ok) {
      setOwn(value, name, result.value);
      continue;
    }

    drops.push({
      droppedPath: propertyPath,
      failurePath: result.failure.path,
      line: result.failure.line,
      reason: result.failure.reason,
    });
  }

  return { value, drops };
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeSectionValue(node: Node, value: unknown, path: string): SectionSanitization {
  const unwrapped = unwrapTransparent(node);

  if (Node.isArrayLiteralExpression(unwrapped) && Array.isArray(value)) {
    const items: unknown[] = [];
    const issues: SectionPropertyIssue[] = [];

    for (const [index, element] of unwrapped.getElements().entries()) {
      const sanitized = sanitizeSectionValue(element, value[index], `${path}[${String(index)}]`);
      items.push(sanitized.value);
      issues.push(...sanitized.issues);
    }

    return { value: items, issues };
  }

  if (!Node.isObjectLiteralExpression(unwrapped) || !isUnknownRecord(value)) {
    return { value, issues: [] };
  }

  const shapePath = path.replace(/\[\d+\]/g, "[]");
  const recognizedNames = RECOGNIZED_SECTION_PROPERTIES.get(shapePath);
  const refusesIntegerKeys = INTEGER_KEY_SHAPE_PATHS.has(shapePath);

  if (recognizedNames === undefined && !refusesIntegerKeys) {
    return { value, issues: [] };
  }

  const sanitized: Record<string, unknown> = {};
  const issues: SectionPropertyIssue[] = [];
  const seenNames = new Set<string>();

  for (const property of unwrapped.getProperties()) {
    const memberName = refusedIntegerMemberName(property, shapePath);

    // One finding per method or accessor: a getter and a setter of one name are two members.
    if (memberName !== undefined) {
      issues.push({
        kind: "integer-like",
        name: memberName,
        path: `${path}.${memberName}`,
        line: property.getStartLineNumber(),
      });
      continue;
    }

    if (!Node.isPropertyAssignment(property)) {
      continue;
    }

    const name = readKeyedPropertyName(property, shapePath);

    if (name === undefined || seenNames.has(name)) {
      continue;
    }

    const propertyPath = `${path}.${name}`;

    // Checked before the value: lossy reification never reifies an integer-like key's value, so
    // a static and a non-static value meet the same refusal.
    if (isRefusedIntegerKey(shapePath, name)) {
      seenNames.add(name);
      issues.push({
        kind: "integer-like",
        name,
        path: propertyPath,
        line: property.getStartLineNumber(),
      });
      continue;
    }

    if (!Object.hasOwn(value, name)) {
      continue;
    }

    seenNames.add(name);

    if (
      recognizedNames !== undefined &&
      !recognizedNames.has(name) &&
      !(AUTHORING_SHAPE_PATHS.has(shapePath) && RESERVED_DERIVED_PROPERTIES.has(name))
    ) {
      issues.push({
        kind: "unrecognized",
        name,
        path: propertyPath,
        line: property.getStartLineNumber(),
      });
      continue;
    }

    const initializer = property.getInitializer();

    if (initializer === undefined) {
      continue;
    }

    const child = sanitizeSectionValue(initializer, value[name], propertyPath);
    setOwn(sanitized, name, child.value);
    issues.push(...child.issues);
  }

  return { value: sanitized, issues };
}

/** The Design key grammar, which an open question's key shares. */
const OPEN_QUESTION_KEY = /^[a-z][A-Za-z0-9]*$/u;

/**
 * The first plain property assignment of an object literal with the given name, the one lossy
 * reification and sanitization keep when a name repeats.
 */
function firstPropertyNamed(node: Node, name: string): PropertyAssignment | undefined {
  const unwrapped = unwrapTransparent(node);

  if (!Node.isObjectLiteralExpression(unwrapped)) {
    return undefined;
  }

  return unwrapped
    .getProperties()
    .find(
      (property): property is PropertyAssignment =>
        Node.isPropertyAssignment(property) && readPropertyName(property) === name,
    );
}

function typeScriptEntryLines(
  objectLiteral: Node,
  data: Record<string, unknown>,
): readonly ReifiedEntryLine[] {
  const lines: ReifiedEntryLine[] = [];
  for (const sectionName of ["design", "ui"]) {
    const section = data[sectionName];
    const initializer = firstPropertyNamed(objectLiteral, sectionName)?.getInitializer();
    if (!isUnknownRecord(section) || initializer === undefined) continue;
    for (const key of Object.keys(section)) {
      if (key === "description") continue;
      const property = firstPropertyNamed(initializer, key);
      if (property !== undefined) {
        lines.push({ entry: `${sectionName}.${key}`, line: property.getStartLineNumber() });
      }
    }
  }
  const intent = data.intent;
  const intentNode = firstPropertyNamed(objectLiteral, "intent")?.getInitializer();
  const questionsNode =
    intentNode === undefined
      ? undefined
      : firstPropertyNamed(intentNode, "openQuestions")?.getInitializer();
  const array = questionsNode === undefined ? undefined : unwrapTransparent(questionsNode);
  if (
    isUnknownRecord(intent) &&
    Array.isArray(intent.openQuestions) &&
    array !== undefined &&
    Node.isArrayLiteralExpression(array)
  ) {
    for (const [index, element] of array.getElements().entries()) {
      if (index >= intent.openQuestions.length) break;
      const question = firstPropertyNamed(element, "question");
      lines.push({
        entry: `question[${String(index)}]`,
        line: (question ?? element).getStartLineNumber(),
      });
    }
  }
  return lines;
}

/** The line of `openQuestions[<index>].key` in an authored Intent, or the Intent's own line. */
function openQuestionKeyLine(intentNode: Node, index: number): number {
  const fallback = intentNode.getStartLineNumber();
  const questions = firstPropertyNamed(intentNode, "openQuestions")?.getInitializer();
  const array = questions === undefined ? undefined : unwrapTransparent(questions);

  if (array === undefined || !Node.isArrayLiteralExpression(array)) {
    return fallback;
  }

  const element = array.getElements()[index];
  const key = element === undefined ? undefined : firstPropertyNamed(element, "key");

  return key?.getStartLineNumber() ?? fallback;
}

/**
 * An open question's key is the Design key grammar and unique among one Spec's open questions.
 * A key that is not a string on the grammar, or repeats an earlier key, drops alone with an error;
 * the question and the Spec stay (`spec:model.open-question-keys`). A non-static key arrives here
 * as `NON_STATIC_OPEN_QUESTION_KEY` and is refused as a key off the grammar.
 */
function checkOpenQuestionKeys(
  intentNode: Node,
  intent: unknown,
  file: string,
  subjectId: string | undefined,
  findings: Finding[],
): void {
  const questions = isUnknownRecord(intent) ? intent.openQuestions : undefined;

  if (!Array.isArray(questions)) {
    return;
  }

  const seen = new Set<string>();

  for (const [index, question] of questions.entries()) {
    if (!isUnknownRecord(question) || !Object.hasOwn(question, "key")) {
      continue;
    }

    const key: unknown = question.key;
    const lawful = typeof key === "string" && OPEN_QUESTION_KEY.test(key);

    if (lawful && !seen.has(key)) {
      seen.add(key);
      continue;
    }

    const reason = lawful
      ? "open question keys must be unique"
      : "open question keys must be lower-camel ASCII";
    const path = `intent.openQuestions[${String(index)}].key`;
    delete question.key;
    findings.push(
      createExtractFinding(
        extractFindingIds.unrecognizedProperty,
        "error",
        `property "${path}" is refused: ${reason}`,
        file,
        openQuestionKeyLine(intentNode, index),
        subjectId,
        path,
      ),
    );
  }
}

function appendSectionPropertyFindings(
  issues: readonly SectionPropertyIssue[],
  file: string,
  subjectId: string | undefined,
  findings: Finding[],
): void {
  for (const issue of issues) {
    // An integer-like key is an error that drops the one key and keeps the Spec and its other keys.
    if (issue.kind === "integer-like") {
      findings.push(
        createExtractFinding(
          extractFindingIds.unrecognizedProperty,
          "error",
          `property "${issue.name}" is refused: integer-like keys are not accepted in design, ui, or model terms`,
          file,
          issue.line,
          subjectId,
          issue.path,
        ),
      );
      continue;
    }

    findings.push(
      createExtractFinding(
        extractFindingIds.unrecognizedProperty,
        "warning",
        `property "${issue.path}" is outside the authored section shape and is dropped — authored content must never silently fall out of the graph (L2)`,
        file,
        issue.line,
        subjectId,
        issue.path,
      ),
    );
  }
}

/* ----- spec() and pack() call reification ----- */

interface CallReification<TEntry> {
  readonly entry?: TEntry;
  readonly findings: readonly Finding[];
}

export function peekId(
  objectLiteral: ObjectLiteralExpression,
  expectedNamespaces: readonly string[],
  bindings: ProtocolBindings,
): string | undefined {
  for (const property of objectLiteral.getProperties()) {
    if (!Node.isPropertyAssignment(property) || readPropertyName(property) !== "id") {
      continue;
    }

    const initializer = property.getInitializer();

    if (initializer === undefined) {
      return undefined;
    }

    const result = reifyStaticIdExpression(initializer, expectedNamespaces, bindings, "id");

    return result.ok ? result.id : undefined;
  }

  return undefined;
}

function requireSingleObjectArgument(
  call: CallExpression,
  builderName: string,
  file: string,
  findings: Finding[],
): ObjectLiteralExpression | undefined {
  const callArguments = call.getArguments();
  const [firstArgument] = callArguments;
  const unwrapped =
    callArguments.length === 1 && firstArgument !== undefined
      ? unwrapTransparent(firstArgument)
      : undefined;

  if (unwrapped !== undefined && Node.isObjectLiteralExpression(unwrapped)) {
    return unwrapped;
  }

  findings.push(
    createExtractFinding(
      extractFindingIds.nonStaticEnvelope,
      "error",
      `${builderName}(…) must take exactly one fresh object literal argument`,
      file,
      call.getStartLineNumber(),
    ),
  );

  return undefined;
}

function appendIdFinding(
  failure: Exclude<IdReification, { ok: true }>,
  file: string,
  subjectId: string | undefined,
  path: string,
  findings: Finding[],
): void {
  findings.push(
    createExtractFinding(
      failure.kind === "non-static"
        ? extractFindingIds.nonStaticEnvelope
        : extractFindingIds.invalidId,
      "error",
      `envelope field "${path}" did not reify: ${failure.reason}`,
      file,
      failure.line,
      subjectId,
      path,
    ),
  );
}

function appendDropFindings(
  drops: readonly LossyDrop[],
  file: string,
  subjectId: string | undefined,
  findings: Finding[],
): void {
  for (const drop of drops) {
    findings.push(
      createExtractFinding(
        extractFindingIds.nonStaticSection,
        "warning",
        `property "${drop.droppedPath}" dropped: at "${drop.failurePath}", ${drop.reason}`,
        file,
        drop.line,
        subjectId,
        drop.droppedPath,
      ),
    );
  }
}

interface ReifiedRelations {
  readonly ok: boolean;
  readonly relations: readonly Record<string, unknown>[];
}

/**
 * A `relations[]` entry is exactly one of the six relation builders around one static spec id. A
 * raw object literal here could smuggle a derived edge (`satisfies`, a foreign `claim`) into the
 * authored layer, so anything else is an envelope error — the extraction-layer twin of
 * authoring-shape honesty.
 */
function reifyRelations(
  node: Node,
  file: string,
  subjectId: string | undefined,
  bindings: ProtocolBindings,
  findings: Finding[],
): ReifiedRelations {
  const unwrapped = unwrapTransparent(node);

  if (!Node.isArrayLiteralExpression(unwrapped)) {
    findings.push(
      createExtractFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        `envelope field "relations" must be an array literal`,
        file,
        unwrapped.getStartLineNumber(),
        subjectId,
        "relations",
      ),
    );

    return { ok: false, relations: [] };
  }

  let ok = true;
  const relations: Record<string, unknown>[] = [];

  for (const [index, element] of unwrapped.getElements().entries()) {
    const entryPath = `relations[${String(index)}]`;
    const builderCall = resolveBuilderCall(element, bindings);

    if (builderCall === undefined || !RELATION_BUILDER_NAMES.has(builderCall.builder)) {
      findings.push(
        createExtractFinding(
          extractFindingIds.nonStaticEnvelope,
          "error",
          `"${entryPath}" is not one of the six relation builders (${SPEC_RELATION_TYPES.join(" · ")}) — a raw relation entry can smuggle a derived edge, so it is rejected at the envelope tier`,
          file,
          element.getStartLineNumber(),
          subjectId,
          entryPath,
        ),
      );
      ok = false;
      continue;
    }

    const builderArguments = builderCall.call.getArguments();
    const [target] = builderArguments;

    if (builderArguments.length !== 1 || target === undefined) {
      findings.push(
        createExtractFinding(
          extractFindingIds.nonStaticEnvelope,
          "error",
          `"${entryPath}" must wrap exactly one spec id target`,
          file,
          builderCall.call.getStartLineNumber(),
          subjectId,
          entryPath,
        ),
      );
      ok = false;
      continue;
    }

    const idResult = reifyStaticIdExpression(target, ["spec"], bindings, `${entryPath}.target`);

    if (!idResult.ok) {
      appendIdFinding(idResult, file, subjectId, `${entryPath}.target`, findings);
      ok = false;
      continue;
    }

    relations.push({ type: builderCall.builder, target: idResult.id, claim: "declared" });
  }

  return { ok, relations };
}

interface EnvelopeEnumField {
  readonly name: "kind" | "altitude" | "readiness";
  readonly values: ReadonlySet<string>;
  readonly label: string;
}

const SPEC_ENUM_FIELDS: readonly EnvelopeEnumField[] = [
  { name: "kind", values: SPEC_KIND_VALUES, label: SPEC_KINDS.join(" · ") },
  { name: "altitude", values: SPEC_ALTITUDE_VALUES, label: SPEC_ALTITUDES.join(" · ") },
  { name: "readiness", values: SPEC_READINESS_VALUES, label: SPEC_READINESS.join(" · ") },
];

function reifySpecCall(
  call: CallExpression,
  file: string,
  bindings: ProtocolBindings,
): CallReification<ReifiedSpec> {
  const findings: Finding[] = [];
  const objectLiteral = requireSingleObjectArgument(call, "spec", file, findings);

  if (objectLiteral === undefined) {
    return { findings };
  }

  const subjectId = peekId(objectLiteral, ["spec"], bindings);
  const data: Record<string, unknown> = {};
  const authoredNames = new Set<string>();
  let sawOpaqueEntry = false;
  let envelopeOk = true;

  const failEnvelope = (line: number, message: string, path?: string): void => {
    findings.push(
      createExtractFinding(
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
      // A shorthand entry still names its field; a spread or accessor could carry any field —
      // either way the absence pass must not call an authored field missing on top of this
      // finding (a non-static field is not an absent one).
      if (Node.isShorthandPropertyAssignment(property)) {
        authoredNames.add(property.getName());
      } else {
        sawOpaqueEntry = true;
      }

      failEnvelope(
        property.getStartLineNumber(),
        "the spec object literal must be fresh: only plain property assignments are static (a spread or shorthand entry could carry envelope fields opaquely)",
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
      const idResult = reifyStaticIdExpression(initializer, ["spec"], bindings, "id");

      if (!idResult.ok) {
        appendIdFinding(idResult, file, subjectId, "id", findings);
        envelopeOk = false;
        continue;
      }

      data.id = idResult.id;
      continue;
    }

    const enumField = SPEC_ENUM_FIELDS.find((field) => field.name === name);

    if (enumField !== undefined) {
      const result = reifyStaticString(initializer, name);

      if (!result.ok) {
        failEnvelope(
          result.failure.line,
          `envelope field "${name}" did not reify: ${result.failure.reason}`,
          name,
        );
        continue;
      }

      const text = result.value as string;

      if (!enumField.values.has(text)) {
        failEnvelope(
          property.getStartLineNumber(),
          `envelope field "${name}" reified to "${text}", which is not one of ${enumField.label} — the typed envelope cannot carry it`,
          name,
        );
        continue;
      }

      data[name] = text;
      continue;
    }

    if (name === "relations") {
      const relationsResult = reifyRelations(initializer, file, subjectId, bindings, findings);

      if (!relationsResult.ok) {
        envelopeOk = false;
        continue;
      }

      data.relations = relationsResult.relations;
      continue;
    }

    if (name === "title") {
      const result = reifyStaticString(initializer, "title");

      if (!result.ok) {
        appendDropFindings(
          [
            {
              droppedPath: "title",
              failurePath: result.failure.path,
              line: result.failure.line,
              reason: result.failure.reason,
            },
          ],
          file,
          subjectId,
          findings,
        );
        continue;
      }

      data.title = result.value;
      continue;
    }

    if (name === "narrative") {
      const result = reifyStaticString(initializer, "narrative");

      if (!result.ok) {
        appendDropFindings(
          [
            {
              droppedPath: "narrative",
              failurePath: result.failure.path,
              line: result.failure.line,
              reason: result.failure.reason,
            },
          ],
          file,
          subjectId,
          findings,
        );
        continue;
      }

      data.narrative = result.value;
      continue;
    }

    if (name === "description") {
      findings.push(
        createExtractFinding(
          extractFindingIds.unownedProse,
          "error",
          'prose field "description" has no owning section',
          file,
          property.getStartLineNumber(),
          subjectId,
          name,
        ),
      );
      envelopeOk = false;
      continue;
    }

    if (RESERVED_DERIVED_PROPERTIES.has(name)) {
      findings.push(
        createExtractFinding(
          extractFindingIds.reservedProperty,
          "error",
          `spec field "${name}" states derived graph vocabulary — delivery facts and derived edges are computed by the extractor, never authored, so the spec is not extracted`,
          file,
          property.getStartLineNumber(),
          subjectId,
          name,
        ),
      );
      envelopeOk = false;
      continue;
    }

    if (!SPEC_SECTION_NAME_SET.has(name)) {
      findings.push(
        createExtractFinding(
          extractFindingIds.unrecognizedProperty,
          "warning",
          `property "${name}" is outside the spec shape (the envelope plus the sections ${SPEC_SECTION_NAMES.join(" · ")}) and is dropped — authored content must never silently fall out of the graph (L2)`,
          file,
          property.getStartLineNumber(),
          subjectId,
          name,
        ),
      );
      continue;
    }

    // The section tier: the eight ratified sections reify lossily. Unknown static properties drop
    // loudly; smuggled derived vocabulary survives for the harder authoring-shape honesty check.
    const inner = unwrapTransparent(initializer);

    if (Node.isObjectLiteralExpression(inner)) {
      const lossy = reifyObjectLossy(inner, name, bindings);
      const sanitized = sanitizeSectionValue(inner, lossy.value, name);
      data[name] = sanitized.value;
      appendDropFindings(lossy.drops, file, subjectId, findings);
      appendSectionPropertyFindings(sanitized.issues, file, subjectId, findings);
      if (name === "intent") {
        checkOpenQuestionKeys(inner, sanitized.value, file, subjectId, findings);
      }
      continue;
    }

    const result = reifyStaticValue(initializer, name, bindings);

    if (result.ok) {
      if (name === "constraints" && containsDescription(result.value)) {
        findings.push(
          createExtractFinding(
            extractFindingIds.unownedProse,
            "error",
            'prose field "description" is not owned by constraints',
            file,
            property.getStartLineNumber(),
            subjectId,
            name,
          ),
        );
        envelopeOk = false;
        continue;
      }

      const sanitized = sanitizeSectionValue(inner, result.value, name);
      data[name] = sanitized.value;
      appendSectionPropertyFindings(sanitized.issues, file, subjectId, findings);
      if (name === "intent") {
        checkOpenQuestionKeys(inner, sanitized.value, file, subjectId, findings);
      }
      continue;
    }

    appendDropFindings(
      [
        {
          droppedPath: name,
          failurePath: result.failure.path,
          line: result.failure.line,
          reason: result.failure.reason,
        },
      ],
      file,
      subjectId,
      findings,
    );
  }

  // Absence is judged on authored names, never on reified values: every genuinely missing field
  // is reported in one pass, and a field that was authored but failed to reify already carries
  // its own finding. An opaque entry (spread, accessor, computed name) could carry any field, so
  // beside one nothing can honestly be called missing.
  for (const required of ["id", "kind", "altitude", "readiness"]) {
    if (!authoredNames.has(required) && !sawOpaqueEntry) {
      failEnvelope(
        call.getStartLineNumber(),
        `envelope field "${required}" is missing — the typed envelope cannot be constructed without it`,
        required,
      );
    }
  }

  // An unrecognized property drops itself and never its carrier, at either severity: the
  // integer-like key refusal is an error that keeps the Spec and its other keys.
  if (
    !envelopeOk ||
    findings.some(
      (finding) =>
        finding.severity === "error" &&
        finding.validatorId !== extractFindingIds.unrecognizedProperty,
    )
  ) {
    return { findings };
  }

  return {
    entry: {
      data,
      id: data.id as string,
      file,
      line: call.getStartLineNumber(),
      entryLines: typeScriptEntryLines(objectLiteral, data),
    },
    findings,
  };
}

function reifyIdArray(
  node: Node,
  fieldName: string,
  file: string,
  subjectId: string | undefined,
  bindings: ProtocolBindings,
  findings: Finding[],
): { readonly ok: boolean; readonly ids: readonly string[] } {
  const unwrapped = unwrapTransparent(node);

  if (!Node.isArrayLiteralExpression(unwrapped)) {
    findings.push(
      createExtractFinding(
        extractFindingIds.nonStaticEnvelope,
        "error",
        `envelope field "${fieldName}" must be an array literal`,
        file,
        unwrapped.getStartLineNumber(),
        subjectId,
        fieldName,
      ),
    );

    return { ok: false, ids: [] };
  }

  let ok = true;
  const ids: string[] = [];

  for (const [index, element] of unwrapped.getElements().entries()) {
    const entryPath = `${fieldName}[${String(index)}]`;
    const idResult = reifyStaticIdExpression(element, ["spec"], bindings, entryPath);

    if (!idResult.ok) {
      appendIdFinding(idResult, file, subjectId, entryPath, findings);
      ok = false;
      continue;
    }

    ids.push(idResult.id);
  }

  return { ok, ids };
}

function reifyPackCall(
  call: CallExpression,
  file: string,
  bindings: ProtocolBindings,
): CallReification<ReifiedPack> {
  const findings: Finding[] = [];
  const objectLiteral = requireSingleObjectArgument(call, "pack", file, findings);

  if (objectLiteral === undefined) {
    return { findings };
  }

  const subjectId = peekId(objectLiteral, ["pack"], bindings);
  const data: Record<string, unknown> = {};
  const authoredNames = new Set<string>();
  let sawOpaqueEntry = false;
  let envelopeOk = true;

  const failEnvelope = (line: number, message: string, path?: string): void => {
    findings.push(
      createExtractFinding(
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
      // The absence pass must not call an authored field missing (a non-static field is not an
      // absent one): a shorthand entry still names its field; a spread or accessor is opaque.
      if (Node.isShorthandPropertyAssignment(property)) {
        authoredNames.add(property.getName());
      } else {
        sawOpaqueEntry = true;
      }

      failEnvelope(
        property.getStartLineNumber(),
        "the pack object literal must be fresh: only plain property assignments are static (a spread or shorthand entry could carry envelope fields opaquely)",
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
      const idResult = reifyStaticIdExpression(initializer, ["pack"], bindings, "id");

      if (!idResult.ok) {
        appendIdFinding(idResult, file, subjectId, "id", findings);
        envelopeOk = false;
        continue;
      }

      data.id = idResult.id;
      continue;
    }

    if (name === "specs" || name === "modelRefs") {
      const result = reifyIdArray(initializer, name, file, subjectId, bindings, findings);

      if (!result.ok) {
        envelopeOk = false;
        continue;
      }

      data[name] = result.ids;
      continue;
    }

    if (name === "title" || name === "framing") {
      const result = reifyStaticString(initializer, name);

      if (!result.ok) {
        appendDropFindings(
          [
            {
              droppedPath: name,
              failurePath: result.failure.path,
              line: result.failure.line,
              reason: result.failure.reason,
            },
          ],
          file,
          subjectId,
          findings,
        );
        continue;
      }

      data[name] = result.value;
      continue;
    }

    if (RESERVED_DERIVED_PROPERTIES.has(name)) {
      findings.push(
        createExtractFinding(
          extractFindingIds.reservedProperty,
          "error",
          `pack field "${name}" states derived graph vocabulary — delivery facts and derived edges are computed by the extractor, never authored (a pack states no truth of its own), so the pack is not extracted`,
          file,
          property.getStartLineNumber(),
          subjectId,
          name,
        ),
      );
      envelopeOk = false;
      continue;
    }

    // The pack manifest has no section tier: every authored field is named above, so anything
    // else drops loudly (L2) instead of riding into the model unread.
    findings.push(
      createExtractFinding(
        extractFindingIds.unrecognizedProperty,
        "warning",
        `property "${name}" is outside the pack manifest shape (id · specs · modelRefs · title · framing) and is dropped — authored content must never silently fall out of the graph (L2)`,
        file,
        property.getStartLineNumber(),
        subjectId,
        name,
      ),
    );
  }

  // Absence is judged on authored names, never on reified values (see `reifySpecCall`).
  for (const required of ["id", "specs"]) {
    if (!authoredNames.has(required) && !sawOpaqueEntry) {
      failEnvelope(
        call.getStartLineNumber(),
        `envelope field "${required}" is missing — the pack manifest cannot be constructed without it`,
        required,
      );
    }
  }

  if (!envelopeOk || findings.some((finding) => finding.severity === "error")) {
    return { findings };
  }

  return {
    entry: {
      data,
      id: data.id as string,
      file,
      line: call.getStartLineNumber(),
    },
    findings,
  };
}

/* ----- the recognized statement set ----- */

function unrecognizedStatement(file: string, line: number, message: string): Finding {
  return createExtractFinding(
    extractFindingIds.unrecognizedStatement,
    "warning",
    `${message}; the statement is ignored (the recognized set: imports bound to Protocol builder modules and const declarations initialized with spec(…)/pack(…))`,
    file,
    line,
  );
}

const staticReificationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.static-reification"),
  label: "reifies authored carriers from the AST and never evaluates them",
  satisfies: ref("spec:extraction.determinism"),
  component: componentAnchorId("component:protocol.extract"),
  role: "extractor",
});
void staticReificationAnchor;

/**
 * Reifies one `*.sdp.ts` file standalone — no type checker, no import following. Anything outside
 * the recognized statement set is ignored with a loud warning rather than a hard error: the base
 * defines no hard-error class for foreign statements (the `sdp/spec-static` lint stays future
 * work).
 */
export function reifySourceFile(
  sourceFile: SourceFile,
  relativePath: string,
  bindingScope?: ProtocolBindingScope,
): FileReification {
  const bindings = collectProtocolBindings(sourceFile, bindingScope);
  const specs: ReifiedSpec[] = [];
  const packs: ReifiedPack[] = [];
  const findings: Finding[] = [];

  for (const statement of sourceFile.getStatements()) {
    if (Node.isImportDeclaration(statement)) {
      if (isProtocolBuilderModuleSpecifier(statement.getModuleSpecifierValue(), bindingScope)) {
        continue;
      }

      findings.push(
        unrecognizedStatement(
          relativePath,
          statement.getStartLineNumber(),
          `import from "${statement.getModuleSpecifierValue()}" is not the protocol package — identifiers it binds are non-static wherever they appear`,
        ),
      );
      continue;
    }

    if (Node.isVariableStatement(statement)) {
      if (statement.getDeclarationKind() !== VariableDeclarationKind.Const) {
        findings.push(
          unrecognizedStatement(
            relativePath,
            statement.getStartLineNumber(),
            "only const declarations are recognized",
          ),
        );
        continue;
      }

      for (const declaration of statement.getDeclarations()) {
        const initializer = declaration.getInitializer();
        const builderCall =
          initializer === undefined ? undefined : resolveBuilderCall(initializer, bindings);

        if (builderCall?.builder === "spec") {
          const result = reifySpecCall(builderCall.call, relativePath, bindings);
          findings.push(...result.findings);

          if (result.entry !== undefined) {
            specs.push(result.entry);
          }

          continue;
        }

        if (builderCall?.builder === "pack") {
          const result = reifyPackCall(builderCall.call, relativePath, bindings);
          findings.push(...result.findings);

          if (result.entry !== undefined) {
            packs.push(result.entry);
          }

          continue;
        }

        findings.push(
          unrecognizedStatement(
            relativePath,
            declaration.getStartLineNumber(),
            `const "${declaration.getName()}" is not initialized with a spec(…)/pack(…) call bound to the protocol package`,
          ),
        );
      }

      continue;
    }

    findings.push(
      unrecognizedStatement(
        relativePath,
        statement.getStartLineNumber(),
        `${statement.getKindName()} is outside the authored grammar`,
      ),
    );
  }

  return { specs, packs, findings };
}
