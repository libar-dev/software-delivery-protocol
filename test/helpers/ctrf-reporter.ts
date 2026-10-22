import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import type { Reporter } from "vitest/reporters";

type Modules = Parameters<NonNullable<Reporter["onTestRunEnd"]>>[0];
const require = createRequire(import.meta.url);
const vitestVersion = (require("vitest/package.json") as { version: string }).version;

/** CI opts in so local test runs write no external evidence by default. */
export default class CtrfReporter implements Reporter {
  private start = Date.now();
  constructor(private readonly directory: string) {}
  onTestRunStart(): void {
    this.start = Date.now();
  }
  onTestRunEnd(modules: Modules): void {
    const tests = modules.flatMap((module) =>
      [...module.children.allTests()].map((test) => {
        const suite: string[] = [];
        let parent = test.parent;
        while (parent.type === "suite") {
          suite.unshift(parent.name);
          parent = parent.parent;
        }
        return {
          name: test.name,
          status: test.result().state,
          duration: test.diagnostic()?.duration ?? 0,
          filePath: module.moduleId,
          suite,
        };
      }),
    );
    const summary = {
      tests: tests.length,
      passed: 0,
      failed: 0,
      skipped: 0,
      pending: 0,
      other: 0,
      start: this.start,
      stop: Date.now(),
    };
    for (const test of tests) summary[test.status]++;
    const report = {
      reportFormat: "CTRF",
      specVersion: "0.0.0",
      results: {
        tool: { name: "vitest", version: vitestVersion },
        summary,
        environment: {
          commit: process.env.SDP_CORPUS_COMMIT ?? process.env.GITHUB_SHA,
          branchName: process.env.GITHUB_HEAD_REF ?? process.env.GITHUB_REF_NAME,
          buildName: process.env.GITHUB_WORKFLOW,
          buildNumber: process.env.GITHUB_RUN_NUMBER,
        },
        tests,
      },
    };
    mkdirSync(this.directory, { recursive: true });
    writeFileSync(
      join(this.directory, `ctrf-${String(process.pid)}.json`),
      `${JSON.stringify(report)}\n`,
    );
  }
}
