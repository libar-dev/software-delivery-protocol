import { readFileSync, readdirSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep, win32 } from "node:path";

import { Node, Project, SyntaxKind } from "ts-morph";
import type { SourceFile } from "ts-morph";

/**
 * @sdpAnchor impl:protocol.typescript-imports
 * @sdpLabel TypeScript file imports and barrel reach for external curation input
 * @sdpSatisfies spec:consumers.impact-graph.curation-assist
 * @sdpComponent component:protocol.adapters
 * @sdpRole adapter
 */
export interface ImportsFile {
  readonly schema: "sdp-imports/1";
  readonly adapter: "typescript";
  readonly exclude: readonly string[];
  readonly files: readonly { readonly file: string; readonly imports: readonly string[] }[];
}

interface TypeScriptImportsConfig {
  readonly adapter: "typescript";
  readonly tsconfig: string;
  readonly roots: readonly string[];
  readonly exclude?: readonly string[];
}

function configuredPath(root: string, path: string): string {
  const absolute = resolve(root, path);
  const nested = relative(root, absolute);
  if (
    path.trim() === "" ||
    isAbsolute(path) ||
    win32.isAbsolute(path) ||
    nested === ".." ||
    nested.startsWith(`..${sep}`) ||
    isAbsolute(nested)
  ) {
    throw new Error(`imports configuration requires a root-relative path, got "${path}"`);
  }
  return absolute;
}

function readConfig(root: string, path: string): TypeScriptImportsConfig {
  const value: unknown = JSON.parse(readFileSync(resolve(root, path), "utf8"));
  if (
    typeof value !== "object" ||
    value === null ||
    !("adapter" in value) ||
    value.adapter !== "typescript" ||
    !("tsconfig" in value) ||
    typeof value.tsconfig !== "string" ||
    !("roots" in value) ||
    !Array.isArray(value.roots) ||
    value.roots.length === 0 ||
    value.roots.some((entry: unknown) => typeof entry !== "string") ||
    Object.keys(value).some((key) => !["adapter", "tsconfig", "roots", "exclude"].includes(key)) ||
    ("exclude" in value &&
      (!Array.isArray(value.exclude) ||
        value.exclude.some((entry: unknown) => typeof entry !== "string")))
  ) {
    throw new Error(
      "imports configuration accepts only adapter: typescript, tsconfig, non-empty roots, and optional exclude paths",
    );
  }
  return value as TypeScriptImportsConfig;
}

function normalizedExcludes(root: string, paths: readonly string[] | undefined): string[] {
  return [
    ...new Set(
      (paths ?? []).map((path) => {
        const absolute = configuredPath(root, path);
        const normalized = relative(root, absolute).split(sep).join("/");
        if (normalized === "" || path.includes("\\") || /^[A-Za-z]:/u.test(path)) {
          throw new Error(
            `imports configuration requires a root-relative exclusion path, got "${path}"`,
          );
        }
        return normalized;
      }),
    ),
  ].sort();
}

function sourcePaths(directory: string): string[] {
  const paths: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) paths.push(...sourcePaths(path));
    else if (entry.isFile() && /\.(?:[cm]?ts|tsx)$/u.test(entry.name)) paths.push(path);
  }
  return paths;
}

/** The checker resolves a module specifier literal to the file it names, when it can. */
function moduleTarget(specifier: Node | undefined): SourceFile | undefined {
  return specifier?.getSymbol()?.getDeclarations().find(Node.isSourceFile);
}

/** `import("./b.js")` and `import("./b.js").B` with a literal specifier; a computed one is skipped. */
function importExpressions(file: SourceFile): SourceFile[] {
  const literal = (node: Node | undefined) =>
    node !== undefined && (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
      ? node
      : undefined;
  const specifiers = [
    ...file
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((call) => call.getExpression().getKind() === SyntaxKind.ImportKeyword)
      .map((call) => literal(call.getArguments()[0])),
    ...file.getDescendantsOfKind(SyntaxKind.ImportType).map((type) => {
      const argument = type.getArgument();
      return Node.isLiteralTypeNode(argument) ? literal(argument.getLiteral()) : undefined;
    }),
  ];
  return specifiers.flatMap((specifier) => {
    const target = moduleTarget(specifier);
    return target === undefined ? [] : [target];
  });
}

function reexports(file: SourceFile): SourceFile[] {
  return file.getExportDeclarations().flatMap((entry) => {
    const target = entry.getModuleSpecifierSourceFile();
    return target === undefined ? [] : [target];
  });
}

interface PathApi {
  relative(from: string, to: string): string;
}

/** A path relative to the root in POSIX form, whichever separator the path arrives with. */
export function rootRelativePath(
  root: string,
  file: string,
  paths: PathApi = { relative },
): string {
  return paths.relative(root, file).split(/[\\/]/u).join("/");
}

/** The files the imports file lists: every loaded file outside the excluded paths. */
export function includedSourcePaths(
  root: string,
  files: readonly string[],
  exclude: readonly string[],
  paths: PathApi = { relative },
): Set<string> {
  return new Set(
    files.filter((file) => {
      const path = rootRelativePath(root, file, paths);
      return !exclude.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
    }),
  );
}

/** Runs only from build or an explicit adapter caller, never from extraction or the reader. */
export function deriveTypeScriptImports(root: string, configPath: string): ImportsFile {
  const config = readConfig(root, configPath);
  const exclude = normalizedExcludes(root, config.exclude);
  const directories = config.roots.map((path) => configuredPath(root, path));
  for (const directory of directories) {
    if (statSync(directory, { throwIfNoEntry: false })?.isDirectory() !== true) {
      throw new Error(`imports source root "${directory}" is not a directory`);
    }
  }
  const project = new Project({
    tsConfigFilePath: configuredPath(root, config.tsconfig),
    skipAddingFilesFromTsConfig: true,
  });
  const paths = [...new Set(directories.flatMap(sourcePaths))].sort();
  const sources = project.addSourceFilesAtPaths(paths);
  const rootRelative = (path: string) => rootRelativePath(root, path);
  // Load excluded files too: their re-exports can still reach included endpoints. Compare the
  // compiler's own paths, which use forward slashes on Windows, never the native list above.
  const included = includedSourcePaths(
    root,
    sources.map((source) => source.getFilePath()),
    exclude,
  );

  return {
    schema: "sdp-imports/1",
    adapter: "typescript",
    exclude,
    files: sources
      .filter((source) => included.has(source.getFilePath()))
      .map((source) => {
        const direct = source.getImportDeclarations().flatMap((entry) => {
          const target = entry.getModuleSpecifierSourceFile();
          return target === undefined ? [] : [target];
        });
        for (const entry of source.getStatements().filter(Node.isImportEqualsDeclaration)) {
          const reference = entry.getModuleReference();
          if (Node.isExternalModuleReference(reference)) {
            const target = moduleTarget(reference.getExpression());
            if (target !== undefined) direct.push(target);
          }
        }
        direct.push(...importExpressions(source));
        const reached = new Set<string>();
        const pending = [...direct, ...reexports(source)];
        while (pending.length > 0) {
          const target = pending.pop();
          if (target === undefined || reached.has(target.getFilePath())) continue;
          reached.add(target.getFilePath());
          pending.push(...reexports(target));
        }
        return {
          file: rootRelative(source.getFilePath()),
          imports: [...reached]
            .filter((path) => included.has(path))
            .map(rootRelative)
            .sort(),
        };
      })
      .sort((left, right) => (left.file < right.file ? -1 : left.file > right.file ? 1 : 0)),
  };
}
