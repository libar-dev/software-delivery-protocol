import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { emitMarkdownSpec, reifyTypeScriptCarrier } from "../src/index.js";
import { assertAuthoredRoundTrip, assertGraphRoundTrip } from "./import-round-trip.helpers.js";

const fixtureRoot = fileURLToPath(new URL("./fixtures/import/round-trip", import.meta.url));

function materializeMarkdownCorpus(): { readonly tsRoot: string; readonly mdRoot: string } {
  const root = mkdtempSync(join(tmpdir(), "sdp-import-round-trip-"));
  const tsRoot = join(root, "typescript");
  const mdRoot = join(root, "markdown");
  cpSync(fixtureRoot, tsRoot, { recursive: true });
  mkdirSync(mdRoot, { recursive: true });

  const specPaths = [
    "behavior.sdp.ts",
    "example.sdp.ts",
    "decision.sdp.ts",
    "constraint.sdp.ts",
    "model.sdp.ts",
    "rule.sdp.ts",
    "workflow.sdp.ts",
    "contract.sdp.ts",
  ] as const;
  for (const relativePath of [...specPaths, "anchors.ts"]) {
    renameSync(join(tsRoot, `${relativePath}.txt`), join(tsRoot, relativePath));
  }

  for (const relativePath of specPaths) {
    const source = readFileSync(join(tsRoot, relativePath), "utf8");
    const markdownPath = join(mdRoot, relativePath.replace(/\.ts$/u, ".md"));
    const reified = reifyTypeScriptCarrier(source, relativePath);
    const spec = reified.specs[0];
    mkdirSync(dirname(markdownPath), { recursive: true });
    expect(reified.findings).toEqual([]);
    expect(spec).toBeDefined();
    if (spec !== undefined) writeFileSync(markdownPath, emitMarkdownSpec(spec), "utf8");
  }

  writeFileSync(
    join(mdRoot, "anchors.ts"),
    readFileSync(join(tsRoot, "anchors.ts"), "utf8"),
    "utf8",
  );

  return { tsRoot, mdRoot };
}

describe("import round-trip harness", () => {
  it("preserves reified authored data through emitted Markdown", () => {
    // Given
    const relativePath = "behavior.sdp.ts";
    const source = readFileSync(join(fixtureRoot, `${relativePath}.txt`), "utf8");

    // When
    const roundTrip = () => {
      assertAuthoredRoundTrip(source, relativePath);
    };

    // Then
    expect(roundTrip).not.toThrow();
  });

  it("preserves the mini-corpus graph under the declared delta catalog", () => {
    // Given
    const corpus = materializeMarkdownCorpus();

    // When
    const roundTrip = () => {
      assertGraphRoundTrip(corpus.tsRoot, corpus.mdRoot);
    };

    // Then
    try {
      expect(roundTrip).not.toThrow();
    } finally {
      rmSync(dirname(corpus.tsRoot), { recursive: true, force: true });
    }
  });

  it("rejects a corrupted Markdown twin", () => {
    // Given
    const corpus = materializeMarkdownCorpus();
    const corrupted = join(corpus.mdRoot, "behavior.sdp.md");
    writeFileSync(
      corrupted,
      readFileSync(corrupted, "utf8").replace(
        "An order is accepted only when its total is positive.",
        "An order is accepted even when its total is negative.",
      ),
      "utf8",
    );

    // When
    const roundTrip = () => {
      assertGraphRoundTrip(corpus.tsRoot, corpus.mdRoot);
    };

    // Then
    try {
      expect(roundTrip).toThrow();
    } finally {
      rmSync(dirname(corpus.tsRoot), { recursive: true, force: true });
    }
  });
});
