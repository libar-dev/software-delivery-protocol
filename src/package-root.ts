import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The directory of the package that runs the engine, found by walking up from this module to the
 * `package.json` that names the package. The walk starts at this module's own directory: its URL
 * in source tests and the ESM entries, and `__dirname` in the CommonJS main entry, whose bundle has
 * no module URL. A global `__dirname`, which a CommonJS `node -e` script defines, never stands in
 * for it.
 */
export function packageRoot(): string {
  const moduleUrl = import.meta.url;
  let directory = typeof moduleUrl === "string" ? dirname(fileURLToPath(moduleUrl)) : __dirname;
  for (;;) {
    try {
      const metadata = JSON.parse(readFileSync(join(directory, "package.json"), "utf8")) as {
        name?: unknown;
      };
      if (metadata.name === "@libar-dev/software-delivery-protocol") return directory;
    } catch {
      // A nested module directory need not hold package metadata.
    }
    const parent = dirname(directory);
    if (parent === directory) throw new Error("cannot locate the running package");
    directory = parent;
  }
}
