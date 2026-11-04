import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The directory of the package that runs the engine, found by walking up from this module to the
 * `package.json` that names the package. The walk serves source tests, the bundled entries and the
 * CommonJS main entry alike, whose bundle supplies `__dirname`.
 */
export function packageRoot(): string {
  let directory =
    typeof __dirname === "string" ? __dirname : dirname(fileURLToPath(import.meta.url));
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
