import { Node, SyntaxKind, VariableDeclarationKind } from "ts-morph";
import type {
  ArrayLiteralExpression,
  CallExpression,
  ObjectLiteralExpression,
  PropertyAssignment,
  SourceFile,
} from "ts-morph";

import { deliveryFactNames } from "../graph/schema.js";
import { CODE_ANCHOR_NAMESPACES, parseId } from "../ids.js";
import { SPEC_ALTITUDES, SPEC_KINDS, SPEC_READINESS } from "../model/descriptors.js";
import { SPEC_RELATION_TYPES } from "../model/relations.js";
import { SPEC_SECTION_NAMES } from "../model/sections.js";
import type { Finding, Severity } from "../validate/contracts.js";

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
export const PROTOCOL_MODULE_SPECIFIER = "@libar-dev/software-delivery-protocol";

/**
 * The extraction finding ids, pinned. Two tiers (`03` §2), covering both authored surfaces (spec
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
  nonStaticEnvelope: "extract/non-static-envelope",
  invalidId: "extract/invalid-id",
  duplicateId: "extract/duplicate-id",
  reservedProperty: "extract/reserved-property",
  nonStaticSection: "extract/non-static-section",
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
  ["testAnchorId", ["test"]],
]);

const RELATION_BUILDER_NAMES = new Set<string>(SPEC_RELATION_TYPES);
const SPEC_KIND_VALUES = new Set<string>(SPEC_KINDS);
const SPEC_ALTITUDE_VALUES = new Set<string>(SPEC_ALTITUDES);
const SPEC_READINESS_VALUES = new Set<string>(SPEC_READINESS);
const SPEC_SECTION_NAME_SET = new Set<string>(SPEC_SECTION_NAMES);

/**
 * Derived graph vocabulary an authored carrier must never state: the delivery facts plus the
 * graph's own node and edge fields. Hand-authoring one impersonates machine truth, so it is an
 * envelope-tier hard error — the extraction-layer twin of authoring-shape honesty (`05` §2,
 * check 5) on the top-level authored shape, exactly as raw `relations[]` entries and foreign
 * anchor fields are on theirs. In-section content stays the honesty checks' jurisdiction: it
 * reifies through and the `honesty/authoring-shape` validator sees it in the model.
 */
const RESERVED_DERIVED_PROPERTIES = new Set<string>([
  ...deliveryFactNames,
  "deliveryFacts",
  "claim",
  "nodeType",
  "specKind",
  "satisfies",
  "verifies",
  "belongsTo",
]);

export interface ReifiedSpec {
  /** Plain `Spec`-shaped data in authored property order — built from the AST, never evaluated. */
  readonly data: Record<string, unknown>;
  readonly id: string;
  readonly file: string;
  readonly line: number;
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
  return `${node.getKindName()} is outside the static value grammar (string/number/boolean literals, array and fresh object literals; \`as const\` and parentheses are transparent; id builders unwrap in id slots only)`;
}

/** `as const` and parentheses are transparent; every other wrapper is non-static. */
export function unwrapTransparent(node: Node): Node {
  let current = node;

  for (;;) {
    if (Node.isParenthesizedExpression(current)) {
      current = current.getExpression();
      continue;
    }

    if (Node.isAsExpression(current) && current.getTypeNode()?.getText() === "const") {
      current = current.getExpression();
      continue;
    }

    return current;
  }
}

export interface ProtocolBindings {
  /** Local name → exported builder name, from named imports. */
  readonly named: ReadonlyMap<string, string>;
  /**
   * Locals bound by `import * as ns` — every protocol builder is reachable as a property — and by
   * a default import (the package ships no default export, but an interop consumer can still
   * author through one; treating it the same keeps the binding from silently falling out, L2).
   */
  readonly namespaceLocals: ReadonlySet<string>;
}

export function collectProtocolBindings(sourceFile: SourceFile): ProtocolBindings {
  const named = new Map<string, string>();
  const namespaceLocals = new Set<string>();

  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    if (importDeclaration.getModuleSpecifierValue() !== PROTOCOL_MODULE_SPECIFIER) {
      continue;
    }

    for (const namedImport of importDeclaration.getNamedImports()) {
      const exportedName = namedImport.getName();
      const localName = namedImport.getAliasNode()?.getText() ?? exportedName;
      named.set(localName, exportedName);
    }

    const namespaceImport = importDeclaration.getNamespaceImport();

    if (namespaceImport !== undefined) {
      namespaceLocals.add(namespaceImport.getText());
    }

    const defaultImport = importDeclaration.getDefaultImport();

    if (defaultImport !== undefined) {
      namespaceLocals.add(defaultImport.getText());
    }
  }

  return { named, namespaceLocals };
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

