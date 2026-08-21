import { resolve } from "node:path";

import ts from "typescript";

export type StructuralCoverageResult =
  | "ok"
  | "exported unit missing"
  | "covering source does not value-consume unit";

function resolvedSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function runtimeFunctionExport(
  program: ts.Program,
  sourcePath: string,
  exportName: string,
): ts.Symbol | undefined {
  const source = program.getSourceFile(resolve(program.getCurrentDirectory(), sourcePath));
  if (source === undefined) {
    return undefined;
  }

  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(source);
  const exported = moduleSymbol
    ? checker.getExportsOfModule(moduleSymbol).find((symbol) => symbol.name === exportName)
    : undefined;
  if (exported === undefined) {
    return undefined;
  }

  const target = resolvedSymbol(checker, exported);
  const declaration = target.valueDeclaration ?? target.declarations?.[0];
  if (declaration === undefined || !(target.flags & ts.SymbolFlags.Value)) {
    return undefined;
  }

  return checker.getTypeOfSymbolAtLocation(target, declaration).getCallSignatures().length > 0
    ? target
    : undefined;
}

function valueImportedLocals(
  checker: ts.TypeChecker,
  source: ts.SourceFile,
  target: ts.Symbol,
): ReadonlySet<ts.Symbol> {
  const locals = new Set<ts.Symbol>();

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    const clause = statement.importClause;
    const bindings = clause?.namedBindings;
    if (
      clause?.phaseModifier === ts.SyntaxKind.TypeKeyword ||
      bindings === undefined ||
      !ts.isNamedImports(bindings)
    ) {
      continue;
    }

    for (const specifier of bindings.elements) {
      if (specifier.isTypeOnly) {
        continue;
      }

      const local = checker.getSymbolAtLocation(specifier.name);
      if (local !== undefined && resolvedSymbol(checker, local) === target) {
        locals.add(local);
      }
    }
  }

  return locals;
}

export function auditStructuralCoverage(
  program: ts.Program,
  unit: string,
  coveringSourcePath: string,
): StructuralCoverageResult {
  const separator = unit.indexOf("#");
  if (separator <= 0 || separator !== unit.lastIndexOf("#") || separator === unit.length - 1) {
    return "exported unit missing";
  }

  const target = runtimeFunctionExport(
    program,
    unit.slice(0, separator),
    unit.slice(separator + 1),
  );
  if (target === undefined) {
    return "exported unit missing";
  }

  const coveringSource = program.getSourceFile(
    resolve(program.getCurrentDirectory(), coveringSourcePath),
  );
  if (coveringSource === undefined) {
    return "covering source does not value-consume unit";
  }

  const checker = program.getTypeChecker();
  const importedLocals = valueImportedLocals(checker, coveringSource, target);
  const calledLocals = new Set<ts.Symbol>();

  const visit = (node: ts.Node): void => {
    if (
      ts.isIdentifier(node) &&
      ts.isCallExpression(node.parent) &&
      node.parent.expression === node
    ) {
      const local = checker.getSymbolAtLocation(node);
      if (local !== undefined && importedLocals.has(local)) {
        calledLocals.add(local);
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(coveringSource);
  return calledLocals.size > 0 ? "ok" : "covering source does not value-consume unit";
}
