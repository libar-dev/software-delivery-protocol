import { existsSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { SourceFile } from "ts-morph";

/** The one public package specifier whose imports bind Protocol authoring builders. */
export const PROTOCOL_MODULE_SPECIFIER = "@libar-dev/software-delivery-protocol";

export interface ProtocolBindings {
  /** Local name → exported builder name, from named imports. */
  readonly named: ReadonlyMap<string, string>;
  /** Locals bound by namespace or default imports. */
  readonly namespaceLocals: ReadonlySet<string>;
}

export interface ProtocolBindingScope {
  readonly importerPath?: string;
  readonly trustedRelativeBuilderModules: ReadonlySet<string>;
}

const packageOnlyScope: ProtocolBindingScope = {
  trustedRelativeBuilderModules: new Set<string>(),
};

function nearestPackageRoot(modulePath: string): string | undefined {
  let current = dirname(modulePath);

  for (;;) {
    if (existsSync(join(current, "package.json"))) {
      return current;
    }

    const parent = dirname(current);

    if (parent === current) {
      return undefined;
    }

    current = parent;
  }
}

function canonicalPath(path: string): string | undefined {
  try {
    return realpathSync(path);
  } catch {
    return undefined;
  }
}

function trustedBuilderModules(): ReadonlySet<string> {
  const moduleUrl = import.meta.url;

  // tsup's CommonJS barrel has no import.meta URL. Relative bindings are a source/ESM
  // self-hosting affordance, so that surface fails closed while package imports stay trusted.
  if (typeof moduleUrl !== "string") {
    return new Set<string>();
  }

  const packageRoot = nearestPackageRoot(fileURLToPath(moduleUrl));

  if (packageRoot === undefined) {
    return new Set<string>();
  }

  // The tsup bundle ships no per-module dist files, so only the source-checkout modules
  // can ever canonicalize here; relative trust is a source/ESM self-hosting affordance.
  const candidates = [
    join(packageRoot, "src", "ids.ts"),
    join(packageRoot, "src", "model", "code-anchor.ts"),
  ];

  return new Set(candidates.flatMap((candidate) => canonicalPath(candidate) ?? []));
}

const runtimeBuilderModules = trustedBuilderModules();

export function protocolBindingScopeFor(importerPath: string): ProtocolBindingScope {
  return {
    importerPath,
    trustedRelativeBuilderModules: runtimeBuilderModules,
  };
}

function relativeImportCandidates(importerPath: string, specifier: string): readonly string[] {
  const resolved = resolve(dirname(importerPath), specifier);

  return specifier.endsWith(".js")
    ? [resolved, `${resolved.slice(0, -3)}.ts`, `${resolved.slice(0, -3)}.tsx`]
    : [resolved];
}

export function isProtocolBuilderModuleSpecifier(
  specifier: string,
  scope: ProtocolBindingScope = packageOnlyScope,
): boolean {
  if (specifier === PROTOCOL_MODULE_SPECIFIER) {
    return true;
  }

  if (
    scope.importerPath === undefined ||
    (!specifier.startsWith("./") && !specifier.startsWith("../"))
  ) {
    return false;
  }

  return relativeImportCandidates(scope.importerPath, specifier).some((candidate) => {
    const canonical = canonicalPath(candidate);
    return canonical !== undefined && scope.trustedRelativeBuilderModules.has(canonical);
  });
}

export function hasProtocolBuilderImport(
  sourceText: string,
  scope: ProtocolBindingScope = packageOnlyScope,
): boolean {
  if (sourceText.includes(PROTOCOL_MODULE_SPECIFIER)) {
    return true;
  }

  return (
    scope.importerPath !== undefined &&
    scope.trustedRelativeBuilderModules.size > 0 &&
    /\bfrom\s+["']\.\.?\//u.test(sourceText)
  );
}

export function collectProtocolBindings(
  sourceFile: SourceFile,
  scope: ProtocolBindingScope = packageOnlyScope,
): ProtocolBindings {
  const named = new Map<string, string>();
  const namespaceLocals = new Set<string>();

  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    if (!isProtocolBuilderModuleSpecifier(importDeclaration.getModuleSpecifierValue(), scope)) {
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