function namespacesList(namespaces: readonly string[]): string {
  return namespaces.map((entry) => `"${entry}"`).join(" · ");
}

function namespacesLabel(namespaces: readonly string[]): string {
  return namespaces.length === 1
    ? `${namespacesList(namespaces)} is required`
    : `one of ${namespacesList(namespaces)} is required`;
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

  try {
    const parsed = parseId(idText);

    // The wrapping builder's contract checks first: it is the narrower statement, and the one
    // evaluation would enforce (the builder throws on a foreign namespace).
    if (
      builderCall !== undefined &&
      builderNamespaces !== undefined &&
      !builderNamespaces.includes(parsed.namespace)
    ) {
      return {
        ok: false,
        kind: "invalid",
        line,
        reason: `id "${idText}" carries namespace "${parsed.namespace}" where ${builderCall.builder}(…) accepts only ${namespacesList(builderNamespaces)} — the builder's own contract, restated statically`,
      };
    }

    if (!expectedNamespaces.includes(parsed.namespace)) {
      return {
        ok: false,
        kind: "invalid",
        line,
        reason: `id "${idText}" carries namespace "${parsed.namespace}" where ${namespacesLabel(expectedNamespaces)}`,
      };
    }
  } catch (error) {
    return {
      ok: false,
      kind: "invalid",
      line,
      reason: error instanceof Error ? error.message : `id "${idText}" fails the id grammar`,
    };
  }

  return { ok: true, id: idText };
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

function reifyStaticObject(
  objectLiteral: ObjectLiteralExpression,
  path: string,
  bindings: ProtocolBindings,
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

    if (!result.ok) {
      return result;
    }

    value[name] = result.value;
  }

  return { ok: true, value };
}

/* ----- lossy reification: the section tier ----- */

interface LossyDrop {
  /** The property removed — the drop unit (`03` §2: that one property, the rest survives). */
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

/**
 * Section content degrades property-by-property: a non-static property inside a section drops with
 * a warning while its static siblings survive. Lossiness recurses through object nesting only —
 * arrays stay strict (see `reifyStaticArray`), so a failure inside an array drops the owning
 * property wholesale.
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

    const name = readPropertyName(property);

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
      value[name] = nested.value;
      drops.push(...nested.drops);
      continue;
    }

    const result = reifyStaticValue(initializer, propertyPath, bindings);

    if (result.ok) {
      value[name] = result.value;
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

    // The section tier: the eight ratified sections reify lossily, so static content (including
    // an in-section smuggled delivery fact, which the authoring-shape honesty check must get to
    // see) survives and only the non-static parts drop, loudly.
    const inner = unwrapTransparent(initializer);

    if (Node.isObjectLiteralExpression(inner)) {
      const lossy = reifyObjectLossy(inner, name, bindings);
      data[name] = lossy.value;
      appendDropFindings(lossy.drops, file, subjectId, findings);
      continue;
    }

    const result = reifyStaticValue(initializer, name, bindings);

    if (result.ok) {
      data[name] = result.value;
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
    `${message}; the statement is ignored (the recognized set: imports from "${PROTOCOL_MODULE_SPECIFIER}" and const declarations initialized with spec(…)/pack(…))`,
    file,
    line,
  );
}

/**
 * Reifies one `*.sdp.ts` file standalone — no type checker, no import following. Anything outside
 * the recognized statement set is ignored with a loud warning rather than a hard error: the base
 * defines no hard-error class for foreign statements (the `sdp/spec-static` lint stays future
 * work).
 */
export function reifySourceFile(sourceFile: SourceFile, relativePath: string): FileReification {
  const bindings = collectProtocolBindings(sourceFile);
  const specs: ReifiedSpec[] = [];
  const packs: ReifiedPack[] = [];
  const findings: Finding[] = [];

  for (const statement of sourceFile.getStatements()) {
    if (Node.isImportDeclaration(statement)) {
      if (statement.getModuleSpecifierValue() === PROTOCOL_MODULE_SPECIFIER) {
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
