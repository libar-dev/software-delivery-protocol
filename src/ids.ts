import { componentAnchorId as createComponentAnchorId } from "./ids.js";
import { codeAnchor } from "./model/code-anchor.js";

type Brand<TBrand extends string> = string & {
  readonly __brand: TBrand;
};

const LOWERCASE_NAMESPACE_PATTERN = /^[a-z][a-z0-9-]*$/u;
const PATH_SEGMENT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-]*$/u;
const ENTRY_ADDRESS_NAMESPACE = "spec";
const ENTRY_ADDRESS_KEY_PATTERN = /^[a-z][A-Za-z0-9]*$/u;

/**
 * The sections an entry address may name: a keyed entry of `design` or `ui`, or a keyed open
 * question (`spec:model.open-question-keys`).
 */
export const ENTRY_ADDRESS_SECTIONS = ["design", "ui", "question"] as const;
export type EntryAddressSection = (typeof ENTRY_ADDRESS_SECTIONS)[number];

function isEntryAddressSection(value: string | undefined): value is EntryAddressSection {
  return ENTRY_ADDRESS_SECTIONS.some((section) => section === value);
}

export type SpecId = Brand<"SpecId">;
export type PackId = Brand<"PackId">;
export type AnchorId = Brand<"AnchorId">;
// The flavor layers a second key over the `AnchorId` brand rather than intersecting a second
// `Brand<…>`: two disjoint unit types on one `__brand` key reduce the intersection to `never`,
// and `never` assigns everywhere — tsc would stop enforcing the flavored ids entirely.
export type CodeAnchorId = AnchorId & { readonly __anchorFlavor: "code" };
export type ComponentAnchorId = CodeAnchorId & {
  readonly __codeAnchorNamespace: "component";
};
export type TestAnchorId = AnchorId & { readonly __anchorFlavor: "test" };
export type OracleAnchorId = AnchorId & { readonly __anchorFlavor: "oracle" };

/**
 * The implementation-flavored code namespaces a `codeAnchor` may bind (the generic `codeAnchor`,
 * MD-8): any code location — a class, function, route, or module — regardless of how the runtime
 * is wired. The `test:` namespace is deliberately not here: a test anchor is the *verifying*
 * binding (`specTest`), a different binding direction, not a fourth code flavor.
 */
export const CODE_ANCHOR_NAMESPACES = ["impl", "api", "component"] as const;

export interface IdParts {
  readonly namespace: string;
  readonly path: string;
  readonly subpath?: string;
}

function failId(value: string, reason: string): never {
  throw new Error(`Invalid ID "${value}": ${reason}`);
}

function brandId<TBrand extends string>(value: string): Brand<TBrand> {
  return value as Brand<TBrand>;
}

function validatePath(value: string, path: string): void {
  const segments = path.split(".");

  if (segments.some((segment) => segment.length === 0)) {
    failId(value, "empty path segment");
  }

  if (segments.some((segment) => !PATH_SEGMENT_PATTERN.test(segment))) {
    failId(value, "invalid path segment");
  }
}

/**
 * The `#` sub-part is an entry address, `spec:<path>#<section>.<key>`, naming one keyed entry of a
 * Spec's `design` or `ui` section or one keyed open question. It is reserved in every namespace
 * and never part of an identity: the parser admits it so prose can carry it, and every id slot
 * refuses it. The refusal rows run in order and the first match wins.
 */
function validateEntryAddress(value: string, namespace: string, subpath: string): void {
  if (namespace !== ENTRY_ADDRESS_NAMESPACE) {
    failId(value, "the # sub-part is an entry address and is admitted only in the spec namespace");
  }

  if (subpath.length === 0 || subpath.includes("#")) {
    failId(value, "malformed # suffix");
  }

  const dotIndex = subpath.indexOf(".");
  const section = dotIndex === -1 ? undefined : subpath.slice(0, dotIndex);

  if (!isEntryAddressSection(section)) {
    failId(value, "entry address must be <section>.<key> with section design, ui, or question");
  }

  if (!ENTRY_ADDRESS_KEY_PATTERN.test(subpath.slice(dotIndex + 1))) {
    failId(value, "entry address key must be lower-camel ASCII");
  }
}

