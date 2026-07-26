import { realpathSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { isExcludedDiscoveryDirectory } from "../extract/discover.js";
import { importFindingIds } from "../import/import.js";
import type { Finding } from "../validate/contracts.js";
import { errorMessage } from "./output.js";

export interface ImportScanResult {
  readonly sourcePaths: readonly string[];
  readonly findings: readonly Finding[];
  readonly operationalFailures: readonly string[];
}

export interface ImportScanHooks {
  readonly realpathSync?: (path: string) => string;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function invalidSourceFinding(path: string): Finding {
  return {
    validatorId: importFindingIds.invalidSourcePath,
    family: "conformance",
    severity: "error",
    message: "the explicitly requested import file must end with .sdp.ts",
    file: path,
  };
}

function noSourcesFinding(path: string): Finding {
  return {
    validatorId: importFindingIds.noSources,
    family: "conformance",
    severity: "warning",
    message: "the requested import path contains no .sdp.ts carrier",
    file: path,
  };
}

function collectDirectorySources(directory: string, collected: string[]): void {
  const entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    compareCodeUnits(left.name, right.name),
  );

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!isExcludedDiscoveryDirectory(entry.name)) {
        collectDirectorySources(join(directory, entry.name), collected);
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".sdp.ts")) {
      collected.push(join(directory, entry.name));
    }
  }
}

export function scanImportPaths(
  paths: readonly string[],
  hooks: ImportScanHooks = {},
): ImportScanResult {
  const canonicalize = hooks.realpathSync ?? realpathSync;
  const sourcePaths: string[] = [];
  const findings: Finding[] = [];
  const operationalFailures: string[] = [];

  for (const path of paths) {
    try {
      const entry = statSync(path);

      if (entry.isFile()) {
        if (path.endsWith(".sdp.ts")) {
          sourcePaths.push(path);
        } else {
          findings.push(invalidSourceFinding(path));
        }
        continue;
      }

      if (!entry.isDirectory()) {
        findings.push(invalidSourceFinding(path));
        continue;
      }

      const before = sourcePaths.length;
      collectDirectorySources(path, sourcePaths);

      if (sourcePaths.length === before) {
        findings.push(noSourcesFinding(path));
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : errorMessage(error);
      operationalFailures.push(`${path} — ${detail}`);
    }
  }

  const canonicalSources = new Map<string, string>();

  for (const sourcePath of sourcePaths) {
    let stats: ReturnType<typeof statSync>;

    try {
      stats = statSync(sourcePath);
    } catch (error) {
      const detail = error instanceof Error ? error.message : errorMessage(error);
      operationalFailures.push(`${sourcePath} — ${detail}`);
      continue;
    }

    let canonical: string;

    try {
      canonical = canonicalize(sourcePath);
    } catch (error) {
      const detail = error instanceof Error ? error.message : errorMessage(error);
      operationalFailures.push(`${sourcePath} — ${detail}`);
      continue;
    }

    const identity =
      stats.ino === 0 ? `path:${canonical}` : `dev:${String(stats.dev)}:ino:${String(stats.ino)}`;

    if (!canonicalSources.has(identity)) {
      canonicalSources.set(identity, canonical);
    }
  }

  return {
    sourcePaths: [...canonicalSources.values()].sort(compareCodeUnits),
    findings,
    operationalFailures,
  };
}
