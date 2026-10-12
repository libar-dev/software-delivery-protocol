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
  readonly files: readonly { readonly file: string; readonly imports: readonly string[] }[];
}

interface TypeScriptImportsConfig {
  readonly adapter: "typescript";
  readonly tsconfig: string;
  readonly roots: readonly string[];
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
    value.roots.some((entry: unknown) => typeof entry !== "string")
  ) {
    throw new Error(
      "imports configuration requires adapter: typescript, tsconfig, and non-empty roots",
    );
  }
  return value as TypeScriptImportsConfig;
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

/** Runs only from build or an explicit adapter caller, never from extraction or the reader. */
export function deriveTypeScriptImports(root: string, configPath: string): ImportsFile {
  const config = readConfig(root, configPath);
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
  const included = new Set(paths);
  const rootRelative = (path: string) => relative(root, path).split(sep).join("/");

  return {
    schema: "sdp-imports/1",
    adapter: "typescript",
    files: sources
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
