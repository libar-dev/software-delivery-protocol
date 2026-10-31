import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import ts from "typescript";
import type { GraphSchema } from "../../src/graph/schema.js";
import { extract } from "../../src/extract/index.js";
import type { Finding } from "../../src/validate/contracts.js";
import { validateGraph } from "../../src/validate/validators.js";

export type Probe = { graph: GraphSchema } | { carriers: Readonly<Record<string, string>> };
export interface ProbeEntry {
  id: string;
  refusing: Probe;
  accepting: Probe;
}
export interface SourceScan {
  ids: string[];
  unresolved: string[];
}
export interface AuditAnswer {
  unpaired: string[];
  duplicatePairs: string[];
  strayPairs: string[];
  unregistered: string[];
  unresolved: string[];
  silent: string[];
  overeager: string[];
}

export function runValidatorProbe(probe: Probe): readonly Finding[] {
  if ("graph" in probe) return validateGraph(probe.graph).findings;
  const root = mkdtempSync(join(tmpdir(), "sdp-validator-audit-"));
  try {
    for (const [file, text] of Object.entries(probe.carriers)) {
      const path = join(root, file);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, text);
    }
    return extract({ root }).report.findings;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export function scanFindingIds(srcRoot: string): SourceScan {
  const ids = new Set<string>();
  const unresolved = new Set<string>();
  const whole = /^(conformance|honesty|extract)\/[a-z][a-z-]*$/u;
  const prefix = /^(conformance|honesty|extract)\/[a-z-]*$/u;
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(file);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".ts")) continue;
      const source = readFileSync(file, "utf8");
      const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest);
      const visit = (node: ts.Node): void => {
        if (ts.isStringLiteralLike(node) || ts.isTemplateHead(node)) {
          // The parser delimits tokens so a regex body or a template tail cannot masquerade as a quoted literal.
          const scanner = ts.createScanner(
            ts.ScriptTarget.Latest,
            true,
            ts.LanguageVariant.Standard,
            node.getText(parsed),
          );
          const token = scanner.scan();
          const value = scanner.getTokenValue();
          if (token !== ts.SyntaxKind.TemplateHead && whole.test(value)) ids.add(value);
          else if (prefix.test(value)) {
            const line = parsed.getLineAndCharacterOfPosition(node.getStart(parsed)).line + 1;
            unresolved.add(`${relative(srcRoot, file).replaceAll("\\", "/")}:${String(line)}`);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(parsed);
    }
  };
  walk(srcRoot);
  return { ids: [...ids].sort(), unresolved: [...unresolved].sort() };
}

/**
 * @sdpAnchor impl:protocol.validator-self-testing
 * @sdpLabel audits the finding registries against source literals and paired probes
 * @sdpSatisfies spec:validation.validator-self-testing
 * @sdpRole validator
 */
export function auditValidatorEvidence(
  table: readonly ProbeEntry[],
  run: (probe: Probe) => readonly Finding[],
  registered: readonly string[],
  source: SourceScan,
): AuditAnswer {
  const known = new Set(registered);
  const counts = new Map<string, number>();
  const seenIds = new Set(source.ids);
  const silent = new Set<string>();
  const overeager = new Set<string>();
  for (const entry of table) {
    counts.set(entry.id, (counts.get(entry.id) ?? 0) + 1);
    const refusing = run(entry.refusing);
    const accepting = run(entry.accepting);
    for (const finding of [...refusing, ...accepting]) seenIds.add(finding.validatorId);
    if (!refusing.some((finding) => finding.validatorId === entry.id)) silent.add(entry.id);
    if (accepting.some((finding) => finding.validatorId === entry.id)) overeager.add(entry.id);
  }
  return {
    unpaired: [...known].filter((id) => !counts.has(id)).sort(),
    duplicatePairs: [...counts]
      .filter(([, count]) => count > 1)
      .map(([id]) => id)
      .sort(),
    strayPairs: [...counts.keys()].filter((id) => !known.has(id)).sort(),
    unregistered: [...seenIds].filter((id) => !known.has(id)).sort(),
    unresolved: [...new Set(source.unresolved)].sort(),
    silent: [...silent].sort(),
    overeager: [...overeager].sort(),
  };
}
