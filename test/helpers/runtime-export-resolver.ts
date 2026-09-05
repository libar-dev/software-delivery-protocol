import ts from "typescript";

export interface ExportResolution {
  readonly candidates: ReadonlySet<ts.Symbol>;
  readonly cyclic: boolean;
}

type RuntimeExportResolver = (source: ts.SourceFile, exportName: string) => ExportResolution;

export function referencedModuleSource(
  checker: ts.TypeChecker,
  moduleSpecifier: ts.Expression,
): ts.SourceFile | undefined {
  const declaration = checker.getSymbolAtLocation(moduleSpecifier)?.valueDeclaration;
  return declaration !== undefined && ts.isSourceFile(declaration) ? declaration : undefined;
}

function isTypeOnlyAlias(symbol: ts.Symbol): boolean {
  return (
    symbol.declarations?.some((declaration) => {
      if (ts.isExportSpecifier(declaration)) {
        return declaration.isTypeOnly || declaration.parent.parent.isTypeOnly;
      }
      if (ts.isImportSpecifier(declaration)) {
        return (
          declaration.isTypeOnly ||
          declaration.parent.parent.phaseModifier === ts.SyntaxKind.TypeKeyword
        );
      }
      return (
        ts.isImportClause(declaration) && declaration.phaseModifier === ts.SyntaxKind.TypeKeyword
      );
    }) ?? false
  );
}

export function createRuntimeExportResolver(checker: ts.TypeChecker): RuntimeExportResolver {
  const cache = new Map<ts.SourceFile, Map<string, ExportResolution>>();
  const active = new Map<ts.SourceFile, Set<string>>();

  function resolveLocalSymbol(symbol: ts.Symbol | undefined): ExportResolution {
    if (symbol === undefined || isTypeOnlyAlias(symbol)) {
      return { candidates: new Set(), cyclic: false };
    }

    const importSpecifier = symbol.declarations?.find(ts.isImportSpecifier);
    if (importSpecifier !== undefined) {
      const importClause = importSpecifier.parent.parent;
      const importDeclaration = ts.isImportClause(importClause) ? importClause.parent : undefined;
      const importedSource =
        importDeclaration !== undefined && ts.isImportDeclaration(importDeclaration)
          ? referencedModuleSource(checker, importDeclaration.moduleSpecifier)
          : undefined;
      return importedSource === undefined
        ? { candidates: new Set(), cyclic: false }
        : visit(importedSource, importSpecifier.propertyName?.text ?? importSpecifier.name.text);
    }

    if (symbol.flags & ts.SymbolFlags.Alias) {
      return resolveLocalSymbol(checker.getImmediateAliasedSymbol(symbol));
    }

    return {
      candidates: symbol.flags & ts.SymbolFlags.Value ? new Set([symbol]) : new Set(),
      cyclic: false,
    };
  }

  function visit(source: ts.SourceFile, exportName: string): ExportResolution {
    const cached = cache.get(source)?.get(exportName);
    if (cached !== undefined) {
      return cached;
    }

    const activeNames = active.get(source) ?? new Set<string>();
    if (activeNames.has(exportName)) {
      return { candidates: new Set(), cyclic: true };
    }
    activeNames.add(exportName);
    active.set(source, activeNames);

    const candidates = new Set<ts.Symbol>();
    const starSources: ts.SourceFile[] = [];
    let cyclic = false;
    let hasExplicitValueExport = false;

    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement)) {
        if (statement.isTypeOnly) {
          continue;
        }
        if (statement.exportClause !== undefined && ts.isNamedExports(statement.exportClause)) {
          for (const specifier of statement.exportClause.elements) {
            if (specifier.isTypeOnly || specifier.name.text !== exportName) {
              continue;
            }
            hasExplicitValueExport = true;
            const referencedSource =
              statement.moduleSpecifier === undefined
                ? undefined
                : referencedModuleSource(checker, statement.moduleSpecifier);
            const resolution =
              referencedSource === undefined
                ? resolveLocalSymbol(checker.getExportSpecifierLocalTargetSymbol(specifier))
                : visit(referencedSource, specifier.propertyName?.text ?? specifier.name.text);
            cyclic ||= resolution.cyclic;
            for (const candidate of resolution.candidates) {
              candidates.add(candidate);
            }
          }
          continue;
        }
        if (statement.exportClause === undefined && statement.moduleSpecifier !== undefined) {
          const referencedSource = referencedModuleSource(checker, statement.moduleSpecifier);
          if (referencedSource !== undefined) {
            starSources.push(referencedSource);
          }
        }
        continue;
      }

      if (
        !ts.canHaveModifiers(statement) ||
        !ts
          .getModifiers(statement)
          ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        continue;
      }
      if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === exportName) {
            hasExplicitValueExport = true;
            const symbol = checker.getSymbolAtLocation(declaration.name);
            if (symbol !== undefined) {
              candidates.add(symbol);
            }
          }
        }
        continue;
      }
      if (
        (ts.isFunctionDeclaration(statement) ||
          ts.isClassDeclaration(statement) ||
          ts.isEnumDeclaration(statement) ||
          ts.isModuleDeclaration(statement)) &&
        statement.name?.text === exportName
      ) {
        hasExplicitValueExport = true;
        const symbol = checker.getSymbolAtLocation(statement.name);
        if (symbol !== undefined) {
          candidates.add(symbol);
        }
      }
    }

    if (!hasExplicitValueExport) {
      for (const starSource of starSources) {
        const resolution = visit(starSource, exportName);
        cyclic ||= resolution.cyclic;
        for (const candidate of resolution.candidates) {
          candidates.add(candidate);
        }
      }
    }

    activeNames.delete(exportName);
    const result = { candidates, cyclic };
    const sourceCache = cache.get(source) ?? new Map<string, ExportResolution>();
    sourceCache.set(exportName, result);
    cache.set(source, sourceCache);
    return result;
  }

  return visit;
}
