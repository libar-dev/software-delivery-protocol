import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import * as protocol from "@libar-dev/software-delivery-protocol";

describe("bootstrap package surface", () => {
  it("resolves the package name through the Vitest alias", () => {
    expect(protocol).toBeDefined();
    expect(typeof protocol).toBe("object");
  });

  it("keeps the expected package.json bootstrap shape", async () => {
    const packageJsonPath = fileURLToPath(new URL("../package.json", import.meta.url));
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      type: string;
      bin: { sdp: string };
      exports: Record<string, { types: string; import: string }>;
    };
    const rootExport = packageJson.exports["."];

    if (rootExport === undefined) {
      throw new Error("Missing root export in package.json");
    }

    expect(packageJson.type).toBe("module");
    expect(packageJson.bin.sdp).toBe("./dist/cli/sdp.js");
    expect(rootExport.types).toBe("./dist/index.d.ts");
    expect(rootExport.import).toBe("./dist/index.js");
  });
});
