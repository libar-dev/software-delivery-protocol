import { resolve } from "node:path";

import ts from "typescript";

import { createRuntimeExportResolver, referencedModuleSource } from "./runtime-export-resolver.js";

export type StructuralCoverageResult =
  | "ok"
  | "exported unit missing"
  | "covering source does not type-consume unit"
  | "covering source does not value-consume unit";

function auditTypeCoverage(
  checker: ts.TypeChecker,
  source: ts.SourceFile,
  name: string,
  coveringSource: ts.SourceFile | undefined,
): StructuralCoverageResult {
  const module = checker.getSymbolAtLocation(source);
  const exported =
    module && checker.getExportsOfModule(module).find((entry) => entry.name === name);
  const resolve = (symbol: ts.Symbol): ts.Symbol =>
    symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const target = exported && resolve(exported);
  if (target === undefined || !(target.flags & ts.SymbolFlags.Type)) return "exported unit missing";
  if (coveringSource === undefined) return "covering source does not type-consume unit";

  const imported = new Set<ts.Symbol>();
  for (const statement of coveringSource.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings === undefined || !ts.isNamedImports(bindings)) continue;
    for (const entry of bindings.elements) {
      const symbol = checker.getSymbolAtLocation(entry.name);
      if (symbol !== undefined && resolve(symbol) === target) imported.add(symbol);
    }
  }
  const consumed = new Set<ts.Symbol>();
  const visit = (node: ts.Node): void => {
    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
      const symbol = checker.getSymbolAtLocation(node.typeName);
      if (symbol !== undefined && imported.has(symbol)) consumed.add(symbol);
    }
    ts.forEachChild(node, visit);
  };
  visit(coveringSource);
  return consumed.size > 0 ? "ok" : "covering source does not type-consume unit";
}

function valueImportedLocals(
  checker: ts.TypeChecker,
  source: ts.SourceFile,
  isRuntimeUnitImport: (source: ts.SourceFile, exportName: string) => boolean,
): ReadonlySet<ts.Symbol> {
  const locals = new Set<ts.Symbol>();

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    const clause = statement.importClause;
    const bindings = clause?.namedBindings;
    const importedSource = referencedModuleSource(checker, statement.moduleSpecifier);
    if (
      clause?.phaseModifier === ts.SyntaxKind.TypeKeyword ||
      bindings === undefined ||
      !ts.isNamedImports(bindings) ||
      importedSource === undefined
    ) {
      continue;
    }

    for (const specifier of bindings.elements) {
      const importedName = specifier.propertyName?.text ?? specifier.name.text;
      const local = checker.getSymbolAtLocation(specifier.name);
      if (
        !specifier.isTypeOnly &&
        local !== undefined &&
        isRuntimeUnitImport(importedSource, importedName)
      ) {
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
  consumption: "value" | "type" = "value",
): StructuralCoverageResult {
  const separator = unit.indexOf("#");
  if (separator <= 0 || separator !== unit.lastIndexOf("#") || separator === unit.length - 1) {
    return "exported unit missing";
  }

  const source = program.getSourceFile(
    resolve(program.getCurrentDirectory(), unit.slice(0, separator)),
  );
  if (source === undefined) {
    return "exported unit missing";
  }

  const checker = program.getTypeChecker();
  const coveringSource = program.getSourceFile(
    resolve(program.getCurrentDirectory(), coveringSourcePath),
  );
  if (consumption === "type") {
    return auditTypeCoverage(checker, source, unit.slice(separator + 1), coveringSource);
  }
  const resolveRuntimeExport = createRuntimeExportResolver(checker);
  const resolution = resolveRuntimeExport(source, unit.slice(separator + 1));
  if (resolution.cyclic || resolution.candidates.size !== 1) {
    return "exported unit missing";
  }

  const target = resolution.candidates.values().next().value;
  const declaration = target?.valueDeclaration ?? target?.declarations?.[0];
  if (
    target === undefined ||
    declaration === undefined ||
    checker.getTypeOfSymbolAtLocation(target, declaration).getCallSignatures().length === 0
  ) {
    return "exported unit missing";
  }

  if (coveringSource === undefined) {
    return "covering source does not value-consume unit";
  }

  const importedLocals = valueImportedLocals(checker, coveringSource, (importedSource, name) => {
    const imported = resolveRuntimeExport(importedSource, name);
    return !imported.cyclic && imported.candidates.size === 1 && imported.candidates.has(target);
  });
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
