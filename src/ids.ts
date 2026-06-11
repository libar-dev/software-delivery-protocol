type Brand<TBrand extends string> = string & {
  readonly __brand: TBrand;
};

const LOWERCASE_NAMESPACE_PATTERN = /^[a-z][a-z0-9-]*$/u;
const PATH_SEGMENT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-]*$/u;

export type SpecId = Brand<"SpecId">;
export type PackId = Brand<"PackId">;
export type AnchorId = Brand<"AnchorId">;
// The flavor layers a second key over the `AnchorId` brand rather than intersecting a second
// `Brand<…>`: two disjoint unit types on one `__brand` key reduce the intersection to `never`,
// and `never` assigns everywhere — tsc would stop enforcing the flavored ids entirely.
export type CodeAnchorId = AnchorId & { readonly __anchorFlavor: "code" };
export type TestAnchorId = AnchorId & { readonly __anchorFlavor: "test" };

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

function validateSubpath(value: string, subpath: string): void {
  if (!PATH_SEGMENT_PATTERN.test(subpath)) {
    failId(value, "malformed # suffix");
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

  if (hashIndex !== -1) {
    if (subpath === undefined || subpath.length === 0 || subpath.includes("#")) {
      failId(value, "malformed # suffix");
    }

    validateSubpath(value, subpath);
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

export function formatId(parts: IdParts): string {
  return parts.subpath === undefined
    ? `${parts.namespace}:${parts.path}`
    : `${parts.namespace}:${parts.path}#${parts.subpath}`;
}

export function anchorId(value: string): AnchorId {
  validateIdShape(value);
  return brandId<"AnchorId">(value);
}

export function specId(value: string): SpecId {
  return requireNamespace<"SpecId">(value, ["spec"]);
}

export function packId(value: string): PackId {
  return requireNamespace<"PackId">(value, ["pack"]);
}

export function codeAnchorId(value: string): CodeAnchorId {
  return requireNamespace<"AnchorId">(value, CODE_ANCHOR_NAMESPACES) as CodeAnchorId;
}

export function testAnchorId(value: string): TestAnchorId {
  return requireNamespace<"AnchorId">(value, ["test"]) as TestAnchorId;
}

/**
 * `ref()` is a spec-only reference builder wearing a generic name: it is `specId` aliased, so
 * it rejects `pack:` / `doc:` targets — a named deferral (carried evidence, MD-16). Harmless while
 * every call site wants a spec; revisit when `doc:`-target relations (`decidedBy` → an external ADR)
 * or pack-targeting arrive.
 */
export { specId as ref };