function validateParsedNamespace(value: string, namespace: string): void {
  if (!LOWERCASE_NAMESPACE_PATTERN.test(namespace)) {
    failId(value, "namespace must be lowercase");
  }
}

function validateIdShape(value: string): IdParts {
  if (value.length === 0) {
    failId(value, "missing namespace");
  }

  if (/\s/u.test(value)) {
    failId(value, "whitespace is not allowed");
  }

  const colonIndex = value.indexOf(":");

  if (colonIndex <= 0) {
    failId(value, "missing namespace");
  }

  const namespace = value.slice(0, colonIndex);
  validateParsedNamespace(value, namespace);

  const body = value.slice(colonIndex + 1);

  if (body.length === 0) {
    failId(value, "missing path");
  }

  const hashIndex = body.indexOf("#");
  const path = hashIndex === -1 ? body : body.slice(0, hashIndex);
  const subpath = hashIndex === -1 ? undefined : body.slice(hashIndex + 1);

  if (path.length === 0) {
    failId(value, "missing path");
  }

  validatePath(value, path);

  if (subpath !== undefined) {
    validateEntryAddress(value, namespace, subpath);
  }

  return subpath === undefined ? { namespace, path } : { namespace, path, subpath };
}

function requireNamespace<TBrand extends string>(
  value: string,
  expectedNamespaces: readonly string[],
): Brand<TBrand> {
  const parsed = validateIdShape(value);

  if (!expectedNamespaces.includes(parsed.namespace)) {
    failId(
      value,
      expectedNamespaces.length === 1
        ? `expected namespace "${expectedNamespaces[0] ?? ""}"`
        : `expected one of the namespaces ${expectedNamespaces.map((entry) => `"${entry}"`).join(" · ")}`,
    );
  }

  return brandId<TBrand>(value);
}

export function parseId(value: string): IdParts {
  return validateIdShape(value);
}

// R-27 bootstrap seam: id and satisfies stay cast because same-module local builder calls are
// intentionally not recognized as imported Protocol bindings (plan 19, execution step 2). The
// self-import gives the structural field the same physically trusted builder identity every other
// anchor uses without admitting a cast around component ownership.
const stableIdsAnchor = codeAnchor({
  id: "impl:protocol.stable-ids" as CodeAnchorId,
  label: "stable ID grammar parser",
  satisfies: "spec:model.stable-ids" as SpecId,
  component: createComponentAnchorId("component:protocol.model"),
  role: "codec",
});

void stableIdsAnchor;

export function formatId(parts: IdParts): string {
  return parts.subpath === undefined
    ? `${parts.namespace}:${parts.path}`
    : `${parts.namespace}:${parts.path}#${parts.subpath}`;
}

export function anchorId(value: string): AnchorId {
  validateIdShape(value);
  return brandId<"AnchorId">(value);
}

/**
 * A Spec id never carries `#`: the sub-part is an entry address, which names an entry inside a
 * Spec and is admitted in prose and by `parseId`, never where a Spec id is required.
 */
export function specId(value: string): SpecId {
  if (value.includes("#")) {
    failId(value, "an entry address is not a Spec id");
  }

  return requireNamespace<"SpecId">(value, ["spec"]);
}

export function packId(value: string): PackId {
  return requireNamespace<"PackId">(value, ["pack"]);
}

export function codeAnchorId(value: string): CodeAnchorId {
  return requireNamespace<"AnchorId">(value, CODE_ANCHOR_NAMESPACES) as CodeAnchorId;
}

export function componentAnchorId(value: string): ComponentAnchorId {
  return requireNamespace<"AnchorId">(value, ["component"]) as ComponentAnchorId;
}

export function testAnchorId(value: string): TestAnchorId {
  return requireNamespace<"AnchorId">(value, ["test"]) as TestAnchorId;
}

export function oracleAnchorId(value: string): OracleAnchorId {
  return requireNamespace<"AnchorId">(value, ["oracle"]) as OracleAnchorId;
}

/**
 * `ref()` is a spec-only reference builder wearing a generic name: it is `specId` aliased, so
 * it rejects `pack:` / `doc:` targets — a named deferral (carried evidence, MD-16). Harmless while
 * every call site wants a spec; revisit when `doc:`-target relations (`decidedBy` → an external ADR)
 * or pack-targeting arrive.
 */
export { specId as ref };
