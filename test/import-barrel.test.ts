import { describe, expect, it } from "vitest";

import { emitMarkdownSpec, importFindingIds, importTypeScriptSpec } from "../src/index.js";
import type { ImportResult } from "../src/index.js";

describe("import barrel", () => {
  it("exports the pure emit and import surface", () => {
    const result: ImportResult = { findings: [] };

    expect(emitMarkdownSpec).toBeTypeOf("function");
    expect(importTypeScriptSpec).toBeTypeOf("function");
    expect(importFindingIds).toEqual({
      refusal: "import/refusal",
      packUnsupported: "import/pack-unsupported",
      targetExists: "import/target-exists",
      unsupportedConstruct: "import/unsupported-construct",
      invalidSourcePath: "import/invalid-source-path",
      noSources: "import/no-sources",
      empty: "import/empty",
    });
    expect(result.findings).toEqual([]);
  });
});
