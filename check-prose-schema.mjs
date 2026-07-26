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
expectContains("src/graph/schema.ts", 'schemaVersion = "0.4.0"', "missing 0.4.0 schema literal");
expectContains("src/graph/schema.ts", "readonly narrative?: string;", "missing graph narrative");
expectContains("src/reader/reader.ts", "readonly narrative?: string;", "missing Reader narrative");
expectContains(
  "src/reader/reader.ts",
  'matchedIn.push("narrative")',
  "narrative is not searchable",
);
expectContains(
  "docs/concept/02-core-model.md",
  "`narrative` is content owned directly",
  "missing narrative model contract",
);
// The schema-version literal is pinned on its declaring surface above (`src/graph/schema.ts`);
// the carrying Spec states the law that a graph declares its version, without a version literal.
expectContains(
  "specs/extraction/schema-versioning.sdp.md",
  "Every graph declares its schemaVersion",
  "missing schema-version declaration law",
);
expectContains(
  "specs/carrier/prose-ownership-rule.sdp.md",
  "the array-shaped constraints section has no description owner",
  "missing constraint omission contract",
);
expectContains(
  "docs/concept/06-consumers-and-projections.md",
  "Owned prose is already available through the graph and Reader",
  "missing graph/Reader prose claim",
);
expectContains(
  "docs/concept/06-consumers-and-projections.md",
  "Design Review now renders `Spec.narrative` and the seven approved section descriptions from those Reader/graph values (schema `0.4.0`), with no source reparse and stable omission when prose is absent.",
  "missing landed prose projection claim",
);

if (failures.length > 0) {
  console.error("check-prose-schema — disagreeing surfaces:\n");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("check-prose-schema — model, graph, Reader, and concept surfaces agree.");
