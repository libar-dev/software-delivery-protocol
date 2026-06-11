import { createReader, schemaVersion } from "../src/index.js";
import type {
  BlastRadius,
  ConceptMatch,
  FileEntry,
  PackContext,
  Reader,
  SpecContext,
  SpecSummary,
} from "../src/index.js";

const reader: Reader = createReader({ schemaVersion, nodes: [], edges: [] });

// The frozen surface returns plain, composable data — every accessor's shape is the contract
// (the schema is the discovery surface: a typed field is a usable capability).
const summaries: readonly SpecSummary[] = reader.specs();
const matches: readonly ConceptMatch[] = reader.findByConcept("rate limiter");
const fileEntry: FileEntry = reader.byFile("src/orders/create-order.use-case.ts");
const radius: BlastRadius = reader.blastRadius(["src/orders/create-order.use-case.ts"]);
const specContext: SpecContext | undefined = reader.specContext("spec:orders.create-order");
const packContext: PackContext | undefined = reader.packContext("pack:checkout-v1");

// Coverage honesty is part of the type, not an optional extra (`06` §2).
const unknown: readonly string[] = radius.coverageUnknown;

// Stated and derived readiness stay two fields — the divergence is data, never resolved away.
const stated = summaries[0]?.statedReadiness;
const derived = summaries[0]?.derivedReadiness;

void [matches, fileEntry, specContext, packContext, unknown, stated, derived];

// @ts-expect-error bySymbol is aspirational — it rides the exhaustive impact graph and is not
// stubbed: a method that throws would fake the capability its absence honestly hides (`06` §3).
const aspirational: keyof Reader = "bySymbol";

void aspirational;

// @ts-expect-error the reader is read-only composition — the graph is not assignable.
reader.graph = { schemaVersion, nodes: [], edges: [] };
