import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = process.argv[2] ?? dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(join(rootDir, path), "utf8");
const failures = [];
const expectContains = (path, needle, reason) => {
  if (!read(path).includes(needle)) {
    failures.push(`${path} — ${reason}`);
  }
};

expectContains("src/model/spec.ts", "readonly narrative?: string;", "missing Spec narrative");
for (const section of [
  "export interface IntentSection {\n  readonly description?: string;",
  "export interface BehaviorSection {\n  readonly description?: string;",
  "export interface ModelSection {\n  readonly description?: string;",
  "export type DesignSection = SpecSectionContent & { readonly description?: string }",
  "export interface DecisionSection {\n  readonly description?: string;",
  "export interface VerificationSection {\n  readonly description?: string;",
  "export type UiSection = SpecSectionContent & { readonly description?: string }",
]) {
  expectContains("src/model/sections.ts", section, "missing section description owner");
}
expectContains("src/graph/schema.ts", 'schemaVersion = "0.10.0"', "missing 0.10.0 schema literal");
expectContains("src/graph/schema.ts", "readonly narrative?: string;", "missing graph narrative");
expectContains("src/reader/reader.ts", "readonly narrative?: string;", "missing Reader narrative");
expectContains(
  "src/reader/reader.ts",
  'matchedIn.push("narrative")',
  "narrative is not searchable",
);
expectContains(
  "specs/carrier/prose-ownership-rule.sdp.md",
  "owned directly by the Spec; it is Spec content, never an envelope field",
  "missing narrative model contract",
);
// The schema-version literal is pinned on its declaring surface above (`src/graph/schema.ts`);
// the carrying Spec states the law that a graph declares its version, without a version literal.
// Its bound example point does carry the literal as a slot value — pinned here too, so a
// version bump names both authored surfaces instead of failing only at the bound point.
expectContains(
  "specs/extraction/schema-versioning.sdp.md",
  "Every derived graph carries `schemaVersion`",
  "missing schema-version declaration law",
);
expectContains(
  "specs/extraction/schema-versioning.declared-version.sdp.md",
  '{schemaVersion: "0.10.0"}',
  "missing declared-version example literal",
);
expectContains(
  "specs/carrier/prose-ownership-rule.sdp.md",
  "Constraints has no description owner",
  "missing constraint omission contract",
);

if (failures.length > 0) {
  console.error("check-prose-schema — disagreeing surfaces:\n");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("check-prose-schema — model, graph, reader and carrying Specs agree.");
