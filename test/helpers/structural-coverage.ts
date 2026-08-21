import { resolve } from "node:path";

import ts from "typescript";

import { createRuntimeExportResolver, referencedModuleSource } from "./runtime-export-resolver.js";

export type StructuralCoverageResult =
  | "ok"
  | "exported unit missing"
  | "covering source does not value-consume unit";

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

  const coveringSource = program.getSourceFile(
    resolve(program.getCurrentDirectory(), coveringSourcePath),
  );
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
